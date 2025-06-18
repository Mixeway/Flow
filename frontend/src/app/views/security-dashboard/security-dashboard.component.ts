import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  DoughnutChartData,
  LineChartData,
  RepositoryStats,
  TeamStats,
  VulnerabilitySummary,
  VulnerabilityTrendDataPoint
} from "../../model/stats.models";
import {StatsService} from "../../service/StatsService";
import {IconDirective} from "@coreui/icons-angular";
import {DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  SpinnerComponent,
  TableDirective,
  TooltipDirective
} from "@coreui/angular";
import {ChartjsComponent} from "@coreui/angular-chartjs";


@Component({
  selector: 'app-security-dashboard',
  templateUrl: './security-dashboard.component.html',
  standalone: true,
  imports: [
    IconDirective,
    NgIf,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    NgForOf,
    ChartjsComponent,
    DecimalPipe,
    NgClass,
    SpinnerComponent,
    TooltipDirective,
    ButtonDirective
  ],
  styleUrls: ['./security-dashboard.component.scss']
})
export class SecurityDashboardComponent implements OnInit {
  // Data containers
  summaryData: VulnerabilitySummary = {} as VulnerabilitySummary;
  trendData: VulnerabilityTrendDataPoint[] = [];
  topRepos: RepositoryStats[] = [];
  teamsSummary: TeamStats[] = [];

  // Chart data
  vulnerabilityTrendChartData: LineChartData | null = null;
  severityDistributionChartData: DoughnutChartData | null = null;
  sourceDistributionChartData: DoughnutChartData | null = null;
  statusDistributionChartData: DoughnutChartData | null = null;
  fixProgressChartData: LineChartData | null = null;

  // Loading states
  isLoading = true;

  // Filter states
  selectedTeamId: number | null = null;
  timeRange = 30; // Default to 30 days

  // Chart options
  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const, // Type as const to match expected literals
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false
      }
    },
    scales: {
      x: {
        grid: {
          drawOnChartArea: false,
          display: false, // Hide x-axis grid lines
          drawBorder: false // Hide axis line
        },
        ticks: {
          padding: 10 // Add padding to labels
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false, // Hide axis line
          color: 'rgba(0, 0, 0, 0.05)' // Very light grid lines
        },
        ticks: {
          padding: 10 // Add padding to labels
        }
      }
    },
    elements: {
      line: {
        tension: 0.4, // Makes the line smoother
      },
      point: {
        radius: 0, // Hide points for cleaner look
        hitRadius: 10 // Area that responds to hover
      }
    }
  };

  doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const, // Type as const to match expected literals
      }
    },
    cutout: '70%'
  };

  constructor(private statsService: StatsService) { }

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Clear chart data before reloading to prevent rendering artifacts
   */
  private clearChartData(): void {
    this.vulnerabilityTrendChartData = null;
    this.severityDistributionChartData = null;
    this.sourceDistributionChartData = null;
    this.statusDistributionChartData = null;
    this.fixProgressChartData = null;
  }

  /**
   * Load all dashboard data from the API
   */
  loadData(): void {
    this.isLoading = true;
    this.clearChartData(); // Clear existing charts to prevent artifacts

    // Load all data in parallel for better performance
    forkJoin({
      summary: this.statsService.getVulnerabilitySummary(this.selectedTeamId),
      trend: this.statsService.getVulnerabilityTrend(this.selectedTeamId, this.timeRange),
      topRepos: this.statsService.getTopVulnerableRepos(this.selectedTeamId, 10),
      teamsSummary: this.statsService.getTeamsSummary()
    }).subscribe({
      next: (results) => {
        this.summaryData = results.summary;
        this.trendData = results.trend;
        this.topRepos = results.topRepos;
        this.teamsSummary = results.teamsSummary;

        this.prepareChartData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Prepare all chart data based on the loaded API data
   */
  prepareChartData(): void {
    this.prepareVulnerabilityTrendChart();
    this.prepareSeverityDistributionChart();
    this.prepareSourceDistributionChart();
    this.prepareStatusDistributionChart();
    this.prepareFixProgressChart();
  }

  /**
   * Prepare data for the vulnerability trend chart
   */
  prepareVulnerabilityTrendChart(): void {
    // Sort data by date ascending
    this.trendData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Extract dates for labels
    const labels = this.trendData.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    // Create datasets for critical, high, medium, low vulnerabilities
    const criticalData = this.trendData.map(item =>
        (item.sastCritical || 0) + (item.scaCritical || 0) +
        (item.iacCritical || 0) + (item.secretsCritical || 0) +  (item.dastCritical || 0)
    );

    const highData = this.trendData.map(item =>
        (item.sastHigh || 0) + (item.scaHigh || 0) +
        (item.iacHigh || 0) + (item.secretsHigh || 0) +  (item.dastHigh || 0)
    );

    const mediumData = this.trendData.map(item =>
        (item.sastMedium || 0) + (item.scaMedium || 0) +
        (item.iacMedium || 0) + (item.secretsMedium || 0) + (item.dastMedium || 0)
    );

    const lowData = this.trendData.map(item =>
        (item.sastRest || 0) + (item.scaRest || 0) +
        (item.iacRest || 0) + (item.secretsRest || 0) +  (item.dastRest || 0)
    );

    this.vulnerabilityTrendChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Critical',
          data: criticalData,
          fill: false,
          borderColor: '#dc3545', // Red
          backgroundColor: '#dc3545',
          borderWidth: 2
        },
        {
          label: 'High',
          data: highData,
          fill: false,
          borderColor: '#fd7e14', // Orange
          backgroundColor: '#fd7e14',
          borderWidth: 2
        },
        {
          label: 'Medium',
          data: mediumData,
          fill: false,
          borderColor: '#ffc107', // Yellow
          backgroundColor: '#ffc107',
          borderWidth: 2
        },
        {
          label: 'Low',
          data: lowData,
          fill: false,
          borderColor: '#6c757d', // Gray
          backgroundColor: '#6c757d',
          borderWidth: 2
        }
      ]
    };
  }

  /**
   * Prepare data for the severity distribution chart
   */
  prepareSeverityDistributionChart(): void {
    // Create a doughnut chart showing distribution by severity
    const labels = ['Critical', 'High', 'Medium', 'Low'];

    const data = [
      this.summaryData.criticalTotal || 0,
      this.summaryData.highTotal || 0,
      this.summaryData.mediumTotal || 0,
      this.summaryData.lowTotal || 0
    ];

    this.severityDistributionChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#dc3545', // Red for Critical
            '#fd7e14', // Orange for High
            '#ffc107', // Yellow for Medium
            '#6c757d'  // Gray for Low
          ],
          hoverBackgroundColor: [
            '#c82333', // Darker red on hover
            '#e96b02', // Darker orange on hover
            '#e0a800', // Darker yellow on hover
            '#5a6268'  // Darker gray on hover
          ]
        }
      ]
    };
  }

  /**
   * Prepare data for the source distribution chart
   */
  prepareSourceDistributionChart(): void {
    // Create a doughnut chart showing distribution by source
    const labels = ['SAST', 'SCA', 'IaC', 'Secrets','DAST'];

    const data = [
      this.summaryData.sastTotal || 0,
      this.summaryData.scaTotal || 0,
      this.summaryData.iacTotal || 0,
      this.summaryData.secretsTotal || 0,
      this.summaryData.dastTotal || 0
    ];

    this.sourceDistributionChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#20c997', // Teal for SAST
            '#0dcaf0', // Cyan for SCA
            '#6610f2', // Purple for IaC
            '#d63384',  // Pink for Secrets
            '#8B4513' // Brown for DAST
          ],
          hoverBackgroundColor: [
            '#1ba87e', // Darker teal on hover
            '#0bb2d4', // Darker cyan on hover
            '#570dcf', // Darker purple on hover
            '#b92c72',  // Darker pink on hover
            '#6E3B0E'  //Darker Brown on hover
          ]
        }
      ]
    };
  }

  /**
   * Prepare data for the status distribution chart
   */
  prepareStatusDistributionChart(): void {
    // Create a doughnut chart showing distribution by status
    const labels = ['Open', 'Removed', 'Reviewed'];

    const data = [
      this.summaryData.openTotal || 0,
      this.summaryData.removedTotal || 0,
      this.summaryData.reviewedTotal || 0
    ];

    this.statusDistributionChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#0d6efd', // Blue for Open
            '#198754', // Green for Removed
            '#6c757d'  // Gray for Reviewed
          ],
          hoverBackgroundColor: [
            '#0b5ed7', // Darker blue on hover
            '#157347', // Darker green on hover
            '#5a6268'  // Darker gray on hover
          ]
        }
      ]
    };
  }

  /**
   * Prepare data for the fix progress chart
   */
  prepareFixProgressChart(): void {
    // First get all data points where we have both open and removed findings
    const fixProgressData = this.trendData.filter(item =>
        (item.openFindings !== undefined || item.removedFindings !== undefined)
    );

    // Sort by date
    fixProgressData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Extract dates for labels
    const labels = fixProgressData.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    // Create datasets for open and removed findings
    const openData = fixProgressData.map(item => item.openFindings || 0);
    const removedData = fixProgressData.map(item => item.removedFindings || 0);
    const reviewedData = fixProgressData.map(item => item.reviewedFindings || 0);

    this.fixProgressChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Open Findings',
          data: openData,
          fill: false,
          borderColor: '#0d6efd', // Blue
          backgroundColor: '#0d6efd',
          borderWidth: 2
        },
        {
          label: 'Removed Findings',
          data: removedData,
          fill: false,
          borderColor: '#198754', // Green
          backgroundColor: '#198754',
          borderWidth: 2
        },
        {
          label: 'Reviewed Findings',
          data: reviewedData,
          fill: false,
          borderColor: '#6c757d', // Gray
          backgroundColor: '#6c757d',
          borderWidth: 2
        }
      ]
    };
  }

  /**
   * Refresh all dashboard data
   */
  refreshData(): void {
    this.loadData();
  }

  /**
   * Handle team selection change
   */
  onTeamChange(event: any): void {
    const value = event.target.value;
    this.selectedTeamId = value === '' ? null : parseInt(value, 10);
    this.loadData();
  }

  /**
   * Handle time range selection change
   */
  onTimeRangeChange(days: number): void {
    this.timeRange = days;
    this.loadData();
  }

  /**
   * Calculate the severity trend indicator (up/down/stable)
   */
  getSeverityTrend(severityType: string): string {
    if (this.trendData.length < 2) return 'stable';

    const latestDataPoint = this.trendData[this.trendData.length - 1];
    const previousDataPoint = this.trendData[this.trendData.length - 2];

    let latest = 0;
    let previous = 0;

    if (severityType === 'critical') {
      latest = (latestDataPoint.sastCritical || 0) + (latestDataPoint.scaCritical || 0) +
          (latestDataPoint.iacCritical || 0) + (latestDataPoint.secretsCritical || 0);

      previous = (previousDataPoint.sastCritical || 0) + (previousDataPoint.scaCritical || 0) +
          (previousDataPoint.iacCritical || 0) + (previousDataPoint.secretsCritical || 0);
    } else if (severityType === 'high') {
      latest = (latestDataPoint.sastHigh || 0) + (latestDataPoint.scaHigh || 0) +
          (latestDataPoint.iacHigh || 0) + (latestDataPoint.secretsHigh || 0);

      previous = (previousDataPoint.sastHigh || 0) + (previousDataPoint.scaHigh || 0) +
          (previousDataPoint.iacHigh || 0) + (previousDataPoint.secretsHigh || 0);
    }

    if (latest === previous) return 'stable';
    return latest > previous ? 'up' : 'down';
  }

  /**
   * Get CSS class for trend indicator
   */
  getTrendClass(trend: string): string {
    if (trend === 'up') return 'text-danger';
    if (trend === 'down') return 'text-success';
    return '';
  }

  /**
   * Get icon for trend indicator
   */
  getTrendIcon(trend: string): string {
    if (trend === 'up') return 'cil-arrow-top';
    if (trend === 'down') return 'cil-arrow-bottom';
    return 'cil-minus';
  }

  /**
   * Calculate the total vulnerabilities from trend data
   */
  calculateTotalFromTrend(type: string): number {
    if (this.trendData.length === 0) return 0;

    const latestData = this.trendData[this.trendData.length - 1];

    if (type === 'open') return latestData.openFindings || 0;
    if (type === 'removed') return latestData.removedFindings || 0;
    if (type === 'reviewed') return latestData.reviewedFindings || 0;

    return 0;
  }

  /**
   * Format a number for display with K/M suffixes
   */
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}