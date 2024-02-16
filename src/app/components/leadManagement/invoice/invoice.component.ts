import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { notesContent, templateContent } from './invoice.helper';
import { DealService } from 'src/app/api/leads/deal.service';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit, OnChanges {
  @Input() deal: any;
  @Input() organization: any;
  @Input() quote: any;
  @Input() visible: boolean = false;

  templateContent = _.cloneDeep(templateContent)
  notesContent = _.cloneDeep(notesContent);
  @ViewChild('printHeader') printHeader!: ElementRef;
  @ViewChild('printFooter') printFooter!: ElementRef;
  @ViewChild('printComponent') printComponent!: ElementRef;


  showPrintContent: boolean = false;

  constructor(private dealService: DealService,
    private printService: NgxPrintService) { }
  ngOnInit() {
  }
  ngOnChanges() {
  }
  getName(value: string, type: string) {
    let name = '';
    switch (type) {
      case 'facility':
        name = _.find(this.organization.facilities, (facility) => facility._id === value)?.address;
        break;
      case 'service':
        name = _.find(this.organization.services, (service) => service._id === value)?.type;
        break;
    }
    return name;
  }
  getContent() {
    let content = '';
    if (this.printComponent && this.printComponent.nativeElement) {
      const printContents = this.printComponent.nativeElement.outerHTML;
      const printHeader = this.printHeader.nativeElement.outerHTML;
      const printFooter = this.printFooter.nativeElement.outerHTML;
      content = `${printHeader}${this.templateContent}${printContents}${this.notesContent}${printFooter}`;
    }
    return content;
  }

  printComponentContent() {
    let content = this.getContent();
    if (content) {
      const popupWin: any = window.open('', '_blank', 'width=600,height=600');
      popupWin.document.open();
      popupWin.document.write(`<html>
                <head>
                <title>Print</title>
                <!-- Include any stylesheets or scripts needed for the print view -->
                <link type="text/css" href="styles.scss">
                <link type="text/css" href="src/assets/layout/styles/layout/preloading.scss">
                </head>
               <body onload="window.print(); window.onafterprint = function(){ window.close(); }">${content}</body>
            </html>`);
      popupWin.document.close();
    }
  }
  emailComponentContent() {
    let content = this.getContent();
    const doc = new jsPDF();
    const body = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
          <style>
            /* Add your styles here */
            body {
              font-family: Arial, sans-serif;
            }
            .invoice-container {
              display: flex;
              flex-direction: column;
              align-items: start;
              justify-content: between;
              border-bottom: 1px solid #ccc;
              min-width: max-content;
            }
            .company-info {
              display: flex;
              flex-direction: column;
            }
            .company-logo {
              width: 10rem;
            }
            .date-info {
              display: flex;
              flex-direction: column;
            }
            .invoice-content {
              margin-top: 5px;
              display: flex;
              flex-direction: column;
            }
            /* Add more styles as needed */
          </style>
        </head>
        <body>
        ${content}
        </body>
        </html>`
    // doc.html(body, {
    //   callback: (pdf) => {
    //     // Save the PDF or display it
    //     pdf.save('document.pdf');
    //   }
    // });
    if (content) {
      this.dealService.sentEmail({ content: body });
    }
  }

  printMe() {
    this.showPrintContent = true;
    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: 'printContent',
      useExistingCss: true,
      previewOnly: false
    });
    this.printService.print(customPrintOptions);
  }

}
