import { environment } from 'src/app/environments/environment';

export const APP_URL = {
    getIndividuals: environment.api_url + '/contacts/individual',
    updateIndividual: environment.api_url + '/contacts/individual/${queryParam}',
    deleteIndividual: environment.api_url + '/contacts/individual/${queryParam}',
};
