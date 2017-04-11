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
        EntryStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        EntryStore.removeChangeListener(this.onChange);
    }

    onChange() {
        console.log('EntriesContainer.onChange triggered');
        this.setState({
            entries: EntryStore.getAllEntries()
        })
    }

    addEntry(name, description) {
        EntryActionCreators.addEntry(name, description);
        
        /*
        const entry = new TimesheetEntry(name, description, new Date(), null);

        this.setState({
            // do it this way so that we don't mutate existing state
            entries: [].concat(this.state.entries).concat([entry])
        })*/
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