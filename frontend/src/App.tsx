import * as React from 'react';

import * as moment from 'moment';
import { Grid, Nav, Navbar, NavItem } from 'react-bootstrap';

import TransactionList from './components/TransactionList';

class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#home">React-Bootstrap</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} href="#">
              Link
            </NavItem>
          </Nav>
        </Navbar>
        <Grid>
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
        </Grid>
      </React.Fragment>
    );
  }
}

export default App;
