import ErrorState from '../components/ErrorState.jsx'
import LoadingState from '../components/LoadingState.jsx'
import { useAccess } from '../hooks/useAccess.js'

/**
 * Renders page content only once the session/effective access is known.
 */
function SessionBoundary({ children }) {
  const { status, error, user, access } = useAccess()

  if (status === 'loading') {
    return <LoadingState orb="connecting" message="Loading session…" className="min-h-[50vh]" />
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Session unavailable"
        message={
          error?.code === 'NOT_CONFIGURED'
            ? 'Authentication and the live ATS integration are not configured yet.'
            : 'Your session could not be loaded. Try reloading the page.'
        }
      />
    )
  }

  if (user && user.status !== 'active') {
    return (
      <ErrorState
        title="Account disabled"
        message="This account has been disabled. Contact an administrator."
      />
    )
  }

  if (!access?.permissions?.length) {
    return (
      <ErrorState
        title="No access assigned"
        message="Your account has no application access. Contact an administrator."
      />
    )
  }

  return children
}

export default SessionBoundary
