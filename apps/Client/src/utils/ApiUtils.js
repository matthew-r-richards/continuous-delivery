import serverActionCreators from 'actions/ServerActionCreators';
import { APIEndpoints } from 'constants/ApiConstants';
import TimesheetEntry from 'models/TimesheetEntry';

import Request from 'superagent';

export default {
    getAllEntries: () => {
        const endpoint = APIEndpoints.ENTRIES;
        console.log(`API Endpoint: GET ${endpoint}`);

        Request
            .get(endpoint)
            .set('Accept', 'application/json')
            .end(function(err, response) {
                if (err) return console.error(err);
                serverActionCreators.receiveEntries(response.body);
            });
    },

    addEntry: (name, description) => {
        const endpoint = APIEndpoints.ENTRIES;
        console.log(`API Endpoint: POST ${endpoint}, Name: ${name}, Description: ${description}`);
        serverActionCreators.receiveAddedEntry(new TimesheetEntry(name, description, new Date(), null));
    }
}