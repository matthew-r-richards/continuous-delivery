import React, { Component } from 'react';
import { Grid, Row, Col, ProgressBar } from 'react-bootstrap';

import EntryInput from 'components/EntryInput';
import EntryList from 'components/EntryList';
import Error from 'components/Error';
import Status from 'components/Status';

import EntryActionCreators from 'actions/EntryActionCreators';
import EntryStore from 'stores/EntryStore';
import { StoreEvents } from 'constants/ApiConstants';

export default class EntriesContainer extends Component {
    constructor(props) {
        super(props);
        
        // the list of entries will be empty until the store has been populated
        this.state = {
            entries: [],
            totalDuration: 0,
            showError: false
        };

        this.addEntry = this.addEntry.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        // listen for changes in the store
        EntryStore.addChangeListener(StoreEvents.ENTRIES_CHANGED, this.onChange);

        // create the action to load the initial data
        EntryActionCreators.loadEntries();
    }

    componentWillUnmount() {
        // stop listening for changes in the store
        EntryStore.removeChangeListener(StoreEvents.ENTRIES_CHANGED, this.onChange);
    }

    onChange() {
        // update the component state with the values from the store
        if (EntryStore.getHasApiError()) {
            this.setState({
                entries: this.state.entries,
                totalDuration: this.state.totalDuration,
                showError: true
            })
        } else {
            this.setState({
                entries: EntryStore.getAllEntries(),
                totalDuration: EntryStore.getTotalDuration(),
                showError: false
            })
        }
    }

    addEntry(name, description) {
        EntryActionCreators.addEntry(name, description);
    }

    deleteEntry(id) {
        EntryActionCreators.deleteEntry(id);
    }

    stopEntry(id) {
        EntryActionCreators.stopEntry(id);
    }

    render() {
        return (
            <Grid>
                <Row className="grid-row">
                    <EntryInput onSubmit={this.addEntry}/>
                </Row>
                { this.state.showError && 
                <Row className="grid-row">
                    <Error/>
                </Row>
                }
                <Row className="grid-row">
                    <Status totalDuration={this.state.totalDuration} hoursTarget={8.5}/>
                </Row>
                <Row className="grid-row">
                    <EntryList entries={this.state.entries} onStop={this.stopEntry} onDelete={this.deleteEntry}/>
                </Row>
            </Grid>
        )
    }
}