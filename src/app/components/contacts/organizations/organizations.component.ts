import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class OrganizationsComponent {

  organizationsView: boolean = false;
  additionalDetails: boolean = false;
  addDetails: boolean = false;
  companyAverge: number = 1500;
  tinoAverage: number = 500;

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

  industryType : any = [
    {name: 'Forestry and Logging'},
    {name: 'Coal Mining'},
  ];
  subType: any = [
    { name: 'Forestry'},
    { name: 'Hard Coal Mining'},
    { name: 'Brown Coal Mining'},
  ];
  revenueRange: any = [
    { name: '0 - 10 million €' },
    { name: '10 - 100 million €'  },
    { name: '100 - 500 million €'  },
    { name: '500 - 1 billion €'  },
  ];
  facilityType: any = [
    { name: 'Office'},
    { name: 'Warehouse'},
    { name: 'Manufacturing Plant'},
  ];
  services: any = [
    { name: 'Consulting'},
    { name: 'Training'},
    { name: 'Internal Audit'},
    { name: 'External Audit'},
  ];

  roles: any = [
    { name: 'Decision Maker' },
    { name: 'Advisor' },
    { name: 'Influencer' },
  ];

  contactForm = new FormGroup({
    jurisdiction: new FormControl(),
    timezone: new FormControl(),
    website: new FormControl(),
    name: new FormControl(),
    status: new FormControl(),
    emailAddress: new FormControl(),
    alternateEmailAddress: new FormControl(),
    primaryContact: new FormControl(),
    alternateContact: new FormControl(),
    jobtitle: new FormControl(),
    companyname: new FormControl(),
    rolename: new FormControl()
  });

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() { }

  addContact() {
    this.organizationsView = true;
  }

  onSubmit() {
    this.organizationsView = false;
    console.log(this.contactForm.value);
    const result = this.contactForm.value;
    const obj = {
      name: result.name,
      email: result.emailAddress,
      contact: result.primaryContact,
      company: result.companyname.name,
      jobTitle: result.jobtitle,
      status: result.status.name
    }
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Contact Added Successfully' });
  }

  editData(event: any) {
    console.log(event);
    this.organizationsView = true;
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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Contact Deleted Successfully' });
      },
    });
  }

}
