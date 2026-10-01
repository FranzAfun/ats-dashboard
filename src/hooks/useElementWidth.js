import { useCallback, useState } from 'react'

/** Tracks an element's content width with ResizeObserver (callback ref). */
export function useElementWidth() {
  const [width, setWidth] = useState(0)
  const [observer] = useState(() =>
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width))),
  )

  const ref = useCallback(
    (node) => {
      if (!observer) return
      observer.disconnect()
      if (node) observer.observe(node)
    },
    [observer],
  )

  return [ref, width]
}
