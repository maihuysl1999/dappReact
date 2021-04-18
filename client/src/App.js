import React, { useRef } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Link
} from "react-router-dom";

import Roulete from "./components/Roulete";
import RouletteWheel from "./views/RouleteWheel";
import Test from "./components/Test";
import BettingPanel from "./views/BettingPanel/BettingPanel";



function App() {

  const spin = () => {
    childRef.current.handleSpinClick();
  };

  const childRef = useRef();

  return (<Router>
    {/* <div className="App">
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
     </div>*/}
      <Switch>
        <Route exact path="/">
          <Roulete />
        </Route>
        <Route exact path="/SimpleLottery">
          <Test />
        </Route>
      </Switch>
  </Router>
  );
}

export default App;
