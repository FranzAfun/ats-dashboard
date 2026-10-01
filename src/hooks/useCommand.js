import { useCallback, useRef, useState } from 'react'
import { FINAL_COMMAND_STATUSES } from '../services/integration/contract.js'

/**
 * Tracks one HMI command: idle → pending → accepted → applied / rejected /
 * failed. A new command cannot start while one is in progress, and
 * nothing is retried automatically.
 */
export function useCommand() {
  const [response, setResponse] = useState(null)
  const running = useRef(false)

  const run = useCallback(async (send) => {
    if (running.current) return null
    running.current = true
    try {
      return await send((update) => setResponse(update))
    } finally {
      running.current = false
    }
  }, [])

  const inProgress = response !== null && !FINAL_COMMAND_STATUSES.includes(response.status)
  const reset = useCallback(() => setResponse(null), [])
  return { response, inProgress, run, reset }
}
