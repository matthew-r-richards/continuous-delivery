import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { FormControl, Button } from 'react-bootstrap';

import reload from 'helpers/reload';

import { StoreEvents } from 'constants/ApiConstants';

describe('<EntryInput/>', () => {
  let wrapper;
  let EntryStore, EntryInput;

  beforeEach(() => {
    EntryStore = reload('../../src/stores/EntryStore');
    stub(EntryStore, 'addChangeListener');
    stub(EntryStore, 'removeChangeListener');
    EntryInput = reload('../../src/components/EntryInput');
    wrapper = shallow(<EntryInput/>);
  });

  afterEach(() => {
    EntryStore.addChangeListener.restore();
    EntryStore.removeChangeListener.restore();
  });

  it('should render inputs for name and description and a Start button', () => {
    expect(wrapper.containsAllMatchingElements([
      <FormControl id="nameInput"/>
    ])).to.be.true;

    expect(wrapper.containsAllMatchingElements([
      <FormControl id="descInput"/>
    ])).to.be.true;

    expect(wrapper.find(Button)).to.have.length(1);
  });

  it('should accept input for name', () => {
    wrapper = mount(<EntryInput/>); // need to use mount to check the input bindings
    const nameInput = wrapper.find('#nameInput');
    nameInput.simulate('change', { target: { value: 'new name' } });
    expect(wrapper.state('name')).to.equal('new name');
    expect(nameInput.prop('value')).to.equal('new name');
  });

  it('should accept input for description', () => {
    wrapper = mount(<EntryInput/>); // need to use mount to check the input bindings
    const descInput = wrapper.find('#descInput');
    descInput.simulate('change', { target: { value: 'new description' } });
    expect(wrapper.state('description')).to.equal('new description');
    expect(descInput.prop('value')).to.equal('new description');
  });

  it('should call onSubmit when Start is clicked', () => {
      const addEntrySpy = spy();
      wrapper = shallow(<EntryInput onSubmit={addEntrySpy}/>);
      wrapper.setState({ name: 'new name', description: 'new description' });
      const startButton = wrapper.find('Button');

      startButton.simulate('click');

      expect(addEntrySpy.calledOnce).to.be.true;
      expect(addEntrySpy.calledWith('new name', 'new description'));
  });

  it('should add a change listener on mounting', () => {
    wrapper = mount(<EntryInput/>);
    const onEntryAdded = wrapper.instance().onEntryAdded;
    expect(EntryStore.addChangeListener.calledWith(StoreEvents.ENTRY_ADDED, onEntryAdded)).to.be.true;
  });

  it('should remove the change listener on unmounting', () => {
    wrapper = mount(<EntryInput/>);
    const onEntryAdded = wrapper.instance().onEntryAdded;
    wrapper.unmount();
    expect(EntryStore.removeChangeListener.calledWith(StoreEvents.ENTRY_ADDED, onEntryAdded)).to.be.true;
  });
});
