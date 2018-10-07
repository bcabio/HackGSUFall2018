import * as React from 'react';

import { Grid, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
import InventoryList from './components/InventoryList';
import TransactionList from './components/TransactionList';

const ExampleTransactionList = () => (
  <TransactionList
    transactions={[
      {
        items: [{ name: 'old apple', price: 500 }],
        time: moment().subtract(7, 'days'),
        user: 'flaviu'
      },
      {
        items: [{ name: 'old apple', price: 500 }],
        time: moment().subtract(7, 'days'),
        user: 'flaviu'
      },
      {
        items: [{ name: 'old apple', price: 500 }],
        time: moment().subtract(7, 'days'),
        user: 'flaviu'
      }
    ]}
  />
);

const ExampleInventoryList = () => (
  <InventoryList
    inventory={[
      {
        description: 'Best apples',
        id: 1,
        name: 'Gala Apples',
        price: 0.8
      },
      {
        description: 'Okay apples',
        id: 2,
        name: 'Red Delicious Apples',
        price: 0.8
      },
      {
        description: 'Worst apples',
        id: 3,
        name: 'Granny Smith Apples',
        price: 0.8
      }
    ]}
  />
);

import subscribeRest from './components/subscribeRest';
import TransactionList from './components/TransactionList';

class App extends React.Component {
  public render() {
    return (
      <Router>
        <React.Fragment>
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>Apple Store</Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <LinkContainer to="/transactions">
                <NavItem eventKey={1} href="/transactions">
                  Transactions
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/inventory">
                <NavItem eventKey={1} href="/inventory">
                  Inventory
                </NavItem>
              </LinkContainer>
            </Nav>
          </Navbar>
          <Grid>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/transactions"
              component={subscribeRest(TransactionList, '/api/transactions')}
            />
            <Route exact path="/inventory" component={ExampleInventoryList} />
          </Grid>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
