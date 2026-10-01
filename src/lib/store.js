/**
 * Minimal external store compatible with React's useSyncExternalStore.
 */
export function createStore(initialState) {
  let state = initialState
  const listeners = new Set()

  return {
    get: () => state,
    set(next) {
      state = typeof next === 'function' ? next(state) : next
      for (const listener of listeners) listener()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
