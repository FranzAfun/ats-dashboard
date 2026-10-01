import { describe, expect, it } from 'vitest'
import { createMockAccess } from './mockAccess.js'
import { createMockCommands } from './mockCommands.js'
import { createMockPlant } from './mockPlant.js'

function setup(userId) {
  const access = createMockAccess()
  access.switchMockUser(userId)
  const plant = createMockPlant()
  return { plant, commands: createMockCommands(plant, access.currentAccess) }
}

describe('mock commands', () => {
  it('rejects a source change from a user without hmi.changeSource', async () => {
    const { commands, plant } = setup('u-hmi-observer')
    const updates = []
    const final = await commands.send(
      { command: 'change_source', targetSource: 'solar', requestId: 'r1' },
      (u) => updates.push(u.status),
    )
    expect(final.status).toBe('rejected')
    expect(updates[0]).toBe('pending')
    expect(plant.getState().activeSource).toBe('grid')
  })

  it('applies an authorized source change only after accepted', async () => {
    const { commands, plant } = setup('u-operator')
    const updates = []
    const final = await commands.send(
      { command: 'change_source', targetSource: 'solar', requestId: 'r2' },
      (u) => updates.push(u.status),
    )
    expect(updates).toEqual(['pending', 'accepted', 'applied'])
    expect(final.status).toBe('applied')
    expect(plant.getState().activeSource).toBe('solar')
  }, 10_000)

  it('rejects an invalid input cost', async () => {
    const { commands } = setup('u-operator')
    const final = await commands.send({ command: 'update_input_cost', source: 'grid', value: -1, requestId: 'r3' })
    expect(final.status).toBe('rejected')
  })
})
