/** Escapes one CSV field (RFC 4180). */
function escapeField(value) {
  if (value === null || value === undefined) return ''
  const text = String(value)
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

/**
 * Builds CSV text from column definitions and rows.
 * @param {{ key: string, header: string }[]} columns
 * @param {object[]} rows
 */
export function toCsv(columns, rows) {
  const lines = [columns.map((c) => escapeField(c.header)).join(',')]
  for (const row of rows) lines.push(columns.map((c) => escapeField(row[c.key])).join(','))
  return lines.join('\r\n')
}
