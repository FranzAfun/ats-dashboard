import { Link } from 'react-router-dom'
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
        className="inline-flex min-h-11 items-center rounded-md border border-control px-4 text-sm font-medium text-text transition-colors duration-150 hover:bg-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
      >
        Go to Dashboard
      </Link>
    </>
  )
}

export default NotFoundPage
