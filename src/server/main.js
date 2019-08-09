import express from 'express'
import http from 'http'
import morgan from 'morgan'
import cors from 'cors'
// import { join, resolve, basename, parse } from 'path'
import SocketIO from 'socket.io'
import moment from 'moment'

let connectedSockets = {}

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.static(__dirname + '/'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const httpServer = http.createServer(app)
httpServer.on('error', e => {
  if (e.code === 'EADDRINUSE') {
    httpServer.close()
  }
})

const io = SocketIO(httpServer)

// users online
const users = []

const findUserByNick = nick => {
  return users.find(user => user.nick === nick)
}

const findUserById = id => {
  return users.find(user => user.id === id)
}

const login = (socket, nick, fn) => {
  const found = findUserByNick(nick)
  if (found) {
    fn(false)
  }

  users.push({ nick, id: socket.id })

  fn(true)
}

const lobbyMessage = (socket, message, fn) => {
  const user = findUserById(socket.id)
  if (user) {
    fn(true)
    io.emit('lobby:broadcast:message', { sender: user.nick, text: message, time: moment().unix() })
  } else {
    console.error('got message from unregistered socket')
    fn(false)
  }
}

const logout = socket => {
  console.log('user disconnected:', socket.id)
  delete connectedSockets[socket.id]
}

const messageHandlers = {
  disconnect: logout,
  'user:login': login,
  'lobby:send:message': lobbyMessage
}

const socketHandler = socket => {
  console.log('a user connected:', socket.id)
  connectedSockets[socket.id] = socket

  for (const eventName in messageHandlers) {
    socket.on(eventName, messageHandlers[eventName].bind(null, socket))
  }
}

io.on('connection', socketHandler)
httpServer.listen(8888, () => {})
