import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-time-range',
  templateUrl: './time-range.component.html',
  styleUrl: './time-range.component.scss',
  providers: []
})
export class TimeRangeComponent implements OnInit {

  @Input() key: any;
  @Output() updateRange = new EventEmitter();

  activeState: any;

  yearlyRange = [
    { header: 'LEAD_MANAGEMENT.DEALS.QUARTERLY', label: 'Quaterly', field: 'quaterly', value: 'Q', state: true},
    { header: 'LEAD_MANAGEMENT.DEALS.MONTHLY', label: 'Monthly', field: 'monthly', value: 'M', state: false},
    { header: 'LEAD_MANAGEMENT.DEALS.WEEKLY', label: 'Weekly', field: 'weekly', value: 'W', state: false},
  ];
  monthRange = [
    { label: 'Past Month', field: 'previousMonth', value: 'Q', state: false},
    { label: 'Current Month', field: 'currentMonth', value: 'M', state: true},
    { label: 'Next Month', field: 'nextMonth', value: 'W', state: false},
  ];
  results: any = [];

  constructor() { }

  ngOnInit() {
   this.activeState = 'Quaterly';
   this.results = (this.key === 'monthlyView') ? this.monthRange : this.yearlyRange;
  }

  updateView(value: any) {
    if(value.label === 'Quaterly') {
      this.activeState = value.label;
      this.updateRange.emit({data: value.label }); 
    }
  }
}
