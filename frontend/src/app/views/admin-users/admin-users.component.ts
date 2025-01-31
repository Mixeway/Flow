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

  users: User[] = [
  ];

  teams: Team[] = [
  ];

  filteredTeams: Observable<Team[]> | undefined;
  searchTerm: string = '';
  filteredUsers: User[] = [];

  visibleAddNewUser = false;
  visibleRoleModal = false;
  visibleTeamModal = false;
  visibleChangePassword = false;

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

  selectedUserId: number | null = null;

  constructor(public iconSet: IconSetService, private fb: FormBuilder, private router: Router,
              private authService: AuthService, private userService: UserService,
              private teamService: TeamService) {
    // iconSet singleton
    iconSet.icons = { ...freeSet, ...iconSet };
  }

  loadTeams() {
    this.teamService.get().subscribe({
      next: (response) => {
        this.teams = response;
        this.refreshFilteredTeams();
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
        this.filteredUsers = response; // Initialize filtered users

      },
      error: (error) => {
        // Handle login error
      }
    });
  }
  private refreshFilteredTeams() {
    const teamInputValue = this.addNewUserForm.controls.teamInput.value || '';
    const teamInputValueForChange = this.changeTeamForm.controls.teamInput.value || '';

    this.addNewUserForm.controls.teamInput.setValue(teamInputValue, { emitEvent: true });
    this.changeTeamForm.controls.teamInput.setValue(teamInputValueForChange, { emitEvent: true });
  }

  ngOnInit() {
    this.authService.hcAdmin().subscribe({
      next: () => {
        // Health check passed, proceed with loading the dashboard
      },
      error: () => {
        // Health check failed, redirect to login
        this.router.navigate(['/login']);
      }
    });
    this.loadUsers();
    this.loadTeams();
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
  }

  private _filterTeams(value: string): Team[] {
    const filterValue = value.toLowerCase();
    return this.teams.filter(team => team.name.toLowerCase().includes(filterValue));
  }

  openAddNewUserModal() {
    this.visibleAddNewUser = true;
  }

  openRoleModal(row: any) {
    this.selectedUserId = row.id;
    this.changeRoleForm.patchValue({
      role: row.role
    });
    this.visibleRoleModal = true;
  }

  openTeamModal(row: any) {
    this.selectedUserId = row.id;
    this.changeTeamForm.patchValue({
      teams: row.teams.map((team: Team) => team.id)
    });
    this.visibleTeamModal = true;
  }

  openChangePasswordModal(row: any) {
    this.selectedUserId = row.id;
    this.changePasswordForm.reset();
    this.visibleChangePassword = true;
  }

  closeModal() {
    this.visibleAddNewUser = false;
    this.visibleRoleModal = false;
    this.visibleTeamModal = false;
    this.visibleChangePassword = false;
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
          this.toastStatus = "success"
          this.toastMessage = "User created"
          this.toggleToast();
          this.loadUsers();
          this.closeModal();

        },
        error: (error) => {
          this.toastStatus = "danger"
          this.toastMessage = "Problem during user creation, username must be unique. If error keep occurring, verify application logs"
          this.toggleToast();
        }
      });
    }
  }

  onSubmitChangeRole() {
    if (this.changeRoleForm.valid && this.selectedUserId !== null) {
      const user = this.users.find(user => user.id === this.selectedUserId);
      if (user) {
        user.role = this.changeRoleForm.value.role!;
        this.userService.changeRole({role: this.changeRoleForm.value.role || ""}, this.selectedUserId).subscribe({
          next: (response) => {
            this.toastStatus = "success"
            this.toastMessage = "Changed users role to: " + this.changeRoleForm.value.role
            this.toggleToast();
            this.loadUsers();
            this.closeModal();

          },
          error: (error) => {
            this.toastStatus = "danger"
            this.toastMessage = "Problem during user role change. If it will keep occurring contact system administrator."
            this.toggleToast();
          }
        });
      }
    }
  }

  onSubmitTeamChange() {
    if (this.changeTeamForm.valid && this.selectedUserId !== null) {
      const user = this.users.find(user => user.id === this.selectedUserId);
      if (user) {
        this.userService.changeTeam({teams: this.changeTeamForm.value.teams || []}, this.selectedUserId).subscribe({
          next: (response) => {
            this.toastStatus = "success"
            this.toastMessage = "Changed users Teams"
            this.toggleToast();
            this.loadUsers();
            this.closeModal();
          },
          error: (error) => {
            this.toastStatus = "danger"
            this.toastMessage = "Problem during user team change. If it will keep occurring contact system administrator."
            this.toggleToast();
          }
        });
      }
    }
  }

  addTeamToForm(team: Team) {
    const currentTeams = this.changeTeamForm.value.teams!;
    if (!currentTeams.includes(team.id)) {
      this.changeTeamForm.patchValue({
        teams: [...currentTeams, team.id]
      });
    }
  }

  addTeamToAddUserForm(team: Team) {
    const currentTeams = this.addNewUserForm.value.teams!;
    if (!currentTeams.includes(team.id)) {
      this.addNewUserForm.patchValue({
        teams: [...currentTeams, team.id]
      });
    }
  }

  removeTeamFromForm(teamId: number) {
    const currentTeams = this.changeTeamForm.value.teams!;
    this.changeTeamForm.patchValue({
      teams: currentTeams.filter(id => id !== teamId)
    });
  }

  removeTeamFromAddUserForm(teamId: number) {
    const currentTeams = this.addNewUserForm.value.teams!;
    this.addNewUserForm.patchValue({
      teams: currentTeams.filter(id => id !== teamId)
    });
  }

  onSubmitChangePassword() {
    if (this.changePasswordForm.valid && this.selectedUserId !== null) {
      if (this.changePasswordForm.value.password === this.changePasswordForm.value.confirmPassword) {
        this.userService.changePassword({password: this.changePasswordForm.value.password || ""}, this.selectedUserId).subscribe({
          next: (response) => {
            this.toastStatus = "success"
            this.toastMessage = "Changed User's Password"
            this.toggleToast();
            this.closeModal();
          },
          error: (error) => {
            this.toastStatus = "danger"
            this.toastMessage = "Problem during user password change. If it will keep occurring contact system administrator."
            this.toggleToast();
          }
        });
      } else {
        // Handle password mismatch error
        alert("Passwords do not match!");
      }
    }
  }

  deactivateUser(row: any) {
    const user = this.users.find(user => user.id === row.id);
    if (user) {
      this.userService.deactivate(user.id).subscribe({
        next: (response) => {
          this.toastStatus = "success"
          this.toastMessage = "Successfully deactivated User"
          this.toggleToast();
          this.loadUsers();
        },
        error: (error) => {
          this.toastStatus = "danger"
          this.toastMessage = "Problem during user deactivation. If it will keep occurring contact system administrator."
          this.toggleToast();
        }
      });
    }
  }

  getTeamNameById(teamId: number): string {
    const team = this.teams.find(t => t.id === teamId);
    return team ? team.name : '';
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

  activate(row: any) {
    const user = this.users.find(user => user.id === row.id);
    if (user) {
      this.userService.activate(user.id).subscribe({
        next: (response) => {
          this.toastStatus = "success"
          this.toastMessage = "Successfully deactivated User"
          this.toggleToast();
          this.loadUsers();
        },
        error: (error) => {
          this.toastStatus = "danger"
          this.toastMessage = "Problem during user deactivation. If it will keep occurring contact system administrator."
          this.toggleToast();
        }
      });
    }
  }
  // Add this new method for filtering
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = searchTerm;

    if (!searchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter(user => {
      return (
          user.username.toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm) ||
          user.teams.some(team => team.name.toLowerCase().includes(searchTerm)) ||
          user.active.toString().toLowerCase().includes(searchTerm)
      );
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredUsers = this.users;
  }
}
