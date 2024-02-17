import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UrlSegment } from '@angular/router';
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
  deleteAssignee: any = Subscription;

  tableColumns = [
    { header: 'COMMON.PROJECT', field: 'project' },
    { header: 'COMMON.START_DATE', field: 'startDateFormatted' },
    { header: 'COMMON.END_DATE', field: 'endDateFormatted' },
    { header: 'COMMON.ALLOCATEDHOURS', field: 'hours' },
    { header: 'COMMON.COMPLETED_PERCENTAGE', field: 'completed' },
    { header: 'COMMON.STATUS', field: 'status' },
    { header: 'COMMON.ACTIONS', field: 'action' }
  ];

  taskColumns = [
    { header: 'ACTIVEWORK.TASKALLOCATION.SERVICES', field: 'task' },
    { header: 'COMMON.START_DATE', field: 'startDate' },
    { header: 'COMMON.END_DATE', field: 'endDate' },
    { header: 'COMMON.HOURS', field: 'hours', align: 'right' },
    { header: 'ACTIVEWORK.TASKALLOCATION.ASSIGNEE', field: 'assignee', align: 'right' },
    { header: 'ACTIVEWORK.TASKALLOCATION.ALLOCATION_PERCENTAGE', field: 'allocation', align: 'right' },
  ]

  usersColumns = [
    { header: 'COMMON.NAME', field: 'name' },
    { header: 'COMMON.PROJECT', field: 'project' },
    { header: 'COMMON.TASK', field: 'taskName' },
    { header: 'COMMON.START_DATE', field: 'startDate' },
    { header: 'COMMON.END_DATE', field: 'endDate' },
    { header: 'COMMON.ALLOCATEDHOURS', field: 'totalAllocatedHours' },
    { header: 'COMMON.ALLOCATED_PERCENTAGE', field: 'allocationPercentage' },
    { header: 'COMMON.ACTIONS', field: 'action' }
  ];

  tableData: any = [];
  taskTableData: any = [];
  // taskTableData: any = [
  //   { task: 'Basic Care', startDate: 'Feb 3, 2024', endDate: 'Feb 3, 2025', hours: '160', assignee: '', allocation: 0 },
  //   { task: 'Special Care', startDate: 'Feb 3, 2024', endDate: 'Feb 3, 2025', hours: '160', assignee: '', allocation: 0 },
  // ];
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
  timeData: any = [];
  monthlyData: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  remainingHours: any = [];
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
  individualsList: any;
  assigneeLocation: any = '';
  facilityLocation: any = '';
  organizationData: any;
  allocatedUsers: any;
  deleteId: any;

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
    this.subscribeToAssigneeData();
    this.subscribeToDeleteAssignee();
    this.subscribeXChange();
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
        this.organizationData = res.results;
        this.createTableData(this.dealsData, res.results);
      });
  }

  subscribeToGetAllIndividuals() {
    this.individualSubscription = this.individualService.allIndividuals.subscribe(
      (res: any) => {
        this.individualsList = res.results;
        const resultData = _.filter(res.results, (obj) => obj.primaryDetails.jobTitle === 'Account Manager' && obj.primaryDetails.companyName === 'Expert People Management GmbH');
        this.accountManagers = _.sortBy(_.map(resultData, (i) => { return { label: `${i.primaryDetails.firstName} ${i.primaryDetails.lastName}`, id: i.id, location: i.addresses[0] } }), 'label');
      }
    );
  }

  subscribeToAssigneeData() {
    this.xService.getAllX('taskAllocation').subscribe(
      (res: any) => {
        this.allocatedUsers = res.results;
      }
    );
  }

  subscribeXChange() {
    this.xService.addx.subscribe(
      (res) => {
        this.resourcesData = res.results;
      }
    )
  }

  subscribeToDeleteAssignee() {
    this.deleteAssignee = this.xService.deletexEmit.subscribe(
      (res: any) => {
        _.remove(this.resourcesData, (item: any) => item.id = this.deleteId);
        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Resource DeAllocated Successfully' });
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

  getSubmittedHours(deal: any) {
    const result: any = _.filter(this.allocatedUsers, (item) => item.orgId === deal.id)
    let percentage: any = 0;
    if (result.length > 0) {
      _.forEach(result, (assignee) => {
        percentage = percentage + ((assignee.submittedHours.quaterly[0] / 625) * 100)
      });
    }
    return { percentage }
  }

  createTableData(dealsData: any, orgData: any) {
    console.log(dealsData);
    console.log(orgData);
    _.forEach(dealsData, (deal) => {
      const totalHours = _.sumBy(deal.quotes[0].services, 'quantity');
      const orgName = _.filter(orgData, (org: any) => org.id === deal.org);
      const obj = {
        id: deal.id,
        project: (orgName.length > 0) ? orgName[0].primaryDetails.name : '',
        startDateFormatted: moment(deal.startDate).format('MMM DD YYYY'),
        endDateFormatted: moment(deal.closeDate).format('MMM DD YYYY'),
        startDate: new Date(Date.parse(deal.startDate.toString())),
        endDate: new Date(Date.parse(deal.closeDate.toString())),
        hours: totalHours,
        completed: this.getSubmittedHours(deal).percentage,
        status: deal.status,
        services: (deal.quotes.length > 0) ? deal.quotes[0].services : [],
        allServices: (orgName.length > 0) ? orgName[0].services : [],
        facility: (orgName.length > 0) ? orgName[0].facilities : [],
        dealData: deal
      }
      this.tableData.push(obj);
    });
    this.tableData = [...this.tableData];
  }

  getAddress(result: any) {
    return `${result[0].address},${result[0].country},${result[0].zipCode}`
  }

  updateUsersview(event: any) {
    const userView = _.filter(this.allocatedUsers, (item: any) => item.orgId === event.rowData.id && _.map(event.rowData.services, 'service').includes(item.taskId));
    if (userView.length > 0) {
      _.forEach(userView, (item) => {
        item.startDate = moment(item.startDate).format('MMM DD YYYY');
        item.endDate = moment(item.startDate).format('MMM DD YYYY');
      });
      this.resourcesData = userView;
    } else {
      this.resourcesData = [];
    }
  }

  manageActivity(event: any) {
    this.teamSchedule = true;
    this.activeWork.get('projectDetails')?.patchValue(event.rowData);
    const result = event.rowData.services;
    const taskIds = _.map(event.rowData.services, 'service');
    this.taskTableData = [];
    _.forEach(result, (item) => {
      const taskName = _.filter(event.rowData.allServices, (obj) => obj._id === item.service);
      const facilityName = _.filter(event.rowData.facility, (obj) => obj._id === item.facility);
      const obj = {
        id: event.rowData.id,
        task: (taskName.length > 0) ? taskName[0].type : '',
        taskId: item.service,
        facility: (facilityName.length > 0) ? this.getAddress(facilityName) : '',
        startDate: event.rowData.startDateFormatted,
        endDate: event.rowData.endDateFormatted,
        hours: item.quantity,
        assignee: '',
        allocation: 0
      };
      this.taskTableData.push(obj);
    });
    const userView = _.filter(this.allocatedUsers, (item: any) => item.orgId === event.rowData.id && _.map(event.rowData.services, 'service').includes(item.taskId));
    if (userView.length > 0) {
      _.forEach(userView, (item) => {
        item.startDate = moment(item.startDate).format('MMM DD YYYY');
        item.endDate = moment(item.startDate).format('MMM DD YYYY');
      });
      this.resourcesData = userView;
    } else {
      this.resourcesData = [];
    }
  }

  viewActivity(event: any) {
    this.teamSchedule = true;
  }

  showAssigneeDetails(event: any) {
    this.visible = true;
    this.assigneeView = true;
    this.remainingHours = [];
    this.taskDetails = event.rowData;
    this.taskIndex = event.index;
    this.serviceHours = parseInt(this.taskDetails.hours);
    this.allocationCount = '';
    this.selectedAssignee = '';
    this.toggleStatus = false;
    this.timeRangeHeaders = (this.timeRangeValue === 'Monthly') ? [...this.monthlyHeaders] : [...this.headers];
    this.timeData = (this.timeRangeValue === 'Monthly') ? [...this.monthlyData] : [...this.data];
    this.totalHours = '';
    this.facilityLocation = event.rowData.facility;
  }

  updateLocation() {
    if (this.individualService.allocatedHours[this.selectedAssignee]) {
      this.remainingHours = this.individualService.allocatedHours[this.selectedAssignee];
    } else {
      this.individualService.allocatedHours[this.selectedAssignee] = [];
      this.individualService.allocatedHours[this.selectedAssignee] = (this.timeRangeValue === 'Quaterly') ? Array(4).fill(480) : Array(12).fill(160);
      this.remainingHours = this.individualService.allocatedHours[this.selectedAssignee];
    }
    const result = _.filter(this.accountManagers, (item: any) => item.label == this.selectedAssignee);
    if (result.length > 0) {
      const value = result[0].location;
      this.assigneeLocation = `${value.address} ${(value.country) ? `,${value.country}` : ''} ${(value.zipCode) ? `,${value.zipCode}` : ''}`
    }
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
      this.totalHours = 0;
    }
  }

  allocationCheck() {
    if (this.allocationCount > 100) {
      this.messageService.clear();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Allocated Hours cannot be greater than Service hours` });
    }
  }

  updateTotal() {
    this.totalHours = _.sum(this.timeData);
    this.allocationCount = (this.totalHours / this.serviceHours) * 100;
    this.allocationCheck();
  }

  showAllocation(event: any) {
    console.log(event);
    this.visible = true;
    this.assigneeView = false;
  }

  saveAndAllocate() {

  }

  closeView() {
    this.visible = false;
    this.selectedAssignee = '';
    this.toggleStatus = false;
    this.remainingHours = [];
  }

  allocate() {
    this.allocationCheck();
    const diffHours = this.remainingHours.map((valueA: any, indexInA: any) => valueA - this.timeData[indexInA]);
    this.individualService.allocatedHours[this.selectedAssignee] = diffHours;
    const obj = {
      orgId: this.taskDetails.id,
      project: this.activeWork.value.projectDetails.project,
      taskId: this.taskDetails.taskId,
      taskName: this.taskDetails.task,
      name: this.selectedAssignee,
      totalAllocatedHours: this.totalHours,
      allocationPercentage: this.allocationCount,
      startDate: this.taskDetails.startDate,
      endDate: this.taskDetails.endDate,
      allocatedHours: {
        quaterly: this.timeData,
        monthly: [],
        weekly: [],
      },
      remainingHours: {
        quaterly: diffHours,
        monthly: [],
        weekly: [],
      },
      submittedHours: {
        quaterly: [0, 0, 0, 0],
        monthly: [],
        weekly: [],
      }
    }
    console.log(obj);
    this.individualService.saveAllocationData.push(obj);
    // this.resourcesData.push(obj);
    this.taskTableData[this.taskIndex].allocation = this.taskTableData[this.taskIndex].allocation + obj.allocationPercentage;
    // this.taskTableData[this.taskIndex].assignee = obj.name;
    this.taskTableData = [...this.taskTableData];
    this.resourcesData = [...this.resourcesData];
    this.messageService.clear();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `New User ${obj.name} Assigned for ${obj.taskName}` });
    this.visible = false;
    this.xService.postX('taskAllocation', obj);

    this.subscribeToAssigneeData();
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
    this.timeRangeValue = value.data;
    this.timeRangeHeaders = (value.data === 'Monthly') ? [...this.monthlyHeaders] : [...this.headers];
    this.timeData = (value.data === 'Monthly') ? [...this.monthlyData] : [...this.data];
  }

  delete(event: any) {
    this.deleteId = event.rowData.id;
    this.xService.deleteX('taskAllocation', event.rowData.id);
  }

}
