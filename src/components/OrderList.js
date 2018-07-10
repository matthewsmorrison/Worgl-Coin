import React from 'react';
import { IndividualOrder } from './IndividualOrder';

export class OrderList extends React.Component {

  render() {

    let orders = this.props.orders;
    let ethereum = this.props.ethereum;
    let details = this.props.details;

    if (orders.length > 0) {
      return (
                  <div className="table-wrapper">
                      <table>
                          <thead>
                              <tr>
                                  <th style={{textAlign:"center"}}>Picture</th>
                                  <th style={{textAlign:"left"}}>Item Details</th>
                                  <th style={{textAlign:"center"}}>Quantity Ordered</th>
                                  <th style={{textAlign:"center"}}>Been Sent</th>
                                  <th style={{textAlign:"center"}}>Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {orders.map(function (order) {
                                  return <IndividualOrder key={order[0]} order={order} ethereum={ethereum} details={details}/>
                              })}
                          </tbody>
                      </table>
                  </div>
              );
          }

      else {
        return (
            <div>
                <p>No orders have been made.</p>
            </div>)
      }



  }



}
