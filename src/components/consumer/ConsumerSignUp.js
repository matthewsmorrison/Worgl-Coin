import React from 'react';

import { convertAndPad, sha256compression, binaryToHex, hexToBinary } from '../../utils/hash';

export class ConsumerSignUp extends React.Component {
  constructor(props) {
    super(props);
    // this.addHash = this.addHash.bind(this);
   this.state = {
     name: ' ',
     nationalInsurance: ' ',
     dateOfBirth: ' ',
     secret: ' ',
     combinedString: null,

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
   }
 };

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
    newState.witnessCompute = './zokrates compute-witness -a ' + newState.bits32hashspace + ' ' + newState.paddedBitsSpace + ' | tail -n 0 > computeWitness.txt';

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
                <td></td>
                <td style={{textAlign:"center"}}><a className="button special">Verify Details</a></td>
              </tr>

            </tbody>
            </table>
            </div>



          	</div>

            <div className="box">
            <p><strong>For developer use</strong></p>
            <div className="box">

            <div className="table-wrapper">
            <table>
            <tbody>

              <tr>
                <td>Combined String</td>
                <td>{this.state.combinedString}</td>
              </tr>

              <tr>
                <td>Binary Padded to 512 Bits</td>
                <td>{this.state.paddedBits}</td>
              </tr>

              <tr>
                <td>Binary Padded to 512 Bits With Space</td>
                <td>{this.state.paddedBitsSpace}</td>
              </tr>

              <tr>
                <td>Hex Form of Input</td>
                <td>{this.state.paddedHex}</td>
              </tr>

              <tr>
                <td>The SHA256 Hash</td>
                <td>{this.state.sha256hash}</td>
              </tr>

              <tr>
                <td>The SHA256 (Binary)</td>
                <td>{this.state.sha256hashbinary}</td>
              </tr>

              <tr>
                <td>The First 32 Bits</td>
                <td>{this.state.bits32hash}</td>
              </tr>

              <tr>
                <td>The First 32 Bits With Space</td>
                <td>{this.state.bits32hashspace}</td>
              </tr>

              <tr>
                <td>Total witness compute</td>
                <td>{this.state.witnessCompute}</td>
              </tr>

            </tbody>
            </table>
            </div>
            </div>
            </div>
          </section>

        );
    }
}
