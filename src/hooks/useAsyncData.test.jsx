// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useAsyncData } from './useAsyncData.js'

afterEach(cleanup)

const deferred = () => {
  let resolve
  const promise = new Promise((r) => {
    resolve = r
  })
  return { promise, resolve }
}

describe('useAsyncData cache', () => {
  it('shows cached data immediately on a later mount while refreshing', async () => {
    const first = deferred()
    const one = renderHook(() => useAsyncData(() => first.promise, 'test:cache', { cache: true }))
    expect(one.result.current.status).toBe('loading')
    await act(async () => first.resolve('v1'))
    expect(one.result.current).toMatchObject({ status: 'ready', data: 'v1' })
    one.unmount()

    const second = deferred()
    const two = renderHook(() => useAsyncData(() => second.promise, 'test:cache', { cache: true }))
    expect(two.result.current).toMatchObject({ status: 'ready', data: 'v1', refreshing: true })
    await act(async () => second.resolve('v2'))
    expect(two.result.current).toMatchObject({ status: 'ready', data: 'v2' })
    expect(two.result.current.refreshing).toBeUndefined()
  })

  it('keeps previous data while a new key loads with keepPrevious', async () => {
    const a = deferred()
    const b = deferred()
    const loaders = { a: () => a.promise, b: () => b.promise }
    const { result, rerender } = renderHook(({ key }) => useAsyncData(loaders[key], key, { keepPrevious: true }), {
      initialProps: { key: 'a' },
    })
    await act(async () => a.resolve('A'))
    rerender({ key: 'b' })
    expect(result.current).toMatchObject({ status: 'ready', data: 'A', refreshing: true })
    await act(async () => b.resolve('B'))
    expect(result.current).toMatchObject({ status: 'ready', data: 'B' })
  })
})
