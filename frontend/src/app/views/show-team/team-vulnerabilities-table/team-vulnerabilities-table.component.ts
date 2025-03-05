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
  FormSelectDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  SpinnerComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatePipe, NgFor, NgIf } from '@angular/common';
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
  component_name: string;
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
    FormSelectDirective,
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
    DatePipe,
    NgIf,
    NgFor,
    FormsModule
  ],
  templateUrl: './team-vulnerabilities-table.component.html',
  styleUrls: ['./team-vulnerabilities-table.component.scss']
})
export class TeamVulnerabilitiesTableComponent {
  @Input() filteredVulns: Vulnerability[] = [];
  @Input() showRemoved: boolean = false;
  @Input() showSuppressed: boolean = false;
  @Input() bulkActionMode: boolean = false;
  @Input() selectedFindings: number[] = [];
  @Input() vulnerabilitiesLoading: boolean = false;
  @Input() vulnerabilitiesLimit: number = 15;

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

  updateFilterName(event: any): void {
    this.updateFilterNameEvent.emit(event);
  }

  updateFilterComponent(event: any): void {
    this.updateFilterComponentEvent.emit(event);
  }

  updateFilterSource(event: any): void {
    this.updateFilterSourceEvent.emit(event);
  }

  updateFilterStatus(event: any): void {
    this.updateFilterStatusEvent.emit(event);
  }

  updateFilterSeverity(event: any): void {
    this.updateFilterSeverityEvent.emit(event);
  }

  toggleShowRemoved(event: any): void {
    this.toggleShowRemovedEvent.emit(event);
  }

  toggleShowSuppressed(event: any): void {
    this.toggleShowSuppressedEvent.emit(event);
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
}