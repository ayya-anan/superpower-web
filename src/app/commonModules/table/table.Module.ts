import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TableComponent } from './table.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MultiSelectModule,
		TableModule,
		AppTranslateChildModule
	],
	declarations: [TableComponent],
    exports: [TableComponent],
})
export class AllTableModule { }
