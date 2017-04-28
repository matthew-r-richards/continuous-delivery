import { expect } from 'chai';
import { stub, spy } from 'sinon';

import reload from 'helpers/reload';

import { ActionTypes } from 'constants/ApiConstants';

describe('EntryActionCreators', () => {
    let EntryStore;
    let EntryDispatcher;
    let EntryActionCreators;
    let ApiUtils;

    beforeEach(() => {
        EntryStore = reload('../../src/stores/EntryStore');
        stub(EntryStore, 'getAllEntries');
        EntryDispatcher = reload('../../src/dispatcher/EntryDispatcher');
        stub(EntryDispatcher, 'dispatch');
        ApiUtils = reload('../../src/utils/ApiUtils');
        stub(ApiUtils, 'addEntry');
        stub(ApiUtils, 'deleteEntry');
        stub(ApiUtils, 'stopEntry');
        stub(ApiUtils, 'getAllEntries');
        EntryActionCreators = reload('../../src/actions/EntryActionCreators');
        spy(EntryActionCreators, 'stopEntry');
    })

    describe('addEntry', () => {
        it('dispatches an event and initiates an API call', () => {
            EntryStore.getAllEntries.returns([]);

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

        it('calls an action to stop any incomplete events', () => {
            const entries = [
                { id: 1, name: "task 1", description: "task 1 description", taskStart: new Date(), taskEnd: null },
                { id: 2, name: "task 2", description: "task 2 description", taskStart: new Date(), taskEnd: new Date() },
                { id: 3, name: "task 3", description: "task 3 description", taskStart: new Date(), taskEnd: null }
            ];
            EntryStore.getAllEntries.returns(entries);

            EntryActionCreators.addEntry('new name', 'new description');
                const expectedAction = {
                    type: ActionTypes.ADD_ENTRY,
                    data: {
                        name: 'new name',
                        description: 'new description'
                    }
                };

            expect(EntryActionCreators.stopEntry.calledWith(1)).to.be.true;
            expect(EntryActionCreators.stopEntry.calledWith(2)).to.be.false;
            expect(EntryActionCreators.stopEntry.calledWith(3)).to.be.true;

            expect(EntryDispatcher.dispatch.calledWith(expectedAction)).to.be.true;
            expect(ApiUtils.addEntry.calledWith('new name', 'new description')).to.be.true;
        });
    })

    it('dispatches an event and initiates an API call to delete an Entry', () => {
        EntryActionCreators.deleteEntry(1);
        const expectedAction = {
            type: ActionTypes.DELETE_ENTRY,
            data: 1
        };
        
        expect(EntryDispatcher.dispatch.calledWith(expectedAction)).to.be.true;
        expect(ApiUtils.deleteEntry.calledWith(1)).to.be.true;
    });

    it('dispatches an event and initiates an API call to stop an Entry', () => {
        EntryActionCreators.stopEntry(1);
        const expectedAction = {
            type: ActionTypes.STOP_ENTRY,
            data: 1
        };
        
        expect(EntryDispatcher.dispatch.calledWith(expectedAction)).to.be.true;
        expect(ApiUtils.stopEntry.calledWith(1)).to.be.true;
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