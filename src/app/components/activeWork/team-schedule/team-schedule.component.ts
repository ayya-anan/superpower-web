import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IndividualService } from 'src/app/api/contacts/individuals.service';
import { OrganizationService } from 'src/app/api/contacts/organization.service';
import { XService } from 'src/app/api/x/x.service';

@Component({
  selector: 'app-team-schedule',
  templateUrl: './team-schedule.component.html',
  styleUrl: './team-schedule.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class TeamScheduleComponent implements OnInit {

  activeWork: FormGroup = new FormGroup({});
  loading: boolean = false;
  teamSchedule: boolean = false;
  visible: boolean = false;


  //Subscription
  organizationSubscription: any = Subscription;
  individualSubscription: any = Subscription;

  tableColumns = [
    { header: 'Project', field: 'project' },
    { header: 'Start Date', field: 'startDateFormatted' },
    { header: 'End Date', field: 'endDateFormatted' },
    { header: 'Hours', field: 'hours' },
    { header: '% Completed', field: 'completed' },
    { header: 'Status', field: 'status' },
    { header: 'Actions', field: 'action' }
  ];

  taskColumns = [
    { header: 'Services', field: 'task' },
    { header: 'Start Date', field: 'startDate' },
    { header: 'End Date', field: 'endDate' },
    { header: 'Hours', field: 'hours', align: 'right' },
    { header: 'Assignee', field: 'assignee', align: 'right' },
    { header: 'Allocation (%)', field: 'allocation', align: 'right' },
    // { header: 'Action', field: 'action', align: 'right' },
    // { header: 'Q1', field: 'q1', align: 'right' },
    // { header: 'Q2', field: 'q2', align: 'right' },
    // { header: 'Q3', field: 'q3', align: 'right' },
    // { header: 'Q4', field: 'q4', align: 'right' },
  ]

  usersColumns = [
    { header: 'Name', field: 'name' },
    { header: 'Project', field: 'project' },
    { header: 'Task', field: 'taskName' },
    { header: 'Start Date', field: 'startDate' },
    { header: 'End Date', field: 'endDate' },
    { header: 'Allocated Hours', field: 'allocatedHours' },
    { header: 'Allocated (%)', field: 'allocationPercentage' },
    { header: 'Actions', field: 'action' }
  ];

  tableData: any = [];
  taskTableData: any = [
    { task: 'Basic Care', startDate: 'Feb 3, 2024', endDate: 'Feb 3, 2025', hours: '160', assignee: '', allocation: 0 },
    { task: 'Special Care', startDate: 'Feb 3, 2024', endDate: 'Feb 3, 2025', hours: '160', assignee: '', allocation: 0 },
  ];
  usersTableData: any = [
    { name: 'Natarajan', startDate: 'Feb 3, 2024', endDate: 'Feb 3, 2025', allocated: '50%', q1: 240, q2: 240, q3: 240, q4: 240 },
    { name: 'Karthikeyan', startDate: 'Feb 3, 2024', endDate: 'Feb 3, 2025', allocated: '50%', q1: 240, q2: 240, q3: 240, q4: 240 },
  ]

  //Temp
  dealsData: any;
  accountManagers: any = [];
  toggleStatus: boolean = false;
  headers = [
    { name: 'Q1' },
    { name: 'Q2' },
    { name: 'Q3' },
    { name: 'Q4' },
  ];
  monthlyHeaders = [
    { name: 'Feb' },
    { name: 'Mar' },
    { name: 'Apr' },
    { name: 'May' },
    { name: 'Jun' },
    { name: 'Jul' },
    { name: 'Aug' },
    { name: 'Sep' },
    { name: 'Oct' },
    { name: 'Nov' },
    { name: 'Dec' },
    { name: 'Jan' }
  ];
  timeRangeHeaders: any = [];
  resourcesData: any = [];
  data: any = [0, 0, 0, 0];
  // headers = [
  //   {name : 'Feb'},
  //   {name : 'Mar'},
  //   {name : 'Apr'},
  //   {name : 'May'},
  //   {name : 'Jun'},
  //   {name : 'Jul'},
  //   {name : 'Aug'},
  //   {name : 'Sep'},
  //   {name : 'Oct'},
  //   {name : 'Nov'},
  //   {name : 'Dev'},
  //   {name : 'Jan'}
  // ]
  timeData: any = [];
  monthlyData: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  value1 = 40;
  totalHours: any;
  allocationCount: any;
  taskDetails: any;
  serviceHours: any;
  selectedAssignee: any;
  assigneeView: boolean = false;
  taskIndex: any;
  updateAssignee: boolean = false;
  updatedStartDate: any;
  updatedEndDate: any;
  timeRangeValue: any = 'Quaterly';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private xService: XService,
    private organizationService: OrganizationService,
    private individualService: IndividualService
  ) { }

  ngOnInit() {
    this.timeRangeHeaders = this.headers;
    this.timeData = this.data;
    this.individualService.getAllIndividuals();
    this.subscribeToDealsData();
    this.subscribeToOrgData();
    this.subscribeToGetAllIndividuals();
    this.initForm();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  subscribeToDealsData() {
    this.xService.getAllX('deal').subscribe(
      (res: any) => {
        this.dealsData = _.filter(res.results, (obj) => obj.status === 'Quote Accepted');
        this.organizationService.getAllOrganization();
      }
    );
  }

  subscribeToOrgData() {
    this.organizationSubscription = this.organizationService.allOrganization.subscribe(
      (res: any) => {
        this.createTableData(this.dealsData, res.results);
      });
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

  initForm() {
    this.activeWork.reset();
    this.activeWork = this.fb.group({
      projectDetails: this.fb.group({
        project: [''],
        startDate: [new Date(), [Validators.required]],
        endDate: [new Date(new Date().setFullYear(new Date().getFullYear() + 1)), [Validators.required]],
        hours: [''],
        completed: [''],
        status: ['Active', [Validators.required]],
      }),
      tasks: this.fb.array([]),
      users: this.fb.array([]),
    });
  }

  createTableData(dealsData: any, orgData: any) {
    console.log(dealsData);
    console.log(orgData);
    _.forEach(dealsData, (deal) => {
      const orgName = _.filter(orgData, (org: any) => org.id === deal.org);
      const obj = {
        project: (orgName.length > 0) ? orgName[0].primaryDetails.name : '',
        startDateFormatted: moment(deal.startDate).format('MMM DD YYYY'),
        endDateFormatted: moment(deal.closeDate).format('MMM DD YYYY'),
        startDate: new Date(Date.parse(deal.startDate.toString())),
        endDate: new Date(Date.parse(deal.closeDate.toString())),
        hours: 0,
        completed: 0,
        status: deal.status
      }
      this.tableData.push(obj);
    });
    this.tableData = [...this.tableData];
  }

  manageActivity(event: any) {
    this.teamSchedule = true;
    this.activeWork.get('projectDetails')?.patchValue(event.rowData);
  }

  viewActivity(event: any) {
    this.teamSchedule = true;
  }

  showAssigneeDetails(event: any) {
    this.visible = true;
    this.assigneeView = true;
    this.taskDetails = event.rowData;
    this.taskIndex = event.index;
    this.serviceHours = parseInt(this.taskDetails.hours);
    this.allocationCount = '';
    this.toggleStatus = false;
    this.timeRangeHeaders = (this.timeRangeValue  === 'Monthly') ? [...this.monthlyHeaders] : [...this.headers];
    this.timeData = (this.timeRangeValue  === 'Monthly') ? [...this.monthlyData] : [...this.data];
    this.totalHours = '';
  }

  onSubmit() {
    console.log(this.activeWork.value);
  }

  updateAllocationData() {
    if (this.toggleStatus) {
      const hours = parseInt(this.taskDetails.hours);
      const autoAllocatedHours = (hours * this.allocationCount / 100) / this.timeData.length;
      this.timeData = this.timeData.fill(autoAllocatedHours);
      this.totalHours = _.sum(this.timeData);
    } else {
      this.timeData = this.timeData.fill(0);
    }
  }

  showAllocation(event: any) {
    console.log(event);
    this.visible = true;
    this.assigneeView = false;
  }

  saveAndAllocate() {

  }

  allocate() {

    const obj = {
      name: this.selectedAssignee,
      allocatedHours: this.totalHours,
      allocationPercentage: this.allocationCount,
      taskName: this.taskDetails.task,
      project: this.activeWork.value.projectDetails.project,
      startDate: this.taskDetails.startDate,
      endDate: this.taskDetails.endDate
    }
    console.log(obj);
    this.individualService.saveAllocationData.push(obj);
    this.resourcesData.push(obj);
    this.taskTableData[this.taskIndex].allocation = this.taskTableData[this.taskIndex].allocation + obj.allocationPercentage;
    // this.taskTableData[this.taskIndex].assignee = obj.name;
    this.taskTableData = [...this.taskTableData];
    this.resourcesData = [...this.resourcesData];
    this.messageService.clear();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `New User ${obj.name} Assigned for ${obj.taskName}` });
    this.visible = false;
  }

  editData(event: any) {
    console.log(event);
    // this.visible = true;
    this.updateAssignee = true;
  }

  updateAssigneeDetails() {
    console.log(this.updatedEndDate);
    console.log(this.selectedAssignee);
    console.log(this.updatedStartDate);
  }

  updateRangeView(value: any) {
    console.log(value);
    this.timeRangeValue = value.data;
    this.timeRangeHeaders = (value.data === 'Monthly') ? [...this.monthlyHeaders] : [...this.headers];
    this.timeData = (value.data === 'Monthly') ? [...this.monthlyData] : [...this.data];
  }

  delete(event: any) {
    _.remove(this.resourcesData, (obj: any) => obj.name === event.rowData.name);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Deleted Successfully' });
    const result = _.filter(this.taskTableData, (obj)=> obj.task === event.rowData.taskName);
    if(result.length > 0) {
      result[0].allocation = result[0].allocation - event.rowData.allocationPercentage;
    }
    this.taskTableData = [...this.taskTableData];
    this.resourcesData = [...this.resourcesData];
    // this.confirmationService.confirm({
    //   header: 'Confirmation',
    //   message: `Are you sure you want to delete ${event.rowData.name}.`,
    //   acceptIcon: 'pi pi-check mr-2',
    //   rejectIcon: 'pi pi-times mr-2',
    //   rejectButtonStyleClass: 'p-button-sm',
    //   acceptButtonStyleClass: 'p-button-outlined p-button-sm',
    //   accept: () => {
    //     _.remove(this.resourcesData, (obj: any) => obj.name === event.rowData.name);
    //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Deleted Successfully' });
    //   },
    // });
  }

}
