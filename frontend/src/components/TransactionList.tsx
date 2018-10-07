import * as lodash from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { Col, Label, Panel, Row, Table } from 'react-bootstrap';

export interface TransactionListProps {
  input: { [v: string]: Transaction };
}

export interface Transaction {
  purchase_time: string;
  customer_name: string;
  purchased_items: PurchasedItem[];
}

export interface PurchasedItem {
  name: string;
  price: number;
}

const TransactionList: React.SFC<TransactionListProps> = ({ input }) => {
  if (input == null) {
    return <span>loading...</span>;
  }

  return (
    <Row>
      <Col>
        {lodash.values(input).map(transaction => (
          <Panel>
            <Panel.Heading>
              {transaction.customer_name}
              <Label>{moment(transaction.purchase_time).fromNow()}</Label>
            </Panel.Heading>
            <Panel.Body>
              <Table responsive condensed>
                <tbody>
                  {transaction.purchased_items.map(item => (
                    <tr>
                      <td>{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Panel.Body>
          </Panel>
        ))}
      </Col>
    </Row>
  );
};

export default TransactionList;
