import { Routes } from '@angular/router';
import {ManageTeamsComponent} from "./manage-teams.component";


export const routes: Routes = [
  {
    path: '',
    component: ManageTeamsComponent,
    data: {
      title: 'Manage Teams'
    }
  }
];
