import { Component } from '@angular/core';
import {ColComponent, RowComponent} from "@coreui/angular";
import {ThreatScoreComponent} from "./threat-score/threat-score.component";
import {InfosComponent} from "./infos/infos.component";
import {ThreatListComponent} from "./threat-list/threat-list.component";
import {ReviewsComponent} from "./reviews/reviews.component";
import {WaiversComponent} from "./waivers/waivers.component";

@Component({
  selector: 'app-threat-intel',
  standalone: true,
    imports: [
        ColComponent,
        RowComponent,
        ThreatScoreComponent,
        InfosComponent,
        ThreatListComponent,
        ReviewsComponent,
        WaiversComponent
    ],
  templateUrl: './threat-intel.component.html',
  styleUrl: './threat-intel.component.scss'
})
export class ThreatIntelComponent {

}
