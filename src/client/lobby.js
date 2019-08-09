import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'

const Lobby = withRouter(({ history, socket }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // тут мы можем оказаться из кеша без логина

    socket.on('lobby:broadcast:message', message => {
      setMessages([...messages, message])
    })
  })

  const handleChange = ({ target: { value } }) => {
    setMessage(value)
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (message) {
      socket.emit('lobby:send:message', message, success => {
        if (success) {
          setMessage('')
        } else {
          history.replace('/')
        }
      })
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
      <div style={{ height: '100%', width: '100%', backgroundColor: 'green' }}>
        <ul style={{ listStyle: 'none' }}>
          {messages.map(message => {
            const { sender = 'System', text, time } = message
            return <li key={`${sender}${time}`}>{`${sender}: ${text} (${moment.unix(time).format('HH:mm')})`}</li>
          })}
        </ul>
      </div>
      <form onSubmit={handleSubmit} style={{ position: 'absolute', left: 0, bottom: 0 }}>
        <input
          type="text"
          value={message}
          onChange={handleChange}
          style={{ boxSizing: 'border-box', width: '300px', margin: 5 }}
        />
        <input type="submit" style={{ display: 'none' }} />
      </form>
    </div>
  )
})

export default Lobby
