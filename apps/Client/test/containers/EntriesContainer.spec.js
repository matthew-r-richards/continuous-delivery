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
    const now = new Date();
    const entry = new TimesheetEntry('name', 'description', now, null);
    wrapper.instance().addEntry(entry);
    expect(wrapper.state('entries')).to.eql([entry])
  });

  it('passes addEntry to EntryInput', () => {
    const entryInput = wrapper.find(EntryInput);
    const addEntry = wrapper.instance().addEntry;
    expect(entryInput.prop('onSubmit')).to.eql(addEntry);
  })

  it('passes a bound addEntry function to EntryInput', () => {
    const now = new Date();
    const entry = new TimesheetEntry('name', 'description', now, null);
    const entryInput = wrapper.find(EntryInput);
    entryInput.prop('onSubmit')(entry)
    expect(wrapper.state('entries')).to.eql([entry]);
  })
});