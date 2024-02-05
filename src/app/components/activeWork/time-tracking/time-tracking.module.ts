import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeTrackingRoutingModule } from './time-tracking-routing.module';
import { TimeTrackingComponent } from './time-tracking.component';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';
import { TimeRangeModule } from 'src/app/commonModules/time-range/time-range.module';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { AllTableModule } from 'src/app/commonModules/table/table.Module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		InputNumberModule,
		CalendarModule,
		ReactiveFormsModule,
		TimeTrackingRoutingModule,
		TimeRangeModule,
		FieldsetModule,
		AllTableModule,
		AppTranslateChildModule
	],
	declarations: [TimeTrackingComponent]
})
export class TimeTrackingModule { }
