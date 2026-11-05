import * as THREE from 'three'
import type { FinishId, GlassId } from './windowSpec'

/**
 * Materiales de demostración. Los acabados son MUESTRAS VISUALES: no corresponden a
 * códigos oficiales de color ni implican disponibilidad real.
 */

let woodTex: { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } | null = null
let grainTex: THREE.CanvasTexture | null = null

function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}
function noise1(x: number) {
  const i = Math.floor(x), f = x - i
  const u = f * f * (3 - 2 * f)
  return hash(i) * (1 - u) + hash(i + 1) * u
}

/** Veta de madera procedural (sin imágenes externas). Veta a lo largo de U. */
function makeWood() {
  if (woodTex) return woodTex
  const w = 1024, h = 256
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(w, h)
  const b = document.createElement('canvas')
  b.width = w; b.height = h
  const bctx = b.getContext('2d')!
  const bimg = bctx.createImageData(w, h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // veta casi recta: ligera ondulación de baja frecuencia + fibras finas
      const warp = (noise1(x * 0.006 + y * 0.004) - 0.5) * 2.2
      const ring = Math.sin(y * 0.55 + warp * 2.4) * 0.5 + 0.5
      const band = noise1(y * 0.09 + 7.3)
      const fibre = noise1(x * 0.9 + y * 31.7) * 0.5 + noise1(y * 3.1 + x * 0.02) * 0.5
      const t = Math.pow(ring, 3) * 0.32 + band * 0.38 + fibre * 0.3
      const r = 158 - t * 52, g = 117 - t * 40, bl = 80 - t * 28
      const i = (y * w + x) * 4
      img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = bl; img.data[i + 3] = 255
      const bv = 128 + (fibre - 0.5) * 60 - Math.pow(ring, 3) * 22
      bimg.data[i] = bimg.data[i + 1] = bimg.data[i + 2] = bv; bimg.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  bctx.putImageData(bimg, 0, 0)
  const map = new THREE.CanvasTexture(c)
  map.colorSpace = THREE.SRGBColorSpace
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.anisotropy = 4
  const bump = new THREE.CanvasTexture(b)
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping
  woodTex = { map, bump }
  return woodTex
}

/** Microgranulado para foils lisos (antracita). */
function makeGrain() {
  if (grainTex) return grainTex
  const s = 256
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(s, s)
  for (let i = 0; i < s * s; i++) {
    const v = 118 + Math.floor(hash(i * 1.37) * 30)
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v
    img.data[i * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  grainTex = new THREE.CanvasTexture(c)
  grainTex.wrapS = grainTex.wrapT = THREE.RepeatWrapping
  grainTex.repeat.set(40, 40)
  return grainTex
}

export interface FinishMaterials { h: THREE.Material; v: THREE.Material }

const finishCache = new Map<string, FinishMaterials>()

export function finishMaterials(id: FinishId): FinishMaterials {
  const hit = finishCache.get(id)
  if (hit) return hit
  let out: FinishMaterials
  if (id === 'madera') {
    const { map, bump } = makeWood()
    const mk = (rot: boolean) => {
      const m = map.clone(); const bm = bump.clone()
      for (const t of [m, bm]) {
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(0.8, 2.6)
        if (rot) { t.center.set(0.5, 0.5); t.rotation = Math.PI / 2 }
        t.needsUpdate = true
      }
      m.colorSpace = THREE.SRGBColorSpace
      return new THREE.MeshPhysicalMaterial({
        map: m, bumpMap: bm, bumpScale: 0.35, roughness: 0.6, metalness: 0,
        clearcoat: 0.08, clearcoatRoughness: 0.6, envMapIntensity: 0.7,
      })
    }
    out = { h: mk(false), v: mk(true) }
  } else if (id === 'antracita') {
    const g = makeGrain()
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#3b4146'), roughness: 0.58, metalness: 0.02,
      bumpMap: g, bumpScale: 0.25, clearcoat: 0.12, clearcoatRoughness: 0.5,
      envMapIntensity: 0.9,
    })
    out = { h: m, v: m }
  } else {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#efeeea'), roughness: 0.4, metalness: 0,
      clearcoat: 0.18, clearcoatRoughness: 0.42, sheen: 0, envMapIntensity: 0.85,
    })
    out = { h: m, v: m }
  }
  finishCache.set(id, out)
  return out
}

const shared: Record<string, THREE.Material> = {}

export function gasketMaterial() {
  return (shared.gasket ??= new THREE.MeshStandardMaterial({ color: '#141617', roughness: 0.82, metalness: 0 }))
}
export function spacerMaterial() {
  return (shared.spacer ??= new THREE.MeshStandardMaterial({ color: '#5f666b', roughness: 0.45, metalness: 0.7 }))
}
export function handleMaterial() {
  return (shared.handle ??= new THREE.MeshPhysicalMaterial({
    color: '#d4d7d9', roughness: 0.36, metalness: 0.85, envMapIntensity: 1.6,
  }))
}
export function hingeMaterial() {
  return (shared.hinge ??= new THREE.MeshStandardMaterial({ color: '#9ea3a6', roughness: 0.35, metalness: 0.85 }))
}

export function glassMaterial(id: GlassId, hq = true) {
  const key = 'glass-' + id + (hq ? '-hq' : '')
  if (shared[key]) return shared[key]
  const m = id === 'privacidad'
    ? new THREE.MeshPhysicalMaterial({
      color: '#e9eeee', roughness: 0.55, metalness: 0, transparent: true, opacity: 0.72,
      envMapIntensity: 0.5, depthWrite: false, side: THREE.DoubleSide,
    })
    : hq
    ? new THREE.MeshPhysicalMaterial({
      // Vidrio con transmisión real: refleja con intensidad completa y deja ver el fondo
      color: '#eef5f2', roughness: 0.015, metalness: 0, transmission: 1, thickness: 0.006, ior: 1.52,
      attenuationColor: new THREE.Color('#dcebe6'), attenuationDistance: 1.2,
      envMapIntensity: 1.7, specularIntensity: 1, side: THREE.FrontSide,
    })
    : new THREE.MeshPhysicalMaterial({
      color: '#cfe0dc', roughness: 0.03, metalness: 0.05, transparent: true, opacity: 0.16,
      envMapIntensity: 2.4, specularIntensity: 1, ior: 1.52, reflectivity: 0.6,
      depthWrite: false, side: THREE.DoubleSide,
    })
  shared[key] = m
  return m
}

/** Canto de vidrio (el tono verdoso del canto de un vidrio float). */
export function glassEdgeMaterial() {
  return (shared.glassEdge ??= new THREE.MeshStandardMaterial({
    color: '#7fa79a', roughness: 0.2, metalness: 0, transparent: true, opacity: 0.6,
  }))
}
