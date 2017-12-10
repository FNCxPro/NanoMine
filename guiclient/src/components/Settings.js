import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'

import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'

import ExpandMoreIcon from 'material-ui-icons/ExpandMore'

import {withStyles} from 'material-ui/styles'

import Header from './Header'

const styles = theme => ({
  content: {},
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
})

class Settings extends Component {
  constructor(...args) {
    super(...args)
    if (!localStorage.getItem('settings')) {
      localStorage.setItem('settings', JSON.stringify({
        server: {},
        pool: {},
        auth: {}
      }))
    }
    this.state = {
      expanded: null,
      settings: JSON.parse(localStorage.getItem('settings'))
    }

    this.saveSettings = this.saveSettings.bind(this)
  }
  state = {
    expanded: null
  }
  static propTypes = {
    classes: PropTypes.object.isRequired
  }
  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    })
  }
  handleTextChange = name => (event) => {
    console.log(event.target.value)
    if(event.target.value.length < 1) return
    this.setState({
      [name]: event.target.value
    })
  }
  saveSettings() {
    let settings = this.state.settings
    settings.server.ip = this.state.serverIp || settings.server.ip
    settings.server.port = parseInt(this.state.serverPort) || settings.server.port

    settings.pool.ip = this.state.poolIp || settings.pool.ip
    settings.pool.username = this.state.poolUser || settings.pool.username
    settings.pool.password = this.state.poolPass || settings.pool.password
    settings.pool.algorithm = this.state.poolAlgo || settings.pool.algorithm


    localStorage.setItem('settings', JSON.stringify(settings))
    this.setState({
      settings: settings
    })
  }

  render() {
    const { classes } = this.props
    const { expanded } = this.state
    return (
      <div className={classes.content}>
        <DocumentTitle title="NanoMine Client "/>
        <Header title="NanoMine" subtitle="Settings"/>
        <ExpansionPanel expanded={expanded === 'server'} onChange={this.handleChange('server')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Server Settings</Typography>
            <Typography className={classes.secondaryHeading}>Change the server IP and port</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <TextField label="Server IP" margin="normal" value={this.state.settings.server.ip} onChange={this.handleTextChange('serverIp')}/><br/>
              <TextField label="Server Port" margin="normal" value={this.state.settings.server.port ? this.state.settings.server.port.toString() : undefined} onChange={this.handleTextChange('serverPort')}/>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'pool'} onChange={this.handleChange('pool')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Pool Settings</Typography>
            <Typography className={classes.secondaryHeading}>Change the pool settings</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <TextField label="Pool IP" helperText="Begins with stratum://" margin="normal" value={this.state.settings.pool.ip} onChange={this.handleTextChange('poolIp')}/><br/>
              <TextField label="Worker Username" margin="normal" value={this.state.settings.pool.username} onChange={this.handleTextChange('poolUser')}/><br/>
              <TextField label="Worker Password" margin="normal" value={this.state.settings.pool.password} onChange={this.handleTextChange('poolPass')}/><br/>
              <TextField label="Worker Algorithm" margin="normal" value={this.state.settings.pool.algorithm} onChange={this.handleTextChange('poolAlgo')}/>

            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'auth'} onChange={this.handleChange('auth')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Auth Settings</Typography>
            <Typography className={classes.secondaryHeading}>
              Change server username and password
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Auth settings
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel><br/>
        <Button onClick={this.saveSettings} color="accent">Save Settings</Button>
      </div>
    )
  }
}

export default withStyles(styles)(Settings)