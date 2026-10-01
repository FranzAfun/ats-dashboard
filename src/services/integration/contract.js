import { ErrorCode, IntegrationError } from './errors.js'

/**
 * Application data contract (04_DATA_CONTRACT.md) as JSDoc definitions,
 * plus boundary validation. Adapters must deliver these shapes; services
 * validate them before they reach the UI.
 *
 * @typedef {"solar" | "grid" | "generator"} SourceId
 *
 * @typedef {Object} ElectricalTelemetry
 * @property {string} timestamp ISO-8601
 * @property {number | null} voltage V
 * @property {number | null} current A
 * @property {number | null} power W
 * @property {number | null} energy kWh
 * @property {number | null} frequency Hz
 * @property {number | null} powerFactor ratio
 *
 * @typedef {ElectricalTelemetry & { source: SourceId }} SourceTelemetry
 * @typedef {ElectricalTelemetry} LoadTelemetry  Load is not a source (§4.1)
 *
 * @typedef {Object} SourceState
 * @property {boolean | null} available  Meaning defined by the source system (TBD)
 * @property {boolean} active
 *
 * @typedef {Object} SystemStatus
 * @property {string} timestamp
 * @property {SourceId | null} activeSource
 * @property {Record<SourceId, SourceState>} sourceStatus
 * @property {{ state: string, transitioning: boolean, lastTransition: { from: SourceId, to: SourceId, timestamp: string } | null }} ats
 * @property {{ source: SourceId, rate: number | null, currency: string, unit: string, timestamp: string } | null} tariff
 * @property {{ timestamp: string, value: number | null, unit: string, status: string } | null} temperature
 *
 * @typedef {Object} PowerTelemetry
 * @property {string} timestamp
 * @property {Record<SourceId, SourceTelemetry>} sources
 * @property {LoadTelemetry} load
 *
 * @typedef {Object} Alarm
 * @property {string} id
 * @property {"info" | "warning" | "critical"} severity
 * @property {string} title
 * @property {string} message
 * @property {boolean} active
 * @property {string} timestamp
 *
 * @typedef {Object} CommandResponse
 * @property {string} requestId
 * @property {"pending" | "accepted" | "rejected" | "failed" | "applied"} status
 * @property {string} message
 * @property {string} timestamp
 *
 * @typedef {{ timestamp: string, value: number }} TimePoint
 */

export const SOURCE_IDS = ['solar', 'grid', 'generator']
export const ALARM_SEVERITIES = ['info', 'warning', 'critical']
export const COMMAND_STATUSES = ['pending', 'accepted', 'rejected', 'failed', 'applied']
export const FINAL_COMMAND_STATUSES = ['rejected', 'failed', 'applied']
export const PERIODS = ['daily', 'monthly', 'yearly']
export const ELECTRICAL_FIELDS = ['voltage', 'current', 'power', 'energy', 'frequency', 'powerFactor']

function invalid(message) {
  return new IntegrationError(ErrorCode.INVALID_DATA, message)
}

/** Missing values stay null; they are never converted to zero (§18). */
export function toNullableNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function isTimestamp(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

function normalizeElectrical(raw, label) {
  if (!raw || !isTimestamp(raw.timestamp)) throw invalid(`${label}: missing timestamp`)
  const result = { timestamp: raw.timestamp }
  for (const field of ELECTRICAL_FIELDS) result[field] = toNullableNumber(raw[field])
  return result
}

export function validatePowerTelemetry(raw) {
  if (!raw || !isTimestamp(raw.timestamp)) throw invalid('Power telemetry: missing timestamp')
  const sources = {}
  for (const id of SOURCE_IDS) {
    sources[id] = { source: id, ...normalizeElectrical(raw.sources?.[id], `Source ${id}`) }
  }
  return { timestamp: raw.timestamp, sources, load: normalizeElectrical(raw.load, 'Load') }
}

export function validateSystemStatus(raw) {
  if (!raw || !isTimestamp(raw.timestamp)) throw invalid('System status: missing timestamp')
  if (raw.activeSource !== null && !SOURCE_IDS.includes(raw.activeSource)) {
    throw invalid('System status: unknown active source')
  }
  const sourceStatus = {}
  for (const id of SOURCE_IDS) {
    const state = raw.sourceStatus?.[id] ?? {}
    sourceStatus[id] = {
      available: typeof state.available === 'boolean' ? state.available : null,
      active: state.active === true,
    }
  }
  return {
    timestamp: raw.timestamp,
    activeSource: raw.activeSource,
    sourceStatus,
    ats: {
      state: String(raw.ats?.state ?? 'unknown'),
      transitioning: raw.ats?.transitioning === true,
      lastTransition: raw.ats?.lastTransition ?? null,
    },
    tariff: raw.tariff ? { ...raw.tariff, rate: toNullableNumber(raw.tariff.rate) } : null,
    temperature: raw.temperature
      ? { ...raw.temperature, value: toNullableNumber(raw.temperature.value) }
      : null,
  }
}

export function validateAlarms(raw) {
  if (!Array.isArray(raw)) throw invalid('Alarms: expected a list')
  return raw.map((alarm) => {
    if (!alarm?.id || !ALARM_SEVERITIES.includes(alarm.severity) || !isTimestamp(alarm.timestamp)) {
      throw invalid('Alarms: invalid alarm entry')
    }
    return { ...alarm, active: alarm.active === true }
  })
}

export function validateCommandResponse(raw) {
  if (!raw?.requestId || !COMMAND_STATUSES.includes(raw.status)) {
    throw invalid('Command response: invalid status')
  }
  return raw
}
