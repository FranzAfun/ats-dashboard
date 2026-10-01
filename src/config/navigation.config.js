import { paths } from './paths.js'

/**
 * Primary navigation items, in display order. Each item is shown only when
 * the current user can access its page (see config/access.config.js).
 */
export const navigationItems = [
  { id: 'dashboard', pageId: 'dashboard', label: 'Dashboard', path: paths.dashboard },
  { id: 'power', pageId: 'power', label: 'Power', path: paths.power },
  { id: 'financial', pageId: 'financial', label: 'Financial', path: paths.financial },
  { id: 'alerts', pageId: 'alerts', label: 'Alerts', path: paths.alerts },
  { id: 'hmi', pageId: 'hmi', label: 'HMI', path: paths.hmi },
  { id: 'admin', pageId: 'admin', label: 'Administration', path: paths.admin },
]
