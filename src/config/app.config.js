/**
 * Application configuration derived from Vite environment variables.
 *
 * VITE_DATA_SOURCE selects the integration adapter:
 *   - "mock": development/demo data from src/data/mock (never production data)
 *   - "live": the production integration adapter (transport TBD, see
 *             docs/Project/07_INTEGRATION_PLAN.md)
 *
 * When unset, development builds use "mock" and production builds use
 * "live", so a production build never silently shows mock data.
 */
const DATA_SOURCES = ['mock', 'live']

const requestedSource = import.meta.env.VITE_DATA_SOURCE
const defaultSource = import.meta.env.DEV ? 'mock' : 'live'

export const dataSource = DATA_SOURCES.includes(requestedSource)
  ? requestedSource
  : defaultSource

export const dataSourceConfigError =
  requestedSource !== undefined && !DATA_SOURCES.includes(requestedSource)
    ? `Unsupported VITE_DATA_SOURCE "${requestedSource}". Expected "mock" or "live".`
    : null
