import { useState } from 'react'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import Panel from '../../components/Panel.jsx'
import Picker from '../../components/Picker.jsx'
import { buttonClasses } from '../../components/buttonClasses.js'
import { sourceById, sources } from '../../config/sources.config.js'
import { useCommand } from '../../hooks/useCommand.js'
import { commandService } from '../../services/commands/commandService.js'
import { describeSourceState } from '../shared/sourceState.js'
import CommandFeedback from './CommandFeedback.jsx'

/**
 * Source change request. Sources that cannot be chosen because of the
 * system state (already active, unavailable) are shown as disabled options
 * with the reason; the control itself is only rendered for permitted users.
 */
function ChangeSourceControl({ status, live }) {
  const [target, setTarget] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const command = useCommand()

  const blocked = !live || status.ats.transitioning || command.inProgress
  const blockedReason = !live
    ? 'Commands are unavailable while data is not live.'
    : status.ats.transitioning
      ? 'A source transition is in progress.'
      : null

  const options = sources.map((source) => {
    const state = status.sourceStatus[source.id]
    const isActive = source.id === status.activeSource
    const unavailable = state?.available !== true
    return {
      value: source.id,
      label: source.longLabel,
      disabled: isActive || unavailable,
      description: isActive
        ? 'Currently active'
        : unavailable
          ? describeSourceState(state, status.ats.transitioning).label
          : 'Available',
    }
  })
  // A target that became active or unavailable can no longer be requested.
  const validTarget = options.some((o) => o.value === target && !o.disabled) ? target : null

  function confirm() {
    setConfirming(false)
    const requested = validTarget
    setTarget(null)
    command.run((onUpdate) => commandService.changeSource(requested, onUpdate))
  }

  return (
    <Panel title="Change source / input" description="Request the ATS to switch the active source.">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (validTarget && !blocked) setConfirming(true)
        }}
        className="grid gap-4"
      >
        <p className="text-sm text-muted">
          Active source:{' '}
          <span className="font-semibold text-text">{sourceById[status.activeSource]?.longLabel ?? 'None'}</span>
        </p>
        <Picker
          label="Target source"
          placeholder="Select a source"
          value={validTarget}
          options={options}
          disabled={blocked}
          onChange={setTarget}
        />
        {blockedReason && <p className="text-sm text-warning">{blockedReason}</p>}
        <div>
          <button type="submit" className={buttonClasses.primary} disabled={!validTarget || blocked}>
            Request source change
          </button>
        </div>
        <CommandFeedback response={command.response} onDismiss={command.reset} />
      </form>

      <ConfirmDialog
        open={confirming}
        title="Confirm source change"
        confirmLabel="Change source"
        onConfirm={confirm}
        onCancel={() => setConfirming(false)}
      >
        Change the active source from{' '}
        <strong className="text-text">{sourceById[status.activeSource]?.longLabel ?? 'none'}</strong> to{' '}
        <strong className="text-text">{sourceById[validTarget]?.longLabel}</strong>? This changes the ATS operating
        state. The change is only shown as applied after the system confirms it.
      </ConfirmDialog>
    </Panel>
  )
}

export default ChangeSourceControl
