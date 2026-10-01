import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { navigationItems } from '../config/navigation.config.js'
import { useAccess } from '../hooks/useAccess.js'
import { buttonClasses } from '../components/buttonClasses.js'

function AccessDeniedPage() {
  const { canAccessPage } = useAccess()
  const fallback = navigationItems.find((item) => canAccessPage(item.pageId))

  return (
    <>
      <PageHeader
        title="Access denied"
        description="Your account does not have access to this page."
      />
      {fallback && (
        <Link to={fallback.path} className={buttonClasses.secondary}>
          Go to {fallback.label}
        </Link>
      )}
    </>
  )
}

export default AccessDeniedPage
