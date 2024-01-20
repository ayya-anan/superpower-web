import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/constants/app.url.constants';

@Injectable()
export class XAPI {

    private url = API_URL;

    constructor(private httpClient: HttpClient) { }

    // X API

    getX(type: any) {
        return this.httpClient.get(this.url.x + type);
    }

    postX(type: any, value: any) {
        return this.httpClient.post(this.url.x + type, value);
    }

    updateX(type: any, postData: any, id: any) {
        return this.httpClient.patch(this.url.x + type + '/' + id, postData);
    }

    deleteX(type: any, value: any) {
        return this.httpClient.delete(this.url.x + type + '/' + value);
    }

}
