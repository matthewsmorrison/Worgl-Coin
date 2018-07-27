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
    var A = ["0xbc48bed6b63e82175e9e3cf017f26d5f71a2f36165f3580d02514e3f2f22ae9", "0x30587068f5a1f61193afccf71f265e277de27e0651204b325b6625c2a51bd77e"];
    var A_p = ["0x2437272ec7e61998347ed609e003d1bb9c069903c211776a6d0fc8db65906b82", "0x8df6216b168a62a4507df93468cf0e58b5221919ef86642541ddbf54c15e589"];
    var B = [["0x8d7ce8d510b51d0a25752103da900a7f3ab7ddfa2f73e2ba682a9139c25d1f7", "0x208deb2a232d751e5e0cac266ee43d55ff9c219a0b60cd1c61971cde841a705e"], ["0x623ac694f3992eaaf7953c7827ceb6ba4da4075789b3679b74f9abe0aea444", "0xf505cf3d2fa6c24b218ef86254f83fb450f1b63f9c93373e865f04d8c5b936e"]];
    var B_p = ["0x19de1bdf2362573a606e72331c954183c9b98f8664d093682b73ab5fbe6d93a8", "0x35a943ce82ab2db74de5f6c68375de4029c0def09dae9245db7a18641b63125"];
    var C = ["0x12bfe3da774a0dde4238ec240c136af4d0f089e5e769ba486255104a03c2e94b", "0x1e3418e825cb53d2eeef37fa587abf9bdfcc6415361f1f6a15731effcf9b2f58"];
    var C_p = ["0x2c5f8013378ff540b33ae444d77dd17a407762f8940c05bb692ae13bdd5cec8f", "0x1a4fd227107bba27f57bbaa9e2338d990fd80dc6bb8a8dbc1bd69479cc737df3"];
    var H = ["0x26c0d5e8b23bd7730636067406c59342081ca73cc6f2d2fb2acd6d676be80f1e", "0x419e311996e1c6d0aba5eba8d41357a64c92091873185a5e65bfad0186330f3"];
    var K = ["0x539752f747c989c355aecf876d0f5aeae88796b9eed8709d4c212248be089ca", "0xa0a88a63c312f8dc82741c24885e6527a9f4e090d06c823151ebd7e9cea40cc"];
    var I = [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addConsumerHash(eligibleHash, {from: owner, value: 0});
    }).then(function() {
      return expectThrow(app.consumerSignUp(enteredHash, A, A_p, B, B_p, C, C_p, H, K, I, {from: consumer1, value: 0}));
    });
  });

  it("A consumer that does not have the right zero knowledge proof cannot sign up (pairing mistake)", function() {
    var app;
    var eligibleHash = "0x2ef30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f696";
    var enteredHash = "0x2ef30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f696";
    var A = ["0xbc58bed6b63e82175e9e3cf017f26d5f71a2f36165f3580d02514e3f2f22ae9", "0x30587068f5a1f61193afccf71f265e277de27e0651204b325b6625c2a51bd77e"];
    var A_p = ["0x2437272ec7e61998347ed609e003d1bb9c069903c211776a6d0fc8db65906b82", "0x8df6216b168a62a4507df93468cf0e58b5221919ef86642541ddbf54c15e589"];
    var B = [["0x8d7ce8d510b51d0a25752103da900a7f3ab7ddfa2f73e2ba682a9139c25d1f7", "0x208deb2a232d751e5e0cac266ee43d55ff9c219a0b60cd1c61971cde841a705e"], ["0x623ac694f3992eaaf7953c7827ceb6ba4da4075789b3679b74f9abe0aea444", "0xf505cf3d2fa6c24b218ef86254f83fb450f1b63f9c93373e865f04d8c5b936e"]];
    var B_p = ["0x19de1bdf2362573a606e72331c954183c9b98f8664d093682b73ab5fbe6d93a8", "0x35a943ce82ab2db74de5f6c68375de4029c0def09dae9245db7a18641b63125"];
    var C = ["0x12bfe3da774a0dde4238ec240c136af4d0f089e5e769ba486255104a03c2e94b", "0x1e3418e825cb53d2eeef37fa587abf9bdfcc6415361f1f6a15731effcf9b2f58"];
    var C_p = ["0x2c5f8013378ff540b33ae444d77dd17a407762f8940c05bb692ae13bdd5cec8f", "0x1a4fd227107bba27f57bbaa9e2338d990fd80dc6bb8a8dbc1bd69479cc737df3"];
    var H = ["0x26c0d5e8b23bd7730636067406c59342081ca73cc6f2d2fb2acd6d676be80f1e", "0x419e311996e1c6d0aba5eba8d41357a64c92091873185a5e65bfad0186330f3"];
    var K = ["0x539752f747c989c355aecf876d0f5aeae88796b9eed8709d4c212248be089ca", "0xa0a88a63c312f8dc82741c24885e6527a9f4e090d06c823151ebd7e9cea40cc"];
    var I = [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addConsumerHash(eligibleHash, {from: owner, value: 0});
    }).then(function() {
      return expectThrow(app.consumerSignUp(enteredHash, A, A_p, B, B_p, C, C_p, H, K, I, {from: consumer1, value: 0}));
    });
  });

  it("A consumer that does not have the right zero knowledge proof cannot sign up (input mistake)", function() {
    var app;
    var eligibleHash = "0x2ef30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f698";
    var enteredHash = "0x2ef30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f698";
    var A = ["0xbc58bed6b63e82175e9e3cf017f26d5f71a2f36165f3580d02514e3f2f22ae9", "0x30587068f5a1f61193afccf71f265e277de27e0651204b325b6625c2a51bd77e"];
    var A_p = ["0x2437272ec7e61998347ed609e003d1bb9c069903c211776a6d0fc8db65906b82", "0x8df6216b168a62a4507df93468cf0e58b5221919ef86642541ddbf54c15e589"];
    var B = [["0x8d7ce8d510b51d0a25752103da900a7f3ab7ddfa2f73e2ba682a9139c25d1f7", "0x208deb2a232d751e5e0cac266ee43d55ff9c219a0b60cd1c61971cde841a705e"], ["0x623ac694f3992eaaf7953c7827ceb6ba4da4075789b3679b74f9abe0aea444", "0xf505cf3d2fa6c24b218ef86254f83fb450f1b63f9c93373e865f04d8c5b936e"]];
    var B_p = ["0x19de1bdf2362573a606e72331c954183c9b98f8664d093682b73ab5fbe6d93a8", "0x35a943ce82ab2db74de5f6c68375de4029c0def09dae9245db7a18641b63125"];
    var C = ["0x12bfe3da774a0dde4238ec240c136af4d0f089e5e769ba486255104a03c2e94b", "0x1e3418e825cb53d2eeef37fa587abf9bdfcc6415361f1f6a15731effcf9b2f58"];
    var C_p = ["0x2c5f8013378ff540b33ae444d77dd17a407762f8940c05bb692ae13bdd5cec8f", "0x1a4fd227107bba27f57bbaa9e2338d990fd80dc6bb8a8dbc1bd69479cc737df3"];
    var H = ["0x26c0d5e8b23bd7730636067406c59342081ca73cc6f2d2fb2acd6d676be80f1e", "0x419e311996e1c6d0aba5eba8d41357a64c92091873185a5e65bfad0186330f3"];
    var K = ["0x539752f747c989c355aecf876d0f5aeae88796b9eed8709d4c212248be089ca", "0xa0a88a63c312f8dc82741c24885e6527a9f4e090d06c823151ebd7e9cea40cc"];
    var I = [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addConsumerHash(eligibleHash, {from: owner, value: 0});
    }).then(function() {
      return expectThrow(app.consumerSignUp(enteredHash, A, A_p, B, B_p, C, C_p, H, K, I, {from: consumer1, value: 0}));
    });
  });



  it("A consumer that enters the right details should be able to sign up", function() {
    var app;
    var eligibleHash = "0x2ec30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";
    var enteredHash = "0x2ec30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";

    var eligibleHash1 = "0x2ed30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";
    var enteredHash1 = "0x2ed30eb3e345d4d9e4307aced0592a5ae3be47fe74b160e4d306f40c52f4f693";

    var A = ["0xbc48bed6b63e82175e9e3cf017f26d5f71a2f36165f3580d02514e3f2f22ae9", "0x30587068f5a1f61193afccf71f265e277de27e0651204b325b6625c2a51bd77e"];
    var A_p = ["0x2437272ec7e61998347ed609e003d1bb9c069903c211776a6d0fc8db65906b82", "0x8df6216b168a62a4507df93468cf0e58b5221919ef86642541ddbf54c15e589"];
    var B = [["0x8d7ce8d510b51d0a25752103da900a7f3ab7ddfa2f73e2ba682a9139c25d1f7", "0x208deb2a232d751e5e0cac266ee43d55ff9c219a0b60cd1c61971cde841a705e"], ["0x623ac694f3992eaaf7953c7827ceb6ba4da4075789b3679b74f9abe0aea444", "0xf505cf3d2fa6c24b218ef86254f83fb450f1b63f9c93373e865f04d8c5b936e"]];
    var B_p = ["0x19de1bdf2362573a606e72331c954183c9b98f8664d093682b73ab5fbe6d93a8", "0x35a943ce82ab2db74de5f6c68375de4029c0def09dae9245db7a18641b63125"];
    var C = ["0x12bfe3da774a0dde4238ec240c136af4d0f089e5e769ba486255104a03c2e94b", "0x1e3418e825cb53d2eeef37fa587abf9bdfcc6415361f1f6a15731effcf9b2f58"];
    var C_p = ["0x2c5f8013378ff540b33ae444d77dd17a407762f8940c05bb692ae13bdd5cec8f", "0x1a4fd227107bba27f57bbaa9e2338d990fd80dc6bb8a8dbc1bd69479cc737df3"];
    var H = ["0x26c0d5e8b23bd7730636067406c59342081ca73cc6f2d2fb2acd6d676be80f1e", "0x419e311996e1c6d0aba5eba8d41357a64c92091873185a5e65bfad0186330f3"];
    var K = ["0x539752f747c989c355aecf876d0f5aeae88796b9eed8709d4c212248be089ca", "0xa0a88a63c312f8dc82741c24885e6527a9f4e090d06c823151ebd7e9cea40cc"];
    var I = [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1];

    var A2 = ["0x22c995be6343ab71cf355ddf6912f947272fb9467e27bc2c7728803e2e5cef0d", "0x193e8b2819118da117f20e228888ba8b99df99b3f0e46540bf6bedfdddfe0519"];
    var A2_p = ["0x1d50f515607e2ee120937ed2b27bf58b9bc51e26db340f005a3a3d7af46c70bd", "0x260f63ca943edeeda7b61317ea8cb51f8e8efa4dc2c24287b63ece680171a8"];
    var B2 = [["0x210a3027aff915db1a1d0f2f4b6fb711afa1fc40beb9b9d14b20d10bd99c6784", "0x21603971c287bc164ff25a60438e47f9d37acd7de5e15ec4e644b749b74ef48e"], ["0x85b35a69d4d9c041dd97b372ebc35d5224dcfadf358158f190311c4738f8f1a", "0x2f11e9a3fc255717df5ad143d51225bee51b135682d98d63e0ac0a4f00ac5cb4"]];
    var B2_p = ["0x128944fc520d2190eaa82433d2fe51bc9ea6447480a99bca4067303cdd887745", "0x28651444b33ca40b28d9fccef67e5b9b36eba3e528db29d519d1d8eb2c6787f0"];
    var C2 = ["0x1a4fb442cb45dbb5ef1612091bf11d550bcd5e98d3234d16e2097fcf1a68f6ef", "0x77cc866d57d603e7ea6f1f932ef23f06bec9676e65179ca1a0323ce6c93f4af"];
    var C2_p = ["0xda7e771e14149af6c7eacf9ea25ebc0b5b489187e2ebf30eeaa54b5136086d0", "0x23c30be80e8ded620598036d03ba087c82a32f4afa4d53d2c545cf70e72d749d"];
    var H2 = ["0x114d04408118edfd4e825e36859f5bf22199e103de8ddacebd75dfd85cb5eab3", "0x8c33d0eb4ea98d30ece5cde27a77da88405f503cf89aa9a4b12bc51ec00b310"];
    var K2 = ["0xce4e22a499577f6b5906877f04cb37b251b926358f91feb96a5041ede9d41eb", "0x229c104d3f7c3d13bd5575925acd01b4f7094a0202e8756047f0d39b001b1ff2"];
    var I2 = [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addConsumerHash(eligibleHash, {from: owner, value: 0});
    }).then(function() {
      return app.consumerSignUp(enteredHash, A, A_p, B, B_p, C, C_p, H, K, I, {from: consumer1, value: 0});
    }).then(function() {
      return app.noOfConsumers();
    }).then(function(consumers) {
      assert.equal(consumers.valueOf(), 1, "The number of consumers has not been incremented");
      return app.addConsumerHash(eligibleHash1, {from: owner, value: 0});
    }).then(function() {
      return app.consumerSignUp(enteredHash1, A2, A2_p, B2, B2_p, C2, C2_p, H2, K2, I2, {from: consumer2, value: 0});
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
    var A = ["0xbc48bed6b63e82175e9e3cf017f26d5f71a2f36165f3580d02514e3f2f22ae9", "0x30587068f5a1f61193afccf71f265e277de27e0651204b325b6625c2a51bd77e"];
    var A_p = ["0x2437272ec7e61998347ed609e003d1bb9c069903c211776a6d0fc8db65906b82", "0x8df6216b168a62a4507df93468cf0e58b5221919ef86642541ddbf54c15e589"];
    var B = [["0x8d7ce8d510b51d0a25752103da900a7f3ab7ddfa2f73e2ba682a9139c25d1f7", "0x208deb2a232d751e5e0cac266ee43d55ff9c219a0b60cd1c61971cde841a705e"], ["0x623ac694f3992eaaf7953c7827ceb6ba4da4075789b3679b74f9abe0aea444", "0xf505cf3d2fa6c24b218ef86254f83fb450f1b63f9c93373e865f04d8c5b936e"]];
    var B_p = ["0x19de1bdf2362573a606e72331c954183c9b98f8664d093682b73ab5fbe6d93a8", "0x35a943ce82ab2db74de5f6c68375de4029c0def09dae9245db7a18641b63125"];
    var C = ["0x12bfe3da774a0dde4238ec240c136af4d0f089e5e769ba486255104a03c2e94b", "0x1e3418e825cb53d2eeef37fa587abf9bdfcc6415361f1f6a15731effcf9b2f58"];
    var C_p = ["0x2c5f8013378ff540b33ae444d77dd17a407762f8940c05bb692ae13bdd5cec8f", "0x1a4fd227107bba27f57bbaa9e2338d990fd80dc6bb8a8dbc1bd69479cc737df3"];
    var H = ["0x26c0d5e8b23bd7730636067406c59342081ca73cc6f2d2fb2acd6d676be80f1e", "0x419e311996e1c6d0aba5eba8d41357a64c92091873185a5e65bfad0186330f3"];
    var K = ["0x539752f747c989c355aecf876d0f5aeae88796b9eed8709d4c212248be089ca", "0xa0a88a63c312f8dc82741c24885e6527a9f4e090d06c823151ebd7e9cea40cc"];
    var I = [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.consumerSignUp(enteredHash, A, A_p, B, B_p, C, C_p, H, K, I, {from: consumer1, value: 0}));
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
