# Referencias y recursos

Registro de lo consultado, lo usado y sus condiciones. Primera consulta: 4 de noviembre de 2026. Actualizado el 5 de noviembre de 2026 con la carpeta de Google Drive «DEKEN» y una segunda revisión de grupodeken.es.

## 1. Web actual de Grupo Deken — https://grupodeken.es/

Revisión real con navegador headless (Playwright/Chromium) en 1440×900 y 390×844, más extracción de texto.

**Observado visualmente:** cabecera con logotipo verde «GRUPO DEKEN» y sello Schüco; hero claro con degradado verde suave, titular grande en negro y verde, ventana ilustrada en blanco; aviso de cookies superpuesto; menú de anclas (El problema, Catálogo, Cómo funciona, Profesionales) y CTA de WhatsApp. En la captura de página completa aparecen grandes zonas vacías: lo más probable es que sean animaciones de aparición por scroll que no se disparan en una captura completa. **No se diagnostica como error.**

**Extraído como texto (no verificado):** «Distribuidor oficial Schüco · Sevilla», «Hasta 52 dB», «Clasificación A++», «Más de 15 años», «desde 2009», tres testimonios sin nombre, contadores «0+» (valor inicial de animación en el HTML), teléfono de WhatsApp, menciones a CT 70, LivIng, SoftSlide, FocusIng y Elevadoras, y un texto «Preparado para sustituirlo por el catálogo real del cliente».

**Segunda revisión (5/11/2026), portada y `catalogo.php`:** ficha por serie (CT-70, SoftSlide, LivIng, FocusIng, Elevadoras con LivIngSlide 194/82 mm y FocusIngSlide 167/70 mm), siete tipologías, gama de acabados (blanco, gris antracita, negro texturizado, roble dorado, nogal, roble oscuro, antracita madera, bicolor), proceso en tres pasos, cuatro preguntas frecuentes y WhatsApp 626 01 92 09.

**Uso en la previsualización:**
- Se adaptan (reescritos): posicionamiento B2B, preguntas frecuentes (página de contacto), proceso, gama de acabados, lista de series y tipologías, y el teléfono de WhatsApp como texto (sin enlace activo).
- Las cifras de series se toman **de la documentación Schüco** de Drive. Solo las elevadoras usan cifras de la web de Deken, marcadas «según web Deken; sin contrastar», porque su catálogo no se pudo leer.
- Coincidencias comprobadas: CT 70 Uf 1,2 y 49 dB (folleto Classic), SoftSlide 74/50 mm y 4–28 mm, LivIng 82 mm / 7 cámaras / 47 dB, FocusIng 70/76 mm / 48 dB.
- **No se reutilizan:** «Hasta 52 dB» y «A++» (ningún documento aportado los respalda; el máximo documentado es 49 dB), «15 años de garantía», «desde 2009», «Más de 15 años», los testimonios y el sello «Distribuidor oficial Schüco» (pendiente de que Deken lo confirme).

## 2. 21st.dev — https://21st.dev/

**Condiciones comprobadas** (https://21st.dev/terms y https://21st.dev/pricing.md):
- Cada componente tiene su propia licencia indicada en su página (MIT, «no-license», «unknown»…). No hay una condición única para todo el catálogo.
- El plan gratuito permite 2 copias al día con cuenta; la copia ilimitada requiere suscripción, y la instalación por CLI pide una clave de API.
- Los términos prohíben el scraping y la reutilización de las demos, capturas y medios del marketplace.

**Decisión:** no se ha copiado código, demos ni medios de 21st.dev. Se tomaron **ideas de composición y comportamiento** de una selección breve y se implementaron de forma original con el sistema visual de Deken (tokens propios, Montserrat + IBM Plex Mono, verde como único acento). Consulté pocas páginas, a mano, sin automatización masiva.

| # | Referencia (URL exacta) | Licencia indicada | Idea que aporta | Dónde se adapta | Nivel de revisión |
|---|---|---|---|---|---|
| 1 | https://21st.dev/@arunachalam/components/scroll-expansion-hero | MIT | Hero que se transforma con el scroll | Secuencia fijada de la portada (escenas guiadas por scroll con salida a sección clara) | Descripción y dependencias (next, framer-motion). Sin leer el código |
| 2 | https://21st.dev/@dhxwhy/components/spotlight-comparison-table | MIT | Columna resaltada y filtro «mostrar diferencias» | Comparador: «Solo diferencias», filas que difieren marcadas | Descripción. Requiere clave de API para instalar |
| 3 | https://21st.dev/@isaiahbjork/components/spec-sheet | no-license | Hoja de especificaciones de hasta 3 variantes, apilada en móvil | Comparador (hasta 3 opciones) | Descripción. **Sin licencia**: solo inspiración |
| 4 | https://21st.dev/@0xuser64bit/components/image-compare | MIT | Comparador antes/después con divisor arrastrable y control por range | `CompareSlider` de acabados en la portada | Descripción |
| 5 | https://21st.dev/@anubra266/components/steps/steps-progress | unknown | Pasos con progreso | Asesor guiado y asistente de importación | Superficial (la página no describe el comportamiento) |
| 6 | https://21st.dev/@arihantcodes_1f7b8c4d/components/conversation-list | MIT | Lista de conversaciones con cambio de hilo | Mensajes (cliente y Deken) | Descripción |
| 7 | https://21st.dev/@andrewlu0/components/pdf-viewer | MIT | Visor de documentos | Lectura de documentos de la biblioteca (resuelto como vista HTML + PDF descargable, sin react-pdf) | Descripción |
| 8 | https://21st.dev/@arihantcodes_1f7b8c4d/components/audit-log-table | MIT | Tabla densa de actividad | Actividad de pedidos y tablas del panel Deken | Descripción |
| 9 | https://21st.dev/@0xUrvish/components/expandable-gallery | MIT | Galería con elementos que se expanden | Tipologías de la portada (imágenes grandes con escala y glifo de apertura al pasar) | Superficial |

Una décima candidata (`@easemize/components/limelight-nav`) devolvió 404 y se descartó.

## 3. Skills

| Skill | Estado | Uso |
|---|---|---|
| `anthropic-skills:estilo-de-marca` | **Disponible y leída.** | Fuente de los valores de marca: verde `#76B82A`, gris `#383E42`, neutros oscuros derivados, regla «nunca blanco sobre verde» (2,42:1), Montserrat + IBM Plex Mono para etiquetas, ritmo `cubic-bezier(0.16,1,0.3,1)`, cámara que «empuja poco». Está pensada para vídeos (Remotion); se trasladaron sus reglas de aspecto a la web. Sus rutas de recursos (`Deken-Recursos/…`) **no existen** en este entorno: no hay logotipos ni `.ttf` disponibles. |
| `anthropic-skills:animaciones-para-reels` | Disponible, no aplicada | Es para clips de Remotion, no para web. |
| `design:accessibility-review`, `design:design-critique` | Disponibles, no invocadas | Las comprobaciones de accesibilidad se hicieron directamente (ver `REVISION_PREVISUALIZACION.md`). |
| Navegador | Playwright + Chromium preinstalados | Capturas, recorridos y generación de imágenes. Sin GPU: WebGL por SwiftShader (CPU). |

No se instaló ninguna skill externa ni se hizo ninguna modificación global.

## 4. Documentación técnica consultada

### 4.1 Carpeta de Google Drive «DEKEN» (aportada por Cristian)

| Documento | Lectura | Uso |
|---|---|---|
| Folletos/CT70-Classic-FOLLETO.pdf (alemán) | Completa | Ficha CT 70: 5 cámaras, 2 juntas, acero, RC 2, 49 dB, Uf ≤ 1,2, > 300 superficies. |
| Folletos/CT70-Rondo-Folleto.pdf (alemán, edición antigua) | Completa | Contexto de la variante Rondo (no se usan cifras propias). |
| Folletos/Living-Folleto.pdf (inglés) | Completa | Ficha LivIng: 82 mm, 7 cámaras, AS Uf 1,0 / MD Uf 0,96, vidrio 16–54 mm, 47 dB, RC 2. |
| Folletos/Focussing-Folleto.pdf (inglés) | Completa | Ficha FocusIng: 70/76 mm, 5/6 cámaras, Uf 1,1, Uw < 0,80 (sin configuración), 48 dB, reciclado ≤ 50 %. |
| Folletos/Living-Aluside-Folleto.pdf (alemán) | Completa | Solo en biblioteca interna: no figura en la web de Deken. |
| Catalogos/Schüco CT 70 … Accent -Catalogo.pdf (inglés, 2026-09) | Parcial (texto extraído; se buscaron las páginas de características) | p. 13: profundidades, vidrio 4–42, Uf 1,3, Rw,P 47 dB, RC 2, clases 4 / 9A / B5. |
| Catalogos/Softslide-Catalogo.pdf (español, 09.2023) | Parcial (características B1–B2) | 74/50 mm, vidrio 4–28, Uf 1,4–2,3, clases 4 / 6A / B3, rodillos 50/120 kg. |
| Catalogos/150-Catalogo.pdf (Corona S 150, 2011) | Parcial (K1) | Solo biblioteca interna. |
| Catalogos/Acabados-Catalogo.pdf | Parcial | Es el catálogo **Schüco TopAlu** (tapas de aluminio), no una carta de colores. |
| Catalogos/FocusIng-Catalogo.pdf, LivingSlide-Catalogo.pdf, living-catalogo.pdf | **No leídos** | El conector devuelve texto vacío (PDF de imagen o demasiado grandes: 50, 70 y 150 MB). |
| DXF`s/ (~175 archivos) | «Seccion living.dxf» leído y convertido; resto inventariado | Sección real LivIng en el modelo 3D y en el corte. Pendiente identificar SoftSlide y elevadoras. |
| Recursos-Deken/grupo-deken-kit-web | Completa | Manual de marca, tokens, logotipos SVG oficiales y favicon. |

Los PDF originales **no se copian ni se publican**: la web cita título, edición y página. Las fichas son resúmenes redactados en español.

- React Three Fiber (v9, compatible con React 19.2), drei 10, Three.js r180.
- GSAP 3.15 con ScrollTrigger. Licencia estándar «no charge» de GSAP (https://gsap.com/standard-license), que permite este uso.
- Vite 7, React Router 7, Tailwind CSS 4, Zustand 5, jsPDF 4 (tipos revisados en `node_modules/jspdf/types`).
- Versiones mayores más recientes disponibles (Vite 8, React Router 8, TypeScript 7) **no se usaron**: dejé fijadas las últimas versiones de las líneas estables cuya API está verificada.

## 5. Dependencias y licencias

| Paquete | Versión | Licencia |
|---|---|---|
| react / react-dom | 19.2.9 | MIT |
| react-router | 7.18.5 | MIT |
| three | 0.180.0 | MIT |
| @react-three/fiber / drei | 9.8.2 / 10.7.9 | MIT |
| gsap | 3.15.1 | GSAP Standard License (sin coste) |
| zustand | 5.0.16 | MIT |
| jspdf | 4.2.1 | MIT |
| lucide-react | 0.577.0 | ISC |
| @fontsource/montserrat, @fontsource/ibm-plex-mono | 5.3.0 | OFL-1.1 (fuentes servidas desde el propio proyecto, sin Google Fonts ni cookies de terceros) |
| tailwindcss / @tailwindcss/vite | 4.3.4 | MIT |
| vite / @vitejs/plugin-react / typescript | 7.3.7 / 5.2.0 / 5.9.3 | MIT / MIT / Apache-2.0 |

## 6. Registro de activos

| Activo | Tipo | Notas |
|---|---|---|
| Modelo 3D de ventana (`src/three/*`) | **Sección real LivIng (DXF) + piezas genéricas** | Marco, hoja, junquillo, juntas y refuerzos extruidos desde el DXF de Deken. Manilla, bisagras y corredera siguen siendo aproximaciones. Las medidas del conjunto son de ejemplo. |
| Imágenes de producto (`public/renders/*.jpg`) | **Aproximación de demostración** | Generadas desde el mismo modelo con `scripts/render-posters.mjs`. No son fotografías ni obras de Deken. |
| Textura madera, granulado antracita, fondo de escena | Aproximación de demostración | Procedurales (canvas). No representan foils concretos. |
| Logotipo y favicon | **Oficial** (kit web de Deken en Drive) | SVG horizontal y monograma en `src/brand/svg/`, coloreados con `currentColor`; favicon y iconos de app generados desde `favicon.svg`. |
| Tipografías | Recurso de terceros (OFL) | Montserrat (500–800) vía @fontsource, según el manual de marca. |
| Iconos | Recurso de terceros (ISC) | lucide-react. |
| Fichas de series (`src/content/series.ts`) y resúmenes Schüco de la biblioteca | **Datos reales con fuente** | Cada valor con documento y página. |
| Guías, muestrario y plantillas (`src/content/library.ts`) | Contenido de demostración | Marcados como demo en título o metadatos. |
| Plantilla de importación (`public/samples/importacion-pedidos-EJEMPLO.csv`) | Archivo de demostración | Identificada como «no es el formato real de PrefSuite». |
| PDF descargables | Generados en el navegador | Todos llevan «DOCUMENTO DE DEMOSTRACIÓN» y marca de agua. |
| Fotografías propias de Deken | **Pendientes** | Cristian las aportará; huecos en `src/content/media.ts`. |
