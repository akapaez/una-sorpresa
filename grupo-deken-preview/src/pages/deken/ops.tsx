import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { CheckCircle2, Clock3, XCircle, FilePlus2, Send, ListChecks, ArrowRight } from 'lucide-react'
import { useDemo, filesFor, threadsFor, linkLabel, ORDER_FLOW, ORDER_STATUS_LABEL } from '@/demo/store'
import type { FileKind, LinkRef, OrderStatus } from '@/demo/types'
import { Button } from '@/ui/Button'
import { Dialog, toast } from '@/ui/Dialog'
import { PageHeader, Stat, Badge, Notice, TextArea, TextInput, SelectInput, EmptyState } from '@/ui/primitives'
import { OpeningGlyph } from '@/ui/OpeningGlyph'
import { TYPOLOGY_NAME } from '@/content/solutions'
import { finishName } from '@/lib/pdf'
import { BackLink, FileRow, fmtDate, fmtDateTime, OrderBadge, OrderProgress, QuoteBadge, RequestBadge, Section, KIND_LABEL } from '../shared'
import { Messages } from '../pro/workspace'
import NotFound from '../public/NotFound'

/* ------------------------------------ Resumen ------------------------------------ */
export function DekenHome() {
  const s = useDemo()
  const pendingPros = s.professionals.filter((p) => p.status === 'pendiente')
  const newReq = s.requests.filter((r) => r.status !== 'respondida')
  const contacts = s.contacts.filter((c) => c.status === 'nueva')
  const unread = s.threads.filter((t) => t.unreadDeken)
  const activeOrders = s.orders.filter((o) => o.status !== 'entregado')
  const drafts = s.library.filter((d) => ['borrador', 'revision', 'incorporado'].includes(d.status))
  const tasks = [
    ...pendingPros.map((p) => ({ t: `Revisar solicitud de acceso de ${p.name}`, to: '/deken/profesionales', tag: 'Profesionales' })),
    ...newReq.map((r) => ({ t: `Preparar propuesta para ${r.ref} · ${s.projects.find((p) => p.id === r.projectId)?.name}`, to: `/deken/solicitudes/${r.id}`, tag: 'Solicitudes' })),
    ...contacts.map((c) => ({ t: `Responder consulta pública ${c.ref} (${c.city})`, to: '/deken/solicitudes', tag: 'Consultas' })),
    ...unread.map((t) => ({ t: `Mensaje sin leer: ${t.subject}`, to: '/deken/solicitudes?tab=conversaciones', tag: 'Mensajes' })),
    ...drafts.map((d) => ({ t: `Revisión editorial: ${d.title}`, to: '/deken/contenidos', tag: 'Contenidos' })),
  ]
  const tour = [
    ['Visitante: descubre un producto y solicita acceso', '/acceso-profesional'],
    ['Deken: aprueba al profesional', '/deken/profesionales'],
    ['Profesional: configura, guarda, descarga PDF y solicita', '/profesional/configurador'],
    ['Deken: revisa la solicitud y crea una propuesta', '/deken/solicitudes'],
    ['Profesional: consulta la versión y abre conversación', '/profesional/presupuestos'],
    ['Deken: actualiza el estado de un pedido', '/deken/pedidos/o2'],
    ['Profesional: ve el cambio y sus documentos', '/profesional/pedidos/o2'],
  ]
  return (
    <div>
      <PageHeader eyebrow="Panel interno · demostración" title="Resumen" text="Tareas y actividad derivadas del mismo conjunto de datos ficticios que ve el cliente." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Accesos pendientes" value={pendingPros.length} to="/deken/profesionales" />
        <Stat label="Solicitudes abiertas" value={newReq.length + contacts.length} to="/deken/solicitudes" />
        <Stat label="Pedidos en curso" value={activeOrders.length} to="/deken/pedidos" />
        <Stat label="Contenidos en revisión" value={drafts.length} to="/deken/contenidos" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Section title={`Requiere atención (${tasks.length})`}>
          {tasks.length === 0 ? <p className="py-4 text-[0.9rem] text-ink-3">Todo al día.</p> : (
            <ul>{tasks.map((t, i) => (
              <li key={i} className="border-b border-line last:border-0"><Link to={t.to} className="flex items-center gap-3 py-3 hover:underline"><Badge>{t.tag}</Badge><span className="min-w-0 flex-1 text-[0.88rem]">{t.t}</span><ArrowRight size={15} className="shrink-0 text-ink-3" aria-hidden /></Link></li>
            ))}</ul>
          )}
        </Section>
        <div className="space-y-6">
          <Section title="Recorrido de revisión sugerido">
            <ol className="space-y-2 py-1">{tour.map(([t, to], i) => (
              <li key={t} className="grid grid-cols-[1.6rem_1fr] text-[0.86rem]"><span className="tnum font-bold text-ink-3">{i + 1}.</span><Link to={to} className="hover:underline">{t}</Link></li>
            ))}</ol>
            <p className="mt-3 flex items-start gap-2 text-[0.76rem] text-ink-3"><ListChecks size={14} className="mt-0.5 shrink-0" aria-hidden />Cambia de modo con el selector superior en cada paso.</p>
          </Section>
          <Section title="Actividad">
            <ul className="space-y-3 py-1">{s.activity.slice(0, 7).map((a) => (
              <li key={a.id} className="text-[0.84rem]">{a.to ? <Link to={a.to} className="hover:underline">{a.text}</Link> : a.text}<p className="text-[0.72rem] text-ink-3">{fmtDateTime(a.date)}</p></li>
            ))}</ul>
          </Section>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------ Profesionales ------------------------------------ */
export function Professionals() {
  const pros = useDemo((s) => s.professionals)
  const review = useDemo((s) => s.reviewProfessional)
  const [sel, setSel] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const p = pros.find((x) => x.id === sel)
  const icon = (st: string) => st === 'aprobado' ? <CheckCircle2 size={15} className="text-green-ink" aria-hidden /> : st === 'pendiente' ? <Clock3 size={15} className="text-warn" aria-hidden /> : <XCircle size={15} className="text-danger" aria-hidden />
  const act = (status: 'aprobado' | 'pendiente' | 'rechazado') => {
    if (!p) return
    review(p.id, status, note || (status === 'aprobado' ? 'Aprobado en la demostración.' : status === 'pendiente' ? 'Pendiente de completar datos (demo).' : 'No aprobado en la demostración.'))
    setSel(null); setNote('')
    toast(status === 'aprobado' ? 'Profesional aprobado (demo)' : 'Estado actualizado (demo)', 'Cambia a «Profesional pendiente» en el selector para ver lo que ve esa persona.')
  }
  return (
    <div>
      <PageHeader eyebrow="Panel interno" title="Profesionales" text="Solicitudes de acceso y estado de aprobación. En la plataforma real, la aprobación habilitará permisos verificados en servidor por usuario y empresa." />
      <div className="thin-scroll overflow-x-auto rounded-[14px] border border-line bg-surface">
        <table className="w-full text-left text-[0.88rem]">
          <caption className="sr-only">Solicitudes de acceso profesional</caption>
          <thead className="border-b border-line bg-paper-2/60 text-[0.78rem] text-ink-2"><tr>
            <th className="px-4 py-3 font-semibold">Profesional</th><th className="hidden px-4 py-3 font-semibold md:table-cell">Empresa · perfil</th><th className="hidden px-4 py-3 font-semibold sm:table-cell">Solicitud</th><th className="px-4 py-3 font-semibold">Estado</th><th className="px-4 py-3"><span className="sr-only">Acciones</span></th>
          </tr></thead>
          <tbody>
            {pros.map((x) => (
              <tr key={x.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3.5"><p className="font-bold">{x.name}</p><p className="text-[0.78rem] text-ink-3">{x.email}</p></td>
                <td className="hidden px-4 py-3.5 md:table-cell">{x.companyName}<p className="text-[0.78rem] text-ink-3">{x.profile} · {x.city}</p></td>
                <td className="tnum hidden px-4 py-3.5 sm:table-cell">{fmtDate(x.requestedAt)}</td>
                <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5 font-semibold capitalize">{icon(x.status)}{x.status}</span></td>
                <td className="px-4 py-3.5 text-right"><Button size="sm" variant={x.status === 'pendiente' ? 'dark' : 'outline'} onClick={() => { setSel(x.id); setNote(x.reviewNote ?? '') }}>{x.status === 'pendiente' ? 'Revisar' : 'Ver'}</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!p} onClose={() => setSel(null)} title={p?.name ?? ''} description="Revisión de solicitud de acceso (datos ficticios)" variant="drawer"
        footer={p && <>
          <Button variant="danger" onClick={() => act('rechazado')}>No aprobar</Button>
          <Button variant="outline" onClick={() => act('pendiente')}>Dejar pendiente</Button>
          <Button onClick={() => act('aprobado')}>Aprobar acceso</Button>
        </>}>
        {p && (
          <div className="space-y-5">
            <dl className="grid grid-cols-2 gap-4 text-[0.88rem]">
              {[['Empresa', p.companyName], ['Perfil', p.profile], ['Localidad', p.city], ['Teléfono', p.phone || '—'], ['Correo', p.email], ['Solicitud', fmtDate(p.requestedAt)]].map(([k, v]) => (
                <div key={k}><dt className="label text-ink-3">{k}</dt><dd className="mt-1 break-words font-semibold">{v}</dd></div>
              ))}
            </dl>
            <div><p className="label text-ink-3">Mensaje</p><p className="mt-1 text-[0.9rem] text-ink-2">{p.message || '—'}</p></div>
            <Notice tone="neutral">Comprobaciones sugeridas (manuales): actividad profesional, zona de trabajo y empresa existente. La demo no verifica datos.</Notice>
            <TextArea label="Nota interna / para el profesional" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        )}
      </Dialog>
    </div>
  )
}

/* ------------------------------------ Solicitudes ------------------------------------ */
export function Requests() {
  const s = useDemo()
  const [search] = useSearchParams()
  const [tab, setTab] = useState<'presupuesto' | 'publicas' | 'conversaciones'>(() => search.get('tab') === 'conversaciones' ? 'conversaciones' : 'presupuesto')
  const nav = useNavigate()
  const markContact = (id: string) => useDemo.setState((st) => ({ contacts: st.contacts.map((c) => c.id === id ? { ...c, status: 'respondida' } : c) }))
  return (
    <div>
      <PageHeader eyebrow="Panel interno" title="Solicitudes" text="Solicitudes de presupuesto del portal, consultas públicas y conversaciones con clientes." />
      <div className="mb-5 inline-flex max-w-full flex-wrap rounded-[10px] border border-line bg-paper-2 p-1" role="tablist">
        {([['presupuesto', `Presupuesto (${s.requests.length})`], ['publicas', `Consultas públicas (${s.contacts.length})`], ['conversaciones', `Conversaciones (${s.threads.filter((t) => t.unreadDeken).length} sin leer)`]] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-10 rounded-[7px] px-3 text-[0.84rem] font-semibold ${tab === k ? 'bg-surface shadow-1' : 'text-ink-2 hover:text-ink'}`}>{l}</button>
        ))}
      </div>
      {tab === 'presupuesto' && (
        <div className="thin-scroll overflow-x-auto rounded-[14px] border border-line bg-surface">
          <table className="w-full text-left text-[0.88rem]">
            <caption className="sr-only">Solicitudes de presupuesto</caption>
            <thead className="border-b border-line bg-paper-2/60 text-[0.78rem] text-ink-2"><tr><th className="px-4 py-3 font-semibold">Solicitud</th><th className="hidden px-4 py-3 font-semibold md:table-cell">Proyecto</th><th className="hidden px-4 py-3 font-semibold sm:table-cell">Fecha</th><th className="px-4 py-3 font-semibold">Estado</th></tr></thead>
            <tbody>{[...s.requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((r) => {
              const p = s.projects.find((x) => x.id === r.projectId)
              return (
                <tr key={r.id} onClick={() => nav(`/deken/solicitudes/${r.id}`)} className="cursor-pointer border-b border-line last:border-0 hover:bg-paper/70">
                  <td className="px-4 py-3.5"><Link to={`/deken/solicitudes/${r.id}`} className="font-bold hover:underline" onClick={(e) => e.stopPropagation()}>{r.ref}</Link><p className="text-[0.78rem] text-ink-3">{r.snapshot.length} configuraciones · {r.snapshot.reduce((n, c) => n + c.units, 0)} uds.</p></td>
                  <td className="hidden px-4 py-3.5 md:table-cell">{p?.name}<p className="text-[0.78rem] text-ink-3">Reformas Ejemplo Aljarafe (demo)</p></td>
                  <td className="tnum hidden px-4 py-3.5 sm:table-cell">{fmtDate(r.createdAt)}</td>
                  <td className="px-4 py-3.5"><RequestBadge s={r.status} /></td>
                </tr>
              )
            })}</tbody>
          </table>
        </div>
      )}
      {tab === 'publicas' && (
        <ul className="space-y-3">
          {s.contacts.map((c) => (
            <li key={c.id} className="rounded-[14px] border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center gap-2"><span className="label text-ink-3">{c.ref} · {fmtDate(c.date)}</span><Badge tone={c.status === 'nueva' ? 'warn' : 'green'} dot>{c.status === 'nueva' ? 'Nueva' : 'Respondida'}</Badge></div>
              <p className="mt-2 font-bold">{c.name} · {c.company}</p>
              <p className="text-[0.84rem] text-ink-3">{c.city} · {c.projectType}</p>
              <p className="mt-2 text-[0.9rem] text-ink-2">{c.message}</p>
              {c.status === 'nueva' && <div className="mt-3"><Button size="sm" variant="outline" onClick={() => { markContact(c.id); toast('Marcada como respondida (demo)', 'No se envía ningún correo real.') }}>Marcar como respondida</Button></div>}
            </li>
          ))}
        </ul>
      )}
      {tab === 'conversaciones' && <Messages area="deken" />}
    </div>
  )
}

export function RequestDetail() {
  const { id = '' } = useParams()
  const s = useDemo()
  const r = s.requests.find((x) => x.id === id)
  const setStatus = useDemo((st) => st.setRequestStatus)
  const createQuote = useDemo((st) => st.createQuoteFromRequest)
  const sendMessage = useDemo((st) => st.sendMessage)
  const createThread = useDemo((st) => st.createThread)
  const nav = useNavigate()
  const [dlg, setDlg] = useState<null | 'quote' | 'reply'>(null)
  const [summary, setSummary] = useState('')
  const [reply, setReply] = useState('')
  if (!r) return <NotFound />
  const p = s.projects.find((x) => x.id === r.projectId)!
  const plans = filesFor(s, { type: 'project', id: p.id })
  const thread = threadsFor(s, { type: 'project', id: p.id })[0]
  const q = s.quotes.find((x) => x.id === r.quoteId)
  return (
    <div>
      <BackLink to="/deken/solicitudes">Solicitudes</BackLink>
      <PageHeader eyebrow={`${r.ref} · ${fmtDate(r.createdAt)}`} title={p.name} text={`Reformas Ejemplo Aljarafe (demo) · ${p.city} · contacto preferido: ${r.contactPreference}`}
        actions={<>
          <RequestBadge s={r.status} />
          {r.status === 'recibida' && <Button size="sm" variant="outline" onClick={() => { setStatus(r.id, 'en-revision'); toast('Solicitud en revisión (demo)') }}>Marcar en revisión</Button>}
          <Button size="sm" variant="outline" icon={<Send size={14} aria-hidden />} onClick={() => setDlg('reply')}>Responder</Button>
          <Button size="sm" icon={<FilePlus2 size={14} aria-hidden />} onClick={() => { setSummary(`Propuesta para ${r.snapshot.map((c) => `${c.units} ${c.name.toLowerCase()}`).join(' y ')}.`); setDlg('quote') }}>{q ? 'Añadir versión' : 'Crear propuesta de muestra'}</Button>
        </>} />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Section title="Configuraciones enviadas (copia en el momento de la solicitud)">
            <ul className="divide-y divide-line">
              {r.snapshot.map((c, i) => (
                <li key={i} className="flex gap-4 py-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[10px] bg-paper-2"><OpeningGlyph slug={c.config.typology} className="h-9 w-auto" /></span>
                  <div className="min-w-0 text-[0.86rem]">
                    <p className="font-bold">{c.units} ud. · {c.name}</p>
                    <p className="text-ink-2">{TYPOLOGY_NAME[c.config.typology]} {c.config.typology !== 'puerta' && `· ${c.config.leaves} hojas`} · int. {finishName(c.config.finishInterior)} / ext. {finishName(c.config.finishExterior)} · vidrio {c.config.glass}</p>
                    <p className="tnum text-ink-2">{c.config.widthMm} × {c.config.heightMm} mm <span className="text-ink-3">(introducidas por el profesional, pendientes de revisión)</span></p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Notas del cliente"><p className="py-2 text-[0.9rem] text-ink-2">{r.notes || 'Sin notas.'}</p></Section>
          {q && <Notice tone="green" title={`Propuesta ${q.ref} · ${q.versions.length} versiones`}><Link to={`/deken/presupuestos/${q.id}`} className="font-bold underline">Gestionar versiones</Link></Notice>}
        </div>
        <div className="space-y-6">
          <Section title="Planos del proyecto">{plans.length ? <ul>{plans.map((f) => <FileRow key={f.id} f={f} showLink={false} area="deken" />)}</ul> : <p className="py-2 text-[0.86rem] text-ink-3">Sin planos.</p>}</Section>
          <Section title="Conversación del proyecto">
            {thread ? <div className="space-y-2 py-1">{thread.messages.slice(-3).map((m) => <div key={m.id} className="text-[0.84rem]"><p className="text-[0.72rem] text-ink-3">{m.authorName} · {fmtDateTime(m.date)}</p><p>{m.text}</p></div>)}</div> : <p className="py-2 text-[0.86rem] text-ink-3">Sin conversación.</p>}
          </Section>
        </div>
      </div>
      <Dialog open={dlg === 'quote'} onClose={() => setDlg(null)} title={q ? `Nueva versión de ${q.ref}` : 'Crear propuesta de muestra'} description="Genera un documento de propuesta de demostración (sin importes)"
        footer={<><Button variant="outline" onClick={() => setDlg(null)}>Cancelar</Button><Button disabled={!summary.trim()} onClick={() => { const qid = createQuote(r.id, summary); setDlg(null); toast(q ? 'Versión añadida (demo)' : 'Propuesta creada (demo)', 'Visible para el cliente en Presupuestos.'); nav(`/deken/presupuestos/${qid}`) }}>{q ? 'Añadir versión' : 'Crear propuesta'}</Button></>}>
        <TextArea label="Resumen de la propuesta" value={summary} onChange={(e) => setSummary(e.target.value)} hint="Lo verá el profesional como descripción de la versión." />
      </Dialog>
      <Dialog open={dlg === 'reply'} onClose={() => setDlg(null)} title="Responder al cliente"
        footer={<><Button variant="outline" onClick={() => setDlg(null)}>Cancelar</Button><Button disabled={!reply.trim()} onClick={() => { if (thread) sendMessage(thread.id, 'deken', reply); else createThread(`Solicitud ${r.ref}`, { type: 'project', id: p.id }, reply, 'deken'); setDlg(null); setReply(''); toast('Respuesta añadida (demo)', 'Aparece en Mensajes del cliente.') }}>Enviar (demo)</Button></>}>
        <TextArea label="Mensaje" value={reply} onChange={(e) => setReply(e.target.value)} />
      </Dialog>
    </div>
  )
}

/* ------------------------------------ Presupuestos ------------------------------------ */
export function DkQuotes() {
  const s = useDemo()
  return (
    <div>
      <PageHeader eyebrow="Panel interno" title="Presupuestos" text="Alta de propuestas desde solicitudes y gestión de versiones. Los documentos son de muestra y no incluyen importes." />
      <ul className="space-y-3">
        {s.quotes.map((q) => (
          <li key={q.id}><Link to={`/deken/presupuestos/${q.id}`} className="flex flex-wrap items-center gap-3 rounded-[14px] border border-line bg-surface p-5 hover:border-ink-3">
            <div className="min-w-0 flex-1"><p className="label text-ink-3">{q.ref}</p><p className="mt-1 font-bold">{s.projects.find((p) => p.id === q.projectId)?.name}</p><p className="text-[0.82rem] text-ink-2">v{q.versions.length} · {fmtDate(q.versions[q.versions.length - 1].date)}</p></div>
            <QuoteBadge s={q.status} />
          </Link></li>
        ))}
      </ul>
    </div>
  )
}

export function DkQuoteDetail() {
  const { id = '' } = useParams()
  const s = useDemo()
  const q = s.quotes.find((x) => x.id === id)
  const addVersion = useDemo((st) => st.addQuoteVersion)
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState('')
  const [changes, setChanges] = useState('')
  if (!q) return <NotFound />
  const p = s.projects.find((x) => x.id === q.projectId)!
  const files = filesFor(s, { type: 'quote', id })
  const thread = threadsFor(s, { type: 'quote', id })[0]
  return (
    <div>
      <BackLink to="/deken/presupuestos">Presupuestos</BackLink>
      <PageHeader eyebrow={`${q.ref} · ${p.ref}`} title={p.name} actions={<><QuoteBadge s={q.status} /><Button size="sm" icon={<FilePlus2 size={14} aria-hidden />} onClick={() => { setSummary(q.versions[q.versions.length - 1].summary); setOpen(true) }}>Añadir versión</Button></>} />
      {q.status === 'revision-solicitada' && <Notice tone="warn" className="mb-5" title="El cliente ha solicitado una revisión">Consulta la conversación y añade una nueva versión con los cambios explicados.</Notice>}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Section title="Versiones (se conserva el historial)">
          <ol className="space-y-4 py-2">
            {[...q.versions].reverse().map((v) => (
              <li key={v.n} className="rounded-[10px] border border-line p-4">
                <div className="flex flex-wrap items-center gap-2"><p className="font-bold">Versión {v.n}</p>{v.n === q.versions.length && <Badge tone="green">Vigente</Badge>}<span className="tnum text-[0.8rem] text-ink-3">{fmtDate(v.date)} · {v.author}</span></div>
                <p className="mt-2 text-[0.88rem]">{v.summary}</p>
                {v.changes && <p className="mt-2 border-l-2 border-green pl-3 text-[0.84rem] text-ink-2">{v.changes}</p>}
                <ul className="mt-2">{files.filter((f) => f.versionOf?.n === v.n).map((f) => <FileRow key={f.id} f={f} showLink={false} area="deken" />)}</ul>
              </li>
            ))}
          </ol>
        </Section>
        <Section title="Conversación">
          {thread ? <div className="space-y-3 py-1">{thread.messages.map((m) => <div key={m.id} className="text-[0.84rem]"><p className="text-[0.72rem] text-ink-3">{m.authorName} · {fmtDateTime(m.date)}</p><p>{m.text}</p></div>)}<Button size="sm" variant="outline" to={`/deken/solicitudes?tab=conversaciones`}>Responder en conversaciones</Button></div> : <p className="py-2 text-[0.86rem] text-ink-3">Sin conversación.</p>}
        </Section>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title={`Nueva versión v${q.versions.length + 1}`} description="La versión anterior se mantiene visible en el historial"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button disabled={!summary.trim() || !changes.trim()} onClick={() => { addVersion(q.id, summary, changes); setOpen(false); setChanges(''); toast(`Versión ${q.versions.length + 1} añadida (demo)`, 'El cliente la verá como vigente.') }}>Añadir versión</Button></>}>
        <div className="space-y-4"><TextArea label="Resumen" value={summary} onChange={(e) => setSummary(e.target.value)} /><TextArea label="Cambios respecto a la versión anterior" value={changes} onChange={(e) => setChanges(e.target.value)} hint="Obligatorio: el cliente verá qué ha cambiado." /></div>
      </Dialog>
    </div>
  )
}

/* ------------------------------------ Pedidos ------------------------------------ */
export function DkOrders() {
  const s = useDemo()
  return (
    <div>
      <PageHeader eyebrow="Panel interno" title="Pedidos" text="Actualización manual de estados, fechas y documentos. En una fase posterior se estudiará la importación desde PrefSuite." actions={<Button size="sm" variant="outline" to="/deken/importaciones">Importar datos de ejemplo</Button>} />
      <ul className="space-y-3">
        {s.orders.map((o) => (
          <li key={o.id}><Link to={`/deken/pedidos/${o.id}`} className="block rounded-[14px] border border-line bg-surface p-5 hover:border-ink-3">
            <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="label text-ink-3">{o.ref} · {o.phase}</p><p className="mt-1 font-bold">{s.projects.find((p) => p.id === o.projectId)?.name}</p></div><OrderBadge s={o.status} /></div>
            <div className="mt-4"><OrderProgress o={o} /></div>
          </Link></li>
        ))}
      </ul>
    </div>
  )
}

export function DkOrderDetail() {
  const { id = '' } = useParams()
  const s = useDemo()
  const o = s.orders.find((x) => x.id === id)
  const update = useDemo((st) => st.updateOrder)
  const link = useDemo((st) => st.linkDocument)
  const [status, setStatus] = useState<OrderStatus | ''>('')
  const [note, setNote] = useState('')
  const [visible, setVisible] = useState(true)
  const [forecast, setForecast] = useState('')
  const [confirmed, setConfirmed] = useState('')
  const [docKind, setDocKind] = useState<FileKind>('albaran')
  const [docTarget, setDocTarget] = useState<'order' | 'project'>('order')
  if (!o) return <NotFound />
  const p = s.projects.find((x) => x.id === o.projectId)!
  const files = [...filesFor(s, { type: 'order', id }), ...filesFor(s, { type: 'project', id: p.id })]
  const save = () => {
    update(o.id, { status: status || undefined, note, visibleToClient: visible, forecastDate: forecast || undefined, confirmedDate: confirmed || undefined })
    setNote(''); setStatus(''); setForecast(''); setConfirmed('')
    toast('Pedido actualizado (demo)', visible ? 'El cambio es visible en la vista cliente (modo profesional aprobado).' : 'Nota interna: no visible para el cliente.')
  }
  const target: LinkRef = docTarget === 'order' ? { type: 'order', id: o.id } : { type: 'project', id: p.id }
  return (
    <div>
      <BackLink to="/deken/pedidos">Pedidos</BackLink>
      <PageHeader eyebrow={`${o.ref} · ${o.phase}`} title={p.name} actions={<><OrderBadge s={o.status} /><Button size="sm" variant="outline" to={`/profesional/pedidos/${o.id}`} onClick={() => useDemo.getState().setRole('aprobado')}>Ver como cliente</Button></>} />
      <section className="mb-6 rounded-[14px] border border-line bg-surface p-5"><OrderProgress o={o} />
        <p className="mt-4 text-[0.84rem] text-ink-2">Previsión: <strong className="tnum">{fmtDate(o.forecastDate)}</strong> · Confirmada: <strong className="tnum">{o.confirmedDate ? fmtDate(o.confirmedDate) : 'pendiente'}</strong></p>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <Section title="Actualizar estado (manual)">
            <div className="space-y-4 py-2">
              <SelectInput label="Nuevo estado" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} options={[{ value: '', label: `Sin cambio (${ORDER_STATUS_LABEL[o.status]})` }, ...ORDER_FLOW.map((x) => ({ value: x, label: ORDER_STATUS_LABEL[x] }))]} />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput label="Previsión de entrega" type="date" value={forecast} onChange={(e) => setForecast(e.target.value)} hint="Estimada" />
                <TextInput label="Fecha confirmada" type="date" value={confirmed} onChange={(e) => setConfirmed(e.target.value)} hint="Solo si está acordada" />
              </div>
              <TextArea label="Nota" value={note} onChange={(e) => setNote(e.target.value)} hint="Se registra en la actividad del pedido." />
              <label className="flex min-h-10 cursor-pointer items-center gap-2 text-[0.88rem] font-semibold"><input type="checkbox" className="h-5 w-5 accent-[#3f6b10]" checked={visible} onChange={(e) => setVisible(e.target.checked)} />Visible para el cliente</label>
              <Button onClick={save} disabled={!status && !note.trim() && !forecast && !confirmed}>Registrar actualización</Button>
            </div>
          </Section>
          <Section title="Vincular documento de muestra">
            <div className="grid gap-3 py-2 sm:grid-cols-2">
              <SelectInput label="Tipo" value={docKind} onChange={(e) => setDocKind(e.target.value as FileKind)} options={(['confirmacion', 'medidas', 'albaran', 'factura', 'otro'] as FileKind[]).map((k) => ({ value: k, label: KIND_LABEL[k] }))} />
              <SelectInput label="Asociar a" value={docTarget} onChange={(e) => setDocTarget(e.target.value as 'order' | 'project')} options={[{ value: 'order', label: `Pedido ${o.ref}` }, { value: 'project', label: `Proyecto ${p.ref}` }]} />
            </div>
            <Button size="sm" variant="outline" icon={<FilePlus2 size={14} aria-hidden />} onClick={() => { link(target, docKind, ''); toast('Documento vinculado (demo)', `${KIND_LABEL[docKind]} asociado a ${linkLabel(s, target)}.`) }}>Vincular</Button>
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="Actividad (incluye notas internas)">
            <ol className="relative space-y-4 border-l border-line py-2 pl-5">
              {[...o.events].reverse().map((e) => (
                <li key={e.id} className="relative">
                  <span className={`absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full ${e.visibleToClient ? 'bg-green' : 'bg-line-2'}`} aria-hidden />
                  <p className="tnum text-[0.74rem] text-ink-3">{fmtDate(e.date)} · {e.author} {!e.visibleToClient && <Badge className="ml-1">Interna</Badge>}</p>
                  {e.status && <p className="text-[0.86rem] font-bold">{ORDER_STATUS_LABEL[e.status]}</p>}
                  <p className="text-[0.86rem] text-ink-2">{e.note}</p>
                </li>
              ))}
            </ol>
          </Section>
          <Section title="Documentos">{files.length ? <ul>{files.map((f) => <FileRow key={f.id} f={f} area="deken" />)}</ul> : <EmptyState title="Sin documentos" />}</Section>
        </div>
      </div>
    </div>
  )
}
