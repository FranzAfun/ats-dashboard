import NotImplementedNotice from '../components/NotImplementedNotice.jsx'
import PageHeader from '../components/PageHeader.jsx'

function AdminPage() {
  return (
    <>
      <PageHeader
        title="Administration"
        description="Users, roles, permissions and feature access."
      />
      <NotImplementedNotice />
    </>
  )
}

export default AdminPage
