import serverActionCreators from 'actions/ServerActionCreators';
import { APIEndpoints } from 'constants/ApiConstants';
import logger from 'utils/ClientLogger';

import Request from 'superagent';

export default {
    getAllEntries: () => {
        const endpoint = APIEndpoints.ENTRIES;

        Request
            .get(endpoint)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) {
                    logger.error(err);
                    return;
                }

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
                if (err) {
                    if (response && response.status === 400) {
                        logger.error(response.body);
                        return;
                    } else {
                        logger.error(err);
                        return;
                    }
                }
                
                serverActionCreators.receiveAddedEntry(response.body);
            });
    },

    deleteEntry: id => {
        const endpoint = APIEndpoints.ENTRIES + `/${id}`;

        Request
            .delete(endpoint)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) {
                    if (response && response.status === 404) {
                        logger.error(response.body);
                        return;
                    } else {
                        logger.error(err);
                        return;
                    }
                }

                serverActionCreators.entryDeleted(id);
            })
    },

    stopEntry: id => {
        const endpoint = APIEndpoints.ENTRIES + `/${id}/stop`;

        Request
            .post(endpoint)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) {
                    if (response && response.status === 404) {
                        logger.error(response.body);
                        return;
                    } else {
                        logger.error(err);
                        return;
                    }
                }

                serverActionCreators.entryStopped(response.body);
            })
    }
}