import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Truck, FileText, MapPin, ScrollText } from 'lucide-react'
import { useDemo } from '@/demo/store'
import { Button } from '@/ui/Button'
import { Eyebrow, Notice, SelectInput, TextArea, TextInput, Badge, DemoTag } from '@/ui/primitives'
import { Poster } from '@/ui/Poster'
import { PendingStatus } from '@/layouts/AppShell'
import { toast } from '@/ui/Dialog'
import NotFound from './NotFound'

/* ------------------------------------ Fabricación ------------------------------------ */
export function Manufacturing() {
  const steps = [
    { t: 'Revisión de la documentación', d: 'Antes de fabricar se revisan tipología, sentido de apertura, medidas y acabados de cada hueco, y la versión de propuesta aplicada.' },
    { t: 'Perfiles y acabados', d: 'Se trabaja con sistemas de PVC Schüco. El acabado interior y exterior se define por proyecto.' },
    { t: 'Vidrio y accesorios', d: 'Vidrios, persianas y otros accesorios pueden proceder de proveedores distintos, según la configuración.' },
    { t: 'Montaje del cerramiento', d: 'Marco, hoja, herraje, juntas y acristalamiento se integran en un mismo conjunto antes del suministro.' },
    { t: 'Preparación y suministro', d: 'Transporte propio habitual en Sevilla capital y provincia. Otras zonas: se estudian cuando el cliente organiza el transporte.' },
  ]
  return (
    <div className="bg-paper">
      <section className="dark-scene grain relative overflow-hidden" data-theme="dark">
        <Poster src="/renders/fabricacion.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(13_14_15/0.92),rgb(13_14_15/0.4)_60%,transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-[1440px] px-4 pb-20 pt-24 sm:px-6 md:pb-28 md:pt-32 lg:px-10">
          <Eyebrow dark className="mb-5">Fabricación</Eyebrow>
          <h1 className="display max-w-3xl text-[2.5rem] md:text-[3.8rem]">Precisión antes, durante y después de fabricar.</h1>
          <p className="lede mt-5 max-w-xl text-[1.02rem] text-fog-2">Cómo trabajamos un pedido desde que llega la documentación hasta que se suministra en obra.</p>
          <p className="label mt-8 !text-[0.6rem] text-fog-3">Imagen: visual de producto creado para la previsualización · no es una fotografía de la fábrica</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="h-section text-[1.9rem] md:text-[2.5rem]">Un proceso ordenado, con el estado visible.</h2>
            <p className="mt-4 text-ink-2">Los profesionales aprobados siguen cada pedido desde su espacio: estado, previsión, fecha confirmada y documentos.</p>
            <Notice className="mt-6" tone="neutral" title="Pendiente de confirmar">Maquinaria, capacidad productiva, controles específicos y certificaciones se incorporarán cuando Deken aporte la información verificada.</Notice>
          </div>
          <ol className="border-l border-line">
            {steps.map((s, i) => (
              <li key={s.t} className="relative pb-12 pl-10 last:pb-0">
                <span className="absolute -left-[13px] top-0 grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-green bg-paper text-[0.72rem] font-extrabold tnum">{i + 1}</span>
                <h3 className="text-[1.3rem] font-bold tracking-tight">{s.t}</h3>
                <p className="mt-2 max-w-xl text-ink-2">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="border-t border-line bg-paper-2 py-16">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-10">
          {[
            { i: <MapPin aria-hidden />, t: 'Santiponce, Sevilla', d: 'Referencia geográfica de Grupo Deken. Prioridad comercial: Sevilla capital y provincia.' },
            { i: <Truck aria-hidden />, t: 'Transporte propio', d: 'Habitual dentro de Sevilla y provincia. Fuera de ella, el cliente organiza el transporte y el pedido se estudia.' },
            { i: <FileText aria-hidden />, t: 'Documentación del pedido', d: 'Confirmación, hojas de medidas, albaranes y facturas disponibles en el espacio profesional.' },
          ].map((x) => (
            <div key={x.t} className="rounded-[14px] border border-line bg-surface p-6">
              <span className="text-green-ink">{x.i}</span>
              <p className="mt-4 text-[1.1rem] font-bold">{x.t}</p>
              <p className="mt-2 text-[0.92rem] text-ink-2">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------ Conocimiento ------------------------------------ */
export function Knowledge() {
  const library = useDemo((s) => s.library)
  const docs = library.filter((d) => d.visibility === 'publico' && d.status === 'publicado')
  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-[1440px] px-4 pb-10 pt-14 sm:px-6 md:pt-20 lg:px-10">
        <Eyebrow className="mb-4">Conocimiento</Eyebrow>
        <h1 className="display max-w-3xl text-[2.4rem] md:text-[3.6rem]">Guías para decidir con criterio.</h1>
        <p className="mt-5 max-w-xl text-ink-2">Contenido público aprobado por el equipo. La documentación técnica completa está en la biblioteca profesional.</p>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-10">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((d, i) => (
            <li key={d.id}>
              <Link to={`/conocimiento/${d.slug}`} className={`group flex h-full flex-col rounded-[16px] border p-6 transition-colors ${i === 0 ? 'border-night bg-night-2 text-white hover:bg-night-3' : 'border-line bg-surface hover:border-ink-3'}`}>
                <div className="flex items-center justify-between">
                  <span className={`label ${i === 0 ? 'text-fog-3' : 'text-ink-3'}`}>{d.category}</span>
                  <span className={`label flex items-center gap-1 ${i === 0 ? 'text-fog-3' : 'text-ink-3'}`}><Clock size={12} aria-hidden />{d.readingMinutes} min</span>
                </div>
                <p className="mt-10 text-[1.45rem] font-extrabold leading-tight tracking-tight">{d.title}</p>
                <p className={`mt-3 text-[0.92rem] ${i === 0 ? 'text-fog-2' : 'text-ink-2'}`}>{d.description}</p>
                <span className={`mt-auto inline-flex items-center gap-1.5 pt-8 text-[0.86rem] font-bold ${i === 0 ? 'text-green' : 'text-green-ink'}`}>Leer guía <ArrowRight size={15} aria-hidden /></span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.82rem] text-ink-3">Guías redactadas para la previsualización a partir de criterios generales. Se revisarán con el equipo técnico antes de publicarse en la versión definitiva.</p>
      </section>
    </div>
  )
}

export function KnowledgeDetail() {
  const { slug = '' } = useParams()
  const d = useDemo((s) => s.library.find((x) => x.slug === slug))
  const role = useDemo((s) => s.role)
  if (!d) return <NotFound />
  const visible = d.status === 'publicado' && (d.visibility === 'publico' || (d.visibility === 'profesional' && role === 'aprobado') || role === 'deken')
  if (!visible) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="label text-ink-3">Documento no disponible</p>
        <h1 className="h-section mt-3 text-2xl">Esta guía no está publicada para tu acceso</h1>
        <p className="mt-3 text-ink-2">Puede estar en revisión editorial o reservada a profesionales aprobados.</p>
        <div className="mt-6 flex justify-center gap-2"><Button to="/conocimiento" variant="outline">Volver a conocimiento</Button><Button to="/acceso-profesional">Acceso profesional</Button></div>
      </div>
    )
  }
  return (
    <article className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-10">
        <Link to="/conocimiento" className="inline-flex min-h-10 items-center gap-2 text-[0.86rem] font-semibold text-ink-2 hover:text-ink"><ArrowLeft size={16} aria-hidden /> Conocimiento</Link>
      </div>
      <header className="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2"><Badge>{d.category}</Badge><DemoTag>Guía de demostración</DemoTag></div>
        <h1 className="display mt-5 max-w-4xl text-[2.3rem] md:text-[3.4rem]">{d.title}</h1>
        <p className="lede mt-4 max-w-2xl text-[1.05rem] text-ink-2">{d.description}</p>
        <p className="label mt-6 text-ink-3">Versión {d.version} · {d.date} · {d.readingMinutes} min de lectura</p>
      </header>
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-[220px_1fr_280px] lg:px-10">
        <nav aria-label="Índice" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="label mb-3 text-ink-3">Índice</p>
            <ul className="space-y-1.5 border-l border-line">
              {d.sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1 pl-3 text-[0.86rem] text-ink-2 hover:border-green hover:text-ink">{s.title}</a></li>)}
            </ul>
          </div>
        </nav>
        <div className="max-w-[68ch]">
          {d.slug === 'tipos-de-apertura' && (
            <figure className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['practicable', 'oscilobatiente', 'corredera', 'elevadora'].map((k) => (
                <div key={k} className="overflow-hidden rounded-[10px] bg-night">
                  <Poster src={`/renders/${k}.jpg`} alt={`Tipología ${k}`} className="aspect-square w-full object-cover" />
                  <p className="label bg-night-2 px-2 py-1.5 !text-[0.58rem] text-fog-2">{k}</p>
                </div>
              ))}
            </figure>
          )}
          {d.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 border-t border-line py-7 first:border-t-0 first:pt-0">
              <h2 className="text-[1.35rem] font-bold tracking-tight">{s.title}</h2>
              {s.body.length > 2 ? (
                <ul className="mt-3 space-y-2">{s.body.map((b) => <li key={b} className="flex gap-3 text-[1rem] leading-relaxed text-ink-2"><span className="mt-3 h-px w-3 shrink-0 bg-green" aria-hidden />{b}</li>)}</ul>
              ) : s.body.map((b) => <p key={b} className="mt-3 text-[1rem] leading-relaxed text-ink-2">{b}</p>)}
            </section>
          ))}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[14px] bg-night-2 p-5 text-white" data-theme="dark">
            <p className="font-bold">Siguiente paso</p>
            <p className="mt-1 text-[0.88rem] text-fog-2">Explora las tipologías o envía la consulta de tu proyecto.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button to="/soluciones" size="sm">Ver soluciones</Button>
              <Button to="/contacto" size="sm" variant="outline-dark">Consultar proyecto</Button>
            </div>
          </div>
        </aside>
      </div>
    </article>
  )
}

/* ------------------------------------ Contacto ------------------------------------ */
const PROJECT_TYPES = ['Obra nueva', 'Rehabilitación', 'Reforma', 'Promoción residencial', 'Prescripción / estudio técnico', 'Otro']

export function Contact() {
  const [params] = useSearchParams()
  const submit = useDemo((s) => s.submitContact)
  const [sent, setSent] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ name: '', email: '', company: '', city: '', projectType: PROJECT_TYPES[0], message: params.get('asunto') ? `${params.get('asunto')}: ` : '' })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value })
  const contacts = useDemo((s) => s.contacts)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!form.name.trim()) er.name = 'Indica un nombre de contacto.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Introduce un correo válido.'
    if (!form.company.trim()) er.company = 'Indica la empresa.'
    if (!form.city.trim()) er.city = 'Indica la localidad de la obra.'
    if (form.message.trim().length < 10) er.message = 'Cuéntanos algo más del proyecto (mín. 10 caracteres).'
    setErrors(er)
    if (Object.keys(er).length) return
    const id = submit({ name: form.name, company: form.company, city: form.city, projectType: form.projectType, message: form.message })
    setSent(id)
    toast('Consulta registrada en la demo', 'No se ha enviado ningún mensaje real a Deken.')
  }
  const sentRef = sent ? contacts.find((c) => c.id === sent)?.ref : null

  return (
    <div className="bg-paper">
      <section className="mx-auto grid max-w-[1440px] gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:px-10">
        <div>
          <Eyebrow className="mb-4">Contacto profesional</Eyebrow>
          <h1 className="display text-[2.4rem] md:text-[3.4rem]">Cuéntanos tu proyecto.</h1>
          <p className="lede mt-5 max-w-md text-ink-2">Solo lo necesario para una primera revisión. Si eres profesional aprobado, puedes enviar la consulta con la configuración desde tu espacio.</p>
          <div className="mt-10 space-y-6 border-t border-line pt-8">
            <div className="flex gap-4"><Truck className="shrink-0 text-green-ink" aria-hidden /><div><p className="font-bold">Condiciones de suministro</p><p className="mt-1 text-[0.92rem] text-ink-2">Transporte propio habitual en Sevilla capital y provincia. Los pedidos de otras zonas de España se estudian cuando el cliente organiza el transporte; no se ofrece una red nacional de reparto.</p></div></div>
            <div className="flex gap-4"><ScrollText className="shrink-0 text-green-ink" aria-hidden /><div><p className="font-bold">Solo profesionales</p><p className="mt-1 text-[0.92rem] text-ink-2">Fabricación y suministro para constructoras, reformistas, carpinterías, promotoras y estudios técnicos. Sin venta directa a particulares.</p></div></div>
            <Notice tone="neutral" title="Datos de contacto">Los datos de contacto de la web actual deberán verificarse antes de la versión definitiva. En esta demo, el envío queda registrado solo en el navegador.</Notice>
          </div>
        </div>
        <div className="rounded-[18px] border border-line bg-surface p-5 shadow-2 md:p-8">
          {sent ? (
            <div className="py-8 text-center" role="status">
              <CheckCircle2 size={40} className="mx-auto text-green-ink" aria-hidden />
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Consulta registrada (simulación)</h2>
              <p className="mx-auto mt-2 max-w-sm text-ink-2">Referencia de demo <strong className="tnum text-ink">{sentRef}</strong>. No se ha enviado ningún mensaje real a Deken: la consulta aparece en el panel interno de la demostración.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button to="/acceso-profesional">Solicitar acceso profesional</Button>
                <Button to="/conocimiento/preparar-consulta-de-proyecto" variant="outline">Guía: preparar una consulta</Button>
                <Button variant="ghost" onClick={() => { setSent(null); setForm({ ...form, message: '' }) }}>Nueva consulta</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Nombre" required value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
              <TextInput label="Correo electrónico" type="email" required value={form.email} onChange={set('email')} error={errors.email} hint="Solo para la demo; no se guarda en servidores." autoComplete="email" />
              <TextInput label="Empresa" required value={form.company} onChange={set('company')} error={errors.company} autoComplete="organization" />
              <TextInput label="Localidad de la obra" required value={form.city} onChange={set('city')} error={errors.city} />
              <div className="sm:col-span-2"><SelectInput label="Tipo de proyecto" value={form.projectType} onChange={set('projectType')} options={PROJECT_TYPES.map((p) => ({ value: p, label: p }))} /></div>
              <div className="sm:col-span-2"><TextArea label="Mensaje" required value={form.message} onChange={set('message')} error={errors.message} hint="Huecos aproximados, plazos, si dispones de planos…" /></div>
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.8rem] text-ink-3">Envío simulado. Texto legal pendiente de la versión definitiva.</p>
                <Button type="submit" size="lg">Enviar consulta (demo)</Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------ Acceso profesional ------------------------------------ */
const PROFILES = ['Constructora', 'Empresa de reformas', 'Carpintería', 'Promotora', 'Estudio técnico', 'Otro profesional']

export function ProfessionalAccess() {
  const role = useDemo((s) => s.role)
  const submit = useDemo((s) => s.submitAccessRequest)
  const setRole = useDemo((s) => s.setRole)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', city: '', profile: PROFILES[0], message: '' })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value })

  if (role === 'pendiente') {
    return <div className="bg-paper px-4"><PendingStatus /></div>
  }
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!form.name.trim()) er.name = 'Indica tu nombre.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Introduce un correo válido.'
    if (!form.company.trim()) er.company = 'Indica la empresa.'
    if (!form.city.trim()) er.city = 'Indica la localidad.'
    setErrors(er)
    if (Object.keys(er).length) return
    submit({ ...form, name: `${form.name} (demo)` })
    toast('Solicitud registrada (simulación)', 'Ahora estás en modo «Profesional pendiente».')
    window.scrollTo(0, 0)
  }
  return (
    <div className="bg-paper">
      <section className="mx-auto grid max-w-[1440px] gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:px-10">
        <div>
          <Eyebrow className="mb-4">Acceso profesional</Eyebrow>
          <h1 className="display text-[2.4rem] md:text-[3.4rem]">Herramientas para quien construye.</h1>
          <p className="lede mt-5 max-w-md text-ink-2">El equipo Deken revisa cada solicitud. Una vez aprobada, tendrás configurador, comparador, asesor, biblioteca técnica y el seguimiento de tus proyectos, presupuestos y pedidos.</p>
          <ol className="mt-10 space-y-5 border-t border-line pt-8">
            {[['Envías la solicitud', 'Datos básicos de empresa y contacto.'], ['Revisión por Deken', 'Comprobamos que trabajas como profesional del sector.'], ['Acceso aprobado', 'Entras a tu espacio con los datos de tu empresa.']].map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2.2rem_1fr] gap-2"><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-green text-[0.75rem] font-extrabold tnum">{i + 1}</span><div><p className="font-bold">{t}</p><p className="text-[0.9rem] text-ink-2">{d}</p></div></li>
            ))}
          </ol>
          {role === 'aprobado' && <Notice className="mt-8" tone="green" title="Ya estás en modo profesional aprobado">Puedes entrar directamente a tu espacio. <Link className="font-bold underline" to="/profesional">Ir al espacio profesional</Link></Notice>}
        </div>
        <div className="rounded-[18px] border border-line bg-surface p-5 shadow-2 md:p-8">
          <Notice className="mb-6" tone="info">Demostración: la solicitud se guarda solo en este navegador y aparece en el panel Deken para aprobarla. No se crean cuentas reales.</Notice>
          <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Nombre y apellidos" required value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
            <TextInput label="Correo profesional" type="email" required value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
            <TextInput label="Teléfono" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" hint="Opcional" />
            <TextInput label="Empresa" required value={form.company} onChange={set('company')} error={errors.company} autoComplete="organization" />
            <TextInput label="Localidad" required value={form.city} onChange={set('city')} error={errors.city} />
            <SelectInput label="Perfil" value={form.profile} onChange={set('profile')} options={PROFILES.map((p) => ({ value: p, label: p }))} />
            <div className="sm:col-span-2"><TextArea label="¿En qué tipo de proyectos trabajas?" value={form.message} onChange={set('message')} hint="Opcional. Ayuda a revisar la solicitud." /></div>
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={() => setRole('aprobado')} className="text-left text-[0.84rem] font-semibold text-green-ink hover:underline">Ver directamente como profesional aprobado</button>
              <Button type="submit" size="lg">Enviar solicitud (demo)</Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------ Legal ------------------------------------ */
export function Legal() {
  const { doc = '' } = useParams()
  const names: Record<string, string> = { 'aviso-legal': 'Aviso legal', privacidad: 'Política de privacidad', cookies: 'Política de cookies' }
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <Eyebrow className="mb-4">Documentación para la versión definitiva</Eyebrow>
      <h1 className="h-section text-3xl">{names[doc] ?? 'Texto legal'}</h1>
      <p className="mt-4 text-ink-2">Los textos legales no se han aportado. Esta previsualización no presenta textos inventados como documentos legales aprobados. Se incorporarán los textos revisados por Grupo Deken antes de cualquier publicación.</p>
      <p className="mt-3 text-ink-2">La previsualización no usa analítica, píxeles publicitarios ni cookies de terceros. Solo guarda datos ficticios de la demostración en el almacenamiento local del navegador.</p>
      <div className="mt-8"><Button to="/" variant="outline">Volver al inicio</Button></div>
    </div>
  )
}
