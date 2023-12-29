import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: []
})
export class TableComponent implements OnInit, OnDestroy {

  constructor() {}

  @Input() key: any;
  @Input() columns: any;
  @Input() tableData: any;
  @Output() editContent = new EventEmitter();
  @Output() deleteContent = new EventEmitter();

  ngOnInit() {

    
  }

  addContact() {

  }

  edit(data: any, rowindex: number) {
    this.editContent.emit({data: this.tableData, rowData: data, index: rowindex});
  }

  delete(data: any, rowindex: number) {
    this.deleteContent.emit({data: this.tableData, rowData: data, index: rowindex});
  }

  ngOnDestroy() {

    
  }

}
