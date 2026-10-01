import { useId, useState } from 'react'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import DataState from '../../components/DataState.jsx'
import MetricValue from '../../components/MetricValue.jsx'
import Panel from '../../components/Panel.jsx'
import { buttonClasses } from '../../components/buttonClasses.js'
import { sourceById, sources } from '../../config/sources.config.js'
import { useCommand } from '../../hooks/useCommand.js'
import { useControlState } from '../../hooks/useTelemetry.js'
import { commandService } from '../../services/commands/commandService.js'
import { formatCurrency } from '../../utils/format.js'
import CommandFeedback from './CommandFeedback.jsx'
import { parseCostInput } from './validation.js'

const inputClass =
  'min-h-11 w-full rounded-md border border-control bg-canvas px-3 text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-invalid:border-critical'

/** Manual input cost/day update (FR-HMI-002). Meaning of the value is TBD. */
function InputCostControl({ live }) {
  const control = useControlState()
  const sourceId = useId()
  const valueId = useId()
  const errorId = useId()
  const [source, setSource] = useState('grid')
  const [text, setText] = useState('')
  const [touched, setTouched] = useState(false)
  const [pending, setPending] = useState(null)
  const command = useCommand()

  const parsed = parseCostInput(text)
  const showError = touched && parsed.error
  const blocked = !live || command.inProgress

  return (
    <Panel title="Input cost/day" description="Manually set the configured input cost per day for a source.">
      <DataState state={control} loadingMessage="Loading control values…" isEmpty={(d) => !d?.inputCostPerDay}>
        {(data) => {
          const current = data.inputCostPerDay[source]
          return (
            <form
              noValidate
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                setTouched(true)
                if (parsed.error || blocked) return
                setPending({ source, value: parsed.value, currency: current?.currency })
              }}
            >
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {sources.map((s) => (
                  <MetricValue
                    key={s.id}
                    size="sm"
                    label={`${s.label} (current)`}
                    value={formatCurrency(data.inputCostPerDay[s.id]?.value, data.inputCostPerDay[s.id]?.currency)}
                  />
                ))}
              </dl>
              <fieldset disabled={blocked} className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label htmlFor={sourceId} className="text-xs text-muted">Source</label>
                  <select id={sourceId} value={source} onChange={(e) => setSource(e.target.value)} className={inputClass}>
                    {sources.map((s) => (
                      <option key={s.id} value={s.id}>{s.longLabel}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-1">
                  <label htmlFor={valueId} className="text-xs text-muted">
                    New cost per day ({current?.currency ?? 'currency TBD'})
                  </label>
                  <input
                    id={valueId}
                    inputMode="decimal"
                    autoComplete="off"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={() => setTouched(true)}
                    aria-invalid={showError ? 'true' : undefined}
                    aria-describedby={showError ? errorId : undefined}
                    className={inputClass}
                    placeholder={current ? String(current.value) : ''}
                  />
                </div>
              </fieldset>
              {showError && (
                <p id={errorId} className="text-sm text-critical">{parsed.error}</p>
              )}
              {!live && <p className="text-sm text-warning">Commands are unavailable while data is not live.</p>}
              <div>
                <button type="submit" className={buttonClasses.primary} disabled={blocked}>
                  Update input cost
                </button>
              </div>
              <CommandFeedback response={command.response} onDismiss={command.reset} />
            </form>
          )
        }}
      </DataState>

      <ConfirmDialog
        open={pending !== null}
        title="Confirm input cost update"
        confirmLabel="Update cost"
        onCancel={() => setPending(null)}
        onConfirm={() => {
          const request = pending
          setPending(null)
          setText('')
          setTouched(false)
          command.run((onUpdate) => commandService.updateInputCost(request, onUpdate))
        }}
      >
        Set the input cost/day for <strong className="text-text">{sourceById[pending?.source]?.longLabel}</strong> to{' '}
        <strong className="text-text">{formatCurrency(pending?.value, pending?.currency)}</strong>?
      </ConfirmDialog>
    </Panel>
  )
}

export default InputCostControl
