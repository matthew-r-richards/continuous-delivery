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
        const action = {
            type: ActionTypes.RECEIVE_ADD_ENTRY,
            data: {
                id: 1,
                name: 'new name',
                description: 'new description'
            }
        };

        dispatcherCallback(action);

        // check the Store contents
        const entries = EntryStore.getAllEntries();
        expect(entries.length).to.equal(1);
        expect(entries[0].id).to.equal(1);
        expect(entries[0].name).to.equal('new name');
        expect(entries[0].description).to.equal('new description');

        // check the change event was emitted
        expect(EntryStore.emitChange.calledOnce).to.be.true;
    });

    it('should delete an entry from the store', () => {
        // NOTE: This test has a dependency on the store being able to retrieve
        // entries correctly, i.e. correctly process the RECEIVE_ENTRIES action
        // define two initial test entries
        const testEntries = [
            { id: 1, name: 'name 1', description: 'description 1' },
            { id: 2, name: 'name 2', description: 'description 2' }
        ]
        let action = {
            type: ActionTypes.RECEIVE_ENTRIES,
            data: testEntries
        }

        dispatcherCallback(action);

        // reset the call counter on the emitChange spy so that we can check
        // if it is called as part of the delete
        EntryStore.emitChange.reset();

        // check that the second item does actually exist
        const entriesBefore = EntryStore.getAllEntries();
        expect(entriesBefore).to.have.length(2);
        expect(entriesBefore[1].id).to.equal(2);

        // trigger the dispatcher callback
        action = {
            type: ActionTypes.ENTRY_DELETED,
            data: 2
        }

        dispatcherCallback(action);

        // check that the second item has been deleted
        const entriesAfter = EntryStore.getAllEntries();
        expect(entriesAfter).to.have.length(1);
        expect(entriesAfter[0].id).to.not.equal(2);

        // check the change event was emitted
        expect(EntryStore.emitChange.calledOnce).to.be.true;
    })

    it('should load entries into the store', () => {
        // trigger the dispatcher callback
        const expectedEntries = [
            { id: 1, name: 'name 1', description: 'description 1' },
            { id: 2, name: 'name 2', description: 'description 2' }
        ]
        const action = {
            type: ActionTypes.RECEIVE_ENTRIES,
            data: expectedEntries
        }

        dispatcherCallback(action);

        // check the Store contents
        const actualEntries = EntryStore.getAllEntries();
        expect(actualEntries).to.eql(expectedEntries);

        // check the change event was emitted
        expect(EntryStore.emitChange.calledOnce).to.be.true;
    });
});
