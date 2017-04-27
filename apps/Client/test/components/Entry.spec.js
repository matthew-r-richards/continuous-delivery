import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Col, Button, Glyphicon } from 'react-bootstrap';
import { spy } from 'sinon';

import Entry from 'components/Entry';

describe('<Entry/>', () => {
  let wrapper;
  let onDeleteSpy;
  const amTime = new Date();
  amTime.setHours(9);
  amTime.setMinutes(30);
  const pmTime = new Date();
  pmTime.setHours(16);
  pmTime.setMinutes(59);

  beforeEach(() => {
    onDeleteSpy = spy();
  });

  it('should display entry details', () => {
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: pmTime };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy}/>);

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
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy}/>);

    expect(wrapper.containsAllMatchingElements(
      [
        <Col>9:30 AM</Col>,
        <Col>In progress...</Col>
      ])).to.be.true;
  });

  it('should render a delete button', () => {
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: pmTime };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy}/>);

    expect(wrapper.find('#deleteBtn')).to.have.length(1);
  });

  it('should only render the stop button if the entry does not have an end time', () => {
    let entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: pmTime };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy}/>);

    // case where an end time is defined
    expect(wrapper.find('#stopBtn')).to.have.length(0);

    // no end time
    entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: null };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy}/>);

    expect(wrapper.find('#stopBtn')).to.have.length(1);
  });

  it('should call onDelete when Delete is clicked', () => {
    const entry = { id: 1, taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: null };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy}/>);
    const deleteButton = wrapper.find('#deleteBtn');

    deleteButton.simulate('click');

    expect(onDeleteSpy.calledOnce).to.be.true;
    expect(onDeleteSpy.calledWith(1));
  })
});
