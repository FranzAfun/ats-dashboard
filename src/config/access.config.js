/**
 * Central access catalog: permissions, features, and the requirements for
 * pages, dashboard sections and actions.
 *
 * Names follow docs/Project/06_AUTH_AND_FEATURE_FLAGS.md. Which users hold
 * which permissions/features is NOT defined here; that comes from the
 * access service (mock data during development).
 */

export const permissions = [
  { id: 'dashboard.view', label: 'View dashboard' },
  { id: 'power.view', label: 'View power parameters' },
  { id: 'financial.view', label: 'View financial analytics' },
  { id: 'financial.export', label: 'Export financial data' },
  { id: 'alerts.view', label: 'View alerts' },
  { id: 'hmi.view', label: 'View HMI' },
  { id: 'hmi.changeSource', label: 'Change active source' },
  { id: 'hmi.changeCost', label: 'Change input cost/day' },
  { id: 'admin.view', label: 'Open administration' },
  { id: 'admin.users.view', label: 'View users' },
  { id: 'admin.users.manage', label: 'Manage users' },
  { id: 'admin.permissions.view', label: 'View roles and permissions' },
  { id: 'admin.permissions.manage', label: 'Manage role permissions' },
  { id: 'admin.features.view', label: 'View feature flags' },
  { id: 'admin.features.manage', label: 'Manage feature flags' },
]

export const features = [
  { id: 'powerMonitoring', label: 'Power Monitoring' },
  { id: 'financialAnalytics', label: 'Financial Analytics' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'hmi', label: 'HMI' },
  { id: 'dataExport', label: 'Data Export' },
]

/**
 * Page access requirements. A page is accessible when the user holds the
 * permission AND every listed feature is enabled for the user.
 */
export const pageAccess = {
  dashboard: { permission: 'dashboard.view', feature: null },
  power: { permission: 'power.view', feature: 'powerMonitoring' },
  financial: { permission: 'financial.view', feature: 'financialAnalytics' },
  alerts: { permission: 'alerts.view', feature: 'alerts' },
  hmi: { permission: 'hmi.view', feature: 'hmi' },
  admin: { permission: 'admin.view', feature: null },
}

/**
 * Dashboard section requirements. Sections use the same rules as the
 * corresponding pages so the Dashboard cannot bypass page restrictions.
 */
export const dashboardSectionAccess = {
  core: pageAccess.dashboard,
  power: pageAccess.power,
  financial: pageAccess.financial,
  alerts: pageAccess.alerts,
  hmi: pageAccess.hmi,
}

/**
 * Action requirements. Actions also require the feature of the area they
 * belong to, so disabling a feature removes its actions.
 */
export const actionAccess = {
  'hmi.changeSource': { permission: 'hmi.changeSource', feature: 'hmi' },
  'hmi.changeCost': { permission: 'hmi.changeCost', feature: 'hmi' },
  'financial.export': {
    permission: 'financial.export',
    feature: ['financialAnalytics', 'dataExport'],
  },
  'admin.users.view': { permission: 'admin.users.view', feature: null },
  'admin.users.manage': { permission: 'admin.users.manage', feature: null },
  'admin.permissions.view': { permission: 'admin.permissions.view', feature: null },
  'admin.permissions.manage': { permission: 'admin.permissions.manage', feature: null },
  'admin.features.view': { permission: 'admin.features.view', feature: null },
  'admin.features.manage': { permission: 'admin.features.manage', feature: null },
}
