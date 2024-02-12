import { Component } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  styleUrl: './time-tracking.component.scss'
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
      date: '5th Feb, 2024',
      value: 0
    },
    {
      header: 'Tuesday',
      date: '6th Feb, 2024',
      value: 0
    },
    {
      header: 'Wednesday',
      date: '7th Feb, 2024',
      value: 0
    },
    {
      header: 'Thursday',
      date: '8th Feb, 2024',
      value: 0
    },
    {
      header: 'Friday',
      date: '9th Feb, 2024',
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

  constructor() { }

  ngOnInit() {
  }

  updateValue() {
    console.log(this.timeSheet);
    this.calculateTotal();
  }

  calculateTotal() {
    _.forEach(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], (item) => {
      this.totalHoursView[0][item] = _.sumBy(this.timeSheet, item);
    });
    this.totalHoursView = [...this.totalHoursView];
  }

  submitTimesheet() {
    this.InitialView = false;
  }

  timesheetReport() {
    this.InitialView = true;
    console.log(this.timeSheet);
    _.forEach(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], (item, index: any) => {
      this.weeklyView[index].value = this.totalHoursView[0][item];
    });
    console.log(this.weeklyView);
    this.weeklyView = [...this.weeklyView];
    this.weeklyTotal = _.sumBy(this.weeklyView, 'value');
  }

  reportsView() {
    this.InitialView = true;
  }

}
