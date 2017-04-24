import serverActionCreators from 'actions/ServerActionCreators';
import { APIEndpoints } from 'constants/ApiConstants';
import TimesheetEntry from 'models/TimesheetEntry';

import 

export default {
    getAllEntries: () => {
        const endpoint = APIEndpoints.ENTRIES;
        console.log(`API Endpoint: ${endpoint}`);

        // just return some fake data for now
        const startTime1 = new Date();
        startTime1.setHours(9);
        startTime1.setMinutes(0);
        const endTime1 = new Date();
        endTime1.setHours(11);
        endTime1.setMinutes(30);
        const startTime2 = endTime1;
        const endTime2 = new Date();
        endTime2.setHours(13);
        endTime2.setMinutes(10);
        const startTime3 = endTime2;

        const fakeEntries = [
            new TimesheetEntry('Entry 1', 'Description 1', startTime1, endTime1),
            new TimesheetEntry('Entry 2', 'Description 2', startTime2, endTime2),
            new TimesheetEntry('Entry 3', 'Description 3', startTime3, null)
        ]
        serverActionCreators.receiveEntries(fakeEntries);
    },

    addEntry: (name, description) => {
        const endpoint = APIEndpoints.ENTRIES;
        console.log(`API Endpoint: ${endpoint}, Name: ${name}, Description: ${description}`);
        serverActionCreators.receiveAddedEntry(new TimesheetEntry(name, description, new Date(), null));
    }
}