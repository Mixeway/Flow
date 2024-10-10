import { Component } from '@angular/core';
import {CardBodyComponent, CardComponent, CardHeaderComponent} from "@coreui/angular";
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
  styleUrl: './threat-score.component.scss'
})
export class ThreatScoreComponent {
    public chartOptions: Partial<ChartOptions>;

    constructor() {
        // @ts-ignore
        this.chartOptions = {
            series: [20], // Replace with your data
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
                        background: '#e7e7e7',
                        strokeWidth: '97%',
                        margin: 5, // Margin is in pixels
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

}
