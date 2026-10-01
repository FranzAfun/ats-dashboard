import { useCallback, useState } from 'react'
import DataState from '../../components/DataState.jsx'
import Panel from '../../components/Panel.jsx'
import SegmentedControl from '../../components/SegmentedControl.jsx'
import { features, permissions } from '../../config/access.config.js'
import { useAccess } from '../../hooks/useAccess.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { useMutation } from '../../hooks/useMutation.js'
import { adminService } from '../../services/auth/adminService.js'
import MutationError from './MutationError.jsx'

/** Role permissions (admin.permissions.view / admin.permissions.manage). */
function RolesSection() {
  const { canPerform, user } = useAccess()
  const canManage = canPerform('admin.permissions.manage')
  const load = useCallback(() => adminService.listRoles(), [])
  const roles = useAdminData(load, 'roles')
  const mutation = useMutation()
  const [selected, setSelected] = useState(null)

  return (
    <Panel title="Roles and permissions" description="Permissions granted by each role. Roles also provide default feature access.">
      <DataState state={roles} loadingMessage="Loading roles…">
        {(list) => {
          const role = list.find((r) => r.id === selected) ?? list[0]
          const ownRole = role.id === user?.role
          const editable = canManage && !ownRole
          return (
            <div className="grid gap-4">
              <SegmentedControl
                label="Role"
                value={role.id}
                onChange={setSelected}
                options={list.map((r) => ({ value: r.id, label: r.label }))}
              />
              {canManage && ownRole && (
                <p className="text-sm text-muted">You cannot change the permissions of your own role.</p>
              )}
              <fieldset disabled={!editable || mutation.saving}>
                <legend className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">Permissions</legend>
                <ul className="grid gap-1 sm:grid-cols-2">
                  {permissions.map((permission) => {
                    const granted = role.permissions.includes(permission.id)
                    return (
                      <li key={permission.id}>
                        {editable ? (
                          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 hover:bg-raised has-focus-visible:outline-2 has-focus-visible:outline-accent">
                            <input
                              type="checkbox"
                              checked={granted}
                              onChange={(e) =>
                                mutation.mutate(() => adminService.setRolePermission(role.id, permission.id, e.target.checked))
                              }
                              className="size-4 accent-accent"
                            />
                            <span className="min-w-0">
                              <span className="block text-sm text-text">{permission.label}</span>
                              <span className="block text-xs text-subtle">{permission.id}</span>
                            </span>
                          </label>
                        ) : (
                          <div className="flex min-h-11 items-center gap-3 px-2">
                            <span className={`text-sm ${granted ? 'text-ok' : 'text-subtle'}`} aria-hidden="true">
                              {granted ? '✓' : '–'}
                            </span>
                            <span className="min-w-0">
                              <span className={`block text-sm ${granted ? 'text-text' : 'text-subtle'}`}>
                                {permission.label}
                                <span className="sr-only">{granted ? ': granted' : ': not granted'}</span>
                              </span>
                              <span className="block text-xs text-subtle">{permission.id}</span>
                            </span>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </fieldset>
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-muted uppercase">Default features</p>
                <p className="text-sm text-text">
                  {role.features.map((id) => features.find((f) => f.id === id)?.label ?? id).join(', ') || 'None'}
                </p>
              </div>
              <MutationError error={mutation.error} />
            </div>
          )
        }}
      </DataState>
    </Panel>
  )
}

export default RolesSection
