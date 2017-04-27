import { expect } from 'chai';
import { stub } from 'sinon';

import reload from 'helpers/reload';

import { ActionTypes } from 'constants/ApiConstants';

describe('EntryActionCreators', () => {
    let EntryDispatcher;
    let EntryActionCreators;
    let ApiUtils;

    beforeEach(() => {
        EntryDispatcher = reload('../../src/dispatcher/EntryDispatcher');
        stub(EntryDispatcher, 'dispatch');
        ApiUtils = reload('../../src/utils/ApiUtils');
        stub(ApiUtils, 'addEntry');
        stub(ApiUtils, 'deleteEntry');
        stub(ApiUtils, 'getAllEntries');
        EntryActionCreators = reload('../../src/actions/EntryActionCreators');
    })

    it('dispatches an event and initiates an API call to add an Entry', () => {
        EntryActionCreators.addEntry('new name', 'new description');
        const expectedAction = {
            type: ActionTypes.ADD_ENTRY,
            data: {
                name: 'new name',
                description: 'new description'
            }
        };
        
        expect(EntryDispatcher.dispatch.calledWith(expectedAction)).to.be.true;
        expect(ApiUtils.addEntry.calledWith('new name', 'new description')).to.be.true;
    });

    it('dispatches an event and initiates an API call to delete an Entry', () => {
        EntryActionCreators.deleteEntry(1);
        const expectedAction = {
            type: ActionTypes.DELETE_ENTRY,
            data: 1
        };
        
        expect(EntryDispatcher.dispatch.calledWith(expectedAction)).to.be.true;
        expect(ApiUtils.deleteEntry.calledWith(1)).to.be.true;
    });

    it('dispatches an event and initiates an API call to get all Entries', () => {
        EntryActionCreators.loadEntries();
        const expectedAction = {
            type: ActionTypes.LOAD_ENTRIES
        };

        expect(EntryDispatcher.dispatch.calledWith(expectedAction)).to.be.true;
        expect(ApiUtils.getAllEntries.calledOnce).to.be.true;
    });
});