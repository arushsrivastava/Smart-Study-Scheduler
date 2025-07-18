import React, { useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Topics from './pages/Topics'
import Schedule from './pages/Schedule'
import Analytics from './pages/Analytics'
import Study from './pages/Study'
import Settings from './pages/Settings'
import Notification from './components/Notification'

function App() {
  const { state, dispatch } = useContext(AppContext)

  useEffect(() => {
    // Apply theme on app load
    document.documentElement.setAttribute('data-color-scheme', state.settings.theme)
  }, [state.settings.theme])

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/study" element={<Study />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <Notification />
      </div>
    </BrowserRouter>
  )
}

export default App