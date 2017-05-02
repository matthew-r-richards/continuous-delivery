import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { Col, ProgressBar } from 'react-bootstrap';
import { spy, useFakeTimers } from 'sinon';

import Status from 'components/Status';

describe('<Status/>', () => {
  let wrapper;
  let progressBar, progressText;

  it('should display progress towards target', () => {
    wrapper = shallow(<Status totalDuration={120} hoursTarget={2}/>);
    progressBar = wrapper.find(ProgressBar);
    expect(progressBar.prop('now')).to.equal(100);
  });

  it('should style progress bar with success style for progress >= 100%', () => {
    // 100%
    wrapper = shallow(<Status totalDuration={2 * 60 * 1} hoursTarget={2}/>);
    progressBar = wrapper.find(ProgressBar);
    expect(progressBar.prop('now')).to.equal(100);
    expect(progressBar.prop('bsStyle')).to.equal('success');

    // 110%
    wrapper = shallow(<Status totalDuration={2 * 60 * 1.1} hoursTarget={2}/>);
    progressBar = wrapper.find(ProgressBar);
    expect(progressBar.prop('now')).to.be.closeTo(110, 0.1);
    expect(progressBar.prop('bsStyle')).to.equal('success');
  });

  it('should style progress bar with warning style for 60% >= progress < 100%', () => {
    // 60%
    wrapper = shallow(<Status totalDuration={2 * 60 * 0.6} hoursTarget={2}/>);
    progressBar = wrapper.find(ProgressBar);
    expect(progressBar.prop('now')).to.be.closeTo(60, 0.1);
    expect(progressBar.prop('bsStyle')).to.equal('warning');

    // 99%
    wrapper = shallow(<Status totalDuration={2 * 60 * 0.99} hoursTarget={2}/>);
    progressBar = wrapper.find(ProgressBar);
    expect(progressBar.prop('now')).to.be.closeTo(99, 0.1);
    expect(progressBar.prop('bsStyle')).to.equal('warning');
  });

  it('should style progress bar with danger style for progress < 60%', () => {
    // 59%
    wrapper = shallow(<Status totalDuration={2 * 60 * 0.59} hoursTarget={2}/>);
    progressBar = wrapper.find(ProgressBar);
    expect(progressBar.prop('now')).to.be.closeTo(59, 0.1);
    expect(progressBar.prop('bsStyle')).to.equal('danger');
  });

  it('should display target and actual hours', () => {
    wrapper = shallow(<Status totalDuration={30} hoursTarget={8.5}/>);
    expect(wrapper.containsAllMatchingElements([
      <Col>Actual: 30m, Target: 8h 30m</Col>
    ])).to.be.true;
  });
});
