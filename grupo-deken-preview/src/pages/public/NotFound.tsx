import { Button } from '@/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="label text-ink-3">Error 404</p>
      <h1 className="h-section mt-3 text-3xl">No encontramos esta página</h1>
      <p className="mt-3 text-ink-2">Puede que el enlace sea antiguo o que el elemento se haya eliminado al restablecer la demostración.</p>
      <div className="mt-6 flex justify-center gap-2"><Button to="/">Ir al inicio</Button><Button to="/soluciones" variant="outline">Ver soluciones</Button></div>
    </div>
  )
}
