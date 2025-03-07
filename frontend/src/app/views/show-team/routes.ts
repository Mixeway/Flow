import { Routes } from '@angular/router';
import {ShowTeamComponent} from "./show-team.component";


export const routes: Routes = [
  {
    path: '',
    component: ShowTeamComponent,
    data: {
      title: 'Show Team Data'
    }
  }
];
