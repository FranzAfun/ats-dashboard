/**
 * Presentation configuration for the three ATS power sources.
 * Identifiers follow 04_DATA_CONTRACT.md §4; load is not a source.
 * `colorVar` points at the source identity color token (SPEC.md §24.4).
 */
export const sources = [
  { id: 'solar', label: 'Solar', longLabel: 'Solar', colorVar: '--color-source-solar' },
  { id: 'grid', label: 'Grid', longLabel: 'Ghana Utility/Grid', colorVar: '--color-source-grid' },
  { id: 'generator', label: 'Generator', longLabel: 'Generator', colorVar: '--color-source-generator' },
]

export const sourceById = Object.fromEntries(sources.map((s) => [s.id, s]))

export function sourceLabel(id) {
  return sourceById[id]?.label ?? 'Unknown'
}
