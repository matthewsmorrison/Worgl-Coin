import React from 'react';
import { convertAndPad, sha256compression, binaryToHex } from '../../utils/hash';

export class Administration extends React.Component {
  constructor(props) {
    super(props);
    this.addBusiness = this.addBusiness.bind(this);
    this.addConsumerHash = this.addConsumerHash.bind(this);
    this.transferFunds = this.transferFunds.bind(this);
    this.changeTokenBalance = this.changeTokenBalance.bind(this);
    this.changeTokenValue = this.changeTokenValue.bind(this);
    this.distributeFunds = this.distributeFunds.bind(this);
    this.changeOwner = this.changeOwner.bind(this);

   this.state = {
     businessAddress: 0,
     businessName: null,
     consumerName: ' ',
     consumerNationalInsurance: ' ',
     consumerDateOfBirth: ' ',
     consumerSecret: ' ',
     consumerHash: null,
     transferFunds: 0,
     tokenValue: null,
     tokenNumber: null,
     newOwner: null
   }
 };

 async addBusiness(e) {
   e.preventDefault();
   console.log('About to add a new business');
   let ethereum = this.props.ethereum;
   let businessAddress = this.state.businessAddress;
   let businessName = this.state.businessName;

   console.log(ethereum);
   let response = ethereum.contractInstance.addBusiness(businessAddress, businessName,
    {
      from: ethereum.currentAccount,
      value: ethereum.web3.toWei(0, "ether")
    });
    console.log("Add new business: " + response);
  }

  async addConsumerHash(e) {
    e.preventDefault();
    console.log('About to add a new consumer hash');
    let ethereum = this.props.ethereum;
    let consumerHash = this.state.consumerHash;

    console.log(ethereum);
    let response = ethereum.contractInstance.addConsumerHash(consumerHash,
     {
       from: ethereum.currentAccount,
       value: ethereum.web3.toWei(0, "ether")
     }).then(function() {
       console.log("Add new consumer hash: " + response);
     })
  }

  async transferFunds(e) {
    e.preventDefault();
    console.log('About to transfer funds to contract');
    let ethereum = this.props.ethereum;
    let funds = this.state.transferFunds;

    console.log(ethereum);
    let response = ethereum.contractInstance.topUpContract(
      {
        from: ethereum.currentAccount,
        value: ethereum.web3.toWei(funds, "ether")
      });
    console.log("Adding funds to the contract: " + response);
  }

  async changeTokenBalance(e) {
    e.preventDefault();
    console.log('About to change number of tokens distributed');
    let ethereum = this.props.ethereum;
    let newNumber = this.state.tokenNumber;

    console.log(ethereum);
    let response = ethereum.contractInstance.changeTokenBalance(newNumber,
      {
        from: ethereum.currentAccount,
        value: ethereum.web3.toWei(0, "ether")
      });
    console.log("Changing the top up level " + response);
  }

  async changeTokenValue(e) {
    e.preventDefault();
    console.log('About to change token value');
    let ethereum = this.props.ethereum;
    let newValue = this.state.tokenValue;

    console.log(ethereum);
    let response = ethereum.contractInstance.changeTokenValue(newValue,
      {
        from: ethereum.currentAccount,
        value: ethereum.web3.toWei(0, "ether")
      });
    console.log("Changing the value of each token " + response);
  }

  async distributeFunds(e) {
    e.preventDefault();
    console.log('About to distribute funds');
    let ethereum = this.props.ethereum;

    console.log(ethereum);
    return ethereum.contractInstance.resetTokenBalance(
      {
        from: ethereum.currentAccount,
        value: ethereum.web3.toWei(0, "ether")
      }).then((transactionHash) => {
        console.log(transactionHash);
   })
   .catch(err => {
     console.log(err);
     this.setState({verifyStatus:3});
   })
  }

  async changeOwner(e) {
    e.preventDefault();
    console.log('About to change owner');
    let ethereum = this.props.ethereum;
    let newOwner = this.state.newOwner;

    console.log(ethereum);
    let response = ethereum.contractInstance.changeOwner(newOwner,
      {
        from: ethereum.currentAccount,
        value: ethereum.web3.toWei(0, "ether")
      });
    console.log("Changing the contract owner " + response);
  }

  updateState(evt) {
    let target = evt.target;
    let id = target.id;
    let newState = this.state;

    switch (id) {
      case 'businessAddress':
        newState.businessAddress = target.value;
        break;

      case 'businessName':
        newState.businessName = target.value;
        break;

      case 'funds':
        newState.transferFunds = target.value;
        break;

      case 'tokenNumber':
        newState.tokenNumber = target.value;
        break;

      case 'tokenValue':
        newState.tokenValue = target.value * 1000000000000000000;
        break;

      case 'newOwner':
        newState.newOwner = target.value;
        break;

      case 'name':
        newState.consumerName= target.value;
        break;

      case 'nationalInsurance':
        newState.consumerNationalInsurance= target.value;
        break;

      case 'dateOfBirth':
        newState.consumerDateOfBirth= target.value;
        break;

      case 'secret':
        newState.consumerSecret= target.value;
        break;

      default:
        console.log("Not updating any state.");

    }

    var combinedString = newState.consumerName + newState.consumerNationalInsurance + newState.consumerDateOfBirth + newState.consumerSecret;
    combinedString = combinedString.replace(/\s/g, '');
    combinedString = combinedString.toLowerCase();

    var paddedBits = convertAndPad(combinedString);
    var paddedHex = binaryToHex(paddedBits).toLowerCase();
    var sha256hash = sha256compression(paddedHex);
    newState.consumerHash = "0x" + sha256hash;

    this.setState(newState);
  }

  render() {
      return (
        <section id="main" className="container">
        	<header>
        		<h2>Administration</h2>
        		<p>The contract owner can interact with the contract here.</p>
        	</header>

            <div className="box">
            <h4><strong>Application Statistics</strong></h4>
            <hr/>
            <div className="table-wrapper">
            <table>
            <tbody>
              <tr>
                <td>Number of Consumers Registered</td>
                <td>{this.props.admin_data.noConsumers}</td>
              </tr>
              <tr>
                <td>Number of Businesses Registered</td>
                <td>{this.props.admin_data.noBusinesses}</td>
              </tr>
              <tr>
                <td>Number of Items Listed</td>
                <td>{this.props.admin_data.noItems}</td>
              </tr>
              <tr>
                <td>Number of Orders Made</td>
                <td>{this.props.admin_data.noOrders}</td>
              </tr>
            </tbody>
            </table>
            </div>
            </div>

            <div className="box">
            <h4><strong>Contract Interaction</strong></h4>
            <hr/>
            <div className="table-wrapper">
            <table>
            <tbody>
              <tr>
                <td style={{textAlign:"left", verticalAlign:"middle"}}>Add a new business</td>
                <td style={{textAlign:"left", verticalAlign:"middle"}}><input maxLength={42} type="text" id="businessAddress" placeholder="Ethereum Address (e.g. 0x...)" onChange={evt => this.updateState(evt)}/></td>
                <td><input type="text" id="businessName" placeholder="Name of Business (e.g. Ben's)" onChange={evt => this.updateState(evt)}/></td>
                <td style={{textAlign:"center"}}><a onClick={this.addBusiness} className="button special fit small">Add Business</a></td>
              </tr>

              <tr>
                <td>Add funds to the contract (in ether)</td>
                <td><input style={{textAlign:"center"}} type="number" id="funds" onChange={evt => this.updateState(evt)}/></td>
                <td>US${(this.state.transferFunds * this.props.ethereum.ethPrice).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td style={{textAlign:"center"}}><a onClick={this.transferFunds} className="button special fit small">Transfer Funds</a></td>
              </tr>

              <tr>
                <td>Change number of tokens distributed per month</td>
                <td><input style={{textAlign:"center"}} type="number" id="tokenNumber" placeholder="# of tokens" onChange={evt => this.updateState(evt)}/></td>
                <td>US${(((this.state.tokenValue * this.props.ethereum.ethPrice)/1000000000000000000) * this.state.tokenNumber).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/month</td>
                <td style={{textAlign:"center"}}><a onClick={this.changeTokenBalance} className="button special fit small">Change Token Top-Up</a></td>
              </tr>

              <tr>
                <td>Change value of each token</td>
                <td><input style={{textAlign:"center"}} type="number" id="tokenValue" placeholder="Ether Per Token" onChange={evt => this.updateState(evt)}/></td>
                <td>US${((this.state.tokenValue * this.props.ethereum.ethPrice)/1000000000000000000).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/token</td>
                <td style={{textAlign:"center"}}><a onClick={this.changeTokenValue} className="button special fit small">Change Token Value</a></td>
              </tr>

              <tr>
                <td>Reset the token balance</td>
                <td></td>
                <td></td>
                <td style={{textAlign:"center"}}><a onClick={this.distributeFunds} className="button special fit small">Distribute Funds</a></td>
              </tr>

              <tr>
                <td>Change the contract owner</td>
                <td colSpan="2"><input maxLength={42} type="text" id="newOwner" placeholder="Ethereum Address (e.g. 0x...)" onChange={evt => this.updateState(evt)}/></td>
                <td style={{textAlign:"center"}}><a onClick={this.changeOwner} className="button special fit small">Change Owner</a></td>
              </tr>



            </tbody>
            </table>
            </div>
            </div>

            <div className="box">
            <h4><strong>Add New Consumer Hash</strong></h4>
            <hr/>
            <div className="table-wrapper">
            <table>
            <tbody>

            <tr>
              <td>Full Name (With Middle Names)</td>
              <td><input type="text" id="name" onChange={evt => this.updateState(evt)}/></td>
            </tr>

            <tr>
              <td>National Insurance Number</td>
              <td><input type="text" id="nationalInsurance" onChange={evt => this.updateState(evt)}/></td>
            </tr>

            <tr>
              <td>Date of Birth</td>
              <td><input type="text" id="dateOfBirth" placeholder="In the format 'ddmmyyyy'" onChange={evt => this.updateState(evt)}/></td>
            </tr>

            <tr>
              <td>The Secret Phrase Sent To Their Address</td>
              <td><input type="text" id="secret" onChange={evt => this.updateState(evt)}/></td>
            </tr>

            <tr>
              <td>The Hash To Be Submitted</td>
              <td>{this.state.consumerHash}</td>
            </tr>

            <tr>
              <td></td>
              <td style={{textAlign:"center"}}><a onClick={this.addConsumerHash} className="button special fit small">Add Consumer Hash</a></td>
            </tr>

            </tbody>
            </table>
            </div>
            </div>
        </section>
    );
  }
}
