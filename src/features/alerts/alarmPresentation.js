const severityOrder = { critical: 0, warning: 1, info: 2 }

export const severityLabel = { critical: 'Critical', warning: 'Warning', info: 'Info' }

/** Active alarms first, then by severity, then newest first. */
export function sortAlarms(alarms) {
  return [...alarms].sort(
    (a, b) =>
      Number(b.active) - Number(a.active) ||
      severityOrder[a.severity] - severityOrder[b.severity] ||
      Date.parse(b.timestamp) - Date.parse(a.timestamp),
  )
}
