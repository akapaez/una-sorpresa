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
  keys: [
    { p: 0, pos: [0.95, 1.05, 4.1], look: [-0.62, 0.8, 0] },
    { p: 0.14, pos: [0.82, 1.0, 3.85], look: [-0.58, 0.8, 0] },
    { p: 0.25, pos: [0.6, 0.9, 1.3], look: [-0.34, 0.75, 0] },
    { p: 0.37, pos: [0.42, 0.97, 1.05], look: [-0.3, 0.78, 0] },
    { p: 0.47, pos: [1.75, 1.2, 3.1], look: [-0.38, 0.78, 0.25] },
    { p: 0.61, pos: [1.6, 1.15, 3.0], look: [-0.36, 0.78, 0.3] },
    { p: 0.71, pos: [2.7, 1.45, 2.6], look: [-0.25, 0.76, 0.3] },
    { p: 0.83, pos: [2.6, 1.4, 2.5], look: [-0.25, 0.76, 0.3] },
    { p: 0.95, pos: [0, 0.95, 4.6], look: [0, 0.86, 0] },
    { p: 1, pos: [0, 0.95, 4.6], look: [0, 0.86, 0] },
  ],
  scenes: [0, 0.18, 0.42, 0.64, 0.87],
  handle: [0.42, 0.47, 0.665, 0.69],
  open: [0.47, 0.6, 0.62, 0.665],
  explode: [0.69, 0.8, 0.86, 0.93],
  labels: [0.72, 0.76, 0.845, 0.87],
  material: [0.27, 0.35],
  overlay: [0.9, 1],
  pinLength: 320,
}

export const MOBILE: StoryTimeline = {
  // En móvil la ventana ocupa el tercio inferior para no tapar el texto
  keys: [
    { p: 0, pos: [0.55, 1.95, 6.6], look: [0, 1.95, 0] },
    { p: 0.22, pos: [0.45, 1.9, 6.4], look: [0, 1.9, 0] },
    { p: 0.32, pos: [1.5, 1.95, 6.0], look: [0.1, 1.85, 0.2] },
    { p: 0.56, pos: [1.4, 1.9, 5.9], look: [0.1, 1.85, 0.2] },
    { p: 0.68, pos: [2.3, 2.0, 5.5], look: [0.05, 1.8, 0.15] },
    { p: 0.86, pos: [2.2, 1.95, 5.4], look: [0.05, 1.8, 0.15] },
    { p: 1, pos: [0, 1.9, 6.6], look: [0, 1.9, 0] },
  ],
  scenes: [0, 0.25, 0.58, 0.88],
  handle: [0.26, 0.3, 0.52, 0.55],
  open: [0.3, 0.45, 0.48, 0.52],
  explode: [0.58, 0.7, 0.84, 0.92],
  labels: [0.64, 0.7, 0.8, 0.84],
  material: [0.1, 0.2],
  overlay: [0.9, 1],
  pinLength: 220,
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
