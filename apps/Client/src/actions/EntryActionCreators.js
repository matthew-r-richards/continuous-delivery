import dispatcher from '../dispatcher/EntryDispatcher';
import { ActionTypes } from '../constants/ApiConstants';
import apiUtils from '../utils/ApiUtils';

export default {
    // create the ADD_ENTRY action and initiate the corresponding API call
    addEntry: (name, description) => {
        dispatcher.handleViewAction({
            type: ActionTypes.ADD_ENTRY,
            name: name,
            description: description
        });
        apiUtils.addEntry(name, description);
    }
}