// Help from https://github.com/subyraman/react-flux-facebook-api-example/blob/master/tests/js/stores/FacebookStoreTest.js

import { expect } from 'chai';
import { stub, spy } from 'sinon';

import reload from 'helpers/reload';

import { ActionTypes } from 'constants/ApiConstants';

describe('EntryStore', () => {
    let EntryStore;
    let EntryDispatcher;
    let dispatcherCallback;

    beforeEach(() => {
        EntryDispatcher = reload('../../src/dispatcher/EntryDispatcher');
        stub(EntryDispatcher, 'register').returns(12); // dispatch token
        
        // The dispatcher is attached in the module initialisation, so
        // we have to reinitialise the module
        EntryStore = reload('../../src/stores/EntryStore');

        spy(EntryStore, 'emitChange');

        // save the dispatch callback, so action effects on the store can be tested
        dispatcherCallback = EntryDispatcher.register.getCall(0).args[0];
    });

    afterEach(() => {
        EntryDispatcher.register.restore();
        EntryStore.emitChange.restore();
    });

    it('should register with the dispatcher', () => {
        expect(EntryDispatcher.register.calledOnce).to.be.true;
        expect(EntryStore.dispatchToken).to.equal(12);
        expect(dispatcherCallback).to.be.not.null;
    })

    it('should add an entry to the store', () => {
        // trigger the dispatcher callback
        var action = {
            type: ActionTypes.RECEIVE_ADD_ENTRY,
            data: {
                name: 'new name',
                description: 'new description'
            }
        };

        dispatcherCallback(action);

        // check the Store contents
        const entries = EntryStore.getAllEntries();
        expect(entries.length).to.equal(1);
        expect(entries[0].name).to.equal('new name');
        expect(entries[0].description).to.equal('new description');

        // check the change event was emitted
        expect(EntryStore.emitChange.calledOnce).to.be.true;
    });
});
