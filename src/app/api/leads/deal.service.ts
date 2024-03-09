import { EventEmitter, Injectable, Output } from '@angular/core';
import * as _ from 'lodash';
import { DealAPI } from './dealApi.service';

@Injectable()
export class DealService {

    allDeal: EventEmitter<any> = new EventEmitter();
    addDeal: EventEmitter<any> = new EventEmitter();
    updateDealEmit: EventEmitter<any> = new EventEmitter();
    deleteDealEmit: EventEmitter<any> = new EventEmitter();
    dealAsPdf: EventEmitter<any> = new EventEmitter();

    constructor(
        private dealAPI: DealAPI
    ) { }

    //To get Service Drilldown Details
    getAllDeal() {
        return this.dealAPI.getDeal()
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

    // Deal As Pdf
    saveDealAsPdf(data: any) {
        this.dealAPI.saveAsPdf(data).subscribe(
            (res: any) => {
                this.dealAsPdf.emit(res);
            },
            (err: any) => {

            }
        );
    }
    sentEmail(content: any) {
        this.dealAPI.sentEmail(content).subscribe(
            (res: any) => {
                this.dealAsPdf.emit(res);
            },
            (err: any) => {

            }
        );
    }
}