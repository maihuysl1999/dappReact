import React, { Component } from "react";
import BoNhaCai from "../contracts/BoNhaCai.json";
import BoNhaCai from "../contracts/SimpleLottery.json";
import getWeb3 from "../getWeb3";

class Test extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, round: roundId};
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BoNhaCai.networks[networkId];
      const instance = new web3.eth.Contract(
        BoNhaCai.abi,
        deployedNetwork && deployedNetwork.address,
      );
      let response = await instance.methods.balanceOf(accounts[0]).call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  onBuy = async () => {
    const { web3, accounts, contract } = this.state;

    const instance = new web3.eth.Contract(
      SimpleLottery.abi,
      deployedNetwork && deployedNetwork.address,
    );

    // Stores a given value, 5 by default.
    await contract.methods.buyToken().send({ from: accounts[0], value: web3.utils.toWei("0.01", "ether") });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.balanceOf(accounts[0]).call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  // onBuy = async () => {
  //   const { web3, accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.createRound(0, , ).send({ from: accounts[0]});

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.balanceOf(accounts[0]).call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  render() {
    return (
      <div className="App">
        <p>{this.state.accounts}</p>
        <h1>Hello</h1>
        <button onClick={this.onBuyToken}>Buy Token</button>
        <button onClick={this.onCreateRound}>Buy </button>
        <p>{this.state.storageValue}</p>
      </div>
    );
  }
}

export default Test;
