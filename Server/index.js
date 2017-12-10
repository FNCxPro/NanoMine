const package = require('./package.json')
const winston = require('winston')
const WebSocket = require('ws')
const path = require('path')
const pm2 = require('pm2')

const git = require('simple-git')(path.join(__dirname, '..'))
const child_process = require('child_process')
const spawn = child_process.spawn

const { Event } = require('../Shared')

const wss = new WebSocket.Server({
  port: 6516
})

var state = {
  miner: undefined,
  mining: false
}
wss.broadcast = (event) => {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(event.compress())
  })
}
wss.on('connection', (ws) => {
  winston.info('New connection')
  let hello = new Event('HELLO', {
    server: `${package.name}/${package.version}`,
    version: package.version
  })
  ws.send(hello.compress())
  ws.on('message', (_event) => {
    let event
    try {
      event = new Event(_event)
    } catch(err) {
      return winston.error('Failed to parse WS event', _event)
    }
    if(!event) {
      return winston.error('Failed to parse WS event', _event)
    }

    switch(event.event) {
      case 'UPDATE':
        if(state.mining || state.miner) return // Don't update if mining
        git.pull((err, summary) => {
          if(err) return winston.error('Error while updating', err)
          if(summary.summary.changes > 0) {
            pm2.connect((err) => {
              if(err) return winston.error('Error while connecting to PM2', err)
              child_process.spawnSync('npm install', {
                windowsHide: true
              })
              pm2.restart('NanoMine')
            })
          }
        })
        break
      case 'MINE_START':
        if(state.mining || state.miner) break
        const {algorithm, pool, username, password} = event.payload
        state.miner = spawn('ccminer-x64', ['-a', `${algorithm}`, '-o', `${pool}`, '-u', `${username}`, '-p', `${password}`], {
          cwd: path.join(__dirname, '..', 'Binaries', 'ccminer'),
          windowsHide: true
        })
        state.mining = true
        state.miner.stdout.on('data', (data) => {
          data = Buffer.from(data).toString('ascii')
          console.log('miner:', data)
          wss.broadcast(new Event('miner_stdout', {
            data
          }))
        })
        state.miner.stderr.on('data', (data) => {
          data = Buffer.from(data).toString('ascii')
          console.error('miner:', data)
          wss.broadcast(new Event('miner_stderr', {
            data
          }))
        })
        break
      case 'MINE_STOP':
        if(state.miner || !state.mining) break
        state.miner.kill()
        state.miner = undefined
        state.mining = false
        break
      case 'MINE_KILL':
        if(!state.miner) break
        state.miner.kill()
        state.miner = undefined
        state.mining = false
        break
      case 'STATUS':
        ws.send(new Event('status', {
          mining: state.mining
        }).compress())
        break
      default:
        winston.warn('Unknown event sent by a client. Is your server out-of-date?')
        break
    }
  })
})

winston.info('Started websocket server on port 6516')