/** `compact` hides the name on very narrow screens (below 360px). */
function BrandMark({ compact = false }) {
  return (
    <span className="flex items-center gap-2 text-base font-semibold whitespace-nowrap text-text">
      <svg
        viewBox="0 0 32 32"
        className="size-6 shrink-0"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="32" height="32" rx="6" className="fill-raised" />
        <path d="M18 5 9 18h6l-1 9 9-13h-6z" className="fill-text" />
      </svg>
      <span className={compact ? 'sr-only min-[360px]:not-sr-only' : undefined}>ATS Dashboard</span>
    </span>
  )
}

export default BrandMark
