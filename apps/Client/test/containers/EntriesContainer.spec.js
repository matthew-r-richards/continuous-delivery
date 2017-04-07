import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import EntriesContainer from '../../src/containers/EntriesContainer';
import EntryInput from '../../src/components/EntryInput';
import EntryList from '../../src/components/EntryList';
import TimesheetEntry from '../../src/models/TimesheetEntry';

describe('<EntriesContainer/>', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<EntriesContainer/>);
  });

  it('should render EntryInput and EntryList components', () => {
    expect(wrapper.containsAllMatchingElements([
      <EntryInput/>,
      <EntryList/>
    ])).to.equal(true);
  });

  it('should start with an empty entries list', () => {
    expect(wrapper.state('entries')).to.eql([]);
  });

  it('adds entries to the list', () => {
    wrapper.instance().addEntry('new name', 'new description');
    expect(wrapper.state('entries')[0].name).to.eql('new name');
    expect(wrapper.state('entries')[0].description).to.eql('new description');
    // allow ourselves a tolerance of 1s for Date comparisons (to allow for execution time)
    expect(wrapper.state('entries')[0].start.getTime()).to.approximately(new Date().getTime(), 1000);
    expect(wrapper.state('entries')[0].end).to.eql(null);
  });

  it('passes addEntry to EntryInput', () => {
    const entryInput = wrapper.find(EntryInput);
    const addEntry = wrapper.instance().addEntry;
    expect(entryInput.prop('onSubmit')).to.eql(addEntry);
  })

  it('passes a bound addEntry function to EntryInput', () => {
    const entryInput = wrapper.find(EntryInput);
    entryInput.prop('onSubmit')('new name', 'new description')
    expect(wrapper.state('entries')[0].name).to.eql('new name');
    expect(wrapper.state('entries')[0].description).to.eql('new description');
    // allow ourselves a tolerance of 1s for Date comparisons (to allow for execution time)
    expect(wrapper.state('entries')[0].start.getTime()).to.approximately(new Date().getTime(), 1000);
    expect(wrapper.state('entries')[0].end).to.eql(null);
  })
});