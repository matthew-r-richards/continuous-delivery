import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import EntriesContainer from '../../src/containers/EntriesContainer';
import EntryInput from '../../src/components/EntryInput';
import EntryList from '../../src/components/EntryList';

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
});