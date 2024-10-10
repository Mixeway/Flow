import { Routes } from '@angular/router';
import {ThreatIntelComponent} from "./threat-intel.component";


export const routes: Routes = [
  {
    path: '',
    component: ThreatIntelComponent,
    data: {
      title: 'Threat Intelligence'
    }
  }
];
