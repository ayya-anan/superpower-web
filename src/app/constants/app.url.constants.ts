import { environment } from 'src/app/environments/environment';

export const API_URL = {
    individuals: environment.api_url + '/contacts/individual/',
    organization: environment.api_url + '/contacts/organization/',
    deal: environment.api_url + '/leads/deal/',
    x: environment.api_url + '/x/',
    template: environment.api_url + '/template'
};
