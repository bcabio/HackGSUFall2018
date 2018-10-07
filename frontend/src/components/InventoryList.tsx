import * as React from 'react';
import { Button, Col, Label, Panel, Row } from 'react-bootstrap';

export interface InventoryListProps {
  inventory: Item[];
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

const InventoryList: React.SFC<InventoryListProps> = props => {
  // function openAddDialogModel() {
  // 	render(
  // 		<Modal.
  // 	)
  // }

  return (
    <Row>
      <Button bsStyle="primary">Add items</Button>
      <Col>
        {props.inventory.map(item => (
          <Panel>
            <Panel.Heading>
              {item.name}
              <Label>(ID: {item.id})</Label>
            </Panel.Heading>
            <Panel.Body>
              <p>
                <b>Description:</b> {item.description}
              </p>
              <p>
                <b>Price:</b> ${item.price.toFixed(2)}
              </p>
            </Panel.Body>
          </Panel>
        ))}
      </Col>
    </Row>
  );
};

export default InventoryList;
