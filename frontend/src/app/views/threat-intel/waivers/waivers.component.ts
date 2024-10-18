import { Component } from '@angular/core';
import {AlertComponent, CardBodyComponent, CardComponent, CardHeaderComponent} from "@coreui/angular";

@Component({
  selector: 'app-waivers',
  standalone: true,
  imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    AlertComponent
  ],
  templateUrl: './waivers.component.html',
  styleUrl: './waivers.component.scss'
})
export class WaiversComponent {

}
