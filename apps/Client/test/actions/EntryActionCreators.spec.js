import { expect } from 'chai';
import { stub } from 'sinon';

import reload from 'helpers/reload';

import { ActionTypes } from 'constants/ApiConstants';

describe('EntryActionCreators', () => {
    let EntryDispatcher;
    let EntryActionCreators;

    beforeEach(() => {
        EntryDispatcher = reload('../../src/dispatcher/EntryDispatcher');
        stub(EntryDispatcher, 'dispatch');
        EntryActionCreators = reload('../../src/actions/EntryActionCreators');
    })

    it('dispatches an event and initiates an API call', () => {
        EntryActionCreators.addEntry('new name', 'new description');
        expect(EntryDispatcher.dispatch.calledWith(ActionTypes.ADD_ENTRY, 'new name', 'new description'));
    });
});