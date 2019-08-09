import express from 'express'
import http from 'http'
import morgan from 'morgan'
import cors from 'cors'
// import { join, resolve, basename, parse } from 'path'
import SocketIO from 'socket.io'

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

// users online
const users = []

const findUserByNick = nick => {
  return users.find(user => user.nick === nick)
}

const login = (socket, nick, fn) => {
  const found = findUserByNick(nick)
  if (found) {
    fn(false)
  }

  fn(true)

  users.push({ nick })
}

const logout = socket => {
  console.log('user disconnected:', socket.id)
  delete connectedSockets[socket.id]
}

const messageHandlers = {
  disconnect: logout,
  'user:login': login
}

const socketHandler = socket => {
  console.log('a user connected:', socket.id)
  connectedSockets[socket.id] = socket

  for (const eventName in messageHandlers) {
    socket.on(eventName, messageHandlers[eventName].bind(null, socket))
  }
}

SocketIO(httpServer).on('connection', socketHandler)
httpServer.listen(8888, () => {})
