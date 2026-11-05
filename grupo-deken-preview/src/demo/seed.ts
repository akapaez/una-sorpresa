import { DEFAULT_CONFIG, type WindowConfig } from '@/three/windowSpec'
import type {
  Activity, Company, DocFile, LibraryDoc, Order, Professional, Project, PublicContact, QuestionCluster, Quote,
  QuoteRequest, SavedConfig, Thread,
} from './types'
import { LIBRARY_SEED } from '@/content/library'

/**
 * Conjunto de datos FICTICIO y reducido, pero relacionado: listados, contadores y
 * detalles derivan de estas mismas colecciones. Empresas y personas son inventadas.
 */

const cfg = (o: Partial<WindowConfig>): WindowConfig => ({ ...DEFAULT_CONFIG, ...o })

export const COMPANIES: Company[] = [
  { id: 'c1', name: 'Reformas Ejemplo Aljarafe, S.L. (demo)', city: 'Mairena del Aljarafe' },
  { id: 'c2', name: 'Estudio Técnico Muestra (demo)', city: 'Sevilla' },
]

export interface DemoData {
  professionals: Professional[]
  projects: Project[]
  configs: SavedConfig[]
  files: DocFile[]
  requests: QuoteRequest[]
  quotes: Quote[]
  orders: Order[]
  threads: Thread[]
  library: LibraryDoc[]
  clusters: QuestionCluster[]
  contacts: PublicContact[]
  activity: Activity[]
  imports: { id: string; date: string; file: string; applied: number; skipped: number; issues: number }[]
  /** Identidad usada en modo «profesional pendiente» (la última solicitud enviada o la sembrada). */
  pendingProfessionalId: string
}

export function createSeed(): DemoData {
  const professionals: Professional[] = [
    {
      id: 'u1', name: 'Lucía Ortega (demo)', email: 'lucia.ortega@ejemplo.test', phone: '600 000 101', companyId: 'c1',
      companyName: COMPANIES[0].name, city: 'Mairena del Aljarafe', profile: 'Empresa de reformas',
      message: 'Rehabilitación de edificios residenciales en el Aljarafe.', status: 'aprobado',
      requestedAt: '2026-06-03', reviewedAt: '2026-06-05', reviewNote: 'Empresa de demostración aprobada.',
    },
    {
      id: 'u2', name: 'Javier Ruiz (demo)', email: 'javier.ruiz@ejemplo.test', phone: '600 000 202', companyId: 'c2',
      companyName: COMPANIES[1].name, city: 'Sevilla', profile: 'Estudio técnico',
      message: 'Prescripción de carpintería para una promoción de 18 viviendas en Dos Hermanas.', status: 'pendiente',
      requestedAt: '2026-10-30',
    },
  ]

  const projects: Project[] = [
    { id: 'p1', ref: 'PRJ-0142', name: 'Rehabilitación edificio C/ Feria', city: 'Sevilla', companyId: 'c1', status: 'en-presupuesto', updatedAt: '2026-10-21', notes: 'Sustitución de carpintería en 4 plantas. Fachada protegida: mantener proporciones de huecos existentes.' },
    { id: 'p2', ref: 'PRJ-0128', name: 'Viviendas Plaza de la Constitución', city: 'Bormujos', companyId: 'c1', status: 'en-fabricacion', updatedAt: '2026-10-28', notes: 'Obra nueva en dos fases. Fase 1 entregada; fase 2 en fabricación.' },
    { id: 'p3', ref: 'PRJ-0155', name: 'Reforma ático Triana', city: 'Sevilla', companyId: 'c1', status: 'borrador', updatedAt: '2026-11-02', notes: 'Cliente final interesado en acabado madera al interior. Pendiente de confirmar medidas.' },
  ]

  const configs: SavedConfig[] = [
    { id: 'k1', ref: 'CFG-0142-A', projectId: 'p1', name: 'Ventana tipo fachada', units: 12, config: cfg({ typology: 'practicable', leaves: 2, widthMm: 1200, heightMm: 1400 }), notes: 'Huecos de plantas 1 a 3.', createdAt: '2026-10-02', updatedAt: '2026-10-02' },
    { id: 'k2', ref: 'CFG-0142-B', projectId: 'p1', name: 'Balconera salón', units: 4, config: cfg({ typology: 'balconera', leaves: 2, finishExterior: 'antracita', widthMm: 1400, heightMm: 2200 }), notes: 'Exterior antracita, interior blanco (cambio pedido el 15/10).', createdAt: '2026-10-02', updatedAt: '2026-10-15' },
    { id: 'k3', ref: 'CFG-0128-A', projectId: 'p2', name: 'Dormitorios', units: 24, config: cfg({ typology: 'oscilobatiente', leaves: 1, finishInterior: 'antracita', finishExterior: 'antracita', widthMm: 900, heightMm: 1300 }), notes: '', createdAt: '2026-09-01', updatedAt: '2026-09-01' },
    { id: 'k4', ref: 'CFG-0128-B', projectId: 'p2', name: 'Salida a terraza', units: 12, config: cfg({ typology: 'corredera', leaves: 2, finishInterior: 'antracita', finishExterior: 'antracita', widthMm: 1800, heightMm: 2100 }), notes: '', createdAt: '2026-09-01', updatedAt: '2026-09-01' },
    { id: 'k5', ref: 'CFG-0155-A', projectId: 'p3', name: 'Ventana estudio', units: 2, config: cfg({ typology: 'practicable', leaves: 1, finishInterior: 'madera', finishExterior: 'blanco', widthMm: 800, heightMm: 1200, glass: 'privacidad' }), notes: 'Vidrio de privacidad por patio interior.', createdAt: '2026-11-02', updatedAt: '2026-11-02' },
  ]

  const files: DocFile[] = [
    { id: 'f1', name: 'PRJ-0142_alzado-fachada_EJEMPLO.pdf', kind: 'plano', date: '2026-10-02', link: { type: 'project', id: 'p1' }, source: 'muestra', author: 'cliente' },
    { id: 'f2', name: 'PRES-2026-0311_v1_DEMO.pdf', kind: 'propuesta', date: '2026-10-08', link: { type: 'quote', id: 'q1' }, source: 'muestra', author: 'deken', versionOf: { quoteId: 'q1', n: 1 } },
    { id: 'f3', name: 'PRES-2026-0311_v2_DEMO.pdf', kind: 'propuesta', date: '2026-10-21', link: { type: 'quote', id: 'q1' }, source: 'muestra', author: 'deken', versionOf: { quoteId: 'q1', n: 2 } },
    { id: 'f4', name: 'PRES-2026-0287_v1_DEMO.pdf', kind: 'propuesta', date: '2026-09-12', link: { type: 'quote', id: 'q2' }, source: 'muestra', author: 'deken', versionOf: { quoteId: 'q2', n: 1 } },
    { id: 'f5', name: 'PED-2026-027_confirmacion-pedido_DEMO.pdf', kind: 'confirmacion', date: '2026-09-20', link: { type: 'order', id: 'o1' }, source: 'muestra', author: 'deken' },
    { id: 'f6', name: 'ALB-2026-0412_albaran_DEMO.pdf', kind: 'albaran', date: '2026-10-14', link: { type: 'order', id: 'o1' }, source: 'muestra', author: 'deken' },
    { id: 'f7', name: 'FAC-2026-0398_factura_DEMO.pdf', kind: 'factura', date: '2026-10-16', link: { type: 'order', id: 'o1' }, source: 'muestra', author: 'deken' },
    { id: 'f8', name: 'PED-2026-031_confirmacion-pedido_DEMO.pdf', kind: 'confirmacion', date: '2026-10-09', link: { type: 'order', id: 'o2' }, source: 'muestra', author: 'deken' },
    { id: 'f9', name: 'PED-2026-031_hoja-medidas_DEMO.pdf', kind: 'medidas', date: '2026-10-09', link: { type: 'order', id: 'o2' }, source: 'muestra', author: 'deken' },
    { id: 'f10', name: 'PRJ-0128_planta-tipo_EJEMPLO.pdf', kind: 'plano', date: '2026-08-28', link: { type: 'project', id: 'p2' }, source: 'muestra', author: 'cliente' },
  ]

  const requests: QuoteRequest[] = [
    {
      id: 'r1', ref: 'SOL-2026-0098', projectId: 'p1', configIds: ['k1', 'k2'],
      snapshot: [
        { name: 'Ventana tipo fachada', units: 12, config: configs[0].config },
        { name: 'Balconera salón', units: 4, config: configs[1].config },
      ],
      notes: 'Necesitamos propuesta antes de la reunión con la comunidad (finales de octubre).', contactPreference: 'Correo electrónico',
      status: 'respondida', createdAt: '2026-10-02', quoteId: 'q1',
    },
    {
      id: 'r2', ref: 'SOL-2026-0081', projectId: 'p2', configIds: ['k3', 'k4'],
      snapshot: [
        { name: 'Dormitorios', units: 24, config: configs[2].config },
        { name: 'Salida a terraza', units: 12, config: configs[3].config },
      ],
      notes: 'Dos fases de entrega.', contactPreference: 'Teléfono', status: 'respondida', createdAt: '2026-08-28', quoteId: 'q2',
    },
  ]

  const quotes: Quote[] = [
    {
      id: 'q1', ref: 'PRES-2026-0311', projectId: 'p1', requestId: 'r1', status: 'propuesta-disponible',
      versions: [
        { n: 1, date: '2026-10-08', summary: 'Propuesta inicial: 12 ventanas practicables de 2 hojas y 4 balconeras de 2 hojas, acabado blanco.', docId: 'f2', author: 'Equipo técnico Deken (demo)' },
        { n: 2, date: '2026-10-21', summary: 'Revisión tras consulta del cliente.', changes: 'Balconeras con acabado exterior antracita e interior blanco, según conversación del 15/10. Se marca para revisión en obra la medida de 2 huecos de la planta 3.', docId: 'f3', author: 'Equipo técnico Deken (demo)' },
      ],
    },
    {
      id: 'q2', ref: 'PRES-2026-0287', projectId: 'p2', requestId: 'r2', status: 'confirmado',
      versions: [
        { n: 1, date: '2026-09-12', summary: 'Propuesta para 24 oscilobatientes y 12 correderas en antracita, entrega en dos fases.', docId: 'f4', author: 'Equipo técnico Deken (demo)' },
      ],
    },
  ]

  const orders: Order[] = [
    {
      id: 'o1', ref: 'PED-2026-027', projectId: 'p2', quoteId: 'q2', phase: 'Fase 1 · bloque A', status: 'entregado',
      forecastDate: '2026-10-10', confirmedDate: '2026-10-14',
      events: [
        { id: 'e1', date: '2026-09-20', status: 'documentacion', note: 'Pedido registrado. Pendiente de confirmar medidas definitivas.', author: 'Deken (demo)', visibleToClient: true },
        { id: 'e2', date: '2026-09-24', status: 'revision', note: 'Medidas recibidas y revisadas.', author: 'Deken (demo)', visibleToClient: true },
        { id: 'e3', date: '2026-09-29', status: 'fabricacion', note: 'En fabricación.', author: 'Deken (demo)', visibleToClient: true },
        { id: 'e4', date: '2026-10-11', status: 'expedicion', note: 'Material listo. Entrega acordada para el 14/10.', author: 'Deken (demo)', visibleToClient: true },
        { id: 'e5', date: '2026-10-14', status: 'entregado', note: 'Entregado en obra con transporte propio. Albarán firmado.', author: 'Deken (demo)', visibleToClient: true },
      ],
    },
    {
      id: 'o2', ref: 'PED-2026-031', projectId: 'p2', quoteId: 'q2', phase: 'Fase 2 · bloque B', status: 'fabricacion',
      forecastDate: '2026-11-20',
      events: [
        { id: 'e6', date: '2026-10-09', status: 'documentacion', note: 'Pedido registrado.', author: 'Deken (demo)', visibleToClient: true },
        { id: 'e7', date: '2026-10-16', status: 'revision', note: 'Revisión técnica completada. Sin incidencias.', author: 'Deken (demo)', visibleToClient: true },
        { id: 'e8', date: '2026-10-27', status: 'fabricacion', note: 'Entra en fabricación. Previsión de entrega: semana del 16/11 (por confirmar).', author: 'Deken (demo)', visibleToClient: true },
        { id: 'e9', date: '2026-10-28', note: 'Nota interna: reservar camión para la semana 47.', author: 'Deken (demo)', visibleToClient: false },
      ],
    },
  ]

  const threads: Thread[] = [
    {
      id: 't1', subject: 'Versión 2 · acabado exterior de balconeras', link: { type: 'quote', id: 'q1' }, status: 'abierta',
      unreadClient: false, unreadDeken: false,
      messages: [
        { id: 'm1', author: 'cliente', authorName: 'Lucía Ortega (demo)', date: '2026-10-15T10:12', text: 'La comunidad prefiere las balconeras en antracita por fuera. ¿Podéis revisar la propuesta con ese cambio? Por dentro seguimos en blanco.' },
        { id: 'm2', author: 'deken', authorName: 'Equipo técnico Deken (demo)', date: '2026-10-21T13:40', text: 'Hecho: tienes la versión 2 disponible. Hemos marcado dos huecos de la planta 3 para revisar medida en obra antes de fabricar.', attachments: ['f3'] },
      ],
    },
    {
      id: 't2', subject: 'Previsión de entrega fase 2', link: { type: 'order', id: 'o2' }, status: 'abierta',
      unreadClient: true, unreadDeken: false,
      messages: [
        { id: 'm3', author: 'cliente', authorName: 'Lucía Ortega (demo)', date: '2026-10-27T09:05', text: '¿Tenéis ya previsión para la fase 2? Necesitamos coordinar la grúa.' },
        { id: 'm4', author: 'deken', authorName: 'Logística Deken (demo)', date: '2026-10-28T12:30', text: 'Previsión: semana del 16/11. Te confirmaremos el día exacto cuando el pedido pase a «Listo para expedición».' },
      ],
    },
    {
      id: 't3', subject: 'Planos del ático', link: { type: 'project', id: 'p3' }, status: 'abierta',
      unreadClient: false, unreadDeken: true,
      messages: [
        { id: 'm5', author: 'cliente', authorName: 'Lucía Ortega (demo)', date: '2026-11-02T18:20', text: 'Os subiré el plano del ático esta semana. ¿Con un PDF acotado es suficiente para una primera propuesta?' },
      ],
    },
  ]

  const clusters: QuestionCluster[] = [
    {
      id: 'qc1', topic: 'Qué documentación enviar para pedir presupuesto', gap: 'sin-contenido', draftId: 'd9',
      note: 'Pregunta recurrente en contacto público y en el asistente. La guía pública actual la cubre solo en parte.',
      questions: [
        { id: 'q-1', text: '¿Qué necesito enviaros para pedir un presupuesto?', date: '2026-10-03', from: 'publico' },
        { id: 'q-2', text: '¿Vale un plano en PDF o tiene que ser DWG?', date: '2026-10-07', from: 'asistente' },
        { id: 'q-3', text: '¿Tengo que medir yo los huecos?', date: '2026-10-11', from: 'publico' },
        { id: 'q-4', text: 'Si no tengo planos, ¿puedo mandar fotos y medidas?', date: '2026-10-16', from: 'asistente' },
        { id: 'q-5', text: '¿Hace falta indicar el acabado en la primera consulta?', date: '2026-10-22', from: 'profesional' },
        { id: 'q-6', text: 'Documentación mínima para presupuesto de reforma', date: '2026-10-29', from: 'asistente' },
        { id: 'q-7', text: '¿Qué información pedís del proyecto?', date: '2026-11-01', from: 'publico' },
      ],
    },
    {
      id: 'qc2', topic: 'Diferencia entre practicable y oscilobatiente', gap: 'cubierto', coveredBy: 'd1',
      note: 'Cubierto por la guía pública de tipos de apertura.',
      questions: [
        { id: 'q-8', text: '¿Qué diferencia hay entre practicable y oscilobatiente?', date: '2026-10-05', from: 'asistente' },
        { id: 'q-9', text: '¿La oscilobatiente se puede abrir del todo?', date: '2026-10-18', from: 'publico' },
        { id: 'q-10', text: 'Ventana que bascula arriba, ¿cómo se llama?', date: '2026-10-25', from: 'asistente' },
      ],
    },
    {
      id: 'qc3', topic: 'Valores de aislamiento de series concretas', gap: 'requiere-documentacion',
      note: 'No se puede responder sin las fichas técnicas oficiales aportadas por Deken. No generar borrador con cifras.',
      questions: [
        { id: 'q-11', text: '¿Qué Uw tiene la serie CT 70?', date: '2026-10-09', from: 'asistente' },
        { id: 'q-12', text: 'Aislamiento acústico de la SoftSlide', date: '2026-10-19', from: 'profesional' },
        { id: 'q-13', text: '¿LivIng o CT 70 para una zona con mucho ruido?', date: '2026-10-30', from: 'asistente' },
      ],
    },
    {
      id: 'qc4', topic: 'Transporte fuera de la provincia de Sevilla', gap: 'cubierto', coveredBy: 'd2',
      note: 'Condición de suministro explicada en contacto y en la guía de consulta.',
      questions: [
        { id: 'q-14', text: '¿Enviáis a Málaga?', date: '2026-10-12', from: 'publico' },
        { id: 'q-15', text: 'Obra en Badajoz, ¿podéis fabricar?', date: '2026-10-26', from: 'publico' },
      ],
    },
  ]

  const contacts: PublicContact[] = [
    { id: 'pc1', ref: 'CON-2026-0214', name: 'Marta Gil (demo)', company: 'Construcciones Demo Écija', city: 'Écija', projectType: 'Obra nueva', message: 'Promoción de 6 viviendas unifamiliares. Querríamos conocer cómo trabajáis y qué necesitáis para valorar.', date: '2026-11-01', status: 'nueva' },
  ]

  const activity: Activity[] = [
    { id: 'a1', date: '2026-11-02T18:20', text: 'Nuevo mensaje de Reformas Ejemplo Aljarafe en «Planos del ático».', to: '/deken/solicitudes', area: 'deken' },
    { id: 'a2', date: '2026-11-01T11:00', text: 'Nueva consulta pública CON-2026-0214 (Écija).', to: '/deken/solicitudes', area: 'deken' },
    { id: 'a3', date: '2026-10-30T09:30', text: 'Solicitud de acceso profesional de Javier Ruiz (demo).', to: '/deken/profesionales', area: 'deken' },
    { id: 'a4', date: '2026-10-28T12:30', text: 'Previsión de entrega de PED-2026-031 comunicada.', to: '/profesional/pedidos/o2', area: 'ambos' },
    { id: 'a5', date: '2026-10-21T13:40', text: 'Versión 2 de PRES-2026-0311 disponible.', to: '/profesional/presupuestos/q1', area: 'ambos' },
  ]

  return {
    professionals, projects, configs, files, requests, quotes, orders, threads,
    library: structuredClone(LIBRARY_SEED), clusters, contacts, activity, imports: [],
    pendingProfessionalId: 'u2',
  }
}
