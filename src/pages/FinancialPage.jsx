import NotImplementedNotice from '../components/NotImplementedNotice.jsx'
import PageHeader from '../components/PageHeader.jsx'

function FinancialPage() {
  return (
    <>
      <PageHeader
        title="Financial Analytics"
        description="Source usage, energy consumption, costs, cost trends, power-factor losses and data export."
      />
      <NotImplementedNotice />
    </>
  )
}

export default FinancialPage
