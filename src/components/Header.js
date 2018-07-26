import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { getEthPrice } from '../utils/pricefeed.js';

export class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ethPrice: null,
      tokenValue: null,
      tokenBalanceValue: null,
      contractBalanceValue: null
    }
 };

  componentWillReceiveProps() {
    getEthPrice()
      .then(price => {
        let updatedState = this.state;
        updatedState.ethPrice = price;
        updatedState.tokenValue = (this.props.details.tokenValue * price).toFixed(2);
        updatedState.tokenBalanceValue = (this.props.details.tokenBalance * price);
        updatedState.contractBalanceValue = (this.props.details.contractBalance * price).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        console.log(price);
        this.setState(updatedState);
  })
};


    render() {
      var pStyle = {
      color: 'black',
      margin: 10,
      textAlign: 'center'
    };

    var currentAccount = this.props.details.accountType;
    console.log(currentAccount);
    if (currentAccount === 'Consumer') {
      return (
            <div>
                <header id="header">
                    <h1>
                        <Link to="/">WörglCoin</Link><br/>
                    </h1>

          <nav id="nav">

          <ul>
          <li><Link to="/consumer_buy_items">Buy Items</Link></li>
          <li><Link to="/consumer_orders">Your Orders</Link></li>
          <li><Link to="/consumer_faq">FAQs</Link></li>

          </ul>
        </nav>
      </header>

      {
          currentAccount
          ? (
            <p style={pStyle}>Signed in on account: {currentAccount} ({this.props.details.accountType} Account)<br/>
            Your token balance:  {this.props.details.tokenBalance} UBI Tokens (US${this.state.tokenBalanceValue})<br/>
            Contract Balance: {this.props.details.contractBalance} Ether (US${this.state.contractBalanceValue}), Token Value: {this.props.details.tokenValue} Ether (US${this.state.tokenValue})</p>
          )
          : (

          <p style={pStyle}>You need to be logged in using Metamask to use this application.<br/>
          Try refreshing the page if you have just logged in.</p>
          )
        }
    </div>
  );
    }

    if (currentAccount === 'Business') {
      return (
            <div>
                <header id="header">
                    <h1>
                        <Link to="/">WörglCoin</Link><br/>
                    </h1>

          <nav id="nav">
          <ul>

            <li><Link to="/business_sell_items">Supply Items</Link></li>
            <li><Link to="/business_orders">Your Orders</Link></li>
            <li><Link to="/business_faq">FAQs</Link></li>

          </ul>
        </nav>
      </header>

      {
          currentAccount
          ? (
            <p style={pStyle}>Signed in on account: {currentAccount} ({this.props.details.accountType} Account)<br/>
            Your token balance:  {this.props.details.tokenBalance} UBI Tokens<br/>
            Contract Balance: {this.props.details.contractBalance} Ether (US${this.state.contractBalanceValue}), Token Value: {this.props.details.tokenValue} Ether (US${this.state.tokenValue})</p>
          )
          : (

          <p style={pStyle}>You need to be logged in using Metamask to use this application.<br/>
          Try refreshing the page if you have just logged in.</p>
          )
        }
    </div>
  );
    }

    if (currentAccount === 'Contract Owner') {
      return (
            <div>
                <header id="header">
                    <h1>
                        <Link to="/">WörglCoin</Link><br/>
                    </h1>

          <nav id="nav">
          <ul>

            <li>
              <Link to="/administration">Administration</Link>
            </li>
          </ul>
        </nav>
      </header>

      {
          currentAccount
          ? (
            <p style={pStyle}>
            Contract Balance: {this.props.details.contractBalance} Ether (US${this.state.contractBalanceValue}), Token Value: {this.props.details.tokenValue} Ether (US${this.state.tokenValue})</p>
          )
          : (

          <p style={pStyle}>You need to be logged in using Metamask to use this application.<br/>
          Try refreshing the page if you have just logged in.</p>
          )
        }
    </div>
  );
    }

    else {
      return (
        <div>
            <header id="header">
                <h1>
                    <Link to="/">WörglCoin</Link><br/>
                </h1>

      <nav id="nav">
      <ul>

        <li>
          <Link to="/consumer_sign_up">Consumer Sign Up</Link>
        </li>
      </ul>
    </nav>
  </header>
</div>
      );
    }


  }
}
