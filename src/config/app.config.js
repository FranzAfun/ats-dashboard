/**
 * Application configuration.
 *
 * VITE_DATA_SOURCE selects the integration adapter at build time
 * (see vite.config.js):
 *   - "mock": development/demo data from src/data/mock (never production data)
 *   - "live": the production integration adapter (transport TBD, see
 *             docs/Project/07_INTEGRATION_PLAN.md)
 *
 * When unset, the development server uses "mock" and builds use "live",
 * so a production build never silently shows mock data. Live builds do
 * not contain the mock adapter or mock data.
 */
export const dataSource = __DATA_SOURCE__

const requestedSource = import.meta.env.VITE_DATA_SOURCE

export const dataSourceConfigError =
  requestedSource !== undefined && !['mock', 'live'].includes(requestedSource)
    ? `Unsupported VITE_DATA_SOURCE "${requestedSource}". Expected "mock" or "live".`
    : null

/**
 * Data-freshness threshold: telemetry older than this is shown as STALE.
 * DEVELOPMENT DEFAULT ONLY — the production threshold is TBD and must be
 * agreed during integration (04_DATA_CONTRACT.md §17).
 */
export const staleAfterMs = 10_000
