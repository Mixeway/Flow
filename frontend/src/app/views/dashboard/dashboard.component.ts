import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  Renderer2,
  ViewChild,
  TemplateRef,
  signal,
  WritableSignal,
  effect, Output, EventEmitter
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective, FormControlDirective, FormDirective, FormSelectDirective,
  GutterDirective, InputGroupComponent, InputGroupTextDirective, ModalBodyComponent,
  ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent, RowDirective, SpinnerComponent,
  TableDirective,
  TextColorDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent, TooltipDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective} from '@coreui/icons-angular';
import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import {DOCUMENT, NgForOf, NgIf, NgStyle} from "@angular/common";
import { IconSetService, IconSetModule} from "@coreui/icons-angular";
import {brandSet, cilEnvelopeOpen, flagSet, freeSet} from "@coreui/icons";
import {Router} from "@angular/router";
import {AuthService} from "../../service/AuthService";
import {GitLabService} from "../../service/GitLabService";
import {DashboardService} from "../../service/DashboardService";
import {TeamService} from "../../service/TeamService";
import {gitRepoUrlValidator} from "../../utils/GitRepoUrlValidator";

interface RepoRow{
  id: number;
  name: string;
  namespace: string;
  repo_url: string;
  imported: boolean;
}
interface CodeRepo {
  id: number;
  target: string;
  repo_url: string;
  team: string;
  sast: string;
  iac: string;
  secrets: string;
  sca: string;
}
interface CreateRepo {
  name: string;
  repoUrl: string;
  accessToken: string;
  remoteId: number;
  team: number;
}
interface SimpleUser {
  id: number
  username: string
}

interface Team {
  id: number;
  name: string;
  users: SimpleUser[];
}
interface TeamDto {
  name: string;
}
@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [WidgetsDropdownComponent, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent, NgxDatatableModule, ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, NgIf, FormSelectDirective, FormDirective, RowDirective, ModalTitleDirective, SpinnerComponent, TooltipDirective, NgForOf, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent]
})
export class DashboardComponent implements OnInit {

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
  @Output() repoImported = new EventEmitter<{ repoUrl: string, accessToken: string }>();
  importRepoForm: FormGroup;
  importSingleRepoForm: FormGroup;
  newTeamForm: FormGroup;
  isLoading = false;
  repoUrl: string = "";
  accessToken: string = "";
  selectedRepo: string = "GitLab";
  teams: Team[] = [];
  widgetStats: any;
  canManage: boolean = false;
  @Output() userRoleSet: EventEmitter<string> = new EventEmitter<string>();


  rows: CodeRepo[] = [];

  repoRows: RepoRow[] = []
  columns: any[] = [];

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);


  constructor(public iconSet: IconSetService, private fb: FormBuilder, private router: Router,
              private authService: AuthService, private gitLabService: GitLabService,
              private dashboardService: DashboardService, private teamService: TeamService) {
    // iconSet singleton
    iconSet.icons = { ...freeSet, ...iconSet, ...brandSet };
    this.importRepoForm = this.fb.group({
      repoUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      accessToken: ['', Validators.required],
      team: ['', Validators.required],
      repoType: ['gitlab', Validators.required]
    });
    this.importSingleRepoForm = this.fb.group({
      repoUrl: ['', [Validators.required, gitRepoUrlValidator()]],
      accessToken: ['', Validators.required],
      team: ['', Validators.required],
      repoType: ['gitlab', Validators.required]
    });
    this.newTeamForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);

  public chart: Array<IChartProps> = [];


  loadCodeRepos(){
    this.dashboardService.getRepos().subscribe({
      next: (response) => {
        this.rows = response;
      },
      error: (error) => {
        // Handle login error
      }
    });
  }
  loadWidgetStats(){
    this.dashboardService.getAggregatedStats().subscribe({
      next: (response) => {
        this.widgetStats = response;
      },
      error: (error) => {
        // Handle login error
      }
    });
  }
  loadTeams() {
    this.teamService.get().subscribe({
      next: (response) => {
        this.teams = response;
      },
      error: (error) => {
        // Handle login error
      }
    });
  }
  ngOnInit(): void {
    this.loadTeams();
    let userRole = localStorage.getItem('userRole');

    this.authService.hc().subscribe({
      next: (response) => {
        if (!userRole) {
          localStorage.setItem('userRole', response.status.replace("ROLE_",""));
          location.reload();
        }
        this.canManage = true;
      },
      error: () => {
        // Health check failed, redirect to login
        this.router.navigate(['/login']);
      }
    });
    this.initColumns();
    this.initCharts();
    this.updateChartOnColorModeChange();
    this.loadCodeRepos();
    this.loadWidgetStats();

  }

  initColumns(): void {
    this.columns = [
      { name: 'Actions', cellTemplate: this.actionsTemplate },
      { prop: 'target', name: 'Target' },
      { prop: 'team', name: 'Team' },
      { prop: 'apps', name: 'Apps' },
      { prop: 'risk', name: 'Risk' }
    ];
  }

  initCharts(): void {
    this.mainChart = this.#chartsData.mainChart;
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }

  temp = [...this.rows]; // a copy of the original rows for filtering

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.target.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
  }

  tempRepos = [...this.repoRows]; // a copy of the original rows for filtering

  updateFilterRepo(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data based on multiple columns
    const filteredRepos = this.tempRepos.filter(d =>
        d.name.toLowerCase().includes(val) ||
        d.namespace.toLowerCase().includes(val) ||
        d.repo_url.toLowerCase().includes(val)
    );

    // update the rows
    this.repoRows = filteredRepos;
  }

  nextPage(row: any) {
    console.log('Navigating to next page for:', row);
    // Add your navigation logic here
  }

  click(row: any) {
    this.router.navigate(['/show-repo/' + row.id]);
    // alert(JSON.stringify(row));
    // Handle the click event, e.g., navigate or perform actions based on row data
  }

  public visible = false;
  public visibleSingleRepoModal = false;
  public visibleList = false;
  public visibleNewTeam = false;

  importRepoModal() {
    this.visible = !this.visible;
  }

  handleImportRepoChange(event: any) {
    this.visible = event;
  }
  handleListRepoChange(event: any) {
    this.visible = false;
    this.visibleList = event;
  }
  closeModal() {
    this.visible = false;
    this.visibleList = false;
    this.visibleNewTeam = false;
    this.visibleSingleRepoModal = false;
  }
  closeNewTeamModal(){
    this.visibleNewTeam=false;
  }

  onSubmit(): void {
    if (this.importRepoForm.valid) {
      this.repoImported.emit(this.importRepoForm.value);

      this.repoUrl = this.importRepoForm.value.repoUrl;  // Store repoUrl
      this.accessToken = this.importRepoForm.value.accessToken;  // Store accessToken

      this.isLoading = true;  // Show the spinner
      this.gitLabService.setApiUrl(this.repoUrl);

      this.gitLabService.getAllProjects(this.accessToken).subscribe({
        next: (projects) => {
          this.repoRows = projects.map(proj => ({
            id: proj.id,
            name: proj.name,
            repo_url: proj.web_url,
            namespace: proj.path_with_namespace,
            imported: false
          }));
          this.tempRepos = [...this.repoRows];  // Update the temp array with the new data

          // Check if any repo in rows matches the URL and set imported to true
          this.repoRows.forEach(repoRow => {
            repoRow.imported = this.rows.some(row => row.repo_url === repoRow.repo_url);
          });
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
        complete: () => {
          this.isLoading = false;  // Hide the spinner
        }
      });

      this.closeModal();
      this.visibleList = true;
    }
  }



  importRepo(row: any) {
    var repoObject: CreateRepo = {
      name: row.name,
      remoteId: row.id,
      repoUrl: this.repoUrl,
      accessToken: this.accessToken,
      team: this.importRepoForm.value.team,
    }
    row.imported = true;
    this.dashboardService.createRepo(repoObject, 'gitlab').subscribe({
      next: (response) => {
        this.toastStatus = "success"
        this.toastMessage = "Successfully imported repo: " + this.repoUrl
        this.toggleToast();
        this.loadCodeRepos();

      },
      error: (error) => {
        this.toastStatus = "danger"
        this.toastMessage = "Problem during repo import. If it will keep occurring contact system administrator."
        this.toggleToast();
      }
    });
  }

  handleNewTeam(event: any) {
    this.visibleNewTeam = event;
  }


  createNewTeamModal() {
    this.visibleNewTeam = true;
  }


  position = 'top-end';
  visibleToast = false;
  percentage = 0;
  toastMessage: string = ""
  toastStatus: string = ""

  toggleToast() {
    this.visibleToast = !this.visibleToast;
  }
  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }


  onSubmitNewTeam() {
    if (this.newTeamForm.valid) {
      this.teamService.create(this.newTeamForm.value).subscribe({
        next: (response) => {
          this.toastStatus = "success"
          this.toastMessage = "Team created Successfully"
          this.toggleToast();
          this.loadTeams();
        },
        error: (error) => {
          this.toastStatus = "danger"
          this.toastMessage = "Error during team creation, team already exist or You provided empty name."
          this.toggleToast();
        }
      });
      this.closeNewTeamModal();
    }
  }

    importSingleRepoModal() {
      this.visibleSingleRepoModal = true;

    }

  selectRepoType(type: string) {
    this.selectedRepo = type;
  }

  handleImportSingleRepoChange(event: boolean) {
    this.visibleSingleRepoModal = event;
  }

  onSubmitSingleRepo() {
    if (this.importSingleRepoForm.invalid) {
      this.showToast("danger", "Please fill in all required fields correctly.");
      return;
    }

    const { repoUrl, accessToken, team } = this.importSingleRepoForm.value;

    // Set the base API URL based on the repo URL
    this.gitLabService.setApiUrl(repoUrl);

    // Get the project details
    this.gitLabService.getProjectDetailsFromUrl(repoUrl, accessToken).subscribe({
      next: (response) => {
        if (!response || !response.id) {
          this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
          return;
        }
        const strippedRepoUrl = this.getBaseUrl(repoUrl);

        const repoObject: CreateRepo = {
          name: response.name,
          remoteId: response.id,
          repoUrl: strippedRepoUrl,
          accessToken,
          team,
        };

        this.dashboardService.createRepo(repoObject, 'gitlab').subscribe({
          next: () => {
            this.showToast("success", `Successfully imported repo: ${repoUrl}`);
            this.loadCodeRepos();
            this.visibleSingleRepoModal = false;
          },
          error: () => {
            this.showToast("danger", "Problem during repo import. If it will keep occurring contact system administrator.");
          },
        });
      },
      error: () => {
        this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
      }
    });
  }

// Helper method to show toast notifications
  private showToast(status: string, message: string) {
    this.toastStatus = status;
    this.toastMessage = message;
    this.toggleToast();
  }
  // Helper method to get the base URL
  private getBaseUrl(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.port ? `${parsedUrl.protocol}//${parsedUrl.host}` : `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (e) {
      console.error("Invalid URL provided:", e);
      return url;  // Return the original URL if there's an error parsing it
    }
  }


}
