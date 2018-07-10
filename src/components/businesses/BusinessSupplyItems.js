import React from 'react';
import { IndividualItem } from '../IndividualItem';

export class BusinessSupplyItems extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);

   this.state = {
     name: null,
     picture: null,
     quantity: null,
     price: null
   }
 };

 async addItem(e) {
   e.preventDefault();
   console.log('About to add a new business');
   let ethereum = this.props.ethereum;
   let name = this.state.name;
   let picture = this.state.picture;
   let quantity = this.state.quantity;
   let price = this.state.price;

   console.log(ethereum);
   let response = ethereum.contractInstance.sellItem(name, picture, quantity, price,
    {
      from: ethereum.currentAccount,
      value: ethereum.web3.toWei(0, "ether")
    });
    console.log("Add new item: " + response);


 }

 updateState(evt) {
   let target = evt.target;
   let id = target.id;
   let newState = this.state;

   switch (id) {
     case 'name':
       newState.name = target.value;
       break;

     case 'picture':
       newState.picture = target.value;
       break;


     case 'quantity':
       newState.quantity = parseInt(target.value, 10);
       break;

     case 'price':
       newState.price = parseInt(target.value, 10);
       break;

     default:
       console.log("Not updating any state.");

   }

   this.setState(newState);

   }

    render() {

      let items = this.props.items;
      let ethereum = this.props.ethereum;
      let details = this.props.details;

        return (

          <section id="main" className="container">
          	<header>
          		<h2>Sell Items</h2>
          		<p>List items that you want to sell.</p>
          	</header>
          	<div className="box">
            <h4><strong>Supply a New Item</strong></h4>
            <hr/>

            <div className="table-wrapper">
            <table>
            <tbody>

            <tr>
              <td>The name of the item:</td>
              <td><input type="text" id="name" placeholder="Name of the item (e.g. eggs)" onChange={evt => this.updateState(evt)}/></td>
            </tr>

            <tr>
              <td>The location of the picture to be used:</td>
              <td><input type="text" id="picture" placeholder="For example https://dropbox.com..." onChange={evt => this.updateState(evt)}/></td>
            </tr>

            <tr>
              <td>The quantity of the item (minimum one):</td>
              <td><input type="number" id="quantity" min="1" step="1" onChange={evt => this.updateState(evt)}/></td>
            </tr>

            <tr>
              <td>The price of the item (in UBI tokens):</td>
              <td><input type="number" id="price" min="1" step="1" onChange={evt => this.updateState(evt)}/></td>
            </tr>

            </tbody>
            </table>
            </div>

            <a onClick={this.addItem} className="button special">Add Item</a>

          	</div>

            <div className="box">
              <h4><strong>Items Currently Supplied</strong></h4>
              <hr/>

              <div className="table-wrapper">
                  <table>
                      <thead>
                          <tr>
                              <th>Picture</th>
                              <th style={{textAlign:"left"}}>Item Details</th>
                              <th style={{textAlign:"left"}}>Supplier Details</th>
                          </tr>
                      </thead>
                      <tbody>
                          {items.map(function (item) {
                              return <IndividualItem key={item[0]} item={item} ethereum={ethereum} details={details}/>
                          })}
                      </tbody>
                  </table>
              </div>

            </div>

          </section>

        );
    }
}
