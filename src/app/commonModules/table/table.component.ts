import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { showCheckBox, showColumnSelection } from './table.helper';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: []
})
export class TableComponent implements OnInit, OnDestroy {

  constructor(
  ) { }

  @Input() loading = false;
  @Input() key: any;
  @Input() footerKey: any;
  @Input() columns: any;
  @Input() tableData: any;
  @Output() editContent = new EventEmitter();
  @Output() cloneContent = new EventEmitter();
  @Output() deleteContent = new EventEmitter();
  @Output() showContent = new EventEmitter();
  @Output() editedContent = new EventEmitter();
  @Output() manageActivity = new EventEmitter();
  @Output() viewActivity = new EventEmitter();
  @Output() addAssigneeDetail = new EventEmitter();
  @Output() showAllocationDetails = new EventEmitter();
  
  _selectedColumns: any[] = [];
  showCheckBox: boolean = false;
  showColumnSelection: boolean = false;

  ngOnInit() {
    this._selectedColumns = this.columns;
    this.showCheckBox = showCheckBox[this.key];
    this.showColumnSelection = showColumnSelection[this.key];
  }

  addContact() {

  }

  edit(data: any, rowindex: number) {
    this.editContent.emit({ data: this.tableData, rowData: data, index: rowindex });
  }

  clone(data: any, rowindex: number) {
    this.cloneContent.emit({ data: this.tableData, rowData: data, index: rowindex });
  }

  delete(data: any, rowindex: number) {
    this.deleteContent.emit({ data: this.tableData, rowData: data, index: rowindex });
  }

  onEditComplete(event: any) {
    this.editedContent.emit({ data: event });
  }

  showDetails(event: any) {
    this.showContent.emit( {data: event.data });
  }

  manageActivities(data: any, rowindex: number, view: any) {
    this.manageActivity.emit({ data: this.tableData, rowData: data, index: rowindex, type: view });
  }

  viewActivities(data: any, rowindex: number, view: any) {
    this.viewActivity.emit({ data: this.tableData, rowData: data, index: rowindex, type: view });
  }

  viewAllocation(data: any, rowindex: number) {
    this.showAllocationDetails.emit({ data: this.tableData, rowData: data, index: rowindex });
  }

  addAssignee(data: any, rowindex: number) {
    this.addAssigneeDetail.emit({ data: this.tableData, rowData: data, index: rowindex });
  }

  ngOnDestroy() {


  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns =
      this.columns.filter((col: any) => val.includes(col));
  }
}
