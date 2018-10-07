import * as React from 'react';
import {
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Row,
  Table
} from 'react-bootstrap';

import { ItemCatalog } from 'src/components/models';

export interface CartProps {
  items: ItemCatalog;
}

interface CartState {
  userId: string;
  currentCart: string[];
}

class Cart extends React.Component<CartProps, CartState> {
  constructor(props: CartProps) {
    super(props);
    this.state = { userId: 'guest', currentCart: [] };
  }

  public render() {
    const { currentCart, userId } = this.state;
    const { items } = this.props;
    return (
      <React.Fragment>
        <Form horizontal>
          <FormGroup controlId="user-name">
            <Col componentClass={ControlLabel} sm={2}>
              Welcome,
            </Col>
            <Col sm={10}>
              <FormControl type="text" placeholder="Name" value={userId} />
            </Col>
          </FormGroup>
        </Form>
        <Row>
          <Col>
            <Table striped hover>
              <tbody>
                {currentCart.map(itemId => (
                  <tr>
                    <td>{items[itemId].name}</td>
                    <td>{items[itemId].description}</td>
                    <td>${items[itemId].price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Cart;
