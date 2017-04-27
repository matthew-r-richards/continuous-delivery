import dispatcher from 'dispatcher/EntryDispatcher';
import { ActionTypes } from 'constants/ApiConstants';

export default {
    receiveEntries: data => {
        dispatcher.dispatch({
            type: ActionTypes.RECEIVE_ENTRIES,
            data: data
        });
    },

    receiveAddedEntry: data => {
        dispatcher.dispatch({
            type: ActionTypes.RECEIVE_ADD_ENTRY,
            data: data
        });
    },

    entryDeleted: data => {
        dispatcher.dispatch({
            type: ActionTypes.ENTRY_DELETED,
            data: data
        });
    },

    entryStopped: data => {
        dispatcher.dispatch({
            type: ActionTypes.ENTRY_STOPPED,
            data: data
        })
    }
}