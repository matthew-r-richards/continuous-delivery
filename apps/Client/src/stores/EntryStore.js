import EntryDispatcher from 'dispatcher/EntryDispatcher';
import { ActionTypes, StoreEvents } from 'constants/ApiConstants.js';
import { EventEmitter } from 'events';

class EntryStore extends EventEmitter {
    constructor() {
        super();
        this.entries = [];
        this.apiError = false;
    }

    emitChange(changeEvent) {
        this.emit(changeEvent);
    }

    addChangeListener(changeEvent, callback) {
        this.on(changeEvent, callback);
    }

    removeChangeListener(changeEvent, callback) {
        this.removeListener(changeEvent, callback);
    }

    getHasApiError() {
        return this.apiError;
    }

    getAllEntries() {
        return this.entries;
    }

    refreshEntries(data) {
        this.entries = data;
        this.emitChange(StoreEvents.ENTRIES_CHANGED);
    }

    addEntry(data) {
        this.entries.push(data);
        this.emitChange(StoreEvents.ENTRIES_CHANGED);
        this.emitChange(StoreEvents.ENTRY_ADDED);
    }

    removeEntry(data) {
        const id = data;
        const indexToRemove = this.entries.findIndex(entry => entry.id === id);

        if (indexToRemove !== -1) {
            this.entries.splice(indexToRemove, 1);
            this.emitChange(StoreEvents.ENTRIES_CHANGED);
        }
    }

    updateEntry(data) {
        const id = data.id;
        const indexToUpdate = this.entries.findIndex(entry => entry.id === id);

        if (indexToUpdate !== -1) {
            // insert the new element in place of the old one
            this.entries.splice(indexToUpdate, 1, data);
            this.emitChange(StoreEvents.ENTRIES_CHANGED);
        }
    }

    setErrorStatus(hasError) {
        this.apiError = hasError;
        this.emitChange(StoreEvents.ENTRIES_CHANGED);
    }
}

// initialize the store as a singleton
const entryStore = new EntryStore();

// register the callback with the dispatcher for the RECEIVE_ADD_ENTRY action
entryStore.dispatchToken = EntryDispatcher.register(action => {
    switch (action.type) {
        case ActionTypes.RECEIVE_ADD_ENTRY:
            entryStore.setErrorStatus(false);
            entryStore.addEntry(action.data);
            break;
        
        case ActionTypes.RECEIVE_ENTRIES:
            entryStore.setErrorStatus(false);
            entryStore.refreshEntries(action.data);
            break;

        case ActionTypes.ENTRY_DELETED:
            entryStore.setErrorStatus(false);
            entryStore.removeEntry(action.data);
            break;
        
        case ActionTypes.ENTRY_UPDATED:
            entryStore.setErrorStatus(false);
            entryStore.updateEntry(action.data);
            break;

        case ActionTypes.CALL_ERROR:
            entryStore.setErrorStatus(true);
            break;

        return true;
    }
});

export default entryStore;