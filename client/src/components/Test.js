import React, { Component } from "react";
import BoNhaCai from "../contracts/BoNhaCai.json";
import SimpleLottery from "../contracts/SimpleLottery.json";
import getWeb3 from "../getWeb3";

class Test extends Component {
  state = {
    storageValue: 0,
    web3: null, accounts: null,
    contract: null, round: null,
    networkId: 0,
    numbToken: null,
  };
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const netId = await web3.eth.net.getId();
      const deployedNetwork = BoNhaCai.networks[netId];
      const instance = new web3.eth.Contract(
        BoNhaCai.abi,
        deployedNetwork && deployedNetwork.address,
      );
      let response = await instance.methods.balanceOf(accounts[0]).call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ storageValue: response, web3, accounts, contract: instance, networkId: netId });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  onBuyToken = (e) => {

    const { web3, accounts, contract, numbToken } = this.state;
    console.log(numbToken);

    // Stores a given value, 5 by default.
    contract.methods.buyToken().send({ from: accounts[0], value: web3.utils.toWei(numbToken, "ether") });

    // Get the value from the contract to prove it worked.
    contract.methods.balanceOf(accounts[0]).call().then((res) => {
      // Update state with the result.
      this.setState({ storageValue: res });
    });
    e.preventDefault();
  };

  onChange = (e) => {
    this.setState({
      numbToken: e.target.value
    })
  }


  onCreateRound = async () => {
    const { web3, accounts, contract , networkId} = this.state;
    const deployedNetwork = SimpleLottery.networks[networkId];
    const instance = new web3.eth.Contract(
      SimpleLottery.abi,
      deployedNetwork && deployedNetwork.address,
    );
    console.log(instance._address);

    await contract.methods.createRound(0, instance._address ,1618479028, 20).send({ from: accounts[0] });
    window.location.reload();
  };

  render() {
    return (
      <div className="App">
        <p>{this.state.accounts}</p>
        <h1>Hello</h1>
        <form onSubmit={this.onBuyToken}>
          <input onChange={this.onChange}></input>
        </form>
        <button onClick={this.onCreateRound}>createRound</button>
        <p>{this.state.storageValue}</p>
      </div>
    );
  }
}

export default Test;
