import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Send, FileText, UserRound, Trash2, Forward } from 'lucide-react'
import { useDemo } from '@/demo/store'
import type { ChatMsg } from '@/demo/types'
import { Button } from '@/ui/Button'
import { toast } from '@/ui/Dialog'
import { SelectInput } from '@/ui/primitives'

/**
 * ASISTENTE DE DEMOSTRACIÓN
 * Respuestas predefinidas mediante reglas locales. No usa IA. Las respuestas técnicas citan los
 * resúmenes de folletos y catálogos Schüco de la biblioteca (documento y sección existentes).
 */
interface Rule { test: RegExp; text: string; sources: { docId: string; sectionId: string }[]; kind?: ChatMsg['kind']; link?: { to: string; label: string } }

const RULES: Rule[] = [
  {
    test: /\buw\b/i,
    kind: 'sin-documentacion',
    text: 'El Uw (transmitancia de la ventana completa) no figura en la documentación aportada: depende de la composición de vidrio y de la medida, y se calcula para cada propuesta. No daré una cifra sin fuente.\n\nLo documentado es el Uf del marco: CT 70 1,3 W/(m²K) (catálogo 2026), LivIng desde 1,0 (AS) o 0,96 (MD), FocusIng desde 1,1 y SoftSlide entre 1,4 y 2,3.\n\nPuedo trasladar la pregunta al equipo técnico para que la calcule con tu configuración.',
    sources: [{ docId: 'sc-ct70', sectionId: 'ensayos' }, { docId: 'sc-ct70', sectionId: 'condiciones' }],
  },
  {
    test: /ct ?-?70/i,
    text: 'Schüco CT 70, según el catálogo de pedidos y fabricación (2026-09):\n• Marco de 70 mm (Classic y Rondo; 112 mm en Accent) y vidrios de 4 a 42 mm.\n• Uf = 1,3 W/(m²K) (marco). El folleto Classic indica «hasta 1,2».\n• Rw,P máximo 47 dB (el folleto Classic cita hasta 49 dB con vidrio acústico) y RC 2.\n• Aire clase 4, agua 9A, viento B5.\n\nEl Uw (ventana completa) no figura en la documentación: depende del vidrio y de la medida. Puedo trasladar la consulta al equipo técnico para calcularlo con tu configuración.',
    sources: [{ docId: 'sc-ct70', sectionId: 'dimensiones' }, { docId: 'sc-ct70', sectionId: 'ensayos' }, { docId: 'sc-ct70', sectionId: 'folleto' }],
    link: { to: '/profesional/comparador', label: 'Abrir comparador' },
  },
  {
    test: /living/i,
    text: 'Schüco LivIng Classic: 82 mm y 7 cámaras.\n• 82 AS (dos planos de junta): Uf desde 1,0 W/(m²K).\n• 82 MD (tres planos de junta): Uf desde 0,96 W/(m²K).\n• Vidrios de 16 a 54 mm, hasta 47 dB con vidrio acústico y RC 2 con vidrio de seguridad.\n\nQué versión fabrica Deken está pendiente de confirmar.',
    sources: [{ docId: 'sc-living', sectionId: 'sistema' }, { docId: 'sc-living', sectionId: 'confort' }, { docId: 'sc-living', sectionId: 'seguridad' }],
    link: { to: '/series/schueco-living', label: 'Ver ficha de la serie' },
  },
  {
    test: /focus/i,
    text: 'Schüco FocusIng: profundidad de 70 o 76 mm, 5/6 cámaras y dos juntas; vidrios de 10 a 54 mm; Uf desde 1,1 W/(m²K); hasta 48 dB con vidrio acústico y RC 2 con vidrio de seguridad. Su núcleo lleva hasta un 50 % de PVC reciclado.',
    sources: [{ docId: 'sc-focusing', sectionId: 'sistema' }, { docId: 'sc-focusing', sectionId: 'confort' }, { docId: 'sc-focusing', sectionId: 'sostenibilidad' }],
    link: { to: '/series/schueco-focusing', label: 'Ver ficha de la serie' },
  },
  {
    test: /soft ?slide/i,
    text: 'Schüco SoftSlide (catálogo 09.2023): marco de 74 mm y hoja de 50 mm, vidrios de 4 a 28 mm, Uf entre 1,4 y 2,3 W/(m²K) según perfil, aire clase 4, agua 6A, viento B3. Rodillos para hojas de hasta 50 o 120 kg.',
    sources: [{ docId: 'sc-softslide', sectionId: 'dimensiones' }, { docId: 'sc-softslide', sectionId: 'ensayos' }, { docId: 'sc-softslide', sectionId: 'rodillos' }],
    link: { to: '/series/schueco-softslide', label: 'Ver ficha de la serie' },
  },
  {
    test: /\b(uw|uf|ug|rw|db|decibel|transmitancia|aislamiento|ac[uú]stic|t[eé]rmic|valor(es)?)\b/i,
    text: 'Conviene distinguir tres valores: Uf (marco), Ug (vidrio) y Uw (ventana completa, para una medida y un vidrio concretos). Los folletos y catálogos dan Uf y el aislamiento acústico máximo de cada serie; el Uw de tu ventana depende de la composición de vidrio y se calcula en la propuesta.\n\nDime la serie (CT 70, LivIng, FocusIng o SoftSlide) y te doy los valores documentados con su página.',
    sources: [{ docId: 'sc-ct70', sectionId: 'condiciones' }],
    link: { to: '/profesional/comparador', label: 'Comparar series' },
  },
  {
    test: /(oscilo|practicable|corredera|elevad|apertura|abre|abrir|bascul)/i,
    text: 'La diferencia está en el movimiento:\n• Practicable: la hoja gira sobre bisagras laterales y abre hacia dentro.\n• Oscilobatiente: además del giro, bascula sobre el eje inferior para ventilar sin invadir el interior. La manilla indica el modo.\n• Corredera: las hojas deslizan en su plano y no ocupan espacio delante del hueco.\n\nPara elegir, piensa en el espacio libre delante del hueco y en cómo se va a ventilar.',
    sources: [{ docId: 'd1', sectionId: 'practicable' }, { docId: 'd1', sectionId: 'oscilobatiente' }, { docId: 'd1', sectionId: 'corredera' }],
    link: { to: '/profesional/demostraciones', label: 'Ver demostración de aperturas' },
  },
  {
    test: /(presupuesto|enviar|document|plano|medid|qu[eé] necesit|informaci[oó]n)/i,
    text: 'Para una primera revisión suele bastar con:\n• Localidad de la obra y tipo de proyecto.\n• Listado de huecos con medidas y unidades, o planos acotados (un PDF es suficiente para empezar).\n• Tipología por hueco y acabados, si ya están decididos.\n\nDesde el configurador puedes guardar la configuración en un proyecto y preparar la solicitud sin precio automático.',
    sources: [{ docId: 'd2', sectionId: 'que-enviar' }, { docId: 'd2', sectionId: 'formatos' }, { docId: 'd6', sectionId: 'columnas' }],
    link: { to: '/profesional/configurador', label: 'Abrir configurador' },
  },
  {
    test: /(acabado|color|madera|antracita|blanco|bicolor|foil)/i,
    text: 'Puedes plantear un acabado distinto para cada cara, por ejemplo exterior oscuro e interior blanco. Los colores en pantalla son orientativos: para decidir conviene ver una muestra física. Las muestras del configurador no son códigos oficiales.',
    sources: [{ docId: 'd3', sectionId: 'interior-exterior' }, { docId: 'd3', sectionId: 'muestras' }, { docId: 'd5', sectionId: 'muestras' }],
  },
  {
    test: /(transporte|env[ií]o|enviais|env[ií]ais|provincia|fuera de sevilla|m[aá]laga|madrid|c[oó]rdoba|huelva|badajoz)/i,
    text: 'Deken trabaja con transporte propio habitual en Sevilla capital y provincia. Los pedidos de otras zonas de España se estudian cuando el cliente organiza el transporte.',
    sources: [{ docId: 'd2', sectionId: 'suministro' }],
  },
  {
    test: /(d[oó]nde|albar[aá]n|factura|encontrar|descargar|confirmaci[oó]n)/i,
    text: 'Los documentos de tus pedidos y presupuestos están en «Documentos», agrupados por tipo y por proyecto, presupuesto o pedido. También los tienes dentro del detalle de cada pedido. La documentación técnica y las guías están en la «Biblioteca».',
    sources: [],
    link: { to: '/profesional/documentos', label: 'Ir a Documentos' },
  },
]

const SUGGESTED = [
  '¿Qué diferencia hay entre practicable y oscilobatiente?',
  '¿Qué información necesito para pedir presupuesto?',
  '¿Puedo elegir un acabado distinto por dentro y por fuera?',
  '¿Dónde encuentro los albaranes de un pedido?',
  '¿Qué Uw tiene la serie CT 70?',
  '¿Qué diferencia hay entre LivIng AS y MD?',
]

export function answer(q: string): ChatMsg {
  const r = RULES.find((x) => x.test.test(q))
  const id = 'c' + Math.random().toString(36).slice(2, 8)
  if (!r) return { id, role: 'assistant', kind: 'sin-documentacion', text: 'No encuentro esa información en la documentación disponible en la demo. Puedo trasladar la pregunta al equipo Deken.', sources: [] }
  return { id, role: 'assistant', kind: r.kind ?? 'respuesta', text: r.text + (r.link ? `\n[[${r.link.to}|${r.link.label}]]` : ''), sources: r.sources }
}

export function AssistantChat({ compact = false, initialQuestion }: { compact?: boolean; initialQuestion?: string }) {
  const chat = useDemo((s) => s.chat)
  const push = useDemo((s) => s.pushChat)
  const clear = useDemo((s) => s.clearChat)
  const library = useDemo((s) => s.library)
  const projects = useDemo((s) => s.projects)
  const addQuestion = useDemo((s) => s.addQuestion)
  const createThread = useDemo((s) => s.createThread)
  const [text, setText] = useState(initialQuestion ?? '')
  const [typing, setTyping] = useState(false)
  const [escalate, setEscalate] = useState<string | null>(null)
  const [proj, setProj] = useState(projects[0]?.id ?? '')
  const end = useRef<HTMLDivElement>(null)
  const inputId = useId()

  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [chat.length, typing])

  const ask = (q: string) => {
    const t = q.trim()
    if (!t || typing) return
    push({ id: 'u' + Date.now(), role: 'user', text: t })
    setText('')
    setTyping(true)
    setTimeout(() => {
      const a = answer(t)
      push(a)
      if (a.kind === 'sin-documentacion') addQuestion(t, 'asistente')
      setTyping(false)
    }, 750)
  }
  const lastUser = [...chat].reverse().find((m) => m.role === 'user')?.text ?? ''
  const docTitle = (id: string) => library.find((d) => d.id === id)
  const doEscalate = () => {
    const q = escalate ?? lastUser
    const id = createThread('Consulta desde el asistente', { type: 'project', id: proj }, `Pregunta trasladada desde el asistente de demostración: «${q}»`, 'cliente')
    push({ id: 'c' + Date.now(), role: 'assistant', kind: 'derivada', text: 'He trasladado la pregunta al equipo como conversación del proyecto seleccionado (solo en la demo).\n[[/profesional/mensajes?hilo=' + id + '|Ver conversación]]' })
    setEscalate(null)
    toast('Pregunta trasladada (demo)', 'Se ha creado una conversación local; no se envía a Deken.')
  }

  return (
    <div className={`flex flex-col ${compact ? 'h-[calc(100dvh-9.5rem)]' : 'h-[640px] max-h-[75dvh]'}`}>
      <div className="mb-3 rounded-[10px] border border-dashed border-line-2 bg-paper px-3 py-2 text-[0.78rem] text-ink-2">
        <strong className="text-ink">Demostración.</strong> Respuestas predefinidas a partir de documentos de muestra de la biblioteca. No está conectado a una IA ni a catálogos reales.
      </div>
      <div className="thin-scroll min-h-0 flex-1 space-y-4 overflow-y-auto pr-1" aria-live="polite">
        {chat.length === 0 && (
          <div>
            <p className="text-[0.9rem] font-semibold">Preguntas sugeridas</p>
            <ul className="mt-2 flex flex-col gap-2">
              {SUGGESTED.map((q) => (
                <li key={q}><button onClick={() => ask(q)} className="w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-left text-[0.88rem] hover:border-ink-3">{q}</button></li>
              ))}
            </ul>
          </div>
        )}
        {chat.map((m) => (
          <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold ${m.role === 'user' ? 'bg-paper-2 text-ink-2' : 'bg-night text-green'}`} aria-hidden>{m.role === 'user' ? <UserRound size={14} /> : 'D'}</span>
            <div className={`max-w-[85%] rounded-[12px] px-3.5 py-2.5 text-[0.9rem] ${m.role === 'user' ? 'bg-night text-white' : 'border border-line bg-surface'}`}>
              <p className="sr-only">{m.role === 'user' ? 'Tú:' : 'Asistente:'}</p>
              {m.text.split('\n').map((line, i) => {
                const link = line.match(/^\[\[(.+)\|(.+)\]\]$/)
                if (link) return <Link key={i} to={link[1]} className="mt-2 inline-flex font-bold text-green-ink hover:underline">{link[2]} →</Link>
                return line ? <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p> : <div key={i} className="h-1.5" />
              })}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 border-t border-line pt-2">
                  <p className="label !text-[0.58rem] text-ink-3">Fuentes</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {m.sources.map((s) => {
                      const d = docTitle(s.docId)
                      const sec = d?.sections.find((x) => x.id === s.sectionId)
                      if (!d || !sec) return null
                      return (
                        <li key={s.docId + s.sectionId}>
                          <Link to={`/profesional/biblioteca/${d.slug}#${sec.id}`} className="inline-flex items-center gap-1 rounded-[6px] border border-line bg-paper px-2 py-1 text-[0.74rem] font-semibold text-ink-2 hover:border-ink-3 hover:text-ink">
                            <FileText size={12} aria-hidden />{d.title.length > 34 ? d.title.slice(0, 34) + '…' : d.title} · {sec.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
              {m.kind === 'sin-documentacion' && (
                <button onClick={() => setEscalate(lastUser)} className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-[8px] bg-green px-3 text-[0.8rem] font-bold text-night hover:bg-[#86c63e]"><Forward size={14} aria-hidden />Trasladar al equipo</button>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2 text-[0.84rem] text-ink-3" role="status">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-night text-[0.7rem] font-bold text-green" aria-hidden>D</span>
            <span className="inline-flex gap-1" aria-hidden><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-3" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-3 [animation-delay:150ms]" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-3 [animation-delay:300ms]" /></span>
            Consultando documentos de muestra…
          </div>
        )}
        {escalate !== null && (
          <div className="rounded-[12px] border border-line bg-paper-2 p-3">
            <p className="text-[0.86rem] font-semibold">Trasladar «{escalate}»</p>
            <div className="mt-2"><SelectInput label="Vincular a proyecto" value={proj} onChange={(e) => setProj(e.target.value)} options={projects.map((p) => ({ value: p.id, label: `${p.ref} · ${p.name}` }))} /></div>
            <div className="mt-3 flex gap-2"><Button size="sm" onClick={doEscalate}>Crear conversación</Button><Button size="sm" variant="ghost" onClick={() => setEscalate(null)}>Cancelar</Button></div>
          </div>
        )}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); ask(text) }} className="mt-3 flex items-end gap-2 border-t border-line pt-3">
        <label htmlFor={inputId} className="sr-only">Escribe tu pregunta</label>
        <textarea id={inputId} value={text} onChange={(e) => setText(e.target.value)} rows={1} placeholder="Pregunta sobre aperturas, documentación, acabados…" className="field !min-h-11 flex-1 resize-none"
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(text) } }} />
        <Button type="submit" aria-label="Enviar pregunta" disabled={!text.trim() || typing}><Send size={17} aria-hidden /></Button>
        {chat.length > 0 && <Button variant="ghost" aria-label="Borrar historial local" onClick={clear}><Trash2 size={17} aria-hidden /></Button>}
      </form>
    </div>
  )
}
