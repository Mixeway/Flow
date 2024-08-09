import { Routes } from '@angular/router';
import {ShowRepoComponent} from "./show-repo.component";


export const routes: Routes = [
  {
    path: '',
    component: ShowRepoComponent,
    data: {
      title: 'Show Repo Data'
    }
  }
];
