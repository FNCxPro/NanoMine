const winston = require('winston')
const WebSocket = require('ws')
const package = require('./package.json')

const {NanoSocket} = require('./ws')

const ws = new NanoSocket({
  ip: '127.0.0.1',
  port: 6516
})

ws.on('hello', (_, payload, event) => {
  winston.info(`Connected to ${payload.server}`)
})

ws.connect()