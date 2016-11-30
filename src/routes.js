import React from 'react'
import {browserHistory, Router, Route, Redirect} from 'react-router'

class Home extends React.Component {
  render() {
    return (
      <div>Hello world</div>
    )
  }
}

export const makeRoutes = () => (
  <Router>
    <Route path="/" component={Home} />
    <Redirect from="*" to="/" />
  </Router>
)

export default makeRoutes
