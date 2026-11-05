import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight, DoorOpen, Layers, RotateCcw } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/ui/Button'
import { detectQuality, prefersReducedMotion } from '@/three/quality'
import { DESKTOP, MOBILE, TEXT_RANGES, ramp, sceneAt, upDown } from '@/three/story'
import type { HeroManual } from '@/three/HeroScene'
import { asset } from '@/lib/asset'

gsap.registerPlugin(ScrollTrigger)

const Viewer = lazy(() => import('@/three/Viewer').then((m) => ({ default: m.Viewer })))
const HeroScene = lazy(() => import('@/three/HeroScene').then((m) => ({ default: m.HeroScene })))

function useIsMobile() {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < 820)
  useEffect(() => {
    const on = () => setM(window.innerWidth < 820)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return m
}

function Poster({ mobile }: { mobile: boolean }) {
  const [ok, setOk] = useState(true)
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_62%,#2a3033_0%,#121415_45%,#000_80%)]">
      {ok && <img src={asset(mobile ? '/renders/hero-mobile.jpg' : '/renders/hero-desktop.jpg')} alt="" className="h-full w-full object-cover" onError={() => setOk(false)} fetchPriority="high" />}
    </div>
  )
}

/** Texto guiado por el desplazamiento: su opacidad la escribe el progreso del scroll. */
function ScrollText({ id, register, reduced, live, className = '', children }: {
  id: string; register: (id: string, el: HTMLElement | null) => void; reduced: boolean; live?: boolean; className?: string; children: ReactNode
}) {
  const visibleStatic = id === 'intro'
  return (
    <div
      ref={(el) => register(id, el)}
      className={`absolute inset-x-0 will-change-transform ${className}`}
      style={reduced ? { opacity: visibleStatic ? 1 : 0, visibility: visibleStatic ? 'visible' : 'hidden' } : undefined}
      aria-hidden={reduced ? !visibleStatic : !live}
      inert={reduced ? !visibleStatic : !live}
    >
      {children}
    </div>
  )
}

/**
 * Portada de producto: la sección se fija y el desplazamiento conduce la escena.
 * GSAP solo fija la sección y escribe el progreso; cámara y ventana se interpolan en R3F;
 * la opacidad de cada texto se escribe directamente según el progreso (sin re-render).
 */
export function HomeHero() {
  const mobile = useIsMobile()
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const quality = useMemo(() => detectQuality(), [])
  const tl = mobile ? MOBILE : DESKTOP
  const wrap = useRef<HTMLDivElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const texts = useRef<Record<string, HTMLElement | null>>({})
  const progress = useRef(0)
  const manual = useRef<HeroManual>({})
  const sceneRef = useRef(0)
  const [scene, setScene] = useState(0)
  const [manualState, setManualState] = useState<HeroManual>({})
  const register = (id: string, el: HTMLElement | null) => { texts.current[id] = el }

  const paintTexts = (p: number) => {
    for (const [k, r] of Object.entries(TEXT_RANGES)) {
      const el = texts.current[k]
      if (!el) continue
      const o = r[0] < 0 ? 1 - ramp(p, r[2], r[3]) : upDown(p, r)
      const leaving = p > (r[1] + r[2]) / 2
      el.style.opacity = String(o)
      el.style.transform = `translate3d(0, ${(1 - o) * (leaving ? -28 : 28)}px, 0) scale(${0.97 + 0.03 * o})`
      el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
    }
  }

  useLayoutEffect(() => {
    if (reduced || !wrap.current || !pin.current) return
    paintTexts(0)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap.current,
        start: 'top top',
        end: `+=${tl.pinLength}%`,
        pin: pin.current,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          progress.current = p
          paintTexts(p)
          const sc = sceneAt(tl, p)
          if (sc !== sceneRef.current) {
            sceneRef.current = sc
            manual.current = {}
            setManualState({})
            setScene(sc)
          }
          const k = ramp(p, tl.overlay[0], tl.overlay[1])
          if (overlay.current) overlay.current.style.transform = `translate3d(0, ${(1 - k) * 100}%, 0)`
          if (bar.current) bar.current.style.transform = `scaleX(${p})`
        },
      })
    }, wrap)
    return () => ctx.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, tl])

  const setManual = (m: HeroManual) => { manual.current = { ...manual.current, ...m }; setManualState({ ...manual.current }) }
  const isOpen = (manualState.open ?? 0) > 0
  const isExploded = (manualState.explode ?? 0) > 0
  const h2 = 'display text-[2.8rem] leading-[1] sm:text-[4rem] lg:text-[5.6rem]'
  const sub = 'mx-auto mt-5 max-w-[30rem] text-[1.05rem] text-fog-2 md:text-[1.25rem]'

  return (
    <section ref={wrap} className="relative -mt-12" aria-label="Presentación de producto">
      <div ref={pin} data-theme="dark" className="dark-scene relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-black">
        <Suspense fallback={<Poster mobile={mobile} />}>
          <Viewer className="absolute inset-0" quality={quality} label="Ventana de PVC de dos hojas en visualización 3D orientativa"
            fallback={<Poster mobile={mobile} />} camera={{ position: tl.keys[0].pos, fov: 32 }}>
            <HeroScene progress={progress} manual={manual} finish={null} mobile={mobile} quality={quality} />
          </Viewer>
        </Suspense>

        {/* Velo superior: legibilidad del texto sobre cualquier encuadre */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[58%] bg-[linear-gradient(180deg,rgb(0_0_0/0.86)_0%,rgb(0_0_0/0.6)_45%,transparent_100%)]" aria-hidden />

        {/* Textos centrados, guiados por el desplazamiento */}
        <div className="pointer-events-none absolute inset-x-0 top-[12%] z-10 mx-auto max-w-[1100px] px-5 text-center md:top-[11%]">
          <ScrollText id="intro" register={register} reduced={reduced} live={scene === 0}>
            <p className="text-[0.95rem] font-semibold text-green md:text-[1.1rem]">Ventanas y puertas de PVC · Sistemas Schüco</p>
            <h1 className="display mt-3 text-[3.1rem] leading-[0.98] sm:text-[4.6rem] lg:text-[5.8rem]">Precisión<br />que se abre.</h1>
            <p className="mx-auto mt-5 max-w-[34rem] text-[1.05rem] leading-snug text-fog-2 md:text-[1.3rem]">Fabricación a medida para profesionales de Sevilla y provincia.</p>
            <div className="pointer-events-auto mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Button to="/soluciones" className="!rounded-full !px-6">Explorar soluciones</Button>
              <Link to="/acceso-profesional" className="inline-flex min-h-11 items-center gap-1 text-[1rem] font-semibold text-white hover:underline">Acceso profesional <ChevronRight size={18} aria-hidden /></Link>
            </div>
          </ScrollText>
          <ScrollText id="material" register={register} reduced={reduced} live={scene === 1}>
            <h2 className={h2}>Mírala de cerca.</h2>
          </ScrollText>
          <div className="relative mt-[4.2rem] sm:mt-[5.4rem] lg:mt-[7.2rem]">
            <ScrollText id="blanco" register={register} reduced={reduced} live={scene === 1}>
              <p className="text-[1.15rem] font-semibold text-fog-2 md:text-[1.45rem]">Perfil, junta, vidrio y manilla. <span className="text-white">En blanco.</span></p>
            </ScrollText>
            <ScrollText id="antracita" register={register} reduced={reduced} live={scene === 1}>
              <p className="text-[1.15rem] font-semibold text-fog-2 md:text-[1.45rem]">El mismo detalle. <span className="text-white">En antracita.</span></p>
            </ScrollText>
          </div>
          <ScrollText id="funcion" register={register} reduced={reduced} live={scene === 2} className="top-0">
            <h2 className={h2}>Se abre.<br /><span className="text-fog-3">El marco, no.</span></h2>
            <p className={sub}>Primero gira la manilla. Después, la hoja. El vidrio viaja con ella.</p>
          </ScrollText>
          <ScrollText id="interior" register={register} reduced={reduced} live={scene === 3} className="top-0">
            <h2 className={h2}>Por dentro,<br />todo encaja.</h2>
            <p className={sub}>Marco, hoja, vidrio, juntas, junquillo y manilla.</p>
          </ScrollText>
        </div>

        {/* Controles mínimos (alternativa al desplazamiento y al arrastre) */}
        <div className="absolute inset-x-0 bottom-0 z-20 pb-[4.6rem] md:pb-8">
          <div className="mx-auto flex max-w-[1200px] items-center justify-end gap-2 px-4 md:justify-center">
            {[
              { k: 'open', on: isOpen, icon: <DoorOpen size={16} aria-hidden />, label: isOpen ? 'Cerrar' : 'Abrir', act: () => setManual({ open: isOpen ? 0 : 0.85, explode: 0 }) },
              { k: 'explode', on: isExploded, icon: <Layers size={16} aria-hidden />, label: isExploded ? 'Montar' : 'Ver por dentro', act: () => setManual({ explode: isExploded ? 0 : 1, open: 0 }) },
            ].map((b) => (
              <button key={b.k} onClick={b.act} aria-pressed={b.on}
                className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-3 text-[0.82rem] font-semibold backdrop-blur-xl transition-colors md:px-4 ${b.on ? 'border-white bg-white text-black' : 'border-white/15 bg-white/8 text-white hover:bg-white/15'}`}>
                {b.icon}<span className="max-md:sr-only">{b.label}</span>
              </button>
            ))}
            <button onClick={() => { manual.current = {}; setManualState({}); window.scrollTo({ top: wrap.current?.offsetTop ?? 0, behavior: reduced ? 'auto' : 'smooth' }) }}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/8 text-white backdrop-blur-xl hover:bg-white/15" aria-label="Volver al inicio de la presentación">
              <RotateCcw size={16} aria-hidden />
            </button>
          </div>
          {!reduced && <div className="mx-auto mt-4 hidden h-[2px] w-24 md:block overflow-hidden rounded-full bg-white/15" aria-hidden><div ref={bar} className="h-full w-full origin-left scale-x-0 bg-white/80" /></div>}
          <p className="label mt-3 px-4 text-right !text-[0.56rem] text-white/40 md:text-center"><span className="md:hidden">Visual orientativo</span><span className="max-md:hidden">Visualización orientativa · no es un modelo técnico certificado</span></p>
        </div>

        {!reduced && (
          <div ref={overlay} style={{ transform: 'translate3d(0,100%,0)' }} className="absolute inset-0 z-30 flex items-center justify-center bg-paper text-ink will-change-transform" data-theme="light" aria-hidden={scene < 4} inert={scene < 4}>
            <Continuity />
          </div>
        )}
      </div>
      {reduced && <div className="bg-paper py-24 text-ink" data-theme="light"><Continuity /></div>}
    </section>
  )
}

function Continuity() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 text-center">
      <p className="text-[1rem] font-semibold text-green-ink md:text-[1.15rem]">Grupo Deken</p>
      <h2 className="display mt-3 text-[2.9rem] leading-[1] sm:text-[4.2rem] lg:text-[5.8rem]">Hecha a medida.<br /><span className="text-ink-3">Para cada obra.</span></h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <Button to="/soluciones" className="!rounded-full !px-6">Ver soluciones</Button>
        <Link to="/acceso-profesional" className="inline-flex min-h-11 items-center gap-1 text-[1rem] font-semibold text-green-ink hover:underline">Recorrido profesional <ChevronRight size={18} aria-hidden /></Link>
      </div>
    </div>
  )
}

/** Datos de servicio (los usa la sección de declaración de la portada). */
export const SUPPLY = [
  { k: 'Para quién', t: 'Constructoras, empresas de reformas, profesionales de carpintería, promotoras y estudios técnicos.', s: 'No ofrecemos venta directa al particular.' },
  { k: 'Qué fabricamos', t: 'Ventanas, puertas y cerramientos de PVC con sistemas Schüco.', s: 'Vidrios, persianas y accesorios pueden proceder de distintos proveedores.' },
  { k: 'Dónde suministramos', t: 'Transporte propio habitual en Sevilla capital y provincia.', s: 'Otras zonas de España: se estudian cuando el cliente organiza el transporte.' },
]
