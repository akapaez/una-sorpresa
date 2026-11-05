/**
 * Genera las imágenes de producto y de respaldo (public/renders/*.jpg) a partir del
 * modelo 3D de la previsualización, mediante la ruta interna /_render.
 *
 * Uso: con el servidor en marcha (npm run dev o npm run preview):
 *   node scripts/render-posters.mjs http://localhost:5173
 * Requiere Playwright con Chromium disponible en el entorno.
 */
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const base = process.argv[2] ?? 'http://localhost:5173'
const only = process.argv[3]?.split(',')
const out = new URL('../public/renders/', import.meta.url).pathname
mkdirSync(out, { recursive: true })

const P = (o) => new URLSearchParams(o).toString()
const jobs = [
  { name: 'hero-desktop', w: 1600, h: 1000, q: P({ scene: 'hero' }) },
  { name: 'hero-mobile', w: 780, h: 1500, q: P({ scene: 'hero', mobile: '1' }) },
  { name: 'practicable', w: 1200, h: 1000, q: P({ t: 'practicable', l: 2, f: 'blanco', open: 0.5, cam: '1.55,1.05,3.7', look: '0,0.72,0' }) },
  { name: 'oscilobatiente', w: 1200, h: 1000, q: P({ t: 'oscilobatiente', l: 1, w: 900, h: 1300, f: 'antracita', open: 1, mode: 'tilt', cam: '1.35,1.15,3.3', look: '0,0.65,0' }) },
  { name: 'corredera', w: 1200, h: 1000, q: P({ t: 'corredera', l: 2, w: 1800, h: 1350, f: 'antracita', open: 0.55, mode: 'slide', cam: '1.7,1.05,4.1', look: '0,0.68,0' }) },
  { name: 'balconera', w: 1200, h: 1000, q: P({ t: 'balconera', l: 2, w: 1400, h: 2200, f: 'blanco', open: 0.45, cam: '2.1,1.35,5.4', look: '0,1.1,0' }) },
  { name: 'puerta', w: 1200, h: 1000, q: P({ t: 'puerta', l: 1, w: 950, h: 2150, f: 'madera', open: 0.35, cam: '1.75,1.25,5.0', look: '0,1.07,0' }) },
  { name: 'elevadora', w: 1200, h: 1000, q: P({ t: 'corredera', l: 2, w: 3000, h: 2300, f: 'antracita', open: 0, cam: '2.4,1.3,7.0', look: '0,1.15,0' }) },
  { name: 'detalle-blanco', w: 1000, h: 1200, q: P({ t: 'practicable', l: 2, f: 'blanco', cam: '0.36,0.86,0.66', look: '0.0,0.7,0', fov: 30 }) },
  { name: 'detalle-antracita', w: 1000, h: 1200, q: P({ t: 'practicable', l: 2, f: 'antracita', cam: '0.36,0.86,0.66', look: '0.0,0.7,0', fov: 30 }) },
  { name: 'detalle-madera', w: 1200, h: 900, q: P({ t: 'practicable', l: 2, f: 'madera', open: 0.3, cam: '0.75,0.5,1.05', look: '0.1,0.32,0', fov: 30 }) },
  { name: 'vidrio-privacidad', w: 1200, h: 900, q: P({ t: 'practicable', l: 2, f: 'blanco', g: 'privacidad', cam: '1.3,1.0,3.0', look: '0,0.72,0' }) },
  { name: 'fabricacion', w: 1600, h: 900, q: P({ t: 'practicable', l: 2, f: 'antracita', explode: 1, cam: '2.9,1.5,2.7', look: '-0.55,0.76,0.3' }) },
  { name: 'cierre', w: 1200, h: 900, q: P({ t: 'practicable', l: 2, f: 'antracita', open: 0.85, cam: '1.9,1.15,3.2', look: '-0.25,0.75,0.25' }) },
]

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
for (const j of jobs) {
  if (only && !only.includes(j.name)) continue
  const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 })
  await page.goto(`${base}/_render?${j.q}`, { waitUntil: 'load' })
  await page.waitForSelector('canvas', { timeout: 60000 })
  await page.waitForTimeout(9000)
  await page.screenshot({ path: `${out}${j.name}.jpg`, type: 'jpeg', quality: 84, timeout: 180000 })
  console.log('ok', j.name)
  await page.close()
}
await browser.close()
