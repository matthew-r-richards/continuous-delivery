import React, { Component } from 'react';
import { Button, FormGroup, ControlLabel, FormControl, Form, Grid } from 'react-bootstrap';

export default class EntryInput extends Component {
    constructor() {
        super();

        this.state = {
            name: '',
            description: ''
        }

        this.setName = this.setName.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    setName(event) {
        const inputName = event.target.value;
        const newStateObj = {
            name: inputName,
            description: this.state.description
        };

        this.setState(newStateObj);
    }

    setDescription(event) {
        const inputDesc = event.target.value;
        const newStateObj = {
            name: this.state.name,
            description: inputDesc
        };

        this.setState(newStateObj);
    }

    handleClick() {
        this.props.onSubmit(this.state.name, this.state.description);
    }

    render() {
        return (
            <Grid>
            <Form inline>
                <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    {'  '}
                    <FormControl type="text" id="nameInput" value={this.state.name} onChange={this.setName} placeholder="Task name"/>
                </FormGroup>
                {'  '}
                <FormGroup>
                    <ControlLabel>Description</ControlLabel>
                    {'  '}
                    <FormControl type="text" id="descInput" value={this.state.description} onChange={this.setDescription} placeholder="Task description"/>
                </FormGroup>
                {'  '}
                <Button onClick={this.handleClick} bsStyle="success">Start</Button>
            </Form>
            </Grid>
        )
    }
}

EntryInput.PropTypes = {
    onSubmit: React.PropTypes.func.isRequired
};