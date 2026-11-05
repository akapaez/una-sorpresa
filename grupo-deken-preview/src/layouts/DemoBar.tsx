import { useState } from 'react'
import { useNavigate } from 'react-router'
import { RotateCcw, Info } from 'lucide-react'
import { useDemo } from '@/demo/store'
import type { Role } from '@/demo/types'
import { t } from '@/i18n'
import { Dialog, toast } from '@/ui/Dialog'
import { Button } from '@/ui/Button'

const ROLES: Role[] = ['visitante', 'pendiente', 'aprobado', 'deken']
const HOME: Record<Role, string> = { visitante: '/', pendiente: '/acceso-profesional', aprobado: '/profesional', deken: '/deken' }

/**
 * Banda global del entorno de revisión: indica que es una previsualización y permite
 * alternar los cuatro estados de usuario. NO es autenticación.
 */
export function DemoBar() {
  const role = useDemo((s) => s.role)
  const setRole = useDemo((s) => s.setRole)
  const reset = useDemo((s) => s.reset)
  const nav = useNavigate()
  const [info, setInfo] = useState(false)
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="dark-scene relative z-[95] border-b border-white/8 bg-night">
      <div className="mx-auto flex min-h-10 max-w-[1600px] items-center gap-x-4 gap-y-1 px-4 py-1 sm:px-6">
        <p className="label hidden items-center gap-2 !text-[0.64rem] text-fog-3 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden />
          Previsualización · datos ficticios
        </p>
        <div className="flex min-w-0 items-center gap-2">
          <label htmlFor="demo-role" className="label !text-[0.64rem] text-fog-2 max-sm:sr-only">{t.demo.modo}</label>
          <select
            id="demo-role"
            value={role}
            onChange={(e) => {
              const r = e.target.value as Role
              setRole(r)
              toast(`Modo: ${t.demo.roles[r]}`, 'Cambio local de la demostración, sin cuentas reales.', 'info')
              nav(HOME[r])
            }}
            className="min-h-8 cursor-pointer rounded-[6px] border border-white/15 bg-night-3 px-2 pr-7 text-[0.8rem] font-semibold text-white hover:border-white/35"
          >
            {ROLES.map((r) => <option key={r} value={r}>{t.demo.roles[r]}</option>)}
          </select>
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
          <Button variant="dark" onClick={() => { reset(); setConfirm(false); nav('/'); toast('Demostración restablecida', 'Se han recuperado los datos ficticios iniciales.') }}>Restablecer</Button>
        </>}>
        <p className="text-[0.92rem] text-ink-2">Se borrarán las configuraciones, mensajes, solicitudes y cambios de estado hechos en este navegador y se recuperará el conjunto de datos de demostración inicial.</p>
      </Dialog>
    </div>
  )
}
