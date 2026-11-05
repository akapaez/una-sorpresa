import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DEFAULT_CONFIG, type WindowConfig } from '@/three/windowSpec'
import { createSeed, type DemoData } from './seed'
import type {
  AdvisorState, ChatMsg, DocFile, DocSection, FileKind, LinkRef, Order, OrderStatus, Role, Thread, Visibility, EditorialStatus,
} from './types'

/**
 * ADAPTADOR DE DEMOSTRACIÓN
 * Todas las operaciones modifican únicamente este estado local (localStorage del navegador,
 * clave `deken-demo-v1`). En la plataforma real, cada acción se sustituirá por una llamada a
 * un servicio con permisos verificados en servidor (ver docs/SIGUIENTE_FASE.md).
 * No se guardan contenidos de archivos locales ni datos personales reales.
 */

export const today = () => new Date().toISOString().slice(0, 10)
export const nowIso = () => new Date().toISOString().slice(0, 16)
const uid = (p: string) => `${p}${Math.random().toString(36).slice(2, 8)}`
const pad = (n: number, w = 4) => String(n).padStart(w, '0')

interface ConfiguratorDraft { config: WindowConfig; loadedId?: string; name: string; units: number; notes: string }

interface DemoState extends DemoData {
  role: Role
  chat: ChatMsg[]
  advisor: AdvisorState
  draft: ConfiguratorDraft
  compare: string[]
  welcomeSeen: Record<string, boolean>

  setRole: (r: Role) => void
  reset: () => void
  markWelcome: (k: string) => void

  submitAccessRequest: (d: { name: string; email: string; phone: string; company: string; city: string; profile: string; message: string }) => string
  reviewProfessional: (id: string, status: 'aprobado' | 'pendiente' | 'rechazado', note: string) => void

  setDraft: (d: Partial<ConfiguratorDraft>) => void
  resetDraft: () => void
  saveConfig: (p: { projectId?: string; newProject?: { name: string; city: string }; id?: string }) => { configId: string; projectId: string }
  createProject: (name: string, city: string) => string

  addLocalFile: (link: LinkRef, name: string, kind: FileKind) => void
  submitQuoteRequest: (projectId: string, configIds: string[], notes: string, pref: string) => string
  setRequestStatus: (id: string, status: 'recibida' | 'en-revision' | 'respondida') => void
  createQuoteFromRequest: (requestId: string, summary: string) => string
  addQuoteVersion: (quoteId: string, summary: string, changes: string) => void
  requestQuoteRevision: (quoteId: string, text: string) => void

  updateOrder: (orderId: string, p: { status?: OrderStatus; note: string; visibleToClient: boolean; forecastDate?: string; confirmedDate?: string }) => void
  linkDocument: (link: LinkRef, kind: FileKind, name: string) => void

  sendMessage: (threadId: string, author: 'cliente' | 'deken', text: string, attachments?: string[]) => void
  createThread: (subject: string, link: LinkRef, text: string, author: 'cliente' | 'deken') => string
  markThreadRead: (id: string, side: 'cliente' | 'deken') => void
  setThreadStatus: (id: string, status: 'abierta' | 'resuelta') => void

  setDocVisibility: (id: string, v: Visibility) => void
  setDocStatus: (id: string, s: EditorialStatus) => void
  setDocCategory: (id: string, c: string) => void
  updateDocSections: (id: string, sections: DocSection[], title?: string) => void
  createDraftFromCluster: (clusterId: string) => string

  addQuestion: (text: string, from: 'publico' | 'profesional' | 'asistente') => void
  submitContact: (d: { name: string; company: string; city: string; projectType: string; message: string }) => string

  applyImport: (rows: { ref: string; status?: OrderStatus; forecastDate?: string; confirmedDate?: string; note?: string; projectRef?: string; phase?: string; create?: boolean }[], fileName: string, skipped: number, issues: number) => { updated: number; created: number }

  pushChat: (m: ChatMsg) => void
  clearChat: () => void
  setAdvisor: (a: Partial<AdvisorState>) => void
  resetAdvisor: () => void
  setCompare: (ids: string[]) => void
}

const initialDraft = (): ConfiguratorDraft => ({ config: { ...DEFAULT_CONFIG }, name: 'Nueva configuración', units: 1, notes: '' })

const initial = () => ({
  ...createSeed(),
  role: 'visitante' as Role,
  chat: [] as ChatMsg[],
  advisor: { step: 0, answers: {}, done: false } as AdvisorState,
  draft: initialDraft(),
  compare: ['ej-a', 'ej-b'],
  welcomeSeen: {} as Record<string, boolean>,
})

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  documentacion: 'Documentación pendiente',
  revision: 'En revisión técnica',
  fabricacion: 'En fabricación',
  expedicion: 'Listo para expedición',
  entregado: 'Entregado',
}
export const ORDER_FLOW: OrderStatus[] = ['documentacion', 'revision', 'fabricacion', 'expedicion', 'entregado']

const FILE_KIND_SUFFIX: Record<FileKind, string> = {
  plano: 'plano', propuesta: 'propuesta', confirmacion: 'confirmacion-pedido', albaran: 'albaran', factura: 'factura', medidas: 'hoja-medidas', resumen: 'resumen-configuracion', otro: 'documento',
}

export const useDemo = create<DemoState>()(
  persist(
    (set, get) => ({
      ...initial(),

      setRole: (role) => set({ role }),
      reset: () => set({ ...initial() }),
      markWelcome: (k) => set((s) => ({ welcomeSeen: { ...s.welcomeSeen, [k]: true } })),

      submitAccessRequest: (d) => {
        const id = uid('u')
        set((s) => ({
          professionals: [{ id, name: d.name, email: d.email, phone: d.phone, companyId: 'nueva', companyName: d.company, city: d.city, profile: d.profile, message: d.message, status: 'pendiente', requestedAt: today() }, ...s.professionals],
          pendingProfessionalId: id,
          role: 'pendiente',
          activity: [{ id: uid('a'), date: nowIso(), text: `Solicitud de acceso profesional de ${d.name} (${d.company}).`, to: '/deken/profesionales', area: 'deken' }, ...s.activity],
        }))
        return id
      },
      reviewProfessional: (id, status, note) => set((s) => ({
        professionals: s.professionals.map((p) => p.id === id ? { ...p, status, reviewNote: note, reviewedAt: today() } : p),
        activity: [{ id: uid('a'), date: nowIso(), text: `Profesional ${s.professionals.find((p) => p.id === id)?.name} → ${status}.`, to: '/deken/profesionales', area: 'deken' }, ...s.activity],
      })),

      setDraft: (d) => set((s) => ({ draft: { ...s.draft, ...d, config: d.config ? { ...d.config } : s.draft.config } })),
      resetDraft: () => set({ draft: initialDraft() }),

      createProject: (name, city) => {
        const id = uid('p')
        set((s) => ({
          projects: [{ id, ref: `PRJ-${pad(160 + s.projects.length)}`, name, city, companyId: 'c1', status: 'borrador', updatedAt: today(), notes: '' }, ...s.projects],
        }))
        return id
      },

      saveConfig: ({ projectId, newProject, id }) => {
        let pid = projectId
        if (!pid && newProject) pid = get().createProject(newProject.name, newProject.city)
        if (!pid) throw new Error('Proyecto requerido')
        const s = get()
        const d = s.draft
        const existing = id ? s.configs.find((c) => c.id === id) : undefined
        if (existing) {
          set({
            configs: s.configs.map((c) => c.id === id ? { ...c, projectId: pid!, name: d.name, units: d.units, notes: d.notes, config: { ...d.config }, updatedAt: today() } : c),
            projects: s.projects.map((p) => p.id === pid ? { ...p, updatedAt: today() } : p),
          })
          return { configId: existing.id, projectId: pid }
        }
        const cid = uid('k')
        const proj = s.projects.find((p) => p.id === pid)!
        const n = s.configs.filter((c) => c.projectId === pid).length
        set({
          configs: [...s.configs, { id: cid, ref: `CFG-${proj.ref.slice(4)}-${String.fromCharCode(65 + n)}`, projectId: pid, name: d.name, units: d.units, notes: d.notes, config: { ...d.config }, createdAt: today(), updatedAt: today() }],
          projects: s.projects.map((p) => p.id === pid ? { ...p, updatedAt: today() } : p),
          draft: { ...d, loadedId: cid },
        })
        return { configId: cid, projectId: pid }
      },

      addLocalFile: (link, name, kind) => set((s) => ({
        files: [{ id: uid('f'), name, kind, date: today(), link, source: 'local', author: 'cliente' }, ...s.files],
      })),

      submitQuoteRequest: (projectId, configIds, notes, pref) => {
        const id = uid('r')
        set((s) => {
          const snap = s.configs.filter((c) => configIds.includes(c.id)).map((c) => ({ name: c.name, units: c.units, config: { ...c.config } }))
          const proj = s.projects.find((p) => p.id === projectId)!
          const ref = `SOL-2026-${pad(99 + s.requests.length)}`
          return {
            requests: [{ id, ref, projectId, configIds, snapshot: snap, notes, contactPreference: pref, status: 'recibida', createdAt: today() }, ...s.requests],
            projects: s.projects.map((p) => p.id === projectId ? { ...p, status: p.status === 'borrador' ? 'en-presupuesto' : p.status, updatedAt: today() } : p),
            activity: [{ id: uid('a'), date: nowIso(), text: `Nueva solicitud de presupuesto ${ref} · ${proj.name}.`, to: `/deken/solicitudes/${id}`, area: 'ambos' }, ...s.activity],
          }
        })
        return id
      },
      setRequestStatus: (id, status) => set((s) => ({ requests: s.requests.map((r) => r.id === id ? { ...r, status } : r) })),

      createQuoteFromRequest: (requestId, summary) => {
        const s = get()
        const r = s.requests.find((x) => x.id === requestId)!
        if (r.quoteId) { get().addQuoteVersion(r.quoteId, summary, 'Nueva versión creada desde la solicitud.'); return r.quoteId }
        const qid = uid('q')
        const ref = `PRES-2026-${pad(320 + s.quotes.length)}`
        const fid = uid('f')
        set({
          quotes: [{ id: qid, ref, projectId: r.projectId, requestId, status: 'propuesta-disponible', versions: [{ n: 1, date: today(), summary, docId: fid, author: 'Equipo técnico Deken (demo)' }] }, ...s.quotes],
          files: [{ id: fid, name: `${ref}_v1_DEMO.pdf`, kind: 'propuesta', date: today(), link: { type: 'quote', id: qid }, source: 'muestra', author: 'deken', versionOf: { quoteId: qid, n: 1 } }, ...s.files],
          requests: s.requests.map((x) => x.id === requestId ? { ...x, status: 'respondida', quoteId: qid } : x),
          activity: [{ id: uid('a'), date: nowIso(), text: `Propuesta ${ref} v1 disponible.`, to: `/profesional/presupuestos/${qid}`, area: 'ambos' }, ...s.activity],
        })
        return qid
      },
      addQuoteVersion: (quoteId, summary, changes) => set((s) => {
        const q = s.quotes.find((x) => x.id === quoteId)!
        const n = q.versions.length + 1
        const fid = uid('f')
        return {
          quotes: s.quotes.map((x) => x.id === quoteId ? { ...x, status: 'propuesta-disponible', versions: [...x.versions, { n, date: today(), summary, changes, docId: fid, author: 'Equipo técnico Deken (demo)' }] } : x),
          files: [{ id: fid, name: `${q.ref}_v${n}_DEMO.pdf`, kind: 'propuesta', date: today(), link: { type: 'quote', id: quoteId }, source: 'muestra', author: 'deken', versionOf: { quoteId, n } }, ...s.files],
          activity: [{ id: uid('a'), date: nowIso(), text: `Versión ${n} de ${q.ref} disponible.`, to: `/profesional/presupuestos/${quoteId}`, area: 'ambos' }, ...s.activity],
        }
      }),
      requestQuoteRevision: (quoteId, text) => {
        const s = get()
        const q = s.quotes.find((x) => x.id === quoteId)!
        const th = s.threads.find((t) => t.link.type === 'quote' && t.link.id === quoteId)
        if (th) get().sendMessage(th.id, 'cliente', text)
        else get().createThread(`Revisión de ${q.ref}`, { type: 'quote', id: quoteId }, text, 'cliente')
        set((st) => ({ quotes: st.quotes.map((x) => x.id === quoteId ? { ...x, status: 'revision-solicitada' } : x) }))
      },

      updateOrder: (orderId, p) => set((s) => {
        const o = s.orders.find((x) => x.id === orderId)!
        const ev = { id: uid('e'), date: today(), status: p.status && p.status !== o.status ? p.status : undefined, note: p.note || (p.status ? `Estado actualizado: ${ORDER_STATUS_LABEL[p.status]}.` : 'Actualización.'), author: 'Deken (demo)', visibleToClient: p.visibleToClient }
        const upd: Order = { ...o, status: p.status ?? o.status, forecastDate: p.forecastDate ?? o.forecastDate, confirmedDate: p.confirmedDate ?? o.confirmedDate, events: [...o.events, ev] }
        return {
          orders: s.orders.map((x) => x.id === orderId ? upd : x),
          projects: s.projects.map((pr) => pr.id === o.projectId ? { ...pr, updatedAt: today() } : pr),
          activity: p.visibleToClient
            ? [{ id: uid('a'), date: nowIso(), text: `${o.ref}: ${ev.note}`, to: `/profesional/pedidos/${o.id}`, area: 'ambos' }, ...s.activity]
            : s.activity,
        }
      }),
      linkDocument: (link, kind, name) => set((s) => {
        const ref = link.type === 'order' ? s.orders.find((o) => o.id === link.id)?.ref : link.type === 'quote' ? s.quotes.find((q) => q.id === link.id)?.ref : s.projects.find((p) => p.id === link.id)?.ref
        const file: DocFile = { id: uid('f'), name: name || `${ref}_${FILE_KIND_SUFFIX[kind]}_DEMO.pdf`, kind, date: today(), link, source: 'muestra', author: 'deken' }
        return {
          files: [file, ...s.files],
          activity: [{ id: uid('a'), date: nowIso(), text: `Documento ${file.name} vinculado a ${ref}.`, to: '/profesional/documentos', area: 'ambos' }, ...s.activity],
        }
      }),

      sendMessage: (threadId, author, text, attachments) => set((s) => ({
        threads: s.threads.map((t) => t.id === threadId ? {
          ...t, status: 'abierta',
          unreadClient: author === 'deken' ? true : t.unreadClient,
          unreadDeken: author === 'cliente' ? true : t.unreadDeken,
          messages: [...t.messages, { id: uid('m'), author, authorName: author === 'cliente' ? 'Lucía Ortega (demo)' : 'Equipo Deken (demo)', date: nowIso(), text, attachments }],
        } : t),
      })),
      createThread: (subject, link, text, author) => {
        const id = uid('t')
        const t: Thread = {
          id, subject, link, status: 'abierta', unreadClient: author === 'deken', unreadDeken: author === 'cliente',
          messages: [{ id: uid('m'), author, authorName: author === 'cliente' ? 'Lucía Ortega (demo)' : 'Equipo Deken (demo)', date: nowIso(), text }],
        }
        set((s) => ({ threads: [t, ...s.threads] }))
        return id
      },
      markThreadRead: (id, side) => set((s) => ({ threads: s.threads.map((t) => t.id === id ? { ...t, [side === 'cliente' ? 'unreadClient' : 'unreadDeken']: false } : t) })),
      setThreadStatus: (id, status) => set((s) => ({ threads: s.threads.map((t) => t.id === id ? { ...t, status } : t) })),

      setDocVisibility: (id, v) => set((s) => ({ library: s.library.map((d) => d.id === id ? { ...d, visibility: v } : d) })),
      setDocStatus: (id, st) => set((s) => ({
        library: s.library.map((d) => d.id === id ? { ...d, status: st, version: st === 'publicado' && d.version === 'borrador' ? '1.0' : d.version, date: st === 'publicado' ? today() : d.date } : d),
        activity: st === 'publicado' ? [{ id: uid('a'), date: nowIso(), text: `Publicado: ${s.library.find((d) => d.id === id)?.title}.`, to: '/deken/contenidos', area: 'deken' }, ...s.activity] : s.activity,
      })),
      setDocCategory: (id, c) => set((s) => ({ library: s.library.map((d) => d.id === id ? { ...d, category: c } : d) })),
      updateDocSections: (id, sections, title) => set((s) => ({ library: s.library.map((d) => d.id === id ? { ...d, sections, title: title ?? d.title } : d) })),
      createDraftFromCluster: (clusterId) => {
        const s = get()
        const c = s.clusters.find((x) => x.id === clusterId)!
        if (c.draftId) return c.draftId
        const id = uid('d')
        set({
          library: [...s.library, {
            id, slug: `borrador-${id}`, kind: 'guia', title: `Guía: ${c.topic}`, description: 'Borrador propuesto a partir de preguntas recurrentes. Pendiente de revisión.',
            category: 'Sin clasificar', products: [], manufacturer: 'Grupo Deken (demo)', language: 'es', version: 'borrador', date: today(), visibility: 'interno', status: 'borrador', origin: 'demo', fromCluster: clusterId,
            sections: [{ id: 'proposito', title: 'Para qué sirve', body: ['[Completar por el equipo]'] }, { id: 'preguntas', title: 'Preguntas que responde', body: c.questions.slice(0, 4).map((q) => q.text) }],
          }],
          clusters: s.clusters.map((x) => x.id === clusterId ? { ...x, draftId: id } : x),
        })
        return id
      },

      addQuestion: (text, from) => set((s) => {
        const t = text.toLowerCase()
        const match = /presupuesto|document|plano|enviar|medid/.test(t) ? 'qc1' : /oscilo|practicable|apertura|abre/.test(t) ? 'qc2' : /uw|uf|ug|aislamiento|db|acústic|acustic|térmic|termic|ct ?70|living|softslide|focusing/.test(t) ? 'qc3' : /transporte|envi[aá]is|provincia|málaga|madrid|fuera/.test(t) ? 'qc4' : null
        const q = { id: uid('q-'), text, date: today(), from }
        if (match) return { clusters: s.clusters.map((c) => c.id === match ? { ...c, questions: [...c.questions, q] } : c) }
        const other = s.clusters.find((c) => c.id === 'qc-otros')
        if (other) return { clusters: s.clusters.map((c) => c.id === 'qc-otros' ? { ...c, questions: [...c.questions, q] } : c) }
        return { clusters: [...s.clusters, { id: 'qc-otros', topic: 'Otras preguntas sin clasificar', questions: [q], gap: 'sin-contenido', note: 'Revisar y agrupar manualmente.' }] }
      }),
      submitContact: (d) => {
        const id = uid('pc')
        set((s) => {
          const ref = `CON-2026-${pad(215 + s.contacts.length)}`
          return {
            contacts: [{ id, ref, ...d, date: today(), status: 'nueva' }, ...s.contacts],
            activity: [{ id: uid('a'), date: nowIso(), text: `Nueva consulta pública ${ref} (${d.city}).`, to: '/deken/solicitudes', area: 'deken' }, ...s.activity],
          }
        })
        get().addQuestion(d.message.slice(0, 140), 'publico')
        return id
      },

      applyImport: (rows, fileName, skipped, issues) => {
        let updated = 0, created = 0
        set((s) => {
          let orders = [...s.orders]
          for (const r of rows) {
            const ex = orders.find((o) => o.ref === r.ref)
            if (ex) {
              updated++
              orders = orders.map((o) => o.ref === r.ref ? {
                ...o, status: r.status ?? o.status, forecastDate: r.forecastDate ?? o.forecastDate, confirmedDate: r.confirmedDate ?? o.confirmedDate,
                events: [...o.events, { id: uid('e'), date: today(), status: r.status && r.status !== o.status ? r.status : undefined, note: `Importación «${fileName}»: ${r.note || 'datos actualizados'}.`, author: 'Importación (demo)', visibleToClient: true }],
              } : o)
            } else if (r.create) {
              const proj = s.projects.find((p) => p.ref === r.projectRef)
              if (!proj) continue
              created++
              orders = [...orders, { id: uid('o'), ref: r.ref, projectId: proj.id, phase: r.phase || 'Importado', status: r.status ?? 'documentacion', forecastDate: r.forecastDate, confirmedDate: r.confirmedDate, events: [{ id: uid('e'), date: today(), status: r.status ?? 'documentacion', note: `Creado por importación «${fileName}».`, author: 'Importación (demo)', visibleToClient: true }] }]
            }
          }
          return {
            orders,
            imports: [{ id: uid('i'), date: nowIso(), file: fileName, applied: updated + created, skipped, issues }, ...s.imports],
            activity: [{ id: uid('a'), date: nowIso(), text: `Importación «${fileName}»: ${updated} actualizados, ${created} creados.`, to: '/deken/pedidos', area: 'deken' }, ...s.activity],
          }
        })
        return { updated, created }
      },

      pushChat: (m) => set((s) => ({ chat: [...s.chat, m] })),
      clearChat: () => set({ chat: [] }),
      setAdvisor: (a) => set((s) => ({ advisor: { ...s.advisor, ...a, answers: a.answers ? { ...s.advisor.answers, ...a.answers } : s.advisor.answers } })),
      resetAdvisor: () => set({ advisor: { step: 0, answers: {}, done: false } }),
      setCompare: (ids) => set({ compare: ids }),
    }),
    {
      name: 'deken-demo-v1',
      version: 1,
      storage: createJSONStorage(() => {
        try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return localStorage } catch {
          const mem = new Map<string, string>()
          return { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => { mem.set(k, v) }, removeItem: (k) => { mem.delete(k) } }
        }
      }),
    },
  ),
)

/* ---------------- Selectores derivados (una sola fuente para listados y contadores) --------------- */

export const pendingProfessional = (s: DemoState) => s.professionals.find((p) => p.id === s.pendingProfessionalId)
export const projectById = (s: DemoState, id: string) => s.projects.find((p) => p.id === id)
export const filesFor = (s: DemoState, link: LinkRef) => s.files.filter((f) => f.link.type === link.type && f.link.id === link.id)
export const threadsFor = (s: DemoState, link: LinkRef) => s.threads.filter((t) => t.link.type === link.type && t.link.id === link.id)
export function linkLabel(s: DemoState, l: LinkRef): string {
  if (l.type === 'project') { const p = s.projects.find((x) => x.id === l.id); return p ? `${p.ref} · ${p.name}` : '—' }
  if (l.type === 'quote') { const q = s.quotes.find((x) => x.id === l.id); return q ? `${q.ref}` : '—' }
  const o = s.orders.find((x) => x.id === l.id); return o ? `${o.ref}` : '—'
}
export function linkHref(l: LinkRef, area: 'profesional' | 'deken' = 'profesional') {
  const seg = l.type === 'project' ? (area === 'deken' ? 'solicitudes' : 'proyectos') : l.type === 'quote' ? 'presupuestos' : 'pedidos'
  if (area === 'deken' && l.type === 'project') return `/deken/solicitudes`
  return `/${area}/${seg}/${l.id}`
}
export function projectOfLink(s: DemoState, l: LinkRef): string | undefined {
  if (l.type === 'project') return l.id
  if (l.type === 'quote') return s.quotes.find((q) => q.id === l.id)?.projectId
  return s.orders.find((o) => o.id === l.id)?.projectId
}
export type { DemoState }
