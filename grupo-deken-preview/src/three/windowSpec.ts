/**
 * Especificación geométrica de las ventanas de demostración.
 *
 * IMPORTANTE: geometría APROXIMADA creada para la previsualización. No procede
 * de DXF ni de catálogos Schüco y no representa ninguna serie concreta. Las
 * medidas (m) son orientativas y solo buscan proporciones creíbles.
 * Para sustituirla por perfiles reales, ver docs/SIGUIENTE_FASE.md (DXF → Shape).
 */

export type Typology = 'practicable' | 'oscilobatiente' | 'corredera' | 'balconera' | 'puerta'
export type OpenMode = 'turn' | 'tilt' | 'slide'
export type FinishId = 'blanco' | 'antracita' | 'madera'
export type GlassId = 'transparente' | 'privacidad'
export type GlazingId = 'doble' | 'triple'

export interface WindowConfig {
  typology: Typology
  leaves: 1 | 2
  finishInterior: FinishId
  finishExterior: FinishId
  glass: GlassId
  glazing: GlazingId
  /** Medidas introducidas por el profesional (mm). Solo afectan a la proporción del modelo dentro de un rango visual. */
  widthMm: number
  heightMm: number
}

export interface Rect { x0: number; x1: number; y0: number; y1: number }

export interface SashSpec {
  id: string
  body: Rect            // contorno exterior del cuerpo de hoja
  lip: { l: number; r: number; t: number; b: number } // solape hacia el lado interior
  face: number          // ancho visto del perfil de hoja
  bottomFace?: number   // zócalo inferior (balconera / puerta)
  zMin: number
  depth: number
  hinge: 'left' | 'right' | null
  canTilt: boolean
  slide: { dx: number } | null
  handle: { side: 'left' | 'right'; y: number; kind: 'lever' | 'pull' } | null
  main: boolean
  panelRatio?: number   // proporción inferior opaca (puerta)
}

export interface WindowLayout {
  W: number
  H: number
  frameFace: number
  frameDepth: number
  frameZMin: number
  sashes: SashSpec[]
  modes: OpenMode[]
  label: string
}

export const DEFAULT_CONFIG: WindowConfig = {
  typology: 'practicable',
  leaves: 2,
  finishInterior: 'blanco',
  finishExterior: 'blanco',
  glass: 'transparente',
  glazing: 'doble',
  widthMm: 1300,
  heightMm: 1450,
}

/** Medidas de referencia por tipología (mm, orientativas para el modelo de ejemplo). */
export const TYPOLOGY_DEFAULT_SIZE: Record<Typology, Record<1 | 2, [number, number]>> = {
  practicable: { 1: [800, 1200], 2: [1300, 1450] },
  oscilobatiente: { 1: [900, 1300], 2: [1300, 1450] },
  corredera: { 1: [1800, 1350], 2: [1800, 1350] },
  balconera: { 1: [900, 2200], 2: [1400, 2200] },
  puerta: { 1: [950, 2150], 2: [950, 2150] },
}

export const TYPOLOGY_LEAVES: Record<Typology, (1 | 2)[]> = {
  practicable: [1, 2],
  oscilobatiente: [1, 2],
  corredera: [2],
  balconera: [1, 2],
  puerta: [1],
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

export function computeLayout(cfg: WindowConfig): WindowLayout {
  // El modelo limita la proporción a un rango visual. NO son límites de fabricación.
  const W = clamp(cfg.widthMm, 500, 3200) / 1000
  const H = clamp(cfg.heightMm, 500, 2600) / 1000
  const isSlide = cfg.typology === 'corredera'
  const frameFace = isSlide ? 0.058 : 0.064
  const frameDepth = isSlide ? 0.12 : 0.07
  const frameZMin = -frameDepth / 2
  const frameFront = frameZMin + frameDepth
  const oL = -W / 2 + frameFace
  const oR = W / 2 - frameFace
  const oB = frameFace
  const oT = H - frameFace
  const gap = 0.004
  const sashes: SashSpec[] = []
  const tall = cfg.typology === 'balconera' || cfg.typology === 'puerta'
  const handleY = (y0: number, y1: number) => (tall ? clamp(1.05, y0 + 0.3, y1 - 0.3) : (y0 + y1) / 2)

  if (isSlide) {
    const mid = (oL + oR) / 2
    const ov = 0.035
    const depth = 0.042
    // Hoja exterior (izquierda, fija en la demo) y hoja interior (derecha, desliza)
    sashes.push({
      id: 'A', body: { x0: oL - 0.012, x1: mid + ov, y0: oB - 0.012, y1: oT + 0.012 },
      lip: { l: 0, r: 0, t: 0, b: 0 }, face: 0.085, zMin: frameZMin + 0.012, depth,
      hinge: null, canTilt: false, slide: null, handle: null, main: false,
    })
    sashes.push({
      id: 'B', body: { x0: mid - ov, x1: oR + 0.012, y0: oB - 0.012, y1: oT + 0.012 },
      lip: { l: 0, r: 0, t: 0, b: 0 }, face: 0.085, zMin: frameZMin + 0.012 + depth + 0.012, depth,
      hinge: null, canTilt: false, slide: { dx: -((oR - oL) / 2 - ov) * 0.94 },
      handle: { side: 'right', y: (oB + oT) / 2, kind: 'pull' }, main: true,
    })
    return { W, H, frameFace, frameDepth, frameZMin, sashes, modes: ['slide'], label: 'Corredera 2 hojas' }
  }

  const zMin = frameZMin + 0.01
  const depth = frameFront - zMin + 0.006 // cuerpo de hoja ligeramente más saliente que el marco
  const face = cfg.typology === 'puerta' ? 0.105 : 0.074
  const bottomFace = cfg.typology === 'puerta' ? 0.16 : cfg.typology === 'balconera' ? 0.11 : undefined
  const tilt = cfg.typology === 'oscilobatiente'
  const lipO = 0.008

  if (cfg.leaves === 1 || cfg.typology === 'puerta') {
    sashes.push({
      id: 'A', body: { x0: oL + gap, x1: oR - gap, y0: oB + gap, y1: oT - gap },
      lip: { l: lipO, r: lipO, t: lipO, b: lipO }, face, bottomFace, zMin, depth,
      hinge: 'left', canTilt: tilt, slide: null,
      handle: { side: 'right', y: handleY(oB, oT), kind: 'lever' }, main: true,
      panelRatio: cfg.typology === 'puerta' ? 0.36 : undefined,
    })
  } else {
    const mid = (oL + oR) / 2
    sashes.push({
      id: 'A', body: { x0: oL + gap, x1: mid - gap / 2, y0: oB + gap, y1: oT - gap },
      lip: { l: lipO, r: 0, t: lipO, b: lipO }, face, bottomFace, zMin, depth,
      hinge: 'left', canTilt: false, slide: null, handle: null, main: false,
    })
    sashes.push({
      id: 'B', body: { x0: mid + gap / 2, x1: oR - gap, y0: oB + gap, y1: oT - gap },
      // la hoja principal solapa a la secundaria en el encuentro central
      lip: { l: 0.022, r: lipO, t: lipO, b: lipO }, face, bottomFace, zMin, depth,
      hinge: 'right', canTilt: tilt, slide: null,
      handle: { side: 'left', y: handleY(oB, oT), kind: 'lever' }, main: true,
    })
  }
  const modes: OpenMode[] = tilt ? ['turn', 'tilt'] : ['turn']
  const names: Record<Typology, string> = {
    practicable: 'Practicable', oscilobatiente: 'Oscilobatiente', corredera: 'Corredera',
    balconera: 'Balconera', puerta: 'Puerta',
  }
  const leavesLabel = cfg.typology === 'puerta' ? '1 hoja' : `${cfg.leaves} ${cfg.leaves === 1 ? 'hoja' : 'hojas'}`
  return { W, H, frameFace, frameDepth, frameZMin, sashes, modes, label: `${names[cfg.typology]} ${leavesLabel}` }
}
