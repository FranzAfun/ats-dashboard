import { isMockData } from '../../services/integration/adapter.js'

/** Persistent indicator that the application is showing mock data. */
function MockDataBadge() {
  if (!isMockData) return null
  return (
    <span className="inline-flex items-center rounded-md whitespace-nowrap border border-info px-2 py-0.5 text-xs font-semibold tracking-wide text-info uppercase">
      Mock data
    </span>
  )
}

export default MockDataBadge
