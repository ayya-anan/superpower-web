import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { IndividualService } from 'src/app/api/contacts/individuals.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {

  // Subscription
  individualsList: any = Subscription;

  //TableDatas
  ownCompany = 'Expert People Management GmbH';
  loading: boolean = false;
  columns = [
    { header: 'CONTACTS.INDIVIDUAL.NAME', field: 'name' },
    { header: 'CONTACTS.INDIVIDUAL.COMPANY', field: 'company' },
    { header: 'CONTACTS.INDIVIDUAL.JOB_TITLE', field: 'jobTitle' },
    { header: 'CONTACTS.INDIVIDUAL.EMAIL_ADDRESS', field: 'email' },
    { header: 'CONTACTS.INDIVIDUAL.CONTACT', field: 'contact' },
    { header: 'CONTACTS.INDIVIDUAL.STATUS', field: 'status' },
  ];
  tableData: any = [];

  // Variables
  status: any = [{ name: 'Active' }, { name: 'Inactive' }, { name: 'Prospect' }, { name: 'Suspended' }];
  expertUsers: any = [];
  searchValue: any;
  originalData: any = [];

  constructor(
    private individualService: IndividualService,
  ) { }

  ngOnInit(): void {
    this.individualService.getAllIndividuals();
    this.subscribeToGetAllIndividuals()
  }

  subscribeToGetAllIndividuals() {
    this.individualsList = this.individualService.allIndividuals.subscribe(
      (res: any) => {
        this.loading = false;
        this.tableData = [];
        this.expertUsers = _.filter(res.results, (item) => item.primaryDetails && item.primaryDetails.companyName === this.ownCompany);
        _.forEach(this.expertUsers, (item: any) => {
          const obj = {
            id: item.id,
            name: this.getName(item),
            company: item.primaryDetails.companyName,
            jobTitle: item.primaryDetails.jobTitle,
            email: (item.addresses.length > 0) ? item.addresses[0].primaryEmail : '',
            contact: (item.addresses.length > 0) ? item.addresses[0].primaryPhone : '',
            status: (item.primaryDetails.status) ? item.primaryDetails.status : this.status[0].name,
            actualData: item
          }
          this.tableData.push(obj);
        });
        this.originalData = _.cloneDeep(this.tableData);
      }
    );
  }

  getName(i: any) {
    return `${(i.primaryDetails.firstName) ? i.primaryDetails.firstName : ''} ${(i.primaryDetails.lastName) ? i.primaryDetails?.lastName : ''}`
  }

  addNewUser() {

  }

  searchResults(event: any) {
    this.searchValue = this.searchValue.toLowerCase();
    this.tableData = (this.searchValue) ? _.filter(this.originalData, (obj) => _.includes(obj.name.toLowerCase(), this.searchValue) || _.includes(obj.company.toLowerCase(), this.searchValue)) : this.originalData;
  }

}
