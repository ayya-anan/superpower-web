import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
    templateUrl: './contacts.component.html'
})
export class ContactsComponent implements OnInit {

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

    onSubmit() {
        console.log(this.contactForm.value);
    }

}
