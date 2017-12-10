
/**
 * Event
 */
class Event {
  /**
   * Create an Event
   * @param {string} event - Event name
   * @param {object} payload - Event payload
   */
  constructor(event, payload) {
    if(!payload) {
      let $ = JSON.parse(event)
      if($.event) this.event = $.event
      if($.payload) this.payload = $.payload
    } else {
      this.event = event
      this.payload = payload
    }
    this.event = this.event.toUpperCase()
  }

  /**
   * Compress an event to send over the websocket
   * @returns {string} Compressed version of the event
   */
  compress() {
    return JSON.stringify({
      event: this.event,
      payload: this.payload
    })
  }
}


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
    this.ws.onerror = (err) => {
      switch(err.code) {
        case 'ECONNREFUSED':
          console.warn(`NanoServer refused connection.`)
          this.reconnect()
          break
        default:
          console.error('NanoSocket error!', err)
          break
      }
    }
    this.ws.onmessage = (_event) => {
      let event
      try {
        event = new Event(_event.data)
      } catch (err) {
        return console.error('F ailed to parse WS event', _event)
      }
      if (!event) {
        return console.error('Failed to parse WS event', _event)
      }
      let eventName = event.event
      if(eventName && this.listeners[eventName]) {
        for(const listener of this.listeners[eventName]) {
          try {
            listener(eventName, event.payload, event)
          } catch(err) {
            console.error(`Failed to run listener for ${eventName}`)
          }
        }
      }
    }
    this.ws.onclose = (code, reason) => {
      console.warn(`NanoServer closed connection. Code ${code}. Reason ${reason}`)
      this.reconnect()
    }
  }

  /**
   * Reconnect to the NanoServer
   */
  reconnect() {
    console.warn(`Retrying connection in 1 second`)
    if(this.ws && this.ws.removeAllListeners) this.ws.removeAllListeners()
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
export {
  Event, NanoSocket
}