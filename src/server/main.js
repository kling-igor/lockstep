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

let io = SocketIO(httpServer)
io.on('connection', socket => {
  console.log('a user connected:', socket.id)
  connectedSockets[socket.id] = socket

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id)
    delete connectedSockets[socket.id]
  })

  socket.on('hello', msg => {
    console.log('message: ' + msg)
  })
})

httpServer.listen(8888, () => {})
