import React from 'react'
import { render } from 'react-dom'
import App from './app'
import io from 'socket.io-client'
const socket = io()
/*
//Create a Pixi Application
const app = new PIXI.Application({
  width: 256, // default: 800
  height: 256, // default: 600
  antialias: true, // default: false
  transparent: false, // default: false
  resolution: 1 // default: 1
})
document.getElementById('game').appendChild(app.view)

render(<App app={app} />, document.getElementById('lobby'))
*/

render(<App socket={socket} />, document.getElementById('lobby'))
