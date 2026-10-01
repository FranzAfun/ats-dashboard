// Applies the saved theme, or the system preference, before first paint
// to avoid a flash of the wrong theme. Kept as an external file because
// the Content-Security-Policy does not allow inline scripts.
// Must stay in sync with src/lib/theme.js.
;(function () {
  var theme
  try {
    theme = window.localStorage.getItem('ats-dashboard.theme')
  } catch {
    theme = null
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  document.documentElement.setAttribute('data-theme', theme)
})()
