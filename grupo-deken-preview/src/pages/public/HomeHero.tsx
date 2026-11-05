import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowDown, RotateCcw, DoorOpen, Layers } from 'lucide-react'
import { Button } from '@/ui/Button'
import { detectQuality, prefersReducedMotion } from '@/three/quality'
import { DESKTOP, MOBILE, ramp, sceneAt } from '@/three/story'
import type { HeroManual } from '@/three/HeroScene'
import type { FinishId } from '@/three/windowSpec'
import { FINISHES } from '@/content/solutions'

gsap.registerPlugin(ScrollTrigger)

const Viewer = lazy(() => import('@/three/Viewer').then((m) => ({ default: m.Viewer })))
const HeroScene = lazy(() => import('@/three/HeroScene').then((m) => ({ default: m.HeroScene })))

const SCENES_DESKTOP = [
  { key: 'intro', label: 'Presentación' },
  { key: 'material', label: 'Material' },
  { key: 'funcion', label: 'Funcionamiento' },
  { key: 'interior', label: 'Interior' },
  { key: 'continuidad', label: 'Tu proyecto' },
]
const SCENES_MOBILE = [SCENES_DESKTOP[0], SCENES_DESKTOP[2], SCENES_DESKTOP[3], SCENES_DESKTOP[4]]

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
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_46%,#2a3033_0%,#121415_48%,#0d0e0f_75%)]">
      {ok && (
        <img
          src={mobile ? '/renders/hero-mobile.jpg' : '/renders/hero-desktop.jpg'}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setOk(false)}
          fetchPriority="high"
        />
      )}
    </div>
  )
}

export function HomeHero() {
  const mobile = useIsMobile()
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const quality = useMemo(() => detectQuality(), [])
  const tl = mobile ? MOBILE : DESKTOP
  const scenes = mobile ? SCENES_MOBILE : SCENES_DESKTOP
  const wrap = useRef<HTMLDivElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const progressBar = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const manual = useRef<HeroManual>({})
  const stRef = useRef<ScrollTrigger | null>(null)
  const [scene, setScene] = useState(0)
  const sceneRef = useRef(0)
  const [finish, setFinish] = useState<FinishId | null>(null)
  const [manualState, setManualState] = useState<HeroManual>({})

  // Coordinación con el scroll: GSAP solo fija la sección y escribe el progreso.
  useLayoutEffect(() => {
    if (reduced || !wrap.current || !pin.current) return
    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: wrap.current,
        start: 'top top',
        end: `+=${tl.pinLength}%`,
        pin: pin.current,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          progress.current = p
          const sc = sceneAt(tl, p)
          if (sc !== sceneRef.current) {
            sceneRef.current = sc
            manual.current = {}
            setManualState({})
            setScene(sc)
          }
          const k = ramp(p, tl.overlay[0], tl.overlay[1])
          if (overlay.current) overlay.current.style.transform = `translate3d(0, ${(1 - k) * 100}%, 0)`
          if (progressBar.current) progressBar.current.style.transform = `scaleY(${p})`
        },
      })
    }, wrap)
    return () => { ctx.revert(); stRef.current = null }
  }, [reduced, tl])

  const setManual = (m: HeroManual) => { manual.current = { ...manual.current, ...m }; setManualState({ ...manual.current }) }
  const resetView = () => { manual.current = {}; setManualState({}); setFinish(null); goTo(0) }
  const goTo = (i: number) => {
    const st = stRef.current
    if (!st) return
    const target = st.start + (st.end - st.start) * (tl.scenes[i] + (i === 0 ? 0 : 0.03))
    window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' })
  }

  const isOpen = manualState.open !== undefined ? manualState.open > 0 : false
  const isExploded = manualState.explode !== undefined ? manualState.explode > 0 : false
  const activeKey = scenes[scene]?.key ?? 'intro'

  const block = (key: string, children: React.ReactNode) => {
    const active = reduced ? key === 'intro' : activeKey === key
    return (
      <div
        className={`absolute inset-x-0 transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${active ? 'opacity-100 translate-y-0 blur-0' : 'pointer-events-none translate-y-3 opacity-0 blur-[4px]'}`}
        aria-hidden={!active}
        inert={!active}
      >
        {children}
      </div>
    )
  }

  return (
    <section ref={wrap} className="relative -mt-16" aria-label="Presentación de producto">
      <div ref={pin} data-theme="dark" className="dark-scene grain relative h-[100svh] min-h-[560px] w-full overflow-hidden">
        {/* Visor 3D con respaldo inmediato */}
        <Suspense fallback={<Poster mobile={mobile} />}>
          <Viewer
            className="absolute inset-0"
            quality={quality}
            label="Ventana de PVC de dos hojas en visualización 3D orientativa"
            fallback={<Poster mobile={mobile} />}
            camera={{ position: (mobile ? MOBILE : DESKTOP).keys[0].pos, fov: 32 }}
          >
            <HeroScene progress={progress} manual={manual} finish={finish} mobile={mobile} quality={quality} />
          </Viewer>
        </Suspense>

        {/* Velo de lectura para el texto */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(13_14_15/0.86)_0%,rgb(13_14_15/0.55)_34%,transparent_58%)] max-md:bg-[linear-gradient(180deg,rgb(13_14_15/0.9)_0%,rgb(13_14_15/0.6)_50%,transparent_72%)]" aria-hidden />

        {/* Textos de cada escena */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-4 pt-20 sm:px-6 md:justify-center md:pt-16 lg:px-10">
          <div className="relative min-h-[330px] w-full max-w-[600px] md:min-h-[420px]">
            {block('intro', (
              <div>
                <p className="label mb-5 flex items-center gap-2.5 text-fog-2"><span className="h-px w-6 bg-green" aria-hidden />Fabricación PVC · Santiponce, Sevilla</p>
                <h1 className="display text-[2.05rem] sm:text-[3.1rem] lg:text-[4.1rem]">Fabricación de PVC para proyectos que exigen precisión.</h1>
                <p className="lede mt-4 max-w-[30rem] text-[0.95rem] leading-relaxed text-fog-2 md:mt-5 md:text-[1.08rem]">
                  Ventanas, puertas y cerramientos con sistemas Schüco para constructoras, reformistas, promotoras y estudios técnicos de Sevilla y provincia.
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5 md:mt-8 md:gap-3">
                  <Button to="/soluciones" size="lg" iconRight={<ArrowRight size={18} aria-hidden />}>Explorar soluciones</Button>
                  <Button to="/acceso-profesional" size="lg" variant="outline-dark">Solicitar acceso profesional</Button>
                </div>
              </div>
            ))}
            {block('material', (
              <div>
                <p className="label mb-4 text-green">01 · Material</p>
                <h2 className="display text-[2.1rem] sm:text-[2.8rem] lg:text-[3.4rem]">La calidad se ve de cerca.</h2>
                <p className="lede mt-4 max-w-[26rem] text-[1rem] leading-relaxed text-fog-2">Cantos, juntas, vidrio y manilla. Cambia el acabado y observa cómo se transforma el producto.</p>
                <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Acabado de muestra">
                  {FINISHES.map((f) => (
                    <button key={f.id} onClick={() => setFinish(f.id)} aria-pressed={finish === f.id}
                      className={`inline-flex min-h-11 items-center gap-2.5 rounded-full border px-4 text-[0.86rem] font-semibold transition-colors ${finish === f.id ? 'border-green bg-white/10 text-white' : 'border-white/20 text-fog-2 hover:border-white/50 hover:text-white'}`}>
                      <span className="h-4 w-4 rounded-full border border-white/40" style={{ background: f.swatch }} aria-hidden />{f.name}
                    </button>
                  ))}
                </div>
                <p className="label mt-4 !text-[0.62rem] text-fog-3">Muestras visuales · no son códigos oficiales</p>
              </div>
            ))}
            {block('funcion', (
              <div>
                <p className="label mb-4 text-green">{mobile ? '01' : '02'} · Funcionamiento</p>
                <h2 className="display text-[2.1rem] sm:text-[2.8rem] lg:text-[3.4rem]">La hoja gira sobre su eje. El marco permanece.</h2>
                <p className="lede mt-4 max-w-[27rem] text-[1rem] leading-relaxed text-fog-2">Primero la manilla, después la hoja: el mismo orden que en una ventana real. El vidrio viaja con la hoja.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button variant="outline-dark" icon={<DoorOpen size={17} aria-hidden />} onClick={() => setManual({ open: isOpen ? 0 : 0.85, explode: 0 })}>{isOpen ? 'Cerrar hoja' : 'Abrir hoja'}</Button>
                </div>
              </div>
            ))}
            {block('interior', (
              <div>
                <p className="label mb-4 text-green">{mobile ? '02' : '03'} · Interior</p>
                <h2 className="display text-[2.1rem] sm:text-[2.8rem] lg:text-[3.4rem]">Lo que hay dentro de un cerramiento.</h2>
                <p className="lede mt-4 max-w-[27rem] text-[1rem] leading-relaxed text-fog-2">Marco, hoja, vidrio, junta, junquillo y manilla, separados para entender cómo trabajan juntos.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button variant="outline-dark" icon={<Layers size={17} aria-hidden />} onClick={() => setManual({ explode: isExploded ? 0 : 1, open: 0 })}>{isExploded ? 'Montar de nuevo' : 'Ver piezas'}</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navegación de escenas (alternativa al scroll) */}
        {!reduced && (
          <nav aria-label="Momentos de la presentación" className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 md:block lg:right-8">
            <div className="relative flex flex-col gap-1 rounded-[12px] border border-white/8 bg-night/65 py-2 pl-4 pr-4 backdrop-blur-md">
              <div className="absolute bottom-4 left-2 top-4 w-px bg-white/15" aria-hidden>
                <div ref={progressBar} className="h-full w-px origin-top scale-y-0 bg-green" />
              </div>
              {scenes.map((s, i) => (
                <button key={s.key} onClick={() => goTo(i)} aria-current={i === scene ? 'step' : undefined}
                  className={`flex min-h-9 items-center gap-3 text-left text-[0.78rem] font-semibold transition-colors ${i === scene ? 'text-white' : 'text-fog-3 hover:text-fog-2'}`}>
                  <span className="label tnum !text-[0.62rem]">{String(i + 1).padStart(2, '0')}</span>{s.label}
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Controles de visor */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-3 px-4 pb-14 sm:px-6 lg:px-10">
            <p className="label hidden max-w-[16rem] !text-[0.6rem] leading-relaxed text-fog-3 sm:block">Visualización orientativa creada para la previsualización · no es un modelo técnico certificado</p>
            {!reduced && scene === 0 && (
              <button onClick={() => goTo(1)} className="label absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 text-fog-2 hover:text-white md:flex">
                Desliza para explorar <ArrowDown size={14} className="animate-bounce motion-reduce:animate-none" aria-hidden />
              </button>
            )}
            <div className="ml-auto flex flex-wrap justify-end gap-1.5 rounded-[12px] border border-white/10 bg-night/70 p-1.5 backdrop-blur-md">
              <button onClick={() => setManual({ open: isOpen ? 0 : 0.85, explode: 0 })} className="inline-flex min-h-10 items-center gap-2 rounded-[8px] px-3 text-[0.8rem] font-semibold text-fog-2 hover:bg-white/8 hover:text-white" aria-pressed={isOpen}>
                <DoorOpen size={16} aria-hidden /> {isOpen ? 'Cerrar' : 'Abrir'}
              </button>
              <button onClick={() => setManual({ explode: isExploded ? 0 : 1, open: 0 })} className="inline-flex min-h-10 items-center gap-2 rounded-[8px] px-3 text-[0.8rem] font-semibold text-fog-2 hover:bg-white/8 hover:text-white" aria-pressed={isExploded}>
                <Layers size={16} aria-hidden /> Detalle
              </button>
              <button onClick={resetView} className="inline-flex min-h-10 items-center gap-2 rounded-[8px] px-3 text-[0.8rem] font-semibold text-fog-2 hover:bg-white/8 hover:text-white">
                <RotateCcw size={16} aria-hidden /> <span className="max-sm:sr-only">Restablecer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transición a la sección clara: el producto se recompone y la página continúa */}
        {!reduced && (
          <div ref={overlay} style={{ transform: 'translate3d(0,100%,0)' }} className="absolute inset-0 z-30 flex items-center bg-paper text-ink will-change-transform" data-theme="light" aria-hidden={scene < scenes.length - 1}>
            <ContinuityPanel />
          </div>
        )}
      </div>
      {reduced && <div className="bg-paper text-ink"><ContinuityPanel /></div>}
    </section>
  )
}

function ContinuityPanel() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-14 pt-20 sm:px-6 md:pb-10 lg:px-10">
      <p className="label mb-5 flex items-center gap-2.5 text-ink-3"><span className="h-px w-6 bg-green" aria-hidden />Para profesionales · Sevilla y provincia</p>
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <h2 className="display text-[2.2rem] sm:text-[3rem] lg:text-[3.9rem]">Ahora, elige la solución para tu obra.</h2>
        <div>
          <p className="lede text-[1.02rem] leading-relaxed text-ink-2">Explora las tipologías, compara aperturas y, si eres profesional aprobado, configura, guarda y solicita presupuesto con toda la información de tu proyecto.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/soluciones" size="lg" iconRight={<ArrowRight size={18} aria-hidden />}>Ver catálogo</Button>
            <Button to="/acceso-profesional" size="lg" variant="outline">Recorrido profesional</Button>
          </div>
        </div>
      </div>
      {/* Datos de servicio dentro del panel (en móvil van en una sección propia para no recortarse) */}
      <ol className="mt-14 hidden border-t border-line md:grid md:grid-cols-3">
        {SUPPLY.map((it, i) => (
          <li key={it.k} className={`pt-7 ${i > 0 ? 'border-l border-line pl-8' : 'pr-8'}`}>
            <p className="label tnum text-ink-3">{String(i + 1).padStart(2, '0')} · {it.k}</p>
            <p className="mt-3 text-[1.12rem] font-bold leading-snug tracking-tight lg:text-[1.25rem]">{it.t}</p>
            <p className="mt-2 text-[0.88rem] text-ink-2">{it.s}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export const SUPPLY = [
  { k: 'Para quién', t: 'Constructoras, empresas de reformas, profesionales de carpintería, promotoras y estudios técnicos.', s: 'No ofrecemos venta directa al particular.' },
  { k: 'Qué fabricamos', t: 'Ventanas, puertas y cerramientos de PVC con sistemas Schüco.', s: 'Vidrios, persianas y accesorios pueden proceder de distintos proveedores.' },
  { k: 'Dónde suministramos', t: 'Transporte propio habitual en Sevilla capital y provincia.', s: 'Otras zonas de España: se estudian cuando el cliente organiza el transporte.' },
]
