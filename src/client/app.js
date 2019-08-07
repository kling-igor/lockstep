import { hot } from 'react-hot-loader/root'
import React, { useEffect, useState } from 'react'
import { Route, NavLink, HashRouter, withRouter } from 'react-router-dom'
import io from 'socket.io-client'

import game from './game'

const socket = io()

const Login = withRouter(({ history }) => {
  const [nickname, setNickname] = useState('')

  const handleChange = ({ target: { value } }) => {
    setNickname(value)
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (nickname) {
      history.replace('/lobby')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nickname:
        <input type="text" value={nickname} onChange={handleChange} />
      </label>
      <input disabled={!nickname} type="submit" value="Submit" />
    </form>
  )
})

const Lobby = () => {
  const [message, setMessage] = useState('')

  const handleChange = ({ target: { value } }) => {
    setMessage(value)
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (message) {
      // socket.send()
    }
  }
  return (
    <div
      style={{
        height: '100%',
        backgroundColor: 'yellow',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
      }}
    >
      <div style={{ height: '100%', width: '100%', backgroundColor: 'green' }} />
      <form onSubmit={handleSubmit} style={{ position: 'absolute', left: 0, bottom: 0 }}>
        <input
          type="text"
          value={message}
          onChange={handleChange}
          style={{ boxSizing: 'border-box', width: '300px', margin: 5 }}
        />
        <input disabled={!message} type="submit" value="Send" />
      </form>
    </div>
  )
}

const App = ({ app }) => {
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
      <Route exact path="/" component={Login} />
      <Route path="/lobby" component={Lobby} />
    </HashRouter>
  )
}

export default hot(App)
