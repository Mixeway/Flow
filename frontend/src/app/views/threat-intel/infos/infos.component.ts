import { Component, Input, OnChanges } from '@angular/core';
import { ColComponent, RowComponent } from "@coreui/angular";
import {
  cilBug,
  cilChart,
  cilChartPie,
  cilPeople
} from "@coreui/icons";
import { IconDirective } from "@coreui/icons-angular";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-infos',
  standalone: true,
  imports: [
    ColComponent,
    IconDirective,
    RowComponent,
    DecimalPipe
  ],
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.scss']
})
export class InfosComponent implements OnChanges {
  @Input() teams: number = 0;
  @Input() allProjects: number = 0;
  @Input() affectedProjects: number = 0;
  @Input() openedVulns: number = 0;

  percentage: string = '0';

  icons = {
    cilChartPie,
    cilBug,
    cilChart,
    cilPeople
  };

  calculatePercentage() {
    const allProjects = this.allProjects ?? 0;
    const affectedProjects = this.affectedProjects ?? 0;

    if (allProjects > 0) {
      this.percentage = ((affectedProjects / allProjects) * 100).toFixed(0);
    } else {
      this.percentage = '0';
    }
  }

  ngOnChanges(): void {
    this.calculatePercentage();
  }
}
