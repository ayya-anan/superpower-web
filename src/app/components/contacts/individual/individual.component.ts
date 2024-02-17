import { ViewEncapsulation } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
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
    allIndividuals: any = [];
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
    copyAddressBtn: boolean = false;

    ownCompany = 'Expert People Management GmbH';

    //Form Groups
    contactForm: FormGroup = this.fb.group({});
    addresses: FormArray = this.fb.array([]);

    columns = [
        { header: 'CONTACTS.INDIVIDUAL.NAME', field: 'name' },
        { header: 'CONTACTS.INDIVIDUAL.COMPANY', field: 'company' },
        { header: 'CONTACTS.INDIVIDUAL.JOB_TITLE', field: 'jobTitle' },
        { header: 'CONTACTS.INDIVIDUAL.EMAIL_ADDRESS', field: 'email' },
        { header: 'CONTACTS.INDIVIDUAL.CONTACT', field: 'contact' },
        { header: 'CONTACTS.INDIVIDUAL.STATUS', field: 'status' },

    ];
    Salutations: any = [
        { label: 'DROPDOWNS.MR', name: 'Mr' },
        { label: 'DROPDOWNS.MS', name: 'Ms' },
        { label: 'DROPDOWNS.MRS', name: 'Mrs' },
        { label: 'DROPDOWNS.DR', name: 'Dr' }
    ];
    status: any = [
        { label: 'DROPDOWNS.ACTIVE', name: 'Active' },
        { label: 'DROPDOWNS.INACTIVE', name: 'Inactive' },
        { label: 'DROPDOWNS.PROSPECT', name: 'Prospect' },
        { label: 'DROPDOWNS.SUSPENDED', name: 'Suspended' }
    ];
    company: any = [];
    roles: any = [
        { label: 'DROPDOWNS.ADVISOR', name: 'Advisor' },
        { label: 'DROPDOWNS.DECISIONMAKER', name: 'Decision Maker' },
        { label: 'DROPDOWNS.INFLUENCER', name: 'Influencer' }
    ];


    constructor(
        private fb: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private individualService: IndividualService,
        public keycloakService: KeycloakService,
        private organizationService: OrganizationService
    ) { }

    ngOnInit() {
        if (this.keycloakService.isUserInRole('edit-individual')) {
            this.columns.push({ header: 'CONTACTS.INDIVIDUAL.ACTIONS', field: 'action' })
        }
        this.initForm();
        this.initiateAddressArray();
        this.loading = true;
        this.individualService.getAllIndividuals();
        this.organizationService.getAllOrganization();
        this.subscribeToOrgData();
        if (this.organizationService.activeOrganizationView) {
            this.contactView = true;
            this.contactForm.get('primaryDetails.companyName')?.patchValue({ name: this.organizationService.organizationDetails.primaryDetails.name });
            this.copyAddressBtn = true;
        }
        this.subscribeToGetAllIndividuals();
        this.subscribeToAddIndividuals();
        this.subscribeToUpdateIndividuals();
    }

    subscribeToOrgData() {
        this.organizationService.allOrganization.subscribe(
            (res: any) => {
                console.log(res.results);
                this.organizations = [];
                this.organizations = _.sortBy(_.map(res.results, (i) => { return { name: i.primaryDetails.name } }), 'name');
            });
    }

    getName(i: any) {
        return `${(i.primaryDetails.firstName) ? i.primaryDetails.firstName : ''} ${(i.primaryDetails.lastName) ? i.primaryDetails?.lastName : ''}`
    }

    subscribeToGetAllIndividuals() {
        this.individualsList = this.individualService.allIndividuals.subscribe(
            (res: any) => {
                this.loading = false;
                this.tableData = [];
                this.allIndividuals = _.filter(res.results, (item) => item.primaryDetails && item.primaryDetails.companyName != this.ownCompany);
                this.company = _.sortBy(_.uniqBy(_.map(this.allIndividuals, (i) => { return { name: i.primaryDetails.jobTitle } }), 'name'), 'name');
                _.forEach(this.allIndividuals, (item: any) => {
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

    subscribeToAddIndividuals() {
        this.addIndividuals = this.individualService.addIndividuals.subscribe(
            (res: any) => {
                if (res.error) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: res.error.message });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Contact Added Successfully' });
                    this.contactView = false;
                    this.individualService.getAllIndividuals();
                    setTimeout(() => {
                        if (this.organizationService.activeOrganizationView) {
                            this.router.navigateByUrl('/contacts/organizations');
                        }
                    }, 500);
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

    copyAddress() {
        const result = this.organizationService.organizationDetails?.facilities[0];
        this.contactForm.value.addresses[0].address = result.address;
        this.contactForm.value.addresses[0].zipCode = result.zipCode;
        this.contactForm.value.addresses[0].country = result.country;
        this.contactForm.get('addresses')?.patchValue(this.contactForm.value.addresses);
    }

    initForm() {
        this.contactForm = this.fb.group({
            primaryDetails: this.fb.group({
                salutation: [{ value:'PLACEHOLDERS.SALUTATION' }],
                firstName: new FormControl("", [Validators.required]),
                middleName: new FormControl(""),
                lastName: new FormControl("", [Validators.required]),
                status: [{ value:'PLACEHOLDERS.PROSPECT' }],
                jobTitle: [''],
                companyName: [''],
                roleName: ['Influencer']
            }),
            addresses: this.addresses,
        });
    }

    initiateAddressArray() {
        const addresses = this.contactForm.get('addresses') as FormArray;
        addresses.push(this.fb.group({
            primaryEmail: [''],
            alternateEmail: [''],
            primaryPhone: [''],
            alternatePhone: [''],
            address: [''],
            zipCode: [''],
            country: 'Germany'
        }));
    }

    searchResults(event: any) {
        this.searchValue = this.searchValue.toLowerCase();
        this.tableData = (this.searchValue) ? _.filter(this.originalData, (obj) => _.includes(obj.name.toLowerCase(), this.searchValue) || _.includes(obj.company.toLowerCase(), this.searchValue)) : this.originalData;
    }

    addContact() {
        this.contactView = true;
        this.contactForm.reset();
        this.initForm();
    }

    onSubmit() {

    }

    saveIndividuals() {
        const result = this.contactForm.value;
        if (result.primaryDetails) {
            result.primaryDetails.companyName = (_.isObject(result.primaryDetails.companyName)) ? result.primaryDetails.companyName.name : result.primaryDetails.companyName;
            result.primaryDetails.jobTitle = (_.isObject(result.primaryDetails.jobTitle)) ? result.primaryDetails.jobTitle.name : result.primaryDetails.jobTitle;
            result.primaryDetails.roleName = (_.isObject(result.primaryDetails.roleName)) ? result.primaryDetails.roleName.name : result.primaryDetails.roleName;
        }
        if (this.editId) {
            this.individualService.updateIndividuals(result, this.editId);
        } else {
            this.individualService.postIndividuals(result);
        }
    }

    closePanel() {
        this.contactForm.reset();
        this.contactView = false;
    }

    editData(event: any) {
        this.editId = event.rowData.id;
        this.contactForm.reset();
        this.contactView = true;
        // const result = this.allIndividuals[event.index];
        const result = event.rowData.actualData;
        // Patching the primary details
        this.contactForm.get('primaryDetails')?.patchValue(result.primaryDetails);
        this.contactForm.get('primaryDetails.companyName')?.patchValue({ name: result.primaryDetails.companyName });
        this.contactForm.get('primaryDetails.jobTitle')?.patchValue({ name: result.primaryDetails.jobTitle });
        this.contactForm.get('primaryDetails.roleName')?.patchValue({ name: result.primaryDetails.roleName });
        // Patching the Addresses form array
        const addressesFormArray = this.contactForm.get('addresses') as FormArray;
        addressesFormArray.clear();
        if (result.addresses.length > 0) { delete result.addresses[0]._id; }
        result.addresses.forEach((address: any) => {
            addressesFormArray.push(this.fb.group(address));
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
