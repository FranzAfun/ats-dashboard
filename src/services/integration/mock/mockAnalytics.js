import { mockAnalytics } from '../../../data/mock/analytics.mock.js'
import { mockPlant } from '../../../data/mock/plant.mock.js'
import { ErrorCode, IntegrationError } from '../errors.js'
import { withLatency } from './mockLatency.js'
import { scenarioStore } from './mockScenario.js'

const SOURCE_IDS = ['solar', 'grid', 'generator']
const round = (value, digits = 2) => Math.round(value * 10 ** digits) / 10 ** digits

// Deterministic pseudo-random numbers so mock charts are stable.
function seeded(seed) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function periodStart(period, offset) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  if (period === 'daily') date.setDate(date.getDate() - offset)
  if (period === 'monthly') {
    date.setDate(1)
    date.setMonth(date.getMonth() - offset)
  }
  if (period === 'yearly') {
    date.setMonth(0, 1)
    date.setFullYear(date.getFullYear() - offset)
  }
  return date
}

function daysIn(period, start) {
  if (period === 'daily') return 1
  if (period === 'monthly') return new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
  return 365
}

/** Demo cost per kWh used to derive energy from mock cost values. */
function demoBlendedTariff(share) {
  return SOURCE_IDS.reduce((sum, id) => sum + share[id] * mockPlant.tariffs[id], 0)
}

function buildTrend(period) {
  const config = mockAnalytics.periods[period]
  const random = seeded(period.length * 7919)
  const points = []
  for (let offset = config.points - 1; offset >= 0; offset -= 1) {
    const start = periodStart(period, offset)
    const scale = config.dailyCost * daysIn(period, start)
    const variation = 0.82 + random() * 0.36
    const shares = {
      solar: mockAnalytics.usageShare.solar * (0.8 + random() * 0.4),
      grid: mockAnalytics.usageShare.grid * (0.8 + random() * 0.4),
      generator: mockAnalytics.usageShare.generator * (0.6 + random() * 0.8),
    }
    const shareTotal = shares.solar + shares.grid + shares.generator
    const total = scale * variation
    const bySource = {}
    for (const id of SOURCE_IDS) bySource[id] = round((total * shares[id]) / shareTotal)
    points.push({ timestamp: start.toISOString(), value: round(total), bySource })
  }
  return points
}

function guard() {
  if (scenarioStore.get() === 'error') {
    throw new IntegrationError(ErrorCode.NODE_RED_ERROR, 'Mock scenario: analytics unavailable.')
  }
  return scenarioStore.get() === 'empty'
}

/**
 * Mock analytics. Every value is DEMO data; the production financial
 * calculation rules and historical storage are TBD.
 */
export function createMockAnalytics(plant) {
  return {
    getCostTrend: (period) =>
      withLatency(() => {
        const empty = guard()
        const points = empty ? [] : buildTrend(period)
        return {
          period,
          currency: mockPlant.currency,
          total: points.map(({ timestamp, value }) => ({ timestamp, value })),
          bySource: Object.fromEntries(
            SOURCE_IDS.map((id) => [
              id,
              points.map(({ timestamp, bySource }) => ({ timestamp, value: bySource[id] })),
            ]),
          ),
        }
      }),

    getSourceUsage: (period) =>
      withLatency(() => {
        if (guard()) return null
        const points = buildTrend(period)
        const latest = points[points.length - 1]
        const total = SOURCE_IDS.reduce((sum, id) => sum + latest.bySource[id], 0)
        const usage = { period }
        let assigned = 0
        SOURCE_IDS.forEach((id, index) => {
          usage[id] =
            index === SOURCE_IDS.length - 1
              ? round(100 - assigned, 1)
              : round((latest.bySource[id] / total) * 100, 1)
          assigned += usage[id]
        })
        return usage
      }),

    getEnergyAndCost: (period) =>
      withLatency(() => {
        if (guard()) return { period, sources: [], totalEnergy: null, totalCost: null, currency: mockPlant.currency }
        const points = buildTrend(period)
        const latest = points[points.length - 1]
        const sources = SOURCE_IDS.map((id) => {
          const cost = latest.bySource[id]
          return {
            source: id,
            energy: round(cost / mockPlant.tariffs[id], 1),
            energyUnit: 'kWh',
            cost,
            currency: mockPlant.currency,
            period,
          }
        })
        return {
          period,
          periodStart: latest.timestamp,
          sources,
          totalEnergy: round(sources.reduce((sum, s) => sum + s.energy, 0), 1),
          totalCost: round(sources.reduce((sum, s) => sum + s.cost, 0)),
          currency: mockPlant.currency,
        }
      }),

    getPowerFactorLosses: (period) =>
      withLatency(() => {
        if (guard()) return null
        const points = buildTrend(period)
        const latestCost = points[points.length - 1].value
        const pf = mockAnalytics.averagePowerFactor
        const target = mockAnalytics.powerFactorTarget
        // DEMO calculation only: share of cost attributed to the power-factor
        // shortfall. The production rule is TBD.
        const estimatedLoss = round(latestCost * Math.max(0, (target - pf) / target))
        return {
          period,
          averagePowerFactor: pf,
          targetPowerFactor: target,
          estimatedLoss,
          currency: mockPlant.currency,
          blendedTariff: round(demoBlendedTariff(mockAnalytics.usageShare)),
        }
      }),

    getTransitionMetrics: () =>
      withLatency(() => {
        if (guard()) return null
        const state = plant.getState()
        return {
          totalTransitions: state.totalTransitions,
          deadTimeMs: state.lastDeadTimeMs,
          lastSwitchTimeMs: state.lastSwitchTimeMs,
          interlockViolation: false,
          prolongedOutage: scenarioStore.get() === 'alarm',
        }
      }),

    getTransitionEvents: () =>
      withLatency(() => {
        if (guard()) return []
        const random = seeded(4242)
        const history = []
        let time = Date.now() - 5 * 3600_000
        let from = 'solar'
        for (let i = 0; i < mockAnalytics.transitionHistoryCount; i += 1) {
          const options = SOURCE_IDS.filter((id) => id !== from)
          const to = options[Math.floor(random() * options.length)]
          history.push({
            timestamp: new Date(time).toISOString(),
            from,
            to,
            deadTimeMs: 700 + Math.round(random() * 250),
            switchTimeMs: 1300 + Math.round(random() * 300),
            status: 'completed',
          })
          from = to
          time -= (6 + random() * 30) * 3600_000
        }
        return [...plant.getState().transitions, ...history]
      }),
  }
}
