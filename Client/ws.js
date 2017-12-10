const winston = require('winston')
const WebSocket = require('ws')
const package = require('./package.json')

const { Event } = require('../Shared')


/**
 * @typedef {Object} NanoSocketOptions
 * @property {string} ip - IP of the NanoServer to connect to
 * @property {number} port - Port of the NanoServer to connect to
 */

/**
 * NanoSocket
 */
class NanoSocket {
  /**
   * Create a NanoSocket
   * @param {NanoSocketOptions} options 
   */
  constructor(options) {
    this.options = options
    this.ip = this.options.ip
    this.port = this.options.port
    this.listeners = {}
  }
  connect() {
    this.ws = new WebSocket(`ws://${this.ip}:${this.port}`)
    this.ws.on('error', (err) => {
      switch(err.code) {
        case 'ECONNREFUSED':
          winston.warn(`NanoServer refused connection.`)
          this.reconnect()
          break
        default:
          winston.error('NanoSocket error!', err)
          break
      }
    })
    this.ws.on('message', (_event) => {
      let event
      try {
        event = new Event(_event)
      } catch (err) {
        return winston.error('Failed to parse WS event', _event)
      }
      if (!event) {
        return winston.error('Failed to parse WS event', _event)
      }
      let eventName = event.event
      if(eventName && this.listeners[eventName]) {
        for(const listener of this.listeners[eventName]) {
          try {
            listener(eventName, event.payload, event)
          } catch(err) {
            winston.error(`Failed to run listener for ${eventName}`)
          }
        }
      }
    })
    this.ws.on('close', (code, reason) => {
      winston.warn(`NanoServer closed connection. Code ${code}. Reason ${reason}`)
      this.reconnect()
    })
  }

  /**
   * Reconnect to the NanoServer
   */
  reconnect() {
    winston.warn(`Retrying connection in 1 second`)
    this.ws.removeAllListeners()
    this.ws = undefined
    setTimeout(function(self) {
      self.connect()
    }, 1000, this)
  }

  /**
   * Add a listener for events
   * @param {string} event - Event name to add a listener for
   * @param {function} listener - Listener callback
   */
  on(event, listener) {
    event = event.toUpperCase()
    if(!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(listener)
  }

  /**
   * Send an event to the NanoServer
   * @param {Event} event - Event to send
   */
  send(event) {
    this.ws.send(event.compress())
  }
}
module.exports = {
  NanoSocket
}