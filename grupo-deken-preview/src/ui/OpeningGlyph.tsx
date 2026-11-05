/** Esquema de alzado con la hoja móvil, para ilustrar el movimiento de cada tipología. */
export function OpeningGlyph({ slug, className = '', stroke = 'currentColor' }: { slug: string; className?: string; stroke?: string }) {
  const tall = slug === 'balconera' || slug === 'puerta'
  const wide = slug === 'corredera' || slug === 'elevadora'
  const W = wide ? 120 : tall ? 70 : 84
  const H = tall ? 120 : 84
  const f = 5
  const vb = `0 0 ${W} ${H}`
  const sash = (x: number, w: number, cls: string, handle: 'l' | 'r' | null) => (
    <g className={`glyph-sash ${cls}`}>
      <rect x={x} y={f + 2} width={w} height={H - 2 * f - 4} rx="1.5" fill="currentColor" fillOpacity="0.06" stroke={stroke} strokeWidth="2" />
      <rect x={x + 5} y={f + 7} width={w - 10} height={H - 2 * f - 14} rx="1" fill="none" stroke={stroke} strokeOpacity="0.45" strokeWidth="1.2" />
      {handle && <rect x={handle === 'r' ? x + w - 4.5 : x + 2} y={H / 2 - 5} width="2.5" height="10" rx="1" fill="#76B82A" />}
    </g>
  )
  const inner = W - 2 * f
  return (
    <svg viewBox={vb} className={className} aria-hidden>
      <rect x="1.5" y="1.5" width={W - 3} height={H - 3} rx="2" fill="none" stroke={stroke} strokeWidth="2.5" />
      {slug === 'practicable' && <>{sash(f + 1, inner / 2 - 1, 'turn-l', null)}{sash(W / 2, inner / 2 - 1, 'turn-r', 'l')}</>}
      {slug === 'oscilobatiente' && sash(f + 2, inner - 4, 'tilt', 'r')}
      {slug === 'balconera' && <>{sash(f + 1, inner / 2 - 1, 'turn-l', null)}{sash(W / 2, inner / 2 - 1, 'turn-r', 'l')}</>}
      {slug === 'puerta' && (
        <g className="glyph-sash turn-l">
          <rect x={f + 2} y={f + 2} width={inner - 4} height={H - 2 * f - 4} rx="1.5" fill="currentColor" fillOpacity="0.06" stroke={stroke} strokeWidth="2" />
          <rect x={f + 7} y={f + 7} width={inner - 14} height={(H - 2 * f) * 0.52} rx="1" fill="none" stroke={stroke} strokeOpacity="0.45" strokeWidth="1.2" />
          <rect x={f + 7} y={H * 0.66} width={inner - 14} height={H * 0.24} rx="1" fill="currentColor" fillOpacity="0.14" />
          <rect x={W - f - 8} y={H * 0.55} width="2.5" height="10" rx="1" fill="#76B82A" />
        </g>
      )}
      {(slug === 'corredera' || slug === 'elevadora') && (
        <>
          {sash(f + 1, inner / 2 + 4, '', null)}
          {sash(W / 2 - 4, inner / 2 + 3, slug === 'elevadora' ? 'lift' : 'slide', 'r')}
          <line x1={f} y1={H - f - 0.5} x2={W - f} y2={H - f - 0.5} stroke={stroke} strokeOpacity="0.5" strokeWidth="1.5" />
        </>
      )}
    </svg>
  )
}
