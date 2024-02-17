import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'userManagement', data: { breadcrumb: 'User Management' }, loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class BusinessAdministrationRoutingModule { }
