/** Accessible on/off switch with a 44px touch target. */
function Switch({ checked, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group inline-flex min-h-11 min-w-11 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-150 motion-reduce:transition-none ${
          checked ? 'border-accent bg-accent' : 'border-control bg-canvas'
        }`}
      >
        <span
          className={`inline-block size-4 rounded-full transition-transform duration-150 motion-reduce:transition-none ${
            checked ? 'translate-x-6 bg-canvas' : 'translate-x-1 bg-muted'
          }`}
        />
      </span>
    </button>
  )
}

export default Switch
