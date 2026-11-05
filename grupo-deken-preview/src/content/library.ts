import type { LibraryDoc } from '@/demo/types'

/**
 * Documentos y guías CREADOS PARA LA DEMO. No proceden de catálogos Schüco ni de
 * documentación técnica de Deken (aún no aportada). Cuando se aporten archivos reales,
 * sustituir aquí o en el futuro servicio de contenidos (ver docs/SIGUIENTE_FASE.md).
 */
export const LIBRARY_SEED: LibraryDoc[] = [
  {
    id: 'd1', slug: 'tipos-de-apertura', kind: 'guia', title: 'Tipos de apertura: cómo se mueve cada ventana',
    description: 'Practicable, oscilobatiente, corredera y elevadora explicadas por su movimiento y por el espacio que necesitan.',
    category: 'Elección de producto', products: ['Practicable', 'Oscilobatiente', 'Corredera', 'Elevadora'], manufacturer: 'Grupo Deken (demo)',
    language: 'es', version: '1.0', date: '2026-09-15', visibility: 'publico', status: 'publicado', origin: 'demo', readingMinutes: 4,
    sections: [
      { id: 'proposito', title: 'Para qué sirve esta guía', body: ['Antes de hablar de series o de vidrios conviene decidir cómo se va a abrir cada hueco. La apertura condiciona el espacio libre delante de la ventana, la ventilación y la limpieza.'] },
      { id: 'practicable', title: 'Practicable', body: ['La hoja gira sobre bisagras situadas en un lateral y abre hacia el interior. El marco permanece fijo.', 'Necesita espacio libre delante del hueco equivalente al ancho de la hoja. Es la opción más habitual en dormitorios y estancias con el frente despejado.'] },
      { id: 'oscilobatiente', title: 'Oscilobatiente', body: ['Combina dos movimientos con la misma manilla: giro lateral, como una practicable, y oscilación sobre un eje inferior, con la parte superior inclinada hacia dentro.', 'La oscilación permite ventilar sin invadir el espacio interior. La posición de la manilla indica el movimiento: hacia abajo cerrada, horizontal para girar y hacia arriba para oscilar.'] },
      { id: 'corredera', title: 'Corredera', body: ['Las hojas se desplazan en su propio plano sobre carriles. No ocupan espacio delante del hueco, por lo que se elige a menudo en salidas a terraza o donde hay mobiliario cerca.', 'En una corredera de dos hojas, el paso libre es aproximadamente la mitad del hueco.'] },
      { id: 'elevadora', title: 'Elevadora (corredera elevable)', body: ['La hoja se eleva ligeramente antes de deslizar y desciende al cerrar. Se plantea para grandes dimensiones.', 'La disponibilidad concreta y sus condiciones se confirman con la documentación técnica en cada proyecto.'] },
      { id: 'como-elegir', title: 'Cómo elegir', body: ['Pregúntate: ¿hay espacio delante del hueco?, ¿necesito ventilar con la ventana entreabierta?, ¿es un paso habitual a terraza?', 'Con esas respuestas, Deken revisa la solución y la serie más adecuadas para el proyecto.'] },
    ],
  },
  {
    id: 'd2', slug: 'preparar-consulta-de-proyecto', kind: 'guia', title: 'Cómo preparar una consulta de proyecto',
    description: 'Qué información ayuda a revisar un proyecto y cómo se organiza el suministro según la zona.',
    category: 'Presupuesto y suministro', products: [], manufacturer: 'Grupo Deken (demo)',
    language: 'es', version: '1.1', date: '2026-10-01', visibility: 'publico', status: 'publicado', origin: 'demo', readingMinutes: 3,
    sections: [
      { id: 'proposito', title: 'Para qué sirve esta guía', body: ['Una consulta completa evita idas y vueltas. Esta guía resume lo que suele necesitar el equipo técnico para una primera revisión.'] },
      { id: 'que-enviar', title: 'Qué enviar', body: ['Localidad de la obra y tipo de proyecto (obra nueva, rehabilitación, reforma).', 'Listado de huecos con medidas y unidades, o planos acotados.', 'Tipología de apertura deseada por hueco, si ya está decidida.', 'Acabados interior y exterior, si se conocen.'] },
      { id: 'formatos', title: 'Formatos', body: ['Un PDF acotado es suficiente para empezar. Si existen planos en formato CAD, también pueden aportarse.'] },
      { id: 'suministro', title: 'Zona de suministro', body: ['Deken trabaja con transporte propio habitual en Sevilla capital y provincia.', 'Los pedidos de otras zonas de España se estudian cuando el cliente organiza el transporte.'] },
      { id: 'siguiente', title: 'Siguiente paso', body: ['Envía la consulta desde la página de contacto o, si eres profesional aprobado, desde tu espacio profesional, adjuntando la configuración.'] },
    ],
  },
  {
    id: 'd3', slug: 'elegir-acabado', kind: 'guia', title: 'Criterios básicos para elegir acabado',
    description: 'Interior y exterior, coherencia con la fachada y por qué conviene ver una muestra física antes de decidir.',
    category: 'Elección de producto', products: ['Acabados'], manufacturer: 'Grupo Deken (demo)',
    language: 'es', version: '1.0', date: '2026-09-22', visibility: 'publico', status: 'publicado', origin: 'demo', readingMinutes: 3,
    sections: [
      { id: 'proposito', title: 'Para qué sirve esta guía', body: ['El acabado se decide pronto en muchos proyectos porque afecta a la fachada y a la licencia. Aquí tienes los criterios que suelen intervenir.'] },
      { id: 'interior-exterior', title: 'Interior y exterior', body: ['Es posible plantear un acabado distinto por cada cara: por ejemplo, exterior oscuro acorde con la fachada e interior blanco.', 'La combinación concreta y su disponibilidad se confirman en la propuesta.'] },
      { id: 'muestras', title: 'Pantalla frente a muestra física', body: ['Los colores de la pantalla son orientativos. Para decidir, pide una muestra física o la referencia de color correspondiente.'] },
      { id: 'siguiente', title: 'Siguiente paso', body: ['Prueba combinaciones en el configurador visual y guarda la que quieras consultar.'] },
    ],
  },
  {
    id: 'd4', slug: 'ficha-muestra-ejemplo-a', kind: 'ficha', title: 'Ficha de muestra · Ejemplo A (practicable) — DEMO',
    description: 'Documento ficticio para revisar la maqueta de una ficha técnica. Sus valores no corresponden a ningún producto real.',
    category: 'Fichas técnicas', products: ['Ejemplo A'], manufacturer: 'Producto genérico de demostración',
    language: 'es', version: '0.1-demo', date: '2026-10-10', visibility: 'profesional', status: 'publicado', origin: 'demo', readingMinutes: 2,
    sections: [
      { id: 'aviso', title: 'Aviso', body: ['Documento de demostración. Los valores numéricos son ficticios y solo sirven para comprobar el diseño de la ficha y del comparador.'] },
      { id: 'descripcion', title: 'Descripción', body: ['Ventana practicable de una o dos hojas, apertura interior.'] },
      { id: 'prestaciones', title: 'Prestaciones (valores ficticios)', body: ['Uf (marco): 1,2 W/m²K — valor ficticio de maqueta.', 'Ug (vidrio): 1,0 W/m²K — valor ficticio, depende de la composición.', 'Uw (ventana): 1,3 W/m²K — valor ficticio para una medida de referencia.'] },
      { id: 'condiciones', title: 'Condiciones', body: ['En una ficha real, cada valor deberá indicar fuente, ensayo o cálculo, medida de referencia y composición.'] },
    ],
  },
  {
    id: 'd5', slug: 'muestrario-acabados-demo', kind: 'muestrario', title: 'Muestrario de acabados de demostración',
    description: 'Blanco, antracita y madera tal como se representan en el configurador. No son códigos oficiales de color.',
    category: 'Acabados', products: ['Acabados'], manufacturer: 'Grupo Deken (demo)',
    language: 'es', version: '0.2-demo', date: '2026-10-12', visibility: 'profesional', status: 'publicado', origin: 'demo', readingMinutes: 2,
    sections: [
      { id: 'muestras', title: 'Muestras representadas', body: ['Blanco: muestra visual de referencia.', 'Antracita: muestra visual; el código de color se confirmará con la documentación de Deken.', 'Madera: textura generada para la demo; no representa un foil concreto.'] },
      { id: 'uso', title: 'Uso', body: ['Las muestras sirven para comparar composición y contraste. La elección final requiere muestra física.'] },
    ],
  },
  {
    id: 'd6', slug: 'plantilla-hoja-medidas', kind: 'plantilla', title: 'Plantilla de hoja de medidas (demo)',
    description: 'Estructura propuesta para enviar huecos, unidades, tipología y acabado en una sola tabla.',
    category: 'Presupuesto y suministro', products: [], manufacturer: 'Grupo Deken (demo)',
    language: 'es', version: '0.3-demo', date: '2026-10-18', visibility: 'profesional', status: 'publicado', origin: 'demo', readingMinutes: 1,
    sections: [
      { id: 'columnas', title: 'Columnas', body: ['Referencia de hueco · Planta · Ancho (mm) · Alto (mm) · Unidades · Tipología · Hojas · Acabado interior · Acabado exterior · Vidrio · Observaciones.'] },
      { id: 'medidas', title: 'Medidas', body: ['Las medidas que introduce el profesional quedan pendientes de revisión técnica por Deken.'] },
    ],
  },
  {
    id: 'd8', slug: 'muster-datenblatt-beschlag', kind: 'ficha', title: 'Muster-Datenblatt Beschlag (Demo)',
    description: 'Documento de muestra en alemán para probar el filtro de idioma. Resumen en español en la interfaz.',
    category: 'Herrajes', products: ['Herraje'], manufacturer: 'Proveedor de herrajes (ejemplo)',
    language: 'de', version: '0.1-demo', date: '2026-08-30', visibility: 'profesional', status: 'publicado', origin: 'demo', readingMinutes: 2,
    sections: [
      { id: 'hinweis', title: 'Hinweis', body: ['Demonstrationsdokument. Keine realen Produktdaten.'] },
      { id: 'resumen-es', title: 'Resumen (es)', body: ['Documento original en alemán de un proveedor ficticio de herrajes. Se conserva el título y la terminología original; la interfaz y las respuestas se redactan en español.'] },
    ],
  },
  {
    id: 'd7', slug: 'nota-interna-revision', kind: 'nota', title: 'Nota interna demo: revisión documental antes de fabricar',
    description: 'Procedimiento interno de ejemplo. Visible solo para el equipo Deken.',
    category: 'Interno', products: [], manufacturer: 'Grupo Deken (demo)',
    language: 'es', version: '0.1-demo', date: '2026-10-05', visibility: 'interno', status: 'publicado', origin: 'demo', readingMinutes: 1,
    sections: [
      { id: 'pasos', title: 'Pasos', body: ['Confirmar medidas con el cliente.', 'Verificar tipología y sentido de apertura por hueco.', 'Registrar la versión de propuesta aplicada.'] },
    ],
  },
  {
    id: 'd9', slug: 'checklist-documentacion-presupuesto', kind: 'guia', title: 'Checklist: qué enviar para pedir presupuesto',
    description: 'Borrador generado a partir de preguntas recurrentes. Pendiente de revisión humana.',
    category: 'Presupuesto y suministro', products: [], manufacturer: 'Grupo Deken (demo)',
    language: 'es', version: 'borrador', date: '2026-11-03', visibility: 'publico', status: 'borrador', origin: 'demo', fromCluster: 'qc1', readingMinutes: 2,
    sections: [
      { id: 'proposito', title: 'Para qué sirve', body: ['Resumir en una lista lo que conviene enviar para recibir una propuesta sin retrasos.'] },
      { id: 'lista', title: 'Lista', body: ['Localidad de la obra.', 'Planos acotados en PDF o listado de huecos con medidas.', 'Unidades por tipo de hueco.', 'Tipología de apertura (si está decidida).', 'Acabado interior y exterior (si se conoce).', 'Fotos del hueco existente en reformas.'] },
      { id: 'medidas', title: '¿Quién mide?', body: ['[Revisar] Confirmar con el equipo cómo se gestionan las medidas definitivas antes de fabricar.'] },
      { id: 'siguiente', title: 'Siguiente paso', body: ['Enviar la consulta desde contacto o desde el espacio profesional.'] },
    ],
  },
]
