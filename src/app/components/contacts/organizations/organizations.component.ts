import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import * as _ from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, generate } from 'rxjs';
import { IndividualService } from 'src/app/api/contacts/individuals.service';
import { IndividualsAPI } from 'src/app/api/contacts/individualsApi.service';
import { OrganizationService } from 'src/app/api/contacts/organization.service';
import { COUNTRIES_LIST } from 'src/app/constants/countries.constants';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { XService } from 'src/app/api/x/x.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class OrganizationsComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private organizationService: OrganizationService,
    private individualService: IndividualService,
    public keycloakService: KeycloakService,
    private confirmationService: ConfirmationService,
    private individualsAPI: IndividualsAPI,
    private translate: TranslateService,
    private xService: XService,
  ) { }

  organizationSubscription: Subscription = new Subscription;
  addOrganizationSubscription: Subscription = new Subscription;
  individualSubscription: Subscription = new Subscription;
  updateOrganizations: Subscription = new Subscription;
  deleteOrganizations: Subscription = new Subscription;
  langChangeSubscription: Subscription = new Subscription;

  searchValue: any;
  originalData: any = [];
  loading: boolean = false;
  organizationView: boolean = false;
  additionalDetails: boolean = false;
  addDetails: boolean = false;
  companyAverge: number = 1500;
  tinoAverage: number = 500;
  countries = _.cloneDeep(COUNTRIES_LIST);
  pocTableData: any = [];
  facilitiesTable: boolean = false;
  facilitiesTableData: any = [];
  individualsData: any;
  organizationData: any;
  activeContract: boolean = false;
  allIndividuals: any = [];
  editId: any;

  // Industry Types
  industryValues: any = [];
  sections: any = [];
  industryTypes = [];
  industrySubType1: any = [];
  industrySubType2: any = [];

  value1: any;
  value2: any;

  // TABLE COLUMNS
  columns = [
    { header: 'CONTACTS.ORGANIZATIONS.NAME', field: 'name' },
    { header: 'CONTACTS.ORGANIZATIONS.STATUS', field: 'status' },
    { header: 'CONTACTS.ORGANIZATIONS.POINT_OF_CONTACT', field: 'poc' },
    { header: 'CONTACTS.ORGANIZATIONS.EMAIL_ADDRESS', field: 'email' },
    { header: 'CONTACTS.ORGANIZATIONS.CONTACT', field: 'contact' },
    { header: 'CONTACTS.ORGANIZATIONS.INDUSTRY_TYPE', field: 'type' },
    { header: 'CONTACTS.ORGANIZATIONS.SUB_TYPE', field: 'subType' },
    // { header: 'Account Manager', field: 'accountManager' },
  ];

  pocTableCols = [
    { header: 'Name', field: 'name' },
    { header: 'Email Address', field: 'email' },
    { header: 'Phone Number', field: 'phone' },
    { header: 'Job Title', field: 'jobTitle' },
  ];

  facilityCols = [
    { header: 'Type', field: 'type' },
    { header: 'Employee Count', field: 'employeeCount' },
    { header: 'Address', field: 'address' }
  ];

  paymentMilestone = [
    { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.ANNUAL'), value: 1, name: 'Annual' },
    { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.SEMI_ANNUAL'), value: 2, name: 'Semi' },
    { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.QUARTERLY'), value: 4, name: 'Quaterly' },
    { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.MONTHLY'), value: 12, name: 'Monthly' }
  ];

  tableData: any = [];
  status: any = [
    { label: this.translate.instant('DROPDOWNS.ACTIVE'), name: 'Active' },
    { label: this.translate.instant('DROPDOWNS.INACTIVE'), name: 'Inactive' },
    { label: this.translate.instant('DROPDOWNS.PROSPECT'), name: 'Prospect' },
    { label: this.translate.instant('DROPDOWNS.SUSPENDED'), name: 'Suspended' }
  ];
  revenueRange: any = [{ name: '0 to 1 Million' }, { name: '1 to 2 Million' }, { name: '2 - 5 Million' }, { name: '>5 Million' }];
  facilityType: any = [
    { label: this.translate.instant('DROPDOWNS.MANUFACTURING_PLANT'), name: 'Manufacturing Plant' },
    { label: this.translate.instant('DROPDOWNS.OFFICE'), name: 'Office' },
    { label: this.translate.instant('DROPDOWNS.WAREHOUSE'), name: 'Warehouse' }];
  serviceList: any = [
    { label: this.translate.instant('DROPDOWNS.BASIC_CARE'), name: 'Basic Care', unitRate: 52 },
    { label: this.translate.instant('DROPDOWNS.EXTERNAL_AUDIT'), name: 'External Audit', unitRate: 96 },
    { label: this.translate.instant('DROPDOWNS.INTERNAL_AUDIT'), name: 'Internal Audit', unitRate: 20 },
    { label: this.translate.instant('DROPDOWNS.SPECIAL_CARE'), name: 'Special Care', unitRate: 89 }
  ];

  // FORM GROUPS
  organizationForm: FormGroup = this.fb.group({});
  facilities: FormArray = this.fb.array([]);
  addresses: FormArray = this.fb.array([]);
  services: FormArray = this.fb.array([]);

  // LanguageMapper 
  languageMapper: any = {
    "Active": "Aktiv",
    "Inactive": "Inaktiv",
    "Prospect": "Potenzieller Kunde",
    "Suspended": "Ausgesetzt",
    "Manufacturing Plant": "Produktionsstätte",
    "Office": "Büro",
    "Warehouse": "Lager",
    "Basic Care": "Grundversorgung",
    "External Audit": "Externe Prüfung",
    "Internal Audit": "Interne Anhörung",
    "Special Care": "Spezialbehandlung"
  }

  ngOnInit(): void {
    this.xService.getAllX('WZCode').subscribe(
      (res: any) => {
        this.industryValues = res.results[2].data;
        this.sections = this.industryValues;
      });
    this.subscribeToGetAllIndividuals();
    this.initForm();
    this.loading = true;
    this.subscribeToGetAllOrganization();
    this.subscribeToAddOrganization();
    this.subscribeToUpdateOrganizations();
    this.subscribeToDeleteOrg();
    if (this.keycloakService.isUserInRole('edit-organization')) {
      this.columns.splice(5, 0, { header: 'CONTACTS.ORGANIZATIONS.ACTIONS', field: 'action' });
    }
    this.subscribeToLangulaeChange();
  }

  organizationDetails() {
    if (this.organizationService.activeOrganizationView) {
      this.organizationView = true;
      this.editId = this.organizationService.organizationDetails.orgIdValue;
      this.addPOCDetails(this.organizationService.organizationDetails.primaryDetails.name);
      this.organizationService.organizationDetails.primaryDetails['pointofContact'] = this.pocTableData;
      this.pocTableData = [...this.pocTableData];
      this.updateIndustryDetails(this.organizationService.organizationDetails.primaryDetails);
      this.organizationForm.get('primaryDetails')?.patchValue(this.organizationService.organizationDetails.primaryDetails);
      // Patching the facilities form array
      const facilitiesFormArray = this.organizationForm.get('facilities') as FormArray;
      facilitiesFormArray.clear(); // Clear existing controls if any
      this.organizationService.organizationDetails.facilities.forEach((facility: any) => {
        facilitiesFormArray.push(this.fb.group(facility));
      });
      // Patching the services form array
      const servicesFormArray = this.organizationForm.get('services') as FormArray;
      servicesFormArray.clear(); // Clear existing controls if any
      this.organizationService.organizationDetails.services.forEach((service: any) => {
        service.companyAverage = { value: 0, disabled: true }
        servicesFormArray.push(this.fb.group(service));
      });
      this.organizationService.activeOrganizationView = false;
    }
  }

  subscribeToLangulaeChange() {
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.paymentMilestone = [
        { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.ANNUAL'), value: 1, name: 'Annual' },
        { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.SEMI_ANNUAL'), value: 2, name: 'Semi' },
        { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.QUARTERLY'), value: 4, name: 'Quaterly' },
        { label: this.translate.instant('LEAD_MANAGEMENT.DEALS.MONTHLY'), value: 12, name: 'Monthly' }
      ];
      this.status = [
        { label: this.translate.instant('DROPDOWNS.ACTIVE'), name: 'Active' },
        { label: this.translate.instant('DROPDOWNS.INACTIVE'), name: 'Inactive' },
        { label: this.translate.instant('DROPDOWNS.PROSPECT'), name: 'Prospect' },
        { label: this.translate.instant('DROPDOWNS.SUSPENDED'), name: 'Suspended' }
      ];
      this.facilityType = [
        { label: this.translate.instant('DROPDOWNS.MANUFACTURING_PLANT'), name: 'Manufacturing Plant' },
        { label: this.translate.instant('DROPDOWNS.OFFICE'), name: 'Office' },
        { label: this.translate.instant('DROPDOWNS.WAREHOUSE'), name: 'Warehouse' }];
      this.serviceList = [
        { label: this.translate.instant('DROPDOWNS.BASIC_CARE'), name: 'Basic Care', unitRate: 52, germanVersion: 'Grundversorgung' },
        { label: this.translate.instant('DROPDOWNS.EXTERNAL_AUDIT'), name: 'External Audit', unitRate: 96, germanVersion: 'Externe Prüfung' },
        { label: this.translate.instant('DROPDOWNS.INTERNAL_AUDIT'), name: 'Internal Audit', unitRate: 20, germanVersion: 'Interne Anhörung' },
        { label: this.translate.instant('DROPDOWNS.SPECIAL_CARE'), name: 'Special Care', unitRate: 89, germanVersion: 'Spezialbehandlung' }
      ];
    });
  }

  subscribeToGetAllOrganization() {
    this.organizationSubscription = this.organizationService.allOrganization.subscribe(
      (res: any) => {
        this.loading = false;
        this.tableData = [];
        this.organizationData = res.results;
        _.forEach(res.results, (item: any) => {
          const pocDetails = _.filter(this.allIndividuals, (obj) => obj.primaryDetails.companyName.toLowerCase() === item.primaryDetails.name.toLowerCase());
          const obj: any = {
            id: item.id,
            name: item.primaryDetails.name,
            type: item.primaryDetails.industryType.Name,
            subType: item.primaryDetails.subType1.Name,
            statusBadge: item.primaryDetails.status,
            status: (item.primaryDetails.status) ? this.languageMapper[item.primaryDetails.status] : this.languageMapper["Active"],
            email: (pocDetails.length > 0 && pocDetails[0].addresses.length > 0) ? pocDetails[0].addresses[0].primaryEmail : '',
            contact: (pocDetails.length > 0 && pocDetails[0].addresses.length > 0) ? pocDetails[0].addresses[0].primaryPhone : '',
            poc: (pocDetails.length > 0) ? `${pocDetails[0].primaryDetails.firstName} ${pocDetails[0].primaryDetails.lastName}` : '',
            accountManager: item.primaryDetails.accountManager,
            actualData: item
          }
          this.tableData.push(obj);
        });
        this.originalData = _.cloneDeep(this.tableData);
        this.tableData = [...this.tableData];
      }
    );
  }

  subscribeToGetAllIndividuals() {
    this.individualsAPI.getIndividuals().subscribe(
      (res: any) => {
        this.allIndividuals = res.results;
        const accountManagers: any = _.filter(res.results, (obj) => obj.primaryDetails.jobTitle === 'Account Manager' && obj.primaryDetails.companyName === 'Expert People Management GmbH');
        this.individualsData = _.sortBy(_.map(accountManagers, (i) => { return { name: `${i.primaryDetails.firstName} ${i.primaryDetails.lastName}`, id: i.id } }), 'name');
        this.organizationService.getAllOrganization();
        if (this.organizationService.activeOrganizationView) {
          this.organizationDetails();
        }
      }
    );
  }

  subscribeToAddOrganization() {
    this.addOrganizationSubscription = this.organizationService.addOrganization.subscribe(
      (res: any) => {
        this.messageService.clear();
        if (res.error) {
          this.messageService.add({ severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: res.error.message });
        } else {
          this.messageService.add({ severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: this.translate.instant('MESSAGES.ORGADDMESSAGE') });
          this.organizationService.getAllOrganization();
          this.organizationView = false;
        }
      }
    );
  }

  subscribeToUpdateOrganizations() {
    this.updateOrganizations = this.organizationService.updateOrganizationEmit.subscribe(
      (res: any) => {
        this.messageService.clear();
        if (res.error) {
          this.messageService.add({ severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: res.error.message });
        } else {
          this.messageService.add({ severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: this.translate.instant('MESSAGES.ORGUPDATEMSG') });
          this.organizationView = false;
          this.organizationService.getAllOrganization();
        }
      }
    );
  }

  subscribeToDeleteOrg() {
    this.deleteOrganizations = this.organizationService.deleteOrganizationEmit.subscribe(
      (res: any) => {
        this.messageService.add({ severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: this.translate.instant('MESSAGES.ORGDELETEMSG') });
        this.organizationService.getAllOrganization();
      }
    );
  }

  getID() {
    return 'Expert_16'
  }

  initForm() {
    this.organizationForm = this.fb.group({
      primaryDetails: this.fb.group({
        orgId: '',
        name: ['', [Validators.required]],
        pointofContact: [''],
        accountManager: [''],
        status: ['Prospect'],
        section: '',
        industryType: '',
        subType1: '',
        subType2: '',
        revenueRange: [''],
        invoiceFrequency: '',
        startDate: '',
        endDate: '',
        customerSince: ''
      }),
      facilities: this.facilities,
      services: this.services,
    });
    this.initFacilitiesArray(); // Initialize facilities array
    this.initServicesArray(); // Initialize Services array
  }

  // Helper methods to initialize form arrays
  initFacilitiesArray(): void {
    const facilitiesArray = this.organizationForm.get('facilities') as FormArray;
    facilitiesArray.push(this.fb.group({
      type: ['', [Validators.required]],
      address: ['', [Validators.required]],
      employeeCount: ['', [Validators.required]],
      country: ['Germany', [Validators.required]],
      zipCode: ['', [Validators.required]],
      phoneNumber: '',
      emailAddress: '',
    }));
  }
  // Helper methods to initialize form arrays
  initServicesArray(): void {
    const servicesArray = this.organizationForm.get('services') as FormArray;
    servicesArray.push(this.fb.group({
      type: '',
      amount: 0,
      companyAverage: { value: 0, disabled: true },
      // tinoAverage: ['', [Validators.required]],
    }));
  }
  removeFacilitiesArray(index: number) {
    const facilitiesArray = this.organizationForm.get('facilities') as FormArray;
    facilitiesArray.removeAt(index)
  }
  removeServicesArray(index: number) {
    const servicesArray = this.organizationForm.get('services') as FormArray;
    servicesArray.removeAt(index)
  }

  generateId() {
    const number = Math.floor((Math.random() * 100) + 1)
    return `Expert-${number}`;
  }

  addContact() {
    this.editId = '';
    this.organizationForm.reset();
    this.organizationView = true;
    this.organizationService.organizationDetails = {};
    this.facilitiesTable = false;
    this.pocTableData = [];
    this.organizationForm.get('primaryDetails')?.patchValue({ orgId: this.generateId() });
  }

  statusChange(event: any) {
    this.activeContract = (event.value === 'Prospect') ? false : true;
  }

  onSubmit() {

  }

  saveOrgData() {
    const result = _.filter(this.organizationData, (obj) => obj.primaryDetails.name.toLowerCase() === this.organizationForm.value.primaryDetails.name.toLowerCase());
    this.organizationService.organizationDetails = {};
    this.organizationForm.value.facilities = (this.facilitiesTable) ? this.facilitiesTableData : this.facilities.value;
    _.forEach(this.organizationForm.value.facilities, (facilityObj) => {
      if (facilityObj.country === null) { facilityObj.country = 'Germany'; }
    });
    this.organizationForm.value.primaryDetails.pointofContact = this.pocTableData;
    if (this.editId) {
      this.organizationService.updateOrganization(this.organizationForm.value, this.editId);
    } else {
      if (result.length > 0) {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: this.translate.instant('ORGNAMEEXISTS') });
      } else {
        this.organizationService.postOrganization(this.organizationForm.value);
      }
    }
  }

  closePanel() {
    this.editId = '';
    this.organizationView = false;
    this.organizationForm.reset();
  }

  updateFacility() {
    this.facilitiesTable = false;
    this.initFacilitiesArray();
  }

  addFacilityTable(data: any) {
    this.facilitiesTableData = [];
    _.forEach(data, (dataObj) => {
      if (dataObj.type) {
        const obj = {
          _id: dataObj._id,
          type: (dataObj.type) ? this.languageMapper[dataObj.type] : '',
          employeeCount: dataObj.employeeCount,
          address: dataObj.address,
          country: dataObj.country,
          zipCode: dataObj.zipCode,
          phoneNumber: dataObj.phoneNumber,
          emailAddress: dataObj.emailAddress
        }
        this.facilitiesTableData.push(obj);
      }
    });
  }

  addPOCDetails(name: any) {
    this.pocTableData = [];
    const data: any = _.filter(this.allIndividuals, (obj) => (obj.primaryDetails.companyName.toLowerCase() === name.toLowerCase()));
    _.forEach(data, (dataObj: any) => {
      let obj = {
        name: `${(dataObj.primaryDetails.firstName) ? dataObj.primaryDetails.firstName : ''} ${(dataObj.primaryDetails.lastName) ? dataObj.primaryDetails?.lastName : ''}`,
        email: (dataObj.addresses.length > 0) ? dataObj.addresses[0].primaryEmail : '',
        phone: (dataObj.addresses.length > 0) ? dataObj.addresses[0].primaryPhone : '',
        jobTitle: dataObj.primaryDetails.jobTitle
      }
      this.pocTableData.push(obj);
    });
  }

  addPOC() {
    this.organizationService.activeOrganizationView = true;
    this.organizationService.organizationDetails = this.organizationForm.value;
    this.organizationService.organizationDetails['orgIdValue'] = this.editId;
    this.router.navigateByUrl('/contacts/individual');
  }

  clearIndustryDetails() {
    this.organizationForm.get('primaryDetails.industryType')?.patchValue({ name: '' });
    this.organizationForm.get('primaryDetails.subType1')?.patchValue({ name: '' });
    this.organizationForm.get('primaryDetails.subType2')?.patchValue({ name: '' });
  }

  sectionChange(event: any) {
    this.industryTypes = event.value.Children;
    this.clearIndustryDetails();
    this.industrySubType1 = [];
    this.industrySubType2 = [];
  }

  industryTypeChange(event: any) {
    this.industrySubType1 = event.value.Children;
    this.industrySubType2 = [];
    this.organizationForm.get('primaryDetails.subType1')?.patchValue({ name: '' });
  }

  industrySubTypeChange(event: any) {
    this.industrySubType2 = event.value.Children;
    this.organizationForm.get('primaryDetails.subType2')?.patchValue({ name: '' });
  }

  industrySubType2Change(event: any) {
  }

  searchResults(event: any) {
    this.searchValue = this.searchValue.toLowerCase();
    this.tableData = (this.searchValue) ? _.filter(this.originalData, (obj) => _.includes(obj.name.toLowerCase(), this.searchValue)) : this.originalData;
  }

  updateIndustryDetails(resultData: any) {
    this.sections = this.industryValues;
    this.industryTypes = (resultData.section.Children) ? resultData.section.Children : [];
    this.industrySubType1 = (resultData.industryType.Children) ? resultData.industryType.Children : [];
    this.industrySubType2 = (resultData.subType1.Children) ? resultData.subType1.Children : [];
  }

  updateDateValues(data: any) {
    data.startDate = (data.startDate) ? new Date(Date.parse(data.startDate.toString())) : '';
    data.endDate = (data.endDate) ? new Date(Date.parse(data.endDate.toString())) : '';
    data.customerSince = (data.customerSince) ? new Date(Date.parse(data.customerSince.toString())) : '';
  }

  editData(event: any) {
    this.editId = event.rowData.id;
    const updateData = event.rowData.actualData;
    this.activeContract = (updateData.primaryDetails.status != 'Prospect') ? true : false;
    this.updateIndustryDetails(updateData.primaryDetails);
    this.updateDateValues(updateData.primaryDetails);
    // Patching the primaryDetails form group
    this.organizationForm.get('primaryDetails')?.patchValue(updateData.primaryDetails);
    // Patching the facilities form array
    const facilitiesFormArray = this.organizationForm.get('facilities') as FormArray;
    facilitiesFormArray.clear(); // Clear existing controls if any
    updateData.facilities.forEach((facility: any) => {
      facilitiesFormArray.push(this.fb.group(facility));
    });
    // Patching the services form array
    const servicesFormArray = this.organizationForm.get('services') as FormArray;
    servicesFormArray.clear(); // Clear existing controls if any
    updateData.services.forEach((service: any) => {
      service.companyAverage = { value: 0, disabled: true }
      servicesFormArray.push(this.fb.group(service));
    });
    this.organizationView = true;
    this.addPOCDetails(updateData.primaryDetails.name);
    this.addFacilityTable(updateData.facilities);
    this.facilitiesTable = (this.facilitiesTableData.length > 0) ? true : false;
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
        event.data.splice(event.index, 1);
        this.organizationService.deleteOrganization(event.rowData.id);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.organizationSubscription) { this.organizationSubscription.unsubscribe(); }
    if (this.addOrganizationSubscription) { this.addOrganizationSubscription.unsubscribe(); }
    if (this.deleteOrganizations) { this.deleteOrganizations.unsubscribe(); }
    if (this.updateOrganizations) { this.updateOrganizations.unsubscribe(); }
    if (this.individualSubscription) { this.updateOrganizations.unsubscribe(); }
  }
}
