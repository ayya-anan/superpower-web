import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'schedule', data: { breadcrumb: 'Task Allocation' }, loadChildren: () => import('./team-schedule/team-schedule.module').then(m => m.TeamScheduleModule) },
        { path: 'tracking', data: { breadcrumb: 'Time Tracking' }, loadChildren: () => import('./time-tracking/time-tracking.module').then(m => m.TimeTrackingModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ActiveWorkRoutingModule { }
