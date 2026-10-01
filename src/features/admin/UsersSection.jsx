import { useCallback, useRef, useState } from 'react'
import DataState from '../../components/DataState.jsx'
import Panel from '../../components/Panel.jsx'
import StatusIndicator from '../../components/StatusIndicator.jsx'
import { useAccess } from '../../hooks/useAccess.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { adminService } from '../../services/auth/adminService.js'
import UserDetail from './UserDetail.jsx'

function overrideSummary(user) {
  const parts = []
  if (user.featuresGranted?.length) parts.push(`+${user.featuresGranted.length} feature`)
  if (user.featuresRevoked?.length) parts.push(`−${user.featuresRevoked.length} feature`)
  if (user.permissionsGranted?.length) parts.push(`+${user.permissionsGranted.length} permission`)
  if (user.permissionsRevoked?.length) parts.push(`−${user.permissionsRevoked.length} permission`)
  return parts.join(', ')
}

/** Users list and per-user management (admin.users.view). */
function UsersSection() {
  const { hasPermission, user: me } = useAccess()
  const [selectedId, setSelectedId] = useState(null)
  const detailRef = useRef(null)

  function select(userId) {
    setSelectedId(userId)
    // In the single-column layout the details sit below the list.
    if (window.matchMedia('(max-width: 79.99rem)').matches) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      requestAnimationFrame(() =>
        detailRef.current?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }),
      )
    }
  }

  const load = useCallback(async () => {
    // Role labels need admin.permissions.view; otherwise use the role ids in use.
    const [users, roles] = await Promise.all([
      adminService.listUsers(),
      hasPermission('admin.permissions.view') ? adminService.listRoles() : null,
    ])
    return { users, roles: roles ?? [...new Set(users.map((u) => u.role))].map((id) => ({ id, label: id })) }
  }, [hasPermission])
  const data = useAdminData(load, 'users')

  return (
    <Panel title="Users" description="Accounts, roles, status and individual feature access.">
      <DataState state={data} loadingMessage="Loading users…" isEmpty={(d) => !d?.users?.length} emptyTitle="No users">
        {({ users, roles }) => {
          const selected = users.find((u) => u.id === selectedId)
          const roleLabel = (id) => roles.find((r) => r.id === id)?.label ?? id
          return (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <ul className="grid content-start gap-2">
                {users.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => select(u.id)}
                      aria-pressed={u.id === selectedId}
                      className={`grid w-full gap-1 rounded-md border px-3 py-2 text-left transition-colors duration-150 hover:bg-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${
                        u.id === selectedId ? 'border-accent bg-raised' : 'border-border bg-surface'
                      }`}
                    >
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-text">
                          {u.name}
                          {u.id === me?.id && <span className="ml-2 text-xs font-normal text-subtle">(you)</span>}
                        </span>
                        <StatusIndicator
                          tone={u.status === 'active' ? 'ok' : 'offline'}
                          label={u.status === 'active' ? 'Active' : 'Disabled'}
                        />
                      </span>
                      <span className="text-xs text-muted">
                        {u.username} · {roleLabel(u.role)}
                        {overrideSummary(u) && ` · ${overrideSummary(u)}`}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div ref={detailRef} className="min-w-0 scroll-mt-20 rounded-md border border-border bg-canvas p-4">
                {selected ? (
                  <>
                    <h3 className="mb-3 text-base font-semibold text-text">{selected.name}</h3>
                    <UserDetail key={selected.id} user={selected} roleOptions={roles} refreshing={Boolean(data.refreshing)} />
                  </>
                ) : (
                  <p className="text-sm text-muted">Select a user to review or manage their access.</p>
                )}
              </div>
            </div>
          )
        }}
      </DataState>
    </Panel>
  )
}

export default UsersSection
