import dispatcher from 'dispatcher/EntryDispatcher';
import { ActionTypes } from 'constants/ApiConstants';

export default {
    // create the RECEIVE_ADD_ENTRY action
    receiveAddedEntry: data => {
        dispatcher.dispatch({
            type: ActionTypes.RECEIVE_ADD_ENTRY,
            data: data
        });
    }
}