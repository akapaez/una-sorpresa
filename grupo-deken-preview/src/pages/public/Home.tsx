import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, Box, Columns3, Compass, Library, FolderKanban, Truck } from 'lucide-react'
import { HomeHero, SUPPLY } from './HomeHero'
import { SOLUTIONS } from '@/content/solutions'
import { Button } from '@/ui/Button'
import { Eyebrow } from '@/ui/primitives'
import { OpeningGlyph } from '@/ui/OpeningGlyph'
import { CompareSlider } from '@/ui/CompareSlider'
import { Poster } from '@/ui/Poster'
import { useDemo } from '@/demo/store'
import { AcousticIllustration } from '@/tools/illustrations'

export default function Home() {
  return (
    <>
      <HomeHero />
      <SupplySection />
      <TypologiesSection />
      <MaterialSection />
      <ComfortSection />
      <GuidedSection />
      <ProcessSection />
      <ToolsSection />
      <GuidesSection />
      <ClosingSection />
    </>
  )
}

function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>
}

/** En escritorio estos datos ya aparecen dentro del panel de transición de la portada. */
function SupplySection() {
  const items = SUPPLY
  return (
    <section className="border-t border-line bg-paper py-16 md:hidden" data-theme="light">
      <Container>
        <ol className="grid gap-0 md:grid-cols-3">
          {items.map((it, i) => (
            <li key={it.k} className={`border-line py-8 md:px-8 md:py-2 ${i > 0 ? 'border-t md:border-l md:border-t-0' : ''} ${i === 0 ? 'md:pl-0' : ''}`}>
              <p className="label tnum text-ink-3">{String(i + 1).padStart(2, '0')} · {it.k}</p>
              <p className="mt-4 text-[1.3rem] font-bold leading-snug tracking-tight md:text-[1.45rem]">{it.t}</p>
              <p className="mt-3 text-[0.92rem] text-ink-2">{it.s}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

function TypologiesSection() {
  return (
    <section className="bg-paper pb-20 pt-10 md:pb-28 md:pt-20" data-theme="light">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow className="mb-4">Tipologías</Eyebrow>
            <h2 className="h-section max-w-2xl text-[2rem] md:text-[2.8rem]">Cada hueco pide un movimiento distinto.</h2>
          </div>
          <p className="max-w-sm text-[0.95rem] text-ink-2">Pasa el cursor o enfoca cada tipología para ver cómo abre. La serie y el vidrio se eligen después, para cada proyecto.</p>
        </div>
        <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-6 md:gap-3 md:overflow-visible md:px-0 md:pb-0 thin-scroll">
          {SOLUTIONS.map((s, i) => (
            <li key={s.slug} className={`w-[74vw] shrink-0 snap-start sm:w-[46vw] md:w-auto ${i < 2 ? 'md:col-span-3 lg:col-span-2' : 'md:col-span-2'} ${i === 0 ? 'lg:col-span-2' : ''}`}>
              <Link to={`/soluciones/${s.slug}`} className="glyph-host group relative block aspect-[4/5] overflow-hidden rounded-[14px] bg-night text-white md:aspect-[5/6]">
                <Poster src={s.poster} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(13_14_15/0.92)_100%)]" aria-hidden />
                <div className="absolute left-4 top-4 rounded-[8px] border border-white/15 bg-night/60 p-2 text-white backdrop-blur" aria-hidden>
                  <OpeningGlyph slug={s.slug} className="h-10 w-auto" />
                </div>
                {s.status === 'ficha-visual' && <span className="label absolute right-4 top-4 rounded-[4px] bg-night/70 px-2 py-1 !text-[0.6rem] text-fog-2">Ficha visual</span>}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[1.25rem] font-extrabold tracking-tight">{s.name}</p>
                  <p className="mt-1 text-[0.86rem] text-fog-2">{s.short}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-green">Ver ficha <ArrowRight size={14} aria-hidden /></p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function MaterialSection() {
  return (
    <section className="dark-scene grain relative overflow-hidden py-20 md:py-28" data-theme="dark">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow dark className="mb-4">Material, vidrio y acabado</Eyebrow>
            <h2 className="h-section text-[2rem] md:text-[2.8rem]">Compara sobre el mismo producto.</h2>
            <p className="lede mt-5 max-w-md text-[1rem] leading-relaxed text-fog-2">Desliza para pasar de un acabado a otro con la misma luz y el mismo encuadre. Las muestras son visuales: el color definitivo se decide con muestra física.</p>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
              <div><dt className="label text-fog-3">Perfil</dt><dd className="mt-2 text-[0.92rem] text-fog-2">Marco fijo y hoja con solape interior, cantos suavizados.</dd></div>
              <div><dt className="label text-fog-3">Junta</dt><dd className="mt-2 text-[0.92rem] text-fog-2">Perimetral en marco y a ambos lados del vidrio.</dd></div>
              <div><dt className="label text-fog-3">Vidrio</dt><dd className="mt-2 text-[0.92rem] text-fog-2">Doble o triple en la representación; composición real según proyecto.</dd></div>
              <div><dt className="label text-fog-3">Acabado</dt><dd className="mt-2 text-[0.92rem] text-fog-2">Interior y exterior pueden ser distintos.</dd></div>
            </dl>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
            <CompareSlider a="/renders/detalle-blanco.jpg" b="/renders/detalle-antracita.jpg" labelA="Blanco" labelB="Antracita" alt="Detalle de esquina de hoja y manilla" className="aspect-[4/5] rounded-[14px] sm:row-span-2 sm:aspect-auto sm:min-h-[520px]" />
            <figure className="relative overflow-hidden rounded-[14px] bg-night-2">
              <Poster src="/renders/detalle-madera.jpg" alt="Detalle de acabado madera de demostración" className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:h-[254px]" />
              <figcaption className="label absolute bottom-3 left-3 rounded-[4px] bg-night/75 px-2 py-1 !text-[0.6rem] text-white">Madera · textura de demo</figcaption>
            </figure>
            <figure className="relative overflow-hidden rounded-[14px] bg-night-2">
              <Poster src="/renders/vidrio-privacidad.jpg" alt="Vidrio de privacidad en la representación" className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:h-[254px]" />
              <figcaption className="label absolute bottom-3 left-3 rounded-[4px] bg-night/75 px-2 py-1 !text-[0.6rem] text-white">Vidrio privacidad · muestra</figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  )
}

function ComfortSection() {
  return (
    <section className="bg-paper py-20 md:py-28" data-theme="light">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-[16px] border border-line bg-surface p-4 shadow-2 md:p-6">
              <AcousticIllustration closed={false} animated />
              <p className="label mt-3 !text-[0.6rem] text-ink-3">Explicación ilustrativa · no representa un ensayo ni una cifra de aislamiento</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Eyebrow className="mb-4">Confort y aislamiento</Eyebrow>
            <h2 className="h-section text-[2rem] md:text-[2.8rem]">Entender antes de elegir.</h2>
            <p className="lede mt-5 max-w-lg text-[1rem] leading-relaxed text-ink-2">
              El comportamiento acústico y térmico depende del conjunto: perfil, vidrio, juntas, herraje y cómo se integra la ventana en la obra. Por eso explicamos los conceptos de forma visual y dejamos las cifras para la documentación técnica de cada configuración.
            </p>
            <ul className="mt-7 space-y-3 text-[0.95rem]">
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-4 shrink-0 bg-green" aria-hidden />Uf (marco), Ug (vidrio) y Uw (ventana) son valores distintos y no se mezclan.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-4 shrink-0 bg-green" aria-hidden />Un dato de catálogo corresponde a una configuración concreta.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-4 shrink-0 bg-green" aria-hidden />Las demostraciones interactivas están en el espacio profesional.</li>
            </ul>
            <div className="mt-8"><Button to="/profesional/demostraciones" variant="dark" iconRight={<ArrowRight size={17} aria-hidden />}>Ver demostraciones</Button></div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function GuidedSection() {
  const steps = [
    ['Proyecto', '¿Obra nueva, rehabilitación o reforma? ¿Qué estancia?'],
    ['Espacio', '¿Hay espacio libre delante del hueco para abrir?'],
    ['Prioridades', 'Ruido exterior, comportamiento térmico, paso o diseño.'],
    ['Acabado', 'Interior y exterior, con muestra física antes de decidir.'],
    ['Documentación', 'Planos, medidas o fotos para la revisión técnica.'],
  ]
  return (
    <section className="border-t border-line bg-paper-2 py-20 md:py-28" data-theme="light">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow className="mb-4">Selección guiada</Eyebrow>
            <h2 className="h-section text-[2rem] md:text-[2.8rem]">Cinco preguntas antes de la primera propuesta.</h2>
            <p className="lede mt-5 max-w-md text-[1rem] leading-relaxed text-ink-2">El asesor guiado del espacio profesional recorre estas preguntas y devuelve una orientación explicada, con lo que Deken debe revisar después. No sustituye la revisión técnica.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/profesional/asesor" iconRight={<ArrowRight size={17} aria-hidden />}>Abrir el asesor</Button>
              <Button to="/conocimiento/tipos-de-apertura" variant="outline">Guía de aperturas</Button>
            </div>
          </div>
          <ol className="relative">
            {steps.map(([t, d], i) => (
              <li key={t} className="group relative grid grid-cols-[3.5rem_1fr] gap-4 border-b border-line py-7 last:border-b-0">
                <span className="tnum text-[2.4rem] font-extrabold leading-none tracking-tight text-line-2 transition-colors group-hover:text-green-ink">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="text-[1.25rem] font-bold tracking-tight">{t}</p>
                  <p className="mt-1 text-[0.95rem] text-ink-2">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}

function ProcessSection() {
  const steps = [
    ['Consulta', 'Nos envías el proyecto: localidad, huecos, planos o medidas.'],
    ['Revisión técnica', 'Revisamos tipologías, medidas y documentación.'],
    ['Presupuesto', 'Propuesta con versiones y cambios explicados.'],
    ['Fabricación', 'Fabricación propia, con el estado del pedido visible en tu espacio.'],
    ['Suministro', 'Entrega con transporte propio en Sevilla y provincia.'],
  ]
  return (
    <section className="bg-paper py-20 md:py-28" data-theme="light">
      <Container>
        <Eyebrow className="mb-4">Forma de trabajar</Eyebrow>
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="h-section max-w-2xl text-[2rem] md:text-[2.8rem]">De la consulta a la obra, con cada paso a la vista.</h2>
          <Button to="/fabricacion" variant="outline" iconRight={<ArrowRight size={16} aria-hidden />}>Cómo fabricamos</Button>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line md:grid-cols-5">
          {steps.map(([t, d], i) => (
            <li key={t} className="relative bg-surface p-6 md:min-h-[240px]">
              <div className="mb-8 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-green text-[0.8rem] font-extrabold text-ink tnum">{i + 1}</span>
                {i < steps.length - 1 && <span className="hidden h-px flex-1 bg-line-2 md:block" aria-hidden />}
              </div>
              <p className="text-[1.1rem] font-bold tracking-tight">{t}</p>
              <p className="mt-2 text-[0.9rem] text-ink-2">{d}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

function ToolsSection() {
  const tools = [
    { icon: <Box size={18} />, t: 'Configurador 3D', d: 'Tipología, hojas, acabados, vidrio y vistas. Guarda y descarga un resumen PDF.' },
    { icon: <Columns3 size={18} />, t: 'Comparador', d: 'Categorías homogéneas y diferencias resaltadas, solo con datos con fuente.' },
    { icon: <Compass size={18} />, t: 'Asesor guiado', d: 'Orientación explicada que continúa hacia comparar o configurar.' },
    { icon: <Library size={18} />, t: 'Biblioteca y asistente', d: 'Documentación filtrable y preguntas con fuentes consultables.' },
    { icon: <FolderKanban size={18} />, t: 'Proyectos y presupuestos', d: 'Planos, conversaciones y versiones sin perder el historial.' },
    { icon: <Truck size={18} />, t: 'Pedidos y entrega', d: 'Estado de fabricación, previsión y documentos asociados.' },
  ]
  return (
    <section className="dark-scene grain relative overflow-hidden py-20 md:py-28" data-theme="dark">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <Eyebrow dark className="mb-4">Espacio profesional</Eyebrow>
            <h2 className="h-section text-[2rem] md:text-[2.8rem]">Herramientas para trabajar el proyecto, no solo para verlo.</h2>
            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {tools.map((t) => (
                <li key={t.t} className="flex gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border border-white/12 text-green" aria-hidden>{t.icon}</span>
                  <div><p className="font-bold">{t.t}</p><p className="mt-1 text-[0.88rem] text-fog-2">{t.d}</p></div>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button to="/acceso-profesional" size="lg" iconRight={<ArrowUpRight size={17} aria-hidden />}>Solicitar acceso profesional</Button>
            </div>
            <p className="mt-4 text-[0.82rem] text-fog-3">Acceso para profesionales aprobados por Deken.</p>
          </div>
          <ToolPreview />
        </div>
      </Container>
    </section>
  )
}

/** Vista previa compuesta con componentes reales de la interfaz (no captura de terceros). */
function ToolPreview() {
  return (
    <div className="relative" aria-hidden>
      <div className="overflow-hidden rounded-[16px] border border-white/12 bg-night-2 shadow-3">
        <div className="flex items-center gap-1.5 border-b border-white/8 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="label ml-3 !text-[0.6rem] text-fog-3">Configurador · CFG-0142-B</span>
        </div>
        <div className="grid grid-cols-[1.5fr_1fr]">
          <Poster src="/renders/balconera.jpg" alt="" className="h-full min-h-[320px] w-full object-cover" />
          <div className="space-y-4 bg-paper p-4 text-ink">
            <div><p className="label !text-[0.58rem] text-ink-3">Tipología</p><p className="mt-1 text-[0.86rem] font-bold">Balconera · 2 hojas</p></div>
            <div><p className="label !text-[0.58rem] text-ink-3">Acabado</p>
              <div className="mt-1.5 flex gap-1.5"><span className="h-6 w-6 rounded-full border border-line-2 bg-[#efeeea]" /><span className="h-6 w-6 rounded-full border-2 border-green bg-[#3b4146]" /><span className="h-6 w-6 rounded-full border border-line-2 bg-[#946840]" /></div>
            </div>
            <div><p className="label !text-[0.58rem] text-ink-3">Medidas introducidas</p><p className="tnum mt-1 text-[0.86rem] font-semibold">1400 × 2200 mm</p></div>
            <div className="rounded-[8px] bg-green px-3 py-2 text-center text-[0.78rem] font-bold text-night">Solicitar presupuesto</div>
            <p className="text-[0.68rem] text-ink-3">Sin precio automático. Revisión por Deken.</p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 hidden w-[58%] rounded-[12px] border border-line bg-surface p-4 text-ink shadow-3 md:block">
        <p className="label !text-[0.58rem] text-ink-3">Pedido PED-2026-031</p>
        <p className="mt-1 text-[0.9rem] font-bold">En fabricación</p>
        <div className="mt-3 flex gap-1">{[1, 1, 1, 0, 0].map((x, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${x ? 'bg-green' : 'bg-line'}`} />)}</div>
        <p className="mt-2 text-[0.72rem] text-ink-2">Previsión: semana del 16/11 · por confirmar</p>
      </div>
    </div>
  )
}

function GuidesSection() {
  const library = useDemo((s) => s.library)
  const guides = library.filter((d) => d.kind === 'guia' && d.visibility === 'publico' && d.status === 'publicado')
  return (
    <section className="bg-paper py-20 md:py-28" data-theme="light">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow className="mb-4">Conocimiento</Eyebrow>
            <h2 className="h-section text-[2rem] md:text-[2.8rem]">Guías útiles antes de pedir presupuesto.</h2>
          </div>
          <Button to="/conocimiento" variant="outline" iconRight={<ArrowRight size={16} aria-hidden />}>Todas las guías</Button>
        </div>
        <ul className="border-t border-ink">
          {guides.map((g, i) => (
            <li key={g.id} className="border-b border-line">
              <Link to={`/conocimiento/${g.slug}`} className="group grid items-baseline gap-2 py-7 md:grid-cols-[5rem_1.2fr_1fr_auto] md:gap-8">
                <span className="label tnum text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[1.35rem] font-bold leading-snug tracking-tight transition-colors group-hover:text-green-ink md:text-[1.6rem]">{g.title}</span>
                <span className="text-[0.92rem] text-ink-2">{g.description}</span>
                <span className="label hidden whitespace-nowrap text-ink-3 md:block">{g.readingMinutes} min →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function ClosingSection() {
  return (
    <section className="bg-paper pb-24" data-theme="light">
      <Container>
        <div className="relative overflow-hidden rounded-[20px] bg-night-2 px-6 py-14 text-white md:px-14 md:py-20" data-theme="dark">
          <Poster src="/renders/cierre.jpg" alt="" className="absolute inset-y-0 right-0 hidden h-full w-[55%] object-cover opacity-80 md:block [mask-image:linear-gradient(90deg,transparent,black_40%)]" />
          <div className="relative max-w-xl">
            <Eyebrow dark className="mb-4">Tu próximo proyecto</Eyebrow>
            <h2 className="display text-[2.1rem] md:text-[3.2rem]">¿Tienes una obra en marcha?</h2>
            <p className="lede mt-4 text-[1rem] text-fog-2">Solicita acceso profesional para configurar y seguir tus proyectos, o envíanos una consulta con los datos básicos.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/acceso-profesional" size="lg">Solicitar acceso profesional</Button>
              <Button to="/contacto" size="lg" variant="outline-dark">Consultar un proyecto</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
