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
      history.replace('/other')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nickname:
        <input type="text" value={nickname} onChange={handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
})

const OtherPage = () => {
  return <div style={{ height: '100%', backgroundColor: 'yellow' }} />
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
      <Route path="/other" component={OtherPage} />
    </HashRouter>
  )
}

export default hot(App)
