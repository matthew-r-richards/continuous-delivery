import EntryDispatcher from 'dispatcher/EntryDispatcher';
import { ActionTypes, StoreEvents } from 'constants/ApiConstants.js';
import { EventEmitter } from 'events';
import moment from 'moment';

class EntryStore extends EventEmitter {
    constructor() {
        super();
        this.entries = [];
        this.totalDuration = 0;
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

    getTotalDuration() {
        return this.totalDuration;
    }

    refreshEntries(data) {
        // calculate the durations
        this.totalDuration = 0;
        let duration;
        data.forEach(entry => {
            if (entry.taskEnd) {
                duration = moment(entry.taskEnd).diff(moment(entry.taskStart), 'minutes');
            } else {
                duration = 0;
            }

            entry.duration = duration;
            this.totalDuration +=  duration;
        });

        this.entries = data;
        this.emitChange(StoreEvents.ENTRIES_CHANGED);
    }

    addEntry(data) {
        // set the initial duration
        data.duration = 0;

        this.entries.push(data);
        this.emitChange(StoreEvents.ENTRIES_CHANGED);
        this.emitChange(StoreEvents.ENTRY_ADDED);
    }

    removeEntry(data) {
        const id = data;
        const indexToRemove = this.entries.findIndex(entry => entry.id === id);

        if (indexToRemove !== -1) {
            // update the total duration
            const itemDuration = this.entries[indexToRemove].duration;
            this.totalDuration -= itemDuration;

            this.entries.splice(indexToRemove, 1);
            this.emitChange(StoreEvents.ENTRIES_CHANGED);
        }
    }

    updateEntry(data) {
        let newDuration;
        if (data.taskEnd) {
            newDuration = moment(data.taskEnd).diff(moment(data.taskStart), 'minutes');
        } else {
            newDuration = 0;
        }

        data.duration = newDuration;

        const id = data.id;
        const indexToUpdate = this.entries.findIndex(entry => entry.id === id);

        if (indexToUpdate !== -1) {
            // update the total duration
            const oldDuration = this.entries[indexToUpdate].duration;
            this.totalDuration -= oldDuration;
            this.totalDuration += newDuration;

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