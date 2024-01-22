import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { templateContent } from './invoice.helper';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit {
    @Input() deal: any;
    @Input() organization: any;
    @Input() quote: any;
    templateContent = _.cloneDeep(templateContent)
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
