import React, { Component } from 'react';

import EntryInput from '../components/EntryInput';
import EntryList from '../components/EntryList'

export default class EntriesContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: []
        };
        this.addEntry = this.addEntry.bind(this);
    }

    addEntry(entry) {
        this.setState({
            // do it this way so that we don't mutate existing state
            entries: [].concat(this.state.entries).concat([entry])
        })
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