import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Typography from 'material-ui/Typography'

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
  render() {
    const {classes} = this.props
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
              Server settings
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
              Pool settings
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
        </ExpansionPanel>
      </div>
    )
  }
}

export default withStyles(styles)(Settings)