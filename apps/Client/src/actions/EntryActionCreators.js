import dispatcher from 'dispatcher/EntryDispatcher';
import { ActionTypes } from 'constants/ApiConstants';
import apiUtils from 'utils/ApiUtils';

export default {
    loadEntries: () => {
        dispatcher.dispatch({
            type: ActionTypes.LOAD_ENTRIES
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
    },

    deleteEntry: id => {
        dispatcher.dispatch({
            type: ActionTypes.DELETE_ENTRY,
            data: id
        });
        apiUtils.deleteEntry(id);
    }
}