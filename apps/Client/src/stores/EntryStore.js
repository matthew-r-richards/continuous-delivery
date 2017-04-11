import dispatcher from '../dispatcher/EntryDispatcher';
import { ActionTypes } from '../constants/ApiConstants.js';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

let entries = [];

const EntryStore = Object.assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getAllEntries: function() {
        return entries;
    }
});

EntryStore.dispatchToken = dispatcher.register(function(payload) {
    const action = payload.action;

    switch (action.type) {
        case ActionTypes.RECEIVE_ADD_ENTRY:
            entries.push(action.json);
            EntryStore.emitChange();
            break;

        return true;
    }
});

export default EntryStore;