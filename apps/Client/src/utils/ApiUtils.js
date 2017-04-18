import serverActionCreators from 'actions/ServerActionCreators';
import { APIEndpoints } from 'constants/ApiConstants';
import TimesheetEntry from 'models/TimesheetEntry';

export default {
    addEntry: (name, description) => {
        const endpoint = APIEndpoints.ENTRIES;
        console.log(`API Endpoint: ${endpoint}, Name: ${name}, Description: ${description}`);
        serverActionCreators.receiveAddedEntry(new TimesheetEntry(name, description, new Date(), null));
    }
}