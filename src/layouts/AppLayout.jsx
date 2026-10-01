import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import BrandMark from '../components/BrandMark.jsx'
import NavigationDrawer from '../components/navigation/NavigationDrawer.jsx'
import NavigationList from '../components/navigation/NavigationList.jsx'

/**
 * Responsive application shell.
 * Below `lg`: top bar with a menu button that opens the navigation drawer.
 * From `lg`: persistent sidebar.
 */
function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  return (
    <div className="min-h-svh bg-canvas text-text">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:outline-2 focus:outline-accent"
      >
        Skip to content
      </a>

      <aside className="hidden border-r border-border bg-surface lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col">
        <div className="flex min-h-16 items-center border-b border-border px-5">
          <BrandMark />
        </div>
        <nav aria-label="Primary" className="flex-1 overflow-y-auto p-3">
          <NavigationList />
        </nav>
      </aside>

      <header className="sticky top-0 z-10 flex min-h-14 items-center gap-2 border-b border-border bg-surface px-2 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          className="inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-raised hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        >
          <span className="sr-only">Open navigation</span>
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
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <BrandMark />
      </header>

      <NavigationDrawer open={drawerOpen} onClose={closeDrawer} />

      <main id="main-content" tabIndex={-1} className="focus:outline-none lg:pl-60">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
