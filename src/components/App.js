import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { getWeb3, getContractInstance, getAccounts} from '../utils/ethereum';

// import templates
import { ConsumerFAQ } from '../templates/ConsumerFAQ';
import { BusinessFAQ } from '../templates/BusinessFAQ';
import { Home } from '../templates/Home';
import { _404 } from '../templates/Errors';


// import components
import { Footer } from './Footer';
import { Header } from './Header';
import { ConsumerSignUp } from './consumer/ConsumerSignUp';
import { ConsumerBuyItems } from './consumer/ConsumerBuyItems';
import { ConsumerOrders } from './consumer/ConsumerOrders';
import { BusinessSignUp } from './businesses/BusinessSignUp';
import { BusinessSupplyItems } from './businesses/BusinessSupplyItems';
import { BusinessOrders } from './businesses/BusinessOrders';
import { Administration } from './owner/Administration';

export class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ethereum: {
				web3: null,
				contractInstance: null,
				currentAccount: null
			}
		};
	}

	// runs once react component is mounted in order to connect to the blockchain
	componentDidMount() {
		// get network provider and web3 instance.
		// see utils/getWeb3 for more info.
		getWeb3()
			.then(web3 => {
				// console.log(web3);

				let updatedState = this.state;
				updatedState.ethereum.web3 = web3;
				this.setState(updatedState);

				// get accounts
				console.log('Get Web3 accounts.');
				return getAccounts(this.state.ethereum.web3);
			})
			.then(accounts => {
				let currentAccount = accounts[0];

				let updatedState = this.state;
				updatedState.ethereum.currentAccount = currentAccount;
				this.setState(updatedState);

				// instantiate contract once web3 provided.
				return getContractInstance(this.state.ethereum.web3.currentProvider);
			})
			.then(contractInstance => {

				let updatedState = this.state;
				updatedState.ethereum.contractInstance = contractInstance;
				this.setState(updatedState);
				console.log(this.state);

			})
			.catch(err => {
				console.log(err);
			})
	}

	render() {
		return (
			<div>
				<Header />

				{/* TODO: refactor below in Main component */}
				<Switch>
					<Route exact path="/" component={Home} />

					<Route path="/consumer_faq" component={ConsumerFAQ} />
          <Route path="/business_faq" component={BusinessFAQ} />
					<Route path="/consumer_sign_up" component={ConsumerSignUp} />
					<Route path="/consumer_buy_items" component={ConsumerBuyItems} />
					<Route path="/consumer_orders" component={ConsumerOrders} />
					<Route path="/business_sign_up" component={BusinessSignUp} />
					<Route path="/business_sell_items" component={BusinessSupplyItems} />
					<Route path="/business_orders" component={BusinessOrders} />
					<Route path="/administration" component={Administration} />

					{/* default route: page not found */}
					<Route component={_404} />
				</Switch>

				<Footer />

			</div>
		);
	}
}
