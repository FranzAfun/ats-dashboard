import {
  actionAccess,
  dashboardSectionAccess,
  pageAccess,
} from '../config/access.config.js'

/**
 * @typedef {Object} EffectiveAccess
 * @property {{ id: string, name: string, role: string, status: string }} user
 * @property {string[]} permissions
 * @property {string[]} features
 */

/**
 * Builds the effective-access object (06_AUTH_AND_FEATURE_FLAGS.md §23)
 * from a user, their role and the global feature flags.
 *
 * This is the MOCK inheritance model used during development:
 *   permissions = role permissions + user grants - user revocations
 *   features    = (role features + user grants - user revocations)
 *                 limited to globally enabled feature flags
 * A user whose status is not "active" receives no access.
 * The production inheritance model is TBD.
 */
export function computeEffectiveAccess({ user, role, featureFlags }) {
  const summary = user
    ? { id: user.id, name: user.name, role: user.role, status: user.status }
    : null

  if (!user || !role || user.status !== 'active') {
    return { user: summary, permissions: [], features: [] }
  }

  const grantedPermissions = new Set([
    ...role.permissions,
    ...(user.permissionsGranted ?? []),
  ])
  for (const permission of user.permissionsRevoked ?? []) {
    grantedPermissions.delete(permission)
  }

  const grantedFeatures = new Set([
    ...role.features,
    ...(user.featuresGranted ?? []),
  ])
  for (const feature of user.featuresRevoked ?? []) {
    grantedFeatures.delete(feature)
  }

  return {
    user: summary,
    permissions: [...grantedPermissions].sort(),
    features: [...grantedFeatures]
      .filter((feature) => featureFlags[feature] === true)
      .sort(),
  }
}

export function hasPermission(access, permission) {
  return Boolean(access?.permissions?.includes(permission))
}

export function hasFeature(access, feature) {
  return Boolean(access?.features?.includes(feature))
}

function meetsRequirement(access, requirement) {
  if (!requirement || !access) return false
  const requiredFeatures =
    requirement.feature == null ? [] : [].concat(requirement.feature)
  const permissionOk =
    requirement.permission == null ||
    hasPermission(access, requirement.permission)
  return permissionOk && requiredFeatures.every((f) => hasFeature(access, f))
}

/** Unknown page ids are denied (fail closed). */
export function canAccessPage(access, pageId) {
  return meetsRequirement(access, pageAccess[pageId])
}

/** Unknown action ids are denied (fail closed). */
export function canPerform(access, actionId) {
  return meetsRequirement(access, actionAccess[actionId])
}

/** Unknown section ids are denied (fail closed). */
export function canViewSection(access, sectionId) {
  return meetsRequirement(access, dashboardSectionAccess[sectionId])
}
