import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/constants/app.url.constants';

@Injectable()
export class DealAPI {

    private url = API_URL;

    constructor(private httpClient: HttpClient) { }

    // Deal API

    getDeal() {
        return this.httpClient.get(this.url.deal);
    }

    postDeal(value: any) {
        return this.httpClient.post(this.url.deal, value);
    }

    updateDeal(postData: any, id: any) {
        return this.httpClient.patch(this.url.deal + id, postData);
    }

    deleteDeal(value: any) {
        return this.httpClient.delete(this.url.deal + value);
    }
}
