import { Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { LeadsComponent } from './leads/leads.component';
import { PaymentsComponent } from './payments/payments.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [{ path: '', redirectTo: '/contacts', pathMatch: 'full' },
{ path: 'contacts', component: ContactsComponent },
{ path: 'invoices', component: InvoicesComponent  },
{ path: 'leads', component: LeadsComponent },
{ path: 'payments', component: PaymentsComponent },
{ path: 'settings', component: SettingsComponent },
{ path: 'profile', component: ProfileComponent }];
