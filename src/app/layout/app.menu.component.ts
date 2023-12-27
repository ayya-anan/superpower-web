import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-eye',
                routerLink: ['/dashboard']
            },
            { separator: true },
            {
                label: 'Contacts',
                icon: 'pi pi-fw pi-download',
                items: [
                    { label: 'Individual', icon: 'pi pi-fw pi-home', routerLink: ['/contacts/individual'] },
                    { label: 'Organizations', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            { separator: true },
            {
                label: 'Lead Management',
                icon: 'pi pi-fw pi-filter',
                items: [
                    { label: 'Deals', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Quote', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Contracts', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                ]
            },
            { separator: true },
            {
                label: 'Active Work',
                icon: 'pi pi-fw pi-wrench',
                items: [
                    { label: 'Team Schedule', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Time Tracking', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Invoice', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                ]
            },
            { separator: true },
            {
                label: 'Payments',
                icon: 'pi pi-fw pi-money-bill',
                items: [
                    { label: 'Reconcillation', icon: 'pi pi-fw pi-eye', routerLink: ['/'] },
                    { label: 'Reminders', icon: 'pi pi-fw pi-globe', routerLink: ['/'] }
                ]
            },
            { separator: true },
            {
                label: 'Insights & Analytics',
                icon: 'pi pi-fw pi-bolt',
                items: [
                    { label: 'Customer Survey', icon: 'pi pi-fw pi-prime', routerLink: ['/'] },
                    { label: 'Employee Survey', icon: 'pi pi-fw pi-prime', routerLink: ['/'] },
                    { label: 'Reporting', icon: 'pi pi-fw pi-prime', routerLink: ['/'] },
                ]
            },
            { separator: true },
            {
                label: 'Business Administration',
                icon: 'pi pi-fw pi-user-plus',
                items: [
                    { label: 'Government Regulations', icon: 'pi pi-fw pi-building', routerLink: ['/'] },
                    { label: 'User Management', icon: 'pi pi-fw pi-users', routerLink: ['/'] }
                ]
            }
        ];
    }
}
