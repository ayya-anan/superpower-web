import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

interface MonthlyPayment {
    name?: string;
    amount?: number;
    paid?: boolean;
    date?: string;
}

@Component({
    templateUrl: './main.dashboard.component.html',
})
export class MainDashboardComponent implements OnInit, OnDestroy {
    metrics: any = [];

    transactions: any = [];

    expenses: any = [];

    barData: any;

    barOptions: any;

    subscription!: Subscription;

    items: MenuItem[] = [];

    constructor(private layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.metrics = [
            {
                title: 'Invoice',
                profit: '+8%',
                amount: '$12,345.67',
                description: 'vs last week',
                image: 'banking-1',
            },
            {
                title: 'Quote',
                profit: '+3%',
                amount: '$12,345.67',
                description: 'vs last week',
                image: 'banking-2',
            },
            {
                title: 'Payment',
                profit: '+8%',
                amount: '$12,345.67',
                description: 'vs last week',
                image: 'banking-3',
            },
            {
                title: 'Due Balance',
                profit: '+8%',
                amount: '$12,345.67',
                description: 'vs last week',
                image: 'banking-3',
            },
        ];
        this.expenses = [
            {
                title: 'Pending',
                value: '79',
                amount: '$702.00',
                background:
                    'linear-gradient(-120deg, rgba(77, 182, 172, 1), rgba(77, 182, 172, 0.3) 70%)',
            },
            {
                title: 'Unpaid',
                value: '62',
                amount: '$421.60',
                background:
                    'linear-gradient(-120deg, rgba(77, 182, 172, 1), rgba(77, 182, 172, 0.3) 70%)',
            },
            {
                title: 'Overdue',
                value: '45',
                amount: '$388.51',
                background:
                    'linear-gradient(-120deg, rgba(250, 183, 16, 1), rgba(250, 183, 16, 0.3) 70%)',
            },
            {
                title: 'Partially',
                value: '41',
                amount: '$295.72',
                background:
                    'linear-gradient(-120deg, rgba(250, 183, 16, 1), rgba(250, 183, 16, 0.3) 70%)',
            },
            {
                title: 'Paid',
                value: '35',
                amount: '$170.05',
                background:
                    'linear-gradient(-120deg, rgba(198, 55, 55, 1), rgba(198, 55, 55, 0.3) 70%)',
            },
            {
                title: 'Due',
                value: '23',
                amount: '$96.80',
                background:
                    'linear-gradient(-120deg, rgba(198, 55, 55, 1), rgba(198, 55, 55, 0.3) 70%)',
            },
        ];

        this.items = [
            {
                label: 'View Details',
            },
            {
                label: 'Print Receipt',
            },
            {
                label: 'Hide',
            },
        ];

        this.initChart();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.barData = {
            labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'],
            datasets: [
                {
                    label: 'Revenue',
                    backgroundColor:
                        documentStyle.getPropertyValue('--primary-500'),
                    barThickness: 12,
                    borderRadius: 12,
                    data: [65, 59, 80, 81, 56, 55, 40],
                },
                {
                    label: 'Expenses',
                    backgroundColor: '#FAB918',
                    barThickness: 12,
                    borderRadius: 12,
                    data: [35, 19, 40, 61, 16, 55, 30],
                },
            ],
        };

        this.barOptions = {
            animation: {
                duration: 0,
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {
                            weight: 700,
                        },
                        padding: 28,
                    },
                    position: 'top',
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        callback(value: number) {
                            return '$' + value + 'k';
                        },
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    show(el: HTMLElement) {
        el.classList.remove('hidden');
        el.classList.add('fadeindown');
    }

    hide(el: HTMLElement) {
        el.classList.add('hidden');
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
