import React from 'react';

export class ConsumerSignUp extends React.Component {
  constructor(props) {
    super(props);
    this.addHash = this.addHash.bind(this);

   this.state = {
     consumerHash: null
   }
 };

 async addHash(e) {
   e.preventDefault();
   console.log('About to add a new business');
   let ethereum = this.props.ethereum;
   let hash = this.state.consumerHash;

   console.log(ethereum);
   let response = ethereum.contractInstance.consumerSignUp(hash,
    {
      from: ethereum.currentAccount,
      value: ethereum.web3.toWei(0, "ether")
    });
    console.log("New consumer sign up: " + response);
  }


  updateState(evt) {
    let target = evt.target;
    let id = target.id;
    let newState = this.state;

    switch (id) {
      case 'hash':
        newState.consumerHash= target.value;
        break;

      default:
        console.log("Not updating any state.");

    }

    this.setState(newState);
  }

    render() {
        return (

          <section id="main" className="container">
          	<header>
          		<h2>Consumer Sign-Up</h2>
          		<p>Sign-Up To Receive WörglCoin.</p>
          	</header>
          	<div className="box">

            <div className="table-wrapper">
            <table>
            <tbody>
              <tr>
                <td>Sign up by adding your hash</td>
                <td><input type="text" id="hash" placeholder="Hash of your data" onChange={evt => this.updateState(evt)}/></td>
                <td style={{textAlign:"center"}}><a onClick={this.addHash} className="button small special">Sign Up</a></td>
              </tr>



            </tbody>
            </table>
            </div>

          	</div>
          </section>

        );
    }
}
