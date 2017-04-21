import { expect } from 'chai';
import { stub } from 'sinon';

import { ActionTypes } from 'constants/ApiConstants';

describe('ServerActionCreators', () => {
    let ServerActionCreators;

    // create a stub for the EntryDispatcher
    const stubbedDispatcher = { dispatch: stub() };

    beforeEach(() => {
        const inject = require('inject-loader!actions/ServerActionCreators.js');
        
        ServerActionCreators = inject({
            'dispatcher/EntryDispatcher': stubbedDispatcher
        }).default;
    })

    it('dispatches an event', () => {
        const entry = { name: 'new name', description: 'new description' };
        ServerActionCreators.receiveAddedEntry(entry);
        expect(stubbedDispatcher.dispatch.calledWith(ActionTypes.RECEIVE_ADD_ENTRY, entry));
    });
});