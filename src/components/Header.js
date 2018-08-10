import React, {Component} from 'react';
import { Link } from 'react-router-dom';

export class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tokenValue: null,
      tokenBalanceValue: null,
      contractBalanceValue: null,
      currentAccount: null,
    }
 };

  componentWillReceiveProps() {
    let updatedState = this.state;
    let price = this.props.ethereum.ethPrice;
    updatedState.tokenValue = (this.props.details.tokenValue * price).toFixed(2);
    updatedState.tokenBalanceValue = (this.props.details.tokenBalance * this.state.tokenValue).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    updatedState.contractBalanceValue = (this.props.details.contractBalance * price).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    updatedState.currentAccount = this.props.details.accountType;
    this.setState(updatedState);
};

    render() {
      var pStyle = {
      color: 'black',
      margin: 10,
      textAlign: 'center'
    };

    if (this.state.currentAccount === 'Consumer') {
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
          this.state.currentAccount
          ? (
            <p style={pStyle}>Signed in on account: {this.state.currentAccount} ({this.props.details.accountType} Account)<br/>
            Your token balance:  {this.props.details.tokenBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} UBI Tokens (US${this.state.tokenBalanceValue})<br/>
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

    if (this.state.currentAccount === 'Business') {
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
          this.state.currentAccount
          ? (
            <p style={pStyle}>Signed in on account: {this.state.currentAccount} ({this.props.details.accountType} Account)<br/>
            Your token balance:  {this.props.details.tokenBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} UBI Tokens (US${this.state.tokenBalanceValue})<br/>
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

    if (this.state.currentAccount === 'Contract Owner') {
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
          this.state.currentAccount
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
