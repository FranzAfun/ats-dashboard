import { describe, expect, it } from 'vitest'
import { sortAlarms } from './alarmPresentation.js'

describe('sortAlarms', () => {
  it('orders active before cleared, then by severity, then newest first', () => {
    const alarms = [
      { id: 'a', active: false, severity: 'critical', timestamp: '2026-01-01T00:00:00Z' },
      { id: 'b', active: true, severity: 'warning', timestamp: '2026-01-02T00:00:00Z' },
      { id: 'c', active: true, severity: 'critical', timestamp: '2026-01-01T00:00:00Z' },
      { id: 'd', active: true, severity: 'warning', timestamp: '2026-01-03T00:00:00Z' },
    ]
    expect(sortAlarms(alarms).map((a) => a.id)).toEqual(['c', 'd', 'b', 'a'])
  })
})
