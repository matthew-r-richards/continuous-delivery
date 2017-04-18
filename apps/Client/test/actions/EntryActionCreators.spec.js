import { expect } from 'chai';
import { stub } from 'sinon';

import { ActionTypes } from 'constants/ApiConstants';

describe('EntryActionCreators', () => {
    let EntryActionCreators;

    // create a stub for the EntryDispatcher and ApiUtils
    const stubbedDispatcher = { handleViewAction: stub() };
    const stubbedApi = { addEntry: stub() };

    beforeEach(() => {
        const inject = require('inject-loader!actions/EntryActionCreators.js');
        
        EntryActionCreators = inject({
            'dispatcher/EntryDispatcher': stubbedDispatcher,
            'utils/ApiUtils': stubbedApi
        }).default;
    })

    it('dispatches an event and initiates an API call', () => {
        EntryActionCreators.addEntry('new name', 'new description');
        expect(stubbedDispatcher.handleViewAction.calledWith(ActionTypes.ADD_ENTRY, 'new name', 'new description'));
    });
});