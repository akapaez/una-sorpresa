import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Save, FolderOpen, FileDown, Send, RotateCcw, CheckCircle2, Info } from 'lucide-react'
import { ProductViewer, VIEW_LABEL, type ViewPreset, type ViewerApi } from '@/tools/ProductViewer'
import { useDemo } from '@/demo/store'
import { TYPOLOGY_DEFAULT_SIZE, TYPOLOGY_LEAVES, type Typology, type WindowConfig, type FinishId } from '@/three/windowSpec'
import { FINISHES, TYPOLOGY_NAME } from '@/content/solutions'
import { Button } from '@/ui/Button'
import { Dialog, toast } from '@/ui/Dialog'
import { Segmented, TextInput, TextArea, SelectInput, Badge, Notice } from '@/ui/primitives'
import { OpeningGlyph } from '@/ui/OpeningGlyph'
import { downloadConfigPdf, configRows } from '@/lib/pdf'

const TYPES: Typology[] = ['practicable', 'oscilobatiente', 'corredera', 'balconera', 'puerta']
const STEPS = ['Tipología', 'Acabado', 'Vidrio', 'Medidas'] as const

export default function Configurator() {
  const draft = useDemo((s) => s.draft)
  const setDraft = useDemo((s) => s.setDraft)
  const resetDraft = useDemo((s) => s.resetDraft)
  const projects = useDemo((s) => s.projects)
  const configs = useDemo((s) => s.configs)
  const saveConfig = useDemo((s) => s.saveConfig)
  const submitQuoteRequest = useDemo((s) => s.submitQuoteRequest)
  const nav = useNavigate()
  const cfg = draft.config
  const [view, setView] = useState<ViewPreset>('perspectiva')
  const [step, setStep] = useState(0)
  const [dlg, setDlg] = useState<null | 'save' | 'load' | 'request' | 'sent'>(null)
  const [sentId, setSentId] = useState<string | null>(null)
  const api = useRef<ViewerApi | null>(null)
  const loaded = draft.loadedId ? configs.find((c) => c.id === draft.loadedId) : undefined
  const loadedProject = loaded ? projects.find((p) => p.id === loaded.projectId) : undefined
  const dirty = loaded ? JSON.stringify(loaded.config) !== JSON.stringify(cfg) || loaded.name !== draft.name || loaded.units !== draft.units || loaded.notes !== draft.notes : true

  const update = (c: Partial<WindowConfig>) => setDraft({ config: { ...cfg, ...c } })
  const setType = (t: Typology) => {
    const leaves = TYPOLOGY_LEAVES[t].includes(cfg.leaves) ? cfg.leaves : TYPOLOGY_LEAVES[t][0]
    const [w, h] = TYPOLOGY_DEFAULT_SIZE[t][leaves]
    update({ typology: t, leaves, widthMm: w, heightMm: h })
  }
  const setLeaves = (l: 1 | 2) => { const [w, h] = TYPOLOGY_DEFAULT_SIZE[cfg.typology][l]; update({ leaves: l, widthMm: w, heightMm: h }) }

  const pdf = async () => {
    const img = api.current?.capture() ?? null
    await downloadConfigPdf({
      projectName: loadedProject?.name ?? 'Sin proyecto asignado', projectRef: loadedProject?.ref ?? 'PRJ-—', configRef: loaded?.ref ?? 'CFG-BORRADOR',
      name: draft.name, units: draft.units, notes: draft.notes, config: cfg, image: img,
    })
    toast('PDF descargado', 'Resumen orientativo identificado como documento de demostración.')
  }

  const rows = configRows(cfg)

  const panel = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-line px-5 pb-0 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="label text-ink-3">{loaded ? `${loaded.ref} · ${loadedProject?.ref}` : 'Configuración sin guardar'}</p>
            <label htmlFor="cfg-name" className="sr-only">Nombre de la configuración</label>
            <input id="cfg-name" value={draft.name} onChange={(e) => setDraft({ name: e.target.value })} className="mt-1 w-full rounded-[6px] border border-transparent bg-transparent px-1 py-0.5 -ml-1 text-[1.15rem] font-extrabold tracking-tight hover:border-line focus:border-green-deep focus:outline-none" />
          </div>
          {loaded && <Badge tone={dirty ? 'warn' : 'green'} dot>{dirty ? 'Cambios sin guardar' : 'Guardada'}</Badge>}
        </div>
        <div className="mt-3 flex gap-1 overflow-x-auto" role="tablist" aria-label="Pasos">
          {STEPS.map((s, i) => (
            <button key={s} role="tab" aria-selected={step === i} onClick={() => setStep(i)}
              className={`relative min-h-11 whitespace-nowrap px-2 text-[0.82rem] font-semibold ${step === i ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}`}>
              <span className="tnum mr-1.5 text-ink-3">{i + 1}</span>{s}
              {step === i && <span className="absolute inset-x-2 bottom-0 h-[2px] bg-green" aria-hidden />}
            </button>
          ))}
        </div>
      </div>

      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5" role="tabpanel">
        {step === 0 && (
          <div className="space-y-6">
            <fieldset>
              <legend className="mb-2 text-[0.8rem] font-semibold text-ink-2">Tipología</legend>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map((t) => (
                  <label key={t} className="glyph-host cursor-pointer" data-play={cfg.typology === t}>
                    <input type="radio" name="typ" className="peer sr-only" checked={cfg.typology === t} onChange={() => setType(t)} />
                    <span className="flex min-h-[72px] items-center gap-3 rounded-[10px] border border-line bg-surface p-3 transition-colors peer-checked:border-ink peer-checked:shadow-[inset_0_0_0_1px_var(--color-ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-green-deep hover:border-ink-3">
                      <OpeningGlyph slug={t} className="h-9 w-auto shrink-0 text-ink" />
                      <span className="text-[0.86rem] font-bold">{TYPOLOGY_NAME[t]}</span>
                    </span>
                  </label>
                ))}
                <div className="flex min-h-[72px] items-center gap-3 rounded-[10px] border border-dashed border-line-2 p-3 text-ink-3">
                  <OpeningGlyph slug="elevadora" className="h-9 w-auto shrink-0" />
                  <span className="text-[0.78rem]"><strong className="block text-ink-2">Elevadora</strong>Sin modelo 3D en la demo</span>
                </div>
              </div>
            </fieldset>
            <Segmented label="Número de hojas" value={String(cfg.leaves) as '1' | '2'} onChange={(v) => setLeaves(Number(v) as 1 | 2)}
              options={[{ value: '1', label: '1 hoja', disabled: !TYPOLOGY_LEAVES[cfg.typology].includes(1) }, { value: '2', label: '2 hojas', disabled: !TYPOLOGY_LEAVES[cfg.typology].includes(2) }]} />
            {cfg.typology === 'oscilobatiente' && cfg.leaves === 2 && <p className="text-[0.8rem] text-ink-2">En 2 hojas, la hoja principal es oscilobatiente y la secundaria practicable.</p>}
          </div>
        )}
        {step === 1 && (
          <div className="space-y-6">
            {(['finishInterior', 'finishExterior'] as const).map((k) => (
              <fieldset key={k}>
                <legend className="mb-2 text-[0.8rem] font-semibold text-ink-2">{k === 'finishInterior' ? 'Acabado interior' : 'Acabado exterior'}</legend>
                <div className="grid grid-cols-3 gap-2">
                  {FINISHES.map((f) => (
                    <label key={f.id} className="cursor-pointer">
                      <input type="radio" name={k} className="peer sr-only" checked={cfg[k] === f.id} onChange={() => update({ [k]: f.id as FinishId })} />
                      <span className="flex flex-col items-center gap-2 rounded-[10px] border border-line bg-surface p-3 text-center peer-checked:border-ink peer-checked:shadow-[inset_0_0_0_1px_var(--color-ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-green-deep hover:border-ink-3">
                        <span className="h-10 w-10 rounded-full border border-line-2 shadow-1" style={{ background: f.swatch }} aria-hidden />
                        <span className="text-[0.82rem] font-bold">{f.name}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <p className="text-[0.8rem] text-ink-3">Muestras visuales de ejemplo. No representan códigos oficiales ni disponibilidad. Para ver el exterior, usa la vista «Exterior».</p>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <Segmented label="Vidrio (muestra visual)" value={cfg.glass} onChange={(v) => update({ glass: v })} options={[{ value: 'transparente', label: 'Transparente' }, { value: 'privacidad', label: 'Privacidad' }]} />
            <Segmented label="Representación del acristalamiento" value={cfg.glazing} onChange={(v) => update({ glazing: v })} options={[{ value: 'doble', label: 'Doble' }, { value: 'triple', label: 'Triple' }]} />
            <Notice tone="neutral">La composición real del vidrio (espesores, cámaras, tratamientos) se define con la documentación técnica. Aquí solo cambia su aspecto; usa «Piezas» en el visor para ver las láminas.</Notice>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Ancho (mm)" type="number" inputMode="numeric" min={400} max={4000} value={cfg.widthMm} onChange={(e) => update({ widthMm: Number(e.target.value) || 0 })} />
              <TextInput label="Alto (mm)" type="number" inputMode="numeric" min={400} max={3000} value={cfg.heightMm} onChange={(e) => update({ heightMm: Number(e.target.value) || 0 })} />
            </div>
            <TextInput label="Unidades" type="number" min={1} value={draft.units} onChange={(e) => setDraft({ units: Math.max(1, Number(e.target.value) || 1) })} />
            <TextArea label="Notas para Deken" value={draft.notes} onChange={(e) => setDraft({ notes: e.target.value })} hint="Ubicación de los huecos, sentido de apertura, dudas…" />
            <Notice tone="warn" title="Medidas pendientes de revisión">Son las medidas que introduces para la solicitud. El modelo solo ajusta la proporción visual dentro de un rango y no deduce límites de fabricación.</Notice>
          </div>
        )}
      </div>

      {/* Resumen persistente + acciones */}
      <div className="border-t border-line bg-paper-2/70 px-5 py-4">
        <details className="group mb-3" open>
          <summary className="flex cursor-pointer list-none items-center justify-between text-[0.8rem] font-bold text-ink-2">Resumen <span className="label !text-[0.6rem] text-ink-3 group-open:hidden">mostrar</span></summary>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[0.78rem]">
            {rows.map(([k, v]) => <div key={k} className="contents"><dt className="text-ink-3">{k}</dt><dd className="truncate font-semibold text-ink">{v}</dd></div>)}
            <dt className="text-ink-3">Unidades</dt><dd className="font-semibold tnum">{draft.units}</dd>
          </dl>
        </details>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="dark" size="sm" icon={<Save size={15} aria-hidden />} onClick={() => setDlg('save')}>{loaded ? 'Guardar' : 'Guardar en proyecto'}</Button>
          <Button variant="outline" size="sm" icon={<FolderOpen size={15} aria-hidden />} onClick={() => setDlg('load')}>Retomar</Button>
          <Button variant="outline" size="sm" icon={<FileDown size={15} aria-hidden />} onClick={pdf}>Descargar PDF</Button>
          <Button size="sm" icon={<Send size={15} aria-hidden />} onClick={() => setDlg('request')}>Solicitar presupuesto</Button>
        </div>
        <button onClick={() => { resetDraft(); setView('perspectiva'); toast('Configuración restablecida') }} className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-[0.78rem] font-semibold text-ink-3 hover:text-ink"><RotateCcw size={13} aria-hidden />Restablecer configuración</button>
      </div>
    </div>
  )

  return (
    <div className="-mx-4 -my-6 sm:-mx-6 lg:-mx-8 lg:-my-8">
      <div className="flex flex-col lg:h-[calc(100dvh-4rem-2.5rem)] lg:flex-row">
        <div className="relative lg:min-w-0 lg:flex-1">
          <div className="sticky top-16 z-10 h-[46vh] min-h-[300px] lg:static lg:h-full">
            <ProductViewer cfg={cfg} view={view} onViewChange={setView} title={`Configuración: ${rows[0][1]}, ${rows[2][1]}`} className="h-full w-full" apiRef={api} captureable />
            <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1 rounded-[10px] border border-white/10 bg-night/75 p-1 backdrop-blur-md" role="group" aria-label="Vista">
              {(Object.keys(VIEW_LABEL) as ViewPreset[]).map((v) => (
                <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className={`min-h-9 rounded-[7px] px-2.5 text-[0.76rem] font-semibold ${view === v ? 'bg-white text-night' : 'text-fog-2 hover:text-white'}`}>{VIEW_LABEL[v]}</button>
              ))}
            </div>
          </div>
        </div>
        <aside className="border-l border-line bg-surface lg:w-[400px] lg:shrink-0" aria-label="Opciones de configuración">{panel}</aside>
      </div>

      <SaveDialog key={`sv-${dlg === 'save'}-${loaded?.id}`} open={dlg === 'save'} onClose={() => setDlg(null)} onSaved={(pid) => { setDlg(null); toast('Configuración guardada', `En ${projects.find((p) => p.id === pid)?.name ?? 'el proyecto'} (solo en esta demo).`) }} save={saveConfig} loadedProjectId={loaded?.projectId} loadedId={loaded?.id} />
      <Dialog open={dlg === 'load'} onClose={() => setDlg(null)} title="Retomar una configuración" description="Configuraciones guardadas en tus proyectos de demostración">
        <div className="space-y-5">
          {projects.map((p) => {
            const list = configs.filter((c) => c.projectId === p.id)
            if (!list.length) return null
            return (
              <div key={p.id}>
                <p className="label text-ink-3">{p.ref} · {p.name}</p>
                <ul className="mt-2 space-y-1.5">
                  {list.map((c) => (
                    <li key={c.id}>
                      <button onClick={() => { setDraft({ config: c.config, loadedId: c.id, name: c.name, units: c.units, notes: c.notes }); setDlg(null); toast('Configuración cargada', `${c.ref} · ${c.name}`) }}
                        className="flex w-full items-center gap-3 rounded-[10px] border border-line bg-surface p-3 text-left hover:border-ink-3">
                        <OpeningGlyph slug={c.config.typology} className="h-8 w-auto shrink-0" />
                        <span className="min-w-0 flex-1"><span className="block font-bold">{c.name}</span><span className="block truncate text-[0.8rem] text-ink-2">{c.ref} · {TYPOLOGY_NAME[c.config.typology]} · {c.config.widthMm}×{c.config.heightMm} · {c.units} ud.</span></span>
                        {c.id === draft.loadedId && <Badge tone="green">Abierta</Badge>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Dialog>
      <RequestDialog key={`rq-${dlg === 'request'}-${loaded?.id}-${dirty}`} open={dlg === 'request'} onClose={() => setDlg(null)} loadedId={loaded && !dirty ? loaded.id : undefined} loadedProjectId={loaded?.projectId}
        onNeedSave={() => setDlg('save')}
        onSubmit={(pid, ids, notes, pref) => { const id = submitQuoteRequest(pid, ids, notes, pref); setSentId(id); setDlg('sent') }} />
      <Dialog open={dlg === 'sent'} onClose={() => setDlg(null)} title="Solicitud preparada (simulación)"
        footer={<><Button variant="outline" onClick={() => setDlg(null)}>Seguir configurando</Button><Button onClick={() => { const r = useDemo.getState().requests.find((x) => x.id === sentId); nav(`/profesional/proyectos/${r?.projectId}`) }}>Ver proyecto</Button></>}>
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 shrink-0 text-green-ink" aria-hidden />
          <div className="space-y-2 text-[0.92rem] text-ink-2">
            <p>La solicitud <strong className="text-ink">{useDemo.getState().requests.find((x) => x.id === sentId)?.ref}</strong> se ha registrado en la demo con una copia de las configuraciones. <strong className="text-ink">No se ha enviado nada a Deken.</strong></p>
            <p>Aparece en el panel Deken (modo «Equipo Deken» → Solicitudes). No incluye precio: Deken prepara la propuesta tras la revisión técnica.</p>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

function SaveDialog({ open, onClose, onSaved, save, loadedProjectId, loadedId }: {
  open: boolean; onClose: () => void; onSaved: (pid: string) => void
  save: (p: { projectId?: string; newProject?: { name: string; city: string }; id?: string }) => { configId: string; projectId: string }
  loadedProjectId?: string; loadedId?: string
}) {
  const projects = useDemo((s) => s.projects)
  const draft = useDemo((s) => s.draft)
  const setDraft = useDemo((s) => s.setDraft)
  const [target, setTarget] = useState<string>(loadedProjectId ?? projects[0]?.id ?? 'new')
  const [mode, setMode] = useState<'update' | 'copy'>('update')
  const [newName, setNewName] = useState('')
  const [city, setCity] = useState('Sevilla')
  const [err, setErr] = useState('')
  const opts = useMemo(() => [...projects.map((p) => ({ value: p.id, label: `${p.ref} · ${p.name}` })), { value: 'new', label: '+ Nuevo proyecto de demostración' }], [projects])
  const submit = () => {
    if (target === 'new' && !newName.trim()) { setErr('Indica un nombre para el proyecto.'); return }
    const r = save({ projectId: target === 'new' ? undefined : target, newProject: target === 'new' ? { name: newName.trim(), city } : undefined, id: loadedId && mode === 'update' && target === loadedProjectId ? loadedId : undefined })
    onSaved(r.projectId)
  }
  return (
    <Dialog open={open} onClose={onClose} title="Guardar configuración" description="Se guarda en este navegador, dentro de un proyecto de demostración"
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button variant="dark" onClick={submit}>Guardar</Button></>}>
      <div className="space-y-4">
        <TextInput label="Nombre" value={draft.name} onChange={(e) => setDraft({ name: e.target.value })} />
        <SelectInput label="Proyecto" value={target} onChange={(e) => { setTarget(e.target.value); setErr('') }} options={opts} />
        {target === 'new' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Nombre del proyecto" value={newName} onChange={(e) => setNewName(e.target.value)} error={err} />
            <TextInput label="Localidad (ejemplo)" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
        )}
        {loadedId && target === loadedProjectId && (
          <Segmented label="Al guardar" value={mode} onChange={setMode} options={[{ value: 'update', label: 'Actualizar la guardada' }, { value: 'copy', label: 'Guardar como nueva' }]} />
        )}
      </div>
    </Dialog>
  )
}

function RequestDialog({ open, onClose, onSubmit, loadedId, loadedProjectId, onNeedSave }: {
  open: boolean; onClose: () => void; onSubmit: (pid: string, ids: string[], notes: string, pref: string) => void; loadedId?: string; loadedProjectId?: string; onNeedSave: () => void
}) {
  const projects = useDemo((s) => s.projects)
  const configs = useDemo((s) => s.configs)
  const [pid, setPid] = useState(loadedProjectId ?? projects[0]?.id)
  const list = configs.filter((c) => c.projectId === pid)
  const [sel, setSel] = useState<string[]>(loadedId ? [loadedId] : [])
  const [notes, setNotes] = useState('')
  const [pref, setPref] = useState('Correo electrónico')
  const ids = sel.filter((id) => list.some((c) => c.id === id))
  return (
    <Dialog open={open} onClose={onClose} title="Preparar solicitud de presupuesto" description="Sin precio automático: Deken revisa y prepara la propuesta" wide
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button disabled={!ids.length} onClick={() => onSubmit(pid!, ids, notes, pref)}>Registrar solicitud (demo)</Button></>}>
      <div className="space-y-5">
        {!loadedId && (
          <Notice tone="warn" title="La configuración actual no está guardada">
            Guárdala en un proyecto para incluirla. <button onClick={onNeedSave} className="font-bold underline">Guardar ahora</button>
          </Notice>
        )}
        <SelectInput label="Proyecto" value={pid} onChange={(e) => { setPid(e.target.value); setSel([]) }} options={projects.map((p) => ({ value: p.id, label: `${p.ref} · ${p.name}` }))} />
        <fieldset>
          <legend className="mb-2 text-[0.8rem] font-semibold text-ink-2">Configuraciones incluidas</legend>
          {list.length === 0 ? <p className="text-[0.86rem] text-ink-3">Este proyecto aún no tiene configuraciones guardadas.</p> : (
            <ul className="space-y-1.5">
              {list.map((c) => (
                <li key={c.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-line p-3 hover:border-ink-3">
                    <input type="checkbox" className="h-5 w-5 accent-[#3f6b10]" checked={ids.includes(c.id)} onChange={(e) => setSel(e.target.checked ? [...sel, c.id] : sel.filter((x) => x !== c.id))} />
                    <OpeningGlyph slug={c.config.typology} className="h-7 w-auto shrink-0" />
                    <span className="min-w-0 flex-1 text-[0.86rem]"><strong>{c.name}</strong> <span className="text-ink-2">· {c.ref} · {TYPOLOGY_NAME[c.config.typology]} · {c.config.widthMm}×{c.config.heightMm} mm · {c.units} ud.</span></span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </fieldset>
        <TextArea label="Observaciones" value={notes} onChange={(e) => setNotes(e.target.value)} hint="Plazos, fases, accesos a obra…" />
        <SelectInput label="Preferencia de contacto" value={pref} onChange={(e) => setPref(e.target.value)} options={['Correo electrónico', 'Teléfono', 'Mensaje en la plataforma'].map((x) => ({ value: x, label: x }))} />
        <p className="flex items-start gap-2 text-[0.8rem] text-ink-3"><Info size={14} className="mt-0.5 shrink-0" aria-hidden />Se guarda una copia de cada configuración tal como está ahora. Cambios posteriores no modifican la solicitud.</p>
      </div>
    </Dialog>
  )
}

