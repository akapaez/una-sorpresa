import { useId, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { Link } from 'react-router'

export function Eyebrow({ children, className = '', dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <p className={`label flex items-center gap-2.5 ${dark ? 'text-fog-2' : 'text-ink-3'} ${className}`}>
      <span className="inline-block h-px w-6 bg-green" aria-hidden />
      {children}
    </p>
  )
}

type Tone = 'neutral' | 'green' | 'warn' | 'danger' | 'info' | 'dark'
const tones: Record<Tone, string> = {
  neutral: 'bg-paper-2 text-ink-2 border-line',
  green: 'bg-green-soft text-green-deep border-green/35',
  warn: 'bg-warn-soft text-warn border-warn/25',
  danger: 'bg-danger-soft text-danger border-danger/25',
  info: 'bg-info-soft text-info border-info/25',
  dark: 'bg-night-3 text-fog border-night-line',
}
export function Badge({ children, tone = 'neutral', className = '', dot = false }: { children: ReactNode; tone?: Tone; className?: string; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-0.5 text-[0.72rem] font-semibold leading-5 whitespace-nowrap ${tones[tone]} ${className}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  )
}

/** Etiqueta de datos o documentos ficticios. */
export function DemoTag({ children = 'Demo', className = '' }: { children?: ReactNode; className?: string }) {
  return <span className={`label inline-flex items-center rounded-[4px] border border-dashed border-ink-3/50 px-1.5 py-0.5 !text-[0.62rem] !tracking-[0.14em] text-ink-3 ${className}`}>{children}</span>
}

export function Card({ children, className = '', as: As = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' | 'li' }) {
  return <As className={`rounded-[12px] border border-line bg-surface shadow-1 ${className}`}>{children}</As>
}

export function EmptyState({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-line-2 bg-paper/60 px-6 py-12 text-center">
      {icon && <div className="mb-3 text-ink-3" aria-hidden>{icon}</div>}
      <p className="font-semibold text-ink">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-ink-2">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Field({ label, hint, error, children, required, htmlFor }: { label: string; hint?: string; error?: string; children: ReactNode; required?: boolean; htmlFor: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[0.84rem] font-semibold text-ink">
        {label}{required && <span className="text-danger" aria-hidden> *</span>}
      </label>
      {children}
      {hint && !error && <p id={`${htmlFor}-hint`} className="text-xs text-ink-3">{hint}</p>}
      {error && <p id={`${htmlFor}-err`} className="text-xs font-semibold text-danger" role="alert">{error}</p>}
    </div>
  )
}

export function TextInput({ label, hint, error, required, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={id}>
      <input id={id} className="field" required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} {...rest} />
    </Field>
  )
}
export function TextArea({ label, hint, error, required, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string; error?: string }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={id}>
      <textarea id={id} className="field" required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} {...rest} />
    </Field>
  )
}
export function SelectInput({ label, hint, error, required, options, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; hint?: string; error?: string; options: { value: string; label: string }[] }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={id}>
      <select id={id} className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%234a5257%22 stroke-width=%222.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:12px] bg-[right_0.8rem_center] bg-no-repeat pr-9" required={required} aria-invalid={!!error} {...rest}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  )
}

/** Grupo de opciones tipo segmento (radio accesible). */
export function Segmented<T extends string>({ label, value, onChange, options, dark = false, size = 'md', hideLabel = false }: {
  label: string; value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode; disabled?: boolean; title?: string }[]; dark?: boolean; size?: 'sm' | 'md'; hideLabel?: boolean
}) {
  const name = useId()
  return (
    <fieldset className="min-w-0">
      <legend className={`mb-2 text-[0.8rem] font-semibold ${hideLabel ? 'sr-only' : ''} ${dark ? 'text-fog-2' : 'text-ink-2'}`}>{label}</legend>
      <div className={`flex flex-wrap gap-1 rounded-[9px] p-1 ${dark ? 'bg-white/6 border border-white/10' : 'bg-paper-2 border border-line'}`}>
        {options.map((o) => {
          const active = o.value === value
          return (
            <label key={o.value} title={o.title} className={`relative flex-1 cursor-pointer ${o.disabled ? 'pointer-events-none opacity-40' : ''}`}>
              <input type="radio" name={name} value={o.value} checked={active} disabled={o.disabled} onChange={() => onChange(o.value)} className="peer sr-only" />
              <span className={`flex items-center justify-center gap-1.5 rounded-[6px] px-3 text-center font-semibold transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-green-deep ${size === 'sm' ? 'min-h-8 text-[0.78rem]' : 'min-h-10 text-[0.84rem]'} ${active
                ? dark ? 'bg-white text-night' : 'bg-surface text-ink shadow-1'
                : dark ? 'text-fog-2 hover:text-white' : 'text-ink-2 hover:text-ink'}`}>
                {o.label}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Stat({ label, value, to, hint }: { label: string; value: ReactNode; to?: string; hint?: string }) {
  const body = (
    <>
      <p className="label text-ink-3">{label}</p>
      <p className="tnum mt-2 text-3xl font-extrabold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-2">{hint}</p>}
    </>
  )
  return to
    ? <Link to={to} className="block rounded-[12px] border border-line bg-surface p-4 shadow-1 transition-colors hover:border-ink-3">{body}</Link>
    : <div className="rounded-[12px] border border-line bg-surface p-4 shadow-1">{body}</div>
}

export function PageHeader({ eyebrow, title, text, actions }: { eyebrow?: string; title: string; text?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
        <h1 className="h-section text-[1.7rem] md:text-[2.1rem]">{title}</h1>
        {text && <div className="lede mt-2 max-w-2xl text-[0.95rem] text-ink-2">{text}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function Notice({ children, tone = 'info', title, className = '' }: { children: ReactNode; tone?: 'info' | 'warn' | 'green' | 'neutral'; title?: string; className?: string }) {
  const t = { info: 'border-info/25 bg-info-soft text-info', warn: 'border-warn/25 bg-warn-soft text-warn', green: 'border-green/35 bg-green-soft text-green-deep', neutral: 'border-line bg-paper-2 text-ink-2' }[tone]
  return (
    <div className={`rounded-[10px] border px-4 py-3 text-[0.86rem] ${t} ${className}`} role="note">
      {title && <p className="font-bold">{title}</p>}
      <div className={title ? 'mt-0.5' : ''}>{children}</div>
    </div>
  )
}
