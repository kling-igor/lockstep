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
const rooms = []

const findUserByNick = nick => {
  return users.find(user => user.nick === nick)
}

const findUserById = id => {
  return users.find(user => user.id === id)
}

const findRoomByName = name => {
  return rooms.find(room => room.name === name)
}

const login = (socket, nick, fn) => {
  const found = findUserByNick(nick)
  if (found) {
    fn(false)
    return
  }

  users.push({ nick, id: socket.id })

  fn(true)

  io.emit('lobby:broadcast:message', { text: `'${nick}' joined the chat`, time: moment().unix() })
}

const lobbyMessage = (socket, message, fn) => {
  const user = findUserById(socket.id)
  if (!user) {
    fn(false)
    return
  }

  fn(true)
  io.emit('lobby:broadcast:message', { sender: user.nick, text: message, time: moment().unix() })
}

const createRoom = (socket, roomName, fn) => {
  const user = findUserById(socket.id)
  if (!user) {
    fn(false)
    return
  }

  const found = findRoomByName(roomName)
  if (!found) {
    rooms.push({ name: roomName, owner: user.id, participants: [user.id] })
  }
}

const logout = socket => {
  delete connectedSockets[socket.id]

  const index = users.findIndex(user => user.id === socket.id)
  if (index !== -1) {
    const [{ nick }] = users.splice(index, 1)
    io.emit('lobby:broadcast:message', { text: `'${nick}' leaved the chat`, time: moment().unix() })
  }

  // проход по все комнатам
  // уведомление каждой комнаты, в которой является участником, что выходит из нее
  // если единственный участник комнаты, то комната удаляется (система уведомляется что комната удалилась)
  // если owner комнаты, то назначается другой по порядку (уведомление участника)
}

const messageHandlers = {
  disconnect: logout,
  'user:login': login,
  'lobby:send:message': lobbyMessage,
  'lobby:crate:room': createRoom
}

const socketHandler = socket => {
  connectedSockets[socket.id] = socket

  for (const eventName in messageHandlers) {
    socket.on(eventName, messageHandlers[eventName].bind(null, socket))
  }
}

io.on('connection', socketHandler)
httpServer.listen(8888, () => {})
