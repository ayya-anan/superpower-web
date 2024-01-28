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
                label: 'MENU.DASHBOARD',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/dashboard']
            },
            { separator: true },
            {
                label: 'MENU.CONTACTS',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'MENU.ORGANIZATIONS', routerLink: ['/contacts/organizations'] },
                    { label: 'MENU.INDIVIDUALS', routerLink: ['/contacts/individual'] }
                ]
            },
            { separator: true },
            {
                label: 'MENU.LEAD_MANAGEMENT',
                icon: 'pi pi-fw pi-sitemap',
                items: [
                    { label: 'MENU.DEALS_QUOTE', routerLink: ['/leadManagement/deals'] },
                    // { label: 'Quote', routerLink: ['/'] },
                    { label: 'MENU.CONTRACTS', routerLink: ['/'] },
                ]
            },
            { separator: true },
            {
                label: 'MENU.ACTIVEWORK',

                icon: 'pi pi-fw pi-stopwatch',
                items: [
                    { label: 'MENU.TEAM_SCHEDULE', routerLink: ['/'] },
                    { label: 'MENU.TIME_TRACKING', routerLink: ['/'] },
                    { label: 'MENU.INVOICE', routerLink: ['/'] },
                ]
            },
            { separator: true },
            {
                label: 'MENU.PAYMENTTS',
                icon: 'pi pi-fw pi-money-bill',
                items: [
                    { label: 'MENU.RECONCILLATION', routerLink: ['/'] },
                    { label: 'MENU.REMINDERS', routerLink: ['/'] }
                ]
            },
            { separator: true },
            {
                label: 'MENU.INSIGHTS_ANALYTICS',
                icon: 'pi pi-fw pi-bolt',
                items: [
                    { label: 'MENU.CUSTOMER_SURVEY', routerLink: ['/'] },
                    { label: 'MENU.EMPLOYEE_SURVEY', routerLink: ['/'] },
                    { label: 'MENU.REPORTING', routerLink: ['/'] },
                ]
            },
            { separator: true },
            {
                label: 'MENU.BUSINESS_ADMINISTRATION',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { label: 'MENU.GOVERNMENT_REGULATIONS', routerLink: ['/'] },
                    { label: 'MENU.USER_MANAGEMENT', routerLink: ['/'] },
                    { label: 'MENU.TEAM_MANAGEMENT', routerLink: ['/'] }
                ]
            }
        ];
    }
}
