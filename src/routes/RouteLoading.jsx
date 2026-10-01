import LoadingState from '../components/LoadingState.jsx'

/** Shown while the first route's code chunk loads. */
function RouteLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-canvas">
      <LoadingState orb="connecting" message="Loading ATS Dashboard…" />
    </div>
  )
}

export default RouteLoading
