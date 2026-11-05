import { useEffect, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitImpl } from 'three-stdlib'

export interface CamShot { pos: [number, number, number]; look: [number, number, number]; fov?: number }

const damp = (c: number, t: number, l: number, dt: number) => c + (t - c) * (1 - Math.exp(-l * dt))

/**
 * Cámara que sigue un plano objetivo con amortiguación suave.
 * - follow: siempre sigue (portada guiada por scroll).
 * - orbit: transición al cambiar de plano y después cede el control a OrbitControls.
 */
export function CameraRig({ shotRef, version = 0, orbit = false, lambda = 2.6, minDistance = 0.8, maxDistance = 7 }: {
  shotRef: MutableRefObject<CamShot>
  version?: number
  orbit?: boolean
  lambda?: number
  minDistance?: number
  maxDistance?: number
}) {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(...shotRef.current.look))
  const controls = useRef<OrbitImpl>(null)
  const transitioning = useRef(true)
  const tmp = useRef(new THREE.Vector3())

  useEffect(() => { transitioning.current = true }, [version])

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 20)
    const s = shotRef.current
    if (orbit && !transitioning.current) return
    const p = camera.position
    p.x = damp(p.x, s.pos[0], lambda, dt)
    p.y = damp(p.y, s.pos[1], lambda, dt)
    p.z = damp(p.z, s.pos[2], lambda, dt)
    look.current.x = damp(look.current.x, s.look[0], lambda, dt)
    look.current.y = damp(look.current.y, s.look[1], lambda, dt)
    look.current.z = damp(look.current.z, s.look[2], lambda, dt)
    if (s.fov && (camera as THREE.PerspectiveCamera).fov !== undefined) {
      const pc = camera as THREE.PerspectiveCamera
      const nf = damp(pc.fov, s.fov, lambda, dt)
      if (Math.abs(nf - pc.fov) > 0.01) { pc.fov = nf; pc.updateProjectionMatrix() }
    }
    camera.lookAt(look.current)
    if (controls.current) controls.current.target.copy(look.current)
    if (orbit) {
      tmp.current.set(...s.pos)
      if (tmp.current.distanceTo(p) < 0.01 && look.current.distanceTo(tmp.current.set(...s.look)) < 0.01) {
        transitioning.current = false
      }
    }
  })

  if (!orbit) return null
  return (
    <OrbitControls
      ref={controls as never}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI / 2 - 0.02}
      onStart={() => { transitioning.current = false }}
    />
  )
}
