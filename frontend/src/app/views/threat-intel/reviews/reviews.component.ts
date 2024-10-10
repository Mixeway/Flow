import { Component } from '@angular/core';
import {CardBodyComponent, CardComponent, ColComponent} from "@coreui/angular";

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    ColComponent,
    CardComponent,
    CardBodyComponent
  ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {

}
