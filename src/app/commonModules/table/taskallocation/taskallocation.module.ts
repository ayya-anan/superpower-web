import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TaskallocationComponent } from './taskallocation.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MultiSelectModule,
		TableModule,
		DropdownModule,
		CalendarModule,
		ButtonModule,
		ToastModule,
		AppTranslateChildModule
	],
	declarations: [TaskallocationComponent],
    exports: [TaskallocationComponent],
})
export class TaskAlloactionModule { }
