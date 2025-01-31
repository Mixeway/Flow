import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent } from '@coreui/angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
    ApexChart,
    ApexFill,
    ApexGrid,
    ApexPlotOptions,
    ApexNonAxisChartSeries
} from 'ng-apexcharts';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    grid: ApexGrid;
    labels: string[];
};


@Component({
    selector: 'app-threat-score',
    standalone: true,
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        NgApexchartsModule
    ],
    templateUrl: './threat-score.component.html',
    styleUrls: ['./threat-score.component.scss']
})
export class ThreatScoreComponent implements OnChanges {
    @Input()
    threatScore: string = '';
    public chartOptions: ChartOptions;

    constructor() {
        this.chartOptions = {
            series: [0], // Initialize with 0
            chart: {
                type: 'radialBar',
                offsetY: -20,
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: '#86df68',
                        strokeWidth: '97%',
                        margin: 5,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            offsetY: -2,
                            fontSize: '22px'
                        }
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    shadeIntensity: 0.4,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91]
                }
            },
            grid: {
                padding: {
                    top: -10
                }
            },
            labels: ['Threat Score']
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['threatScore']) {
            this.updateChartOptions();
        }
    }

    updateChartOptions() {
        // Convert threatScore to a number and update series
        const score = Number(this.threatScore) || 0;
        let color: string = '';
        if (score > 80) {
            color = '#e60303';
        } else if (score > 60) {
            color = '#e34848';
        } else if (score > 40) {
            color = '#e47a3a';
        } else if (score > 20) {
            color = '#bedf76';
        } else {
            color = '#55ec32';
        }

        // Update only the necessary properties
        this.chartOptions = {
            ...this.chartOptions,
            series: [score],
            fill: {
                ...this.chartOptions.fill,
                colors: [color]
            }
        };
    }
}
