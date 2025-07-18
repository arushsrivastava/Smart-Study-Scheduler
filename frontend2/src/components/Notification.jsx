import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

const Notification = () => {
  const { state, dispatch } = useContext(AppContext)
  const { notification } = state

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        dispatch({ type: 'NOTIFICATION_HIDE' })
      }, 5000) // Auto-hide after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [notification.show, dispatch])

  const handleClose = () => {
    dispatch({ type: 'NOTIFICATION_HIDE' })
  }

  if (!notification.show) return null

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      default: return 'ℹ️'
    }
  }

  return (
    <div className={`notification ${notification.type}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>{getIcon()}</span>
        <span style={{ flex: 1 }}>{notification.message}</span>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            padding: '0.25rem'
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Notification