import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { ArrowRight, Box, FileText, MessageSquarePlus, Paperclip, Send, Upload, FolderPlus, Bot, Clock3, Truck, AlertCircle } from 'lucide-react'
import { useDemo, filesFor, threadsFor, linkLabel, projectOfLink, ORDER_STATUS_LABEL } from '@/demo/store'
import type { DocFile, LinkRef } from '@/demo/types'
import { Button } from '@/ui/Button'
import { Dialog, toast } from '@/ui/Dialog'
import { PageHeader, Stat, EmptyState, Badge, Notice, TextArea, TextInput, DemoTag } from '@/ui/primitives'
import { OpeningGlyph } from '@/ui/OpeningGlyph'
import { TYPOLOGY_NAME } from '@/content/solutions'
import { finishName } from '@/lib/pdf'
import { BackLink, FileRow, fmtDate, fmtDateTime, KIND_LABEL, OrderBadge, OrderProgress, ProjectBadge, QuoteBadge, RequestBadge, Section } from '../shared'
import NotFound from '../public/NotFound'

const CO = 'c1' // empresa de demostración del profesional aprobado

function WelcomeNotice() {
  const seen = useDemo((s) => s.welcomeSeen.pro)
  const mark = useDemo((s) => s.markWelcome)
  if (seen) return null
  return (
    <Notice tone="info" className="mb-6" title="Espacio profesional de demostración">
      <p>Ves los datos ficticios de «Reformas Ejemplo Aljarafe (demo)». Las acciones (guardar, enviar, solicitar) solo cambian el estado local de este navegador. <button onClick={() => mark('pro')} className="font-bold underline">Entendido</button></p>
    </Notice>
  )
}

/* -------------------------------------- Inicio -------------------------------------- */
export function ProHome() {
  const s = useDemo()
  const projects = s.projects.filter((p) => p.companyId === CO)
  const pids = projects.map((p) => p.id)
  const quotes = s.quotes.filter((q) => pids.includes(q.projectId))
  const orders = s.orders.filter((o) => pids.includes(o.projectId))
  const activeOrders = orders.filter((o) => o.status !== 'entregado')
  const unread = s.threads.filter((t) => t.unreadClient)
  const configs = s.configs.filter((c) => pids.includes(c.projectId))
  const newQuotes = quotes.filter((q) => q.status === 'propuesta-disponible')
  const activity = s.activity.filter((a) => a.area !== 'deken').slice(0, 5)
  return (
    <div>
      <WelcomeNotice />
      <PageHeader eyebrow="Reformas Ejemplo Aljarafe (demo)" title="Buenos días, Lucía" text="Esto es lo que requiere tu atención." actions={<Button to="/profesional/configurador" icon={<Box size={16} aria-hidden />}>Nueva configuración</Button>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Proyectos" value={projects.length} to="/profesional/proyectos" />
        <Stat label="Propuestas nuevas" value={newQuotes.length} to="/profesional/presupuestos" />
        <Stat label="Pedidos en curso" value={activeOrders.length} to="/profesional/pedidos" />
        <Stat label="Mensajes sin leer" value={unread.length} to="/profesional/mensajes" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {newQuotes.map((q) => {
            const v = q.versions[q.versions.length - 1]
            const p = s.projects.find((x) => x.id === q.projectId)
            return (
              <Link key={q.id} to={`/profesional/presupuestos/${q.id}`} className="group block rounded-[14px] border border-line bg-surface p-5 hover:border-ink-3">
                <div className="flex flex-wrap items-center gap-2"><QuoteBadge s={q.status} /><span className="label text-ink-3">{q.ref} · versión {v.n}</span></div>
                <p className="mt-3 text-[1.1rem] font-bold">{p?.name}</p>
                <p className="mt-1 text-[0.9rem] text-ink-2">{v.changes ?? v.summary}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[0.84rem] font-bold text-green-ink">Revisar propuesta <ArrowRight size={14} aria-hidden /></p>
              </Link>
            )
          })}
          {activeOrders.map((o) => (
            <Link key={o.id} to={`/profesional/pedidos/${o.id}`} className="block rounded-[14px] border border-line bg-surface p-5 hover:border-ink-3">
              <div className="flex flex-wrap items-center justify-between gap-2"><span className="label text-ink-3">{o.ref} · {o.phase}</span><OrderBadge s={o.status} /></div>
              <p className="mt-3 text-[1.05rem] font-bold">{s.projects.find((p) => p.id === o.projectId)?.name}</p>
              <div className="mt-4"><OrderProgress o={o} /></div>
              <p className="mt-3 text-[0.84rem] text-ink-2">{o.confirmedDate ? <>Entrega confirmada: <strong className="text-ink">{fmtDate(o.confirmedDate)}</strong></> : <>Previsión: <strong className="text-ink">{fmtDate(o.forecastDate)}</strong> · <span className="text-ink-3">por confirmar</span></>}</p>
            </Link>
          ))}
          <Section title="Configuraciones guardadas" actions={<Button to="/profesional/configurador" size="sm" variant="outline">Abrir configurador</Button>}>
            <ul className="divide-y divide-line">
              {configs.slice(-4).reverse().map((c) => <ConfigRow key={c.id} id={c.id} />)}
            </ul>
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="Conversaciones pendientes">
            {unread.length === 0 ? <p className="py-3 text-[0.88rem] text-ink-3">No tienes mensajes sin leer.</p> : (
              <ul>
                {unread.map((t) => (
                  <li key={t.id} className="border-b border-line py-3 last:border-0">
                    <Link to={`/profesional/mensajes?hilo=${t.id}`} className="block hover:underline">
                      <p className="text-[0.9rem] font-bold">{t.subject}</p>
                      <p className="mt-0.5 line-clamp-2 text-[0.82rem] text-ink-2">{t.messages[t.messages.length - 1].text}</p>
                      <p className="label mt-1 !text-[0.6rem] text-ink-3">{linkLabel(s, t.link)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>
          <Section title="Actividad reciente">
            <ul className="space-y-3 py-1">
              {activity.map((a) => (
                <li key={a.id} className="grid grid-cols-[auto_1fr] gap-3 text-[0.84rem]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green" aria-hidden />
                  <div>{a.to ? <Link to={a.to} className="hover:underline">{a.text}</Link> : a.text}<p className="text-[0.74rem] text-ink-3">{fmtDateTime(a.date)}</p></div>
                </li>
              ))}
            </ul>
          </Section>
          <div className="rounded-[14px] bg-night-2 p-5 text-white" data-theme="dark">
            <p className="flex items-center gap-2 font-bold"><Bot size={18} className="text-green" aria-hidden />¿Dudas técnicas?</p>
            <p className="mt-1 text-[0.86rem] text-fog-2">El asistente consulta la biblioteca de demostración y te indica las fuentes. Usa el botón «Asistente» arriba.</p>
            <div className="mt-4 flex flex-wrap gap-2"><Button to="/profesional/biblioteca" size="sm">Biblioteca</Button><Button to="/profesional/asesor" size="sm" variant="outline-dark">Asesor guiado</Button></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfigRow({ id }: { id: string }) {
  const c = useDemo((s) => s.configs.find((x) => x.id === id))
  const p = useDemo((s) => s.projects.find((x) => x.id === c?.projectId))
  const setDraft = useDemo((s) => s.setDraft)
  const nav = useNavigate()
  if (!c) return null
  return (
    <li className="flex flex-wrap items-center gap-3 py-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-paper-2"><OpeningGlyph slug={c.config.typology} className="h-7 w-auto" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.9rem] font-bold">{c.name} <span className="font-normal text-ink-3">· {c.ref}</span></p>
        <p className="truncate text-[0.8rem] text-ink-2">{TYPOLOGY_NAME[c.config.typology]} {c.config.typology !== 'puerta' && `${c.config.leaves} h.`} · {finishName(c.config.finishInterior)}/{finishName(c.config.finishExterior)} · {c.config.widthMm}×{c.config.heightMm} mm · {c.units} ud. · {p?.ref}</p>
      </div>
      <Button size="sm" variant="outline" onClick={() => { setDraft({ config: c.config, loadedId: c.id, name: c.name, units: c.units, notes: c.notes }); nav('/profesional/configurador') }}>Retomar</Button>
    </li>
  )
}

/* -------------------------------------- Proyectos -------------------------------------- */
export function Projects() {
  const s = useDemo()
  const create = useDemo((st) => st.createProject)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [city, setCity] = useState('Sevilla')
  const [filter, setFilter] = useState('todos')
  const nav = useNavigate()
  const list = s.projects.filter((p) => p.companyId === CO && (filter === 'todos' || p.status === filter))
  return (
    <div>
      <PageHeader eyebrow="Espacio profesional" title="Proyectos" text="Configuraciones, planos, conversaciones y solicitudes agrupados por obra." actions={<Button icon={<FolderPlus size={16} aria-hidden />} onClick={() => setOpen(true)}>Nuevo proyecto</Button>} />
      <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por estado">
        {[['todos', 'Todos'], ['borrador', 'Borrador'], ['en-presupuesto', 'En presupuesto'], ['en-fabricacion', 'En fabricación'], ['entregado', 'Entregado']].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k} className={`min-h-9 rounded-full border px-3.5 text-[0.82rem] font-semibold ${filter === k ? 'border-ink bg-ink text-white' : 'border-line-2 bg-surface text-ink-2 hover:border-ink-3'}`}>{l}</button>
        ))}
      </div>
      {list.length === 0 ? <EmptyState title="No hay proyectos con este estado" action={<Button variant="outline" onClick={() => setFilter('todos')}>Ver todos</Button>} /> : (
        <div className="thin-scroll overflow-x-auto rounded-[14px] border border-line bg-surface">
          <table className="w-full text-left text-[0.88rem]">
            <caption className="sr-only">Proyectos de la empresa</caption>
            <thead className="border-b border-line bg-paper-2/60 text-[0.78rem] text-ink-2"><tr>
              <th className="px-4 py-3 font-semibold">Proyecto</th><th className="hidden px-4 py-3 font-semibold md:table-cell">Localidad</th><th className="hidden px-4 py-3 font-semibold sm:table-cell">Configuraciones</th><th className="hidden px-4 py-3 font-semibold lg:table-cell">Última actividad</th><th className="px-4 py-3 font-semibold">Estado</th>
            </tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="cursor-pointer border-b border-line last:border-0 hover:bg-paper/70" onClick={() => nav(`/profesional/proyectos/${p.id}`)}>
                  <td className="px-4 py-3.5"><Link to={`/profesional/proyectos/${p.id}`} className="font-bold hover:underline" onClick={(e) => e.stopPropagation()}>{p.name}</Link><p className="label mt-0.5 !text-[0.6rem] text-ink-3">{p.ref}</p></td>
                  <td className="hidden px-4 py-3.5 md:table-cell">{p.city} <span className="text-ink-3">(ejemplo)</span></td>
                  <td className="tnum hidden px-4 py-3.5 sm:table-cell">{s.configs.filter((c) => c.projectId === p.id).length}</td>
                  <td className="tnum hidden px-4 py-3.5 lg:table-cell">{fmtDate(p.updatedAt)}</td>
                  <td className="px-4 py-3.5"><ProjectBadge s={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} title="Nuevo proyecto de demostración"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button disabled={!name.trim()} onClick={() => { const id = create(name.trim(), city); setOpen(false); setName(''); nav(`/profesional/proyectos/${id}`); toast('Proyecto creado (demo)') }}>Crear</Button></>}>
        <div className="space-y-4"><TextInput label="Nombre" value={name} onChange={(e) => setName(e.target.value)} /><TextInput label="Localidad" value={city} onChange={(e) => setCity(e.target.value)} /></div>
      </Dialog>
    </div>
  )
}

function AttachLocal({ link, label = 'Adjuntar archivo' }: { link: LinkRef; label?: string }) {
  const add = useDemo((s) => s.addLocalFile)
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <input ref={ref} type="file" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => {
        const f = e.target.files?.[0]
        if (f) { add(link, f.name, /\.(dxf|dwg|pdf)$/i.test(f.name) ? 'plano' : 'otro'); toast('Archivo añadido (solo nombre)', 'El contenido no se sube ni se guarda en esta demo.') }
        e.target.value = ''
      }} />
      <Button size="sm" variant="outline" icon={<Upload size={14} aria-hidden />} onClick={() => ref.current?.click()}>{label}</Button>
    </>
  )
}

export function ProjectDetail() {
  const { id = '' } = useParams()
  const s = useDemo()
  const p = s.projects.find((x) => x.id === id)
  const setDraft = useDemo((st) => st.setDraft)
  const nav = useNavigate()
  const [newThread, setNewThread] = useState(false)
  if (!p) return <NotFound />
  const configs = s.configs.filter((c) => c.projectId === id)
  const files = filesFor(s, { type: 'project', id })
  const requests = s.requests.filter((r) => r.projectId === id)
  const quotes = s.quotes.filter((q) => q.projectId === id)
  const orders = s.orders.filter((o) => o.projectId === id)
  const threads = s.threads.filter((t) => projectOfLink(s, t.link) === id)
  return (
    <div>
      <BackLink to="/profesional/proyectos">Proyectos</BackLink>
      <PageHeader eyebrow={`${p.ref} · ${p.city} (ejemplo)`} title={p.name} text={p.notes}
        actions={<><ProjectBadge s={p.status} /><Button size="sm" icon={<Box size={15} aria-hidden />} onClick={() => { setDraft({ config: { ...(configs[0]?.config ?? s.draft.config) }, loadedId: undefined, name: 'Nueva configuración', units: 1, notes: '' }); nav('/profesional/configurador') }}>Añadir configuración</Button></>} />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Section title={`Configuraciones (${configs.length})`}>
            {configs.length ? <ul className="divide-y divide-line">{configs.map((c) => <ConfigRow key={c.id} id={c.id} />)}</ul> : <p className="py-3 text-[0.88rem] text-ink-3">Aún no hay configuraciones. Crea una desde el configurador y guárdala en este proyecto.</p>}
          </Section>
          <Section title="Solicitudes y presupuestos">
            {requests.length === 0 ? <p className="py-3 text-[0.88rem] text-ink-3">Sin solicitudes. Desde el configurador puedes preparar una con las configuraciones guardadas.</p> : (
              <ul>
                {requests.map((r) => {
                  const q = quotes.find((x) => x.id === r.quoteId)
                  return (
                    <li key={r.id} className="flex flex-wrap items-center gap-3 border-b border-line py-3 last:border-0">
                      <div className="min-w-0 flex-1"><p className="text-[0.9rem] font-bold">{r.ref}</p><p className="text-[0.8rem] text-ink-2">{fmtDate(r.createdAt)} · {r.snapshot.length} configuraciones · sin precio automático</p></div>
                      <RequestBadge s={r.status} />
                      {q ? <Button size="sm" variant="outline" to={`/profesional/presupuestos/${q.id}`}>{q.ref} · v{q.versions.length}</Button> : <span className="text-[0.8rem] text-ink-3">Propuesta en preparación</span>}
                    </li>
                  )
                })}
              </ul>
            )}
          </Section>
          {orders.length > 0 && (
            <Section title="Pedidos">
              <ul>{orders.map((o) => (
                <li key={o.id} className="border-b border-line py-3 last:border-0">
                  <Link to={`/profesional/pedidos/${o.id}`} className="flex flex-wrap items-center gap-3 hover:underline"><span className="flex-1 text-[0.9rem] font-bold">{o.ref} · {o.phase}</span><OrderBadge s={o.status} /></Link>
                </li>
              ))}</ul>
            </Section>
          )}
        </div>
        <div className="space-y-6">
          <Section title="Planos y archivos" actions={<AttachLocal link={{ type: 'project', id }} label="Adjuntar plano" />}>
            {files.length ? <ul>{files.map((f) => <FileRow key={f.id} f={f} showLink={false} />)}</ul> : <p className="py-3 text-[0.88rem] text-ink-3">Sin planos. Puedes seleccionar un archivo local: solo se mostrará su nombre.</p>}
          </Section>
          <Section title="Conversaciones" actions={<Button size="sm" variant="outline" icon={<MessageSquarePlus size={14} aria-hidden />} onClick={() => setNewThread(true)}>Nueva</Button>}>
            {threads.length ? (
              <ul>{threads.map((t) => (
                <li key={t.id} className="border-b border-line py-3 last:border-0"><Link to={`/profesional/mensajes?hilo=${t.id}`} className="block hover:underline"><p className="text-[0.88rem] font-bold">{t.subject}</p><p className="text-[0.78rem] text-ink-3">{linkLabel(s, t.link)} · {t.messages.length} mensajes</p></Link></li>
              ))}</ul>
            ) : <p className="py-3 text-[0.88rem] text-ink-3">Sin conversaciones.</p>}
          </Section>
        </div>
      </div>
      <NewThreadDialog open={newThread} onClose={() => setNewThread(false)} link={{ type: 'project', id }} />
    </div>
  )
}

function NewThreadDialog({ open, onClose, link, defaultSubject = '' }: { open: boolean; onClose: () => void; link: LinkRef; defaultSubject?: string }) {
  const create = useDemo((s) => s.createThread)
  const nav = useNavigate()
  const [subject, setSubject] = useState(defaultSubject)
  const [text, setText] = useState('')
  return (
    <Dialog open={open} onClose={onClose} title="Nueva conversación" description="Vinculada a este elemento"
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button disabled={!subject.trim() || !text.trim()} onClick={() => { const id = create(subject, link, text, 'cliente'); onClose(); toast('Conversación creada (demo)', 'Mensaje guardado localmente; no se envía a Deken.'); nav(`/profesional/mensajes?hilo=${id}`) }}>Crear</Button></>}>
      <div className="space-y-4"><TextInput label="Asunto" value={subject} onChange={(e) => setSubject(e.target.value)} /><TextArea label="Mensaje" value={text} onChange={(e) => setText(e.target.value)} /></div>
    </Dialog>
  )
}

/* -------------------------------------- Presupuestos -------------------------------------- */
export function Quotes() {
  const s = useDemo()
  const list = s.quotes.filter((q) => s.projects.find((p) => p.id === q.projectId)?.companyId === CO)
  const pending = s.requests.filter((r) => !r.quoteId)
  return (
    <div>
      <PageHeader eyebrow="Espacio profesional" title="Presupuestos" text="Propuestas con historial de versiones. La plataforma no calcula ni publica precios: los importes van en el documento comercial de Deken." />
      {pending.length > 0 && (
        <Notice className="mb-5" tone="neutral" title={`${pending.length} solicitud${pending.length > 1 ? 'es' : ''} en revisión`}>
          {pending.map((r) => <span key={r.id} className="mr-3">{r.ref} · {s.projects.find((p) => p.id === r.projectId)?.name}</span>)}
        </Notice>
      )}
      <ul className="grid gap-4 md:grid-cols-2">
        {list.map((q) => {
          const v = q.versions[q.versions.length - 1]
          const p = s.projects.find((x) => x.id === q.projectId)
          return (
            <li key={q.id}>
              <Link to={`/profesional/presupuestos/${q.id}`} className="flex h-full flex-col rounded-[14px] border border-line bg-surface p-5 hover:border-ink-3">
                <div className="flex flex-wrap items-center justify-between gap-2"><span className="label text-ink-3">{q.ref}</span><QuoteBadge s={q.status} /></div>
                <p className="mt-3 text-[1.1rem] font-bold">{p?.name}</p>
                <p className="mt-1 line-clamp-2 text-[0.88rem] text-ink-2">{v.summary}</p>
                <div className="mt-auto flex items-center gap-3 pt-4 text-[0.8rem] text-ink-3"><span className="tnum">Versión vigente v{v.n}</span><span>·</span><span className="tnum">{fmtDate(v.date)}</span><span>·</span><span>{q.versions.length} versiones</span></div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function QuoteDetail() {
  const { id = '' } = useParams()
  const s = useDemo()
  const q = s.quotes.find((x) => x.id === id)
  const requestRevision = useDemo((st) => st.requestQuoteRevision)
  const [dlg, setDlg] = useState<null | 'revision' | 'thread'>(null)
  const [text, setText] = useState('')
  const [sel, setSel] = useState<number | null>(null)
  if (!q) return <NotFound />
  const p = s.projects.find((x) => x.id === q.projectId)!
  const req = s.requests.find((r) => r.id === q.requestId)
  const current = q.versions[q.versions.length - 1]
  const shown = q.versions.find((v) => v.n === (sel ?? current.n))!
  const threads = threadsFor(s, { type: 'quote', id })
  const files = filesFor(s, { type: 'quote', id })
  return (
    <div>
      <BackLink to="/profesional/presupuestos">Presupuestos</BackLink>
      <PageHeader eyebrow={`${q.ref} · ${p.ref}`} title={p.name} actions={<>
        <QuoteBadge s={q.status} />
        <Button size="sm" variant="outline" icon={<MessageSquarePlus size={14} aria-hidden />} onClick={() => threads[0] ? undefined : setDlg('thread')} to={threads[0] ? `/profesional/mensajes?hilo=${threads[0].id}` : undefined}>{threads[0] ? 'Abrir conversación' : 'Iniciar conversación'}</Button>
        <Button size="sm" variant="dark" onClick={() => setDlg('revision')}>Solicitar aclaración o revisión</Button>
      </>} />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-[14px] border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
              <h2 className="text-[1rem] font-bold">Versión {shown.n}{shown.n === current.n && <Badge tone="green" className="ml-2">Vigente</Badge>}</h2>
              <span className="tnum text-[0.82rem] text-ink-3">{fmtDate(shown.date)} · {shown.author}</span>
            </div>
            <div className="space-y-4 px-5 py-4">
              <p className="text-[0.95rem]">{shown.summary}</p>
              {shown.changes && <div className="rounded-[10px] border-l-[3px] border-green bg-green-soft/60 px-4 py-3 text-[0.9rem]"><p className="label !text-[0.6rem] text-green-deep">Cambios respecto a v{shown.n - 1}</p><p className="mt-1">{shown.changes}</p></div>}
              <div className="rounded-[10px] bg-paper-2 px-4 py-3 text-[0.84rem] text-ink-2">Importes: en el documento comercial adjunto. La previsualización no muestra ni calcula precios.</div>
              {files.filter((f) => f.versionOf?.n === shown.n).map((f) => <ul key={f.id}><FileRow f={f} showLink={false} /></ul>)}
            </div>
          </section>
          {req && (
            <Section title={`Configuraciones de la solicitud ${req.ref}`}>
              <ul className="divide-y divide-line">
                {req.snapshot.map((c, i) => (
                  <li key={i} className="flex items-center gap-3 py-3">
                    <OpeningGlyph slug={c.config.typology} className="h-8 w-auto shrink-0" />
                    <div className="min-w-0 text-[0.86rem]"><p className="font-bold">{c.units} ud. · {c.name}</p><p className="text-ink-2">{TYPOLOGY_NAME[c.config.typology]} · {finishName(c.config.finishInterior)} int. / {finishName(c.config.finishExterior)} ext. · {c.config.widthMm}×{c.config.heightMm} mm</p></div>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
        <div className="space-y-6">
          <Section title="Historial de versiones">
            <ol className="relative space-y-1 border-l border-line pl-4">
              {[...q.versions].reverse().map((v) => (
                <li key={v.n}>
                  <button onClick={() => setSel(v.n)} aria-current={shown.n === v.n} className={`relative w-full rounded-[8px] px-3 py-2.5 text-left ${shown.n === v.n ? 'bg-paper-2' : 'hover:bg-paper'}`}>
                    <span className={`absolute -left-[21px] top-4 h-2.5 w-2.5 rounded-full border-2 ${v.n === current.n ? 'border-green bg-green' : 'border-line-2 bg-surface'}`} aria-hidden />
                    <span className="block text-[0.88rem] font-bold">Versión {v.n}{v.n === current.n ? ' · vigente' : ''}</span>
                    <span className="tnum block text-[0.78rem] text-ink-3">{fmtDate(v.date)}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[0.78rem] text-ink-3">Las versiones anteriores se conservan para consulta.</p>
          </Section>
          <Section title="Conversación">
            {threads.length ? threads.map((t) => (
              <Link key={t.id} to={`/profesional/mensajes?hilo=${t.id}`} className="block py-2 hover:underline"><p className="text-[0.88rem] font-bold">{t.subject}</p><p className="line-clamp-2 text-[0.8rem] text-ink-2">{t.messages[t.messages.length - 1].text}</p></Link>
            )) : <p className="py-2 text-[0.86rem] text-ink-3">Sin conversación todavía.</p>}
          </Section>
        </div>
      </div>
      <Dialog open={dlg === 'revision'} onClose={() => setDlg(null)} title="Solicitar aclaración o revisión" description={`${q.ref} · versión ${current.n}`}
        footer={<><Button variant="outline" onClick={() => setDlg(null)}>Cancelar</Button><Button disabled={!text.trim()} onClick={() => { requestRevision(q.id, text); setDlg(null); setText(''); toast('Solicitud de revisión registrada (demo)', 'Se ha añadido a la conversación del presupuesto. No se envía a Deken.') }}>Registrar</Button></>}>
        <TextArea label="¿Qué necesitas que se revise?" value={text} onChange={(e) => setText(e.target.value)} hint="Ej.: confirmar medida de un hueco, cambiar acabado exterior…" />
        <p className="mt-3 text-[0.8rem] text-ink-3">No es una aceptación ni una firma: solo una petición dentro de la conversación.</p>
      </Dialog>
      <NewThreadDialog open={dlg === 'thread'} onClose={() => setDlg(null)} link={{ type: 'quote', id }} defaultSubject={`Consulta sobre ${q.ref}`} />
    </div>
  )
}

/* -------------------------------------- Pedidos -------------------------------------- */
export function Orders() {
  const s = useDemo()
  const list = s.orders.filter((o) => s.projects.find((p) => p.id === o.projectId)?.companyId === CO)
  return (
    <div>
      <PageHeader eyebrow="Espacio profesional" title="Pedidos" text="Estado de fabricación y entrega según los datos registrados por Deken. No está conectado en tiempo real a producción ni a transporte." />
      <ul className="space-y-4">
        {list.map((o) => (
          <li key={o.id}>
            <Link to={`/profesional/pedidos/${o.id}`} className="block rounded-[14px] border border-line bg-surface p-5 hover:border-ink-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><p className="label text-ink-3">{o.ref} · {o.phase}</p><p className="mt-1 text-[1.05rem] font-bold">{s.projects.find((p) => p.id === o.projectId)?.name}</p></div>
                <OrderBadge s={o.status} />
              </div>
              <div className="mt-4"><OrderProgress o={o} /></div>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[0.84rem] text-ink-2">
                <span>Previsión: <strong className="tnum text-ink">{fmtDate(o.forecastDate)}</strong></span>
                <span>Fecha confirmada: <strong className="tnum text-ink">{o.confirmedDate ? fmtDate(o.confirmedDate) : 'pendiente'}</strong></span>
                <span>{filesFor(s, { type: 'order', id: o.id }).length} documentos</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function OrderDetail() {
  const { id = '' } = useParams()
  const s = useDemo()
  const o = s.orders.find((x) => x.id === id)
  const [newThread, setNewThread] = useState(false)
  if (!o) return <NotFound />
  const p = s.projects.find((x) => x.id === o.projectId)!
  const events = o.events.filter((e) => e.visibleToClient)
  const files = filesFor(s, { type: 'order', id })
  const threads = threadsFor(s, { type: 'order', id })
  return (
    <div>
      <BackLink to="/profesional/pedidos">Pedidos</BackLink>
      <PageHeader eyebrow={`${o.ref} · ${o.phase}`} title={p.name} actions={<OrderBadge s={o.status} />} />
      <section className="mb-6 rounded-[14px] border border-line bg-surface p-5">
        <OrderProgress o={o} />
        <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
          <div><dt className="label text-ink-3">Estado</dt><dd className="mt-1 font-bold">{ORDER_STATUS_LABEL[o.status]}</dd></div>
          <div><dt className="label flex items-center gap-1.5 text-ink-3"><Clock3 size={12} aria-hidden />Previsión</dt><dd className="tnum mt-1 font-bold">{fmtDate(o.forecastDate)} <span className="text-[0.78rem] font-normal text-ink-3">estimada</span></dd></div>
          <div><dt className="label flex items-center gap-1.5 text-ink-3"><Truck size={12} aria-hidden />Entrega confirmada</dt><dd className="tnum mt-1 font-bold">{o.confirmedDate ? fmtDate(o.confirmedDate) : <span className="font-normal text-ink-3">Pendiente de confirmar</span>}</dd></div>
        </dl>
        <p className="mt-4 flex items-start gap-2 text-[0.78rem] text-ink-3"><AlertCircle size={13} className="mt-0.5 shrink-0" aria-hidden />Datos introducidos manualmente por Deken en la demo. Sin conexión con máquinas, vehículos ni PrefSuite.</p>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Section title="Actividad">
          <ol className="relative space-y-5 border-l border-line py-2 pl-5">
            {[...events].reverse().map((e) => (
              <li key={e.id} className="relative">
                <span className={`absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full ${e.status ? 'bg-green' : 'bg-line-2'}`} aria-hidden />
                <p className="tnum text-[0.76rem] text-ink-3">{fmtDate(e.date)} · {e.author}</p>
                {e.status && <p className="mt-0.5 text-[0.88rem] font-bold">{ORDER_STATUS_LABEL[e.status]}</p>}
                <p className="text-[0.88rem] text-ink-2">{e.note}</p>
              </li>
            ))}
          </ol>
        </Section>
        <div className="space-y-6">
          <Section title={`Documentos (${files.length})`}>{files.length ? <ul>{files.map((f) => <FileRow key={f.id} f={f} showLink={false} />)}</ul> : <p className="py-3 text-[0.86rem] text-ink-3">Sin documentos todavía.</p>}</Section>
          <Section title="Conversación" actions={!threads.length && <Button size="sm" variant="outline" onClick={() => setNewThread(true)}>Iniciar</Button>}>
            {threads.length ? threads.map((t) => <Link key={t.id} to={`/profesional/mensajes?hilo=${t.id}`} className="block py-2 hover:underline"><p className="text-[0.88rem] font-bold">{t.subject}</p><p className="line-clamp-2 text-[0.8rem] text-ink-2">{t.messages[t.messages.length - 1].text}</p></Link>) : <p className="py-2 text-[0.86rem] text-ink-3">Sin conversación.</p>}
          </Section>
        </div>
      </div>
      <NewThreadDialog open={newThread} onClose={() => setNewThread(false)} link={{ type: 'order', id }} defaultSubject={`Consulta sobre ${o.ref}`} />
    </div>
  )
}

/* -------------------------------------- Mensajes -------------------------------------- */
export function Messages({ area = 'cliente' }: { area?: 'cliente' | 'deken' }) {
  const s = useDemo()
  const send = useDemo((st) => st.sendMessage)
  const markRead = useDemo((st) => st.markThreadRead)
  const setStatus = useDemo((st) => st.setThreadStatus)
  const [params, setParams] = useSearchParams()
  const threads = useMemo(() => [...s.threads].sort((a, b) => (b.messages[b.messages.length - 1].date > a.messages[a.messages.length - 1].date ? 1 : -1)), [s.threads])
  const activeId = params.get('hilo') ?? threads[0]?.id
  const t = threads.find((x) => x.id === activeId)
  const [text, setText] = useState('')
  const [att, setAtt] = useState<string>('')
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (t && (area === 'cliente' ? t.unreadClient : t.unreadDeken)) markRead(t.id, area) }, [t, area, markRead])
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }) }, [t?.messages.length])
  const pid = t ? projectOfLink(s, t.link) : undefined
  const attachable: DocFile[] = pid ? s.files.filter((f) => projectOfLink(s, f.link) === pid && f.source === 'muestra') : []
  const linkTo = (l: LinkRef) => area === 'deken'
    ? l.type === 'project' ? '/deken/solicitudes' : `/deken/${l.type === 'quote' ? 'presupuestos' : 'pedidos'}/${l.id}`
    : `/profesional/${l.type === 'project' ? 'proyectos' : l.type === 'quote' ? 'presupuestos' : 'pedidos'}/${l.id}`
  return (
    <div>
      {area === 'cliente' && <PageHeader eyebrow="Espacio profesional" title="Mensajes" text="Conversaciones vinculadas a proyectos, presupuestos y pedidos." />}
      <div className="grid overflow-hidden rounded-[14px] border border-line bg-surface lg:h-[calc(100dvh-16rem)] lg:min-h-[520px] lg:grid-cols-[320px_1fr]">
        <ul className="thin-scroll max-h-64 overflow-y-auto border-b border-line lg:max-h-none lg:border-b-0 lg:border-r" aria-label="Conversaciones">
          {threads.map((x) => {
            const unread = area === 'cliente' ? x.unreadClient : x.unreadDeken
            const last = x.messages[x.messages.length - 1]
            return (
              <li key={x.id}>
                <button onClick={() => setParams({ hilo: x.id })} aria-current={x.id === activeId} className={`block w-full border-b border-line px-4 py-3.5 text-left ${x.id === activeId ? 'bg-paper-2' : 'hover:bg-paper'}`}>
                  <div className="flex items-center gap-2">
                    {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-green" aria-label="Sin leer" />}
                    <p className={`min-w-0 flex-1 truncate text-[0.88rem] ${unread ? 'font-extrabold' : 'font-semibold'}`}>{x.subject}</p>
                  </div>
                  <p className="mt-0.5 truncate text-[0.78rem] text-ink-2">{last.authorName}: {last.text}</p>
                  <p className="label mt-1 !text-[0.58rem] text-ink-3">{linkLabel(s, x.link)} · {x.status}</p>
                </button>
              </li>
            )
          })}
        </ul>
        {t ? (
          <div className="flex min-h-[440px] min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
              <div className="min-w-0 flex-1"><p className="font-bold">{t.subject}</p><Link to={linkTo(t.link)} className="text-[0.8rem] font-semibold text-green-ink hover:underline">{linkLabel(s, t.link)}</Link></div>
              <Badge tone={t.status === 'abierta' ? 'info' : 'neutral'}>{t.status === 'abierta' ? 'Abierta' : 'Resuelta'}</Badge>
              {area === 'deken' && <Button size="sm" variant="outline" onClick={() => setStatus(t.id, t.status === 'abierta' ? 'resuelta' : 'abierta')}>{t.status === 'abierta' ? 'Marcar resuelta' : 'Reabrir'}</Button>}
            </div>
            <div className="thin-scroll flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {t.messages.map((m) => {
                const mine = (area === 'cliente' && m.author === 'cliente') || (area === 'deken' && m.author === 'deken')
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : ''}`}>
                    <div className={`max-w-[85%] rounded-[12px] px-4 py-3 ${mine ? 'bg-night text-white' : 'border border-line bg-paper'}`}>
                      <p className={`text-[0.74rem] ${mine ? 'text-fog-2' : 'text-ink-3'}`}>{m.authorName} · {fmtDateTime(m.date)}</p>
                      <p className="mt-1 whitespace-pre-line text-[0.9rem]">{m.text}</p>
                      {m.attachments?.map((fid) => {
                        const f = s.files.find((x) => x.id === fid)
                        return f && <p key={fid} className={`mt-2 inline-flex items-center gap-1.5 rounded-[6px] px-2 py-1 text-[0.76rem] font-semibold ${mine ? 'bg-white/10' : 'bg-surface border border-line'}`}><Paperclip size={12} aria-hidden />{f.name}</p>
                      })}
                    </div>
                  </div>
                )
              })}
              <div ref={endRef} />
            </div>
            <form className="border-t border-line p-4" onSubmit={(e) => {
              e.preventDefault()
              if (!text.trim()) return
              send(t.id, area, text.trim(), att ? [att] : undefined)
              setText(''); setAtt('')
              toast('Mensaje añadido a la demo', 'Solo cambia el conjunto local: no se envía a nadie.')
            }}>
              <label htmlFor="msg" className="sr-only">Escribe un mensaje</label>
              <textarea id="msg" value={text} onChange={(e) => setText(e.target.value)} rows={2} className="field" placeholder="Escribe un mensaje…" />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <label htmlFor="att" className="sr-only">Adjuntar documento de muestra</label>
                <select id="att" value={att} onChange={(e) => setAtt(e.target.value)} className="field !min-h-10 max-w-xs !py-1.5 text-[0.82rem]">
                  <option value="">Sin adjunto</option>
                  {attachable.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <DemoTag>Envío simulado</DemoTag>
                <Button type="submit" className="ml-auto" icon={<Send size={15} aria-hidden />} disabled={!text.trim()}>Enviar</Button>
              </div>
            </form>
          </div>
        ) : <div className="p-8"><EmptyState title="No hay conversaciones" /></div>}
      </div>
    </div>
  )
}

/* -------------------------------------- Documentos -------------------------------------- */
export function Documents() {
  const s = useDemo()
  const [kind, setKind] = useState<string>('todos')
  const [q, setQ] = useState('')
  const pids = s.projects.filter((p) => p.companyId === CO).map((p) => p.id)
  const all = s.files.filter((f) => pids.includes(projectOfLink(s, f.link) ?? ''))
  const list = all.filter((f) => (kind === 'todos' || f.kind === kind) && (!q || f.name.toLowerCase().includes(q.toLowerCase())))
  const kinds = Array.from(new Set(all.map((f) => f.kind)))
  const byProject = pids.map((pid) => ({ p: s.projects.find((x) => x.id === pid)!, files: list.filter((f) => projectOfLink(s, f.link) === pid) })).filter((g) => g.files.length)
  return (
    <div>
      <PageHeader eyebrow="Espacio profesional" title="Documentos" text="Planos, propuestas, confirmaciones, albaranes y facturas de muestra, organizados por tipo y por proyecto. Cada descarga genera un PDF de demostración con el contenido de su fila." />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {['todos', ...kinds].map((k) => (
          <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k} className={`min-h-9 rounded-full border px-3.5 text-[0.82rem] font-semibold ${kind === k ? 'border-ink bg-ink text-white' : 'border-line-2 bg-surface text-ink-2 hover:border-ink-3'}`}>
            {k === 'todos' ? 'Todos' : KIND_LABEL[k as DocFile['kind']]} <span className="tnum opacity-70">{k === 'todos' ? all.length : all.filter((f) => f.kind === k).length}</span>
          </button>
        ))}
        <label htmlFor="doc-q" className="sr-only">Buscar documento</label>
        <input id="doc-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre…" className="field !min-h-9 !py-1.5 sm:ml-auto sm:w-60" />
      </div>
      {byProject.length === 0 ? <EmptyState icon={<FileText size={26} />} title="Ningún documento coincide" action={<Button variant="outline" onClick={() => { setKind('todos'); setQ('') }}>Quitar filtros</Button>} /> : (
        <div className="space-y-5">
          {byProject.map(({ p, files }) => (
            <Section key={p.id} title={`${p.ref} · ${p.name}`} actions={<Button size="sm" variant="ghost" to={`/profesional/proyectos/${p.id}`}>Ver proyecto</Button>}>
              <ul>{files.map((f) => <FileRow key={f.id} f={f} />)}</ul>
            </Section>
          ))}
        </div>
      )}
    </div>
  )
}
