import React from 'react';

export class IndividualItem extends React.Component {
  openModal(item) {
          // Get the modal
          let modal = document.getElementById('myModal');

          if (modal) {
              // set fixture
              console.log(item);
              this.props.updateSelectedItem(item);

              // When the user clicks on the button, open the modal
              modal.style.display = "block";

              // When the user clicks anywhere outside of the modal, close it
              window.onclick = function (event) {
                  if (event.target === modal) {
                      modal.style.display = "none";
                  }
              };
          } else {
              console.log('No modal found');
          }
      }

      render() {
        let item = this.props.item;

        return (
            <tr>
              <td>{item.Name}</td>
              <td>{item.description}</td>
              <td style="text-align:center">{item.quantity}</td>
              <td style="text-align:center">{item.price}</td>
              <td><a id="myBtn" className="button small" onClick={() => this.openModal(item)}>Buy</a></td>
            </tr>
        );
    }
  }
