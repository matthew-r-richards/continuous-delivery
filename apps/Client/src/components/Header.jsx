import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';

export default class Header extends Component {
    render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        Timesheets
                    </Navbar.Brand>
                </Navbar.Header>
            </Navbar>)
    }
}