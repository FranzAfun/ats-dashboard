// @vitest-environment jsdom
import { act, cleanup, render, renderHook, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BootContext } from '../app/bootContext.js'
import DataState from '../components/DataState.jsx'
import LoadingState from '../components/LoadingState.jsx'
import { useStableLoading } from './useStableLoading.js'

// The canvas renderer is not available in jsdom; count orb instances instead.
const orbMounts = vi.hoisted(() => ({ count: 0 }))
vi.mock('thinking-orbs', async () => {
  const { useEffect } = await import('react')
  return {
    ThinkingOrb: () => {
      useEffect(() => {
        orbMounts.count += 1
      }, [])
      return <canvas data-testid="orb" />
    },
  }
})

beforeEach(() => {
  vi.useFakeTimers()
  orbMounts.count = 0
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('useStableLoading', () => {
  it('never shows a loader for fast loads', () => {
    const { result, rerender } = renderHook(({ loading }) => useStableLoading(loading), { initialProps: { loading: true } })
    expect(result.current).toEqual({ showLoader: false, pending: true })
    act(() => vi.advanceTimersByTime(150))
    rerender({ loading: false })
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current).toEqual({ showLoader: false, pending: false })
  })

  it('shows after the delay and keeps a shown loader for the minimum time', () => {
    const { result, rerender } = renderHook(({ loading }) => useStableLoading(loading), { initialProps: { loading: true } })
    act(() => vi.advanceTimersByTime(200))
    expect(result.current.showLoader).toBe(true)
    act(() => vi.advanceTimersByTime(50))
    rerender({ loading: false })
    expect(result.current.showLoader).toBe(true)
    act(() => vi.advanceTimersByTime(300))
    expect(result.current.showLoader).toBe(true)
    act(() => vi.advanceTimersByTime(60))
    expect(result.current.showLoader).toBe(false)
  })

  it('does not restart when loading resumes during the hold', () => {
    const { result, rerender } = renderHook(({ loading }) => useStableLoading(loading), { initialProps: { loading: true } })
    act(() => vi.advanceTimersByTime(250))
    rerender({ loading: false })
    rerender({ loading: true })
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.showLoader).toBe(true)
  })
})

describe('DataState loading', () => {
  const loading = { status: 'loading', data: null, error: null }
  const ready = { status: 'ready', data: { value: 'Loaded' }, error: null }

  it('shows one stable loader that is not remounted by updates, then the content', () => {
    const { rerender } = render(<DataState state={loading} loadingMessage="Loading…">{(d) => d.value}</DataState>)
    expect(screen.queryByTestId('orb')).toBeNull()
    act(() => vi.advanceTimersByTime(200))
    expect(screen.getAllByTestId('orb')).toHaveLength(1)
    // Unrelated re-renders while loading keep the same orb instance.
    rerender(<DataState state={{ ...loading }} loadingMessage="Loading…">{(d) => d.value}</DataState>)
    rerender(<DataState state={{ ...loading }} loadingMessage="Still loading…">{(d) => d.value}</DataState>)
    expect(orbMounts.count).toBe(1)
    rerender(<DataState state={ready} loadingMessage="Loading…">{(d) => d.value}</DataState>)
    act(() => vi.advanceTimersByTime(400))
    expect(screen.queryByTestId('orb')).toBeNull()
    expect(screen.getByText('Loaded')).toBeInTheDocument()
    expect(orbMounts.count).toBe(1)
  })

  it('renders no loader while the startup overlay is shown', () => {
    render(
      <BootContext.Provider value={true}>
        <LoadingState message="Section loading" />
      </BootContext.Provider>,
    )
    expect(screen.queryByTestId('orb')).toBeNull()
  })

  it('renders the boot overlay loader itself', () => {
    render(
      <BootContext.Provider value={true}>
        <LoadingState message="Connecting to ATS…" ignoreBoot />
      </BootContext.Provider>,
    )
    expect(screen.getAllByTestId('orb')).toHaveLength(1)
  })
})
