import dispatcher from 'dispatcher/EntryDispatcher';
import { ActionTypes } from 'constants/ApiConstants';
import apiUtils from 'utils/ApiUtils';
import EntryStore from 'stores/EntryStore';

const entryActionCreators = {
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

        // firstly we want to stop any existing entries (i.e. those that don't have an end time)
        // - there should only ever be one but we will account for there being multiple just in case
        const entries = EntryStore.getAllEntries();
        const activeEntries = entries.filter(entry => {
            return entry.taskEnd === null
        });

        activeEntries.forEach(entry => {
            entryActionCreators.stopEntry(entry.id)
        });

        apiUtils.addEntry(name, description);
    },

    deleteEntry: id => {
        dispatcher.dispatch({
            type: ActionTypes.DELETE_ENTRY,
            data: id
        });
        apiUtils.deleteEntry(id);
    },

    stopEntry: id => {
        dispatcher.dispatch({
            type: ActionTypes.STOP_ENTRY,
            data: id
        });
        apiUtils.stopEntry(id);
    }
}

export default entryActionCreators;