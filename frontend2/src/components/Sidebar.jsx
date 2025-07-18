import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import NavItem from './NavItem'

const Sidebar = () => {
  const { state, dispatch } = useContext(AppContext)
  const { sidebarCollapsed } = state.ui

  const toggleSidebar = () => {
    dispatch({ type: 'SIDEBAR_TOGGLE' })
  }

  const toggleTheme = () => {
    dispatch({ type: 'THEME_TOGGLE' })
  }

  const navItems = [
    { path: '/', icon: '🏠', label: 'Dashboard' },
    { path: '/topics', icon: '📚', label: 'Topics' },
    { path: '/schedule', icon: '📅', label: 'Schedule' },
    { path: '/study', icon: '⏱️', label: 'Study Timer' },
    { path: '/analytics', icon: '📊', label: 'Analytics' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ]

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          {sidebarCollapsed ? 'SS' : 'Smart Study'}
        </div>
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={item.label}
            collapsed={sidebarCollapsed}
          />
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          <span className="icon">{state.settings.theme === 'light' ? '🌙' : '☀️'}</span>
          {!sidebarCollapsed && (
            <span>{state.settings.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default Sidebar