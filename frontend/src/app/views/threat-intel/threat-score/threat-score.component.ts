import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent
} from '@coreui/angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
    ApexChart,
    ApexFill,
    ApexGrid,
    ApexPlotOptions,
    ApexNonAxisChartSeries,
    ApexStroke
} from 'ng-apexcharts';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    grid: ApexGrid;
    labels: string[];
    stroke?: ApexStroke;
};

@Component({
    selector: 'app-threat-score',
    standalone: true,
    imports: [
        CommonModule,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        BadgeComponent,
        NgApexchartsModule
    ],
    templateUrl: './threat-score.component.html',
    styleUrls: ['./threat-score.component.scss']
})
export class ThreatScoreComponent implements OnChanges {
    @Input() threatScore: string = '';

    public chartOptions: ChartOptions;
    public threatLevelText: string = '';
    public threatLevelColor: string = '';
    public threatDescription: string = '';

    constructor() {
        this.chartOptions = {
            series: [0],
            chart: {
                type: 'radialBar',
                height: 160,
                fontFamily: 'inherit',
                animations: {
                    enabled: true,
                    speed: 800
                },
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    hollow: {
                        size: '50%'
                    },
                    track: {
                        background: '#e7e7e7',
                        strokeWidth: '97%',
                        margin: 5,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 0.3,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            offsetY: -2,
                            fontSize: '22px',
                            fontWeight: 'bold',
                            formatter: function(val) {
                                return val + '%';
                            }
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
            stroke: {
                lineCap: 'round'
            },
            grid: {
                padding: {
                    top: -10
                }
            },
            labels: ['Threat Level']
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['threatScore']) {
            this.updateChartOptions();
            this.updateThresholdInfo();
        }
    }

    updateChartOptions() {
        // Convert threatScore to a number and update series
        const score = Number(this.threatScore) || 0;
        let color: string = '';

        // Define color based on score
        if (score > 80) {
            color = '#e60303'; // Critical - Dark Red
            this.threatLevelColor = 'danger';
            this.threatLevelText = 'CRITICAL';
        } else if (score > 60) {
            color = '#e34848'; // High - Red
            this.threatLevelColor = 'danger';
            this.threatLevelText = 'HIGH';
        } else if (score > 40) {
            color = '#e47a3a'; // Medium - Orange
            this.threatLevelColor = 'warning';
            this.threatLevelText = 'MEDIUM';
        } else if (score > 20) {
            color = '#bedf76'; // Low - Light Green
            this.threatLevelColor = 'success';
            this.threatLevelText = 'LOW';
        } else {
            color = '#55ec32'; // Very Low - Green
            this.threatLevelColor = 'success';
            this.threatLevelText = 'VERY LOW';
        }

        // Update chart options
        this.chartOptions = {
            ...this.chartOptions,
            series: [score],
            fill: {
                ...this.chartOptions.fill,
                colors: [color]
            }
        };
    }

    updateThresholdInfo() {
        const score = Number(this.threatScore) || 0;

        // Set brief description based on score
        if (score > 80) {
            this.threatDescription = 'Critical security issues detected. Immediate action required.';
        } else if (score > 40) {
            this.threatDescription = 'Significant vulnerabilities detected. Attention needed.';
        } else if (score > 20) {
            this.threatDescription = 'Minor vulnerabilities present. Low risk level.';
        } else {
            this.threatDescription = 'Your systems appear to be well-secured.';
        }
    }

    // Helper method for template
    Number(value: string): number {
        return Number(value) || 0;
    }
}