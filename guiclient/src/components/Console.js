import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import Typography from 'material-ui/Typography'
import {withStyles} from 'material-ui/styles'

import Header from './Header'

const ansi2html = require('ansi2html')

const styles = theme => ({
  content: {}
})

class Console extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      buffer: []
    }
    this.context.ws.on('miner_stdout', (_, payload, event) => {
      console.log(payload.data)
      let buffer = this.state.buffer
      buffer.push(ansi2html(payload.data))
      this.setState({
        buffer: buffer
      })
    })
    this.context.ws.on('miner_stderr', (_, payload, event) => {
      let buffer = this.state.buffer
      buffer.push(ansi2html(payload.data))
      this.setState({
        buffer: buffer
      })
    })
  }
  static propTypes = {
    classes: PropTypes.object.isRequired
  }
  static contextTypes = {
    ws: PropTypes.object.isRequired
  }
  render() {
    const {classes} = this.props
    return (
      <div className={classes.content}>
        <DocumentTitle title="NanoMine Client"/>
        <Header title="NanoMine" subtitle="Console"/>
        {this.state.buffer.map(item => <span>{item}</span>)}
      </div>
    )
  }
}

export default withStyles(styles)(Console)