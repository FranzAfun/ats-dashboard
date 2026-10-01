function MutationError({ error }) {
  if (!error) return null
  return (
    <p role="alert" className="text-sm text-critical">
      {error.message}
    </p>
  )
}

export default MutationError
