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
    ToastHeaderComponent, FormControlDirective,
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
export class ManageTeamsComponent implements OnInit{

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
              private userService: UserService,private settingsService: SettingsService,
              private cloudSubscriptionService: CloudSubscriptionService) {
    // iconSet singleton
    iconSet.icons = { ...freeSet, ...iconSet };
  }

  loadTeams() {
    this.teamService.get().subscribe({
      next: (response) => {
        this.teams = response;
        this.filteredTeams = response; // Initialize filtered teams
      },
      error: (error) => {
        // Handle login error
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
        // Handle login error
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
      },
      error: () => {
        // Health check failed, redirect to login
        this.router.navigate(['/login']);
      }
    });
    this.loadTeams();
    this.loadUsers();
    this.addTeamForm.controls.userInput.valueChanges.pipe(
        startWith(''),
        map(value => this._filterUsers(value))
    ).subscribe(filteredUsers => {
      this.filteredUsers = of(filteredUsers);
    });
    this.loadScannerConfig();

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
    const filterValue = value.toLowerCase();
    return this.users.filter(user => user.username.toLowerCase().includes(filterValue));
  }

  openAddTeamModal() {
    this.visibleAddTeam = true;
  }

  openAddUsersToTeamModal() {
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
          this.toastStatus = "success"
          this.toastMessage = "Team created Successfully"
          this.toggleToast();
          this.loadTeams();
        },
        error: (error) => {
          this.toastStatus = "danger"
          this.toastMessage = "Error during team creation, team already exist or You provided empty name."
          this.toggleToast();
        }
      });
      this.closeModal();
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
      const teamId = Number(this.addUsersToTeamForm.value.team);
      const team = this.teams.find(team => team.id === teamId);

      if (team) {
        const selectedUsers = this.addUsersToTeamForm.value.users!.map((userId: number) => {
          const user = this.users.find(user => user.id === userId);
          return user ? user : { id: userId, username: 'Unknown User', role: '', teams: [], active: true };
        });

        team.users = selectedUsers;
      }
      const change: ChangeTeamDto = {
        id: Number(this.addUsersToTeamForm.value.team),
        users: this.addUsersToTeamForm.value.users || []
      }
      this.teamService.update(change).subscribe({
        next: (response) => {
          this.toastStatus = "success"
          this.toastMessage = "Team Changed Successfully"
          this.toggleToast();
          this.loadTeams();
        },
        error: (error) => {
          this.toastStatus = "danger"
          this.toastMessage = "Error during team change, ask administrator for the reason."
          this.toggleToast();
        }
      });

      this.closeModal();
    }
  }

  addUserToForm(user: User, form: 'addTeamForm' | 'addUsersToTeamForm') {
    const currentUsers = this[form].value.users!;
    if (!currentUsers.includes(user.id)) {
      this[form].patchValue({
        users: [...currentUsers, user.id]
      });
    }
  }

  removeUserFromForm(userId: number, form: 'addTeamForm' | 'addUsersToTeamForm') {
    const currentUsers = this[form].value.users!;
    this[form].patchValue({
      users: currentUsers.filter(id => id !== userId)
    });
  }

  deleteTeam(team: Team) {
    this.teams = this.teams.filter(t => t.id !== team.id);
  }

  getUserNameById(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : '';
  }

  position = 'top-end';
  visible = false;
  percentage = 0;
  toastMessage: string = ""
  toastStatus: string = ""

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
      this.filteredTeams = this.teams;
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
    this.filteredTeams = this.teams;
  }
  openCloudSubscriptionsModal(team: Team) {
    this.selectedTeam = team;
    this.loadCloudSubscriptions(team.id);
    this.visibleCloudSubscriptions = true;
  }
  loadCloudSubscriptions(teamId: number) {
    this.cloudSubscriptionService.getByTeam(teamId).subscribe({
      next: (response) => {
        this.cloudSubscriptions = response;
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = "Error loading cloud subscriptions";
        this.toggleToast();
      }
    });
  }
  createCloudSubscription() {
    if (!this.selectedTeam || !this.newSubscriptionName.trim()) {
      return;
    }

    this.cloudSubscriptionService.create(this.selectedTeam.id, this.newSubscriptionName).subscribe({
      next: () => {
        this.toastStatus = "success";
        this.toastMessage = "Cloud subscription created successfully";
        this.toggleToast();
        this.loadCloudSubscriptions(this.selectedTeam!.id);
        this.newSubscriptionName = '';
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = "Error creating cloud subscription";
        this.toggleToast();
      }
    });
  }

  deleteCloudSubscription(subscriptionId: number) {
    if (!this.selectedTeam) {
      return;
    }

    this.cloudSubscriptionService.delete(subscriptionId, this.selectedTeam.id).subscribe({
      next: () => {
        this.toastStatus = "success";
        this.toastMessage = "Cloud subscription deleted successfully";
        this.toggleToast();
        this.loadCloudSubscriptions(this.selectedTeam!.id);
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = "Error deleting cloud subscription";
        this.toggleToast();
      }
    });
  }
}
