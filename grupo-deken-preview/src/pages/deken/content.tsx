import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { FileUp, PenLine, CheckCircle2, Globe2, Users, Lock, ArrowRight, Upload, FileSpreadsheet, AlertTriangle, Check, RotateCcw, Download } from 'lucide-react'
import { useDemo, ORDER_STATUS_LABEL, today } from '@/demo/store'
import type { DocSection, EditorialStatus, LibraryDoc, OrderStatus, Visibility } from '@/demo/types'
import { Button } from '@/ui/Button'
import { Dialog, toast } from '@/ui/Dialog'
import { PageHeader, Badge, Notice, TextInput, SelectInput, EmptyState, DemoTag } from '@/ui/primitives'
import { fmtDate, fmtDateTime, Section } from '../shared'

const STATUS: Record<EditorialStatus, [string, 'neutral' | 'warn' | 'info' | 'green']> = {
  incorporado: ['Incorporado', 'neutral'], borrador: ['Borrador', 'warn'], revision: ['En revisión', 'info'], aprobado: ['Aprobado', 'green'], publicado: ['Publicado', 'green'],
}
const VIS: Record<Visibility, [string, React.ReactNode]> = {
  publico: ['Público', <Globe2 key="g" size={13} aria-hidden />], profesional: ['Profesional', <Users key="u" size={13} aria-hidden />], interno: ['Interno', <Lock key="l" size={13} aria-hidden />],
}
const CATEGORIES = ['Elección de producto', 'Presupuesto y suministro', 'Acabados', 'Fichas técnicas', 'Herrajes', 'Interno', 'Sin clasificar']

/* ------------------------------ Editor de revisión ------------------------------ */
export function DocEditor({ id, onClose }: { id: string | null; onClose: () => void }) {
  const doc = useDemo((s) => s.library.find((d) => d.id === id))
  const clusters = useDemo((s) => s.clusters)
  const update = useDemo((s) => s.updateDocSections)
  const setStatus = useDemo((s) => s.setDocStatus)
  const setVis = useDemo((s) => s.setDocVisibility)
  const setCat = useDemo((s) => s.setDocCategory)
  const [title, setTitle] = useState('')
  const [secs, setSecs] = useState<DocSection[]>([])
  const [loadedId, setLoadedId] = useState<string | null>(null)
  if (doc && loadedId !== doc.id) { setLoadedId(doc.id); setTitle(doc.title); setSecs(structuredClone(doc.sections)) }
  if (!doc) return null
  const dirty = title !== doc.title || JSON.stringify(secs) !== JSON.stringify(doc.sections)
  const placeholders = secs.some((s) => s.body.some((b) => /\[(revisar|completar)/i.test(b)))
  const cluster = clusters.find((c) => c.id === doc.fromCluster)
  const saveText = () => { update(doc.id, secs, title); toast('Cambios guardados (demo)') }
  const flow: EditorialStatus[] = ['incorporado', 'borrador', 'revision', 'aprobado', 'publicado']
  return (
    <Dialog open={!!id} onClose={onClose} title="Revisión editorial" description={doc.origin === 'demo' ? 'Documento de demostración' : ''} variant="drawer"
      footer={<>
        {dirty && <Button variant="outline" onClick={saveText}>Guardar texto</Button>}
        {(doc.status === 'borrador' || doc.status === 'incorporado') && <Button variant="dark" onClick={() => { if (dirty) update(doc.id, secs, title); setStatus(doc.id, 'revision'); toast('Enviado a revisión (demo)') }}>Enviar a revisión</Button>}
        {doc.status === 'revision' && <Button variant="dark" disabled={placeholders} onClick={() => { if (dirty) update(doc.id, secs, title); setStatus(doc.id, 'aprobado'); toast('Contenido aprobado (demo)', 'Elige la visibilidad y publícalo.') }}>Aprobar</Button>}
        {doc.status === 'aprobado' && <Button onClick={() => { setStatus(doc.id, 'publicado'); toast('Publicado en la demo', doc.visibility === 'publico' ? 'Visible en Conocimiento (web pública).' : doc.visibility === 'profesional' ? 'Visible en la biblioteca profesional.' : 'Visible solo para el equipo.') }}>Publicar</Button>}
        {doc.status === 'publicado' && <Button variant="outline" onClick={() => { setStatus(doc.id, 'revision'); toast('Retirado a revisión (demo)') }}>Retirar a revisión</Button>}
      </>}>
      <div className="space-y-5">
        <ol className="flex flex-wrap gap-1.5" aria-label="Estado editorial">
          {flow.map((f) => {
            const i = flow.indexOf(f), cur = flow.indexOf(doc.status)
            return <li key={f}><Badge tone={i < cur ? 'green' : i === cur ? STATUS[f][1] : 'neutral'} className={i > cur ? 'opacity-50' : ''}>{i < cur && <Check size={11} aria-hidden />}{STATUS[f][0]}</Badge></li>
          })}
        </ol>
        {cluster && <Notice tone="info" title="Propuesta a partir de preguntas">Generada desde el tema «{cluster.topic}» ({cluster.questions.length} preguntas). Requiere revisión humana: una consulta no modifica información técnica ni publica nada por sí sola.</Notice>}
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectInput label="Clasificación" value={doc.category} onChange={(e) => setCat(doc.id, e.target.value)} options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
          <SelectInput label="Visibilidad al publicar" value={doc.visibility} onChange={(e) => setVis(doc.id, e.target.value as Visibility)} options={[{ value: 'publico', label: 'Público (web)' }, { value: 'profesional', label: 'Profesional (biblioteca)' }, { value: 'interno', label: 'Interno (equipo)' }]} />
        </div>
        <TextInput label="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        {secs.map((s, i) => (
          <div key={s.id} className="rounded-[10px] border border-line p-3">
            <label htmlFor={`sec-${s.id}`} className="text-[0.84rem] font-bold">{s.title}</label>
            <textarea id={`sec-${s.id}`} className="field mt-2 !min-h-24 text-[0.88rem]" value={s.body.join('\n')} onChange={(e) => setSecs(secs.map((x, j) => j === i ? { ...x, body: e.target.value.split('\n') } : x))} />
            {s.body.some((b) => /\[(revisar|completar)/i.test(b)) && <p className="mt-1 text-[0.76rem] font-semibold text-warn">Contiene marcas [Revisar]/[Completar]: resuélvelas antes de aprobar.</p>}
          </div>
        ))}
        <p className="text-[0.78rem] text-ink-3">Modelo futuro: documento original · texto extraído · metadatos · fuentes · aprobación · visibilidad se guardarán por separado (ver docs/SIGUIENTE_FASE.md).</p>
      </div>
    </Dialog>
  )
}

/* ------------------------------ Contenidos ------------------------------ */
const PENDING_MATERIALS = ['DXF de perfiles y secciones', 'Catálogos técnicos Schüco', 'Documentación de herrajes', 'Documentación de vidrios', 'Persianas y accesorios', 'Logotipo y material corporativo']

export function Contents() {
  const docs = useDemo((s) => s.library)
  const [edit, setEdit] = useState<string | null>(null)
  const [filter, setFilter] = useState<'todos' | EditorialStatus>('todos')
  const fileRef = useRef<HTMLInputElement>(null)
  const list = docs.filter((d) => filter === 'todos' || d.status === filter)
  const incorporate = (name: string) => {
    const id = 'd' + Math.random().toString(36).slice(2, 7)
    const doc: LibraryDoc = {
      id, slug: `incorporado-${id}`, kind: 'ficha', title: name.replace(/\.[^.]+$/, ''), description: `Archivo incorporado manualmente: ${name}. Texto pendiente de transcripción y revisión.`,
      category: 'Sin clasificar', products: [], manufacturer: 'Pendiente de identificar', language: 'es', version: '—', date: today(), visibility: 'interno', status: 'incorporado', origin: 'demo',
      sections: [{ id: 'resumen', title: 'Resumen', body: ['[Completar] Resumen redactado por el equipo tras revisar el documento original.'] }],
    }
    useDemo.setState((s) => ({ library: [...s.library, doc] }))
    setEdit(id)
    toast('Documento incorporado (solo nombre)', 'No se ha subido ni extraído su contenido: queda como interno para revisión.')
  }
  return (
    <div>
      <PageHeader eyebrow="Panel interno" title="Biblioteca y revisión editorial" text="Clasifica, revisa y publica contenidos según permisos." actions={<>
        <input ref={fileRef} type="file" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) incorporate(f.name); e.target.value = '' }} />
        <Button icon={<FileUp size={16} aria-hidden />} onClick={() => fileRef.current?.click()}>Incorporar documento</Button>
      </>} />
      <section className="mb-6 overflow-x-auto rounded-[14px] border border-line bg-surface p-5">
        <ol className="flex min-w-[760px] items-center gap-2 text-[0.78rem] font-semibold">
          {['Documento incorporado', 'Revisión y clasificación', 'Contenido aprobado', 'Publicación según permisos', 'Consultas recibidas', 'Propuesta de nueva guía', 'Revisión humana'].map((t, i, a) => (
            <li key={t} className="flex items-center gap-2"><span className={`rounded-[8px] border px-3 py-2 ${i >= 4 ? 'border-green/40 bg-green-soft text-green-deep' : 'border-line bg-paper'}`}>{t}</span>{i < a.length - 1 && <ArrowRight size={14} className="shrink-0 text-ink-3" aria-hidden />}</li>
          ))}
        </ol>
        <p className="mt-3 text-[0.78rem] text-ink-3">Las preguntas alimentan propuestas de guía (ver <Link to="/deken/preguntas" className="font-semibold underline">Preguntas</Link>). Indexar un contenido interno no lo hace público.</p>
      </section>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(['todos', 'incorporado', 'borrador', 'revision', 'aprobado', 'publicado'] as const).map((k) => (
          <button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k} className={`min-h-9 rounded-full border px-3.5 text-[0.82rem] font-semibold ${filter === k ? 'border-ink bg-ink text-white' : 'border-line-2 bg-surface text-ink-2 hover:border-ink-3'}`}>{k === 'todos' ? 'Todos' : STATUS[k][0]} <span className="tnum opacity-70">{k === 'todos' ? docs.length : docs.filter((d) => d.status === k).length}</span></button>
        ))}
      </div>
      <div className="thin-scroll overflow-x-auto rounded-[14px] border border-line bg-surface">
        <table className="w-full min-w-[560px] text-left text-[0.86rem]">
          <caption className="sr-only">Documentos de la biblioteca</caption>
          <thead className="border-b border-line bg-paper-2/60 text-[0.78rem] text-ink-2"><tr><th className="px-4 py-3 font-semibold">Documento</th><th className="hidden px-4 py-3 font-semibold md:table-cell">Clasificación</th><th className="px-4 py-3 font-semibold">Visibilidad</th><th className="px-4 py-3 font-semibold">Estado</th><th className="px-4 py-3"><span className="sr-only">Acciones</span></th></tr></thead>
          <tbody>{list.map((d) => (
            <tr key={d.id} className="border-b border-line last:border-0">
              <td className="px-4 py-3"><p className="font-bold">{d.title}</p><p className="text-[0.76rem] text-ink-3">{d.manufacturer} · v{d.version} · {fmtDate(d.date)} · {d.language.toUpperCase()}</p></td>
              <td className="hidden px-4 py-3 md:table-cell">{d.category}</td>
              <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-[0.82rem] font-semibold">{VIS[d.visibility][1]}{VIS[d.visibility][0]}</span></td>
              <td className="px-4 py-3"><Badge tone={STATUS[d.status][1]} dot>{STATUS[d.status][0]}</Badge></td>
              <td className="px-4 py-3 text-right"><Button size="sm" variant={d.status === 'publicado' ? 'outline' : 'dark'} icon={<PenLine size={13} aria-hidden />} onClick={() => setEdit(d.id)}>{d.status === 'publicado' ? 'Ver' : 'Revisar'}</Button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <Section title="Materiales pendientes de aportar" className="mt-6">
        <ul className="grid gap-2 py-2 sm:grid-cols-2 lg:grid-cols-3">
          {PENDING_MATERIALS.map((m) => <li key={m} className="flex items-center gap-2 rounded-[8px] border border-dashed border-line-2 px-3 py-2.5 text-[0.84rem]"><Upload size={14} className="text-ink-3" aria-hidden />{m}<span className="ml-auto text-[0.72rem] text-ink-3">No aportado</span></li>)}
        </ul>
      </Section>
      <DocEditor id={edit} onClose={() => setEdit(null)} />
    </div>
  )
}

/* ------------------------------ Preguntas ------------------------------ */
export function Questions() {
  const clusters = useDemo((s) => s.clusters)
  const library = useDemo((s) => s.library)
  const createDraft = useDemo((s) => s.createDraftFromCluster)
  const [edit, setEdit] = useState<string | null>(null)
  const sorted = [...clusters].sort((a, b) => b.questions.length - a.questions.length)
  return (
    <div>
      <PageHeader eyebrow="Panel interno" title="Preguntas de visitantes y profesionales" text="Temas agrupados de consultas públicas y del asistente (frecuencias de demostración). Sirven para detectar vacíos y proponer guías; siempre con revisión humana." />
      <ul className="space-y-4">
        {sorted.map((c) => {
          const draft = library.find((d) => d.id === c.draftId)
          const covered = library.find((d) => d.id === c.coveredBy)
          return (
            <li key={c.id} className="rounded-[14px] border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[1.05rem] font-bold">{c.topic}</p>
                  <p className="mt-0.5 text-[0.84rem] text-ink-2">{c.note}</p>
                </div>
                <span className="tnum rounded-[8px] bg-paper-2 px-3 py-1.5 text-center"><span className="block text-[1.3rem] font-extrabold leading-none">{c.questions.length}</span><span className="label !text-[0.55rem] text-ink-3">consultas</span></span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.gap === 'sin-contenido' && <Badge tone="warn" dot>Vacío de contenido</Badge>}
                {c.gap === 'cubierto' && <Badge tone="green" dot>Cubierto</Badge>}
                {c.gap === 'requiere-documentacion' && <Badge tone="danger" dot>Requiere documentación técnica</Badge>}
                {covered && <Link to={`/conocimiento/${covered.slug}`} className="text-[0.8rem] font-semibold text-green-ink hover:underline">{covered.title}</Link>}
              </div>
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {c.questions.slice(-4).map((q) => <li key={q.id} className="truncate rounded-[8px] bg-paper px-3 py-2 text-[0.82rem]">«{q.text}» <span className="text-ink-3">· {q.from} · {fmtDate(q.date)}</span></li>)}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {draft ? (
                  <>
                    <Badge tone={draft.status === 'publicado' ? 'green' : 'info'}>Borrador: {draft.status}</Badge>
                    <Button size="sm" variant="dark" icon={<PenLine size={13} aria-hidden />} onClick={() => setEdit(draft.id)}>{draft.status === 'publicado' ? 'Ver guía' : 'Revisar borrador'}</Button>
                    {draft.status === 'publicado' && draft.visibility === 'publico' && <Button size="sm" variant="outline" to={`/conocimiento/${draft.slug}`}>Ver en la web pública</Button>}
                  </>
                ) : c.gap === 'sin-contenido' ? (
                  <Button size="sm" variant="outline" onClick={() => { const id = createDraft(c.id); setEdit(id); toast('Borrador propuesto (demo)', 'Revísalo antes de aprobarlo.') }}>Proponer borrador de guía</Button>
                ) : c.gap === 'requiere-documentacion' ? (
                  <p className="text-[0.8rem] text-ink-3">No se propone borrador con cifras: primero hay que incorporar las fichas oficiales.</p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
      <DocEditor id={edit} onClose={() => setEdit(null)} />
    </div>
  )
}

/* ------------------------------ Importaciones ------------------------------ */
const FIELDS = [
  { id: 'ref', label: 'Referencia de pedido', match: /ref|pedido/i, required: true },
  { id: 'project', label: 'Proyecto', match: /proyecto|obra/i },
  { id: 'phase', label: 'Fase', match: /fase/i },
  { id: 'status', label: 'Estado', match: /estado/i },
  { id: 'forecast', label: 'Fecha prevista', match: /prevista|previsi/i },
  { id: 'confirmed', label: 'Fecha confirmada', match: /confirmad/i },
  { id: 'note', label: 'Observaciones', match: /observ|nota/i },
] as const
type FieldId = typeof FIELDS[number]['id']
const STATUS_CODES: Record<string, OrderStatus> = { DOC: 'documentacion', REV: 'revision', FAB: 'fabricacion', LISTO: 'expedicion', ENTREGADO: 'entregado' }

function parseCsv(text: string) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() && !l.startsWith('#'))
  const sep = (lines[0].match(/;/g)?.length ?? 0) >= (lines[0].match(/,/g)?.length ?? 0) ? ';' : ','
  const rows = lines.map((l) => l.split(sep).map((c) => c.trim()))
  return { headers: rows[0], rows: rows.slice(1) }
}
function parseDate(v: string): string | null | undefined {
  if (!v) return undefined
  let m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) { const [, d, mo, y] = m.map(Number) as unknown as number[]; if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`; return null }
  m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m) return v
  return null
}

export function Imports() {
  const s = useDemo()
  const apply = useDemo((st) => st.applyImport)
  const [step, setStep] = useState(0)
  const [file, setFile] = useState<{ name: string; headers: string[]; rows: string[][]; sample: boolean } | null>(null)
  const [map, setMap] = useState<Record<FieldId, number>>({} as Record<FieldId, number>)
  const [statusMap, setStatusMap] = useState<Record<string, OrderStatus | 'omitir'>>({})
  const [result, setResult] = useState<{ updated: number; created: number; skipped: number } | null>(null)
  const localRef = useRef<HTMLInputElement>(null)

  const load = (name: string, text: string, sample: boolean) => {
    const { headers, rows } = parseCsv(text)
    const m = {} as Record<FieldId, number>
    FIELDS.forEach((f) => { const i = headers.findIndex((h) => f.match.test(h)); m[f.id] = i })
    setFile({ name, headers, rows, sample }); setMap(m); setStatusMap({}); setResult(null); setStep(1)
  }
  const useSample = async () => {
    try {
      const r = await fetch('/samples/importacion-pedidos-EJEMPLO.csv')
      load('importacion-pedidos-EJEMPLO.csv', await r.text(), true)
    } catch { toast('No se pudo cargar la plantilla de ejemplo', undefined, 'warn') }
  }

  const unknownCodes = useMemo(() => {
    if (!file || map.status < 0) return []
    return Array.from(new Set(file.rows.map((r) => (r[map.status] ?? '').toUpperCase()).filter((c) => c && !STATUS_CODES[c])))
  }, [file, map.status])

  const preview = useMemo(() => {
    if (!file) return []
    const seen = new Set<string>()
    return file.rows.map((r, i) => {
      const get = (f: FieldId) => (map[f] >= 0 ? r[map[f]] ?? '' : '')
      const ref = get('ref')
      const issues: string[] = []
      const code = get('status').toUpperCase()
      const status: OrderStatus | undefined = STATUS_CODES[code] ?? (statusMap[code] && statusMap[code] !== 'omitir' ? statusMap[code] as OrderStatus : undefined)
      if (code && !STATUS_CODES[code] && !statusMap[code]) issues.push(`Estado «${code}» sin correspondencia`)
      const fc = parseDate(get('forecast')), cf = parseDate(get('confirmed'))
      if (fc === null) issues.push(`Fecha prevista no válida «${get('forecast')}» (se ignorará)`)
      if (cf === null) issues.push(`Fecha confirmada no válida «${get('confirmed')}» (se ignorará)`)
      const existing = s.orders.find((o) => o.ref === ref)
      const proj = s.projects.find((p) => p.ref === get('project'))
      let action: 'actualizar' | 'crear' | 'sin-cambios' | 'error' | 'duplicado' = 'error'
      if (!ref) issues.unshift('Falta la referencia de pedido')
      else if (seen.has(ref)) action = 'duplicado'
      else if (existing) {
        const changes = (status && status !== existing.status) || (fc && fc !== existing.forecastDate) || (cf && cf !== existing.confirmedDate)
        action = changes ? 'actualizar' : 'sin-cambios'
      } else if (!proj) issues.push(`Proyecto «${get('project') || '—'}» no encontrado`)
      else action = 'crear'
      if (ref) seen.add(ref)
      if (action !== 'error' && !ref) action = 'error'
      if (issues.some((x) => /Falta|no encontrado/.test(x))) action = 'error'
      return { i: i + 1, ref, project: get('project'), phase: get('phase'), code, status, forecast: fc || undefined, confirmed: cf || undefined, note: get('note'), action, issues, existing }
    })
  }, [file, map, statusMap, s.orders, s.projects])

  const valid = preview.filter((p) => p.action === 'actualizar' || p.action === 'crear')
  const blocking = map.ref < 0
  const confirm = () => {
    const r = apply(valid.map((v) => ({ ref: v.ref, status: v.status, forecastDate: v.forecast, confirmedDate: v.confirmed, note: v.note, projectRef: v.project, phase: v.phase, create: v.action === 'crear' })), file!.name, preview.length - valid.length, preview.filter((p) => p.issues.length).length)
    setResult({ ...r, skipped: preview.length - valid.length }); setStep(4)
    toast('Importación aplicada a la demo', `${r.updated} actualizados · ${r.created} creados`)
  }
  const tone = (a: string) => a === 'actualizar' ? 'info' : a === 'crear' ? 'green' : a === 'sin-cambios' ? 'neutral' : a === 'duplicado' ? 'warn' : 'danger'
  const STEPS = ['Archivo', 'Columnas', 'Correspondencias', 'Vista previa', 'Resultado']

  return (
    <div>
      <PageHeader eyebrow="Panel interno" title="Importaciones" text="Recorrido simulado para cargar estados de pedidos desde una hoja. Usa una plantilla de ejemplo: no es el formato real de exportación de PrefSuite, ni hay conexión con PrefSuite." />
      <ol className="mb-5 flex flex-wrap gap-2" aria-label="Pasos">
        {STEPS.map((t, i) => <li key={t}><Badge tone={i < step ? 'green' : i === step ? 'info' : 'neutral'} className={i > step ? 'opacity-50' : ''}>{i < step && <Check size={11} aria-hidden />}{i + 1}. {t}</Badge></li>)}
      </ol>

      {step === 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <button onClick={useSample} className="flex flex-col items-start rounded-[14px] border border-line bg-surface p-6 text-left hover:border-ink-3">
            <FileSpreadsheet className="text-green-ink" aria-hidden />
            <p className="mt-4 text-[1.05rem] font-bold">Usar plantilla de ejemplo</p>
            <p className="mt-1 text-[0.88rem] text-ink-2">CSV incluido con la demo, con filas válidas, duplicados, fechas incorrectas, un estado desconocido y una fila sin referencia.</p>
            <DemoTag className="mt-3">Plantilla de ejemplo</DemoTag>
          </button>
          <div className="flex flex-col items-start rounded-[14px] border border-dashed border-line-2 bg-paper p-6">
            <Upload className="text-ink-3" aria-hidden />
            <p className="mt-4 text-[1.05rem] font-bold">Seleccionar un CSV local</p>
            <p className="mt-1 text-[0.88rem] text-ink-2">Se lee solo en el navegador para la vista previa; no se guarda ni se sube.</p>
            <input ref={localRef} type="file" accept=".csv,text/csv" className="sr-only" tabIndex={-1} aria-hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) load(f.name, await f.text(), false); e.target.value = '' }} />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => localRef.current?.click()}>Elegir archivo</Button>
              <Button size="sm" variant="ghost" href="/samples/importacion-pedidos-EJEMPLO.csv" download="importacion-pedidos-EJEMPLO.csv" icon={<Download size={14} aria-hidden />}>Descargar plantilla</Button>
            </div>
          </div>
        </div>
      )}

      {file && step >= 1 && step <= 3 && (
        <Notice tone="neutral" className="mb-4">Archivo: <strong>{file.name}</strong> · {file.rows.length} filas · {file.headers.length} columnas detectadas {file.sample && '· plantilla de ejemplo'}</Notice>
      )}

      {step === 1 && file && (
        <Section title="Columnas detectadas y correspondencia">
          <div className="grid gap-3 py-2 sm:grid-cols-2 lg:grid-cols-3">
            {FIELDS.map((f) => (
              <SelectInput key={f.id} label={`${f.label}${'required' in f && f.required ? ' *' : ''}`} value={String(map[f.id])} onChange={(e) => setMap({ ...map, [f.id]: Number(e.target.value) })}
                options={[{ value: '-1', label: '— No importar —' }, ...file.headers.map((h, i) => ({ value: String(i), label: `Columna ${i + 1}: ${h}` }))]} error={'required' in f && f.required && map[f.id] < 0 ? 'Necesaria para identificar el pedido' : undefined} />
            ))}
          </div>
          <div className="flex justify-between border-t border-line pt-4"><Button variant="outline" onClick={() => setStep(0)}>Atrás</Button><Button disabled={blocking} onClick={() => setStep(2)}>Continuar</Button></div>
        </Section>
      )}

      {step === 2 && file && (
        <Section title="Correspondencia de valores de estado">
          <div className="py-2">
            <table className="w-full max-w-xl text-left text-[0.86rem]">
              <caption className="sr-only">Códigos de estado</caption>
              <thead className="text-[0.78rem] text-ink-2"><tr><th className="py-2 font-semibold">Valor en el archivo</th><th className="py-2 font-semibold">Estado en la plataforma</th></tr></thead>
              <tbody>
                {Object.entries(STATUS_CODES).map(([k, v]) => <tr key={k} className="border-t border-line"><td className="py-2 font-mono">{k}</td><td className="py-2">{ORDER_STATUS_LABEL[v]} <span className="text-ink-3">(automático)</span></td></tr>)}
                {unknownCodes.map((k) => (
                  <tr key={k} className="border-t border-line bg-warn-soft/50"><td className="py-2 font-mono"><AlertTriangle size={13} className="mr-1 inline text-warn" aria-hidden />{k}</td>
                    <td className="py-2"><label className="sr-only" htmlFor={`map-${k}`}>Correspondencia para {k}</label>
                      <select id={`map-${k}`} className="field !min-h-9 !py-1" value={statusMap[k] ?? ''} onChange={(e) => setStatusMap({ ...statusMap, [k]: e.target.value as OrderStatus })}>
                        <option value="">Elegir…</option>{Object.entries(ORDER_STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}<option value="omitir">No cambiar el estado</option>
                      </select></td></tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[0.8rem] text-ink-3">Fechas aceptadas: dd/mm/aaaa o aaaa-mm-dd. Las no válidas se marcan como incidencia y se ignoran.</p>
          </div>
          <div className="flex justify-between border-t border-line pt-4"><Button variant="outline" onClick={() => setStep(1)}>Atrás</Button><Button onClick={() => setStep(3)}>Ver vista previa</Button></div>
        </Section>
      )}

      {step === 3 && file && (
        <Section title="Vista previa e incidencias">
          <div className="thin-scroll -mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[760px] text-left text-[0.82rem]">
              <caption className="sr-only">Vista previa de filas</caption>
              <thead className="text-[0.74rem] text-ink-2"><tr><th className="py-2 pr-3">Fila</th><th className="py-2 pr-3">Pedido</th><th className="py-2 pr-3">Proyecto</th><th className="py-2 pr-3">Estado</th><th className="py-2 pr-3">Prevista</th><th className="py-2 pr-3">Confirmada</th><th className="py-2 pr-3">Acción</th><th className="py-2">Incidencias</th></tr></thead>
              <tbody>{preview.map((p) => (
                <tr key={p.i} className="border-t border-line align-top">
                  <td className="tnum py-2 pr-3 text-ink-3">{p.i}</td>
                  <td className="py-2 pr-3 font-mono">{p.ref || '—'}</td>
                  <td className="py-2 pr-3">{p.project || '—'}</td>
                  <td className="py-2 pr-3">{p.code || '—'}{p.status && <span className="block text-ink-3">→ {ORDER_STATUS_LABEL[p.status]}</span>}</td>
                  <td className="tnum py-2 pr-3">{p.forecast ?? '—'}</td>
                  <td className="tnum py-2 pr-3">{p.confirmed ?? '—'}</td>
                  <td className="py-2 pr-3"><Badge tone={tone(p.action)}>{{ actualizar: 'Actualizar', crear: 'Crear', 'sin-cambios': 'Sin cambios', duplicado: 'Duplicado · omitir', error: 'Error · omitir' }[p.action]}</Badge></td>
                  <td className="py-2 text-[0.76rem] text-danger">{p.issues.join(' · ')}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <Notice tone="warn" className="mt-4">Se aplicarán <strong>{valid.length}</strong> filas ({valid.filter((v) => v.action === 'actualizar').length} actualizaciones, {valid.filter((v) => v.action === 'crear').length} altas). Se omiten {preview.length - valid.length}. Los cambios afectan solo a los datos de demostración.</Notice>
          <div className="mt-4 flex justify-between border-t border-line pt-4"><Button variant="outline" onClick={() => setStep(2)}>Atrás</Button><Button disabled={!valid.length} onClick={confirm}>Confirmar importación (demo)</Button></div>
        </Section>
      )}

      {step === 4 && result && (
        <div className="rounded-[14px] border border-line bg-surface p-6">
          <CheckCircle2 className="text-green-ink" aria-hidden />
          <p className="mt-3 text-[1.2rem] font-extrabold">Importación aplicada a los datos de demostración</p>
          <p className="mt-1 text-ink-2">{result.updated} pedidos actualizados · {result.created} creados · {result.skipped} filas omitidas. Los cambios aparecen en Pedidos (Deken y cliente).</p>
          <div className="mt-5 flex flex-wrap gap-2"><Button to="/deken/pedidos">Ver pedidos</Button><Button variant="outline" icon={<RotateCcw size={15} aria-hidden />} onClick={() => { setStep(0); setFile(null) }}>Nueva importación</Button></div>
        </div>
      )}

      <Section title="Historial de importaciones" className="mt-6">
        {s.imports.length === 0 ? <p className="py-3 text-[0.86rem] text-ink-3">Sin importaciones en esta demo.</p> : (
          <ul>{s.imports.map((i) => <li key={i.id} className="flex flex-wrap gap-3 border-b border-line py-3 text-[0.86rem] last:border-0"><span className="font-semibold">{i.file}</span><span className="text-ink-3">{fmtDateTime(i.date)}</span><span className="ml-auto tnum">{i.applied} aplicadas · {i.skipped} omitidas · {i.issues} con incidencias</span></li>)}</ul>
        )}
      </Section>
      {s.imports.length === 0 && step === 0 && <div className="mt-6"><EmptyState title="Las importaciones manuales sustituirán a la carga por formulario cuando se conozca el formato real" text="La conexión automática con PrefSuite se estudiará en una fase posterior." /></div>}
    </div>
  )
}
