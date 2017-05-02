import React, { Component } from 'react';
import { Button, FormGroup, ControlLabel, FormControl, Form, Grid, Glyphicon } from 'react-bootstrap';
import EntryStore from 'stores/EntryStore';
import { StoreEvents } from 'constants/ApiConstants';

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
        this.onEntryAdded = this.onEntryAdded.bind(this);
    }

    componentDidMount() {
        // listen for changes in the store
        EntryStore.addChangeListener(StoreEvents.ENTRY_ADDED, this.onEntryAdded);
    }

    componentWillUnmount() {
        // stop listening for changes in the store
        EntryStore.removeChangeListener(StoreEvents.ENTRY_ADDED, this.onEntryAdded);
    }

    onEntryAdded() {
        const newStateObj = {
            name: '',
            description: ''
        };

        this.setState(newStateObj);
    }

    setName(event) {
        const inputName = event.target.value;
        const newStateObj = {
            name: inputName,
            description: this.state.description,
        };

        this.setState(newStateObj);
    }

    setDescription(event) {
        const inputDesc = event.target.value;
        const newStateObj = {
            name: this.state.name,
            description: inputDesc,
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
                    <Button id="startBtn" bsStyle="success" onClick={this.handleClick} disabled={!this.state.name}><Glyphicon glyph="play" /></Button>
                </Form>
            </Grid>
        )
    }
}

EntryInput.PropTypes = {
    onSubmit: React.PropTypes.func.isRequired
};