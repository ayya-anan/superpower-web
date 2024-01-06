import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/constants/app.url.constants';

@Injectable()
export class IndividualsAPI {

    private url = API_URL;

    constructor(private httpClient: HttpClient) { }

    // Individuals API

    getIndividuals() {
        return this.httpClient.get(this.url.individuals);
    }

    postIndividual(value: any) {
        return this.httpClient.post(this.url.individuals, value);
    }

    updateIndividuals(postData: any, id: any) {
        return this.httpClient.patch(this.url.individuals + id, postData);
    }

    deleteIndividuals(value: any) {
        return this.httpClient.delete(this.url.individuals + value);
    }
}
