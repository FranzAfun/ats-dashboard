import { dataSource, dataSourceConfigError } from '../../config/app.config.js'
import { createLiveAdapter } from './live/liveAdapter.js'
import { createMockAdapter } from './mock/mockAdapter.js'

/**
 * Integration adapter boundary.
 *
 *   Mock Adapter / Live Adapter
 *              ↓
 *     Application Services (src/services/*)
 *              ↓
 *            UI
 *
 * Both adapters implement the same interface:
 *
 * kind: "mock" | "live"
 * access:
 *   getSession(): Promise<EffectiveAccess>
 *   subscribe(listener): unsubscribe — notified when access data changes
 *   listUsers(), listRoles(), getFeatureFlags(), getEffectiveAccess(userId)
 *   updateUser(userId, changes), setFeatureFlag(id, enabled),
 *   setRolePermission(roleId, permission, granted)
 *
 * UI code must not import adapters directly; it uses the services.
 */

if (dataSourceConfigError) {
  console.error(dataSourceConfigError)
}

export const adapter =
  dataSource === 'mock' ? createMockAdapter() : createLiveAdapter()

export const isMockData = adapter.kind === 'mock'
