import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

const Settings = () => {
  const { state, dispatch } = useContext(AppContext)
  const { settings } = state

  const [formData, setFormData] = useState({
    defaultDuration: settings.defaultDuration,
    shortBreak: settings.shortBreak,
    longBreak: settings.longBreak,
    dailyGoal: settings.dailyGoal,
    theme: settings.theme,
    notifications: settings.notifications,
    autoStartBreaks: settings.autoStartBreaks,
    pomodorosUntilLongBreak: settings.pomodorosUntilLongBreak
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    const hasChanges = Object.keys(formData).some(key => 
      formData[key] !== settings[key]
    )
    setHasUnsavedChanges(hasChanges)
  }, [formData, settings])

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    dispatch({
      type: 'SETTINGS_UPDATE',
      payload: formData
    })

    dispatch({
      type: 'NOTIFICATION_SHOW',
      payload: {
        message: 'Settings saved successfully!',
        type: 'success'
      }
    })

    setHasUnsavedChanges(false)
  }

  const handleReset = () => {
    setFormData({
      defaultDuration: settings.defaultDuration,
      shortBreak: settings.shortBreak,
      longBreak: settings.longBreak,
      dailyGoal: settings.dailyGoal,
      theme: settings.theme,
      notifications: settings.notifications,
      autoStartBreaks: settings.autoStartBreaks,
      pomodorosUntilLongBreak: settings.pomodorosUntilLongBreak
    })
    setHasUnsavedChanges(false)
  }

  const handleExportData = () => {
    const exportData = {
      topics: state.topics,
      sessions: state.sessions,
      settings: state.settings,
      exportedAt: new Date().toISOString()
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `study-scheduler-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)

    dispatch({
      type: 'NOTIFICATION_SHOW',
      payload: {
        message: 'Data exported successfully!',
        type: 'success'
      }
    })
  }

  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result)

        if (importData.topics) {
          importData.topics.forEach(topic => {
            dispatch({ type: 'TOPIC_ADD', payload: topic })
          })
        }

        if (importData.sessions) {
          importData.sessions.forEach(session => {
            dispatch({ type: 'SESSION_ADD', payload: session })
          })
        }

        if (importData.settings) {
          dispatch({ type: 'SETTINGS_UPDATE', payload: importData.settings })
        }

        dispatch({
          type: 'NOTIFICATION_SHOW',
          payload: {
            message: 'Data imported successfully!',
            type: 'success'
          }
        })
      } catch (error) {
        dispatch({
          type: 'NOTIFICATION_SHOW',
          payload: {
            message: 'Failed to import data. Please check the file format.',
            type: 'error'
          }
        })
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('studySchedulerData')
      window.location.reload()
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Customize your study experience and manage your data.
        </p>
      </div>

      <div className="grid grid-2" style={{ gap: '2rem' }}>
        {/* Timer Settings */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>⏱️ Timer Settings</h3>

          <div className="form-group">
            <label className="form-label">Default Study Duration (minutes)</label>
            <input
              type="number"
              className="form-input"
              value={formData.defaultDuration}
              onChange={(e) => handleChange('defaultDuration', parseInt(e.target.value))}
              min="1"
              max="120"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Break Duration (minutes)</label>
            <input
              type="number"
              className="form-input"
              value={formData.shortBreak}
              onChange={(e) => handleChange('shortBreak', parseInt(e.target.value))}
              min="1"
              max="30"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Long Break Duration (minutes)</label>
            <input
              type="number"
              className="form-input"
              value={formData.longBreak}
              onChange={(e) => handleChange('longBreak', parseInt(e.target.value))}
              min="1"
              max="60"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pomodoros until Long Break</label>
            <input
              type="number"
              className="form-input"
              value={formData.pomodorosUntilLongBreak}
              onChange={(e) => handleChange('pomodorosUntilLongBreak', parseInt(e.target.value))}
              min="2"
              max="10"
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.autoStartBreaks}
                onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
              />
              <span>Auto-start breaks</span>
            </label>
          </div>
        </div>

        {/* App Settings */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>🎨 App Settings</h3>

          <div className="form-group">
            <label className="form-label">Theme</label>
            <select
              className="form-select"
              value={formData.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Daily Study Goal (minutes)</label>
            <input
              type="number"
              className="form-input"
              value={formData.dailyGoal}
              onChange={(e) => handleChange('dailyGoal', parseInt(e.target.value))}
              min="15"
              max="480"
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
              />
              <span>Enable notifications</span>
            </label>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Get notified when study sessions and breaks end
            </div>
          </div>
        </div>
      </div>

      {/* Save/Reset Buttons */}
      {hasUnsavedChanges && (
        <div className="card" style={{ marginTop: '2rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>You have unsaved changes</strong>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Save your changes to apply the new settings.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Management */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>💾 Data Management</h3>

        <div className="grid grid-2">
          <div>
            <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Backup</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Export your topics, sessions, and settings to a JSON file.
            </p>
            <button className="btn btn-secondary" onClick={handleExportData}>
              📥 Export Data
            </button>
          </div>

          <div>
            <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Restore</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Import topics and sessions from a backup file.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
              id="import-file"
            />
            <label htmlFor="import-file" className="btn btn-secondary" style={{ cursor: 'pointer' }}>
              📤 Import Data
            </label>
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: '1px solid var(--error)' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', color: 'var(--error)' }}>Danger Zone</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            This action will permanently delete all your topics, sessions, and settings. This cannot be undone.
          </p>
          <button className="btn btn-error" onClick={handleClearData}>
            🗑️ Clear All Data
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="card" style={{ marginTop: '2rem', backgroundColor: 'var(--background-secondary)' }}>
        <h3 style={{ marginBottom: '1rem' }}>ℹ️ About</h3>
        <div className="grid grid-2">
          <div>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Smart Study Scheduler</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              A React-based study app with Pomodoro timer and spaced repetition system.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Features</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <li>Pomodoro timer with customizable durations</li>
              <li>Spaced repetition scheduling</li>
              <li>Study analytics and progress tracking</li>
              <li>Data export and import</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings