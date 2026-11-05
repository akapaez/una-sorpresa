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

/* ------------------------------------------------------------------------------------------
 * Perfiles reales (DXF → contorno). Ver scripts/dxf/dxf_to_profile.py.
 * Sección en mm: u = distancia hacia el hueco desde el canto exterior, v = profundidad.
 * ---------------------------------------------------------------------------------------- */
export type P2 = [number, number]
export interface ProfileShape { outer: P2[]; holes: P2[][] }

/**
 * Miembro recto de longitud L a lo largo de +X, con ingletes a 45° en ambos extremos:
 * a una distancia «a» hacia el interior del anillo, el miembro va de x=a a x=L−a.
 * Ejes locales: X = longitud, Y = hacia el hueco, Z = profundidad (zOf(v)).
 */
function memberGeometry(shapes: ProfileShape[], uRef: number, L: number, z0: number, zSign: number): THREE.BufferGeometry {
  const parts = shapes.map((s) => {
    const v2 = (p: P2) => new THREE.Vector2((p[0] - uRef) / 1000, p[1] / 1000)
    const sh = new THREE.Shape(s.outer.map(v2))
    sh.holes = s.holes.map((h) => new THREE.Path(h.map(v2)))
    const g = new THREE.ExtrudeGeometry(sh, { depth: L, bevelEnabled: false, steps: 1, curveSegments: 1 })
    const pos = g.attributes.position as THREE.BufferAttribute
    const uv = new Float32Array(pos.count * 2)
    for (let i = 0; i < pos.count; i++) {
      const a = pos.getX(i), b = pos.getY(i), t = pos.getZ(i)
      const x = a + (t / L) * (L - 2 * a)
      pos.setXYZ(i, x, a, z0 + zSign * b)
      uv[i * 2] = x; uv[i * 2 + 1] = a + b
    }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    // Con zSign negativo la orientación se invierte: corregir el sentido de los triángulos
    if (zSign < 0) {
      const p = pos.array as Float32Array, u = uv
      for (let i = 0; i < pos.count; i += 3) {
        for (let k = 0; k < 3; k++) { const tmp = p[(i + 1) * 3 + k]; p[(i + 1) * 3 + k] = p[(i + 2) * 3 + k]; p[(i + 2) * 3 + k] = tmp }
        for (let k = 0; k < 2; k++) { const tmp = u[(i + 1) * 2 + k]; u[(i + 1) * 2 + k] = u[(i + 2) * 2 + k]; u[(i + 2) * 2 + k] = tmp }
      }
    }
    g.deleteAttribute('normal')
    g.computeVertexNormals()
    return g
  })
  return parts.length === 1 ? parts[0] : mergeGeometries(parts, false)!
}

/**
 * Anillo soldado con un perfil real: cuatro miembros ingletados alrededor de `rect`
 * (rect = canto exterior del perfil). Profundidad: z = z0 + zSign · v.
 */
export function profileRing(shapes: ProfileShape[], rect: Rect, uRef: number, z0: number, zSign = 1, withHoles = false): RingGeometry {
  // Las cámaras interiores no se ven en un anillo cerrado (los ingletes quedan tapados):
  // se omiten para aligerar la geometría. Se muestran en el corte (profileSlice).
  if (!withHoles) shapes = shapes.map((s) => ({ outer: s.outer, holes: [] }))
  const { x0, x1, y0, y1 } = rect
  const W = x1 - x0, H = y1 - y0
  const side = (L: number, x: number, y: number, rot: number) => {
    const g = memberGeometry(shapes, uRef, L, z0, zSign)
    g.applyMatrix4(new THREE.Matrix4().makeRotationZ(rot).setPosition(x, y, 0))
    return g
  }
  const h = mergeGeometries([side(W, x0, y0, 0), side(W, x1, y1, Math.PI)], false)!
  const v = mergeGeometries([side(H, x1, y0, Math.PI / 2), side(H, x0, y1, -Math.PI / 2)], false)!
  return { h, v }
}

/** Tramo recto (sin inglete) de una sección, para cortes y despieces: X = longitud. */
export function profileSlice(shapes: ProfileShape[], uRef: number, L: number, z0: number, zSign = 1): THREE.BufferGeometry {
  const parts = shapes.map((s) => {
    const v2 = (p: P2) => new THREE.Vector2((p[0] - uRef) / 1000, p[1] / 1000)
    const sh = new THREE.Shape(s.outer.map(v2))
    sh.holes = s.holes.map((h) => new THREE.Path(h.map(v2)))
    const g = new THREE.ExtrudeGeometry(sh, { depth: L, bevelEnabled: false, steps: 1, curveSegments: 1 })
    // (a, b, t) → (t, a, z0 + zSign·b)
    const m = new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, zSign, 0, z0, 0, 0, 0, 1)
    g.applyMatrix4(m)
    return g
  })
  return parts.length === 1 ? parts[0] : mergeGeometries(parts, false)!
}
