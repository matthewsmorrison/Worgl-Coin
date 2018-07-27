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
     verifyStatus: 0
   }
 };

  async verifyDetails(e) {
    this.setState({verifyStatus:1});

    e.preventDefault();
    console.log('About to verify details');
    callServer(this.state.witnessCompute)
      .then(res => {
        let response = res;
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
        let ethereum = this.props.ethereum;
        return ethereum.contractInstance.consumerSignUp(inputHash, A, A_p, B, B_p, C, C_p, H, K, I,
         {
           from: ethereum.currentAccount,
           value: ethereum.web3.toWei(0, "ether")
         }).then((transactionHash) => {
           console.log(transactionHash);
           if(transactionHash.receipt.status === '0x00') this.setState({verifyStatus:3});
           else this.setState({verifyStatus:2});
         });
      })
      .catch(err => {
        console.log(err);
        this.setState({verifyStatus:3});
      })
  }

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
                <td><input type="text" id="nationalInsurance" onChange={evt => this.updateState(evt)} required/></td>
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

                <td style={{textAlign:"center"}}>
                  <a onClick={this.verifyDetails} className="button special fit small">Verify Details</a>
                </td>

                <td style={{textAlign:"center"}}>
                  { this.state.verifyStatus === 1 && <div><a style = {{marginBottom: "10px"}} className="fa fa-spinner fa-spin fa-3x"></a><br/><p>We are just confirming your details.<br/>You should get a metamask pop-up shortly (1 min).</p></div> }
                  { this.state.verifyStatus === 2 && <div><a style = {{marginBottom: "10px"}} className="far fa-smile fa-3x"></a><br/><p>You are all set.<br/>Just refresh the page to start using the service.</p></div> }
                  { this.state.verifyStatus === 3 && <div><a style = {{marginBottom: "10px"}} className="far fa-frown fa-3x"></a><br/><p>Something went wrong and we could not sign you up.<br/>Please go to our FAQ page to find out more.</p></div> }
                </td>



              </tr>

            </tbody>
            </table>
            </div>
          	</div>
          </section>

        );
    }
}
