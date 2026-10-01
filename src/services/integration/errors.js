/**
 * Application-level integration error categories
 * (07_INTEGRATION_PLAN.md §19). Raw device/protocol errors must be
 * normalized into one of these codes before reaching the UI.
 */
export const ErrorCode = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_DATA: 'INVALID_DATA',
  TIMEOUT: 'TIMEOUT',
  DEVICE_ERROR: 'DEVICE_ERROR',
  NODE_RED_ERROR: 'NODE_RED_ERROR',
  COMMAND_REJECTED: 'COMMAND_REJECTED',
  COMMAND_FAILED: 'COMMAND_FAILED',
  NOT_CONFIGURED: 'NOT_CONFIGURED',
}

export class IntegrationError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'IntegrationError'
    this.code = code
  }
}

export function toIntegrationError(error) {
  if (error instanceof IntegrationError) return error
  return new IntegrationError(
    ErrorCode.NETWORK_ERROR,
    error?.message || 'An unexpected integration error occurred.',
  )
}
