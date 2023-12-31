import { EventEmitter, Injectable, Output } from '@angular/core';
import * as _ from 'lodash';
import { DealAPI } from './dealApi.service';

@Injectable()
export class DealService {

    allDeal: EventEmitter<any> = new EventEmitter();
    addDeal: EventEmitter<any> = new EventEmitter();
    updateDealEmit: EventEmitter<any> = new EventEmitter();
    deleteDealEmit: EventEmitter<any> = new EventEmitter();

    constructor(
        private dealAPI: DealAPI
    ) { }

    //To get Service Drilldown Details
    getAllDeal() {
        this.dealAPI.getDeal().subscribe(
            (res: any) => {
                this.allDeal.emit(res);
            },
            (err: any) => {
                this.allDeal.emit(err);
            }
        );
    }

    postDeal(value: any) {
        this.dealAPI.postDeal(value).subscribe(
            (res: any) => {
                this.addDeal.emit(res);
            },
            (err: any) => {
                this.addDeal.emit(err);
            }
        );
    }

    updateDeal(postData: any, id: any) {
        this.dealAPI.updateDeal(postData, id).subscribe(
            (res: any) => {
                this.updateDealEmit.emit(res);
            },
            (err: any) => {
                this.updateDealEmit.emit(err);
            }
        );
    }
    
    deleteDeal(id: any) {
        this.dealAPI.deleteDeal(id).subscribe(
            (res: any) => {
                this.deleteDealEmit.emit(res);
            },
            (err: any) => {
              
            }
        );
    }
}