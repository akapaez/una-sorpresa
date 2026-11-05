import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { hasWebGL, type Quality } from './quality'
import { LabelLayerContext } from './labels'

/**
 * Contenedor de escena 3D:
 * - comprueba WebGL y gestiona la pérdida de contexto con una vista de respaldo;
 * - detiene el bucle de render cuando el visor no está en pantalla;
 * - adapta la resolución a la calidad.
 */
export function Viewer({ children, fallback, quality, className = '', camera, preserveDrawingBuffer = false, onReady, label, active = true }: {
  children: ReactNode
  fallback: ReactNode
  quality: Quality
  className?: string
  camera?: { position: [number, number, number]; fov: number }
  preserveDrawingBuffer?: boolean
  onReady?: (gl: THREE.WebGLRenderer) => void
  label: string
  active?: boolean
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const labelLayer = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(true)
  const [lost, setLost] = useState(false)
  const [ready, setReady] = useState(false)
  const supported = hasWebGL()

  useEffect(() => {
    const el = wrap.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!supported || lost) {
    return (
      <div className={className} role="img" aria-label={label}>
        {fallback}
        {lost && (
          <p className="absolute bottom-3 left-3 label text-fog-3">Vista 3D no disponible · se muestra imagen de respaldo</p>
        )}
      </div>
    )
  }

  return (
    <div ref={wrap} className={className} aria-label={label} role="img">
      {/* Respaldo visible mientras carga el 3D: misma composición */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`} aria-hidden>
        {fallback}
      </div>
      <Canvas
        className="!absolute inset-0"
        frameloop={visible && active ? 'always' : 'never'}
        dpr={quality === 'high' ? [1, 1.75] : [1, 1.25]}
        camera={camera ?? { position: [1.6, 1.1, 3.4], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer, toneMapping: THREE.NeutralToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping
          gl.toneMappingExposure = 1.0
          gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); setLost(true) })
          onReady?.(gl)
          requestAnimationFrame(() => setTimeout(() => setReady(true), 250))
        }}
      >
        <LabelLayerContext.Provider value={labelLayer}>
          <Suspense fallback={null}>{children}</Suspense>
        </LabelLayerContext.Provider>
      </Canvas>
      <div ref={labelLayer} className="pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  )
}
