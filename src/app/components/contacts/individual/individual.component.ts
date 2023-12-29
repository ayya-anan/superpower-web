import { ViewEncapsulation } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    templateUrl: './individual.component.html',
    styleUrls: ['./individual.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class IndividualComponent implements OnInit {
    
    contactView: boolean = false;
    additionalDetails: boolean = false;

    columns = [
        { header: 'Name', field: 'name'},
        { header: 'Email Address', field: 'email'},
        { header: 'Contact', field: 'contact'},
        { header: 'Company', field: 'company'},
        { header: 'Job Title', field: 'jobTitle'},
        { header: 'Status', field: 'status'},
        { header: 'Actions', field: 'action'}
    ];

    tableData = [
        { name : 'Nadesh', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Eviden', jobTitle: 'Senior Software Engineer', status: 'Prospect' },
        { name : 'Ioni Bowcher', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Scat', jobTitle: 'Senior Software Engineer', status: 'Active' },
        { name : 'Amy Elsner', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Sider', jobTitle: 'Senior Software Engineer', status: 'Inactive' },
        { name : 'Asiya Javayant', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Parkway', jobTitle: 'Senior Software Engineer', status: 'Suspended' },
        { name : 'Xuxue Feng', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Smc Inc', jobTitle: 'Senior Software Engineer', status: 'Inactive' },
        { name : 'Onyama Limba', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Q A Service', jobTitle: 'Senior Software Engineer', status: 'Active' },
        { name : 'Nadesh', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Eviden', jobTitle: 'Senior Software Engineer', status: 'Prospect' },
        { name : 'Ioni Bowcher', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Scat', jobTitle: 'Senior Software Engineer', status: 'Active' },
        { name : 'Amy Elsner', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Sider', jobTitle: 'Senior Software Engineer', status: 'Inactive' },
        { name : 'Asiya Javayant', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Parkway', jobTitle: 'Senior Software Engineer', status: 'Suspended' },
        { name : 'Xuxue Feng', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Smc Inc', jobTitle: 'Senior Software Engineer', status: 'Inactive' },
        { name : 'Onyama Limba', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Q A Service', jobTitle: 'Senior Software Engineer', status: 'Active' },
        { name : 'Nadesh', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Eviden', jobTitle: 'Senior Software Engineer', status: 'Prospect' },
        { name : 'Ioni Bowcher', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Scat', jobTitle: 'Senior Software Engineer', status: 'Active' },
        { name : 'Amy Elsner', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Sider', jobTitle: 'Senior Software Engineer', status: 'Inactive' },
        { name : 'Asiya Javayant', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Parkway', jobTitle: 'Senior Software Engineer', status: 'Suspended' },
        { name : 'Xuxue Feng', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Smc Inc', jobTitle: 'Senior Software Engineer', status: 'Inactive' },
        { name : 'Onyama Limba', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Q A Service', jobTitle: 'Senior Software Engineer', status: 'Active' },
        { name : 'Nadesh', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Eviden', jobTitle: 'Senior Software Engineer', status: 'Prospect' },
        { name : 'Ioni Bowcher', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Scat', jobTitle: 'Senior Software Engineer', status: 'Active' },
        { name : 'Amy Elsner', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Sider', jobTitle: 'Senior Software Engineer', status: 'Inactive' },
        { name : 'Asiya Javayant', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Parkway', jobTitle: 'Senior Software Engineer', status: 'Suspended' },
        { name : 'Xuxue Feng', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Smc Inc', jobTitle: 'Senior Software Engineer', status: 'Inactive' },
        { name : 'Onyama Limba', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Q A Service', jobTitle: 'Senior Software Engineer', status: 'Active' }
    ];

    Salutations: any = [
        { name: 'Mr.'},
        { name: 'Ms.'},
        { name: 'Mrs.'},
        { name: 'Dr.'},
    ];

    status: any = [
        { name: 'Prospect'},
        { name: 'Active'},
        { name: 'Inactive'},
        { name: 'Suspended'}
    ];

    company: any = [
        { name: 'TeamLeader' },
        { name: 'HubSpot' },
    ];

    roles: any = [
        { name: 'Decision Maker' },
        { name: 'Advisor' },
        { name: 'Influencer' },
    ];

    contactForm = new FormGroup({
        salutation: new FormControl(),
        firstname: new FormControl(),
        middlename: new FormControl(),
        lastname: new FormControl(),
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

    ngOnInit() {}

    addContact() {
        this.contactView = true;
    }

    showContent() {
        this.additionalDetails = true;
    }

    onSubmit() {
        this.contactView = false;
        console.log(this.contactForm.value);
        const result = this.contactForm.value;
        const obj = {
            name : `${result.firstname} ${result.lastname}`,
            email: result.emailAddress,
            contact: result.primaryContact,
            company: result.companyname.name,
            jobTitle: result.jobtitle,
            status: result.status.name
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Contact Added Successfully' });
        this.tableData.unshift(obj);
    }

    editData(event: any) {
        console.log(event);
        this.contactView = true;
        this.contactForm = new FormGroup({
            salutation: this.Salutations[0],
            firstname: event.rowData.name.split(' ')[0],
            middlename: new FormControl(),
            lastname: event.rowData.name.split(' ')[1],
            status: event.rowData.status,
            emailAddress: new FormControl(),
            alternateEmailAddress: new FormControl(),
            primaryContact: new FormControl(),
            alternateContact: new FormControl(),
            jobtitle: new FormControl(),
            companyname: new FormControl(),
            rolename: new FormControl()
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
                event.data.splice(event.index, 1);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Contact Deleted Successfully' });
            },
        });
    }

}
