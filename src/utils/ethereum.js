const contract = require('truffle-contract');

import Web3 from 'web3';
import WorglCoinAbi from '../../build/contracts/WorglCoin.json';

export function getWeb3() {
    return new Promise((resolve, reject) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.)
        if (typeof window !== 'undefined') {
            window.addEventListener('load', function () {
                let web3 = window.web3;

                // checking if Web3 has been injected by the browser (Mist/MetaMask)
                console.log('Checking if MetaMask or Mist has injected Web3.')
                if (typeof web3 !== 'undefined') {
                    // use Mist/MetaMask's provider
                    web3 = new Web3(web3.currentProvider);

                    console.log('Web3 detected.');
                    resolve(web3);
                } else {
                    reject('Web3 not injected.');
                }
            })
        }
    });
};

// get contract from the blockchain so web3 can communicate with it
export async function getContractInstance(provider) {
    if (!provider) {
        console.log('Valid Web3 provider needed.');
        return;
    }

    console.log('Getting contract.');
    let worglCoinContract = contract(WorglCoinAbi);
    worglCoinContract.setProvider(provider);

    console.log('Getting contract instance.');
    let worglCoinContractInstance = await worglCoinContract.deployed();

    return worglCoinContractInstance;
};

export async function getAccounts(web3) {
    return new Promise((resolve, reject) => {
        if (!web3) {
            reject('Web3 Accounts undefined - is user logged in via Metamask?');
        }
        resolve(web3.eth.accounts);
    });
};

export async function getAdminData(contractInstance) {
  console.log('Getting admin data');

  // Get all the administration data
  let noConsumers = await contractInstance.noOfConsumers().valueOf();
  let noBusinesses = await contractInstance.noOfBusinesses().valueOf();
  let noItems = await contractInstance.noOfItems().valueOf();
  let noOrders = await contractInstance.noOfOrders().valueOf();

  return { noConsumers: noConsumers, noBusinesses: noBusinesses, noItems: noItems, noOrders: noOrders };

}

export async function getAllItems(contractInstance) {
  console.log('Getting all items.');
  let items = [];
  let itemIDs = await contractInstance.getAllItems();

  for (let i = 0; i < itemIDs.length; i++) {
    let item = await contractInstance.allItems(itemIDs[i]);
    if(item[3].valueOf() !== 0) items.push(item);
  }

  return items;
}

export async function getAccountDetails(contractInstance, currentAccount) {
  console.log('Getting account details');

  // Get all the consumer details
  let accountDetails = await contractInstance.getTokenBalance(currentAccount);
  let contractBalance = await contractInstance.balance().valueOf();
  let tokenValue = await contractInstance.tokenValue().valueOf();

  return { accountType: accountDetails[0],
    tokenBalance: accountDetails[1].toNumber(),
    balance: contractBalance.toNumber()/1000000000000000000,
    value: tokenValue.toNumber()/1000000000000000000
  };
}

export async function getBusinessDetails(contractInstance, businessAddress) {
  console.log('Getting business details');

  // Get all business details
  let businessDetails = await contractInstance.getBusinessDetails(businessAddress);

  return {
    tokenBalance: businessDetails[0].toNumber(),
    itemsSupplied: businessDetails[1],
    complaintAgainst: businessDetails[2],
    noOfComplaints: businessDetails[3].toNumber(),
    allOrders: businessDetails[4],
    name: businessDetails[5]
  };
}

export async function getOrders(contractInstance, targetAddress) {
  let historicalOrders = [];
  let currentOrders = [];

  if (!contractInstance) {
    console.log('Have no valid contract instance yet');
    return {
      historicalOrders: historicalOrders,
      currentOrders: currentOrders
    };
  }

  // Get all Orders

  let orderIDs = await contractInstance.getAllOrders(targetAddress);

  for (let i = 0; i < orderIDs.length; i++) {
    let order = await contractInstance.allOrders(orderIDs[i]);

    if(order[4] === true) {
      historicalOrders.push(order);
    }

    else {
      currentOrders.push(order);
    }
  }

  return {
    historicalOrders: historicalOrders,
    currentOrders: currentOrders
  };
}

export async function getItemInformation(contractInstance, itemID) {
  let itemDetails = [];

  if (!contractInstance) {
    console.log('Have no valid contract instance yet');
    return {
      item: itemDetails
    };
  }

  itemDetails = await contractInstance.getItemDetails(itemID);

  return {
    name: itemDetails[0],
    picture: itemDetails[1],
    quantity: itemDetails[2].toNumber(),
    price: itemDetails[3].toNumber(),
    supplier: itemDetails[4]
  }

}
