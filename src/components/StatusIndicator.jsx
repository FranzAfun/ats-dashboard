/**
 * Status presentation that never relies on color alone: every tone has a
 * distinct shape and the label is always rendered as text.
 */
const tones = {
  ok: { text: 'text-ok', shape: 'circle' },
  warning: { text: 'text-warning', shape: 'triangle' },
  critical: { text: 'text-critical', shape: 'diamond' },
  info: { text: 'text-info', shape: 'circle' },
  offline: { text: 'text-offline', shape: 'ring' },
}

function Shape({ shape }) {
  const common = { className: 'size-2.5 shrink-0', viewBox: '0 0 10 10', 'aria-hidden': true, focusable: false }
  if (shape === 'triangle') {
    return (
      <svg {...common}>
        <path d="M5 0.5 9.6 9.5H0.4z" fill="currentColor" />
      </svg>
    )
  }
  if (shape === 'diamond') {
    return (
      <svg {...common}>
        <path d="M5 0 10 5 5 10 0 5z" fill="currentColor" />
      </svg>
    )
  }
  if (shape === 'ring') {
    return (
      <svg {...common}>
        <circle cx="5" cy="5" r="3.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="5" cy="5" r="4.5" fill="currentColor" />
    </svg>
  )
}

function StatusIndicator({ tone = 'offline', label, className = '' }) {
  const config = tones[tone] ?? tones.offline
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${config.text} ${className}`}>
      <Shape shape={config.shape} />
      <span>{label}</span>
    </span>
  )
}

export default StatusIndicator
