import { Component } from '@angular/core';
import {CardBodyComponent, CardComponent} from "@coreui/angular";

@Component({
  selector: 'app-threat-list',
  standalone: true,
  imports: [
    CardComponent,
    CardBodyComponent
  ],
  templateUrl: './threat-list.component.html',
  styleUrl: './threat-list.component.scss'
})
export class ThreatListComponent {

}
