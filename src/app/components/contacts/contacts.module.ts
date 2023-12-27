import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsRoutingModule } from './contacts-routing.module';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';

@NgModule({
	imports: [
		CommonModule,
		AppTranslateChildModule,
		ContactsRoutingModule
	]
})
export class ContactsModule { }
