import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => (

  <div>

  {/* Banner */}
  <section id="banner">
    <h2>WörglCoin</h2>
    <p>An Ether-Backed Universal Basic Income</p>
    <ul className="actions">
      <li><Link to="/consumer_sign_up" className="button special">Consumer Sign Up</Link></li>
      <li><Link to="/business_sign_up" className="button special">Business Sign Up</Link></li>
    </ul>
  </section>

  {/* Main */}
  <section id="main" className="container">

    <section className="box special features">
      <div className="features-row">
        <section>
          <span className="fas fa-coins fa-5x"></span>
          <h3><br />A Universal Basic Income Coin</h3>
          <p>WörglCoin is designed to give citizens a basic standard of living through the distribution of
          tokens that can be spent on everyday items. Each month your balance will be topped up to 1000 WörglCoin.</p>
        </section>

        <section>
          <span className="far fa-building fa-5x"></span>
          <h3><br />Backed by Real Currency</h3>
          <p>To ensure businesses are incentivised to accept these coins, businesses can swap these tokens
            for ether at any time.</p>
        </section>
      </div>

      <div className="features-row">
        <section>
          <span className="fab fa-ethereum fa-5x"></span>
          <h3><br />Developed On Ethereum</h3>
          <p>This service has been developed and deployed on the Ethereum Network using Smart Contracts.</p>
        </section>

        <section>
          <span className="fab fa-github fa-5x"></span>
          <h3><br />100% Transparent</h3>
          <p>All the code backing this experiment can be found on <a href="https://github.com/matthewsmorrison/Worgl-Coin" target="_blank">Github</a> and the contracts
            are deployed on the Rinkeby test network: <a href="https://rinkeby.etherscan.io/" target="blank">0xf2ef82c979b671a613b560f34757283fcfdac89d</a>.</p>
        </section>

      </div>
    </section>

    <div className="row">
      <div className="6u 12u(narrower)">

        <section className="box special">
          <span className="image featured"><img src="images/shopping.jpg" alt="" /></span>
          <h3>For Consumers</h3>
          <p>Any individual with a valid National Insurance ID can sign-up for WörglCoin.
          Just visit the sign-up page below to start receiving your coins.</p>
          <ul className="actions">
            <li><Link to="/consumer_sign_up" className="button alt">Consumer Sign Up</Link></li>
          </ul>
        </section>

      </div>
      <div className="6u 12u(narrower)">

        <section className="box special">
          <span className="image featured"><img src="images/city.jpg" alt="" /></span>
          <h3>For Businesses</h3>
          <p>Any business in the UK can start to receive UBI coins and offset these against their tax bill.
            Just visit the sign-up page below to start receiving WörglCoin.</p>
          <ul className="actions">
            <li><Link to="/business_sign_up" className="button alt">Business Sign Up</Link></li>
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
        <div className="row uniform 50%">
          <div className="8u 12u(mobilep)">
            <input type="email" name="email" id="email" placeholder="Email Address" />
          </div>
          <div className="4u 12u(mobilep)">
            <input type="submit" value="Sign Up" className="fit" />
          </div>
        </div>
      </form>

    </section>
  </div>

);
