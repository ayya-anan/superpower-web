import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'deals', data: { breadcrumb: 'MENU.DEALS_QUOTE' }, loadChildren: () => import('./deals/deals.module').then(m => m.DealsModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class LeadManagementRoutingModule { }
