const keyMirror = require('keymirror');

const APIRoot = "";

export const APIEndpoints = {
    ENTRIES: APIRoot + "/api/entries"
};

export const ActionTypes = keyMirror({
    ADD_ENTRY: null,
    RECEIVE_ADD_ENTRY: null,
    DELETE_ENTRY: null,
    ENTRY_DELETED: null,
    STOP_ENTRY: null,
    ENTRY_STOPPED: null,
    LOAD_ENTRIES: null,
    RECEIVE_ENTRIES: null
});