/**
 * Datos del comparador.
 * - «Ejemplo A/B/C» son productos GENÉRICOS de demostración con valores FICTICIOS para revisar
 *   el diseño de la tabla. Nunca se asignan cifras a series Schüco reales.
 * - Las series reales aparecen con «Sin dato confirmado» hasta disponer de documentación.
 */
export interface Cell { v?: string; unit?: string; src?: string; ctx?: string }
export interface CompareItem { id: string; name: string; kind: 'ejemplo' | 'serie'; cells: Record<string, Cell> }
export interface Row { id: string; label: string; help?: string; summary?: boolean }
export interface Category { id: string; label: string; rows: Row[] }

export const SOURCES: Record<string, string> = {
  F: 'Valor ficticio de maqueta para revisar el diseño. No corresponde a ningún producto real.',
  D: 'Descripción general de la tipología (guía «Tipos de apertura», documento de demostración).',
}

export const CATEGORIES: Category[] = [
  { id: 'sistema', label: 'Sistema y tipología', rows: [
    { id: 'tipo', label: 'Tipo de elemento', summary: true },
    { id: 'tipologia', label: 'Tipología de apertura', summary: true },
  ] },
  { id: 'apertura', label: 'Apertura y uso previsto', rows: [
    { id: 'movimiento', label: 'Movimiento', summary: true },
    { id: 'espacio', label: 'Espacio interior al abrir' },
    { id: 'uso', label: 'Uso previsto' },
  ] },
  { id: 'composicion', label: 'Profundidad y composición', rows: [
    { id: 'profundidad', label: 'Profundidad de marco', help: 'Solo con fuente documentada.' },
  ] },
  { id: 'vidrio', label: 'Acristalamiento', rows: [
    { id: 'composicionVidrio', label: 'Composición de referencia', help: 'Condiciona Ug, Uw y el comportamiento acústico.' },
  ] },
  { id: 'termico', label: 'Aislamiento térmico', rows: [
    { id: 'uf', label: 'Uf · marco', help: 'Transmitancia del marco. No es la de la ventana.', summary: true },
    { id: 'ug', label: 'Ug · vidrio', help: 'Transmitancia del vidrio. Depende de la composición.' },
    { id: 'uw', label: 'Uw · ventana', help: 'Transmitancia del conjunto para una medida de referencia.', summary: true },
  ] },
  { id: 'acustico', label: 'Aislamiento acústico', rows: [
    { id: 'rw', label: 'Índice acústico', help: 'Depende de vidrio, juntas y configuración ensayada.' },
  ] },
  { id: 'acabados', label: 'Acabados y documentación', rows: [
    { id: 'acabados', label: 'Acabados representados' },
    { id: 'doc', label: 'Documentación disponible', summary: true },
  ] },
]

const ND: Cell = {}
const serie = (id: string, name: string): CompareItem => ({
  id, name, kind: 'serie',
  cells: { tipo: { v: 'Serie de perfil PVC' }, tipologia: { v: 'Por confirmar con documentación' }, movimiento: ND, espacio: ND, uso: ND, profundidad: ND, composicionVidrio: ND, uf: ND, ug: ND, uw: ND, rw: ND, acabados: ND, doc: { v: 'Pendiente de aportar' } },
})

export const COMPARE_ITEMS: CompareItem[] = [
  {
    id: 'ej-a', name: 'Ejemplo A · practicable', kind: 'ejemplo', cells: {
      tipo: { v: 'Producto genérico (demo)' }, tipologia: { v: 'Practicable' }, movimiento: { v: 'Giro vertical', src: 'D' }, espacio: { v: 'Ocupa el barrido de la hoja', src: 'D' }, uso: { v: 'Ventana' },
      profundidad: { v: '70', unit: 'mm', src: 'F' }, composicionVidrio: { v: 'Doble (ejemplo)', src: 'F' },
      uf: { v: '1,2', unit: 'W/m²K', src: 'F', ctx: 'marco, valor ficticio' }, ug: { v: '1,0', unit: 'W/m²K', src: 'F', ctx: 'vidrio doble de ejemplo' }, uw: { v: '1,3', unit: 'W/m²K', src: 'F', ctx: 'medida de referencia ficticia' },
      rw: { v: '34', unit: 'dB', src: 'F', ctx: 'configuración ficticia' }, acabados: { v: 'Blanco · antracita · madera (muestras)' }, doc: { v: 'Ficha de muestra (demo)' },
    },
  },
  {
    id: 'ej-b', name: 'Ejemplo B · oscilobatiente', kind: 'ejemplo', cells: {
      tipo: { v: 'Producto genérico (demo)' }, tipologia: { v: 'Oscilobatiente' }, movimiento: { v: 'Giro vertical + oscilación', src: 'D' }, espacio: { v: 'En oscilación, mínimo', src: 'D' }, uso: { v: 'Ventana' },
      profundidad: { v: '70', unit: 'mm', src: 'F' }, composicionVidrio: { v: 'Doble (ejemplo)', src: 'F' },
      uf: { v: '1,2', unit: 'W/m²K', src: 'F', ctx: 'marco, valor ficticio' }, ug: { v: '1,0', unit: 'W/m²K', src: 'F', ctx: 'vidrio doble de ejemplo' }, uw: { v: '1,3', unit: 'W/m²K', src: 'F', ctx: 'medida de referencia ficticia' },
      rw: { v: '34', unit: 'dB', src: 'F', ctx: 'configuración ficticia' }, acabados: { v: 'Blanco · antracita · madera (muestras)' }, doc: { v: 'No disponible' },
    },
  },
  {
    id: 'ej-c', name: 'Ejemplo C · corredera', kind: 'ejemplo', cells: {
      tipo: { v: 'Producto genérico (demo)' }, tipologia: { v: 'Corredera' }, movimiento: { v: 'Desplazamiento en carril', src: 'D' }, espacio: { v: 'No invade el interior', src: 'D' }, uso: { v: 'Ventana · terraza' },
      profundidad: { v: '120', unit: 'mm', src: 'F' }, composicionVidrio: { v: 'Doble (ejemplo)', src: 'F' },
      uf: { v: '1,6', unit: 'W/m²K', src: 'F', ctx: 'marco, valor ficticio' }, ug: { v: '1,1', unit: 'W/m²K', src: 'F', ctx: 'vidrio doble de ejemplo' }, uw: { v: '1,5', unit: 'W/m²K', src: 'F', ctx: 'medida de referencia ficticia' },
      rw: { v: '31', unit: 'dB', src: 'F', ctx: 'configuración ficticia' }, acabados: { v: 'Blanco · antracita (muestras)' }, doc: { v: 'No disponible' },
    },
  },
  serie('s-ct70', 'Schüco CT 70'),
  serie('s-living', 'Schüco LivIng'),
  serie('s-softslide', 'Schüco SoftSlide'),
  serie('s-focusing', 'Schüco FocusIng'),
]

export const TYPOLOGY_TO_EXAMPLE: Record<string, string> = { practicable: 'ej-a', balconera: 'ej-a', puerta: 'ej-a', oscilobatiente: 'ej-b', corredera: 'ej-c', elevadora: 'ej-c' }
