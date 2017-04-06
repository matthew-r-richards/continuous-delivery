import React from 'react';
import { mount, shallow } from 'enzyme';
import {expect} from 'chai';

import App from '../../src/components/app';

describe('<App />', () => {
  let wrapper; // "dom" node wrapper element
  beforeEach(() => {
    wrapper = shallow(<App />);
  });
    it('has a greeting', () => {
    expect(wrapper.find('h1'))
        .to.have.length(1);
  });
});