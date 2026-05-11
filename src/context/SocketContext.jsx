import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem('cn_user')
    if (!userStr) return

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
    const newSocket = io(socketUrl)
    setSocket(newSocket)

    newSocket.on('connect', () => {
      try {
        const user = JSON.parse(userStr)
        newSocket.emit('join_role_room', user.role)
      } catch (e) {}
    })

    newSocket.on('new_ticket', (data) => {
      setNotifications((prev) => [data, ...prev])
      setHasUnread(true)
      if (Notification.permission === 'granted') {
        new Notification('New Ticket', { body: data.message })
      }
    })

    return () => newSocket.close()
  }, [])

  const markAsRead = () => setHasUnread(false)

  return (
    <SocketContext.Provider value={{ socket, notifications, hasUnread, markAsRead }}>
      {children}
    </SocketContext.Provider>
  )
}
