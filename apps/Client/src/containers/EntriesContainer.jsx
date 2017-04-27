import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import EntryInput from 'components/EntryInput';
import EntryList from 'components/EntryList'

import EntryActionCreators from 'actions/EntryActionCreators';
import EntryStore from 'stores/EntryStore';

export default class EntriesContainer extends Component {
    constructor(props) {
        super(props);
        
        // the list of entries will be empty until the store has been populated
        this.state = {
            entries: []
        };

        this.addEntry = this.addEntry.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        // listen for changes in the store
        EntryStore.addChangeListener(this.onChange);

        // create the action to load the initial data
        EntryActionCreators.loadEntries();
    }

    componentWillUnmount() {
        // stop listening for changes in the store
        EntryStore.removeChangeListener(this.onChange);
    }

    onChange() {
        // update the component state with the values from the store
        this.setState({
            entries: EntryStore.getAllEntries()
        })
    }

    addEntry(name, description) {
        EntryActionCreators.addEntry(name, description);
    }

    deleteEntry(id) {
        EntryActionCreators.deleteEntry(id);
    }

    render() {
        return (
            <Grid>
                <Row className="grid-row">
                    <EntryInput onSubmit={this.addEntry}/>
                </Row>
                <Row className="grid-row">
                    <EntryList entries={this.state.entries} onDelete={this.deleteEntry}/>
                </Row>
            </Grid>
        )
    }
}