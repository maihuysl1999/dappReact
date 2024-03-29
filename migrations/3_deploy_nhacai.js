var web3 = require("web3");
const BoNhaCai = artifacts.require("./BoNhaCai.sol");
const SimpleLottery = artifacts.require("./SimpleLottery.sol");
const Roulette = artifacts.require("./Roulette.sol");

module.exports = function (deployer) {
  deployer.deploy(BoNhaCai, web3.utils.toWei("0.01", "ether")).then(function(){
    return deployer.deploy(SimpleLottery, BoNhaCai.address)
    .then(function(){
      return deployer.deploy(Roulette, BoNhaCai.address);
    })
  });
};