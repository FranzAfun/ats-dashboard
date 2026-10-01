import { useEffect, useState } from 'react'
import { toIntegrationError } from '../services/integration/errors.js'

// Last successful result per cache key (module scope, this page load only).
const cache = new Map()

/**
 * Loads data from a service call. `load` must be stable for the given
 * `key`; changing `key` triggers a reload. Returns
 * { status: "loading" | "ready" | "error", data, error, reload }.
 * With keepPrevious, previously loaded data stays visible while reloading.
 * With cache, the last result for the same key is shown immediately on a
 * later mount while it is refreshed (`refreshing: true`), so returning to
 * a page does not show a loader again.
 */
export function useAsyncData(load, key, { keepPrevious = false, cache: useCache = false } = {}) {
  const [state, setState] = useState(() =>
    useCache && cache.has(key)
      ? { key: null, status: 'ready', data: cache.get(key), error: null }
      : { key: null, status: 'loading', data: null, error: null },
  )
  const [attempt, setAttempt] = useState(0)
  const requestKey = `${key}:${attempt}`

  useEffect(() => {
    let cancelled = false
    load()
      .then((data) => {
        if (cancelled) return
        if (useCache) cache.set(key, data)
        setState({ key: requestKey, status: 'ready', data, error: null })
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ key: requestKey, status: 'error', data: null, error: toIntegrationError(error) })
        }
      })
    return () => {
      cancelled = true
    }
    // `load` is intentionally keyed by `requestKey`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey])

  const current =
    state.key === requestKey
      ? state
      : (keepPrevious || useCache) && state.status === 'ready'
        ? { ...state, refreshing: true }
        : { status: 'loading', data: null, error: null }
  return { ...current, reload: () => setAttempt((n) => n + 1) }
}
