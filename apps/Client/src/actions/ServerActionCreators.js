import dispatcher from 'dispatcher/EntryDispatcher';
import { ActionTypes } from 'constants/ApiConstants';

export default {
    receiveAllEntries: data => {
        dispatcher.dispatch({
            type: ActionTypes.RECEIVE_ALL_ENTRIES,
            data: data
        });
    },

    receiveAddedEntry: data => {
        dispatcher.dispatch({
            type: ActionTypes.RECEIVE_ADD_ENTRY,
            data: data
        });
    }
}