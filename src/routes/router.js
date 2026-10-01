import { createBrowserRouter, redirect } from 'react-router-dom'
import { paths } from '../config/paths.js'
import AppLayout from '../layouts/AppLayout.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import PageAccessGuard from './PageAccessGuard.jsx'
import RouteErrorBoundary from './RouteErrorBoundary.jsx'
import RouteLoading from './RouteLoading.jsx'

/** Route-level code splitting: each page is loaded on first visit. */
const page = (load) => async () => ({ Component: (await load()).default })

/*
 * Each protected route declares `handle.pageId`; PageAccessGuard checks it
 * against the centralized page-access rules (config/access.config.js).
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: RouteErrorBoundary,
    HydrateFallback: RouteLoading,
    children: [
      {
        // Pathless route so page errors render inside the application shell.
        Component: PageAccessGuard,
        ErrorBoundary: RouteErrorBoundary,
        children: [
          { index: true, loader: () => redirect(paths.dashboard) },
          {
            path: paths.dashboard,
            handle: { pageId: 'dashboard' },
            lazy: page(() => import('../pages/DashboardPage.jsx')),
          },
          {
            path: paths.power,
            handle: { pageId: 'power' },
            lazy: page(() => import('../pages/PowerPage.jsx')),
          },
          {
            path: paths.financial,
            handle: { pageId: 'financial' },
            lazy: page(() => import('../pages/FinancialPage.jsx')),
          },
          {
            path: paths.alerts,
            handle: { pageId: 'alerts' },
            lazy: page(() => import('../pages/AlertsPage.jsx')),
          },
          {
            path: paths.hmi,
            handle: { pageId: 'hmi' },
            lazy: page(() => import('../pages/HmiPage.jsx')),
          },
          {
            path: paths.admin,
            handle: { pageId: 'admin' },
            lazy: page(() => import('../pages/AdminPage.jsx')),
          },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
])
