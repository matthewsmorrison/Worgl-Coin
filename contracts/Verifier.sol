// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Modified by Matthew Morrison 2018

pragma solidity ^0.4.14;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point) {
        return G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point p) pure internal returns (G1Point) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return the sum of two points of G1
    function addition(G1Point p1, G1Point p2) internal returns (G1Point r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 6, 0, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }
    /// @return the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point p, uint s) internal returns (G1Point r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 7, 0, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] p1, G2Point[] p2) internal returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[0];
            input[i * 6 + 3] = p2[i].X[1];
            input[i * 6 + 4] = p2[i].Y[0];
            input[i * 6 + 5] = p2[i].Y[1];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 8, 0, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point a1, G2Point a2, G1Point b1, G2Point b2) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point a1, G2Point a2,
            G1Point b1, G2Point b2,
            G1Point c1, G2Point c2
    ) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point a1, G2Point a2,
            G1Point b1, G2Point b2,
            G1Point c1, G2Point c2,
            G1Point d1, G2Point d2
    ) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}

library Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G2Point A;
        Pairing.G1Point B;
        Pairing.G2Point C;
        Pairing.G2Point gamma;
        Pairing.G1Point gammaBeta1;
        Pairing.G2Point gammaBeta2;
        Pairing.G2Point Z;
        Pairing.G1Point[] IC;
    }
    struct Proof {
        Pairing.G1Point A;
        Pairing.G1Point A_p;
        Pairing.G2Point B;
        Pairing.G1Point B_p;
        Pairing.G1Point C;
        Pairing.G1Point C_p;
        Pairing.G1Point K;
        Pairing.G1Point H;
    }
    function verifyingKey() pure internal returns (VerifyingKey vk) {
        vk.A = Pairing.G2Point([0xbb1e6d32fa25a26807e4bedda61d7c1f01a300b7d21540b93f2d499124332cf, 0x2e59e44b47b199eca405297c45cecbc5f57e1225c86bcd43293e5a99c4bb334b], [0xd4059417dcced16483cfd1cc24c3e70f89f83e481d720545db634bf51836ed5, 0xd5f977271a5058d5e110eb810bab7d6c85b9d65bc20f6f43bbb0dcaee786767]);
        vk.B = Pairing.G1Point(0x2f88f7a31d003abf396a115d964cf359f991b25549c9d606dba0f73dbf0cecbf, 0x16c38eca7c74511e904e48070b4130d17b892502b05f253a298fbc7ba63710f);
        vk.C = Pairing.G2Point([0xb2696b1081e098139f3b11e8569f546565cd05b613c1c24e39840b22d74f633, 0x2b6b6e6b604b738699dfa64352e3dd99e620148b52704d983cf3dc870c49171f], [0x2a79f82af71f7dd8274cd85c4f36cb3a055e9870d5eefc2c6da2091a75112f67, 0x18b21f89fb8840e36e31a93c38f42e09d5c730e6830635f3296473ac74be6aa1]);
        vk.gamma = Pairing.G2Point([0x15e958f08d102487623ce7fa2730d8ca02ddbecb880212d3d2a3cdc28d11bfc, 0x15d7fe80330615bb02fed78e9c2591599dd71deb271fe2d71d57153cb03dca09], [0x7d1e0f5dffb3ff78f262dfdca354ac5ceac3cda79b84e92c1404ccf68b663e4, 0x4056c43162b2bd4785dce9eea8082b9460f695e9f41fe6ecbd13ac0e5636e5f]);
        vk.gammaBeta1 = Pairing.G1Point(0x293c827950937109fa899f2f663d59915a6187e9ba89a8982f9c7cbad2471270, 0x6cdb142e45ee7d53a7c2e68c166d8c8e9d2b5c2d4eb6e1a5be637bc6ae5ad0b);
        vk.gammaBeta2 = Pairing.G2Point([0x12c401ca5fff76ec9b53187e343f32a554d863672e6bedbed3c1643e765f0bb4, 0x2d06b00d8f183d5d923e5e5ac756619147b5ed303f213fb3c8a9b73090b07d3c], [0x2a1a78ae928d55cbb72a57dc7ca7f3dd943fd57c21f35773f7df19c157d46488, 0x23bc01e18568bfb08eab9eacadf48dcf9525922a3ccb00a33afa23aed9f5921b]);
        vk.Z = Pairing.G2Point([0x24073200c69e424c655e806b453b3e67d1c7fd8afda3da41718cf635a19dddde, 0x1ef32aff7353cdf7053617ebe59d79b703306751598ca5ec56a23118cec9abf4], [0x52491643c495173a944ff892e3bcaffadab604dd175b0ba7c179f12f9702160, 0xd288420a403829b4806fbe47d79aaad20348bb521201746af58b000bde3f844]);
        vk.IC = new Pairing.G1Point[](34);
        vk.IC[0] = Pairing.G1Point(0x3020c5b253e4c00045433498f9842c23d0f1efeda0000b4edfaaefa7cb97e420, 0x2dad2805e8bf2ce056e688a2096437fd1f6786fb8ae04747ae4822fa8858b62b);
        vk.IC[1] = Pairing.G1Point(0x5242f59ecb5e7094d80f0c0d59f4abf441d62d8954e19b4d90fbfd1e8b2e221, 0x21ec4371fed864959b12d61c797823c827819fb14c730eb8a0724ea027cee66f);
        vk.IC[2] = Pairing.G1Point(0x1daa08959c609748560055de8050067461b81ecdd4ecc2b651d8ac4f66339082, 0x6633a542d570309d146024e9a2f63def2fc1b36627af1064317e6bc057063f2);
        vk.IC[3] = Pairing.G1Point(0xa72c08a27bd7f023d8ae4be7ead8daeb782aab540536c0f4dc86e236ac38e43, 0x1537bfa38586a64846a23ec5c5b9df22d2046862ec9b55f7e3e8ea76b3d23078);
        vk.IC[4] = Pairing.G1Point(0x1de6aa395f9ce382b600048716f4cc34dd0d28ea8c18de1edbb29269f4a10934, 0x2e4b200447c21e96c37773d034da821cc76a93d7f532ad7552dbe0ccbf688269);
        vk.IC[5] = Pairing.G1Point(0x120ab171e59f3456454232add2340a7d8a69b473d4ebf5a32bbe0d7168162016, 0x2a28e0e6f3d908d7ba380e660a63cafe33ab0b774dc454684ab3aee27326823e);
        vk.IC[6] = Pairing.G1Point(0xc51ad123a5240cead9f94342e3e284e2bbe2e021e3994772798eb992316326e, 0x232b0a6fe727795f2ebfcac8e77c3b2a968302fb9612e64993beec4493205639);
        vk.IC[7] = Pairing.G1Point(0x218911aaf08a3c3bc358694a2208f71400ea58b5a4d3001218a811e84529d4f3, 0x7ee2e77909a720e383ec3b13995fb715f500942d9a548ff7ddaf30f89c697f5);
        vk.IC[8] = Pairing.G1Point(0x91aedafd57ecd026fdf520e58e5c9baf06e63eaadb2d9518506a7e1cfc7fe76, 0x13b43a752547f72af83d60596ba3c8976a0634e5610fdb50310703007b3a0d6a);
        vk.IC[9] = Pairing.G1Point(0x1b25d78a16c8ee14f70dccf70fff328e7769f32f85f2420d7c6fee2d7d69cfd3, 0xd1657931a73c1f1bee8a7b05ab4f3eaf2887625284f14be8d8af6a1e08afcb);
        vk.IC[10] = Pairing.G1Point(0x137914b66e71074a52c86af65f8f1f36e957e0a53aeafd89b26268928c91b013, 0x180ffc715bcd84a04378e3596d66cb5382226e2a62def6d7ffe7e273189b384f);
        vk.IC[11] = Pairing.G1Point(0x125f3abdd46b7314262348bba8b82506f6154de2a23cc963ff6e59ad08dede15, 0x93884fc3441fefd10ca73bbed134921f501f808e125601bb4c76ccde3ae69d8);
        vk.IC[12] = Pairing.G1Point(0x5bf6d05a36b61e8c7dc50a231f09e3db9bca78bd55911857ac607ec18d2bfed, 0xb9c3e62a37bcc12f3b342e79021435060ab8c8bf19faaf3ad83fe41ad252c4c);
        vk.IC[13] = Pairing.G1Point(0x1d3d927198fc8e382cec57eb5cd89f60549c41194c1e8d971c3cfd05d7871294, 0xea809509ee39065f52a6d54c789cf1c0cd676f6b352df228bf8de566f202c6c);
        vk.IC[14] = Pairing.G1Point(0x438f4e3045c9fb761afc5f2f0cd21e8173e37c617a482226f0ebf941c2a9df2, 0x2534005512b94c1fc7c0f5ac13267721d5607332a96cd114d46929e3518ddcd2);
        vk.IC[15] = Pairing.G1Point(0x292bf5e45679609a0b50e5f500cfba86dda4fc33e96df4b9f760b17195ecf239, 0x8101a3b3aa3927c62e8a529e91577c900c87ac30b42f9d35fa4dc91864f0ca1);
        vk.IC[16] = Pairing.G1Point(0xad12e32bba0fa08dea505db03c9cee0fe8b0a18fe94de68e580fb991249f66a, 0x82992b3038993a5bd6db6a0c583a30bfc6c2604909229d3557c0a4950986fe);
        vk.IC[17] = Pairing.G1Point(0x1aa9dba0f93b5cd1b7817f91f72752db946eb8004d4337d07a30e9de3eab44b5, 0x23e18d53076c8582f6f9a995639830aeb4c4b4b03d82cd48ecc8301b3f8662e5);
        vk.IC[18] = Pairing.G1Point(0x1b7434cbdf67a6d40af871cd0cc090e51f323b34d740c2e92c772df7f6d3dd70, 0x1439db7042eeca23f3fed4acc78028a5bc5e6df29a08d2b0582261188828dda9);
        vk.IC[19] = Pairing.G1Point(0x229dce1fb2db5535320d67ff716c11f9b67ecb4c0bce82067f77dafc9fdf8168, 0x190c9f9810227f609506d402fa2dbf4777ce85657cf1dbe3c1be611a9f5cda62);
        vk.IC[20] = Pairing.G1Point(0x16a437c4962703cabe6ab0900e9e7bca2ef1c8a5b8ba0eb5423eebf12d7e7fa3, 0xea5084349918db045f9c18805c2b9a0791f36e6f1e3024a2097094c062a9f3b);
        vk.IC[21] = Pairing.G1Point(0x9dea46e7f4ba6964f6abeceb5eddf09ba94924a182ccd45770464ed089d9e92, 0x18f612387f53dfd8004d23e655e8ce9bafc85287be8d78d79cc95f96bc4a2394);
        vk.IC[22] = Pairing.G1Point(0x2e63948760e8489df9a74519e655d84aecd454ddd455d971585e6650ef4ce782, 0x2b47622a05fc0da776563e32c993658ee77a82240e56409a5bbe1cecf1e9f374);
        vk.IC[23] = Pairing.G1Point(0x1e41f14d7db980556fc743751aa930dd7fa8478e8313862fd758b3354088195b, 0x5065ac3a21f40446db48ee72fb83e509666071477b6d70629944dcd2f9233c5);
        vk.IC[24] = Pairing.G1Point(0x100ba3306f72fe7f332f0712676a360eae6d9dd14df86a6e83a03e26f168fdf1, 0xc2fb83becfc8480cf65e8052bd0cccce83ca051b5348dc933c21e7d128aec47);
        vk.IC[25] = Pairing.G1Point(0x3228d3e97611d734fd857987fcb3b61992e7d7a42b5b3f5104db80fcc47806e, 0x35f067f6e2aab0a467b98ffea29655b6326e8598d26a578b7a6888486e0ed75);
        vk.IC[26] = Pairing.G1Point(0x1d6ad21d4547844916ef9d194c3437bd6e66e436dae71a7ed2a4a8f4fee822bb, 0x203ceba0d8073841cb112653c8ae5c05a2ce33cb97fa1fa43daeddd77219e73d);
        vk.IC[27] = Pairing.G1Point(0x37dc6b8f63dda459683d1395cc17efd96a0df65aba9ca28326fb07848a4bf1a, 0x2e31b1a9726dce633b8b976cc6a8d8cf385fe4f40b9c841a4867ee41a1a50d27);
        vk.IC[28] = Pairing.G1Point(0x14a80fb953cde0a9c9f438609d96c95716e7a15dbe92e7134830c884d9d44676, 0x29756a12e0561d2901b9373832047e5b62ceda43318dd8669d95b4afbf4f4e6a);
        vk.IC[29] = Pairing.G1Point(0x10fbdd162d4abe75117a4c4c6660f958a6b50ea79f8b95b844a3821ee7dd20b2, 0x2f7fc74b15285b278c596a3e292f2359a23d414206236fcb85f78ab9cef119);
        vk.IC[30] = Pairing.G1Point(0x1484ef98376c8a4fe60477b6a85c95091835174a5734e2d79bb10c9982480179, 0x4166d8145371d46f8211b65375a1193fca9ec2a1f0f26a766c7c8c563c9d183);
        vk.IC[31] = Pairing.G1Point(0xdccb6530672518c6c113a5819639fd94111b10e823da37c3f933c8f9d67f45d, 0x1d08e49e5c5ab1af5251da9509fbedc35fcfcfbcacf1ce8951e382e58f7f8ad4);
        vk.IC[32] = Pairing.G1Point(0x2c3d04d272504e3320d0c250031874304e19af05d9fe4957481338d89fcaba29, 0x19eb55be57734cfaa4cdfdd4cb55ed3ac7c251f0c8a208966e910dc9a4bfa41e);
        vk.IC[33] = Pairing.G1Point(0x93655e5e7f857cc03315643df767696ae0ae04f319022d595bd0dc262ffd720, 0x15eb165131cd57d724512538a9d3374731e4eb5b6ff443d421f00649d9926c7b);
    }
    function verify(uint[] input, Proof proof) internal returns (uint) {
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++)
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        vk_x = Pairing.addition(vk_x, vk.IC[0]);
        if (!Pairing.pairingProd2(proof.A, vk.A, Pairing.negate(proof.A_p), Pairing.P2())) return 1;
        if (!Pairing.pairingProd2(vk.B, proof.B, Pairing.negate(proof.B_p), Pairing.P2())) return 2;
        if (!Pairing.pairingProd2(proof.C, vk.C, Pairing.negate(proof.C_p), Pairing.P2())) return 3;
        if (!Pairing.pairingProd3(
            proof.K, vk.gamma,
            Pairing.negate(Pairing.addition(vk_x, Pairing.addition(proof.A, proof.C))), vk.gammaBeta2,
            Pairing.negate(vk.gammaBeta1), proof.B
        )) return 4;
        if (!Pairing.pairingProd3(
                Pairing.addition(vk_x, proof.A), proof.B,
                Pairing.negate(proof.H), vk.Z,
                Pairing.negate(proof.C), Pairing.P2()
        )) return 5;
        return 0;
    }
    event Verified(string s);
    function verifyTx(
            uint[2] a,
            uint[2] a_p,
            uint[2][2] b,
            uint[2] b_p,
            uint[2] c,
            uint[2] c_p,
            uint[2] h,
            uint[2] k,
            uint[33] input
        ) public returns (bool) {
        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.A_p = Pairing.G1Point(a_p[0], a_p[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.B_p = Pairing.G1Point(b_p[0], b_p[1]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        proof.C_p = Pairing.G1Point(c_p[0], c_p[1]);
        proof.H = Pairing.G1Point(h[0], h[1]);
        proof.K = Pairing.G1Point(k[0], k[1]);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }

        require(verify(inputValues, proof) == 0);
        emit Verified("Transaction successfully verified.");
        return true;
    }
}
