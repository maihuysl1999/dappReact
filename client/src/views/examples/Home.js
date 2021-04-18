/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Round from "../../components/Round.js"
import React, { Component } from "react";
import BoNhaCai from "../../contracts/BoNhaCai.json";
import getWeb3 from "../../getWeb3";
import SimpleDateTime  from 'react-simple-timestamp-to-date';
// nodejs library that concatenates classes

// reactstrap components
import {
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import CardsFooter from "components/Footers/CardsFooter.js";

// index page sections
import Download from "../IndexSections/Download.js";

class Landing extends React.Component {

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
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }
  render() {
    return (
      <>
        <DemoNavbar />
        <main ref="main">
          <div className="position-relative">
            {/* shape Hero */}
            <section className="section section-lg section-shaped pb-250">
              <div className="shape shape-style-1 shape-default">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              
              {/* SVG separator */}
              <div className="separator separator-bottom separator-skew">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    className="fill-white"
                    points="2560 0 2560 100 0 100"
                  />
                </svg>
              </div>
            </section>
            {/* 1st Hero Variation */}
          </div>
          <section className="section section-lg pt-lg-0 mt--200">
            <Container>
              <Row className="justify-content-center">
                <Col lg="12">
                  <Row className="row-grid flex">
                    {this.state.ListRound.map((item, index)=>{
                      return(<Round roundInfo={item} index={index}></Round>)
                    })}
                  </Row>
                </Col>
              </Row>
            </Container>
          </section>
          <Download />
        </main>
        <CardsFooter />
      </>
    );
  }
}

export default Landing;
