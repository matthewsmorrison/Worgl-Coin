import React from 'react';
import { OrderList } from './OrderList';
import { getOrders } from '../utils/ethereum';

export class Orders extends React.Component {
  constructor(props) {
    super(props);

   this.state = {
    historicalOrders: [],
    currentOrders: []
   }
 };

 componentWillReceiveProps() {
   getOrders(this.props.ethereum.contractInstance, this.props.ethereum.currentAccount)
     .then((orders => {
       let updatedState = this.state;
       console.log(orders);

       updatedState.historicalOrders = orders.historicalOrders;
       updatedState.currentOrders = orders.currentOrders;

       this.setState(updatedState);
     }))
 }

    render() {
        return (

          <section id="main" className="container">
          	<header>
          		<h2>Your Orders</h2>
          		<p>An overview of all orders.</p>
          	</header>
          	<div className="box">
              <h4><strong>Outstanding Orders</strong></h4>
              <hr/>
              <OrderList orders={this.state.currentOrders} ethereum={this.props.ethereum} details={this.props.details}/>

          	</div>

            <div className="box">
              <h4><strong>Historical Orders</strong></h4>
              <hr/>
              <OrderList orders={this.state.historicalOrders} ethereum={this.props.ethereum} details={this.props.details}/>

            </div>

          </section>

        );
    }
}
