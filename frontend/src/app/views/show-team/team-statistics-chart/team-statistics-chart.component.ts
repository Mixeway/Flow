import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ProgressComponent,
  RowComponent,
  TemplateIdDirective,
  WidgetStatCComponent
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import {IconComponent, IconDirective} from '@coreui/icons-angular';
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
    WidgetStatCComponent,
    TemplateIdDirective,
    ProgressComponent,
    IconComponent,
    IconDirective
  ],
  templateUrl: './team-statistics-chart.component.html',
  styleUrls: ['./team-statistics-chart.component.scss']
})
export class TeamStatisticsChartComponent {
  @Input() chartLineData: ChartData | undefined;
  @Input() options2: ChartOptions<'line'> | undefined;
  @Input() openedFindings: number | string = 0;
  @Input() removedFindings: number | string = 0;
  @Input() reviewedFindings: number | string = 0;
  @Input() fixTime: number | string = 0;

  @Output() refreshDataEvent = new EventEmitter<void>();

  refreshData(): void {
    this.refreshDataEvent.emit();
  }
}