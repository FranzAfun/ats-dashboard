const LOCALE = 'en-GH'

/** Returns null for missing values so callers can show "unavailable". */
export function formatNumber(value, digits = 1) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatCurrency(value, currency = 'GHS', digits = 2) {
  const number = formatNumber(value, digits)
  return number === null ? null : `${currency} ${number}`
}

export function formatPercent(value, digits = 1) {
  const number = formatNumber(value, digits)
  return number === null ? null : `${number}%`
}

/** Watts are shown in kW from 1 000 W upwards. */
export function formatPower(watts) {
  if (typeof watts !== 'number' || !Number.isFinite(watts)) return { value: null, unit: 'W' }
  return Math.abs(watts) >= 1000
    ? { value: formatNumber(watts / 1000, 2), unit: 'kW' }
    : { value: formatNumber(watts, 0), unit: 'W' }
}

export function formatDateTime(iso) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function formatTime(iso) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(LOCALE, { timeStyle: 'medium' }).format(date)
}

export function formatPeriodLabel(iso, period) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  if (period === 'daily') return new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short' }).format(date)
  if (period === 'monthly') return new Intl.DateTimeFormat(LOCALE, { month: 'short', year: '2-digit' }).format(date)
  return String(date.getFullYear())
}

export function formatDuration(ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms)) return null
  return ms >= 1000 ? `${formatNumber(ms / 1000, 2)} s` : `${formatNumber(ms, 0)} ms`
}
