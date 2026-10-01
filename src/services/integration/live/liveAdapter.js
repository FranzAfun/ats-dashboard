import { ErrorCode, IntegrationError } from '../errors.js'

/**
 * Live integration adapter — NOT IMPLEMENTED.
 *
 * The production transport between the frontend and the existing
 * ATS/Node-RED system is not confirmed (07_INTEGRATION_PLAN.md §6, §28).
 * `/ws/telemetry` is NOT the frontend contract. No endpoints, MQTT
 * topics, Modbus registers or Node-RED command formats may be invented
 * here.
 *
 * When the integration contract is confirmed, implement every method of
 * the adapter interface documented in ../adapter.js and map the real
 * payloads to the application data contract (04_DATA_CONTRACT.md).
 */

const message =
  'The live ATS integration is not configured. The frontend transport is TBD.'

function notConfigured() {
  return Promise.reject(new IntegrationError(ErrorCode.NOT_CONFIGURED, message))
}

function notConfiguredSubscription(onData, onError) {
  onError?.(new IntegrationError(ErrorCode.NOT_CONFIGURED, message))
  return () => {}
}

export function createLiveAdapter() {
  return {
    kind: 'live',
    access: {
      getSession: notConfigured,
      subscribe: () => () => {},
      listUsers: notConfigured,
      listRoles: notConfigured,
      getFeatureFlags: notConfigured,
      updateUser: notConfigured,
      setFeatureFlag: notConfigured,
      setRolePermission: notConfigured,
      getEffectiveAccess: notConfigured,
    },
    connection: {
      get: () => 'error',
      subscribe: () => () => {},
    },
    telemetry: {
      subscribeSystemStatus: notConfiguredSubscription,
      subscribePowerTelemetry: notConfiguredSubscription,
    },
    alerts: {
      subscribeAlarms: notConfiguredSubscription,
    },
    hmi: {
      subscribeControlState: notConfiguredSubscription,
    },
    commands: {
      // Never pretend a command was applied when there is no integration.
      send: notConfigured,
    },
    analytics: {
      getCostTrend: notConfigured,
      getSourceUsage: notConfigured,
      getEnergyAndCost: notConfigured,
      getPowerFactorLosses: notConfigured,
      getTransitionMetrics: notConfigured,
      getTransitionEvents: notConfigured,
    },
    mockScenario: null,
  }
}
