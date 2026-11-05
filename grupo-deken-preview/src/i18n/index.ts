/**
 * Textos de interfaz compartidos. Idioma de esta entrega: español de España.
 * Para añadir inglés o alemán: duplicar `es` como `en`/`de` y seleccionar el diccionario por
 * preferencia o ruta. El contenido editorial vive en src/content/* con la misma estructura.
 */
const es = {
  nav: {
    soluciones: 'Soluciones', fabricacion: 'Fabricación', conocimiento: 'Conocimiento', contacto: 'Contacto',
    acceso: 'Solicitar acceso profesional', espacio: 'Espacio profesional', panel: 'Panel Deken',
  },
  cta: { explorar: 'Explorar soluciones', acceso: 'Solicitar acceso profesional', presupuesto: 'Solicitar presupuesto', consulta: 'Consultar proyecto' },
  demo: {
    modo: 'Modo demostración',
    aviso: 'Previsualización para aprobación. Datos y acciones simulados; no es autenticación real.',
    reset: 'Restablecer demostración',
    roles: { visitante: 'Visitante', pendiente: 'Profesional pendiente', aprobado: 'Profesional aprobado', deken: 'Equipo Deken' },
  },
  common: { volver: 'Volver', guardar: 'Guardar', cancelar: 'Cancelar', descargar: 'Descargar', abrir: 'Abrir', cerrar: 'Cerrar', ver: 'Ver', enviar: 'Enviar' },
} as const

export const t = es
export type Dict = typeof es
