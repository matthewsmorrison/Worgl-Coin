import expectThrow from '../helpers/expectThrow';

var Verifier = artifacts.require("Verifier");

contract('Verifier', function(accounts, app) {

  // using "MatthewMorrison"
  it("A zk-SNARK proof should be verified as true", function() {

    var A = ["0x2c00b54478f81e93b37d326f4f5224b222f580737e60a529b0ca84bbf64cee2c", "0x1807a90bb11e9d67cca10bdc733b606e6c9e365a8243def7a78e88fb8afd4d44"];
    var A_p = ["0x7db38d8930dc9829f9f7b086e10dd1bddabc9e67e4534919d8d72fd65ac619", "0xa688b31d8f5622ca8850d15f4bdaa128bfd56956a7b5b9592299ed54ebd06f2"];
    var B = [["0x2b12ceae043df58bd68502a89a4a96012208c397b4c56b1e4353c66088ea5efc", "0x4e84c8b8477e1d098d529e5b7c95467ca19b01b004907d5f97cd0eb9898c8ef"], ["0x14eef59a4fbb5bfbd9a03171cfdf243a3d22a302deb25401216c175470a423d6", "0x9db45a3ac2a8ef07d39d0561bdffa0e74e4f3822910d5e7893cd89b93b6a78d"]];
    var B_p = ["0x36e24b959398d4a0a9df51ba01011874bfeb46614cf9a92e4a97a31edd4e743", "0x1bd3fe7443227182f1b9f92ceca9c61027c3757115427f9943368d667d817c40"];
    var C = ["0x2da93c21f65542380d2072716ca9d3881cf3f67afa64e55caf21e1d459392960", "0x2370441c9220b9462cd1c3e0fa856cc2149f5e47901088569b4e54de7830011b"];
    var C_p = ["0x4a24341cb74e81aaaf0563d820affae2492fb0775473b292a4e7b9abb1b6e43", "0xf7b6ce2509f3480cb4700116c566fe58e2bd62aa541c3e354dca433cc057f08"];
    var H = ["0x1163ac5807c0304b77a48d5fc739d735f017c1553f04ebf83437d9e26bc80322", "0x127308b4397a913f540e38991fed22d9b7a5283e1c0a514f3564ccac8c413858"];
    var K = ["0x20ea0979e0d3455af4c79fd0086d7fe11cbfc9c71d8a54072af8867ab93f26c8", "0x267332a3d52d6bbe933c71b5ec295b5f5fd6e670dd3a3b845bd29c19bf6faebe"];

    // This is your input and output
    // First 32 integers are the first 32 bits of the hash
    // The 33 bit is 1 for the return value
    var I = [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1];

    return Verifier.deployed().then(function(instance) {
      app = instance;
      return app.verifyTx(A, A_p, B, B_p, C, C_p, H, K, I);
    });
  });

  // using "VictoriaNoble"

  it("A zk-SNARK proof should be verified as true", function() {

    var A = ["0x22c995be6343ab71cf355ddf6912f947272fb9467e27bc2c7728803e2e5cef0d", "0x193e8b2819118da117f20e228888ba8b99df99b3f0e46540bf6bedfdddfe0519"];
    var A_p = ["0x1d50f515607e2ee120937ed2b27bf58b9bc51e26db340f005a3a3d7af46c70bd", "0x260f63ca943edeeda7b61317ea8cb51f8e8efa4dc2c24287b63ece680171a8"];
    var B = [["0x210a3027aff915db1a1d0f2f4b6fb711afa1fc40beb9b9d14b20d10bd99c6784", "0x21603971c287bc164ff25a60438e47f9d37acd7de5e15ec4e644b749b74ef48e"], ["0x85b35a69d4d9c041dd97b372ebc35d5224dcfadf358158f190311c4738f8f1a", "0x2f11e9a3fc255717df5ad143d51225bee51b135682d98d63e0ac0a4f00ac5cb4"]];
    var B_p = ["0x128944fc520d2190eaa82433d2fe51bc9ea6447480a99bca4067303cdd887745", "0x28651444b33ca40b28d9fccef67e5b9b36eba3e528db29d519d1d8eb2c6787f0"];
    var C = ["0x1a4fb442cb45dbb5ef1612091bf11d550bcd5e98d3234d16e2097fcf1a68f6ef", "0x77cc866d57d603e7ea6f1f932ef23f06bec9676e65179ca1a0323ce6c93f4af"];
    var C_p = ["0xda7e771e14149af6c7eacf9ea25ebc0b5b489187e2ebf30eeaa54b5136086d0", "0x23c30be80e8ded620598036d03ba087c82a32f4afa4d53d2c545cf70e72d749d"];
    var H = ["0x114d04408118edfd4e825e36859f5bf22199e103de8ddacebd75dfd85cb5eab3", "0x8c33d0eb4ea98d30ece5cde27a77da88405f503cf89aa9a4b12bc51ec00b310"];
    var K = ["0xce4e22a499577f6b5906877f04cb37b251b926358f91feb96a5041ede9d41eb", "0x229c104d3f7c3d13bd5575925acd01b4f7094a0202e8756047f0d39b001b1ff2"];
    var I = [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1];

    return Verifier.deployed().then(function(instance) {
      app = instance;
      return app.verifyTx(A, A_p, B, B_p, C, C_p, H, K, I);
    });
  });
});
