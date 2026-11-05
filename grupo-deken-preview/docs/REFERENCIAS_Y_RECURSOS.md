# Referencias y recursos

Registro de lo consultado, lo usado y sus condiciones. Fecha de consulta: 4 de noviembre de 2026.

## 1. Web actual de Grupo Deken — https://grupodeken.es/

Revisión real con navegador headless (Playwright/Chromium) en 1440×900 y 390×844, más extracción de texto.

**Observado visualmente:** cabecera con logotipo verde «GRUPO DEKEN» y sello Schüco; hero claro con degradado verde suave, titular grande en negro y verde, ventana ilustrada en blanco; aviso de cookies superpuesto; menú de anclas (El problema, Catálogo, Cómo funciona, Profesionales) y CTA de WhatsApp. En la captura de página completa aparecen grandes zonas vacías: lo más probable es que sean animaciones de aparición por scroll que no se disparan en una captura completa. **No se diagnostica como error.**

**Extraído como texto (no verificado):** «Distribuidor oficial Schüco · Sevilla», «Hasta 52 dB», «Clasificación A++», «Más de 15 años», «desde 2009», tres testimonios sin nombre, contadores «0+» (valor inicial de animación en el HTML), teléfono de WhatsApp, menciones a CT 70, LivIng, SoftSlide, FocusIng y Elevadoras, y un texto «Preparado para sustituirlo por el catálogo real del cliente».

**Uso en la previsualización:** solo la estructura comunicativa (B2B, sin venta a particulares, Sevilla y provincia) y las denominaciones de series, marcadas como «pendiente de documentación». **No se reutiliza** ninguna cifra, garantía, certificación, testimonio ni fecha.

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
| Modelo 3D de ventana (`src/three/*`) | **Aproximación de demostración** | Geometría procedural original: perfiles ingletados, solape de hoja, junquillo, juntas, doble/triple vidrio con intercalario, manilla y bisagras. No procede de DXF ni representa ninguna serie Schüco. |
| Imágenes de producto (`public/renders/*.jpg`) | **Aproximación de demostración** | Generadas desde el mismo modelo con `scripts/render-posters.mjs`. No son fotografías ni obras de Deken. |
| Textura madera, granulado antracita, fondo de escena | Aproximación de demostración | Procedurales (canvas). No representan foils concretos. |
| Logotipo | **Provisional** | Composición tipográfica en `src/brand/Logo.tsx` (único punto de sustitución). |
| Tipografías | Recurso de terceros (OFL) | Montserrat e IBM Plex Mono vía @fontsource. |
| Iconos | Recurso de terceros (ISC) | lucide-react. |
| Guías, fichas, muestrario y plantillas (`src/content/library.ts`) | Contenido de demostración | Marcados como demo en título o metadatos. |
| Plantilla de importación (`public/samples/importacion-pedidos-EJEMPLO.csv`) | Archivo de demostración | Identificada como «no es el formato real de PrefSuite». |
| PDF descargables | Generados en el navegador | Todos llevan «DOCUMENTO DE DEMOSTRACIÓN» y marca de agua. |
| Activos reales de Deken | **Ninguno disponible** | Ver `DECISIONES_Y_PENDIENTES.md`. |
