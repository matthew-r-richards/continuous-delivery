const payloadSources = require('../constants/ApiConstants.js').PayloadSources;
const dispatcher = require('flux').Dispatcher;

export const EntriesDispatcher = Object.assign(new dispatcher(), {
    handleServerAction: action => {
        const payload = {
            source: payloadSources.SERVER_ACTION,
            action: action
        };
        this.dispatch(payload);
    },

    handleViewAction: action => {
        const payload = {
            source: payloadSources.VIEW_ACTION,
            action: action
        };
        this.dispatch(payload);
    }
});