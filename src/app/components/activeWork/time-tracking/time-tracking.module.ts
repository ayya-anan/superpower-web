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
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { KnobModule } from 'primeng/knob';
import { DividerModule } from 'primeng/divider';

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
		TimeRangeModule,
		CardModule,
		DropdownModule,
		InputTextModule,
		TableModule,
		KnobModule,
		DividerModule,
		AppTranslateChildModule
	],
	declarations: [TimeTrackingComponent]
})
export class TimeTrackingModule { }
