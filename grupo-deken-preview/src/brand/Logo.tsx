/**
 * LOGOTIPO PROVISIONAL — composición tipográfica.
 * No se han aportado los archivos de logotipo. Para sustituirlo, reemplaza el contenido de
 * este componente por el SVG/PNG oficial (p. ej. GRUPO-DEKEN-HORIZONTAL en blanco sobre oscuro).
 * Nota de la skill de marca: en la familia horizontal, los PNG «BLANCO» y «GRIS» están intercambiados.
 */
export function Logo({ dark = false, compact = false, className = '' }: { dark?: boolean; compact?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Grupo Deken">
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden className="shrink-0">
        <rect x="3" y="3" width="26" height="26" rx="2" fill="none" stroke="#76B82A" strokeWidth="3" />
        <line x1="16" y1="3" x2="16" y2="29" stroke="#76B82A" strokeWidth="2.4" />
        <rect x="19.5" y="13" width="2.6" height="6" rx="1" fill={dark ? '#ffffff' : '#383E42'} />
      </svg>
      {!compact && (
        <span className={`flex flex-col leading-none ${dark ? 'text-white' : 'text-ink'}`} aria-hidden>
          <span className="text-[0.6rem] font-semibold tracking-[0.42em]">GRUPO</span>
          <span className="text-[1.12rem] font-extrabold tracking-[0.08em]">DEKEN</span>
        </span>
      )}
    </span>
  )
}
