import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AlertComponent,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ButtonDirective,
  ModalModule,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  FormLabelDirective,
  FormSelectDirective, FormDirective, AlertModule,
} from '@coreui/angular';
import {IconDirective, IconSetService} from '@coreui/icons-angular';
import { ThreatIntelService } from '../../../service/ThreatIntelService';
import { DashboardService } from '../../../service/DashboardService';
import { TeamService } from '../../../service/TeamService';
import { brandSet, freeSet } from '@coreui/icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {DatePipe, NgIf} from "@angular/common";
import { HttpErrorResponse } from '@angular/common/http';

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

interface RuleDTO{
  scope: string;
  teamId: number;
  vulnerabilityId: string;
  codeRepoId: number;
  pathRegex?: string; // Added pathRegex field
}
interface Team {
  id: number;
  name: string;
}

interface SuppressRuleResponseDTO {
  id: number;
  vulnerabilityName: string;
  scope: 'GLOBAL' | 'PROJECT' | 'TEAM';
  scopeDetail: string; // Now contains the name instead of ID
  pathRegex?: string; // Added pathRegex field
  insertedBy: string;
  insertedDate: Date;
}

@Component({
  selector: 'app-waivers',
  standalone: true,
  imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    AlertComponent,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    IconDirective,
    ModalModule,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    NgSelectModule,
    DatePipe,
    FormDirective,
    NgIf,
    AlertModule,
  ],
  templateUrl: './waivers.component.html',
  styleUrls: ['./waivers.component.scss'],
})
export class WaiversComponent implements OnInit {
  rows: CodeRepo[] = [];
  teams: Team[] = [];
  suppressRules: SuppressRuleResponseDTO[] = [];
  filteredSuppressRules: SuppressRuleResponseDTO[] = [];
  filterValue: string = '';
  errorMessage: string = '';

  createRuleModalVisible: boolean = false;
  createRuleForm: FormGroup;
  showProjectSelect: boolean = false;
  showTeamSelect: boolean = false;

  constructor(
      public iconSet: IconSetService,
      private threatIntelService: ThreatIntelService,
      private cdr: ChangeDetectorRef,
      private dashboardService: DashboardService,
      private teamService: TeamService,
      private fb: FormBuilder
  ) {
    iconSet.icons = { ...freeSet, ...iconSet, ...brandSet };

    this.createRuleForm = this.fb.group({
      vulnerabilityName: ['', Validators.required],
      scope: ['', Validators.required],
      project: [''],
      team: [''],
      pathRegex: [''] // Added pathRegex field to form
    });
  }

  loadRules() {
    this.threatIntelService.getSuppressRules().subscribe({
      next: (response) => {
        this.suppressRules = response;
        this.filteredSuppressRules = [...this.suppressRules];
        // Debug log to check what's coming back
        console.log('Loaded suppress rules:', response);
      },
      error: (error) => {
        // Log the error
        console.error('Error loading suppress rules:', error);
        this.errorMessage = 'Failed to load suppress rules. Please try again later or contact your administrator.';
      },
    });
  }

  loadCodeRepos() {
    this.dashboardService.getRepos().subscribe({
      next: (response) => {
        this.rows = response;
      },
      error: (error) => {
        console.error('Error loading code repos:', error);
      },
    });
  }

  loadTeams() {
    this.teamService.get().subscribe({
      next: (response) => {
        this.teams = response;
      },
      error: (error) => {
        console.error('Error loading teams:', error);
      },
    });
  }

  ngOnInit(): void {
    this.loadTeams();
    this.loadCodeRepos();
    this.loadRules();
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.suppressRules.filter((d) => {
      return (
          d.vulnerabilityName.toLowerCase().includes(val) ||
          d.scope.toLowerCase().includes(val) ||
          d.scopeDetail.toLowerCase().includes(val) ||
          d.insertedBy.toLowerCase().includes(val) ||
          // Include pathRegex in filtering
          (d.pathRegex && d.pathRegex.toLowerCase().includes(val))
      );
    });

    // update the rows
    this.filteredSuppressRules = temp;
  }

  deleteRule(row: SuppressRuleResponseDTO) {
    this.threatIntelService.deleteRule(row.id).subscribe({
      next: (response) => {
        this.loadRules();
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete rule. Please try again later or contact your administrator.';
      },
    });
  }

  openCreateRuleModal() {
    this.errorMessage = '';
    this.createRuleModalVisible = true;
  }

  handleCreateRuleModalChange(event: any) {
    this.createRuleModalVisible = event;
    if (!event) {
      this.errorMessage = '';
    }
  }

  onScopeChange(event: any) {
    const value = event.target.value;
    this.showProjectSelect = value === 'PROJECT';
    this.showTeamSelect = value === 'TEAM';

    if (!this.showProjectSelect) {
      this.createRuleForm.get('project')?.setValue(null);
    }
    if (!this.showTeamSelect) {
      this.createRuleForm.get('team')?.setValue(null);
    }
  }

  onAlertClose() {
    this.errorMessage = '';
  }

  onCreateRuleSubmit() {
    if (this.createRuleForm.valid) {
      const formData = this.createRuleForm.value;

      const rule: RuleDTO = {
        scope: formData.scope,
        vulnerabilityId: formData.vulnerabilityName,
        teamId: formData.team,
        codeRepoId: formData.project,
        pathRegex: formData.pathRegex // Include pathRegex in the request
      }

      this.threatIntelService.createRule(rule).subscribe({
        next: (response) => {
          this.loadRules();

          // Close the modal
          this.createRuleModalVisible = false;
          // Reset the form
          this.createRuleForm.reset();
          this.showProjectSelect = false;
          this.showTeamSelect = false;
        },
        error: (error) => {
            this.errorMessage = 'Problem adding suppress rule. Please check if all fields are valid and try again. If the problem persists, contact your administrator.';

        },
      });
    }
  }
}