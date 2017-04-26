import serverActionCreators from 'actions/ServerActionCreators';
import { APIEndpoints } from 'constants/ApiConstants';

import Request from 'superagent';

export default {
    getAllEntries: () => {
        const endpoint = APIEndpoints.ENTRIES;

        Request
            .get(endpoint)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return console.error(err);
                serverActionCreators.receiveEntries(response.body);
            });
    },

    addEntry: (name, description) => {
        const endpoint = APIEndpoints.ENTRIES;

        Request
            .post(endpoint)
            .set('Accept', 'application/json')
            .send({ taskName: name, taskDescription: description })
            .end((err, response) => {
                if (err) return console.error(err);
                serverActionCreators.receiveAddedEntry(response.body);
            });
    }
}