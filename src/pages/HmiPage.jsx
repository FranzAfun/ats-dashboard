import NotImplementedNotice from '../components/NotImplementedNotice.jsx'
import PageHeader from '../components/PageHeader.jsx'

function HmiPage() {
  return (
    <>
      <PageHeader
        title="HMI Control"
        description="Authorized remote controls for the ATS."
      />
      <NotImplementedNotice />
    </>
  )
}

export default HmiPage
