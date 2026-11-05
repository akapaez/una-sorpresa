import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, createHashRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router'
import { DemoBar } from '@/layouts/DemoBar'
import { PublicLayout } from '@/layouts/PublicLayout'
import { ProLayout, DekenLayout } from '@/layouts/AppShell'
import { Toaster } from '@/ui/Dialog'
import Solutions from '@/pages/public/Solutions'
import { SeriesDetail, SeriesIndex } from '@/pages/public/Series'
import { Contact, Knowledge, KnowledgeDetail, Legal, Manufacturing, ProfessionalAccess } from '@/pages/public/Pages'
import NotFound from '@/pages/public/NotFound'
import * as Pro from '@/pages/pro'
import * as Dk from '@/pages/deken'

// Escenas 3D y herramientas pesadas: carga diferida
const Home = lazy(() => import('@/pages/public/Home'))
const SolutionDetail = lazy(() => import('@/pages/public/SolutionDetail'))
const Configurator = lazy(() => import('@/pages/pro/Configurator'))
const Demonstrations = lazy(() => import('@/pages/pro/Demonstrations'))
const RenderPoster = lazy(() => import('@/pages/RenderPoster'))

function Loading() {
  return <div className="grid min-h-[60vh] place-items-center" role="status"><span className="label text-ink-3">Cargando…</span></div>
}
const S = (el: ReactNode) => <Suspense fallback={<Loading />}>{el}</Suspense>

function Root() {
  return (
    <>
      <a href="#contenido" className="sr-only z-[100] rounded-md bg-green px-4 py-2 font-bold text-night focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Saltar al contenido</a>
      <DemoBar />
      <Outlet />
      <Toaster />
      <ScrollRestoration />
    </>
  )
}

// Local: rutas normales. GitHub Pages (VITE_HASH_ROUTER=1): rutas con # para que recargar o abrir
// un enlace interior funcione sin configurar el servidor.
const useHash = import.meta.env.VITE_HASH_ROUTER === '1'
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
const createRouter = useHash ? createHashRouter : createBrowserRouter

const router = createRouter([
  { path: '/_render', element: S(<RenderPoster />) },
  {
    element: <Root />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: S(<Home />) },
          { path: 'soluciones', element: <Solutions /> },
          { path: 'soluciones/:slug', element: S(<SolutionDetail />) },
          { path: 'series', element: <SeriesIndex /> },
          { path: 'series/:slug', element: <SeriesDetail /> },
          { path: 'fabricacion', element: <Manufacturing /> },
          { path: 'conocimiento', element: <Knowledge /> },
          { path: 'conocimiento/:slug', element: <KnowledgeDetail /> },
          { path: 'contacto', element: <Contact /> },
          { path: 'acceso-profesional', element: <ProfessionalAccess /> },
          { path: 'legal/:doc', element: <Legal /> },
          { path: '*', element: <NotFound /> },
        ],
      },
      {
        path: 'profesional',
        element: <ProLayout />,
        children: [
          { index: true, element: <Pro.ProHome /> },
          { path: 'configurador', element: S(<Configurator />) },
          { path: 'comparador', element: <Pro.Comparator /> },
          { path: 'asesor', element: <Pro.Advisor /> },
          { path: 'demostraciones', element: S(<Demonstrations />) },
          { path: 'biblioteca', element: <Pro.LibraryList /> },
          { path: 'biblioteca/:slug', element: <Pro.LibraryDetail /> },
          { path: 'proyectos', element: <Pro.Projects /> },
          { path: 'proyectos/:id', element: <Pro.ProjectDetail /> },
          { path: 'presupuestos', element: <Pro.Quotes /> },
          { path: 'presupuestos/:id', element: <Pro.QuoteDetail /> },
          { path: 'pedidos', element: <Pro.Orders /> },
          { path: 'pedidos/:id', element: <Pro.OrderDetail /> },
          { path: 'mensajes', element: <Pro.Messages /> },
          { path: 'documentos', element: <Pro.Documents /> },
          { path: '*', element: <NotFound /> },
        ],
      },
      {
        path: 'deken',
        element: <DekenLayout />,
        children: [
          { index: true, element: <Dk.DekenHome /> },
          { path: 'profesionales', element: <Dk.Professionals /> },
          { path: 'solicitudes', element: <Dk.Requests /> },
          { path: 'solicitudes/:id', element: <Dk.RequestDetail /> },
          { path: 'presupuestos', element: <Dk.DkQuotes /> },
          { path: 'presupuestos/:id', element: <Dk.DkQuoteDetail /> },
          { path: 'pedidos', element: <Dk.DkOrders /> },
          { path: 'pedidos/:id', element: <Dk.DkOrderDetail /> },
          { path: 'contenidos', element: <Dk.Contents /> },
          { path: 'preguntas', element: <Dk.Questions /> },
          { path: 'importaciones', element: <Dk.Imports /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
], useHash ? {} : { basename })

export function App() {
  return <RouterProvider router={router} />
}
