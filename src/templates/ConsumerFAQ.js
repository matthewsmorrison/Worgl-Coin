import React from 'react';
import { Link } from 'react-router-dom';

export const ConsumerFAQ = () => (
  <section id="main" class="container">
    <header>
      <h2>Frequently Asked Questions</h2>
      <p>A list of questions we frequently receive from consumers.</p>
    </header>


    {/* Content */}
    <div class="box">
      <h4><strong>What is Universal Basic Income?</strong></h4>
      <p>Universal Basic Income ('UBI') is a scheme in which all citizens are guaranteed a fixed, regular and unconditional
        sum of money from the government. With Artificial Intelligence and other developments threatning many jobs, we
        believe that UBI is a necessity.</p>
      <hr/>

      <h4><strong>What is Ethereum?</strong></h4>
      <p><a href="https://www.ethereum.org/" target="_blank">Ethereum</a> is a decentralised platform that runs smart contracts: applications that run exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference.
        These apps run on a custom built blockchain, an enormously powerful shared global infrastructure that can move value around and represent the ownership of property.</p>
      <hr/>

      <h4><strong>How do I install Metamask?</strong></h4>
      <p>You can install Metamask from this address: <a href="https://metamask.io" target="_blank">metamask.io</a>. You then need to click
        “Add to Chrome” to install MetaMask as Google Chrome extension. You then need to click “Add Extension” to confirm and MetaMask will be added.
      You can see that MetaMask is added by the little fox logo that shows up on the top right corner.</p>


    </div>
  </section>

);
