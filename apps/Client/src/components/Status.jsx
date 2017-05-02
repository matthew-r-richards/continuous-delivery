import React, { Component } from 'react';
import { Grid, Row, Col, ProgressBar } from 'react-bootstrap';
import moment from 'moment';

export default class Status extends Component {
    render() {
        const progress = (this.props.totalDuration / (this.props.hoursTarget * 60)) * 100;
        let progressStyle;

        if (progress < 60) {
            progressStyle = 'danger';
        } else if (progress < 100) {
            progressStyle = 'warning';
        } else {
            progressStyle = 'success'
        }

        const hours = Math.floor(this.props.totalDuration / 60);
        const minutes = hours > 0 ? this.props.totalDuration % (60 * hours) : this.props.totalDuration;
        let elapsedTime;

        if (hours === 0 && minutes === 0) {
            elapsedTime = '0m';
        } else {
            elapsedTime = (hours > 0 ? `${hours}h ` : '') + (minutes > 0 ? `${minutes}m` : '');
        }

        const targetHours = Math.floor(this.props.hoursTarget);
        const targetMins = (this.props.hoursTarget - targetHours) * 60;
        const targetTime = (targetHours > 0 ? `${targetHours}h ` : '') + (targetMins > 0 ? `${targetMins}m` : '');

        return(
            <Grid>
                <Row>
                    <Col md={8}>
                        <ProgressBar now={progress} bsStyle={progressStyle} />
                    </Col>
                    <Col md={4}>
                        Actual: {elapsedTime}, Target: {targetTime}
                    </Col>
                </Row>
            </Grid>
        );
    }
}

Status.propTypes = {
    totalDuration: React.PropTypes.number.isRequired,
    hoursTarget: React.PropTypes.number.isRequired
};