import { useEffect, useRef } from 'react'
import BrandMark from '../BrandMark.jsx'
import { buttonClasses } from '../buttonClasses.js'
import NavigationList from './NavigationList.jsx'
import ShellPanel from './ShellPanel.jsx'

// Matches Tailwind's `lg` breakpoint, where the persistent sidebar appears.
const DESKTOP_MEDIA_QUERY = '(min-width: 64rem)'

/**
 * Mobile/tablet navigation drawer built on the native modal <dialog>,
 * which provides focus containment, Escape handling, an inert
 * background and focus restoration on close.
 */
function NavigationDrawer({ open, onClose, footer }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Close the drawer if the viewport grows to the desktop layout.
  useEffect(() => {
    if (!open) return undefined
    const query = window.matchMedia(DESKTOP_MEDIA_QUERY)
    function handleChange(event) {
      if (event.matches) onClose()
    }
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [open, onClose])

  function handleClick(event) {
    // A click on the dialog element itself is a click on the backdrop.
    if (event.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Navigation"
      onClose={onClose}
      onClick={handleClick}
      className="m-0 h-dvh max-h-none w-72 max-w-[85vw] -translate-x-full bg-transparent p-0 text-text transition-[translate,overlay,display] transition-discrete duration-200 ease-out backdrop:bg-canvas/70 open:translate-x-0 starting:open:-translate-x-full motion-reduce:transition-none lg:hidden"
    >
      <div className="flex h-full flex-col border-r border-border bg-surface shadow-2xl">
        <div className="flex min-h-14 items-center justify-between gap-2 border-b border-border px-4">
          <BrandMark />
          <button type="button" onClick={onClose} className={buttonClasses.icon}>
            <span className="sr-only">Close navigation</span>
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <nav aria-label="Primary" className="flex-1 overflow-y-auto p-3">
          <NavigationList onNavigate={onClose} />
        </nav>
        <ShellPanel>{footer}</ShellPanel>
      </div>
    </dialog>
  )
}

export default NavigationDrawer
