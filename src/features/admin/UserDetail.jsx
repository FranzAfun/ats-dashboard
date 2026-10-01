import { useCallback } from 'react'
import DataState from '../../components/DataState.jsx'
import LoadingState from '../../components/LoadingState.jsx'
import Picker from '../../components/Picker.jsx'
import { useStableLoading } from '../../hooks/useStableLoading.js'
import StatusIndicator from '../../components/StatusIndicator.jsx'
import { features, permissions } from '../../config/access.config.js'
import { useAccess } from '../../hooks/useAccess.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { useMutation } from '../../hooks/useMutation.js'
import { adminService } from '../../services/auth/adminService.js'
import MutationError from './MutationError.jsx'

const overrideOptions = [
  { value: 'inherit', label: 'Role default' },
  { value: 'grant', label: 'Granted' },
  { value: 'revoke', label: 'Revoked' },
]

function overrideFor(user, featureId) {
  if (user.featuresGranted?.includes(featureId)) return 'grant'
  if (user.featuresRevoked?.includes(featureId)) return 'revoke'
  return 'inherit'
}

function withOverride(user, featureId, mode) {
  const granted = new Set(user.featuresGranted ?? [])
  const revoked = new Set(user.featuresRevoked ?? [])
  granted.delete(featureId)
  revoked.delete(featureId)
  if (mode === 'grant') granted.add(featureId)
  if (mode === 'revoke') revoked.add(featureId)
  return { featuresGranted: [...granted], featuresRevoked: [...revoked] }
}

/**
 * Manage one user: account (admin.users.manage), feature access
 * (admin.features.manage) and effective-access review (admin.users.view).
 */
function UserDetail({ user, roleOptions, refreshing }) {
  const { canPerform, user: me } = useAccess()
  const isSelf = user.id === me?.id
  const canManageUser = canPerform('admin.users.manage') && !isSelf
  const canManageFeatures = canPerform('admin.features.manage') && !isSelf
  const mutation = useMutation()
  // Keep controls disabled until refreshed data confirms the change.
  const busy = mutation.saving || refreshing
  const { showLoader: showUpdating } = useStableLoading(busy)
  const loadAccess = useCallback(() => adminService.getEffectiveAccess(user.id), [user.id])
  const effective = useAdminData(loadAccess, `effective:${user.id}`)

  return (
    <div className="grid gap-5">
      {isSelf && <p className="text-sm text-muted">This is your account. You cannot change your own access.</p>}

      {canManageUser && (
        <section className="grid gap-3">
          <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Account</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Picker
              label="Role"
              value={user.role}
              disabled={busy}
              options={roleOptions.map((role) => ({ value: role.id, label: role.label }))}
              onChange={(role) => mutation.mutate(() => adminService.updateUser(user.id, { role }))}
            />
            <div className="grid gap-1">
              <span className="text-xs text-muted">Status</span>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  mutation.mutate(() =>
                    adminService.updateUser(user.id, { status: user.status === 'active' ? 'disabled' : 'active' }),
                  )
                }
                className={
                  user.status === 'active'
                    ? 'inline-flex min-h-11 items-center justify-center rounded-md border border-critical px-4 text-sm font-medium text-critical hover:bg-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60'
                    : 'inline-flex min-h-11 items-center justify-center rounded-md border border-control px-4 text-sm font-medium text-text hover:bg-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60'
                }
              >
                {user.status === 'active' ? 'Disable account' : 'Enable account'}
              </button>
            </div>
          </div>
        </section>
      )}

      {canManageFeatures && (
        <section className="grid gap-2">
          <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Feature access</h3>
          <p className="text-xs text-subtle">
            “Role default” uses the role's features. A globally disabled feature stays unavailable.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature.id}>
                <Picker
                  label={feature.label}
                  value={overrideFor(user, feature.id)}
                  disabled={busy}
                  options={overrideOptions}
                  onChange={(mode) =>
                    mutation.mutate(() => adminService.updateUser(user.id, withOverride(user, feature.id, mode)))
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {showUpdating && <LoadingState size="inline" orb="working" message="Updating…" />}
      <MutationError error={mutation.error} />

      <section className="grid gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Effective access</h3>
        <DataState state={effective} loadingMessage="Loading access…" compact isEmpty={() => false}>
          {(access) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs text-muted">Features</p>
                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {features.map((f) => (
                    <li key={f.id}>
                      <StatusIndicator
                        tone={access.features.includes(f.id) ? 'ok' : 'offline'}
                        label={`${f.label}${access.features.includes(f.id) ? '' : ' (off)'}`}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted">Permissions ({access.permissions.length})</p>
                {access.permissions.length ? (
                  <ul className="grid gap-0.5 text-sm text-text">
                    {access.permissions.map((id) => (
                      <li key={id}>{permissions.find((p) => p.id === id)?.label ?? id}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-subtle">No permissions</p>
                )}
              </div>
            </div>
          )}
        </DataState>
      </section>
    </div>
  )
}

export default UserDetail
