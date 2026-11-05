import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { profileSlice, type ProfileShape } from './geometry'
import { LIVING, type RealProfile } from './profiles'
import { finishMaterials, gasketMaterial, glassMaterial, spacerMaterial, steelMaterial } from './materials'
import { PartLabel as Label } from './labels'
import type { FinishId } from './windowSpec'

/**
 * CORTE DE SECCIÓN: un tramo recto del conjunto real (DXF) con las cámaras a la vista.
 * Ejes del grupo: x = profundidad (exterior a la izquierda), y = u (canto del marco abajo,
 * vidrio hacia arriba), z = longitud del tramo hacia el fondo.
 */
export interface SectionMotion { explode: number; labels: number; spin: number }

const L = 0.16
const capMats = new Map<string, THREE.Material>()
const capMaterial = (id: FinishId | 'steel' | 'gasket') => {
  const hit = capMats.get(id)
  if (hit) return hit
  const color = id === 'steel' ? '#d5dadd' : id === 'gasket' ? '#2a2d2f' : id === 'antracita' ? '#5a6268' : id === 'madera' ? '#d2a676' : '#ffffff'
  const m = new THREE.MeshStandardMaterial({ color, roughness: id === 'steel' ? 0.35 : 0.7, metalness: id === 'steel' ? 0.7 : 0 })
  capMats.set(id, m)
  return m
}

function Part({ shapes, uRef = 0, side, cap }: { shapes: ProfileShape[]; uRef?: number; side: THREE.Material; cap: THREE.Material }) {
  // ExtrudeGeometry: grupo 0 = tapas (cara del corte), grupo 1 = laterales
  const geos = useMemo(() => shapes.map((s) => profileSlice([s], uRef, L, 0)), [shapes, uRef])
  useEffect(() => () => geos.forEach((g) => g.dispose()), [geos])
  return <>{geos.map((g, i) => <mesh key={i} geometry={g} material={[cap, side]} castShadow receiveShadow />)}</>
}

export function SectionModel({ motionRef, finish = 'blanco', profile = LIVING, labels = true, narrow = false }: {
  motionRef: MutableRefObject<SectionMotion>
  finish?: FinishId
  profile?: RealProfile
  labels?: boolean
  /** Pantallas estrechas: todas las etiquetas hacia la derecha para que no se corten. */
  narrow?: boolean
}) {
  const p = profile
  const fin = finishMaterials(finish).h
  const capPVC = capMaterial(finish)
  const g = p.glass
  const panes = [[g.panes[0][0], g.panes[1]?.[1] ?? g.panes[0][1]], [58, 60], g.panes[g.panes.length - 1]] as [number, number][]
  const glassH = 0.11
  const gm = useMemo(() => glassMaterial('transparente', false), [])

  const root = useRef<THREE.Group>(null)
  const sash = useRef<THREE.Group>(null)
  const bead = useRef<THREE.Group>(null)
  const glass = useRef<THREE.Group>(null)
  const steelF = useRef<THREE.Group>(null)
  const steelS = useRef<THREE.Group>(null)
  const cur = useRef({ e: 0, a: 0 })

  useFrame((_, dt) => {
    const m = motionRef.current
    const c = cur.current
    c.e += (m.explode - c.e) * (1 - Math.exp(-5 * Math.min(dt, 0.05)))
    c.a += dt * m.spin
    const e = c.e
    if (root.current) root.current.rotation.y = 0.5 + Math.sin(c.a) * 0.22
    if (sash.current) sash.current.position.set(e * 0.018, e * 0.03, 0)
    if (bead.current) bead.current.position.set(e * 0.05, e * 0.045, 0)
    if (glass.current) glass.current.position.set(e * 0.012, e * 0.075, 0)
    if (steelF.current) steelF.current.position.set(0, 0, e * -0.09)
    if (steelS.current) steelS.current.position.set(0, 0, e * -0.09)
  })

  const mm = (n: number) => n / 1000
  // profileSlice: (u, v, t) → (t, u, v). Giramos para que el corte mire a cámara: x = v, y = u, z = −t.
  return (
    <group ref={root}>
      <group rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
        {/* tras la rotación: x local (longitud) → −z, z local (profundidad) → +x */}
        <group position={[0, -0.06, -mm(55)]}>
          <Part shapes={p.frame} side={fin} cap={capPVC} />
          <group ref={steelF}><Part shapes={p.steel_frame} side={steelMaterial()} cap={capMaterial('steel')} /></group>
          <Part shapes={p.gasket_frame} side={gasketMaterial()} cap={capMaterial('gasket')} />
          <group ref={sash}>
            <Part shapes={p.sash} side={fin} cap={capPVC} />
            <group ref={steelS}><Part shapes={p.steel_sash} side={steelMaterial()} cap={capMaterial('steel')} /></group>
            <Part shapes={p.gasket_sash} side={gasketMaterial()} cap={capMaterial('gasket')} />
            <group ref={bead}><Part shapes={p.bead} side={fin} cap={capPVC} /></group>
            <group ref={glass}>
              {panes.map(([a, b], i) => (
                <mesh key={i} position={[L / 2, mm(g.edgeU) + glassH / 2, mm((a + b) / 2)]} material={gm}>
                  <boxGeometry args={[L, glassH, mm(b - a)]} />
                </mesh>
              ))}
              {panes.slice(0, -1).map(([, b], i) => (
                <mesh key={'s' + i} position={[L / 2, mm(g.edgeU + 3.4 + 4.9), mm((b + panes[i + 1][0]) / 2)]} material={spacerMaterial()}>
                  <boxGeometry args={[L, mm(9.8), mm(panes[i + 1][0] - b)]} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
      {labels && (
        <>
          <Label position={[-0.045, -0.048, 0.001]} text="Marco" opacityRef={motionRef} align={narrow ? 'right' : 'left'} />
          <Label position={[-0.046, 0.007, 0.001]} text="Juntas" opacityRef={motionRef} align={narrow ? 'right' : 'left'} />
          <Label position={[0.037, -0.012, 0.001]} text="Hoja" opacityRef={motionRef} />
          <Label position={[0.012, 0.018, 0.001]} text="Refuerzo de acero" opacityRef={motionRef} />
          <Label position={[0.036, 0.044, 0.001]} text="Junquillo" opacityRef={motionRef} />
          <Label position={[0.003, 0.11, 0.001]} text="Triple vidrio" opacityRef={motionRef} />
        </>
      )}
    </group>
  )
}
