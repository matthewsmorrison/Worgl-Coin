import React from 'react';

import { getItemInformation } from '../utils/ethereum';

export class IndividualOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      picture: null,
      quantity: null,
      price: null,
      supplier: null
    }

    this.markAsSent = this.markAsSent.bind(this);
    this.makeComplaint = this.makeComplaint.bind(this);
    this.resetComplaint = this.resetComplaint.bind(this);
 };

 componentWillReceiveProps() {
  getItemInformation(this.props.ethereum.contractInstance, this.props.order[1].toNumber())
    .then((item => {
      let updatedState = this.state;

      updatedState.name = item.name;
      updatedState.picture = item.picture;
      updatedState.quantity = item.quantity;
      updatedState.price = item.price;
      updatedState.supplier = item.supplier;

      this.setState(updatedState);
    }))
 }

 async markAsSent(e) {
   e.preventDefault();
   console.log('About to mark an item as sent');
   let ethereum = this.props.ethereum;
   let orderID = this.props.order[0];

   console.log(ethereum);
   let response = ethereum.contractInstance.markOrderAsSent(orderID,
    {
      from: ethereum.currentAccount,
      value: ethereum.web3.toWei(0, "ether")
    });
    console.log("Mark item as sent: " + response);
 }

 async makeComplaint(e) {
   e.preventDefault();
   console.log('About to make a complaint');
   let ethereum = this.props.ethereum;
   let orderID = this.props.order[0];

   console.log(ethereum);
   let response = ethereum.contractInstance.makeComplaint(orderID,
    {
      from: ethereum.currentAccount,
      value: ethereum.web3.toWei(0, "ether")
    });
    console.log("Making a complaint: " + response);
 }

 async resetComplaint(e) {
   e.preventDefault();
   console.log('About to reset a complaint');
   let ethereum = this.props.ethereum;
   let orderID = this.props.order[0];

   console.log(ethereum);
   let response = ethereum.contractInstance.resetComplaint(orderID,
    {
      from: ethereum.currentAccount,
      value: ethereum.web3.toWei(0, "ether")
    });
    console.log("Resetting a complaint: " + response);
 }

  render() {

    return(
      <tr>

        <td style={{textAlign:"left", verticalAlign:"middle"}}><img
        style={{
          alignSelf: 'center',
          height: 150,
          width: 150,
          borderWidth: 1,
          borderRadius: 75
        }}
        src={this.state.picture} alt="Not available"/></td>

        <td style={{textAlign:"left", verticalAlign:"middle"}}>
          <ul>
            <li>Name: {this.state.name}</li>
            <li>Quantity Remaining: {this.state.quantity}</li>
            <li>Price (in UBI tokens): {this.state.price}</li>
          </ul>
        </td>

        <td style={{textAlign:"center", verticalAlign:"middle"}}>{this.props.order[3].toNumber()}</td>
        <td style={{textAlign:"center", verticalAlign:"middle"}}>
          {this.props.order[4] === false &&
            <p>No</p>
          }

          {this.props.order[4] === true &&
            <p>Yes</p>
          }
        </td>

        <td style={{textAlign:"center", verticalAlign:"middle"}}>{this.props.order[5].toNumber()}</td>


        {this.props.details.accountType === 'Consumer' && this.props.order[4] === false &&
          <td style={{textAlign:"center", verticalAlign:"middle"}}>
            <p>No Actions</p>
          </td>
        }

        {this.props.details.accountType === 'Consumer' && this.props.order[4] === true &&
          <td style={{textAlign:"center", verticalAlign:"middle"}}>
            <a onClick={this.makeComplaint}  className="button special fit small">Make Complaint</a>
            <a onClick={this.resetComplaint}  className="button special fit small">Reset Complaint</a>
          </td>
        }

        {this.props.details.accountType === 'Business' && this.props.order[4] === false &&
          <td style={{textAlign:"center", verticalAlign:"middle"}}>
            <a onClick={this.markAsSent}  className="button special fit small">Mark As Sent</a>
          </td>
        }

        {this.props.details.accountType === 'Business' && this.props.order[4] === true &&
          <td style={{textAlign:"center", verticalAlign:"middle"}}>
            <p>Item Has Been Sent</p>
          </td>
        }

      </tr>
    );
  }
}
