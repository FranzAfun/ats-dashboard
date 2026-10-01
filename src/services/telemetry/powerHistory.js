import { createStore } from '../../lib/store.js'
import { powerTelemetryResource } from './telemetryService.js'

/**
 * Short-term, in-memory history of received power telemetry for live
 * trends. It only contains samples received while a trend is shown and is
 * cleared when no trend is shown; it is NOT historical storage (TBD).
 */
export const MAX_SAMPLES = 180

const samples = createStore([])
let stopResource = null
let listeners = 0

function record() {
  const snapshot = powerTelemetryResource.getSnapshot()
  if (snapshot.status !== 'ready') return
  const { timestamp, load } = snapshot.data
  const list = samples.get()
  // The same snapshot can be delivered again (e.g. stale data); keep one.
  if (list.length && list[list.length - 1].timestamp === timestamp) return
  samples.set([...list.slice(-(MAX_SAMPLES - 1)), { timestamp, value: load.power }])
}

export const powerHistory = {
  subscribe(listener) {
    const off = samples.subscribe(listener)
    listeners += 1
    if (listeners === 1) {
      stopResource = powerTelemetryResource.subscribe(record)
      record()
    }
    return () => {
      off()
      listeners -= 1
      if (listeners === 0) {
        stopResource?.()
        stopResource = null
        // The trend covers the current viewing only; never join samples
        // across a period in which nothing was recorded.
        samples.set([])
      }
    }
  },
  getSnapshot: samples.get,
}
