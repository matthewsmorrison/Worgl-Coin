import React from 'react';
const web3 = window.web3;

export class Administration extends React.Component {
  render() {
      return (
        <section id="main" className="container">
        	<header>
        		<h2>Administration</h2>
        		<p>The contract owner can interact with the contract here.</p>
        	</header>

          {
            !web3
            ? (
              <div className="box">
              <p>You need to have metamask installed to interact with the application. You can install Metamask from this address: <a href="https://metamask.io" target="_blank">metamask.io</a>. You then need to click
                “Add to Chrome” to install MetaMask as Google Chrome extension. You then need to click “Add Extension” to confirm and MetaMask will be added.
              You can see that MetaMask is added by the little fox logo that shows up on the top right corner.</p>
              </div>

            )
          : (
            [<div key={1} className="box">
            <h4><strong>Application Statistics</strong></h4>
            <hr/>
            <div key={2} className="table-wrapper">
            <table>
            <tbody>
              <tr>
                <td>Number of Consumers Registered</td>
                <td>{this.props.noConsumers}</td>
              </tr>
              <tr>
                <td>Number of Businesses Registered</td>
                <td></td>
              </tr>
              <tr>
                <td>Number of Items Listed</td>
                <td></td>
              </tr>
              <tr>
                <td>Number of Orders Made</td>
                <td></td>
              </tr>
            </tbody>
            </table>
            </div></div>,
            <div key={3} className="box">
            <h4><strong>Contract Interaction</strong></h4>
            <hr/>
            </div>]
          )
        }

        </section>

      );
  }
}
