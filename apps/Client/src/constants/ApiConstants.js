const keyMirror = require('keymirror');

const APIRoot = "http://localhost:3000";

module.exports = {
    APIEndpoints: {
        ENTRIES: APIRoot + "/api/entries"
    },

    PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    }),

    ActionTypes: keyMirror({
        LOAD_ENTRIES: null,                                                                              
        LOAD_ENTRY: null,
        ADD_ENTRY: null,
        DELETE_ENTRY: null,
        UPDATE_ENTRY: null
    })
};