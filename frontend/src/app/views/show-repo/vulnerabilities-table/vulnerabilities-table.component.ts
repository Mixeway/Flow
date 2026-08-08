import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as XLSX from 'xlsx';
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
import { SlaConfig } from '../../../service/SettingsService';
import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
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
  jira_ticket_key?: string;
}

/**
 * One row of the table. With grouping on, a row represents every instance that shares a
 * remediation: an SCA package (its CVEs) or a rule (its locations). With grouping off,
 * a row is a single finding.
 */
export interface FindingGroup {
  key: string;
  label: string;
  detail: string;
  detailTooltip: string;
  groupedBy: 'package' | 'rule' | 'none';
  source: string;
  severity: string;
  urgency: string | null;
  status: string;
  firstSeen: string | null;
  lastSeen: string | null;
  count: number;
  instances: Vulnerability[];
  representative: Vulnerability;
  ids: number[];
}

export interface SlaState {
  state: 'none' | 'ok' | 'due' | 'overdue';
  label: string;
  tooltip: string;
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
    TitleCasePipe,
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
  @Input() selectedBranchId: number | null = null;
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
  @Input() jiraEnabled: boolean = false;
  @Input() teamId: number | null = null;

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
  @Output() createJiraTicketEvent = new EventEmitter<number>();
  @Output() createJiraTicketsBulkEvent = new EventEmitter<number[]>();
  statusFilter: string = '';

  /** Remediation SLA thresholds; null while still loading or when none are configured. */
  @Input() slaConfig: SlaConfig | null = null;

  @Output() viewFindingGroupEvent = new EventEmitter<{ group: FindingGroup; groups: FindingGroup[]; index: number }>();

  /** One ticket for the whole grouped row, distinct from the multi-select bulk action. */
  @Output() createTicketForGroupEvent = new EventEmitter<number[]>();

  groupingEnabled: boolean = true;

  /** Rows as rendered, so prev/next navigation in the panel follows what the user sees. */
  displayRows: FindingGroup[] = [];

  private sortState: { prop: string; dir: 'asc' | 'desc' } = { prop: 'severity', dir: 'desc' };


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

  get visibleBranches(): any[] {
    const branches = this.repoData?.branches || [];
    const defaultBranchId = this.repoData?.defaultBranch?.id;
    return branches.filter((branch: any) =>
      !!branch &&
      branch.existsOnRemote === true &&
      String(branch.id) !== String(defaultBranchId)
    );
  }

  ngOnInit(): void {
    this.rebuildRows();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Do not auto-reset filters here; parent owns source-of-truth (persistence/restore)
    if (changes['filteredVulns'] || changes['slaConfig']) {
      this.rebuildRows();
    }
  }

  toggleGrouping(enabled: boolean): void {
    this.groupingEnabled = enabled;
    this.rebuildRows();
  }

  /** Sorting is handled here rather than by ngx-datatable so displayRows mirrors the view. */
  onSort(event: any): void {
    const sort = event?.sorts?.[0];
    if (sort?.prop) {
      this.sortState = { prop: sort.prop, dir: sort.dir === 'asc' ? 'asc' : 'desc' };
    }
    this.rebuildRows();
  }

  private rebuildRows(): void {
    this.displayRows = this.sortRows(this.buildGroups(this.filteredVulns || []));
  }

  private groupKey(vuln: Vulnerability): string {
    if (!this.groupingEnabled) {
      return `single::${vuln.id}`;
    }
    const source = (vuln.source || '').toUpperCase();
    // One SCA package upgrade fixes every CVE it carries, so the package is the unit of work.
    if (source === 'SCA') {
      return `SCA::${(vuln.location || '').trim()}`;
    }
    // For everything else the rule is the unit of work and locations are its instances.
    return `${source}::${(vuln.name || '').trim()}`;
  }

  private buildGroups(vulns: Vulnerability[]): FindingGroup[] {
    const buckets = new Map<string, Vulnerability[]>();
    for (const vuln of vulns) {
      const key = this.groupKey(vuln);
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.push(vuln);
      } else {
        buckets.set(key, [vuln]);
      }
    }

    const groups: FindingGroup[] = [];
    buckets.forEach((instances, key) => {
      const first = instances[0];
      const source = (first.source || '').toUpperCase();
      const grouped = this.groupingEnabled;
      const groupedBy: FindingGroup['groupedBy'] = !grouped ? 'none' : (source === 'SCA' ? 'package' : 'rule');

      const label = groupedBy === 'package' ? (first.location || first.name) : first.name;
      const distinct = groupedBy === 'package'
        ? this.distinct(instances.map((i) => i.name))
        : this.distinct(instances.map((i) => i.location));

      let detail: string;
      if (groupedBy === 'none') {
        detail = first.location || '';
      } else if (distinct.length > 1) {
        detail = groupedBy === 'package'
          ? `${distinct.length} CVEs`
          : `${distinct.length} locations`;
      } else {
        detail = distinct[0] || '';
      }

      groups.push({
        key,
        label,
        detail,
        detailTooltip: distinct.join('\n'),
        groupedBy,
        source: first.source,
        severity: this.worstSeverity(instances),
        urgency: this.worstUrgency(instances),
        status: this.aggregateStatus(instances),
        firstSeen: this.earliest(instances.map((i) => i.inserted)),
        lastSeen: this.latest(instances.map((i) => i.last_seen)),
        count: instances.length,
        instances,
        representative: this.worstInstance(instances),
        ids: instances.map((i) => i.id),
      });
    });

    return groups;
  }

  private distinct(values: (string | null | undefined)[]): string[] {
    return Array.from(new Set(values.filter((v): v is string => !!v)));
  }

  private severityRank(value?: string): number {
    return VulnerabilitiesTableComponent.SEVERITY_RANK[(value || '').toUpperCase()] ?? 0;
  }

  private urgencyRank(value?: string | null): number {
    return VulnerabilitiesTableComponent.URGENCY_RANK[value || ''] ?? 0;
  }

  private worstSeverity(instances: Vulnerability[]): string {
    return instances.reduce(
      (worst, i) => (this.severityRank(i.severity) > this.severityRank(worst) ? i.severity : worst),
      instances[0]?.severity || ''
    );
  }

  private worstUrgency(instances: Vulnerability[]): string | null {
    const worst = instances.reduce(
      (acc, i) => (this.urgencyRank(i.urgency) > this.urgencyRank(acc) ? i.urgency : acc),
      null as string | null
    );
    return worst || null;
  }

  private worstInstance(instances: Vulnerability[]): Vulnerability {
    return instances.reduce((worst, i) => {
      const bySeverity = this.severityRank(i.severity) - this.severityRank(worst.severity);
      if (bySeverity !== 0) {
        return bySeverity > 0 ? i : worst;
      }
      return this.urgencyRank(i.urgency) > this.urgencyRank(worst.urgency) ? i : worst;
    }, instances[0]);
  }

  /** A group is only as resolved as its least resolved instance. */
  private aggregateStatus(instances: Vulnerability[]): string {
    const statuses = new Set(instances.map((i) => (i.status || '').toUpperCase()));
    if (statuses.has('NEW')) return 'NEW';
    if (statuses.has('EXISTING')) return 'EXISTING';
    if (statuses.has('SUPRESSED')) return 'SUPRESSED';
    return instances[0]?.status || '';
  }

  private earliest(dates: (string | null | undefined)[]): string | null {
    const times = dates.filter((d): d is string => !!d).map((d) => new Date(d).getTime()).filter((t) => !isNaN(t));
    return times.length ? new Date(Math.min(...times)).toISOString() : null;
  }

  private latest(dates: (string | null | undefined)[]): string | null {
    const times = dates.filter((d): d is string => !!d).map((d) => new Date(d).getTime()).filter((t) => !isNaN(t));
    return times.length ? new Date(Math.max(...times)).toISOString() : null;
  }

  private sortRows(rows: FindingGroup[]): FindingGroup[] {
    const { prop, dir } = this.sortState;
    const factor = dir === 'desc' ? -1 : 1;

    return [...rows].sort((a, b) => {
      let result: number;
      switch (prop) {
        case 'severity':
          result = this.severityRank(a.severity) - this.severityRank(b.severity);
          if (result === 0) {
            result = this.urgencyRank(a.urgency) - this.urgencyRank(b.urgency);
          }
          break;
        case 'status':
          result = (a.status || '').localeCompare(b.status || '');
          break;
        case 'source':
          result = (a.source || '').localeCompare(b.source || '');
          break;
        case 'last_seen':
          result = this.timeOf(a.lastSeen) - this.timeOf(b.lastSeen);
          break;
        case 'inserted':
          result = this.timeOf(a.firstSeen) - this.timeOf(b.firstSeen);
          break;
        case 'sla':
          result = this.slaSortValue(a) - this.slaSortValue(b);
          break;
        case 'location':
          result = (a.detail || '').localeCompare(b.detail || '');
          break;
        default:
          result = (a.label || '').localeCompare(b.label || '');
      }
      return result * factor;
    });
  }

  private timeOf(value: string | null): number {
    if (!value) return 0;
    const time = new Date(value).getTime();
    return isNaN(time) ? 0 : time;
  }

  openGroup(group: FindingGroup): void {
    const index = this.displayRows.findIndex((row) => row.key === group.key);
    this.viewFindingGroupEvent.emit({ group, groups: this.displayRows, index });
  }

  /** SLA days configured for a severity, or null when that severity is not tracked. */
  private slaDaysFor(severity: string): number | null {
    if (!this.slaConfig) {
      return null;
    }
    switch ((severity || '').toUpperCase()) {
      case 'CRITICAL': return this.slaConfig.criticalDays ?? null;
      case 'HIGH': return this.slaConfig.highDays ?? null;
      case 'MEDIUM': return this.slaConfig.mediumDays ?? null;
      case 'LOW':
      case 'INFO': return this.slaConfig.lowDays ?? null;
      default: return null;
    }
  }

  /**
   * SLA is measured from when a finding was first seen. Resolved findings no longer have a
   * clock running, so they report no SLA rather than a misleading overdue figure.
   */
  slaFor(row: FindingGroup): SlaState {
    const days = this.slaDaysFor(row.severity);
    if (days == null) {
      return { state: 'none', label: '—', tooltip: 'No SLA configured for this severity' };
    }

    const status = (row.status || '').toUpperCase();
    if (status === 'REMOVED' || status === 'SUPRESSED') {
      return { state: 'none', label: '—', tooltip: 'SLA does not apply to resolved or suppressed findings' };
    }

    const firstSeen = this.timeOf(row.firstSeen);
    if (!firstSeen) {
      return { state: 'none', label: '—', tooltip: 'First seen date unknown' };
    }

    const due = firstSeen + days * 86_400_000;
    const remainingDays = Math.ceil((due - Date.now()) / 86_400_000);
    const dueLabel = new Date(due).toLocaleDateString();

    if (remainingDays < 0) {
      return {
        state: 'overdue',
        label: `${Math.abs(remainingDays)}d over`,
        tooltip: `SLA ${days} days - was due ${dueLabel}`,
      };
    }
    if (remainingDays === 0) {
      return { state: 'due', label: 'due today', tooltip: `SLA ${days} days - due ${dueLabel}` };
    }
    return {
      state: remainingDays <= Math.max(1, Math.round(days * 0.2)) ? 'due' : 'ok',
      label: `${remainingDays}d left`,
      tooltip: `SLA ${days} days - due ${dueLabel}`,
    };
  }

  /** Overdue first when sorting by SLA; untracked rows sink to the bottom. */
  private slaSortValue(row: FindingGroup): number {
    const sla = this.slaFor(row);
    if (sla.state === 'none') {
      return Number.MAX_SAFE_INTEGER;
    }
    const days = this.slaDaysFor(row.severity) ?? 0;
    const due = this.timeOf(row.firstSeen) + days * 86_400_000;
    return due;
  }

  isGroupSelected(row: FindingGroup): boolean {
    return row.ids.length > 0 && row.ids.every((id) => this.selectedFindings.includes(id));
  }

  isGroupPartiallySelected(row: FindingGroup): boolean {
    return !this.isGroupSelected(row) && row.ids.some((id) => this.selectedFindings.includes(id));
  }

  /** Selecting a grouped row selects every instance it stands for. */
  onSelectGroup(row: FindingGroup, event: any): void {
    const shouldSelect = !!event?.target?.checked;
    for (const id of row.ids) {
      const alreadySelected = this.selectedFindings.includes(id);
      if (shouldSelect !== alreadySelected) {
        this.onSelectFindingEvent.emit({ id, event: { target: { checked: shouldSelect } } });
      }
    }
  }

  groupJiraKeys(row: FindingGroup): string[] {
    return this.distinct(row.instances.map((i) => i.jira_ticket_key));
  }

  /**
   * The row itself opens the panel, which is how Wiz/Aikido lists behave. Clicks on
   * controls inside a row (checkbox, ticket button) must not also open it.
   */
  onRowActivate(event: any): void {
    if (event?.type !== 'click' || !event?.row) {
      return;
    }
    const target = event.event?.target as HTMLElement | undefined;
    if (target?.closest('button, a, input, select, label')) {
      return;
    }
    this.openGroup(event.row);
  }

  createTicketForGroup(row: FindingGroup, event?: Event): void {
    event?.stopPropagation();
    this.createTicketForGroupEvent.emit(row.ids);
  }

  ticketCreateTooltip(row: FindingGroup): string {
    return row.count > 1
      ? `Create one JIRA ticket for all ${row.count} findings`
      : 'Create JIRA ticket';
  }

  ticketKeysTooltip(row: FindingGroup): string {
    const keys = this.groupJiraKeys(row);
    return keys.length > 1 ? `JIRA tickets: ${keys.join(', ')}` : `JIRA ticket: ${keys[0]}`;
  }

  /**
   * Second line of the Finding cell. Always present, so every row has the same shape:
   * either the one affected place/CVE, or how many the group covers.
   */
  affectedLine(row: FindingGroup): string {
    if (row.count > 1) {
      return row.detail;
    }
    return this.getFormattedLocationForRow(row.representative);
  }

  /** Only a single instance can link to one exact place in the repository. */
  isAffectedLinkable(row: FindingGroup): boolean {
    return row.count === 1 && this.isLinkableSource(row.source);
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

  createJiraTicket(findingId: number): void {
    this.createJiraTicketEvent.emit(findingId);
  }

  createJiraTicketsBulk(): void {
    this.createJiraTicketsBulkEvent.emit(this.selectedFindings);
  }

  hasJiraTicket(row: any): boolean {
    return row?.jira_ticket_key != null && row?.jira_ticket_key !== '';
  }

  /**
   * Rank findings by risk so the list opens on what matters most. Sorting the raw
   * severity string alphabetically put CRITICAL after HIGH and INFO above LOW.
   */
  private static readonly SEVERITY_RANK: { [key: string]: number } = {
    CRITICAL: 5,
    HIGH: 4,
    MEDIUM: 3,
    LOW: 2,
    INFO: 1,
  };

  private static readonly URGENCY_RANK: { [key: string]: number } = {
    urgent: 2,
    notable: 1,
  };

  /** Default order: highest severity first, and within a severity the flagged ones first. */
  readonly defaultSorts = [{ prop: 'severity', dir: 'desc' }];

  severityComparator = (valueA: string, valueB: string, rowA: any, rowB: any): number => {
    const rank = (value?: string) =>
      VulnerabilitiesTableComponent.SEVERITY_RANK[(value || '').toUpperCase()] ?? 0;

    const bySeverity = rank(valueA) - rank(valueB);
    if (bySeverity !== 0) {
      return bySeverity;
    }

    // ngx-datatable negates the comparator for descending sorts, so returning the plain
    // difference here puts urgent/notable first in the default (descending) view.
    const urgency = (row: any) =>
      VulnerabilitiesTableComponent.URGENCY_RANK[row?.urgency] ?? 0;
    return urgency(rowA) - urgency(rowB);
  };

  /**
   * Compact relative age for the "Last seen" column. Absolute dates are long and hard to
   * compare at a glance while triaging; the exact timestamp stays available as a tooltip.
   */
  formatAge(value: string | null | undefined): string {
    if (!value) {
      return '—';
    }

    const seen = new Date(value).getTime();
    if (isNaN(seen)) {
      return '—';
    }

    const days = Math.floor((Date.now() - seen) / 86_400_000);
    if (days <= 0) {
      return 'today';
    }
    if (days < 30) {
      return `${days}d`;
    }
    if (days < 365) {
      return `${Math.floor(days / 30)}mo`;
    }
    return `${Math.floor(days / 365)}y`;
  }

  /**
   * Checks if the vulnerability source type should have a clickable link.
   * @param source The vulnerability source (e.g., 'SAST', 'SCA').
   */
  isLinkableSource(source: string): boolean {
    const linkableSources = ['SAST', 'IAC', 'DAST'];
    return linkableSources.includes(source);
  }

  /**
   * Get repository link for a vulnerability row
   */
  getRepositoryLinkForRow(row: any): string {
    if (!row?.location) {
      return '#';
    }
    if (row.source === 'DAST') {
      return row.location.startsWith('http') ? row.location : `//${row.location}`;
    }

    if (!this.repoData?.repourl || !this.repoData?.type) {
      return '#';
    }

    const location = row.location;
    const repoUrl = this.repoData.repourl;
    const repoType = this.repoData.type.toUpperCase(); // Use the type property
    const branch = this.selectedBranch || this.repoData?.defaultBranch?.name;

    const match = location.match(/(.*):(\d+)/);
    if (!match) {
      return repoUrl;
    }

    const [, filePath, lineNumber] = match;
    const baseUrl = repoUrl.replace(/\/$/, '');

    if (repoType === 'GITHUB') {
      return `${baseUrl}/blob/${branch}/${filePath}#L${lineNumber}`;
    } else if (repoType === 'GITLAB') {
      return `${baseUrl}/-/blob/${branch}/${filePath}#L${lineNumber}`;
    }

    return repoUrl;
  }

  /**
   * NEW: Gets the shortened display text for the location column.
   */
  getShortenedLocationText(row: any): string {
    if (!row?.location) {
      return 'Location not available';
    }

    const fullLocation = row.location;

    // For these sources, don't shorten the path, just display it.
    if (['DAST', 'SCA', 'GITLAB_SCANNER', 'SECRETS'].includes(row.source)) {
      return fullLocation;
    }

    // For other sources, shorten the path if it is too long.
    const pathParts = fullLocation.split('/');
    if (pathParts.length > 4) {
      // e.g., ".../path/to/file.txt:1"
      return '...' + pathParts.slice(-3).join('/');
    }

    return fullLocation;
  }

  /**
   * UNCHANGED: Get formatted location for a vulnerability row.
   * This is still used by the Excel export and should return the full path.
   */
  getFormattedLocationForRow(row: any): string {
    if (!row?.location) {
      return 'Location not available';
    }
    if (['DAST', 'SCA', 'GITLAB_SCANNER', 'SECRETS'].includes(row.source)) {
      return row.location;
    }
    const location = row.location;
    const match = location.match(/(.*):(\d+)/);
    if (!match) return location;
    const [, filePath, lineNumber] = match;
    return `${filePath}:${lineNumber}`;
  }

  // === XLSX Export ===
  private formatDateForXlsx(d?: string | Date | null) {
    if (!d) return '';
    const date = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(date.getTime())) return '';
    return date.toISOString(); // Excel parses ISO
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
}