function EmptyState({ title, message, children }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-md border border-dashed border-border px-4 py-8 text-center">
      <p className="text-sm font-medium text-text">{title}</p>
      {message && <p className="max-w-prose text-sm text-muted">{message}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default EmptyState
