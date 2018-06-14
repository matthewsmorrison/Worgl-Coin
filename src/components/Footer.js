import React from 'react';
import { Switch, Route } from 'react-router-dom';

export class Footer extends React.Component {
    render() {
        return (
            <Switch>
                {/* determine which footer to render based on path */}
                <Route>
                    <section id="footer">
                        <div className="inner">
                          <ul className="copyright">
                            <li>&copy; Matthew Morrison. All rights reserved.</li>
                          </ul>
                        </div>
                    </section>
                </Route>
            </Switch>
        );
    }
}
