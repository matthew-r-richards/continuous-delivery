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
        EntryActionCreators = reload('../../src/actions/EntryActionCreators');
    })

    it('dispatches an event and initiates an API call', () => {
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
});