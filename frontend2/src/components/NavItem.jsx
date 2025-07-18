import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavItem = ({ path, icon, label, collapsed }) => {
  const location = useLocation()
  const isActive = location.pathname === path

  return (
    <Link 
      to={path} 
      className={`nav-item ${isActive ? 'active' : ''}`}
      title={collapsed ? label : ''}
    >
      <span className="icon">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

export default NavItem