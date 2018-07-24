import expectThrow from '../helpers/expectThrow';

var Verifier = artifacts.require("Verifier");

contract('Verifier', function(accounts, app) {

  it("A zk-SNARK proof should be verified as true", function() {

    var A = ["0x11499748357cf7ea81461714a8090d9d78202c04012eb192891598b6fbd1e339", "0xdea034c721267348ca09b1fef69b0b4e4694423eca647607e3c013f992834f4"];
    var A_p = ["0x63037862787f08633473006f597e5f2725c9c8babcd0f582bdd71d31a9c49f4", "0x3043ee81be5512b86ddc64dd837bec607344cfcf1c069cc7432571fdbb6b974f"];
    var B = [["0x2b8d140f89f1c5beb329de11c7a88f2f65db05f1df00396d56489ba685c1a2bb", "0x241f9142aaa5f0427ccca4145cc756dfd71f5241fcb97cf27f23fbfcd16a380a"], ["0xb97ff47cbce308506a79dc230104fbd8e1fde47e46bcc83803203c4c8026296", "0x1947636f6ea592092cc0c6069c61de5a5077729914523e96b1aed42ac32dc369"]];
    var B_p = ["0x2d995f17bb1b107a5ef4f1a926604461cca1ff41a77b1055e49af9e8f04fbd4a", "0x145f6363cf430711adf748032a8b2cfb312920a9613a252731803dda894adcbb"];
    var C = ["0xbd969b74b84aa6b97a9e1d1ece9610ee347b786708cb5a6ed23ee717cf9d073", "0x1d466192b252a67a9cea6f0621d195b13cb24a56d5b1df34e83815734e0bac98"];
    var C_p = ["0x194b48641d28fcb7afd784b4dbaecb37ce14b19411e457f6bab545d6d57fb101", "0x1df1edbb00cfb431821c030abbec54b5654918635917583265d64c256da0cca8"];
    var H = ["0xca93e0ef4813ef243ae217ef323c5f16a1721b058baecef2163710c88630c71", "0x20362c9ebfbd7764a36a79b3c0c37fecdceeb5ceb1f434f36a5467e189139445"];
    var K = ["0x240f66de2d1d3bc594ea5be1b7fb2a971f3b07ef332494f059c798339025e2b3", "0x1fd8fd322bcddd5d18629f7936313cf7ce2ffaf9f6110b025e827b23316c76"];

    // This is your input and output
    var I = [0, 1, 0, 1, 0, 1];

    return Verifier.deployed().then(function(instance) {
      app = instance;
      return app.verifyTx.call(A, A_p, B, B_p, C, C_p, H, K, I);
    }).then(function(returnValue) {
      assert.equal(returnValue, true, "The zk-SNARK proof was not verified.");
    });
  });
});
