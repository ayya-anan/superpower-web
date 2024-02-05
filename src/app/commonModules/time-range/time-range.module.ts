import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeRangeComponent } from './time-range.component';
import { AppTranslateChildModule } from 'src/app/coreModules/app.translate.child.module';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		AppTranslateChildModule
	],
	declarations: [TimeRangeComponent],
    exports: [TimeRangeComponent],
})
export class TimeRangeModule { }
