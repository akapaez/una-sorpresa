import { Fragment, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Plus, X, ArrowLeft, ArrowRight, Check, Columns3, Box, BookOpen, Send, RotateCcw, FileDown, Bot, SearchX, Info } from 'lucide-react'
import { useDemo } from '@/demo/store'
import { CATEGORIES, COMPARE_ITEMS, SOURCES, TYPOLOGY_TO_EXAMPLE, type Cell } from '@/content/compare'
import { typologyBySlug } from '@/content/solutions'
import { TYPOLOGY_DEFAULT_SIZE, type Typology, type FinishId } from '@/three/windowSpec'
import { Button } from '@/ui/Button'
import { Dialog, toast } from '@/ui/Dialog'
import { PageHeader, Segmented, Badge, Notice, EmptyState, DemoTag } from '@/ui/primitives'
import { Poster } from '@/ui/Poster'
import { OpeningGlyph } from '@/ui/OpeningGlyph'
import { downloadLibraryDoc } from '@/lib/pdf'
import { AssistantChat } from '@/tools/AssistantChat'
import NotFound from '../public/NotFound'
import { fmtDate } from '../shared'

/* ======================================= Comparador ======================================= */
export function Comparator() {
  const ids = useDemo((s) => s.compare)
  const setIds = useDemo((s) => s.setCompare)
  const [mode, setMode] = useState<'resumen' | 'detalle'>('detalle')
  const [onlyDiff, setOnlyDiff] = useState(false)
  const [picker, setPicker] = useState(false)
  const items = ids.map((id) => COMPARE_ITEMS.find((x) => x.id === id)!).filter(Boolean)
  const same = (rowId: string) => {
    const vals = items.map((i) => `${i.cells[rowId]?.v ?? ''}|${i.cells[rowId]?.unit ?? ''}`)
    return vals.every((v) => v === vals[0])
  }
  const usedSources = new Set<string>()
  items.forEach((i) => Object.values(i.cells).forEach((c) => c.src && usedSources.add(c.src)))
  const cats = CATEGORIES.map((c) => ({ ...c, rows: c.rows.filter((r) => (mode === 'detalle' || r.summary) && (!onlyDiff || !same(r.id))) })).filter((c) => c.rows.length)

  const cell = (c: Cell | undefined) => c?.v
    ? <span><span className="font-semibold tnum">{c.v}</span>{c.unit && <span className="text-ink-2"> {c.unit}</span>}{c.src && <sup className="ml-0.5 font-bold text-green-ink">{c.src}</sup>}{c.ctx && <span className="block text-[0.72rem] text-ink-3">{c.ctx}</span>}</span>
    : <span className="text-[0.8rem] text-ink-3">Sin dato confirmado</span>

  return (
    <div>
      <PageHeader eyebrow="Herramientas" title="Comparador" text="Compara hasta tres opciones por categorías homogéneas. Cada dato numérico lleva unidad, contexto y fuente." />
      <Notice tone="warn" className="mb-5" title="Sin datos técnicos reales todavía">Los valores de «Ejemplo A/B/C» son ficticios y solo sirven para revisar el diseño de la tabla. Las series Schüco se muestran sin cifras hasta incorporar su documentación oficial.</Notice>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {items.map((i) => (
          <span key={i.id} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-surface pl-4 pr-1 text-[0.84rem] font-semibold">
            {i.name}{i.kind === 'ejemplo' && <DemoTag>valores ficticios</DemoTag>}
            <button onClick={() => setIds(ids.filter((x) => x !== i.id))} disabled={items.length <= 2} className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper-2 disabled:opacity-30" aria-label={`Quitar ${i.name}`}><X size={15} /></button>
          </span>
        ))}
        {items.length < 3 && <Button size="sm" variant="outline" icon={<Plus size={15} aria-hidden />} onClick={() => setPicker(true)}>Añadir opción</Button>}
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-[0.84rem] font-semibold"><input type="checkbox" className="h-5 w-5 accent-[#3f6b10]" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} />Solo diferencias</label>
          <Segmented label="Nivel" hideLabel size="sm" value={mode} onChange={setMode} options={[{ value: 'resumen', label: 'Resumen' }, { value: 'detalle', label: 'Detalle' }]} />
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[0.86rem]">
            <caption className="sr-only">Comparación de opciones por categorías</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="sticky left-0 z-10 w-[200px] bg-surface px-4 py-3 text-[0.78rem] font-semibold text-ink-3">Característica</th>
                {items.map((i) => (
                  <th key={i.id} scope="col" className="px-4 py-3 align-bottom">
                    <span className="block text-[0.95rem] font-extrabold">{i.name}</span>
                    <span className="mt-1 block">{i.kind === 'ejemplo' ? <Badge tone="warn">Ejemplo · ficticio</Badge> : <Badge>Serie · sin datos</Badge>}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => (
                <Fragment key={c.id}>
                  <tr className="bg-paper-2/70"><th colSpan={items.length + 1} scope="colgroup" className="px-4 py-2 text-left"><span className="label !text-[0.62rem] text-ink-2">{c.label}</span></th></tr>
                  {c.rows.map((r) => {
                    const diff = !same(r.id)
                    return (
                      <tr key={r.id} className="border-b border-line last:border-0">
                        <th scope="row" className="sticky left-0 z-10 bg-surface px-4 py-3 align-top font-semibold">
                          <span className="flex items-center gap-1.5">{diff && <span className="h-1.5 w-1.5 rounded-full bg-green" title="Difiere" aria-label="Difiere entre opciones" />}{r.label}</span>
                          {r.help && <span className="mt-0.5 block text-[0.72rem] font-normal text-ink-3">{r.help}</span>}
                        </th>
                        {items.map((i) => <td key={i.id} className={`px-4 py-3 align-top ${diff ? 'bg-green-soft/35' : ''}`}>{cell(i.cells[r.id])}</td>)}
                      </tr>
                    )
                  })}
                </Fragment>
              ))}
              {cats.length === 0 && <tr><td colSpan={items.length + 1} className="px-4 py-10 text-center text-ink-3">No hay diferencias en las filas visibles.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 space-y-1 text-[0.78rem] text-ink-3">
        <p className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden /> Fila con diferencias entre las opciones seleccionadas.</p>
        {[...usedSources].map((k) => <p key={k}><sup className="font-bold text-green-ink">{k}</sup> {SOURCES[k]}</p>)}
        <p>Uf, Ug y Uw son magnitudes distintas (marco, vidrio, ventana) y no deben compararse entre sí. Un valor de catálogo corresponde a una configuración concreta, no a toda la serie.</p>
      </div>

      <Dialog open={picker} onClose={() => setPicker(false)} title="Añadir opción a la comparación">
        <ul className="space-y-2">
          {COMPARE_ITEMS.filter((x) => !ids.includes(x.id)).map((x) => (
            <li key={x.id}><button onClick={() => { setIds([...ids, x.id]); setPicker(false) }} className="flex w-full items-center justify-between rounded-[10px] border border-line p-3 text-left hover:border-ink-3">
              <span className="font-semibold">{x.name}</span>{x.kind === 'ejemplo' ? <Badge tone="warn">Valores ficticios</Badge> : <Badge>Sin datos</Badge>}
            </button></li>
          ))}
        </ul>
      </Dialog>
    </div>
  )
}

/* ======================================= Asesor ======================================= */
interface Q { id: string; label: string; multi?: boolean; options: string[] }
const ADVISOR_STEPS: { title: string; text: string; qs: Q[] }[] = [
  { title: 'Proyecto', text: 'Tipo de obra y estancia.', qs: [
    { id: 'obra', label: 'Tipo de proyecto', options: ['Obra nueva', 'Rehabilitación', 'Reforma'] },
    { id: 'estancia', label: 'Estancia o uso del hueco', options: ['Dormitorio', 'Salón', 'Cocina o baño', 'Salida a terraza', 'Acceso exterior'] },
  ] },
  { title: 'Espacio', text: '¿Cuánto espacio hay delante del hueco para abrir?', qs: [
    { id: 'espacio', label: 'Espacio para la apertura', options: ['Hay espacio libre delante', 'Espacio limitado (mobiliario, paso)', 'Aún no lo sé'] },
  ] },
  { title: 'Prioridades', text: 'Puedes elegir varias.', qs: [
    { id: 'prioridades', label: 'Prioridades', multi: true, options: ['Aislamiento acústico', 'Comportamiento térmico', 'Paso cómodo', 'Ventilar a menudo', 'Diseño y luz'] },
  ] },
  { title: 'Preferencias', text: 'Si ya tienes alguna idea.', qs: [
    { id: 'preferida', label: 'Tipología preferida', options: ['Sin preferencia', 'Practicable', 'Oscilobatiente', 'Corredera', 'Elevadora'] },
    { id: 'acabado', label: 'Acabado', options: ['Sin decidir', 'Blanco', 'Antracita', 'Madera'] },
  ] },
  { title: 'Documentación', text: '¿Qué tienes para una consulta posterior?', qs: [
    { id: 'datos', label: 'Datos disponibles', multi: true, options: ['Planos acotados', 'Listado de medidas', 'Fotos del hueco', 'Memoria técnica', 'Nada todavía'] },
  ] },
]

interface Rec { slug: string; why: string[] }
/** Reglas locales y transparentes. Sin porcentajes ni diagnósticos normativos. */
export function recommend(a: Record<string, string | string[]>): { recs: Rec[]; review: string[] } {
  const pri = (a.prioridades as string[] | undefined) ?? []
  const estancia = a.estancia as string
  const espacio = a.espacio as string
  const pref = a.preferida as string
  const recs: Rec[] = []
  const add = (slug: string, why: string) => {
    const r = recs.find((x) => x.slug === slug)
    if (r) r.why.push(why); else recs.push({ slug, why: [why] })
  }
  const paso = estancia === 'Salida a terraza' || estancia === 'Acceso exterior'
  if (paso) {
    if (estancia === 'Acceso exterior') add('puerta', 'Indicas un acceso exterior: una puerta de una hoja es la referencia.')
    if (espacio === 'Espacio limitado (mobiliario, paso)') add('corredera', 'Con espacio limitado, la corredera no invade el interior al abrir.')
    else add('balconera', 'Con espacio libre, una balconera abre por completo el paso.')
    if (pri.includes('Diseño y luz') || pref === 'Elevadora') add('elevadora', 'Para grandes paños y protagonismo del vidrio, conviene valorar una elevadora.')
    if (pri.includes('Paso cómodo')) add(espacio === 'Espacio limitado (mobiliario, paso)' ? 'corredera' : 'balconera', 'Priorizas un paso cómodo y frecuente.')
  } else {
    if (espacio === 'Espacio limitado (mobiliario, paso)') { add('corredera', 'Con espacio limitado, la corredera no ocupa el frente del hueco.'); add('oscilobatiente', 'La oscilación permite ventilar sin abrir la hoja hacia el interior.') }
    else if (espacio === 'Hay espacio libre delante') add('practicable', 'Hay espacio libre: la practicable abre por completo y facilita la limpieza.')
    else { add('oscilobatiente', 'Sin datos de espacio, la oscilobatiente combina giro y ventilación sin invadir.'); add('practicable', 'Alternativa directa si luego confirmas espacio libre.') }
    if (pri.includes('Ventilar a menudo')) add('oscilobatiente', 'Ventilar a menudo encaja con la posición de oscilación.')
    if (estancia === 'Cocina o baño') add('oscilobatiente', 'En cocinas y baños es habitual ventilar con la hoja oscilada.')
  }
  const map: Record<string, string> = { Practicable: 'practicable', Oscilobatiente: 'oscilobatiente', Corredera: 'corredera', Elevadora: 'elevadora' }
  if (pref && map[pref]) {
    const slug = map[pref]
    const existing = recs.findIndex((r) => r.slug === slug)
    if (existing >= 0) { const [r] = recs.splice(existing, 1); r.why.unshift('Coincide con tu tipología preferida.'); recs.unshift(r) }
    else recs.push({ slug, why: ['Es tu tipología preferida; Deken revisará si encaja con el espacio y el uso.'] })
  }
  const review = ['Serie de perfil adecuada según la documentación técnica (no se asigna automáticamente).', 'Medidas definitivas y encuentro con la obra.']
  if (pri.includes('Aislamiento acústico')) review.push('Composición de vidrio y configuración para el ruido exterior: requiere documentación técnica; esta demo no da cifras.')
  if (pri.includes('Comportamiento térmico')) review.push('Valores Uf, Ug y Uw de la configuración concreta, con su fuente.')
  if (paso) review.push('Umbral y encuentro con el pavimento en salidas y accesos.')
  const datos = (a.datos as string[] | undefined) ?? []
  if (datos.includes('Nada todavía') || datos.length === 0) review.push('Para la consulta harán falta al menos medidas aproximadas o un plano acotado.')
  return { recs: recs.slice(0, 3), review }
}

export function Advisor() {
  const st = useDemo((s) => s.advisor)
  const set = useDemo((s) => s.setAdvisor)
  const reset = useDemo((s) => s.resetAdvisor)
  const setDraft = useDemo((s) => s.setDraft)
  const setCompare = useDemo((s) => s.setCompare)
  const nav = useNavigate()
  const step = ADVISOR_STEPS[st.step]
  const ready = step?.qs.every((q) => { const v = st.answers[q.id]; return q.multi ? Array.isArray(v) && v.length > 0 : !!v })
  const result = useMemo(() => st.done ? recommend(st.answers) : null, [st.done, st.answers])
  const finish = (st.answers.acabado as string | undefined)?.toLowerCase()
  const finishId: FinishId = finish === 'antracita' ? 'antracita' : finish === 'madera' ? 'madera' : 'blanco'

  const summary = Object.entries(st.answers).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' · ')
  const configure = (slug: string) => {
    const t = (slug === 'elevadora' ? 'corredera' : slug) as Typology
    const sol = typologyBySlug(t)
    const leaves = sol?.demo?.config.leaves ?? 2
    const [w, h] = TYPOLOGY_DEFAULT_SIZE[t][leaves]
    setDraft({ config: { ...(sol?.demo?.config ?? useDemo.getState().draft.config), finishInterior: finishId, finishExterior: finishId, widthMm: w, heightMm: h }, loadedId: undefined, name: `${sol?.name ?? 'Configuración'} · desde asesor`, notes: `Orientación del asesor (demo) → ${summary}` })
    nav('/profesional/configurador')
  }

  return (
    <div>
      <PageHeader eyebrow="Herramientas" title="Asesor guiado" text="Cinco pasos para orientar la elección. Devuelve tipologías con su porqué y lo que Deken debe revisar; no es un diagnóstico técnico ni normativo." actions={(st.step > 0 || st.done) && <Button variant="ghost" size="sm" icon={<RotateCcw size={15} aria-hidden />} onClick={reset}>Empezar de nuevo</Button>} />
      {!st.done ? (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <ol className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Progreso">
            {ADVISOR_STEPS.map((s, i) => (
              <li key={s.title} className="shrink-0">
                <button onClick={() => i < st.step && set({ step: i })} disabled={i > st.step} aria-current={i === st.step ? 'step' : undefined}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 text-left text-[0.86rem] font-semibold ${i === st.step ? 'bg-surface shadow-1' : i < st.step ? 'text-ink-2 hover:bg-surface/70' : 'text-ink-3'}`}>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.72rem] font-bold tnum ${i < st.step ? 'bg-green text-night' : i === st.step ? 'border-2 border-ink' : 'border border-line-2'}`}>{i < st.step ? <Check size={13} aria-hidden /> : i + 1}</span>
                  {s.title}
                </button>
              </li>
            ))}
          </ol>
          <section className="rounded-[16px] border border-line bg-surface p-5 md:p-8">
            <p className="label text-ink-3">Paso {st.step + 1} de {ADVISOR_STEPS.length}</p>
            <h2 className="mt-2 text-[1.5rem] font-extrabold tracking-tight">{step.title}</h2>
            <p className="mt-1 text-ink-2">{step.text}</p>
            <div className="mt-6 space-y-6">
              {step.qs.map((q) => (
                <fieldset key={q.id}>
                  <legend className="mb-3 text-[0.9rem] font-bold">{q.label}{q.multi && <span className="ml-2 font-normal text-ink-3">(varias)</span>}</legend>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((o) => {
                      const v = st.answers[q.id]
                      const on = q.multi ? Array.isArray(v) && v.includes(o) : v === o
                      return (
                        <label key={o} className="cursor-pointer">
                          <input type={q.multi ? 'checkbox' : 'radio'} name={q.id} className="peer sr-only" checked={on}
                            onChange={() => {
                              if (!q.multi) return set({ answers: { [q.id]: o } })
                              const arr = Array.isArray(v) ? v : []
                              set({ answers: { [q.id]: on ? arr.filter((x) => x !== o) : [...arr, o] } })
                            }} />
                          <span className={`inline-flex min-h-11 items-center gap-2 rounded-[10px] border px-4 text-[0.88rem] font-semibold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-green-deep ${on ? 'border-ink bg-ink text-white' : 'border-line-2 hover:border-ink-3'}`}>
                            {on && <Check size={14} aria-hidden />}{o}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-between gap-2 border-t border-line pt-5">
              <Button variant="outline" icon={<ArrowLeft size={16} aria-hidden />} disabled={st.step === 0} onClick={() => set({ step: st.step - 1 })}>Atrás</Button>
              {st.step < ADVISOR_STEPS.length - 1
                ? <Button disabled={!ready} iconRight={<ArrowRight size={16} aria-hidden />} onClick={() => set({ step: st.step + 1 })}>Siguiente</Button>
                : <Button disabled={!ready} onClick={() => set({ done: true })}>Ver orientación</Button>}
            </div>
          </section>
        </div>
      ) : result && (
        <div className="space-y-6">
          <Notice tone="neutral">Orientación generada con reglas locales sencillas a partir de tus respuestas. Tus respuestas se conservan: puedes ir al comparador o al configurador y volver sin repetir el recorrido.</Notice>
          <ul className="grid gap-4 lg:grid-cols-3">
            {result.recs.map((r, i) => {
              const sol = typologyBySlug(r.slug)!
              return (
                <li key={r.slug} className="flex flex-col overflow-hidden rounded-[16px] border border-line bg-surface">
                  <div className="relative aspect-[16/10] bg-night"><Poster src={sol.poster} alt="" className="h-full w-full object-cover" />{i === 0 && <span className="absolute left-3 top-3"><Badge tone="green">Primera opción</Badge></span>}</div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-2 text-[1.2rem] font-extrabold tracking-tight"><OpeningGlyph slug={r.slug} className="h-6 w-auto" />{sol.name}</p>
                    <p className="label mt-3 !text-[0.6rem] text-ink-3">Por qué puede encajar</p>
                    <ul className="mt-1.5 space-y-1.5">{r.why.map((w) => <li key={w} className="flex gap-2 text-[0.88rem] text-ink-2"><Check size={15} className="mt-0.5 shrink-0 text-green-ink" aria-hidden />{w}</li>)}</ul>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      {sol.demo ? <Button size="sm" icon={<Box size={14} aria-hidden />} onClick={() => configure(r.slug)}>Configurar</Button> : <Button size="sm" variant="outline" to={`/soluciones/${r.slug}`}>Ver ficha visual</Button>}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <section className="rounded-[16px] border border-line bg-surface p-5 md:p-6">
            <h2 className="text-[1.05rem] font-bold">Qué revisará Deken</h2>
            <ul className="mt-3 space-y-2">{result.review.map((x) => <li key={x} className="flex gap-3 text-[0.9rem] text-ink-2"><span className="mt-2.5 h-px w-3 shrink-0 bg-green" aria-hidden />{x}</li>)}</ul>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
              <Button variant="dark" icon={<Columns3 size={15} aria-hidden />} onClick={() => { const ids = Array.from(new Set(result.recs.map((r) => TYPOLOGY_TO_EXAMPLE[r.slug]))); setCompare(ids.length >= 2 ? ids.slice(0, 3) : [...ids, ids[0] === 'ej-a' ? 'ej-b' : 'ej-a']); nav('/profesional/comparador') }}>Comparar opciones</Button>
              <Button variant="outline" icon={<BookOpen size={15} aria-hidden />} to="/profesional/biblioteca/tipos-de-apertura">Guía de aperturas</Button>
              <Button icon={<Send size={15} aria-hidden />} onClick={() => configure(result.recs[0].slug)}>Preparar solicitud</Button>
            </div>
            <p className="mt-3 text-[0.78rem] text-ink-3">«Preparar solicitud» abre el configurador con la primera opción y tus respuestas en las notas, para guardarla y solicitar presupuesto.</p>
          </section>
          <button onClick={() => set({ done: false, step: ADVISOR_STEPS.length - 1 })} className="text-[0.86rem] font-semibold text-green-ink hover:underline">← Revisar respuestas</button>
        </div>
      )}
    </div>
  )
}

/* ======================================= Biblioteca ======================================= */
const KIND: Record<string, string> = { guia: 'Guía', ficha: 'Ficha técnica', muestrario: 'Muestrario', plantilla: 'Plantilla', nota: 'Nota interna' }
const LANG: Record<string, string> = { es: 'Español', en: 'Inglés', de: 'Alemán' }

export function LibraryList() {
  // Selector estable (Zustand 5): se filtra fuera del selector para no crear un array nuevo en cada lectura.
  const library = useDemo((s) => s.library)
  const docs = useMemo(() => library.filter((d) => d.status === 'publicado' && d.visibility !== 'interno'), [library])
  const [q, setQ] = useState('')
  const [f, setF] = useState({ product: '', manufacturer: '', kind: '', language: '' })
  const products = Array.from(new Set(docs.flatMap((d) => d.products))).sort()
  const manufacturers = Array.from(new Set(docs.map((d) => d.manufacturer))).sort()
  const list = docs.filter((d) => {
    const text = (d.title + ' ' + d.description + ' ' + d.sections.map((s) => s.title + ' ' + s.body.join(' ')).join(' ')).toLowerCase()
    return (!q || text.includes(q.toLowerCase())) && (!f.product || d.products.includes(f.product)) && (!f.manufacturer || d.manufacturer === f.manufacturer) && (!f.kind || d.kind === f.kind) && (!f.language || d.language === f.language)
  }).sort((a, b) => b.date.localeCompare(a.date))
  const sel = (k: keyof typeof f, label: string, opts: [string, string][]) => (
    <div className="min-w-[150px] flex-1">
      <label htmlFor={`lib-${k}`} className="mb-1 block text-[0.74rem] font-semibold text-ink-2">{label}</label>
      <select id={`lib-${k}`} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="field !min-h-10 !py-1.5 text-[0.86rem]">
        <option value="">Todos</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )
  const active = Object.values(f).filter(Boolean).length + (q ? 1 : 0)
  return (
    <div>
      <PageHeader eyebrow="Herramientas" title="Biblioteca" text="Documentación profesional y guías aprobadas. En esta entrega todos los documentos son de demostración: los catálogos y fichas reales se incorporarán cuando se aporten." />
      <div className="mb-5 rounded-[14px] border border-line bg-surface p-4">
        <label htmlFor="lib-q" className="sr-only">Buscar en la biblioteca</label>
        <input id="lib-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por título o contenido…" className="field" />
        <div className="mt-3 flex flex-wrap gap-3">
          {sel('product', 'Familia o producto', products.map((p) => [p, p]))}
          {sel('manufacturer', 'Fabricante / origen', manufacturers.map((m) => [m, m]))}
          {sel('kind', 'Tipo de documento', Object.entries(KIND).filter(([k]) => k !== 'nota'))}
          {sel('language', 'Idioma original', Object.entries(LANG))}
        </div>
        {active > 0 && <button onClick={() => { setQ(''); setF({ product: '', manufacturer: '', kind: '', language: '' }) }} className="mt-3 text-[0.82rem] font-semibold text-green-ink hover:underline">Quitar filtros ({active})</button>}
      </div>
      <p className="mb-3 text-[0.84rem] text-ink-3" aria-live="polite">{list.length} documentos</p>
      {list.length === 0 ? <EmptyState icon={<SearchX size={26} />} title="Ningún documento coincide" text="Prueba con otra búsqueda o pregunta al asistente." /> : (
        <ul className="overflow-hidden rounded-[14px] border border-line bg-surface">
          {list.map((d) => (
            <li key={d.id} className="border-b border-line last:border-0">
              <Link to={`/profesional/biblioteca/${d.slug}`} className="grid gap-2 px-5 py-4 hover:bg-paper/70 md:grid-cols-[1fr_auto] md:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><Badge>{KIND[d.kind]}</Badge><Badge tone={d.visibility === 'publico' ? 'green' : 'info'}>{d.visibility === 'publico' ? 'Público' : 'Profesional'}</Badge><DemoTag>Doc. de demostración</DemoTag></div>
                  <p className="mt-2 text-[1rem] font-bold">{d.title}</p>
                  <p className="mt-0.5 text-[0.86rem] text-ink-2">{d.description}</p>
                </div>
                <div className="flex flex-wrap gap-x-4 text-[0.78rem] text-ink-3 md:flex-col md:text-right">
                  <span>{d.manufacturer}</span><span className="tnum">v{d.version} · {fmtDate(d.date)}</span><span>{LANG[d.language]}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function LibraryDetail() {
  const { slug = '' } = useParams()
  const d = useDemo((s) => s.library.find((x) => x.slug === slug))
  const library = useDemo((s) => s.library)
  const [chat, setChat] = useState(false)
  if (!d) return <NotFound />
  if (d.visibility === 'interno' || d.status !== 'publicado') {
    return <EmptyState icon={<Info size={26} />} title="Documento no disponible" text="Este documento está en revisión editorial o es de uso interno." action={<Button to="/profesional/biblioteca" variant="outline">Volver a la biblioteca</Button>} />
  }
  const related = library.filter((x) => x.id !== d.id && x.status === 'publicado' && x.visibility !== 'interno' && (x.category === d.category || x.products.some((p) => d.products.includes(p)))).slice(0, 3)
  return (
    <div>
      <Link to="/profesional/biblioteca" className="mb-4 inline-flex min-h-9 items-center gap-1.5 text-[0.84rem] font-semibold text-ink-2 hover:text-ink">← Biblioteca</Link>
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <article className="min-w-0 rounded-[16px] border border-line bg-surface p-5 md:p-8">
          <div className="flex flex-wrap items-center gap-2"><Badge>{KIND[d.kind]}</Badge><DemoTag>Documento creado para la demo</DemoTag></div>
          <h1 className="h-section mt-4 text-[1.8rem] md:text-[2.2rem]">{d.title}</h1>
          <p className="mt-3 text-ink-2">{d.description}</p>
          {d.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 border-t border-line pt-5 mt-6 first-of-type:mt-6">
              <h2 className="text-[1.15rem] font-bold">{s.title}</h2>
              {s.body.map((b) => <p key={b} className="mt-2 leading-relaxed text-ink-2">{b}</p>)}
            </section>
          ))}
        </article>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[14px] border border-line bg-surface p-5">
            <dl className="space-y-3 text-[0.86rem]">
              <div><dt className="label text-ink-3">Categoría</dt><dd className="mt-0.5 font-semibold">{d.category}</dd></div>
              <div><dt className="label text-ink-3">Productos relacionados</dt><dd className="mt-0.5">{d.products.length ? d.products.join(', ') : '—'}</dd></div>
              <div><dt className="label text-ink-3">Origen</dt><dd className="mt-0.5">{d.manufacturer} · demo</dd></div>
              <div><dt className="label text-ink-3">Versión</dt><dd className="tnum mt-0.5">{d.version} · {fmtDate(d.date)}</dd></div>
              <div><dt className="label text-ink-3">Idioma original</dt><dd className="mt-0.5">{LANG[d.language]}</dd></div>
            </dl>
            <div className="mt-5 flex flex-col gap-2">
              <Button icon={<FileDown size={15} aria-hidden />} onClick={async () => { await downloadLibraryDoc(d); toast('PDF de demostración descargado', d.title) }}>Descargar PDF (demo)</Button>
              <Button variant="dark" icon={<Bot size={15} aria-hidden />} onClick={() => setChat(true)}>Preguntar al asistente</Button>
            </div>
          </div>
          {related.length > 0 && (
            <div className="rounded-[14px] border border-line bg-surface p-5">
              <p className="label text-ink-3">Relacionados</p>
              <ul className="mt-2 space-y-2">{related.map((r) => <li key={r.id}><Link to={`/profesional/biblioteca/${r.slug}`} className="text-[0.88rem] font-semibold hover:underline">{r.title}</Link></li>)}</ul>
            </div>
          )}
        </aside>
      </div>
      <Dialog open={chat} onClose={() => setChat(false)} title="Asistente documental" description={`Contexto: ${d.title}`} variant="drawer">
        <AssistantChat compact initialQuestion={d.kind === 'guia' ? `Sobre «${d.title}»: ` : ''} />
      </Dialog>
    </div>
  )
}


