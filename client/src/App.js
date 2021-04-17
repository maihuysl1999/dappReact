import React, { useRef } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import RouletteWheel from "./components/RouleteWheel";

import Test from "./components/Test";
import BettingPanel from "./components/BettingPanel/BettingPanel";
import ListRound from "./components/ListRound";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Link
} from "react-router-dom";

function App() {

  const spin = () => {
    childRef.current.handleSpinClick();
  };

  const childRef = useRef();

  return ( <Router>
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RouletteWheel ref={childRef} />
        <BettingPanel spin={spin} />
      </div>
      <Switch>
          <Route exact path="/SimpleLottery">
            <Test />
          </Route>
        </Switch>
    </div>
    </Router>  
  );
}

export default App;
