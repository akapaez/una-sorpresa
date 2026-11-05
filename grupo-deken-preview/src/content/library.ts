import type { LibraryDoc } from '@/demo/types'

/**
 * Resúmenes de documentación Schüco aportada en Drive (origin 'schueco'). Redactados en español
 * con referencia de página; el PDF original no se publica con la web.
 */
const SCHUECO_DOCS: LibraryDoc[] = [
  {
    id: 'sc-ct70', slug: 'schueco-ct-70-informacion-tecnica', kind: 'ficha', title: 'Schüco CT 70 · información técnica',
    description: 'Resumen del catálogo de pedidos y fabricación CT 70 / CT 70 Accent (2026-09) y del folleto CT 70 Classic.',
    category: 'Fichas técnicas', products: ['Schüco CT 70'], manufacturer: 'Schüco', language: 'en', version: '75455 · 2026-09', date: '2026-09-01',
    visibility: 'profesional', status: 'publicado', origin: 'schueco', sourceFile: 'Catalogos/Schüco CT 70 Schüco CT 70 Accent -Catalogo.pdf', readingMinutes: 3,
    sections: [
      { id: 'dimensiones', title: 'Dimensiones (catálogo, p. 13)', body: ['Profundidad de marco: 70 mm (Classic), 70 mm (Rondo), 112 mm (Accent).', 'Profundidad de hoja: 70 mm (Classic), 78 mm (Rondo), 70 mm (Accent).', 'Espesor de vidrio posible: de 4 a 42 mm.'] },
      { id: 'ensayos', title: 'Ensayos y normas (catálogo, p. 13)', body: ['Uf = 1,3 W/(m²K) según DIN EN 12412-2.', 'Aislamiento acústico Rw,P máximo de 47 dB (DIN EN ISO 140-3), según perfil y vidrio.', 'Resistencia a la efracción RC 2 (DIN EN 1627).', 'Permeabilidad al aire clase 4 · estanqueidad al agua clase 9A · resistencia al viento clase B5 (según perfil y vidrio) · esfuerzo mecánico clase 4 · durabilidad clase 2 · fuerzas de maniobra clase 1.'] },
      { id: 'tipos', title: 'Tipos de elemento (catálogo, p. 14)', body: ['Ventanas y balconeras de una o varias hojas, balconeras con umbral, puertas de servicio y puertas de entrada.'] },
      { id: 'folleto', title: 'Folleto CT 70 Classic', body: ['Cinco cámaras de aislamiento, 70 mm de profundidad y dos planos de junta perimetrales (p. 4).', 'Refuerzos de acero con protección anticorrosión en marco y hoja (p. 4).', 'Hasta 49 dB con vidrio acústico y Uf «hasta 1,2 W/(m²K)» según el folleto (pp. 7 y 15). El catálogo técnico de 2026 indica Uf = 1,3 W/(m²K): prevalece el catálogo técnico salvo indicación de Deken.', 'Más de 300 superficies y umbral sin barreras para balconeras (p. 15).'] },
      { id: 'condiciones', title: 'Cómo leer estos valores', body: ['Son valores del fabricante para configuraciones ensayadas. Uf es la transmitancia del marco, no la de la ventana (Uw), que depende del vidrio y de la medida.'] },
    ],
  },
  {
    id: 'sc-living', slug: 'schueco-living-classic', kind: 'ficha', title: 'Schüco LivIng Classic · resumen del folleto',
    description: 'Sistema de 82 mm y 7 cámaras: versiones 82 AS y 82 MD, valores Uf, acústica y seguridad.',
    category: 'Fichas técnicas', products: ['Schüco LivIng'], manufacturer: 'Schüco', language: 'en', version: 'folleto', date: '2026-11-05',
    visibility: 'profesional', status: 'publicado', origin: 'schueco', sourceFile: 'Folletos/Living-Folleto.pdf', readingMinutes: 2,
    sections: [
      { id: 'sistema', title: 'Sistema (pp. 8–9)', body: ['Profundidad de 82 mm y perfil de 7 cámaras.', 'LivIng Classic 82 AS: dos planos de junta, Uf desde 1,0 W/(m²K).', 'LivIng Classic 82 MD: tres planos de junta, Uf desde 0,96 W/(m²K).', 'Vidrios aislantes y especiales de 16 a 54 mm.'] },
      { id: 'confort', title: 'Acústica y juntas (pp. 4–5)', body: ['Hasta 47 dB combinando el sistema con vidrio acústico.', 'Juntas de alta recuperación de forma para mantener la estanqueidad con el uso.'] },
      { id: 'seguridad', title: 'Seguridad (p. 7)', body: ['Herrajes con cierres de seta y acero; con vidrio de seguridad adicional se alcanza la clase RC 2.'] },
      { id: 'diseno', title: 'Diseño (pp. 10–12)', body: ['Gama Schüco UnlimitedFinish con más de 300 colores lisos, metalizados y maderas; colores distintos por dentro y por fuera.', 'Disponible también en PVC gris en masa.'] },
    ],
  },
  {
    id: 'sc-focusing', slug: 'schueco-focusing', kind: 'ficha', title: 'Schüco FocusIng · resumen del folleto',
    description: 'Sistema lineal de 70/76 mm con núcleo de hasta un 50 % de material reciclado.',
    category: 'Fichas técnicas', products: ['Schüco FocusIng'], manufacturer: 'Schüco', language: 'en', version: 'folleto', date: '2026-11-05',
    visibility: 'profesional', status: 'publicado', origin: 'schueco', sourceFile: 'Folletos/Focussing-Folleto.pdf', readingMinutes: 2,
    sections: [
      { id: 'sistema', title: 'Sistema (pp. 3 y 14)', body: ['Profundidad de 70 o 76 mm, construcción de 5/6 cámaras y dos juntas.', 'Vidrios de 10 a 54 mm.', 'Uf desde 1,1 W/(m²K).', 'El cuadro de ventajas (p. 19) indica Uw < 0,80 W/(m²K) sin precisar la configuración ensayada.'] },
      { id: 'confort', title: 'Acústica y seguridad (pp. 13 y 15)', body: ['Hasta 48 dB con vidrio acústico.', 'RC 2 con vidrio de seguridad adicional.'] },
      { id: 'sostenibilidad', title: 'Sostenibilidad (pp. 3 y 9)', body: ['Núcleo con hasta un 50 % de PVC reciclado y capa exterior de PVC primario.', 'Sello Vinyl verified de VinylPlus®.'] },
    ],
  },
  {
    id: 'sc-softslide', slug: 'schueco-softslide', kind: 'ficha', title: 'Schüco SoftSlide · información técnica',
    description: 'Resumen del catálogo de pedidos y fabricación (09.2023): dimensiones, ensayos y rodillos.',
    category: 'Fichas técnicas', products: ['Schüco SoftSlide'], manufacturer: 'Schüco', language: 'es', version: '09.2023', date: '2023-09-01',
    visibility: 'profesional', status: 'publicado', origin: 'schueco', sourceFile: 'Catalogos/Softslide-Catalogo.pdf', readingMinutes: 2,
    sections: [
      { id: 'dimensiones', title: 'Dimensiones (B1, p. 11)', body: ['Profundidad de marco 74 mm y de hoja 50 mm.', 'Espesor de acristalamiento de 4 a 28 mm.'] },
      { id: 'ensayos', title: 'Ensayos (B1, p. 11)', body: ['Uf entre 1,4 y 2,3 W/(m²K) según perfil (DIN EN 12412-2).', 'Permeabilidad al aire clase 4 · estanqueidad al agua clase 6A · viento clase B3 · esfuerzo mecánico clase 4 · durabilidad clase 2 · fuerzas de maniobra clase 1.'] },
      { id: 'rodillos', title: 'Rodillos (B2)', body: ['Rodillos de 50 kg (no regulables) y de 120 kg, regulables en altura de −1,5 a +5,5 mm.'] },
    ],
  },
  {
    id: 'sc-otros', slug: 'otros-sistemas-documentados', kind: 'ficha', title: 'Otros sistemas documentados: LivIng Alu Inside, Corona S 150 y TopAlu',
    description: 'Documentación aportada de sistemas que no figuran en la web actual de Deken. Disponibilidad por confirmar.',
    category: 'Fichas técnicas', products: ['Schüco LivIng Alu Inside', 'Schüco Corona S 150', 'Schüco TopAlu'], manufacturer: 'Schüco', language: 'de', version: 'varios', date: '2026-11-05',
    visibility: 'interno', status: 'revision', origin: 'schueco', readingMinutes: 2,
    sections: [
      { id: 'alu-inside', title: 'LivIng Alu Inside (folleto, pp. 4–9)', body: ['82 mm y 7 cámaras sin refuerzo de acero: la rigidez la aporta un compuesto de aluminio.', 'Uf desde 0,79 W/(m²K), tres planos de junta, vidrios de 16 a 54 mm, hasta 46 dB y RC 2 con vidrio de seguridad.'] },
      { id: 's150', title: 'Corona S 150 (catálogo 12.2011, K1)', body: ['Corredera basada en Corona CT 70 AS; hoja de 70 mm; vidrios hasta 40 mm; hojas de hasta 250 kg; ancho visto total 164 mm. Edición antigua.'] },
      { id: 'topalu', title: 'TopAlu (catálogo 11.2016, pp. 8–9)', body: ['Tapas exteriores de aluminio para LivIng, Alu Inside SI 82, Corona SI 82, Corona CT 70 AS, ThermoSlide SI 82 y EasySlide CT 70.', 'Lacado RAL, SIKKENS o NCS, acabados decorativos y anodizados.'] },
      { id: 'decision', title: 'Pendiente', body: ['[Revisar] Confirmar con Deken si estos sistemas forman parte de su oferta antes de publicarlos.'] },
    ],
  },
]

/**
 * Documentos y guías CREADOS PARA LA DEMO. No proceden de catálogos Schüco ni de
 * documentación técnica de Deken (aún no aportada). Cuando se aporten archivos reales,
 * sustituir aquí o en el futuro servicio de contenidos (ver docs/SIGUIENTE_FASE.md).
 */
export const LIBRARY_SEED: LibraryDoc[] = [
  ...SCHUECO_DOCS,
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
