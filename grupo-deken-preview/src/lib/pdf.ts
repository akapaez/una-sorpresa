import type { WindowConfig } from '@/three/windowSpec'
import type { DocFile, LibraryDoc } from '@/demo/types'
import { TYPOLOGY_NAME, FINISHES } from '@/content/solutions'

/**
 * PDF REALES generados en el navegador con jsPDF (carga diferida). Todos llevan la marca de
 * documento de demostración. No son presupuestos, fichas certificadas ni documentos contables.
 */
type JsPDF = import('jspdf').jsPDF

const GREEN: [number, number, number] = [118, 184, 42]
const INK: [number, number, number] = [21, 24, 26]
const INK2: [number, number, number] = [74, 82, 87]
const LINE: [number, number, number] = [222, 219, 211]

async function newDoc(): Promise<JsPDF> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  doc.setProperties({ title: 'Documento de demostración · Grupo Deken', creator: 'Previsualización Grupo Deken', subject: 'DEMO' })
  return doc
}

function frame(doc: JsPDF, title: string, sub: string) {
  const W = doc.internal.pageSize.getWidth()
  doc.setFillColor(13, 14, 15)
  doc.rect(0, 0, W, 26, 'F')
  doc.setFillColor(...GREEN)
  doc.rect(0, 26, W, 1.2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.text('G R U P O', 16, 11)
  doc.setFontSize(14); doc.text('DEKEN', 16, 18)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5)
  doc.setTextColor(161, 170, 175)
  doc.text('DOCUMENTO DE DEMOSTRACIÓN · PREVISUALIZACIÓN', W - 16, 12, { align: 'right' })
  doc.text('Datos ficticios · sin validez comercial ni técnica', W - 16, 17, { align: 'right' })
  // marca de agua
  doc.setTextColor(238, 236, 231)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(86)
  doc.text('DEMO', W / 2 - 20, 190, { angle: 35 })
  // título
  doc.setTextColor(...INK)
  doc.setFontSize(19); doc.text(title, 16, 42)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(...INK2)
  doc.text(sub, 16, 49)
}

function footer(doc: JsPDF, note: string) {
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight()
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setDrawColor(...LINE); doc.setLineWidth(0.3); doc.line(16, H - 18, W - 16, H - 18)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...INK2)
    const lines = doc.splitTextToSize(note, W - 60)
    doc.text(lines, 16, H - 13)
    doc.text(`${i} / ${pages}`, W - 16, H - 13, { align: 'right' })
  }
}

function kv(doc: JsPDF, rows: [string, string][], x: number, y: number, w: number) {
  doc.setFontSize(9)
  rows.forEach(([k, v], i) => {
    const yy = y + i * 7.5
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...INK2); doc.text(k.toUpperCase(), x, yy)
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...INK)
    doc.text(doc.splitTextToSize(v, w - 48)[0] ?? '', x + 48, yy)
    doc.setDrawColor(...LINE); doc.line(x, yy + 2.6, x + w, yy + 2.6)
  })
  return y + rows.length * 7.5
}

function para(doc: JsPDF, text: string, x: number, y: number, w: number, size = 10) {
  doc.setFont('helvetica', 'normal'); doc.setFontSize(size); doc.setTextColor(...INK2)
  const lines = doc.splitTextToSize(text, w)
  doc.text(lines, x, y)
  return y + lines.length * (size * 0.45)
}

function save(doc: JsPDF, name: string) {
  doc.save(name.endsWith('.pdf') ? name : `${name}.pdf`)
}

export const finishName = (id: string) => FINISHES.find((f) => f.id === id)?.name ?? id

export function configRows(c: WindowConfig): [string, string][] {
  return [
    ['Tipología', TYPOLOGY_NAME[c.typology]],
    ['Hojas', String(c.typology === 'puerta' ? 1 : c.leaves)],
    ['Acabado interior', `${finishName(c.finishInterior)} (muestra visual)`],
    ['Acabado exterior', `${finishName(c.finishExterior)} (muestra visual)`],
    ['Vidrio', `${c.glass === 'privacidad' ? 'Privacidad' : 'Transparente'} · ${c.glazing === 'triple' ? 'triple' : 'doble'} (representación)`],
    ['Medidas introducidas', `${c.widthMm} x ${c.heightMm} mm · pendientes de revisión`],
  ]
}

export async function downloadConfigPdf(p: { projectName: string; projectRef: string; configRef: string; name: string; units: number; notes: string; config: WindowConfig; image: string | null }) {
  const doc = await newDoc()
  const W = doc.internal.pageSize.getWidth()
  const date = new Date().toLocaleDateString('es-ES')
  frame(doc, 'Resumen de configuración', `${p.projectRef} · ${p.projectName} · Ref. de ejemplo ${p.configRef} · ${date}`)
  let y = 58
  if (p.image) {
    doc.setFillColor(13, 14, 15); doc.rect(16, y, W - 32, 92, 'F')
    try { doc.addImage(p.image, 'JPEG', 16, y, W - 32, 92, undefined, 'FAST') } catch { /* imagen no disponible */ }
    y += 98
  }
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(...INK); doc.text(p.name, 16, y + 4)
  y = kv(doc, [...configRows(p.config), ['Unidades', String(p.units)]], 16, y + 13, W - 32)
  y += 6
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...INK); doc.text('Notas', 16, y + 2)
  y = para(doc, p.notes || 'Sin notas.', 16, y + 8, W - 32)
  doc.setFillColor(246, 245, 241); doc.rect(16, y + 6, W - 32, 22, 'F')
  para(doc, 'Resumen orientativo de una configuración visual. No es un presupuesto ni una ficha técnica certificada: no incluye precios, compatibilidades de fabricación ni prestaciones. Las medidas son las introducidas por el profesional y están pendientes de revisión por Grupo Deken.', 20, y + 12, W - 40, 8.5)
  footer(doc, 'Generado por la previsualización de la plataforma Grupo Deken. Documento de demostración.')
  save(doc, `${p.configRef}_resumen-configuracion_DEMO.pdf`)
}

const KIND_TITLE: Record<DocFile['kind'], string> = {
  plano: 'Plano de ejemplo', propuesta: 'Propuesta comercial (muestra)', confirmacion: 'Confirmación de pedido (muestra)', albaran: 'Albarán de entrega (muestra)',
  factura: 'Factura (muestra)', medidas: 'Hoja de medidas (muestra)', resumen: 'Resumen de configuración', otro: 'Documento',
}

export async function downloadSampleFile(f: DocFile, ctx: { linkLabel: string; projectLabel: string; lines?: [string, string][]; body?: string[] }) {
  const doc = await newDoc()
  const W = doc.internal.pageSize.getWidth()
  frame(doc, KIND_TITLE[f.kind], `${f.name} · ${f.date}`)
  let y = kv(doc, [['Archivo', f.name], ['Asociado a', ctx.linkLabel], ['Proyecto', ctx.projectLabel], ['Fecha de ejemplo', f.date], ['Emitido por', f.author === 'deken' ? 'Grupo Deken (demo)' : 'Cliente (demo)'], ...(ctx.lines ?? [])], 16, 62, W - 32)
  y += 8
  const body = ctx.body ?? []
  if (f.kind === 'plano') {
    // alzado esquemático
    doc.setDrawColor(...INK); doc.setLineWidth(0.6)
    const x0 = 30, y0 = y + 6, w = W - 60, h = 90
    doc.rect(x0, y0, w, h)
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
      const cx = x0 + 10 + i * ((w - 20) / 4), cy = y0 + 8 + j * ((h - 16) / 3)
      doc.rect(cx, cy, (w - 20) / 4 - 10, (h - 16) / 3 - 8)
      doc.line(cx + ((w - 20) / 4 - 10) / 2, cy, cx + ((w - 20) / 4 - 10) / 2, cy + (h - 16) / 3 - 8)
    }
    doc.setFontSize(8); doc.setTextColor(...INK2); doc.text('ALZADO ESQUEMÁTICO DE EJEMPLO · SIN ESCALA', x0, y0 + h + 6)
    y = y0 + h + 12
  }
  if (f.kind === 'factura' || f.kind === 'propuesta') {
    doc.setFillColor(246, 245, 241); doc.rect(16, y, W - 32, 14, 'F')
    para(doc, 'Importes omitidos en la previsualización. La plataforma no calcula ni publica precios.', 20, y + 8.5, W - 40, 9)
    y += 20
  }
  body.forEach((b) => { y = para(doc, b, 16, y + 4, W - 32) + 2 })
  footer(doc, 'Documento de muestra generado para la previsualización. Datos ficticios: no tiene validez comercial, contable ni técnica.')
  save(doc, f.name)
}

export async function downloadLibraryDoc(d: LibraryDoc) {
  const doc = await newDoc()
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight()
  frame(doc, d.title.length > 52 ? d.title.slice(0, 52) + '…' : d.title, `${d.category} · versión ${d.version} · ${d.date} · idioma original: ${d.language.toUpperCase()}`)
  let y = para(doc, d.description, 16, 60, W - 32, 10.5) + 4
  for (const s of d.sections) {
    if (y > H - 50) { doc.addPage(); y = 24 }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(...INK); doc.text(s.title, 16, y + 6)
    doc.setFillColor(...GREEN); doc.rect(16, y + 8.5, 10, 0.8, 'F')
    y += 14
    for (const b of s.body) { y = para(doc, (s.body.length > 2 ? '·  ' : '') + b, 16, y, W - 32) + 2.5 }
    y += 3
  }
  if (d.origin === 'schueco') {
    footer(doc, `Resumen en español de documentación ${d.manufacturer}${d.sourceFile ? ` (${d.sourceFile.split('/').pop()})` : ''}. Valores del fabricante; consultar el original.`)
    save(doc, `${d.slug}_resumen.pdf`)
  } else {
    footer(doc, `Documento creado para la demo (${d.manufacturer}). No procede de catálogos oficiales.`)
    save(doc, `${d.slug}_DEMO.pdf`)
  }
}
