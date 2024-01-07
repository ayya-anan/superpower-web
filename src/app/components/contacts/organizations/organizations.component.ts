import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
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

  organizationView: boolean = false;
  additionalDetails: boolean = false;
  addDetails: boolean = false;
  companyAverge: number = 1500;
  tinoAverage: number = 500;
  countries = COUNTRIES_LIST;

  columns = [
    { header: 'Name', field: 'name' },
    { header: 'Industry Type', field: 'type' },
    { header: 'Sub Type', field: 'subType' },
    { header: 'Email', field: 'email' },
    { header: 'Contact', field: 'contact' },
    { header: 'Point of Contact', field: 'poc' },
    { header: 'Account Manager', field: 'accountManager' },
    { header: 'Status', field: 'status' },
    { header: 'Actions', field: 'action' }
  ];

  tableData: any = [];
  status: any = [
    { name: 'Prospect' },
    { name: 'Active' },
    { name: 'Inactive' },
    { name: 'Suspended' }
  ];

  company: any = [
    { name: 'TeamLeader' },
    { name: 'HubSpot' },
  ];

  industryType: any = [
    { name: 'Forestry and Logging' },
    { name: 'Coal Mining' },
  ];
  subType: any = [
    { name: 'Forestry' },
    { name: 'Hard Coal Mining' },
    { name: 'Brown Coal Mining' },
  ];
  revenueRange: any = [
    { name: '0 - 10 million' },
    { name: '10 - 100 million' },
    { name: '100 - 500 million' },
    { name: '500 - 1 billion' },
  ];
  facilityType: any = [
    { name: 'Office' },
    { name: 'Warehouse' },
    { name: 'Manufacturing Plant' },
  ];
  serviceList: any = [
    { name: 'Basic Care', unitRate: 52 },
    { name: 'Special Care', unitRate: 89 },
    { name: 'Internal Audit', unitRate: 20 },
    { name: 'External Audit', unitRate: 96 },
  ];

  roles: any = [
    { name: 'Decision Maker' },
    { name: 'Advisor' },
    { name: 'Influencer' },
  ];

  organizationForm: FormGroup = this.fb.group({});
  phones: FormArray = this.fb.array([]);
  facilities: FormArray = this.fb.array([]);
  emailAddresses: FormArray = this.fb.array([]);
  addresses: FormArray = this.fb.array([]);
  services: FormArray = this.fb.array([]);
  organizationSubscription: Subscription = new Subscription;
  addOrganizationSubscription: Subscription = new Subscription;
  individualSubscription: Subscription = new Subscription;
  individualsData: any;
  organizationData: any;

  constructor(private fb: FormBuilder,
    private messageService: MessageService,
    private organizationService: OrganizationService,
    private individualService: IndividualService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.organizationService.getAllOrganization();
    this.individualService.getAllIndividuals();
    this.subscribeToGetAllOrganization();
    this.subscribeToGetAllIndividuals();
    this.initForm();
  }
  initForm(){
    this.organizationForm = this.fb.group({
      primaryDetails: this.fb.group({
        name: ['', [Validators.required]],
        pointofContact: [''],
        accountManager: [''],
        website: [''],
        status: ['active', Validators.required],
      }),
      segmant: this.fb.group({
        industryType: ['', [Validators.required]],
        subType: ['', [Validators.required]],
        revenueRange: ['', [Validators.required]],
        notes: [''],
      }),
      facilities: this.facilities,
      addresses: this.addresses,
      phones: this.phones,
      emailAddresses: this.emailAddresses,
      services: this.services,
    });

    this.initFacilitiesArray(); // Initialize facilities array
    this.initAddressesArray(); // Initialize addresses array
    this.initPhonesArray(); // Initialize phones array
    this.initEmailAddressesArray(); // Initialize emailAddresses array
    this.initServicesArray(); // Initialize Services array
  }
  ngOnDestroy(): void {
    if (this.addOrganizationSubscription) { this.addOrganizationSubscription.unsubscribe() }
    if (this.individualSubscription) { this.individualSubscription.unsubscribe() }
    if (this.individualSubscription) { this.individualSubscription.unsubscribe() }
  }
  // Helper methods to initialize form arrays
  initFacilitiesArray(): void {
    const facilitiesArray = this.organizationForm.get('facilities') as FormArray;
    facilitiesArray.push(this.fb.group({
      type: ['', [Validators.required]],
      address: ['', [Validators.required]],
      country: ['Germany', [Validators.required]],
      zipCode: ['', [Validators.required]],
    }));
  }
  // Helper methods to initialize form arrays
  initServicesArray(): void {
    const servicesArray = this.organizationForm.get('services') as FormArray;
    servicesArray.push(this.fb.group({
      type: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      companyAverage: ['', [Validators.required]],
      tinoAverage: ['', [Validators.required]],
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
  private initAddressesArray(): void {
    const addressesArray = this.organizationForm.get('addresses') as FormArray;
    addressesArray.push(this.fb.group({
      type: ['office', [Validators.required]], // Adjust Validators as needed
      address: ['', [Validators.required]],
      country: ['Germany', [Validators.required]],
      zipCode: ['', [Validators.required]],
    }));
  }

  private initPhonesArray(): void {
    const phonesArray = this.organizationForm.get('phones') as FormArray;
    phonesArray.push(this.fb.group({
      type: ['office', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
    }));
  }

  private initEmailAddressesArray(): void {
    const emailAddressesArray = this.organizationForm.get('emailAddresses') as FormArray;
    emailAddressesArray.push(this.fb.control('', [Validators.required, Validators.email]));
  }

  private initSocialMediaLinksArray(): void {
    const socialMediaLinksArray = this.organizationForm.get('socialMediaLinks') as FormArray;
    socialMediaLinksArray.push(this.fb.group({
      type: ['', [Validators.required]],
      url: ['', [Validators.required]],
    }));
  }


  addContact() {
    this.organizationView = true;
  }

  onSubmit() {
    if (this.organizationForm.valid) {
      this.organizationView = false;
      this.organizationService.postOrganization(this.organizationForm.value)
    }
  }

  editData(event: any) {
    const updateData = this.organizationData[event.index];
    this.initForm();
    // Patching the primaryDetails form group
    this.organizationForm.get('primaryDetails')?.patchValue(updateData.primaryDetails);

    // Patching the segmant form group
    this.organizationForm.get('segmant')?.patchValue(updateData.segmant);

    // Patching the facilities form array
    const facilitiesFormArray = this.organizationForm.get('facilities') as FormArray;
    facilitiesFormArray.clear(); // Clear existing controls if any
    updateData.facilities.forEach((facility: any) => {
      facilitiesFormArray.push(this.fb.group(facility));
    });

    // Patching the addresses form array
    const addressesFormArray = this.organizationForm.get('addresses') as FormArray;
    addressesFormArray.clear(); // Clear existing controls if any
    updateData.addresses.forEach((address: any) => {
      addressesFormArray.push(this.fb.group(address));
    });

    // Patching the phones form array
    const phonesFormArray = this.organizationForm.get('phones') as FormArray;
    phonesFormArray.clear(); // Clear existing controls if any
    updateData.phones.forEach((phone: any) => {
      phonesFormArray.push(this.fb.group(phone));
    });

    // Patching the emailAddresses form array
    const emailAddressesFormArray = this.organizationForm.get('emailAddresses') as FormArray;
    emailAddressesFormArray.clear(); // Clear existing controls if any
    updateData.emailAddresses.forEach((email: any) => {
      emailAddressesFormArray.push(this.fb.control(email));
    });
    this.organizationView = true;
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
  subscribeToGetAllOrganization() {
    this.organizationSubscription = this.organizationService.allOrganization.subscribe(
      (res: any) => {
        this.tableData = [];
        this.organizationData = res.results;
        _.forEach(res.results, (item: any) => {
          const obj: any = {
            id: item.id,
            name: item.primaryDetails.name,
            type: item.segmant.industryType,
            subType: item.segmant.subType,
            status: item.primaryDetails.status,
            email: item.emailAddresses[0],
            contact: item.phones[0].phoneNumber,
            poc: item.primaryDetails.pointofContact,
            accountManager: item.primaryDetails.accountManager,
          }
          this.tableData.push(obj);
        });
      }
    );
  }
  subscribeToGetAllIndividuals() {
    this.individualSubscription = this.individualService.allIndividuals.subscribe(
      (res: any) => {
        this.individualsData = _.map(res.results, (i) => {
          return { name: `${i.personalDetails.firstName} ${i.personalDetails.middleName} ${i.personalDetails.lastName}`, id: i.id }
        });
      }
    );
  }
  subscribeToAddOrganization() {
    this.addOrganizationSubscription = this.organizationService.addOrganization.subscribe(
      (res: any) => {
        if (res.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.error.message });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Organization Added Successfully' });
          this.organizationView = false;
          this.organizationService.getAllOrganization();
        }
      }
    );
  }
}
