import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Col, Button, Glyphicon } from 'react-bootstrap';

import Entry from 'components/Entry';
import TimesheetEntry from 'models/TimesheetEntry';

describe('<Entry/>', () => {
  let wrapper;
  const amTime = new Date();
  amTime.setHours(9);
  amTime.setMinutes(30);
  const pmTime = new Date();
  pmTime.setHours(16);
  pmTime.setMinutes(59);

  beforeEach(() => {
    const entry = new TimesheetEntry('new name', 'new description', amTime, pmTime);
    wrapper = shallow(<Entry data={entry}/>);
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
    const entry = new TimesheetEntry('new name', 'new description', amTime, null);
    wrapper = shallow(<Entry data={entry}/>);
    expect(wrapper.containsAllMatchingElements(
      [
        <Col>9:30 AM</Col>,
        <Col>In progress...</Col>
      ])).to.be.true;
  });

  it('should render stop and delete buttons', () => {
    expect(wrapper.containsAllMatchingElements(
      [
        <Button><Glyphicon glyph="stop" /></Button>,
        <Button><Glyphicon glyph="delete" /></Button>
      ]
    ))
  })
});
