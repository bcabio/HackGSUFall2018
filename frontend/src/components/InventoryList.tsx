import * as lodash from 'lodash';
import * as React from 'react';
import { Button, ButtonToolbar, Col, Row, Table } from 'react-bootstrap';
import { ItemCatalog } from './models';

export interface InventoryListProps {
  input: ItemCatalog;
}

const InventoryList: React.SFC<InventoryListProps> = props => {
  if (props.input == null) {
    return <span>loading...</span>;
  }

  return (
    <React.Fragment>
      <Row style={{ marginBottom: '1em' }}>
        <Col>
          <ButtonToolbar>
            <Button bsStyle="primary">Add item</Button>
          </ButtonToolbar>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Remaining</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lodash
                .values(props.input)
                .filter(item => item.is_active)
                .map(item => (
                  <tr>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.available_count}</td>
                    <td>
                      <Button bsStyle="primary">Remove</Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default InventoryList;
