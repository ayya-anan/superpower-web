import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', loadChildren: () => import('./main/main.dashboard.module').then(m => m.MainDashboardModule) }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
