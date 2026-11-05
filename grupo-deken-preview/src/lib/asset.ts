/**
 * Ruta de un archivo de public/ respetando la base de publicación
 * (raíz en local; p. ej. /una-sorpresa/deken/ en GitHub Pages).
 */
export const asset = (p: string) => (p.startsWith('/') ? import.meta.env.BASE_URL + p.slice(1) : p)
