import horizontal from './svg/horizontal.svg?raw'
import monograma from './svg/monograma.svg?raw'

/**
 * LOGOTIPOS OFICIALES (kit web de Grupo Deken, Google Drive · Recursos-Deken/grupo-deken-kit-web/logos).
 * Se usan los SVG vectoriales y se colorean con currentColor según el fondo, como indica el manual:
 *  · sobre blanco/gris claro → verde Deken;  · sobre antracita o negro → blanco;  · una tinta → antracita.
 * Se evita el PNG horizontal blanco del kit: el manual advierte que tiene rellenos los huecos de DEKEN.
 * Tamaños mínimos (manual): horizontal 140 px de ancho, monograma 24 px.
 */
const paint = (svg: string) => svg.replace(/fill="#76B82A"/gi, 'fill="currentColor"').replace('<svg ', '<svg aria-hidden="true" focusable="false" ')

const H = paint(horizontal)
const M = paint(monograma)

type Tone = 'verde' | 'blanco' | 'antracita'
const TONE: Record<Tone, string> = { verde: 'text-green', blanco: 'text-white', antracita: 'text-[#383E42]' }

export function Logo({ dark = false, compact = false, tone, className = '', width }: { dark?: boolean; compact?: boolean; tone?: Tone; className?: string; width?: number }) {
  const t = tone ?? (dark ? 'blanco' : 'verde')
  if (compact) {
    return <span role="img" aria-label="Grupo Deken" className={`inline-block ${TONE[t]} [&>svg]:h-full [&>svg]:w-auto ${className}`} style={{ height: width ? width * 0.767 : 24 }} dangerouslySetInnerHTML={{ __html: M }} />
  }
  return <span role="img" aria-label="Grupo Deken" className={`inline-block align-middle ${TONE[t]} [&>svg]:h-auto [&>svg]:w-full ${className}`} style={{ width: width ?? 150 }} dangerouslySetInnerHTML={{ __html: H }} />
}

/** Monograma GD para avatares y sellos (mínimo 24 px). */
export function Monogram({ tone = 'verde', size = 32, className = '' }: { tone?: Tone; size?: number; className?: string }) {
  return <Logo compact tone={tone} width={size} className={className} />
}
