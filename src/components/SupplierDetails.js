import React from 'react';
import { getBusinessDetails } from '../utils/ethereum';


export class SupplierDetails extends React.Component {
  constructor(props) {
    super(props);

   this.state = {
    businessDetails:
    {
      tokenBalance: null,
      itemsSupplied: null,
      noOfItems: null,
      complaintAgainst: null,
      noOfComplaints: null,
      allOrders: null,
      noOfOrders: null,
      name: null
    }
   }
 };

 	componentDidMount() {
    getBusinessDetails(this.props.ethereum.contractInstance, this.props.item[5])
      .then((details => {
        let updatedState = this.state;
        console.log(details);
        updatedState.businessDetails.tokenBalance = details.tokenBalance;
        updatedState.businessDetails.itemsSupplied = details.itemsSupplied;
        updatedState.businessDetails.complaintAgainst = details.complaintAgainst;
        updatedState.businessDetails.noOfComplaints = details.noOfComplaints;
        updatedState.businessDetails.allOrders = details.allOrders;
        updatedState.businessDetails.name = details.name;
        updatedState.businessDetails.noOfItems = updatedState.businessDetails.itemsSupplied.length;
        updatedState.businessDetails.noOfOrders = updatedState.businessDetails.allOrders.length;
        this.setState(updatedState);
      }))
  }


  render() {
    return (

      <td style={{textAlign:"left", verticalAlign:"middle"}}>
        <ul>
          <li>Name: {this.state.businessDetails.name}</li>
          <li># of Items on Site: {this.state.businessDetails.noOfItems}</li>
          <li># of Orders: {this.state.businessDetails.noOfOrders}</li>
          <li># of Active Complaints: {this.state.businessDetails.noOfComplaints}</li>
        </ul>
      </td>


    )
  }
}
