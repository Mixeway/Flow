import { Routes } from '@angular/router';
import {ComponentsComponent} from "./components.component";


export const routes: Routes = [
  {
    path: '',
    component: ComponentsComponent,
    data: {
      title: 'Components'
    }
  }
];
