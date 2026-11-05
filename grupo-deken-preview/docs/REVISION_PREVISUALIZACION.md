# Revisión de la previsualización

Comprobaciones ejecutadas sobre la **build de producción** (`npm run build` + `vite preview`) con Playwright y Chromium sin interfaz.

**Entorno de medición:** contenedor Linux con 4 núcleos y **sin GPU**. WebGL funciona por software (SwiftShader). En este entorno la escena 3D rinde a unos **7–8 fps**. Esa cifra corresponde al renderizado por CPU y **no representa** el rendimiento en un equipo con GPU. No se ha medido en dispositivos reales ni se han tomado Core Web Vitals de campo.

## Resultados

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` (TypeScript estricto) | Sin errores |
| `npm run build` | Correcta. Three.js, GSAP y jsPDF se cargan en diferido: el JS inicial no los incluye |
| Recorridos automatizados (32 comprobaciones, ver abajo) | 32/32 en la pasada previa a los últimos ajustes visuales. En la pasada final, 31/32: la comprobación de la pestaña «Series de perfil» se evaluó antes de que terminara el cambio de pestaña (temporización del script). Repetida aparte con espera: 5 series, todas con «Pendiente de documentación» |
| Errores de consola durante los recorridos | Ninguno |
| Desbordamiento horizontal: 36 rutas × 360, 390, 768 y 1440 px, con los 4 modos | Ninguno tras las correcciones |
| PDF descargados | Archivos `%PDF` reales: resumen de configuración (≈41 KB, con imagen del visor), documento de pedido y documento de biblioteca |

### Recorridos verificados (automatizados, en un mismo navegador)

1. Visitante → catálogo (filtro por uso y por demostración 3D, pestaña de series sin cifras) → ficha → la configuración avanzada aparece restringida → solicitud de acceso → estado pendiente.
2. Equipo Deken aprueba → el modo pendiente muestra «Acceso aprobado» → entrada al espacio profesional.
3. Configurador: tipología oscilobatiente, acabados y unidades → guardar en proyecto → **PDF real** → volver a otra página y regresar conserva la configuración → solicitud con aviso «No se ha enviado nada a Deken» y sin precio.
4. Panel Deken: la solicitud aparece con su configuración → crear propuesta de muestra.
5. Cliente: presupuesto con dos versiones y cambios explicados → solicitar revisión → el mensaje aparece en la conversación.
6. Deken actualiza el pedido `PED-2026-031` (estado, nota visible, documento vinculado) → el cliente ve el cambio, **no** ve la nota interna y descarga el albarán de muestra.
7. Biblioteca: búsqueda, filtro por idioma (documento en alemán), detalle, PDF; asistente: pregunta sobre Uw de CT 70 → no da cifras y ofrece trasladar la pregunta → conversación creada; pregunta de aperturas → respuesta con fuentes enlazadas a documento y sección.
8. Asesor (5 pasos) → orientación explicada → comparador con las opciones → al volver, el asesor conserva el resultado.
9. Importación con la plantilla de ejemplo → correspondencia de un estado desconocido → la vista previa muestra fila sin referencia, duplicado y proyecto inexistente → confirmación aplicada.
10. Preguntas → revisar el borrador → corregir la marca [Revisar] → revisión → aprobación → publicación → la guía aparece en `/conocimiento`.
11. Contacto: validación de campos y confirmación explícita de simulación.
12. Restablecer demostración recupera los datos iniciales.

## Fallos encontrados y corregidos durante la revisión

| Fallo | Causa | Corrección |
|---|---|---|
| La manilla no se veía | El despiece sobrescribía la posición z del grupo de la manilla | La posición de despiece se suma a la base |
| Vidrio gris y plano, sin reflejo | La opacidad atenuaba también los reflejos | Vidrio con transmisión real en calidad alta, fondo de escena opaco y banda de reflejo controlada |
| PVC blanco agrisado | Tone mapping ACES | Tone mapping neutro |
| Errores «synchronously unmount a root» | Etiquetas `Html` de drei con React 19 | Capa DOM propia proyectada por frame |
| El panel de transición a la sección clara no aparecía | `translate-y-full` de Tailwind 4 usa la propiedad `translate`, que se sumaba al `transform` en línea | Transformación solo en línea |
| Encabezado claro sobre la escena oscura al cargar | La detección se ejecutaba antes de montar la portada | Comprobación periódica y en cada scroll |
| Navegación de escenas ilegible sobre el marco blanco | Sin fondo | Cápsula grafito translúcida |
| Imagen de respaldo de portada en blanco | Capturada mientras Vite compilaba dependencias | Regenerada |
| Veta de madera «tipo cebra» | Ondulación y saturación excesivas | Veta casi recta, fina y menos saturada |
| «Entrar al espacio profesional» no cambiaba el modo | `Button` con `to` no pasaba `onClick` al enlace | `onClick` también en enlaces |
| Biblioteca y Conocimiento: error React #185 (bucle) | Selector de Zustand 5 que devolvía un array nuevo en cada lectura | Selección estable y filtrado fuera del selector |
| Nombre accesible incorrecto en diálogos | Todos compartían `id="dlg-title"` | `useId` por diálogo; también en el campo del asistente |
| Desbordamiento horizontal en móvil (5 rutas) | Hijos de rejilla con `min-width:auto`; selectores de archivo y textos `sr-only` absolutos que escapaban del contenedor | `min-width:0` en hijos de rejilla, tablas con scroll localizado y contenedores posicionados |
| Three.js y jsPDF en la carga inicial | `manualChunks` arrastraba dependencias compartidas | Eliminado: división por importaciones diferidas |
| Panel de transición con gran vacío y texto pegado abajo | Contenido alineado al borde inferior | Contenido centrado y datos de suministro dentro del panel (en móvil siguen como sección) |
| Portada móvil: la ventana tapaba el texto y los botones | Encuadre de escritorio adaptado sin margen | Cámara móvil propia: producto en el tercio inferior; titular más compacto; velo vertical reforzado; nueva imagen de respaldo |
| Barra de controles de la portada cortada al cargar | La banda de demo desplaza 40 px la sección fijada | Margen inferior mayor |
| «Material»: el canto de la hoja quedaba bajo el texto | Encuadre demasiado a la izquierda | Encuadre desplazado y velo lateral reforzado |
| Etiquetas solapadas en el visor y barra partida en móvil | Dos avisos en la misma esquina; textos largos | Un único aviso (oculto en móvil); botones con icono y texto accesible en móvil |
| Ficha: controles del visor bajo el borde inferior | Altura del visor | Altura ajustada al viewport |
| Banda de demo en dos filas en móvil | Etiqueta visible | Etiqueta accesible solo para lectores de pantalla en móvil |

## Capturas

Capturas reales de la build en `docs/capturas/` (densidad 2×): portada (presentación, material, funcionamiento, interior, transición y tipologías), catálogo, ficha, configurador con despiece, comparador, biblioteca, inicio y pedido del área cliente, panel Deken y preguntas; móvil a 390 px (portada, funcionamiento, configurador, catálogo y pedido); movimiento reducido y sin WebGL.

## Accesibilidad (comprobaciones realizadas)

- Contraste calculado: tinta sobre papel 16,3:1; secundario 7,3:1; terciario 4,8:1; texto grafito sobre verde 7,97:1; texto verde sobre claro `#457512` 5,06:1; secundario sobre grafito 7,5:1. No se usa texto blanco sobre verde.
- Diálogos sobre `<dialog>` nativo (foco atrapado, Esc, título accesible). Foco visible en todos los controles. Enlace «Saltar al contenido».
- Controles con etiqueta, objetivos táctiles de 40–44 px en la mayoría de controles. Alternativas por botón al arrastre del visor (abrir, oscilar, deslizar, piezas, etiquetas y restablecer). En pantallas táctiles el giro solo se activa con «Girar», para no bloquear el scroll vertical.
- Textos inactivos de la portada con `inert` y `aria-hidden`; textos reales en HTML.
- `?motion=reduce` o la preferencia del sistema: sin sección fijada, composición estática con los mismos controles.
- Sin WebGL (`?webgl=0`) o con pérdida de contexto: imagen de respaldo con la misma composición.

## Límites y comprobaciones no realizadas

- **Rendimiento real:** no medido con GPU ni en móviles reales. La calidad se adapta (resolución, sombras y vidrio) y el bucle se detiene fuera de pantalla, pero los 60 fps no se han verificado.
- **Lector de pantalla:** no se ha probado con NVDA, VoiceOver ni TalkBack.
- **Navegadores:** solo Chromium. No se han probado Safari ni Firefox.
- **Recorrido completo por teclado:** se han revisado foco visible, diálogos y controles nativos, pero no se ha grabado un recorrido completo solo con teclado.
- **Sonido:** la demostración acústica es visual; no se reproduce audio.
- Las imágenes de `public/renders/` proceden del modelo de demostración, no de fotografía.
