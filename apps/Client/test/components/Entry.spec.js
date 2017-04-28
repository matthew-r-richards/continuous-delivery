import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { Col, Button, Glyphicon } from 'react-bootstrap';
import { spy, useFakeTimers } from 'sinon';

import Entry from 'components/Entry';

describe('<Entry/>', () => {
  let wrapper;
  let onDeleteSpy, onStopSpy, calculateSpy;
  let amTime, pmTime;
  let fakeClock;

  beforeEach(() => {
    onDeleteSpy = spy();
    onStopSpy = spy();
    calculateSpy = spy(Entry.prototype, 'calculateElapsedTime');

    // use the sinon fake timers functionality so that we can control the execution timeline
    fakeClock = useFakeTimers();

    amTime = new Date();
    amTime.setHours(9);
    amTime.setMinutes(30);
    pmTime = new Date();
    pmTime.setHours(16);
    pmTime.setMinutes(59);
  });

  afterEach(() => {
    calculateSpy.restore();
    
    // restore the clock so we don't affect other tests
    fakeClock.restore();
  });

  it('should display entry details', () => {
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: pmTime };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy} onStop={onStopSpy}/>);

    expect(wrapper.containsAllMatchingElements(
      [
        <Col>new name</Col>,
        <Col>new description</Col>,
        <Col>9:30 AM</Col>,
        <Col>4:59 PM</Col>
      ])).to.be.true;
  });

  it('should display in progress when end date is not defined', () => {
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: null };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy} onStop={onStopSpy}/>);

    expect(wrapper.containsAllMatchingElements(
      [
        <Col>9:30 AM</Col>,
        <Col>In progress...</Col>
      ])).to.be.true;
  });

  it('should display elapsed time on start if no end time is specified', () => {
    // set up for an elapsed time of 15 minutes
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - 15);
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: startTime, taskEnd: null };
    wrapper = mount(<Entry data={entry} onDelete={onDeleteSpy} onStop={onStopSpy}/>);

    expect(calculateSpy.calledOnce).to.be.true;

    expect(wrapper.containsAllMatchingElements(
      [
        <Col>15m</Col>
      ])).to.be.true;
  });

  it('should display duration on start if an end time is specified', () => {
    // set up for a duration time of 90 minutes (1h 30m)
    const startTime = new Date();
    const endTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - 90);
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: startTime, taskEnd: endTime };
    wrapper = mount(<Entry data={entry} onDelete={onDeleteSpy} onStop={onStopSpy}/>);

    expect(calculateSpy.calledOnce).to.be.true;

    expect(wrapper.containsAllMatchingElements(
      [
        <Col>1h 30m</Col>
      ])).to.be.true;
  });

  it('should update elapsed time every 5s if no end time is specified', () => {
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - 15);
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: startTime, taskEnd: null };
    wrapper = mount(<Entry data={entry} onDelete={onDeleteSpy} onStop={onStopSpy}/>);
    calculateSpy.reset();

    expect(wrapper.containsAllMatchingElements(
      [
        <Col>15m</Col>
      ])).to.be.true;

    fakeClock.tick(5000);
    expect(calculateSpy.calledOnce).to.be.true;

    fakeClock.tick(5000);
    expect(calculateSpy.calledTwice).to.be.true;

    // check the time has been updated after a minute (we've already had 10s)
    fakeClock.tick(50000);
    expect(wrapper.containsAllMatchingElements(
      [
        <Col>16m</Col>
      ])).to.be.true;
  });

  it('should not update duration (i.e. end time is specified) after the initial calculation', () => {
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - 15);
    const endTime = new Date();
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: startTime, taskEnd: endTime };
    wrapper = mount(<Entry data={entry} onDelete={onDeleteSpy} onStop={onStopSpy}/>);
    calculateSpy.reset();

    expect(wrapper.containsAllMatchingElements(
      [
        <Col>15m</Col>
      ])).to.be.true;

    fakeClock.tick(600000) // 1 hour
    expect(calculateSpy.notCalled).to.be.true;

    expect(wrapper.containsAllMatchingElements(
      [
        <Col>15m</Col>
      ])).to.be.true;
  });

  it('should render a delete button', () => {
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: pmTime };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy} onStop={onStopSpy}/>);

    expect(wrapper.find('#deleteBtn')).to.have.length(1);
  });

  it('should only render the stop button if the entry does not have an end time', () => {
    let entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: pmTime };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy} onStop={onStopSpy}/>);

    // case where an end time is defined
    expect(wrapper.find('#stopBtn')).to.have.length(0);

    // no end time
    entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: null };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy} onStop={onStopSpy}/>);

    expect(wrapper.find('#stopBtn')).to.have.length(1);
  });

  it('should call onDelete when Delete is clicked', () => {
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: null };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy} onStop={onStopSpy}/>);
    const deleteButton = wrapper.find('#deleteBtn');

    deleteButton.simulate('click');

    expect(onDeleteSpy.calledOnce).to.be.true;
    expect(onDeleteSpy.calledWith(1));
  });

  it('should call onStop when Stop is clicked', () => {
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: null };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy} onStop={onStopSpy}/>);
    const stopButton = wrapper.find('#stopBtn');

    stopButton.simulate('click');

    expect(onStopSpy.calledOnce).to.be.true;
    expect(onStopSpy.calledWith(1));
  })
});
