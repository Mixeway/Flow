import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  InputGroupComponent, InputGroupTextDirective, ListGroupDirective, ListGroupItemDirective,
  RowComponent
} from "@coreui/angular";
import {Router} from "@angular/router";
import {AuthService} from "../../service/AuthService";
import {ComponentsService} from "../../service/ComponentsService";
import {IconDirective, IconSetService} from "@coreui/icons-angular";
import {brandSet, freeSet} from "@coreui/icons";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [
    RowComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ColComponent,
    IconDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NgxDatatableModule,
    NgIf,
    ButtonDirective,
    ListGroupDirective,
    ListGroupItemDirective,
    NgForOf
  ],
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss'
})
export class ComponentsComponent implements OnInit{
  components: any;
  filteredComponents: any[] = [];  // Filtered data

  filters: { [key: string]: string } = {
    component: '',
    vulnerabilities: '',
    repos: ''
  };
  constructor(private router: Router, public iconSet: IconSetService,
              private authService: AuthService, private componentsService: ComponentsService) {
    iconSet.icons = { ...freeSet, ...iconSet, ...brandSet };

  }

  ngOnInit(): void {
    this.authService.hc().subscribe({
      next: () => {
        // Health check passed, proceed with loading the dashboard
      },
      error: () => {
        // Health check failed, redirect to login
        this.router.navigate(['/login']);
      }

    });
    this.loadComponents();
  }

  private loadComponents() {
    this.componentsService.getComponents().subscribe({
      next: (response) => {
        this.components = response;
        this.filteredComponents = [...this.components];
      },
    });
  }
  updateFilterComponent(event: any) {
    const val = event.target.value.toLowerCase();
    this.filters['component'] = val;
    this.applyFilters();
  }

  updateFilterVulnerabilities(event: any) {
    const val = event.target.value.toLowerCase();
    this.filters['vulnerabilities'] = val;
    this.applyFilters();
  }

  updateFilterRepos(event: any) {
    const val = event.target.value.toLowerCase();
    this.filters['repos'] = val;
    this.applyFilters();
  }

  clearFilter(filterKey: string) {
    this.filters[filterKey] = '';
    this.applyFilters();
  }

  applyFilters() {
    this.filteredComponents = this.components.filter((comp: { component: { name: string; groupid: string; version: string; }; vulnerabilities: string[]; affectedReposUrl: string[]; }) => {
      const matchesComponent = !this.filters['component'] ||
          comp.component.name.toLowerCase().includes(this.filters['component']) ||
          (comp.component.groupid?.toLowerCase().includes(this.filters['component']) || '') ||
          comp.component.version.toLowerCase().includes(this.filters['component']);

      const matchesVulnerabilities = !this.filters['vulnerabilities'] ||
          (comp.vulnerabilities && comp.vulnerabilities.some((vul: string) => vul.toLowerCase().includes(this.filters['vulnerabilities'])));

      const matchesRepos = !this.filters['repos'] ||
          (comp.affectedReposUrl && comp.affectedReposUrl.some((repo: string) => repo.toLowerCase().includes(this.filters['repos'])));

      return matchesComponent && matchesVulnerabilities && matchesRepos;
    });
  }
}
