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
          <Button onClick={this.toggleMining} color="accent">Toggle Mining</Button>
          <Button onClick={this.update} color="accent">Update Server</Button>

          {this.context.ws.connected}
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Server)