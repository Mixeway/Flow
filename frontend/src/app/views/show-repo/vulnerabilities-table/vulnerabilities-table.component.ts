import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckComponent,
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
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
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
  urgency: string;
}

@Component({
  selector: 'app-vulnerabilities-table',
  standalone: true,
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    FormSelectDirective,
    NgIf,
    NgFor,
    NgClass,
    InputGroupComponent,
    InputGroupTextDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    ButtonDirective,
    SpinnerComponent,
    NgxDatatableModule,
    IconDirective,
    BadgeComponent,
    FormsModule,
    DatePipe,
    FormLabelDirective,
    TooltipDirective
  ],
  templateUrl: './vulnerabilities-table.component.html',
  styleUrls: ['./vulnerabilities-table.component.scss']
})
export class VulnerabilitiesTableComponent implements OnInit, OnChanges {
  @Input() repoData: any;
  @Input() vulns: Vulnerability[] = [];
  @Input() filteredVulns: Vulnerability[] = [];
  @Input() selectedBranch: string | null = null;
  @Input() showRemoved: boolean = false;
  @Input() showSuppressed: boolean = false;
  @Input() showUrgent: boolean = false;
  @Input() showNotable: boolean = false;
  @Input() hasUrgentFindings: boolean = false;
  @Input() hasNotableFindings: boolean = false;
  @Input() bulkActionMode: boolean = false;
  @Input() selectedFindings: number[] = [];
  @Input() vulnerabilitiesLoading: boolean = false;
  @Input() vulnerabilitiesLimit: number = 20;
  @Input() currentFilters: { [key: string]: string } | null = null;

  @Output() updateFilterNameEvent = new EventEmitter<any>();
  @Output() updateFilterLocationEvent = new EventEmitter<any>();
  @Output() updateFilterSourceEvent = new EventEmitter<any>();
  @Output() updateFilterStatusEvent = new EventEmitter<any>();
  @Output() updateFilterSeverityEvent = new EventEmitter<any>();
  @Output() toggleShowRemovedEvent = new EventEmitter<any>();
  @Output() toggleShowSuppressedEvent = new EventEmitter<any>();
  @Output() toggleShowUrgentEvent = new EventEmitter<any>();
  @Output() toggleShowNotableEvent = new EventEmitter<any>();
  @Output() toggleBulkActionEvent = new EventEmitter<void>();
  @Output() selectAllFindingsEvent = new EventEmitter<any>();
  @Output() onSelectFindingEvent = new EventEmitter<{id: number, event: any}>();
  @Output() suppressSelectedFindingsEvent = new EventEmitter<void>();
  @Output() onBranchSelectEvent = new EventEmitter<any>();
  @Output() viewVulnerabilityDetailsEvent = new EventEmitter<Vulnerability>();
  @Output() clearFiltersEvent = new EventEmitter<void>();
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

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Do not auto-reset filters here; parent owns source-of-truth (persistence/restore)
  }

  /**
   * Update name filter
   */
  updateFilterName(valueOrEvent: any): void {
    const v = (typeof valueOrEvent === 'string')
      ? valueOrEvent
      : (valueOrEvent?.target?.value ?? '').toString();
    this.ensureCurrentFilters()['name'] = v;
    this.updateFilterNameEvent.emit({ target: { value: v } });
  }

  /**
   * Update location filter
   */
  updateFilterLocation(valueOrEvent: any): void {
    const v = (typeof valueOrEvent === 'string')
      ? valueOrEvent
      : (valueOrEvent?.target?.value ?? '').toString();
    this.ensureCurrentFilters()['location'] = v;
    this.updateFilterLocationEvent.emit({ target: { value: v } });
  }

  /**
   * Update source filter
   */
  updateFilterSource(valueOrEvent: any): void {
    const v = (typeof valueOrEvent === 'string')
      ? valueOrEvent
      : (valueOrEvent?.target?.value ?? '').toString();
    this.ensureCurrentFilters()['source'] = v;
    this.updateFilterSourceEvent.emit({ target: { value: v } });
  }

  /**
   * Update status filter
   */
  updateFilterStatus(valueOrEvent: any): void {
    const v = (typeof valueOrEvent === 'string')
      ? valueOrEvent
      : (valueOrEvent?.target?.value ?? '').toString();
    this.ensureCurrentFilters()['status'] = v;
    this.updateFilterStatusEvent.emit({ target: { value: v } });
  }

  /**
   * Update severity filter
   */
  updateFilterSeverity(valueOrEvent: any): void {
    const v = (typeof valueOrEvent === 'string')
      ? valueOrEvent
      : (valueOrEvent?.target?.value ?? '').toString();
    this.ensureCurrentFilters()['severity'] = v;
    this.updateFilterSeverityEvent.emit({ target: { value: v } });
  }

  /**
   * Toggle showing removed vulnerabilities
   */
  toggleShowRemoved(stateOrEvent: any): void {
    const checked = (typeof stateOrEvent === 'boolean')
      ? stateOrEvent
      : !!stateOrEvent?.target?.checked;
    this.toggleShowRemovedEvent.emit({ target: { checked } });
  }

  /**
   * Toggle showing suppressed vulnerabilities
   */
  toggleShowSuppressed(stateOrEvent: any): void {
    const checked = (typeof stateOrEvent === 'boolean')
      ? stateOrEvent
      : !!stateOrEvent?.target?.checked;
    this.toggleShowSuppressedEvent.emit({ target: { checked } });
  }

  /**
   * Toggle showing urgent vulnerabilities
   */
  toggleShowUrgent(stateOrEvent: any): void {
    const checked = (typeof stateOrEvent === 'boolean')
      ? stateOrEvent
      : !!stateOrEvent?.target?.checked;
    this.toggleShowUrgentEvent.emit({ target: { checked } });
  }

  /**
   * Toggle showing notable vulnerabilities
   */
  toggleShowNotable(stateOrEvent: any): void {
    const checked = (typeof stateOrEvent === 'boolean')
      ? stateOrEvent
      : !!stateOrEvent?.target?.checked;
    this.toggleShowNotableEvent.emit({ target: { checked } });
  }

  /**
   * Toggle bulk action mode
   */
  toggleBulkAction(): void {
    this.toggleBulkActionEvent.emit();
  }

  /**
   * Select all findings
   */
  selectAllFindings(event: any): void {
    this.selectAllFindingsEvent.emit(event);
  }

  /**
   * Select an individual finding
   */
  onSelectFinding(id: number, event: any): void {
    this.onSelectFindingEvent.emit({id, event});
  }

  /**
   * Suppress selected findings
   */
  suppressSelectedFindings(): void {
    this.suppressSelectedFindingsEvent.emit();
  }

  /**
   * Handle branch selection
   */
  onBranchSelect(event: any): void {
    this.onBranchSelectEvent.emit(event);
  }

  /**
   * Check if a vulnerability is selected
   */
  isSelected(id: number): boolean {
    return this.selectedFindings.includes(id);
  }

  /**
   * Show vulnerability details
   */
  click(row: Vulnerability): void {
    this.viewVulnerabilityDetailsEvent.emit(row);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.clearFiltersEvent.emit();
  }

  /**
   * Checks if the vulnerability source type should have a clickable link.
   * @param source The vulnerability source (e.g., 'SAST', 'SCA').
   */
  isLinkableSource(source: string): boolean {
    const linkableSources = ['SAST', 'IAC', 'SECRETS', 'DAST'];
    return linkableSources.includes(source);
  }

  /**
   * Get repository link for a vulnerability row
   */
  getRepositoryLinkForRow(row: any): string {
    if (!row?.location) {
      return '#';
    }
    // For DAST, the location is a full URL and can be used directly.
    if (row.source === 'DAST') {
      return row.location.startsWith('http') ? row.location : `//${row.location}`;
    }

    if (!this.repoData?.repourl) {
      return '#';
    }
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

  /**
   * Get formatted location for a vulnerability row
   */
  getFormattedLocationForRow(row: any): string {
    if (!row?.location) {
      return 'Location not available';
    }
    // For these types, display the raw location string.
    if (row.source === 'DAST' || row.source === 'SCA' || row.source === 'GITLAB_SCANNER') {
      return row.location;
    }

    // For SAST, IaC, Secrets, format it as path:line.
    const location = row.location;
    const match = location.match(/(.*):(\d+)/);
    if (!match) return location;

    const [, filePath, lineNumber] = match;
    return `${filePath}:${lineNumber}`;
  }
}