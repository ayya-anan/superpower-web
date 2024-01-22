import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit {
    @Input() deal: any;
    @Input() organization: any;
    @Input() quote: any;

    ngOnInit() {
        
    }
    getName(value: string, type: string) {
        let name = '';
        switch (type) {
            case 'facility':
                name = _.find(this.organization.facilities,(facility) => facility._id === value)?.address;
                break;
            case 'service':
                name = _.find(this.organization.services,(service) => service._id === value)?.type;
                    break;
        }
        return name;
    }
}
