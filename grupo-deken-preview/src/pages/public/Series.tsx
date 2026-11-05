import { Link, useParams } from 'react-router'
import { ArrowRight, FileText, Info } from 'lucide-react'
import { DOCS, FINISH_RANGE, SERIES_INFO, seriesBySlug, type SeriesInfo, type Spec } from '@/content/series'
import { SOLUTIONS } from '@/content/solutions'
import { Button } from '@/ui/Button'
import { Poster } from '@/ui/Poster'
import { OpeningGlyph } from '@/ui/OpeningGlyph'
import NotFound from './NotFound'

export const SERIES_POSTER: Record<string, string> = {
  'schueco-ct-70': '/renders/detalle-blanco.jpg',
  'schueco-living': '/renders/detalle-antracita.jpg',
  'schueco-focusing': '/renders/detalle-madera.jpg',
  'schueco-softslide': '/renders/corredera.jpg',
  'soluciones-elevadoras': '/renders/elevadora.jpg',
}

/** Numera las fuentes en orden de aparición para usar llamadas voladas coherentes en la página. */
function useFootnotes(specs: { src: string }[]) {
  const order: string[] = []
  specs.forEach((s) => { if (!order.includes(s.src)) order.push(s.src) })
  return { n: (src: string) => order.indexOf(src) + 1, order }
}

const Big = ({ s, n, dark = true }: { s: Spec; n: number; dark?: boolean }) => (
  <div>
    <p className={`text-[2.6rem] font-extrabold leading-none tracking-[-0.04em] md:text-[3.6rem] ${dark ? 'text-white' : 'text-ink'}`}>
      <span className="tnum">{s.value}</span>{s.unit && <span className={`ml-1 text-[0.4em] font-bold tracking-normal ${dark ? 'text-fog-2' : 'text-ink-2'}`}>{s.unit}</span>}
      <sup className="ml-1 align-super text-[0.26em] font-bold tracking-normal text-green">{n}</sup>
    </p>
    <p className={`mt-3 text-[0.95rem] font-semibold ${dark ? 'text-white' : 'text-ink'}`}>{s.label}</p>
    {s.ctx && <p className={`mt-0.5 text-[0.8rem] ${dark ? 'text-fog-3' : 'text-ink-3'}`}>{s.ctx}</p>}
  </div>
)

/** Rejilla de series (índice /series y pestaña «Series de perfil» del catálogo). */
export function SeriesGrid() {
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {SERIES_INFO.map((s, i) => (
        <li key={s.slug} className={i === 0 ? 'md:col-span-2' : ''}>
          <Link to={`/series/${s.slug}`} className="group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[22px] bg-night text-white" data-theme="dark">
            <Poster src={SERIES_POSTER[s.slug]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/10" aria-hidden />
            <div className="relative mt-auto p-6 md:p-8">
              <p className="label !text-[0.64rem] text-green">{s.family === 'ventana' ? 'Ventana y balconera' : s.family === 'corredera' ? 'Corredera' : 'Corredera elevable'}</p>
              <p className="mt-2 text-[2rem] font-extrabold leading-none tracking-[-0.03em] md:text-[2.6rem]">{s.name}</p>
              <p className="mt-2 text-[1.05rem] text-fog-2">{s.tagline}</p>
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                {s.hero.slice(0, 3).map((h) => (
                  <div key={h.label}>
                    <dt className="sr-only">{h.label}</dt>
                    <dd className="text-[1.5rem] font-extrabold leading-none tracking-tight"><span className="tnum">{h.value}</span>{h.unit && <span className="ml-1 text-[0.55em] font-bold text-fog-2">{h.unit}</span>}</dd>
                    <dd className="mt-1 text-[0.74rem] text-fog-3">{h.label}</dd>
                  </div>
                ))}
              </dl>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-green">Ver la serie <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden /></span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function SeriesIndex() {
  return (
    <div className="bg-paper">
      <section className="dark-scene bg-night text-white" data-theme="dark">
        <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-20 text-center sm:px-6 md:pb-24 md:pt-28 lg:px-10">
          <p className="label text-green">Sistemas de perfil Schüco</p>
          <h1 className="display mx-auto mt-5 max-w-4xl text-[2.6rem] md:text-[5rem]">Medidos.<br />No prometidos.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] text-fog-2 md:text-[1.2rem]">Cada cifra de estas fichas sale de un folleto o catálogo técnico de Schüco y lleva su página. Lo que no está documentado, lo decimos.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <SeriesGrid />
        <Sources />
      </section>
    </div>
  )
}

function Sources({ ids }: { ids?: string[] }) {
  const list = ids ?? Object.keys(DOCS)
  return (
    <div className="mt-12 rounded-[16px] border border-line bg-surface p-5 md:p-6">
      <p className="flex items-center gap-2 font-bold"><FileText size={17} className="text-green-ink" aria-hidden />Documentación consultada</p>
      <ol className="mt-3 space-y-1.5 text-[0.84rem] text-ink-2">
        {list.map((id, i) => {
          const d = DOCS[id]
          return <li key={id} className="grid grid-cols-[1.6rem_1fr]"><span className="tnum font-bold text-green-ink">{ids ? i + 1 : '·'}</span><span><strong className="text-ink">{d.title}</strong>{d.edition && ` · ${d.edition}`} · {d.kind}{d.note && <span className="text-ink-3"> — {d.note}</span>}</span></li>
        })}
      </ol>
      <p className="mt-4 text-[0.78rem] text-ink-3">Los documentos originales no se publican con esta previsualización. Valores del fabricante para configuraciones ensayadas: Uf es la transmitancia del marco; la de la ventana completa (Uw) depende del vidrio y de la medida y se calcula en cada propuesta.</p>
    </div>
  )
}

export function SeriesDetail() {
  const { slug = '' } = useParams()
  const s = seriesBySlug(slug)
  if (!s) return <NotFound />
  return <SeriesPage s={s} />
}

function SeriesPage({ s }: { s: SeriesInfo }) {
  const all = [...s.hero, ...s.specs, ...s.features]
  const fn = useFootnotes(all)
  const typos = SOLUTIONS.filter((x) => s.typologies.includes(x.slug))
  const others = SERIES_INFO.filter((x) => x.slug !== s.slug)
  return (
    <div className="bg-paper">
      {/* Cabecera */}
      <section className="dark-scene relative overflow-hidden bg-night text-white" data-theme="dark">
        <Poster src={SERIES_POSTER[s.slug]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/80 to-night" aria-hidden />
        <div className="relative mx-auto max-w-[1440px] px-4 pb-16 pt-20 text-center sm:px-6 md:pb-24 md:pt-32 lg:px-10">
          <Link to="/series" className="label !text-[0.66rem] text-green hover:underline">Series Schüco</Link>
          <h1 className="display mx-auto mt-4 text-[3rem] md:text-[6rem]">{s.name}</h1>
          <p className="mt-3 text-[1.3rem] font-semibold text-fog-2 md:text-[1.8rem]">{s.tagline}</p>
          {s.variants && <p className="mt-5 flex flex-wrap justify-center gap-2">{s.variants.map((v) => <span key={v} className="rounded-full border border-white/20 px-3 py-1 text-[0.8rem] font-semibold text-fog-2">{v}</span>)}</p>}
          <div className={`mx-auto mt-16 grid max-w-5xl gap-10 text-left sm:grid-cols-2 ${s.hero.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {s.hero.map((h) => <Big key={h.label} s={h} n={fn.n(h.src)} />)}
          </div>
        </div>
      </section>

      {/* Introducción */}
      <section className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 md:py-24">
        <p className="text-[1.35rem] font-semibold leading-snug tracking-tight text-ink md:text-[2rem]">{s.intro}</p>
        {!s.inDekenWeb && <p className="mt-4 text-[0.9rem] text-warn">Sistema documentado; disponibilidad en Deken por confirmar.</p>}
      </section>

      {/* Características */}
      <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-10">
        <ul className={`grid gap-4 sm:grid-cols-2 ${s.features.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {s.features.map((f) => (
            <li key={f.title} className="rounded-[18px] border border-line bg-surface p-6">
              <p className="text-[1.15rem] font-extrabold tracking-tight">{f.title}<sup className="ml-1 text-[0.6em] font-bold text-green-ink">{fn.n(f.src)}</sup></p>
              <p className="mt-2 text-[0.94rem] text-ink-2">{f.text}</p>
              {f.ref && <p className="mt-3 text-[0.74rem] text-ink-3">{DOCS[f.src].kind} · {f.ref}</p>}
            </li>
          ))}
        </ul>
      </section>

      {/* Ficha técnica */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[0.8fr_1.6fr] lg:px-10">
          <div>
            <p className="label text-ink-3">Ficha técnica</p>
            <h2 className="display mt-3 text-[2rem] md:text-[2.8rem]">Los datos, con su página.</h2>
            <p className="mt-4 max-w-sm text-[0.95rem] text-ink-2">Valores del fabricante para la configuración ensayada. Ug y Uw dependen del vidrio que se defina para cada proyecto.</p>
          </div>
          <div className="overflow-hidden rounded-[14px] border border-line">
            <table className="w-full text-left text-[0.9rem]">
              <caption className="sr-only">Datos técnicos de {s.name} con su fuente</caption>
              <thead className="bg-paper-2 text-[0.76rem] text-ink-2"><tr><th scope="col" className="px-4 py-2.5 font-semibold">Característica</th><th scope="col" className="px-4 py-2.5 font-semibold">Valor</th><th scope="col" className="hidden px-4 py-2.5 font-semibold sm:table-cell">Fuente</th></tr></thead>
              <tbody>
                {s.specs.map((x) => (
                  <tr key={x.label} className="border-t border-line align-top">
                    <th scope="row" className="px-4 py-3 font-semibold">{x.label}{x.ctx && <span className="mt-0.5 block text-[0.74rem] font-normal text-ink-3">{x.ctx}</span>}</th>
                    <td className="whitespace-nowrap px-4 py-3"><span className="tnum font-bold">{x.value}</span>{x.unit && <span className="text-ink-2"> {x.unit}</span>}<sup className="ml-0.5 font-bold text-green-ink">{fn.n(x.src)}</sup></td>
                    <td className="hidden px-4 py-3 text-[0.78rem] text-ink-3 sm:table-cell">{DOCS[x.src].kind}{x.ref && ` · ${x.ref}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tipologías y acabados */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="label text-ink-3">Tipologías</p>
          <ul className="mt-5 space-y-3">
            {typos.map((t) => (
              <li key={t.slug}>
                <Link to={`/soluciones/${t.slug}`} className="glyph-host group flex items-center gap-4 rounded-[14px] border border-line bg-surface p-4 hover:border-ink-3">
                  <span className="rounded-[8px] bg-paper-2 p-2 text-ink" aria-hidden><OpeningGlyph slug={t.slug} className="h-8 w-auto" /></span>
                  <span className="min-w-0"><span className="block font-bold">{t.name}</span><span className="block truncate text-[0.86rem] text-ink-2">{t.short}</span></span>
                  <ArrowRight size={18} className="ml-auto shrink-0 text-ink-3 group-hover:text-ink" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex gap-2 text-[0.8rem] text-ink-3"><Info size={14} className="mt-0.5 shrink-0" aria-hidden />Orientativo. La combinación de serie, tipología y medida se confirma en la revisión técnica.</p>
        </div>
        <div>
          <p className="label text-ink-3">Acabados en la web de Deken</p>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {FINISH_RANGE.map((f) => (
              <li key={f.name} className="text-center">
                <span className="mx-auto block aspect-square w-full max-w-[96px] rounded-full border border-line-2 shadow-1" style={{ background: f.swatch }} aria-hidden />
                <span className="mt-2 block text-[0.84rem] font-semibold">{f.name}</span>
                {f.ref && <span className="block text-[0.7rem] text-ink-3">{f.ref}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.8rem] text-ink-3">Colores de pantalla orientativos. Para decidir, muestra física.</p>
        </div>
      </section>

      {/* Pendiente + fuentes */}
      <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-10">
        {s.pending.length > 0 && (
          <div className="rounded-[16px] border border-warn/25 bg-warn-soft/50 p-5 md:p-6">
            <p className="font-bold">Pendiente de confirmar con Deken</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.88rem] text-ink-2">{s.pending.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        )}
        <Sources ids={fn.order} />
      </section>

      {/* Cierre */}
      <section className="dark-scene bg-night text-white" data-theme="dark">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 md:py-24 lg:px-10">
          <div className="text-center">
            <h2 className="display text-[2.2rem] md:text-[3.4rem]">¿Encaja en tu obra?</h2>
            <p className="mx-auto mt-4 max-w-xl text-fog-2">Envíanos medidas, planos o memoria y el equipo técnico propone la serie y el vidrio adecuados.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button to={`/contacto?asunto=${encodeURIComponent('Consulta ' + s.name)}`} size="lg">Consultar proyecto</Button>
              <Button to="/acceso-profesional" variant="outline-dark" size="lg">Acceso profesional</Button>
            </div>
          </div>
          <ul className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug}><Link to={`/series/${o.slug}`} className="flex items-center justify-between rounded-[14px] border border-white/12 px-4 py-3.5 hover:border-white/40"><span className="font-bold">{o.name}</span><ArrowRight size={16} className="text-green" aria-hidden /></Link></li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
