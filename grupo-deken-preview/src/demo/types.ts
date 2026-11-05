import type { WindowConfig } from '@/three/windowSpec'

/** Todos los datos de este módulo son FICTICIOS y existen solo para la previsualización. */

export type Role = 'visitante' | 'pendiente' | 'aprobado' | 'deken'

export interface Company { id: string; name: string; city: string }

export interface Professional {
  id: string
  name: string
  email: string
  phone: string
  companyId: string
  companyName: string
  city: string
  profile: string
  message: string
  status: 'pendiente' | 'aprobado' | 'rechazado'
  requestedAt: string
  reviewedAt?: string
  reviewNote?: string
}

export interface SavedConfig {
  id: string
  ref: string
  projectId: string
  name: string
  config: WindowConfig
  units: number
  notes: string
  createdAt: string
  updatedAt: string
}

export type FileKind = 'plano' | 'propuesta' | 'confirmacion' | 'albaran' | 'factura' | 'medidas' | 'resumen' | 'otro'
export interface LinkRef { type: 'project' | 'quote' | 'order'; id: string }

export interface DocFile {
  id: string
  name: string
  kind: FileKind
  date: string
  link: LinkRef
  /** Archivo de muestra generado en el navegador (PDF) o seleccionado localmente (solo nombre, no se guarda el contenido). */
  source: 'muestra' | 'local'
  author: 'deken' | 'cliente'
  sizeLabel?: string
  versionOf?: { quoteId: string; n: number }
}

export type ProjectStatus = 'borrador' | 'en-presupuesto' | 'en-fabricacion' | 'entregado'
export interface Project {
  id: string
  ref: string
  name: string
  city: string
  companyId: string
  status: ProjectStatus
  updatedAt: string
  notes: string
}

export type RequestStatus = 'recibida' | 'en-revision' | 'respondida'
export interface QuoteRequest {
  id: string
  ref: string
  projectId: string
  configIds: string[]
  /** Copia de las configuraciones en el momento de enviar (no cambia si luego se edita el proyecto). */
  snapshot: { name: string; units: number; config: WindowConfig }[]
  notes: string
  contactPreference: string
  status: RequestStatus
  createdAt: string
  quoteId?: string
}

export interface QuoteVersion {
  n: number
  date: string
  summary: string
  changes?: string
  docId: string
  author: string
}
export type QuoteStatus = 'en-preparacion' | 'propuesta-disponible' | 'revision-solicitada' | 'confirmado'
export interface Quote {
  id: string
  ref: string
  projectId: string
  requestId?: string
  status: QuoteStatus
  versions: QuoteVersion[]
}

export type OrderStatus = 'documentacion' | 'revision' | 'fabricacion' | 'expedicion' | 'entregado'
export interface OrderEvent {
  id: string
  date: string
  status?: OrderStatus
  note: string
  author: string
  visibleToClient: boolean
}
export interface Order {
  id: string
  ref: string
  projectId: string
  quoteId?: string
  phase: string
  status: OrderStatus
  /** Previsión (estimada) frente a fecha confirmada por Deken. */
  forecastDate?: string
  confirmedDate?: string
  events: OrderEvent[]
}

export interface Message {
  id: string
  author: 'cliente' | 'deken'
  authorName: string
  date: string
  text: string
  attachments?: string[]
}
export interface Thread {
  id: string
  subject: string
  link: LinkRef
  status: 'abierta' | 'resuelta'
  messages: Message[]
  unreadClient: boolean
  unreadDeken: boolean
}

export type Visibility = 'publico' | 'profesional' | 'interno'
export type EditorialStatus = 'incorporado' | 'revision' | 'aprobado' | 'publicado' | 'borrador'
export interface DocSection { id: string; title: string; body: string[] }
export interface LibraryDoc {
  id: string
  slug: string
  title: string
  description: string
  kind: 'guia' | 'ficha' | 'muestrario' | 'plantilla' | 'nota'
  category: string
  products: string[]
  manufacturer: string
  language: 'es' | 'en' | 'de'
  version: string
  date: string
  visibility: Visibility
  status: EditorialStatus
  sections: DocSection[]
  /** 'demo': redactado para la demostración. 'schueco': resumen de un folleto o catálogo Schüco aportado. */
  origin: 'demo' | 'schueco'
  /** Documento original (no se publica con la web: solo se cita). */
  sourceFile?: string
  fromCluster?: string
  readingMinutes?: number
}

export interface Question { id: string; text: string; date: string; from: 'publico' | 'profesional' | 'asistente' }
export interface QuestionCluster {
  id: string
  topic: string
  questions: Question[]
  gap: 'sin-contenido' | 'cubierto' | 'requiere-documentacion'
  coveredBy?: string
  draftId?: string
  note: string
}

export interface Activity { id: string; date: string; text: string; to?: string; area: 'deken' | 'cliente' | 'ambos' }

export interface ChatMsg {
  id: string
  role: 'user' | 'assistant'
  text: string
  sources?: { docId: string; sectionId: string }[]
  kind?: 'respuesta' | 'sin-documentacion' | 'derivada'
}

export interface AdvisorState {
  step: number
  answers: Record<string, string | string[]>
  done: boolean
}

export interface PublicContact {
  id: string
  ref: string
  name: string
  company: string
  city: string
  projectType: string
  message: string
  date: string
  status: 'nueva' | 'respondida'
}

export interface ImportRecord { id: string; date: string; file: string; applied: number; skipped: number; issues: number }
