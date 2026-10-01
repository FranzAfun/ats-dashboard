/**
 * Placeholder for pages whose content has not been built yet.
 * It intentionally shows no data values.
 */
function NotImplementedNotice() {
  return (
    <section className="rounded-lg border border-dashed border-control bg-surface p-4 sm:p-6">
      <p className="text-sm font-medium text-text">Not implemented yet</p>
      <p className="mt-1 text-sm text-muted">
        This page is part of the application foundation. Its content will be
        added in a later development phase.
      </p>
    </section>
  )
}

export default NotImplementedNotice
