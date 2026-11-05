import { DOCS } from './series'

/**
 * Datos del comparador: SERIES REALES con valores tomados de folletos y catálogos Schüco
 * (y, donde se indica, de la web actual de Deken). Cada valor lleva unidad, contexto y fuente.
 * Un valor de catálogo corresponde a la configuración ensayada, no a cualquier ventana de la serie.
 * Ug no se publica: depende de la composición de vidrio que defina Deken en cada proyecto.
 */
export interface Cell { v?: string; unit?: string; src?: string; ctx?: string }
export interface CompareItem { id: string; name: string; kind: 'serie'; cells: Record<string, Cell> }
export interface Row { id: string; label: string; help?: string; summary?: boolean }
export interface Category { id: string; label: string; rows: Row[] }

/** Clave corta (superíndice) → documento. */
const KEYS = ['ct70-cat', 'ct70c-fol', 'living-fol', 'focusing-fol', 'softslide-cat', 'deken-web'] as const
export const SRC_KEY = Object.fromEntries(KEYS.map((k, i) => [k, String(i + 1)])) as Record<(typeof KEYS)[number], string>
export const SOURCES: Record<string, string> = Object.fromEntries(KEYS.map((k, i) => [String(i + 1), `${DOCS[k].title}${DOCS[k].edition ? ` (${DOCS[k].edition})` : ''}.`]))
const S = SRC_KEY

export const CATEGORIES: Category[] = [
  { id: 'sistema', label: 'Sistema', rows: [
    { id: 'tipo', label: 'Tipo de sistema', summary: true },
    { id: 'tipologia', label: 'Tipologías (orientativo)', help: 'Se confirma en la revisión técnica.', summary: true },
  ] },
  { id: 'composicion', label: 'Profundidad y composición', rows: [
    { id: 'profundidad', label: 'Profundidad de marco', summary: true },
    { id: 'camaras', label: 'Cámaras' },
    { id: 'juntas', label: 'Planos de junta' },
    { id: 'vidrio', label: 'Espesor de vidrio admitido', help: 'Condiciona Ug, Uw y el comportamiento acústico.' },
  ] },
  { id: 'termico', label: 'Aislamiento térmico', rows: [
    { id: 'uf', label: 'Uf · marco', help: 'Transmitancia del marco. No es la de la ventana.', summary: true },
    { id: 'ug', label: 'Ug · vidrio', help: 'Depende de la composición de vidrio elegida.' },
    { id: 'uw', label: 'Uw · ventana', help: 'Transmitancia del conjunto para una medida y vidrio concretos.' },
  ] },
  { id: 'acustico', label: 'Aislamiento acústico', rows: [
    { id: 'rw', label: 'Índice acústico máximo', help: 'Con vidrio acústico; depende de la configuración ensayada.', summary: true },
  ] },
  { id: 'prestaciones', label: 'Ensayos', rows: [
    { id: 'rc', label: 'Resistencia a la efracción' },
    { id: 'aire', label: 'Permeabilidad al aire', help: 'DIN EN 12207' },
    { id: 'agua', label: 'Estanqueidad al agua', help: 'DIN EN 12208' },
    { id: 'viento', label: 'Resistencia al viento', help: 'DIN EN 12210' },
  ] },
  { id: 'doc', label: 'Documentación', rows: [
    { id: 'doc', label: 'Documentos consultados', summary: true },
  ] },
]

const UG: Cell = { v: 'Según vidrio', ctx: 'se define en la propuesta' }
const ND: Cell = {}

export const COMPARE_ITEMS: CompareItem[] = [
  { id: 's-ct70', name: 'Schüco CT 70', kind: 'serie', cells: {
    tipo: { v: 'Ventana y puerta de PVC' }, tipologia: { v: 'Practicable · oscilobatiente · balconera · puerta' },
    profundidad: { v: '70', unit: 'mm', src: S['ct70-cat'], ctx: 'Classic y Rondo; Accent 112 mm' }, camaras: { v: '5', src: S['ct70c-fol'] }, juntas: { v: '2', src: S['ct70c-fol'] },
    vidrio: { v: '4 – 42', unit: 'mm', src: S['ct70-cat'] },
    uf: { v: '1,3', unit: 'W/(m²K)', src: S['ct70-cat'], ctx: 'DIN EN 12412-2 · el folleto Classic indica «hasta 1,2»' }, ug: UG, uw: ND,
    rw: { v: '47', unit: 'dB', src: S['ct70-cat'], ctx: 'Rw,P máx. · el folleto Classic indica «hasta 49 dB»' },
    rc: { v: 'RC 2', src: S['ct70-cat'] }, aire: { v: 'Clase 4', src: S['ct70-cat'] }, agua: { v: 'Clase 9A', src: S['ct70-cat'] }, viento: { v: 'Clase B5', src: S['ct70-cat'], ctx: 'según perfil y vidrio' },
    doc: { v: 'Catálogo técnico 2026 · folleto Classic' },
  } },
  { id: 's-living', name: 'Schüco LivIng', kind: 'serie', cells: {
    tipo: { v: 'Ventana de PVC' }, tipologia: { v: 'Practicable · oscilobatiente · balconera' },
    profundidad: { v: '82', unit: 'mm', src: S['living-fol'] }, camaras: { v: '7', src: S['living-fol'] }, juntas: { v: '2 (AS) · 3 (MD)', src: S['living-fol'] },
    vidrio: { v: '16 – 54', unit: 'mm', src: S['living-fol'] },
    uf: { v: '1,0 · 0,96', unit: 'W/(m²K)', src: S['living-fol'], ctx: '«desde» · 82 AS / 82 MD' }, ug: UG, uw: ND,
    rw: { v: '47', unit: 'dB', src: S['living-fol'], ctx: '«hasta», con vidrio acústico' },
    rc: { v: 'RC 2', src: S['living-fol'], ctx: 'con vidrio de seguridad' }, aire: ND, agua: ND, viento: ND,
    doc: { v: 'Folleto LivIng Classic' },
  } },
  { id: 's-focusing', name: 'Schüco FocusIng', kind: 'serie', cells: {
    tipo: { v: 'Ventana de PVC' }, tipologia: { v: 'Practicable · oscilobatiente · balconera' },
    profundidad: { v: '70 / 76', unit: 'mm', src: S['focusing-fol'] }, camaras: { v: '5 / 6', src: S['focusing-fol'] }, juntas: { v: '2', src: S['focusing-fol'], ctx: 'la web de Deken cita 2 o 3 según versión' },
    vidrio: { v: '10 – 54', unit: 'mm', src: S['focusing-fol'] },
    uf: { v: '1,1', unit: 'W/(m²K)', src: S['focusing-fol'], ctx: '«desde»' }, ug: UG,
    uw: { v: '< 0,80', unit: 'W/(m²K)', src: S['focusing-fol'], ctx: 'folleto; configuración de ensayo no indicada' },
    rw: { v: '48', unit: 'dB', src: S['focusing-fol'], ctx: '«hasta», con vidrio acústico' },
    rc: { v: 'RC 2', src: S['focusing-fol'], ctx: 'con vidrio de seguridad' }, aire: ND, agua: ND, viento: ND,
    doc: { v: 'Folleto FocusIng' },
  } },
  { id: 's-softslide', name: 'Schüco SoftSlide', kind: 'serie', cells: {
    tipo: { v: 'Corredera de PVC' }, tipologia: { v: 'Corredera' },
    profundidad: { v: '74', unit: 'mm', src: S['softslide-cat'], ctx: 'hoja de 50 mm' }, camaras: ND, juntas: { v: '2', src: S['deken-web'] },
    vidrio: { v: '4 – 28', unit: 'mm', src: S['softslide-cat'] },
    uf: { v: '1,4 – 2,3', unit: 'W/(m²K)', src: S['softslide-cat'], ctx: 'según perfil' }, ug: UG, uw: ND,
    rw: ND,
    rc: ND, aire: { v: 'Clase 4', src: S['softslide-cat'] }, agua: { v: 'Clase 6A', src: S['softslide-cat'] }, viento: { v: 'Clase B3', src: S['softslide-cat'] },
    doc: { v: 'Catálogo de pedidos y fabricación 09.2023' },
  } },
  { id: 's-elevadoras', name: 'Elevadoras (LivIngSlide · FocusIngSlide)', kind: 'serie', cells: {
    tipo: { v: 'Corredera elevable de PVC' }, tipologia: { v: 'Elevadora' },
    profundidad: { v: '194 · 167', unit: 'mm', src: S['deken-web'], ctx: 'LivIngSlide · FocusIngSlide (marco)' }, camaras: ND, juntas: { v: 'Hasta 3', src: S['deken-web'] },
    vidrio: ND, uf: ND, ug: UG, uw: ND,
    rw: { v: '45', unit: 'dB', src: S['deken-web'], ctx: 'según web Deken; sin contrastar' },
    rc: { v: 'RC 2', src: S['deken-web'], ctx: 'según web Deken' }, aire: ND, agua: ND, viento: ND,
    doc: { v: 'Web Deken · catálogo pendiente de lectura' },
  } },
]

/** Tipología → serie de referencia para abrir el comparador desde el asesor. */
export const TYPOLOGY_TO_EXAMPLE: Record<string, string> = { practicable: 's-ct70', puerta: 's-ct70', oscilobatiente: 's-living', balconera: 's-focusing', corredera: 's-softslide', elevadora: 's-elevadoras' }
