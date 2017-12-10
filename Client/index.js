const winston = require('winston')
const WebSocket = require('ws')
const package = require('./package.json')

const { NanoSocket } = require('./ws')
const { Event } = require('../Shared')

const ws = new NanoSocket({
  ip: '192.168.7.250',
  port: 6516
})

ws.on('hello', (_, payload, event) => {
  winston.info(`Connected to ${payload.server}`)
  ws.send(new Event('update', {}))
  ws.send(new Event('mine_start', {}))

})


ws.connect()