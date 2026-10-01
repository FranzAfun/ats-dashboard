import { useId, useState } from 'react'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import Panel from '../../components/Panel.jsx'
import { buttonClasses } from '../../components/buttonClasses.js'
import { sourceById, sources } from '../../config/sources.config.js'
import { useCommand } from '../../hooks/useCommand.js'
import { commandService } from '../../services/commands/commandService.js'
import { describeSourceState } from '../shared/sourceState.js'
import CommandFeedback from './CommandFeedback.jsx'

/**
 * Source change request. Options that cannot be selected because of the
 * system state (already active, unavailable) are disabled with the reason
 * shown; the control itself is only rendered for permitted users.
 */
function ChangeSourceControl({ status, live }) {
  const name = useId()
  const [target, setTarget] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const command = useCommand()

  const blocked = !live || status.ats.transitioning || command.inProgress
  const blockedReason = !live
    ? 'Commands are unavailable while data is not live.'
    : status.ats.transitioning
      ? 'A source transition is in progress.'
      : null

  function confirm() {
    setConfirming(false)
    const requested = target
    setTarget(null)
    command.run((onUpdate) => commandService.changeSource(requested, onUpdate))
  }

  return (
    <Panel title="Change source / input" description="Request the ATS to switch the active source.">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (target && !blocked) setConfirming(true)
        }}
        className="grid gap-4"
      >
        <fieldset disabled={blocked} className="grid gap-2">
          <legend className="mb-2 text-xs text-muted">Target source</legend>
          {sources.map((source) => {
            const state = status.sourceStatus[source.id]
            const display = describeSourceState(state, status.ats.transitioning)
            const unavailable = state.available !== true
            const isActive = source.id === status.activeSource
            const disabled = unavailable || isActive
            return (
              <label
                key={source.id}
                className={`relative flex min-h-11 items-center gap-3 overflow-hidden rounded-md border bg-raised py-2 pr-3 pl-4 has-checked:border-accent has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                  disabled ? 'cursor-not-allowed border-border opacity-70' : 'cursor-pointer border-control'
                }`}
              >
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1" style={{ background: `var(${source.colorVar})` }} />
                <input
                  type="radio"
                  name={name}
                  value={source.id}
                  checked={target === source.id}
                  disabled={disabled}
                  onChange={() => setTarget(source.id)}
                  className="size-4 accent-accent"
                />
                <span className="flex-1 text-sm font-medium text-text">{source.longLabel}</span>
                <span className="text-xs text-subtle">
                  {isActive ? 'Currently active' : unavailable ? display.label : 'Available'}
                </span>
              </label>
            )
          })}
        </fieldset>
        {blockedReason && <p className="text-sm text-warning">{blockedReason}</p>}
        <div>
          <button type="submit" className={buttonClasses.primary} disabled={!target || blocked}>
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
        <strong className="text-text">{sourceById[target]?.longLabel}</strong>? This changes the ATS operating
        state. The change is only shown as applied after the system confirms it.
      </ConfirmDialog>
    </Panel>
  )
}

export default ChangeSourceControl
