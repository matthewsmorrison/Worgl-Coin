import expectThrow from '../helpers/expectThrow';

var Verifier = artifacts.require("Verifier");

contract('Verifier', function(accounts, app) {

  it("A zk-SNARK proof should be verified as true", function() {

    var A = ["0x2809c1805188ed0b6ece6051d2f30814967da9e86d60bae46eae290208f3c051", "0x2995b14e2279d155349d52f6246853b8968b8e707fa04a63afb24d74cfdfa9a2"];
    var A_p = ["0x1e72291c946d2a53d97ac49fe25bb10f0fd95a8b3555a8eefe6057015aa50ca7", "0x1395154175ef72f78da9276db58105de1cce0590121fe12200edfd6514bd9ba1"];
    var B = [["0x260dd5608c20e3c8547acd2c7fcea12f04d93afe1e0825c9a146213a9ada7b2f", "0xfdf95ec3383db4603a3a1c9983c5b65522a83af8251fd829092bc66de4934a2"], ["0x2f702ee399501e0d35adba243e492f19f4a63b51c7142e4ee27d6b4725aa2448", "0x2a8c0cfac6e2fb9dedf2ddcbb8062d6482c95b1a2a4c762465ac2a0c5def4916"]];
    var B_p = ["0x24fcdb2e8d39796c5dfa0670eb10f9ba820d684dc9fab84874584a0a430787ef", "0x17ed46e84c7a5c84a6c131d0f4d846987ff605d2a6bbe4178a114d4688c20401"];
    var C = ["0x1debc840bab77073c3cb869de3218fe68e2949c7f204f4b1302d3a7c4ca779b2", "0xcb7cd8c71a1aa5038dfe56a22d12b61e1af995d46b46f908d32f0c3362e2687"];
    var C_p = ["0x109c3f22dfa36c84335132cf3eadef4403a6e7b97841ad34c88396561048e362", "0x18cfe38396fdb517ecb19261c4245cc45834cd2f2da2c377156b30b5d0bbd89d"];
    var H = ["0x18a651221f964ed0c205c4e8aa505038e5ab134ef00b537317ba4a46542415f", "0xf037b5031c8f35d4bf84909eee590b614018e430573dcd6de1bc0524ca9244c"];
    var K = ["0x72906671daa7f3c76ab0bf9a584f85a40e29bdd841f91ea6ae1d194e8015497", "0x1a4d79a000bddd9f41d30f05058b379a1e297dc00bdcd81c24783d554cf719cc"];

    // This is your input and output
    // First 32 integers are the first 32 bits of the hash
    // The 33 bit is 1 for the return value
    var I = [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1];

    return Verifier.deployed().then(function(instance) {
      app = instance;
      return app.verifyTx(A, A_p, B, B_p, C, C_p, H, K, I);
    });
  });
});
