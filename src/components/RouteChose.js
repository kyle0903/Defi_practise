import React, { Component } from 'react'
import App from './App'
import { BrowserRouter as Router,Route} from 'react-router-dom';


class RouteChose extends Component {

  render() {
    return (
      <Router >
        <div>
          <Route exact path="/" component={App} />
        </div>
        </Router>
    );
  }
}

export default RouteChose;
/**/