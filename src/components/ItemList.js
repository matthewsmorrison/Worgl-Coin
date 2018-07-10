import React from 'react';
import { IndividualItem } from './IndividualItem';

export class ItemList extends React.Component {
  render() {

  let items = this.props.items;
  let ethereum = this.props.ethereum;
  let details = this.props.details;

  if (items.length > 0) {
    return (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Picture</th>
                                <th style={{textAlign:"left"}}>Item Details</th>
                                <th style={{textAlign:"left"}}>Supplier Details</th>
                                <th style={{textAlign:"center"}}>Purchase Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(function (item) {
                                return <IndividualItem key={item[0]} item={item} ethereum={ethereum} details={details}/>
                            })}
                        </tbody>
                    </table>
                </div>
            );
        }

  else {
            return (
                <div>
                    <p>No items have been added for sale yet. Please come back soon.</p>
                </div>)
        }



  }
}
