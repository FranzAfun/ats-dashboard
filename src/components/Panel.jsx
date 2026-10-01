/**
 * Bordered surface for a dashboard section or card.
 * `as` lets a panel be a <section> with an accessible heading.
 */
function Panel({ title, description, actions, meta, children, className = '', bodyClassName = 'p-4', as: Tag = 'section', headingLevel = 2 }) {
  const Heading = `h${headingLevel}`
  return (
    <Tag className={`min-w-0 rounded-lg border border-border bg-surface ${className}`}>
      {(title || actions || meta) && (
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-border px-4 py-3">
          <div className="min-w-0">
            {title && <Heading className="text-sm font-semibold text-text">{title}</Heading>}
            {description && <p className="mt-0.5 text-xs text-subtle">{description}</p>}
          </div>
          {(meta || actions) && (
            <div className="flex flex-wrap items-center gap-2">
              {meta}
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </Tag>
  )
}

export default Panel
