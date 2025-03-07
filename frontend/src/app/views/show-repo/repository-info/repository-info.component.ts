import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  ProgressComponent,
  RowComponent,
  SpinnerComponent,
  TooltipDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChartjsComponent } from "@coreui/angular-chartjs";

@Component({
  selector: 'app-repository-info',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    CardFooterComponent,
    ButtonDirective,
    IconDirective,
    SpinnerComponent,
    ProgressComponent,
    NgIf,
    NgFor,
    TooltipDirective,
    CardHeaderComponent,
    ChartjsComponent,
    DatePipe,
  ],
  templateUrl: './repository-info.component.html',
  styleUrls: ['./repository-info.component.scss']
})
export class RepositoryInfoComponent implements OnInit {
  @Input() repoData: any;
  @Input() scanRunning: boolean = false;
  @Input() userRole: string = 'USER';
  @Input() topLanguages: { name: string; value: number; color: string }[] = [];
  @Input() chartPieData: any;
  @Input() options: any = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        bodyFont: {
          size: 13
        },
        padding: 10
      }
    },
    cutout: '60%'
  };

  @Output() runScanEvent = new EventEmitter<void>();
  @Output() openChangeTeamModalEvent = new EventEmitter<void>();

  ngOnInit(): void {
    // Enhance chart options with better defaults
    this.options = {
      ...this.options,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          bodyFont: {
            size: 13
          },
          padding: 10
        }
      },
      cutout: '60%'
    };
  }

  runScan(): void {
    this.runScanEvent.emit();
  }

  openChangeTeamModal(): void {
    this.openChangeTeamModalEvent.emit();
  }
}