import { Link } from 'react-router'
import { FileText, FileDown, Paperclip, Check } from 'lucide-react'
import { useDemo, linkLabel, projectOfLink, ORDER_FLOW, ORDER_STATUS_LABEL, type DemoState } from '@/demo/store'
import type { DocFile, OrderStatus, ProjectStatus, QuoteStatus, RequestStatus, Order } from '@/demo/types'
import { Badge } from '@/ui/primitives'
import { toast } from '@/ui/Dialog'
import { downloadSampleFile, configRows } from '@/lib/pdf'
import { TYPOLOGY_NAME } from '@/content/solutions'

export const fmtDate = (d?: string) => {
  if (!d) return '—'
  const dt = new Date(d.length <= 10 ? d + 'T12:00' : d)
  return dt.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}
export const fmtDateTime = (d: string) => new Date(d).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

const PROJECT: Record<ProjectStatus, [string, 'neutral' | 'info' | 'green' | 'warn']> = {
  borrador: ['Borrador', 'neutral'], 'en-presupuesto': ['En presupuesto', 'info'], 'en-fabricacion': ['En fabricación', 'green'], entregado: ['Entregado', 'neutral'],
}
const QUOTE: Record<QuoteStatus, [string, 'neutral' | 'info' | 'green' | 'warn']> = {
  'en-preparacion': ['En preparación', 'neutral'], 'propuesta-disponible': ['Propuesta disponible', 'green'], 'revision-solicitada': ['Revisión solicitada', 'warn'], confirmado: ['Confirmado por Deken', 'info'],
}
const REQUEST: Record<RequestStatus, [string, 'neutral' | 'info' | 'green' | 'warn']> = {
  recibida: ['Recibida', 'warn'], 'en-revision': ['En revisión', 'info'], respondida: ['Respondida', 'green'],
}
export const ProjectBadge = ({ s }: { s: ProjectStatus }) => <Badge tone={PROJECT[s][1]} dot>{PROJECT[s][0]}</Badge>
export const QuoteBadge = ({ s }: { s: QuoteStatus }) => <Badge tone={QUOTE[s][1]} dot>{QUOTE[s][0]}</Badge>
export const RequestBadge = ({ s }: { s: RequestStatus }) => <Badge tone={REQUEST[s][1]} dot>{REQUEST[s][0]}</Badge>
export const OrderBadge = ({ s }: { s: OrderStatus }) => <Badge tone={s === 'entregado' ? 'neutral' : s === 'documentacion' ? 'warn' : s === 'expedicion' ? 'info' : 'green'} dot>{ORDER_STATUS_LABEL[s]}</Badge>

export const KIND_LABEL: Record<DocFile['kind'], string> = {
  plano: 'Plano', propuesta: 'Propuesta', confirmacion: 'Confirmación de pedido', albaran: 'Albarán', factura: 'Factura', medidas: 'Hoja de medidas', resumen: 'Resumen', otro: 'Otro',
}

/** Contenido coherente con cada archivo de muestra (no abre siempre el mismo documento). */
function fileContext(s: DemoState, f: DocFile) {
  const pid = projectOfLink(s, f.link)
  const proj = s.projects.find((p) => p.id === pid)
  const ctx = { linkLabel: linkLabel(s, f.link), projectLabel: proj ? `${proj.ref} · ${proj.name} (${proj.city})` : '—', lines: [] as [string, string][], body: [] as string[] }
  if (f.kind === 'propuesta' && f.versionOf) {
    const q = s.quotes.find((x) => x.id === f.versionOf!.quoteId)
    const v = q?.versions.find((x) => x.n === f.versionOf!.n)
    ctx.lines.push(['Versión', `v${f.versionOf.n}`])
    if (v) { ctx.body.push(v.summary); if (v.changes) ctx.body.push('Cambios respecto a la versión anterior: ' + v.changes) }
    const req = q?.requestId ? s.requests.find((r) => r.id === q.requestId) : undefined
    req?.snapshot.forEach((c) => ctx.body.push(`· ${c.units} ud. ${c.name}: ${configRows(c.config).slice(0, 4).map(([, val]) => val).join(' · ')} · ${c.config.widthMm}x${c.config.heightMm} mm`))
  }
  if (f.link.type === 'order') {
    const o = s.orders.find((x) => x.id === f.link.id)
    if (o) {
      ctx.lines.push(['Pedido', `${o.ref} · ${o.phase}`], ['Estado actual', ORDER_STATUS_LABEL[o.status]])
      if (f.kind === 'albaran') ctx.body.push(`Entrega registrada el ${o.confirmedDate ?? '—'} con transporte propio. Documento de muestra.`)
      if (f.kind === 'medidas') {
        const cfgs = s.configs.filter((c) => c.projectId === o.projectId)
        cfgs.forEach((c) => ctx.body.push(`· ${c.ref} · ${c.units} ud. · ${TYPOLOGY_NAME[c.config.typology]} · ${c.config.widthMm} x ${c.config.heightMm} mm (medidas de ejemplo)`))
      }
      if (f.kind === 'confirmacion') ctx.body.push('Confirmación de pedido de muestra: tipologías, unidades y acabados según la propuesta confirmada. Sin importes en la demo.')
    }
  }
  if (f.kind === 'plano') ctx.body.push('Plano de ejemplo incluido con la previsualización. No corresponde a una obra real.')
  return ctx
}

export function FileRow({ f, showLink = true, area = 'profesional' }: { f: DocFile; showLink?: boolean; area?: 'profesional' | 'deken' }) {
  const s = useDemo()
  const local = f.source === 'local'
  const dl = async () => {
    await downloadSampleFile(f, fileContext(s, f))
    toast('Documento de muestra descargado', f.name)
  }
  const href = f.link.type === 'project' ? (area === 'deken' ? '/deken/solicitudes' : `/profesional/proyectos/${f.link.id}`) : f.link.type === 'quote' ? `/${area}/presupuestos/${f.link.id}` : `/${area}/pedidos/${f.link.id}`
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-line py-3 last:border-b-0">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-paper-2 text-ink-2" aria-hidden>{local ? <Paperclip size={16} /> : <FileText size={16} />}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.88rem] font-semibold">{f.name}</p>
        <p className="text-[0.76rem] text-ink-3">
          {KIND_LABEL[f.kind]} · {fmtDate(f.date)} · {f.author === 'deken' ? 'Deken' : 'Cliente'}
          {showLink && <> · <Link to={href} className="font-semibold text-ink-2 hover:underline">{linkLabel(s, f.link)}</Link></>}
        </p>
      </div>
      {local
        ? <span className="text-[0.74rem] text-ink-3" title="Archivo seleccionado localmente: solo se muestra su nombre, el contenido no se ha guardado ni subido">Solo nombre · no subido</span>
        : <button onClick={dl} className="inline-flex min-h-9 items-center gap-1.5 rounded-[8px] border border-line px-2.5 text-[0.78rem] font-semibold hover:border-ink-3" aria-label={`Descargar ${f.name}`}><FileDown size={14} aria-hidden />PDF</button>}
    </li>
  )
}

export function OrderProgress({ o, dark = false }: { o: Order; dark?: boolean }) {
  const idx = ORDER_FLOW.indexOf(o.status)
  return (
    <ol className="grid grid-cols-5 gap-1.5" aria-label={`Estado: ${ORDER_STATUS_LABEL[o.status]}`}>
      {ORDER_FLOW.map((st, i) => (
        <li key={st} className="min-w-0">
          <div className={`h-1.5 rounded-full ${i <= idx ? 'bg-green' : dark ? 'bg-white/12' : 'bg-line'}`} />
          <p className={`mt-2 hidden text-[0.7rem] leading-tight sm:block ${i === idx ? 'font-bold text-ink' : 'text-ink-3'}`}>
            {i < idx && <Check size={11} className="mr-0.5 inline text-green-ink" aria-hidden />}{ORDER_STATUS_LABEL[st]}
          </p>
        </li>
      ))}
    </ol>
  )
}

export function Section({ title, children, actions, className = '' }: { title: string; children: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[14px] border border-line bg-surface ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
        <h2 className="text-[1rem] font-bold">{title}</h2>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <div className="px-5 py-3">{children}</div>
    </section>
  )
}

export function BackLink({ to, children }: { to: string; children: React.ReactNode }) {
  return <Link to={to} className="mb-4 inline-flex min-h-9 items-center gap-1.5 text-[0.84rem] font-semibold text-ink-2 hover:text-ink">← {children}</Link>
}
