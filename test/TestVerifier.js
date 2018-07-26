import expectThrow from '../helpers/expectThrow';

var Verifier = artifacts.require("Verifier");

contract('Verifier', function(accounts, app) {

  // using "MatthewMorrison"
  it("A zk-SNARK proof should be verified as true", function() {

    var A = ["0xbc48bed6b63e82175e9e3cf017f26d5f71a2f36165f3580d02514e3f2f22ae9", "0x30587068f5a1f61193afccf71f265e277de27e0651204b325b6625c2a51bd77e"];
    var A_p = ["0x2437272ec7e61998347ed609e003d1bb9c069903c211776a6d0fc8db65906b82", "0x8df6216b168a62a4507df93468cf0e58b5221919ef86642541ddbf54c15e589"];
    var B = [["0x8d7ce8d510b51d0a25752103da900a7f3ab7ddfa2f73e2ba682a9139c25d1f7", "0x208deb2a232d751e5e0cac266ee43d55ff9c219a0b60cd1c61971cde841a705e"], ["0x623ac694f3992eaaf7953c7827ceb6ba4da4075789b3679b74f9abe0aea444", "0xf505cf3d2fa6c24b218ef86254f83fb450f1b63f9c93373e865f04d8c5b936e"]];
    var B_p = ["0x19de1bdf2362573a606e72331c954183c9b98f8664d093682b73ab5fbe6d93a8", "0x35a943ce82ab2db74de5f6c68375de4029c0def09dae9245db7a18641b63125"];
    var C = ["0x12bfe3da774a0dde4238ec240c136af4d0f089e5e769ba486255104a03c2e94b", "0x1e3418e825cb53d2eeef37fa587abf9bdfcc6415361f1f6a15731effcf9b2f58"];
    var C_p = ["0x2c5f8013378ff540b33ae444d77dd17a407762f8940c05bb692ae13bdd5cec8f", "0x1a4fd227107bba27f57bbaa9e2338d990fd80dc6bb8a8dbc1bd69479cc737df3"];
    var H = ["0x26c0d5e8b23bd7730636067406c59342081ca73cc6f2d2fb2acd6d676be80f1e", "0x419e311996e1c6d0aba5eba8d41357a64c92091873185a5e65bfad0186330f3"];
    var K = ["0x539752f747c989c355aecf876d0f5aeae88796b9eed8709d4c212248be089ca", "0xa0a88a63c312f8dc82741c24885e6527a9f4e090d06c823151ebd7e9cea40cc"];
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

  // using "MatthewSeamusMorrisonNW384533B11021991l@kp!09"

  it("A zk-SNARK proof should be verified as true", function() {

    var A = ["0x1f56bbfaf5a51e67eca79782a679a5e76d0a1b71d39074009b30b76b0e50911c", "0x12c02c4b48f198255e9728f77eaea71e8c290f5beda4714bfdf455d9c9b54cb1"];
    var A_p = ["0x151649f810b9e56a7254012d2020c4e97ce150c7f61988eb641e9d1d5d99af1d", "0x1d0c2ba043fe2390c0665a2fbb91206e255ebc88eaddec6197d219f54b0aa525"];
    var B = [["0x2ec09afa276f185ded78d1ee804fdecb9a177fb41a81fea5b30dd37078469c47", "0x6041b2f514db552a9d819890e81b8d3053e02f32743830a115c605dbbfbf36f"], ["0xaf942495147551e895e7f20b3e8546a4e9aacc72b575db7b08f022ff4383638", "0x7aa9ce353a0bc882b51a12e469c32534a1b4c433f771032d1b60ebdd4e2ea62"]];
    var B_p = ["0x65e94f867416f9b9feecf213120be3ad6affc9ec32e612b8530f9b7d5392274", "0x244f82b64cf356c23070b3fe637470e6d835d7d097f7455057e77f15e0f84ed"];
    var C = ["0x10040f86bcc699d05bc08b651741c652129a616fa5b366aa29d8553ef2ac3f54", "0xe1de7737e13a97627e4aa2c447e234ae69f845dbe6f3c24cb942865966edd27"];
    var C_p = ["0x16a0082c2eb7b13f4ef01e466b5f46d33f22c0ebda6be9cdd2d25bbcfede68a1", "0x1374184e4bad1f44eac03bc56db2d59911666507a2b9826daeaa1a07b95cc417"];
    var H = ["0x1f5a32b4bdb1cf9e5c6429e1e88a6025ba2b04c9495b516868d133fd0cf66ba6", "0x2469f69fd98911a0cb21c90f0954ed7d33c771f402e23aeeb2d70bc3a7f5f028"];
    var K = ["0x22719343cae30732723bbfac9fb8c03707f849b2183ff4f09ff070678750f264", "0xad4ef274b548bdcb4c7b1709befa42d220e58209c2e0c0d2787c8769fbbe145"];
    var I = [0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1];

    return Verifier.deployed().then(function(instance) {
      app = instance;
      return app.verifyTx(A, A_p, B, B_p, C, C_p, H, K, I);
    });
  });

  it("A zk-SNARK proof should be verified as true", function() {

    var A = ["0x206187067596f0cc607981a1203d67a38d06ba8fe8764ac30450002cbbf86784", "0x299a4e4b1276651621938269b9d7f7f4b378c6dfad7ef529a38ead04e0778889"]
    var A_p = ["0xb8975e36908ef4a68acf5461609c98f1b4ead2baf5dbaf5be1baba051593f91", "0xf28063f8befcb6553557c7c737353307cddc0c94e78d095a1d4343955c85fab"]
    var B = [["0x1a5f6be0e57b9c858fbc090b14c885c12d9adcee1fdb68e604bcedd03e121d5a", "0x17a14c12d16e62f3658538c9eb0e45350ed3f947d09491ae623e28ffaae7fa8a"], ["0x125befb0729c9d9431f2024e2d2c50ca91623dc1f57bc856fbc6c18b5364ae9b", "0x2736533c9ac6618926b6b920583c5c593d70b37c944977c2abffbf5f11956647"]];
    var B_p = ["0x2832bc7a7ceea0b8680e58c8536e5124dceb38cd0bbc9d203c03dcdd2cd7a5ea", "0x147357890e2fa46f90dcf15170265efd5d3ed9399799e14c1b40e895709ed6b8"]
    var C = ["0x3cb05873096dfa1637e37f48dafe8835524e52c5ca1f6b908a12a38a0d4a8fb", "0x2224eea86933936eb3a06e63d6ed3f1516e913f947c28ddeef3b7a95349981e9"]
    var C_p = ["0x20431d83b0fe982790c95bde28bfa413cac01be363497a7e20479c27bf4348f3", "0x1859d9d4a17a1e9e781a49fa8c2a7738aefa2dd2efde4cdcf0b17e5311a6d367"]
    var H = ["0x302ca0bbf335f75fa049b01578eaa7f52d72093eb491eb3df75d82cc9b61c4cf", "0x1cb56dcb27c2346fd3b21664392523ab171448093bba0dab6a9053c2fa732011"]
    var K = ["0x2d160fafe272e3231efe1ec212a2b580b2fc26826724bc911fdd892a25422299", "0x4cbdf3c524147cf93665ac0bdfe4d46e90d4d436bfa48976a6877d9a3a97774"]
    var I = [0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1];

    return Verifier.deployed().then(function(instance) {
      app = instance;
      return app.verifyTx(A, A_p, B, B_p, C, C_p, H, K, I);
    });
  });


});
