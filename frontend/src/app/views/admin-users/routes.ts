import { Routes } from '@angular/router';
import {AdminUsersComponent} from "./admin-users.component";


export const routes: Routes = [
  {
    path: '',
    component: AdminUsersComponent,
    data: {
      title: 'Admin User Management'
    }
  }
];
