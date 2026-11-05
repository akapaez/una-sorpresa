export type Quality = 'high' | 'low'

/** Calidad gráfica adaptable: puntero grueso, pantallas estrechas o pocos núcleos → baja. Forzable con ?q=low|high. */
export function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'high'
  const q = new URLSearchParams(window.location.search).get('q')
  if (q === 'low' || q === 'high') return q
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.innerWidth < 820
  const cores = navigator.hardwareConcurrency || 8
  return coarse || narrow || cores <= 4 ? 'low' : 'high'
}

let webglCache: boolean | null = null
export function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('webgl') === '0') return (webglCache = false)
  try {
    const c = document.createElement('canvas')
    webglCache = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    webglCache = false
  }
  return webglCache
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  const p = new URLSearchParams(window.location.search).get('motion')
  if (p === 'reduce') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
