import { useMemo } from 'react'
import * as THREE from 'three'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import type { Quality } from './quality'

/**
 * Fondo esférico equirectangular: grafito con una zona de luz natural detrás de la
 * ventana (dirección -z). Se ve a través del vidrio y recorta la silueta del marco.
 */
function useBackdropTexture(tone: 'night' | 'studio', glow: number) {
  return useMemo(() => {
    const w = 1024, h = 512
    const c = document.createElement('canvas')
    c.width = w; c.height = h
    const ctx = c.getContext('2d')!
    const base = tone === 'studio' ? '#2a2f31' : '#0d0e0f'
    ctx.fillStyle = base
    ctx.fillRect(0, 0, w, h)
    const cx = w * 0.75, cy = h * 0.47
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(1.1, 1.25)
    const r = 165
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
    const a = Math.max(0, Math.min(1, glow))
    g.addColorStop(0, `rgba(196,206,204,${0.9 * a})`)
    g.addColorStop(0.22, `rgba(120,130,131,${0.6 * a})`)
    g.addColorStop(0.55, `rgba(38,43,45,${0.7 * a})`)
    g.addColorStop(1, 'rgba(13,14,15,0)')
    ctx.fillStyle = g
    ctx.fillRect(-r, -r, 2 * r, 2 * r)
    ctx.restore()
    // suelo ligeramente más oscuro bajo el horizonte
    const fl = ctx.createLinearGradient(0, h * 0.5, 0, h)
    fl.addColorStop(0, 'rgba(0,0,0,0)')
    fl.addColorStop(1, 'rgba(0,0,0,0.55)')
    ctx.fillStyle = fl
    ctx.fillRect(0, h * 0.5, w, h * 0.5)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [tone, glow])
}

export function Stage({ quality, tone = 'night', glow = 1, shadowFrames }: {
  quality: Quality; tone?: 'night' | 'studio'; glow?: number; shadowFrames?: number
}) {
  const backdrop = useBackdropTexture(tone, glow)
  const low = quality === 'low'
  return (
    <>
      <ambientLight intensity={tone === 'studio' ? 0.55 : 0.28} />
      {/* Luz principal lateral suave */}
      <directionalLight position={[-3.2, 3.6, 4.2]} intensity={tone === 'studio' ? 2.2 : 2.6} color="#fff8ef" />
      {/* Contraluz frío para recortar cantos */}
      <directionalLight position={[3.5, 2.6, -3]} intensity={1.4} color="#dfe9f0" />
      <directionalLight position={[2.5, 1.2, 3]} intensity={0.45} color="#ffffff" />

      {/* Entorno local (reflejos controlados en vidrio y manilla) */}
      <Environment resolution={low ? 64 : 256} frames={1}>
        <color attach="background" args={[tone === 'studio' ? '#cfd2d2' : '#050606']} />
        <Lightformer form="rect" intensity={3.2} position={[-4, 2.2, 3]} rotation={[0, Math.PI / 3, 0]} scale={[2.4, 5, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[0, 4.5, 1]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 0.6, 1]} color="#f3f1ec" />
        <Lightformer form="rect" intensity={2.2} position={[4, 1.4, 1.5]} rotation={[0, -Math.PI / 2.4, 0]} scale={[0.35, 4, 1]} color="#e9f0f4" />
        {/* Banda diagonal: reflejo controlado que cruza el vidrio */}
        <Lightformer form="rect" intensity={1.3} position={[-0.8, 1.6, 4.5]} rotation={[0, Math.PI, Math.PI / 4.2]} scale={[0.5, 9, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.8} position={[1.5, 0.4, 4]} rotation={[0, Math.PI, 0]} scale={[3, 0.25, 1]} color="#b9dc8e" />
      </Environment>

      {/* Fondo de escena (opaco, necesario para la transmisión del vidrio) */}
      <mesh position={[0, 0.8, 0]} renderOrder={-10}>
        <sphereGeometry args={[14, 48, 24]} />
        <meshBasicMaterial map={backdrop} side={THREE.BackSide} toneMapped={false} depthWrite={false} />
      </mesh>

      <ContactShadows
        position={[0, 0.0005, 0]}
        scale={6}
        far={1.4}
        blur={2.6}
        opacity={tone === 'studio' ? 0.35 : 0.7}
        resolution={low ? 256 : 768}
        frames={shadowFrames ?? (low ? 1 : Infinity)}
        color="#000000"
      />
    </>
  )
}
