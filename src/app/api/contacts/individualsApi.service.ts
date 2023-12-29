import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_URL } from 'src/app/constants/app.url.constants';

@Injectable()
export class IndividualsAPI {

    private url = APP_URL;

    constructor(private httpClient: HttpClient) { }

    // Individuals API

    getIndividuals() {
        return this.httpClient.get(this.url.getIndividuals);
    }

    postIndividual(value: any) {
        return this.httpClient.post(this.url.getIndividuals, value);
    }

    updateIndividuals(postData: any, id: any) {
        return this.httpClient.patch(this.url.updateIndividual.interpolateString({ queryParam: id }), postData);
    }

    deleteIndividuals(value: any) {
        return this.httpClient.delete(this.url.deleteIndividual.interpolateString({ queryParam: value }));
    }
}
