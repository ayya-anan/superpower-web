import { ViewEncapsulation } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

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
        { name : 'Onyama Limba', email: 'mailtonadesh.nr@gmail.com', contact: '+91 9626138941', company: 'Q A Service', jobTitle: 'Senior Software Engineer', status: 'Active' }
    ]

    company: any = [
        { name: 'TeamLeader' },
        { name: 'HubSpot' },
    ];

    roles: any = [
        { name: 'General Manager' },
        { name: 'President' },
        { name: 'Vice-President' },
    ];

    contactForm = new FormGroup({
        firstname: new FormControl(),
        middlename: new FormControl(),
        lastname: new FormControl(),
        emailAddress: new FormControl(),
        alternateEmailAddress: new FormControl(),
        primaryContact: new FormControl(),
        alternateContact: new FormControl(),
        jobtitle: new FormControl(),
        companyname: new FormControl(),
        rolename: new FormControl()
    });

    constructor() { }

    ngOnInit() {}

    addContact() {
        this.contactView = true;
    }

    showContent() {
        this.additionalDetails = true;
    }

    onSubmit() {
        console.log(this.contactForm.value);
    }

}
