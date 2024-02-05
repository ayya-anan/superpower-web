import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TeamScheduleComponent } from './team-schedule.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TeamScheduleComponent },

	])],
	exports: [RouterModule]
})
export class TeamScheduleRoutingModule { }
