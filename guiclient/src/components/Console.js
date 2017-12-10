import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'

import Typography from 'material-ui/Typography'

import {withStyles} from 'material-ui/styles'

import Header from './Header'


const styles = theme => ({
  content: {}
})

class Console extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      buffer: ''
    }
    this.context.ws.on('miner_stdout', (_, payload, event) => {
      this.setState({
        buffer: this.state.buffer+'\n'+payload.data
      })
    })
    this.context.ws.on('miner_stderr', (_, payload, event) => {
      this.setState({
        buffer: this.state.buffer+'\n'+payload.data
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
        <Typography type="body2">
          {this.state.buffer}
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Console)