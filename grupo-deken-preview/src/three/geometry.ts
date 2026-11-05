import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { Rect } from './windowSpec'

type V2 = [number, number]

/** Desplaza hacia dentro un polígono convexo antihorario una distancia d. */
function insetConvex(pts: V2[], d: number): V2[] {
  const n = pts.length
  const lines = pts.map((p, i) => {
    const q = pts[(i + 1) % n]
    const dx = q[0] - p[0]
    const dy = q[1] - p[1]
    const len = Math.hypot(dx, dy) || 1
    const nx = -dy / len // normal interior (polígono CCW)
    const ny = dx / len
    return { p: [p[0] + nx * d, p[1] + ny * d] as V2, dir: [dx, dy] as V2 }
  })
  return lines.map((l, i) => {
    const prev = lines[(i - 1 + n) % n]
    // intersección de prev y l
    const [x1, y1] = prev.p, [dx1, dy1] = prev.dir
    const [x2, y2] = l.p, [dx2, dy2] = l.dir
    const den = dx1 * dy2 - dy1 * dx2
    if (Math.abs(den) < 1e-9) return l.p
    const t = ((x2 - x1) * dy2 - (y2 - y1) * dx2) / den
    return [x1 + dx1 * t, y1 + dy1 * t] as V2
  })
}

function extrudeQuad(pts: V2[], zMin: number, depth: number, bevel: number) {
  const bt = Math.min(bevel, depth / 3)
  const inset = insetConvex(pts, bevel)
  const shape = new THREE.Shape(inset.map(([x, y]) => new THREE.Vector2(x, y)))
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.0002, depth - 2 * bt),
    bevelEnabled: bevel > 0,
    bevelThickness: bt,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 1,
  })
  geo.translate(0, 0, zMin + bt)
  return geo
}

export interface RingGeometry { h: THREE.BufferGeometry; v: THREE.BufferGeometry }

/**
 * Anillo de perfil formado por 4 miembros ingletados (como un marco de PVC soldado).
 * Devuelve dos geometrías fusionadas: horizontales y verticales (para orientar la veta).
 */
export function ringGeometry(outer: Rect, inner: Rect, zMin: number, depth: number, bevel = 0.0025): RingGeometry {
  const { x0, x1, y0, y1 } = outer
  const { x0: i0, x1: i1, y0: j0, y1: j1 } = inner
  const top: V2[] = [[i0, j1], [i1, j1], [x1, y1], [x0, y1]]
  const bottom: V2[] = [[x0, y0], [x1, y0], [i1, j0], [i0, j0]]
  const left: V2[] = [[x0, y0], [i0, j0], [i0, j1], [x0, y1]]
  const right: V2[] = [[i1, j0], [x1, y0], [x1, y1], [i1, j1]]
  const g = (p: V2[]) => extrudeQuad(p, zMin, depth, bevel)
  const h = mergeGeometries([g(top), g(bottom)], false)!
  const v = mergeGeometries([g(left), g(right)], false)!
  return { h, v }
}

/** Caja con cantos suavizados (para manillas, tapas, paneles). */
export function boxGeometry(w: number, h: number, d: number, bevel = 0.002): THREE.BufferGeometry {
  const hw = w / 2, hh = h / 2
  const pts: V2[] = [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]]
  const geo = extrudeQuad(pts, -d / 2, d, bevel)
  return geo
}

export const inset = (r: Rect, l: number, rr = l, t = l, b = l): Rect => ({
  x0: r.x0 + l, x1: r.x1 - rr, y0: r.y0 + b, y1: r.y1 - t,
})
export const expand = (r: Rect, l: number, rr = l, t = l, b = l): Rect => ({
  x0: r.x0 - l, x1: r.x1 + rr, y0: r.y0 - b, y1: r.y1 + t,
})
export const rectW = (r: Rect) => r.x1 - r.x0
export const rectH = (r: Rect) => r.y1 - r.y0
export const rectCx = (r: Rect) => (r.x0 + r.x1) / 2
export const rectCy = (r: Rect) => (r.y0 + r.y1) / 2
