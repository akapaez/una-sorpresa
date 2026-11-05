import { useId, useState } from 'react'
import { asset } from '@/lib/asset'

/** Comparador antes/después con control accesible (range) y arrastre. */
export function CompareSlider({ a, b, labelA, labelB, alt, className = '' }: { a: string; b: string; labelA: string; labelB: string; alt: string; className?: string }) {
  const [v, setV] = useState(52)
  const id = useId()
  return (
    <div className={`relative select-none overflow-hidden ${className}`}>
      <img src={asset(b)} alt={`${alt} — ${labelB}`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
        <img src={asset(a)} alt={`${alt} — ${labelA}`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${v}%` }} aria-hidden>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white/85" />
        <div className="absolute top-1/2 -ml-5 -mt-5 grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-night/80 text-white backdrop-blur">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6-6 6 6 6M15 6l6 6-6 6" /></svg>
        </div>
      </div>
      <span className="label absolute left-3 top-3 rounded-[4px] bg-night/75 px-2 py-1 !text-[0.62rem] text-white">{labelA}</span>
      <span className="label absolute right-3 top-3 rounded-[4px] bg-night/75 px-2 py-1 !text-[0.62rem] text-white">{labelB}</span>
      <label htmlFor={id} className="sr-only">Desplazar comparación entre {labelA} y {labelB}</label>
      <input id={id} type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
    </div>
  )
}
