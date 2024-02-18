import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', data: { breadcrumb: 'COMMON.ORGANIZATIONS' }, loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsModule) },
        { path: 'individual', data: { breadcrumb: 'COMMON.INDIVIDUAL' }, loadChildren: () => import('./individual/individual.module').then(m => m.IndividualModule) },
        { path: 'organizations', data: { breadcrumb: 'COMMON.ORGANIZATIONS' }, loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ContactsRoutingModule { }
