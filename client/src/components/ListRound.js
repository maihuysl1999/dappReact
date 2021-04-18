import React, { Component } from "react";
import BoNhaCai from "../contracts/BoNhaCai.json";
import getWeb3 from "../getWeb3";
import Table from 'react-bootstrap/Table';
import SimpleDateTime  from 'react-simple-timestamp-to-date';

class ListRound extends Component {
  constructor(props) {
    super(props);

    this.state = {
      props,
      ListRound: [],
    };
  }
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
      console.log(instance._address);
      let response = await instance.methods.balanceOf(accounts[0]).call();
      let lenghtRound = 0;
      await instance.methods.getLengthRounds().call().then((res) => {
        lenghtRound = res;
      });
      for (let i = 0; i < lenghtRound; i++) {
        await instance.methods.getRound(i).call().then((res) => {
          this.state.ListRound.push(res);
        });
      }
      this.setState({ storageValue: response, web3, accounts, contract: instance, networkId: netId });
      await instance.events.NewRound({fromBlock: 'latest' }).on('data', event => console.log(event));
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  render() {
    return (
      // <div>
      //   <h1>List round: </h1>
      //   <div>
      //     <ul>
      //       { 
      //       (this.state.ListRound || []).map(item => (
      //         <li>{item[1]}</li>
      //       ))}
      //     </ul>
      //   </div>
      // </div>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Data</th>
              <th>EndTime</th>
              <th>resultContract</th>
            </tr>
          </thead>
          <tbody>
            {
              (this.state.ListRound || []).map(item => (
                <tr>
                  <td></td>
                  <td>{item[0]}</td>
                  <td><SimpleDateTime dateSeparator="/" timeSeparator=":" format="YMD">{item[1]}</SimpleDateTime></td>
                  <td>{item[2]}</td>
                </tr>
              ))}
          </tbody>

        </Table>

      </div>
    );
  }
}

export default ListRound;
