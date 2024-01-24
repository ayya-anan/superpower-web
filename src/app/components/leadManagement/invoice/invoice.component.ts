import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
    
    @ViewChild('printComponent') printComponent!: ElementRef;

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
    printComponentContent() {
        if (this.printComponent && this.printComponent.nativeElement) {

            const printContents = this.printComponent.nativeElement.outerHTML;
            const popupWin: any = window.open('', '_blank', 'width=600,height=600');
            popupWin.document.open();
            popupWin.document.write(`
                <html>
                    <head>
                    <title>Print</title>
                    <!-- Include any stylesheets or scripts needed for the print view -->
                    </head>
                    <body onload="window.print();window.onafterprint=function(){window.close()}">${printContents}</body>
                </html>`
            );
            popupWin.document.close();
        }
    }
}
