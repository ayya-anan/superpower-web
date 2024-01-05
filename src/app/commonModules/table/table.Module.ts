import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TableComponent } from './table.component';
import { MultiSelectModule } from 'primeng/multiselect';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MultiSelectModule,
		TableModule
	],
	declarations: [TableComponent],
    exports: [TableComponent],
})
export class AllTableModule { }
