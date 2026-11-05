import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import {
  Home, FolderKanban, FileText, Truck, MessagesSquare, Files, Box, Columns3, Compass, Waves, Library, Menu, Bot,
  LayoutDashboard, UserCheck, Inbox, BookOpenCheck, HelpCircle, Upload, ArrowLeft, LockKeyhole, Clock3, CheckCircle2,
} from 'lucide-react'
import { Logo } from '@/brand/Logo'
import { pendingProfessional, useDemo } from '@/demo/store'
import { Button } from '@/ui/Button'
import { Dialog } from '@/ui/Dialog'
import { Badge, Notice } from '@/ui/primitives'
import { AssistantChat } from '@/tools/AssistantChat'
import type { Role } from '@/demo/types'

interface NavItem { to: string; label: string; icon: ReactNode; badge?: number; end?: boolean }

function SideNav({ groups, dark }: { groups: { title?: string; items: NavItem[] }[]; dark?: boolean }) {
  return (
    <nav aria-label="Secciones" className="flex flex-col gap-6">
      {groups.map((g, i) => (
        <div key={i}>
          {g.title && <p className={`label mb-2 px-3 !text-[0.62rem] ${dark ? 'text-fog-3' : 'text-ink-3'}`}>{g.title}</p>}
          <ul className="flex flex-col gap-0.5">
            {g.items.map((it) => (
              <li key={it.to}>
                <NavLink to={it.to} end={it.end} className={({ isActive }) => `group relative flex min-h-10 items-center gap-3 rounded-[8px] px-3 text-[0.88rem] font-semibold transition-colors ${isActive
                  ? dark ? 'bg-white/8 text-white' : 'bg-surface text-ink shadow-1'
                  : dark ? 'text-fog-2 hover:bg-white/5 hover:text-white' : 'text-ink-2 hover:bg-surface/70 hover:text-ink'}`}>
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-green" aria-hidden />}
                      <span className={isActive ? 'text-green-ink' : ''} style={dark && isActive ? { color: '#76B82A' } : undefined} aria-hidden>{it.icon}</span>
                      <span className="flex-1">{it.label}</span>
                      {!!it.badge && <span className="tnum grid h-5 min-w-5 place-items-center rounded-full bg-green px-1.5 text-[0.7rem] font-bold text-night" aria-label={`${it.badge} pendientes`}>{it.badge}</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function Shell({ side, top, children, dark, title }: { side: ReactNode; top?: ReactNode; children: ReactNode; dark?: boolean; title: string }) {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [loc.pathname])
  return (
    <div className="flex min-h-[calc(100dvh-2.5rem)]">
      <aside className={`sticky top-0 hidden h-[calc(100dvh)] w-[252px] shrink-0 flex-col border-r lg:flex ${dark ? 'dark-scene border-night-line bg-night-2' : 'border-line bg-paper-2'}`}>
        <div className="flex h-16 items-center px-5"><Link to="/" aria-label="Ir a la web pública"><Logo dark={dark} /></Link></div>
        <div className="thin-scroll flex-1 overflow-y-auto px-3 pb-6 pt-2">{side}</div>
        <div className={`border-t px-5 py-3 ${dark ? 'border-night-line' : 'border-line'}`}>
          <Link to="/" className={`inline-flex items-center gap-2 text-[0.8rem] font-semibold ${dark ? 'text-fog-2 hover:text-white' : 'text-ink-2 hover:text-ink'}`}><ArrowLeft size={14} aria-hidden /> Web pública</Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className={`sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-md sm:px-6 ${dark ? 'border-line bg-paper/90' : 'border-line bg-paper/90'}`}>
          <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-[8px] hover:bg-paper-2 lg:hidden" aria-label="Abrir navegación"><Menu size={22} /></button>
          <p className="truncate text-[0.92rem] font-bold">{title}</p>
          <div className="ml-auto flex items-center gap-2">{top}</div>
        </div>
        <main id="contenido" className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title={title} variant="drawer">{side}</Dialog>
    </div>
  )
}

/* ------------------------------ Puertas de acceso ------------------------------ */

function Gate({ icon, title, children, actions }: { icon: ReactNode; title: string; children: ReactNode; actions: ReactNode }) {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border border-line bg-surface text-ink-2" aria-hidden>{icon}</div>
      <h1 className="h-section text-2xl md:text-3xl">{title}</h1>
      <div className="mt-3 text-[0.95rem] text-ink-2">{children}</div>
      <div className="mt-7 flex flex-wrap justify-center gap-2">{actions}</div>
    </div>
  )
}

export function PendingStatus({ inline = false }: { inline?: boolean }) {
  const p = useDemo(pendingProfessional)
  const setRole = useDemo((s) => s.setRole)
  if (!p) return null
  const approved = p.status === 'aprobado'
  return (
    <div className={inline ? '' : 'mx-auto max-w-xl py-12'}>
      <div className="rounded-[16px] border border-line bg-surface p-6 shadow-2 md:p-8">
        <div className="flex items-center gap-3">
          {approved ? <CheckCircle2 className="text-green-ink" aria-hidden /> : <Clock3 className="text-warn" aria-hidden />}
          <h2 className="text-xl font-extrabold tracking-tight">{approved ? 'Acceso aprobado' : p.status === 'rechazado' ? 'Solicitud no aprobada' : 'Solicitud pendiente de revisión'}</h2>
        </div>
        <p className="mt-2 text-[0.92rem] text-ink-2">
          {approved
            ? 'El equipo Deken ha aprobado la solicitud. En la demo, al entrar se usa el espacio de la empresa de ejemplo para poder revisar los recorridos con datos sembrados.'
            : p.status === 'rechazado' ? 'El equipo Deken ha dejado una nota. Puedes responder desde contacto.' : 'El equipo Deken revisa cada solicitud antes de habilitar herramientas avanzadas y documentación. Te avisaremos cuando cambie el estado (aviso simulado).'}
        </p>
        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-line pt-5 text-[0.88rem] sm:grid-cols-2">
          <div><dt className="label text-ink-3">Nombre</dt><dd className="mt-1 font-semibold">{p.name}</dd></div>
          <div><dt className="label text-ink-3">Empresa</dt><dd className="mt-1 font-semibold">{p.companyName}</dd></div>
          <div><dt className="label text-ink-3">Perfil</dt><dd className="mt-1">{p.profile}</dd></div>
          <div><dt className="label text-ink-3">Localidad</dt><dd className="mt-1">{p.city}</dd></div>
          <div><dt className="label text-ink-3">Enviada</dt><dd className="tnum mt-1">{p.requestedAt}</dd></div>
          <div><dt className="label text-ink-3">Estado</dt><dd className="mt-1"><Badge tone={approved ? 'green' : 'warn'} dot>{p.status}</Badge></dd></div>
        </dl>
        {p.reviewNote && <Notice className="mt-4" tone="neutral" title="Nota del equipo (demo)">{p.reviewNote}</Notice>}
        <div className="mt-6 flex flex-wrap gap-2">
          {approved
            ? <Button to="/profesional" onClick={() => setRole('aprobado')}>Entrar al espacio profesional</Button>
            : <Button to="/deken/profesionales" variant="dark" onClick={() => setRole('deken')}>Revisar como equipo Deken (demo)</Button>}
          <Button to="/soluciones" variant="outline">Seguir explorando soluciones</Button>
        </div>
      </div>
    </div>
  )
}

function ProGate({ role, children }: { role: Role; children: ReactNode }) {
  const setRole = useDemo((s) => s.setRole)
  if (role === 'aprobado') return <>{children}</>
  if (role === 'pendiente') return <PendingStatus />
  if (role === 'deken') {
    return (
      <Gate icon={<LockKeyhole />} title="Estás en modo equipo Deken" actions={<>
        <Button onClick={() => setRole('aprobado')}>Ver como profesional aprobado</Button>
        <Button to="/deken" variant="outline">Ir al panel Deken</Button>
      </>}>El espacio profesional muestra los datos de cada empresa cliente. Cambia de modo para revisarlo.</Gate>
    )
  }
  return (
    <Gate icon={<LockKeyhole />} title="Herramientas para profesionales aprobados" actions={<>
      <Button to="/acceso-profesional">Solicitar acceso profesional</Button>
      <Button variant="outline" onClick={() => setRole('aprobado')}>Ver la demo como profesional aprobado</Button>
    </>}>
      El configurador completo, el comparador avanzado, la biblioteca técnica y el seguimiento de proyectos están reservados a profesionales aprobados por Deken. La información básica sigue siendo pública.
    </Gate>
  )
}

/* ------------------------------ Espacio profesional ------------------------------ */

export function ProLayout() {
  const role = useDemo((s) => s.role)
  const unread = useDemo((s) => s.threads.filter((t) => t.unreadClient).length)
  const quotesNew = useDemo((s) => s.quotes.filter((q) => q.status === 'propuesta-disponible').length)
  const [chat, setChat] = useState(false)
  const groups = [
    { items: [
      { to: '/profesional', label: 'Inicio', icon: <Home size={18} />, end: true },
      { to: '/profesional/proyectos', label: 'Proyectos', icon: <FolderKanban size={18} /> },
      { to: '/profesional/presupuestos', label: 'Presupuestos', icon: <FileText size={18} />, badge: quotesNew },
      { to: '/profesional/pedidos', label: 'Pedidos', icon: <Truck size={18} /> },
      { to: '/profesional/mensajes', label: 'Mensajes', icon: <MessagesSquare size={18} />, badge: unread },
      { to: '/profesional/documentos', label: 'Documentos', icon: <Files size={18} /> },
    ] },
    { title: 'Herramientas', items: [
      { to: '/profesional/configurador', label: 'Configurador 3D', icon: <Box size={18} /> },
      { to: '/profesional/comparador', label: 'Comparador', icon: <Columns3 size={18} /> },
      { to: '/profesional/asesor', label: 'Asesor guiado', icon: <Compass size={18} /> },
      { to: '/profesional/demostraciones', label: 'Demostraciones', icon: <Waves size={18} /> },
      { to: '/profesional/biblioteca', label: 'Biblioteca', icon: <Library size={18} /> },
    ] },
  ]
  return (
    <Shell side={<SideNav groups={groups} />} title="Espacio profesional"
      top={role === 'aprobado' && <>
        <span className="hidden text-[0.8rem] text-ink-2 md:inline">Reformas Ejemplo Aljarafe (demo)</span>
        <Button size="sm" variant="dark" icon={<Bot size={16} aria-hidden />} onClick={() => setChat(true)}>Asistente</Button>
      </>}>
      <ProGate role={role}><Outlet /></ProGate>
      <Dialog open={chat} onClose={() => setChat(false)} title="Asistente documental" description="Demostración con respuestas predefinidas" variant="drawer">
        <AssistantChat compact />
      </Dialog>
    </Shell>
  )
}

/* ------------------------------ Panel interno Deken ------------------------------ */

export function DekenLayout() {
  const role = useDemo((s) => s.role)
  const setRole = useDemo((s) => s.setRole)
  const pendingPros = useDemo((s) => s.professionals.filter((p) => p.status === 'pendiente').length)
  const newReq = useDemo((s) => s.requests.filter((r) => r.status === 'recibida').length + s.contacts.filter((c) => c.status === 'nueva').length + s.threads.filter((t) => t.unreadDeken).length)
  const drafts = useDemo((s) => s.library.filter((d) => d.status === 'borrador' || d.status === 'revision' || d.status === 'incorporado').length)
  const groups = [
    { title: 'Panel interno', items: [
      { to: '/deken', label: 'Resumen', icon: <LayoutDashboard size={18} />, end: true },
      { to: '/deken/profesionales', label: 'Profesionales', icon: <UserCheck size={18} />, badge: pendingPros },
      { to: '/deken/solicitudes', label: 'Solicitudes', icon: <Inbox size={18} />, badge: newReq },
      { to: '/deken/presupuestos', label: 'Presupuestos', icon: <FileText size={18} /> },
      { to: '/deken/pedidos', label: 'Pedidos', icon: <Truck size={18} /> },
    ] },
    { title: 'Contenido', items: [
      { to: '/deken/contenidos', label: 'Biblioteca y revisión', icon: <BookOpenCheck size={18} />, badge: drafts },
      { to: '/deken/preguntas', label: 'Preguntas', icon: <HelpCircle size={18} /> },
      { to: '/deken/importaciones', label: 'Importaciones', icon: <Upload size={18} /> },
    ] },
  ]
  return (
    <Shell dark side={<SideNav groups={groups} dark />} title="Panel Deken · uso interno" top={<Badge tone="dark">Datos de demostración</Badge>}>
      {role === 'deken' ? <Outlet /> : (
        <Gate icon={<LockKeyhole />} title="Panel interno del equipo Deken" actions={<Button variant="dark" onClick={() => setRole('deken')}>Ver como equipo Deken (demo)</Button>}>
          Gestión de profesionales, solicitudes, presupuestos, pedidos, contenidos e importaciones. En la plataforma real requerirá autenticación del equipo.
        </Gate>
      )}
    </Shell>
  )
}
