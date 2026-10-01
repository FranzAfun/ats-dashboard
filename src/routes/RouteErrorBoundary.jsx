import { Link } from 'react-router-dom'
import ErrorState from '../components/ErrorState.jsx'
import { paths } from '../config/paths.js'

function RouteErrorBoundary() {
  return (
    <div className="p-4 sm:p-6">
      <title>Error · ATS Dashboard</title>
      <ErrorState
        title="This page could not be displayed"
        message="An unexpected application error occurred. Try again or return to the Dashboard."
      >
        <Link
          to={paths.dashboard}
          className="inline-flex min-h-11 items-center rounded-md border border-control px-4 text-sm font-medium text-text transition-colors duration-150 hover:bg-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        >
          Go to Dashboard
        </Link>
      </ErrorState>
    </div>
  )
}

export default RouteErrorBoundary
