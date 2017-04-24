import dispatcher from 'dispatcher/EntryDispatcher';
import { ActionTypes } from 'constants/ApiConstants';
import apiUtils from 'utils/ApiUtils';

export default {
    getAllEntries: () => {
        dispatcher.dispatch({
            type: ActionTypes.GET_ALL_ENTRIES
        });
        apiUtils.getAllEntries();
    },

    addEntry: (name, description) => {
        dispatcher.dispatch({
            type: ActionTypes.ADD_ENTRY,
            data: {
                name: name,
                description: description
            }
        });
        apiUtils.addEntry(name, description);
    }
}