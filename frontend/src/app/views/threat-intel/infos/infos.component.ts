import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  BadgeComponent,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  RowComponent,
  TemplateIdDirective,
  WidgetStatFComponent
} from "@coreui/angular";
import {
  cilArrowRight,
  cilBug,
  cilChart,
  cilChartPie,
  cilPeople,
  cilArrowTop,
  cilArrowBottom
} from "@coreui/icons";
import { IconDirective } from "@coreui/icons-angular";
import { NgIf, NgClass, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-infos',
  standalone: true,
  imports: [
    CardComponent,
    CardBodyComponent,
    ColComponent,
    WidgetStatFComponent,
    IconDirective,
    TemplateIdDirective,
    RowComponent,
    NgIf,
    NgClass,
    DecimalPipe
  ],
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.scss']
})
export class InfosComponent implements AfterViewInit, OnChanges {
  @Input() teams: number = 0;
  @Input() allProjects: number = 0;
  @Input() affectedProjects: number = 0;
  @Input() openedVulns: number = 0;

  // Optional trend inputs - these would come from parent components in a real implementation
  @Input() repositoriesTrend: number = 5; // % change in repositories
  @Input() teamsTrend: number = 3; // % change in teams
  @Input() vulnChange: number = 12; // % change in vulnerabilities
  @Input() riskChange: number = -8; // % change in risk (negative means improvement)

  percentage: string = '0';

  // Computed properties for UI display
  get absVulnChange(): number {
    return Math.abs(this.vulnChange);
  }

  get absRiskChange(): number {
    return Math.abs(this.riskChange);
  }

  icons = {
    cilChartPie,
    cilArrowRight,
    cilBug,
    cilChart,
    cilPeople,
    cilArrowTop,
    cilArrowBottom
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

  ngAfterViewInit(): void {
    this.calculatePercentage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePercentage();
  }
}