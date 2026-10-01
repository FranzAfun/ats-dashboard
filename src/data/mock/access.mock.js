/**
 * MOCK access data for development and demonstration only.
 *
 * These roles, users and feature flags are not production configuration.
 * The production role list, permission assignments, authentication
 * provider and inheritance model are TBD (06_AUTH_AND_FEATURE_FLAGS.md §30).
 */

const allPermissions = [
  'dashboard.view',
  'power.view',
  'financial.view',
  'financial.export',
  'alerts.view',
  'hmi.view',
  'hmi.changeSource',
  'hmi.changeCost',
  'admin.view',
  'admin.users.view',
  'admin.users.manage',
  'admin.permissions.view',
  'admin.permissions.manage',
  'admin.features.view',
  'admin.features.manage',
]

export const mockRoles = [
  {
    id: 'admin',
    label: 'Admin',
    permissions: allPermissions,
    features: ['powerMonitoring', 'financialAnalytics', 'alerts', 'hmi', 'dataExport'],
  },
  {
    id: 'operator',
    label: 'Operator',
    permissions: [
      'dashboard.view',
      'power.view',
      'financial.view',
      'alerts.view',
      'hmi.view',
      'hmi.changeSource',
      'hmi.changeCost',
    ],
    features: ['powerMonitoring', 'financialAnalytics', 'alerts', 'hmi'],
  },
  {
    id: 'viewer',
    label: 'Viewer',
    permissions: ['dashboard.view', 'power.view', 'financial.view', 'alerts.view'],
    features: ['powerMonitoring', 'financialAnalytics', 'alerts'],
  },
]

export const mockUsers = [
  {
    id: 'u-admin',
    name: 'Mock Administrator',
    username: 'admin.mock',
    role: 'admin',
    status: 'active',
  },
  {
    id: 'u-operator',
    name: 'Mock Operator',
    username: 'operator.mock',
    role: 'operator',
    status: 'active',
  },
  {
    id: 'u-viewer',
    name: 'Mock Viewer',
    username: 'viewer.mock',
    role: 'viewer',
    status: 'active',
  },
  {
    // Page access to HMI without the HMI actions.
    id: 'u-hmi-observer',
    name: 'Mock HMI Observer',
    username: 'observer.mock',
    role: 'operator',
    status: 'active',
    permissionsRevoked: ['hmi.changeSource', 'hmi.changeCost'],
  },
  {
    // Viewer without the Financial Analytics feature.
    id: 'u-no-financial',
    name: 'Mock Viewer (no Financial)',
    username: 'nofinance.mock',
    role: 'viewer',
    status: 'active',
    featuresRevoked: ['financialAnalytics'],
  },
  {
    // Viewer with data export granted individually.
    id: 'u-analyst',
    name: 'Mock Analyst',
    username: 'analyst.mock',
    role: 'viewer',
    status: 'active',
    permissionsGranted: ['financial.export'],
    featuresGranted: ['dataExport'],
  },
  {
    id: 'u-disabled',
    name: 'Mock Disabled User',
    username: 'disabled.mock',
    role: 'viewer',
    status: 'disabled',
  },
]

export const mockFeatureFlags = {
  powerMonitoring: true,
  financialAnalytics: true,
  alerts: true,
  hmi: true,
  dataExport: true,
}

export const mockDefaultUserId = 'u-operator'
