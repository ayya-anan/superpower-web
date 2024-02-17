import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';
import { BusinessAdministrationRoutingModule } from './businessAdministration-routing.module';

@NgModule({
	imports: [
		CommonModule,
		AppTranslateChildModule,
		BusinessAdministrationRoutingModule,
	]
})
export class BusinessAdministrationModule { }
