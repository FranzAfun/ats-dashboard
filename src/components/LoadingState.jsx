import { ThinkingOrb } from 'thinking-orbs'

/**
 * Loading/processing state. The orb state should match the meaning of the
 * operation (SPEC.md §8), e.g. "connecting" for connection establishment,
 * "searching" for retrieving data, "solving" for analytics, "working" for
 * command processing and "composing" for export.
 *
 * The theme is pinned to "dark" because the application theme is dark
 * regardless of the operating-system preference. The orb renders a static
 * frame when reduced motion is requested.
 */
function LoadingState({ message, orb = 'searching', size = 'default', className = '' }) {
  if (size === 'inline') {
    return (
      <span role="status" className={`inline-flex items-center gap-2 text-sm text-muted ${className}`}>
        <ThinkingOrb state={orb} size={20} theme="dark" aria-hidden="true" />
        {message}
      </span>
    )
  }

  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 px-4 py-8 text-center text-sm text-muted ${className}`}
    >
      <ThinkingOrb state={orb} size={64} theme="dark" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

export default LoadingState
