import { paths } from './paths.js'

/**
 * Primary navigation items, in display order.
 *
 * Page permissions and feature requirements are added to these items
 * when the access model is implemented (09_DEVELOPMENT_ROADMAP.md,
 * Phase 3). Until then every item is shown.
 */
export const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', path: paths.dashboard },
  { id: 'power', label: 'Power', path: paths.power },
  { id: 'financial', label: 'Financial', path: paths.financial },
  { id: 'alerts', label: 'Alerts', path: paths.alerts },
  { id: 'hmi', label: 'HMI', path: paths.hmi },
  { id: 'admin', label: 'Administration', path: paths.admin },
]
