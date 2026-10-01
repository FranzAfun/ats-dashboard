import { useCallback } from 'react'
import DataState from '../../components/DataState.jsx'
import Panel from '../../components/Panel.jsx'
import StatusIndicator from '../../components/StatusIndicator.jsx'
import Switch from '../../components/Switch.jsx'
import { features } from '../../config/access.config.js'
import { useAccess } from '../../hooks/useAccess.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { useMutation } from '../../hooks/useMutation.js'
import { adminService } from '../../services/auth/adminService.js'
import MutationError from './MutationError.jsx'

/** Global feature flags (admin.features.view / admin.features.manage). */
function FeatureFlagsSection() {
  const { canPerform } = useAccess()
  const canManage = canPerform('admin.features.manage')
  const load = useCallback(() => adminService.getFeatureFlags(), [])
  const flags = useAdminData(load, 'flags')
  const mutation = useMutation()

  return (
    <Panel
      title="Feature flags"
      description="System-wide availability. A disabled feature is removed for every user, regardless of role."
    >
      <DataState state={flags} loadingMessage="Loading feature flags…">
        {(data) => (
          <div className="grid gap-3">
            <ul className="divide-y divide-border">
              {features.map((feature) => (
                <li key={feature.id} className="flex items-center justify-between gap-4 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text">{feature.label}</p>
                    <p className="text-xs text-subtle">{feature.id}</p>
                  </div>
                  {canManage ? (
                    <Switch
                      checked={data[feature.id] === true}
                      label={`${feature.label} enabled`}
                      disabled={mutation.saving}
                      onChange={(enabled) => mutation.mutate(() => adminService.setFeatureFlag(feature.id, enabled))}
                    />
                  ) : (
                    <StatusIndicator
                      tone={data[feature.id] ? 'ok' : 'offline'}
                      label={data[feature.id] ? 'Enabled' : 'Disabled'}
                    />
                  )}
                </li>
              ))}
            </ul>
            <MutationError error={mutation.error} />
          </div>
        )}
      </DataState>
    </Panel>
  )
}

export default FeatureFlagsSection
