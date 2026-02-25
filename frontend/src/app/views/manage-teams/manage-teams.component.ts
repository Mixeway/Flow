import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ListGroupDirective,
  ListGroupItemDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  RowComponent,
  InputGroupComponent,
  InputGroupTextDirective,
  ToasterComponent,
  ToastComponent,
  ToastBodyComponent,
  ToastHeaderComponent,
  FormControlDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormSelectDirective,
  FormLabelDirective,
} from "@coreui/angular";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {IconDirective, IconSetService} from "@coreui/icons-angular";
import {NgForOf, AsyncPipe, CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {freeSet} from "@coreui/icons";
import {Observable, of} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {AuthService} from "../../service/AuthService";
import {TeamService} from "../../service/TeamService";
import {UserService} from "../../service/UserService";
import {SettingsService} from "../../service/SettingsService";
import {CloudSubscriptionService} from "../../service/CloudSubscriptionService";
import {JiraService, JiraConfigRequest, JiraConfigResponse} from "../../service/JiraService";

interface User {
  id: number;
  username: string;
  role: string;
  teams: Team[];
  active: boolean;
}

interface SimpleUser {
  id: number
  username: string
}

interface Team {
  id: number;
  name: string;
  remoteIdentifier: string;
  users: SimpleUser[];
  showMembers?: boolean; // Added for UI toggle
}

interface TeamDto {
  name: string;
  users: number[];
  remoteIdentifier: string;
}

interface ChangeTeamDto {
  id: number;
  users: number[];
}

@Component({
  selector: 'app-manage-teams',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    NgxDatatableModule,
    IconDirective,
    ListGroupDirective,
    ListGroupItemDirective,
    NgForOf,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    ButtonDirective,
    InputGroupComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AsyncPipe,
    InputGroupTextDirective,
    ToasterComponent,
    ToastComponent,
    ToastBodyComponent,
    ToastHeaderComponent,
    FormControlDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormSelectDirective,
    FormLabelDirective,
  ],
  templateUrl: './manage-teams.component.html',
  styleUrls: ['./manage-teams.component.scss']
})
export class ManageTeamsComponent implements OnInit {

  teams: Team[] = [];
  users: User[] = [];
  searchTerm: string = '';
  filteredTeams: Team[] = [];

  filteredUsers: Observable<User[]> | undefined;
  filteredUsersForAdd: Observable<User[]> | undefined;

  visibleAddTeam = false;
  visibleAddUsersToTeam = false;

  addTeamForm = this.fb.group({
    name: ['', Validators.required],
    remoteIdentifier: [''],
    users: [[] as number[]],
    userInput: new FormControl()
  });

  addUsersToTeamForm = this.fb.group({
    team: ['', Validators.required],
    users: [[] as number[]],
    userInput: new FormControl()
  });

  wizEnabled: boolean = false;
  visibleCloudSubscriptions = false;
  selectedTeam: Team | null = null;
  cloudSubscriptions: any[] = [];
  newSubscriptionName: string = '';

  // JIRA integration
  visibleJiraConfig = false;
  jiraConfigEditMode = false;
  jiraTestingConnection = false;
  jiraConfigs: Map<number, JiraConfigResponse> = new Map();
  jiraIssueTypes: string[] = [];
  jiraLoadingIssueTypes = false;
  jiraProjects: {key: string, name: string}[] = [];
  jiraLoadingProjects = false;

  jiraConfigForm = this.fb.group({
    jiraUrl: ['', Validators.required],
    jiraToken: ['', Validators.required],
    jiraProjectKey: ['', Validators.required],
    jiraIssueType: ['Bug'],
    jiraUsername: [''],
    autoCreateEnabled: [false],
    autoSeverityThreshold: ['HIGH'],
  });


  constructor(public iconSet: IconSetService, private fb: FormBuilder, private router: Router,
              private authService: AuthService, private teamService: TeamService,
              private userService: UserService, private settingsService: SettingsService,
              private cloudSubscriptionService: CloudSubscriptionService,
              private jiraService: JiraService) {
    // iconSet singleton
    iconSet.icons = { ...freeSet, ...iconSet };
  }

  loadTeams() {
    this.teamService.get().subscribe({
      next: (response: Team[]) => {
        this.teams = response.map((team: Team) => ({
          ...team,
          showMembers: false
        }));
        this.filteredTeams = [...this.teams];
        this.loadJiraConfigs();
      },
      error: (error) => {
        this.showToast('danger', 'Error loading teams. Please try again.');
      }
    });
  }

  loadUsers() {
    this.userService.get().subscribe({
      next: (response) => {
        this.users = response;
        this.refreshFilteredUsers();
      },
      error: (error) => {
        this.showToast('danger', 'Error loading users. Please try again.');
      }
    });
  }

  private refreshFilteredUsers() {
    const userInputValue = this.addTeamForm.controls.userInput.value || '';
    const userInputValueForAdd = this.addUsersToTeamForm.controls.userInput.value || '';

    this.addTeamForm.controls.userInput.setValue(userInputValue, { emitEvent: true });
    this.addUsersToTeamForm.controls.userInput.setValue(userInputValueForAdd, { emitEvent: true });
  }

  ngOnInit() {
    this.authService.hcTeamManager().subscribe({
      next: () => {
        // Health check passed, proceed with loading the dashboard
        this.loadTeams();
        this.loadUsers();
        this.loadScannerConfig();
      },
      error: () => {
        // Health check failed, redirect to login
        this.router.navigate(['/login']);
      }
    });

    this.addTeamForm.controls.userInput.valueChanges.pipe(
        startWith(''),
        map(value => this._filterUsers(value))
    ).subscribe(filteredUsers => {
      this.filteredUsers = of(filteredUsers);
    });

    this.addUsersToTeamForm.controls.userInput.valueChanges.pipe(
        startWith(''),
        map(value => this._filterUsers(value))
    ).subscribe(filteredUsers => {
      this.filteredUsersForAdd = of(filteredUsers);
    });
  }

  loadScannerConfig() {
    this.settingsService.getAdditionalScannerConfig().subscribe({
      next: (response) => {
        this.wizEnabled = response.wizEnabled;
      },
      error: (error) => {
        console.error('Error loading scanner config:', error);
      }
    });
  }

  private _filterUsers(value: string): User[] {
    const filterValue = value?.toLowerCase() || '';
    return this.users.filter(user => user.username.toLowerCase().includes(filterValue));
  }

  // Helper for team initials
  getTeamInitials(name: string): string {
    if (!name) return '';

    // Split by spaces and get first letter of each word
    const words = name.split(' ');
    if (words.length === 1) {
      // For one word, return first two letters or just the first if it's one character
      return name.length > 1 ? name.substring(0, 2).toUpperCase() : name.toUpperCase();
    } else {
      // For multiple words, return first letter of first two words
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
  }

  // Toggle team members visibility
  toggleMembersView(team: Team) {
    team.showMembers = !team.showMembers;
  }

  // Get statistics for dashboard
  getSecuredProjectsCount(): number {
    // This would ideally come from a service, but for now we'll use teams count as a placeholder
    return this.teams.length * 2; // Just a mock number for UI purposes
  }

  // Edit team - placeholder for future implementation
  editTeam(team: Team) {
    // For now we'll reuse the add users modal
    this.selectedTeam = team;
    this.addUsersToTeamForm.patchValue({
      team: team.id.toString(),
      users: team.users.map(user => user.id)
    });
    this.visibleAddUsersToTeam = true;
  }

  openAddTeamModal() {
    // Reset form before opening
    this.addTeamForm.reset({
      name: '',
      remoteIdentifier: '',
      users: [],
      userInput: ''
    });
    this.visibleAddTeam = true;
  }

  openAddUsersToTeamModal() {
    // Reset form before opening
    this.addUsersToTeamForm.reset({
      team: '',
      users: [],
      userInput: ''
    });
    this.visibleAddUsersToTeam = true;
  }

  closeModal() {
    this.visibleAddTeam = false;
    this.visibleAddUsersToTeam = false;
  }

  onSubmitAddTeam() {
    if (this.addTeamForm.valid) {
      const team: TeamDto = {
        users: this.addTeamForm.value.users || [],
        name: this.addTeamForm.value.name || "",
        remoteIdentifier: this.addTeamForm.value.remoteIdentifier || ""
      }
      this.teamService.create(team).subscribe({
        next: (response) => {
          this.showToast('success', 'Team created successfully');
          this.loadTeams();
          this.closeModal();
        },
        error: (error) => {
          this.showToast('danger', 'Error creating team: Team name may already exist or is empty.');
        }
      });
    }
  }

  onTeamChange() {
    const teamId = Number(this.addUsersToTeamForm.value.team);
    const team = this.teams.find(team => team.id === teamId);

    if (team) {
      this.addUsersToTeamForm.patchValue({
        users: team.users.map(user => user.id)
      });
    }
  }

  onSubmitAddUsersToTeam() {
    if (this.addUsersToTeamForm.valid) {
      const change: ChangeTeamDto = {
        id: Number(this.addUsersToTeamForm.value.team),
        users: this.addUsersToTeamForm.value.users || []
      }
      this.teamService.update(change).subscribe({
        next: (response) => {
          this.showToast('success', 'Team members updated successfully');
          this.loadTeams();
          this.closeModal();
        },
        error: (error) => {
          this.showToast('danger', 'Error updating team members. Please try again.');
        }
      });
    }
  }

  addUserToForm(user: User, form: 'addTeamForm' | 'addUsersToTeamForm') {
    const currentUsers = this[form].value.users || [];
    if (!currentUsers.includes(user.id)) {
      this[form].patchValue({
        users: [...currentUsers, user.id]
      });
    }
  }

  removeUserFromForm(userId: number, form: 'addTeamForm' | 'addUsersToTeamForm') {
    const currentUsers = this[form].value.users || [];
    this[form].patchValue({
      users: currentUsers.filter(id => id !== userId)
    });
  }

  /**
   * Confirm and delete a team
   * @param team The team to delete
   */
  deleteTeam(team: Team) {
    // First check if team has cloud subscriptions
    if (this.wizEnabled) {
      this.cloudSubscriptionService.getCloudSubscriptionsByTeam(team.id).subscribe({
        next: (subscriptions) => {
          if (subscriptions.length > 0) {
            this.showToast('danger', 'Cannot delete team with active cloud subscriptions. Please remove all subscriptions first.');
            return;
          } else {
            this.confirmAndDeleteTeam(team);
          }
        },
        error: (error) => {
          this.showToast('danger', 'Error checking team subscriptions. Please try again.');
        }
      });
    } else {
      this.confirmAndDeleteTeam(team);
    }
  }

  private confirmAndDeleteTeam(team: Team) {
    if (confirm(`Are you sure you want to delete team "${team.name}"? This action cannot be undone.`)) {
      this.teamService.delete(team.id).subscribe({
        next: () => {
          this.showToast('success', 'Team deleted successfully');
          this.loadTeams(); // Reload teams list
        },
        error: (error) => {
          let errorMessage = "Error deleting team";

          // Try to extract the error message from the response
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 409) {
            // 409 Conflict - team has resources
            errorMessage = "Cannot delete team with cloud subscriptions or code repositories";
          }

          this.showToast('danger', errorMessage);
        }
      });
    }
  }

  getUserNameById(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : '';
  }

  // Toast handling
  position = 'top-end';
  visible = false;
  percentage = 0;
  toastMessage: string = "";
  toastStatus: string = "";

  showToast(status: string, message: string) {
    this.toastStatus = status;
    this.toastMessage = message;
    this.visible = true;
  }

  toggleToast() {
    this.visible = !this.visible;
  }

  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  // Add this new method for filtering
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = searchTerm;

    if (!searchTerm) {
      this.filteredTeams = [...this.teams];
      return;
    }

    this.filteredTeams = this.teams.filter(team => {
      return (
          team.name.toLowerCase().includes(searchTerm) ||
          (team.remoteIdentifier && team.remoteIdentifier.toLowerCase().includes(searchTerm)) ||
          team.users.some(user => user.username.toLowerCase().includes(searchTerm))
      );
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredTeams = [...this.teams];
  }

  openCloudSubscriptionsModal(team: Team) {
    this.selectedTeam = team;
    this.loadCloudSubscriptions(team.id);
    this.newSubscriptionName = ''; // Reset subscription name input
    this.visibleCloudSubscriptions = true;
  }

  loadCloudSubscriptions(teamId: number) {
    this.cloudSubscriptionService.getCloudSubscriptionsByTeam(teamId).subscribe({
      next: (response) => {
        this.cloudSubscriptions = response;
      },
      error: (error) => {
        this.showToast('danger', 'Error loading cloud subscriptions');
      }
    });
  }

  createCloudSubscription() {
    if (!this.selectedTeam || !this.newSubscriptionName.trim()) {
      return;
    }

    this.cloudSubscriptionService.create(this.selectedTeam.id, this.newSubscriptionName).subscribe({
      next: () => {
        this.showToast('success', 'Cloud subscription created successfully');
        this.loadCloudSubscriptions(this.selectedTeam!.id);
        this.newSubscriptionName = '';
      },
      error: (error) => {
        this.showToast('danger', 'Error creating cloud subscription');
      }
    });
  }

  deleteCloudSubscription(subscriptionId: number) {
    if (!this.selectedTeam) {
      return;
    }

    if (confirm('Are you sure you want to delete this cloud subscription? This action cannot be undone.')) {
      this.cloudSubscriptionService.delete(subscriptionId, this.selectedTeam.id).subscribe({
        next: () => {
          this.showToast('success', 'Cloud subscription deleted successfully');
          this.loadCloudSubscriptions(this.selectedTeam!.id);
        },
        error: (error) => {
          this.showToast('danger', 'Error deleting cloud subscription');
        }
      });
    }
  }

  // ============ JIRA Integration ============

  loadJiraConfigs() {
    this.teams.forEach(team => {
      this.jiraService.getConfiguration(team.id).subscribe({
        next: (config) => {
          if (config && config.configured) {
            this.jiraConfigs.set(team.id, config);
          }
        },
        error: () => {}
      });
    });
  }

  getJiraConfigStatus(teamId: number): boolean {
    return this.jiraConfigs.has(teamId);
  }

  openJiraConfigModal(team: Team) {
    this.selectedTeam = team;
    this.jiraConfigEditMode = false;
    this.jiraProjects = [];
    this.jiraIssueTypes = [];

    const existing = this.jiraConfigs.get(team.id);
    if (existing) {
      this.jiraConfigEditMode = true;
      this.jiraConfigForm.patchValue({
        jiraUrl: existing.jiraUrl,
        jiraToken: '',
        jiraProjectKey: existing.jiraProjectKey,
        jiraIssueType: existing.jiraIssueType || 'Bug',
        jiraUsername: existing.jiraUsername || '',
        autoCreateEnabled: existing.autoCreateEnabled,
        autoSeverityThreshold: existing.autoSeverityThreshold || 'HIGH',
      });
      this.jiraConfigForm.get('jiraToken')?.clearValidators();
      this.jiraConfigForm.get('jiraToken')?.updateValueAndValidity();
    } else {
      this.jiraConfigForm.reset({
        jiraUrl: '',
        jiraToken: '',
        jiraProjectKey: '',
        jiraIssueType: 'Bug',
        jiraUsername: '',
        autoCreateEnabled: false,
        autoSeverityThreshold: 'HIGH',
      });
      this.jiraConfigForm.get('jiraToken')?.setValidators(Validators.required);
      this.jiraConfigForm.get('jiraToken')?.updateValueAndValidity();
    }
    this.visibleJiraConfig = true;
  }

  saveJiraConfig() {
    if (!this.selectedTeam || this.jiraConfigForm.invalid) return;

    const config = {
      jiraUrl: this.jiraConfigForm.value.jiraUrl || '',
      jiraToken: this.jiraConfigForm.value.jiraToken || '',
      jiraProjectKey: this.jiraConfigForm.value.jiraProjectKey || '',
      jiraIssueType: this.jiraConfigForm.value.jiraIssueType || 'Bug',
      jiraUsername: this.jiraConfigForm.value.jiraUsername || '',
      autoCreateEnabled: this.jiraConfigForm.value.autoCreateEnabled || false,
      autoSeverityThreshold: this.jiraConfigForm.value.autoSeverityThreshold || 'HIGH',
    };

    const teamId = this.selectedTeam.id;
    const operation = this.jiraConfigEditMode
        ? this.jiraService.updateConfiguration(teamId, config)
        : this.jiraService.createConfiguration(teamId, config);

    operation.subscribe({
      next: (response) => {
        this.jiraConfigs.set(teamId, response);
        this.showToast('success', `JIRA configuration ${this.jiraConfigEditMode ? 'updated' : 'created'} successfully`);
        this.visibleJiraConfig = false;
      },
      error: (error) => {
        this.showToast('danger', 'Error saving JIRA configuration. Please check your settings.');
      }
    });
  }

  deleteJiraConfig() {
    if (!this.selectedTeam) return;
    if (!confirm('Are you sure you want to delete the JIRA configuration? This will not affect existing tickets.')) return;

    const teamId = this.selectedTeam.id;
    this.jiraService.deleteConfiguration(teamId).subscribe({
      next: () => {
        this.jiraConfigs.delete(teamId);
        this.showToast('success', 'JIRA configuration deleted successfully');
        this.visibleJiraConfig = false;
      },
      error: () => {
        this.showToast('danger', 'Error deleting JIRA configuration');
      }
    });
  }

  testJiraConnection() {
    if (!this.selectedTeam) return;
    this.jiraTestingConnection = true;

    this.jiraService.testConnection(this.selectedTeam.id).subscribe({
      next: () => {
        this.jiraTestingConnection = false;
        this.showToast('success', 'JIRA connection test successful!');
      },
      error: () => {
        this.jiraTestingConnection = false;
        this.showToast('danger', 'JIRA connection test failed. Please verify your settings.');
      }
    });
  }

  private getJiraRequestPayload(): Partial<JiraConfigRequest> | null {
    const form = this.jiraConfigForm.value;
    const token = form.jiraToken;

    if (!form.jiraUrl) {
      this.showToast('warning', 'Please fill in JIRA URL first');
      return null;
    }

    if (!token && !this.jiraConfigEditMode) {
      this.showToast('warning', 'Please fill in API Token first');
      return null;
    }

    if (!token && this.jiraConfigEditMode) {
      this.showToast('warning', 'In edit mode, please re-enter the API Token to fetch data from JIRA');
      return null;
    }

    return {
      jiraUrl: form.jiraUrl || '',
      jiraToken: token || '',
      jiraProjectKey: form.jiraProjectKey || '',
      jiraUsername: form.jiraUsername || '',
    };
  }

  fetchJiraProjects() {
    const payload = this.getJiraRequestPayload();
    if (!payload) return;

    this.jiraLoadingProjects = true;
    this.jiraProjects = [];
    this.jiraIssueTypes = [];

    this.jiraService.fetchProjects(payload).subscribe({
      next: (projects) => {
        this.jiraLoadingProjects = false;
        this.jiraProjects = projects;
        if (projects.length > 0) {
          const currentKey = this.jiraConfigForm.get('jiraProjectKey')?.value;
          if (!currentKey || !projects.some(p => p.key === currentKey)) {
            this.jiraConfigForm.patchValue({ jiraProjectKey: projects[0].key });
          }
          this.showToast('success', `Found ${projects.length} project(s)`);
          this.fetchJiraIssueTypes();
        } else {
          this.showToast('warning', 'No projects found. Check your credentials.');
        }
      },
      error: () => {
        this.jiraLoadingProjects = false;
        this.showToast('danger', 'Failed to fetch projects. Check connection settings.');
      }
    });
  }

  fetchJiraIssueTypes() {
    const payload = this.getJiraRequestPayload();
    if (!payload) return;

    if (!this.jiraConfigForm.value.jiraProjectKey) {
      this.showToast('warning', 'Please select a project first');
      return;
    }
    payload.jiraProjectKey = this.jiraConfigForm.value.jiraProjectKey || '';

    this.jiraLoadingIssueTypes = true;
    this.jiraIssueTypes = [];

    this.jiraService.fetchIssueTypes(payload).subscribe({
      next: (types) => {
        this.jiraLoadingIssueTypes = false;
        this.jiraIssueTypes = types;
        if (types.length > 0) {
          const currentValue = this.jiraConfigForm.get('jiraIssueType')?.value;
          if (!currentValue || !types.includes(currentValue)) {
            this.jiraConfigForm.patchValue({ jiraIssueType: types[0] });
          }
        } else {
          this.showToast('warning', 'No issue types found for this project.');
        }
      },
      error: () => {
        this.jiraLoadingIssueTypes = false;
        this.showToast('danger', 'Failed to fetch issue types.');
      }
    });
  }
}