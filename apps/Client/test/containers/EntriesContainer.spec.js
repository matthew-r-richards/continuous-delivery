import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { stub } from 'sinon';

import reload from 'helpers/reload';

import EntryInput from 'components/EntryInput';
import EntryList from 'components/EntryList';

describe('<EntriesContainer/>', () => {
  let EntriesContainer;
  let wrapper;
  let EntryStore;
  let EntryActionCreators;
  let addEntryStub;
  let stubs;

  beforeEach(() => {
    EntryStore = reload('../../src/stores/EntryStore');
    EntryActionCreators = reload('../../src/actions/EntryActionCreators');

    stubs = {
      EntryStore: {
        getAllEntries: stub(EntryStore, 'getAllEntries'),
        addChangeListener: stub(EntryStore, 'addChangeListener'),
        removeChangeListener: stub(EntryStore, 'removeChangeListener')
      },
      EntryActionCreators: {
        addEntry: stub(EntryActionCreators, 'addEntry')
      }
    };

    // set the EntryStore stub to return a simple set of entries
    stubs.EntryStore.getAllEntries.returns(['entry 1', 'entry 2']);

    EntriesContainer = reload('../../src/containers/EntriesContainer');
    wrapper = shallow(<EntriesContainer/>);
  });

  it('should render EntryInput and EntryList components', () => {
      expect(wrapper.containsAllMatchingElements([
      <EntryInput/>
    ])).to.equal(true);

    expect(wrapper.containsAllMatchingElements([
      <EntryList/>
    ])).to.equal(true);
  });

  it('should fetch entries from the EntryStore on start', () => {
    expect(stubs.EntryStore.getAllEntries.called).to.equal(true);

    expect(wrapper.state().entries.length).to.equal(2);
    expect(wrapper.state().entries[0]).to.equal('entry 1');
    expect(wrapper.state().entries[1]).to.equal('entry 2');
  });

 it('creates an action to add an entry', () => {
    wrapper.instance().addEntry('new name', 'new description');
    expect(stubs.EntryActionCreators.addEntry.calledWith('new name', 'new description')).to.equal(true);
  });

  it('passes addEntry to EntryInput', () => {
    const entryInput = wrapper.find(EntryInput);
    const addEntry = wrapper.instance().addEntry;
    expect(entryInput.prop('onSubmit')).to.eql(addEntry);
  })

  it('passes a bound addEntry function to EntryInput', () => {
    const entryInput = wrapper.find(EntryInput);
    entryInput.prop('onSubmit')('new name', 'new description')

    expect(stubs.EntryActionCreators.addEntry.calledWith('new name', 'new description')).to.equal(true);
  })

  it('should update entries when notified of a change', () => {
    // set the EntryStore stub to return a changed (simple) set of entries
    stubs.EntryStore.getAllEntries.returns(['entry 1', 'entry 2', 'entry 3']);

    wrapper.instance().onChange();

    expect(stubs.EntryStore.getAllEntries.called).to.equal(true);
    expect(wrapper.state().entries.length).to.equal(3);
    expect(wrapper.state().entries[0]).to.equal('entry 1');
    expect(wrapper.state().entries[1]).to.equal('entry 2');
    expect(wrapper.state().entries[2]).to.equal('entry 3');
  });

  it('should add a change listener on mounting', () => {
    wrapper = mount(<EntriesContainer/>);
    expect(stubs.EntryStore.addChangeListener.calledOnce).to.equal(true);
  });

  it('should remove the change listener on unmounting', () => {
    wrapper = mount(<EntriesContainer/>);
    wrapper.unmount();
    expect(stubs.EntryStore.removeChangeListener.calledOnce).to.equal(true);
  });
});