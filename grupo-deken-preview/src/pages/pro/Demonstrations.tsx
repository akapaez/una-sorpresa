import { useState } from 'react'
import { ProductViewer } from '@/tools/ProductViewer'
import { AcousticIllustration, ThermalIllustration } from '@/tools/illustrations'
import { SOLUTIONS } from '@/content/solutions'
import { PageHeader, Segmented, Notice } from '@/ui/primitives'
import { Button } from '@/ui/Button'

/** Demostraciones ILUSTRATIVAS: explican conceptos; no demuestran cifras ni sustituyen ensayos. */
export default function Demonstrations() {
  const [closed, setClosed] = useState(false)
  const [thermal, setThermal] = useState<'continuo' | 'discontinuo'>('continuo')
  const demos = SOLUTIONS.filter((s) => s.demo)
  const [typ, setTyp] = useState(demos[1].slug)
  const sel = demos.find((d) => d.slug === typ)!
  return (
    <div>
      <PageHeader eyebrow="Herramientas" title="Demostraciones" text="Explicaciones visuales de funcionamiento y aislamiento. Son ilustrativas: no representan ensayos, mediciones ni prestaciones de una serie concreta." />

      <section className="mb-10 overflow-hidden rounded-[16px] border border-line bg-surface">
        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          <ProductViewer key={typ} cfg={sel.demo!.config} initialMode={sel.demo!.mode} poster={sel.poster} title={`Funcionamiento: ${sel.name}`} className="h-[420px] lg:h-[520px]" />
          <div className="p-6">
            <p className="label text-ink-3">01 · Funcionamiento</p>
            <h2 className="mt-2 text-[1.4rem] font-extrabold tracking-tight">Cómo se mueve cada hoja</h2>
            <p className="mt-2 text-[0.92rem] text-ink-2">El marco permanece fijo. La practicable gira sobre las bisagras; la oscilobatiente añade el giro sobre el eje inferior; la corredera desliza en su carril. Usa los botones del visor.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {demos.map((d) => (
                <button key={d.slug} onClick={() => setTyp(d.slug)} aria-pressed={typ === d.slug}
                  className={`min-h-11 rounded-[10px] border px-3 text-left text-[0.86rem] font-semibold ${typ === d.slug ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink-3'}`}>{d.name}</button>
              ))}
            </div>
            <p className="mt-4 text-[0.8rem] text-ink-3">La elevadora no tiene modelo 3D en esta demo para no representarla con un movimiento que no le corresponde.</p>
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[16px] border border-line bg-surface p-5 md:p-6">
          <p className="label text-ink-3">02 · Acústica</p>
          <h2 className="mt-2 text-[1.4rem] font-extrabold tracking-tight">Exterior, interior y la hoja entre ambos</h2>
          <p className="mt-2 text-[0.92rem] text-ink-2">Cierra la hoja para ver cómo cambia la representación de las ondas que llegan al interior.</p>
          <div className="mt-4 overflow-hidden rounded-[12px] border border-line"><AcousticIllustration closed={closed} /></div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="dark" onClick={() => setClosed(!closed)} aria-pressed={closed}>{closed ? 'Abrir la hoja' : 'Cerrar la hoja'}</Button>
            <p className="text-[0.8rem] text-ink-3">Sin sonido. La animación no representa una cifra en dB.</p>
          </div>
        </div>
        <div className="rounded-[16px] border border-line bg-surface p-5 md:p-6">
          <p className="label text-ink-3">03 · Térmica</p>
          <h2 className="mt-2 text-[1.4rem] font-extrabold tracking-tight">Continuidad del cerramiento</h2>
          <p className="mt-2 text-[0.92rem] text-ink-2">Compara dos conceptos: juntas continuas y encuentro sellado frente a discontinuidades que dejan pasar aire.</p>
          <div className="mt-4 overflow-hidden rounded-[12px] border border-line"><ThermalIllustration variant={thermal} /></div>
          <div className="mt-4"><Segmented label="Concepto" hideLabel value={thermal} onChange={setThermal} options={[{ value: 'continuo', label: 'Junta continua' }, { value: 'discontinuo', label: 'Con discontinuidades' }]} /></div>
        </div>
      </section>
      <Notice tone="neutral" title="Qué no muestran estas escenas">No calculan ahorro energético, no simulan un mapa térmico físico y no sustituyen las fichas técnicas. Uf (marco), Ug (vidrio) y Uw (ventana) se consultarán en la documentación de cada configuración.</Notice>
    </div>
  )
}
