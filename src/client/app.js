import { hot } from 'react-hot-loader/root'
import React, { useEffect, useState } from 'react'
import { Route, NavLink, HashRouter, withRouter } from 'react-router-dom'

import game from './game'

const Login = withRouter(({ history, socket }) => {
  const [nickname, setNickname] = useState('')

  const [error, setError] = useState(false)

  const handleChange = ({ target: { value } }) => {
    setNickname(value)
    setError(false)
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (nickname) {
      socket.emit('user:login', nickname, success => {
        if (success) {
          history.replace('/lobby')
        } else {
          setError(true)
        }
      })
    }
  }

  const errorStyle = {
    backgroundColor: 'red',
    color: 'white'
  }

  const normalStyle = {
    backgroundColor: 'white',
    color: 'black'
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nickname:
        <input type="text" value={nickname} onChange={handleChange} style={error ? errorStyle : normalStyle} />
      </label>
      <input disabled={!nickname} type="submit" value="Submit" />
    </form>
  )
})

const Lobby = ({ socket }) => {
  const [message, setMessage] = useState('')

  const handleChange = ({ target: { value } }) => {
    setMessage(value)
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (message) {
      // socket.send('login', )
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
