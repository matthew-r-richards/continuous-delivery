import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { stub } from 'sinon';

import EntriesContainer from 'containers/EntriesContainer';
import EntryInput from 'components/EntryInput';
import EntryList from 'components/EntryList';
import TimesheetEntry from 'models/TimesheetEntry';

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

  it('should fetch entries from the EntryStore on start', () => {
    // create a stub for the EntryStore.getAllEntries function
    var stubbedStore = { getAllEntries: stub() };
    const inject = require('inject-loader!containers/EntriesContainer.jsx');
    let NewEntriesContainer = inject({
      'stores/EntryStore': stubbedStore
    }).default;

    wrapper = shallow(<NewEntriesContainer/>);
    expect(stubbedStore.getAllEntries.called).to.eql(true);
  });

  it('creates an action to add an entry', () => {
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
    // create a stub for the addEntry method
    const addEntryStub = stub(wrapper.instance(), 'addEntry');
    
    const entryInput = wrapper.find(EntryInput);
    entryInput.prop('onSubmit')('new name', 'new description')

    expect(addEntryStub.calledOnce).to.eql(true);
    expect(addEntryStub.calledWith('new name', 'new description'));
  })
});