import { useSyncExternalStore } from 'react'
import { themeStore } from '../lib/theme.js'
import { buttonClasses } from './buttonClasses.js'

const iconProps = {
  viewBox: '0 0 24 24',
  className: 'size-5',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

/** Switches between the light and dark theme; the choice is saved. */
function ThemeToggle() {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot)
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => themeStore.set(next)}
      className={buttonClasses.icon}
      title={`Switch to ${next} theme`}
    >
      <span className="sr-only">Switch to {next} theme</span>
      {theme === 'dark' ? (
        // Sun: shown in dark theme, switches to light.
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        // Moon: shown in light theme, switches to dark.
        <svg {...iconProps}>
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
