// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Amended by Matthew Morrison 2018

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
contract Verifier {
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
        vk.A = Pairing.G2Point([0x209181b118de4da564c810c73bb19ea5229df5666a42e1a83203e83fed3ce502, 0xa174f492b5315b54ac6fa630125abc303a12b529eedd1980c2b26b5a49e5524], [0x928dc3e4f32a01bebb555eae9b660d6ef3ae98abd4b336e2b6c91d70e611fd3, 0xc7812a5a6726a7c081eeb4a2b5fcea24d62abda46c8417d6296a2db37ad4107]);
        vk.B = Pairing.G1Point(0x2ad4ffecd47d6357500fa35d91640143250143a82e9519816a46e7e6780dcc0, 0x15c6b9d0b2db8d7628ec7add8743feb19d70ce46e4340fab73558fc900675d94);
        vk.C = Pairing.G2Point([0x45614332c087d8aa9b9c1e975934657ae734b71d87015af97d123ee16a8b23, 0x1546de04c92e4c25ceb0655a2a05538a99ccd9950a952f96460306511ff77ae2], [0x2c8b39be7b43f1d2a93d6f94f04291ee8ad689d1c7af0886cc807b248d793b18, 0x2628396ecf5f6ee8439fd79411595205a1dea459a8b1950ef756de9ad7506236]);
        vk.gamma = Pairing.G2Point([0xa839ce1f599c13125cb9765e78566a1881c3db375ba4eb1c104c2e1cecee9d7, 0x16c3acc28c57a71945692c0681c84b4969c8d549c7c3d73967600d725daf0e89], [0x92390615332296075c89d8bf8d509d90b4415cce4de9dc3fb684d80310baaf2, 0x2589041d8c93c7e22c03fd944fdb81b021e06744580fc4fc8f5bb120c24fc75c]);
        vk.gammaBeta1 = Pairing.G1Point(0x16f7b5419d565803b10e22eb49a3a97c651c279fb90ab1b673fc86e631b12728, 0x257a7a4f4a43162f77bae54c4d02545d137d88258736ef923eb2d24c5fdaa4f);
        vk.gammaBeta2 = Pairing.G2Point([0x2ea48f63450991e520e578108a507125c47b11ee5a83886a9496e4808460f2f0, 0xd0b876449a69191492d95b2eadd126e91ec554429ff9580b2305166bb8140d1], [0x5f6b209021b8f9b7a6509a144567c71464638d788f9a97c4e181b19f1d570ab, 0x18b808044bd126af711ca16e7fd7b0fff73b24fabb592582c5fba1d9cb6ed159]);
        vk.Z = Pairing.G2Point([0x128079f1219b8e0ba67ac6d3d1715ce4a7878d6abc12d6fce7c6daf2e9ee71f2, 0xdb769b7afd8350c08d003639f46914e1d468c97e59632a24b49ec4b9e09de50], [0x19e5222d506743c88582da174cb8d18a77b6705fa5ee244d3dd06d32584f6cc5, 0x2d8bf4956ef5c97eace055a28e683f62b676299e8ab4463cb3f59f21a92ddead]);
        vk.IC = new Pairing.G1Point[](34);
        vk.IC[0] = Pairing.G1Point(0x2e6420f9c711b97f7013d0121dab715dc0d52e3aae4daa7f68daa5608b790ddb, 0xb37ad309496050e63c266e05c4b65271033309e42f7d8a61f544744a2f100a4);
        vk.IC[1] = Pairing.G1Point(0x265e7560649de6153004f40bc1ec0d51aca889d2ebadc88c177ccb9a3cd83b83, 0x2139595e326cd6afb5df02ffc8cf54c124474ffdf042a0ddd028e133d93457af);
        vk.IC[2] = Pairing.G1Point(0x14674b43a01e2bb7c764a88e869b05fd477e91dc7f0999206321bc31afe8946e, 0x2ba7d64323b1f1e46a722e7b4d91fb00cad475b2d28d3d4a9e0386521936ff28);
        vk.IC[3] = Pairing.G1Point(0x1867615dfbd6d77dd64b876aad1b88928f12d39e7c38ce845910e616b46b6f71, 0x56a2e7cb5d39e66dc5bd503a4beea7b86d6c5cd08ab587c0d1bd4141bc1b2bf);
        vk.IC[4] = Pairing.G1Point(0x6296b1e61568834129eb55cc4c0bf30c3328e2b5728683e105228026143a213, 0xb80a54d8172d2ee1351a024d7aec0cbf9bb364514b2fbae70ed0d1847b96d52);
        vk.IC[5] = Pairing.G1Point(0xe0517bf7fe1ce199fe0a56e44185b67b2d317b5ca3b01df01c2ef0b0660e815, 0x20abd97828f92ab350aaf4e6b8602fe15b077e5be85febd13dbe489399f1213);
        vk.IC[6] = Pairing.G1Point(0x1ea4aa4723851d8e80939fbd47a06a710e286ace9ffe69636510a8bf3624b385, 0x3d89f46f3ace3e53a2ce3a24f278fc1a81b70c80bcdc3ef1ddab0464198f133);
        vk.IC[7] = Pairing.G1Point(0x25b33ce16b0e939deec3b4fdbce600997dcb90ed75974f9d54b02f35d9575926, 0x4a5fb8053dfec24d4679251532613a8ab3cba5ef69d1d4bee708ec320a7ad00);
        vk.IC[8] = Pairing.G1Point(0xdb9b9940d6417e0fe6e1ee1118f2fec41b0a5bfe216a6a2a5411e241a617df, 0x23e44caf4938dbdb51eaeb3f6c35389dd60d8db23cc3c8caf1d244d63e2a320f);
        vk.IC[9] = Pairing.G1Point(0x1b62e2fe3d0387a75b890af75959446d7980c7b88f7292f992c923ef49081141, 0x2567c50b6fcf4ac6f3d48a32a3788dc64c29c389819ffaeb68c1c9eca7b0feb4);
        vk.IC[10] = Pairing.G1Point(0x1e8acde8f219f2019abdb6ad7a6d76c50ac77d24f35ffa94e9b417534641898b, 0x2bdf963deae2b967b18af4365bd0e41a8c2d26216e5f00f01c236a39d15173bf);
        vk.IC[11] = Pairing.G1Point(0xf662ff601d4c7139fa20a699d9330425a6cffe93aa7d0b30233ab6e6c339a3e, 0x9a57db56269d3a115e00dad3bea252285b1026df7b100d5b0136904102ca6dc);
        vk.IC[12] = Pairing.G1Point(0x10dc5cedcf8c2acc4e59d99b38e523982da4f9a11e9c8dd191509a9629b29a5d, 0x1c9e0272509351f17d5ff1e487126124b4187179f678f052d723b2598b09cc02);
        vk.IC[13] = Pairing.G1Point(0x1c7ef79385c142188489d68164bb3a8161829b04de93e9738ffdbe11f77f570c, 0x1fdd978eb5d99c9325a089c159ef5eee046c97319fab5ca5885454eac9c0803a);
        vk.IC[14] = Pairing.G1Point(0xcac907fb7b23f074d2a1e563a3c54d2d7bcd9c9b187803249a5f2eee9f8af0d, 0x193c3cdb0fc573b4f76015b8e86cf060b282328350137ce1d6e90c03819c7e0d);
        vk.IC[15] = Pairing.G1Point(0xabefc52f9993136523a37c01559dca559aca22b67f514dae1610ec81cd83b36, 0xed40b92fbacda7e8fa072d4351b1368031450ef54060a16f85971f04ca41c52);
        vk.IC[16] = Pairing.G1Point(0x13c009cbc53a8acdf90ba8b4a15903dd0c1373b9b58200a728f50674bfb12f92, 0x2a2a510e495ecd093019645e7eb0a115096002fbdb021681d5b1ab243a79431f);
        vk.IC[17] = Pairing.G1Point(0x29f94980005d13db07907f02f9916a273165d29b8400909009a686ed3f746df0, 0x154049f104c2840503aad24ca4caa27fad3e311d0bc557f28043fa2a5934982c);
        vk.IC[18] = Pairing.G1Point(0x19a31c64fc029a9208263e2f8208c0e1194fb613fb97cca283b8c54b4442bcbd, 0xb225fe725ab90165fdc8162df378a0167ccefbeb742b5113e32a28a58457b3a);
        vk.IC[19] = Pairing.G1Point(0x14b7e356b17a33cf4acd28e24572f9fa3315cb39ac9cc24d359df2106bd4cc1a, 0x1c62fbbd862995824a201bff8871eac578a406604673115a64de3861bdec8497);
        vk.IC[20] = Pairing.G1Point(0x14c9c3a9c5971fde9bb5a2972abeb96d3691c2eba30d8e0201c54887fbdb9b93, 0x79a230bae38f20b8311747a86c141dce111262b09351a1e8c44f68873d55b99);
        vk.IC[21] = Pairing.G1Point(0x1b1fc938b8ccd1377290955bba4563b76fea12343f12937ca1aec71a3b10ff1d, 0x24d23552d45dc2e4805a6218f7bcc67028b249c5f1663feb595d379853e9856f);
        vk.IC[22] = Pairing.G1Point(0x69f9a8a7c966a4910fc0dbbe75f109739d766b081e559d4cd8cda3418c6518b, 0xa44f81f92d9474132d67c865770a749cc03ba320674dfba9bd3493b718c4bec);
        vk.IC[23] = Pairing.G1Point(0x28d26e0920a886c43a29abd3e0f3c94c3b7a4b7357d80fa1a7980b7b8e862504, 0x112f34ec82598696e6298fc52e44094f36aa812f953256219509443608b3b5b9);
        vk.IC[24] = Pairing.G1Point(0x1989f6dfea4314142c81a45a5b7ea3193c528104ced0660c5cbc9381be6a607d, 0x1229c71df4f7c5f435a596f39bf655952912514d09bae16eca7b51922b73ed6a);
        vk.IC[25] = Pairing.G1Point(0x2fcba731eb6d3b29117ae5ee3d1f043b1d3e38a89394e290c6b0f314e5029d2a, 0xf4f9876d6a57da02e11692eef2abb600d786afaadb85726c9fab3e52ea8ae5c);
        vk.IC[26] = Pairing.G1Point(0xdb61572af8fdd2b87afbda1f805557dd4ed747a511469e40614a3f3f2a0af39, 0xe81a3715fd5eba48a03cd93282ec0d8c5f7d44952c39476ffa4b657a00908f1);
        vk.IC[27] = Pairing.G1Point(0x1527d75eae951275e1755efcc15f520bc7370900e31043bf6d6e3285dea1685c, 0x12e0d0787db9a78387b5d2c8c56c309e6d916e583aa9c304a299e7e44c10a275);
        vk.IC[28] = Pairing.G1Point(0x1c8fd182493813867afb48a82d9942c30405a81ecb485b2db87e666559d55c09, 0x1b219d1db9b42cfa4874d0a1850d04a1ea70d231b491b3b907576df5970a845f);
        vk.IC[29] = Pairing.G1Point(0x2dc2e6f24782a0e90611d77c8ffcaa99ac511a76665e94b063e45accd4cfd63c, 0x19e0457697895c8a5f2b73a6f1aec142ecd855069c1fdeafe895b0c7c210e8e3);
        vk.IC[30] = Pairing.G1Point(0x217240e5f7cd17a3f981deac2ca214c8e22e5d76f7be4f9d4063ae55361d59b4, 0xc3ff38fa387bcd7b8676388f1eef382a95c00cb09bf0074e7784fecdd269aa3);
        vk.IC[31] = Pairing.G1Point(0x5907031808f7f3e624e296392087a19c58a479029bd1be32a884e9646078caa, 0x2827964e014211646a05c5818197a9d7a0b28eba0fc7da198ea2a1465982ce55);
        vk.IC[32] = Pairing.G1Point(0x1d46973a09893c7ac7854d3f0ba9372eb1349131cd6a76baf1bb032c5dd86d43, 0x14271b3d41987430f3799504ee896f945c578e1cff0810916459e6f482c53e81);
        vk.IC[33] = Pairing.G1Point(0x17c5e086d939b05a42de69136d41db097cd3843e471c7ce7c7f7d3902f118e62, 0x8d64df9e02fc0f5b8750bbb8f12de4eb3af941c3d7228f6ccaad5692909c21);
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
        ) public {
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
    }
}
