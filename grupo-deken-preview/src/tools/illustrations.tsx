/**
 * Ilustraciones CONCEPTUALES. No representan ensayos, mediciones ni cifras de aislamiento.
 * Paleta de marca: grafito, neutros y verde Deken como único acento.
 */

export function AcousticIllustration({ closed, animated = true }: { closed: boolean; animated?: boolean }) {
  const outer = [0, 1, 2, 3, 4]
  return (
    <svg viewBox="0 0 640 320" className="h-auto w-full" role="img" aria-label={closed ? 'Ilustración: con la hoja cerrada, las ondas que llegan al interior se representan atenuadas' : 'Ilustración: con la hoja abierta, las ondas pasan al interior'}>
      <defs>
        <clipPath id="ac-out"><rect x="0" y="0" width="300" height="320" /></clipPath>
        <clipPath id="ac-in"><rect x="340" y="0" width="300" height="320" /></clipPath>
      </defs>
      <rect x="0" y="0" width="320" height="320" fill="#1f2325" />
      <rect x="320" y="0" width="320" height="320" fill="#f6f5f1" />
      <text x="20" y="34" fill="#a1aaaf" fontFamily="IBM Plex Mono" fontSize="12" letterSpacing="2">EXTERIOR</text>
      <text x="620" y="34" fill="#646d73" fontFamily="IBM Plex Mono" fontSize="12" letterSpacing="2" textAnchor="end">INTERIOR</text>
      {/* fuente */}
      <g transform="translate(70 200)">
        <rect x="-34" y="-14" width="68" height="28" rx="6" fill="#383e42" />
        <circle cx="-18" cy="16" r="8" fill="#16191a" stroke="#7b878f" />
        <circle cx="18" cy="16" r="8" fill="#16191a" stroke="#7b878f" />
      </g>
      <g clipPath="url(#ac-out)">
        {outer.map((i) => (
          <circle key={i} cx="70" cy="190" r={40 + i * 46} fill="none" stroke="#ffffff" strokeOpacity={0.55 - i * 0.08} strokeWidth="2"
            className={animated ? 'wave' : ''} style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </g>
      <g clipPath="url(#ac-in)">
        {outer.map((i) => (
          <circle key={i} cx="70" cy="190" r={300 + i * 46} fill="none" stroke="#15181a" strokeWidth="2"
            strokeOpacity={closed ? Math.max(0, 0.16 - i * 0.04) : 0.5 - i * 0.08}
            strokeDasharray={closed ? '3 9' : undefined}
            className={animated ? 'wave' : ''} style={{ animationDelay: `${i * 0.5}s`, transition: 'stroke-opacity 600ms' }} />
        ))}
      </g>
      {/* muro y ventana en sección */}
      <rect x="300" y="0" width="40" height="110" fill="#383e42" />
      <rect x="300" y="250" width="40" height="70" fill="#383e42" />
      <rect x="302" y="110" width="36" height="140" fill="none" stroke="#a1aaaf" strokeWidth="2" />
      <g style={{ transformOrigin: '338px 110px', transform: closed ? 'rotate(0deg)' : 'rotate(-62deg)', transition: 'transform 900ms cubic-bezier(0.16,1,0.3,1)' }}>
        <rect x="312" y="114" width="16" height="132" fill="#efeeea" stroke="#15181a" strokeWidth="1.5" />
        <rect x="318" y="122" width="4" height="116" fill="#cfe0dc" />
      </g>
      <rect x="296" y="248" width="48" height="6" fill="#76b82a" />
      <text x="320" y="300" fill="#ffffff" fontFamily="IBM Plex Mono" fontSize="11" letterSpacing="2" textAnchor="middle">{closed ? 'HOJA CERRADA' : 'HOJA ABIERTA'}</text>
    </svg>
  )
}

export function ThermalIllustration({ variant }: { variant: 'continuo' | 'discontinuo' }) {
  const leak = variant === 'discontinuo'
  return (
    <svg viewBox="0 0 640 300" className="h-auto w-full" role="img" aria-label={leak ? 'Ilustración: un cerramiento con discontinuidades deja pasar intercambio de aire por las rendijas' : 'Ilustración: cerramiento con juntas continuas y encuentro sellado con el muro'}>
      <rect width="320" height="300" fill="#1f2325" />
      <rect x="320" width="320" height="300" fill="#f6f5f1" />
      <text x="20" y="32" fill="#a1aaaf" fontFamily="IBM Plex Mono" fontSize="12" letterSpacing="2">EXTERIOR</text>
      <text x="620" y="32" fill="#646d73" fontFamily="IBM Plex Mono" fontSize="12" letterSpacing="2" textAnchor="end">INTERIOR</text>
      {/* muro */}
      <rect x="280" y="0" width="80" height="70" fill="#383e42" />
      <rect x="280" y="230" width="80" height="70" fill="#383e42" />
      {/* marco + hoja + vidrio (sección) */}
      <rect x="294" y="70" width="52" height="160" fill="#efeeea" stroke="#15181a" strokeWidth="1.5" />
      <rect x="304" y="86" width="32" height="128" fill="#e6ece9" stroke="#15181a" strokeWidth="1" />
      <rect x="312" y="96" width="4" height="108" fill="#9fc1b6" /><rect x="324" y="96" width="4" height="108" fill="#9fc1b6" />
      {/* juntas */}
      {leak ? (
        <>
          <rect x="292" y="66" width="56" height="4" fill="#15181a" strokeDasharray="4 6" />
          <rect x="300" y="226" width="20" height="4" fill="#15181a" />
          <rect x="330" y="226" width="18" height="4" fill="#15181a" />
        </>
      ) : (
        <>
          <rect x="292" y="66" width="56" height="4" fill="#76b82a" />
          <rect x="292" y="230" width="56" height="4" fill="#76b82a" />
        </>
      )}
      {/* flujos conceptuales */}
      {leak ? (
        <g stroke="#15181a" strokeWidth="2" fill="none" strokeDasharray="6 6" className="flow">
          <path d="M150 228 C 250 228, 300 228, 322 228 S 420 222, 470 210" />
          <path d="M150 68 C 250 68, 300 68, 322 68 S 420 74, 470 90" />
          <path d="m462 204 10 6-12 3" strokeDasharray="0" /><path d="m462 84 10 6-12 3" strokeDasharray="0" />
        </g>
      ) : (
        <g stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2" fill="none">
          <path d="M120 120 h150" /><path d="m262 114 10 6-10 6" />
          <path d="M120 180 h150" /><path d="m262 174 10 6-10 6" />
        </g>
      )}
      <text x="480" y="160" fill="#15181a" fontFamily="Montserrat" fontWeight="700" fontSize="15" textAnchor="middle">{leak ? 'Rendijas: intercambio no controlado' : 'Junta continua: encuentro sellado'}</text>
      <text x="480" y="182" fill="#646d73" fontFamily="Montserrat" fontSize="12" textAnchor="middle">Concepto · sin valores</text>
    </svg>
  )
}
