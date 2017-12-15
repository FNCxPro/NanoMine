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
  typography: {
    width: '100%'
  }
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
    let settings = JSON.parse(localStorage.getItem('settings'))
    this.state = {
      expanded: null,
      serverIp: settings.server.ip || undefined,
      serverPort: settings.server.port || undefined,
      poolIp: settings.pool.ip || undefined,
      poolUser: settings.pool.username || undefined,
      poolPass: settings.pool.password || undefined,
      poolAlgo: settings.pool.algorithm || undefined,
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
    this.setState({
      [name]: event.target.value
    })
  }
  saveSettings() {
    let settings = this.state.settings
    settings.miner = settings.miner || {}
    settings.server.ip = this.state.serverIp || settings.server.ip
    settings.server.port = parseInt(this.state.serverPort) || settings.server.port

    settings.pool.ip = this.state.poolIp || settings.pool.ip
    settings.pool.username = this.state.poolUser || settings.pool.username
    settings.pool.password = this.state.poolPass || settings.pool.password
    settings.pool.algorithm = this.state.poolAlgo || settings.pool.algorithm

    localStorage.setItem('settings', JSON.stringify(settings))
    this.setState({
      serverIp: settings.server.ip || undefined,
      serverPort: settings.server.port || undefined,
      poolIp: settings.pool.ip || undefined,
      poolUser: settings.pool.username || undefined,
      poolPass: settings.pool.password || undefined,
      poolAlgo: settings.pool.algorithm || undefined,
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
            <Typography className={classes.typography}>
              <TextField label="Server IP" fullWidth margin="normal" value={this.state.serverIp} onChange={this.handleTextChange('serverIp')}/><br/>
              <TextField label="Server Port" fullWidth margin="normal" value={this.state.serverPort ? this.state.serverPort.toString() : undefined} onChange={this.handleTextChange('serverPort')}/>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'pool'} onChange={this.handleChange('pool')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Pool Settings</Typography>
            <Typography className={classes.secondaryHeading}>Change the pool settings</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography className={classes.typography}>
              <TextField label="Pool IP" fullWidth helperText="For ccminer it begins with stratum+tcp://, EWBF miner you just put the ip and the port like pool.example.com:6666" margin="normal" value={this.state.poolIp} onChange={this.handleTextChange('poolIp')}/><br/>
              <TextField label="Worker Username" fullWidth margin="normal" value={this.state.poolUser} onChange={this.handleTextChange('poolUser')}/><br/>
              <TextField label="Worker Password" fullWidth margin="normal" value={this.state.poolPass} onChange={this.handleTextChange('poolPass')}/><br/>
              <TextField label="Worker Algorithm" fullWidth margin="normal" value={this.state.poolAlgo} onChange={this.handleTextChange('poolAlgo')}/>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'miner'} onChange={this.handleChange('miner')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Miner Settings</Typography>
            <Typography className={classes.secondaryHeading}>
              Change mining software
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Miner settings coming soon.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel><br/>
        <Button onClick={this.saveSettings} color="accent">Save Settings</Button>
      </div>
    )
  }
}

export default withStyles(styles)(Settings)