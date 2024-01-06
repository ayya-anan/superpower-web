import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrganizationService } from 'src/app/api/contacts/organization.service';
import { COUNTRIES_LIST } from 'src/app/constants/countries.constants';

@Component({
  selector: 'app-organization',
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class OrganizationsComponent {

  organizationView: boolean = false;
  additionalDetails: boolean = false;
  addDetails: boolean = false;
  companyAverge: number = 1500;
  tinoAverage: number = 500;
  countries = COUNTRIES_LIST
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

  tableData = [
    {
      name: 'Beiersdorf',
      type: 'Administration and guide from Pursue and operated; Business consulting',
      subType: 'Operation from Sports facilities',
      email: 'Info@arburg.com',
      contact: '9529564467',
      poc: 'Martin Müller',
      accountManager: 'Lisa Wagner',
      status: 'Active'
    },
    {
      name: 'Braun',
      type: 'Wholesale with utility and consumer goods',
      subType: 'Delivery from Services for the performing Arts',
      email: 'info@Edeka.com',
      contact: '2576456122',
      poc: 'Mark Weber',
      accountManager: 'Jeff Meyer',
      status: 'Suspended'
    },
    {
      name: 'Beiersdorf',
      type: 'Administration and guide from Pursue and operated; Business consulting',
      subType: 'Operation from Sports facilities',
      email: 'Info@arburg.com',
      contact: '9529564467',
      poc: 'Martin Müller',
      accountManager: 'Lisa Wagner',
      status: 'Active'
    },
    {
      name: 'GEA Group',
      type: 'SECTION R – ART, ENTERTAINMENT AND RECREATION',
      subType: 'Delivery from Services for the performing Arts',
      email: 'info@GEA Group.com',
      contact: '1456239872',
      poc: 'Eric Schmidt',
      accountManager: 'Andrew Hoffman',
      status: 'Prospect'
    },
    {
      name: 'Bilfinger',
      type: 'Other Wholesale',
      subType: 'Wholesale with other Semi-finished goods',
      email: 'Info@arburg.com',
      contact: '6089770851',
      poc: 'Bernd Maier',
      accountManager: 'Jeff Meyer',
      status: 'Active'
    },
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
    { name: '0 - 10 million €' },
    { name: '10 - 100 million €' },
    { name: '100 - 500 million €' },
    { name: '500 - 1 billion €' },
  ];
  facilityType: any = [
    { name: 'Office' },
    { name: 'Warehouse' },
    { name: 'Manufacturing Plant' },
  ];
  services: any = [
    { name: 'Consulting' },
    { name: 'Training' },
    { name: 'Internal Audit' },
    { name: 'External Audit' },
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
  organizationList: any;
  addOrganization: any;

  constructor(private fb: FormBuilder,
    private messageService: MessageService,
    private organizationService: OrganizationService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.organizationService.getAllOrganization();
    this.subscribeToGetAllOrganization();
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
    });

    this.initFacilitiesArray(); // Initialize facilities array
    this.initAddressesArray(); // Initialize addresses array
    this.initPhonesArray(); // Initialize phones array
    this.initEmailAddressesArray(); // Initialize emailAddresses array
  }

  // Helper methods to initialize form arrays
  initFacilitiesArray(): void {
    const facilitiesArray = this.organizationForm.get('facilities') as FormArray;
    facilitiesArray.push(this.fb.group({
      type: ['', [Validators.required]],
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
    }));
  }
  removeFacilitiesArray(index: number) {
    const facilitiesArray = this.organizationForm.get('facilities') as FormArray;
    facilitiesArray.removeAt(index)
  }
  private initAddressesArray(): void {
    const addressesArray = this.organizationForm.get('addresses') as FormArray;
    addressesArray.push(this.fb.group({
      type: ['office', [Validators.required]], // Adjust Validators as needed
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
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
    console.log(event);
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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Organization Deleted Successfully' });
      },
    });
  }
  subscribeToGetAllOrganization() {
    this.organizationList = this.organizationService.allOrganization.subscribe(
      (res: any) => {
        this.tableData = [];
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
  subscribeToAddOrganization() {
      this.addOrganization = this.organizationService.addOrganization.subscribe(
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
