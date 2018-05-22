import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => (

  <div>

  {/* Banner */}
  <section id="banner">
    <h2>WörglCoin</h2>
    <p>A theoretical government-backed UBI scheme based on the Ethereum network</p>
    <ul class="actions">
      <li><Link to="/consumer_sign_up" class="button special">Consumer Sign Up</Link></li>
      <li><Link to="/business_sign_up" class="button special">Business Sign Up</Link></li>
    </ul>
  </section>

  {/* Main */}
  <section id="main" class="container">

    <section class="box special features">
      <div class="features-row">
        <section>
          <span class="fas fa-coins fa-5x"></span>
          <h3><br />A Universal Basic Income Coin</h3>
          <p>WörglCoin is designed to give citizens a basic standard of living through the distribution of
          tokens that can be spent on everyday items. Each month your balance will be topped up to 1000 WörglCoin.</p>
        </section>

        <section>
          <span class="far fa-building fa-5x"></span>
          <h3><br />Backed by Government</h3>
          <p>To ensure businesses are incentivised to accept these coins, businesses can swap these tokens
            for ether at any time.</p>
        </section>
      </div>

      <div class="features-row">
        <section>
          <span class="fab fa-ethereum fa-5x"></span>
          <h3><br />ERC-20 Token</h3>
          <p>These tokens are developed and deployed on the Ethereum Network using Smart Contracts.</p>
        </section>

        <section>
          <span class="fab fa-github fa-5x"></span>
          <h3><br />100% Transparent</h3>
          <p>All the code backing this experiment can be found on <a href="https://github.com/matthewsmorrison/Worgl-Coin" target="_blank">Github</a> and the contracts
            are deployed on the Rinkeby test network: <a href="https://rinkeby.etherscan.io/" target="blank">0xf2ef82c979b671a613b560f34757283fcfdac89d</a>.</p>
        </section>

      </div>
    </section>

    <div class="row">
      <div class="6u 12u(narrower)">

        <section class="box special">
          <span class="image featured"><img src="images/pic02.jpg" alt="" /></span>
          <h3>For Consumers</h3>
          <p>Any individual with a valid National Insurance ID can sign-up for WörglCoin.
          Just visit the sign-up page below to start receiving your coins.</p>
          <ul class="actions">
            <li><Link to="/consumer_sign_up" class="button alt">Consumer Sign Up</Link></li>
          </ul>
        </section>

      </div>
      <div class="6u 12u(narrower)">

        <section class="box special">
          <span class="image featured"><img src="images/pic03.jpg" alt="" /></span>
          <h3>For Businesses</h3>
          <p>Any business in the UK can start to receive UBI coins and offset these against their tax bill.
            Just visit the sign-up page below to start receiving WörglCoin.</p>
          <ul class="actions">
            <li><Link to="/business_sign_up" class="button alt">Business Sign Up</Link></li>
          </ul>
        </section>

      </div>
    </div>

  </section>

    {/* CTA */}
    <section id="cta">

      <h2>Sign up to our mailing list</h2>
      <p>We will keep you up-to-date with all developments in the project.</p>

      <form>
        <div class="row uniform 50%">
          <div class="8u 12u(mobilep)">
            <input type="email" name="email" id="email" placeholder="Email Address" />
          </div>
          <div class="4u 12u(mobilep)">
            <input type="submit" value="Sign Up" class="fit" />
          </div>
        </div>
      </form>

    </section>
  </div>

);
