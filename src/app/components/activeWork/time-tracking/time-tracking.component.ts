import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { IndividualService } from 'src/app/api/contacts/individuals.service';
import { XService } from 'src/app/api/x/x.service';

@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  styleUrl: './time-tracking.component.scss',
  providers: [MessageService]
})
export class TimeTrackingComponent {

  timeSheet: any = [];

  timesheetColumns = [
    { header: 'COMMON.PROJECT', label: 'Project'},
    { header: 'COMMON.TASK', label: 'Task'},
    { header: 'ACTIVEWORK.TIMETRACKING.MONDAY',label: 'Monday' },
    { header: 'ACTIVEWORK.TIMETRACKING.TUESDAY', label: 'Tuesday' },
    { header: 'ACTIVEWORK.TIMETRACKING.WEDNESDAY', label: 'Wednesday' },
    { header: 'ACTIVEWORK.TIMETRACKING.THURSDAY', label: 'Thursday' },
    { header: 'ACTIVEWORK.TIMETRACKING.Friday', label: 'Friday' },
  ]

  totalHoursView: any = [
    { Task: 'Total', Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
  ];

  weeklyTotal: any = 0.00;
  weeklyView = [
    { header: 'ACTIVEWORK.TIMETRACKING.MONDAY', date: '', value: 0 },
    { header: 'ACTIVEWORK.TIMETRACKING.TUESDAY', date: '', value: 0 },
    { header: 'ACTIVEWORK.TIMETRACKING.WEDNESDAY', date: '', value: 0 },
    { header: 'ACTIVEWORK.TIMETRACKING.THURSDAY', date: '', value: 0 },
    { header: 'ACTIVEWORK.TIMETRACKING.Friday', date: '', value: 0 },
  ];

  leaveView = [
    {
      title: 'ACTIVEWORK.TIMETRACKING.ANNUAL_LEAVE',
      value: 2,
      totalValue: 16,
      summary: 'ACTIVEWORK.TIMETRACKING.BALANCE_DAYS_ANNUAL',
      Overall: '18 Days'
    },
    {
      title: 'ACTIVEWORK.TIMETRACKING.SICK_LEAVE',
      value: 0,
      totalValue: 5,
      summary: 'ACTIVEWORK.TIMETRACKING.BALANCE_DAYS_SICK',
      Overall: '5 Days'
    }
  ]

  InitialView: boolean = true;
  startDate: any;
  endDate: any;
  originalTimesheet: any = [];
  allocatedUsers: any;
  selectedPerson: any;

  constructor(
    private messageService: MessageService,
    private individualService: IndividualService,
    private xService: XService,
    private keycloakService: KeycloakService
  ) { }

  ngOnInit() {
    this.subscribeToAssigneeData();
    this.startDate = moment().startOf('week').add('days', 1).format('Do MMM YY')
    this.endDate = moment().endOf('week').subtract('days', 1).format('Do MMM YY');
    this.currentWeek();
    this.timeSheet = [
      { Project: 'A', Task: 'BB', Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0}
    ]
    this.originalTimesheet = _.cloneDeep(this.timeSheet);
  }

  subscribeToAssigneeData() {
    this.xService.getAllX('taskAllocation').subscribe(
      (res: any) => {
        this.allocatedUsers = res.results;
        this.createDetailList();
      }
    );
  }

  createDetailList() {
    let username = this.keycloakService.getUsername();
    const result = _.filter(this.allocatedUsers, (item) => item.name.toLowerCase() === username.toLowerCase());
    this.selectedPerson = result;
    _.forEach(result, (item) => {
      const obj = { Project: item.project, Task: item.taskName, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 }
      this.timeSheet.push(obj);
    });
  }

  updateValue(event: any) {
    console.log(this.timeSheet);
    this.calculateTotal();
  }

  calculateTotal() {
    _.forEach(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], (item) => {
      this.totalHoursView[0][item] = _.sumBy(this.timeSheet, (obj: any) => (obj[item] > 12) ? 12 : obj[item]);
    });
    this.totalHoursView = [...this.totalHoursView];
  }

  submitTimesheet() {
    this.InitialView = false;
  }

  timesheetReport() {
    console.log(this.timeSheet);
    const totalHours = this.totalHoursView[0];
    if(totalHours.Monday <= 12 && totalHours.Tuesday <= 12 && totalHours.Wednesday <= 12 && totalHours.Thursday <= 12 && totalHours.Friday <= 12) {
      _.forEach(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], (item, index: any) => {
        this.weeklyView[index].value = this.totalHoursView[0][item];
      });
      console.log(this.weeklyView);
      this.weeklyView = [...this.weeklyView];
      this.weeklyTotal = _.sumBy(this.weeklyView, 'value');
      // this.individualService.saveAllocationData[0].submittedHours = this.weeklyTotal;
      if(this.selectedPerson.length > 0) {
        this.selectedPerson[0].submittedHours.quaterly[0] = this.weeklyTotal;
        this.xService.updateX('taskAllocation', this.selectedPerson[0], this.selectedPerson[0].id);
      }
    } else {
      this.messageService.clear();
      this.messageService.add({ severity: 'error', summary: 'Invalid Hours', detail: `Total Hours for a day cannot exceed 12` });
    }

  }

  clearTimesheet() {
    this.timeSheet = [
      { Task: 'Basic Care', Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
      { Task: 'Special Care', Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
      { Task: 'Internal Audit', Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
      { Task: 'External Audit', Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
    ];
    _.forEach(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], (item) => {
      this.totalHoursView[0][item] = 0;
    });
  }

  updateStartEnd(startDay: any) {
    this.startDate = moment(startDay).add('days', 1).format('Do MMM YY');
    this.endDate = moment(startDay).add('days', 5).format('Do MMM YY');
    _.forEach(this.weeklyView, (item,index: any) => {
      item.date = startDay.add('days', 1).format('Do MMM YY');
    });
  }

  currentWeek() {
    const startDay = moment().startOf('week');
    this.updateStartEnd(startDay);
  }

  previousWeek() {
    const startDay =  moment().subtract(1, 'weeks').startOf('week');
    this.updateStartEnd(startDay);
  }

  nextWeek() {
    const startDay =  moment().add(1, 'weeks').startOf('week');
    this.updateStartEnd(startDay);
  }

}
