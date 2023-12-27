import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'individual', data: { breadcrumb: 'Individual' }, loadChildren: () => import('./individual/individual.module').then(m => m.IndividualModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ContactsRoutingModule { }
