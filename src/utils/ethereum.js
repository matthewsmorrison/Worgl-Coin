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
