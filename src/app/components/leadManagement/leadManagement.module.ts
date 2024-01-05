import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';
import { LeadManagementRoutingModule } from './leadManagement-routing.module';

@NgModule({
	imports: [
		CommonModule,
		AppTranslateChildModule,
		LeadManagementRoutingModule
	]
})
export class LeadManagementModule { }
