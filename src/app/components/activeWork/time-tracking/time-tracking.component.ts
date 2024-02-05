import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  styleUrl: './time-tracking.component.scss'
})
export class TimeTrackingComponent {

  activeEfforts: FormGroup = new FormGroup({});

  //TableData
  loading: boolean = false;
  taskColumns = [
    { header: 'Project', field: 'project' },
    { header: 'Task', field: 'task' },
    { header: 'W1', field: 'w1', align: 'right' },
    { header: 'W2', field: 'w2', align: 'right' },
    { header: 'W3', field: 'w3', align: 'right' },
    { header: 'W4', field: 'w4', align: 'right' },
    { header: 'W5', field: 'w5', align: 'right' },
  ];

  effortsTableData = [
    { project: 'Project A', task: 'Basic Care', w1: 40, w2: 40, w3: 40, w4: 0, w5: 0 },
    { project: 'Project A', task: 'Special Care', w1: 0, w2: 0, w3: 0, w4: 40, w5: 40 },
  ];
  assignmentData: any = [];

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.activeEfforts.reset();
    this.activeEfforts = this.fb.group({
      projectDetails: this.fb.group({
        firstName: [''],
        middleName: [''],
        lastName: [''],
        phone: [''],
        email: [''],
        address: ['']
      }),
      efforts: this.fb.array([]),
      assignment: this.fb.array([]),
    });
  }

  onSubmit() {
    console.log(this.activeEfforts.value);
  }

}
