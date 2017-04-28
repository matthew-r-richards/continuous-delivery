import React, { Component } from 'react';
import { Grid, Row, Col, Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import moment from 'moment';

export default class Entry extends Component {
    constructor() {
        super();

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleStopClick = this.handleStopClick.bind(this);
        this.calculateElapsedTime = this.calculateElapsedTime.bind(this);

        this.state = {
            elapsedTime: ''
        }
    }
    
    componentDidMount() {
        this.calculateElapsedTime();
    }

    handleStopClick() {
        this.props.onStop(this.props.data.id);
    }

    handleDeleteClick() {
        this.props.onDelete(this.props.data.id);
    }

    calculateElapsedTime() {
        console.log('in calculated elapsed time');
        const entry = this.props.data;
        const endTime = entry.taskEnd ? moment(entry.taskEnd) : moment();
        const diffInMinutes = endTime.diff(moment(entry.taskStart), 'minutes');
        const hours = Math.floor(diffInMinutes / (60));
        const minutes = hours > 0 ? diffInMinutes % (60 * hours) : diffInMinutes;
        let elapsedTime;

        if (hours === 0 && minutes === 0) {
            elapsedTime = '0m';
        } else {
            elapsedTime = (hours > 0 ? `${hours}h ` : '') + (minutes > 0 ? `${minutes}m` : '');
        }

        if (entry.taskEnd) {
            this.setState({
                elapsedTime: elapsedTime
            });
        } else {
            // if we don't have an end time defined, we need to update the elapsedTime regularly
            this.setState({
                elapsedTime: elapsedTime
            }, () => {
                setTimeout(this.calculateElapsedTime, 5000)
            })
        }
    }
    
    render() {
        const entry = this.props.data;
        const formattedStartTime = moment(entry.taskStart).format('h:mm A');
        const formattedEndTime = entry.taskEnd ? moment(entry.taskEnd).format('h:mm A') : 'In progress...';
        const completeEntry = entry.taskEnd;
        const rowClass = completeEntry ? 'complete' : 'incomplete';

        return (
            <Grid>
                <Row className={rowClass}>
                    <Col md={3} className="entry-name">{entry.taskName}</Col>
                    <Col md={3} className="entry-details">{entry.taskDescription}</Col>
                    <Col md={1} className="entry-details">{formattedStartTime}</Col>
                    <Col md={1} className="entry-details">{formattedEndTime}</Col>
                    <Col md={1} className="entry-details">{this.state.elapsedTime}</Col>
                    <Col md={2} mdPush={1}>
                        <ButtonToolbar>
                            { !completeEntry && <Button id="stopBtn" bsSize="small" onClick={this.handleStopClick}><Glyphicon glyph="stop" /></Button> }
                            <Button id="deleteBtn" bsStyle="danger" bsSize="small" onClick={this.handleDeleteClick}><Glyphicon glyph="remove" /></Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
                <hr />
            </Grid>
        );
    }
}

Entry.propTypes = {
    data: React.PropTypes.object.isRequired,
    onStop: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired
};