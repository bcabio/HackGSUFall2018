import * as React from 'react';

import { Grid, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
import InventoryList from './components/InventoryList';
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
            <Route
              exact
              path="/inventory"
              component={subscribeRest(InventoryList, '/api/catalog')}
            />
          </Grid>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
