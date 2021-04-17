import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "./assets/scss/argon-design-system-react.scss";

import App from './App';
import Index from "./views/Index.js";
import Home from "./views/examples/Home.js";
import RouletteHome from "./views/examples/RouletteHome.js"
import LoterryHome from "./views/examples/LotteryHome.js"

import * as serviceWorker from './serviceWorker';



ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={props => <Index {...props} />} />
      <Route path="/app" exact render={props => <App></App>}/>
      <Route
        path="/home"
        exact
        render={props => <Home {...props} />}
      />
      <Route path="/roulette" exact render={props => <RouletteHome {...props} />} />
      <Route
        path="/lottery"
        exact
        render={props => <LoterryHome {...props} />}
      />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();