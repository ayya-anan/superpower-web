import { ViewEncapsulation } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IndividualService } from 'src/app/api/contacts/individuals.service';
import { OrganizationService } from 'src/app/api/contacts/organization.service';

@Component({
    templateUrl: './individual.component.html',
    styleUrls: ['./individual.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class IndividualComponent implements OnInit {

    // Subscription
    individualsList: any = Subscription;
    addIndividuals: any = Subscription;
    organizationSubscription: any = Subscription;

    // Variables
    originalData: any = [];
    searchValue: any;
    loading: boolean = false;
    tableData: any = [];
    contactView: boolean = false;
    showCompany: boolean = false;
    showRole: boolean = false;
    additionalDetails: boolean = false;
    editId: any;
    organizations: any = [];

    // contactForm: FormGroup = this.fb.group({});

    columns = [
        { header: 'Name', field: 'name' },
        { header: 'Company', field: 'company' },
        { header: 'Job Title', field: 'jobTitle' },
        { header: 'Email Address', field: 'email' },
        { header: 'Contact', field: 'contact' },
        { header: 'Status', field: 'status' },
        { header: 'Actions', field: 'action' }
    ];

    Salutations: any = [
        { name: 'Mr.' },
        { name: 'Ms.' },
        { name: 'Mrs.' },
        { name: 'Dr.' },
    ];

    status: any = [
        { name: 'Prospect' },
        { name: 'Active' },
        { name: 'Inactive' },
        { name: 'Suspended' }
    ];

    company: any = [
        { name: 'TeamLeader' },
        { name: 'HubSpot' },
        { name: 'Wipro' },
    ];

    roles: any = [
        { name: 'Decision Maker' },
        { name: 'Advisor' },
        { name: 'Influencer' }
    ]; 

    contactForm = new FormGroup({
        salutation: new FormControl(),
        firstname: new FormControl("", [Validators.required]),
        middlename: new FormControl("", [Validators.required]),
        lastname: new FormControl("", [Validators.required]),
        status: new FormControl(),
        emailAddress: new FormControl(),
        alternateEmailAddress: new FormControl(),
        primaryContact: new FormControl(),
        alternateContact: new FormControl(),
        address: new FormControl(),
        city: new FormControl(),
        country: new FormControl(),
        zipCode: new FormControl(),
        jobtitle: new FormControl(),
        companyname: new FormControl(),
        rolename: new FormControl()
    });

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private individualService: IndividualService,
        private organizationService: OrganizationService
    ) { }

    ngOnInit() {
        this.organizationService.getAllOrganization();
        this.subscribeToOrgData();
        if(this.organizationService.activeOrganizationView) { 
            this.contactView = true;
            this.contactForm.patchValue({ companyname: {name: this.organizationService.organizationDetails.primaryDetails.name} });
        }
        this.loading = true;
        this.individualService.getAllIndividuals();
        this.subscribeToGetAllIndividuals();
        this.subscribeToAddIndividuals();
        this.subscribeToUpdateIndividuals();
    }

    subscribeToOrgData() {
        this.organizationService.allOrganization.subscribe(
            (res: any) => {
                console.log(res.results);
                this.organizations = [];
                // this.organizations = res.results;
                this.organizations = _.map(res.results, (i) => {
                    return { name: i.primaryDetails.name }
                });
            });
    }

    subscribeToGetAllIndividuals() {
        this.individualsList = this.individualService.allIndividuals.subscribe(
            (res: any) => {
                this.loading = false;
                this.tableData = [];
                _.forEach(res.results, (item: any) => {
                    const obj = {
                        id: item.id,
                        salutation: item.personalDetails.salutation,
                        firstname: item.personalDetails.firstName,
                        middlename: item.personalDetails.middleName,
                        lastname: item.personalDetails.lastName,
                        status: (item.personalDetails.status) ? item.personalDetails.status : 'Active',
                        name:  (item.personalDetails.firstName && item.personalDetails.lastName) ? `${item.personalDetails.firstName} ${item.personalDetails.lastName}` : (item.personalDetails.firstName) ? item.personalDetails.firstName : (item.personalDetails.lastName) ? item.personalDetails.lastName : '',
                        email: item.emailAddresses[0],
                        contact: (item.phones.length > 0) ? item.phones[0].phoneNumber : '',
                        address: (item.addresses.length > 0) ? item.addresses[0].streetName : '',
                        city: (item.addresses.length > 0) ? item.addresses[0].city : '',
                        country: (item.addresses.length > 0) ? item.addresses[0].country : '',
                        zipCode: (item.addresses.length > 0) ? item.addresses[0].zipCode : '',
                        company: (item.professionalDetails) ? item.professionalDetails.companyName : '',
                        jobTitle: (item.professionalDetails) ? item.professionalDetails.jobTitle : '',
                        roleName: (item.professionalDetails) ? item.professionalDetails.roleName : '',
                    }
                    this.tableData.push(obj);
                });
                this.originalData = _.cloneDeep(this.tableData);
            }
        );
    }

    subscribeToAddIndividuals() {
        this.addIndividuals = this.individualService.addIndividuals.subscribe(
            (res: any) => {
                if (res.error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: res.error.message });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Contact Added Successfully' });
                    this.contactView = false;
                    this.individualService.getAllIndividuals();
                    if(this.organizationService.activeOrganizationView) {
                        this.router.navigateByUrl('/contacts/organizations');
                    }
                }
            }
        );
    }

    subscribeToUpdateIndividuals() {
        this.addIndividuals = this.individualService.updateIndividual.subscribe(
            (res: any) => {
                if (res.error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: res.error.message });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Contact Updated Successfully' });
                    this.contactView = false;
                    this.individualService.getAllIndividuals();
                }
            }
        );
    }

    searchResults(event: any) {
        this.searchValue = this.searchValue.toLowerCase();        
        this.tableData = (this.searchValue) ? _.filter(this.originalData, (obj) => _.includes(obj.name.toLowerCase(), this.searchValue) || _.includes(obj.company.toLowerCase(), this.searchValue)) : this.originalData;
    }

    addAdditionalAddress() {

    }

    addContact() {
        this.contactView = true;
    }

    showContent() {
        this.additionalDetails = true;
    }

    clearDetails() {
        this.contactForm.reset();
    }

    onSubmit() {
        console.log(this.contactForm.value);
        const result = this.contactForm.value;
        const obj = {
            personalDetails: {
                salutation: (result.salutation) ? result.salutation.name : this.Salutations[0].name,
                firstName: result.firstname,
                middleName: result.middlename,
                lastName: result.lastname,
                status: (result.status) ? result.status.name : this.status[0].name
            },
            professionalDetails: {
                jobTitle: (result.jobtitle) ? (result.jobtitle.name) ? result.jobtitle.name : result.jobtitle :  '',
                companyName: (result.companyname) ? (result.companyname.name) ? result.companyname.name:  result.companyname : '',
                roleName: (result.rolename) ? (result.rolename.name) ? result.rolename.name: result.rolename : '',
            },
            addresses: [
                {
                    type: "home",
                    streetNumber: "125",
                    streetName: result.address,
                    // city: result.city,
                    country: result.country,
                    // county: "active",
                    zipCode: result.zipCode
                }
            ],
            phones: [{ type: "personal", phoneNumber: result.primaryContact }],
            emailAddresses: [result.emailAddress],
            // socialMediaLinks: [{ "type": "linkedin", "url": "https://www.linkedin.com/in/jerinjjose/" }],
        }
        if (this.editId) {
            this.individualService.updateIndividuals(obj, this.editId);
        } else {
            this.individualService.postIndividuals(obj);
        }
    }

    showCompanyDetails() {
        this.contactForm.patchValue({ companyname: '' });
        this.showCompany = !this.showCompany;
    }

    showRoleDetails() {
        this.contactForm.patchValue({ rolename: '' });
        this.showRole = !this.showRole;
    }

    editData(event: any) {
        this.editId = event.rowData.id;
        this.contactForm.reset();
        this.contactView = true;
        const result = event.rowData;
        this.showCompany = (_.findIndex(this.company, (obj: any) => obj.name === result.company) == -1) ? true : false;
        this.showRole = (_.findIndex(this.roles, (obj: any) => obj.name === result.roleName) == -1) ? true : false;
        this.contactForm.patchValue({
            salutation: { name: result.salutation },
            firstname: result.firstname,
            middlename: result.middlename,
            lastname: result.lastname,
            status: { name: result.status },
            emailAddress: result.email,
            primaryContact: result.contact,
            address: result.address,
            // city: result.city,
            country: result.country,
            zipCode: result.zipCode,
            jobtitle: { name: result.jobTitle } ,
            companyname: { name: result.company },
            rolename: { name: 'Influencer' }
        });
    }

    delete(event: any) {
        this.confirmationService.confirm({
            header: 'Confirmation',
            message: `Are you sure you want to delete ${event.rowData.name}.`,
            acceptIcon: 'pi pi-check mr-2',
            rejectIcon: 'pi pi-times mr-2',
            rejectButtonStyleClass: 'p-button-sm',
            acceptButtonStyleClass: 'p-button-outlined p-button-sm',
            accept: () => {
                this.individualService.deleteIndividuals(event.rowData.id);
                this.individualService.deleteIndividual.subscribe(
                    (res: any) => {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Contact Deleted Successfully' });
                        this.individualService.getAllIndividuals();
                    }
                );
            },
        });
    }

}
