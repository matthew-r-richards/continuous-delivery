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
    const entry = { taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: pmTime };
    onDeleteSpy = spy();
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy}/>);
  });

  it('should display entry details', () => {
    expect(wrapper.containsAllMatchingElements(
      [
        <Col>new name</Col>,
        <Col>new description</Col>,
        <Col>9:30 AM</Col>,
        <Col>4:59 PM</Col>
      ])).to.be.true;
  });

  it('should display in progress when end date is not defined', () => {
    const entry = { taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: null };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy}/>);
    expect(wrapper.containsAllMatchingElements(
      [
        <Col>9:30 AM</Col>,
        <Col>In progress...</Col>
      ])).to.be.true;
  });

  it('should render a delete button', () => {
    expect(wrapper.containsAllMatchingElements(
      [
         <Button bsStyle="danger"><Glyphicon glyph="remove" /></Button>
      ]
    )).to.be.true;
  });

  it('should only render the stop button if the entry does not have an end time', () => {
    // case where an end time is defined
        expect(wrapper.containsAllMatchingElements(
      [
        <Button><Glyphicon glyph="stop" /></Button>
      ]
    )).to.be.false;

    // no end time
    const entry = { taskName: 'new name', taskDescription: 'new description', taskStart: amTime, taskEnd: null };
    wrapper = shallow(<Entry data={entry} onDelete={onDeleteSpy}/>);
    expect(wrapper.containsAllMatchingElements(
      [
        <Button><Glyphicon glyph="stop" /></Button>
      ]
    )).to.be.true;
  })
});
