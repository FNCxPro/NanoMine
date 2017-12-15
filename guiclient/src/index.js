import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import Raven from 'raven-js'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import deepPurple from 'material-ui/colors/deepPurple'

import { BrowserRouter } from 'react-router-dom'

import './index.css'
import 'typeface-roboto'

const theme = createMuiTheme({
  palette: {
    primary: deepPurple,
    type: 'dark'
  }
})

Raven.config('https://b0892769c5f54289a6eeae31ceeea946@sentry.io/259682').install()

class Main extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <App/>
        </MuiThemeProvider>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<Main/>, document.getElementById('root'));
