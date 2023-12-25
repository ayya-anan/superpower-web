import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/coreService/app.layout.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class DashboardComponent implements OnInit, OnDestroy {

    customerValue: any= 7;

    items!: MenuItem[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}