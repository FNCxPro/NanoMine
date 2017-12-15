const electron = require('electron')
const { BrowserWindow, ipcMain, app } = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')

let mainWindow

const notifier = require('node-notifier')

require('electron-debug')({
  enabled: true
})

ipcMain.on('notify', (e, arg) => {
  console.log(arg)
  console.log('test')
  notifier.notify({
    title: 'Title',
    message: 'test',
    appID: 'pro.relative.nanomine'
  })
})

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680})
  mainWindow.setMenu(null)
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
  mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})