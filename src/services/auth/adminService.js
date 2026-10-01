import { createStore } from '../../lib/store.js'
import { adapter } from '../integration/adapter.js'

/**
 * Administration operations. Every call is authorized by the access
 * backend (mock backend during development); the UI only hides what the
 * user cannot do.
 */
const version = createStore(0)
let subscribed = false

export const adminService = {
  listUsers: () => adapter.access.listUsers(),
  listRoles: () => adapter.access.listRoles(),
  getFeatureFlags: () => adapter.access.getFeatureFlags(),
  getEffectiveAccess: (userId) => adapter.access.getEffectiveAccess(userId),
  updateUser: (userId, changes) => adapter.access.updateUser(userId, changes),
  setFeatureFlag: (featureId, enabled) => adapter.access.setFeatureFlag(featureId, enabled),
  setRolePermission: (roleId, permission, granted) =>
    adapter.access.setRolePermission(roleId, permission, granted),

  /** Changes whenever access data changes, so views can reload. */
  subscribeVersion(listener) {
    if (!subscribed) {
      subscribed = true
      adapter.access.subscribe(() => version.set((n) => n + 1))
    }
    return version.subscribe(listener)
  },
  getVersion: version.get,
}
