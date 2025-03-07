import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TooltipDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-team-statistics-chart',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ChartjsComponent,
    IconDirective,
    TooltipDirective
  ],
  templateUrl: './team-statistics-chart.component.html',
  styleUrls: ['./team-statistics-chart.component.scss']
})
export class TeamStatisticsChartComponent implements OnInit {
  @Input() chartLineData: ChartData | undefined;
  @Input() options2: ChartOptions<'line'> | undefined;
  @Input() openedFindings: number | string = 0;
  @Input() removedFindings: number | string = 0;
  @Input() reviewedFindings: number | string = 0;
  @Input() fixTime: number | string = 0;

  @Output() refreshDataEvent = new EventEmitter<void>();

  isRefreshing: boolean = false;
  chartOptions: ChartOptions<'line'> = {};

  ngOnInit(): void {
    this.initializeChartOptions();
  }

  initializeChartOptions(): void {
    // Use the provided options or set defaults
    if (this.options2) {
      this.chartOptions = this.options2;
    } else {
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            bodyFont: {
              size: 12
            },
            titleFont: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            suggestedMin: 0,
            ticks: {
              precision: 0
            }
          }
        },
        elements: {
          line: {
            tension: 0.4, // Smoother curves
            borderWidth: 2
          },
          point: {
            radius: 3,
            hoverRadius: 5,
            borderWidth: 2,
            backgroundColor: 'white'
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      };
    }
  }

  refreshData(): void {
    this.isRefreshing = true;
    this.refreshDataEvent.emit();

    // Reset refreshing state after a short delay
    setTimeout(() => {
      this.isRefreshing = false;
    }, 1000);
  }
}