import { describe, expect, it } from 'vitest'
import {
  toNullableNumber,
  validateAlarms,
  validatePowerTelemetry,
  validateSystemStatus,
} from './contract.js'

const ts = '2026-09-26T12:30:00Z'
const electrical = { timestamp: ts, voltage: 230, current: 1, power: 230, energy: 1, frequency: 50, powerFactor: 0.9 }

describe('contract validation', () => {
  it('keeps missing values as null, never zero', () => {
    expect(toNullableNumber(undefined)).toBeNull()
    expect(toNullableNumber(Number.NaN)).toBeNull()
    expect(toNullableNumber(0)).toBe(0)
  })

  it('normalizes power telemetry with missing fields', () => {
    const result = validatePowerTelemetry({
      timestamp: ts,
      sources: { solar: electrical, grid: electrical, generator: { timestamp: ts } },
      load: { ...electrical, powerFactor: 'n/a' },
    })
    expect(result.sources.generator.voltage).toBeNull()
    expect(result.sources.generator.source).toBe('generator')
    expect(result.load.powerFactor).toBeNull()
  })

  it('rejects telemetry without timestamps', () => {
    expect(() => validatePowerTelemetry({ sources: {}, load: {} })).toThrow(/timestamp/)
  })

  it('rejects an unknown active source', () => {
    expect(() => validateSystemStatus({ timestamp: ts, activeSource: 'wind' })).toThrow(/active source/)
  })

  it('treats unknown availability as null rather than false', () => {
    const status = validateSystemStatus({ timestamp: ts, activeSource: null, sourceStatus: {} })
    expect(status.sourceStatus.solar.available).toBeNull()
    expect(status.sourceStatus.solar.active).toBe(false)
  })

  it('rejects alarms with unknown severity', () => {
    expect(() => validateAlarms([{ id: 'x', severity: 'fatal', timestamp: ts }])).toThrow()
  })
})
