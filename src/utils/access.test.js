import { describe, expect, it } from 'vitest'
import { mockFeatureFlags, mockRoles, mockUsers } from '../data/mock/access.mock.js'
import {
  canAccessPage,
  canPerform,
  canViewSection,
  computeEffectiveAccess,
} from './access.js'

function accessFor(userId, flags = mockFeatureFlags) {
  const user = mockUsers.find((u) => u.id === userId)
  const role = mockRoles.find((r) => r.id === user.role)
  return computeEffectiveAccess({ user, role, featureFlags: flags })
}

describe('computeEffectiveAccess', () => {
  it('gives an administrator every page and admin action', () => {
    const access = accessFor('u-admin')
    for (const page of ['dashboard', 'power', 'financial', 'alerts', 'hmi', 'admin']) {
      expect(canAccessPage(access, page)).toBe(true)
    }
    expect(canPerform(access, 'admin.features.manage')).toBe(true)
  })

  it('lets an operator use HMI actions but not administration', () => {
    const access = accessFor('u-operator')
    expect(canAccessPage(access, 'hmi')).toBe(true)
    expect(canPerform(access, 'hmi.changeSource')).toBe(true)
    expect(canAccessPage(access, 'admin')).toBe(false)
  })

  it('gives a viewer read-only pages without HMI', () => {
    const access = accessFor('u-viewer')
    expect(canAccessPage(access, 'power')).toBe(true)
    expect(canAccessPage(access, 'hmi')).toBe(false)
    expect(canPerform(access, 'financial.export')).toBe(false)
  })

  it('keeps page access while hiding revoked actions', () => {
    const access = accessFor('u-hmi-observer')
    expect(canAccessPage(access, 'hmi')).toBe(true)
    expect(canPerform(access, 'hmi.changeSource')).toBe(false)
    expect(canPerform(access, 'hmi.changeCost')).toBe(false)
  })

  it('removes the page and dashboard section when a feature is revoked', () => {
    const access = accessFor('u-no-financial')
    expect(canAccessPage(access, 'financial')).toBe(false)
    expect(canViewSection(access, 'financial')).toBe(false)
    expect(canViewSection(access, 'core')).toBe(true)
  })

  it('requires both features for export', () => {
    const access = accessFor('u-analyst')
    expect(canPerform(access, 'financial.export')).toBe(true)
    const withoutExport = accessFor('u-analyst', { ...mockFeatureFlags, dataExport: false })
    expect(canPerform(withoutExport, 'financial.export')).toBe(false)
  })

  it('disables a feature globally even when the role grants it', () => {
    const access = accessFor('u-operator', { ...mockFeatureFlags, hmi: false })
    expect(canAccessPage(access, 'hmi')).toBe(false)
    expect(canPerform(access, 'hmi.changeSource')).toBe(false)
  })

  it('gives a disabled user no access', () => {
    const access = accessFor('u-disabled')
    expect(access.permissions).toEqual([])
    expect(canAccessPage(access, 'dashboard')).toBe(false)
  })

  it('requires admin.view for the administration page', () => {
    const user = { id: 'x', name: 'X', role: 'r', status: 'active' }
    const role = { id: 'r', permissions: ['admin.users.view'], features: [] }
    const access = computeEffectiveAccess({ user, role, featureFlags: {} })
    expect(canAccessPage(access, 'admin')).toBe(false)
    expect(canPerform(access, 'admin.users.view')).toBe(true)
  })

  it('fails closed for unknown ids and missing access', () => {
    const access = accessFor('u-admin')
    expect(canAccessPage(access, 'unknown')).toBe(false)
    expect(canPerform(access, 'unknown.action')).toBe(false)
    expect(canAccessPage(null, 'dashboard')).toBe(false)
  })
})
