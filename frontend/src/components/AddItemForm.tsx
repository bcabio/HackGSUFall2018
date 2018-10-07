import * as React from 'react';
import { Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

class AddItemForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      available_count: '',
      description: '',
      id: '',
      name: '',
      price: ''
    };
  }

  public submitForm = (e: any) => {
    const req = new XMLHttpRequest();
    req.open('PUT', '/api/catalog');
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // tslint:disable-next-line
    console.log(JSON.stringify(this.state));
    req.send(JSON.stringify(this.state));
  };

  public render() {
    return (
      <form>
        <FormGroup controlId="addItemFormId" validationState={null}>
          <ControlLabel>Item ID</ControlLabel>
          <FormControl
            type="text"
            value={this.state.id}
            // tslint:disable-next-line
            onChange={e =>
              this.setState({ id: (e.target as HTMLInputElement).value })
            }
          />
        </FormGroup>
        <FormGroup controlId="addItemFormName" validationState={null}>
          <ControlLabel>Item Name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.name}
            // tslint:disable-next-line
            onChange={e =>
              this.setState({ name: (e.target as HTMLInputElement).value })
            }
          />
        </FormGroup>
        <FormGroup controlId="addItemFormDescription" validationState={null}>
          <ControlLabel>Item Description</ControlLabel>
          <FormControl
            type="text"
            value={this.state.description}
            // tslint:disable-next-line
            onChange={e =>
              this.setState({
                description: (e.target as HTMLInputElement).value
              })
            }
          />
        </FormGroup>
        <FormGroup controlId="addItemFormPrice" validationState={null}>
          <ControlLabel>Item Price</ControlLabel>
          <FormControl
            type="text"
            value={this.state.price}
            // tslint:disable-next-line
            onChange={e =>
              this.setState({ price: (e.target as HTMLInputElement).value })
            }
          />
        </FormGroup>
        <FormGroup controlId="addItemFormPrice" validationState={null}>
          <ControlLabel>Item Amount</ControlLabel>
          <FormControl
            type="text"
            value={this.state.count}
            // tslint:disable-next-line
            onChange={e =>
              this.setState({
                available_count: (e.target as HTMLInputElement).value
              })
            }
          />
        </FormGroup>

        <Button onClick={this.submitForm}>Submit</Button>
      </form>
    );
  }
}

export default AddItemForm;
