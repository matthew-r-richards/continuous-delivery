import React, { Component } from 'react';

import EntryInput from '../components/EntryInput';
import EntryList from '../components/EntryList'

export default class EntriesContainer extends Component {
    render() {
        return (
            <div>
                <EntryInput/>
                <EntryList/>
            </div>
        )
    }
}