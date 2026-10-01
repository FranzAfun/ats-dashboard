import { useEffect, useState, useSyncExternalStore } from 'react'
import LoadingState from '../components/LoadingState.jsx'
import { useAccess } from '../hooks/useAccess.js'
import { useConnectionState } from '../hooks/useTelemetry.js'
import { BootContext } from './bootContext.js'

// Upper bound for waiting on the first integration connection at startup.
const MAX_CONNECTION_WAIT_MS = 3000

/**
 * One application-level loader for startup. It stays mounted (a single
 * Thinking Orb instance) through every startup phase — route code, session
 * and the first integration connection — instead of three loaders
 * replacing each other. While it is shown, page-level loaders underneath
 * render nothing (BootContext), so there are no duplicates.
 *
 * Shown only once per page load.
 */
function BootGate({ router, children }) {
  const routerReady = useSyncExternalStore(router.subscribe, () => router.state.initialized)
  const { status } = useAccess()
  const connection = useConnectionState()
  const [connectionWaitOver, setConnectionWaitOver] = useState(false)
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setConnectionWaitOver(true), MAX_CONNECTION_WAIT_MS)
    return () => clearTimeout(timer)
  }, [])

  const connectionSettled = connection !== 'connecting' || connectionWaitOver
  const ready = routerReady && status !== 'loading' && connectionSettled

  useEffect(() => {
    if (ready && !booted) {
      // Latch: later reconnects or reloads never bring the boot overlay back.
      const frame = requestAnimationFrame(() => setBooted(true))
      return () => cancelAnimationFrame(frame)
    }
    return undefined
  }, [ready, booted])

  const booting = !booted
  const message = !routerReady
    ? 'Loading ATS Dashboard…'
    : status === 'loading'
      ? 'Loading session…'
      : 'Connecting to ATS…'

  return (
    <BootContext.Provider value={booting}>
      <div inert={booting}>{children}</div>
      {booting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas">
          <LoadingState orb="connecting" message={message} ignoreBoot />
        </div>
      )}
    </BootContext.Provider>
  )
}

export default BootGate
