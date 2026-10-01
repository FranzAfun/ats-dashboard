import { useEffect, useId, useRef } from 'react'
import { buttonClasses } from './buttonClasses.js'

/**
 * Modal confirmation built on the native <dialog> (focus containment,
 * Escape to cancel, inert background).
 */
function ConfirmDialog({ open, title, children, confirmLabel, onConfirm, onCancel }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onCancel}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-control bg-surface p-0 text-text shadow-2xl backdrop:bg-canvas/70 open:animate-enter motion-reduce:open:animate-none"
    >
      <div className="p-5">
        <h2 id={titleId} className="text-lg font-semibold text-text">
          {title}
        </h2>
        <div className="mt-2 text-sm text-muted">{children}</div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className={buttonClasses.secondary} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={buttonClasses.primary} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
