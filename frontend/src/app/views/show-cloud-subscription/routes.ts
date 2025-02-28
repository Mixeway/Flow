import { Routes } from '@angular/router';
import {ShowCloudSubscriptionComponent} from "./show-cloud-subscription.component";


export const routes: Routes = [
  {
    path: '',
    component: ShowCloudSubscriptionComponent,
    data: {
      title: 'Show Cloud Subscription Data'
    }
  }
];
