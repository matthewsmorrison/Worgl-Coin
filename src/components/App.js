import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { getWeb3, getContractInstance, getAccounts, getAdminData, getAllItems, getAccountDetails } from '../utils/ethereum';

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
import { Orders } from './Orders';
import { BusinessSignUp } from './businesses/BusinessSignUp';
import { BusinessSupplyItems } from './businesses/BusinessSupplyItems';
import { Administration } from './owner/Administration';

export class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ethereum: {
				web3: null,
				contractInstance: null,
				currentAccount: null
			},
			data: {
				noConsumers: null,
				noBusinesses: null,
				noItems: null,
				noOrders: null
			},
			items: [],
			accountDetails: {
				accountType: null,
				tokenBalance: null,
				contractBalance: null,
				tokenValue: null
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
				return getContractInstance(this.state.ethereum.web3.currentProvider);
			})
			.then(contractInstance => {

				let updatedState = this.state;
				let getData = function () {
					console.log("Data change event triggered.");
					getAdminData(contractInstance)
					.then(data => {
						console.log(data);
						updatedState.data = data;
						updatedState.data.noConsumers = updatedState.data.noConsumers.toNumber();
						updatedState.data.noBusinesses = updatedState.data.noBusinesses.toNumber();
						updatedState.data.noItems = updatedState.data.noItems.toNumber();
						updatedState.data.noOrders = updatedState.data.noOrders.toNumber();
						this.setState(updatedState);
					});
				}.bind(this);
				contractInstance.ConsumerAdded().watch(getData);
				contractInstance.BusinessAdded().watch(getData);
				contractInstance.ItemAdded().watch(getData);
				contractInstance.OrderAdded().watch(getData);
				return getAdminData(contractInstance);
			})
			.then(data => {

				let updatedState = this.state;
				updatedState.data = data;
				updatedState.data.noConsumers = updatedState.data.noConsumers.toNumber();
				updatedState.data.noBusinesses = updatedState.data.noBusinesses.toNumber();
				updatedState.data.noItems = updatedState.data.noItems.toNumber();
				updatedState.data.noOrders = updatedState.data.noOrders.toNumber();
				console.log(data);
				this.setState(updatedState);
				return getContractInstance(this.state.ethereum.web3.currentProvider);

			})
			.then( contractInstance => {
				let updatedState = this.state;
				let getItems = function () {
					console.log("Item change event triggered.");
					getAllItems(contractInstance)
					.then(items => {
						console.log(items);
						updatedState.items = items;
						this.setState(updatedState);
					});
				}.bind(this);

				contractInstance.ItemAdded().watch(getItems);
				contractInstance.ItemChange().watch(getItems);
				contractInstance.OrderChange().watch(getItems);
				return getAllItems(contractInstance);
			})
		.then(items => {
			console.log(items);
			let updatedState = this.state;
			updatedState.items = items;
			this.setState(updatedState);
			return getContractInstance(this.state.ethereum.web3.currentProvider);

			})
		.then(contractInstance => {
			let updatedState = this.state;
			let getDetails = function () {
				console.log("Account details event triggered.");
				getAccountDetails(contractInstance, this.state.ethereum.currentAccount)
				.then(details => {
					console.log(details);
					updatedState.accountDetails.accountType = details.accountType;
					updatedState.accountDetails.tokenBalance = details.tokenBalance;
					updatedState.accountDetails.contractBalance = details.balance.toFixed(4);
					updatedState.accountDetails.tokenValue = details.value.toFixed(4);
					this.setState(updatedState);
				});
			}.bind(this);

			contractInstance.TokenDistribution().watch(getDetails);
			contractInstance.TopUp().watch(getDetails);
			return getAccountDetails(contractInstance, this.state.ethereum.currentAccount);
		})
		.then(details => {
			console.log(details);
			let updatedState = this.state;
			updatedState.accountDetails.accountType = details.accountType;
			updatedState.accountDetails.tokenBalance = details.tokenBalance;
			updatedState.accountDetails.contractBalance = details.balance.toFixed(4);
			updatedState.accountDetails.tokenValue = details.value.toFixed(4);
			this.setState(updatedState);
		})
		.then()
			.catch(err => {
				console.log(err);
			})
	}

	render() {
		return (
			<div>
				<Header ethereum={this.state.ethereum} details={this.state.accountDetails}/>
				<Switch>
					<Route exact path="/" component={Home} />

					<Route path="/consumer_faq" component={ConsumerFAQ} />

          <Route path="/business_faq" component={BusinessFAQ} />

					<Route path="/consumer_sign_up">
					 	<ConsumerSignUp ethereum={this.state.ethereum}/>
					</Route>

					<Route path="/consumer_buy_items">
					 	<ConsumerBuyItems items={this.state.items} ethereum={this.state.ethereum} details={this.state.accountDetails}/>
					</Route>

					<Route path="/consumer_orders">
						<Orders ethereum={this.state.ethereum} details={this.state.accountDetails}/>
					</Route>

					<Route path="/business_sign_up" component={BusinessSignUp} />

					<Route path="/business_sell_items">
					 	<BusinessSupplyItems ethereum={this.state.ethereum} items={this.state.items} details={this.state.accountDetails}/>
					</Route>

					<Route path="/business_orders">
						<Orders ethereum={this.state.ethereum} details={this.state.accountDetails}/>
					</Route>

					<Route path="/administration">
						<Administration admin_data={this.state.data} ethereum={this.state.ethereum}/>
					</Route>

					{/* default route: page not found */}
					<Route component={_404} />
				</Switch>

				<Footer />

			</div>
		);
	}
}
