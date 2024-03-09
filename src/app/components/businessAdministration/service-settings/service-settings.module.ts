import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllTableModule } from 'src/app/commonModules/table/table.Module';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';
import { InputTextModule } from 'primeng/inputtext';
import { ServiceSettingsRoutingModule } from './service-settings.routing.module';
import { ServiceSettingsComponent } from './service-settings.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ServiceSettingsRoutingModule,
		AllTableModule,
		ToolbarModule,
		ButtonModule,
		InputTextModule,
		AppTranslateChildModule,
		DropdownModule,
		ReactiveFormsModule,
		InputNumberModule,
		InputTextModule,
		CalendarModule,
		CardModule
	],
	declarations: [ServiceSettingsComponent]
})
export class ServiceSettingsModule { }
