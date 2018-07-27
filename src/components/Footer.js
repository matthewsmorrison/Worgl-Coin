import React from 'react';

export class Footer extends React.Component {
    render() {
        return (
                    <section id="footer">
                    <ul className="icons">
                      <li>
                        <a href='https://github.com/matthewsmorrison/Worgl-Coin' target="_blank">
                          <i className="fab fa-github fa-2x"></i>
                        </a>

                        <a href='https://gitter.im/Worgl-Coin/' target="_blank" style = {{marginLeft: "20px"}}>
                          <i className="fab fa-gitter fa-2x"></i>
                        </a>

                        <a href='/' target="_blank" style = {{marginLeft: "20px"}}>
                          <i className="fab fa-telegram fa-2x"></i>
                        </a>

                      </li>
                    </ul>

                    <ul className="copyright">
                      <li>&copy; Matthew Morrison. All rights reserved.</li>
                    </ul>
                    </section>
        );
    }
}
