import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { RouterLink } from '@angular/router';
import {
  RowComponent,
  ColComponent,
  WidgetStatAComponent,
  TemplateIdDirective,
  ThemeDirective,
  DropdownComponent,
  ButtonDirective,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  DropdownDividerDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import {IconDirective} from "@coreui/icons-angular";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  styleUrls: ['./widgets-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    WidgetStatAComponent,
    TemplateIdDirective,
    ThemeDirective,
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    RouterLink,
    DropdownDividerDirective,
    ChartjsComponent,
    IconDirective,
    NgIf
  ]
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {
  @Input() stats: any;

  activeFindingsValue: string = '';
  activeFindingsPercentage: string = '';
  activeFindingsDirection: string = '';

  removedFindingsValue: string = '';
  removedFindingsPercentage: string = '';
  removedFindingsDirection: string = '';

  reviewedFindingsValue: string = '';
  reviewedFindingsPercentage: string = '';
  reviewedFindingsDirection: string = '';

  averageFixTimeValue: string = '';
  averageFixTimePercentage: string = '';
  averageFixTimeDirection: string = '';

  data: any[] = [];
  options: any[] = [];

  optionsDefault = {
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        min: 30,
        max: 89,
        display: false,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      }
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  };

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.processStats();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  processStats() {
    if (this.stats && this.stats.activeFindings && this.stats.activeFindings.length > 0) {
      const activeFindings = this.stats.activeFindings.sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const activeChange = this.calculatePercentageChange(activeFindings);
      this.activeFindingsValue = this.formatNumber(activeFindings[activeFindings.length - 1].findings);
      this.activeFindingsPercentage = activeChange.percentage;
      this.activeFindingsDirection = activeChange.direction;
    } else {
      this.activeFindingsValue = '0';
      this.activeFindingsPercentage = '';
      this.activeFindingsDirection = '';
    }

    if (this.stats && this.stats.removedFindingsList && this.stats.removedFindingsList.length > 0) {
      const removedFindings = this.stats.removedFindingsList.sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const removedChange = this.calculatePercentageChange(removedFindings);
      this.removedFindingsValue = this.formatNumber(removedFindings[removedFindings.length - 1].findings);
      this.removedFindingsPercentage = removedChange.percentage;
      this.removedFindingsDirection = removedChange.direction;
    } else {
      this.removedFindingsValue = '0';
      this.removedFindingsPercentage = '';
      this.removedFindingsDirection = '';
    }

    if (this.stats && this.stats.reviewedFindingsList && this.stats.reviewedFindingsList.length > 0) {
      const reviewedFindings = this.stats.reviewedFindingsList.sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const reviewedChange = this.calculatePercentageChange(reviewedFindings);
      this.reviewedFindingsValue = this.formatNumber(reviewedFindings[reviewedFindings.length - 1].findings);
      this.reviewedFindingsPercentage = reviewedChange.percentage;
      this.reviewedFindingsDirection = reviewedChange.direction;
    } else {
      this.reviewedFindingsValue = '0';
      this.reviewedFindingsPercentage = '';
      this.reviewedFindingsDirection = '';
    }

    if (this.stats && this.stats.averageFixTimeList && this.stats.averageFixTimeList.length > 0) {
      const averageFixTime = this.stats.averageFixTimeList.sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const averageFixTimeChange = this.calculatePercentageChange(averageFixTime);
      this.averageFixTimeValue = this.formatNumber(averageFixTime[averageFixTime.length - 1].findings);
      this.averageFixTimePercentage = averageFixTimeChange.percentage;
      this.averageFixTimeDirection = averageFixTimeChange.direction;
    } else {
      this.averageFixTimeValue = '0';
      this.averageFixTimePercentage = '';
      this.averageFixTimeDirection = '';
    }

    this.updateChartData();
  }

  calculatePercentageChange(data: any[]): { percentage: string, direction: string } {
    const firstValue = data[0].findings;
    const lastValue = data[data.length - 1].findings;
    const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
    const direction = lastValue >= firstValue ? 'cilArrowTop' : 'cilArrowBottom';
    return {
      percentage: percentageChange.toFixed(1) + '%',
      direction: direction
    };
  }

  formatNumber(value: number): string {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }

  updateChartData() {
    const defaultLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.data[0] = {
      labels: this.stats.activeFindings.length ? this.stats.activeFindings.map((item: any) => item.date) : defaultLabels.slice(0, 7),
      datasets: [{
        label: 'Active Vulnerabilities',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-primary'),
        pointHoverBorderColor: getStyle('--cui-primary'),
        data: this.stats.activeFindings.length ? this.stats.activeFindings.map((item: any) => item.findings) : Array(7).fill(0)
      }]
    };

    this.data[1] = {
      labels: this.stats.removedFindingsList.length ? this.stats.removedFindingsList.map((item: any) => item.date) : defaultLabels.slice(0, 7),
      datasets: [{
        label: 'Vulnerabilities Removed',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-info'),
        pointHoverBorderColor: getStyle('--cui-info'),
        data: this.stats.removedFindingsList.length ? this.stats.removedFindingsList.map((item: any) => item.findings) : Array(7).fill(0)
      }]
    };

    this.data[2] = {
      labels: this.stats.reviewedFindingsList.length ? this.stats.reviewedFindingsList.map((item: any) => item.date) : defaultLabels.slice(0, 7),
      datasets: [{
        label: 'Vulnerabilities Reviewed',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-warning'),
        pointHoverBorderColor: getStyle('--cui-warning'),
        data: this.stats.reviewedFindingsList.length ? this.stats.reviewedFindingsList.map((item: any) => item.findings) : Array(7).fill(0),
        fill: true
      }]
    };

    this.data[3] = {
      labels: this.stats.averageFixTimeList.length ? this.stats.averageFixTimeList.map((item: any) => item.date) : defaultLabels.slice(0, 7),
      datasets: [{
        label: 'Average Fix Time',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        data: this.stats.averageFixTimeList.length ? this.stats.averageFixTimeList.map((item: any) => item.findings) : Array(7).fill(0),
        barPercentage: 0.7
      }]
    };

    this.setOptions();
  }

  setOptions() {
    this.options = [];  // Reset options array
    for (let idx = 0; idx < 4; idx++) {
      const options = JSON.parse(JSON.stringify(this.optionsDefault));
      switch (idx) {
        case 0: {
          this.options.push(options);
          break;
        }
        case 1: {
          options.scales.y.min = -9;
          options.scales.y.max = 39;
          options.elements.line.tension = 0;
          this.options.push(options);
          break;
        }
        case 2: {
          options.scales.x = { display: false };
          options.scales.y = { display: false };
          options.elements.line.borderWidth = 2;
          options.elements.point.radius = 0;
          this.options.push(options);
          break;
        }
        case 3: {
          options.scales.x.grid = { display: false, drawTicks: false, drawBorder: false };
          options.scales.y.min = undefined;
          options.scales.y.max = undefined;
          options.elements = {};
          this.options.push(options);
          break;
        }
      }
    }
  }
}
