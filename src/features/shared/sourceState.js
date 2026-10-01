/**
 * Presentation of a source's state. Availability semantics come from the
 * source system (04_DATA_CONTRACT.md §5); null means unknown.
 */
export function describeSourceState(state, transitioning = false) {
  if (!state || state.available === null) return { tone: 'offline', label: 'Unknown' }
  if (state.active) return { tone: 'ok', label: 'Active' }
  if (transitioning && state.available) return { tone: 'info', label: 'Standby' }
  if (state.available) return { tone: 'neutral', label: 'Standby' }
  return { tone: 'offline', label: 'Unavailable' }
}

const temperatureTones = { normal: 'ok', warning: 'warning', critical: 'critical' }

/** The temperature status comes from the system; it is not derived here. */
export function describeTemperatureStatus(status) {
  if (!status) return { tone: 'offline', label: 'Unknown' }
  return {
    tone: temperatureTones[status] ?? 'offline',
    label: status.charAt(0).toUpperCase() + status.slice(1),
  }
}
