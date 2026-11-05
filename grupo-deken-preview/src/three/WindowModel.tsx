import { useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { PartLabel as Label } from './labels'
import { computeLayout, type OpenMode, type SashSpec, type WindowConfig, type Rect } from './windowSpec'
import { boxGeometry, expand, inset, rectCx, rectCy, rectH, rectW, ringGeometry, type RingGeometry } from './geometry'
import {
  finishMaterials, gasketMaterial, glassEdgeMaterial, glassMaterial, handleMaterial, hingeMaterial, spacerMaterial,
} from './materials'

/** Estado de movimiento que se escribe desde fuera sin re-renderizar React. */
export interface WindowMotion {
  open: number          // 0..1 apertura objetivo de la hoja principal
  openSecond: number    // 0..1 hoja secundaria (solo practicables de 2 hojas)
  mode: OpenMode
  explode: number       // 0..1 despiece
  labels: number        // 0..1 opacidad de etiquetas
  /** Si se define, controla directamente la manilla (0 cerrada · 1 posición del modo) y desactiva la secuencia automática. */
  handle?: number
  /** Velocidad de amortiguación (más alto = más rápido). */
  damping?: number
}

export const createMotion = (): WindowMotion => ({ open: 0, openSecond: 0, mode: 'turn', explode: 0, labels: 0 })

const MAX_TURN = 1.22   // ≈ 70°
const MAX_TILT = 0.17   // ≈ 10°
const damp = (c: number, t: number, l: number, dt: number) => c + (t - c) * (1 - Math.exp(-l * dt))

function useRing(outer: Rect, inner: Rect, zMin: number, depth: number, bevel?: number): RingGeometry {
  const key = [outer.x0, outer.x1, outer.y0, outer.y1, inner.x0, inner.x1, inner.y0, inner.y1, zMin, depth, bevel].map((n) => (n ?? 0).toFixed(4)).join('|')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const g = useMemo(() => ringGeometry(outer, inner, zMin, depth, bevel), [key])
  useEffect(() => () => { g.h.dispose(); g.v.dispose() }, [g])
  return g
}

function Ring({ outer, inner, zMin, depth, finish, bevel, castShadow }: {
  outer: Rect; inner: Rect; zMin: number; depth: number; finish: { h: THREE.Material; v: THREE.Material } | THREE.Material; bevel?: number; castShadow?: boolean
}) {
  const g = useRing(outer, inner, zMin, depth, bevel)
  const mh = finish instanceof THREE.Material ? finish : finish.h
  const mv = finish instanceof THREE.Material ? finish : finish.v
  return (
    <>
      <mesh geometry={g.h} material={mh} castShadow={castShadow} />
      <mesh geometry={g.v} material={mv} castShadow={castShadow} />
    </>
  )
}

function Box({ w, h, d, position, material, bevel }: { w: number; h: number; d: number; position: [number, number, number]; material: THREE.Material; bevel?: number }) {
  const geo = useMemo(() => boxGeometry(w, h, d, bevel), [w, h, d, bevel])
  useEffect(() => () => geo.dispose(), [geo])
  return <mesh geometry={geo} material={material} position={position} />
}

function Pane({ rect, z, t, material }: { rect: Rect; z: number; t: number; material: THREE.Material }) {
  return (
    <mesh position={[rectCx(rect), rectCy(rect), z]} material={material} renderOrder={2}>
      <boxGeometry args={[rectW(rect), rectH(rect), t]} />
    </mesh>
  )
}

interface SashProps {
  s: SashSpec
  cfg: WindowConfig
  frameFront: number
  motionRef: MutableRefObject<WindowMotion>
  showLabels: boolean
  hq: boolean
  override?: THREE.Material
}

function Sash({ s, cfg, frameFront, motionRef, showLabels, hq, override }: SashProps) {
  const fin = override ? { h: override, v: override } : finishMaterials(cfg.finishInterior)
  const finExt = finishMaterials(cfg.finishExterior)
  const bicolor = !override && cfg.finishExterior !== cfg.finishInterior
  const isSlide = cfg.typology === 'corredera'

  const body = s.body
  const lipRect = expand(body, s.lip.l, s.lip.r, s.lip.t, s.lip.b)
  const inner = inset(body, s.face, s.face, s.face, s.bottomFace ?? s.face)
  const zSplit = isSlide ? s.zMin + s.depth : frameFront + 0.001
  const frontZ = isSlide ? s.zMin + s.depth : zSplit + 0.012
  const zMin = s.zMin

  // Vidrio y panel
  const beadW = 0.02
  const hasPanel = !!s.panelRatio
  const railH = 0.085
  const panelTop = hasPanel ? inner.y0 + rectH(inner) * (s.panelRatio ?? 0) : inner.y0
  const glassOpening: Rect = hasPanel ? { ...inner, y0: panelTop + railH } : inner
  const panelOpening: Rect | null = hasPanel ? { ...inner, y1: panelTop } : null
  const glassRect = expand(glassOpening, 0.012)
  const beadInner = inset(glassOpening, beadW)
  const triple = cfg.glazing === 'triple'
  const paneT = 0.004
  const unitDepth = triple ? 0.04 : 0.028
  const unitFront = frontZ - 0.024
  const unitBack = unitFront - unitDepth
  const panes = triple ? [unitBack + paneT / 2, (unitBack + unitFront) / 2, unitFront - paneT / 2] : [unitBack + paneT / 2, unitFront - paneT / 2]
  const gm = glassMaterial(cfg.glass, hq)

  // Grupos animados
  const turnRef = useRef<THREE.Group>(null)
  const tiltRef = useRef<THREE.Group>(null)
  const slideRef = useRef<THREE.Group>(null)
  const explodeRef = useRef<THREE.Group>(null)
  const beadRef = useRef<THREE.Group>(null)
  const gasketRef = useRef<THREE.Group>(null)
  const glassRef = useRef<THREE.Group>(null)
  const handleRef = useRef<THREE.Group>(null)
  const leverRef = useRef<THREE.Group>(null)
  const cur = useRef({ open: 0, tilt: 0, slide: 0, handle: 0, explode: 0, mode: 'turn' as OpenMode })

  const pivotX = s.hinge === 'left' ? lipRect.x0 : s.hinge === 'right' ? lipRect.x1 : 0
  const pivotY = lipRect.y0
  const pivotZ = frontZ - 0.002
  const turnSign = s.hinge === 'left' ? -1 : 1

  const handleX = s.handle ? (s.handle.side === 'right' ? (inner.x1 + lipRect.x1) / 2 : (lipRect.x0 + inner.x0) / 2) : 0
  const handleY = s.handle?.y ?? 0
  const leverSign = s.handle?.side === 'right' ? -1 : 1

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 20)
    const m = motionRef.current
    const c = cur.current
    const L = m.damping ?? 5
    const target = s.main ? m.open : m.openSecond
    const mode: OpenMode = isSlide ? 'slide' : (s.canTilt ? m.mode : 'turn')

    // Secuencia mecánica: manilla primero, luego hoja; al cerrar, al revés.
    let handleTarget: number
    let leafTarget: number
    if (m.handle !== undefined && s.main) {
      handleTarget = m.handle
      leafTarget = target
    } else {
      const wants = target > 0.001
      const leafClosed = c.open < 0.015 && c.tilt < 0.015 && c.slide < 0.015
      handleTarget = wants || !leafClosed ? 1 : 0
      const handleReady = c.handle > 0.92
      leafTarget = wants && handleReady ? target : wants ? 0 : 0
    }
    // Cambio de modo con hoja abierta: cerrar antes de cambiar.
    if (mode !== c.mode) {
      leafTarget = 0
      handleTarget = 0
      if (c.open < 0.015 && c.tilt < 0.015 && c.handle < 0.05) c.mode = mode
    }
    c.handle = damp(c.handle, handleTarget, L * 1.8, dt)
    c.open = damp(c.open, c.mode === 'turn' ? leafTarget : 0, L, dt)
    c.tilt = damp(c.tilt, c.mode === 'tilt' ? leafTarget : 0, L, dt)
    c.slide = damp(c.slide, c.mode === 'slide' ? leafTarget : 0, L * 0.8, dt)
    c.explode = damp(c.explode, s.main ? m.explode : 0, L * 0.8, dt)

    if (turnRef.current) turnRef.current.rotation.y = turnSign * c.open * MAX_TURN
    if (tiltRef.current) tiltRef.current.rotation.x = c.tilt * MAX_TILT
    if (slideRef.current && s.slide) slideRef.current.position.x = c.slide * s.slide.dx
    const e = c.explode
    if (explodeRef.current) explodeRef.current.position.z = e * 0.42
    if (beadRef.current) beadRef.current.position.z = e * 0.3
    if (gasketRef.current) gasketRef.current.position.z = e * 0.2
    if (glassRef.current) glassRef.current.position.z = e * 0.1
    if (handleRef.current) handleRef.current.position.z = frontZ + e * 0.4
    if (leverRef.current && s.handle?.kind === 'lever') {
      const angle = c.mode === 'tilt' ? Math.PI : Math.PI / 2
      leverRef.current.rotation.z = leverSign * c.handle * angle
    }
  })

  const off = (x: number, y: number, z: number, children: ReactNode) => (
    <group position={[x, y, z]}>{children}</group>
  )

  const content = (
    <group ref={explodeRef}>
      {/* Hoja: cuerpo + solape interior */}
      <Ring outer={body} inner={inner} zMin={zMin} depth={zSplit - zMin} finish={fin} castShadow />
      {!isSlide && <Ring outer={lipRect} inner={inner} zMin={zSplit} depth={frontZ - zSplit} finish={fin} castShadow />}
      {bicolor && <Ring outer={inset(body, 0.0012)} inner={expand(inner, 0.0012)} zMin={zMin - 0.0011} depth={0.0012} bevel={0} finish={finExt} />}

      {/* Junta exterior (contra el vidrio) */}
      <Ring outer={glassOpening} inner={inset(glassOpening, 0.0035)} zMin={unitBack - 0.004} depth={0.004} bevel={0.0006} finish={gasketMaterial()} />

      {/* Unidad de vidrio */}
      <group ref={glassRef}>
        {panes.map((z, i) => <Pane key={i} rect={glassRect} z={z} t={paneT} material={gm} />)}
        {panes.slice(0, -1).map((z, i) => (
          <Ring key={'sp' + i} outer={glassRect} inner={inset(glassRect, 0.0355)} zMin={z + paneT / 2} depth={panes[i + 1] - z - paneT} bevel={0.0004} finish={spacerMaterial()} />
        ))}
        <Ring outer={expand(glassRect, 0.0006)} inner={inset(glassRect, 0.0006)} zMin={unitBack} depth={unitDepth} bevel={0} finish={glassEdgeMaterial()} />
        {showLabels && s.main && (
          <Label position={[rectCx(glassOpening) - rectW(glassOpening) * 0.05, rectCy(glassOpening) + rectH(glassOpening) * 0.16, unitFront]} text={cfg.glazing === 'triple' ? 'Vidrio · triple' : 'Vidrio · doble'} opacityRef={motionRef} />
        )}
      </group>

      {/* Junta interior */}
      <group ref={gasketRef}>
        <Ring outer={beadInner} inner={inset(beadInner, 0.0035)} zMin={unitFront} depth={0.0045} bevel={0.0006} finish={gasketMaterial()} />
        {showLabels && s.main && (
          <Label position={[beadInner.x0 + 0.002, rectCy(beadInner) - rectH(beadInner) * 0.2, unitFront + 0.004]} text="Junta" opacityRef={motionRef} align="left" />
        )}
      </group>

      {/* Junquillo */}
      <group ref={beadRef}>
        <Ring outer={glassOpening} inner={beadInner} zMin={unitFront} depth={frontZ - 0.002 - unitFront} bevel={0.0018} finish={fin} />
        {panelOpening && (
          <>
            <Ring outer={panelOpening} inner={inset(panelOpening, beadW)} zMin={unitFront} depth={frontZ - 0.002 - unitFront} bevel={0.0018} finish={fin} />
          </>
        )}
        {showLabels && s.main && (
          <Label position={[glassOpening.x1 - beadW / 2, rectCy(glassOpening) - rectH(glassOpening) * 0.3, frontZ - 0.004]} text="Junquillo" opacityRef={motionRef} />
        )}
      </group>

      {/* Travesaño y panel opaco (puerta) */}
      {panelOpening && (
        <>
          <Box w={rectW(inner) + 0.02} h={railH} d={frontZ - zMin - 0.002} position={[rectCx(inner), panelTop + railH / 2, (frontZ + zMin) / 2 - 0.001]} material={fin.h} />
          <Box w={rectW(panelOpening) + 0.02} h={rectH(panelOpening) + 0.02} d={0.024} position={[rectCx(panelOpening), rectCy(panelOpening), (unitFront + unitBack) / 2]} material={fin.h} bevel={0.004} />
        </>
      )}

      {/* Manilla */}
      {s.handle && (
        <group ref={handleRef} position={[handleX, handleY, frontZ]}>
          {s.handle.kind === 'lever' ? (
            <>
              <Box w={0.03} h={0.078} d={0.012} position={[0, -0.008, 0.006]} material={handleMaterial()} bevel={0.004} />
              <group ref={leverRef} position={[0, 0, 0.02]}>
                <mesh material={handleMaterial()} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.004]}>
                  <cylinderGeometry args={[0.0085, 0.0085, 0.018, 24]} />
                </mesh>
                <Box w={0.019} h={0.125} d={0.013} position={[0, -0.055, 0.009]} material={handleMaterial()} bevel={0.0055} />
              </group>
            </>
          ) : (
            <>
              <Box w={0.028} h={0.2} d={0.012} position={[0, 0, 0.006]} material={handleMaterial()} bevel={0.004} />
              <Box w={0.02} h={0.15} d={0.016} position={[0, 0, 0.028]} material={handleMaterial()} bevel={0.006} />
              <Box w={0.014} h={0.014} d={0.02} position={[0, 0.06, 0.016]} material={handleMaterial()} bevel={0.003} />
              <Box w={0.014} h={0.014} d={0.02} position={[0, -0.06, 0.016]} material={handleMaterial()} bevel={0.003} />
            </>
          )}
          {showLabels && <Label position={[0.02, -0.05, 0.05]} text="Manilla" opacityRef={motionRef} />}
        </group>
      )}

      {showLabels && s.main && (
        <Label position={[rectCx(body) + rectW(body) * 0.18, inner.y1 + s.face / 2, frontZ]} text="Hoja · móvil" opacityRef={motionRef} />
      )}
    </group>
  )

  // Jerarquía de pivotes: giro (eje vertical en bisagras) → oscilación (eje inferior) → deslizamiento (carril)
  if (isSlide) {
    return <group ref={slideRef}>{content}</group>
  }
  return (
    <group ref={turnRef} position={[pivotX, 0, pivotZ]}>
      {off(-pivotX, 0, -pivotZ,
        <group ref={tiltRef} position={[0, pivotY, pivotZ]}>
          {off(0, -pivotY, -pivotZ, content)}
        </group>,
      )}
    </group>
  )
}

export function WindowModel({ cfg, motionRef, showLabels = true, hq = true, override }: {
  cfg: WindowConfig
  hq?: boolean
  /** Material único para todas las superficies de acabado (transiciones de la portada). */
  override?: THREE.Material
  motionRef: MutableRefObject<WindowMotion>
  showLabels?: boolean
}) {
  const layout = useMemo(() => computeLayout(cfg), [cfg])
  const { W, H, frameFace, frameDepth, frameZMin, sashes } = layout
  const fin = override ? { h: override, v: override } : finishMaterials(cfg.finishInterior)
  const finExt = finishMaterials(cfg.finishExterior)
  const bicolor = !override && cfg.finishExterior !== cfg.finishInterior
  const outer: Rect = { x0: -W / 2, x1: W / 2, y0: 0, y1: H }
  const opening = inset(outer, frameFace)
  const frameFront = frameZMin + frameDepth
  const isSlide = cfg.typology === 'corredera'
  const hingeSashes = sashes.filter((s) => s.hinge)

  return (
    <group>
      {/* MARCO — fijo, nunca se mueve con la hoja */}
      <Ring outer={outer} inner={opening} zMin={frameZMin} depth={frameDepth} finish={fin} bevel={0.003} castShadow />
      {bicolor && <Ring outer={inset(outer, 0.0015)} inner={expand(opening, 0.0015)} zMin={frameZMin - 0.0011} depth={0.0012} bevel={0} finish={finExt} />}

      {/* Junta de marco (visible al abrir) */}
      {!isSlide && (
        <Ring outer={expand(opening, 0.0075)} inner={expand(opening, 0.0012)} zMin={frameFront} depth={0.0028} bevel={0.0005} finish={gasketMaterial()} />
      )}

      {/* Carriles (corredera) */}
      {isSlide && sashes.map((s) => (
        <Box key={'rail' + s.id} w={W - 2 * frameFace + 0.01} h={0.012} d={0.006} position={[0, frameFace + 0.003, s.zMin + s.depth / 2]} material={hingeMaterial()} bevel={0.001} />
      ))}

      {/* Bisagras (eje real de giro) */}
      {hingeSashes.map((s) => {
        const lipX = s.hinge === 'left' ? s.body.x0 - s.lip.l : s.body.x1 + s.lip.r
        const ys = [s.body.y0 + 0.11, s.body.y1 - 0.11]
        return ys.map((y, i) => (
          <mesh key={s.id + 'h' + i} position={[lipX, y, frameFront + 0.008]} material={hingeMaterial()}>
            <cylinderGeometry args={[0.0075, 0.0075, 0.065, 20]} />
          </mesh>
        ))
      })}

      {sashes.map((s) => (
        <Sash key={s.id + cfg.typology + cfg.leaves} hq={hq} override={override} s={s} cfg={cfg} frameFront={frameFront} motionRef={motionRef} showLabels={showLabels} />
      ))}

      {showLabels && (
        <Label position={[outer.x0 + frameFace / 2, outer.y1 - H * 0.22, frameFront]} text="Marco · fijo" opacityRef={motionRef} align="left" />
      )}
    </group>
  )
}

export { computeLayout }
