import { environment } from 'src/app/environments/environment';

export const API_URL = {
    individuals: environment.api_url + '/contacts/individual/',
    organization: environment.api_url + '/contacts/organization/',
};
