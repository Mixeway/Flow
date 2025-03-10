import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class InfosComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() teams: number = 0;
  @Input() allProjects: number = 0;
  @Input() affectedProjects: number = 0;
  @Input() openedVulns: number = 0;

  // Optional trend inputs - these would come from parent components in a real implementation
  @Input() repositoriesTrend: number = 5; // % change in repositories
  @Input() teamsTrend: number = 3; // % change in teams
  @Input() vulnChange: number = 12; // % change in vulnerabilities
  @Input() riskChange: number = -8; // % change in risk (negative means improvement)

  // Theme detection - integrate with your theme service if you have one
  @Input() theme: 'light' | 'dark' = 'dark';

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

  ngOnInit(): void {
    this.detectTheme();
  }

  ngAfterViewInit(): void {
    this.calculatePercentage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePercentage();

    // Update theme if changed
    if (changes['theme']) {
      this.updateThemeClass();
    }
  }

  /**
   * Detect current theme from CoreUI if possible,
   * otherwise use system preference
   */
  private detectTheme(): void {
    // You can integrate with your existing theme service here
    // This is a basic implementation that checks for dark mode preference

    // Check if CoreUI has a theme class on the body or html element
    const hasLightThemeClass = document.documentElement.classList.contains('light-theme') ||
        document.body.classList.contains('light-theme') ||
        document.documentElement.getAttribute('data-coreui-theme') === 'light';

    const hasDarkThemeClass = document.documentElement.classList.contains('dark-theme') ||
        document.body.classList.contains('dark-theme') ||
        document.documentElement.getAttribute('data-coreui-theme') === 'dark';

    if (hasLightThemeClass) {
      this.theme = 'light';
    } else if (hasDarkThemeClass) {
      this.theme = 'dark';
    } else {
      // Use system preference as fallback
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme = prefersDarkMode ? 'dark' : 'light';
    }

    this.updateThemeClass();
  }

  /**
   * Apply the appropriate theme class to the root element
   */
  private updateThemeClass(): void {
    if (this.theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }
}