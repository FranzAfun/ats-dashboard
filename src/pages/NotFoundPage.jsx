import { Link } from 'react-router-dom'
import { buttonClasses } from '../components/buttonClasses.js'
import PageHeader from '../components/PageHeader.jsx'
import { paths } from '../config/paths.js'

function NotFoundPage() {
  return (
    <>
      <PageHeader
        title="Page not found"
        description="The requested page does not exist."
      />
      <Link
        to={paths.dashboard}
        className={buttonClasses.secondary}
      >
        Go to Dashboard
      </Link>
    </>
  )
}

export default NotFoundPage
