import { NavLink } from 'react-router-dom'
import { navigationItems } from '../../config/navigation.config.js'

function linkClassName({ isActive }) {
  const base =
    'flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none'

  return isActive
    ? `${base} bg-raised text-text shadow-[inset_3px_0_0_var(--color-accent)]`
    : `${base} text-muted hover:bg-raised hover:text-text`
}

/**
 * Primary navigation links. Used by the desktop sidebar and the mobile
 * navigation drawer. NavLink sets aria-current="page" on the active item.
 */
function NavigationList({ onNavigate }) {
  return (
    <ul className="flex flex-col gap-1">
      {navigationItems.map((item) => (
        <li key={item.id}>
          <NavLink to={item.path} className={linkClassName} onClick={onNavigate}>
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export default NavigationList
