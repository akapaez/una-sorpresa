/**
 * SERIES DE PERFIL SCHÜCO — datos con fuente.
 *
 * Todo valor numérico procede de un documento concreto (ver DOCS) e indica página o sección.
 * Los textos están redactados en español a partir de esos documentos; no son copia literal.
 * Los PDF originales están en la carpeta de Google Drive del proyecto y NO se publican con la web:
 * aquí solo se citan título, edición y página.
 *
 * Reglas:
 * - Un valor de catálogo corresponde a una configuración ensayada, no a cualquier ventana de la serie.
 * - Uf (marco), Ug (vidrio) y Uw (ventana) son magnitudes distintas y se muestran por separado.
 * - Si dos documentos dan valores distintos, se muestran los dos con su fuente.
 * - Qué series ofrece Deken y en qué tipologías: según la web actual (grupodeken.es/catalogo.php),
 *   pendiente de confirmar por Deken en la versión definitiva.
 */

export interface SourceDoc {
  id: string
  title: string
  kind: 'folleto' | 'catálogo técnico' | 'web Deken'
  edition?: string
  language: 'es' | 'en' | 'de' | 'multi'
  /** Nombre del archivo en la carpeta de Drive del proyecto (no se publica). */
  file?: string
  note?: string
}

export const DOCS: Record<string, SourceDoc> = {
  'ct70-cat': { id: 'ct70-cat', title: 'Schüco CT 70 / CT 70 Accent · Order and fabrication manual', kind: 'catálogo técnico', edition: '75455 · 2026-09', language: 'en', file: 'Catalogos/Schüco CT 70 Schüco CT 70 Accent -Catalogo.pdf' },
  'ct70c-fol': { id: 'ct70c-fol', title: 'Schüco CT 70 Classic · folleto', kind: 'folleto', language: 'de', file: 'Folletos/CT70-Classic-FOLLETO.pdf' },
  'ct70r-fol': { id: 'ct70r-fol', title: 'Schüco Corona CT 70 Rondo · folleto', kind: 'folleto', language: 'de', file: 'Folletos/CT70-Rondo-Folleto.pdf', note: 'Edición antigua (cita datos de empresa de 2014).' },
  'living-fol': { id: 'living-fol', title: 'Schüco LivIng Classic · brochure', kind: 'folleto', language: 'en', file: 'Folletos/Living-Folleto.pdf' },
  'alu-fol': { id: 'alu-fol', title: 'Schüco LivIng Alu Inside · folleto', kind: 'folleto', language: 'de', file: 'Folletos/Living-Aluside-Folleto.pdf' },
  'focusing-fol': { id: 'focusing-fol', title: 'Schüco FocusIng · brochure', kind: 'folleto', language: 'en', file: 'Folletos/Focussing-Folleto.pdf' },
  'softslide-cat': { id: 'softslide-cat', title: 'Schüco SoftSlide · Catálogo de pedidos y fabricación', kind: 'catálogo técnico', edition: 'En línea · 09.2023', language: 'es', file: 'Catalogos/Softslide-Catalogo.pdf' },
  's150-cat': { id: 's150-cat', title: 'Schüco Corona S 150 · Catálogo de pedidos y fabricación', kind: 'catálogo técnico', edition: '12.2011', language: 'multi', file: 'Catalogos/150-Catalogo.pdf', note: 'Edición de 2011.' },
  'topalu-cat': { id: 'topalu-cat', title: 'Schüco TopAlu · Bestell- und Fertigungskatalog', kind: 'catálogo técnico', edition: '11.2016 · 75443', language: 'multi', file: 'Catalogos/Acabados-Catalogo.pdf' },
  'deken-web': { id: 'deken-web', title: 'grupodeken.es · Catálogo PVC Schüco', kind: 'web Deken', edition: 'consultada el 05/11/2026', language: 'es', note: 'Web actual de Deken. Dato no contrastado con documentación Schüco.' },
}

/** Documentos de la carpeta que el conector no pudo leer como texto (PDF de imagen o demasiado grandes). */
export const DOCS_NOT_READ = ['Catalogos/FocusIng-Catalogo.pdf', 'Catalogos/LivingSlide-Catalogo.pdf', 'Catalogos/living-catalogo.pdf']

export interface Spec {
  /** Valor principal para mostrar en grande. */
  value: string
  unit?: string
  label: string
  /** Contexto imprescindible para leer bien el dato. */
  ctx?: string
  src: string
  ref?: string
}

export interface SeriesInfo {
  slug: string
  name: string
  /** Variantes de la familia que aparecen en la documentación. */
  variants?: string[]
  family: 'ventana' | 'corredera' | 'elevadora'
  /** En la web actual de Deken. Las que no, se muestran como «documentación aportada, por confirmar». */
  inDekenWeb: boolean
  tagline: string
  intro: string
  /** Cifras destacadas (3–4) para la cabecera. */
  hero: Spec[]
  specs: Spec[]
  features: { title: string; text: string; src: string; ref?: string }[]
  /** Tipologías (slugs de SOLUTIONS) en las que Deken presenta la serie. */
  typologies: string[]
  typologiesSrc: string
  pending: string[]
}

export const SERIES_INFO: SeriesInfo[] = [
  {
    slug: 'schueco-ct-70', name: 'Schüco CT 70', variants: ['Classic', 'Rondo', 'Accent'], family: 'ventana', inDekenWeb: true,
    tagline: 'La base robusta para renovar.',
    intro: 'Sistema de PVC de 70 mm con cinco cámaras y dos planos de junta. Pensado para modernización y para proyectos que piden una solución versátil, con refuerzo de acero en marco y hoja y tres geometrías de hoja: Classic (recta), Rondo (redondeada) y Accent.',
    hero: [
      { value: '70', unit: 'mm', label: 'Profundidad de marco', ctx: 'Classic y Rondo', src: 'ct70-cat', ref: 'p. 13' },
      { value: '5', label: 'Cámaras', src: 'ct70c-fol', ref: 'p. 4' },
      { value: 'RC 2', label: 'Seguridad', ctx: 'con vidrio de seguridad adicional', src: 'ct70c-fol', ref: 'p. 6' },
      { value: '49', unit: 'dB', label: 'Aislamiento acústico', ctx: 'hasta, con vidrio acústico', src: 'ct70c-fol', ref: 'p. 7' },
    ],
    specs: [
      { value: '70 / 70 / 112', unit: 'mm', label: 'Profundidad de marco', ctx: 'Classic / Rondo / Accent', src: 'ct70-cat', ref: 'p. 13' },
      { value: '70 / 78 / 70', unit: 'mm', label: 'Profundidad de hoja', ctx: 'Classic / Rondo / Accent', src: 'ct70-cat', ref: 'p. 13' },
      { value: '4 – 42', unit: 'mm', label: 'Espesor de vidrio posible', src: 'ct70-cat', ref: 'p. 13' },
      { value: '1,3', unit: 'W/(m²K)', label: 'Uf · marco', ctx: 'según DIN EN 12412-2', src: 'ct70-cat', ref: 'p. 13' },
      { value: '1,2', unit: 'W/(m²K)', label: 'Uf · marco (folleto)', ctx: '«hasta»; el catálogo técnico de 2026 indica 1,3', src: 'ct70c-fol', ref: 'p. 15' },
      { value: '47', unit: 'dB', label: 'Rw,P máximo', ctx: 'DIN EN ISO 140-3; depende de perfil y vidrio', src: 'ct70-cat', ref: 'p. 13' },
      { value: '49', unit: 'dB', label: 'Aislamiento acústico (folleto)', ctx: '«hasta», con vidrio acústico', src: 'ct70c-fol', ref: 'p. 7' },
      { value: 'RC 2', label: 'Resistencia a la efracción', ctx: 'DIN EN 1627', src: 'ct70-cat', ref: 'p. 13' },
      { value: 'Clase 4', label: 'Permeabilidad al aire', ctx: 'DIN EN 12207', src: 'ct70-cat', ref: 'p. 13' },
      { value: 'Clase 9A', label: 'Estanqueidad al agua', ctx: 'DIN EN 12208', src: 'ct70-cat', ref: 'p. 13' },
      { value: 'Clase B5', label: 'Resistencia al viento', ctx: 'DIN EN 12210; depende de perfil y vidrio', src: 'ct70-cat', ref: 'p. 13' },
    ],
    features: [
      { title: 'Dos planos de junta', text: 'Juntas perimetrales en dos niveles y vidrio profundamente asentado frente a viento, lluvia y ruido.', src: 'ct70c-fol', ref: 'p. 4' },
      { title: 'Acero en marco y hoja', text: 'Perfiles de refuerzo de acero con protección anticorrosión para estabilidad y durabilidad.', src: 'ct70c-fol', ref: 'p. 4' },
      { title: 'Herraje con setas', text: 'Cierres tipo seta y herrajes de acero dificultan el apalancamiento; RC 2 con vidrio de seguridad.', src: 'ct70c-fol', ref: 'p. 6' },
      { title: 'Ventanas, balconeras y puertas', text: 'Ventanas de una o varias hojas, balconeras con umbral y puertas de entrada o de servicio.', src: 'ct70-cat', ref: 'p. 14' },
      { title: 'Aluminio exterior opcional', text: 'Tapas de aluminio Schüco TopAlu disponibles para la variante Corona CT 70 AS.', src: 'topalu-cat', ref: 'p. 8' },
    ],
    typologies: ['practicable', 'oscilobatiente', 'balconera', 'puerta'],
    typologiesSrc: 'ct70-cat',
    pending: ['Variantes (Classic, Rondo, Accent) que fabrica Deken.', 'Composiciones de vidrio habituales y su Ug.', 'Uw para medidas de referencia del proyecto.'],
  },
  {
    slug: 'schueco-living', name: 'Schüco LivIng', variants: ['Classic 82 AS', 'Classic 82 MD'], family: 'ventana', inDekenWeb: true,
    tagline: '82 mm. Siete cámaras. Silencio.',
    intro: 'Sistema premium de 82 mm y siete cámaras. La versión AS trabaja con dos planos de junta; la MD, con tres. Admite vidrios de hasta 54 mm, lo que abre la puerta a triples acristalamientos y vidrios especiales.',
    hero: [
      { value: '82', unit: 'mm', label: 'Profundidad', src: 'living-fol', ref: 'p. 8' },
      { value: '7', label: 'Cámaras', src: 'living-fol', ref: 'p. 8' },
      { value: '0,96', unit: 'W/(m²K)', label: 'Uf · marco', ctx: 'desde, versión 82 MD', src: 'living-fol', ref: 'p. 9' },
      { value: '47', unit: 'dB', label: 'Aislamiento acústico', ctx: 'hasta, con vidrio acústico', src: 'living-fol', ref: 'p. 5' },
    ],
    specs: [
      { value: '82', unit: 'mm', label: 'Profundidad', src: 'living-fol', ref: 'p. 8' },
      { value: '7', label: 'Cámaras', src: 'living-fol', ref: 'p. 8' },
      { value: '16 – 54', unit: 'mm', label: 'Espesor de vidrio', src: 'living-fol', ref: 'p. 8' },
      { value: '1,0', unit: 'W/(m²K)', label: 'Uf · 82 AS', ctx: '«desde»; dos planos de junta', src: 'living-fol', ref: 'p. 8' },
      { value: '0,96', unit: 'W/(m²K)', label: 'Uf · 82 MD', ctx: '«desde»; tres planos de junta', src: 'living-fol', ref: 'p. 9' },
      { value: '47', unit: 'dB', label: 'Aislamiento acústico', ctx: '«hasta», con vidrio acústico', src: 'living-fol', ref: 'p. 5' },
      { value: 'RC 2', label: 'Resistencia a la efracción', ctx: 'con vidrio de seguridad adicional', src: 'living-fol', ref: 'p. 7' },
      { value: '> 300', label: 'Acabados foliados', ctx: 'gama Schüco UnlimitedFinish', src: 'living-fol', ref: 'p. 10' },
    ],
    features: [
      { title: 'AS o MD', text: 'Dos planos de junta (AS) o tres (MD) según la exigencia de estanqueidad y aislamiento.', src: 'living-fol', ref: 'pp. 8–9' },
      { title: 'Juntas que recuperan su forma', text: 'Juntas de alta recuperación pensadas para mantener el cierre durante la vida útil de la ventana.', src: 'living-fol', ref: 'p. 4' },
      { title: 'PVC gris en masa', text: 'También disponible en PVC gris, coherente con acabados oscuros cuando la ventana está abierta.', src: 'living-fol', ref: 'p. 12' },
      { title: 'Aluminio exterior', text: 'Compatible con tapas de aluminio Schüco TopAlu (82 AS y 82 MD).', src: 'topalu-cat', ref: 'p. 8' },
    ],
    typologies: ['practicable', 'oscilobatiente', 'balconera'],
    typologiesSrc: 'living-fol',
    pending: ['Si Deken fabrica AS, MD o ambas.', 'Si se ofrece la variante Alu Inside (folleto aportado, no aparece en la web actual).', 'Uw con las composiciones de vidrio de Deken.'],
  },
  {
    slug: 'schueco-focusing', name: 'Schüco FocusIng', variants: ['70 mm', '76 mm'], family: 'ventana', inDekenWeb: true,
    tagline: 'Línea recta. Núcleo reciclado.',
    intro: 'Sistema de diseño lineal y solapes mínimos para modernización y obra nueva. Profundidad de 70 o 76 mm, construcción de 5/6 cámaras y núcleo interior con hasta un 50 % de material reciclado.',
    hero: [
      { value: '70 / 76', unit: 'mm', label: 'Profundidad', src: 'focusing-fol', ref: 'p. 3' },
      { value: '50', unit: '%', label: 'Reciclado en el núcleo', ctx: 'hasta', src: 'focusing-fol', ref: 'p. 3' },
      { value: '1,1', unit: 'W/(m²K)', label: 'Uf · marco', ctx: 'desde', src: 'focusing-fol', ref: 'p. 14' },
      { value: '48', unit: 'dB', label: 'Aislamiento acústico', ctx: 'hasta, con vidrio acústico', src: 'focusing-fol', ref: 'p. 15' },
    ],
    specs: [
      { value: '70 / 76', unit: 'mm', label: 'Profundidad', src: 'focusing-fol', ref: 'p. 3' },
      { value: '5 / 6', label: 'Cámaras', src: 'focusing-fol', ref: 'p. 14' },
      { value: '10 – 54', unit: 'mm', label: 'Espesor de vidrio', src: 'focusing-fol', ref: 'p. 14' },
      { value: '1,1', unit: 'W/(m²K)', label: 'Uf · marco', ctx: '«desde»', src: 'focusing-fol', ref: 'p. 14' },
      { value: '< 0,80', unit: 'W/(m²K)', label: 'Uw · ventana', ctx: 'valor de folleto; configuración de ensayo no indicada', src: 'focusing-fol', ref: 'p. 19' },
      { value: '48', unit: 'dB', label: 'Aislamiento acústico', ctx: '«hasta», con vidrio acústico', src: 'focusing-fol', ref: 'p. 15' },
      { value: 'RC 2', label: 'Resistencia a la efracción', ctx: 'con vidrio de seguridad adicional', src: 'focusing-fol', ref: 'p. 13' },
      { value: '≤ 50', unit: '%', label: 'Material reciclado', ctx: 'en el núcleo; capa exterior de PVC primario', src: 'focusing-fol', ref: 'p. 9' },
    ],
    features: [
      { title: 'Diseño lineal', text: 'Líneas rectas y solapes mínimos para integrarse en fachadas existentes y nuevas.', src: 'focusing-fol', ref: 'p. 14' },
      { title: 'Acero integrado', text: 'Perfiles de acero integrados para la máxima estabilidad.', src: 'focusing-fol', ref: 'p. 14' },
      { title: 'Sello Vinyl verified', text: 'Etiqueta de sostenibilidad VinylPlus® para productos de construcción de PVC.', src: 'focusing-fol', ref: 'p. 3' },
      { title: 'Ventilación integrada', text: 'Compatible con aireadores Schüco VentoAir, VentoAir+ y VentoTherm Twist.', src: 'focusing-fol', ref: 'p. 15' },
    ],
    typologies: ['practicable', 'oscilobatiente', 'balconera'],
    typologiesSrc: 'focusing-fol',
    pending: ['Catálogo técnico (FocusIng-Catalogo.pdf) sin texto extraíble: falta contrastar clases de permeabilidad, agua y viento.', 'Versión de 2 o 3 juntas que fabrica Deken.'],
  },
  {
    slug: 'schueco-softslide', name: 'Schüco SoftSlide', family: 'corredera', inDekenWeb: true,
    tagline: 'Desliza. No invade.',
    intro: 'Corredera de PVC para salidas a terraza y huecos donde no se quiere ocupar el espacio interior. Marco de 74 mm, hoja de 50 mm y rodillos para hojas de hasta 120 kg.',
    hero: [
      { value: '74', unit: 'mm', label: 'Profundidad de marco', src: 'softslide-cat', ref: 'B1, p. 11' },
      { value: '4 – 28', unit: 'mm', label: 'Espesor de vidrio', src: 'softslide-cat', ref: 'B1, p. 11' },
      { value: '120', unit: 'kg', label: 'Peso de hoja', ctx: 'máximo, con rodillos de 120 kg', src: 'softslide-cat', ref: 'B2 Rodillos' },
      { value: '6A', label: 'Estanqueidad al agua', ctx: 'clase, DIN EN 12208', src: 'softslide-cat', ref: 'B1, p. 11' },
    ],
    specs: [
      { value: '74', unit: 'mm', label: 'Profundidad de marco', src: 'softslide-cat', ref: 'B1, p. 11' },
      { value: '50', unit: 'mm', label: 'Profundidad de hoja', src: 'softslide-cat', ref: 'B1, p. 11' },
      { value: '4 – 28', unit: 'mm', label: 'Espesor de vidrio', src: 'softslide-cat', ref: 'B1, p. 11' },
      { value: '1,4 – 2,3', unit: 'W/(m²K)', label: 'Uf · marco', ctx: 'DIN EN 12412-2; según perfil', src: 'softslide-cat', ref: 'B1, p. 11' },
      { value: 'Clase 4', label: 'Permeabilidad al aire', ctx: 'DIN EN 12207', src: 'softslide-cat', ref: 'B1, p. 11' },
      { value: 'Clase 6A', label: 'Estanqueidad al agua', ctx: 'DIN EN 12208', src: 'softslide-cat', ref: 'B1, p. 11' },
      { value: 'Clase B3', label: 'Resistencia al viento', ctx: 'DIN EN 12210', src: 'softslide-cat', ref: 'B1, p. 11' },
      { value: '50 / 120', unit: 'kg', label: 'Peso máximo de hoja', ctx: 'según juego de rodillos', src: 'softslide-cat', ref: 'B2 Rodillos' },
    ],
    features: [
      { title: 'No ocupa el interior', text: 'Las hojas deslizan en su plano: útil con mobiliario cerca o en pasos a terraza.', src: 'deken-web' },
      { title: 'Rodillos a medida del peso', text: 'Rodillos de 50 kg o de 120 kg, estos regulables en altura (−1,5 / +5,5 mm).', src: 'softslide-cat', ref: 'B2 Rodillos' },
      { title: 'Dos juntas', text: 'Estanqueidad con dos juntas, según la web actual de Deken.', src: 'deken-web' },
    ],
    typologies: ['corredera'],
    typologiesSrc: 'deken-web',
    pending: ['Tamaños máximos de hoja (capítulo G del catálogo) para las medidas del proyecto.', 'Valor acústico: no figura en el catálogo leído.'],
  },
  {
    slug: 'soluciones-elevadoras', name: 'Elevadoras', variants: ['LivIngSlide', 'FocusIngSlide'], family: 'elevadora', inDekenWeb: true,
    tagline: 'Gran formato. Paso continuo.',
    intro: 'Correderas elevables de PVC para grandes paños acristalados y salidas a terraza: la hoja se eleva, desliza y desciende al cerrar. Deken presenta dos sistemas en su web actual.',
    hero: [
      { value: '194 / 82', unit: 'mm', label: 'LivIngSlide', ctx: 'marco / hoja', src: 'deken-web' },
      { value: '167 / 70', unit: 'mm', label: 'FocusIngSlide', ctx: 'marco / hoja', src: 'deken-web' },
      { value: '45', unit: 'dB', label: 'Aislamiento acústico', ctx: 'hasta, según web Deken', src: 'deken-web' },
    ],
    specs: [
      { value: '194 / 82', unit: 'mm', label: 'LivIngSlide · profundidad', ctx: 'marco / hoja', src: 'deken-web' },
      { value: '167 / 70', unit: 'mm', label: 'FocusIngSlide · profundidad', ctx: 'marco / hoja', src: 'deken-web' },
      { value: 'Hasta 3', label: 'Juntas', ctx: 'según sistema', src: 'deken-web' },
      { value: 'RC 2', label: 'Seguridad', ctx: 'hasta, según web Deken', src: 'deken-web' },
      { value: '45', unit: 'dB', label: 'Aislamiento acústico', ctx: 'hasta, según web Deken', src: 'deken-web' },
    ],
    features: [
      { title: 'Elevar, deslizar, bajar', text: 'La hoja se eleva antes de deslizar y desciende al cerrar, apoyando sobre las juntas.', src: 'deken-web' },
      { title: 'Grandes huecos', text: 'Indicada para grandes huecos, pasos exteriores y salidas a terrazas.', src: 'deken-web' },
    ],
    typologies: ['elevadora'],
    typologiesSrc: 'deken-web',
    pending: ['El catálogo LivingSlide-Catalogo.pdf no tiene texto extraíble: las cifras proceden solo de la web de Deken y deben contrastarse.', 'Pesos y medidas máximas de hoja.'],
  },
]

/** Documentación aportada de sistemas que no aparecen en la web actual de Deken. */
export const OTHER_SYSTEMS: { name: string; text: string; src: string; ref?: string }[] = [
  { name: 'Schüco LivIng Alu Inside', text: '82 mm y 7 cámaras sin refuerzo de acero: el marco se rigidiza con aluminio, lo que elimina puentes térmicos. Uf desde 0,79 W/(m²K), tres planos de junta, vidrios de 16 a 54 mm y hasta 46 dB con vidrio acústico. Variante con aptitud para casa pasiva.', src: 'alu-fol', ref: 'pp. 4–7' },
  { name: 'Schüco Corona S 150', text: 'Corredera basada en Corona CT 70 AS para balcón, terraza o jardín de invierno. Hoja de 70 mm, vidrios de hasta 40 mm, hojas de hasta 250 kg y ancho visto total de 164 mm.', src: 's150-cat', ref: 'K1, pp. 3–5' },
  { name: 'Schüco TopAlu', text: 'Tapas exteriores de aluminio para LivIng, Corona CT 70 AS y otros sistemas: PVC por dentro, aluminio lacado o anodizado por fuera, en cualquier color RAL.', src: 'topalu-cat', ref: 'pp. 8–9' },
]

/**
 * Gama de acabados que presenta Deken en su web. Colores de pantalla ORIENTATIVOS.
 * Referencias RAL solo cuando figuran en la web de Deken o en un catálogo Schüco.
 */
export const FINISH_RANGE: { name: string; swatch: string; ref?: string; src: string }[] = [
  { name: 'Blanco', swatch: '#F1F1EC', ref: 'similar a RAL 9016', src: 'softslide-cat' },
  { name: 'Gris antracita', swatch: '#383E42', ref: 'RAL 7016 según web Deken', src: 'deken-web' },
  { name: 'Negro texturizado', swatch: '#1E1F21', src: 'deken-web' },
  { name: 'Roble dorado', swatch: 'linear-gradient(100deg,#9a6a32,#b7843f 40%,#8d5f2b 70%,#a9773a)', src: 'deken-web' },
  { name: 'Nogal', swatch: 'linear-gradient(100deg,#5a3b24,#6f4a2e 40%,#4e321e 70%,#644229)', src: 'deken-web' },
  { name: 'Roble oscuro', swatch: 'linear-gradient(100deg,#4a3324,#5d4130 40%,#3f2b1f 70%,#523a2a)', src: 'deken-web' },
  { name: 'Antracita madera', swatch: 'linear-gradient(100deg,#34393c,#454b4f 40%,#2d3134 70%,#3d4246)', src: 'deken-web' },
  { name: 'Bicolor', swatch: 'linear-gradient(90deg,#F1F1EC 50%,#383E42 50%)', ref: 'interior / exterior', src: 'deken-web' },
]

/** Colores Schüco de la Selected Edition citados en los folletos (sin muestra física: solo nombres). */
export const SELECTED_EDITION = ['Mattex Shine White Aluminium', 'Mattex Jet Black', 'Sheffield Oak Concrete', 'Mattex Shine Grey Aluminium', 'Mattex Shine Beige', 'Turner Oak Malt', 'Mattex DB 703', 'Mattex Shine Deep Bronze', 'Turner Oak Toffee', 'Mattex Shine Dark Graphite', 'Mattex Umbragrau']

export const seriesBySlug = (s: string) => SERIES_INFO.find((x) => x.slug === s)
export const srcLabel = (id: string, ref?: string) => `${DOCS[id]?.title ?? id}${ref ? ` · ${ref}` : ''}`
