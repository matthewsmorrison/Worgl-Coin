import React from 'react';

export class Footer extends React.Component {
    render() {
        return (
                    <section id="footer">
                    <ul className="icons">
                      <li>
                        <a href='https://github.com/matthewsmorrison/Worgl-Coin' className="icon fa-github" target="_blank"></a>
                      </li>
                    </ul>

                    <ul className="copyright">
                      <li>&copy; Matthew Morrison. All rights reserved.</li>
                    </ul>
                    </section>
        );
    }
}
