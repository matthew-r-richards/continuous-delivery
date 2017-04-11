import { PayloadSources } from '../constants/ApiConstants';
import { Dispatcher } from 'flux';

export default Object.assign(new Dispatcher(), {
    handleServerAction: function(action) {
        const payload = {
            source: PayloadSources.SERVER_ACTION,
            action: action
        };
        this.dispatch(payload);
    },

    handleViewAction: function(action) {
        const payload = {
            source: PayloadSources.VIEW_ACTION,
            action: action
        };
        this.dispatch(payload);
    }
});