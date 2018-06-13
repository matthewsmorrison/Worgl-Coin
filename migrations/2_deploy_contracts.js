var WorglCoin = artifacts.require("./WorglCoin.sol");

tokenValue = 1000;
tokenBalance = 1000;
module.exports = function(deployer) {
  deployer.deploy(WorglCoin, tokenValue, tokenBalance);
};
