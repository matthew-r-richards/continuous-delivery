import React, { Component } from 'react';

import EntryInput from '../components/EntryInput';
import EntryList from '../components/EntryList'
import TimesheetEntry from '../models/TimesheetEntry';

import EntryActionCreators from '../actions/EntryActionCreators';
import EntryStore from '../stores/EntryStore';

export default class EntriesContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: EntryStore.getAllEntries()
        };
        this.addEntry = this.addEntry.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        // listen for changes in the store
        EntryStore.addChangeListener(this.onChange);
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

    render() {
        return (
            <div>
                <EntryInput onSubmit={this.addEntry}/>
                <EntryList/>
            </div>
        )
    }
}