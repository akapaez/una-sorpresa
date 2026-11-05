import { useRef, useState } from 'react'
import { Layers, Tag, RotateCw } from 'lucide-react'
import { Viewer } from '@/three/Viewer'
import { SectionScene } from '@/three/SectionScene'
import type { SectionMotion } from '@/three/SectionModel'
import { detectQuality, prefersReducedMotion } from '@/three/quality'
import { Poster } from '@/ui/Poster'

/**
 * Visor del corte de sección real (DXF Schüco LivIng). Se carga de forma diferida.
 * Arrastrar para girar; botones para separar piezas y mostrar etiquetas.
 */
export default function SectionViewer({ className = '' }: { className?: string }) {
  const reduced = prefersReducedMotion()
  const narrow = typeof window !== 'undefined' && window.innerWidth < 700
  const motion = useRef<SectionMotion>({ explode: 0, labels: 1, spin: reduced ? 0 : 0.35 })
  const [explode, setExplode] = useState(false)
  const [labels, setLabels] = useState(true)
  const [spin, setSpin] = useState(!reduced)
  const set = (k: keyof SectionMotion, v: number) => { motion.current[k] = v }
  const btn = (on: boolean) => `inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[0.8rem] font-semibold transition-colors ${on ? 'border-white bg-white text-night' : 'border-white/25 text-white hover:border-white/60'}`
  return (
    <div className={`relative ${className}`}>
      <Viewer quality={detectQuality()} label="Corte 3D de la sección Schüco LivIng: marco, hoja, refuerzos de acero, juntas, junquillo y triple vidrio" className="absolute inset-0"
        camera={{ position: narrow ? [0.29, 0.1, 0.5] : [0.19, 0.07, 0.32], fov: 30 }}
        fallback={<Poster src="/renders/seccion-living.jpg" alt="" className="h-full w-full object-cover" />}>
        <SectionScene motionRef={motion} narrow={narrow} />
      </Viewer>
      <div className="absolute inset-x-0 bottom-4 flex flex-wrap justify-center gap-2 px-4">
        <button className={btn(explode)} aria-pressed={explode} onClick={() => { set('explode', explode ? 0 : 1); setExplode(!explode) }}><Layers size={15} aria-hidden />Separar piezas</button>
        <button className={btn(labels)} aria-pressed={labels} onClick={() => { set('labels', labels ? 0 : 1); setLabels(!labels) }}><Tag size={15} aria-hidden />Etiquetas</button>
        <button className={btn(spin)} aria-pressed={spin} onClick={() => { set('spin', spin ? 0 : 0.35); setSpin(!spin) }}><RotateCw size={15} aria-hidden />Giro</button>
      </div>
    </div>
  )
}
