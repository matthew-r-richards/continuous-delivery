// Help from https://github.com/subyraman/react-flux-facebook-api-example/blob/master/tests/js/stores/FacebookStoreTest.js

import { expect } from 'chai';
import { stub, spy } from 'sinon';

import reload from 'helpers/reload';

import { ActionTypes, StoreEvents } from 'constants/ApiConstants';

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
        const startTime = new Date();
        const action = {
            type: ActionTypes.RECEIVE_ADD_ENTRY,
            data: {
                id: 1,
                name: 'new name',
                description: 'new description',
                taskStart: startTime,
                taskEnd: 0
            }
        };

        dispatcherCallback(action);

        // check the Store contents
        const entries = EntryStore.getAllEntries();
        expect(entries.length).to.equal(1);
        expect(entries[0].id).to.equal(1);
        expect(entries[0].name).to.equal('new name');
        expect(entries[0].description).to.equal('new description');
        expect(entries[0].duration).to.equal(0);
        expect(EntryStore.getHasApiError()).to.be.false;

        // check the change events were emitted
       expect(EntryStore.emitChange.calledWith(StoreEvents.ENTRIES_CHANGED)).to.be.true;
       expect(EntryStore.emitChange.calledWith(StoreEvents.ENTRY_ADDED)).to.be.true;
    });

    it('should delete an entry from the store', () => {
        // NOTE: This test has a dependency on the store being able to retrieve
        // entries correctly, i.e. correctly process the RECEIVE_ENTRIES action
        // define two initial test entries
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() -30);
        const endTime = new Date();
        const testEntries = [
            { id: 1, name: 'name 1', description: 'description 1', taskStart: startTime, taskEnd: endTime },
            { id: 2, name: 'name 2', description: 'description 2', taskStart: startTime, taskEnd: endTime }
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
        expect(EntryStore.getTotalDuration()).to.equal(60);

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
        expect(EntryStore.getTotalDuration()).to.equal(30);
        expect(EntryStore.getHasApiError()).to.be.false;

        // check the change event was emitted
       expect(EntryStore.emitChange.calledWith(StoreEvents.ENTRIES_CHANGED)).to.be.true;
    })

    it('should update an entry in the store', () => {
        // NOTE: This test has a dependency on the store being able to retrieve
        // entries correctly, i.e. correctly process the RECEIVE_ENTRIES action
        // define an initial test entry
        const startTime = new Date();
        startTime.setHours(startTime.getHours() - 2);
        const endTime = new Date(); // Duration = end - start = 2 hrs
        const initialEntries = [
            { id: 1, name: 'name 1', description: 'description 1', taskStart: startTime, taskEnd: endTime },
            { id: 2, name: 'name 2', description: 'description 2', taskStart: startTime, taskEnd: null },
            { id: 3, name: 'name 3', description: 'description 3', taskStart: startTime, taskEnd: endTime }
        ]
        let action = {
            type: ActionTypes.RECEIVE_ENTRIES,
            data: initialEntries
        }

        dispatcherCallback(action);

        // check the initial total duration
        expect(EntryStore.getTotalDuration()).to.equal(240);

        // reset the call counter on the emitChange spy so that we can check
        // if it is called as part of the update process
        EntryStore.emitChange.reset();

        let newStartTime = startTime;
        newStartTime.setMinutes(newStartTime.getMinutes() - 1);
        let newEndTime = endTime; // Duration = end - start = 2hrs 1 min

        const updatedEntry = {
            id: 2,
            name: 'new name',
            description: 'new description',
            taskStart: newStartTime,
            taskEnd: newEndTime
        }

        // trigger the dispatcher callback
        action = {
            type: ActionTypes.ENTRY_UPDATED,
            data: updatedEntry
        }

        dispatcherCallback(action);

        // check that the item has been updated
        const entries = EntryStore.getAllEntries();
        expect(entries[1].id).to.equal(2);
        expect(entries[1].name).to.equal('new name');
        expect(entries[1].description).to.equal('new description');
        expect(entries[1].taskStart).to.equal(newStartTime);
        expect(entries[1].taskEnd).to.equal(newEndTime);
        expect(EntryStore.getTotalDuration()).to.equal(361);        
        expect(EntryStore.getHasApiError()).to.be.false;

        // check the change event was emitted
        expect(EntryStore.emitChange.calledWith(StoreEvents.ENTRIES_CHANGED)).to.be.true;
    })

    it('should load entries into the store', () => {
        // trigger the dispatcher callback
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 5);
        const endTime = new Date(); // Duration = end - start = 5 mins
        const expectedEntries = [
            { id: 1, name: 'name 1', description: 'description 1', taskStart: startTime, taskEnd: endTime },
            { id: 2, name: 'name 2', description: 'description 2', taskStart: endTime, taskEnd: null }
        ]
        const action = {
            type: ActionTypes.RECEIVE_ENTRIES,
            data: expectedEntries
        }

        dispatcherCallback(action);

        // check the Store contents
        const actualEntries = EntryStore.getAllEntries();
        expect(actualEntries).to.eql(expectedEntries);
        expect(EntryStore.getTotalDuration()).to.equal(5);
        expect(EntryStore.getHasApiError()).to.be.false;

        // check the change event was emitted
       expect(EntryStore.emitChange.calledWith(StoreEvents.ENTRIES_CHANGED)).to.be.true;
    });

    it('should set the API call error status', () => {
        // check the initial state
        expect(EntryStore.getHasApiError()).to.be.false;
        
        // trigger the dispatcher callback
        const action = { 
            type: ActionTypes.CALL_ERROR,
            data: 'error'
        }

        dispatcherCallback(action);

        // Check the store contents
        expect(EntryStore.getHasApiError()).to.be.true;

        // check the change event was emitted
        expect(EntryStore.emitChange.calledWith(StoreEvents.ENTRIES_CHANGED)).to.be.true;
    })
});
