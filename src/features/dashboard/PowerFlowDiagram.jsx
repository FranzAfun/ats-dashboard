import { sources } from '../../config/sources.config.js'
import { describeSourceState } from '../shared/sourceState.js'

const WIDTH = 324
const HEIGHT = 300
const NODE_W = 100
const NODE_H = 56
const SOURCE_Y = 12
const ATS = { x: 112, y: 128, w: 100, h: 48 }
const LOAD = { x: 102, y: 236, w: 120, h: 58 }

const sourceX = (index) => 2 + index * (NODE_W + 10)

/**
 * Animated ATS power-flow visualization (SPEC.md §13). It is derived only
 * from the provided status data: flow is animated along the active
 * source's path while data is live and no transition is in progress.
 * Under reduced motion the path is shown statically with direction
 * arrows.
 */
function PowerFlowDiagram({ status, live, loadPowerLabel }) {
  const { activeSource, sourceStatus, ats } = status
  const transitioning = ats.transitioning
  const flowing = live && !transitioning && activeSource !== null

  const description = [
    transitioning
      ? 'The ATS is switching sources; no source is supplying the load.'
      : activeSource
        ? `${sources.find((s) => s.id === activeSource)?.label} is supplying the load through the ATS.`
        : 'No active source.',
    ...sources.map((s) => `${s.label}: ${describeSourceState(sourceStatus[s.id], transitioning).label}.`),
    live ? '' : 'Data is not live.',
  ].join(' ')

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`Power flow. ${description}`}
      className="mx-auto block h-auto w-full max-w-lg"
    >
      <defs>
        <marker
          id="pf-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerUnits="userSpaceOnUse"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <path d="M0 0 10 5 0 10z" fill="var(--color-text)" />
        </marker>
      </defs>

      {sources.map((source, index) => {
        const state = sourceStatus[source.id]
        const x = sourceX(index)
        const isActive = state?.active && !transitioning
        const available = state?.available === true
        const fromX = x + NODE_W / 2
        const fromY = SOURCE_Y + NODE_H
        const toX = ATS.x + ATS.w / 2 + (index - 1) * 30
        const path = `M${fromX} ${fromY} C ${fromX} ${fromY + 40}, ${toX} ${ATS.y - 40}, ${toX} ${ATS.y}`
        const color = `var(${source.colorVar})`
        const display = describeSourceState(state, transitioning)

        return (
          <g key={source.id}>
            <path
              d={path}
              fill="none"
              stroke={isActive ? color : 'var(--color-border)'}
              strokeWidth={isActive ? 3 : 2}
              strokeDasharray={available || isActive ? undefined : '3 5'}
            />
            {isActive && flowing && (
              <path
                d={path}
                fill="none"
                stroke="var(--color-text)"
                strokeOpacity="0.85"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="2 18"
                className="animate-flow motion-reduce:hidden"
              />
            )}
            {isActive && (
              <path d={path} fill="none" stroke={color} strokeWidth="0" markerEnd="url(#pf-arrow)" className="hidden motion-reduce:inline" />
            )}
            <rect
              x={x}
              y={SOURCE_Y}
              width={NODE_W}
              height={NODE_H}
              rx="6"
              fill="var(--color-raised)"
              stroke={isActive ? color : 'var(--color-border)'}
              strokeWidth={isActive ? 2 : 1}
            />
            <rect x={x} y={SOURCE_Y} width="4" height={NODE_H} rx="2" fill={color} />
            <text x={x + 12} y={SOURCE_Y + 24} fill="var(--color-text)" fontSize="15" fontWeight="600">
              {source.label}
            </text>
            <text x={x + 12} y={SOURCE_Y + 44} fill="var(--color-muted)" fontSize="13">
              {display.label}
            </text>
          </g>
        )
      })}

      <path
        d={`M${ATS.x + ATS.w / 2} ${ATS.y + ATS.h} L ${LOAD.x + LOAD.w / 2} ${LOAD.y}`}
        fill="none"
        stroke={flowing ? 'var(--color-text)' : 'var(--color-border)'}
        strokeOpacity={flowing ? 0.5 : 1}
        strokeWidth="3"
        markerEnd={flowing ? 'url(#pf-arrow)' : undefined}
      />
      {flowing && (
        <path
          d={`M${ATS.x + ATS.w / 2} ${ATS.y + ATS.h} L ${LOAD.x + LOAD.w / 2} ${LOAD.y}`}
          fill="none"
          stroke="var(--color-text)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 18"
          className="animate-flow motion-reduce:hidden"
        />
      )}

      <rect
        x={ATS.x}
        y={ATS.y}
        width={ATS.w}
        height={ATS.h}
        rx="6"
        fill="var(--color-surface)"
        stroke={transitioning ? 'var(--color-info)' : 'var(--color-control)'}
        strokeWidth="2"
        strokeDasharray={transitioning ? '6 4' : undefined}
      />
      <text x={ATS.x + ATS.w / 2} y={ATS.y + 20} textAnchor="middle" fill="var(--color-text)" fontSize="15" fontWeight="600">
        ATS
      </text>
      <text x={ATS.x + ATS.w / 2} y={ATS.y + 39} textAnchor="middle" fill="var(--color-muted)" fontSize="13">
        {transitioning
          ? 'Switching…'
          : !live
            ? 'Not live'
            : activeSource
              ? `On ${sources.find((s) => s.id === activeSource)?.label}`
              : 'Open'}
      </text>

      <rect x={LOAD.x} y={LOAD.y} width={LOAD.w} height={LOAD.h} rx="6" fill="var(--color-raised)" stroke="var(--color-border)" />
      <text x={LOAD.x + LOAD.w / 2} y={LOAD.y + 24} textAnchor="middle" fill="var(--color-text)" fontSize="15" fontWeight="600">
        Load
      </text>
      <text x={LOAD.x + LOAD.w / 2} y={LOAD.y + 45} textAnchor="middle" fill="var(--color-muted)" fontSize="13">
        {loadPowerLabel ?? (transitioning ? 'Not supplied' : !live ? 'Unknown' : flowing ? 'Supplied' : 'Not supplied')}
      </text>
    </svg>
  )
}

export default PowerFlowDiagram
