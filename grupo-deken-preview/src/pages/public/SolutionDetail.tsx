import { lazy, Suspense } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, Compass, Box, FileQuestion, LockKeyhole } from 'lucide-react'
import { SOLUTIONS, typologyBySlug } from '@/content/solutions'
import { SERIES_INFO, FINISH_RANGE } from '@/content/series'
import { useDemo } from '@/demo/store'
import { Button } from '@/ui/Button'
import { Eyebrow, Notice } from '@/ui/primitives'
import { Poster } from '@/ui/Poster'
import { OpeningGlyph } from '@/ui/OpeningGlyph'
import NotFound from './NotFound'

const ProductViewer = lazy(() => import('@/tools/ProductViewer').then((m) => ({ default: m.ProductViewer })))

export default function SolutionDetail() {
  const { slug = '' } = useParams()
  const s = typologyBySlug(slug)
  const role = useDemo((st) => st.role)
  const setDraft = useDemo((st) => st.setDraft)
  if (!s) return <NotFound />
  const approved = role === 'aprobado'
  const others = SOLUTIONS.filter((x) => x.slug !== s.slug).slice(0, 3)
  const seriesFor = SERIES_INFO.filter((x) => x.typologies.includes(s.slug))

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-10">
        <Link to="/soluciones" className="inline-flex min-h-10 items-center gap-2 text-[0.86rem] font-semibold text-ink-2 hover:text-ink"><ArrowLeft size={16} aria-hidden /> Soluciones</Link>
      </div>
      <section className="mx-auto grid max-w-[1440px] gap-8 px-4 pb-16 pt-4 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:gap-12 lg:px-10">
        <div className="relative">
          {s.demo ? (
            <Suspense fallback={<Poster src={s.poster} alt="" className="aspect-[4/3] w-full rounded-[18px] object-cover" />}>
              <ProductViewer cfg={s.demo.config} initialMode={s.demo.mode} poster={s.poster} title={`${s.name}: visualización 3D orientativa`} className="aspect-[4/3] w-full rounded-[18px] lg:sticky lg:top-24 lg:aspect-auto lg:h-[calc(100dvh-14rem)] lg:min-h-[480px] lg:max-h-[760px]" compact />
            </Suspense>
          ) : (
            <div className="relative overflow-hidden rounded-[18px] bg-night" data-theme="dark">
              <Poster src={s.poster} alt={`${s.name}: ficha visual`} className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-x-4 bottom-4 rounded-[12px] border border-white/12 bg-night/80 p-4 text-white backdrop-blur">
                <p className="font-bold">Demostración 3D no disponible para esta tipología</p>
                <p className="mt-1 text-[0.86rem] text-fog-2">El mecanismo de elevación y deslizamiento requiere un modelo específico. Se muestra una ficha visual para no representar otro sistema con el mismo movimiento.</p>
              </div>
            </div>
          )}
          <p className="label mt-3 !text-[0.6rem] text-ink-3">Visualización orientativa · geometría aproximada de demostración, no corresponde a una serie concreta</p>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-[8px] border border-line bg-surface p-1.5 text-ink" aria-hidden><OpeningGlyph slug={s.slug} className="h-9 w-auto" /></span>
            <Eyebrow>Tipología · {s.movement}</Eyebrow>
          </div>
          <h1 className="display mt-5 text-[2.6rem] md:text-[3.4rem]">{s.name}</h1>
          <p className="lede mt-4 text-[1.05rem] leading-relaxed text-ink-2">{s.description}</p>

          <dl className="mt-8 grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
            <div><dt className="label text-ink-3">Movimiento</dt><dd className="mt-2 text-[0.92rem]">{s.movement}</dd></div>
            <div><dt className="label text-ink-3">Espacio</dt><dd className="mt-2 text-[0.92rem]">{s.space}</dd></div>
          </dl>

          <div className="mt-8">
            <h2 className="text-[1.05rem] font-bold">Aplicaciones orientativas</h2>
            <ul className="mt-3 space-y-2">{s.applications.map((a) => <li key={a} className="flex gap-3 text-[0.93rem] text-ink-2"><span className="mt-2.5 h-px w-3 shrink-0 bg-green" aria-hidden />{a}</li>)}</ul>
          </div>

          <div className="mt-8 rounded-[14px] border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 text-[1.05rem] font-bold"><FileQuestion size={18} className="text-green-ink" aria-hidden />Antes de elegir, pregúntate</h2>
            <ol className="mt-3 space-y-2.5">{s.questions.map((q, i) => <li key={q} className="grid grid-cols-[1.5rem_1fr] text-[0.92rem]"><span className="tnum font-bold text-ink-3">{i + 1}.</span>{q}</li>)}</ol>
          </div>

          <div className="mt-8">
            <h2 className="text-[1.05rem] font-bold">Acabados</h2>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {FINISH_RANGE.map((f) => (
                <li key={f.name} className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4 text-[0.86rem]">
                  <span className="h-7 w-7 rounded-full border border-line-2" style={{ background: f.swatch }} aria-hidden />
                  <span><strong>{f.name}</strong>{f.ref && <span className="text-ink-3"> · {f.ref}</span>}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[0.82rem] text-ink-3">Gama de la web actual de Deken. Colores de pantalla orientativos; para decidir, muestra física.</p>
          </div>

          <div className="mt-8">
            <h2 className="text-[1.05rem] font-bold">Series Schüco para esta tipología</h2>
            {seriesFor.length === 0 ? <p className="mt-2 text-[0.88rem] text-ink-3">Pendiente de confirmar con Deken.</p> : (
              <ul className="mt-3 space-y-2">
                {seriesFor.map((se) => (
                  <li key={se.slug}>
                    <Link to={`/series/${se.slug}`} className="group flex flex-wrap items-center gap-x-5 gap-y-1 rounded-[12px] border border-line bg-surface px-4 py-3 hover:border-ink-3">
                      <span className="font-extrabold">{se.name}</span>
                      <span className="text-[0.84rem] text-ink-2">{se.hero.slice(0, 3).map((h) => `${h.value}${h.unit ? ' ' + h.unit : ''} ${h.label.toLowerCase()}`).join(' · ')}</span>
                      <ArrowRight size={16} className="ml-auto text-ink-3 group-hover:text-ink" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[0.82rem] text-ink-3">Valores del fabricante; cada ficha indica documento y página. La serie definitiva se propone en la revisión técnica.</p>
          </div>

          <div className="mt-10 rounded-[16px] bg-night-2 p-6 text-white" data-theme="dark">
            {approved ? (
              <>
                <p className="font-bold">Continúa con tu proyecto</p>
                <p className="mt-1 text-[0.88rem] text-fog-2">Configura esta tipología, compárala o usa el asesor guiado.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.demo && <Button to="/profesional/configurador" onClick={() => setDraft({ config: s.demo!.config, name: `${s.name} · nueva`, loadedId: undefined })} icon={<Box size={16} aria-hidden />}>Configurar</Button>}
                  <Button to="/profesional/asesor" variant="outline-dark" icon={<Compass size={16} aria-hidden />}>Asesor guiado</Button>
                  <Button to="/profesional/comparador" variant="ghost-dark">Comparar</Button>
                </div>
              </>
            ) : (
              <>
                <p className="flex items-center gap-2 font-bold"><LockKeyhole size={17} className="text-green" aria-hidden />Configuración avanzada para profesionales</p>
                <p className="mt-1 text-[0.88rem] text-fog-2">El configurador completo, el comparador y el asesor están disponibles para profesionales aprobados por Deken.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button to="/acceso-profesional">Solicitar acceso profesional</Button>
                  <Button to={`/contacto?asunto=${encodeURIComponent('Consulta ' + s.name)}`} variant="outline-dark">Consultar proyecto</Button>
                </div>
              </>
            )}
          </div>
          {s.status === 'ficha-visual' && <Notice className="mt-4" tone="warn">Disponibilidad y documentación de esta tipología pendientes de confirmar.</Notice>}
        </div>
      </section>

      <section className="border-t border-line bg-paper-2 py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <p className="label mb-6 text-ink-3">Otras tipologías</p>
          <ul className="grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={`/soluciones/${o.slug}`} className="glyph-host group flex items-center gap-4 rounded-[14px] border border-line bg-surface p-4 hover:border-ink-3">
                  <Poster src={o.poster} alt="" className="h-20 w-24 shrink-0 rounded-[8px] object-cover" />
                  <div className="min-w-0"><p className="font-bold">{o.name}</p><p className="truncate text-[0.86rem] text-ink-2">{o.short}</p></div>
                  <ArrowRight size={18} className="ml-auto shrink-0 text-ink-3 group-hover:text-ink" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
