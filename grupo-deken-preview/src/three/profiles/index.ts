import type { ProfileShape } from '../geometry'
import living from './living.json'

/**
 * Sección real Schüco LivIng (marco + hoja + junquillo + juntas + refuerzos + vidrio),
 * convertida desde «Seccion living.dxf» (carpeta DXF de Deken) con scripts/dxf/dxf_to_profile.py.
 * Ejes en mm: u desde el canto exterior del marco hacia el hueco; v desde la cara exterior hacia dentro.
 */
export interface RealProfile {
  name: string
  frame: ProfileShape[]
  sash: ProfileShape[]
  bead: ProfileShape[]
  steel_frame: ProfileShape[]
  steel_sash: ProfileShape[]
  gasket_frame: ProfileShape[]
  gasket_sash: ProfileShape[]
  /** u del canto exterior de la hoja respecto al canto exterior del marco. */
  sashU0: number
  glass: { edgeU: number; panes: [number, number][]; spacer: [number, number, number][] }
}

export const LIVING: RealProfile = { name: 'Schüco LivIng', ...(living as unknown as Omit<RealProfile, 'name'>) }

const bb = (shs: ProfileShape[]) => {
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity
  for (const s of shs) for (const [u, v] of s.outer) { u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v) }
  return { u0, u1, v0, v1 }
}

/** Medidas derivadas (m) para colocar piezas y pivotes. */
export function profileMetrics(p: RealProfile) {
  const f = bb(p.frame), s = bb(p.sash), b = bb(p.bead)
  return {
    frameFace: (f.u1 - f.u0) / 1000,
    frameDepth: (f.v1 - f.v0) / 1000,
    sashU0: p.sashU0 / 1000,
    /** Ancho del perfil de hoja (canto exterior → línea de vista). */
    sashFace: (s.u1 - s.u0) / 1000,
    sashV0: s.v0 / 1000,
    sashV1: s.v1 / 1000,
    beadU0: (b.u0 - p.sashU0) / 1000,
    glassEdge: (p.glass.edgeU - p.sashU0) / 1000,
  }
}

/* Simplificación Douglas–Peucker para la ventana montada (tolerancia en mm). */
type P = [number, number]
function dp(pts: P[], tol: number): P[] {
  const rec = (a: P, b: P, seg: P[]): P[] => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9
    let dmax = 0, idx = -1
    seg.forEach((p, i) => {
      const d = Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / L
      if (d > dmax) { dmax = d; idx = i }
    })
    return dmax > tol ? [...rec(a, seg[idx], seg.slice(0, idx)), seg[idx], ...rec(seg[idx], b, seg.slice(idx + 1))] : []
  }
  if (pts.length < 4) return pts
  const h = Math.floor(pts.length / 2)
  return [pts[0], ...rec(pts[0], pts[h], pts.slice(1, h)), pts[h], ...rec(pts[h], pts[0], pts.slice(h + 1))]
}
const simple = (shs: ProfileShape[], tol = 0.2): ProfileShape[] => shs.map((s) => ({ outer: dp(s.outer, tol), holes: [] }))

/**
 * Versión ligera para la ventana montada: contorno exterior simplificado (0,2 mm) y sin cámaras,
 * que no se ven con la ventana cerrada. El corte de sección usa LIVING completo.
 */
export const LIVING_RING: RealProfile = {
  ...LIVING,
  frame: simple(LIVING.frame), sash: simple(LIVING.sash), bead: simple(LIVING.bead),
  gasket_frame: simple(LIVING.gasket_frame, 0.1), gasket_sash: simple(LIVING.gasket_sash, 0.1),
  steel_frame: [], steel_sash: [],
}
