import { Routes } from '@angular/router';
import {SecurityDashboardComponent} from "./security-dashboard.component";


export const routes: Routes = [
  {
    path: '',
    component: SecurityDashboardComponent,
    data: {
      title: 'Statistics'
    }
  }
];
