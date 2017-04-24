import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { stub } from 'sinon';

import EntryList from 'components/EntryList';
import Entry from 'components/Entry';

describe('<EntryList/>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<EntryList/>);
    });

    it('should render an empty list', () => {
        wrapper = shallow(<EntryList entries={[]}/>);
        expect(wrapper.contains(<Entry/>)).to.be.false;

        wrapper = shallow(<EntryList entries={undefined}/>);
        expect(wrapper.contains(<Entry/>)).to.be.false;    
    });

    it('should render a populated list', () => {
        const entries = [
            { name: 'name 1', description: 'description 1' },
            { name: 'name 2', description: 'description 2' }
        ];

        wrapper = shallow(<EntryList entries={entries}/>);
        expect(wrapper.find(Entry)).to.have.length(2);

        // check that the entry details are passed through to the Entry component
        expect(wrapper.find(Entry).at(0).prop('data')).to.eql(entries[0]);
        expect(wrapper.find(Entry).at(1).prop('data')).to.eql(entries[1]);
    });
});