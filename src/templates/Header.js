import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => (
  {/* Header */}
  <head>
		<title>WörglCoin - Government Backed Crypto-UBI</title>
    <h1>
      <Link to="/">WörglCoin</Link>
    </h1>
    <nav>
      <a href="#menu">Menu</a>
    </nav>

  </head>

  {/* Menu */}
  <nav id="menu">
    <ul>
      <li>
        <a class="icon fa-angle-down">Consumers</a>
        <ul>
          <li>
            <Link to="/consumer_sign_up">Sign Up</Link>
          </li>

          <li>
            <Link to="/consumer_buy_items">Buy Items</Link>
          </li>

          <li>
            <Link to="/consumer_orders">Your Orders</Link>
          </li>

          <li>
            <Link to="/consumer_faq">FAQs</Link>
          </li>
        </ul>
      </li>

      <li>
        <a class="icon fa-angle-down">Businesses</a>
        <ul>
          <li>
            <Link to="/business_sign_up">Sign Up</Link>
          </li>

          <li>
            <Link to="/business_sell_items">Supply Items</Link>
          </li>

          <li>
            <Link to="/business_orders">Your Orders</Link>
          </li>

          <li>
            <Link to="/business_faq">FAQs</Link>
          </li>
        </ul>
      </li>
  </nav>
);
