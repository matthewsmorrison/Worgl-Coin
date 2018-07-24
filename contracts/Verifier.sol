// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

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
        vk.A = Pairing.G2Point([0x24c5626225bc8b901da748ec4fd554780e89ed5ad6d3a6e51405fdb19fd3136f, 0xe75dbdd3fae4a1b383183d9f8b137ecf5028fffb0be77d87efbf014d4469000], [0x19a073c6426da062a56fb930f605fdf3e07c924af124001f35c3a680cbee71fd, 0x39d73c3c7f0f871e3ef6f9f68cee96556d372b7e71ba2f525de5f2d5dd227c]);
        vk.B = Pairing.G1Point(0x2de83e919bf88860be77c05e490920c8cd94818c394027bb3a4d8a2e1c882e74, 0x652b8c1a023e10d713bc3d2505bda1478ac6006fa48c15cf6035d1ad53da3b);
        vk.C = Pairing.G2Point([0x8fdb8d7f4f2141fa6397223362ee750aeaa539874638b71a55bb2c4f1120dae, 0x222b753cf9899b3252eb7635fb5b8184c5c3359d7c485b9b427bb8ff75a69272], [0x208b9090bfd2059d923ca60876f06bf4e0b57cef2a481681d57caa08ff196433, 0x1a34991c5136e299b3ba3aeb0f302a94cbec355c85fe3befbee19e84a60c9bbd]);
        vk.gamma = Pairing.G2Point([0x22c2c155b51003d5881d1b4b197d4c163d8a0de97587cc41ecd2b7961bc7ee24, 0x274d4e1a2659f069df2b7480df09aaf0f674b45b81160710211442d20859373a], [0x290d7bbd43ae7adf5518eb69bf06dad3ab5242f3341dfac1b48d219f2b5681b3, 0x2de5057a4e410635bb087b6e3c27173d290dab2f3c75a8ac834593bc9364d36a]);
        vk.gammaBeta1 = Pairing.G1Point(0x6eea25b020e6357c8ab8ca1ac2a2b828c19b9cdf22cec2ef7340e4cdc613fb4, 0x24c04434ee0e72d9cebff3884b21aa5f6e0a32817751d1fe75b7c30f5d90beb);
        vk.gammaBeta2 = Pairing.G2Point([0x1507f7f6c8c2c74f7d521e375fcdfc5560f21b675c15206ea6266f109dd8ea27, 0x6782ea9f7c767c3e65f722bea32f59b05534182d2f8688571842f2e7cb3b349], [0x268fd69230c721f5b169582f58530b36d9d3e32c520f1366de0f37616da516c7, 0x2006074c2cf407298b3ff7f0787cbe8b6982f088ad943f513a08929f444f7f3a]);
        vk.Z = Pairing.G2Point([0x25f5ffbc7dcfc72249e3a25b57bc29e28985a38cb5b8e90594944ee04d76f344, 0x19a1506fc22b7b341552d7f15c84a55c1137070313018181136498459bbf2b97], [0x17f41c82e6ff57b92319e6c5adfa95815f2c6465a911b1f11833dcc4e26f349d, 0xda4b0de203fcbd99f6302732d74da6bafcb924bf3c0a70761cc1d7cae5573f6]);
        vk.IC = new Pairing.G1Point[](7);
        vk.IC[0] = Pairing.G1Point(0xba222bdf67f3fb0728ee0079f04674a8a74cec9b060ac587029f2913e1f21e9, 0x138841507749e66be43fbfd1d372c1206600d8966938ad8c7ea61cea9d139a37);
        vk.IC[1] = Pairing.G1Point(0x121cb2ac6d4f0a2b238f9a54e826f0435366d19f3edf4daad122634e90979f1a, 0x7de4d76dd398d4034785db0c1a287e95bb7dd8a34afed104d78e9586d1d9edb);
        vk.IC[2] = Pairing.G1Point(0xb3ccb6916ff98b6d869ffbe817c780a259d34324d791d26422d2525b7a48667, 0x2f26c8088922a7088c20b3d4e7625f23dd14585b6cdab4646d507a43ce0fae5a);
        vk.IC[3] = Pairing.G1Point(0x4191e84740f09f2d33ae051f645a9704d042c020b89afc625602a2b204b4b21, 0x26641d041053d6d802312124bed1012514ef0513a8d9da0a8b408ae6b0f963a0);
        vk.IC[4] = Pairing.G1Point(0x20e6adfd2acfaa53d479fcaaa18e3e4ef6b2cd8afea78df497b7db062d01f320, 0x9d4b62fc62c1ed11db3cd6f2f8b7bc241b90b2baaa06fc9d9a9c1eeba10f909);
        vk.IC[5] = Pairing.G1Point(0xb443474b7513011d1632ded467d3467b32c22a3d3fc448ff054d9495d9ca818, 0x13a7cf44c6e80cd7095be02b59ba18e1e9ffdfcd57141fe3cb04f98cdbfc070b);
        vk.IC[6] = Pairing.G1Point(0x1838167fa0df0e5e383df97e973b302e121a9479f5931c4486e2b6d3078680a6, 0x22925fecc84a81568621bb1c366b32937678e4c849afe23985c319d44c93da42);
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
            uint[6] input
        ) public returns (bool r) {
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
        if (verify(inputValues, proof) == 0) {
            emit Verified("Transaction successfully verified.");
            return true;
        } else {
            return false;
        }
    }
}
