import * as React from 'react';

import * as moment from 'moment';
import { Grid, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
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
            </Nav>
          </Navbar>
          <Grid>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/transactions"
              component={ExampleTransactionList}
            />
          </Grid>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
