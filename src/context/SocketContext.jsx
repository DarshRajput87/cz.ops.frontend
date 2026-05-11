import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    const newSocket = io('http://localhost:5000')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Socket connected')
      // Join role room if user exists
      const userStr = localStorage.getItem('cn_user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          newSocket.emit('join_role_room', user.role)
        } catch (e) {}
      }
    })

    newSocket.on('new_ticket', (data) => {
      console.log('New ticket notification:', data)
      setNotifications((prev) => [data, ...prev])
      setHasUnread(true)
      
      // Optionally play a sound or show a toast
      if (Notification.permission === 'granted') {
        new Notification('New Ticket', { body: data.message })
      }
    })

    return () => newSocket.close()
  }, [])

  const markAsRead = () => {
    setHasUnread(false)
  }

  return (
    <SocketContext.Provider value={{ socket, notifications, hasUnread, markAsRead }}>
      {children}
    </SocketContext.Provider>
  )
}
