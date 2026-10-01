function PageHeader({ title, description }) {
  return (
    <header className="mb-6">
      <title>{`${title} · ATS Dashboard`}</title>
      <h1 className="text-2xl font-semibold text-text">{title}</h1>
      {description && (
        <p className="mt-1 max-w-prose text-sm text-muted">{description}</p>
      )}
    </header>
  )
}

export default PageHeader
