/**
 * Generic error message block. The heading carries the meaning, so the
 * error is understandable without relying on color.
 */
function ErrorState({ title, message, children }) {
  return (
    <section
      role="alert"
      className="rounded-lg border border-border border-l-4 border-l-critical bg-surface p-4 sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-critical">
        Error
      </p>
      <h2 className="mt-1 text-lg font-semibold text-text">{title}</h2>
      {message && <p className="mt-2 text-sm text-muted">{message}</p>}
      {children && <div className="mt-4">{children}</div>}
    </section>
  )
}

export default ErrorState
