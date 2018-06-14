import React, {Component} from 'react';
import { Link } from 'react-router-dom';

export class Header extends Component {
  constructor() {
   super();

   this.state = {
     showMenu1: false,
     showMenu2: false,
   }

   this.showMenu1 = this.showMenu1.bind(this);
   this.closeMenu1 = this.closeMenu1.bind(this);
   this.showMenu2 = this.showMenu2.bind(this);
   this.closeMenu2 = this.closeMenu2.bind(this);
   this.showMenu3 = this.showMenu3.bind(this);
   this.closeMenu3 = this.closeMenu3.bind(this);
 }

 showMenu1(event) {
   event.preventDefault();

   this.setState({ showMenu1: true }, () => {
      document.addEventListener('click', this.closeMenu1);
    });
 }

 closeMenu1() {
    this.setState({ showMenu1: false }, () => {
      document.removeEventListener('click', this.closeMenu1);
    });
  }

  showMenu2(event) {
    event.preventDefault();

    this.setState({ showMenu2: true }, () => {
       document.addEventListener('click', this.closeMenu2);
     });
  }

  closeMenu2() {
     this.setState({ showMenu2: false }, () => {
       document.removeEventListener('click', this.closeMenu2);
     });
   }

   showMenu3(event) {
     event.preventDefault();

     this.setState({ showMenu3: true }, () => {
        document.addEventListener('click', this.closeMenu3);
      });
   }

   closeMenu3() {
      this.setState({ showMenu3: false }, () => {
        document.removeEventListener('click', this.closeMenu3);
      });
    }


    render() {
        return (
                <div>
                    {/* Header */}
                    <header id="header">
                        <h1>
                            <Link to="/">WörglCoin</Link>
                        </h1>

              {/* Menu */}
              <nav id="nav">
                    <button><Link to="#" className="icon fa-angle-down" onClick={this.showMenu1}>Consumers</Link></button>
                    {
                      this.state.showMenu1
                      ? (
                        <div>
                        <li><Link to="/consumer_sign_up">Sign Up</Link></li>
                        <li><Link to="/consumer_buy_items">Buy Items</Link></li>
                        <li><Link to="/consumer_orders">Your Orders</Link></li>
                        <li><Link to="/consumer_faq">FAQs</Link></li>
                        </div>

                      )
                  : (
                    null
                  )
                }

                      <button><Link to="#" className="icon fa-angle-down" onClick={this.showMenu2}>Businesses</Link></button>
                      {
                        this.state.showMenu2
                        ? (
                          <div>
                          <li><Link to="/business_sign_up">Sign Up</Link></li>
                          <li><Link to="/business_sell_items">Supply Items</Link></li>
                          <li><Link to="/business_orders">Your Orders</Link></li>
                          <li><Link to="/business_faq">FAQs</Link></li>
                          </div>

                        )
                    : (
                      null
                    )
                  }

                  <button><Link to="#" className="icon fa-angle-down" onClick={this.showMenu3}>Contract Owner</Link></button>
                  {
                    this.state.showMenu3
                    ? (
                      <div>
                      <li><Link to="/administration">Administration</Link></li>
                      </div>

                    )
                : (
                  null
                )
              }
              </nav>
              </header>
              </div>
        );
    }
}
