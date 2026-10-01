// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import PowerFlowDiagram from './PowerFlowDiagram.jsx'
import { sourceFlow } from './powerFlowGeometry.js'

afterEach(cleanup)

function status(activeSource, { transitioning = false } = {}) {
  return {
    timestamp: '2026-09-26T12:30:00Z',
    activeSource,
    sourceStatus: {
      solar: { available: true, active: activeSource === 'solar' && !transitioning },
      grid: { available: true, active: activeSource === 'grid' && !transitioning },
      generator: { available: true, active: activeSource === 'generator' && !transitioning },
    },
    ats: { state: activeSource, transitioning, lastTransition: null },
  }
}

const label = (container) => container.querySelector('[data-testid="active-power-label"]')

describe('PowerFlowDiagram active power', () => {
  it.each([
    ['solar', 0],
    ['grid', 1],
    ['generator', 2],
  ])('shows the value on the %s flow path', (source, index) => {
    const { container } = render(
      <PowerFlowDiagram status={status(source)} live activePowerLabel="3.16 kW" loadPowerLabel="3.16 kW" />,
    )
    const g = label(container)
    expect(g).toHaveAttribute('data-source', source)
    expect(g).toHaveTextContent('3.16 kW')
    expect(g.style.opacity).toBe('1')
    const { mid } = sourceFlow(index)
    expect(g.style.translate).toBe(`${mid.x}px ${mid.y}px`)
    // The value is also part of the text alternative.
    expect(container.querySelector('svg').getAttribute('aria-label')).toContain('at 3.16 kW')
  })

  it('updates the value with new telemetry and moves with the active source', () => {
    const { container, rerender } = render(
      <PowerFlowDiagram status={status('grid')} live activePowerLabel="3.16 kW" />,
    )
    rerender(<PowerFlowDiagram status={status('grid')} live activePowerLabel="3.42 kW" />)
    expect(label(container)).toHaveTextContent('3.42 kW')
    const before = label(container)
    rerender(<PowerFlowDiagram status={status('solar')} live activePowerLabel="2.90 kW" />)
    // Same element (so it can glide), new position and value.
    expect(label(container)).toBe(before)
    expect(label(container)).toHaveAttribute('data-source', 'solar')
    expect(label(container).style.translate).toBe(`${sourceFlow(0).mid.x}px ${sourceFlow(0).mid.y}px`)
  })

  it('hides the value while switching, when not live, or without a permitted value', () => {
    const cases = [
      <PowerFlowDiagram key="t" status={status('grid', { transitioning: true })} live activePowerLabel="3.16 kW" />,
      <PowerFlowDiagram key="s" status={status('grid')} live={false} activePowerLabel="3.16 kW" />,
      <PowerFlowDiagram key="n" status={status('grid')} live />,
    ]
    for (const element of cases) {
      const { container, unmount } = render(element)
      expect(label(container).style.opacity).toBe('0')
      expect(label(container)).toHaveAttribute('data-source', '')
      unmount()
    }
  })

  it('shows a single value: inactive flows carry none', () => {
    const { container } = render(<PowerFlowDiagram status={status('grid')} live activePowerLabel="3.16 kW" />)
    const values = [...container.querySelectorAll('text')].filter((t) => /kW|W$/.test(t.textContent))
    expect(values).toHaveLength(1)
  })
})
