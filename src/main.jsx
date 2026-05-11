import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'
import { PermissionProvider } from './context/PermissionContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PermissionProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </PermissionProvider>
    </BrowserRouter>
  </React.StrictMode>
)
