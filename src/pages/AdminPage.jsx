import { useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SegmentedControl from '../components/SegmentedControl.jsx'
import FeatureFlagsSection from '../features/admin/FeatureFlagsSection.jsx'
import RolesSection from '../features/admin/RolesSection.jsx'
import UsersSection from '../features/admin/UsersSection.jsx'
import { useAccess } from '../hooks/useAccess.js'
import { isMockData } from '../services/integration/adapter.js'

/** Sections are listed only when the user holds their view permission. */
const sections = [
  { id: 'users', label: 'Users', action: 'admin.users.view', Component: UsersSection },
  { id: 'roles', label: 'Roles & permissions', action: 'admin.permissions.view', Component: RolesSection },
  { id: 'features', label: 'Feature flags', action: 'admin.features.view', Component: FeatureFlagsSection },
]

function AdminPage() {
  const { canPerform } = useAccess()
  const available = sections.filter((s) => canPerform(s.action))
  const [selected, setSelected] = useState(null)
  const current = available.find((s) => s.id === selected) ?? available[0]

  return (
    <>
      <PageHeader title="Administration" description="Users, roles, permissions and feature access." />
      {isMockData && (
        <p className="mb-4 rounded-md border border-info/60 bg-surface px-4 py-3 text-sm text-muted">
          <span className="font-semibold text-info">Mock access backend.</span> Changes apply immediately to the
          mock session and reset when the page is reloaded. Production authentication and authorization are
          not configured yet.
        </p>
      )}
      {available.length === 0 ? (
        <EmptyState
          title="No administration sections assigned"
          message="Your account can open Administration but has no section permissions."
        />
      ) : (
        <div className="grid gap-4">
          {available.length > 1 && (
            <SegmentedControl
              label="Administration section"
              value={current.id}
              onChange={setSelected}
              options={available.map((s) => ({ value: s.id, label: s.label }))}
            />
          )}
          <current.Component />
        </div>
      )}
    </>
  )
}

export default AdminPage
