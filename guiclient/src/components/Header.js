import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import {withStyles} from 'material-ui/styles'

const styles = theme => ({
  header: {
    paddingBottom: 10
  },
  divider: {
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 45,
    marginRight: 45
  }
})

class Header extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([])])
  }

  render() {
    const {classes} = this.props
    let sub = undefined
    if(this.props.subtitle) {
      sub = <Typography type="headline">{this.props.subtitle}</Typography>
    }
    return (
      <div className={classes.header}>
        <Typography type="display3">
          {this.props.title}
        </Typography>
        {sub}
        <Divider className={classes.divider}/>
      </div>
    )
  }
}

export default withStyles(styles)(Header)