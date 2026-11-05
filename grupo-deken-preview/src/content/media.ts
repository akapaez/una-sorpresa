/**
 * Huecos de imagen de la web pública.
 * Mientras no lleguen fotografías propias de Deken, se usan renders del modelo de demostración
 * (provisional: true). Para sustituirlos: copiar la foto a public/media/ y cambiar src aquí.
 * No atribuir nunca imágenes de terceros a obras, clientes o instalaciones de Deken.
 */
export interface MediaSlot { src: string; alt: string; provisional: boolean; note: string }

export const MEDIA: Record<'obra', MediaSlot> = {
  obra: {
    src: '/renders/cierre.jpg',
    alt: 'Ventana de PVC antracita abierta (visual de demostración)',
    provisional: true,
    note: 'Imagen provisional generada con el modelo de demostración · se sustituirá por fotografía de obra de Deken',
  },
}
