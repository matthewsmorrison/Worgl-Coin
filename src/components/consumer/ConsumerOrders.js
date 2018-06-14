import React from 'react';

export class ConsumerOrders extends React.Component {
    render() {
        return (

          <section id="main" className="container">
          	<header>
          		<h2>Your Orders</h2>
          		<p>An overview of all the orders you have made.</p>
          	</header>
          	<div className="box">
              <h4><strong>Outstanding Orders</strong></h4>
              <hr/>

          	</div>

            <div className="box">
              <h4><strong>Historical Orders</strong></h4>
              <hr/>

            </div>

          </section>

        );
    }
}
