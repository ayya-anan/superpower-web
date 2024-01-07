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
                icon: 'pi pi-fw pi-home',
                routerLink: ['/dashboard']
            },
            { separator: true },
            {
                label: 'Contacts',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Individual', routerLink: ['/contacts/individual'] },
                    { label: 'Organizations', routerLink: ['/contacts/organizations'] }
                ]
            },
            { separator: true },
            {
                label: 'Lead Management',
                icon: 'pi pi-fw pi-sitemap',
                items: [
                    { label: 'Deals & Quotes', routerLink: ['/leadManagement/deals'] },
                    // { label: 'Quote', routerLink: ['/'] },
                    { label: 'Contracts', routerLink: ['/'] },
                ]
            },
            { separator: true },
            {
                label: 'Active Work',

                icon: 'pi pi-fw pi-stopwatch',
                items: [
                    { label: 'Team Schedule', routerLink: ['/'] },
                    { label: 'Time Tracking', routerLink: ['/'] },
                    { label: 'Invoice', routerLink: ['/'] },
                ]
            },
            { separator: true },
            {
                label: 'Payments',
                icon: 'pi pi-fw pi-money-bill',
                items: [
                    { label: 'Reconcillation', routerLink: ['/'] },
                    { label: 'Reminders', routerLink: ['/'] }
                ]
            },
            { separator: true },
            {
                label: 'Insights & Analytics',
                icon: 'pi pi-fw pi-bolt',
                items: [
                    { label: 'Customer Survey', routerLink: ['/'] },
                    { label: 'Employee Survey', routerLink: ['/'] },
                    { label: 'Reporting', routerLink: ['/'] },
                ]
            },
            { separator: true },
            {
                label: 'Business Administration',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { label: 'Government Regulations', routerLink: ['/'] },
                    { label: 'User Management', routerLink: ['/'] },
                    { label: 'Team Management', routerLink: ['/'] }
                ]
            }
        ];
    }
}
