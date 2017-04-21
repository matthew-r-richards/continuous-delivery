import EntryDispatcher from 'dispatcher/EntryDispatcher';
import { ActionTypes } from 'constants/ApiConstants.js';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

class EntryStore extends EventEmitter {
    constructor() {
        super();
        this.entries = [];
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    getAllEntries() {
        return this.entries;
    }

    addEntry(data) {
        this.entries.push(data);
        this.emitChange();
    }
}

// initialize the store as a singleton
const entryStore = new EntryStore();

// register the callback with the dispatcher for the RECEIVE_ADD_ENTRY action
entryStore.dispatchToken = EntryDispatcher.register(action => {
    switch (action.type) {
        case ActionTypes.RECEIVE_ADD_ENTRY:
            entryStore.addEntry(action.data);
            break;

        return true;
    }
});

export default entryStore;