import React, { useRef } from "react";
import RouletteWheel from "./RouleteWheel";
import BettingPanel from "./BettingPanel/BettingPanel";
function Roulete() {

    const spin = () => {
      childRef.current.handleSpinClick();
    };
  
    const childRef = useRef();
    return ( 
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
        </div>
    ); 
} export default Roulete;
