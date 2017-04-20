import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import AppContainer from 'containers/AppContainer';
import Header from 'components/Header';
import EntriesContainer from 'containers/EntriesContainer';

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