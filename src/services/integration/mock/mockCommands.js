import { mockPlant } from '../../../data/mock/plant.mock.js'
import { canPerform } from '../../../utils/access.js'
import { scenarioStore } from './mockScenario.js'

const ACCEPT_DELAY_MS = 700

function response(requestId, status, message) {
  return { requestId, status, message, timestamp: new Date().toISOString() }
}

/**
 * Mock command handling. Commands follow the PROPOSED application-level
 * shapes in 04_DATA_CONTRACT.md §13; the real Node-RED command format is
 * TBD. The mock checks authorization itself (backend-side enforcement)
 * and never applies anything to real devices.
 */
export function createMockCommands(plant, currentAccess) {
  function authorize(command) {
    const action = command.command === 'change_source' ? 'hmi.changeSource' : 'hmi.changeCost'
    return canPerform(currentAccess(), action)
  }

  function validate(command) {
    if (command.command === 'change_source') {
      return plant.canChangeSource(command.targetSource)
    }
    if (command.command === 'update_input_cost') {
      if (!['solar', 'grid', 'generator'].includes(command.source)) return 'Unknown source.'
      if (!Number.isFinite(command.value) || command.value <= 0) {
        return 'The cost must be a positive number.'
      }
      return null
    }
    return 'Unsupported command.'
  }

  return {
    /**
     * @param {object} command
     * @param {(update: import('../contract.js').CommandResponse) => void} onUpdate
     * @returns {Promise<import('../contract.js').CommandResponse>} final response
     */
    send(command, onUpdate) {
      const { requestId } = command
      const scenario = scenarioStore.get()
      onUpdate?.(response(requestId, 'pending', 'Command sent. Waiting for the system.'))

      return new Promise((resolve) => {
        const finish = (final) => {
          onUpdate?.(final)
          resolve(final)
        }

        setTimeout(() => {
          if (scenario === 'disconnected' || scenario === 'error') {
            finish(response(requestId, 'failed', 'The integration is unavailable.'))
            return
          }
          if (!authorize(command)) {
            finish(response(requestId, 'rejected', 'You are not authorized to perform this action.'))
            return
          }
          const problem = validate(command)
          if (problem || scenario === 'commandRejected') {
            finish(response(requestId, 'rejected', problem ?? 'Mock scenario: the system rejected the command.'))
            return
          }

          onUpdate?.(response(requestId, 'accepted', 'Command accepted. Applying…'))

          if (command.command === 'change_source') {
            plant.beginTransition()
            setTimeout(() => {
              if (scenario === 'commandFailed') {
                plant.abortTransition()
                finish(response(requestId, 'failed', 'Mock scenario: the transition did not complete.'))
                return
              }
              plant.completeTransition(command.targetSource)
              finish(response(requestId, 'applied', 'Source change confirmed by the system.'))
            }, mockPlant.transitionDurationMs)
            return
          }

          setTimeout(() => {
            if (scenario === 'commandFailed') {
              finish(response(requestId, 'failed', 'Mock scenario: the update was not applied.'))
              return
            }
            plant.setInputCost(command.source, command.value)
            finish(response(requestId, 'applied', 'Input cost update confirmed by the system.'))
          }, ACCEPT_DELAY_MS)
        }, ACCEPT_DELAY_MS)
      })
    },
  }
}
