import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import {Link} from 'react-router-dom'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import {withStyles} from 'material-ui/styles'

import Header from './Header'


const styles = theme => ({
  content: {},
  link: {
    textDecoration: 'none'
  }
})

class ErrorBoundary extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      hasError: false
    }
    this.resetSettings = this.resetSettings.bind(this)
  }
  static propTypes = {
    classes: PropTypes.object.isRequired
  }
  static contextTypes = {
    ws: PropTypes.object.isRequired
  }
  componentDidCatch(error, info) {
    localStorage.setItem('lastError', {
      error: error,
      errStack: error.stack || undefined,
      info: info
    })
    this.setState({
      hasError: true
    })
  }
  resetSettings() {
    let settings = localStorage.getItem('settings')
    if(typeof settings !== 'undefined') {
      localStorage.setItem('old-settings', settings)
    }
    localStorage.removeItem('settings')
  }
  render() {
    const {classes} = this.props
    if(this.state.hasError) {
      return (
        <div>
          <DocumentTitle title="NanoMine Client - Error"/>
          <Header title="NanoMine" subtitle="Error"/>
          <Typography type="body1" className={classes.content}>
            An error occurred in the app. If you receive this error again open an issue on the GitHub page.<br/>
            Your settings may be the cause of your error. To reset your settings press the button below and restart the app<br/>
            <Button color="primary" onClick={this.resetSettings}>Reset Settings</Button>
            <Link to="/" className={classes.link}><Button color="primary">Go home</Button></Link>
          </Typography>
        </div>
      )
    }
    return this.props.children
  }
}

export default withStyles(styles)(ErrorBoundary)