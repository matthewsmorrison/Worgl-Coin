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
    var eligibleHash = "0x66bfd2155426f63f050358d409d5bb3cbc928327aede47d24b74e84ad78fce80";
    var enteredHash = "0x66bfd2155426f63f050358d409d5bb3cbc928327aede47d24b74e84ad78fce80";

    var A = ["0xbb76a756f25dc4a552f8db4d18a2ebc1bb1afd9daf6acf577d2cbb7d854325b", "0x2bff206a5b92001be5865fc66bb20d73721e5cf2b87d8d4387502c1ebca9f7e2"];
    var A_p = ["0x17fb19b5fc6b9cb214e1942facfa22bb03d94b45f5e7eefde682a8ef6d7118ed", "0x1a921ddf54167f0c0d2fed831b7b4c3ed32dbf33eccf503301f362ab40a58caf"];
    var B = [["0x1679f5e46e7ad147ad283aa591e989494ed0aa3ccf2292b93d82811cd4ab2494", "0x2245db548c7b0fc51cfb5e7d869b6977c5bdb617f3cb1cc3aade2efbed03ffe5"], ["0x21dbbe117d8f99f421336b5c5906730bda57c923cb5eb5197bba4e99ed8ee8e7", "0x537df6caa38a64b7b2b0b9b3286bb7a298eccb60a29f3287c72b024ffb3c71"]];
    var B_p = ["0x1564c23ee1043c9c964f5499084e969851e786a43335b8c8878ca11979dbdde6", "0x14ff3afff9fdd076c0a3335ee6c700ea120f0ad83e69b0506e2bcc0bb422b474"];
    var C = ["0x8422040ac6a5eb7c50da9e4966986f59449582c04c64415f1f5886430f3cee9", "0x200668f89ad7a0fbbac875605fc2d361a697799163969421475116689c879c4d"];
    var C_p = ["0x13bf2c64f25ccfab64bbbe736cb2bddec88d0287a39442d18c2a79b01645168e", "0x43f4154303841cd7849514844fccecb9f93233e81071f766fa025b9c2d90cf6"];
    var H = ["0x267925dc922b66d87b716aef2d25e5a9cc2b79a3ff3c0ac572eb44cf4d79b265", "0x6859de13201825bc307070e37a0a6f7f17ca1e863b4d250507a841a4fec4031"];
    var K = ["0xa7c310649802bbe6177e64765a4efd2eb2873c25c92931de44727699f2df69f", "0x20a5332886fc31b4b6f95d9fd4b94d4eb82b7bdb9006ed6a95c86b0a2a5d335"];
    var I = [0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addConsumerHash(eligibleHash, {from: owner, value: 0});
    }).then(function() {
      return expectThrow(app.consumerSignUp(enteredHash, A, A_p, B, B_p, C, C_p, H, K, I, {from: consumer1, value: 0}));
    });
  });

  it("A consumer that does not have the right zero knowledge proof cannot sign up (input mistake)", function() {
    var app;
    var eligibleHash = "0x08e538c542c2a9415f44fad765d2992d6f7c5cc74dd6faf7b84df872be3ebcd6";
    var enteredHash = "0x08e538c542c2a9415f44fad765d2992d6f7c5cc74dd6faf7b84df872be3ebcd6";

    var A = ["0x9245837ab0419e7b7dd2318d7bbd3f1a8dc01d1b2c22e0e75e0469d74f2254e", "0x2d40739a5c9bc3b6b4ff9fb1b187b044d02189a18b6d9f72319a952e36cb3b1d"];
    var A_p = ["0xcf3d5371f2ea5bf08d41d5387a7e3e150f8be5860502cdb603af8371c0101e5", "0x1e9999879d4d0e0d62de31c4a1f17dca66898224ce6d149c6bf688e940766ced"];
    var B = [["0x128fa53276760e30863ac0a1249408004233c6956cf2c9548f8b2f8c86e9a00d", "0x209617a7acf7224f95f2e6efa4d9d43e4785458e55e79bc9da31d57596406d27"], ["0x2ac46a6628f887069d3c62ca2556c75c2ee696f9f803f0927ac5fca2a26ea4a", "0x245e373884daf9f0c8dc55927801596dde1010c69f01257ec6fc29ae7e4fda4f"]];
    var B_p = ["0x1a3a3674afd6fa2acc162cc330fd57a09819873b40f323cc78f5ab074f4ff2f4", "0x2f3b58d34192ecf8b96976b55c10498d4e1df553d26925d88777fbbe372ca27e"];
    var C = ["0x3d2681f9e4acb6b66601188c666f772ab571b2b0a843bcae40e7b4e235c3277", "0xed3dd30c4666717ce2a30cef03bec005df0e5cdb71bf4488e7dbfe7f4aa5cbb"];
    var C_p = ["0x1c5dcf9ba2a1b964f774f8bab2b71e0a1a871cd8b7ec6990106b9f9f97c65c53", "0x25e57a35d9868d0aa1753da59b6de2ff5115873e925132b1cd31ffe8a36f718"];
    var H = ["0x34b47d249a77e03257c12796099fe8c8c435223b309c8157579defd370c0f63", "0x2c3a96d7a38e10c79d958806549ced6c56791a650081bbd992c330c4ad07bffe"];
    var K = ["0x5872b46e4a3ca06a63f2dbd1659faa293597b75c8f8f4f635231f853b8ac03a", "0xd8bd8131df9df0e11aca96d91a81375069213793ff5bbeb995563ebffbc81ec"];
    var I = [0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.addConsumerHash(eligibleHash, {from: owner, value: 0});
    }).then(function() {
      return expectThrow(app.consumerSignUp(enteredHash, A, A_p, B, B_p, C, C_p, H, K, I, {from: consumer1, value: 0}));
    });
  });



  it("A consumer that enters the right details should be able to sign up", function() {
    var app;
    var enteredHash = "0x66bfd2155426f63f050358d409d5bb3cbc928327aede47d24b74e84ad78fce80";
    var enteredHash1 = "0x08e538c542c2a9415f44fad765d2992d6f7c5cc74dd6faf7b84df872be3ebcd6";

    var A = ["0xbb77a756f25dc4a552f8db4d18a2ebc1bb1afd9daf6acf577d2cbb7d854325b", "0x2bff206a5b92001be5865fc66bb20d73721e5cf2b87d8d4387502c1ebca9f7e2"];
    var A_p = ["0x17fb19b5fc6b9cb214e1942facfa22bb03d94b45f5e7eefde682a8ef6d7118ed", "0x1a921ddf54167f0c0d2fed831b7b4c3ed32dbf33eccf503301f362ab40a58caf"];
    var B = [["0x1679f5e46e7ad147ad283aa591e989494ed0aa3ccf2292b93d82811cd4ab2494", "0x2245db548c7b0fc51cfb5e7d869b6977c5bdb617f3cb1cc3aade2efbed03ffe5"], ["0x21dbbe117d8f99f421336b5c5906730bda57c923cb5eb5197bba4e99ed8ee8e7", "0x537df6caa38a64b7b2b0b9b3286bb7a298eccb60a29f3287c72b024ffb3c71"]];
    var B_p = ["0x1564c23ee1043c9c964f5499084e969851e786a43335b8c8878ca11979dbdde6", "0x14ff3afff9fdd076c0a3335ee6c700ea120f0ad83e69b0506e2bcc0bb422b474"];
    var C = ["0x8422040ac6a5eb7c50da9e4966986f59449582c04c64415f1f5886430f3cee9", "0x200668f89ad7a0fbbac875605fc2d361a697799163969421475116689c879c4d"];
    var C_p = ["0x13bf2c64f25ccfab64bbbe736cb2bddec88d0287a39442d18c2a79b01645168e", "0x43f4154303841cd7849514844fccecb9f93233e81071f766fa025b9c2d90cf6"];
    var H = ["0x267925dc922b66d87b716aef2d25e5a9cc2b79a3ff3c0ac572eb44cf4d79b265", "0x6859de13201825bc307070e37a0a6f7f17ca1e863b4d250507a841a4fec4031"];
    var K = ["0xa7c310649802bbe6177e64765a4efd2eb2873c25c92931de44727699f2df69f", "0x20a5332886fc31b4b6f95d9fd4b94d4eb82b7bdb9006ed6a95c86b0a2a5d335"];
    var I = [0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1];

    var A2 = ["0x9245837ab0419e7b7dd2318d7bbd3f1a8dc01d1b2c22e0e75e0469d74f2254e", "0x2d40739a5c9bc3b6b4ff9fb1b187b044d02189a18b6d9f72319a952e36cb3b1d"];
    var A2_p = ["0xcf3d5371f2ea5bf08d41d5387a7e3e150f8be5860502cdb603af8371c0101e5", "0x1e9999879d4d0e0d62de31c4a1f17dca66898224ce6d149c6bf688e940766ced"];
    var B2 = [["0x128fa53276760e30863ac0a1249408004233c6956cf2c9548f8b2f8c86e9a00d", "0x209617a7acf7224f95f2e6efa4d9d43e4785458e55e79bc9da31d57596406d27"], ["0x2ac46a6628f887069d3c62ca2556c75c2ee696f9f803f0927ac5fca2a26ea4a", "0x245e373884daf9f0c8dc55927801596dde1010c69f01257ec6fc29ae7e4fda4f"]];
    var B2_p = ["0x1a3a3674afd6fa2acc162cc330fd57a09819873b40f323cc78f5ab074f4ff2f4", "0x2f3b58d34192ecf8b96976b55c10498d4e1df553d26925d88777fbbe372ca27e"];
    var C2 = ["0x3d2681f9e4acb6b66601188c666f772ab571b2b0a843bcae40e7b4e235c3277", "0xed3dd30c4666717ce2a30cef03bec005df0e5cdb71bf4488e7dbfe7f4aa5cbb"];
    var C2_p = ["0x1c5dcf9ba2a1b964f774f8bab2b71e0a1a871cd8b7ec6990106b9f9f97c65c53", "0x25e57a35d9868d0aa1753da59b6de2ff5115873e925132b1cd31ffe8a36f718"];
    var H2 = ["0x34b47d249a77e03257c12796099fe8c8c435223b309c8157579defd370c0f63", "0x2c3a96d7a38e10c79d958806549ced6c56791a650081bbd992c330c4ad07bffe"];
    var K2 = ["0x5872b46e4a3ca06a63f2dbd1659faa293597b75c8f8f4f635231f853b8ac03a", "0xd8bd8131df9df0e11aca96d91a81375069213793ff5bbeb995563ebffbc81ec"];
    var I2 = [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return app.consumerSignUp(enteredHash, A, A_p, B, B_p, C, C_p, H, K, I, {from: consumer1, value: 0});
    }).then(function() {
      return app.noOfConsumers();
    }).then(function(consumers) {
      assert.equal(consumers.valueOf(), 1, "The number of consumers has not been incremented");
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
    var enteredHash = "0x66bfd2155426f63f050358d409d5bb3cbc928327aede47d24b74e84ad78fce80";
    var A = ["0xbb77a756f25dc4a552f8db4d18a2ebc1bb1afd9daf6acf577d2cbb7d854325b", "0x2bff206a5b92001be5865fc66bb20d73721e5cf2b87d8d4387502c1ebca9f7e2"];
    var A_p = ["0x17fb19b5fc6b9cb214e1942facfa22bb03d94b45f5e7eefde682a8ef6d7118ed", "0x1a921ddf54167f0c0d2fed831b7b4c3ed32dbf33eccf503301f362ab40a58caf"];
    var B = [["0x1679f5e46e7ad147ad283aa591e989494ed0aa3ccf2292b93d82811cd4ab2494", "0x2245db548c7b0fc51cfb5e7d869b6977c5bdb617f3cb1cc3aade2efbed03ffe5"], ["0x21dbbe117d8f99f421336b5c5906730bda57c923cb5eb5197bba4e99ed8ee8e7", "0x537df6caa38a64b7b2b0b9b3286bb7a298eccb60a29f3287c72b024ffb3c71"]];
    var B_p = ["0x1564c23ee1043c9c964f5499084e969851e786a43335b8c8878ca11979dbdde6", "0x14ff3afff9fdd076c0a3335ee6c700ea120f0ad83e69b0506e2bcc0bb422b474"];
    var C = ["0x8422040ac6a5eb7c50da9e4966986f59449582c04c64415f1f5886430f3cee9", "0x200668f89ad7a0fbbac875605fc2d361a697799163969421475116689c879c4d"];
    var C_p = ["0x13bf2c64f25ccfab64bbbe736cb2bddec88d0287a39442d18c2a79b01645168e", "0x43f4154303841cd7849514844fccecb9f93233e81071f766fa025b9c2d90cf6"];
    var H = ["0x267925dc922b66d87b716aef2d25e5a9cc2b79a3ff3c0ac572eb44cf4d79b265", "0x6859de13201825bc307070e37a0a6f7f17ca1e863b4d250507a841a4fec4031"];
    var K = ["0xa7c310649802bbe6177e64765a4efd2eb2873c25c92931de44727699f2df69f", "0x20a5332886fc31b4b6f95d9fd4b94d4eb82b7bdb9006ed6a95c86b0a2a5d335"];
    var I = [0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1];

    return WorglCoin.deployed().then(function(instance) {
      app = instance;
      return expectThrow(app.consumerSignUp(enteredHash, A, A_p, B, B_p, C, C_p, H, K, I, {from: consumer1, value: 0}));
    });
  });

  it("The contract owner should not be able to add a duplicate consumer hash.", function() {
    var app;
    var eligibleHash = "0x08e538c542c2a9415f44fad765d2992d6f7c5cc74dd6faf7b84df872be3ebcd6";

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
