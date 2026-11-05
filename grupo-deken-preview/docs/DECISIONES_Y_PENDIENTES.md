# Decisiones y pendientes

## Materiales recibidos

| Material previsto | Estado | Tratamiento en la previsualización |
|---|---|---|
| DXF de perfiles y secciones | **No aportado** | Geometría provisional con estructura sustituible (`src/three/geometry.ts`: cada perfil es un anillo de 4 miembros ingletados a partir de dos rectángulos; un DXF futuro sustituiría el contorno por la sección real extruida). |
| Catálogos técnicos Schüco | **No aportado** | Series listadas por nombre con «Pendiente de documentación». Sin cifras. |
| Documentación de herrajes | **No aportado** | Manilla y bisagras genéricas. |
| Vidrios, persianas y accesorios | **No aportado** | Vidrio transparente/privacidad y doble/triple como representación visual. |
| Logotipo y material corporativo | **No aportado** | Logotipo tipográfico provisional. Colores y tipografía tomados de la skill de marca y del encargo. |
| Fotografías propias | **No aportadas** | Visuales de producto creados con el modelo 3D. Ninguna imagen se atribuye a obras, clientes o instalaciones de Deken. |
| Textos legales | **No aportados** | `/legal/*` explica que se incorporarán en la versión definitiva. |

## Decisiones tomadas (reversibles)

- **Base técnica:** Vite + React + TypeScript, sin backend. Estado local con Zustand y persistencia en `localStorage` (clave `deken-demo-v1`) limitada a datos ficticios. Botón «Restablecer demostración» en la banda superior.
- **Marca:** verde `#76B82A` como único acento; sobre verde, texto grafito `#0D0E0F` (7,97:1). Texto verde sobre claro con `#457512` (5,06:1). Neutros oscuros derivados del gris Deken `#383E42`; papel cálido `#F6F5F1` para lectura. Montserrat para texto y titulares; IBM Plex Mono para etiquetas (indicado por la skill de marca).
- **Concepto:** «la precisión que puedes explorar». La portada es una secuencia fijada de unas 3,2 pantallas en escritorio (2,2 en móvil): presentación → material (acercamiento y cambio a antracita) → funcionamiento (manilla y después hoja) → interior (despiece con etiquetas) → recomposición y paso a la sección clara.
- **Un único sistema de movimiento por atributo:** GSAP/ScrollTrigger solo fija la sección y escribe el progreso; cámara, apertura y despiece se interpolan en el bucle de R3F; los textos usan transiciones CSS.
- **Mecánica:** marco siempre fijo. La hoja (con vidrio, junquillo, juntas y manilla) gira sobre el eje de las bisagras, oscila sobre el eje inferior o desliza en su carril. La manilla gira antes de mover la hoja.
- **Elevadora:** sin modelo 3D. Se muestra como ficha visual para no representarla con el movimiento de una corredera.
- **Tipología ≠ serie ≠ vidrio:** el catálogo separa «Por tipología» y «Series de perfil». El vidrio es un paso propio del configurador.
- **Comparador:** valores numéricos solo en productos genéricos «Ejemplo A/B/C», marcados como ficticios y con fuente. Las series reales aparecen con «Sin dato confirmado». Uf, Ug y Uw en filas separadas con unidad y contexto.
- **Asesor:** reglas locales y legibles (`recommend()` en `src/pages/pro/tools.tsx`). Sin porcentajes ni diagnósticos.
- **Chat:** reglas por palabras clave sobre documentos de muestra. Cada fuente enlaza a un documento y una sección existentes. Las preguntas técnicas sin documentación se registran en Preguntas y pueden trasladarse al equipo.
- **Identidad en modo aprobado:** al aprobarse un nuevo profesional, la demo entra en el espacio de la empresa de ejemplo («Reformas Ejemplo Aljarafe (demo)») para revisar los recorridos con datos sembrados. Se explica en pantalla.
- **Presupuesto → pedido:** no se convierte automáticamente. Los pedidos sembrados están relacionados con el presupuesto confirmado `PRES-2026-0287`.
- **Precios:** ni el configurador ni la web calculan o muestran precios. Los documentos de propuesta y factura de muestra indican que los importes se omiten.
- **Indexación:** `noindex, nofollow` en `index.html` y `robots.txt` con `Disallow: /`. Es control de indexación, no protección de acceso.
- **Sin analítica, píxeles ni cookies de terceros.** Fuentes servidas desde el proyecto.

## Supuestos a confirmar con Deken

1. Santiponce como ubicación que se puede citar públicamente (se usa como «referencia geográfica»).
2. Nombres de estados de pedido (documentación pendiente, revisión, fabricación, listo para expedición, entregado).
3. Denominación exacta y disponibilidad de CT 70, LivIng, SoftSlide, FocusIng y soluciones elevadoras, y qué tipologías ofrece cada serie.
4. Acabados reales disponibles y sus códigos.
5. Si se pueden mostrar datos de contacto (teléfono, correo, dirección) y cuáles.
6. Criterios de aprobación de profesionales.
7. Qué documentos de pedido se publican al cliente (confirmación, hoja de medidas, albarán, factura).

## Activos provisionales que se deben sustituir

- `src/brand/Logo.tsx` → logotipo oficial (SVG o PNG; ojo con los nombres intercambiados BLANCO/GRIS de la familia horizontal).
- `src/three/geometry.ts` / `windowSpec.ts` → secciones reales desde DXF (comprobar unidades y escala; los DXF suelen venir en mm).
- `src/three/materials.ts` → acabados reales (color/foil) y su nomenclatura.
- `public/renders/*` → regenerar con `npm run render:posters` tras cambiar el modelo, o sustituir por fotografía propia.
- `src/content/library.ts` → documentos aportados por Deken.
- `src/content/compare.ts` → datos reales con fuente, unidad y configuración de referencia.
