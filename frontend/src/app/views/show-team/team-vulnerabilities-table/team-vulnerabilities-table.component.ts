import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as XLSX from 'xlsx';
import {
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent, FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormLabelDirective,
  FormSelectDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  SpinnerComponent,
  TooltipDirective
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatePipe, NgFor, NgIf, NgClass } from '@angular/common';
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
  urgency?: string;
  component_name: string;
  repoUrl: string;
}

@Component({
  selector: 'app-team-vulnerabilities-table',
  standalone: true,
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    ButtonDirective,
    SpinnerComponent,
    NgxDatatableModule,
    IconDirective,
    BadgeComponent,
    DatePipe,
    NgIf,
    NgFor,
    NgClass,
    FormsModule,
    TooltipDirective,
    FormCheckComponent,
    FormLabelDirective,
    FormSelectDirective,
  ],
  templateUrl: './team-vulnerabilities-table.component.html',
  styleUrls: ['./team-vulnerabilities-table.component.scss']
})
export class TeamVulnerabilitiesTableComponent implements OnInit, OnChanges {
  @Input() filteredVulns: Vulnerability[] = [];
  @Input() showRemoved: boolean = false;
  @Input() showSuppressed: boolean = false;
  @Input() bulkActionMode: boolean = false;
  @Input() selectedFindings: number[] = [];
  @Input() vulnerabilitiesLoading: boolean = false;
  @Input() vulnerabilitiesLimit: number = 15;
  @Input() filters?: { [key: string]: string };

  // Repo parity inputs
  @Input() repoData: any;
  @Input() vulns: Vulnerability[] = [];
  @Input() selectedBranch: string | null = null;
  @Input() showUrgent: boolean = false;
  @Input() showNotable: boolean = false;
  @Input() hasUrgentFindings: boolean = false;
  @Input() hasNotableFindings: boolean = false;
  @Input() currentFilters: { [key: string]: string } | null = null;

  @Output() updateFilterNameEvent = new EventEmitter<any>();
  @Output() updateFilterComponentEvent = new EventEmitter<any>();
  @Output() updateFilterSourceEvent = new EventEmitter<any>();
  @Output() updateFilterStatusEvent = new EventEmitter<any>();
  @Output() updateFilterSeverityEvent = new EventEmitter<any>();
  @Output() toggleShowRemovedEvent = new EventEmitter<any>();
  @Output() toggleShowSuppressedEvent = new EventEmitter<any>();
  @Output() toggleBulkActionEvent = new EventEmitter<void>();
  @Output() selectAllFindingsEvent = new EventEmitter<any>();
  @Output() onSelectFindingEvent = new EventEmitter<{id: number, event: any}>();
  @Output() suppressSelectedFindingsEvent = new EventEmitter<void>();
  @Output() vulnerabilitiesLimitChange = new EventEmitter<number>();
  @Output() viewVulnerabilityDetailsEvent = new EventEmitter<Vulnerability>();
  @Output() clearFiltersEvent = new EventEmitter<void>();
  // Parity outputs
  @Output() updateFilterLocationEvent = new EventEmitter<any>();
  @Output() toggleShowUrgentEvent = new EventEmitter<any>();
  @Output() toggleShowNotableEvent = new EventEmitter<any>();
  @Output() onBranchSelectEvent = new EventEmitter<any>();

  statusFilter: string = '';

  // Ensure we have a local object to bind to when parent hasn't provided one yet
  private ensureCurrentFilters(): { [key: string]: string } {
    if (!this.currentFilters) {
      this.currentFilters = { name: '', location: '', source: '', status: '', severity: '' };
    }
    return this.currentFilters;
  }

  // Safe proxy for template bindings (always non-null)
  get cf(): { [key: string]: string } {
    return this.ensureCurrentFilters();
  }
  //
  // filters: { [key: string]: string } = {
  //   name: '',
  //   location: '',
  //   source: '',
  //   status: '',
  //   severity: '',
  // };

  updateFilterName(event: any): void {
    const v = (typeof event === 'string') ? event : (event?.target?.value ?? '').toString();
    this.ensureCurrentFilters()['name'] = v;
    this.updateFilterNameEvent.emit({ target: { value: v } });
  }

  updateFilterLocation(event: any): void {
    const v = (typeof event === 'string') ? event : (event?.target?.value ?? '').toString();
    this.ensureCurrentFilters()['location'] = v;
    this.updateFilterLocationEvent.emit({ target: { value: v } });
  }

  updateFilterComponent(event: any): void {
    const v = (typeof event === 'string') ? event : (event?.target?.value ?? '').toString();
    this.ensureCurrentFilters()['location'] = v;
    this.updateFilterComponentEvent.emit({ target: { value: v } });
  }

  updateFilterSource(event: any): void {
    const v = (typeof event === 'string') ? event : (event?.target?.value ?? '').toString();
    this.ensureCurrentFilters()['source'] = v;
    this.updateFilterSourceEvent.emit({ target: { value: v } });
  }

  updateFilterStatus(event: any): void {
    const v = (typeof event === 'string') ? event : (event?.target?.value ?? '').toString();
    this.statusFilter = v || '';
    this.ensureCurrentFilters()['status'] = v;
    this.updateFilterStatusEvent.emit({ target: { value: v } });
  }

  updateFilterSeverity(event: any): void {
    const v = (typeof event === 'string') ? event : (event?.target?.value ?? '').toString();
    this.ensureCurrentFilters()['severity'] = v;
    this.updateFilterSeverityEvent.emit({ target: { value: v } });
  }

  toggleShowRemoved(event: any): void {
    const checked = (typeof event === 'boolean') ? event : !!event?.target?.checked;
    this.toggleShowRemovedEvent.emit({ target: { checked } });
  }

  toggleShowSuppressed(event: any): void {
    const checked = (typeof event === 'boolean') ? event : !!event?.target?.checked;
    this.toggleShowSuppressedEvent.emit({ target: { checked } });
  }

  toggleShowUrgent(stateOrEvent: any): void {
    const checked = (typeof stateOrEvent === 'boolean') ? stateOrEvent : !!stateOrEvent?.target?.checked;
    // Update local state for immediate UI feedback
    this.showUrgent = checked;
    if (checked && this.showNotable) {
      this.showNotable = false;
      // Inform parent that notable turned off due to mutual exclusion
      this.toggleShowNotableEvent.emit({ target: { checked: false } });
    }
    // Inform parent of the final urgent state
    this.toggleShowUrgentEvent.emit({ target: { checked } });
  }

  toggleShowNotable(stateOrEvent: any): void {
    const checked = (typeof stateOrEvent === 'boolean') ? stateOrEvent : !!stateOrEvent?.target?.checked;
    // Update local state for immediate UI feedback
    this.showNotable = checked;
    if (checked && this.showUrgent) {
      this.showUrgent = false;
      // Inform parent that urgent turned off due to mutual exclusion
      this.toggleShowUrgentEvent.emit({ target: { checked: false } });
    }
    // Inform parent of the final notable state
    this.toggleShowNotableEvent.emit({ target: { checked } });
  }

  onBranchSelect(event: any): void {
    this.onBranchSelectEvent.emit(event);
  }

  isLinkableSource(source: string): boolean {
    const linkableSources = ['SAST', 'IAC', 'SECRETS', 'DAST'];
    return linkableSources.includes(source);
  }

  getRepositoryLinkForRow(row: any): string {
    if (!row?.location) return '#';
    if (row.source === 'DAST') {
      return row.location.startsWith('http') ? row.location : `//${row.location}`;
    }
    if (!this.repoData?.repourl) return '#';

    const location = row.location;
    const repoUrl = this.repoData.repourl;
    const branch = this.selectedBranch || this.repoData?.defaultBranch?.name;

    const match = location.match(/(.*):(\d+)/);
    if (!match) return repoUrl;

    const [, filePath, lineNumber] = match;
    if (repoUrl.includes('github.com')) {
      return `${repoUrl}/blob/${branch}/${filePath}#L${lineNumber}`;
    } else if (repoUrl.includes('gitlab.com')) {
      const baseUrl = repoUrl.replace(/\/?$/, '');
      return `${baseUrl}/-/blob/${branch}/${filePath}#L${lineNumber}`;
    }
    return repoUrl;
  }

  getFormattedLocationForRow(row: any): string {
    if (!row?.location) return 'Location not available';
    if (row.source === 'DAST' || row.source === 'SCA' || row.source === 'GITLAB_SCANNER') {
      return row.location;
    }
    const match = row.location.match(/(.*):(\d+)/);
    if (!match) return row.location;
    const [, filePath, lineNumber] = match;
    return `${filePath}:${lineNumber} `;
  }

  // === XLSX Export ===
  private formatDateForXlsx(d?: string | Date | null) {
    if (!d) return '';
    const date = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(date.getTime())) return '';
    return date.toISOString();
  }

  private mapRowForExport(row: any): Record<string, any> {
    return {
      Severity: row?.severity ?? '',
      Name: row?.name ?? '',
      Status: row?.status ?? '',
      Urgency: row?.urgency ? (row.urgency === 'urgent' ? 'Urgent' : 'Notable') : '',
      'Last Seen': this.formatDateForXlsx(row?.last_seen),
      Source: row?.source ?? '',
      Location: this.getFormattedLocationForRow(row),
      RepoUrl: row?.repoUrl ?? '',
    };
  }

  private buildFiltersSheet(): XLSX.WorkSheet {
    const filters: Array<{ Key: string; Value: any }> = [
      { Key: 'Branch', Value: this.selectedBranch || this.repoData?.defaultBranch?.name || '' },
      { Key: 'Status filter (header select)', Value: this.cf?.['status'] ?? '' },
      { Key: 'Severity', Value: this.cf?.['severity'] ?? '' },
      { Key: 'Name contains', Value: this.cf?.['name'] ?? '' },
      { Key: 'Source', Value: this.cf?.['source'] ?? '' },
      { Key: 'Location contains', Value: this.cf?.['location'] ?? '' },
      { Key: 'Show Removed toggle', Value: !!this.showRemoved },
      { Key: 'Show Suppressed toggle', Value: !!this.showSuppressed },
      { Key: 'Urgent Only toggle', Value: !!this.showUrgent },
      { Key: 'Notable Only toggle', Value: !!this.showNotable },
      { Key: 'StatusFilter (global)', Value: this.statusFilter ?? '' },
      { Key: 'Page Size (limit)', Value: this.vulnerabilitiesLimit ?? '' },
    ];

    const ws = XLSX.utils.json_to_sheet(filters);
    (ws as any)['!cols'] = [{ wch: 28 }, { wch: 50 }];
    return ws;
  }

  private getDataForExport(mode: 'filtered' | 'selected'): Vulnerability[] {
    if (mode === 'selected') {
      const selectedIds = new Set(this.selectedFindings ?? []);
      return (this.filteredVulns ?? []).filter((r: any) => selectedIds.has(r.id));
    }
    return this.filteredVulns ?? [];
  }

  public exportToExcel(mode: 'filtered' | 'selected' = 'filtered'): void {
    const rows = this.getDataForExport(mode);
    if (!rows?.length) { return; }

    const exportRows = rows.map(r => this.mapRowForExport(r));

    const wb = XLSX.utils.book_new();
    const wsData = XLSX.utils.json_to_sheet(exportRows, { dateNF: 'yyyy-mm-dd hh:mm' });
    const headers = Object.keys(exportRows[0] || {});
    (wsData as any)['!cols'] = headers.map(h => ({ wch: Math.max(12, h.length + 2) }));
    XLSX.utils.book_append_sheet(wb, wsData, mode === 'selected' ? 'Selected' : 'Filtered');

    const wsFilters = this.buildFiltersSheet();
    XLSX.utils.book_append_sheet(wb, wsFilters, 'Filters');

    const branchName = (this.selectedBranch || this.repoData?.defaultBranch?.name || 'branch')
      .toString()
      .replace(/[^\w.-]+/g, '_');

    const ts = new Date();
    const stamp = [
      ts.getFullYear(),
      String(ts.getMonth() + 1).padStart(2, '0'),
      String(ts.getDate()).padStart(2, '0'),
      String(ts.getHours()).padStart(2, '0'),
      String(ts.getMinutes()).padStart(2, '0'),
    ].join('');

    const fileName = `vulnerabilities_${branchName}_${mode}_${stamp}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  toggleBulkAction(): void {
    this.toggleBulkActionEvent.emit();
  }

  selectAllFindings(event: any): void {
    this.selectAllFindingsEvent.emit(event);
  }

  onSelectFinding(id: number, event: any): void {
    this.onSelectFindingEvent.emit({id, event});
  }

  suppressSelectedFindings(): void {
    this.suppressSelectedFindingsEvent.emit();
  }

  onLimitChange(newLimit: number): void {
    this.vulnerabilitiesLimit = newLimit;
    this.vulnerabilitiesLimitChange.emit(newLimit);
  }

  isSelected(id: number): boolean {
    return this.selectedFindings.includes(id);
  }

  click(row: Vulnerability): void {
    this.viewVulnerabilityDetailsEvent.emit(row);
  }

  clearFilters(): void {
    this.clearFiltersEvent.emit();
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    // Parent controls filters; no auto-reset here
  }
}