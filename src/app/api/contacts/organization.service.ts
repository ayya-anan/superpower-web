import { EventEmitter, Injectable, Output } from '@angular/core';
import * as _ from 'lodash';
import { OrganizationAPI } from './organizationApi.service';

@Injectable()
export class OrganizationService {

    allOrganization: EventEmitter<any> = new EventEmitter();
    addOrganization: EventEmitter<any> = new EventEmitter();
    updateOrganizationEmit: EventEmitter<any> = new EventEmitter();
    deleteOrganizationEmit: EventEmitter<any> = new EventEmitter();

    constructor(
        private individualsAPI: OrganizationAPI
    ) { }

    //To get Service Drilldown Details
    getAllOrganization() {
        this.individualsAPI.getOrganization().subscribe(
            (res: any) => {
                this.allOrganization.emit(res);
            },
            (err: any) => {
                this.allOrganization.emit(err);
            }
        );
    }

    postOrganization(value: any) {
        this.individualsAPI.postOrganization(value).subscribe(
            (res: any) => {
                this.addOrganization.emit(res);
            },
            (err: any) => {
                this.addOrganization.emit(err);
            }
        );
    }

    updateOrganization(postData: any, id: any) {
        this.individualsAPI.updateOrganization(postData, id).subscribe(
            (res: any) => {
                this.updateOrganizationEmit.emit(res);
            },
            (err: any) => {
                this.updateOrganizationEmit.emit(err);
            }
        );
    }
    
    deleteOrganization(id: any) {
        this.individualsAPI.deleteOrganization(id).subscribe(
            (res: any) => {
                this.deleteOrganizationEmit.emit(res);
            },
            (err: any) => {
              
            }
        );
    }
}