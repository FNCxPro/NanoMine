import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'

import Typography from 'material-ui/Typography'

import {withStyles} from 'material-ui/styles'

import Header from './Header'


const styles = theme => ({
  content: {}
})

class Home extends Component {
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
        <DocumentTitle title="NanoMine Client "/>
        <Header title="NanoMine"/>
        <Typography type="body2">
          {this.context.ws.connected}
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Home)