const keyMirror = require('keymirror');

const APIRoot = "http://localhost:3000";

export const APIEndpoints = {
    ENTRIES: APIRoot + "/api/entries"
};

export const ActionTypes = keyMirror({
    ADD_ENTRY: null,
    RECEIVE_ADD_ENTRY: null,
    LOAD_ENTRIES: null,
    RECEIVE_ENTRIES: null
});