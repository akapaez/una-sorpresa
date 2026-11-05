import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { RotateCcw, Info, SlidersHorizontal } from 'lucide-react'
import { useDemo } from '@/demo/store'
import type { Role } from '@/demo/types'
import { t } from '@/i18n'
import { Dialog, toast } from '@/ui/Dialog'
import { Button } from '@/ui/Button'

const ROLES: Role[] = ['visitante', 'pendiente', 'aprobado', 'deken']
const HOME: Record<Role, string> = { visitante: '/', pendiente: '/acceso-profesional', aprobado: '/profesional', deken: '/deken' }

/**
 * Control del entorno de revisión: indica que es una previsualización y permite alternar los
 * cuatro estados de usuario. NO es autenticación.
 * - En la web pública: botón flotante discreto, para no restar protagonismo al producto.
 * - En el espacio profesional y el panel Deken: banda superior.
 */
export function DemoBar() {
  const role = useDemo((s) => s.role)
  const setRole = useDemo((s) => s.setRole)
  const reset = useDemo((s) => s.reset)
  const nav = useNavigate()
  const loc = useLocation()
  const [info, setInfo] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [panel, setPanel] = useState(false)
  const floating = !loc.pathname.startsWith('/profesional') && !loc.pathname.startsWith('/deken')

  const changeRole = (r: Role) => {
    setRole(r)
    setPanel(false)
    toast(`Modo: ${t.demo.roles[r]}`, 'Cambio local de la demostración, sin cuentas reales.', 'info')
    nav(HOME[r])
  }

  const select = (
    <select id="demo-role" value={role} onChange={(e) => changeRole(e.target.value as Role)}
      className="min-h-9 cursor-pointer rounded-[8px] border border-white/15 bg-night-3 px-2 pr-7 text-[0.84rem] font-semibold text-white hover:border-white/35">
      {ROLES.map((r) => <option key={r} value={r}>{t.demo.roles[r]}</option>)}
    </select>
  )

  const dialogs = (
    <>
      <Dialog open={info} onClose={() => setInfo(false)} title="Cómo revisar esta previsualización">
        <div className="space-y-3 text-[0.92rem] text-ink-2">
          <p>{t.demo.aviso}</p>
          <p>Usa <strong className="text-ink">Modo demostración</strong> para ver la plataforma como:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong className="text-ink">Visitante:</strong> web pública, catálogo, guías y solicitud de acceso.</li>
            <li><strong className="text-ink">Profesional pendiente:</strong> estado de la solicitud enviada.</li>
            <li><strong className="text-ink">Profesional aprobado:</strong> herramientas, biblioteca, proyectos, presupuestos y pedidos de la empresa de demostración.</li>
            <li><strong className="text-ink">Equipo Deken:</strong> panel interno de gestión.</li>
          </ul>
          <p>Los cambios se guardan solo en este navegador. En la plataforma real los permisos se verificarán en servidor y los documentos privados no viajarán en el paquete público.</p>
        </div>
      </Dialog>
      <Dialog open={confirm} onClose={() => setConfirm(false)} title="¿Restablecer la demostración?"
        footer={<>
          <Button variant="outline" onClick={() => setConfirm(false)}>Cancelar</Button>
          <Button variant="dark" onClick={() => { reset(); setConfirm(false); setPanel(false); nav('/'); toast('Demostración restablecida', 'Se han recuperado los datos ficticios iniciales.') }}>Restablecer</Button>
        </>}>
        <p className="text-[0.92rem] text-ink-2">Se borrarán las configuraciones, mensajes, solicitudes y cambios de estado hechos en este navegador y se recuperará el conjunto de datos de demostración inicial.</p>
      </Dialog>
    </>
  )

  if (floating) {
    return (
      <>
        <div className="fixed bottom-4 left-4 z-[95]">
          {panel && (
            <div className="dark-scene mb-2 w-[min(18rem,calc(100vw-2rem))] animate-arrive rounded-[16px] border border-white/10 bg-night-2/95 p-4 text-white shadow-3 backdrop-blur-xl" role="group" aria-label="Modo demostración">
              <p className="label !text-[0.6rem] text-fog-3">Previsualización · datos ficticios</p>
              <label htmlFor="demo-role" className="mt-3 block text-[0.8rem] font-semibold text-fog-2">{t.demo.modo}</label>
              <div className="mt-1.5 [&>select]:w-full">{select}</div>
              <div className="mt-3 flex gap-1">
                <button onClick={() => setInfo(true)} className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-[8px] text-[0.78rem] text-fog-2 hover:bg-white/8 hover:text-white"><Info size={14} aria-hidden />Cómo revisar</button>
                <button onClick={() => setConfirm(true)} className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-[8px] text-[0.78rem] text-fog-2 hover:bg-white/8 hover:text-white"><RotateCcw size={14} aria-hidden />Restablecer</button>
              </div>
            </div>
          )}
          <button onClick={() => setPanel(!panel)} aria-expanded={panel}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-night/80 px-3.5 text-[0.78rem] font-semibold text-white shadow-3 backdrop-blur-xl hover:bg-night">
            <SlidersHorizontal size={15} className="text-green" aria-hidden />
            <span>Demo<span className="hidden sm:inline"> · {t.demo.roles[role]}</span></span>
          </button>
        </div>
        {dialogs}
      </>
    )
  }

  return (
    <div className="dark-scene relative z-[95] border-b border-white/8 bg-night">
      <div className="mx-auto flex min-h-10 max-w-[1600px] items-center gap-x-4 gap-y-1 px-4 py-1 sm:px-6">
        <p className="label hidden items-center gap-2 !text-[0.64rem] text-fog-3 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden />
          Previsualización · datos ficticios
        </p>
        <div className="flex min-w-0 items-center gap-2">
          <label htmlFor="demo-role" className="label !text-[0.64rem] text-fog-2 max-sm:sr-only">{t.demo.modo}</label>
          {select}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setInfo(true)} className="inline-flex min-h-8 items-center gap-1.5 rounded-[6px] px-2 text-[0.78rem] text-fog-2 hover:bg-white/6 hover:text-white">
            <Info size={14} aria-hidden /> <span className="hidden sm:inline">Cómo revisar</span>
          </button>
          <button onClick={() => setConfirm(true)} className="inline-flex min-h-8 items-center gap-1.5 rounded-[6px] px-2 text-[0.78rem] text-fog-2 hover:bg-white/6 hover:text-white">
            <RotateCcw size={14} aria-hidden /> <span className="hidden sm:inline">{t.demo.reset}</span>
          </button>
        </div>
      </div>
      {dialogs}
    </div>
  )
}
