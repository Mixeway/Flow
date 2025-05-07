import {
    Component,
    DestroyRef,
    inject,
    OnInit,
    Renderer2,
    ViewChild,
    TemplateRef,
    signal,
    WritableSignal,
    effect, Output, EventEmitter
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ChartOptions} from 'chart.js';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {
    AvatarComponent,
    ButtonDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    ColComponent,
    FormCheckLabelDirective, FormControlDirective, FormDirective, FormSelectDirective,
    GutterDirective, InputGroupComponent, InputGroupTextDirective, ModalBodyComponent,
    ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective,
    ProgressBarDirective,
    ProgressComponent,
    RowComponent, RowDirective, SpinnerComponent, TabContentComponent, TabDirective,
    TableDirective, TabPanelComponent, TabsComponent, TabsContentComponent, TabsListComponent,
    TextColorDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent, TooltipDirective
} from '@coreui/angular';
import {ChartjsComponent} from '@coreui/angular-chartjs';
import {IconDirective} from '@coreui/icons-angular';
import {WidgetsBrandComponent} from '../widgets/widgets-brand/widgets-brand.component';
import {WidgetsDropdownComponent} from '../widgets/widgets-dropdown/widgets-dropdown.component';
import {DashboardChartsData, IChartProps} from './dashboard-charts-data';
import {DOCUMENT, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {IconSetService, IconSetModule} from "@coreui/icons-angular";
import {brandSet, cilEnvelopeOpen, flagSet, freeSet} from "@coreui/icons";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../service/AuthService";
import {GitLabService} from "../../service/GitLabService";
import {DashboardService} from "../../service/DashboardService";
import {TeamService} from "../../service/TeamService";
import {gitRepoUrlValidator} from "../../utils/GitRepoUrlValidator";
import {GitHubService} from "../../service/GitHubService";
import {CloudService} from "../../service/CloudService";
import {StatsService} from "../../service/StatsService";
import {VulnerabilitySummary, VulnerabilityTrendDataPoint} from "../../model/stats.models";
import {AppConfigService} from "../../service/AppConfigService";

interface RepoRow {
    id: number;
    name: string;
    namespace: string;
    repo_url: string;
    imported: boolean;
}

interface CodeRepo {
    id: number;
    target: string;
    repo_url: string;
    team: string;
    sast: string;
    iac: string;
    secrets: string;
    sca: string;
}

interface CreateRepo {
    name: string;
    repoUrl: string;
    accessToken: string;
    remoteId: number;
    team: number;
}

interface SimpleUser {
    id: number
    username: string
}

interface Team {
    id: number;
    name: string;
    users: SimpleUser[];
    remoteIdentifier: string;
}

interface TeamDto {
    name: string;
}

interface CloudSubscription {
    id: number;
    name: string;
    team: string;
    externalProjectName: string;
    scanStatus: string;
}

@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    standalone: true,
    imports: [
        WidgetsDropdownComponent, TextColorDirective, CardComponent, CardBodyComponent,
        RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule,
        ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle,
        CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent,
        WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent,
        NgxDatatableModule, ModalComponent, ModalHeaderComponent, ModalBodyComponent,
        ModalFooterComponent, InputGroupComponent, InputGroupTextDirective,
        FormControlDirective, NgIf, FormSelectDirective, FormDirective, RowDirective,
        ModalTitleDirective, SpinnerComponent, TooltipDirective, NgForOf, ToasterComponent,
        ToastComponent, ToastHeaderComponent, ToastBodyComponent, TabDirective, TabsComponent,
        TabsListComponent, TabsContentComponent, TabContentComponent, TabPanelComponent, NgClass, RouterLink
    ]
})
export class DashboardComponent implements OnInit {

    @ViewChild('actionsTemplate', {static: true}) actionsTemplate!: TemplateRef<any>;
    @Output() repoImported = new EventEmitter<{ repoUrl: string, accessToken: string }>();
    importRepoForm: FormGroup;
    importSingleRepoForm: FormGroup;
    newTeamForm: FormGroup;
    isLoading = false;
    repoUrl: string = "";
    accessToken: string = "";
    selectedRepo: string = "GitLab";
    teams: Team[] = [];
    widgetStats: any;
    canManage: boolean = false;
    @Output() userRoleSet: EventEmitter<string> = new EventEmitter<string>();
    trendDataLoaded: boolean = false;
    appInfo: any;


    // Security overview section properties
    showSecurityOverview: boolean = true;
    securityStats: VulnerabilitySummary | null = null;
    securityTrendData: VulnerabilityTrendDataPoint[] = [];
    vulnerabilityTrendData: any = null;
    chartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 15,
                    font: {
                        size: 11,
                        weight: 'bold'
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(33, 37, 41, 0.85)',
                titleFont: {
                    size: 13,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                padding: 10,
                cornerRadius: 4,
                displayColors: true,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                caretSize: 6,
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    maxRotation: 0,
                    padding: 8,
                    font: {
                        size: 10
                    },
                    color: 'rgba(120, 130, 140, 0.8)'
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(120, 130, 140, 0.1)',
                    drawBorder: false,
                    lineWidth: 1,
                    drawTicks: false
                },
                ticks: {
                    padding: 10,
                    count: 5,
                    stepSize: Math.ceil(10 / 5),
                    font: {
                        size: 10
                    },
                    color: 'rgba(120, 130, 140, 0.8)'
                },
                border: {
                    display: false
                }
            }
        },
        layout: {
            padding: {
                top: 10,
                right: 15,
                bottom: 15,
                left: 15
            }
        },
        elements: {
            line: {
                tension: 0.35
            },
            point: {
                radius: 2,
                hitRadius: 30,
                hoverRadius: 5
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: false,
            animationDuration: 200
        }
    };

    rows: CodeRepo[] = [];
    repoRows: RepoRow[] = []
    columns: any[] = [];

    cloudRows: CloudSubscription[] = [];
    cloudColumns: any[] = [];

    teamsColumns: any[] = [];

    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #document: Document = inject(DOCUMENT);
    readonly #renderer: Renderer2 = inject(Renderer2);
    readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);


    constructor(
        public iconSet: IconSetService,
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private gitLabService: GitLabService,
        private dashboardService: DashboardService,
        private teamService: TeamService,
        private gitHubService: GitHubService,
        private cloudService: CloudService,
        private statsService: StatsService,
        private appInfoService: AppConfigService
    ) {
        // iconSet singleton
        iconSet.icons = {...freeSet, ...iconSet, ...brandSet};
        this.importRepoForm = this.fb.group({
            repoUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
            accessToken: ['', Validators.required],
            team: ['', Validators.required],
            repoType: ['gitlab', Validators.required]
        });
        this.importSingleRepoForm = this.fb.group({
            repoUrl: ['', [Validators.required, gitRepoUrlValidator()]],
            accessToken: ['', Validators.required],
            team: ['', Validators.required],
            repoType: ['gitlab', Validators.required]
        });
        this.newTeamForm = this.fb.group({
            name: ['', Validators.required],
            remoteIdentifier: ['']
        });
    }

    public mainChart: IChartProps = {type: 'line'};
    public mainChartRef: WritableSignal<any> = signal(undefined);

    public chart: Array<IChartProps> = [];

    ngOnInit(): void {
        let userRole = localStorage.getItem('userRole');

        this.authService.hc().subscribe({
            next: (response) => {
                if (!userRole) {
                    localStorage.setItem('userRole', response.status.replace("ROLE_", ""));
                    location.reload();
                }
                this.canManage = true;
            },
            error: () => {
                // Health check failed, redirect to login
                this.router.navigate(['/login']);
            }
        });

        this.loadCodeRepos();
        this.loadCloudSubscriptions();
        this.loadTeams();
        this.loadSecurityData();
        this.initColumns();
        this.initCloudColumns();
        this.initTeamsColumns();
        this.initCharts();
        this.updateChartOnColorModeChange();
        this.loadWidgetStats();
        this.loadAppInfo();
    }

    // Load security data for the overview section
    loadSecurityData(): void {
        // Load summary data
        this.statsService.getVulnerabilitySummary(null).subscribe({
            next: (data) => {
                this.securityStats = data;
            },
            error: (error) => {
                console.error('Error loading security summary data:', error);
            }
        });
        this.trendDataLoaded = false; // Reset loading flag before making the request

        // Load trend data (last 30 days)
        this.statsService.getVulnerabilityTrend(null, 30).subscribe({
            next: (data) => {
                this.securityTrendData = data;
                this.trendDataLoaded = true; // Set flag to true regardless of data content
                this.prepareVulnerabilityTrendChart();
            },
            error: (error) => {
                console.error('Error loading security trend data:', error);
            }
        });
    }
    loadAppInfo(): void {
        this.appInfoService.getAppModeInfo().subscribe({
            next: (data) => {
                this.appInfo = data;
            },
            error: (err) => {
                console.error('Failed to load app info:', err);
            }
        });
    }
    // Toggle security overview section visibility
    toggleSecurityOverview(): void {
        this.showSecurityOverview = !this.showSecurityOverview;
    }

    // Prepare vulnerability trend chart data
    prepareVulnerabilityTrendChart(): void {
        if (!this.securityTrendData || this.securityTrendData.length === 0) {
            return;
        }

        // Sort data by date ascending
        this.securityTrendData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Extract dates for labels
        const labels = this.securityTrendData.map(item => {
            const date = new Date(item.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        // Create datasets for critical and high vulnerabilities (simplified for dashboard)
        const criticalData = this.securityTrendData.map(item =>
            (item.sastCritical || 0) + (item.scaCritical || 0) +
            (item.iacCritical || 0) + (item.secretsCritical || 0)
        );

        const highData = this.securityTrendData.map(item =>
            (item.sastHigh || 0) + (item.scaHigh || 0) +
            (item.iacHigh || 0) + (item.secretsHigh || 0)
        );

        // Create background gradient for chart
        const createGradient = (ctx: CanvasRenderingContext2D, color: string, opacity: number) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${color}00`);
            return gradient;
        };

        this.vulnerabilityTrendData = {
            labels: labels,
            datasets: [
                {
                    label: 'Critical',
                    data: criticalData,
                    borderColor: '#dc3545',
                    backgroundColor: function(context: any) {
                        const chart = context.chart;
                        const {ctx} = chart;
                        return createGradient(ctx, '#dc3545', 0.3);
                    },
                    borderWidth: 2,
                    fill: true,
                    pointBackgroundColor: '#dc3545',
                    pointBorderColor: '#ffffff',
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#dc3545',
                    pointHoverBorderWidth: 2,
                    pointHoverRadius: 6,
                    pointRadius: 4,
                    tension: 0.3
                },
                {
                    label: 'High',
                    data: highData,
                    borderColor: '#fd7e14',
                    backgroundColor: function(context: any) {
                        const chart = context.chart;
                        const {ctx} = chart;
                        return createGradient(ctx, '#fd7e14', 0.3);
                    },
                    borderWidth: 2,
                    fill: true,
                    pointBackgroundColor: '#fd7e14',
                    pointBorderColor: '#ffffff',
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#fd7e14',
                    pointHoverBorderWidth: 2,
                    pointHoverRadius: 6,
                    pointRadius: 4,
                    tension: 0.3
                }
            ]
        };
    }

    // Get security trend indicator (up/down/stable)
    getSecurityTrendIcon(type: string): string {
        const trend = this.getSecurityTrend(type);
        if (trend === 'up') return 'cil-arrow-top';
        if (trend === 'down') return 'cil-arrow-bottom';
        return 'cil-minus';
    }

    // Get CSS class for trend indicator
    getSecurityTrendClass(type: string): string {
        const trend = this.getSecurityTrend(type);
        if (trend === 'up') return 'text-danger';
        if (trend === 'down') return 'text-success';
        return 'text-muted';
    }

    // Get text for trend indicator
    getSecurityTrendText(type: string): string {
        const trend = this.getSecurityTrend(type);
        if (trend === 'up') return 'Increasing';
        if (trend === 'down') return 'Decreasing';
        return 'Stable';
    }

    // Calculate security trend (up/down/stable)
    getSecurityTrend(type: string): string {
        if (this.securityTrendData.length < 2) return 'stable';

        const latestDataPoint = this.securityTrendData[this.securityTrendData.length - 1];
        const previousDataPoint = this.securityTrendData[this.securityTrendData.length - 2];

        let latest = 0;
        let previous = 0;

        if (type === 'critical') {
            latest = (latestDataPoint.sastCritical || 0) + (latestDataPoint.scaCritical || 0) +
                (latestDataPoint.iacCritical || 0) + (latestDataPoint.secretsCritical || 0);

            previous = (previousDataPoint.sastCritical || 0) + (previousDataPoint.scaCritical || 0) +
                (previousDataPoint.iacCritical || 0) + (previousDataPoint.secretsCritical || 0);
        } else if (type === 'high') {
            latest = (latestDataPoint.sastHigh || 0) + (latestDataPoint.scaHigh || 0) +
                (latestDataPoint.iacHigh || 0) + (latestDataPoint.secretsHigh || 0);

            previous = (previousDataPoint.sastHigh || 0) + (previousDataPoint.scaHigh || 0) +
                (previousDataPoint.iacHigh || 0) + (previousDataPoint.secretsHigh || 0);
        } else if (type === 'total') {
            latest = latestDataPoint.openFindings || 0;
            previous = previousDataPoint.openFindings || 0;
        }

        if (latest === previous) return 'stable';
        return latest > previous ? 'up' : 'down';
    }

    // Calculate a simple security score based on findings
    calculateSecurityScore(): string {
        if (!this.securityStats) {
            return 'N/A';
        }

        // Simple scoring algorithm: 100 - (critical*5 + high*3 + medium)/(total repos * 10)
        // This is just an example - real scoring would be more sophisticated
        const criticalPenalty = (this.securityStats.criticalTotal || 0) * 5;
        const highPenalty = (this.securityStats.highTotal || 0) * 3;
        const mediumPenalty = (this.securityStats.mediumTotal || 0);

        const totalRepos = this.securityStats.totalRepos || 1; // Avoid division by zero
        const totalPenalty = criticalPenalty + highPenalty + mediumPenalty;

        let score = 100 - (totalPenalty / (totalRepos * 10));
        score = Math.max(0, Math.min(100, score)); // Ensure score is between 0-100

        // Format as letter grade based on score
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    loadCodeRepos() {
        this.dashboardService.getRepos().subscribe({
            next: (response) => {
                this.rows = response;
                this.temp = [...this.rows]; // Keep a backup of the original rows for filtering
            },
            error: (error) => {
                // Handle error
                console.error('Error loading code repos:', error);
            }
        });
    }

    loadCloudSubscriptions() {
        this.cloudService.getCloudSubscriptions().subscribe({
            next: (response) => {
                this.cloudRows = response;
                this.cloudTemp = [...this.cloudRows];
            },
            error: (error) => {
                // Handle error
                console.error('Error loading cloud subscriptions:', error);
            }
        });
    }

    loadWidgetStats() {
        // First load existing widget stats if available
        this.dashboardService.getAggregatedStats().subscribe({
            next: (response) => {
                this.widgetStats = response || {};

                // Now load additional metrics from StatsService
                this.loadDashboardMetrics();
            },
            error: (error) => {
                console.error('Error loading widget stats:', error);
                // Initialize widgetStats to prevent null reference errors
                this.widgetStats = {};
                // Try to load dashboard metrics anyway
                this.loadDashboardMetrics();
            }
        });
    }

    /**
     * Load additional dashboard metrics (teams count, scan counts, etc.)
     */
    loadDashboardMetrics() {
        this.statsService.getDashboardMetrics().subscribe({
            next: (response) => {
                // Merge the metrics into widgetStats
                this.widgetStats = {
                    ...this.widgetStats,
                    teams: response.teams,
                    totalScans: response.totalScans,
                    monthlyScans: response.monthlyScans
                };
            },
            error: (error) => {
                console.error('Error loading dashboard metrics:', error);
            }
        });
    }

    loadTeams() {
        this.teamService.get().subscribe({
            next: (response: Team[]) => {
                this.teams = response.map((team: Team) => {
                    const teamRepos = this.rows.filter((repo: CodeRepo) => repo.team.toLowerCase() === team.name.toLowerCase());
                    const {sast, sca, iac, secrets} = this.getRepoScanStatus(teamRepos);

                    const teamCloudSubscriptions = this.cloudRows.filter((cloudSubscription: CloudSubscription) => cloudSubscription.team.toLowerCase() === team.name.toLowerCase());
                    const { cloudScan } = this.getCloudScanStatus(teamCloudSubscriptions);

                    return {...team, sastStatus: sast, scaStatus: sca, iacStatus: iac, secretsStatus: secrets, cloudScanStatus: cloudScan};
                });
                this.teamsTemp = [...this.teams];
            },
            error: (error: any) => {
                console.error('Error loading teams:', error);
            }
        });
    }

    getRepoScanStatus(repos: CodeRepo[]): { sast: string, sca: string, iac: string, secrets: string } {
        const getStatus = (scanType: 'sast' | 'iac' | 'secrets' | 'sca'): string => {
            const statuses = repos.map(repo => repo[scanType]);
            if (statuses.includes('DANGER')) {
                return 'DANGER';
            } else if (statuses.includes('WARNING')) {
                return 'WARNING';
            } else if (statuses.every(status => status === 'NOT_PERFORMED')) {
                return 'NOT_PERFORMED';
            } else if (statuses.includes('SUCCESS')) {
                return 'SUCCESS';
            }
            return 'UNKNOWN'; // Default return value for unexpected cases
        };

        return {
            sast: getStatus('sast'),
            sca: getStatus('sca'),
            iac: getStatus('iac'),
            secrets: getStatus('secrets')
        };
    }

    getCloudScanStatus(cloudSubscriptions: CloudSubscription[]): { cloudScan: string } {
        const statuses = cloudSubscriptions.map(subscription => subscription.scanStatus);

        if (statuses.includes('DANGER')) {
            return { cloudScan: 'DANGER' };
        } else if (statuses.includes('WARNING')) {
            return { cloudScan: 'WARNING' };
        } else if (statuses.every(status => status === 'NOT_PERFORMED')) {
            return { cloudScan: 'NOT_PERFORMED' };
        } else if (statuses.includes('SUCCESS')) {
            return { cloudScan: 'SUCCESS' };
        }

        return { cloudScan: 'UNKNOWN' };
    }

    initColumns(): void {
        this.columns = [
            {name: 'Actions', cellTemplate: this.actionsTemplate},
            {prop: 'target', name: 'Target'},
            {prop: 'team', name: 'Team'},
            {prop: 'apps', name: 'Apps'},
            {prop: 'risk', name: 'Risk'}
        ];
    }

    initCloudColumns(): void {
        this.cloudColumns = [
            {name: 'Actions', cellTemplate: this.actionsTemplate},
            {prop: 'cloudSubscription', name: 'Cloud Subscription'},
            {prop: 'team', name: 'Team'},
            {prop: 'externalProjectName', name: 'External Project Name'},
            {prop: 'risk', name: 'Risk'}
        ];
    }

    initTeamsColumns(): void {
        this.teamsColumns = [
            {name: 'Actions', cellTemplate: this.actionsTemplate},
            {prop: 'name', name: 'Name'},
            {prop: 'remoteIdentifier', name: 'Remote Identifier'},
            {prop: 'risk', name: 'Risk'}
        ];
    }

    initCharts(): void {
        this.mainChart = this.#chartsData.mainChart;
    }

    updateChartOnColorModeChange() {
        const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
            this.setChartStyles();
        });

        this.#destroyRef.onDestroy(() => {
            unListen();
        });
    }

    setChartStyles() {
        if (this.mainChartRef()) {
            setTimeout(() => {
                const options: ChartOptions = {...this.mainChart.options};
                const scales = this.#chartsData.getScales();
                this.mainChartRef().options.scales = {...options.scales, ...scales};
                this.mainChartRef().update();
            });
        }
    }

    temp = [...this.rows]; // a copy of the original rows for filtering
    cloudTemp = [...this.cloudRows]
    teamsTemp = [...this.teams]

    updateFilter(event: any) {
        const val = event.target.value.toLowerCase();

        // If there's no filter value, reset rows to full list
        if (!val) {
            this.rows = [...this.temp];
            return;
        }

        // Filter our data based on multiple columns
        const temp = this.temp.filter(row => {
            // Ensure you filter based on all the relevant columns
            return (
                row.target.toLowerCase().includes(val) ||
                row.team.toLowerCase().includes(val) ||
                row.sast.toLowerCase().includes(val) ||
                row.sca.toLowerCase().includes(val) ||
                row.secrets.toLowerCase().includes(val) ||
                row.iac.toLowerCase().includes(val)
            );
        });

        // Update the rows with the filtered data
        this.rows = temp;
    }

    updateCloudFilter(event: any) {
        const val = event.target.value.toLowerCase();

        // If there's no filter value, reset rows to full list
        if (!val) {
            this.cloudRows = [...this.cloudTemp];
            return;
        }

        // Filter our data based on multiple columns
        const cloudTemp = this.cloudTemp.filter(cloudRow => {
            // Enhanced filter to include all relevant fields
            return (
                (cloudRow.name?.toLowerCase().includes(val) || '') ||
                (cloudRow.team?.toLowerCase().includes(val) || '') ||
                (cloudRow.externalProjectName?.toLowerCase().includes(val) || '')
            );
        });

        // Update the rows with the filtered data
        this.cloudRows = cloudTemp;
    }

    updateTeamsFilter(event: any) {
        const val = event.target.value.toLowerCase();

        // If there's no filter value, reset rows to full list
        if (!val) {
            this.teams = [...this.teamsTemp];
            return;
        }

        // Filter our data based on multiple columns
        const teamsTemp = this.teamsTemp.filter(team => {
            // Enhanced filter to include all relevant fields including remoteIdentifier
            return (
                (team.name?.toLowerCase().includes(val) || '') ||
                (team.remoteIdentifier?.toLowerCase().includes(val) || '')
            );
        });

        // Update the rows with the filtered data
        this.teams = teamsTemp;
    }

    tempRepos = [...this.repoRows]; // a copy of the original rows for filtering

    updateFilterRepo(event: any) {
        const val = event.target.value.toLowerCase();

        // filter our data based on multiple columns
        const filteredRepos = this.tempRepos.filter(d =>
            d.name.toLowerCase().includes(val) ||
            d.namespace.toLowerCase().includes(val) ||
            d.repo_url.toLowerCase().includes(val)
        );

        // update the rows
        this.repoRows = filteredRepos;
    }

    nextPage(row: any) {
        console.log('Navigating to next page for:', row);
        // Add your navigation logic here
    }

    click(row: any) {
        this.router.navigate(['/show-repo/' + row.id]);
        // alert(JSON.stringify(row));
        // Handle the click event, e.g., navigate or perform actions based on row data
    }

    cloudClick(row: any) {
        this.router.navigate(['/show-cloud-subscription/' + row.id]);
    }

    teamClick(row: any) {
        this.router.navigate(['/show-team/' + row.id]);
    }

    public visible = false;
    public visibleSingleRepoModal = false;
    public visibleList = false;
    public visibleNewTeam = false;

    importRepoModal() {
        this.visible = !this.visible;
    }

    handleImportRepoChange(event: any) {
        this.visible = event;
    }

    handleListRepoChange(event: any) {
        this.visible = false;
        this.visibleList = event;
    }

    closeModal() {
        this.visible = false;
        this.visibleList = false;
        this.visibleNewTeam = false;
        this.visibleSingleRepoModal = false;
    }

    closeNewTeamModal() {
        this.visibleNewTeam = false;
    }

    onSubmit(): void {
        if (this.importRepoForm.valid) {
            this.repoImported.emit(this.importRepoForm.value);

            this.repoUrl = this.importRepoForm.value.repoUrl;  // Store repoUrl
            this.accessToken = this.importRepoForm.value.accessToken;  // Store accessToken

            this.isLoading = true;  // Show the spinner

            if (this.selectedRepo === 'GitLab') {
                this.gitLabService.setApiUrl(this.repoUrl);
                this.gitLabService.getAllProjects(this.accessToken).subscribe({
                    next: (projects) => {
                        this.repoRows = projects.map(proj => ({
                            id: proj.id,
                            name: proj.name,
                            repo_url: proj.web_url,
                            namespace: proj.path_with_namespace,
                            imported: false
                        }));
                        this.tempRepos = [...this.repoRows];  // Update the temp array with the new data

                        // Check if any repo in rows matches the URL and set imported to true
                        this.repoRows.forEach(repoRow => {
                            repoRow.imported = this.rows.some(row => row.repo_url === repoRow.repo_url);
                        });
                    },
                    error: (error) => {
                        console.error('Error fetching projects:', error);
                    },
                    complete: () => {
                        this.isLoading = false;  // Hide the spinner
                    }
                });
            } else if (this.selectedRepo === 'GitHub') {
                this.gitHubService.setApiUrl(this.repoUrl);
                this.gitHubService.getAllRepositories(this.accessToken).subscribe({
                    next: (projects) => {
                        this.repoRows = projects.map(proj => ({
                            id: proj.id,
                            name: proj.name,
                            repo_url: proj.web_url,
                            namespace: proj.path_with_namespace,
                            imported: false
                        }));
                        this.tempRepos = [...this.repoRows];  // Update the temp array with the new data

                        // Check if any repo in rows matches the URL and set imported to true
                        this.repoRows.forEach(repoRow => {
                            repoRow.imported = this.rows.some(row => row.repo_url === repoRow.repo_url);
                        });
                    },
                    error: (error) => {
                        console.error('Error fetching projects:', error);
                    },
                    complete: () => {
                        this.isLoading = false;  // Hide the spinner
                    }
                });
            } else {
                this.toastStatus = "danger"
                this.toastMessage = "Unknown repo type."
                this.toggleToast();
            }

            this.closeModal();
            this.visibleList = true;
        }
    }

    importRepo(row: any) {
        var repoObject: CreateRepo = {
            name: row.namespace,
            remoteId: row.id,
            repoUrl: this.repoUrl,
            accessToken: this.accessToken,
            team: this.importRepoForm.value.team,
        }
        if (this.selectedRepo === 'GitHub') {
            repoObject.repoUrl = this.gitHubService.gitHubApiUrl
        }
        row.imported = true;
        this.dashboardService.createRepo(repoObject, this.selectedRepo.toLowerCase()).subscribe({
            next: (response) => {
                this.toastStatus = "success"
                this.toastMessage = "Successfully imported repo: " + this.repoUrl
                this.toggleToast();
                this.loadCodeRepos();
                this.loadSecurityData(); // Reload security data after adding a repository
            },
            error: (error) => {
                this.toastStatus = "danger"
                this.toastMessage = "Problem during repo import. If it will keep occurring contact system administrator."
                this.toggleToast();
            }
        });
    }

    handleNewTeam(event: any) {
        this.visibleNewTeam = event;
    }

    createNewTeamModal() {
        this.visibleNewTeam = true;
    }

    position = 'top-end';
    visibleToast = false;
    percentage = 0;
    toastMessage: string = ""
    toastStatus: string = ""

    toggleToast() {
        this.visibleToast = !this.visibleToast;
    }

    onVisibleChange($event: boolean) {
        this.visible = $event;
        this.percentage = !this.visible ? 0 : this.percentage;
    }

    onSubmitNewTeam() {
        if (this.newTeamForm.valid) {
            this.teamService.create(this.newTeamForm.value).subscribe({
                next: (response) => {
                    this.toastStatus = "success"
                    this.toastMessage = "Team created Successfully"
                    this.toggleToast();
                    this.loadTeams();
                },
                error: (error) => {
                    this.toastStatus = "danger"
                    this.toastMessage = "Error during team creation, team already exist or You provided empty name."
                    this.toggleToast();
                }
            });
            this.closeNewTeamModal();
        }
    }

    importSingleRepoModal() {
        this.visibleSingleRepoModal = true;
    }

    selectRepoType(type: string) {
        this.selectedRepo = type;
    }

    handleImportSingleRepoChange(event: boolean) {
        this.visibleSingleRepoModal = event;
    }

    onSubmitSingleRepo() {
        if (this.importSingleRepoForm.invalid) {
            this.showToast("danger", "Please fill in all required fields correctly.");
            return;
        }

        const {repoUrl, accessToken, team} = this.importSingleRepoForm.value;

        if (this.selectedRepo === 'GitLab') {
            // Set the base API URL based on the repo URL
            this.gitLabService.setApiUrl(repoUrl);
            // Get the project details
            this.gitLabService.getProjectDetailsFromUrl(repoUrl, accessToken).subscribe({
                next: (response) => {
                    if (!response || !response.id) {
                        this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
                        return;
                    }
                    const strippedRepoUrl = this.getBaseUrl(repoUrl);

                    const repoObject: CreateRepo = {
                        name: response.name,
                        remoteId: response.id,
                        repoUrl: strippedRepoUrl,
                        accessToken,
                        team,
                    };

                    this.dashboardService.createRepo(repoObject, this.selectedRepo.toLowerCase()).subscribe({
                        next: () => {
                            this.showToast("success", `Successfully imported repo: ${repoUrl}`);
                            this.loadCodeRepos();
                            this.loadSecurityData(); // Reload security data after adding a repository
                            this.visibleSingleRepoModal = false;
                        },
                        error: () => {
                            this.showToast("danger", "Problem during repo import. If it will keep occurring contact system administrator.");
                        },
                    });
                },
                error: () => {
                    this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
                }
            });
        } else if (this.selectedRepo === 'GitHub') {
            // Set the base API URL based on the repo URL
            this.gitHubService.setApiUrl(repoUrl);
            // Get the project details
            this.gitHubService.getRepositoryDetailsFromUrl(repoUrl, accessToken).subscribe({
                next: (response) => {
                    if (!response || !response.id) {
                        this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
                        return;
                    }
                    const strippedRepoUrl = this.getBaseUrl(repoUrl);

                    const repoObject: CreateRepo = {
                        name: response.full_name,
                        remoteId: response.id,
                        repoUrl: strippedRepoUrl.replace("github.com", "api.github.com"),
                        accessToken,
                        team,
                    };

                    this.dashboardService.createRepo(repoObject, this.selectedRepo.toLowerCase()).subscribe({
                        next: () => {
                            this.showToast("success", `Successfully imported repo: ${repoUrl}`);
                            this.loadCodeRepos();
                            this.loadSecurityData(); // Reload security data after adding a repository
                            this.visibleSingleRepoModal = false;
                        },
                        error: () => {
                            this.showToast("danger", "Problem during repo import. If it will keep occurring contact system administrator.");
                        },
                    });
                },
                error: () => {
                    this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
                }
            });
        }
    }

    // Helper method to show toast notifications
    private showToast(status: string, message: string) {
        this.toastStatus = status;
        this.toastMessage = message;
        this.toggleToast();
    }

    // Helper method to get the base URL
    private getBaseUrl(url: string): string {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.port ? `${parsedUrl.protocol}//${parsedUrl.host}` : `${parsedUrl.protocol}//${parsedUrl.hostname}`;
        } catch (e) {
            console.error("Invalid URL provided:", e);
            return url;  // Return the original URL if there's an error parsing it
        }
    }

    // Add this property to your DashboardComponent class
    showStatusLegend: boolean = false;

    // Add this method to your DashboardComponent class
    toggleStatusLegend() {
        this.showStatusLegend = !this.showStatusLegend;
    }
}