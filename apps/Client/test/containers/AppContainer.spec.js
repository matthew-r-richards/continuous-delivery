import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import AppContainer from '../../src/containers/AppContainer';
import Header from '../../src/components/Header';
import EntriesContainer from '../../src/containers/EntriesContainer';

describe('<App/>', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<AppContainer/>);
  });

  it('should render Header and EntriesContainer components', () => {
    expect(wrapper.containsAllMatchingElements([
      <Header/>,
      <EntriesContainer/>
    ])).to.equal(true);
  });
});