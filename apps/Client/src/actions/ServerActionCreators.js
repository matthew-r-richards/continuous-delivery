import dispatcher from 'dispatcher/EntryDispatcher';
import { ActionTypes } from 'constants/ApiConstants';

export default {
    // create the RECEIVE_ADD_ENTRY action
    receiveAddedEntry: data => {
        dispatcher.handleServerAction({
            type: ActionTypes.RECEIVE_ADD_ENTRY,
            data: data
        });
    }
}