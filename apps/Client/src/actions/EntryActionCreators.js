import dispatcher from '../dispatcher/EntryDispatcher';
import { ActionTypes } from '../constants/ApiConstants';
import apiUtils from '../utils/ApiUtils';

export default {
    addEntry: (name, description) => {
        dispatcher.handleViewAction({
            type: ActionTypes.ADD_ENTRY,
            name: name,
            description: description
        });
        apiUtils.addEntry(name, description);
    }
}