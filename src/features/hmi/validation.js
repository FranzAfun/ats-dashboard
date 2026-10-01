/**
 * Validates the input cost/day entry. Only generic numeric validation is
 * applied; production limits (minimum/maximum, precision) are TBD and
 * must come from the existing system.
 */
export function parseCostInput(text) {
  const trimmed = String(text ?? '').trim()
  if (trimmed === '') return { value: null, error: 'Enter a cost.' }
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return { value: null, error: 'Enter a positive number with at most two decimal places.' }
  }
  const value = Number(trimmed)
  if (!(value > 0)) return { value: null, error: 'The cost must be greater than zero.' }
  return { value, error: null }
}
