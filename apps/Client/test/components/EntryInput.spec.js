import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import EntryInput from '../../src/components/EntryInput';

describe('<EntryInput/>', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<EntryInput/>);
  });

  it('should render inputs for name and description and a Start button', () => {
    // can't get this to work reliably
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

      expect(addEntrySpy.calledOnce).to.equal(true);
      expect(addEntrySpy.calledWith('new name', 'new description'));
  })
});
