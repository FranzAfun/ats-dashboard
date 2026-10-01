import { createStore } from '../../../lib/store.js'
import {
  mockDefaultUserId,
  mockFeatureFlags,
  mockRoles,
  mockUsers,
} from '../../../data/mock/access.mock.js'
import { computeEffectiveAccess, hasPermission } from '../../../utils/access.js'
import { ErrorCode, IntegrationError } from '../errors.js'
import { withLatency } from './mockLatency.js'

const SESSION_STORAGE_KEY = 'ats-dashboard.mock-user-id'

function readStoredUserId() {
  try {
    return window.localStorage.getItem(SESSION_STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStoredUserId(userId) {
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, userId)
  } catch {
    // Storage unavailable: the mock user selection lasts for this page load.
  }
}

const clone = (value) => structuredClone(value)

/**
 * Mock access backend. Holds users, roles and feature flags in memory
 * (changes reset on page reload) and enforces admin permissions on every
 * write, mirroring the requirement that the backend, not the UI, is the
 * security boundary.
 */
export function createMockAccess() {
  const storedUserId = readStoredUserId()
  const db = createStore({
    users: clone(mockUsers),
    roles: clone(mockRoles),
    featureFlags: clone(mockFeatureFlags),
    currentUserId: mockUsers.some((u) => u.id === storedUserId)
      ? storedUserId
      : mockDefaultUserId,
  })

  function effectiveAccessFor(userId) {
    const { users, roles, featureFlags } = db.get()
    const user = users.find((u) => u.id === userId)
    const role = roles.find((r) => r.id === user?.role)
    return computeEffectiveAccess({ user, role, featureFlags })
  }

  function requirePermission(permission) {
    const access = effectiveAccessFor(db.get().currentUserId)
    if (!hasPermission(access, permission)) {
      throw new IntegrationError(
        ErrorCode.FORBIDDEN,
        'You do not have permission to perform this action.',
      )
    }
  }

  function requireNotSelf(userId) {
    if (userId === db.get().currentUserId) {
      throw new IntegrationError(
        ErrorCode.FORBIDDEN,
        'You cannot change your own access.',
      )
    }
  }

  return {
    getSession: () =>
      withLatency(() => {
        const access = effectiveAccessFor(db.get().currentUserId)
        return clone(access)
      }),

    subscribe: db.subscribe,

    listUsers: () =>
      withLatency(() => {
        requirePermission('admin.users.view')
        return clone(db.get().users)
      }),

    listRoles: () =>
      withLatency(() => {
        requirePermission('admin.permissions.view')
        return clone(db.get().roles)
      }),

    getFeatureFlags: () =>
      withLatency(() => {
        requirePermission('admin.features.view')
        return clone(db.get().featureFlags)
      }),

    getEffectiveAccess: (userId) =>
      withLatency(() => {
        requirePermission('admin.users.view')
        return clone(effectiveAccessFor(userId))
      }),

    /**
     * @param {string} userId
     * @param {{ role?: string, status?: string, featuresGranted?: string[], featuresRevoked?: string[] }} changes
     */
    updateUser: (userId, changes) =>
      withLatency(() => {
        const touchesFeatures =
          'featuresGranted' in changes || 'featuresRevoked' in changes
        const touchesAccount = 'role' in changes || 'status' in changes
        if (touchesAccount) requirePermission('admin.users.manage')
        if (touchesFeatures) requirePermission('admin.features.manage')
        requireNotSelf(userId)

        const { roles } = db.get()
        if ('role' in changes && !roles.some((r) => r.id === changes.role)) {
          throw new IntegrationError(ErrorCode.INVALID_DATA, 'Unknown role.')
        }
        db.set((state) => ({
          ...state,
          users: state.users.map((u) =>
            u.id === userId ? { ...u, ...clone(changes) } : u,
          ),
        }))
        return clone(db.get().users.find((u) => u.id === userId))
      }),

    setFeatureFlag: (featureId, enabled) =>
      withLatency(() => {
        requirePermission('admin.features.manage')
        db.set((state) => ({
          ...state,
          featureFlags: { ...state.featureFlags, [featureId]: Boolean(enabled) },
        }))
        return clone(db.get().featureFlags)
      }),

    setRolePermission: (roleId, permission, granted) =>
      withLatency(() => {
        requirePermission('admin.permissions.manage')
        const currentUser = db
          .get()
          .users.find((u) => u.id === db.get().currentUserId)
        if (currentUser?.role === roleId) {
          throw new IntegrationError(
            ErrorCode.FORBIDDEN,
            'You cannot change the permissions of your own role.',
          )
        }
        db.set((state) => ({
          ...state,
          roles: state.roles.map((role) => {
            if (role.id !== roleId) return role
            const next = new Set(role.permissions)
            if (granted) next.add(permission)
            else next.delete(permission)
            return { ...role, permissions: [...next] }
          }),
        }))
        return clone(db.get().roles)
      }),

    // Mock-only: switch the simulated signed-in user.
    mockUsers: () => db.get().users.map(({ id, name, role, status }) => ({ id, name, role, status })),
    currentMockUserId: () => db.get().currentUserId,
    switchMockUser(userId) {
      if (!db.get().users.some((u) => u.id === userId)) return
      writeStoredUserId(userId)
      db.set((state) => ({ ...state, currentUserId: userId }))
    },
  }
}
