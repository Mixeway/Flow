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
  FormSelectDirective, FormDirective,
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
    });
  }

  loadRules() {
    this.threatIntelService.getSuppressRules().subscribe({
      next: (response) => {
        this.suppressRules = response;
        this.filteredSuppressRules = [...this.suppressRules];
      },
      error: (error) => {
        // Handle error
      },
    });
  }

  loadCodeRepos() {
    this.dashboardService.getRepos().subscribe({
      next: (response) => {
        this.rows = response;
      },
      error: (error) => {
        // Handle error
      },
    });
  }

  loadTeams() {
    this.teamService.get().subscribe({
      next: (response) => {
        this.teams = response;
      },
      error: (error) => {
        // Handle error
      },
    });
  }

  ngOnInit(): void {
    this.loadTeams();
    this.loadCodeRepos();
    this.loadRules();
  }

  // initializeDummyData() {
  //   this.suppressRules = [
  //     {
  //       id: 1,
  //       vulnerabilityName: 'SQL Injection',
  //       scope: 'GLOBAL',
  //       scopeDetail: '',
  //       insertedBy: 'admin',
  //       insertedDate: new Date('2023-09-01'),
  //     },
  //     {
  //       id: 2,
  //       vulnerabilityName: 'XSS',
  //       scope: 'PROJECT',
  //       scopeDetail: 'Project A', // Now using project name
  //       insertedBy: 'user1',
  //       insertedDate: new Date('2023-09-15'),
  //     },
  //     {
  //       id: 3,
  //       vulnerabilityName: 'CSRF',
  //       scope: 'TEAM',
  //       scopeDetail: 'Team Alpha', // Now using team name
  //       insertedBy: 'user2',
  //       insertedDate: new Date('2023-10-01'),
  //     },
  //   ];
  //
  //   this.filteredSuppressRules = [...this.suppressRules];
  // }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.suppressRules.filter((d) => {
      return (
          d.vulnerabilityName.toLowerCase().includes(val) ||
          d.scope.toLowerCase().includes(val) ||
          d.scopeDetail.toLowerCase().includes(val) ||
          d.insertedBy.toLowerCase().includes(val)
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
        // Handle error
      },
    });
  }

  openCreateRuleModal() {
    this.createRuleModalVisible = true;
  }

  handleCreateRuleModalChange(event: any) {
    this.createRuleModalVisible = event;
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

  onCreateRuleSubmit() {
    if (this.createRuleForm.valid) {
      const formData = this.createRuleForm.value;

      const rule: RuleDTO = {
        scope: formData.scope,
        vulnerabilityId: formData.vulnerabilityName,
        teamId: formData.team,
        codeRepoId: formData.project
      }

      this.threatIntelService.createRule(rule).subscribe({
        next: (response) => {
          this.loadRules();
        },
        error: (error) => {
          // Handle error
        },
      });

      // Close the modal
      this.createRuleModalVisible = false;
      // Reset the form
      this.createRuleForm.reset();
      this.showProjectSelect = false;
      this.showTeamSelect = false;
    }
  }
}