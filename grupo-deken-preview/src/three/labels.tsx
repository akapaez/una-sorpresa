import { createContext, useContext, useEffect, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

/**
 * Etiquetas de piezas sin crear raíces React dentro del Canvas: cada etiqueta es un
 * elemento DOM en una capa superpuesta, posicionado por proyección en cada frame.
 */
export const LabelLayerContext = createContext<MutableRefObject<HTMLDivElement | null> | null>(null)

const v = new THREE.Vector3()

export function PartLabel({ position, text, opacityRef, align = 'right' }: {
  position: [number, number, number]
  text: string
  opacityRef: MutableRefObject<{ labels: number }>
  align?: 'left' | 'right'
}) {
  const layer = useContext(LabelLayerContext)
  const anchor = useRef<THREE.Group>(null)
  const el = useRef<HTMLDivElement | null>(null)
  const { camera, size } = useThree()

  useEffect(() => {
    const host = layer?.current
    if (!host) return
    const d = document.createElement('div')
    d.className = `part-label ${align === 'left' ? 'part-label--left' : ''}`
    d.setAttribute('aria-hidden', 'true')
    d.innerHTML = '<span class="part-label__dot"></span><span class="part-label__line"></span><span class="part-label__text"></span>'
    ;(d.querySelector('.part-label__text') as HTMLElement).textContent = text
    d.style.opacity = '0'
    d.style.visibility = 'hidden'
    host.appendChild(d)
    el.current = d
    return () => { d.remove(); el.current = null }
  }, [layer, text, align])

  useFrame(() => {
    const d = el.current
    if (!d || !anchor.current) return
    const o = opacityRef.current.labels
    if (o < 0.02) { d.style.visibility = 'hidden'; d.style.opacity = '0'; return }
    anchor.current.getWorldPosition(v)
    v.project(camera)
    const x = (v.x * 0.5 + 0.5) * size.width
    const y = (-v.y * 0.5 + 0.5) * size.height
    const behind = v.z > 1
    d.style.visibility = behind ? 'hidden' : 'visible'
    d.style.opacity = String(o)
    d.style.left = `${x}px`
    d.style.top = `${y}px`
  })

  return <group ref={anchor} position={position} />
}
