import { describe, expect, it } from 'vitest'
import { canAccessPage } from '../../../utils/access.js'
import { createMockAccess } from './mockAccess.js'

describe('mock access backend', () => {
  it('rejects admin reads and writes from non-admin users', async () => {
    const access = createMockAccess()
    access.switchMockUser('u-operator')
    await expect(access.listUsers()).rejects.toMatchObject({ code: 'FORBIDDEN' })
    await expect(access.setFeatureFlag('hmi', false)).rejects.toMatchObject({ code: 'FORBIDDEN' })
    await expect(access.setRolePermission('viewer', 'hmi.view', true)).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('lets an administrator change feature flags, which changes effective access', async () => {
    const access = createMockAccess()
    access.switchMockUser('u-admin')
    await access.setFeatureFlag('financialAnalytics', false)
    access.switchMockUser('u-viewer')
    const session = await access.getSession()
    expect(canAccessPage(session, 'financial')).toBe(false)
  })

  it('prevents administrators from changing their own access', async () => {
    const access = createMockAccess()
    access.switchMockUser('u-admin')
    await expect(access.updateUser('u-admin', { status: 'disabled' })).rejects.toMatchObject({ code: 'FORBIDDEN' })
    await expect(access.setRolePermission('admin', 'admin.view', false)).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('applies per-user feature overrides', async () => {
    const access = createMockAccess()
    access.switchMockUser('u-admin')
    await access.updateUser('u-viewer', { featuresRevoked: ['alerts'] })
    const viewer = await access.getEffectiveAccess('u-viewer')
    expect(viewer.features).not.toContain('alerts')
  })
})
