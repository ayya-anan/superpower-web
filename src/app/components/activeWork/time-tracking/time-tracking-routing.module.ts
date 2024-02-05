import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimeTrackingComponent } from './time-tracking.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TimeTrackingComponent },

	])],
	exports: [RouterModule]
})
export class TimeTrackingRoutingModule { }
