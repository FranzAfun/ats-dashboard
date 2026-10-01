import { isMockData } from '../integration/adapter.js'
import { sources } from '../../config/sources.config.js'
import { toCsv } from '../../utils/csv.js'

function download(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/**
 * Client-side CSV export of the financial data currently loaded for a
 * period. INTERIM: the production export format, data range and any
 * server-side export are TBD (FR-FIN-007). Mock exports are labelled.
 */
export const exportService = {
  exportFinancialPeriod({ period, trend, energy }) {
    const prefix = isMockData ? 'MOCK-' : ''
    const date = new Date().toISOString().slice(0, 10)

    const trendRows = trend.total.map((point, index) => {
      const row = { periodStart: point.timestamp, total: point.value }
      for (const s of sources) row[s.id] = trend.bySource[s.id]?.[index]?.value ?? null
      return row
    })
    const trendColumns = [
      { key: 'periodStart', header: 'Period start' },
      ...sources.map((s) => ({ key: s.id, header: `${s.label} cost (${trend.currency})` })),
      { key: 'total', header: `Total cost (${trend.currency})` },
    ]

    const sourceRows = energy.sources.map((row) => ({ ...row, source: row.source }))
    const sourceColumns = [
      { key: 'source', header: 'Source' },
      { key: 'energy', header: 'Energy (kWh)' },
      { key: 'cost', header: `Cost (${energy.currency})` },
    ]

    const notice = isMockData ? 'MOCK DATA - not production values\r\n\r\n' : ''
    const text = `${notice}Cost trend (${period})\r\n${toCsv(trendColumns, trendRows)}\r\n\r\nSource energy and cost (current ${period} period)\r\n${toCsv(sourceColumns, sourceRows)}\r\n`
    download(`${prefix}ats-financial-${period}-${date}.csv`, text)
  },
}
