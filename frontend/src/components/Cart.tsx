import * as React from 'react';
import {
  Alert,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Row,
  Table
} from 'react-bootstrap';

import { ItemCatalog } from 'src/components/models';
import NfcReader, { NfcScan } from 'src/components/NfcReader';

export interface CartProps {
  input: ItemCatalog;
}

interface CartState {
  userId: string;
  currentCart: string[];
  shouldThank: boolean;
}

class Cart extends React.Component<CartProps, CartState> {
  constructor(props: CartProps) {
    super(props);
    this.state = { userId: 'guest', currentCart: [], shouldThank: false };
  }

  public render() {
    const { currentCart, userId } = this.state;
    const { input } = this.props;
    return (
      <React.Fragment>
        <NfcReader onNfcRead={this.onNfcRead} />
        {this.state.shouldThank ? (
          <Alert bsStyle="success">
            <h4>Thank your for your purchase!</h4>
          </Alert>
        ) : null}
        <Form horizontal>
          <FormGroup controlId="user-name">
            <Col componentClass={ControlLabel} sm={2}>
              Welcome,
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Name"
                value={userId}
                onChange={this.onNameChange}
              />
            </Col>
          </FormGroup>
        </Form>
        <Row>
          <Col>
            {currentCart.length === 0 ? (
              <p style={{ textAlign: 'center' }}>
                🐱 is lonely. Scan it some new friends!
              </p>
            ) : null}
            <Table striped hover>
              <tbody>
                {currentCart.map(itemId => {
                  if (itemId in input) {
                    return (
                      <tr key={itemId}>
                        <td>{input[itemId].name}</td>
                        <td>{input[itemId].description}</td>
                        <td>${input[itemId].price.toFixed(2)}</td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={itemId}>
                        <td>{itemId}</td>
                        <td>Unknown Item!</td>
                        <td>$AA.BB</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  private checkout() {
    return fetch('/api/transaction', {
      body: JSON.stringify({
        customer_name: this.state.userId,
        purchased_items: this.state.currentCart
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      method: 'POST'
    }).then(response => {
      if (response.ok) {
        this.setState({ currentCart: [], shouldThank: true });
      }
    });
  }

  private onNfcRead = (messages: NfcScan): void => {
    let newId = messages.records[0].data || 'a';
    newId = newId.replace(/[:./]/g, '');
    if (newId === 'httppurchase') {
      this.checkout();
    } else {
      this.setState({
        currentCart: [newId, ...this.state.currentCart]
      });
    }
  };
  private onNameChange = (event: React.FormEvent<FormControl>): void => {
    this.setState({ userId: (event.target as HTMLInputElement).value });
  };
}

export default Cart;
