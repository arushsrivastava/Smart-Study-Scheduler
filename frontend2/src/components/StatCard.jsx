import React from 'react'

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <div className="card stat-card">
      <div className="stat-value" style={{ color: `var(--${color})` }}>
        {icon && <span className="icon" style={{ marginRight: '0.5rem' }}>{icon}</span>}
        {value}
      </div>
      <div className="stat-label">{title}</div>
    </div>
  )
}

export default StatCard