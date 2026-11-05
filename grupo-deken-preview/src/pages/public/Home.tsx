import { lazy, Suspense, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight, Box, Columns3, Compass, Library, FolderKanban, Truck } from 'lucide-react'
import { HomeHero, SUPPLY } from './HomeHero'
import { SOLUTIONS } from '@/content/solutions'
import { SERIES_INFO, DOCS } from '@/content/series'
import { MEDIA } from '@/content/media'
import { Button } from '@/ui/Button'
import { OpeningGlyph } from '@/ui/OpeningGlyph'
import { Poster } from '@/ui/Poster'
import { useDemo } from '@/demo/store'
import { AcousticIllustration } from '@/tools/illustrations'
import { prefersReducedMotion } from '@/three/quality'
import { asset } from '@/lib/asset'

gsap.registerPlugin(ScrollTrigger)

const SectionViewer = lazy(() => import('@/tools/SectionViewer'))

const H2 = 'display text-[2.6rem] leading-[1.02] sm:text-[3.8rem] lg:text-[5rem]'
const LEAD = 'mx-auto max-w-[40rem] text-[1.1rem] leading-snug md:text-[1.35rem]'

export default function Home() {
  return (
    <>
      <HomeHero />
      <Statement />
      <FullBleed />
      <Typologies />
      <Finishes />
      <Systems />
      <Inside />
      <Comfort />
      <Process />
      <Tools />
      <Guides />
      <Closing />
    </>
  )
}

function MoreLink({ to, children, dark = false }: { to: string; children: ReactNode; dark?: boolean }) {
  return <Link to={to} className={`inline-flex min-h-11 items-center gap-1 text-[1.05rem] font-semibold hover:underline ${dark ? 'text-green' : 'text-green-ink'}`}>{children}<ChevronRight size={18} aria-hidden /></Link>
}

/* 1 · Declaración: las palabras se iluminan al desplazarse ------------------------------------- */
function Statement() {
  const ref = useRef<HTMLDivElement>(null)
  const text = 'Fabricamos ventanas, puertas y cerramientos de PVC para constructoras, reformistas, promotoras y estudios técnicos. A medida de cada hueco. Con sistemas Schüco. Para Sevilla y provincia.'
  const words = useMemo(() => text.split(' '), [text])
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-w]'))
    if (prefersReducedMotion()) { spans.forEach((s) => (s.style.opacity = '1')); return }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true,
        onUpdate: (self) => {
          const n = spans.length
          spans.forEach((s, i) => { const t = Math.min(1, Math.max(0, self.progress * n * 1.15 - i)); s.style.opacity = String(0.16 + 0.84 * t) })
        },
      })
    }, el)
    return () => ctx.revert()
  }, [])
  return (
    <section className="bg-paper px-5 py-28 md:py-44" data-theme="light">
      <div ref={ref} className="mx-auto max-w-[1100px]">
        <p className="text-[2rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[2.8rem] lg:text-[3.8rem]">
          {words.map((w, i) => <span key={i} data-w style={{ opacity: 0.16, transition: 'opacity 120ms linear' }}>{w} </span>)}
        </p>
        <dl className="mt-20 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
          {SUPPLY.map((s) => (
            <div key={s.k}>
              <dt className="text-[0.95rem] font-semibold text-ink-3">{s.k}</dt>
              <dd className="mt-2 text-[1.15rem] font-bold leading-snug tracking-tight">{s.t}</dd>
              <dd className="mt-1.5 text-[0.92rem] text-ink-2">{s.s}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* 2 · Imagen a sangre (hueco para fotografía real) ---------------------------------------------- */
function FullBleed() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelector('img'), { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
    }, el)
    return () => ctx.revert()
  }, [])
  const m = MEDIA.obra
  return (
    <section ref={ref} className="relative h-[92svh] min-h-[520px] overflow-hidden bg-black text-white" data-theme="dark">
      <img src={asset(m.src)} alt={m.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.15)_0%,transparent_35%,rgb(0_0_0/0.75)_100%)]" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1200px] px-5 pb-14 md:pb-20">
        <h2 className="display max-w-[14ch] text-[2.8rem] leading-[1] sm:text-[4.2rem] lg:text-[5.6rem]">Cada hueco, resuelto a medida.</h2>
        {m.provisional && <p className="label mt-5 !text-[0.58rem] text-white/50">{m.note}</p>}
      </div>
    </section>
  )
}

/* 3 · Tipologías: galería horizontal fijada (escritorio) o deslizable (móvil) --------------------- */
function Typologies() {
  const sec = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  useLayoutEffect(() => {
    if (!sec.current || !track.current || prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const t = track.current!
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth + 80)
      gsap.to(t, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: true, invalidateOnRefresh: true } })
    })
    return () => mm.revert()
  }, [])
  return (
    <section ref={sec} className="overflow-hidden bg-paper py-24 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:pb-0 lg:pt-12" data-theme="light">
      <div className="mx-auto w-full max-w-[1200px] px-5 text-center lg:text-left">
        <h2 className={H2}>Elige cómo se abre.</h2>
        <p className="mt-4 text-[1.1rem] text-ink-2 md:text-[1.3rem]">Seis tipologías. La serie y el vidrio, después.</p>
      </div>
      <ul ref={track} className="thin-scroll mt-12 flex lg:mt-8 snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:w-max lg:snap-none lg:overflow-visible lg:px-[max(1.25rem,calc((100vw-1200px)/2+1.25rem))] lg:pb-0">
        {SOLUTIONS.map((s) => (
          <li key={s.slug} className="w-[80vw] shrink-0 snap-center sm:w-[56vw] lg:w-[34vw] lg:max-w-[520px]">
            <Link to={`/soluciones/${s.slug}`} className="glyph-host group block overflow-hidden rounded-[28px] bg-black text-white">
              <div className="relative aspect-[4/5] lg:aspect-auto lg:h-[54svh]">
                <Poster src={s.poster} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.55)_0%,transparent_30%,transparent_60%,rgb(0_0_0/0.7)_100%)]" aria-hidden />
                <div className="absolute inset-x-0 top-0 p-6">
                  <p className="text-[0.9rem] font-semibold text-green">{s.status === 'demo-3d' ? 'Demostración 3D' : 'Ficha visual'}</p>
                  <p className="mt-1 text-[1.9rem] font-extrabold leading-tight tracking-tight">{s.name}</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <p className="max-w-[16rem] text-[0.95rem] text-white/80">{s.short}</p>
                  <span className="shrink-0 rounded-[10px] border border-white/20 bg-black/40 p-2 backdrop-blur" aria-hidden><OpeningGlyph slug={s.slug} className="h-9 w-auto" /></span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-8 w-full max-w-[1200px] px-5 text-center lg:mt-6 lg:text-left"><MoreLink to="/soluciones">Ver todas las soluciones</MoreLink></div>
    </section>
  )
}

/* 4 · Acabados: tres capas que se funden con el desplazamiento ----------------------------------- */
function Finishes() {
  const ref = useRef<HTMLDivElement>(null)
  const items = [
    { k: 'Blanco.', src: '/renders/acabado-blanco.jpg' },
    { k: 'Antracita.', src: '/renders/acabado-antracita.jpg' },
    { k: 'Madera.', src: '/renders/acabado-madera.jpg' },
  ]
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-layer]'))
    const words = Array.from(el.querySelectorAll<HTMLElement>('[data-word]'))
    const paint = (p: number) => {
      const f = p * (items.length - 1)
      const sm = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t) }
      // Cada capa entra por encima de la anterior (la de abajo sigue opaca): sin oscurecer a mitad de fundido
      layers.forEach((l, i) => { l.style.opacity = String(i === 0 ? 1 : sm((f - (i - 1) - 0.35) / 0.3)) })
      words.forEach((w, i) => { const o = Math.max(0, Math.min(1, 1 - (Math.abs(f - i) - 0.22) * 3.2)); w.style.opacity = String(o); w.style.transform = `translate3d(0, ${(i - f) * 36}px, 0)` })
    }
    if (prefersReducedMotion()) { paint(0); return }
    paint(0)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: el, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (s) => paint(s.progress) })
    }, el)
    return () => ctx.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <section ref={ref} className="relative h-[300svh] bg-black text-white" data-theme="dark">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {items.map((it, i) => (
          <div key={it.k} data-layer className="absolute inset-x-0 bottom-0 top-[26%] [mask-image:linear-gradient(180deg,transparent_0%,black_18%)] md:top-[24%]" style={{ opacity: i === 0 ? 1 : 0 }}>
            <Poster src={it.src} alt={`Ventana de demostración en acabado ${it.k.toLowerCase().replace('.', '')}`} className="h-full w-full object-cover md:mx-auto md:w-auto md:max-w-none md:[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_50%,transparent_100%)]" />
          </div>
        ))}
        <div className="absolute inset-x-0 top-[10%] px-5 text-center md:top-[9%]">
          <p className="text-[1.05rem] font-semibold text-fog-2 md:text-[1.3rem]">Interior y exterior, cada cara con su acabado.</p>
          <div className="relative mx-auto mt-3 h-[4.2rem] sm:h-[5.4rem] lg:h-[7rem]">
            {items.map((it, i) => <p key={it.k} data-word aria-hidden={i > 0} className="display absolute inset-x-0 text-[3.6rem] sm:text-[4.8rem] lg:text-[6.4rem]" style={{ opacity: i === 0 ? 1 : 0 }}>{it.k}</p>)}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-10 px-5 text-center">
          <p className="label !text-[0.58rem] text-white/45">Muestras visuales de demostración · el color definitivo se elige con muestra física</p>
        </div>
      </div>
    </section>
  )
}

/* 5 · Confort ------------------------------------------------------------------------------------ */
function Systems() {
  return (
    <section className="bg-paper py-28 md:py-40" data-theme="light">
      <div className="mx-auto max-w-[1200px] px-5 text-center">
        <h2 className={H2}>Cinco sistemas.<br /><span className="text-ink-3">Una fábrica.</span></h2>
        <p className={`${LEAD} mt-6 text-ink-2`}>Perfiles Schüco de PVC fabricados a medida en Sevilla. Cada cifra sale de la documentación técnica del fabricante.</p>
      </div>
      <ul className="thin-scroll mt-16 flex snap-x snap-mandatory gap-px overflow-x-auto px-5 lg:mx-auto lg:grid lg:max-w-[1200px] lg:grid-cols-5 lg:overflow-visible lg:px-5">
        {SERIES_INFO.map((s) => {
          const depth = s.hero[0]
          const rest = s.hero.slice(1, 4)
          return (
            <li key={s.slug} className="w-[70vw] shrink-0 snap-center border-line px-5 text-center sm:w-[40vw] lg:w-auto lg:border-l lg:first:border-l-0">
              <Link to={`/series/${s.slug}`} className="group block">
                <p className="text-[1.25rem] font-extrabold tracking-tight">{s.name.replace('Schüco ', '')}</p>
                <p className="mt-1 min-h-[3.2em] text-[0.86rem] leading-[1.6em] text-ink-2">{s.tagline}</p>
                <p className="mt-8 text-[2.8rem] font-extrabold leading-none tracking-[-0.04em] text-ink"><span className="tnum">{depth.value.split(' / ')[0]}</span><span className="ml-1 text-[0.36em] font-bold tracking-normal text-ink-2">{depth.unit}</span></p>
                <p className="mt-2 text-[0.78rem] text-ink-3">{depth.label}</p>
                <dl className="mt-8 space-y-5">
                  {rest.map((h) => (
                    <div key={h.label} className="flex flex-col-reverse">
                      <dt className="mt-1 text-[0.76rem] text-ink-3">{h.label}</dt>
                      <dd className="text-[1.25rem] font-bold leading-none tracking-tight"><span className="tnum">{h.value}</span>{h.unit && <span className="ml-1 text-[0.6em] text-ink-2">{h.unit}</span>}</dd>
                    </div>
                  ))}
                </dl>
                <span className="mt-8 inline-flex items-center gap-1 text-[0.9rem] font-semibold text-green-ink group-hover:underline">Ver la serie <ChevronRight size={16} aria-hidden /></span>
              </Link>
            </li>
          )
        })}
      </ul>
      <p className="mx-auto mt-12 max-w-[46rem] px-5 text-center text-[0.76rem] text-ink-3">Valores del fabricante para la configuración ensayada ({Object.values(DOCS).filter((d) => d.kind !== 'web Deken').length} folletos y catálogos Schüco; las elevadoras, según la web actual de Deken). Uw depende del vidrio y de la medida de cada ventana.</p>
      <div className="mt-8 text-center"><MoreLink to="/series">Comparar las series</MoreLink></div>
    </section>
  )
}

function Inside() {
  return (
    <section className="dark-scene bg-black pt-28 text-white md:pt-40" data-theme="dark">
      <div className="mx-auto max-w-[1200px] px-5 text-center">
        <p className="label text-green">Sección real · Schüco LivIng</p>
        <h2 className={`${H2} mt-5`}>82 milímetros.<br /><span className="text-fog-3">Ni uno de relleno.</span></h2>
        <p className={`${LEAD} mt-6 text-fog-2`}>Este corte sale del plano DXF del perfil: cámaras, refuerzo de acero, juntas, junquillo y triple vidrio en su posición exacta. Gíralo y sepáralo.</p>
      </div>
      <Suspense fallback={<div className="h-[78svh] min-h-[520px]" />}>
        <SectionViewer className="mx-auto mt-6 h-[78svh] min-h-[520px] max-w-[1400px]" />
      </Suspense>
      <p className="label pb-16 text-center !text-[0.58rem] text-white/45">Geometría de la sección: plano DXF de Deken · el vidrio intermedio se representa simplificado</p>
    </section>
  )
}

function Comfort() {
  return (
    <section className="bg-black px-5 py-28 text-center text-white md:py-40" data-theme="dark">
      <h2 className={H2}>Confort,<br /><span className="text-fog-3">de dentro afuera.</span></h2>
      <p className={`${LEAD} mt-6 text-fog-2`}>Perfil, vidrio, juntas y herraje trabajan juntos. Con vidrio acústico, los folletos Schüco recogen hasta:</p>
      <dl className="mx-auto mt-12 grid max-w-[900px] grid-cols-3 gap-4">
        {[['49', 'CT 70 Classic'], ['48', 'FocusIng'], ['47', 'LivIng Classic']].map(([v, n]) => (
          <div key={n} className="flex flex-col-reverse"><dt className="mt-2 text-[0.84rem] text-fog-3">{n}</dt><dd className="text-[2.6rem] font-extrabold leading-none tracking-[-0.04em] md:text-[4.4rem]"><span className="tnum">{v}</span><span className="ml-1 text-[0.36em] font-bold tracking-normal text-fog-2">dB</span></dd></div>
        ))}
      </dl>
      <div className="mx-auto mt-14 max-w-[900px] overflow-hidden rounded-[28px] border border-white/10">
        <AcousticIllustration closed={false} animated />
      </div>
      <p className="label mt-4 !text-[0.58rem] text-white/45">Ilustración explicativa · cifras: folletos Schüco CT 70 Classic (p. 7), FocusIng (p. 15) y LivIng Classic (p. 5)</p>
      <div className="mt-8"><MoreLink to="/profesional/demostraciones" dark>Ver las demostraciones</MoreLink></div>
    </section>
  )
}

/* 6 · Proceso ------------------------------------------------------------------------------------ */
function Process() {
  const steps = [
    ['Consulta', 'Localidad, huecos, planos o medidas.'],
    ['Revisión técnica', 'Tipologías, medidas y documentación.'],
    ['Presupuesto', 'Versiones con los cambios explicados.'],
    ['Fabricación', 'Con el estado del pedido a la vista.'],
    ['Suministro', 'Transporte propio en Sevilla y provincia.'],
  ]
  return (
    <section className="bg-paper py-28 md:py-40" data-theme="light">
      <div className="mx-auto max-w-[1200px] px-5 text-center">
        <h2 className={H2}>De la consulta<br />a la obra.</h2>
        <p className={`${LEAD} mt-6 text-ink-2`}>Cinco pasos. Cada uno, visible en tu espacio profesional.</p>
      </div>
      <ol className="thin-scroll mx-auto mt-16 flex max-w-[1200px] snap-x gap-4 overflow-x-auto px-5 pb-4 md:grid md:grid-cols-5 md:overflow-visible">
        {steps.map(([t, d], i) => (
          <li key={t} className="w-[62vw] shrink-0 snap-start rounded-[24px] bg-surface p-6 shadow-1 sm:w-[40vw] md:w-auto">
            <p className="tnum text-[3.4rem] font-extrabold leading-none tracking-tight text-green-ink">{i + 1}</p>
            <p className="mt-6 text-[1.15rem] font-bold tracking-tight">{t}</p>
            <p className="mt-1.5 text-[0.92rem] text-ink-2">{d}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 text-center"><MoreLink to="/fabricacion">Cómo fabricamos</MoreLink></div>
    </section>
  )
}

/* 7 · Herramientas: la maqueta se endereza al desplazarse ---------------------------------------- */
function Tools() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelector('[data-device]'), { rotateX: 24, scale: 0.88, y: 40 }, { rotateX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'center 55%', scrub: true } })
    }, el)
    return () => ctx.revert()
  }, [])
  const tools = [
    { icon: <Box size={20} />, t: 'Configurador 3D' }, { icon: <Columns3 size={20} />, t: 'Comparador' }, { icon: <Compass size={20} />, t: 'Asesor guiado' },
    { icon: <Library size={20} />, t: 'Biblioteca y asistente' }, { icon: <FolderKanban size={20} />, t: 'Proyectos y presupuestos' }, { icon: <Truck size={20} />, t: 'Pedidos y entrega' },
  ]
  return (
    <section ref={ref} className="overflow-hidden bg-black px-5 py-28 text-white md:py-40" data-theme="dark">
      <div className="mx-auto max-w-[1100px] text-center">
        <p className="text-[1.05rem] font-semibold text-green md:text-[1.2rem]">Espacio profesional</p>
        <h2 className={`${H2} mt-3`}>Todo tu proyecto.<br /><span className="text-fog-3">En un solo lugar.</span></h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Button to="/acceso-profesional" className="!rounded-full !px-6">Solicitar acceso profesional</Button>
          <MoreLink to="/profesional" dark>Ver la demo</MoreLink>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-[1000px] [perspective:1400px]" aria-hidden>
        <div data-device className="origin-bottom overflow-hidden rounded-[22px] border border-white/12 bg-night-2 shadow-[0_60px_120px_-40px_rgb(118_184_42/0.25)]">
          <div className="flex items-center gap-1.5 border-b border-white/8 px-4 py-3"><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="label ml-3 !text-[0.58rem] text-fog-3">Configurador · CFG-0142-B</span></div>
          <div className="grid sm:grid-cols-[1.5fr_1fr]">
            <Poster src="/renders/balconera.jpg" alt="" className="h-full min-h-[280px] w-full object-cover" />
            <div className="hidden space-y-4 bg-paper p-5 text-ink sm:block">
              <div><p className="label !text-[0.56rem] text-ink-3">Tipología</p><p className="mt-1 text-[0.9rem] font-bold">Balconera · 2 hojas</p></div>
              <div><p className="label !text-[0.56rem] text-ink-3">Acabado</p><div className="mt-1.5 flex gap-1.5"><span className="h-6 w-6 rounded-full border-2 border-green bg-[#efeeea]" /><span className="h-6 w-6 rounded-full border border-line-2 bg-[#3b4146]" /><span className="h-6 w-6 rounded-full border border-line-2 bg-[#946840]" /></div></div>
              <div><p className="label !text-[0.56rem] text-ink-3">Medidas introducidas</p><p className="tnum mt-1 text-[0.9rem] font-semibold">1400 × 2200 mm</p></div>
              <div className="rounded-full bg-green px-3 py-2 text-center text-[0.8rem] font-bold text-night">Solicitar presupuesto</div>
              <p className="text-[0.7rem] text-ink-3">Sin precio automático. Revisión por Deken.</p>
            </div>
          </div>
        </div>
      </div>
      <ul className="mx-auto mt-16 grid max-w-[1000px] grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
        {tools.map((t) => <li key={t.t} className="flex flex-col items-center gap-3 text-center"><span className="text-green" aria-hidden>{t.icon}</span><span className="text-[1rem] font-semibold">{t.t}</span></li>)}
      </ul>
    </section>
  )
}

/* 8 · Guías -------------------------------------------------------------------------------------- */
function Guides() {
  const library = useDemo((s) => s.library)
  const guides = library.filter((d) => d.kind === 'guia' && d.visibility === 'publico' && d.status === 'publicado')
  return (
    <section className="bg-paper py-28 md:py-36" data-theme="light">
      <div className="mx-auto max-w-[1100px] px-5">
        <h2 className={`${H2} text-center`}>Antes de pedir<br />presupuesto.</h2>
        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {guides.slice(0, 3).map((g) => (
            <li key={g.id}>
              <Link to={`/conocimiento/${g.slug}`} className="group flex h-full flex-col rounded-[24px] bg-surface p-7 shadow-1 transition-shadow hover:shadow-2">
                <p className="text-[0.85rem] font-semibold text-ink-3">{g.category} · {g.readingMinutes} min</p>
                <p className="mt-6 text-[1.4rem] font-extrabold leading-tight tracking-tight">{g.title}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-8 font-semibold text-green-ink">Leer <ChevronRight size={16} aria-hidden /></span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center"><MoreLink to="/conocimiento">Todas las guías</MoreLink></div>
      </div>
    </section>
  )
}

/* 9 · Cierre ------------------------------------------------------------------------------------- */
function Closing() {
  return (
    <section className="relative overflow-hidden bg-black px-5 py-32 text-center text-white md:py-48" data-theme="dark">
      <Poster src="/renders/cierre.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="relative">
        <h2 className={H2}>Hablemos de<br />tu próxima obra.</h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Button to="/acceso-profesional" className="!rounded-full !px-6">Solicitar acceso profesional</Button>
          <MoreLink to="/contacto" dark>Consultar un proyecto</MoreLink>
        </div>
      </div>
    </section>
  )
}
