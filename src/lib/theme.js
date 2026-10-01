import { createStore } from './store.js'

/**
 * Light/dark theme. A saved choice wins; without one the operating-system
 * `prefers-color-scheme` is followed live (browsers report "light" when
 * the system has no explicit setting). The initial value is applied
 * before first paint by
 * public/theme-init.js (same storage key and rules).
 */
const STORAGE_KEY = 'ats-dashboard.theme'
const THEMES = ['light', 'dark']
const query = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: light)') : null

function readSaved() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return THEMES.includes(value) ? value : null
  } catch {
    return null
  }
}

function systemTheme() {
  return query?.matches ? 'light' : 'dark'
}

function apply(theme) {
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme)
}

const store = createStore(readSaved() ?? systemTheme())
apply(store.get())

query?.addEventListener('change', () => {
  if (readSaved()) return
  store.set(systemTheme())
  apply(store.get())
})

export const themeStore = {
  subscribe: store.subscribe,
  getSnapshot: store.get,
  /** Saves an explicit choice; it then overrides the system preference. */
  set(theme) {
    if (!THEMES.includes(theme)) return
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Storage unavailable: the choice lasts for this page load.
    }
    store.set(theme)
    apply(theme)
  },
}
