import { EventEmitter, Injectable, Output } from '@angular/core';
import * as _ from 'lodash';
import { XAPI } from './xApi.service';

@Injectable()
export class XService {

    allx: EventEmitter<any> = new EventEmitter();
    addx: EventEmitter<any> = new EventEmitter();
    updatexEmit: EventEmitter<any> = new EventEmitter();
    deletexEmit: EventEmitter<any> = new EventEmitter();

    constructor(
        private xAPI: XAPI,
    ) { }

    //To get Service Drilldown Details
    getAllX(type: any) {
        return this.xAPI.getX(type)
    }

    postX(type: any, value: any) {
        this.xAPI.postX(type, value).subscribe(
            (res: any) => {
                this.addx.emit(res);
            },
            (err: any) => {
                this.addx.emit(err);
            }
        );
    }

    updateX(type: any, postData: any, id: any) {
        this.xAPI.updateX(type, postData, id).subscribe(
            (res: any) => {
                this.addx.emit(res);
            },
            (err: any) => {
                this.addx.emit(err);
            }
        );
    }

    deleteX(type: any, id: any) {
        this.xAPI.deleteX(type, id).subscribe(
            (res: any) => {
                this.deletexEmit.emit(res);
            },
            (err: any) => {

            }
        );
    }
}