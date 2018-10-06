import { Moment } from 'moment';
import * as React from 'react';
import { Col, Label, Panel, Row, Table } from 'react-bootstrap';

export interface TransactionListProps {
  transactions: Transaction[];
}

export interface Transaction {
  time: Moment;
  user: string;
  items: PurchasedItem[];
}

export interface PurchasedItem {
  name: string;
  price: number;
}

const TransactionList: React.SFC<TransactionListProps> = ({ transactions }) => {
  return (
    <Row>
      <Col>
        {transactions.map(transaction => (
          <Panel>
            <Panel.Heading>
              {transaction.user}
              <Label>{transaction.time.fromNow()}</Label>
            </Panel.Heading>
            <Panel.Body>
              <Table responsive condensed>
                <tbody>
                  {transaction.items.map(item => (
                    <tr>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
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
