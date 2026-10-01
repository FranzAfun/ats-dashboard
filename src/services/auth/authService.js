import { createStore } from '../../lib/store.js'
import { adapter } from '../integration/adapter.js'
import { toIntegrationError } from '../integration/errors.js'

/**
 * Session/effective-access state for the current user.
 * The authentication provider is TBD; in mock mode the session comes from
 * the mock access backend and the user is chosen with the mock controls.
 */
const sessionStore = createStore({ status: 'loading', access: null, error: null })

let loading = null
let started = false

function load() {
  const request = adapter.access
    .getSession()
    .then((access) => {
      if (loading === request) sessionStore.set({ status: 'ready', access, error: null })
    })
    .catch((error) => {
      if (loading === request) {
        sessionStore.set({ status: 'error', access: null, error: toIntegrationError(error) })
      }
    })
  loading = request
}

function start() {
  if (started) return
  started = true
  load()
  adapter.access.subscribe(load)
}

export const authService = {
  subscribe(listener) {
    start()
    return sessionStore.subscribe(listener)
  },
  getSnapshot: sessionStore.get,
  reload: load,
}

/**
 * Mock-only session controls. `null` when the live adapter is in use.
 */
export const mockSession =
  adapter.kind === 'mock'
    ? {
        listUsers: () => adapter.access.mockUsers(),
        currentUserId: () => adapter.access.currentMockUserId(),
        switchUser: (userId) => adapter.access.switchMockUser(userId),
        subscribe: adapter.access.subscribe,
      }
    : null
