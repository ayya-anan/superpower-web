import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'userManagement', data: { breadcrumb: 'MENU.USER_MANAGEMENT' }, loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule) },
        { path: 'serviceSettings', data: { breadcrumb: 'MENU.SERVICES' }, loadChildren: () => import('./service-settings/service-settings.module').then(m => m.ServiceSettingsModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class BusinessAdministrationRoutingModule { }
