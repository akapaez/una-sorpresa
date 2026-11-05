# Grupo Deken · Previsualización de plataforma

Previsualización para aprobación de la futura plataforma B2B de Grupo Deken: web pública, espacio profesional y panel interno. **Datos, documentos y acciones simulados.** Sin backend, sin claves y sin servicios externos.

## Requisitos

Node.js 20 o superior (probado con Node 22.23 y npm 10.9).

## Instalar y arrancar

```bash
npm install
```

```bash
npm run dev
```

Abre http://localhost:5173.

## Compilar y servir la versión de producción

```bash
npm run build
```

```bash
npm run preview
```

Abre http://localhost:4173. `vite preview` sirve `index.html` para todas las rutas de la aplicación.

## Comprobación de tipos

```bash
npm run typecheck
```

## Regenerar las imágenes de producto

Las imágenes de `public/renders/` se generan a partir del propio modelo 3D. Con el servidor en marcha y Playwright disponible:

```bash
node scripts/render-posters.mjs http://localhost:5173
```

## Cómo recorrer la demo

En la banda superior oscura, **Modo demostración** alterna entre Visitante, Profesional pendiente, Profesional aprobado y Equipo Deken. **Restablecer demostración** recupera los datos iniciales. No es autenticación: en la plataforma real los permisos se verificarán en servidor.

Recorrido principal:

1. **Visitante:** portada → Soluciones → ficha → Solicitar acceso profesional (formulario) → estado pendiente.
2. **Equipo Deken:** Panel → Profesionales → Revisar → Aprobar.
3. **Profesional pendiente:** ver «Acceso aprobado» → Entrar al espacio profesional.
4. **Profesional aprobado:** Configurador → elegir tipología, acabado, vidrio y medidas → Guardar en proyecto → Descargar PDF → Solicitar presupuesto.
5. **Equipo Deken:** Solicitudes → abrir la nueva → Crear propuesta de muestra (o Añadir versión).
6. **Profesional aprobado:** Presupuestos → `PRES-2026-0311` (2 versiones) → Solicitar aclaración → Mensajes.
7. **Equipo Deken:** Pedidos → `PED-2026-031` → cambiar estado, añadir nota y vincular un documento.
8. **Profesional aprobado:** Pedidos → `PED-2026-031` → ver el cambio y descargar documentos.

Otros recorridos: Asesor → Comparador/Configurador; Biblioteca → búsqueda → detalle → PDF → Asistente; Panel Deken → Preguntas → revisar borrador → aprobar → publicar → aparece en `/conocimiento`; Importaciones → plantilla de ejemplo → correspondencias → vista previa → confirmar.

Parámetros útiles para revisión: `?motion=reduce` (movimiento reducido), `?webgl=0` (sin WebGL, imagen de respaldo) y `?q=low` (calidad gráfica baja).

## Estructura

```
src/
  brand/        Logotipo provisional (punto único de sustitución)
  i18n/         Textos de interfaz (es; preparado para en/de)
  content/      Catálogo, comparador y documentos de demostración
  demo/         Tipos, datos sembrados y adaptador local (store) → futura API
  three/        Modelo de ventana, materiales, escena, cámara y guion de portada
  tools/        Visor de producto, asistente, ilustraciones
  ui/           Componentes compartidos
  layouts/      Web pública, espacio profesional y panel Deken
  pages/        public/, pro/, deken/
  lib/pdf.ts    Generación de PDF reales en el navegador
docs/           Referencias, decisiones, revisión y siguiente fase
scripts/        Generación de imágenes de producto
```
