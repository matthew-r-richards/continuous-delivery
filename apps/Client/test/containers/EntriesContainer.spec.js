import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { stub } from 'sinon';

import EntryInput from 'components/EntryInput';
import EntryList from 'components/EntryList';

describe('<EntriesContainer/>', () => {
  let EntriesContainer;
  let wrapper;

  // create a stub for the EntryStore and EntryActionCreators
  const stubbedStore = {
    getAllEntries: stub(),
    addChangeListener: stub(),
    removeChangeListener: stub()
  };
  const stubbedActions = { addEntry: stub() };

  beforeEach(() => {
    const inject = require('inject-loader!containers/EntriesContainer.jsx');
    
    EntriesContainer = inject({
      'stores/EntryStore': stubbedStore,
      'actions/EntryActionCreators': stubbedActions
    }).default;

    wrapper = shallow(<EntriesContainer/>);
  });

  it('should render EntryInput and EntryList components', () => {
    expect(wrapper.containsAllMatchingElements([
      <EntryInput/>,
      <EntryList/>
    ])).to.equal(true);
  });

  it('should fetch entries from the EntryStore on start', () => {
    // TODO: mock the return and then make sure that entries is set appropriately
    expect(stubbedStore.getAllEntries.called).to.eql(true);
  });

  it('creates an action to add an entry', () => {
    wrapper.instance().addEntry('new name', 'new description');
    expect(stubbedActions.addEntry.calledWith('new name', 'new description')).to.eql(true);
  });

  it('passes addEntry to EntryInput', () => {
    const entryInput = wrapper.find(EntryInput);
    const addEntry = wrapper.instance().addEntry;
    expect(entryInput.prop('onSubmit')).to.eql(addEntry);
  })

  it('passes a bound addEntry function to EntryInput', () => {
    const entryInput = wrapper.find(EntryInput);
    entryInput.prop('onSubmit')('new name', 'new description')

    expect(stubbedActions.addEntry.calledWith('new name', 'new description')).to.eql(true);
  })

  it('should update entries when notified of a change', () => {
    // TODO: mock the return and then make sure that entries is set appropriately
    wrapper.instance().onChange();
    expect(stubbedStore.getAllEntries.called).to.eql(true);
  });

  it('should add a change listener on mounting', () => {
    wrapper = mount(<EntriesContainer/>);
    expect(stubbedStore.addChangeListener.calledOnce).to.eql(true);
  });

  it('should remove the change listener on unmounting', () => {
    wrapper = mount(<EntriesContainer/>);
    wrapper.unmount();
    expect(stubbedStore.removeChangeListener.calledOnce).to.eql(true);
  });
});