import React, { useEffect } from 'react'
import io from 'socket.io-client'

const socket = io()

const Loader = PIXI.Loader.shared

export default ({ app }) => {
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

    Loader.add('images/sprite.png').load(() => {
      const sprite = new PIXI.Sprite(Loader.resources['images/sprite.png'].texture)
      app.stage.addChild(sprite)
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
