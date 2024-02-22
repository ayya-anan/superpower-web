import { EventEmitter, Injectable, Output } from '@angular/core';
import * as _ from 'lodash';
import { IndividualsAPI } from './individualsApi.service';

@Injectable()
export class IndividualService {

    allIndividuals: EventEmitter<any> = new EventEmitter();
    addIndividuals: EventEmitter<any> = new EventEmitter();
    updateIndividual: EventEmitter<any> = new EventEmitter();
    deleteIndividual: EventEmitter<any> = new EventEmitter();

    saveAllocationData: any = [];
    allocatedHours: any = {};

    constructor(
        private individualsAPI: IndividualsAPI
    ) { }

    //To get Service Drilldown Details
    getAllIndividuals() {
        this.individualsAPI.getIndividuals().subscribe(
            (res: any) => {
                this.allIndividuals.emit(res);
            },
            (err: any) => {
                this.allIndividuals.emit(err);
            }
        );
    }

    postIndividuals(value: any) {
        this.individualsAPI.postIndividual(value).subscribe(
            (res: any) => {
                this.addIndividuals.emit(res);
            },
            (err: any) => {
                this.addIndividuals.emit(err);
            }
        );
    }

    updateIndividuals(postData: any, id: any) {
        this.individualsAPI.updateIndividuals(postData, id).subscribe(
            (res: any) => {
                this.updateIndividual.emit(res);
            },
            (err: any) => {
                this.updateIndividual.emit(err);
            }
        );
    }
    
    deleteIndividuals(id: any) {
        this.individualsAPI.deleteIndividuals(id).subscribe(
            (res: any) => {
                this.deleteIndividual.emit(res);
            },
            (err: any) => {
              
            }
        );
    }
 
}