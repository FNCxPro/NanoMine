import {WindowsToaster} from 'node-notifier'

const appId = 'pro.relative.nanomine'


/**
 * Notification Engine
 */
class notificationEngine {
  /**
   * Create a new NotificationEngine
   * @param {string} appId - Notification App ID
   */
  constructor(appId) {
    this.appId = appId
    this.notifier = new WindowsToaster({
      withFallback: false
    })
  }

  /**
   * Create a new toast notification
   * @param {string} title - Title to display
   * @param {string} text - Text to display in the notification
   * @param {function} [callback] - Callback for when notification is pressed
   */
  notify(title, text, callback) {
    console.log(title, text)
    try {
      this.notifier.notify({
        title: title,
        message: text,
        appID: this.appId,
        install: this.appId
      })
    } catch(err) {
      console.error(err)
    }
  }
}

let NotificationEngine = new notificationEngine(appId)
export {
  NotificationEngine
}