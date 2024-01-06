import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/constants/app.url.constants';

@Injectable()
export class OrganizationAPI {

    private url = API_URL;

    constructor(private httpClient: HttpClient) { }

    // Organization API

    getOrganization() {
        return this.httpClient.get(this.url.organization);
    }

    postOrganization(value: any) {
        return this.httpClient.post(this.url.organization, value);
    }

    updateOrganization(postData: any, id: any) {
        return this.httpClient.patch(this.url.organization + id, postData);
    }

    deleteOrganization(value: any) {
        return this.httpClient.delete(this.url.organization + value);
    }
}
