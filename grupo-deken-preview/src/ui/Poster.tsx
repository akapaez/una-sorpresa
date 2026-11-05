import { useState } from 'react'

/**
 * Imagen de producto generada a partir del modelo 3D de la previsualización
 * (scripts/render-posters.mjs). Si falta, muestra un fondo de escena coherente.
 */
export function Poster({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) return <div className={`${className} bg-[radial-gradient(ellipse_at_60%_45%,#2a3033_0%,#16191a_55%,#0d0e0f_100%)]`} role={alt ? 'img' : undefined} aria-label={alt || undefined} />
  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setOk(false)} />
}
