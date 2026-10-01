import { useContext } from 'react'
import { ThinkingOrb } from 'thinking-orbs'
import { BootContext } from '../app/bootContext.js'

/**
 * Loading/processing state. The orb state should match the meaning of the
 * operation (SPEC.md §8), e.g. "connecting" for connection establishment,
 * "searching" for retrieving data, "solving" for analytics, "working" for
 * command processing and "composing" for export.
 *
 * theme="auto" follows the data-theme attribute on <html>, so the orb
 * matches the selected application theme. The orb renders a static frame
 * when reduced motion is requested.
 *
 * While the startup overlay (BootGate) is shown, loaders underneath render
 * nothing so the same loading state is never communicated twice.
 */
function LoadingState({ message, orb = 'searching', size = 'default', className = '', ignoreBoot = false }) {
  const booting = useContext(BootContext)
  if (booting && !ignoreBoot) return null

  if (size === 'inline') {
    return (
      <span role="status" className={`inline-flex items-center gap-2 text-sm text-muted ${className}`}>
        <ThinkingOrb state={orb} size={20} theme="auto" aria-hidden="true" />
        {message}
      </span>
    )
  }

  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 px-4 py-8 text-center text-sm text-muted ${className}`}
    >
      <ThinkingOrb state={orb} size={64} theme="auto" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

export default LoadingState
