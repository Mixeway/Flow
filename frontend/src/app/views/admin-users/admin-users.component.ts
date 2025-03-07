import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  InputGroupComponent,
  InputGroupTextDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  RowComponent,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent,
} from "@coreui/angular";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {IconDirective, IconSetService} from "@coreui/icons-angular";
import {AsyncPipe, CommonModule, NgForOf} from "@angular/common";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {freeSet} from "@coreui/icons";
import {Observable, of} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {AuthService} from "../../service/AuthService";
import {UserService} from "../../service/UserService";
import {TeamService} from "../../service/TeamService";

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  teams: Team[];
  active: boolean;
  showTeams?: boolean; // Added for UI toggle
}

interface UserDto {
  username: string;
  password: string;
  role: string;
  teams: number[];
}

interface Team {
  id: number;
  name: string;
}

@Component({
  selector: 'app-admin-users',
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
    ToastHeaderComponent,
    ToastBodyComponent,
  ],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  users: User[] = [];
  teams: Team[] = [];
  filteredTeams: Observable<Team[]> | undefined;
  searchTerm: string = '';
  filteredUsers: User[] = [];

  visibleAddNewUser = false;
  visibleRoleModal = false;
  visibleTeamModal = false;
  visibleChangePassword = false;

  selectedUserId: number | null = null;
  selectedUser: User | null = null;
  passwordMismatch = false;

  addNewUserForm = this.fb.group({
    username: ['', Validators.required],
    role: ['', Validators.required],
    password: ['', Validators.required],
    teams: [[] as number[]],
    teamInput: new FormControl()
  });

  changeRoleForm = this.fb.group({
    role: ['', Validators.required]
  });

  changeTeamForm = this.fb.group({
    teams: [[] as number[]],
    teamInput: new FormControl()
  });

  changePasswordForm = this.fb.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  constructor(public iconSet: IconSetService, private fb: FormBuilder, private router: Router,
              private authService: AuthService, private userService: UserService,
              private teamService: TeamService) {
    // iconSet singleton
    iconSet.icons = { ...freeSet, ...iconSet };
  }

  ngOnInit() {
    this.authService.hcAdmin().subscribe({
      next: () => {
        // Health check passed, proceed with loading the dashboard
        this.loadUsers();
        this.loadTeams();
      },
      error: () => {
        // Health check failed, redirect to login
        this.router.navigate(['/login']);
      }
    });

    this.addNewUserForm.controls.teamInput.valueChanges.pipe(
        startWith(''),
        map(value => this._filterTeams(value))
    ).subscribe(filteredTeams => {
      this.filteredTeams = of(filteredTeams);
    });

    this.changeTeamForm.controls.teamInput.valueChanges.pipe(
        startWith(''),
        map(value => this._filterTeams(value))
    ).subscribe(filteredTeams => {
      this.filteredTeams = of(filteredTeams);
    });

    // Monitor password fields for mismatch
    this.changePasswordForm.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
  }

  loadTeams() {
    this.teamService.get().subscribe({
      next: (response: Team[]) => {
        this.teams = response;
        this.refreshFilteredTeams();
      },
      error: (error) => {
        this.showToast('danger', 'Error loading teams. Please try again.');
      }
    });
  }

  loadUsers() {
    this.userService.get().subscribe({
      next: (response: User[]) => {
        // Add UI state flags to each user
        this.users = response.map(user => ({
          ...user,
          showTeams: false
        }));
        this.filteredUsers = [...this.users]; // Initialize filtered users
      },
      error: (error) => {
        this.showToast('danger', 'Error loading users. Please try again.');
      }
    });
  }

  private refreshFilteredTeams() {
    const teamInputValue = this.addNewUserForm.controls.teamInput.value || '';
    const teamInputValueForChange = this.changeTeamForm.controls.teamInput.value || '';

    this.addNewUserForm.controls.teamInput.setValue(teamInputValue, { emitEvent: true });
    this.changeTeamForm.controls.teamInput.setValue(teamInputValueForChange, { emitEvent: true });
  }

  private _filterTeams(value: string): Team[] {
    const filterValue = value?.toLowerCase() || '';
    return this.teams.filter(team => team.name.toLowerCase().includes(filterValue));
  }

  // Helper method to get user initials for avatar
  getUserInitials(username: string): string {
    if (!username) return '';

    // Split by spaces and get first letter of each word
    const words = username.split(' ');
    if (words.length === 1) {
      // For one word, return first two letters or just the first if it's one character
      return username.length > 1 ? username.substring(0, 2).toUpperCase() : username.toUpperCase();
    } else {
      // For multiple words, return first letter of first two words
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
  }

  // Helper to get appropriate badge class for role
  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'badge-admin';
      case 'TEAM_MANAGER':
        return 'badge-team-manager';
      default:
        return 'badge-user';
    }
  }

  // Format role display
  formatRoleDisplay(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'Admin';
      case 'TEAM_MANAGER':
        return 'Team Manager';
      default:
        return 'User';
    }
  }

  // Toggle user teams visibility
  toggleTeamsView(user: User) {
    user.showTeams = !user.showTeams;
  }

  // We no longer need the toggle action menu function with the new icon-based approach

  // Get counts for dashboard cards
  getCountByRole(role: string): number {
    return this.users.filter(user => user.role === role).length;
  }

  getActiveUsersCount(): number {
    return this.users.filter(user => user.active).length;
  }

  openAddNewUserModal() {
    // Reset form before opening
    this.addNewUserForm.reset({
      username: '',
      role: '',
      password: '',
      teams: [],
      teamInput: ''
    });
    this.visibleAddNewUser = true;
  }

  openRoleModal(row: User) {
    this.selectedUserId = row.id;
    this.selectedUser = row;
    this.changeRoleForm.patchValue({
      role: row.role
    });
    this.visibleRoleModal = true;

    // No need to close action menu with the new icon-based approach
  }

  openTeamModal(row: User) {
    this.selectedUserId = row.id;
    this.selectedUser = row;
    this.changeTeamForm.patchValue({
      teams: row.teams.map((team: Team) => team.id)
    });
    this.visibleTeamModal = true;

    // No need to close action menu with the new icon-based approach
  }

  openChangePasswordModal(row: User) {
    this.selectedUserId = row.id;
    this.selectedUser = row;
    this.changePasswordForm.reset();
    this.passwordMismatch = false;
    this.visibleChangePassword = true;
  }

  closeModal() {
    this.visibleAddNewUser = false;
    this.visibleRoleModal = false;
    this.visibleTeamModal = false;
    this.visibleChangePassword = false;
    this.selectedUserId = null;
    this.selectedUser = null;
    this.passwordMismatch = false;
  }

  onSubmitAddNewUser() {
    if (this.addNewUserForm.valid) {
      const user: UserDto = {
        username: this.addNewUserForm.value.username || "",
        password: this.addNewUserForm.value.password || "",
        role: this.addNewUserForm.value.role || "",
        teams: this.addNewUserForm.value.teams || []
      }
      this.userService.create(user).subscribe({
        next: (response) => {
          this.showToast('success', 'User created successfully');
          this.loadUsers();
          this.closeModal();
        },
        error: (error) => {
          this.showToast('danger', 'Error creating user: Username must be unique. Please try a different username.');
        }
      });
    }
  }

  onSubmitChangeRole() {
    if (this.changeRoleForm.valid && this.selectedUserId !== null) {
      const user = this.users.find(user => user.id === this.selectedUserId);
      if (user) {
        this.userService.changeRole({role: this.changeRoleForm.value.role || ""}, this.selectedUserId).subscribe({
          next: (response) => {
            this.showToast('success', `User role changed to ${this.formatRoleDisplay(this.changeRoleForm.value.role || "")}`);
            this.loadUsers();
            this.closeModal();
          },
          error: (error) => {
            this.showToast('danger', 'Error changing user role. Please try again.');
          }
        });
      }
    }
  }

  onSubmitTeamChange() {
    if (this.selectedUserId !== null) {
      const user = this.users.find(user => user.id === this.selectedUserId);
      if (user) {
        this.userService.changeTeam({teams: this.changeTeamForm.value.teams || []}, this.selectedUserId).subscribe({
          next: (response) => {
            this.showToast('success', 'User teams updated successfully');
            this.loadUsers();
            this.closeModal();
          },
          error: (error) => {
            this.showToast('danger', 'Error updating user teams. Please try again.');
          }
        });
      }
    }
  }

  // Check if passwords match
  checkPasswordMatch() {
    const password = this.changePasswordForm.get('password')?.value;
    const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;

    if (password && confirmPassword) {
      this.passwordMismatch = password !== confirmPassword;
    } else {
      this.passwordMismatch = false;
    }
  }

  onSubmitChangePassword() {
    if (this.changePasswordForm.valid && this.selectedUserId !== null && !this.passwordMismatch) {
      this.userService.changePassword({password: this.changePasswordForm.value.password || ""}, this.selectedUserId).subscribe({
        next: (response) => {
          this.showToast('success', 'User password changed successfully');
          this.closeModal();
        },
        error: (error) => {
          this.showToast('danger', 'Error changing user password. Please try again.');
        }
      });
    }
  }

  addTeamToForm(team: Team) {
    const currentTeams = this.changeTeamForm.value.teams || [];
    if (!currentTeams.includes(team.id)) {
      this.changeTeamForm.patchValue({
        teams: [...currentTeams, team.id]
      });
    }
  }

  addTeamToAddUserForm(team: Team) {
    const currentTeams = this.addNewUserForm.value.teams || [];
    if (!currentTeams.includes(team.id)) {
      this.addNewUserForm.patchValue({
        teams: [...currentTeams, team.id]
      });
    }
  }

  removeTeamFromForm(teamId: number) {
    const currentTeams = this.changeTeamForm.value.teams || [];
    this.changeTeamForm.patchValue({
      teams: currentTeams.filter(id => id !== teamId)
    });
  }

  removeTeamFromAddUserForm(teamId: number) {
    const currentTeams = this.addNewUserForm.value.teams || [];
    this.addNewUserForm.patchValue({
      teams: currentTeams.filter(id => id !== teamId)
    });
  }

  deactivateUser(row: User) {
    if (confirm(`Are you sure you want to deactivate user "${row.username}"?`)) {
      this.userService.deactivate(row.id).subscribe({
        next: (response) => {
          this.showToast('success', 'User deactivated successfully');
          this.loadUsers();
        },
        error: (error) => {
          this.showToast('danger', 'Error deactivating user. Please try again.');
        }
      });
    }
  }

  activate(row: User) {
    this.userService.activate(row.id).subscribe({
      next: (response) => {
        this.showToast('success', 'User activated successfully');
        this.loadUsers();
      },
      error: (error) => {
        this.showToast('danger', 'Error activating user. Please try again.');
      }
    });
  }

  getTeamNameById(teamId: number): string {
    const team = this.teams.find(t => t.id === teamId);
    return team ? team.name : '';
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

  // Search functionality
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = searchTerm;

    if (!searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user => {
      return (
          user.username.toLowerCase().includes(searchTerm) ||
          this.formatRoleDisplay(user.role).toLowerCase().includes(searchTerm) ||
          user.teams.some(team => team.name.toLowerCase().includes(searchTerm)) ||
          (searchTerm === 'active' && user.active) ||
          (searchTerm === 'inactive' && !user.active)
      );
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredUsers = [...this.users];
  }
}