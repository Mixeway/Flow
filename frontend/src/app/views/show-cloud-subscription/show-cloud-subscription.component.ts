import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {CloudSubscriptionService} from '../../service/CloudSubscriptionService';
import {AuthService} from '../../service/AuthService';
import {TeamService} from "../../service/TeamService";
import {ActivatedRoute, Router} from '@angular/router';
import {FindingDTO, SingleFindingDTO} from '../../model/FindingDTO';
import {FormsModule} from '@angular/forms';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    AlertComponent,
    BadgeComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormLabelDirective,
    FormSelectDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ListGroupDirective,
    ListGroupItemDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent,
    SpinnerComponent,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    TemplateIdDirective,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent,
    TooltipDirective,
    WidgetStatCComponent,
    WidgetStatFComponent
} from "@coreui/angular";
import {ChartjsComponent} from "@coreui/angular-chartjs";
import {IconComponent, IconDirective, IconSetService} from "@coreui/icons-angular";
import {MarkdownModule, provideMarkdown} from "ngx-markdown";
import {
    brandSet,
    cilArrowRight,
    cilBug,
    cilBurn,
    cilCenterFocus,
    cilChartPie,
    cilCommentSquare, cilGraph, cilMagnifyingGlass, cilTrash, cilVolumeOff,
    freeSet
} from "@coreui/icons";
import {ChartData, ChartOptions} from "chart.js";
import {CloudSubscriptionInfoComponent} from "./cloud-subscription-info/cloud-subscription-info.component";
import {CloudVulnerabilitySummaryComponent} from "./cloud-vulnerability-summary/cloud-vulnerability-summary.component";
import {CloudVulnerabilitiesTableComponent} from "./cloud-vulnerabilities-table/cloud-vulnerabilities-table.component";
import {CloudVulnerabilityDetailsComponent} from "./cloud-vulnerability-details/cloud-vulnerability-details.component";
import {
    TeamVulnerabilitiesTableComponent
} from "../show-team/team-vulnerabilities-table/team-vulnerabilities-table.component";
import {VulnerabilitySummaryComponent} from "../show-repo/vulnerability-summary/vulnerability-summary.component";

interface Vulnerability {
    id: number;
    name: string;
    source: string;
    location: string;
    severity: string;
    inserted: string;
    last_seen: string;
    status: string;
}

interface Team {
    id: number;
    name: string;
    remoteIdentifier: string | null;
    users: TeamUser[];
}

interface TeamUser {
    id: number;
    username: string;
}

export interface CloudSubscriptionFindingStats {
    id: number;
    dateInserted: string; // Using string to represent ISO date format
    criticalFindings: number;
    highFindings: number;
    openedFindings: number;
    removedFindings: number;
    averageFixTime: number;
}

@Component({
    selector: 'app-show-cloud-subscription',
    standalone: true,
    imports: [
        NgxDatatableModule,
        DatePipe,
        NgForOf,
        NgIf,
        FormsModule,
        CardBodyComponent,
        FormCheckComponent,
        ColComponent,
        RowComponent,
        CardHeaderComponent,
        CardComponent,
        TabPanelComponent,
        TabsContentComponent,
        TabsListComponent,
        TabDirective,
        WidgetStatFComponent,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        AlertComponent,
        BadgeComponent,
        ButtonDirective,
        CardFooterComponent,
        ChartjsComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormLabelDirective,
        FormSelectDirective,
        IconComponent,
        IconDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        ListGroupDirective,
        ListGroupItemDirective,
        MarkdownModule,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ProgressComponent,
        SpinnerComponent,
        TabsComponent,
        TemplateIdDirective,
        ToastBodyComponent,
        ToastComponent,
        ToastHeaderComponent,
        ToasterComponent,
        WidgetStatCComponent,
        ModalBodyComponent,
        TooltipDirective,
        CloudSubscriptionInfoComponent,
        CloudVulnerabilitySummaryComponent,
        CloudVulnerabilitiesTableComponent,
        CloudVulnerabilityDetailsComponent,
        NgClass,
        TeamVulnerabilitiesTableComponent,
        VulnerabilitySummaryComponent,
    ],
    templateUrl: './show-cloud-subscription.component.html',
    styleUrls: ['./show-cloud-subscription.component.scss'],
    providers: [DatePipe, provideMarkdown()],
    encapsulation: ViewEncapsulation.None,
})
export class ShowCloudSubscriptionComponent implements OnInit, AfterViewInit {
    cloudSubscriptionData: any;
    id: string = '';
    findings: FindingDTO | undefined;
    singleVuln: SingleFindingDTO | undefined;
    icons = {
        cilChartPie,
        cilArrowRight,
        cilBug,
        cilCenterFocus,
        cilCommentSquare,
        cilBurn,
        cilGraph,
        cilTrash,
        cilVolumeOff,
        cilMagnifyingGlass,
    };
    counts: any;
    vulns: Vulnerability[] = [];
    filteredVulns = [...this.vulns]; // a copy of the original rows for filtering

    cloudSubscriptionFindingStats: CloudSubscriptionFindingStats[] = [];

    options = {
        maintainAspectRatio: false,
    };
    months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    public options2: ChartOptions<'line'> = {
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    chartLineData: ChartData = {
        labels: [],
        datasets: [
            {
                label: 'Cloud Scan',
                backgroundColor: 'rgba(220, 220, 220, 0.2)',
                borderColor: 'rgba(220, 220, 220, 1)',
                pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                pointBorderColor: '#fff',
                data: [],
            }
        ],
    };


    filters: { [key: string]: string } = {
        actions: '',
        name: '',
        location: '',
        source: '',
        status: '',
        severity: '',
        dates: '',
    };

    showRemoved: boolean = false;
    detailsModal: boolean = false;
    selectedRowId: number | null = null;

    cloudScanInfosLoading: boolean = false;
    cloudScanInfoLimit: number = 15;

    vulnerabilitiesLoading: boolean = false;
    vulnerabilitiesLimit: number = 15;

    scanRunning: boolean = false;
    userRole: string = 'USER';

    changeTeamModalVisible: boolean = false;
    confirmationModalVisible: boolean = false;
    confirmationText: string = '';
    availableTeams: Team[] = [];
    selectedNewTeamId: number | null = null;

    cloudScanInfos: any[] = [];

    // Comment properties
    newComment: string = '';
    isAddingComment: boolean = false;

    constructor(
        public iconSet: IconSetService,
        private cloudSubscriptionService: CloudSubscriptionService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private cdr: ChangeDetectorRef,
        private teamService: TeamService
    ) {
        iconSet.icons = {...brandSet, ...freeSet};
        this.applyFilters();
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        // @ts-ignore
        this.userRole = localStorage.getItem('userRole');
        this.cdr.detectChanges();

        this.route.paramMap.subscribe((params) => {
            this.id = params.get('id') || '';
        });
        this.authService.hc().subscribe({
            next: () => {
            },
            error: () => {
                this.router.navigate(['/login']);
            },
        });
        this.loadCloudSubscriptionInfo();
        this.loadCloudFindings();
        this.loadCloudSubscriptionFindingStats();
        this.options2 = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 10,
                    bodyFont: {
                        size: 12
                    },
                    titleFont: {
                        size: 13,
                        weight: 'bold'
                    }
                }
            }
        };
    }

    loadCloudSubscriptionInfo() {
        this.cloudScanInfosLoading = true;
        this.cloudSubscriptionService.getCloudSubscription(+this.id).subscribe({
            next: (response) => {
                this.cloudSubscriptionData = response;
                this.cloudScanInfos = response.cloudScanInfos;
                this.cloudScanInfosLoading = false;
                if (
                    response.scanStatus === 'RUNNING'
                ) {
                    this.scanRunning = true;
                }
            },
            error: () => {
                this.cloudScanInfosLoading = false;
            },
        });
    }

    loadCloudFindings() {
        this.vulnerabilitiesLoading = true;
        this.cloudSubscriptionService.getFindings(+this.id).subscribe({
            next: (response) => {
                this.vulns = response;
                this.filteredVulns = [...this.vulns];
                this.counts = this.countFindings(this.vulns);
                this.applyFilters();
                this.vulnerabilitiesLoading = false;
            },
            error: () => {
                this.vulnerabilitiesLoading = false;
            },
        });
    }

    loadCloudSubscriptionFindingStats() {
        this.cloudSubscriptionService.getCloudFindingStats(+this.id).subscribe({
            next: (response) => {
                this.cloudSubscriptionFindingStats = response.sort(
                    (a: CloudSubscriptionFindingStats, b: CloudSubscriptionFindingStats) =>
                        new Date(a.dateInserted).getTime() -
                        new Date(b.dateInserted).getTime()
                );
                this.prepareChartData();
            },
        });
    }

    prepareChartData() {
        const labels = this.cloudSubscriptionFindingStats.map((stat) =>
            this.datePipe.transform(stat.dateInserted, 'dd MMM')
        );
        const cloudScanData = this.cloudSubscriptionFindingStats.map(
            (stat) => stat.criticalFindings + stat.highFindings
        )
        this.chartLineData = {
            labels: labels,
            datasets: [
                {
                    label: 'Cloud Scan',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: cloudScanData,
                }
            ],
        };
    }


    getLastOpenedFindings(): number {
        return this.cloudSubscriptionFindingStats.length > 0
            ? this.cloudSubscriptionFindingStats[this.cloudSubscriptionFindingStats.length - 1].openedFindings
            : 0;
    }
    getLastRemovedFinding(): number {
        return this.cloudSubscriptionFindingStats.length > 0
            ? this.cloudSubscriptionFindingStats[this.cloudSubscriptionFindingStats.length - 1].removedFindings
            : 0;
    }
    getLastFixTime(): number {
        return this.cloudSubscriptionFindingStats.length > 0
            ? this.cloudSubscriptionFindingStats[this.cloudSubscriptionFindingStats.length - 1].averageFixTime
            : 0;
    }

    countFindings(vulnerabilities: Vulnerability[]) {
        const counts = {
            critical: 0,
            high: 0,
            rest: 0,
        };

        vulnerabilities.forEach((vuln) => {
            if (vuln.status === 'EXISTING' || vuln.status === 'NEW') {
                if (vuln.severity === 'CRITICAL') {
                    counts.critical++;
                } else if (vuln.severity === 'HIGH') {
                    counts.high++;
                } else {
                    counts.rest++;
                }
            }
        });

        return counts;
    }

    updateFilterName(event: any) {
        const val = event.target.value.toLowerCase();
        this.filters['name'] = val;
        this.applyFilters();
    }

    updateFilterLocation(event: any) {
        const val = event.target.value.toLowerCase();
        this.filters['location'] = val;
        this.applyFilters();
    }

    updateFilterStatus(event: any) {
        const val = event.target.value;
        this.filters['status'] = val;
        this.applyFilters();
    }

    updateFilterSeverity(event: any) {
        const val = event.target.value;
        this.filters['severity'] = val;
        this.applyFilters();
    }


    toggleShowRemoved(event: any) {
        this.showRemoved = event.target.checked;
        this.applyFilters();
    }


    applyFilters() {
        this.filteredVulns = this.vulns.filter((vuln) => {
            const matchesFilters = Object.keys(this.filters).every((key) => {
                const filterValue = this.filters[key];
                if (!filterValue) return true;
                const vulnValue = (vuln as any)[key];
                return vulnValue
                    .toString()
                    .toLowerCase()
                    .includes(filterValue.toLowerCase());
            });

            const matchesStatus = (this.showRemoved || vuln.status !== 'REMOVED');

            return matchesFilters && matchesStatus;
        });
    }

    runScan() {
        this.cloudSubscriptionService.runScan(+this.id).subscribe({
            next: (response) => {
                this.toastStatus = 'success';
                this.toastMessage = 'Successfully requested a scan';
                this.toggleToast();
            },
        });
    }

    openChangeTeamModal() {
        // Load available teams first
        this.teamService.get().subscribe({
            next: (teams: Team[]) => {
                this.availableTeams = teams.filter(team => team.id !== this.cloudSubscriptionData?.team?.id);
                this.changeTeamModalVisible = true;
            },
            error: (error: any) => {
                this.toastStatus = 'danger';
                this.toastMessage = 'Error loading teams';
                this.toggleToast();
            }
        });
    }

    executeTeamChange() {
        if (this.confirmationText === 'accept' && this.selectedNewTeamId) {
            this.cloudSubscriptionService.changeTeam(this.cloudSubscriptionData.id, this.selectedNewTeamId).subscribe({
                next: () => {
                    this.toastStatus = 'success';
                    this.toastMessage = 'Team changed successfully';
                    this.toggleToast();
                    this.loadCloudSubscriptionInfo();
                },
                error: (error: any) => {
                    this.toastStatus = 'danger';
                    this.toastMessage = error.error?.message || 'Error changing team';
                    this.toggleToast();
                },
                complete: () => {
                    this.confirmationModalVisible = false;
                    this.confirmationText = '';
                    this.selectedNewTeamId = null;
                }
            });
        }
    }

    closeChangeTeamModal() {
        this.changeTeamModalVisible = false;
        this.selectedNewTeamId = null;
    }

    confirmTeamChange() {
        this.changeTeamModalVisible = false;
        this.confirmationModalVisible = true;
    }

    closeConfirmationModal() {
        this.confirmationModalVisible = false;
        this.confirmationText = '';
    }

    addComment() {
        if (!this.newComment?.trim() || this.isAddingComment || this.selectedRowId === null) {
            return;
        }

        const findingId = this.selectedRowId;
        this.isAddingComment = true;

        this.cloudSubscriptionService.addComment(+this.id, findingId, this.newComment.trim())
            .subscribe({
                next: () => {
                    if (findingId !== null) {
                        this.cloudSubscriptionService.getFinding(+this.id, findingId).subscribe({
                            next: (response) => {
                                this.singleVuln = response;
                                this.newComment = '';
                                this.toastStatus = 'success';
                                this.toastMessage = 'Comment added successfully';
                                this.toggleToast();
                            }
                        });
                    }
                },
                error: (error) => {
                    this.toastStatus = 'danger';
                    this.toastMessage = 'Error adding comment';
                    this.toggleToast();
                },
                complete: () => {
                    this.isAddingComment = false;
                }
            });
    }

    position = 'top-end';
    visible = false;
    percentage = 0;
    toastMessage: string = '';
    toastStatus: string = '';

    toggleToast() {
        this.visible = !this.visible;
    }

    viewVulnerabilityDetails(row: Vulnerability) {
        this.selectedRowId = row.id;
        this.detailsModal = true;
        this.cloudSubscriptionService.getFinding(+this.id, this.selectedRowId).subscribe({
            next: (response) => {
                this.singleVuln = response;
                this.cdr.markForCheck();
            },
        });
    }

    onVisibleChange($event: boolean) {
        this.visible = $event;
        this.percentage = !this.visible ? 0 : this.percentage;
    }

    handleDetailsModal(visible: boolean) {
        this.detailsModal = visible;
    }

    closeModal() {
        this.detailsModal = false;
    }

    /**
     * Handle refresh data with visual feedback
     */
    refreshData(): void {
        // Show loading feedback
        this.toastStatus = 'info';
        this.toastMessage = 'Refreshing statistics data...';
        this.toggleToast();

        // Reload relevant data
        this.loadCloudSubscriptionFindingStats();
    }
}