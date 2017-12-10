import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'

import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

import {withStyles} from 'material-ui/styles'

import {Event} from '../api'

import Header from './Header'

const styles = theme => ({
  content: {}
})

class Server extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      mining: false
    }
    this.toggleMining = this.toggleMining.bind(this)
    this.update = this.update.bind(this)
  }
  static propTypes = {
    classes: PropTypes.object.isRequired
  }
  static contextTypes = {
    ws: PropTypes.object.isRequired
  }
  toggleMining() {
    if(!this.state.mining) {
      if(!localStorage.getItem('settings')) return
      const settings = JSON.parse(localStorage.getItem('settings'))
      this.context.ws.send(new Event('MINE_START', {
        pool: settings.pool.ip,
        username: settings.pool.username,
        password: settings.pool.password,
        algorithm: settings.pool.algorithm
      }))
      this.setState({
        mining: true
      })
    } else {
      this.context.ws.send(new Event('MINE_STOP', {}))
      this.setState({
        mining: false
      })
    }
  }
  update() {
    this.context.ws.send(new Event('update', {}))
  }
  render() {
    const {classes} = this.props
    const ws = this.context.ws
    return (
      <div className={classes.content}>
        <DocumentTitle title="NanoMine Client"/>
        <Header title="NanoMine" subtitle="Server"/>
        <Typography type="body2">
          Mining: {this.state.mining.toString()}<br/>
          <Button onClick={this.toggleMining} color="accent">Toggle Mining</Button>
          <Button onClick={this.update} color="accent">Update Server</Button>

          {this.context.ws.connected}
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Server)