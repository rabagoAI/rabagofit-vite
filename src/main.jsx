import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { WorkoutProvider } from './context/WorkoutContext'
import { UserProvider } from './context/UserContext'
import { ToastProvider } from './context/ToastContext'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <UserProvider>
            <WorkoutProvider>
              <App />
            </WorkoutProvider>
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
