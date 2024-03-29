import { ViewEncapsulation } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import * as _ from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IndividualService } from 'src/app/api/contacts/individuals.service';
import { OrganizationService } from 'src/app/api/contacts/organization.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { IndividualsAPI } from 'src/app/api/contacts/individualsApi.service';

@Component({
    templateUrl: './individual.component.html',
    styleUrls: ['./individual.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class IndividualComponent implements OnInit, OnDestroy {

    // Subscription
    individualsList: any = Subscription;
    addIndividuals: any = Subscription;
    updateIndividuals: any = Subscription;
    organizationSubscription: any = Subscription;
    langChangeSubscription: any = Subscription;

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

    Salutations = [
        { label: this.translate.instant('DROPDOWNS.MR'), name: 'Mr' },
        { label: this.translate.instant('DROPDOWNS.MS'), name: 'Ms' },
        { label: this.translate.instant('DROPDOWNS.MRS'), name: 'Mrs' },
        { label: this.translate.instant('DROPDOWNS.DR'), name: 'Dr' }
    ];

    status: any = [
        { label: this.translate.instant('DROPDOWNS.ACTIVE'), name: 'Active' },
        { label: this.translate.instant('DROPDOWNS.INACTIVE'), name: 'Inactive' },
        { label: this.translate.instant('DROPDOWNS.PROSPECT'), name: 'Prospect' },
        { label: this.translate.instant('DROPDOWNS.SUSPENDED'), name: 'Suspended' }
    ];
    company: any = [];
    roles: any = [
        { label: this.translate.instant('DROPDOWNS.ADVISOR'), name: 'Advisor' },
        { label: this.translate.instant('DROPDOWNS.DECISIONMAKER'), name: 'Decision Maker' },
        { label: this.translate.instant('DROPDOWNS.INFLUENCER'), name: 'Influencer' }
    ];

    languageMapper: any = {
        "Active" : "Aktiv",
        "Inactive": "Inaktiv",
        "Prospect": "Prospect",
        "Suspended": "Suspended"
    }


    constructor(
        private fb: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private individualService: IndividualService,
        public keycloakService: KeycloakService,
        private organizationService: OrganizationService,
        private translate: TranslateService,
        private individualsAPI: IndividualsAPI
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
        this.subscribeToLangulaeChange();
    }

    subscribeToLangulaeChange() {
        this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.Salutations = [
                { label: this.translate.instant('DROPDOWNS.MR'), name: 'Mr' },
                { label: this.translate.instant('DROPDOWNS.MS'), name: 'Ms' },
                { label: this.translate.instant('DROPDOWNS.MRS'), name: 'Mrs' },
                { label: this.translate.instant('DROPDOWNS.DR'), name: 'Dr' }
            ];
            this.status = [
                { label: this.translate.instant('DROPDOWNS.ACTIVE'), name: 'Active' },
                { label: this.translate.instant('DROPDOWNS.INACTIVE'), name: 'Inactive' },
                { label: this.translate.instant('DROPDOWNS.PROSPECT'), name: 'Prospect' },
                { label: this.translate.instant('DROPDOWNS.SUSPENDED'), name: 'Suspended' }
            ];
            this.roles = [
                { label: this.translate.instant('DROPDOWNS.ADVISOR'), name: 'Advisor' },
                { label: this.translate.instant('DROPDOWNS.DECISIONMAKER'), name: 'Decision Maker' },
                { label: this.translate.instant('DROPDOWNS.INFLUENCER'), name: 'Influencer' }
            ];
        });

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
                        status: (item.primaryDetails.status) ? this.languageMapper[item.primaryDetails.status] : this.languageMapper["Active"],
                        statusBadge: (item.primaryDetails.status) ? item.primaryDetails.status : this.status[0].name,
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
                    this.messageService.add({ severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: res.error.message });
                } else {
                    this.messageService.add({ severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: this.translate.instant('MESSAGES.ADDMESSAGE')  });
                    this.contactView = false;
                    this.individualService.getAllIndividuals();
                }
            }
        );
    }

    subscribeToUpdateIndividuals() {
        this.updateIndividuals = this.individualService.updateIndividual.subscribe(
            (res: any) => {
                if (res.error) {
                    this.messageService.add({ severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: res.error.message });
                } else {
                    this.messageService.add({ severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: this.translate.instant('MESSAGES.UPDATEMESSAGE') });
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
                roleName: [{ value:'PLACEHOLDERS.ROLE' }]
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
        this.editId = '';
        this.contactView = true;
        this.contactForm.reset();
        this.initForm();
    }

    onSubmit() {

    }

    saveIndividuals() {
        const result = this.contactForm.value;
        if (result.primaryDetails) {
            result.primaryDetails.salutation = (_.isObject(result.primaryDetails.salutation)) ? result.primaryDetails.salutation.name : result.primaryDetails.salutation;
            result.primaryDetails.status = (_.isObject(result.primaryDetails.status)) ? result.primaryDetails.status.name : result.primaryDetails.status;
            result.primaryDetails.companyName = (_.isObject(result.primaryDetails.companyName)) ? result.primaryDetails.companyName.name : result.primaryDetails.companyName;
            result.primaryDetails.jobTitle = (_.isObject(result.primaryDetails.jobTitle)) ? result.primaryDetails.jobTitle.name : result.primaryDetails.jobTitle;
            result.primaryDetails.roleName = (_.isObject(result.primaryDetails.roleName)) ? result.primaryDetails.roleName.name : result.primaryDetails.roleName;
        }
        if (this.editId) {
            this.individualService.updateIndividuals(result, this.editId);
        } else {
            if(this.organizationService.activeOrganizationView) {
                this.individualsAPI.postIndividual(result).subscribe(
                    (res: any) => {
                        this.router.navigateByUrl('/contacts/organizations');
                    });
            } else{
                this.individualService.postIndividuals(result);
            }
        }
    }

    closePanel() {
        this.contactForm.reset();
        this.editId = '';
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
        // this.contactForm.get('primaryDetails.roleName')?.patchValue({ name: result.primaryDetails.roleName });
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
            header: `${this.translate.instant('MESSAGES.CONFIRMATIONHEADER')}`,
            message: `${this.translate.instant('MESSAGES.CONFIRMDELETE')} ${event.rowData.name}.`,
            acceptIcon: 'pi pi-check mr-2',
            rejectIcon: 'pi pi-times mr-2',
            rejectButtonStyleClass: 'p-button-sm',
            acceptButtonStyleClass: 'p-button-outlined p-button-sm',
            accept: () => {
                this.individualService.deleteIndividuals(event.rowData.id);
                this.individualService.deleteIndividual.subscribe(
                    (res: any) => {
                        this.messageService.add({ severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: this.translate.instant('MESSAGES.DELETEMESSAGE') });
                        this.individualService.getAllIndividuals();
                    }
                );
            },
        });
    }

    ngOnDestroy() {
        if(this.addIndividuals) { this.addIndividuals.unsubscribe(); }
        if(this.updateIndividuals) { this.updateIndividuals.unsubscribe(); }
        if(this.individualsList) { this.individualsList.unsubscribe(); }
    }

}
