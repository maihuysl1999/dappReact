import React, { useRef } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import RouletteWheel from "./views/RouleteWheel";

import Test from "./components/Test";
import BettingPanel from "./views/BettingPanel/BettingPanel";
import ListRound from "./components/ListRound";

function App() {
  // state = { storageValue: 0, web3: null, accounts: null, contract: null };

  // componentDidMount = async () => {
  //   try {
  //     // Get network provider and web3 instance.
  //     const web3 = await getWeb3();

  //     // Use web3 to get the user's accounts.
  //     const accounts = await web3.eth.getAccounts();

  //     // Get the contract instance.
  //     const networkId = await web3.eth.net.getId();
  //     // const deployedNetwork = SimpleStorageContract.networks[networkId];
  //     // const instance = new web3.eth.Contract(
  //     //   SimpleStorageContract.abi,
  //     //   deployedNetwork && deployedNetwork.address,
  //     // );

  //     // Set web3, accounts, and contract to the state, and then proceed with an
  //     // example of interacting with the contract's methods.
  //     this.setState({ web3, accounts});
  //   } catch (error) {
  //     // Catch any errors for any of the above operations.
  //     alert(
  //       `Failed to load web3, accounts, or contract. Check console for details.`,
  //     );
  //     console.error(error);
  //   }
  // };

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

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
}

export default App;
