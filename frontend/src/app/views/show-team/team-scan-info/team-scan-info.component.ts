import { Component, Input } from '@angular/core';
import {
  BadgeComponent,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  SpinnerComponent
} from '@coreui/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-scan-info',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    SpinnerComponent,
    NgxDatatableModule,
    BadgeComponent,
    DatePipe,
    NgIf,
    FormsModule
  ],
  templateUrl: './team-scan-info.component.html',
  styleUrls: ['./team-scan-info.component.scss']
})
export class TeamScanInfoComponent {
  @Input() scanInfoLoading: boolean = false;
  @Input() allScanInfos: any[] = [];
  @Input() scanInfoLimit: number = 15;
}