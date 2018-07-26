import React from 'react';

import { convertAndPad, sha256compression, binaryToHex, hexToBinary } from '../../utils/hash';
import { callServer, parseServerResponse } from '../../utils/serverInteraction';

export class ConsumerSignUp extends React.Component {

  constructor(props) {
    super(props);
    this.verifyDetails = this.verifyDetails.bind(this);

   this.state = {
     name: ' ',
     nationalInsurance: ' ',
     dateOfBirth: ' ',
     secret: ' ',
     combinedString: ' ',

     // This will be used for computing the witness
     paddedBits: null,
     paddedBitsSpace: null,
     paddedHex: null,

     sha256hash: null,
     sha256hashbinary: null,

     // This will be used for computing the witness
     bits32hash: null,
     bits32hashspace: null,

     //Witness compute
     witnessCompute: null,
     response: null,
     verifyStatus: 'nothing'
   }
 };

  async verifyDetails(e) {
    let newState = this.state;
    newState.verifyStatus = 'verifying';
    this.setState(newState);

    e.preventDefault();
    console.log('About to verify details');
    callServer(this.state.witnessCompute)
      .then(res => {
        let response = res;
        // console.log("The server response is: " + response.proofDetails.data.data);
        var A = parseServerResponse(response.proofDetails.data.data).A;
      	var A_p = parseServerResponse(response.proofDetails.data.data).A_p;
      	var B = parseServerResponse(response.proofDetails.data.data).B;
      	var B_p = parseServerResponse(response.proofDetails.data.data).B_p;
      	var C = parseServerResponse(response.proofDetails.data.data).C;
      	var C_p = parseServerResponse(response.proofDetails.data.data).C_p;
      	var H = parseServerResponse(response.proofDetails.data.data).H;
      	var K = parseServerResponse(response.proofDetails.data.data).K;

        var I = this.state.bits32hashspace.split(' ');
        I.push("1");

        var inputHash = "0x" + this.state.sha256hash;

        console.log(inputHash);
        console.log(A);
        console.log(A_p);
        console.log(B);
        console.log(B_p);
        console.log(C);
        console.log(C_p);
        console.log(H);
        console.log(K);
        console.log(I);

        let ethereum = this.props.ethereum;
        let contractResponse = ethereum.contractInstance.consumerSignUp(
          inputHash, A, A_p, B, B_p, C, C_p, H, K, I,
         {
           from: ethereum.currentAccount,
           value: ethereum.web3.toWei(0, "ether")
         });
         console.log("New consumer signed up: " + contractResponse);
      })
      .catch(err => console.log(err));
  }

  displayIcon() {
    if (this.state.verifyStatus === 'nothing') return ;
    else if (this.state.verifyStatus === 'verified' ) return <a style={{marginLeft: "50px"}} className="fas fa-check fa-2x"></a>;
    else return <a style={{marginLeft: "50px"}} className="fa fa-spinner fa-spin fa-2x"></a>;

  }

 // async addHash(e) {
 //   e.preventDefault();
 //   console.log('About to add a new business');
 //   let ethereum = this.props.ethereum;
 //   let hash = this.state.consumerHash;
 //
 //   console.log(ethereum);
 //   let response = ethereum.contractInstance.consumerSignUp(hash,
 //    {
 //      from: ethereum.currentAccount,
 //      value: ethereum.web3.toWei(0, "ether")
 //    });
 //    console.log("New consumer sign up: " + response);
 //  }

  updateState(evt) {
    let target = evt.target;
    let id = target.id;
    let newState = this.state;

    switch (id) {
      case 'name':
        newState.name= target.value;
        break;

      case 'nationalInsurance':
        newState.nationalInsurance= target.value;
        break;

      case 'dateOfBirth':
        newState.dateOfBirth= target.value;
        break;

      case 'secret':
        newState.secret= target.value;
        break;

      default:
        console.log("Not updating any state.");
    }

    newState.combinedString = newState.name + newState.nationalInsurance + newState.dateOfBirth + newState.secret;
    newState.combinedString = newState.combinedString.replace(/\s/g, '');
    newState.combinedString = newState.combinedString.toLowerCase();
    newState.paddedBits = convertAndPad(newState.combinedString);
    newState.paddedBitsSpace = newState.paddedBits.split('').join(' ');
    newState.paddedHex = binaryToHex(newState.paddedBits).toLowerCase();
    newState.sha256hash = sha256compression(newState.paddedHex);
    newState.sha256hashbinary = hexToBinary(newState.sha256hash);
    newState.bits32hash = newState.sha256hashbinary.substring(0,32);
    newState.bits32hashspace = newState.bits32hash.split('').join(' ');
    newState.witnessCompute = newState.bits32hashspace + ' ' + newState.paddedBitsSpace;

    this.setState(newState);
  }



    render() {
        return (

          <section id="main" className="container">
          	<header>
          		<h2>Consumer Sign-Up</h2>
          		<p>Sign-Up To Receive WörglCoin by Verifying Your Details.</p>
          	</header>
          	<div className="box">

            <div className="table-wrapper">
            <table>
            <tbody>

              <tr>
                <td>Your Ethereum Address</td>
                <td>{this.props.ethereum.currentAccount}</td>
              </tr>

              <tr>
                <td>Your Full Name (With Middle Names)</td>
                <td><input type="text" id="name" placeholder="e.g. Matthew Morrison" onChange={evt => this.updateState(evt)}/></td>
              </tr>

              <tr>
                <td>Your National Insurance Number</td>
                <td><input type="text" id="nationalInsurance" onChange={evt => this.updateState(evt)}/></td>
              </tr>

              <tr>
                <td>Your Date of Birth</td>
                <td><input type="text" id="dateOfBirth" placeholder="In the format 'ddmmyyyy'" onChange={evt => this.updateState(evt)}/></td>
              </tr>

              <tr>
                <td>The Secret Phrase Sent To Your Address</td>
                <td><input type="text" id="secret" onChange={evt => this.updateState(evt)}/></td>
              </tr>

              <tr>
                <td>{this.state.response}</td>
                <td style={{textAlign:"center"}}><a onClick={this.verifyDetails} className="button special">Verify Details</a>{this.displayIcon()}</td>
              </tr>

            </tbody>
            </table>
            </div>
          	</div>
          </section>

        );
    }
}
