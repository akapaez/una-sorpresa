import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'outline-dark' | 'ghost-dark' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base = 'inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap select-none transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out disabled:opacity-45 disabled:pointer-events-none active:translate-y-px'
const sizes: Record<Size, string> = {
  sm: 'min-h-9 px-3 text-[0.82rem] rounded-[6px]',
  md: 'min-h-11 px-4.5 text-[0.9rem] rounded-[8px]',
  lg: 'min-h-13 px-6 text-[0.95rem] rounded-[10px]',
}
const variants: Record<Variant, string> = {
  // Verde Deken con texto grafito (7,97:1). Nunca blanco sobre verde.
  primary: 'bg-green text-[#1F2224] hover:bg-[#86c63e] shadow-[inset_0_-1px_0_rgb(0_0_0/0.12)]',
  dark: 'bg-[#383E42] text-white hover:bg-[#22272A]', // «gd-btn--oscuro» del kit web
  outline: 'border border-line-2 bg-surface text-ink hover:border-ink-3 hover:bg-paper',
  ghost: 'text-ink hover:bg-paper-2',
  'outline-dark': 'border border-white/25 text-white hover:border-white/60 hover:bg-white/5',
  'ghost-dark': 'text-white/85 hover:text-white hover:bg-white/8',
  danger: 'border border-danger/40 text-danger bg-surface hover:bg-danger-soft',
}

export interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  to?: string
  href?: string
  icon?: ReactNode
  iconRight?: ReactNode
  download?: string
}

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = 'primary', size = 'md', to, href, icon, iconRight, className = '', children, download, ...rest }, ref,
) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  const inner = <>{icon}{children}{iconRight}</>
  // onClick también en enlaces (p. ej. cambiar el modo de demo antes de navegar)
  const onClick = rest.onClick as unknown as MouseEventHandler<HTMLAnchorElement> | undefined
  if (to) return <Link to={to} className={cls} onClick={onClick} aria-label={rest['aria-label']}>{inner}</Link>
  if (href) return <a href={href} className={cls} download={download} onClick={onClick} aria-label={rest['aria-label']}>{inner}</a>
  return <button ref={ref} type={rest.type ?? 'button'} className={cls} {...rest}>{inner}</button>
})
