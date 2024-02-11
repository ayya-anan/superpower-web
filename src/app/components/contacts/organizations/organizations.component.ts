import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import * as _ from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, generate } from 'rxjs';
import { IndividualService } from 'src/app/api/contacts/individuals.service';
import { OrganizationService } from 'src/app/api/contacts/organization.service';
import { COUNTRIES_LIST } from 'src/app/constants/countries.constants';

@Component({
  selector: 'app-organization',
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class OrganizationsComponent implements OnInit, OnDestroy {

  organizationSubscription: Subscription = new Subscription;
  addOrganizationSubscription: Subscription = new Subscription;
  individualSubscription: Subscription = new Subscription;
  updateOrganizations: Subscription = new Subscription;

  searchValue: any;
  originalData: any = [];
  loading: boolean = false;
  organizationView: boolean = false;
  additionalDetails: boolean = false;
  addDetails: boolean = false;
  companyAverge: number = 1500;
  tinoAverage: number = 500;
  countries = COUNTRIES_LIST;
  pocTableData: any = [];
  facilitiesTable: boolean = false;
  facilitiesTableData: any = [];
  individualsData: any;
  organizationData: any;
  activeContract: boolean = false;
  allIndividuals: any = [];
  editId: any;

  // Industry Types
  sections: any = [];
  industryTypes = [];
  industrySubType1: any = [];
  industrySubType2: any = [];

  value1: any;
  value2: any;

  // TABLE COLUMNS
  columns = [
    { header: 'CONTACTS.ORGANIZATIONS.NAME', field: 'name' },
    { header: 'CONTACTS.ORGANIZATIONS.INDUSTRY_TYPE', field: 'type' },
    { header: 'CONTACTS.ORGANIZATIONS.SUB_TYPE', field: 'subType' },
    { header: 'CONTACTS.ORGANIZATIONS.EMAIL_ADDRESS', field: 'email' },
    { header: 'CONTACTS.ORGANIZATIONS.CONTACT', field: 'contact' },
    { header: 'CONTACTS.ORGANIZATIONS.POINT_OF_CONTACT', field: 'poc' },
    // { header: 'Account Manager', field: 'accountManager' },
    { header: 'CONTACTS.ORGANIZATIONS.STATUS', field: 'status' },
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

  tableData: any = [];
  status: any = [{ name: 'Active' }, { name: 'Inactive' }, { name: 'Prospect' }, { name: 'Suspended' }];
  revenueRange: any = [{ name: '0 - 10 million' }, { name: '10 - 100 million' }, { name: '100 - 500 million' }, { name: '500 - 1 billion' }];
  facilityType: any = [{ name: 'Manufacturing Plant' }, { name: 'Office' }, { name: 'Warehouse' }];
  serviceList: any = [
    { name: 'Basic Care', unitRate: 52 },
    { name: 'External Audit', unitRate: 96 },
    { name: 'Internal Audit', unitRate: 20 },
    { name: 'Special Care', unitRate: 89 }
  ];

  industryValues: any = [
    {
      "section": [
        { name: "COUNTRY- AND FORESTRY, FISHING", code: 'sectionA' },
        { name: "MINING AND WINNING OF STONES AND EARTH", code: 'sectionB' }
      ]
    },
    {
      "sectionA": [
        { name: 'Mixed Agriculture', code: 'mixedAgriculture', value: 2.5 },
        { name: 'Forestry and Logging', code: 'forestryAndLogging' }
      ],
      "sectionB": [
        { name: 'Coal Mining', code: 'coalMining' },
        { name: 'Extraction from oil and natural gas', code: 'oilAndGas' },
        { name: 'Ore Mining', code: 'oreMining' },
        { name: 'Extraction from stones and Earth, other Mining', code: 'stonesAndEarth' },
        { name: 'Delivery from Services for the Mining and for the extraction of stones and earth', code: 'miningStonesearth' },
      ]
    },
    {
      "forestryAndLogging": [{ name: 'Forestry', code: 'forestry', value: 2.5 }, { name: 'Logging', code: 'Logging', value: 2.5 }],
      "coalMining": [{ name: 'Hard Coal Mining', code: '', value: 2.5 }, { name: 'Brown Coal Mining', code: '', value: 2.5 }],
      "oilAndGas": [{ name: 'Extraction from oil', code: '', value: 2.5 }, { name: 'Extraction from natural gas', code: '', value: 2.5 }],
      "oreMining": [{ name: 'Iron ore mining', code: '', value: 2.5 }, { name: 'Non-ferrous metal ore mining', code: '', value: 2.5 }],
      "stonesAndEarth": [
        { name: 'Extraction from natural stones, Gravel, Sand, volume and Kaolin _', code: 'naturalStones' },
        { name: 'Other Mining; extraction from stones and Earth a. n. G.\"', code: 'ANG' },
      ]
    },
    {
      "naturalStones": [
        { name: 'Extraction from Natural stones and Natural stone, limestone and gypsum stone, chalk and slate', value: 2.5 },
        { name: 'Extraction from volume and kaolin', value: 1.5 },
      ],
      "ANG": [
        { name: 'Peat extraction', value: 1.5 }
      ]
    }
  ]

  // FORM GROUPS
  organizationForm: FormGroup = this.fb.group({});
  facilities: FormArray = this.fb.array([]);
  addresses: FormArray = this.fb.array([]);
  services: FormArray = this.fb.array([]);

  constructor(private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private organizationService: OrganizationService,
    private individualService: IndividualService,
    public keycloakService: KeycloakService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.sections = this.industryValues[0].section;
    this.individualService.getAllIndividuals();
    this.initForm();
    this.loading = true;
    this.subscribeToGetAllOrganization();
    this.subscribeToAddOrganization();
    this.subscribeToUpdateOrganizations();
    this.subscribeToGetAllIndividuals();
    if (this.keycloakService.isUserInRole('edit-organization')) {
      this.columns.push({ header: 'CONTACTS.ORGANIZATIONS.ACTIONS', field: 'action' })
    }
  }

  organizationDetails() {
    if (this.organizationService.activeOrganizationView) {
      this.organizationView = true;
      this.addPOCDetails(this.organizationService.organizationDetails.primaryDetails.name);
      this.organizationService.organizationDetails.primaryDetails['pointofContact'] = this.pocTableData;
      this.pocTableData = [...this.pocTableData];
      this.organizationForm.get('primaryDetails')?.patchValue(this.organizationService.organizationDetails.primaryDetails);
      this.organizationForm.get('facilities')?.patchValue(this.organizationService.organizationDetails.facilities);
      this.organizationForm.get('services')?.patchValue(this.organizationService.organizationDetails.services);
      this.organizationService.activeOrganizationView = false;
    }
  }

  subscribeToGetAllOrganization() {
    this.organizationSubscription = this.organizationService.allOrganization.subscribe(
      (res: any) => {
        this.loading = false;
        this.tableData = [];
        this.organizationData = res.results;
        // this.organizationView = false;
        _.forEach(res.results, (item: any) => {
          const pocDetails = _.filter(this.allIndividuals, (obj) => obj.primaryDetails.companyName.toLowerCase() === item.primaryDetails.name.toLowerCase());
          const obj: any = {
            id: item.id,
            name: item.primaryDetails.name,
            type: item.primaryDetails.industryType.name,
            subType: item.primaryDetails.subType1.name,
            status: item.primaryDetails.status,
            email: (pocDetails.length > 0 && pocDetails[0].addresses.length > 0) ? pocDetails[0].addresses[0].primaryEmail : '',
            contact: (pocDetails.length > 0 && pocDetails[0].addresses.length > 0) ? pocDetails[0].addresses[0].primaryPhone : '',
            poc: (pocDetails.length > 0) ? `${pocDetails[0].primaryDetails.firstName} ${pocDetails[0].primaryDetails.lastName}` : '',
            accountManager: item.primaryDetails.accountManager,
            actualData: item
          }
          this.tableData.push(obj);
        });
        this.originalData = _.cloneDeep(this.tableData);
      }
    );
  }

  subscribeToGetAllIndividuals() {
    this.individualSubscription = this.individualService.allIndividuals.subscribe(
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.error.message });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Organization Added Successfully' });
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.error.message });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Organization Updated Successfully' });
          this.organizationView = false;
          this.organizationService.getAllOrganization();
        }
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
      companyAverage: 0,
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
    const result = _.filter(this.organizationData, (obj) => obj.primaryDetails.name.toLowerCase() === this.organizationForm.value.primaryDetails.name.toLowerCase());
    // if (this.organizationForm.valid) {
    console.log(this.organizationForm.value.primaryDetails);
    this.organizationService.organizationDetails = {};

    console.log(this.organizationForm.value.primaryDetails);
    this.organizationForm.value.facilities = (this.facilitiesTable) ? this.facilitiesTableData : this.facilities.value;
    _.forEach(this.organizationForm.value.facilities, (facilityObj) => {
      delete facilityObj['_id'];
    });
    _.forEach(this.organizationForm.value.services, (serviceObj) => {
      delete serviceObj['_id'];
    });
    this.organizationForm.value.primaryDetails.pointofContact = this.pocTableData;
    if (this.editId) {
      this.organizationService.updateOrganization(this.organizationForm.value, this.editId);
    } else {
      if (result.length > 0) {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Organization Name Already Exists' });
      } else {
        this.organizationService.postOrganization(this.organizationForm.value);
      }
    }
    // }
  }

  updateFacility() {
    this.facilitiesTable = false;
    this.initFacilitiesArray();
  }

  addFacilityTable(data: any) {
    this.facilitiesTableData = [];
    _.forEach(data, (dataObj) => {
      const obj = {
        type: dataObj.type,
        employeeCount: dataObj.employeeCount,
        address: dataObj.address,
        country: dataObj.country,
        zipCode: dataObj.zipCode,
        phoneNumber: dataObj.phoneNumber,
        emailAddress: dataObj.emailAddress
      }
      this.facilitiesTableData.push(obj);
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
    this.router.navigateByUrl('/contacts/individual');
  }

  clearIndustryDetails() {
    this.organizationForm.get('primaryDetails.industryType')?.patchValue({ name: '' });
    this.organizationForm.get('primaryDetails.subType1')?.patchValue({ name: '' });
    this.organizationForm.get('primaryDetails.subType2')?.patchValue({ name: '' });
  }

  sectionChange(event: any) {
    this.industryTypes = (this.industryValues[1][event.value.code]);
    this.clearIndustryDetails();
    this.industrySubType1 = [];
    this.industrySubType2 = [];
  }

  industryTypeChange(event: any) {
    this.industrySubType1 = (this.industryValues[2][event.value.code]);
    this.industrySubType2 = [];
    this.organizationForm.get('primaryDetails.subType1')?.patchValue({ name: '' });
  }

  industrySubTypeChange(event: any) {
    this.industrySubType2 = (this.industryValues[3][event.value.code]);
    this.organizationForm.get('primaryDetails.subType2')?.patchValue({ name: '' });
  }

  industrySubType2Change(event: any) {
  }

  searchResults(event: any) {
    this.searchValue = this.searchValue.toLowerCase();
    this.tableData = (this.searchValue) ? _.filter(this.originalData, (obj) => _.includes(obj.name.toLowerCase(), this.searchValue)) : this.originalData;
  }

  updateIndustryDetails(resultData: any) {
    this.industryTypes = this.industryValues[1][resultData.section.code];
    this.industrySubType1 = (this.industryValues[2][resultData.industryType.code]) ? this.industryValues[2][resultData.industryType.code] : [];
    this.industrySubType2 = (this.industryValues[3][resultData.subType1.code]) ? this.industryValues[3][resultData.subType1.code] : [];
  }

  editData(event: any) {
    this.editId = event.rowData.id;
    // const updateData = this.organizationData[event.index];
    const updateData = event.rowData.actualData;
    this.updateIndustryDetails(updateData.primaryDetails);
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
      servicesFormArray.push(this.fb.group(service));
    });

    // this.organizationForm.get('services')?.patchValue(updateData.services);
    this.organizationView = true;
    // this.pocTableData = updateData.primaryDetails.pointofContact;
    this.addPOCDetails(updateData.primaryDetails.name);
    this.facilitiesTable = true;
    this.addFacilityTable(updateData.facilities);
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
        event.data.splice(event.index, 1);
        this.organizationService.deleteOrganization(event.rowData.id);
        this.organizationService.deleteOrganizationEmit.subscribe(
          (res: any) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Organization Deleted Successfully' });
            this.organizationService.getAllOrganization();
          }
        );
      },
    });
  }

  ngOnDestroy(): void {
    if (this.addOrganizationSubscription) { this.addOrganizationSubscription.unsubscribe() }
    if (this.individualSubscription) { this.individualSubscription.unsubscribe() }
    if (this.individualSubscription) { this.individualSubscription.unsubscribe() }
  }
}
