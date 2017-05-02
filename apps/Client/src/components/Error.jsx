import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

export default class Error extends Component {
    render() {
        return (
            <Alert bsStyle="danger">
                <h4>There has been an error</h4>
                <p>Please try again.</p>
            </Alert>
        )
    }
}