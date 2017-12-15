const electron = require('electron')
const { BrowserWindow, ipcMain, app } = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')

let mainWindow

require('electron-debug')({
  enabled: true
})

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680})
  mainWindow.setMenu(null)
  //mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : 'https://nanomine.relative.cloud')
  mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})