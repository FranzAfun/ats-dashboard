import { describe, expect, it, vi } from 'vitest'
import { createLiveResource } from './liveResource.js'

describe('createLiveResource', () => {
  it('shares one adapter subscription and keeps data across resubscription', () => {
    let push
    const unsubscribe = vi.fn()
    const adapterSubscribe = vi.fn((onData) => {
      push = onData
      return unsubscribe
    })
    const resource = createLiveResource(adapterSubscribe)

    const offA = resource.subscribe(() => {})
    const offB = resource.subscribe(() => {})
    expect(adapterSubscribe).toHaveBeenCalledTimes(1)
    push({ value: 1 })
    offA()
    offB()
    expect(unsubscribe).toHaveBeenCalledTimes(1)

    // A later subscriber (e.g. after navigation) starts from the last data,
    // not from a loading state, so no loader is shown again.
    resource.subscribe(() => {})
    expect(resource.getSnapshot()).toMatchObject({ status: 'ready', data: { value: 1 } })
  })
})
