import { createBrowserRouter, redirect } from 'react-router-dom'
import { paths } from '../config/paths.js'
import AppLayout from '../layouts/AppLayout.jsx'
import AdminPage from '../pages/AdminPage.jsx'
import AlertsPage from '../pages/AlertsPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import FinancialPage from '../pages/FinancialPage.jsx'
import HmiPage from '../pages/HmiPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import PowerPage from '../pages/PowerPage.jsx'
import PageAccessGuard from './PageAccessGuard.jsx'
import RouteErrorBoundary from './RouteErrorBoundary.jsx'

/*
 * Each protected route declares `handle.pageId`; PageAccessGuard checks it
 * against the centralized page-access rules (config/access.config.js).
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        // Pathless route so page errors render inside the application shell.
        Component: PageAccessGuard,
        ErrorBoundary: RouteErrorBoundary,
        children: [
          { index: true, loader: () => redirect(paths.dashboard) },
          { path: paths.dashboard, Component: DashboardPage, handle: { pageId: 'dashboard' } },
          { path: paths.power, Component: PowerPage, handle: { pageId: 'power' } },
          { path: paths.financial, Component: FinancialPage, handle: { pageId: 'financial' } },
          { path: paths.alerts, Component: AlertsPage, handle: { pageId: 'alerts' } },
          { path: paths.hmi, Component: HmiPage, handle: { pageId: 'hmi' } },
          { path: paths.admin, Component: AdminPage, handle: { pageId: 'admin' } },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
])
