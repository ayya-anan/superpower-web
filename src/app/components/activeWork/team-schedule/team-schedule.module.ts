import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamScheduleRoutingModule } from './team-schedule-routing.module';
import { TeamScheduleComponent } from './team-schedule.component';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';
import { AllTableModule } from 'src/app/commonModules/table/table.Module';
import { SidebarModule } from 'primeng/sidebar';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { TimeRangeModule } from 'src/app/commonModules/time-range/time-range.module';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TeamScheduleRoutingModule,
		AppTranslateChildModule,
		AllTableModule,
		SidebarModule,
		FieldsetModule,
		DropdownModule,
		CalendarModule,
		InputNumberModule,
		DialogModule,
		InputSwitchModule,
		DividerModule,
		TableModule,
		TimeRangeModule,
		ToastModule
	],
	declarations: [TeamScheduleComponent]
})
export class TeamScheduleModule { }
