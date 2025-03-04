import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class VulnerabilitiesTableComponent {
  @Input() repoData: any;
  @Input() vulns: Vulnerability[] = [];
  @Input() filteredVulns: Vulnerability[] = [];
  @Input() selectedBranch: string | null = null;
  @Input() showRemoved: boolean = false;
  @Input() showSuppressed: boolean = false;
  @Input() bulkActionMode: boolean = false;
  @Input() selectedFindings: number[] = [];
  @Input() vulnerabilitiesLoading: boolean = false;
  @Input() vulnerabilitiesLimit: number = 20;

  @Output() updateFilterNameEvent = new EventEmitter<any>();
  @Output() updateFilterLocationEvent = new EventEmitter<any>();
  @Output() updateFilterSourceEvent = new EventEmitter<any>();
  @Output() updateFilterStatusEvent = new EventEmitter<any>();
  @Output() updateFilterSeverityEvent = new EventEmitter<any>();
  @Output() toggleShowRemovedEvent = new EventEmitter<any>();
  @Output() toggleShowSuppressedEvent = new EventEmitter<any>();
  @Output() toggleBulkActionEvent = new EventEmitter<void>();
  @Output() selectAllFindingsEvent = new EventEmitter<any>();
  @Output() onSelectFindingEvent = new EventEmitter<{id: number, event: any}>();
  @Output() suppressSelectedFindingsEvent = new EventEmitter<void>();
  @Output() onBranchSelectEvent = new EventEmitter<any>();
  @Output() viewVulnerabilityDetailsEvent = new EventEmitter<Vulnerability>();
  @Output() clearFiltersEvent = new EventEmitter<void>();

  filters: { [key: string]: string } = {
    name: '',
    location: '',
    source: '',
    status: '',
    severity: '',
  };

  /**
   * Update name filter
   */
  updateFilterName(event: any): void {
    this.updateFilterNameEvent.emit(event);
  }

  /**
   * Update location filter
   */
  updateFilterLocation(event: any): void {
    this.updateFilterLocationEvent.emit(event);
  }

  /**
   * Update source filter
   */
  updateFilterSource(event: any): void {
    this.updateFilterSourceEvent.emit(event);
  }

  /**
   * Update status filter
   */
  updateFilterStatus(event: any): void {
    this.updateFilterStatusEvent.emit(event);
  }

  /**
   * Update severity filter
   */
  updateFilterSeverity(event: any): void {
    this.updateFilterSeverityEvent.emit(event);
  }

  /**
   * Toggle showing removed vulnerabilities
   */
  toggleShowRemoved(event: any): void {
    this.toggleShowRemovedEvent.emit(event);
  }

  /**
   * Toggle showing suppressed vulnerabilities
   */
  toggleShowSuppressed(event: any): void {
    this.toggleShowSuppressedEvent.emit(event);
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
   * Get repository link for a vulnerability row
   */
  getRepositoryLinkForRow(row: any): string {
    if (!row?.location || !this.repoData?.repourl) {
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

    const location = row.location;
    const match = location.match(/(.*):(\d+)/);
    if (!match) return location;

    const [, filePath, lineNumber] = match;
    return `${filePath}:${lineNumber}`;
  }
}