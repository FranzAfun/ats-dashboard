import { useCallback, useState } from 'react'
import { toIntegrationError } from '../services/integration/errors.js'

/** Runs a write operation and exposes saving/error state. */
export function useMutation() {
  const [state, setState] = useState({ saving: false, error: null })
  const mutate = useCallback(async (operation) => {
    setState({ saving: true, error: null })
    try {
      const result = await operation()
      setState({ saving: false, error: null })
      return result
    } catch (error) {
      setState({ saving: false, error: toIntegrationError(error) })
      return null
    }
  }, [])
  return { ...state, mutate }
}
