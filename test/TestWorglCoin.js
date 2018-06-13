import expectThrow from '../helpers/expectThrow';

var WorglCoin = artifacts.require("WorglCoin");

contract('WorglCoin', function(accounts, app) {

  it("The starting number of consumers should be 0", function() {
    return WorglCoin.deployed().then(function(instance) {
      return instance.noOfConsumers();
    }).then(function(consumers) {
      assert.equal(consumers.valueOf(), 0, "The starting number of consumers is not 0");
    });
  });

  it("The starting number of businesses should be 0", function() {
    return WorglCoin.deployed().then(function(instance) {
      return instance.noOfBusinesses();
    }).then(function(businesses) {
      assert.equal(businesses.valueOf(), 0, "The starting number of businesses is not 0");
    });
  });

  it("Nobody apart from the contract owner should be able to change ownership", function() {
    var app;
    var owner = accounts[0];
    var random = accounts[6];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.changeOwner(random, {from: random, value: 0}));
    });
  });

  it("The owner of the contract should be able to change ownership", function() {
    var app;
    var owner = accounts[0];
    var newOwner = accounts[9];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.changeOwner(newOwner, {from: owner, value: 0});
    }).then(function() {
      return app.master();
    }).then(function(master) {
      assert.equal(master, newOwner, "The ownership has not changed");
      return app.changeOwner(owner, {from: newOwner, value: 0});
    }).then(function() {
      return app.master();
    }).then(function(master) {
      assert.equal(master, owner, "The ownership has not changed back to the original owner");
    });
  });

  it("Only the contract owner should be able to add a Business", function() {
    var app;
    var owner = accounts[0];
    var random = accounts[1];
    var business = accounts[8];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.addBusiness(business, {from: random, value: 0}));
    });
  });

  it("Only the contract owner should be able to add an eligible consumer", function() {
    var app;
    var owner = accounts[0];
    var random = accounts[1];
    var hash = "A289ED63F166869EE6487D7A2A4F872A09F70AD346C1FFECDD41833A51E08B60";

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.addConsumerHash(hash, {from: random, value: 0}));
    });
  });

  it("A consumer that enters the wrong details should not be able to sign up", function() {
    var app;
    var consumer = accounts[7];
    var name = "Matthew Morrison";
    var nationalInsurance = "FAKEFAKEFAKE";
    var owner = accounts[0];
    var eligibleHash = "0x2ef30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";
    var enteredHash = "0x2ed56eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addConsumerHash(eligibleHash, {from: owner, value: 0});
    }).then(function() {
      return expectThrow(app.consumerSignUp(enteredHash, {from: consumer, value: 0}));
    });
  });

  it("A consumer that enters the right details should be able to sign up", function() {
    var app;
    var consumer = accounts[7];
    var owner = accounts[0];
    var eligibleHash = "0x2ec30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";
    var enteredHash = "0x2ec30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addConsumerHash(eligibleHash, {from: owner, value: 0});
    }).then(function() {
      return app.consumerSignUp(enteredHash, {from: consumer, value: 0});
    }).then(function() {
      return app.noOfConsumers();
    }).then(function(consumers) {
      assert.equal(consumers.valueOf(), 1, "The number of consumers has not been incremented");
    });
  });

  it("The contract owner should be able to successfully add a Business", function() {
    var app;
    var owner = accounts[0];
    var business = accounts[8];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addBusiness(business, {from: owner, value: 0});
    }).then(function() {
      return app.noOfBusinesses();
    }).then(function(businesses) {
      assert.equal(businesses.valueOf(), 1, "The number of businesses has not been incremented");
    });
  });

  it("The contract owner should be able to change the top up balance", function() {
    var app;
    var owner = accounts[0];
    var newBalance = 2000;

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.changeTokenBalance(newBalance, {from: owner, value: 0});
    }).then(function() {
      return app.topUpLevel();
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 2000, "The token balance has not been changed");
    });
  });


  it("Only the contract owner should be able reset everyone's token balance", function() {
    var app;
    var owner = accounts[0];
    var consumer = accounts[7];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.resetTokenBalance({from: owner});
    }).then(function() {
      return app.getTokenBalance(accounts[7]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 2000, "The token balance has not been updated");
    });
  });


  // Need to test buyItem, sellItem, markOrderAsSent, makeComplaint
  // Need to test that businesses get paid the right amount after a consumer buys an item
  // Need to pass through an IPFS pointer to an image for an item
  // When sending an item how does the business know where to send it to?



});
