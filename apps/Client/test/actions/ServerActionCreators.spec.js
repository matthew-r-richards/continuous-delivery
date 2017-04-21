import { expect } from 'chai';
import { stub } from 'sinon';

import reload from 'helpers/reload';

import { ActionTypes } from 'constants/ApiConstants';

describe('ServerActionCreators', () => {
    let EntryDispatcher;
    let ServerActionCreators;

    beforeEach(() => {
        EntryDispatcher = reload('../../src/dispatcher/EntryDispatcher');
        stub(EntryDispatcher, 'dispatch');
        ServerActionCreators = reload('../../src/actions/ServerActionCreators');
    })

    it('dispatches an event', () => {
        const entry = { name: 'new name', description: 'new description' };
        ServerActionCreators.receiveAddedEntry(entry);
        expect(EntryDispatcher.dispatch.calledWith(ActionTypes.RECEIVE_ADD_ENTRY, entry));
    });
});