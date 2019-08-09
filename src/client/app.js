import { hot } from 'react-hot-loader/root'
import React, { useEffect, useState } from 'react'
import { Route, HashRouter, withRouter } from 'react-router-dom'

import Login from './login'
import Lobby from './lobby'

import game from './game'

const App = ({ app, socket }) => {
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

    // game(app)
  }, [])

  return (
    <HashRouter>
      <Route exact path="/" component={() => <Login socket={socket} />} />
      <Route path="/lobby" component={() => <Lobby socket={socket} />} />
    </HashRouter>
  )
}

export default hot(App)
