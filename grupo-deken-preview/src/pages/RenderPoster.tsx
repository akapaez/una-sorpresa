import { useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { Viewer } from '@/three/Viewer'
import { Stage } from '@/three/Stage'
import { WindowModel, createMotion } from '@/three/WindowModel'
import { CameraRig, type CamShot } from '@/three/CameraRig'
import { HeroScene } from '@/three/HeroScene'
import { SectionScene } from '@/three/SectionScene'
import { DEFAULT_CONFIG, type WindowConfig } from '@/three/windowSpec'

/**
 * Ruta interna (no enlazada) que usa scripts/render-posters.mjs para generar las imágenes
 * de respaldo y del catálogo a partir del mismo modelo 3D. ?scene=hero|product
 */
export default function RenderPoster() {
  const [p] = useSearchParams()
  const scene = p.get('scene') ?? 'product'
  const num = (k: string, d: number) => Number(p.get(k) ?? d)
  const v3 = (k: string, d: [number, number, number]) => (p.get(k)?.split(',').map(Number) as [number, number, number]) ?? d
  const cfg: WindowConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    typology: (p.get('t') as WindowConfig['typology']) ?? 'practicable',
    leaves: num('l', 2) as 1 | 2,
    finishInterior: (p.get('f') as WindowConfig['finishInterior']) ?? 'blanco',
    finishExterior: (p.get('fe') as WindowConfig['finishExterior']) ?? (p.get('f') as WindowConfig['finishExterior']) ?? 'blanco',
    glass: (p.get('g') as WindowConfig['glass']) ?? 'transparente',
    widthMm: num('w', 1300), heightMm: num('h', 1450),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])
  const motion = useRef({ ...createMotion(), open: num('open', 0), mode: (p.get('mode') as 'turn') ?? 'turn', explode: num('explode', 0), labels: 0, damping: 60 })
  const shot = useRef<CamShot>({ pos: v3('cam', [1.6, 1.1, 3.4]), look: v3('look', [0, 0.72, 0]) })
  const sectionMotion = useRef({ explode: num('explode', 0), labels: 0, spin: 0 })
  const progress = useRef(0)
  const manual = useRef({})
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0d0e0f' }}>
      <Viewer quality="high" label="render" fallback={<div />} className="absolute inset-0" camera={{ position: shot.current.pos, fov: num('fov', 32) }}>
        {scene === 'section' ? (
          <>
            <SectionScene motionRef={sectionMotion} finish={(p.get('f') as WindowConfig['finishInterior']) ?? 'blanco'} interactive={false} labels={false} />
            <CameraRig shotRef={shot} lambda={60} />
          </>
        ) : scene === 'hero' ? (
          <HeroScene progress={progress} manual={manual} finish={null} mobile={p.get('mobile') === '1'} quality="high" still />
        ) : (
          <>
            <Stage quality="high" glow={num('glow', 1)} shadowFrames={Infinity} />
            <WindowModel cfg={cfg} motionRef={motion} showLabels={false} />
            <CameraRig shotRef={shot} lambda={60} />
          </>
        )}
      </Viewer>
    </div>
  )
}
