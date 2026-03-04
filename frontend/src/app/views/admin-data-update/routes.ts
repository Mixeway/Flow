import {Routes} from '@angular/router';
import {AdminDataUpdateComponent} from "./admin-data-update.component";


export const routes: Routes = [
  {
    path: '',
    component: AdminDataUpdateComponent,
    data: {
      title: 'Data Update'
    }
  }
];
