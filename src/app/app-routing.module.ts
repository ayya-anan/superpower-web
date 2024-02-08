import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { CallbackComponent } from './components/callback/callback.component';
import { AuthorizationGuard } from './authorization.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,   
        canActivate: [AutoLoginPartialRoutesGuard],
        children: [
            { path: '',  redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'dashboard',canLoad: [AutoLoginPartialRoutesGuard], data: { breadcrumb: 'Dashboard' }, loadChildren: () => import('./components/dashboards/dashboards.module').then(m => m.DashboardsModule) },
            { path: 'contacts',canLoad: [AutoLoginPartialRoutesGuard],  data: { breadcrumb: 'COMMON.CONTACTS' }, loadChildren: () => import('./components/contacts/contacts.module').then(m => m.ContactsModule) },
            { path: 'leadManagement',canLoad: [AutoLoginPartialRoutesGuard],  data: { breadcrumb: 'Lead Management' }, loadChildren: () => import('./components/leadManagement/leadManagement.module').then(m => m.LeadManagementModule) },
            { path: 'activeWork',canLoad: [AutoLoginPartialRoutesGuard],  data: { breadcrumb: 'Active Work' }, loadChildren: () => import('./components/activeWork/activeWork.module').then(m => m.ActiveWorkModule) },
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
