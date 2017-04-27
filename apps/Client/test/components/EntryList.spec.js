import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import EntryList from 'components/EntryList';
import Entry from 'components/Entry';

describe('<EntryList/>', () => {
    let wrapper;
    let onDeleteSpy, onStopSpy;

    beforeEach(() => {
        onDeleteSpy = spy();
        onStopSpy = spy();
    });

    it('should render an empty list', () => {
        wrapper = shallow(<EntryList entries={[]} onStop={onStopSpy} onDelete={onDeleteSpy}/>);
        expect(wrapper.find(Entry)).to.have.length(0);  
    });

    it('should render a populated list', () => {
        const entries = [
            { name: 'name 1', description: 'description 1' },
            { name: 'name 2', description: 'description 2' }
        ];

        wrapper = shallow(<EntryList entries={entries} onStop={onStopSpy} onDelete={onDeleteSpy}/>);
        expect(wrapper.find(Entry)).to.have.length(2);

        // check that the entry details are passed through to the Entry component
        expect(wrapper.find(Entry).at(0).prop('data')).to.eql(entries[0]);
        expect(wrapper.find(Entry).at(1).prop('data')).to.eql(entries[1]);
    });

    it('passes through onDelete and onStop functions to each Entry instance', () => {
        const entries = [
            { name: 'name 1', description: 'description 1' },
            { name: 'name 2', description: 'description 2' }
        ];

        wrapper = shallow(<EntryList entries={entries} onStop={onStopSpy} onDelete={onDeleteSpy}/>);
        const entryElements = wrapper.find(Entry);

        entryElements.forEach(element => {
            expect(element.prop('onDelete')).to.eql(onDeleteSpy);
            expect(element.prop('onStop')).to.eql(onStopSpy);
        });
    })
});