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


  constructor(public iconSet: IconSetService, private fb: FormBuilder, private router: Router,
              private authService: AuthService, private teamService: TeamService,
              private userService: UserService, private settingsService: SettingsService,
              private cloudSubscriptionService: CloudSubscriptionService) {
    // iconSet singleton
    iconSet.icons = { ...freeSet, ...iconSet };
  }

  loadTeams() {
    this.teamService.get().subscribe({
      next: (response: Team[]) => {
        // Add showMembers flag to each team
        this.teams = response.map((team: Team) => ({
          ...team,
          showMembers: false
        }));
        this.filteredTeams = [...this.teams]; // Initialize filtered teams with a new array
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
}