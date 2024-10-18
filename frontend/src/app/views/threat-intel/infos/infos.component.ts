import {AfterViewInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
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
export class InfosComponent implements AfterViewInit, OnChanges{
  @Input()
  teams: number | undefined;
  @Input()
  allProjects: number = 0;
  @Input()
  affectedProjects: number = 0;
  @Input()
  openedVulns: number = 0;
  percentage: string = '0';

  icons = { cilChartPie, cilArrowRight, cilBug, cilChart, cilPeople};

  calculatePercentage() {

    const allProjects = this.allProjects ?? 0;
    const affectedProjects = this.affectedProjects ?? 0;

    if (allProjects > 0) {
      this.percentage = ((affectedProjects / allProjects) * 100).toFixed(0);
    } else {
      this.percentage = '0';
    }
  }

  ngAfterViewInit(): void {
    this.calculatePercentage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePercentage();
  }
}
