import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IndividualService } from 'src/app/api/contacts/individuals.service';

@Component({
  selector: 'app-taskallocation',
  templateUrl: './taskallocation.component.html',
  styleUrl: './taskallocation.component.scss',
  providers: [MessageService]
})
export class TaskallocationComponent implements OnInit {

  @Input() data: any;

  individualSubscription: any = Subscription;
  //TableView
  usersColumns = [
    { header: 'Name', field: 'name' },
    { header: 'Start Date', field: 'startDate' },
    { header: 'End Date', field: 'endDate' },
    { header: '% Allocated', field: 'allocated', align: 'right' },
    { header: 'Q1', field: 'q1', align: 'right' },
    { header: 'Q2', field: 'q2', align: 'right' },
    { header: 'Q3', field: 'q3', align: 'right' },
    { header: 'Q4', field: 'q4', align: 'right' },
  ];
  tableData: any = [
    { name: 'Natarajan', startDate: 'Feb 3, 2024', endDate: 'Feb 3, 2025', allocated: '50%', q1: 240, q2: 240, q3: 240, q4: 240 },
    { name: 'Karthikeyan', startDate: 'Feb 3, 2024', endDate: 'Feb 3, 2025', allocated: '50%', q1: 240, q2: 240, q3: 240, q4: 240 },
  ];
  newData: any = [
    { id: 'event-0', name: '', startDate: '', endDate: '', allocated: '', q1: 0, q2: 0, q3: 0, q4: 0 },
  ];
  accountManagers: any = [];

  constructor(
    private messageService: MessageService,
    private individualService: IndividualService,
  ) { }

  ngOnInit() {
    if(this.individualService.saveAllocationData.length > 0) {
      this.newData = this.individualService.saveAllocationData;
    }
    this.individualService.getAllIndividuals();
    this.subscribeToGetAllIndividuals();
  }

  subscribeToGetAllIndividuals() {
    this.individualSubscription = this.individualService.allIndividuals.subscribe(
      (res: any) => {
        console.log(res.results);
        const resultData = _.filter(res.results, (obj) => obj.primaryDetails.jobTitle === 'Account Manager' && obj.primaryDetails.companyName === 'Expert People Management GmbH');
        this.accountManagers = _.sortBy(_.map(resultData, (i) => { return { label: `${i.primaryDetails.firstName} ${i.primaryDetails.lastName}`, id: i.id } }), 'label');
      }
    );
  }

  onRowEditInit(rowData: any) {
    this.individualService.saveAllocationData = this.newData;
  }

  onRowEditSave(rowData: any) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User allocation is updated' });
  }

  onAddRow(rowData: any, index: number) {
    const obj = { id: `event-${index+1}`, name: '', startDate: '', endDate: '', allocated: '', q1: 0, q2: 0, q3: 0, q4: 0 };
    this.newData.push(obj)
  }

  onRowEditCancel(rowData: any, index: number) {

  }

}
