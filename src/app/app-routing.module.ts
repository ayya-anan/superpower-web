import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './coreModule/notfound/notfound.component';
import { AppLayoutComponent } from "./coreModule/layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', redirectTo: '/contacts' ,pathMatch:'full'},
                    { path: 'contacts', loadChildren: () => import('./appModule/contacts/contacts.module').then(m => m.ContactsModule) },
                ]
            },
            { path: 'auth', loadChildren: () => import('./authModule/auth.module').then(m => m.AuthModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
