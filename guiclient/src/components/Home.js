import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import {Link} from 'react-router-dom'
import Typography from 'material-ui/Typography'

import {withStyles} from 'material-ui/styles'

import Header from './Header'


const styles = theme => ({
  content: {},
  link: {
    textDecoration: 'none'
  }
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
    /**
     * First-Time Install Experience
     */
    let _setup = <div>
      Please setup your settings before continuing.<br/>
      <Link className={classes.link} to="/settings">Go to settings</Link>
    </div>
    let setup
    if(!localStorage.getItem('settings')) setup = _setup
    if(localStorage.getItem('settings')) {
      try {
        let settings = JSON.parse(localStorage.getItem('settings'))
        if(!settings.pool || !settings.server) setup = _setup
        if((settings.pool && (!settings.pool.algorithm || !settings.pool.ip || !settings.pool.password || !settings.pool.username)) || (settings.server && (!settings.server.ip || !settings.server.port))) setup = _setup
      }catch(err){console.error(err)}
    }
    return (
      <div>
        <DocumentTitle title="NanoMine Client "/>
        <Header title="NanoMine"/>
        <Typography type="body1" className={classes.content}>
          Welcome to NanoMine!<br/>
          {setup}
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Home)