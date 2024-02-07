import { EventEmitter, Injectable, Output } from '@angular/core';
import * as _ from 'lodash';
import { OrganizationAPI } from './organizationApi.service';

@Injectable()
export class OrganizationService {

    allOrganization: EventEmitter<any> = new EventEmitter();
    addOrganization: EventEmitter<any> = new EventEmitter();
    updateOrganizationEmit: EventEmitter<any> = new EventEmitter();
    deleteOrganizationEmit: EventEmitter<any> = new EventEmitter();
    activeOrganizationView: boolean = false;
    organizationDetails: any = {};
    allorg: any;

    constructor(
        private organizationAPI: OrganizationAPI
    ) { }

    //To get Service Drilldown Details
    getAllOrganization() {
        if (this.allorg) { this.allOrganization.emit(this.allorg); }
        else {
            this.organizationAPI.getOrganization().subscribe(
                (res: any) => {
                    this.allorg = _.cloneDeep(res);
                    this.allOrganization.emit(res);
                },
                (err: any) => {
                    this.allOrganization.emit(err);
                }
            );
        }
    }

    postOrganization(value: any) {
        this.organizationAPI.postOrganization(value).subscribe(
            (res: any) => {
                this.allorg = null;
                this.addOrganization.emit(res);
            },
            (err: any) => {
                this.addOrganization.emit(err);
            }
        );
    }

    updateOrganization(postData: any, id: any) {
        this.organizationAPI.updateOrganization(postData, id).subscribe(
            (res: any) => {
                this.updateOrganizationEmit.emit(res);
            },
            (err: any) => {
                this.updateOrganizationEmit.emit(err);
            }
        );
    }

    deleteOrganization(id: any) {
        this.organizationAPI.deleteOrganization(id).subscribe(
            (res: any) => {
                this.deleteOrganizationEmit.emit(res);
            },
            (err: any) => {

            }
        );
    }
}