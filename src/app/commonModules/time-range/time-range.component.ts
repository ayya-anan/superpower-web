import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-range',
  templateUrl: './time-range.component.html',
  styleUrl: './time-range.component.scss'
})
export class TimeRangeComponent implements OnInit {

  @Input() key: any;

  yearlyRange = [
    { label: 'Quaterly', field: 'quaterly', value: 'Q', state: true},
    { label: 'Monthly', field: 'monthly', value: 'M', state: false},
    { label: 'Weekly', field: 'weekly', value: 'W', state: false},
  ];
  monthRange = [
    { label: 'Past Month', field: 'previousMonth', value: 'Q', state: false},
    { label: 'Current Month', field: 'currentMonth', value: 'M', state: true},
    { label: 'Next Month', field: 'nextMonth', value: 'W', state: false},
  ];
  results: any = [];

  constructor() { }

  ngOnInit() {
   this.results = (this.key === 'monthlyView') ? this.monthRange : this.yearlyRange;
  }
}
