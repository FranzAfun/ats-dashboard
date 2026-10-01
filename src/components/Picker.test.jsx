// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Picker from './Picker.jsx'

afterEach(cleanup)

const sources = [
  { value: 'solar', label: 'Solar' },
  { value: 'grid', label: 'Ghana Utility/Grid' },
  { value: 'generator', label: 'Generator' },
]

const many = (count) =>
  Array.from({ length: count }, (_, i) => ({ value: `v${i}`, label: `Option ${String.fromCharCode(65 + i)}` }))

function Harness({ options = sources, initial = 'grid', onChange = () => {}, ...props }) {
  const [value, setValue] = useState(initial)
  return (
    <>
      <Picker
        label="Source"
        value={value}
        options={options}
        onChange={(next) => {
          setValue(next)
          onChange(next)
        }}
        {...props}
      />
      <button type="button">Outside</button>
    </>
  )
}

const trigger = () => screen.getByRole('button', { name: /Source/ })

describe('Picker', () => {
  it('shows the selected value on an accessible trigger and starts closed', () => {
    render(<Harness />)
    expect(trigger()).toHaveTextContent('Ghana Utility/Grid')
    expect(trigger()).toHaveAttribute('aria-haspopup', 'listbox')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('opens on click, marks the selected option and focuses the list', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(trigger())
    const listbox = screen.getByRole('listbox')
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(listbox).toHaveFocus()
    expect(screen.getByRole('option', { name: 'Ghana Utility/Grid' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('selects with a click, closes and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    await user.click(trigger())
    await user.click(screen.getByRole('option', { name: 'Solar' }))
    expect(onChange).toHaveBeenCalledWith('solar')
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(trigger()).toHaveFocus()
    expect(trigger()).toHaveTextContent('Solar')
  })

  it('supports keyboard opening, arrow navigation and Enter selection', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    trigger().focus()
    await user.keyboard('{Enter}')
    const listbox = screen.getByRole('listbox')
    const active = () => document.getElementById(listbox.getAttribute('aria-activedescendant'))
    expect(active()).toHaveTextContent('Ghana Utility/Grid')
    await user.keyboard('{ArrowDown}')
    expect(active()).toHaveTextContent('Generator')
    await user.keyboard('{ArrowDown}')
    expect(active()).toHaveTextContent('Generator')
    await user.keyboard('{Home}')
    expect(active()).toHaveTextContent('Solar')
    await user.keyboard('{End}{ArrowUp}')
    expect(active()).toHaveTextContent('Ghana Utility/Grid')
    await user.keyboard('{ArrowUp}{Enter}')
    expect(onChange).toHaveBeenCalledWith('solar')
    expect(trigger()).toHaveFocus()
  })

  it('selects with Space and opens on ArrowUp at the last option', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Harness onChange={onChange} initial={null} />)
    trigger().focus()
    await user.keyboard('{ArrowUp}')
    const listbox = screen.getByRole('listbox')
    expect(document.getElementById(listbox.getAttribute('aria-activedescendant'))).toHaveTextContent('Generator')
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledWith('generator')
  })

  it('closes on Escape without selecting, restores focus and does not leak Escape', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const outerKeyDown = vi.fn()
    render(
      <div onKeyDown={outerKeyDown}>
        <Harness onChange={onChange} />
      </div>,
    )
    await user.click(trigger())
    await user.keyboard('{ArrowDown}{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(onChange).not.toHaveBeenCalled()
    expect(trigger()).toHaveFocus()
    // Escape is stopped so an enclosing modal dialog stays open.
    expect(outerKeyDown.mock.calls.some(([event]) => event.key === 'Escape')).toBe(false)
  })

  it('closes on an outside click without moving focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(trigger())
    await user.click(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus()
  })

  it('closes on Tab', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(trigger())
    await user.tab()
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('skips and refuses disabled options', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const options = [
      { value: 'solar', label: 'Solar' },
      { value: 'grid', label: 'Ghana Utility/Grid', disabled: true, description: 'Currently active' },
      { value: 'generator', label: 'Generator' },
    ]
    render(<Harness options={options} initial={null} onChange={onChange} />)
    await user.click(trigger())
    const listbox = screen.getByRole('listbox')
    const active = () => document.getElementById(listbox.getAttribute('aria-activedescendant'))
    expect(active()).toHaveTextContent('Solar')
    await user.keyboard('{ArrowDown}')
    expect(active()).toHaveTextContent('Generator')
    const disabled = screen.getByRole('option', { name: /Ghana Utility\/Grid/ })
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    expect(disabled).toHaveTextContent('Currently active')
    await user.click(disabled)
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('jumps to an option by typing its first letter (no search field)', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(trigger())
    await user.keyboard('s')
    const listbox = screen.getByRole('listbox')
    expect(document.getElementById(listbox.getAttribute('aria-activedescendant'))).toHaveTextContent('Solar')
  })

  it('does not open when disabled but stays focusable', async () => {
    const user = userEvent.setup()
    render(<Harness disabled />)
    expect(trigger()).toHaveAttribute('aria-disabled', 'true')
    await user.click(trigger())
    trigger().focus()
    await user.keyboard('{Enter}')
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(trigger()).toHaveFocus()
  })

  it('shows no search field for 10 or fewer options', async () => {
    const user = userEvent.setup()
    render(<Harness options={many(10)} initial="v0" />)
    await user.click(trigger())
    expect(screen.getAllByRole('option')).toHaveLength(10)
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  describe('with more than 10 options', () => {
    it('shows a focused search field', async () => {
      const user = userEvent.setup()
      render(<Harness options={many(11)} initial="v3" />)
      await user.click(trigger())
      const search = screen.getByRole('combobox', { name: 'Search Source' })
      expect(search).toHaveFocus()
      expect(screen.getAllByRole('option')).toHaveLength(11)
    })

    it('filters case-insensitively, keeps the selection identifiable and selects with Enter', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Harness options={many(12)} initial="v3" onChange={onChange} />)
      await user.click(trigger())
      await user.keyboard('OPTION d')
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(1)
      expect(options[0]).toHaveTextContent('Option D')
      expect(options[0]).toHaveAttribute('aria-selected', 'true')
      await user.clear(screen.getByRole('combobox'))
      await user.keyboard('option k')
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', { name: 'Option K' }).id,
      )
      await user.keyboard('{Enter}')
      expect(onChange).toHaveBeenCalledWith('v10')
    })

    it('lets Space type into the search field instead of selecting', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Harness options={many(11)} initial="v0" onChange={onChange} />)
      await user.click(trigger())
      await user.keyboard('option ')
      expect(screen.getByRole('combobox')).toHaveValue('option ')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('shows an empty state when nothing matches', async () => {
      const user = userEvent.setup()
      render(<Harness options={many(11)} initial="v0" />)
      await user.click(trigger())
      await user.keyboard('zzz')
      expect(screen.queryAllByRole('option')).toHaveLength(0)
      expect(screen.getByRole('status')).toHaveTextContent('No options match your search.')
    })
  })
})
