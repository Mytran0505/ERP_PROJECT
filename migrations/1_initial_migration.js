var Migrations = artifacts.require("./Migrations.sol");
var ProductManagement = artifacts.require("./ProductManagement.sol");
var PorkOwnership = artifacts.require("./PorkOwnership.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(ProductManagement)
  .then(function(){
    return deployer.deploy(PorkOwnership, ProductManagement.address);
  })
};
