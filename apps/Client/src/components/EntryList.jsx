import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Entry from 'components/Entry';

export default class EntryList extends Component {
    render() {
        const entriesExist = this.props.entries && this.props.entries.length > 0;
        let content;
        if (entriesExist) {
            content = this.props.entries.map((entry, index) => (
                <Entry key={index}/>));
        } else {
            content = 'No timesheet entries defined...';
        }
        return this.props.entries ?
            (<Panel>
                {content}
            </Panel>)
        : null;
    }
}

EntryList.propTypes = {
    entries: React.PropTypes.array.isRequired
} 