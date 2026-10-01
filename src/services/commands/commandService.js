import { createLiveResource } from '../../lib/liveResource.js'
import { adapter } from '../integration/adapter.js'
import { FINAL_COMMAND_STATUSES, validateCommandResponse } from '../integration/contract.js'
import { toIntegrationError } from '../integration/errors.js'

/** Current HMI control values (e.g. configured input cost/day). */
export const controlStateResource = createLiveResource(adapter.hmi.subscribeControlState)

function requestId() {
  return globalThis.crypto?.randomUUID?.() ?? `req-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/**
 * Sends HMI commands through the integration adapter. Commands are never
 * retried automatically (07_INTEGRATION_PLAN.md §21).
 */
export const commandService = {
  changeSource(targetSource, onUpdate) {
    return send({ command: 'change_source', targetSource }, onUpdate)
  },
  updateInputCost({ source, value, currency }, onUpdate) {
    return send({ command: 'update_input_cost', source, value, currency, period: 'day' }, onUpdate)
  },
}

async function send(partial, onUpdate) {
  const command = { ...partial, requestId: requestId(), timestamp: new Date().toISOString() }
  try {
    const final = validateCommandResponse(
      await adapter.commands.send(command, (update) => onUpdate?.(validateCommandResponse(update))),
    )
    if (!FINAL_COMMAND_STATUSES.includes(final.status)) {
      throw new Error('The command did not reach a final state.')
    }
    return final
  } catch (error) {
    const failure = {
      requestId: command.requestId,
      status: 'failed',
      message: toIntegrationError(error).message,
      timestamp: new Date().toISOString(),
    }
    onUpdate?.(failure)
    return failure
  }
}
