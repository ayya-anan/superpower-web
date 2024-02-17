import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { CallbackComponent } from './components/callback/callback.component';
import { AuthGuard } from './AuthGuard.service';


const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        children: [
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'dashboard', data: { breadcrumb: 'Dashboard' }, loadChildren: () => import('./components/dashboards/dashboards.module').then(m => m.DashboardsModule) },
            { path: 'contacts', data: { breadcrumb: 'COMMON.CONTACTS' }, loadChildren: () => import('./components/contacts/contacts.module').then(m => m.ContactsModule) },
            { path: 'leadManagement', data: { breadcrumb: 'COMMON.LEAD_MANAGEMENT' }, loadChildren: () => import('./components/leadManagement/leadManagement.module').then(m => m.LeadManagementModule) },
            { path: 'activeWork', data: { breadcrumb: 'COMMON.LEAD_MANAGEMENT' }, loadChildren: () => import('./components/activeWork/activeWork.module').then(m => m.ActiveWorkModule) },
            { path: 'businessAdministration', data: { breadcrumb: 'COMMON.LEAD_MANAGEMENT' }, loadChildren: () => import('./components/businessAdministration/businessAdministration.module').then(m => m.BusinessAdministrationModule) },
        ]
    },
    { path: 'callback', component: CallbackComponent },
    //{ path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'notfound', loadChildren: () => import('./components/notfound/notfound.module').then(m => m.NotfoundModule) },

    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
