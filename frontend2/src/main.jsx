import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AppProvider from './context/AppContext.jsx'
import './assets/style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)