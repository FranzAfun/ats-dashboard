/**
 * Data freshness (04_DATA_CONTRACT.md §17): LIVE, STALE or DISCONNECTED.
 *
 * @param {{ timestamp?: string | null, connection: string, now: number, staleAfterMs: number }} input
 * @returns {"live" | "stale" | "disconnected" | "unknown"}
 */
export function getFreshness({ timestamp, connection, now, staleAfterMs }) {
  if (connection === 'disconnected' || connection === 'error') return 'disconnected'
  if (!timestamp) return 'unknown'
  const age = now - Date.parse(timestamp)
  if (Number.isNaN(age)) return 'unknown'
  return age > staleAfterMs ? 'stale' : 'live'
}
