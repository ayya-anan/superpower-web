import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  individualsList: any = Subscription;

  searchValue: any;
  originalData: any = [];
  loading: boolean = false;
  organizationView: boolean = false;
  additionalDetails: boolean = false;
  addDetails: boolean = false;
  companyAverge: number = 1500;
  tinoAverage: number = 500;
  countries = COUNTRIES_LIST;

  value1: any;
  value2: any;

  columns = [
    { header: 'Name', field: 'name' },
    { header: 'Industry Type', field: 'type' },
    { header: 'Sub Type', field: 'subType' },
    { header: 'Email', field: 'email' },
    { header: 'Contact', field: 'contact' },
    { header: 'Point of Contact', field: 'poc' },
    // { header: 'Account Manager', field: 'accountManager' },
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

  // industryType: any = [
  //   { name: 'Forestry and Logging' },
  //   { name: 'Coal Mining' },
  // ];
  // subType: any = [
  //   { name: 'Forestry' },
  //   { name: 'Hard Coal Mining' },
  //   { name: 'Brown Coal Mining' },
  // ];
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

  pocTableCols = [
    { header: 'First Name', field: 'firstName' },
    { header: 'Last Name', field: 'lastName' },
    { header: 'Email Address', field: 'email' },
    { header: 'Phone Number', field: 'phone' },
    { header: 'Job Title', field: 'jobTitle' },
  ];

  facilityCols = [
    { header: 'Type', field: 'type' },
    { header: 'Employee Count', field: 'employeeCount' },
    { header: 'Address', field: 'address' },
    // { header: 'Phone Number', field: 'phone' },
    // { header: 'Job Title', field: 'jobTitle' },
  ];

  pocTableData: any = [];
  facilitiesTable: boolean = false;
  facilitiesTableData: any = [];
  // Industry Types
  sections: any = [];
  industryTypes: any = [];
  industrySubType1: any = [];
  industrySubType2: any = [];

  industryDetails: any = {
    "sections": [
      {
        "section_code": 1,
        "section_title": "COUNTRY- AND FORESTRY, FISHING",
        "industry_types": [
          {
            "industry_type_code": 1.5,
            "industry_type_title": "Mixed Agriculture",
            "industry_subtypes": []
          },
          {
            "industry_type_code": 2,
            "industry_type_title": "forestry and logging",
            "industry_subtypes": [
              {
                "industry_subtype_code": 2.5,
                "industry_subtype_title": "forestry"
              },
              {
                "industry_subtype_code": 2.5,
                "industry_subtype_title": "logging"
              }
            ]
          }
        ]
      },
      {
        "section_code": "B",
        "section_title": "MINING AND WINNING OF STONES AND EARTH",
        "industry_types": [
          {
            "industry_type_code": 5,
            "industry_type_title": "Coal mining",
            "industry_subtypes": [
              {
                "industry_subtype_code": 2.5,
                "industry_subtype_title": "Hard coal mining"
              },
              {
                "industry_subtype_code": 2.5,
                "industry_subtype_title": "Brown coal mining"
              }
            ]
          },
          {
            "industry_type_code": 6,
            "industry_type_title": "extraction from oil and natural gas",
            "industry_subtypes": [
              {
                "industry_subtype_code": 2.5,
                "industry_subtype_title": "extraction from oil"
              },
              {
                "industry_subtype_code": 2.5,
                "industry_subtype_title": "extraction from natural gas"
              }
            ]
          },
          {
            "industry_type_code": 7,
            "industry_type_title": "Ore mining",
            "industry_subtypes": [
              {
                "industry_subtype_code": 2.5,
                "industry_subtype_title": "Iron ore mining"
              },
              {
                "industry_subtype_code": 2.5,
                "industry_subtype_title": "Non-ferrous metal ore mining"
              }
            ]
          },
          {
            "industry_type_code": 8,
            "industry_type_title": "extraction from stones and Earth, other Mining",
            "industry_subtypes": [
              {
                "industry_subtype_code": null,
                "industry_subtype_title": "extraction from natural stones, Gravel, Sand, volume and Kaolin _",
                "industry_subtypes2": [
                  {
                    "industry_subtype_code": 2.5,
                    "industry_subtype_title": "extraction from Natural stones and Natural stone, limestone and gypsum stone, chalk and slate"
                  },
                  {
                    "industry_subtype_code": 1.5,
                    "industry_subtype_title": "extraction from volume and kaolin"
                  }
                ]
              },
              {
                "industry_subtype_code": null,
                "industry_subtype_title": "Other Mining; extraction from stones and Earth a. n. G.\"",
                "industry_subtypes2": [
                  {
                    "industry_subtype_code": 1.5,
                    "industry_subtype_title": "Peat extraction"
                  }
                ]
              }
            ]
          },
          {
            "industry_type_code": 9,
            "industry_type_title": "Delivery from Services for the Mining and for the extraction of stones and earth",
            "industry_subtypes": [
              {
                "industry_subtype_code": 2.5,
                "industry_subtype_title": "Delivery from Services for the extraction of oil and natural gas"
              },
              {
                "industry_subtype_code": 2.5,
                "industry_subtype_title": "Providing services for other mining and the extraction from stones and Earth"
              }
            ]
          }
        ]
      },
      {
        "section_code": "K",
        "section_title": "DELIVERY FROM FINANCIAL- AND INSURANCE SERVICES",
        "industry_types": [
          {
            "industry_type_code": null,
            "industry_type_title": "Delivery from Financial Services",
            "industry_subtypes": [
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Central banks and Credit institutions"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Investment companies"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "trust and other Fund and similar Financial institutions"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Other Financing institutions"
              }
            ]
          },
          {
            "industry_type_code": null,
            "industry_type_title": "insurance, Reinsurance and Pension funds (without social insurance)",
            "industry_subtypes": [
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Insurance",
                "industry_subtypes2": [
                  {
                    "industry_subtype_code": 0.5,
                    "industry_subtype_title": "Health insurance (company health insurance companies)"
                  }
                ]
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Reinsurance"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Pension funds and Pension fund"
              }
            ]
          },
          {
            "industry_type_code": null,
            "industry_type_title": "With financial and Insurance services related activities",
            "industry_subtypes": [
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "With Financial Services connected activities"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "With Insurance services and Pension funds"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "connected activities"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Fund management"
              }
            ]
          }
        ]
      },
      {
        "section_code": "L",
        "section_title": "PROPERTY AND HOUSING",
        "industry_types": [
          {
            "industry_type_code": null,
            "industry_type_title": "property and Housing",
            "industry_subtypes": [
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "purchase and sale from own properties, buildings and apartments"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Rental, leasing from own or leased land, buildings and apartments"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "mediation and Administration from properties, Buildings and apartments for third parties"
              }
            ]
          }
        ]
      },
      {
        "section_code": "M",
        "section_title": "PROVISION OF FREELANCER WORK, SCIENTIFIC AND TECHNICAL SERVICES",
        "industry_types": [
          {
            "industry_type_code": null,
            "industry_type_title": "Right- and tax advice, Audit",
            "industry_subtypes": [
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Legal advice"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Audit and tax advice; Accounting"
              }
            ]
          },
          {
            "industry_type_code": null,
            "industry_type_title": "Administration and guide from Pursue and operated; Business consulting",
            "industry_subtypes": [
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Administration and guide from Pursue and Operated _"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "public relations and Business consulting"
              }
            ]
          },
          {
            "industry_type_code": null,
            "industry_type_title": "Architecture- and engineering offices; technical, physical and chemical examination",
            "industry_subtypes": [
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Architecture- and Engineering offices"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Technical, physical and chemical Investigation _"
              }
            ]
          },
          {
            "industry_type_code": null,
            "industry_type_title": "Research and Development",
            "industry_subtypes": [
              {
                "industry_subtype_code": 1.5,
                "industry_subtype_title": "Research and Development in the Area Nature-, Engineering, agricultural sciences and medicine",
                "industry_subtypes2": [
                  {
                    "industry_subtype_code": 1.5,
                    "industry_subtype_title": "Other Research and Development in the Area Natural sciences, engineering, agricultural sciences and medicine"
                  }
                ]
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Research and Development in the Area Right-, Economics and social sciences as well as in the areas of language, cultural and art studies"
              }
            ]
          },
          {
            "industry_type_code": null,
            "industry_type_title": "Advertising and Market research",
            "industry_subtypes": [
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Advertising"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Market- and opinion research"
              }
            ]
          },
          {
            "industry_type_code": null,
            "industry_type_title": "Other freelance, scientific and technical activities",
            "industry_subtypes": [
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "studios for Textile-, Jewelry-, Graphic- u. ä. design"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "photography and Photo laboratories"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Translate and Interpreting"
              },
              {
                "industry_subtype_code": 0.5,
                "industry_subtype_title": "Other freelance, scientific and technical activities etc"
              }
            ]
          },
          {
            "industry_type_code": 0.5,
            "industry_type_title": "Veterinary",
            "industry_subtypes": []
          }
        ]
      }
    ]
  }


  organizationForm: FormGroup = this.fb.group({});
  // phones: FormArray = this.fb.array([]);
  facilities: FormArray = this.fb.array([]);
  // emailAddresses: FormArray = this.fb.array([]);
  addresses: FormArray = this.fb.array([]);
  services: FormArray = this.fb.array([]);
  organizationSubscription: Subscription = new Subscription;
  addOrganizationSubscription: Subscription = new Subscription;
  individualSubscription: Subscription = new Subscription;
  individualsData: any;
  organizationData: any;
  activeContract: boolean = false;
  allIndividuals: any = [];

  constructor(private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private organizationService: OrganizationService,
    private individualService: IndividualService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getIndustryDetails();
    this.individualService.getAllIndividuals();
    this.subscribeToAllIndividualsList();
    this.initForm();
    if (this.organizationService.activeOrganizationView) {
      this.organizationView = true;
      this.organizationService.activeOrganizationView = false;
      this.organizationForm.get('primaryDetails')?.patchValue(this.organizationService.organizationDetails.primaryDetails);
      this.organizationForm.get('facilities')?.patchValue(this.organizationService.organizationDetails.facilities);
      this.organizationForm.get('services')?.patchValue(this.organizationService.organizationDetails.services);
      // this.addPOCDetails(this.organizationService.organizationDetails.primaryDetails.name);
    }
    this.loading = true;
    this.organizationService.getAllOrganization();
    this.subscribeToGetAllOrganization();
    this.subscribeToGetAllIndividuals();
    this.subscribeToAddOrganization();
  }

  subscribeToAllIndividualsList() {
    this.individualsList = this.individualService.allIndividuals.subscribe(
      (res: any) => {
        this.allIndividuals = res.results;
      });
  }

  initForm() {
    this.organizationForm = this.fb.group({
      primaryDetails: this.fb.group({
        name: ['', [Validators.required]],
        pointofContact: [''],
        accountManager: [''],
        status: ['active', Validators.required],
        section: '',
        industryType: '',
        subType1: '',
        subType2: '',
        revenueRange: ['', [Validators.required]],
      }),
      // segmant: this.fb.group({
      //   notes: [''],
      // }),
      facilities: this.facilities,
      // addresses: this.addresses,

      services: this.services,
    });
    // this.organizationForm = this.fb.group({
    //   primaryDetails: this.fb.group({
    //     name: ['', [Validators.required]],
    //     pointofContact: [''],
    //     accountManager: [''],
    //     website: [''],
    //     status: ['active', Validators.required],
    //   }),
    //   segmant: this.fb.group({
    //     industryType: ['', [Validators.required]],
    //     subType: ['', [Validators.required]],
    //     revenueRange: ['', [Validators.required]],
    //     notes: [''],
    //   }),
    //   facilities: this.facilities,
    //   addresses: this.addresses,
    //   phones: this.phones,
    //   emailAddresses: this.emailAddresses,
    //   services: this.services,
    // });

    this.initFacilitiesArray(); // Initialize facilities array
    // this.initAddressesArray(); // Initialize addresses array
    this.initServicesArray(); // Initialize Services array
  }
  ngOnDestroy(): void {
    if (this.addOrganizationSubscription) { this.addOrganizationSubscription.unsubscribe() }
    if (this.individualSubscription) { this.individualSubscription.unsubscribe() }
    if (this.individualSubscription) { this.individualSubscription.unsubscribe() }
    if (this.individualsList) { this.individualsList.unsubscribe(); }
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
  private initAddressesArray(): void {
    const addressesArray = this.organizationForm.get('addresses') as FormArray;
    addressesArray.push(this.fb.group({
      type: ['office', [Validators.required]], // Adjust Validators as needed
      address: ['', [Validators.required]],
      country: ['Germany', [Validators.required]],
      zipCode: ['', [Validators.required]],
      // website: ['']
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
    this.organizationForm.reset();
    this.organizationView = true;
    this.organizationService.organizationDetails = {};
    this.facilitiesTable = false;
  }

  statusChange(event: any) {
    this.activeContract = (event.value === 'Prospect') ? false : true;
  }

  onSubmit() {
    // if (this.organizationForm.valid) {
    this.organizationService.organizationDetails = {};
    console.log(this.organizationForm.value.primaryDetails);
    this.organizationForm.value.primaryDetails.section = '';
    this.organizationForm.value.primaryDetails.industryType = '';
    this.organizationForm.value.primaryDetails.subType1 = '';
    this.organizationForm.value.primaryDetails.subType2 = '';

    this.organizationForm.value.facilities = (this.facilitiesTable) ? this.facilitiesTableData : this.facilities.value;
    _.forEach(this.organizationForm.value.facilities, (facilityObj) => {
      delete facilityObj['_id'];
    });
    this.organizationForm.value.primaryDetails.pointofContact = this.pocTableData;
    this.organizationService.postOrganization(this.organizationForm.value);
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
        address: dataObj.address
      }
      this.facilitiesTableData.push(obj);
    });
  }

  addPOCDetails(name: any) {
    this.pocTableData = [];
    const data: any = _.filter(this.allIndividuals, (obj) => obj.professionalDetails && (obj.professionalDetails.companyName.toLowerCase() === name.toLowerCase()));
    _.forEach(data, (dataObj: any) => {
      let obj = {
        firstName: dataObj.personalDetails.firstName,
        lastName: dataObj.personalDetails.lastName,
        email: (dataObj.emailAddresses) ? dataObj.emailAddresses[0] : '',
        phone: (dataObj.phones && dataObj.phones.length > 0) ? dataObj.phones[0].number : '',
        jobTitle: dataObj.professionalDetails.jobTitle
      }
      this.pocTableData.push(obj);
    });
  }

  editData(event: any) {
    const updateData = this.organizationData[event.index];
    // Patching the primaryDetails form group
    this.organizationForm.get('primaryDetails')?.patchValue(updateData.primaryDetails);

    // Patching the segmant form group
    // this.organizationForm.get('segmant')?.patchValue(updateData.segmant);

    // Patching the facilities form array
    const facilitiesFormArray = this.organizationForm.get('facilities') as FormArray;
    facilitiesFormArray.clear(); // Clear existing controls if any
    updateData.facilities.forEach((facility: any) => {
      facilitiesFormArray.push(this.fb.group(facility));
    });

    // Patching the addresses form array
    // const addressesFormArray = this.organizationForm.get('addresses') as FormArray;
    // addressesFormArray.clear(); // Clear existing controls if any
    // updateData.addresses.forEach((address: any) => {
    //   addressesFormArray.push(this.fb.group(address));
    // });

    // Patching the phones form array
    // const phonesFormArray = this.organizationForm.get('phones') as FormArray;
    // phonesFormArray.clear(); // Clear existing controls if any
    // updateData.phones.forEach((phone: any) => {
    //   phonesFormArray.push(this.fb.group(phone));
    // });

    // Patching the emailAddresses form array
    // const emailAddressesFormArray = this.organizationForm.get('emailAddresses') as FormArray;
    // emailAddressesFormArray.clear(); // Clear existing controls if any
    // updateData.emailAddresses.forEach((email: any) => {
    //   emailAddressesFormArray.push(this.fb.control(email));
    // });

    // Patching the Service form array
    // const servicesFormArray = this.organizationForm.get('services') as FormArray;
    // servicesFormArray.clear(); // Clear existing controls if any
    // updateData.services.forEach((service: any) => {
    //   servicesFormArray.push(this.fb.control(service));
    // });
    // _.forEach(updateData.services, (serviceObj) => {
    //   serviceObj['type'] = { name: serviceObj.type}
    // });
    this.organizationForm.get('services')?.patchValue(updateData.services);
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
  subscribeToGetAllOrganization() {
    this.organizationSubscription = this.organizationService.allOrganization.subscribe(
      (res: any) => {
        this.loading = false;
        this.tableData = [];
        this.pocTableData = [];
        this.organizationData = res.results;
        // this.organizationView = false;
        _.forEach(res.results, (item: any) => {
          const pocDetails = _.filter(this.allIndividuals, (obj) => obj.professionalDetails && (obj.professionalDetails.companyName.toLowerCase() === item.primaryDetails.name.toLowerCase()));
          const obj: any = {
            id: item.id,
            name: item.primaryDetails.name,
            type: item.primaryDetails.industryType,
            subType: item.primaryDetails.subType,
            status: item.primaryDetails.status,
            email: (pocDetails.length > 0) ? pocDetails[0].emailAddresses[0] : '',
            contact: (pocDetails.length > 0 && pocDetails[0].phones.length > 0) ? pocDetails[0].phones[0].number : '',
            poc: (pocDetails.length > 0) ? `${pocDetails[0].personalDetails.firstName} ${pocDetails[0].personalDetails.lastName}` : '',
            accountManager: item.primaryDetails.accountManager,
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
        const accountManagers: any = _.filter(res.results, (obj) => obj.professionalDetails.jobTitle === 'Account Manager' && obj.professionalDetails.companyName === 'Expert People Management GmbH');
        this.individualsData = _.map(accountManagers, (i) => {
          return { name: `${i.personalDetails.firstName} ${i.personalDetails.lastName}`, id: i.id }
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
          this.organizationService.getAllOrganization();
        }
      }
    );
  }

  addPOC() {
    this.organizationService.activeOrganizationView = true;
    this.organizationService.organizationDetails = this.organizationForm.value;
    this.router.navigateByUrl('/contacts/individual');
  }

  getIndustryDetails() {
    // this.section = this.industryDetails.sections;
    console.log(this.industryDetails.sections);
    this.sections = this.industryDetails.sections;
  }

  sectionChange(event: any) {
    console.log(event);
    this.industryTypes = event.value;
  }

  industryTypeChange(event: any) {
    this.industrySubType1 = (event.value) ? event.value : [];
  }

  industrySubTypeChange(event: any) {
    console.log(event);
    this.industrySubType2 = (event.value) ? event.value : [];
  }

  searchResults(event: any) {
    this.searchValue = this.searchValue.toLowerCase();
    this.tableData = (this.searchValue) ? _.filter(this.originalData, (obj) => _.includes(obj.name.toLowerCase(), this.searchValue)) : this.originalData;
  }
}
