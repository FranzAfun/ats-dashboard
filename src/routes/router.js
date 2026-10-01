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
import RouteErrorBoundary from './RouteErrorBoundary.jsx'

/*
 * Route protection (page access) is added with the access model
 * (09_DEVELOPMENT_ROADMAP.md, Phase 3).
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        // Pathless route so page errors render inside the application shell.
        ErrorBoundary: RouteErrorBoundary,
        children: [
          { index: true, loader: () => redirect(paths.dashboard) },
          { path: paths.dashboard, Component: DashboardPage },
          { path: paths.power, Component: PowerPage },
          { path: paths.financial, Component: FinancialPage },
          { path: paths.alerts, Component: AlertsPage },
          { path: paths.hmi, Component: HmiPage },
          { path: paths.admin, Component: AdminPage },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
])
