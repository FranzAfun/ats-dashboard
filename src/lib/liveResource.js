import { toIntegrationError } from '../services/integration/errors.js'
import { createStore } from './store.js'

/**
 * Shares one adapter subscription between all React subscribers and keeps
 * the latest value. The adapter subscription starts with the first
 * subscriber and stops with the last, so data is only requested while a
 * permitted component is mounted.
 *
 * Snapshot: { status: "loading" | "ready" | "error", data, error }
 * On error the last data is kept but status becomes "error", so the UI
 * never presents it as live.
 */
export function createLiveResource(subscribeToAdapter, validate = (value) => value) {
  const store = createStore({ status: 'loading', data: null, error: null })
  let unsubscribe = null
  let count = 0

  function onData(raw) {
    try {
      store.set({ status: 'ready', data: validate(raw), error: null })
    } catch (error) {
      store.set((state) => ({ ...state, status: 'error', error: toIntegrationError(error) }))
    }
  }

  function onError(error) {
    store.set((state) => ({ ...state, status: 'error', error: toIntegrationError(error) }))
  }

  return {
    subscribe(listener) {
      const off = store.subscribe(listener)
      count += 1
      if (count === 1) {
        store.set((state) => ({ ...state, status: state.data ? state.status : 'loading' }))
        unsubscribe = subscribeToAdapter(onData, onError)
      }
      return () => {
        off()
        count -= 1
        if (count === 0) {
          unsubscribe?.()
          unsubscribe = null
        }
      }
    },
    getSnapshot: store.get,
  }
}
