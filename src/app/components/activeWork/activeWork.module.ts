import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';
import { ActiveWorkRoutingModule } from './activeWork-routing.module';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
	imports: [
		CommonModule,
		AppTranslateChildModule,
		ActiveWorkRoutingModule,
		NgxPrintModule
	]
})
export class ActiveWorkModule { }
