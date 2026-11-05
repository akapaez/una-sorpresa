import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { create } from 'zustand'

/**
 * Diálogo modal sobre <dialog> nativo: gestiona foco, Esc y fondo inerte.
 * variant="drawer" lo muestra como panel lateral (derecha) o inferior en móvil.
 */
export function Dialog({ open, onClose, title, children, footer, variant = 'modal', wide = false, description }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; variant?: 'modal' | 'drawer'; wide?: boolean; description?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  const cls = variant === 'drawer'
    ? 'm-0 ml-auto h-dvh max-h-dvh w-full max-w-[min(560px,100vw)] rounded-none sm:rounded-l-[16px]'
    : `m-auto w-[calc(100vw-2rem)] ${wide ? 'max-w-3xl' : 'max-w-lg'} rounded-[16px]`
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => { e.preventDefault(); onClose() }}
      onClick={(e) => { if (e.target === ref.current) onClose() }}
      className={`${cls} border border-line bg-surface p-0 text-ink shadow-3 backdrop:bg-night/55 backdrop:backdrop-blur-[2px] open:animate-[fade_200ms_ease-out]`}
      aria-labelledby={titleId}
    >
      <div className={`flex h-full flex-col ${variant === 'modal' ? 'max-h-[calc(100dvh-2rem)]' : ''}`}>
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id={titleId}className="text-lg font-extrabold tracking-tight">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-ink-2">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="-mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-[8px] text-ink-2 hover:bg-paper-2" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="thin-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-paper/60 px-5 py-3">{footer}</div>}
      </div>
    </dialog>
  )
}

/* --------------------------- Avisos (toasts) --------------------------- */
interface Toast { id: number; title: string; text?: string; tone: 'ok' | 'info' | 'warn' }
const useToasts = create<{ list: Toast[]; push: (t: Omit<Toast, 'id'>) => void; drop: (id: number) => void }>((set) => ({
  list: [],
  push: (t) => {
    const id = Date.now() + Math.random()
    set((s) => ({ list: [...s.list.slice(-2), { ...t, id }] }))
    setTimeout(() => set((s) => ({ list: s.list.filter((x) => x.id !== id) })), 5200)
  },
  drop: (id) => set((s) => ({ list: s.list.filter((x) => x.id !== id) })),
}))
export const toast = (title: string, text?: string, tone: Toast['tone'] = 'ok') => useToasts.getState().push({ title, text, tone })

export function Toaster() {
  const { list, drop } = useToasts()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[90] flex flex-col items-center gap-2 px-4" aria-live="polite" role="status">
      {list.map((t) => (
        <div key={t.id} className="pointer-events-auto flex w-full max-w-md animate-arrive items-start gap-3 rounded-[12px] border border-night-line bg-night-2 px-4 py-3 text-white shadow-3">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${t.tone === 'ok' ? 'bg-green' : t.tone === 'warn' ? 'bg-[#e0a43a]' : 'bg-fog-2'}`} aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">{t.title}</p>
            {t.text && <p className="mt-0.5 text-[0.82rem] text-fog-2">{t.text}</p>}
          </div>
          <button onClick={() => drop(t.id)} className="-mr-1 grid h-8 w-8 place-items-center rounded-md text-fog-2 hover:text-white" aria-label="Cerrar aviso"><X size={16} /></button>
        </div>
      ))}
    </div>
  )
}
