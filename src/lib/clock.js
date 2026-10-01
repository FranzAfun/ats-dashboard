import { createStore } from './store.js'

/**
 * A shared one-second clock for freshness checks. It only ticks while
 * something is subscribed.
 */
const clock = createStore(Date.now())
let timer = null
let count = 0

export const secondClock = {
  subscribe(listener) {
    const off = clock.subscribe(listener)
    count += 1
    if (count === 1) {
      clock.set(Date.now())
      timer = setInterval(() => clock.set(Date.now()), 1000)
    }
    return () => {
      off()
      count -= 1
      if (count === 0) {
        clearInterval(timer)
        timer = null
      }
    }
  },
  getSnapshot: clock.get,
}
