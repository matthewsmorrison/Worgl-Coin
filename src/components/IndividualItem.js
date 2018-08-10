import React from 'react';
import { SupplierDetails } from './SupplierDetails';

export class IndividualItem extends React.Component {
  constructor(props) {
    super(props);
    this.buyItem = this.buyItem.bind(this);

   this.state = {
    id: this.props.item[0].toNumber(),
    quantityDemand: null,
    deliveryLocation: null,
   }
 };

 async buyItem(e) {
   e.preventDefault();
   console.log('About to buy a new item');
   let ethereum = this.props.ethereum;
   let id = this.state.id;
   let quantityDemanded = this.state.quantityDemand;
   let deliveryLocation = this.state.deliveryLocation;

   console.log(ethereum);
   ethereum.contractInstance.buyItem(id, quantityDemanded, deliveryLocation,
    {
      from: ethereum.currentAccount,
      value: ethereum.web3.toWei(0, "ether")
    })
    .then(function(data) {
      console.log(data);
      let status = data.receipt.status;
      let success = false;
      console.log(status);
      if(status === '0x01') {
        success = true;
      }
      console.log(success);
    });
 }

 updateState(evt) {
   let target = evt.target;
   let id = target.id;
   let newState = this.state;

   switch (id) {
     case 'quantityDemand':
       newState.quantityDemand = target.value;
       break;

     case 'deliveryLocation':
       newState.deliveryLocation = target.value;
       break;

     default:
       console.log("Not updating any state.");

   }

   this.setState(newState);

   }

  render() {
    let item = this.props.item;
    let details = this.props.details;

    return (
      <tr>
          <td style={{textAlign:"left", verticalAlign:"middle"}}><img
          style={{
            alignSelf: 'center',
            height: 150,
            width: 150,
            borderWidth: 1,
            borderRadius: 75
          }}
          src={item[1]} alt="Not available"/></td>

          <td style={{textAlign:"left", verticalAlign:"middle"}}>
            <ul>
              <li>Name: {item[2]}</li>
              <li>Quantity Remaining: {item[3].toNumber()}</li>
              <li>Price (in UBI tokens): {item[4].toNumber()}</li>
            </ul>
          </td>

          <SupplierDetails ethereum={this.props.ethereum} item={this.props.item}/>

          { details.accountType === 'Consumer' &&

          <td style={{textAlign:"center", verticalAlign:"middle"}}>
              <input type="number" id="quantityDemand" style={{textAlign:"center", marginBottom:"10px"}} min="1" step="1" placeholder="Quantity Wanted" onChange={evt => this.updateState(evt)}/><br/>
              <input type="number" id="deliveryLocation" style={{textAlign:"center", marginBottom:"10px"}} min="1" step="1" placeholder="Delivery Location" onChange={evt => this.updateState(evt)}/><br/>
              Total UBI Tokens: {(this.state.quantityDemand * item[4].toNumber()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<br/>
              New Balance: {(this.props.details.tokenBalance - (this.state.quantityDemand * item[4].toNumber())).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<br/>
              <a style={{marginTop:"10px"}}onClick={this.buyItem} className="button special fit small">Buy Item</a>
          </td>

          }

      </tr>
    )
  }
}
