import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from 'src/app/coreService/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Contacts',
                items: [
                    { label: 'Individual', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Organizations', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Lead Management',
                items: [
                    { label: 'Deals', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Quote & Invoice generation', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Payments',
                items: [
                    { label: 'Reconcillation', icon: 'pi pi-fw pi-eye', routerLink: ['/'] },
                    { label: 'Reminders', icon: 'pi pi-fw pi-globe', routerLink: ['/'] }
                ]
            },
            {
                label: 'Insights & Analytics',
                items: [
                    { label: 'Reporting', icon: 'pi pi-fw pi-prime', routerLink: ['/'] },
                ]
            }
        ];
    }
}
