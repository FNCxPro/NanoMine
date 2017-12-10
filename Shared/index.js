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

module.exports = {
  Event
}