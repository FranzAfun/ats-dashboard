import { buttonClasses } from './buttonClasses.js'
import EmptyState from './EmptyState.jsx'
import ErrorState from './ErrorState.jsx'
import LoadingState from './LoadingState.jsx'
import { useStableLoading } from '../hooks/useStableLoading.js'

const errorMessages = {
  NOT_CONFIGURED: 'The live ATS integration is not configured yet.',
  FORBIDDEN: 'You do not have access to this data.',
  INVALID_DATA: 'The system returned data in an unexpected format.',
  TIMEOUT: 'The request timed out.',
}

/**
 * Renders loading, error, empty or populated state for a data request.
 * On error the data is not rendered, so old values are never presented
 * as current. Loader visibility is smoothed (useStableLoading): fast
 * responses show no loader, and a shown loader never flashes.
 */
function DataState({
  state,
  loadingMessage = 'Loading…',
  orb = 'searching',
  isEmpty = (data) => data === null || data === undefined || (Array.isArray(data) && data.length === 0),
  emptyTitle = 'No data available',
  emptyMessage,
  errorTitle = 'Data unavailable',
  compact = false,
  children,
}) {
  const { showLoader, pending } = useStableLoading(state.status === 'loading')

  if (showLoader) {
    return <LoadingState orb={orb} message={loadingMessage} size={compact ? 'inline' : 'default'} />
  }
  if (pending) {
    // Quiet placeholder until the loader is due; avoids a loader flash.
    return <div aria-busy="true" className={compact ? 'h-5' : 'min-h-24'} />
  }
  if (state.status === 'error') {
    return (
      <ErrorState
        title={errorTitle}
        message={errorMessages[state.error?.code] ?? state.error?.message ?? 'The data could not be loaded.'}
      >
        {state.reload && (
          <button type="button" onClick={state.reload} className={buttonClasses.secondary}>
            Try again
          </button>
        )}
      </ErrorState>
    )
  }
  if (isEmpty(state.data)) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }
  return children(state.data)
}

export default DataState
