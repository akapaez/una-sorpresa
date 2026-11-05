import type { Typology, WindowConfig, FinishId } from '@/three/windowSpec'
import { DEFAULT_CONFIG } from '@/three/windowSpec'

/**
 * Catálogo de la previsualización.
 * - TIPOLOGÍA = cómo abre (atributo de apertura).
 * - SERIE = familia de perfil (atributo de sistema). Datos en series.ts, con documento y página.
 * - VIDRIO = composición (atributo de acristalamiento). No se mezclan.
 */

export interface Solution {
  slug: string
  name: string
  short: string
  description: string
  use: ('ventana' | 'terraza' | 'acceso')[]
  movement: string
  space: string
  applications: string[]
  questions: string[]
  demo: { config: WindowConfig; mode: 'turn' | 'tilt' | 'slide' } | null
  poster: string
  status: 'demo-3d' | 'ficha-visual'
}

const c = (o: Partial<WindowConfig>): WindowConfig => ({ ...DEFAULT_CONFIG, ...o })

export const SOLUTIONS: Solution[] = [
  {
    slug: 'practicable', name: 'Practicable', short: 'Hoja que gira sobre bisagras laterales.',
    description: 'La solución más directa: la hoja abre hacia el interior girando sobre su eje vertical. Ventilación total y limpieza cómoda de ambas caras.',
    use: ['ventana'], movement: 'Giro sobre eje vertical (bisagras)', space: 'Necesita espacio interior libre equivalente al ancho de la hoja.',
    applications: ['Dormitorios y estancias con el frente despejado', 'Rehabilitación con huecos tradicionales', 'Ventanas de una o dos hojas'],
    questions: ['¿Hay mobiliario o radiadores delante del hueco?', '¿Una hoja o dos? Afecta al paso de luz y al peso de cada hoja.', '¿Hacia qué lado debe abrir cada hoja?'],
    demo: { config: c({ typology: 'practicable', leaves: 2 }), mode: 'turn' }, poster: '/renders/practicable.jpg', status: 'demo-3d',
  },
  {
    slug: 'oscilobatiente', name: 'Oscilobatiente', short: 'Gira o bascula con la misma manilla.',
    description: 'Dos movimientos en una sola hoja: giro lateral para abrir del todo y oscilación sobre el eje inferior para ventilar sin invadir el interior.',
    use: ['ventana'], movement: 'Giro vertical + oscilación sobre eje inferior', space: 'En oscilación apenas ocupa espacio; en giro, como una practicable.',
    applications: ['Viviendas donde se ventila a menudo', 'Baños y cocinas', 'Ventanas a calle con ruido o lluvia frecuente'],
    questions: ['¿Se va a ventilar con la ventana entreabierta?', '¿Qué hoja debe ser la oscilobatiente en una ventana de dos hojas?', '¿Altura del hueco respecto al suelo?'],
    demo: { config: c({ typology: 'oscilobatiente', leaves: 1, widthMm: 900, heightMm: 1300 }), mode: 'tilt' }, poster: '/renders/oscilobatiente.jpg', status: 'demo-3d',
  },
  {
    slug: 'corredera', name: 'Corredera', short: 'Hojas que se desplazan en su propio plano.',
    description: 'Las hojas deslizan sobre carriles sin ocupar espacio delante del hueco. Habitual en salidas a terraza y en estancias con mobiliario cercano.',
    use: ['ventana', 'terraza'], movement: 'Desplazamiento horizontal en carril', space: 'No invade el espacio interior; el paso libre es aproximadamente la mitad del hueco en 2 hojas.',
    applications: ['Salidas a terraza y patio', 'Huecos anchos', 'Espacios con mobiliario junto a la ventana'],
    questions: ['¿Ancho total del hueco y paso libre necesario?', '¿Qué hoja debe deslizar?', '¿Es un paso de uso diario?'],
    demo: { config: c({ typology: 'corredera', leaves: 2, widthMm: 1800, heightMm: 1350 }), mode: 'slide' }, poster: '/renders/corredera.jpg', status: 'demo-3d',
  },
  {
    slug: 'elevadora', name: 'Elevadora', short: 'Corredera elevable para grandes dimensiones.',
    description: 'La hoja se eleva antes de deslizar y desciende al cerrar. Se plantea para grandes paños acristalados. La previsualización no incluye todavía un modelo 3D fiel de este mecanismo.',
    use: ['terraza'], movement: 'Elevación + desplazamiento horizontal', space: 'No invade el espacio interior.',
    applications: ['Grandes salidas a terraza o jardín', 'Viviendas unifamiliares', 'Paños de gran formato'],
    questions: ['¿Dimensiones aproximadas de cada hoja?', '¿Umbral y encuentro con el pavimento?', '¿Qué documentación técnica necesitas para el proyecto?'],
    demo: null, poster: '/renders/elevadora.jpg', status: 'ficha-visual',
  },
  {
    slug: 'balconera', name: 'Balconera', short: 'Hojas altas acristaladas para salida a balcón.',
    description: 'Ventana de suelo a techo que funciona como paso a balcón o terraza, con zócalo inferior reforzado en la hoja.',
    use: ['terraza', 'acceso'], movement: 'Giro sobre eje vertical (bisagras)', space: 'Necesita espacio interior libre para el barrido de las hojas.',
    applications: ['Salidas a balcón', 'Rehabilitación de fachadas con huecos altos', 'Dormitorios con terraza'],
    questions: ['¿Altura del hueco y encuentro con el suelo?', '¿Una o dos hojas?', '¿Uso como paso frecuente?'],
    demo: { config: c({ typology: 'balconera', leaves: 2, widthMm: 1400, heightMm: 2200 }), mode: 'turn' }, poster: '/renders/balconera.jpg', status: 'demo-3d',
  },
  {
    slug: 'puerta', name: 'Puerta', short: 'Hoja de paso con panel inferior.',
    description: 'Puerta de PVC de una hoja con parte acristalada y panel opaco inferior, para accesos secundarios y cerramientos auxiliares.',
    use: ['acceso'], movement: 'Giro sobre eje vertical (bisagras)', space: 'Barrido de hoja completo.',
    applications: ['Accesos a patio o jardín', 'Cerramientos auxiliares', 'Divisiones interior-exterior'],
    questions: ['¿Sentido de apertura?', '¿Proporción entre vidrio y panel?', '¿Requisitos de cerradura? (pendiente de documentación de herrajes)'],
    demo: { config: c({ typology: 'puerta', leaves: 1, widthMm: 950, heightMm: 2150 }), mode: 'turn' }, poster: '/renders/puerta.jpg', status: 'demo-3d',
  },
]

/** Series de perfil: ver `src/content/series.ts` (datos con fuente y página). */
export { SERIES_INFO as SERIES } from './series'

export const FINISHES: { id: FinishId; name: string; swatch: string; note: string }[] = [
  { id: 'blanco', name: 'Blanco', swatch: '#efeeea', note: 'Muestra visual' },
  { id: 'antracita', name: 'Antracita', swatch: '#3b4146', note: 'Muestra visual · código por confirmar' },
  { id: 'madera', name: 'Madera', swatch: 'linear-gradient(100deg,#8e6238,#a87a4b 40%,#7a5230 70%,#9b6d40)', note: 'Textura de demostración' },
]

export const typologyBySlug = (s: string) => SOLUTIONS.find((x) => x.slug === s)
export const TYPOLOGY_NAME: Record<Typology, string> = { practicable: 'Practicable', oscilobatiente: 'Oscilobatiente', corredera: 'Corredera', balconera: 'Balconera', puerta: 'Puerta' }
