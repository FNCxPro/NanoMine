import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import App from './App'

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
