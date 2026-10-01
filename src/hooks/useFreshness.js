import { useSyncExternalStore } from 'react'
import { staleAfterMs } from '../config/app.config.js'
import { secondClock } from '../lib/clock.js'
import { getFreshness } from '../utils/freshness.js'
import { useConnectionState } from './useTelemetry.js'

/** Re-evaluated every second so data turns STALE without new messages. */
export function useFreshness(timestamp) {
  const now = useSyncExternalStore(secondClock.subscribe, secondClock.getSnapshot)
  const connection = useConnectionState()
  return getFreshness({ timestamp, connection, now, staleAfterMs })
}
