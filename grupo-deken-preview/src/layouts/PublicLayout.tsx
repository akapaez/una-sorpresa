import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Menu, ArrowUpRight } from 'lucide-react'
import { Logo } from '@/brand/Logo'
import { t } from '@/i18n'
import { useDemo } from '@/demo/store'
import { Button } from '@/ui/Button'
import { Dialog } from '@/ui/Dialog'

const NAV = [
  { to: '/soluciones', label: t.nav.soluciones },
  { to: '/series', label: 'Series' },
  { to: '/fabricacion', label: t.nav.fabricacion },
  { to: '/conocimiento', label: t.nav.conocimiento },
  { to: '/contacto', label: t.nav.contacto },
]

/** Detecta si el encabezado está sobre una escena oscura ([data-theme="dark"]). */
function useHeaderTheme() {
  const loc = useLocation()
  const [dark, setDark] = useState(false)
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      const els = document.elementsFromPoint(window.innerWidth / 2, 24)
      const hit = els.find((e) => (e as HTMLElement).closest?.('[data-theme]') && !(e as HTMLElement).closest('header'))
      const theme = (hit as HTMLElement | undefined)?.closest('[data-theme]')?.getAttribute('data-theme')
      setDark(theme === 'dark')
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(check) }
    check()
    const id = setInterval(check, 700)
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); clearInterval(id); if (raf) cancelAnimationFrame(raf) }
  }, [loc.pathname])
  return dark
}

export function PublicHeader() {
  const dark = useHeaderTheme()
  const role = useDemo((s) => s.role)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  const cta = role === 'aprobado'
    ? { to: '/profesional', label: t.nav.espacio }
    : role === 'deken' ? { to: '/deken', label: t.nav.panel }
    : role === 'pendiente' ? { to: '/acceso-profesional', label: 'Estado de mi solicitud' }
    : { to: '/acceso-profesional', label: t.nav.acceso }

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${dark ? 'bg-[rgb(13_14_15/0.72)] text-white backdrop-blur-xl backdrop-saturate-150' : 'border-b border-black/5 bg-[rgb(246_245_241/0.78)] text-ink backdrop-blur-xl backdrop-saturate-150'}`}>
      <div className="mx-auto flex h-12 max-w-[1200px] items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="shrink-0 rounded-md" aria-label="Grupo Deken · inicio"><Logo dark={dark} width={146} /></Link>
        <nav aria-label="Principal" className="mx-auto hidden items-center gap-2 lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `relative rounded-md px-3 py-1.5 text-[0.78rem] font-medium tracking-[0.01em] transition-colors ${isActive ? (dark ? 'text-white' : 'text-ink') : dark ? 'text-white/70 hover:text-white' : 'text-ink-2 hover:text-ink'}`}>
              {({ isActive }) => <>{n.label}{isActive && <span className="absolute inset-x-3 -bottom-0.5 h-[2px] bg-green" aria-hidden />}</>}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex lg:ml-0">
          <Button to={cta.to} variant="primary" size="sm" className="!min-h-8 !rounded-full !px-3.5 !text-[0.76rem]" iconRight={<ArrowUpRight size={13} aria-hidden />}>{cta.label}</Button>
        </div>
        <button onClick={() => setOpen(true)} className={`ml-auto -mr-2 grid h-11 w-11 place-items-center rounded-[8px] md:ml-2 lg:hidden ${dark ? 'hover:bg-white/10' : 'hover:bg-paper-2'}`} aria-label="Abrir menú" aria-expanded={open}>
          <Menu size={22} />
        </button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title="Menú" variant="drawer">
        <nav aria-label="Principal móvil" className="flex flex-col">
          <NavLink to="/" end className="border-b border-line py-4 text-lg font-bold">Inicio</NavLink>
          {NAV.map((n) => <NavLink key={n.to} to={n.to} className="border-b border-line py-4 text-lg font-bold">{n.label}</NavLink>)}
        </nav>
        <div className="mt-6 flex flex-col gap-2">
          <Button to={cta.to} size="lg">{cta.label}</Button>
          <Button to="/contacto" variant="outline" size="lg">{t.cta.presupuesto}</Button>
        </div>
      </Dialog>
    </header>
  )
}

export function PublicFooter() {
  return (
    <footer className="dark-scene relative overflow-hidden" data-theme="dark">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-16 sm:px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo dark width={200} />
            <p className="mt-5 max-w-sm text-[0.9rem] leading-relaxed text-fog-2">
              Fabricación y suministro de ventanas, puertas y cerramientos de PVC con sistemas Schüco para profesionales. Santiponce, Sevilla.
            </p>
            <p className="mt-4 max-w-sm text-[0.8rem] text-fog-3">Transporte propio habitual en Sevilla capital y provincia. Otras zonas de España: se estudian cuando el cliente organiza el transporte.</p>
          </div>
          <FooterCol title="Soluciones" links={[['Catálogo', '/soluciones'], ['Practicable', '/soluciones/practicable'], ['Oscilobatiente', '/soluciones/oscilobatiente'], ['Corredera', '/soluciones/corredera']]} />
          <FooterCol title="Deken" links={[['Fabricación', '/fabricacion'], ['Conocimiento', '/conocimiento'], ['Contacto', '/contacto'], ['Acceso profesional', '/acceso-profesional']]} />
          <FooterCol title="Legal" links={[['Aviso legal', '/legal/aviso-legal'], ['Privacidad', '/legal/privacidad'], ['Cookies', '/legal/cookies']]} />
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.78rem] text-fog-3 md:flex-row md:items-center md:justify-between">
          <p>Previsualización para aprobación · Grupo Deken · Contenido, datos y documentos ficticios salvo indicación.</p>
          <p className="label !text-[0.62rem]">noindex · sin analítica ni cookies de terceros</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="label text-fog-3">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map(([l, to]) => <li key={to}><Link to={to} className="text-[0.9rem] text-fog-2 hover:text-white">{l}</Link></li>)}
      </ul>
    </div>
  )
}

export function PublicLayout() {
  return (
    <>
      <PublicHeader />
      <main id="contenido"><Outlet /></main>
      <PublicFooter />
    </>
  )
}
