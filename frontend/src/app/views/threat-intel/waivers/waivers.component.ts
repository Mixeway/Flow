import { Component } from '@angular/core';
import {CardBodyComponent, CardComponent} from "@coreui/angular";

@Component({
  selector: 'app-waivers',
  standalone: true,
  imports: [
    CardBodyComponent,
    CardComponent
  ],
  templateUrl: './waivers.component.html',
  styleUrl: './waivers.component.scss'
})
export class WaiversComponent {

}
