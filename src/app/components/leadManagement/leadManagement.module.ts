import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';
import { LeadManagementRoutingModule } from './leadManagement-routing.module';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
	imports: [
		CommonModule,
		AppTranslateChildModule,
		LeadManagementRoutingModule,
		NgxPrintModule
	]
})
export class LeadManagementModule { }
