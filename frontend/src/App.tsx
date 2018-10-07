import * as React from 'react';

import { Grid, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Cart from './components/Cart';
import Home from './components/Home';
import InventoryList from './components/InventoryList';
import subscribeRest from './components/subscribeRest';
import TransactionList from './components/TransactionList';

const AppNav = () => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <span style={{ fontFamily: 'DejaVu Sans' }}>
          <span style={{ fontWeight: 300 }}>MARK</span>
          <span style={{ fontWeight: 600 }}>IT</span>
        </span>
      </Navbar.Brand>
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
);

class App extends React.Component {
  public render() {
    return (
      <Router>
        <React.Fragment>
          <Switch>
            <Route exact path="/cart" component={React.Fragment} />
            <Route path="/" component={AppNav} />
          </Switch>
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
            <Route
              exact
              path="/cart"
              component={subscribeRest(Cart, '/api/catalog')}
            />
          </Grid>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
