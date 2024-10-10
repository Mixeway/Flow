import { Component } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  ColComponent, RowComponent,
  TemplateIdDirective,
  WidgetStatFComponent
} from "@coreui/angular";
import {cilArrowRight, cilBug, cilChart, cilChartPie, cilPeople} from "@coreui/icons";
import {IconDirective} from "@coreui/icons-angular";

@Component({
  selector: 'app-infos',
  standalone: true,
  imports: [
    CardComponent,
    CardBodyComponent,
    ColComponent,
    WidgetStatFComponent,
    IconDirective,
    TemplateIdDirective,
    RowComponent
  ],
  templateUrl: './infos.component.html',
  styleUrl: './infos.component.scss'
})
export class InfosComponent {
  icons = { cilChartPie, cilArrowRight, cilBug, cilChart, cilPeople};

}
