import React, {Component} from 'react'
import {Link, Switch, Route} from 'react-router-dom'


import {withStyles} from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Drawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import Tooltip from 'material-ui/Tooltip'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'

import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List'

import MenuIcon from 'material-ui-icons/Menu'
import HomeIcon from 'material-ui-icons/Home'
import StorageIcon from 'material-ui-icons/Storage'

import SettingsIcon from 'material-ui-icons/Settings'
import DesktopIcon from 'material-ui-icons/DesktopWindows'

import Home from './components/Home'
import Server from './components/Server'
import Console from './components/Console'
import Settings from './components/Settings'
import {Event, NanoSocket} from './api'

import PropTypes from 'prop-types'

const styles = theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      margin: 0,
      padding: 0
    },
    body: {
      margin: 0,
      padding: 0
    }
  },
  link: {
    textDecoration: 'none',
    color: 'inherit'
  },
  grow: {
    flexGrow: 1
  },
  drawer: {
    width: 'auto'
  },
  container: {
    marginLeft: 25,
    marginRight: 25
  },
  app: {
    margin: 0,
    textAlign: 'center'
  }
})

class App extends Component {
  constructor(props) {
    super(props)

    this.openDrawer = this.openDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.openSettings = this.openSettings.bind(this)
    this.closeSettings = this.closeSettings.bind(this)
    if (!localStorage.getItem('settings')) {
      localStorage.setItem('settings', JSON.stringify({
        server: {
          ip: '127.0.0.1',
          port: 6516
        },
        pool: {},
        auth: {}
      }))
    }
    let settings = JSON.parse(localStorage.getItem('settings'))
    const ws = new NanoSocket({
      ip: settings.server.ip,
      port: settings.server.port
    })
    ws.on('hello', (_, payload, event) => {
      ws.connected = true
      console.info(`Connected to ${payload.server}`)
      ws.send(new Event('update', {}))
    })
    ws.on('miner_stdout', (_, payload, event) => {
      console.log('miner:', payload.data)
    })
    ws.on('miner_stderr', (_, payload, event) => {
      console.error('miner:', payload.data)
    })
    ws.connect()
    this.state = {
      open: false,
      settings: false,
      ws: ws
    }
  }
  static propTypes = {
    classes: PropTypes.object.isRequired
  }
  static childContextTypes = {
    ws: PropTypes.object.isRequired
  }
  getChildContext() {
    return {
      ws: this.state.ws
    }
  }

  openDrawer() {
    this.setState({
      open: true
    })
  }

  closeDrawer() {
    this.setState({
      open: false
    })
  }

  openSettings() {
    this.setState({
      settings: true
    })
  }

  closeSettings() {
    this.setState({
      settings: false
    })
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.app}>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={this.openDrawer} color="contrast" aria-label="Menu">
              <MenuIcon/>
            </IconButton>
            <Typography type="title" color="inherit">
              NanoMine
            </Typography>
            <div className={classes.grow}/>
            <Link to="/settings" className={classes.link}>
              <Tooltip title="Open Settings" enterDelay={300}>
                <IconButton onClick={this.openSettings} color="contrast" aria-label="Settings">
                  <SettingsIcon/>
                </IconButton>
              </Tooltip>
            </Link>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.open} onRequestClose={this.closeDrawer}>
          <div tabIndex={0} role="button" onClick={this.closeDrawer} onKeyDown={this.closeDrawer}>
            <div className={classes.drawer}>
              <List>
                <Link to="/" className={classes.link}>
                  <ListItem button>
                    <ListItemIcon><HomeIcon/></ListItemIcon>
                    <ListItemText primary="Home"/>
                  </ListItem>
                </Link>
                <Link to="/console" className={classes.link}>
                  <ListItem button>
                    <ListItemIcon><DesktopIcon/></ListItemIcon>
                    <ListItemText primary="Console"/>
                  </ListItem>
                </Link>
                <Link to="/server" className={classes.link}>
                  <ListItem button>
                    <ListItemIcon><StorageIcon/></ListItemIcon>
                    <ListItemText primary="Server"/>
                  </ListItem>
                </Link>
                <Link to="/settings" className={classes.link}>
                  <ListItem button>
                    <ListItemIcon><SettingsIcon/></ListItemIcon>
                    <ListItemText primary="Settings"/>
                  </ListItem>
                </Link>
              </List>
            </div>
          </div>
        </Drawer>
        <div className={classes.container}>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/console" component={Console}/>
            <Route path="/server" component={Server}/>
            <Route path="/settings" component={Settings}/>
          </Switch>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(App)
