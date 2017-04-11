import dispatcher from '../dispatcher/EntryDispatcher';
import { ActionTypes } from '../constants/ApiConstants';

export default {
    receiveAddedEntry: json => {
        dispatcher.handleServerAction({
            type: ActionTypes.RECEIVE_ADD_ENTRY,
            json: json
        });
    }
}