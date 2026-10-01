import { useEffect, useRef, useState } from 'react'

export const LOADING_SHOW_DELAY_MS = 200
export const LOADING_MIN_VISIBLE_MS = 400

/**
 * Smooths a loading flag so loaders do not flicker:
 * - a loader only appears if loading lasts longer than `delay`
 *   (fast responses never show a loader);
 * - once shown, it stays at least `minVisible` so it never flashes.
 *
 * Returns { showLoader, pending }:
 *   showLoader — render the loader;
 *   pending    — loading has started but the loader is not shown yet
 *                (render a quiet placeholder, not stale content).
 */
export function useStableLoading(loading, { delay = LOADING_SHOW_DELAY_MS, minVisible = LOADING_MIN_VISIBLE_MS } = {}) {
  const [shownAt, setShownAt] = useState(null)
  const shownAtRef = useRef(null)

  useEffect(() => {
    if (loading) {
      if (shownAtRef.current !== null) return undefined
      const timer = setTimeout(() => {
        shownAtRef.current = Date.now()
        setShownAt(shownAtRef.current)
      }, delay)
      return () => clearTimeout(timer)
    }
    if (shownAtRef.current === null) return undefined
    const remaining = Math.max(0, minVisible - (Date.now() - shownAtRef.current))
    const timer = setTimeout(() => {
      shownAtRef.current = null
      setShownAt(null)
    }, remaining)
    return () => clearTimeout(timer)
  }, [loading, delay, minVisible])

  const showLoader = shownAt !== null
  return { showLoader, pending: loading && !showLoader }
}
