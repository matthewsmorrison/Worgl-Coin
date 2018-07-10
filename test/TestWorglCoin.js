import expectThrow from '../helpers/expectThrow';

var WorglCoin = artifacts.require("WorglCoin");
var consumer1;

contract('WorglCoin', function(accounts, app) {

  // Set up roles here
  var owner = accounts[0];
  var newOwner = accounts[9];

  // Consumers
  var consumer1 = accounts[7];
  var consumer2 = accounts[5];

  // Businesses
  var business1 = accounts[8];
  var business2 = accounts[6];

  // Random accounts
  var randomAccount = accounts[2];

  var newBalance;
  var newValue;

  // Run the tests
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

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.changeOwner(randomAccount, {from: randomAccount, value: 0}));
    });
  });

  it("The owner of the contract should be able to change ownership", function() {
    var app;

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
    var name1 = "Tesco";

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.addBusiness(business1, name1, {from: randomAccount, value: 0}));
    });
  });

  it("Only the contract owner should be able to add an eligible consumer", function() {
    var app;
    var hash = "A289ED63F166869EE6487D7A2A4F872A09F70AD346C1FFECDD41833A51E08B60";

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.addConsumerHash(hash, {from: randomAccount, value: 0}));
    });
  });

  it("A consumer that enters the wrong details should not be able to sign up", function() {
    var app;
    var name = "Matthew Morrison";
    var nationalInsurance = "FAKEFAKEFAKE";
    var eligibleHash = "0x2ef30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";
    var enteredHash = "0x2ed56eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addConsumerHash(eligibleHash, {from: owner, value: 0});
    }).then(function() {
      return expectThrow(app.consumerSignUp(enteredHash, {from: consumer1, value: 0}));
    });
  });


  it("A consumer that enters the right details should be able to sign up", function() {
    var app;
    var eligibleHash = "0x2ec30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";
    var enteredHash = "0x2ec30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";

    var eligibleHash1 = "0x2ed30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";
    var enteredHash1 = "0x2ed30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addConsumerHash(eligibleHash, {from: owner, value: 0});
    }).then(function() {
      return app.consumerSignUp(enteredHash, {from: consumer1, value: 0});
    }).then(function() {
      return app.noOfConsumers();
    }).then(function(consumers) {
      assert.equal(consumers.valueOf(), 1, "The number of consumers has not been incremented");
      return app.addConsumerHash(eligibleHash1, {from: owner, value: 0});
    }).then(function() {
      return app.consumerSignUp(enteredHash1, {from: consumer2, value: 0});
    }).then(function() {
      return app.noOfConsumers();
    }).then(function(consumers) {
      assert.equal(consumers.valueOf(), 2, "The number of consumers has not been incremented");
      return app.getAllConsumers();
    }).then(function(allConsumers) {
      assert.equal(allConsumers[0].valueOf(), consumer1, "Consumer 1 has not been added to the list of consumers.");
      assert.equal(allConsumers[1].valueOf(), consumer2, "Consumer 2 has not been added to the list of consumers.");
    });
  });

  it("A consumer should not be able to sign up twice.", function() {
    var app;
    var enteredHash = "0x2ec30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.consumerSignUp(enteredHash, {from: consumer1, value: 0}));
    });
  });

  it("The contract owner should not be able to add a duplicate consumer hash.", function() {
    var app;
    var eligibleHash = "0x2ec30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.addConsumerHash(eligibleHash, {from: owner, value: 0}));
    });
  });


  it("The contract owner should be able to successfully add a Business", function() {
    var app;
    var name1 = "Tesco";
    var name2 = "Morrisons"

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addBusiness(business1, name1, {from: owner, value: 0});
    }).then(function() {
      return app.noOfBusinesses();
    }).then(function(businesses) {
      assert.equal(businesses.valueOf(), 1, "The number of businesses has not been incremented");
      return app.addBusiness(business2, name2, {from: owner, value: 0});
    }).then(function() {
      return app.noOfBusinesses();
    }).then(function(businesses) {
      assert.equal(businesses.valueOf(), 2, "The number of businesses has not been incremented");
      return app.getAllBusinesses();
    }).then(function(allBusinesses) {
      assert.equal(allBusinesses[0].valueOf(), business1, "Business 1 has not been added to the list of businesses.");
      assert.equal(allBusinesses[1].valueOf(), business2, "Business 2 has not been added to the list of businesses.");
    });
  });

  it("A business should not be allowed to sign up twice.", function() {
    var app;
    var name1 = "Tesco";

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.addBusiness(business1, name1, {from: owner, value: 0}));
    });
  });

  it("The contract owner should be able to change the top up balance and value", function() {
    var app;
    newBalance = 2000;
    newValue = 3000000000000000;

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.changeTokenBalance(newBalance, {from: owner, value: 0});
    }).then(function() {
      return app.topUpLevel();
    }).then(function(balance) {
      assert.equal(balance.valueOf(), newBalance, "The token balance has not been changed");
      return app.changeTokenValue(newValue, {from: owner, value: 0});
    }).then(function() {
      return app.tokenValue();
    }).then(function(value) {
      assert.equal(value.valueOf(), newValue, "The token value has not been changed");
    });
  });


  it("Only the contract owner should be able reset everyone's token balance", function() {
    var app;

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.resetTokenBalance({from: owner});
    }).then(function() {
      return app.getTokenBalance(consumer1);
    }).then(function(balance) {
      assert.equal(balance[1].valueOf(), 2000, "The token balance has not been updated");
    });
  });

  it("No other account should be able to add an item for sale.", function() {
    var app;
    var name = "Bread";
    var picture = "Dummy";
    var price = 5;
    var quantity = 30;

    return WorglCoin.deployed().then(function(instance) {
      app=instance;
      return expectThrow(app.sellItem(name, picture, quantity, price, {from: randomAccount}));
    });
  });

  it("A business should be able to add an item for sale if they have no complaint against them.", function() {
    var app;
    var name = "Bread";
    var picture = "Dummy";
    var price = 5;
    var quantity = 30;
    var itemID = 0;

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.sellItem(name, picture, quantity, price, {from: business1});
    }).then(function() {
      return app.noOfItems();
    }).then(function(items) {
      assert.equal(items.valueOf(), 1, "The number of items has not been incremented.");
      return app.getItemDetails(itemID);
    }).then(function(item) {
      assert.equal(item[0].valueOf(), "Bread", "The item name has not been registered properly.");
      assert.equal(item[1].valueOf(), "Dummy", "The item picture not been registered properly.");
      assert.equal(item[2].valueOf(), 30, "The item quantity has not been registered properly.");
      assert.equal(item[3].valueOf(), 5, "The item price has not been registered properly.");
      assert.equal(item[4].valueOf(), accounts[8], "The item supplier has not been registered properly.");
    });
  });

  it("Only a registered consumer should be able to buy an item.", function() {
    var app;
    var itemID = 0;
    var quantity = 3;

    return WorglCoin.deployed().then(function(instance) {
      app=instance;
      return expectThrow(app.buyItem(itemID, quantity, {from: randomAccount}));
    });
  });

  it("A consumer should be able to buy an item if they have enough tokens.", function() {
    var app;
    var itemID = 0;
    var quantity = 3;
    var orderID = 0;
    var originalQuantity = 30;
    var price = 5;
    var originalBalance = 2000;

    return WorglCoin.deployed().then(function(instance) {
      app=instance;
      return app.buyItem(itemID, quantity, {from: consumer1});
    }).then(function() {
      return app.noOfOrders();
    }).then(function(orders) {
      assert.equal(orders.valueOf(), 1, "The number of orders has not been incremented.");
      return app.getOrderDetails(orderID);
    }).then(function(order) {
      assert.equal(order[0].valueOf(), orderID, "The order ID has not been registered properly.");
      assert.equal(order[1].valueOf(), consumer1, "The consumer address has not been registered properly.");
      assert.equal(order[2].valueOf(), quantity, "The order quantity has not been registered properly.");
      assert.equal(order[3].valueOf(), false, "The order has been incorrectly marked as sent.");
      return app.getItemDetails(itemID);
    }).then(function(item) {
      assert.equal(item[2].valueOf(), originalQuantity-quantity, "The item quantity has not been correctly decremented.");
      return app.getTokenBalance(consumer1);
    }).then(function(consumerBalance) {
      assert.equal(consumerBalance[1].valueOf(), originalBalance - (quantity*price), "The consumer token balance has not been correctly decremented.");
      return app.getAllOrders(business1);
    }).then(function(allOrders) {
      assert.equal(allOrders[0].valueOf(), 0, "The order has not been added to the business structure.");
      return app.getAllOrders(consumer1);
    }).then(function(allOrders) {
      assert.equal(allOrders[0].valueOf(), 0, "The order has not been added to the consumer structure.");
    });
  });

  it("A consumer should not be able to buy an item if they do not have enough tokens.", function() {
    var app;
    var name = "Lamborghini";
    var picture = "Dummy";
    var price = 80000;
    var quantity = 1;
    var itemID = 1;

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.sellItem(name, picture, quantity, price, {from: business1});
    }).then(function() {
      return app.noOfItems();
    }).then(function(items) {
      assert.equal(items.valueOf(), 2, "The number of items has not been incremented.");
      return expectThrow(app.buyItem(itemID, quantity, {from: consumer1}));
    });
  });

  it("A random business should not be able to mark an order that isn't theirs as sent.", function() {
    var app;
    var orderID = 0;

    return WorglCoin.deployed().then(function(instance) {
      app=instance;
      return expectThrow(app.markOrderAsSent(orderID, {from: business2}));
    });
  });

  it("A consumer should not be able to make a complaint about an order if it hasn't been marked as sent.", function() {
    var app;
    var orderID = 0;

    return WorglCoin.deployed().then(function(instance) {
      app=instance;
      return expectThrow(app.makeComplaint(orderID, {from: consumer1}));
    });
  });

  it("A consumer should not be able to make a complaint about an order if it isn't their order.", function() {
    var app;
    var orderID = 0;

    return WorglCoin.deployed().then(function(instance) {
      app=instance;
      return expectThrow(app.makeComplaint(orderID, {from: consumer2}));
    });
  });

  it("A business should be able to mark an order as sent.", function() {
    var app;
    var orderID = 0;
    var quantity = 3;
    var price = 5;

    return WorglCoin.deployed().then(function(instance) {
      app=instance;
      return app.markOrderAsSent(orderID, {from: business1});
    }).then(function() {
      return app.getOrderDetails(orderID);
    }).then(function(order) {
      assert.equal(order[3].valueOf(), true, "The order has not been marked as sent.");
      return app.getBusinessDetails(business1);
    }).then(function(business) {
      assert.equal(business[0].valueOf(), price*quantity, "The business did not receive the right amount of tokens.");
    });
  });

  it("A consumer should be able to make a complaint about an order if it has been mark as sent.", function() {
    var app;
    var orderID = 0;

    return WorglCoin.deployed().then(function(instance) {
      app=instance;
      return app.makeComplaint(orderID, {from: consumer1});
    }).then(function() {
      return app.getBusinessDetails(business1);
    }).then(function(business) {
      assert.equal(business[2].valueOf(), true, "A complaint against the business has not been registered.");
      assert.equal(business[3].valueOf(), 1, "The number of complaints against the business has not been incremented properly.");
    });
  });

  it("A business with a complaint against it should not be able to put another item up for sale.", function() {
    var app;
    var name = "Bread";
    var picture = "Dummy";
    var price = 5;
    var quantity = 30;
    var itemID = 0;

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.sellItem(name, picture, quantity, price, {from: business1}));
    });
  });

  it("A random consumer should not be able to withdraw their complaint about another order.", function() {
    var app;
    var orderID = 0;

    return WorglCoin.deployed().then(function(instance) {
    app = instance;
    return expectThrow(app.resetComplaint(orderID, {from: consumer2}));
    });
  });

  it("The right consumer should be able to withdraw their complaint about a business.", function() {
    var app;
    var orderID = 0;

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.resetComplaint(orderID, {from: consumer1});
    }).then(function() {
      return app.getBusinessDetails(business1);
    }).then(function(business) {
      assert.equal(business[2].valueOf(), false, "The business still has a complaint against it.");
      assert.equal(business[3].valueOf(), 0, "The number of complaints against the business has not been decremented properly.");
    });
  });

  it("The owner of the contract should be able to fund the contract.", function() {
    // http://ethdocs.org/en/latest/ether.html
    // http://br549.mywebcommunity.org/ETHconvert/
    var app;
    var originalTokens;
    var amount = 1;
    var weiToEth = 1000000000000000000;

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      app.topUpContract({from:owner, value: amount * weiToEth});
      return app.balance();
    }).then(function(balance) {
      assert.equal(balance.valueOf(),amount * weiToEth,"The contract has not been funded with the right amount.");
    });
  });

  it("A business should receive the right amount of funds after a new distribution of tokens from the owner.", function() {
    var app;
    var originalBusinessBalance = web3.eth.getBalance(business1).toNumber();
    var noTokens = 15;
    var weiReceived = noTokens * newValue;
    var newBusinessBalance;

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.resetTokenBalance({from: owner});
    }).then(function() {
      return app.getTokenBalance(consumer1);
    }).then(function(balance) {
      assert.equal(balance[1].valueOf(), 2000, "The token balance has not been updated");
    }).then(function() {
      return app.getBusinessDetails(business1);
    }).then(function(business) {
      newBusinessBalance = web3.eth.getBalance(business1).toNumber();
      assert.equal(business[0].valueOf(), 0, "The business did not have its token decremented to 0.");
      assert.equal(newBusinessBalance, originalBusinessBalance + weiReceived, "The business did not receive the right payment.");
    });
  });
});
