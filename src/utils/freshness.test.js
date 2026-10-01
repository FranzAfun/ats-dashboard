import { describe, expect, it } from 'vitest'
import { getFreshness } from './freshness.js'

const now = Date.parse('2026-09-26T12:30:10Z')

describe('getFreshness', () => {
  it('is live within the threshold', () => {
    expect(getFreshness({ timestamp: '2026-09-26T12:30:05Z', connection: 'connected', now, staleAfterMs: 10_000 })).toBe('live')
  })
  it('is stale beyond the threshold even while connected', () => {
    expect(getFreshness({ timestamp: '2026-09-26T12:29:00Z', connection: 'connected', now, staleAfterMs: 10_000 })).toBe('stale')
  })
  it('is disconnected when the connection is down regardless of age', () => {
    expect(getFreshness({ timestamp: '2026-09-26T12:30:09Z', connection: 'disconnected', now, staleAfterMs: 10_000 })).toBe('disconnected')
    expect(getFreshness({ timestamp: '2026-09-26T12:30:09Z', connection: 'error', now, staleAfterMs: 10_000 })).toBe('disconnected')
  })
  it('is unknown without a timestamp', () => {
    expect(getFreshness({ timestamp: null, connection: 'connected', now, staleAfterMs: 10_000 })).toBe('unknown')
  })
})
