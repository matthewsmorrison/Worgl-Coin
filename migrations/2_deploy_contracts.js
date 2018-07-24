var WorglCoin = artifacts.require("./WorglCoin.sol");
var Verifier = artifacts.require("./Verifier.sol");

tokenValue = 1000;
tokenBalance = 1000;
module.exports = function(deployer) {
  deployer.deploy(WorglCoin, tokenValue, tokenBalance);
  deployer.deploy(Verifier);
};
