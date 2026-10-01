import { useEffect, useId, useMemo, useRef, useState } from 'react'

export const SEARCH_THRESHOLD = 10
const POPUP_MAX_HEIGHT = 288

const normalize = (text) => String(text ?? '').toLocaleLowerCase()

function firstEnabled(list, from = 0, step = 1) {
  for (let i = from; i >= 0 && i < list.length; i += step) {
    if (!list[i].disabled) return i
  }
  return -1
}

/**
 * Reusable single-select picker (listbox pattern) that replaces native
 * <select> menus so selection controls match the design system.
 *
 * options: [{ value, label, description?, disabled? }]
 * - More than `searchThreshold` (10) options: a search field is shown in
 *   the popup and receives focus; 10 or fewer: no search field.
 * - Keyboard: Enter/Space/ArrowUp/ArrowDown open; arrows, Home and End
 *   move; Enter (and Space outside the search field) select; Escape closes
 *   and returns focus to the trigger; Tab closes; typing a letter jumps to
 *   the next matching option when there is no search field.
 * - Closes on outside click/tap. Opens upwards when there is not enough
 *   room below. The popup is as wide as the trigger (no overflow).
 */
function Picker({
  label,
  hideLabel = false,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = 'Select…',
  searchThreshold = SEARCH_THRESHOLD,
  searchPlaceholder = 'Search…',
  emptyMessage = 'No options match your search.',
  className = '',
}) {
  const baseId = useId()
  const labelId = `${baseId}-label`
  const triggerId = `${baseId}-trigger`
  const listId = `${baseId}-list`
  const optionId = (index) => `${baseId}-option-${index}`

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [placement, setPlacement] = useState('below')

  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const listRef = useRef(null)
  const searchRef = useRef(null)
  const typeahead = useRef({ text: '', at: 0 })

  const searchable = options.length > searchThreshold
  const selected = options.find((option) => option.value === value)

  const visible = useMemo(() => {
    const q = normalize(query).trim()
    if (!searchable || !q) return options
    return options.filter(
      (option) => normalize(option.label).includes(q) || normalize(option.description).includes(q),
    )
  }, [options, query, searchable])

  function openPicker(direction = 'selected') {
    if (disabled) return
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) {
      const below = window.innerHeight - rect.bottom
      setPlacement(below < POPUP_MAX_HEIGHT && rect.top > below ? 'above' : 'below')
    }
    const selectedIndex = options.findIndex((option) => option.value === value && !option.disabled)
    const start =
      direction === 'last'
        ? firstEnabled(options, options.length - 1, -1)
        : selectedIndex >= 0
          ? selectedIndex
          : firstEnabled(options)
    setQuery('')
    setActiveIndex(start)
    setOpen(true)
  }

  function close({ restoreFocus = true } = {}) {
    setOpen(false)
    setQuery('')
    if (restoreFocus) triggerRef.current?.focus()
  }

  function choose(option) {
    if (!option || option.disabled) return
    close()
    if (option.value !== value) onChange(option.value)
  }

  // Focus the search field (large lists) or the list when opening.
  useEffect(() => {
    if (!open) return
    ;(searchable ? searchRef.current : listRef.current)?.focus()
  }, [open, searchable])

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open || activeIndex < 0) return
    document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: 'nearest' })
    // optionId is derived from a stable id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex])

  // Close on a pointer press outside the picker (focus is not moved).
  useEffect(() => {
    if (!open) return undefined
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [open])

  function onTriggerKeyDown(event) {
    if (disabled) return
    if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      openPicker()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openPicker('last')
    }
  }

  function moveTo(index) {
    if (index >= 0) setActiveIndex(index)
  }

  function onPopupKeyDown(event) {
    const inSearch = event.target === searchRef.current
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        moveTo(firstEnabled(visible, activeIndex + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (activeIndex > 0) moveTo(firstEnabled(visible, activeIndex - 1, -1))
        break
      case 'Home':
        if (inSearch) break
        event.preventDefault()
        moveTo(firstEnabled(visible))
        break
      case 'End':
        if (inSearch) break
        event.preventDefault()
        moveTo(firstEnabled(visible, visible.length - 1, -1))
        break
      case 'Enter':
        event.preventDefault()
        choose(visible[activeIndex])
        break
      case ' ':
        if (inSearch) break
        event.preventDefault()
        choose(visible[activeIndex])
        break
      case 'Escape':
        // Also keeps an enclosing modal <dialog> from closing.
        event.preventDefault()
        event.stopPropagation()
        close()
        break
      case 'Tab':
        close({ restoreFocus: false })
        break
      default:
        if (!searchable && event.key.length === 1 && /\S/.test(event.key)) {
          const now = event.timeStamp
          const buffer = now - typeahead.current.at < 600 ? typeahead.current.text + event.key : event.key
          typeahead.current = { text: buffer, at: now }
          const match = visible.findIndex(
            (option, index) =>
              !option.disabled &&
              normalize(option.label).startsWith(normalize(buffer)) &&
              (buffer.length > 1 || index > activeIndex),
          )
          const fallback = visible.findIndex(
            (option) => !option.disabled && normalize(option.label).startsWith(normalize(buffer)),
          )
          moveTo(match >= 0 ? match : fallback)
        }
    }
  }

  const activeId = open && activeIndex >= 0 && visible[activeIndex] ? optionId(activeIndex) : undefined

  return (
    <div ref={rootRef} className={`relative grid min-w-0 gap-1 ${className}`}>
      <span id={labelId} className={hideLabel ? 'sr-only' : 'text-xs text-muted'}>
        {label}
      </span>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        // aria-disabled (not disabled) keeps focus on the trigger when it is
        // disabled right after a choice, e.g. while the change is saved.
        aria-disabled={disabled || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${triggerId}`}
        onClick={() => (open ? close() : !disabled && openPicker())}
        onKeyDown={onTriggerKeyDown}
        className="flex min-h-11 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-control bg-canvas px-3 text-left text-sm text-text transition-colors duration-150 hover:bg-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:hover:bg-canvas motion-reduce:transition-none"
      >
        <span className={`min-w-0 truncate ${selected ? '' : 'text-subtle'}`}>{selected?.label ?? placeholder}</span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
          className={`size-4 shrink-0 text-muted transition-transform duration-150 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        >
          <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          onKeyDown={onPopupKeyDown}
          className={`absolute inset-x-0 z-40 flex max-h-72 flex-col overflow-hidden rounded-md border border-control bg-surface shadow-lg animate-enter motion-reduce:animate-none ${
            placement === 'above' ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          {searchable && (
            <div className="border-b border-border p-2">
              <input
                ref={searchRef}
                type="text"
                role="combobox"
                aria-label={`Search ${label}`}
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={activeId}
                value={query}
                autoComplete="off"
                spellCheck="false"
                placeholder={searchPlaceholder}
                onChange={(event) => {
                  const next = event.target.value
                  setQuery(next)
                  const q = normalize(next).trim()
                  const filtered = q
                    ? options.filter((o) => normalize(o.label).includes(q) || normalize(o.description).includes(q))
                    : options
                  setActiveIndex(firstEnabled(filtered))
                }}
                className="min-h-11 w-full rounded-md border border-control bg-canvas px-3 text-sm text-text placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
              />
            </div>
          )}
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={searchable ? -1 : 0}
            aria-labelledby={labelId}
            aria-activedescendant={searchable ? undefined : activeId}
            className="min-h-0 flex-1 overflow-y-auto p-1 focus:outline-none"
          >
            {visible.map((option, index) => {
              const isSelected = option.value === value
              const isActive = index === activeIndex
              return (
                <li
                  key={String(option.value)}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  onPointerMove={() => !option.disabled && setActiveIndex(index)}
                  onClick={() => choose(option)}
                  className={`flex min-h-11 items-center gap-2 rounded px-2 py-1.5 text-sm ${
                    option.disabled ? 'cursor-not-allowed text-subtle' : 'cursor-pointer text-text'
                  } ${isActive && !option.disabled ? 'bg-raised outline-1 -outline-offset-1 outline-control' : ''}`}
                >
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                    className={`size-4 shrink-0 ${isSelected ? 'text-accent' : 'invisible'}`}
                  >
                    <path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate ${isSelected ? 'font-semibold' : ''}`}>{option.label}</span>
                    {option.description && <span className="block truncate text-xs text-subtle">{option.description}</span>}
                  </span>
                </li>
              )
            })}
          </ul>
          {visible.length === 0 && (
            <p role="status" className="px-3 py-3 text-sm text-muted">
              {emptyMessage}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Picker
