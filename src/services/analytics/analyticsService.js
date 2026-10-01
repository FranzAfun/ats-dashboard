import { adapter } from '../integration/adapter.js'

/**
 * Financial/energy analytics. Values come from the adapter; in mock mode
 * they are demo values. Production calculation rules are TBD.
 */
export const analyticsService = {
  getCostTrend: (period) => adapter.analytics.getCostTrend(period),
  getSourceUsage: (period) => adapter.analytics.getSourceUsage(period),
  getEnergyAndCost: (period) => adapter.analytics.getEnergyAndCost(period),
  getPowerFactorLosses: (period) => adapter.analytics.getPowerFactorLosses(period),
  getTransitionMetrics: () => adapter.analytics.getTransitionMetrics(),
  getTransitionEvents: () => adapter.analytics.getTransitionEvents(),
}
