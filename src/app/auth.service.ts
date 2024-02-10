import { Injectable } from '@angular/core';
import { keycloakConfig } from './keycloak-config';
import Keycloak from 'keycloak-js';

@Injectable({
    providedIn: 'root'
})
export class KeycloakService {
    keycloak: any = new Keycloak;

    constructor() { }

    init(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.keycloak = new Keycloak(keycloakConfig);
            this.keycloak.init({ onLoad: 'login-required' })
                .then((token: any) => {
                    resolve(token);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    getToken(): string {
        return this.keycloak.token;
    }

    logout() {
        this.keycloak.logout();
    }
}
