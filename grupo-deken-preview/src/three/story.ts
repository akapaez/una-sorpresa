/**
 * Guion de la portada: fotogramas clave de cámara y rampas de movimiento en función del
 * progreso de scroll (0..1). Escritorio tiene 5 momentos; móvil reduce a 4 y acerca menos la cámara.
 */
export type V3 = [number, number, number]
export interface Key { p: number; pos: V3; look: V3 }

export interface StoryTimeline {
  keys: Key[]
  scenes: number[]          // inicio de cada escena
  handle: [number, number, number, number]
  open: [number, number, number, number]
  explode: [number, number, number, number]
  labels: [number, number, number, number]
  material: [number, number]
  overlay: [number, number]
  pinLength: number         // % de altura de pantalla
}

export const DESKTOP: StoryTimeline = {
  // Composición centrada (texto arriba, producto abajo), al estilo de una página de producto
  keys: [
    { p: 0, pos: [0.4, 1.62, 7.2], look: [0, 1.64, 0] },
    { p: 0.12, pos: [0.85, 1.12, 4.4], look: [0, 1.0, 0] },
    { p: 0.24, pos: [0.5, 0.92, 1.4], look: [-0.04, 0.8, 0] },
    { p: 0.37, pos: [0.3, 0.98, 1.08], look: [-0.04, 0.82, 0] },
    { p: 0.47, pos: [1.75, 1.3, 3.6], look: [0, 0.98, 0.2] },
    { p: 0.61, pos: [1.6, 1.25, 3.45], look: [0, 0.97, 0.25] },
    { p: 0.71, pos: [2.95, 1.75, 3.45], look: [-0.1, 1.22, 0.25] },
    { p: 0.83, pos: [2.85, 1.7, 3.35], look: [-0.1, 1.22, 0.25] },
    { p: 0.95, pos: [0, 1.05, 5.0], look: [0, 0.95, 0] },
    { p: 1, pos: [0, 1.05, 5.0], look: [0, 0.95, 0] },
  ],
  scenes: [0, 0.15, 0.4, 0.65, 0.88],
  handle: [0.42, 0.47, 0.665, 0.69],
  open: [0.47, 0.6, 0.62, 0.665],
  explode: [0.69, 0.8, 0.86, 0.93],
  labels: [0.72, 0.76, 0.845, 0.87],
  material: [0.27, 0.33],
  overlay: [0.9, 1],
  pinLength: 440,
}

export const MOBILE: StoryTimeline = {
  ...DESKTOP,
  keys: [
    { p: 0, pos: [0.55, 1.95, 6.6], look: [0, 1.95, 0] },
    { p: 0.12, pos: [0.7, 1.8, 6.0], look: [0, 1.75, 0] },
    { p: 0.24, pos: [0.55, 1.3, 2.7], look: [0, 1.12, 0] },
    { p: 0.37, pos: [0.4, 1.32, 2.45], look: [0, 1.12, 0] },
    { p: 0.47, pos: [1.6, 1.95, 6.0], look: [0.1, 1.8, 0.2] },
    { p: 0.61, pos: [1.5, 1.9, 5.9], look: [0.1, 1.8, 0.2] },
    { p: 0.71, pos: [2.7, 2.35, 7.4], look: [-0.12, 1.72, 0.15] },
    { p: 0.83, pos: [2.6, 2.3, 7.3], look: [-0.12, 1.72, 0.15] },
    { p: 0.95, pos: [0, 1.9, 6.6], look: [0, 1.9, 0] },
    { p: 1, pos: [0, 1.9, 6.6], look: [0, 1.9, 0] },
  ],
  pinLength: 380,
}

/** Ventanas de visibilidad de cada texto [entra desde, entra hasta, sale desde, sale hasta]. */
export const TEXT_RANGES: Record<string, [number, number, number, number]> = {
  intro: [-1, -1, 0.05, 0.12],
  material: [0.16, 0.21, 0.35, 0.39],
  blanco: [0.16, 0.21, 0.26, 0.29],
  antracita: [0.29, 0.32, 0.35, 0.39],
  funcion: [0.41, 0.46, 0.6, 0.64],
  interior: [0.66, 0.71, 0.83, 0.87],
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
export const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t) }
export const ramp = (p: number, a: number, b: number) => smooth((p - a) / (b - a))
export const upDown = (p: number, r: [number, number, number, number]) => ramp(p, r[0], r[1]) * (1 - ramp(p, r[2], r[3]))

export function shotAt(keys: Key[], p: number): { pos: V3; look: V3 } {
  if (p <= keys[0].p) return keys[0]
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1]
    if (p <= b.p) {
      const t = smooth((p - a.p) / (b.p - a.p || 1))
      const l = (x: number, y: number) => x + (y - x) * t
      return {
        pos: [l(a.pos[0], b.pos[0]), l(a.pos[1], b.pos[1]), l(a.pos[2], b.pos[2])],
        look: [l(a.look[0], b.look[0]), l(a.look[1], b.look[1]), l(a.look[2], b.look[2])],
      }
    }
  }
  return keys[keys.length - 1]
}

export function sceneAt(tl: StoryTimeline, p: number) {
  let s = 0
  tl.scenes.forEach((start, i) => { if (p >= start) s = i })
  return s
}
