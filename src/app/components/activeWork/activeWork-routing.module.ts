import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'schedule', data: { breadcrumb: 'MENU.TEAM_SCHEDULE' }, loadChildren: () => import('./team-schedule/team-schedule.module').then(m => m.TeamScheduleModule) },
        { path: 'tracking', data: { breadcrumb: 'MENU.TIME_TRACKING' }, loadChildren: () => import('./time-tracking/time-tracking.module').then(m => m.TimeTrackingModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ActiveWorkRoutingModule { }
