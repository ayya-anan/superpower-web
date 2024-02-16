import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllTableModule } from 'src/app/commonModules/table/table.Module';
import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management.routing.module';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		UserManagementRoutingModule,
		AllTableModule,
		ToolbarModule,
		ButtonModule,
		InputTextModule,
		AppTranslateChildModule
	],
	declarations: [UserManagementComponent]
})
export class UserManagementModule { }
