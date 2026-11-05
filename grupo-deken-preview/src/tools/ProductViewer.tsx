import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { DoorOpen, Layers, RotateCcw, Tags, Move3d, ArrowDownUp, MoveHorizontal } from 'lucide-react'
import { Viewer } from '@/three/Viewer'
import { Stage } from '@/three/Stage'
import { WindowModel, createMotion, computeLayout, type WindowMotion } from '@/three/WindowModel'
import { CameraRig, type CamShot } from '@/three/CameraRig'
import { detectQuality } from '@/three/quality'
import type { OpenMode, WindowConfig } from '@/three/windowSpec'
import { Poster } from '@/ui/Poster'

export type ViewPreset = 'perspectiva' | 'frontal' | 'interior' | 'exterior'
export const VIEW_LABEL: Record<ViewPreset, string> = { perspectiva: 'Perspectiva', frontal: 'Frontal', interior: 'Interior', exterior: 'Exterior' }
const DIRS: Record<ViewPreset, [number, number, number]> = {
  perspectiva: [0.5, 0.2, 1], frontal: [0, 0.04, 1], interior: [-0.55, 0.14, 1], exterior: [0.45, 0.12, -1],
}

function AutoFrame({ cfg, view, shotRef, explode }: { cfg: WindowConfig; view: ViewPreset; shotRef: MutableRefObject<CamShot>; explode: boolean }) {
  const { size, camera } = useThree()
  useEffect(() => {
    const { W, H } = computeLayout(cfg)
    const fov = (camera as THREE.PerspectiveCamera).fov * Math.PI / 180
    const aspect = size.width / Math.max(1, size.height)
    const need = Math.max(H * 1.28, (W * 1.32) / aspect) * (explode ? 1.12 : 1)
    const d = need / (2 * Math.tan(fov / 2)) + 0.25
    const dir = new THREE.Vector3(...DIRS[view]).normalize()
    const look: [number, number, number] = [0, H / 2, explode ? 0.12 : 0]
    shotRef.current = { pos: [look[0] + dir.x * d, look[1] + dir.y * d, look[2] + dir.z * d], look }
  }, [cfg, view, size.width, size.height, camera, shotRef, explode])
  return null
}

function MotionSync({ motion, target }: { motion: MutableRefObject<WindowMotion>; target: Partial<WindowMotion> }) {
  useFrame(() => { Object.assign(motion.current, target) })
  return null
}

export interface ViewerApi { capture: () => string | null }

export function ProductViewer({
  cfg, poster, className = '', initialMode, view = 'perspectiva', onViewChange, showLabels: labelsProp, compact = false, apiRef, captureable = false, title,
}: {
  cfg: WindowConfig
  poster?: string
  className?: string
  initialMode?: OpenMode
  view?: ViewPreset
  onViewChange?: (v: ViewPreset) => void
  showLabels?: boolean
  compact?: boolean
  apiRef?: MutableRefObject<ViewerApi | null>
  captureable?: boolean
  title: string
}) {
  const quality = useMemo(() => detectQuality(), [])
  const coarse = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches, [])
  const layout = useMemo(() => computeLayout(cfg), [cfg])
  const motion = useRef(createMotion())
  const shot = useRef<CamShot>({ pos: [1.6, 1.1, 3.4], look: [0, 0.7, 0] })
  const [mode, setMode] = useState<OpenMode>(initialMode ?? layout.modes[0])
  const [open, setOpen] = useState(false)
  const [explode, setExplode] = useState(false)
  const [labels, setLabels] = useState(!!labelsProp)
  const [orbit, setOrbit] = useState(!coarse)
  const [version, setVersion] = useState(0)
  const gl = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => { if (labelsProp !== undefined) setLabels(labelsProp) }, [labelsProp])
  useEffect(() => { if (!layout.modes.includes(mode)) { setMode(layout.modes[0]); setOpen(false) } }, [layout, mode])
  useEffect(() => { setVersion((v) => v + 1) }, [view, cfg.typology, cfg.leaves, cfg.widthMm, cfg.heightMm, explode])

  useEffect(() => {
    if (!apiRef) return
    apiRef.current = { capture: () => { try { return gl.current?.domElement.toDataURL('image/jpeg', 0.9) ?? null } catch { return null } } }
  }, [apiRef])

  const target: Partial<WindowMotion> = { open: open && !explode ? (mode === 'tilt' ? 1 : mode === 'slide' ? 1 : 0.85) : 0, openSecond: 0, mode, explode: explode ? 1 : 0, labels: labels || explode ? 1 : 0, handle: undefined, damping: 5 }

  const btn = 'inline-flex min-h-11 min-w-11 justify-center items-center gap-2 rounded-[8px] px-3 text-[0.8rem] font-semibold transition-colors'
  const on = 'bg-white text-night'
  const off = 'text-fog-2 hover:bg-white/8 hover:text-white'

  return (
    <div className={`dark-scene relative overflow-hidden ${className}`} data-theme="dark">
      <Viewer
        className="absolute inset-0"
        quality={quality}
        label={title}
        preserveDrawingBuffer={captureable}
        onReady={(r) => { gl.current = r }}
        fallback={poster ? <Poster src={poster} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-night-2" />}
        camera={{ position: shot.current.pos, fov: 30 }}
      >
        <Stage quality={quality} />
        <WindowModel cfg={cfg} motionRef={motion} hq={quality === 'high'} />
        <MotionSync motion={motion} target={target} />
        <AutoFrame cfg={cfg} view={view} shotRef={shot} explode={explode} />
        <CameraRig shotRef={shot} version={version} orbit={orbit} lambda={3.4} />
      </Viewer>

      <div className={`absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-2 p-3 ${compact ? '' : 'sm:p-4'}`}>
        <div className="flex flex-wrap gap-1 rounded-[12px] border border-white/10 bg-night/75 p-1 backdrop-blur-md" role="toolbar" aria-label="Controles del visor">
          {layout.modes.includes('turn') && (
            <button className={`${btn} ${open && mode === 'turn' ? on : off}`} aria-pressed={open && mode === 'turn'} onClick={() => { setExplode(false); if (mode !== 'turn') { setMode('turn'); setOpen(true) } else setOpen(!open) }}>
              <DoorOpen size={16} aria-hidden /> <span className="max-sm:sr-only">{open && mode === 'turn' ? 'Cerrar' : 'Abrir'}</span>
            </button>
          )}
          {layout.modes.includes('tilt') && (
            <button className={`${btn} ${open && mode === 'tilt' ? on : off}`} aria-pressed={open && mode === 'tilt'} onClick={() => { setExplode(false); if (mode !== 'tilt') { setMode('tilt'); setOpen(true) } else setOpen(!open) }}>
              <ArrowDownUp size={16} aria-hidden /> <span className="max-sm:sr-only">Oscilar</span>
            </button>
          )}
          {layout.modes.includes('slide') && (
            <button className={`${btn} ${open ? on : off}`} aria-pressed={open} onClick={() => { setExplode(false); setMode('slide'); setOpen(!open) }}>
              <MoveHorizontal size={16} aria-hidden /> <span className="max-sm:sr-only">{open ? 'Cerrar' : 'Deslizar'}</span>
            </button>
          )}
          <button className={`${btn} ${explode ? on : off}`} aria-pressed={explode} onClick={() => { setOpen(false); setExplode(!explode) }}>
            <Layers size={16} aria-hidden /> <span className="max-sm:sr-only">{explode ? 'Montar' : 'Piezas'}</span>
          </button>
          {!compact && (
            <button className={`${btn} ${labels ? on : off}`} aria-pressed={labels} onClick={() => setLabels(!labels)}>
              <Tags size={16} aria-hidden /> <span className="max-sm:sr-only">Etiquetas</span>
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1 rounded-[12px] border border-white/10 bg-night/75 p-1 backdrop-blur-md">
          {coarse && (
            <button className={`${btn} ${orbit ? on : off}`} aria-pressed={orbit} onClick={() => setOrbit(!orbit)} title="Activa el giro con el dedo. Desactivado, el desplazamiento vertical funciona con normalidad.">
              <Move3d size={16} aria-hidden /> <span className="max-sm:sr-only">{orbit ? 'Giro activo' : 'Girar'}</span>
            </button>
          )}
          <button className={`${btn} ${off}`} onClick={() => { setOpen(false); setExplode(false); onViewChange?.('perspectiva'); setVersion((v) => v + 1) }}>
            <RotateCcw size={16} aria-hidden /> <span className={compact ? 'sr-only' : 'max-sm:sr-only'}>Restablecer vista</span>
          </button>
        </div>
      </div>
      <p className="label pointer-events-none absolute right-4 top-4 z-10 hidden rounded-[4px] sm:block border border-dashed border-white/25 px-1.5 py-0.5 !text-[0.58rem] text-fog-2">Visual orientativo{!coarse && ' · arrastra para girar'}</p>
    </div>
  )
}
