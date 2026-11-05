import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { WindowModel, createMotion } from './WindowModel'
import { Stage } from './Stage'
import { CameraRig, type CamShot } from './CameraRig'
import { DEFAULT_CONFIG, type FinishId, type WindowConfig } from './windowSpec'
import { DESKTOP, MOBILE, ramp, shotAt, upDown } from './story'
import type { Quality } from './quality'

export interface HeroManual { open?: number; explode?: number }

const WHITE = new THREE.Color('#efeeea')
const ANTH = new THREE.Color('#3b4146')

/**
 * Contenido 3D de la portada. Lee el progreso (escrito por ScrollTrigger) y los controles
 * manuales; deriva cámara, apertura, despiece, etiquetas y transición de acabado.
 */
export function HeroScene({ progress, manual, finish, mobile, quality, still = false }: {
  progress: MutableRefObject<number>
  manual: MutableRefObject<HeroManual>
  finish: FinishId | null
  mobile: boolean
  quality: Quality
  still?: boolean
}) {
  const tl = mobile ? MOBILE : DESKTOP
  const motion = useRef(createMotion())
  const shot = useRef<CamShot>({ ...shotAt(tl.keys, progress.current) })
  const storyMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: WHITE.clone(), roughness: 0.4, clearcoat: 0.18, clearcoatRoughness: 0.42, envMapIntensity: 0.85 }), [])
  useEffect(() => () => storyMat.dispose(), [storyMat])
  const cfg: WindowConfig = useMemo(() => ({ ...DEFAULT_CONFIG, finishInterior: finish ?? 'blanco', finishExterior: finish ?? 'blanco' }), [finish])

  useFrame(() => {
    const p = progress.current
    const m = manual.current
    const s = shotAt(tl.keys, p)
    shot.current.pos = s.pos
    shot.current.look = s.look
    const mo = motion.current
    mo.mode = 'turn'
    mo.damping = still ? 60 : 6
    if (m.open !== undefined) { mo.open = m.open; mo.handle = undefined }
    else { mo.open = 0.85 * upDown(p, tl.open); mo.handle = upDown(p, tl.handle) }
    mo.explode = m.explode ?? upDown(p, tl.explode)
    mo.labels = m.explode !== undefined ? m.explode : upDown(p, tl.labels)
    if (!finish) {
      const k = ramp(p, tl.material[0], tl.material[1])
      storyMat.color.copy(WHITE).lerp(ANTH, k)
      storyMat.roughness = 0.4 + 0.18 * k
    }
  })

  return (
    <>
      <Stage quality={quality} />
      <WindowModel cfg={cfg} motionRef={motion} override={finish ? undefined : storyMat} hq={quality === 'high'} />
      <CameraRig shotRef={shot} lambda={still ? 60 : 3.2} />
    </>
  )
}
