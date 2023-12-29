import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrganizationsComponent } from './organizations.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: OrganizationsComponent },

	])],
	exports: [RouterModule]
})
export class OrganizationsRoutingModule { }
