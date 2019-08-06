import React, { useEffect } from 'react'
import io from 'socket.io-client'

const socket = io()

export default () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('CONNECTED as ', socket.id)
    })
    socket.on('reconnect', () => {
      console.log('RECONNECTED as ', socket.id)
    })
    socket.on('event', data => {
      console.log('EVENT', data)
    })
    socket.on('disconnect', () => {
      console.log('DISCONNECTED')
    })
  }, [])

  return (
    <button
      type="button"
      onClick={() => {
        console.log('CLICK')
        socket.emit('hello', 'world')
      }}
    >
      JOIN
    </button>
  )
}
