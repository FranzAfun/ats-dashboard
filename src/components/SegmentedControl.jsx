import { useId } from 'react'

/**
 * Single-choice control rendered as a radio group (keyboard: Tab to the
 * group, arrow keys to change). Used for filters and period selection.
 */
function SegmentedControl({ label, options, value, onChange }) {
  const name = useId()
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{label}</legend>
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-md border border-border bg-canvas p-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="relative inline-flex min-h-11 cursor-pointer items-center rounded px-3 text-sm font-medium text-muted transition-colors duration-150 has-checked:bg-raised has-checked:text-text has-focus-visible:outline-2 has-focus-visible:outline-accent hover:text-text motion-reduce:transition-none"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
            {option.count !== undefined && (
              <span className="ml-1.5 text-xs text-subtle tabular-nums">{option.count}</span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default SegmentedControl
