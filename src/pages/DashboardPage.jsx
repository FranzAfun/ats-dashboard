import NotImplementedNotice from '../components/NotImplementedNotice.jsx'
import PageHeader from '../components/PageHeader.jsx'

function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Operational overview of the ATS: active source, source status, tariff, temperature, power flow and alerts."
      />
      <NotImplementedNotice />
    </>
  )
}

export default DashboardPage
