import React, { Component } from 'react';
import { Grid, Row, Col, Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import moment from 'moment';

export default class Entry extends Component {
    render() {
        const entry = this.props.data;
        const formattedStartTime = moment(entry.start).format('h:m A');
        const formattedEndTime = entry.end ? moment(entry.end).format('h:m A') : 'In progress...';
        const displayStop = !entry.end;

        return (
            <Grid>
                <Row>
                    <Col md={2} className="entry-name">{entry.name}</Col>
                    <Col md={2} className="entry-details">{entry.description}</Col>
                    <Col md={2} className="entry-details">{formattedStartTime}</Col>
                    <Col md={2} className="entry-details">{formattedEndTime}</Col>
                    <Col md={2} mdPush={2}>
                        <ButtonToolbar>
                            { displayStop && <Button bsSize="small"><Glyphicon glyph="stop" /></Button> }
                            <Button bsStyle="danger" bsSize="small"><Glyphicon glyph="remove" /></Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
                <hr />
            </Grid>
        );
    }
}