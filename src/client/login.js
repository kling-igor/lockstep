import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'

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
      <input type="submit" style={{ display: 'none' }} />
    </form>
  )
})

export default Login
