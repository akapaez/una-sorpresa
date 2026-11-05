import { type MutableRefObject } from 'react'
import { Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { SectionModel, type SectionMotion } from './SectionModel'
import type { FinishId } from './windowSpec'

/** Iluminación de estudio para el corte de sección (objeto pequeño, ~16 cm). */
export function SectionScene({ motionRef, finish = 'blanco', interactive = true, labels = true, narrow = false }: {
  motionRef: MutableRefObject<SectionMotion>; finish?: FinishId; interactive?: boolean; labels?: boolean; narrow?: boolean
}) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[0.6, 0.8, 1.2]} intensity={2.4} color="#fff8ef" />
      <directionalLight position={[-1, 0.4, -0.6]} intensity={1.2} color="#dfe9f0" />
      <Environment resolution={128} frames={1}>
        <color attach="background" args={['#050606']} />
        <Lightformer form="rect" intensity={3} position={[-2, 1.5, 2]} rotation={[0, Math.PI / 4, 0]} scale={[2, 3, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[2, 1, 1.5]} rotation={[0, -Math.PI / 3, 0]} scale={[0.4, 3, 1]} color="#e9f0f4" />
        <Lightformer form="rect" intensity={0.8} position={[0, -1, 2]} rotation={[0, Math.PI, 0]} scale={[3, 0.3, 1]} color="#b9dc8e" />
      </Environment>
      <SectionModel motionRef={motionRef} finish={finish} labels={labels} narrow={narrow} />
      {interactive && <OrbitControls enablePan={false} enableZoom minDistance={0.22} maxDistance={0.75} target={[0, 0.02, -0.04]} minPolarAngle={0.6} maxPolarAngle={2.3} />}
    </>
  )
}
