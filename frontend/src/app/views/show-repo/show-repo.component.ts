import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit, ViewEncapsulation,
} from '@angular/core';
import {
    MarkdownComponent,
    MarkdownModule,
    provideMarkdown,
} from 'ngx-markdown';
import {
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
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ProgressComponent,
    RowComponent,
    SpinnerComponent,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    TemplateIdDirective,
    WidgetStatCComponent,
    ModalModule,
    WidgetStatFComponent,
    ToastBodyComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToasterComponent,
    AccordionItemComponent,
    AccordionButtonDirective,
    AccordionComponent,
    ListGroupDirective,
    ListGroupItemDirective,
    TooltipDirective,
} from '@coreui/angular';
import { IconComponent, IconDirective, IconSetService } from '@coreui/icons-angular';
import {
    brandSet,
    cilArrowRight,
    cilBug,
    cilCenterFocus,
    cilChartPie,
    cilCommentSquare,
    cilBurn,
    cilGraph,
    cilTrash,
    cilVolumeOff,
    cilMagnifyingGlass, freeSet,
} from '@coreui/icons';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { ChartData } from 'chart.js/dist/types';
import { ChartOptions } from 'chart.js';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { RepoService } from '../../service/RepoService';
import { AuthService } from '../../service/AuthService';
import { ActivatedRoute, Router } from '@angular/router';
import { FindingSourceStatDTO } from '../../model/FindingSourceStatDTO';
import { FindingDTO, SingleFindingDTO } from '../../model/FindingDTO';
import { FormsModule } from '@angular/forms';

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

interface Location {
    [key: string]: string;
}

interface AppDataType {
    id: number;
    categoryName: string;
    name: string;
    categoryGroups: string[];
    location: Location;
}

interface GroupedAppDataType {
    categoryGroup: string;
    appDataTypes: AppDataType[];
}

export interface CodeRepoFindingStats {
    id: number;
    dateInserted: string; // Using string to represent ISO date format
    sastCritical: number;
    sastHigh: number;
    sastMedium: number;
    sastRest: number;
    scaCritical: number;
    scaHigh: number;
    scaMedium: number;
    scaRest: number;
    iacCritical: number;
    iacHigh: number;
    iacMedium: number;
    iacRest: number;
    secretsCritical: number;
    secretsHigh: number;
    secretsMedium: number;
    secretsRest: number;
    openedFindings: number;
    removedFindings: number;
    reviewedFindings: number;
    averageFixTime: number;
}

@Component({
    selector: 'app-show-repo',
    standalone: true,
    imports: [
        RowComponent,
        ColComponent,
        CardComponent,
        ButtonDirective,
        IconDirective,
        CardFooterComponent,
        ProgressComponent,
        CardBodyComponent,
        ChartjsComponent,
        CardHeaderComponent,
        WidgetStatCComponent,
        TemplateIdDirective,
        TabsListComponent,
        TabsContentComponent,
        TabPanelComponent,
        TabsComponent,
        TabDirective,
        NgxDatatableModule,
        BadgeComponent,
        NgIf,
        AlertComponent,
        SpinnerComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        FormCheckComponent,
        FormLabelDirective,
        FormControlDirective,
        FormSelectDirective,
        FormCheckLabelDirective,
        FormCheckInputDirective,
        ModalModule,
        DatePipe,
        NgForOf,
        WidgetStatFComponent,
        IconComponent,
        FormsModule,
        ToastBodyComponent,
        ToastComponent,
        ToastHeaderComponent,
        ToasterComponent,
        AccordionItemComponent,
        AccordionButtonDirective,
        AccordionComponent,
        ListGroupDirective,
        ListGroupItemDirective,
        TooltipDirective,
        MarkdownModule,
    ],
    templateUrl: './show-repo.component.html',
    styleUrls: ['./show-repo.component.scss'],
    providers: [DatePipe, provideMarkdown()],
    encapsulation: ViewEncapsulation.None
})
export class ShowRepoComponent implements OnInit, AfterViewInit {
    repoData: any;
    repoId: string = '';
    findings: FindingDTO | undefined;
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
    sourceStats: FindingSourceStatDTO = new FindingSourceStatDTO();
    topLanguages: { name: string; value: number; color: string }[] = [];
    chartPieData: ChartData | undefined;
    singleVuln: SingleFindingDTO | undefined;
    suppressReason: string = '';
    suppressReasons: string[] = ['WONT_FIX', 'FALSE_POSITIVE', 'ACCEPTED'];
    counts: any;
    grouppedDataTypes: any;
    isAccordionVisible: boolean[] = [];
    codeRepoFindingStats: CodeRepoFindingStats[] = [];
    filtersNew: { [key: string]: string } = {
        group: '',
        name: '',
        version: '',
    };
    scanRunning: boolean = false;
    userRole: string = 'USER';

    filteredComponents: any[] = [];
    scanInfos: any[] = [];
    scanInfosFiltered: any[] = [];

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
                label: 'SAST',
                backgroundColor: 'rgba(220, 220, 220, 0.2)',
                borderColor: 'rgba(220, 220, 220, 1)',
                pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                pointBorderColor: '#fff',
                data: [],
            },
            {
                label: 'IaC',
                backgroundColor: 'rgba(151, 187, 205, 0.2)',
                borderColor: 'rgb(71, 180, 234)',
                pointBackgroundColor: 'rgb(71, 163, 211)',
                pointBorderColor: '#bd7777',
                data: [],
            },
            {
                label: 'Secrets',
                backgroundColor: 'rgba(151, 187, 205, 0.2)',
                borderColor: 'rgb(28, 197, 45)',
                pointBackgroundColor: 'rgb(102, 190, 107)',
                pointBorderColor: '#bd7777',
                data: [],
            },
            {
                label: 'SCA',
                backgroundColor: 'rgba(151, 187, 205, 0.2)',
                borderColor: 'rgb(210, 124, 56)',
                pointBackgroundColor: 'rgb(128, 101, 56)',
                pointBorderColor: '#bd7777',
                data: [],
            },
        ],
    };

    vulns: Vulnerability[] = [];
    filteredVulns = [...this.vulns]; // a copy of the original rows for filtering

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
    showSuppressed: boolean = false;
    detailsModal: boolean = false;
    selectedRowId: number | null = null;

    bulkActionMode: boolean = false;
    selectedFindings: number[] = [];

    // New properties for loading indicators and limits
    vulnerabilitiesLoading: boolean = false;
    vulnerabilitiesLimit: number = 15;

    scanInfoLoading: boolean = false;
    scanInfoLimit: number = 15;

    componentsLimit: number = 10;

    // Search filter for Scan Info
    scanInfoFilter: string = '';

    constructor(
        public iconSet: IconSetService,
        private repoService: RepoService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private datePipe: DatePipe
    ) {
        iconSet.icons = { ...brandSet, ...freeSet };

        this.applyFilters(); // Apply initial filters to exclude Removed and Suppressed
    }

    ngAfterViewInit() {
        //this.cdr.detectChanges();
    }

    ngOnInit(): void {
        // @ts-ignore
        this.userRole = localStorage.getItem('userRole');
        this.cdr.detectChanges();

        this.route.paramMap.subscribe((params) => {
            this.repoId = params.get('id') || '';
        });
        this.authService.hc().subscribe({
            next: () => {
                // Health check passed, proceed with loading the dashboard
            },
            error: () => {
                // Health check failed, redirect to login
                this.router.navigate(['/login']);
            },
        });
        this.loadRepoInfo();
        this.loadSourceStats();
        this.loadFindings();
        this.loadFindingStats();
    }

    loadRepoInfo() {
        this.scanInfoLoading = true;
        this.repoService.getRepo(+this.repoId).subscribe({
            next: (response) => {
                this.repoData = response;
                this.grouppedDataTypes = this.groupAppDataTypesByCategory(
                    this.repoData.appDataTypes
                );
                this.topLanguages = this.getTopLanguages(this.repoData.languages);
                this.filteredComponents = [...this.repoData?.components];
                this.scanInfos = response.scanInfos;
                this.applyScanInfoFilter(); // Apply filter after data is loaded
                this.scanInfoLoading = false;
                if (
                    response.sastScan === 'RUNNING' ||
                    response.scaScan === 'RUNNING' ||
                    response.secretsScan === 'RUNNING' ||
                    response.iacScan === 'RUNNING'
                ) {
                    this.scanRunning = true;
                }
            },
            error: () => {
                this.scanInfoLoading = false;
            },
        });
    }
    loadFindings() {
        this.vulnerabilitiesLoading = true;
        this.repoService.getFindingsDefBranch(+this.repoId).subscribe({
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
    loadFindingStats() {
        this.repoService.getFindingStats(+this.repoId).subscribe({
            next: (response) => {
                this.codeRepoFindingStats = response.sort(
                    (a: CodeRepoFindingStats, b: CodeRepoFindingStats) =>
                        new Date(a.dateInserted).getTime() -
                        new Date(b.dateInserted).getTime()
                );
                this.prepareChartData();
            },
        });
    }
    loadSourceStats() {
        this.repoService.getSourceStats(+this.repoId).subscribe({
            next: (response) => {
                this.sourceStats = response;
                this.chartPieData = {
                    labels: ['SAST', 'SCA', 'Secrets', 'IaC'],
                    datasets: [
                        {
                            data: [
                                this.sourceStats.sast,
                                this.sourceStats.sca,
                                this.sourceStats.secrets,
                                this.sourceStats.iac,
                            ],
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#3eabb7',
                                '#FFCE12',
                            ],
                            hoverBackgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#449a77',
                                '#FFCE12',
                            ],
                        },
                    ],
                };
            },
        });
    }
    get randomData() {
        return Math.round(Math.random() * 100);
    }

    click(row: Vulnerability) {
        this.selectedRowId = row.id;
        this.detailsModal = true;
        this.repoService.getFinding(+this.repoId, this.selectedRowId).subscribe({
            next: (response) => {
                this.singleVuln = response;
                this.cdr.markForCheck();
            },
        });
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
    updateFilterSource(event: any) {
        const val = event.target.value;
        this.filters['source'] = val;
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

    toggleShowSuppressed(event: any) {
        this.showSuppressed = event.target.checked;
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

            const matchesStatus =
                (this.showRemoved || vuln.status !== 'REMOVED') &&
                (this.showSuppressed || vuln.status !== 'SUPRESSED');

            return matchesFilters && matchesStatus;
        });
    }

    handleDetailsModal(visible: boolean) {
        this.detailsModal = visible;
    }

    closeModal() {
        this.detailsModal = false;
    }

    getTopLanguages(languages: { [name: string]: number }): {
        name: string;
        value: number;
        color: string;
    }[] {
        const colors = ['success', 'warning', 'primary', 'secondary', 'info'];

        return Object.entries(languages)
            .map(([name, value], index) => ({ name, value, color: colors[index] }))
            .sort((a, b) => b.value - a.value) // Sort by value descending
            .slice(0, 4); // Take the top 4 entries
    }

    refreshData() {
        alert('clicked');
    }
    suppressFinding() {
        // Implement your logic to handle the suppression of the finding here
        if (this.selectedRowId && this.suppressReason) {
            this.repoService
                .supressFinding(+this.repoId, this.selectedRowId, this.suppressReason)
                .subscribe({
                    next: (response) => {
                        this.toastStatus = 'success';
                        this.toastMessage = 'Successfully Suppressed finding';
                        this.toggleToast();
                        this.loadFindings();
                    },
                });
        }
        this.closeModal();
        this.applyFilters();
    }

    position = 'top-end';
    visible = false;
    percentage = 0;
    toastMessage: string = '';
    toastStatus: string = '';

    toggleToast() {
        this.visible = !this.visible;
    }
    onVisibleChange($event: boolean) {
        this.visible = $event;
        this.percentage = !this.visible ? 0 : this.percentage;
    }

    reactivateFinding() {
        if (this.selectedRowId) {
            this.repoService
                .reActivateFinding(+this.repoId, this.selectedRowId)
                .subscribe({
                    next: (response) => {
                        this.toastStatus = 'success';
                        this.toastMessage = 'Successfully Re-Activated finding';
                        this.toggleToast();
                        this.loadFindings();
                    },
                });
        }
        this.closeModal();
    }

    onBranchSelect(event: any) {
        const selectedBranchId = event.target.value;
        this.repoService.getFindingsBranch(+this.repoId, selectedBranchId).subscribe({
            next: (response) => {
                this.vulns = response;
                this.filteredVulns = [...this.vulns];
                this.counts = this.countFindings(this.vulns);
                this.applyFilters();
                this.toastStatus = 'success';
                this.toastMessage = 'Successfully switched to another branch';
                this.toggleToast();
            },
        });
        // Call a method to handle the selected branch ID
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

    groupAppDataTypesByCategory(appDataTypes: AppDataType[]): GroupedAppDataType[] {
        const categoryGroupMap: { [key: string]: AppDataType[] } = {};

        appDataTypes.forEach((appDataType) => {
            appDataType.categoryGroups.forEach((categoryGroup) => {
                if (!categoryGroupMap[categoryGroup]) {
                    categoryGroupMap[categoryGroup] = [];
                }

                // Check if appDataType already exists in the category group based on a unique property
                const isDuplicate = categoryGroupMap[categoryGroup].some(
                    (existingAppDataType) =>
                        existingAppDataType.id === appDataType.id ||
                        existingAppDataType.name === appDataType.name
                );

                if (!isDuplicate) {
                    categoryGroupMap[categoryGroup].push(appDataType);
                }
            });
        });

        return Object.keys(categoryGroupMap).map((categoryGroup) => ({
            categoryGroup,
            appDataTypes: categoryGroupMap[categoryGroup],
        }));
    }

    toggleAccordion(index: number): void {
        this.isAccordionVisible[index] = !this.isAccordionVisible[index];
    }

    getKeys(obj: any): string[] {
        return Object.keys(obj);
    }
    prepareChartData() {
        const labels = this.codeRepoFindingStats.map((stat) =>
            this.datePipe.transform(stat.dateInserted, 'dd MMM')
        );
        const sastData = this.codeRepoFindingStats.map(
            (stat) => stat.sastCritical + stat.sastHigh + stat.sastMedium + stat.sastRest
        );
        const iacData = this.codeRepoFindingStats.map(
            (stat) => stat.iacCritical + stat.iacHigh + stat.iacMedium + stat.iacRest
        );
        const secretsData = this.codeRepoFindingStats.map(
            (stat) =>
                stat.secretsCritical + stat.secretsHigh + stat.secretsMedium + stat.secretsRest
        );
        const scaData = this.codeRepoFindingStats.map(
            (stat) => stat.scaCritical + stat.scaHigh + stat.scaMedium + stat.scaRest
        );

        this.chartLineData = {
            labels: labels,
            datasets: [
                {
                    label: 'SAST',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: sastData,
                },
                {
                    label: 'IaC',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgb(71, 180, 234)',
                    pointBackgroundColor: 'rgb(71, 163, 211)',
                    pointBorderColor: '#bd7777',
                    data: iacData,
                },
                {
                    label: 'Secrets',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgb(28, 197, 45)',
                    pointBackgroundColor: 'rgb(102, 190, 107)',
                    pointBorderColor: '#bd7777',
                    data: secretsData,
                },
                {
                    label: 'SCA',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgb(210, 124, 56)',
                    pointBackgroundColor: 'rgb(128, 101, 56)',
                    pointBorderColor: '#bd7777',
                    data: scaData,
                },
            ],
        };
    }
    getLastOpenedFindings(): number {
        return this.codeRepoFindingStats.length > 0
            ? this.codeRepoFindingStats[this.codeRepoFindingStats.length - 1].openedFindings
            : 0;
    }
    getLastRemovedFinding(): number {
        return this.codeRepoFindingStats.length > 0
            ? this.codeRepoFindingStats[this.codeRepoFindingStats.length - 1].removedFindings
            : 0;
    }
    getLastFixTime(): number {
        return this.codeRepoFindingStats.length > 0
            ? this.codeRepoFindingStats[this.codeRepoFindingStats.length - 1].averageFixTime
            : 0;
    }
    getLastRevievedFinding(): number {
        return this.codeRepoFindingStats.length > 0
            ? this.codeRepoFindingStats[this.codeRepoFindingStats.length - 1].reviewedFindings
            : 0;
    }

    updateFilterGroup(event: any) {
        const val = event.target.value.toLowerCase();
        this.filtersNew['group'] = val;
        this.applyFiltersNew();
    }

    updateFilterNameNew(event: any) {
        const val = event.target.value.toLowerCase();
        this.filtersNew['name'] = val;
        this.applyFiltersNew();
    }

    updateFilterVersion(event: any) {
        const val = event.target.value.toLowerCase();
        this.filtersNew['version'] = val;
        this.applyFiltersNew();
    }

    applyFiltersNew() {
        this.filteredComponents = this.repoData?.components.filter(
            (component: { groupid: string; name: string; version: string }) => {
                return (
                    (!this.filtersNew['group'] ||
                        component.groupid?.toLowerCase().includes(this.filtersNew['group'])) &&
                    (!this.filtersNew['name'] ||
                        component.name?.toLowerCase().includes(this.filtersNew['name'])) &&
                    (!this.filtersNew['version'] ||
                        component.version?.toLowerCase().includes(this.filtersNew['version']))
                );
            }
        );
    }

    protected readonly JSON = JSON;

    runScan() {
        this.repoService.runScan(+this.repoId).subscribe({
            next: (response) => {
                this.toastStatus = 'success';
                this.toastMessage = 'Successfully requested a scan';
                this.toggleToast();
                this.loadRepoInfo();
            },
        });
    }

    toggleBulkAction() {
        this.bulkActionMode = !this.bulkActionMode;
        if (!this.bulkActionMode) {
            this.selectedFindings = [];
        }
    }

    onSelectFinding(id: number, event: any) {
        if (event.target.checked) {
            if (!this.selectedFindings.includes(id)) {
                this.selectedFindings.push(id);
            }
        } else {
            this.selectedFindings = this.selectedFindings.filter(
                (findingId) => findingId !== id
            );
        }
    }

    isSelected(id: number): boolean {
        return this.selectedFindings.includes(id);
    }

    selectAllFindings(event: any) {
        if (event.target.checked) {
            this.selectedFindings = this.filteredVulns.map((vuln) => vuln.id);
        } else {
            this.selectedFindings = [];
        }
    }

    suppressSelectedFindings() {
        console.log('Selected Findings IDs:', this.selectedFindings);
        // Implement suppression logic here
        if (this.selectedFindings.length > 0) {
            const suppressReason = 'FALSE_POSITIVE'; // As per your requirement
            this.repoService
                .suppressMultipleFindings(+this.repoId, this.selectedFindings)
                .subscribe({
                    next: (response) => {
                        this.toastStatus = 'success';
                        this.toastMessage = 'Successfully Suppressed selected findings';
                        this.toggleToast();
                        this.loadFindings();
                        // Reset selections
                        this.selectedFindings = [];
                        this.bulkActionMode = false;
                    },
                    error: (error) => {
                        this.toastStatus = 'danger';
                        this.toastMessage = 'Failed to suppress selected findings';
                        this.toggleToast();
                    },
                });
        }
    }

    // Scan Info Filter Methods
    updateScanInfoFilter(event: any) {
        const val = event.target.value.toLowerCase();
        this.scanInfoFilter = val;
        this.applyScanInfoFilter();
    }

    applyScanInfoFilter() {
        this.scanInfosFiltered = this.scanInfos.filter((scanInfo) => {
            return (
                scanInfo.codeRepoBranch.name.toLowerCase().includes(this.scanInfoFilter) ||
                scanInfo.commitId.toLowerCase().includes(this.scanInfoFilter)
            );
        });
    }
}