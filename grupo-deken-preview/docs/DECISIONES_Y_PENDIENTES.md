# Decisiones y pendientes

## Materiales recibidos

| Material previsto | Estado | Tratamiento en la previsualización |
|---|---|---|
| DXF de perfiles y secciones | **Aportados** (~175 archivos en Drive, muchos duplicados «from Despacho / 13innova-pc») | Se usa «Seccion living.dxf» (conjunto LivIng completo y posicionado): marco, hoja, junquillo, juntas, refuerzos y vidrio. Practicable, oscilobatiente, balconera y puerta se construyen ya con esa sección real. La corredera sigue siendo aproximada. |
| Catálogos y folletos Schüco | **Aportados en Drive** (5 folletos, 7 catálogos) | Fichas por serie (`/series/*`), comparador y biblioteca con valores y página de origen. Tres catálogos sin texto extraíble (FocusIng, LivingSlide, LivIng). |
| Documentación de herrajes | **No aportado** | Manilla y bisagras genéricas. |
| Vidrios, persianas y accesorios | **No aportado** | Vidrio transparente/privacidad y doble/triple como representación visual. |
| Logotipo y material corporativo | **Aportado** (kit web y manual de marca) | Logotipo SVG oficial, favicon, colores y tipografía del manual. |
| Fotografías propias | **No aportadas** | Visuales de producto creados con el modelo 3D. Ninguna imagen se atribuye a obras, clientes o instalaciones de Deken. |
| Textos legales | **No aportados** | `/legal/*` explica que se incorporarán en la versión definitiva. |

## Decisiones tomadas (reversibles)

- **Base técnica:** Vite + React + TypeScript, sin backend. Estado local con Zustand y persistencia en `localStorage` (clave `deken-demo-v1`) limitada a datos ficticios. Botón «Restablecer demostración» en la banda superior.
- **Marca (manual oficial):** verde `#76B82A` para logotipo y botones (nunca texto verde sobre blanco); texto verde accesible `#4A7A19`; antracita `#383E42` para textos y fondos oscuros; texto sobre verde `#1F2224`; gris claro `#F4F5F2`; borde `#D5D8D3`. Montserrat ExtraBold en titulares, Medium en texto y SemiBold en mayúsculas espaciadas para etiquetas.
- **Concepto:** «la precisión que puedes explorar». La portada es una secuencia fijada de unas 3,2 pantallas en escritorio (2,2 en móvil): presentación → material (acercamiento y cambio a antracita) → funcionamiento (manilla y después hoja) → interior (despiece con etiquetas) → recomposición y paso a la sección clara.
- **Un único sistema de movimiento por atributo:** GSAP/ScrollTrigger solo fija la sección y escribe el progreso; cámara, apertura y despiece se interpolan en el bucle de R3F; los textos usan transiciones CSS.
- **Mecánica:** marco siempre fijo. La hoja (con vidrio, junquillo, juntas y manilla) gira sobre el eje de las bisagras, oscila sobre el eje inferior o desliza en su carril. La manilla gira antes de mover la hoja.
- **Elevadora:** sin modelo 3D. Se muestra como ficha visual para no representarla con el movimiento de una corredera.
- **Tipología ≠ serie ≠ vidrio:** el catálogo separa «Por tipología» y «Series de perfil». El vidrio es un paso propio del configurador.
- **Comparador:** ahora compara las cinco series reales con datos de folletos y catálogos (número volado → documento). Se eliminan los «Ejemplo A/B/C» ficticios. Uf, Ug y Uw en filas separadas; Ug «según vidrio»; Uw solo donde el documento lo da. Si dos documentos discrepan (CT 70: Uf 1,3 en catálogo 2026 frente a «hasta 1,2» en folleto; 47 frente a 49 dB) se muestran ambos.
- **Series:** nuevas páginas `/series` y `/series/:slug` con cifras grandes, ficha técnica con fuente por fila, tipologías, acabados y lista de pendientes. LivIng Alu Inside, Corona S 150 y TopAlu solo aparecen en la biblioteca interna hasta que Deken confirme que los ofrece.
- **Cifras de la web actual no reutilizadas:** 52 dB y A++ (no respaldadas por la documentación aportada), años de experiencia, garantía, testimonios y «Distribuidor oficial».
- **Demo guardada:** la versión del estado local pasa a 2; quien ya abrió la demo verá los datos nuevos (se reinicia conservando el modo).
- **Asesor:** reglas locales y legibles (`recommend()` en `src/pages/pro/tools.tsx`). Sin porcentajes ni diagnósticos.
- **Chat:** reglas por palabras clave sobre documentos de muestra. Cada fuente enlaza a un documento y una sección existentes. Las preguntas técnicas sin documentación se registran en Preguntas y pueden trasladarse al equipo.
- **Identidad en modo aprobado:** al aprobarse un nuevo profesional, la demo entra en el espacio de la empresa de ejemplo («Reformas Ejemplo Aljarafe (demo)») para revisar los recorridos con datos sembrados. Se explica en pantalla.
- **Presupuesto → pedido:** no se convierte automáticamente. Los pedidos sembrados están relacionados con el presupuesto confirmado `PRES-2026-0287`.
- **Precios:** ni el configurador ni la web calculan o muestran precios. Los documentos de propuesta y factura de muestra indican que los importes se omiten.
- **Indexación:** `noindex, nofollow` en `index.html` y `robots.txt` con `Disallow: /`. Es control de indexación, no protección de acceso.
- **Sin analítica, píxeles ni cookies de terceros.** Fuentes servidas desde el proyecto.

## Rediseño de la portada (estilo página de producto)

A petición de Cristian, la portada adopta el lenguaje de una página de producto tipo Apple: composición centrada, frases cortas en letra muy grande, textos cuya opacidad sigue al desplazamiento, mucho negro y blanco, una idea por pantalla, imágenes a sangre, galería horizontal fijada, fundido de acabados y cabecera fina. En la web pública el control de demostración pasa a ser un botón flotante.

**Fotografías:** Cristian aportará fotos y vídeos propios. Los huecos están en `src/content/media.ts` (de momento con renders provisionales y aviso visible). Para sustituir uno: copiar la foto a `public/media/` y cambiar `src`, `alt` y `provisional: false`.

## Perfiles reales desde DXF

- **Conversión:** `scripts/dxf/dxf_to_profile.py` (Python + ezdxf) lee el DXF, resuelve los bloques, aplana arcos (tolerancia 0,06 mm), clasifica las piezas por capa (`PVC_OUTSIDE/INSIDE`, `STEEL_OUTSIDE`, `GASKET_*`, `GLAS_*`) y guarda solo los contornos en `src/three/profiles/living.json` (47 kB). **El DXF original no se publica.**
- **Modelo:** `profileRing()` extruye cada sección a lo largo de los cuatro lados con ingletes a 45° exactos. En la ventana montada se omiten las cámaras interiores (no se ven y aligeran la escena); el corte de sección (`SectionModel`) sí las muestra.
- **Corte 3D:** nuevo visor «Por dentro, al milímetro» en la portada y en la ficha LivIng, con giro, etiquetas y separación de piezas. Imagen de respaldo `public/renders/seccion-living.jpg`.
- **Simplificaciones declaradas:** el vidrio intermedio del triple no venía como sólido en el DXF y se dibuja de 2 mm; los calzos de acristalamiento se omiten; herrajes, bisagras y manilla siguen siendo genéricos.

## Supuestos a confirmar con Deken

1. Santiponce como ubicación que se puede citar públicamente (se usa como «referencia geográfica»).
2. Nombres de estados de pedido (documentación pendiente, revisión, fabricación, listo para expedición, entregado).
3. Qué variantes fabrica Deken (CT 70 Classic/Rondo/Accent, LivIng AS/MD, FocusIng 70/76) y si ofrece LivIng Alu Inside, Corona S 150 y tapas TopAlu.
3b. Cifras de elevadoras (solo vienen de la web; su catálogo no se pudo leer) y si puede afirmarse «Distribuidor oficial Schüco».
4. Códigos de los acabados de la web (solo blanco tiene referencia documentada: similar a RAL 9016).
5. Datos de contacto: se muestra el WhatsApp público de la web (626 01 92 09) como texto; confirmar correo y dirección.
6. Criterios de aprobación de profesionales.
7. Qué documentos de pedido se publican al cliente (confirmación, hoja de medidas, albarán, factura).

## Activos provisionales que se deben sustituir

- Corredera y elevadoras → identificar en la carpeta DXF las secciones SoftSlide / LivingSlide / FocusIngSlide (archivos SCC*, 98xx, «Marcos y Guias», etc.) y convertirlas con `scripts/dxf/dxf_to_profile.py`.
- Puerta → usar la sección de hoja de puerta real (hoy usa la hoja de ventana LivIng).
- Ventana de 2 hojas → falta el perfil de encuentro central (inversor); hoy las dos hojas se encuentran sin él.
- `src/three/materials.ts` → acabados reales (color/foil) y su nomenclatura.
- `public/renders/*` → regenerar con `npm run render:posters` tras cambiar el modelo, o sustituir por fotografía propia.
- `src/content/series.ts` → completar con los catálogos que no se pudieron leer (FocusIng, LivingSlide, LivIng) y con los Ug/Uw de las composiciones de Deken.
