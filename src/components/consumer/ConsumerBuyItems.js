import React from 'react';

import { ItemList } from '../ItemList';

export class ConsumerBuyItems extends React.Component {
  render() {
      return (

        <section id="main" className="container">
        	<header>
        		<h2>Buy Items</h2>
        		<p>You can choose from a selection of everyday items below.</p>
        	</header>

          <section className="box special features">
          <ItemList items={this.props.items} ethereum={this.props.ethereum} details={this.props.details}/>
        </section>
        </section>

      );
  }
}
