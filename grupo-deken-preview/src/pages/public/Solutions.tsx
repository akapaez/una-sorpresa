import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowRight, SearchX, Box } from 'lucide-react'
import { SOLUTIONS, SERIES } from '@/content/solutions'
import { Eyebrow, EmptyState, Badge } from '@/ui/primitives'
import { Button } from '@/ui/Button'
import { Poster } from '@/ui/Poster'
import { OpeningGlyph } from '@/ui/OpeningGlyph'

const USES = [
  { v: 'ventana', l: 'Ventana' },
  { v: 'terraza', l: 'Salida a terraza' },
  { v: 'acceso', l: 'Acceso / paso' },
] as const

export default function Solutions() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('vista') === 'series' ? 'series' : 'tipologias'
  const [uses, setUses] = useState<string[]>([])
  const [only3d, setOnly3d] = useState(false)
  const [q, setQ] = useState('')

  const list = useMemo(() => SOLUTIONS.filter((s) =>
    (uses.length === 0 || s.use.some((u) => uses.includes(u))) &&
    (!only3d || s.status === 'demo-3d') &&
    (!q || (s.name + ' ' + s.short + ' ' + s.description).toLowerCase().includes(q.toLowerCase())),
  ), [uses, only3d, q])

  const toggle = (v: string) => setUses((u) => u.includes(v) ? u.filter((x) => x !== v) : [...u, v])
  const clear = () => { setUses([]); setOnly3d(false); setQ('') }
  const active = uses.length + (only3d ? 1 : 0) + (q ? 1 : 0)

  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-[1440px] px-4 pb-8 pt-14 sm:px-6 md:pt-20 lg:px-10">
        <Eyebrow className="mb-4">Soluciones</Eyebrow>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h1 className="display max-w-3xl text-[2.4rem] md:text-[3.6rem]">Elige primero cómo debe abrir.</h1>
          <p className="max-w-md text-[0.98rem] text-ink-2">La <strong className="text-ink">tipología</strong> describe el movimiento. La <strong className="text-ink">serie de perfil</strong> y el <strong className="text-ink">vidrio</strong> se definen después para cada proyecto, con la documentación técnica.</p>
        </div>
        <div className="mt-10 inline-flex rounded-[10px] border border-line bg-paper-2 p-1" role="tablist" aria-label="Vista del catálogo">
          {[['tipologias', 'Por tipología'], ['series', 'Series de perfil']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setParams(k === 'series' ? { vista: 'series' } : {})}
              className={`min-h-10 rounded-[7px] px-4 text-[0.86rem] font-semibold transition-colors ${tab === k ? 'bg-surface text-ink shadow-1' : 'text-ink-2 hover:text-ink'}`}>{l}</button>
          ))}
        </div>
      </section>

      {tab === 'tipologias' ? (
        <section className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-10">
          <div className="sticky top-16 z-20 -mx-4 mb-8 border-y border-line bg-paper/92 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label mr-1 text-ink-3">Uso</span>
              {USES.map((u) => (
                <button key={u.v} onClick={() => toggle(u.v)} aria-pressed={uses.includes(u.v)}
                  className={`min-h-9 rounded-full border px-3.5 text-[0.82rem] font-semibold transition-colors ${uses.includes(u.v) ? 'border-ink bg-ink text-white' : 'border-line-2 bg-surface text-ink-2 hover:border-ink-3'}`}>{u.l}</button>
              ))}
              <button onClick={() => setOnly3d(!only3d)} aria-pressed={only3d}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[0.82rem] font-semibold transition-colors ${only3d ? 'border-ink bg-ink text-white' : 'border-line-2 bg-surface text-ink-2 hover:border-ink-3'}`}><Box size={14} aria-hidden />Con demostración 3D</button>
              <div className="ml-auto flex w-full items-center gap-2 sm:w-auto">
                <label htmlFor="sol-q" className="sr-only">Buscar solución</label>
                <input id="sol-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" className="field !min-h-9 !py-1.5 sm:w-56" />
                {active > 0 && <button onClick={clear} className="min-h-9 whitespace-nowrap px-2 text-[0.82rem] font-semibold text-green-ink hover:underline">Limpiar ({active})</button>}
              </div>
            </div>
          </div>
          <p className="mb-4 text-[0.86rem] text-ink-3" aria-live="polite">{list.length} {list.length === 1 ? 'tipología' : 'tipologías'}</p>
          {list.length === 0 ? (
            <EmptyState icon={<SearchX size={28} />} title="Ninguna tipología coincide con los filtros" text="Prueba a quitar algún filtro o consulta tu caso con el equipo." action={<Button variant="outline" onClick={clear}>Quitar filtros</Button>} />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <li key={s.slug}>
                  <Link to={`/soluciones/${s.slug}`} className="glyph-host group flex h-full flex-col overflow-hidden rounded-[16px] border border-line bg-surface shadow-1 transition-shadow hover:shadow-2">
                    <div className="relative aspect-[4/3] overflow-hidden bg-night">
                      <Poster src={s.poster} alt={`${s.name}: visual de producto de la previsualización`} className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
                      <div className="absolute left-3 top-3 rounded-[8px] border border-white/15 bg-night/60 p-1.5 text-white backdrop-blur" aria-hidden><OpeningGlyph slug={s.slug} className="h-8 w-auto" /></div>
                      <div className="absolute right-3 top-3">{s.status === 'demo-3d' ? <Badge tone="dark">Demo 3D</Badge> : <Badge tone="dark">Ficha visual</Badge>}</div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[1.25rem] font-extrabold tracking-tight">{s.name}</p>
                      <p className="mt-1 text-[0.92rem] text-ink-2">{s.short}</p>
                      <p className="label mt-4 !text-[0.62rem] text-ink-3">{s.movement}</p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.86rem] font-bold text-green-ink">Ver ficha <ArrowRight size={15} aria-hidden /></span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-10">
          <div className="rounded-[16px] border border-line bg-surface">
            <div className="border-b border-line p-5 md:p-6">
              <p className="font-bold">Familias de perfil</p>
              <p className="mt-1 max-w-3xl text-[0.9rem] text-ink-2">Denominaciones tomadas de la web actual de Deken. Antes de atribuir tipologías, prestaciones o disponibilidad a cada serie, se verificará la documentación técnica oficial. Mientras tanto, cada ficha permite solicitarla.</p>
            </div>
            <ul>
              {SERIES.map((s) => (
                <li key={s.slug} className="grid gap-3 border-b border-line p-5 last:border-b-0 md:grid-cols-[1.2fr_1.6fr_auto] md:items-center md:p-6">
                  <p className="text-[1.15rem] font-extrabold tracking-tight">{s.name}</p>
                  <div className="text-[0.88rem] text-ink-2">
                    <p>{s.note}</p>
                    <p className="mt-1"><Badge tone="warn">Pendiente de documentación</Badge></p>
                  </div>
                  <Button to={`/contacto?asunto=${encodeURIComponent('Ficha técnica ' + s.name)}`} variant="outline" size="sm">Consultar ficha técnica</Button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
