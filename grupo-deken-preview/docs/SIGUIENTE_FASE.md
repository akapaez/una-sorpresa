# Siguiente fase: de la previsualización a la plataforma

Se aplica una vez aprobada la propuesta visual. Nada de esto está implementado ni contratado.

## 1. Arquitectura propuesta

- **Frontend:** reutilizar componentes, tokens, escenas 3D y plantillas de esta previsualización. Sustituir `src/demo/store.ts` (adaptador local) por un cliente de API con las mismas operaciones (`submitAccessRequest`, `saveConfig`, `submitQuoteRequest`, `addQuoteVersion`, `updateOrder`, `linkDocument`, `sendMessage`, `applyImport`…).
- **Backend con autenticación real** y permisos verificados en servidor por usuario, empresa y rol (visitante, profesional pendiente, profesional aprobado y equipo Deken). Los documentos privados nunca viajan en el paquete público: se sirven con URL firmada y caducidad.
- **Separación por empresa:** cada proyecto, configuración, presupuesto, pedido, conversación y documento pertenece a una empresa. Las consultas filtran siempre por la empresa del usuario.
- **Almacenamiento de documentos** con versiones, autor, vínculo (proyecto, presupuesto o pedido) y registro de accesos.

## 2. Contenidos y chat documental

Modelo de datos separado:
1. documento original (archivo inmutable);
2. texto extraído (con página o sección de origen);
3. metadatos (familia, producto, fabricante, tipo, idioma, versión y fecha);
4. fuentes y citas;
5. estado editorial y aprobación (persona y fecha);
6. visibilidad (público, profesional o interno).

El chat solo recupera fragmentos **aprobados y visibles para el usuario** y cita documento y página reales. Las preguntas sin respuesta alimentan la cola de propuestas de guía, que siempre requiere revisión humana. Un contenido interno no se vuelve público por estar indexado.

## 3. Modelo 3D real

- Hecho para LivIng: `scripts/dxf/dxf_to_profile.py` → `src/three/profiles/*.json` → `profileRing()`. Repetir con las secciones de SoftSlide, elevadoras, puerta e inversor central.
- Validar con Deken qué combinaciones se muestran por serie. El configurador sigue siendo orientativo: las reglas de fabricación se revisan en la oficina técnica.
- Para la elevadora, crear un modelo específico de elevación y deslizamiento.
- Optimizar texturas reales (KTX2) y, si procede, GLB por serie.

## 4. Presupuestos y pedidos

- Gestión manual e importaciones al principio, con el asistente de importación como base. Definir la plantilla real a partir de una exportación verificada.
- **PrefSuite:** estudiar qué exportaciones o API ofrece antes de prometer automatización. Hasta entonces, importación revisada por una persona.
- Sin pago ni firma online, salvo que se decida explícitamente más adelante.

## 5. Publicación

- Entorno de revisión privado (con acceso protegido, no solo `noindex`) antes de tocar el dominio.
- Despliegue sobre grupodeken.es solo con instrucción expresa. Hoy el alojamiento está en Nominalia, sin acceso. Valorar redirecciones desde las URL actuales.
- Antes de publicar: textos legales aprobados, datos de contacto verificados, auditoría de accesibilidad y medición de rendimiento en dispositivos reales (Core Web Vitals de campo).
- Traducciones a inglés y alemán: diccionario `src/i18n` y contenidos por idioma.

## 6. Pendiente de Deken

Logotipo y manual de marca, DXF, catálogos y fichas técnicas con fuentes, acabados reales, fotografías propias, nombres de estados de pedido, criterios de aprobación, textos legales y contacto.
