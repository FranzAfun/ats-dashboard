/**
 * MOCK analytics generation parameters. All financial values produced from
 * these are demonstration data. Production financial calculation rules,
 * tariffs and historical storage are TBD (03_FUNCTIONAL_REQUIREMENTS.md §15).
 */
export const mockAnalytics = {
  periods: {
    daily: { points: 14, unit: 'day', dailyCost: 260 },
    monthly: { points: 12, unit: 'month', dailyCost: 260 },
    yearly: { points: 5, unit: 'year', dailyCost: 245 },
  },
  usageShare: { solar: 0.34, grid: 0.51, generator: 0.15 },
  averagePowerFactor: 0.92,
  powerFactorTarget: 0.95,
  transitionHistoryCount: 12,
}
