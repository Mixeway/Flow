import { Routes } from '@angular/router';
import {VulnerabilitiesComponent} from "./vulnerabilities.component";


export const routes: Routes = [
  {
    path: '',
    component: VulnerabilitiesComponent,
    data: {
      title: 'Vulnerabilities'
    }
  }
];
