import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServiceSettingsComponent } from './service-settings.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ServiceSettingsComponent },

	])],
	exports: [RouterModule]
})

export class ServiceSettingsRoutingModule { }
