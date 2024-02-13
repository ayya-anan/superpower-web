import { Component } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  styleUrl: './time-tracking.component.scss',
  providers: [MessageService]
})
export class TimeTrackingComponent {

  timeSheet: any = [
    { Task: 'Basic Care', Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
    { Task: 'Special Care', Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
    { Task: 'Internal Audit', Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
    { Task: 'External Audit', Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
  ];

  totalHoursView: any = [
    { Task: 'Total', Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
  ];

  weeklyTotal: any = 0.00;
  weeklyView = [
    {
      header: 'Monday',
      date: '',
      value: 0
    },
    {
      header: 'Tuesday',
      date: '',
      value: 0
    },
    {
      header: 'Wednesday',
      date: '',
      value: 0
    },
    {
      header: 'Thursday',
      date: '',
      value: 0
    },
    {
      header: 'Friday',
      date: '',
      value: 0
    },
  ];

  leaveView = [
    {
      title: 'Annual Leave',
      value: 2,
      totalValue: 16,
      summary: 'Balance : 16 day(s)',
      Overall: '18 Days'
    },
    {
      title: 'Sick Leave',
      value: 0,
      totalValue: 5,
      summary: 'Balance : 5 day(s)',
      Overall: '5 Days'
    }
  ]

  InitialView: boolean = true;
  startDate: any;
  endDate: any;
  originalTimesheet: any = [];

  constructor(
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.startDate = moment().startOf('week').add('days', 1).format('Do MMM YY')
    this.endDate = moment().endOf('week').subtract('days', 1).format('Do MMM YY');
    this.currentWeek();
    this.originalTimesheet = _.cloneDeep(this.timeSheet);
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
