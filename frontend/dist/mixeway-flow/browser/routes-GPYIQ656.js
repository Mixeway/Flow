import {
  VulnerabilitySummaryComponent
} from "./chunk-YJUN7Y32.js";
import {
  RepoService,
  VulnerabilitiesTableComponent
} from "./chunk-POCT43DP.js";
import {
  JiraService
} from "./chunk-45TX6GGP.js";
import {
  MarkdownComponent,
  MarkdownModule,
  provideMarkdown
} from "./chunk-OYEOMEKY.js";
import {
  TeamService
} from "./chunk-DKK4C6S4.js";
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DataTableColumnHeaderDirective,
  DatatableComponent,
  NgxDatatableModule
} from "./chunk-OFWBTEIP.js";
import {
  AuthService
} from "./chunk-YFWDZ3VL.js";
import {
  brand_exports,
  cilArrowRight,
  cilBug,
  cilBurn,
  cilCenterFocus,
  cilChartPie,
  cilCommentSquare,
  cilGraph,
  cilMagnifyingGlass,
  cilTrash,
  cilVolumeOff,
  free_exports
} from "./chunk-YOS6CCYB.js";
import {
  ChartjsComponent
} from "./chunk-7DHYWULE.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-MENGJYBG.js";
import "./chunk-YLFWSDV3.js";
import {
  AccordionButtonDirective,
  AccordionComponent,
  AccordionItemComponent,
  ActivatedRoute,
  AlertComponent,
  BadgeComponent,
  ButtonCloseDirective,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ChangeDetectorRef,
  ColComponent,
  DatePipe,
  EventEmitter,
  FormControlDirective,
  FormLabelDirective,
  IconDirective,
  IconSetService,
  ListGroupDirective,
  ListGroupItemDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalModule,
  ModalTitleDirective,
  NgForOf,
  NgIf,
  ProgressComponent,
  Router,
  RowComponent,
  SpinnerComponent,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TemplateIdDirective,
  ToastBodyComponent,
  ToastComponent,
  ToastHeaderComponent,
  ToasterComponent,
  TooltipDirective,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZG2BHLTP.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/model/FindingSourceStatDTO.ts
var FindingSourceStatDTO = class {
  constructor() {
    this.sast = 0;
    this.iac = 0;
    this.secrets = 0;
    this.sca = 0;
    this.dast = 0;
    this.gitlab = 0;
  }
};

// src/app/views/show-repo/repository-info/repository-info.component.ts
function RepositoryInfoComponent_c_spinner_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 46);
  }
  if (rf & 2) {
    \u0275\u0275property("cTooltip", "Scan in progress");
  }
}
function RepositoryInfoComponent_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 47);
    \u0275\u0275text(1, "Scanning");
    \u0275\u0275elementEnd();
  }
}
function RepositoryInfoComponent_div_11_ul_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ul", 54)(1, "li")(2, "button", 55);
    \u0275\u0275listener("click", function RepositoryInfoComponent_div_11_ul_6_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.runScan());
    });
    \u0275\u0275text(3, " Scan Default Branch ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "li")(5, "button", 55);
    \u0275\u0275listener("click", function RepositoryInfoComponent_div_11_ul_6_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openBranchScanModal());
    });
    \u0275\u0275text(6, " Scan Other Branch ");
    \u0275\u0275elementEnd()()();
  }
}
function RepositoryInfoComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48)(1, "button", 49);
    \u0275\u0275listener("click", function RepositoryInfoComponent_div_11_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.runScan());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 50);
    \u0275\u0275text(3, " Scan ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "button", 51);
    \u0275\u0275listener("click", function RepositoryInfoComponent_div_11_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleScanDropdown());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(5, "svg", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, RepositoryInfoComponent_div_11_ul_6_Template, 7, 0, "ul", 53);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("cTooltip", "Scan default branch");
    \u0275\u0275advance(3);
    \u0275\u0275property("cTooltip", "Choose branch to scan");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.scanDropdownOpen);
  }
}
function RepositoryInfoComponent_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 56);
    \u0275\u0275listener("click", function RepositoryInfoComponent_button_12_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openChangeTeamModal());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 57);
    \u0275\u0275text(2, " Team ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("cTooltip", "Change repository team");
  }
}
function RepositoryInfoComponent_button_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 58);
    \u0275\u0275listener("click", function RepositoryInfoComponent_button_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openRenameModal());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 59);
    \u0275\u0275text(2, " Rename ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("cTooltip", "Rename repository");
  }
}
function RepositoryInfoComponent_button_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 60);
    \u0275\u0275listener("click", function RepositoryInfoComponent_button_14_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.requestDeleteRepo());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 61);
    \u0275\u0275text(2, " Delete ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("cTooltip", "Delete repository");
  }
}
function RepositoryInfoComponent_p_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 62);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" Last scan: AI analyzed ", ctx_r1.repoData.lastAiFpAnalyzedCount, " finding(s), suppressed ", ctx_r1.repoData.lastAiFpSuppressedCount, " as false positives. ");
  }
}
function RepositoryInfoComponent_div_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 63)(1, "div", 64)(2, "span", 65);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 66);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(6, "c-progress", 67);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const lang_r7 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(lang_r7.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", lang_r7.value, "%");
    \u0275\u0275advance();
    \u0275\u0275property("color", lang_r7.color)("value", lang_r7.value);
  }
}
function RepositoryInfoComponent_div_47_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70);
    \u0275\u0275element(1, "div", 71);
    \u0275\u0275elementStart(2, "div", 72);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const label_r8 = ctx.$implicit;
    const i_r9 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", ctx_r1.chartPieData.datasets[0].backgroundColor[i_r9]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(label_r8);
  }
}
function RepositoryInfoComponent_div_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68);
    \u0275\u0275template(1, RepositoryInfoComponent_div_47_div_1_Template, 4, 3, "div", 69);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.chartPieData.labels);
  }
}
function RepositoryInfoComponent_div_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73);
    \u0275\u0275element(1, "c-spinner", 74);
    \u0275\u0275text(2, " Loading branches... ");
    \u0275\u0275elementEnd();
  }
}
function RepositoryInfoComponent_div_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 75);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.branchLoadError, " ");
  }
}
function RepositoryInfoComponent_div_56_option_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 79);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r11 = ctx.$implicit;
    \u0275\u0275property("value", b_r11);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(b_r11);
  }
}
function RepositoryInfoComponent_div_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "label", 40);
    \u0275\u0275text(2, "Branch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 76);
    \u0275\u0275twoWayListener("ngModelChange", function RepositoryInfoComponent_div_56_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedBranch, $event) || (ctx_r1.selectedBranch = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(4, "option", 77);
    \u0275\u0275text(5, "-- Select branch --");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, RepositoryInfoComponent_div_56_option_6_Template, 2, 2, "option", 78);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedBranch);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.availableBranches);
  }
}
function RepositoryInfoComponent_div_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 80);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.renameError);
  }
}
function RepositoryInfoComponent_c_spinner_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 74);
  }
}
var RepositoryInfoComponent = class _RepositoryInfoComponent {
  ngOnInit() {
    this.options = __spreadProps(__spreadValues({}, this.options), {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          bodyFont: {
            size: 13
          },
          padding: 10
        }
      },
      cutout: "60%"
    });
  }
  runScan() {
    this.scanDropdownOpen = false;
    this.runScanEvent.emit();
  }
  toggleScanDropdown() {
    this.scanDropdownOpen = !this.scanDropdownOpen;
  }
  openBranchScanModal() {
    this.scanDropdownOpen = false;
    this.branchScanModalVisible = true;
    this.selectedBranch = "";
    this.branchLoadError = null;
    this.availableBranches = [];
    this.loadingBranches = true;
    const id = this.repoData?.id;
    if (!id)
      return;
    this.codeService.getRemoteBranches(id).subscribe({
      next: (branches) => {
        this.availableBranches = branches;
        this.loadingBranches = false;
      },
      error: () => {
        this.branchLoadError = "Failed to load branches.";
        this.loadingBranches = false;
      }
    });
  }
  confirmBranchScan() {
    if (!this.selectedBranch)
      return;
    this.branchScanModalVisible = false;
    this.runScanBranchEvent.emit(this.selectedBranch);
  }
  constructor(codeService) {
    this.codeService = codeService;
    this.scanRunning = false;
    this.userRole = "USER";
    this.topLanguages = [];
    this.options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          bodyFont: {
            size: 13
          },
          padding: 10
        }
      },
      cutout: "60%"
    };
    this.renameModalVisible = false;
    this.renameSaving = false;
    this.renameError = null;
    this.renameForm = { name: "" };
    this.scanDropdownOpen = false;
    this.branchScanModalVisible = false;
    this.loadingBranches = false;
    this.availableBranches = [];
    this.selectedBranch = "";
    this.branchLoadError = null;
    this.runScanEvent = new EventEmitter();
    this.runScanBranchEvent = new EventEmitter();
    this.openChangeTeamModalEvent = new EventEmitter();
    this.deleteRepoEvent = new EventEmitter();
  }
  openChangeTeamModal() {
    this.openChangeTeamModalEvent.emit();
  }
  openRenameModal() {
    this.renameError = null;
    this.renameForm.name = this.repoData?.name ?? "";
    this.renameModalVisible = true;
  }
  requestDeleteRepo() {
    this.deleteRepoEvent.emit();
  }
  confirmRename() {
    const id = this.repoData?.id;
    if (!id)
      return;
    const trimmed = (this.renameForm.name || "").trim();
    if (!trimmed) {
      this.renameError = "Name cannot be empty.";
      return;
    }
    const ok = /^[\p{L}\p{N} _.\-\/]{1,200}$/u.test(trimmed);
    if (!ok) {
      this.renameError = "Invalid name. Allowed: letters, digits, space, _ . -";
      return;
    }
    this.renameSaving = true;
    this.codeService.rename(id, trimmed).subscribe({
      next: () => {
        if (this.repoData)
          this.repoData.name = trimmed;
        this.renameSaving = false;
        this.renameModalVisible = false;
      },
      error: (err) => {
        this.renameSaving = false;
        this.renameError = err?.error?.message || "Rename failed.";
      }
    });
  }
  static {
    this.\u0275fac = function RepositoryInfoComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RepositoryInfoComponent)(\u0275\u0275directiveInject(RepoService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RepositoryInfoComponent, selectors: [["app-repository-info"]], inputs: { repoData: "repoData", scanRunning: "scanRunning", userRole: "userRole", topLanguages: "topLanguages", chartPieData: "chartPieData", options: "options" }, outputs: { runScanEvent: "runScanEvent", runScanBranchEvent: "runScanBranchEvent", openChangeTeamModalEvent: "openChangeTeamModalEvent", deleteRepoEvent: "deleteRepoEvent" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 80, vars: 33, consts: [[3, "md", "sm"], [1, "mb-4", "h-100", "repository-card"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "d-flex", "align-items-center", "gap-2"], [1, "mb-0", "repo-title"], [1, "scan-status"], ["size", "sm", "class", "scan-spinner", 3, "cTooltip", 4, "ngIf"], ["class", "scan-text ms-2", 4, "ngIf"], [1, "repo-actions"], ["class", "position-relative d-inline-flex", 4, "ngIf"], ["cButton", "", "color", "primary", "variant", "ghost", "size", "sm", 3, "cTooltip", "click", 4, "ngIf"], ["cButton", "", "color", "warning", "variant", "ghost", "size", "sm", 3, "cTooltip", "click", 4, "ngIf"], ["cButton", "", "color", "danger", "variant", "ghost", "size", "sm", 3, "cTooltip", "click", 4, "ngIf"], [1, "d-flex", "flex-column"], ["class", "small text-muted mb-3", 4, "ngIf"], [1, "repo-metadata", "mb-4"], [1, "repo-link", "d-flex", "align-items-center", "mb-3"], ["cIcon", "", "name", "cib-github", 1, "repo-icon", "me-2"], ["target", "_blank", 1, "repo-url", 3, "href"], [1, "repo-details", "d-flex", "flex-wrap", "gap-4"], [1, "detail-item"], [1, "detail-label"], [1, "detail-value"], [1, "language-section", "mt-auto"], [1, "language-title"], [1, "language-grid"], ["class", "language-item", 4, "ngFor", "ngForOf"], [1, "mb-4", "h-100", "vulnerability-card"], [1, "vuln-title", "mb-0"], [1, "chart-container"], ["type", "pie", 1, "vulnerability-chart", 3, "data", "options"], ["class", "chart-legend mt-3", 4, "ngIf"], ["alignment", "center", "size", "sm", 3, "visibleChange", "visible"], ["cModalTitle", ""], ["cButtonClose", "", 3, "click"], ["class", "text-center py-3", 4, "ngIf"], ["class", "text-danger", 4, "ngIf"], [4, "ngIf"], ["cButton", "", "color", "secondary", "variant", "ghost", 3, "click"], ["cButton", "", "color", "info", 3, "click", "disabled"], [1, "form-label"], ["cFormControl", "", "type", "text", "maxlength", "200", 3, "ngModelChange", "ngModel"], [1, "text-muted", "d-block", "mt-2"], ["class", "text-danger mt-2", 4, "ngIf"], ["cButton", "", "color", "warning", 3, "click", "disabled"], ["size", "sm", "class", "me-2", 4, "ngIf"], ["size", "sm", 1, "scan-spinner", 3, "cTooltip"], [1, "scan-text", "ms-2"], [1, "position-relative", "d-inline-flex"], ["cButton", "", "color", "info", "variant", "ghost", "size", "sm", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-media-play", 1, "me-1"], ["cButton", "", "color", "info", "variant", "ghost", "size", "sm", 1, "px-1", "border-start", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-chevron-bottom"], ["class", "dropdown-menu show position-absolute", "style", "top:100%;right:0;z-index:1050;min-width:180px;", 4, "ngIf"], [1, "dropdown-menu", "show", "position-absolute", 2, "top", "100%", "right", "0", "z-index", "1050", "min-width", "180px"], [1, "dropdown-item", 3, "click"], ["cButton", "", "color", "primary", "variant", "ghost", "size", "sm", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-people", 1, "me-1"], ["cButton", "", "color", "warning", "variant", "ghost", "size", "sm", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-pencil", 1, "me-1"], ["cButton", "", "color", "danger", "variant", "ghost", "size", "sm", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-trash", 1, "me-1"], [1, "small", "text-muted", "mb-3"], [1, "language-item"], [1, "d-flex", "justify-content-between", "mb-1"], [1, "language-name"], [1, "language-percent"], ["thin", "", 1, "language-progress", 3, "color", "value"], [1, "chart-legend", "mt-3"], ["class", "legend-item", 4, "ngFor", "ngForOf"], [1, "legend-item"], [1, "legend-color"], [1, "legend-label"], [1, "text-center", "py-3"], ["size", "sm", 1, "me-2"], [1, "text-danger"], [1, "form-select", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "text-danger", "mt-2"]], template: function RepositoryInfoComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-row")(1, "c-col", 0)(2, "c-card", 1)(3, "c-card-header", 2)(4, "div", 3)(5, "h2", 4);
        \u0275\u0275text(6);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "div", 5);
        \u0275\u0275template(8, RepositoryInfoComponent_c_spinner_8_Template, 1, 1, "c-spinner", 6)(9, RepositoryInfoComponent_span_9_Template, 2, 0, "span", 7);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "div", 8);
        \u0275\u0275template(11, RepositoryInfoComponent_div_11_Template, 7, 3, "div", 9)(12, RepositoryInfoComponent_button_12_Template, 3, 1, "button", 10)(13, RepositoryInfoComponent_button_13_Template, 3, 1, "button", 11)(14, RepositoryInfoComponent_button_14_Template, 3, 1, "button", 12);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "c-card-body", 13);
        \u0275\u0275template(16, RepositoryInfoComponent_p_16_Template, 2, 2, "p", 14);
        \u0275\u0275elementStart(17, "div", 15)(18, "div", 16);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(19, "svg", 17);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(20, "a", 18);
        \u0275\u0275text(21);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(22, "div", 19)(23, "div", 20)(24, "div", 21);
        \u0275\u0275text(25, "Default Branch");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "div", 22);
        \u0275\u0275text(27);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(28, "div", 20)(29, "div", 21);
        \u0275\u0275text(30, "Created");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "div", 22);
        \u0275\u0275text(32);
        \u0275\u0275pipe(33, "date");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(34, "div", 23)(35, "h3", 24);
        \u0275\u0275text(36, "Languages");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(37, "div", 25);
        \u0275\u0275template(38, RepositoryInfoComponent_div_38_Template, 7, 4, "div", 26);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(39, "c-col", 0)(40, "c-card", 27)(41, "c-card-header")(42, "h3", 28);
        \u0275\u0275text(43, "Vulnerability Sources");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(44, "c-card-body")(45, "div", 29);
        \u0275\u0275element(46, "c-chart", 30);
        \u0275\u0275elementEnd();
        \u0275\u0275template(47, RepositoryInfoComponent_div_47_Template, 2, 1, "div", 31);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(48, "c-modal", 32);
        \u0275\u0275twoWayListener("visibleChange", function RepositoryInfoComponent_Template_c_modal_visibleChange_48_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.branchScanModalVisible, $event) || (ctx.branchScanModalVisible = $event);
          return $event;
        });
        \u0275\u0275elementStart(49, "c-modal-header")(50, "h5", 33);
        \u0275\u0275text(51, "Select Branch to Scan");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(52, "button", 34);
        \u0275\u0275listener("click", function RepositoryInfoComponent_Template_button_click_52_listener() {
          return ctx.branchScanModalVisible = false;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(53, "c-modal-body");
        \u0275\u0275template(54, RepositoryInfoComponent_div_54_Template, 3, 0, "div", 35)(55, RepositoryInfoComponent_div_55_Template, 2, 1, "div", 36)(56, RepositoryInfoComponent_div_56_Template, 7, 2, "div", 37);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(57, "c-modal-footer")(58, "button", 38);
        \u0275\u0275listener("click", function RepositoryInfoComponent_Template_button_click_58_listener() {
          return ctx.branchScanModalVisible = false;
        });
        \u0275\u0275text(59, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(60, "button", 39);
        \u0275\u0275listener("click", function RepositoryInfoComponent_Template_button_click_60_listener() {
          return ctx.confirmBranchScan();
        });
        \u0275\u0275text(61, " Run Scan ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(62, "c-modal", 32);
        \u0275\u0275twoWayListener("visibleChange", function RepositoryInfoComponent_Template_c_modal_visibleChange_62_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.renameModalVisible, $event) || (ctx.renameModalVisible = $event);
          return $event;
        });
        \u0275\u0275elementStart(63, "c-modal-header")(64, "h5", 33);
        \u0275\u0275text(65, "Rename repository");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(66, "button", 34);
        \u0275\u0275listener("click", function RepositoryInfoComponent_Template_button_click_66_listener() {
          return ctx.renameModalVisible = false;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(67, "c-modal-body")(68, "label", 40);
        \u0275\u0275text(69, "New name");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(70, "input", 41);
        \u0275\u0275twoWayListener("ngModelChange", function RepositoryInfoComponent_Template_input_ngModelChange_70_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.renameForm.name, $event) || (ctx.renameForm.name = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(71, "small", 42);
        \u0275\u0275text(72, " Allowed: letters, digits, space, _ . - / ");
        \u0275\u0275elementEnd();
        \u0275\u0275template(73, RepositoryInfoComponent_div_73_Template, 2, 1, "div", 43);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(74, "c-modal-footer")(75, "button", 38);
        \u0275\u0275listener("click", function RepositoryInfoComponent_Template_button_click_75_listener() {
          return ctx.renameModalVisible = false;
        });
        \u0275\u0275text(76, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(77, "button", 44);
        \u0275\u0275listener("click", function RepositoryInfoComponent_Template_button_click_77_listener() {
          return ctx.confirmRename();
        });
        \u0275\u0275template(78, RepositoryInfoComponent_c_spinner_78_Template, 1, 0, "c-spinner", 45);
        \u0275\u0275text(79, " Save ");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275property("md", 7)("sm", 12);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1(" ", ctx.repoData == null ? null : ctx.repoData.name, " ");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.scanRunning);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.scanRunning);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", !ctx.scanRunning);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.userRole === "ADMIN" || ctx.userRole === "TEAM_MANAGER");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.userRole === "ADMIN" || ctx.userRole === "TEAM_MANAGER");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.userRole === "ADMIN");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", (ctx.repoData == null ? null : ctx.repoData.lastAiFpAnalyzedCount) > 0);
        \u0275\u0275advance(4);
        \u0275\u0275propertyInterpolate("href", ctx.repoData == null ? null : ctx.repoData.repourl, \u0275\u0275sanitizeUrl);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.repoData == null ? null : ctx.repoData.repourl, " ");
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.repoData == null ? null : ctx.repoData.defaultBranch.name);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(33, 30, ctx.repoData == null ? null : ctx.repoData.insertedDate, "mediumDate"));
        \u0275\u0275advance(6);
        \u0275\u0275property("ngForOf", ctx.topLanguages);
        \u0275\u0275advance();
        \u0275\u0275property("md", 5)("sm", 12);
        \u0275\u0275advance(7);
        \u0275\u0275property("data", ctx.chartPieData)("options", ctx.options);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.chartPieData == null ? null : ctx.chartPieData.labels == null ? null : ctx.chartPieData.labels.length);
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("visible", ctx.branchScanModalVisible);
        \u0275\u0275advance(6);
        \u0275\u0275property("ngIf", ctx.loadingBranches);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loadingBranches && ctx.branchLoadError);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loadingBranches && !ctx.branchLoadError);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", !ctx.selectedBranch);
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("visible", ctx.renameModalVisible);
        \u0275\u0275advance(8);
        \u0275\u0275twoWayProperty("ngModel", ctx.renameForm.name);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.renameError);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.renameSaving);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.renameSaving);
      }
    }, dependencies: [
      RowComponent,
      ColComponent,
      CardComponent,
      CardBodyComponent,
      ButtonDirective,
      IconDirective,
      SpinnerComponent,
      ProgressComponent,
      NgIf,
      NgForOf,
      TooltipDirective,
      CardHeaderComponent,
      ChartjsComponent,
      DatePipe,
      ModalComponent,
      ModalHeaderComponent,
      ModalBodyComponent,
      FormControlDirective,
      FormsModule,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      MaxLengthValidator,
      NgModel,
      ButtonCloseDirective,
      ModalTitleDirective,
      ModalFooterComponent
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.repository-card[_ngcontent-%COMP%], \n.vulnerability-card[_ngcontent-%COMP%] {\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n  transition: box-shadow 0.3s ease;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.repository-card[_ngcontent-%COMP%]:hover, \n.vulnerability-card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);\n}\n.repo-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: var(--cui-body-color);\n}\n.scan-status[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n}\n.scan-status[_ngcontent-%COMP%]   .scan-spinner[_ngcontent-%COMP%] {\n  color: var(--cui-info);\n}\n.scan-status[_ngcontent-%COMP%]   .scan-text[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--cui-info);\n}\n.repo-metadata[_ngcontent-%COMP%]   .repo-link[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n}\n.repo-metadata[_ngcontent-%COMP%]   .repo-link[_ngcontent-%COMP%]   .repo-icon[_ngcontent-%COMP%] {\n  color: #333;\n}\n[class*=dark-theme][_nghost-%COMP%]   .repo-metadata[_ngcontent-%COMP%]   .repo-link[_ngcontent-%COMP%]   .repo-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .repo-metadata[_ngcontent-%COMP%]   .repo-link[_ngcontent-%COMP%]   .repo-icon[_ngcontent-%COMP%] {\n  color: #e9ecef;\n}\n.repo-metadata[_ngcontent-%COMP%]   .repo-link[_ngcontent-%COMP%]   .repo-url[_ngcontent-%COMP%] {\n  text-decoration: none;\n  color: var(--cui-primary);\n  word-break: break-all;\n}\n.repo-metadata[_ngcontent-%COMP%]   .repo-link[_ngcontent-%COMP%]   .repo-url[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.repo-metadata[_ngcontent-%COMP%]   .repo-details[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.repo-metadata[_ngcontent-%COMP%]   .repo-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   .detail-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: var(--cui-body-color-rgb);\n  opacity: 0.7;\n  margin-bottom: 0.25rem;\n}\n.repo-metadata[_ngcontent-%COMP%]   .repo-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   .detail-value[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.language-section[_ngcontent-%COMP%]   .language-title[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  margin-bottom: 1rem;\n  color: var(--cui-body-color);\n}\n.language-section[_ngcontent-%COMP%]   .language-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n  gap: 1.25rem;\n}\n.language-section[_ngcontent-%COMP%]   .language-grid[_ngcontent-%COMP%]   .language-item[_ngcontent-%COMP%]   .language-name[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--cui-body-color);\n}\n.language-section[_ngcontent-%COMP%]   .language-grid[_ngcontent-%COMP%]   .language-item[_ngcontent-%COMP%]   .language-percent[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n}\n.language-section[_ngcontent-%COMP%]   .language-grid[_ngcontent-%COMP%]   .language-item[_ngcontent-%COMP%]   .language-progress[_ngcontent-%COMP%] {\n  height: 4px;\n  overflow: hidden;\n  border-radius: 2px;\n}\n.vuln-title[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  color: var(--cui-body-color);\n}\n.chart-container[_ngcontent-%COMP%] {\n  position: relative;\n  height: 180px;\n  margin: 0 auto;\n  max-width: 300px;\n}\n.chart-legend[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n  gap: 0.1rem;\n  margin-top: 1.5rem;\n}\n.chart-legend[_ngcontent-%COMP%]   .legend-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  font-size: 0.8rem;\n  margin-right: 1rem;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.chart-legend[_ngcontent-%COMP%]   .legend-item[_ngcontent-%COMP%]   .legend-color[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  border-radius: 3px;\n  margin-right: 8px;\n  flex-shrink: 0;\n}\n.chart-legend[_ngcontent-%COMP%]   .legend-item[_ngcontent-%COMP%]   .legend-label[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: calc(100% - 20px);\n}\n@media (max-width: 768px) {\n  .repo-actions[_ngcontent-%COMP%] {\n    margin-top: 1rem;\n  }\n  c-card-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start !important;\n  }\n  .language-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n/*# sourceMappingURL=repository-info.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RepositoryInfoComponent, { className: "RepositoryInfoComponent" });
})();

// src/app/views/show-repo/vulnerability-details/vulnerability-details.component.ts
function VulnerabilityDetailsComponent_div_5_ng_container_11__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 32);
  }
}
function VulnerabilityDetailsComponent_div_5_ng_container_11__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 33);
  }
}
function VulnerabilityDetailsComponent_div_5_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "a", 28);
    \u0275\u0275template(2, VulnerabilityDetailsComponent_div_5_ng_container_11__svg_svg_2_Template, 1, 0, "svg", 29)(3, VulnerabilityDetailsComponent_div_5_ng_container_11__svg_svg_3_Template, 1, 0, "svg", 30);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("href", ctx_r0.getRepositoryLink(), \u0275\u0275sanitizeUrl)("title", ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.location);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.source) !== "DAST");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.source) === "DAST");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedLocationText());
  }
}
function VulnerabilityDetailsComponent_div_5_ng_template_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getFormattedLocationText());
  }
}
function VulnerabilityDetailsComponent_div_5_span_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 34);
  }
}
function VulnerabilityDetailsComponent_div_5_span_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 35);
  }
}
function VulnerabilityDetailsComponent_div_5_span_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 36);
  }
}
function VulnerabilityDetailsComponent_div_5_span_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 36);
  }
}
function VulnerabilityDetailsComponent_div_5_c_spinner_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 37);
  }
}
function VulnerabilityDetailsComponent_div_5_span_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function VulnerabilityDetailsComponent_div_5_span_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function VulnerabilityDetailsComponent_div_5_span_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function VulnerabilityDetailsComponent_div_5_span_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function VulnerabilityDetailsComponent_div_5_span_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_badge_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-badge", 50);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.singleVuln.comments.length, " ");
  }
}
function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 51);
    \u0275\u0275element(1, "markdown", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 0);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.description || "No description available at this moment");
  }
}
function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 51);
    \u0275\u0275element(1, "markdown", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 1);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.recommendation || "No recommendation available at this moment");
  }
}
function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 51);
    \u0275\u0275element(1, "markdown", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 2);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.explanation || "No explanation available at this moment");
  }
}
function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 51);
    \u0275\u0275element(1, "markdown", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 3);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.refs || "No references available at this moment");
  }
}
function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_23_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 61);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 62);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "No comments yet. Be the first to comment!");
    \u0275\u0275elementEnd()();
  }
}
function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_23_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 63)(1, "div", 64)(2, "div", 65)(3, "div", 66);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 67)(6, "div", 68)(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "small", 69);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 70);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const comment_r3 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", comment_r3.author.charAt(0).toUpperCase(), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(comment_r3.author);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(11, 4, comment_r3.inserted, "medium"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", comment_r3.message, " ");
  }
}
function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_23_c_spinner_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 71);
  }
}
function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-tab-panel", 51);
    \u0275\u0275template(1, VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_23_div_1_Template, 4, 0, "div", 53);
    \u0275\u0275elementStart(2, "div", 54);
    \u0275\u0275template(3, VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_23_div_3_Template, 14, 7, "div", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 56)(5, "form", 57);
    \u0275\u0275listener("ngSubmit", function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_23_Template_form_ngSubmit_5_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.addComment());
    });
    \u0275\u0275elementStart(6, "input", 58);
    \u0275\u0275twoWayListener("ngModelChange", function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_23_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r0.newComment, $event) || (ctx_r0.newComment = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_23_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onNewCommentChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 59);
    \u0275\u0275template(8, VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_23_c_spinner_8_Template, 1, 0, "c-spinner", 60);
    \u0275\u0275text(9, " Send ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 4);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.comments == null ? null : ctx_r0.singleVuln.comments.length));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.comments);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.newComment);
    \u0275\u0275property("disabled", ctx_r0.isAddingComment);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.newComment.trim() || ctx_r0.isAddingComment);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isAddingComment);
  }
}
function VulnerabilityDetailsComponent_div_5_c_tabs_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tabs", 41)(1, "c-tabs-list", 42)(2, "button", 43);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 44);
    \u0275\u0275text(4, " Description ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "button", 43);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 45);
    \u0275\u0275text(7, " Recommendation ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(8, "button", 43);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(9, "svg", 46);
    \u0275\u0275text(10, " Explanation ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(11, "button", 43);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(12, "svg", 33);
    \u0275\u0275text(13, " References ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(14, "button", 43);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(15, "svg", 47);
    \u0275\u0275text(16, " Comments ");
    \u0275\u0275template(17, VulnerabilityDetailsComponent_div_5_c_tabs_51_c_badge_17_Template, 2, 1, "c-badge", 48);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(18, "c-tabs-content");
    \u0275\u0275template(19, VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_19_Template, 2, 2, "c-tab-panel", 49)(20, VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_20_Template, 2, 2, "c-tab-panel", 49)(21, VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_21_Template, 2, 2, "c-tab-panel", 49)(22, VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_22_Template, 2, 2, "c-tab-panel", 49)(23, VulnerabilityDetailsComponent_div_5_c_tabs_51_c_tab_panel_23_Template, 10, 7, "c-tab-panel", 49);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("activeItemKey", 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("itemKey", 0);
    \u0275\u0275advance(3);
    \u0275\u0275property("itemKey", 1);
    \u0275\u0275advance(3);
    \u0275\u0275property("itemKey", 2);
    \u0275\u0275advance(3);
    \u0275\u0275property("itemKey", 3);
    \u0275\u0275advance(3);
    \u0275\u0275property("itemKey", 4);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.comments == null ? null : ctx_r0.singleVuln.comments.length);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.singleVuln);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.singleVuln);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.singleVuln);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.singleVuln);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.singleVuln);
  }
}
function VulnerabilityDetailsComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "c-row")(2, "c-col", 8)(3, "c-card", 9)(4, "c-card-header")(5, "h6", 10);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "c-card-body")(8, "div", 11)(9, "span", 12);
    \u0275\u0275text(10, "Location:");
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, VulnerabilityDetailsComponent_div_5_ng_container_11_Template, 7, 5, "ng-container", 13)(12, VulnerabilityDetailsComponent_div_5_ng_template_12_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "c-card-footer")(15, "div", 14)(16, "span", 15);
    \u0275\u0275text(17, "Status:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 14);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(19, "svg", 16);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(22, "c-col", 8)(23, "c-card", 9)(24, "c-card-header")(25, "div", 17);
    \u0275\u0275template(26, VulnerabilityDetailsComponent_div_5_span_26_Template, 1, 0, "span", 18)(27, VulnerabilityDetailsComponent_div_5_span_27_Template, 1, 0, "span", 19)(28, VulnerabilityDetailsComponent_div_5_span_28_Template, 1, 0, "span", 20)(29, VulnerabilityDetailsComponent_div_5_span_29_Template, 1, 0, "span", 20)(30, VulnerabilityDetailsComponent_div_5_c_spinner_30_Template, 1, 0, "c-spinner", 21)(31, VulnerabilityDetailsComponent_div_5_span_31_Template, 2, 1, "span", 22)(32, VulnerabilityDetailsComponent_div_5_span_32_Template, 2, 1, "span", 22)(33, VulnerabilityDetailsComponent_div_5_span_33_Template, 2, 1, "span", 23)(34, VulnerabilityDetailsComponent_div_5_span_34_Template, 2, 1, "span", 24)(35, VulnerabilityDetailsComponent_div_5_span_35_Template, 2, 1, "span", 24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "c-card-body")(37, "div", 25)(38, "span", 15);
    \u0275\u0275text(39, "Detected:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "span");
    \u0275\u0275text(41);
    \u0275\u0275pipe(42, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "div")(44, "span", 15);
    \u0275\u0275text(45, "Last Seen:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "span");
    \u0275\u0275text(47);
    \u0275\u0275pipe(48, "date");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(49, "c-row")(50, "c-col", 26);
    \u0275\u0275template(51, VulnerabilityDetailsComponent_div_5_c_tabs_51_Template, 24, 12, "c-tabs", 27);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const plainTextLocation_r4 = \u0275\u0275reference(13);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("xs", 8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.name);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.isLinkableSource(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.source))("ngIfElse", plainTextLocation_r4);
    \u0275\u0275advance(8);
    \u0275\u0275property("name", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.status) === "NEW" ? "cil-burn" : (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.status) === "EXISTING" ? "cil-graph" : (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.status) === "REMOVED" ? "cil-trash" : "cil-volume-off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.status);
    \u0275\u0275advance();
    \u0275\u0275property("xs", 4);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) === "HIGH");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) === "MEDIUM");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) === "LOW");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) === "INFO");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) === "CRITICAL");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) === "HIGH");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) === "CRITICAL");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) === "MEDIUM");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) === "LOW");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) === "INFO");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(42, 20, ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.inserted));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(48, 22, ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.last_seen));
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.singleVuln);
  }
}
function VulnerabilityDetailsComponent_form_9_option_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 79);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const reason_r6 = ctx.$implicit;
    \u0275\u0275property("value", reason_r6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(reason_r6);
  }
}
function VulnerabilityDetailsComponent_form_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 72);
    \u0275\u0275listener("ngSubmit", function VulnerabilityDetailsComponent_form_9_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.suppressFinding());
    });
    \u0275\u0275elementStart(1, "label", 73);
    \u0275\u0275text(2, "Suppress finding: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 74);
    \u0275\u0275twoWayListener("ngModelChange", function VulnerabilityDetailsComponent_form_9_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.suppressReason, $event) || (ctx_r0.suppressReason = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(4, "option", 75);
    \u0275\u0275text(5, "Select a reason");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, VulnerabilityDetailsComponent_form_9_option_6_Template, 2, 2, "option", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 77);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(8, "svg", 78);
    \u0275\u0275text(9, " Suppress ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.suppressReason);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r0.suppressReasons);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.suppressReason);
  }
}
function VulnerabilityDetailsComponent_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 80);
    \u0275\u0275listener("click", function VulnerabilityDetailsComponent_button_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.reactivateFinding());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 81);
    \u0275\u0275text(2, " Re-Activate Finding ");
    \u0275\u0275elementEnd();
  }
}
var VulnerabilityDetailsComponent = class _VulnerabilityDetailsComponent {
  constructor(repoService) {
    this.repoService = repoService;
    this.detailsModal = false;
    this.selectedRowId = null;
    this.suppressReason = "";
    this.suppressReasons = [];
    this.selectedBranch = null;
    this.isAddingComment = false;
    this.newComment = "";
    this.repoId = "";
    this.handleDetailsModalEvent = new EventEmitter();
    this.closeModalEvent = new EventEmitter();
    this.suppressFindingEvent = new EventEmitter();
    this.reactivateFindingEvent = new EventEmitter();
    this.addCommentEvent = new EventEmitter();
    this.newCommentChange = new EventEmitter();
    this.suppressed = new EventEmitter();
  }
  /**
   * Handle modal visibility changes
   */
  handleDetailsModal(visible) {
    this.handleDetailsModalEvent.emit(visible);
  }
  /**
   * Close the modal
   */
  closeModal() {
    this.closeModalEvent.emit();
  }
  /**
   * Suppress the finding with the selected reason
   */
  suppressFinding() {
    if (this.selectedRowId && this.suppressReason) {
      this.repoService.supressFinding(+this.repoId, this.selectedRowId, this.suppressReason).subscribe({
        next: (response) => {
          this.suppressed.emit();
          this.closeModal();
        },
        error: (error) => {
          console.error("Error suppressing finding:", error);
        }
      });
    }
  }
  /**
   * Reactivate a suppressed finding
   */
  reactivateFinding() {
    this.reactivateFindingEvent.emit();
  }
  /**
   * Add a new comment
   */
  addComment() {
    this.addCommentEvent.emit();
  }
  /**
   * Handle comment input changes
   */
  onNewCommentChange(value) {
    this.newComment = value;
    this.newCommentChange.emit(value);
  }
  /**
   * Checks if the vulnerability source type should have a clickable link.
   * @param source The vulnerability source (e.g., 'SAST', 'SCA').
   */
  isLinkableSource(source) {
    const linkableSources = ["SAST", "IAC", "DAST"];
    return linkableSources.includes(source);
  }
  /**
   * Get link to the vulnerability in the repository
   */
  getRepositoryLink() {
    const finding = this.singleVuln?.vulnsResponseDto;
    if (!finding?.location) {
      return "#";
    }
    if (finding.source === "DAST") {
      return finding.location.startsWith("http") ? finding.location : `//${finding.location}`;
    }
    if (!this.repoData?.repourl || !this.repoData?.type) {
      return "#";
    }
    const location = finding.location;
    const repoUrl = this.repoData.repourl;
    const repoType = this.repoData.type.toUpperCase();
    const branch = this.selectedBranch || this.repoData?.defaultBranch?.name;
    const match = location.match(/(.*):(\d+)/);
    if (!match) {
      return repoUrl;
    }
    const [, filePath, lineNumber] = match;
    const baseUrl = repoUrl.replace(/\/$/, "");
    if (repoType === "GITHUB") {
      return `${baseUrl}/blob/${branch}/${filePath}#L${lineNumber}`;
    } else if (repoType === "GITLAB") {
      return `${baseUrl}/-/blob/${branch}/${filePath}#L${lineNumber}`;
    }
    return repoUrl;
  }
  /**
   * NEW: Gets the display text for the vulnerability location, shortening it if necessary.
   * This function returns ONLY the text string to be displayed.
   */
  getFormattedLocationText() {
    const finding = this.singleVuln?.vulnsResponseDto;
    if (!finding?.location) {
      return "Location not available";
    }
    return finding.location;
  }
  /**
   * Format the vulnerability location for display.
   * For SAST, SECRETS, and IAC, it returns an HTML anchor tag.
   * Note: You must use [innerHTML] in your template to render this link.
   */
  getFormattedLocation() {
    const finding = this.singleVuln?.vulnsResponseDto;
    if (!finding?.location) {
      return "Location not available";
    }
    if (["SAST", "IAC"].includes(finding.source)) {
      const repoLink = this.getRepositoryLink();
      const location = finding.location;
      return `<a href="${repoLink}" target="_blank" rel="noopener noreferrer">${location}</a>`;
    }
    if (["DAST", "SCA", "GITLAB_SCANNER", "SECRETS"].includes(finding.source)) {
      return finding.location;
    }
    return finding.location;
  }
  static {
    this.\u0275fac = function VulnerabilityDetailsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _VulnerabilityDetailsComponent)(\u0275\u0275directiveInject(RepoService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VulnerabilityDetailsComponent, selectors: [["app-vulnerability-details"]], inputs: { detailsModal: "detailsModal", selectedRowId: "selectedRowId", singleVuln: "singleVuln", suppressReason: "suppressReason", suppressReasons: "suppressReasons", repoData: "repoData", selectedBranch: "selectedBranch", isAddingComment: "isAddingComment", newComment: "newComment", repoId: "repoId" }, outputs: { handleDetailsModalEvent: "handleDetailsModalEvent", closeModalEvent: "closeModalEvent", suppressFindingEvent: "suppressFindingEvent", reactivateFindingEvent: "reactivateFindingEvent", addCommentEvent: "addCommentEvent", newCommentChange: "newCommentChange", suppressed: "suppressed" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 13, vars: 4, consts: [["plainTextLocation", ""], ["size", "lg", "id", "detailsModal", "alignment", "center", 3, "visibleChange", "visible"], ["cModalTitle", ""], [4, "ngIf"], [1, "w-100", "d-flex", "justify-content-between", "align-items-center"], ["class", "d-flex align-items-center", 3, "ngSubmit", 4, "ngIf"], ["cButton", "", "color", "success", 3, "click", 4, "ngIf"], ["cButton", "", "color", "secondary", 3, "click"], [3, "xs"], [1, "mb-4"], [1, "mb-0"], [1, "d-flex", "align-items-center", "location-container"], [1, "fw-bold", "me-2", "flex-shrink-0"], [4, "ngIf", "ngIfElse"], [1, "d-flex", "align-items-center"], [1, "fw-bold", "me-2"], ["cIcon", "", 1, "me-2", 3, "name"], [1, "d-flex", "align-items-center", "justify-content-center"], ["class", "dot high", 4, "ngIf"], ["class", "dot medium", 4, "ngIf"], ["class", "dot low", 4, "ngIf"], ["color", "danger", "variant", "grow", "size", "sm", 4, "ngIf"], ["class", "high-t ms-2", 4, "ngIf"], ["class", "medium-t ms-2", 4, "ngIf"], ["class", "low-t ms-2", 4, "ngIf"], [1, "mb-2"], ["xs", "12"], [3, "activeItemKey", 4, "ngIf"], ["target", "_blank", "rel", "noopener noreferrer", 1, "text-primary", "d-flex", "align-items-center", 3, "href", "title"], ["cIcon", "", "name", "cib-git", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cil-link", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cil-external-link", "size", "sm", 1, "ms-1"], ["cIcon", "", "name", "cib-git", 1, "me-2"], ["cIcon", "", "name", "cil-link", 1, "me-2"], [1, "dot", "high"], [1, "dot", "medium"], [1, "dot", "low"], ["color", "danger", "variant", "grow", "size", "sm"], [1, "high-t", "ms-2"], [1, "medium-t", "ms-2"], [1, "low-t", "ms-2"], [3, "activeItemKey"], ["variant", "underline-border"], ["cTab", "", 3, "itemKey"], ["cIcon", "", "name", "cil-notes", 1, "me-2"], ["cIcon", "", "name", "cil-lightbulb", 1, "me-2"], ["cIcon", "", "name", "cil-description", 1, "me-2"], ["cIcon", "", "name", "cil-comment-square", 1, "me-2"], ["color", "info", "class", "ms-1", 4, "ngIf"], ["class", "p-3", 3, "itemKey", 4, "ngIf"], ["color", "info", 1, "ms-1"], [1, "p-3", 3, "itemKey"], [3, "data"], ["class", "text-center text-muted my-4", 4, "ngIf"], [1, "comments-container"], ["class", "comment-item mb-3 pb-3 border-bottom", 4, "ngFor", "ngForOf"], [1, "mt-3"], [1, "d-flex", 3, "ngSubmit"], ["type", "text", "name", "newComment", "placeholder", "Type your comment...", "required", "", 1, "form-control", "me-2", 3, "ngModelChange", "ngModel", "disabled"], ["cButton", "", "color", "primary", "type", "submit", 3, "disabled"], ["size", "sm", "class", "me-1", 4, "ngIf"], [1, "text-center", "text-muted", "my-4"], ["cIcon", "", "name", "cil-comment-square", "width", "32", "height", "32", 1, "mb-2", "text-muted"], [1, "comment-item", "mb-3", "pb-3", "border-bottom"], [1, "d-flex"], [1, "comment-avatar"], [1, "rounded-circle", "bg-light", "d-flex", "align-items-center", "justify-content-center", 2, "width", "40px", "height", "40px"], [1, "ms-3", "flex-grow-1"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "text-muted"], [1, "comment-content", "mt-1", "p-2", "bg-light", "rounded"], ["size", "sm", 1, "me-1"], [1, "d-flex", "align-items-center", 3, "ngSubmit"], ["for", "suppressReason", 1, "me-2"], ["id", "suppressReason", "name", "suppressReason", "required", "", 1, "form-select", "me-2", 3, "ngModelChange", "ngModel"], ["value", "", "disabled", "", "selected", ""], [3, "value", 4, "ngFor", "ngForOf"], ["type", "submit", "cButton", "", "color", "warning", 3, "disabled"], ["cIcon", "", "name", "cil-volume-off", 1, "me-1"], [3, "value"], ["cButton", "", "color", "success", 3, "click"], ["cIcon", "", "name", "cil-volume-high", 1, "me-1"]], template: function VulnerabilityDetailsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-modal", 1);
        \u0275\u0275listener("visibleChange", function VulnerabilityDetailsComponent_Template_c_modal_visibleChange_0_listener($event) {
          return ctx.handleDetailsModal($event);
        });
        \u0275\u0275elementStart(1, "c-modal-header")(2, "h5", 2);
        \u0275\u0275text(3, "Vulnerability Details");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(4, "c-modal-body");
        \u0275\u0275template(5, VulnerabilityDetailsComponent_div_5_Template, 52, 24, "div", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "c-modal-footer")(7, "div", 4)(8, "div");
        \u0275\u0275template(9, VulnerabilityDetailsComponent_form_9_Template, 10, 3, "form", 5)(10, VulnerabilityDetailsComponent_button_10_Template, 3, 0, "button", 6);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "button", 7);
        \u0275\u0275listener("click", function VulnerabilityDetailsComponent_Template_button_click_11_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(12, "Close");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275property("visible", ctx.detailsModal);
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ctx.selectedRowId !== null);
        \u0275\u0275advance(4);
        \u0275\u0275property("ngIf", (ctx.singleVuln == null ? null : ctx.singleVuln.vulnsResponseDto == null ? null : ctx.singleVuln.vulnsResponseDto.status) != "SUPRESSED");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", (ctx.singleVuln == null ? null : ctx.singleVuln.vulnsResponseDto == null ? null : ctx.singleVuln.vulnsResponseDto.status) == "SUPRESSED");
      }
    }, dependencies: [
      ModalModule,
      ModalBodyComponent,
      ModalComponent,
      ModalFooterComponent,
      ModalHeaderComponent,
      ModalTitleDirective,
      NgIf,
      NgForOf,
      RowComponent,
      ColComponent,
      CardComponent,
      CardHeaderComponent,
      CardBodyComponent,
      CardFooterComponent,
      ButtonDirective,
      IconDirective,
      TabsComponent,
      TabsListComponent,
      TabsContentComponent,
      TabPanelComponent,
      TabDirective,
      SpinnerComponent,
      BadgeComponent,
      FormsModule,
      \u0275NgNoValidate,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      RequiredValidator,
      NgModel,
      NgForm,
      DatePipe,
      MarkdownModule,
      MarkdownComponent
    ], styles: ["\n\n.dot[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  display: inline-block;\n}\n.critical[_ngcontent-%COMP%] {\n  background-color: red;\n}\n.high[_ngcontent-%COMP%] {\n  background-color: #f33d3d;\n}\n.medium[_ngcontent-%COMP%] {\n  background-color: #e38334;\n}\n.low[_ngcontent-%COMP%] {\n  background-color: #47a3d3;\n}\n.critical-t[_ngcontent-%COMP%] {\n  color: red;\n}\n.high-t[_ngcontent-%COMP%] {\n  color: #f33d3d;\n}\n.medium-t[_ngcontent-%COMP%] {\n  color: #e38334;\n}\n.low-t[_ngcontent-%COMP%] {\n  color: #47a3d3;\n}\n.comments-container[_ngcontent-%COMP%] {\n  max-height: 350px;\n  overflow-y: auto;\n  margin-bottom: 1rem;\n}\n.comments-container[_ngcontent-%COMP%]   .comment-item[_ngcontent-%COMP%]:last-child {\n  border-bottom: none !important;\n  margin-bottom: 0;\n  padding-bottom: 0;\n}\n.comments-container[_ngcontent-%COMP%]   .comment-item[_ngcontent-%COMP%]   .comment-content[_ngcontent-%COMP%] {\n  background-color: var(--cui-tertiary-bg);\n  border-radius: 0.5rem;\n}\n.location-container[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.location-container[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n.location-container[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  word-break: break-all;\n  overflow-wrap: break-word;\n}\n[_nghost-%COMP%]     .markdown-body code {\n  background-color: var(--cui-tertiary-bg);\n  padding: 0.2rem 0.4rem;\n  border-radius: 3px;\n  font-size: 0.875em;\n}\n[_nghost-%COMP%]     .markdown-body pre {\n  background-color: var(--cui-tertiary-bg);\n  padding: 1rem;\n  border-radius: 5px;\n  overflow-x: auto;\n}\n[_nghost-%COMP%]     .nav-underline-border {\n  border-bottom: 1px solid var(--cui-border-color);\n}\n[_nghost-%COMP%]     .nav-underline-border .nav-link.active {\n  font-weight: 600;\n}\n/*# sourceMappingURL=vulnerability-details.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VulnerabilityDetailsComponent, { className: "VulnerabilityDetailsComponent" });
})();

// src/app/views/show-repo/show-repo.component.ts
var _c0 = () => ({ prop: "insertedDate", dir: "desc" });
var _c1 = (a0) => [a0];
function ShowRepoComponent_div_91_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 94);
    \u0275\u0275element(1, "c-spinner", 95);
    \u0275\u0275elementStart(2, "span", 96);
    \u0275\u0275text(3, "Loading scan history...");
    \u0275\u0275elementEnd()();
  }
}
function ShowRepoComponent_div_92_ng_template_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 111);
    \u0275\u0275text(1, "Branch");
    \u0275\u0275elementEnd();
  }
}
function ShowRepoComponent_div_92_ng_template_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 112);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 113);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "span", 114);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r3 = ctx.row;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(row_r3 == null ? null : row_r3.codeRepoBranch == null ? null : row_r3.codeRepoBranch.name);
  }
}
function ShowRepoComponent_div_92_ng_template_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 111);
    \u0275\u0275text(1, "Commit ID");
    \u0275\u0275elementEnd();
  }
}
function ShowRepoComponent_div_92_ng_template_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 115)(1, "code", 116);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r4 = ctx.row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r4.commitId);
  }
}
function ShowRepoComponent_div_92_ng_template_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 111);
    \u0275\u0275text(1, "Scan Date");
    \u0275\u0275elementEnd();
  }
}
function ShowRepoComponent_div_92_ng_template_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 117);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 118);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "span", 119);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r5 = ctx.row;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 1, row_r5.insertedDate, "medium"));
  }
}
function ShowRepoComponent_div_92_ng_template_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 120)(1, "span", 111);
    \u0275\u0275text(2, "Results");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 121)(4, "span", 122);
    \u0275\u0275text(5, "C");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 123);
    \u0275\u0275text(7, "H");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 124);
    \u0275\u0275text(9, "M");
    \u0275\u0275elementEnd()()();
  }
}
function ShowRepoComponent_div_92_ng_template_34_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "c-badge", 126);
    \u0275\u0275text(2, " SCAN NOT PERFORMED ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("cTooltip", "Scan requested while previous was running or was run too early (limit: 1 scan per 10 minutes)");
  }
}
function ShowRepoComponent_div_92_ng_template_34_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 127)(1, "div", 128)(2, "span", 129);
    \u0275\u0275text(3, "SAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 130);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 130);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 130);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 128)(11, "span", 129);
    \u0275\u0275text(12, "SCA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 130);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 130);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 130);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 128)(20, "span", 129);
    \u0275\u0275text(21, "IaC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 130);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 130);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 130);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 128)(29, "span", 129);
    \u0275\u0275text(30, "Secrets");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span", 130);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 130);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span", 130);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 128)(38, "span", 129);
    \u0275\u0275text(39, "GitLab");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "span", 130);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "span", 130);
    \u0275\u0275text(43);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "span", 130);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 128)(47, "span", 129);
    \u0275\u0275text(48, "DAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "span", 130);
    \u0275\u0275text(50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "span", 130);
    \u0275\u0275text(52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "span", 130);
    \u0275\u0275text(54);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const row_r6 = \u0275\u0275nextContext().row;
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r6.sastCritical > 0)("zero", !row_r6.sastCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.sastCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r6.sastHigh > 0)("zero", !row_r6.sastHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.sastHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r6.sastMedium > 0)("zero", !row_r6.sastMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.sastMedium || 0);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r6.scaCritical > 0)("zero", !row_r6.scaCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.scaCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r6.scaHigh > 0)("zero", !row_r6.scaHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.scaHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r6.scaMedium > 0)("zero", !row_r6.scaMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.scaMedium || 0);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r6.iacCritical > 0)("zero", !row_r6.iacCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.iacCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r6.iacHigh > 0)("zero", !row_r6.iacHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.iacHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r6.iacMedium > 0)("zero", !row_r6.iacMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.iacMedium || 0);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r6.secretsCritical > 0)("zero", !row_r6.secretsCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.secretsCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r6.secretsHigh > 0)("zero", !row_r6.secretsHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.secretsHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r6.secretsMedium > 0)("zero", !row_r6.secretsMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.secretsMedium || 0);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r6.gitlabCritical > 0)("zero", !row_r6.gitlabCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.gitlabCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r6.gitlabHigh > 0)("zero", !row_r6.gitlabHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.gitlabHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r6.gitlabMedium > 0)("zero", !row_r6.gitlabMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.gitlabMedium || 0);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r6.dastCritical > 0)("zero", !row_r6.dastCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.dastCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r6.dastHigh > 0)("zero", !row_r6.dastHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.dastHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r6.dastMedium > 0)("zero", !row_r6.dastMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r6.dastMedium || 0);
  }
}
function ShowRepoComponent_div_92_ng_template_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ShowRepoComponent_div_92_ng_template_34_ng_container_0_Template, 3, 1, "ng-container", 125)(1, ShowRepoComponent_div_92_ng_template_34_ng_template_1_Template, 55, 90, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    const row_r6 = ctx.row;
    const normalResults_r7 = \u0275\u0275reference(2);
    \u0275\u0275property("ngIf", (row_r6 == null ? null : row_r6.sastCritical) === -1 || (row_r6 == null ? null : row_r6.sastHigh) === -1 || (row_r6 == null ? null : row_r6.sastMedium) === -1 || (row_r6 == null ? null : row_r6.scaCritical) === -1 || (row_r6 == null ? null : row_r6.scaHigh) === -1 || (row_r6 == null ? null : row_r6.scaMedium) === -1 || (row_r6 == null ? null : row_r6.iacCritical) === -1 || (row_r6 == null ? null : row_r6.iacHigh) === -1 || (row_r6 == null ? null : row_r6.iacMedium) === -1 || (row_r6 == null ? null : row_r6.secretsCritical) === -1 || (row_r6 == null ? null : row_r6.secretsHigh) === -1 || (row_r6 == null ? null : row_r6.secretsMedium) === -1)("ngIfElse", normalResults_r7);
  }
}
function ShowRepoComponent_div_92_div_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 131);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 132);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "h5");
    \u0275\u0275text(3, "No scan history found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "No scans match your search criteria or no scans have been performed yet.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 133);
    \u0275\u0275listener("click", function ShowRepoComponent_div_92_div_35_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateScanInfoFilter({ target: { value: "" } }));
    });
    \u0275\u0275text(7, "Clear search ");
    \u0275\u0275elementEnd()();
  }
}
function ShowRepoComponent_div_92_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 97)(1, "div", 98)(2, "div", 99)(3, "div", 54)(4, "span", 55);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(5, "svg", 100);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(6, "input", 101);
    \u0275\u0275listener("input", function ShowRepoComponent_div_92_Template_input_input_6_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateScanInfoFilter($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 102)(8, "label", 103);
    \u0275\u0275text(9, "Show");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "select", 64);
    \u0275\u0275twoWayListener("ngModelChange", function ShowRepoComponent_div_92_Template_select_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.scanInfoLimit, $event) || (ctx_r1.scanInfoLimit = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(11, "option", 65);
    \u0275\u0275text(12, "10");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "option", 65);
    \u0275\u0275text(14, "20");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 65);
    \u0275\u0275text(16, "50");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "option", 65);
    \u0275\u0275text(18, "100");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "option", 65);
    \u0275\u0275text(20, "200");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(21, "div", 104)(22, "ngx-datatable", 105)(23, "ngx-datatable-column", 106);
    \u0275\u0275template(24, ShowRepoComponent_div_92_ng_template_24_Template, 2, 0, "ng-template", 107)(25, ShowRepoComponent_div_92_ng_template_25_Template, 4, 1, "ng-template", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "ngx-datatable-column", 108);
    \u0275\u0275template(27, ShowRepoComponent_div_92_ng_template_27_Template, 2, 0, "ng-template", 107)(28, ShowRepoComponent_div_92_ng_template_28_Template, 3, 1, "ng-template", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "ngx-datatable-column", 109);
    \u0275\u0275template(30, ShowRepoComponent_div_92_ng_template_30_Template, 2, 0, "ng-template", 107)(31, ShowRepoComponent_div_92_ng_template_31_Template, 5, 4, "ng-template", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "ngx-datatable-column", 110);
    \u0275\u0275template(33, ShowRepoComponent_div_92_ng_template_33_Template, 10, 0, "ng-template", 107)(34, ShowRepoComponent_div_92_ng_template_34_Template, 3, 2, "ng-template", 69);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(35, ShowRepoComponent_div_92_div_35_Template, 8, 0, "div", 72);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.scanInfoLimit);
    \u0275\u0275advance();
    \u0275\u0275property("value", 10);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 20);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 50);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 100);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 200);
    \u0275\u0275advance(3);
    \u0275\u0275property("rows", ctx_r1.scanInfosFiltered)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", ctx_r1.scanInfoLimit)("sorts", \u0275\u0275pureFunction1(19, _c1, \u0275\u0275pureFunction0(18, _c0)));
    \u0275\u0275advance();
    \u0275\u0275property("width", 150);
    \u0275\u0275advance(3);
    \u0275\u0275property("width", 220);
    \u0275\u0275advance(3);
    \u0275\u0275property("width", 170);
    \u0275\u0275advance(3);
    \u0275\u0275property("width", 320);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.scanInfosFiltered.length === 0);
  }
}
function ShowRepoComponent_ng_container_95_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 137);
    \u0275\u0275listener("click", function ShowRepoComponent_ng_container_95_ng_template_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const i_r10 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleAccordion(i_r10));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r10 = \u0275\u0275nextContext();
    const group_r12 = ctx_r10.$implicit;
    const i_r10 = ctx_r10.index;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("collapsed", !ctx_r1.isAccordionVisible[i_r10]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", group_r12.categoryGroup, " ");
  }
}
function ShowRepoComponent_ng_container_95_ng_template_3_c_card_1_li_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 142)(1, "c-badge", 143);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " : ");
    \u0275\u0275elementStart(4, "c-badge", 143);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const locationKey_r13 = ctx.$implicit;
    const appDataType_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(locationKey_r13);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", appDataType_r14 == null ? null : appDataType_r14.location == null ? null : appDataType_r14.location[locationKey_r13], " ");
  }
}
function ShowRepoComponent_ng_container_95_ng_template_3_c_card_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-card", 81)(1, "c-card-header")(2, "c-badge", 95);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "c-card-body")(5, "ul", 140);
    \u0275\u0275template(6, ShowRepoComponent_ng_container_95_ng_template_3_c_card_1_li_6_Template, 6, 2, "li", 141);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const appDataType_r14 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", appDataType_r14.categoryName, " - ", appDataType_r14.name, " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.getKeys(appDataType_r14.location));
  }
}
function ShowRepoComponent_ng_container_95_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 138);
    \u0275\u0275template(1, ShowRepoComponent_ng_container_95_ng_template_3_c_card_1_Template, 7, 3, "c-card", 139);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r12 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", group_r12.appDataTypes);
  }
}
function ShowRepoComponent_ng_container_95_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "c-accordion-item", 134);
    \u0275\u0275template(2, ShowRepoComponent_ng_container_95_ng_template_2_Template, 2, 2, "ng-template", 135)(3, ShowRepoComponent_ng_container_95_ng_template_3_Template, 2, 1, "ng-template", 136);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const i_r10 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("visible", ctx_r1.isAccordionVisible[i_r10]);
  }
}
function ShowRepoComponent_div_132_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 144)(1, "span", 145);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.filteredComponents.length, " components");
  }
}
function ShowRepoComponent_ng_template_150_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 146);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r15 = ctx.row;
    \u0275\u0275property("cTooltip", row_r15 == null ? null : row_r15.groupid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r15 == null ? null : row_r15.groupid, " ");
  }
}
function ShowRepoComponent_ng_template_152_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 147)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r16 = ctx.row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r16 == null ? null : row_r16.name);
  }
}
function ShowRepoComponent_ng_template_154_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 148)(1, "c-badge", 149);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r17 = ctx.row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r17 == null ? null : row_r17.version);
  }
}
function ShowRepoComponent_div_155_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 131);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 150);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "h5");
    \u0275\u0275text(3, "No components found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "No components match your filter criteria.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 133);
    \u0275\u0275listener("click", function ShowRepoComponent_div_155_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearComponentFilters());
    });
    \u0275\u0275text(7, "Clear filters ");
    \u0275\u0275elementEnd()();
  }
}
function ShowRepoComponent_option_187_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 84);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r19 = ctx.$implicit;
    \u0275\u0275property("ngValue", team_r19.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", team_r19.name, " ");
  }
}
var ShowRepoComponent = class _ShowRepoComponent {
  constructor(iconSet, repoService, authService, router, route, cdr, datePipe, teamService, jiraService) {
    this.iconSet = iconSet;
    this.repoService = repoService;
    this.authService = authService;
    this.router = router;
    this.route = route;
    this.cdr = cdr;
    this.datePipe = datePipe;
    this.teamService = teamService;
    this.jiraService = jiraService;
    this.repoId = "";
    this.icons = {
      cilChartPie,
      cilArrowRight,
      cilBug,
      cilCenterFocus,
      cilCommentSquare,
      cilBurn,
      cilGraph,
      cilTrash,
      cilVolumeOff,
      cilMagnifyingGlass
    };
    this.sourceStats = new FindingSourceStatDTO();
    this.topLanguages = [];
    this.suppressReason = "";
    this.suppressReasons = ["WONT_FIX", "FALSE_POSITIVE", "ACCEPTED"];
    this.isAccordionVisible = [];
    this.codeRepoFindingStats = [];
    this.filtersNew = {
      group: "",
      name: "",
      version: ""
    };
    this.scanRunning = false;
    this.userRole = "USER";
    this.filteredComponents = [];
    this.scanInfos = [];
    this.scanInfosFiltered = [];
    this.options = {
      maintainAspectRatio: false
    };
    this.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    this.options2 = {
      responsive: true,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    };
    this.chartLineData = {
      labels: [],
      datasets: [
        {
          label: "SAST",
          backgroundColor: "rgba(220, 220, 220, 0.2)",
          borderColor: "rgba(220, 220, 220, 1)",
          pointBackgroundColor: "rgba(220, 220, 220, 1)",
          pointBorderColor: "#fff",
          data: []
        },
        {
          label: "IaC",
          backgroundColor: "rgba(151, 187, 205, 0.2)",
          borderColor: "rgb(71, 180, 234)",
          pointBackgroundColor: "rgb(71, 163, 211)",
          pointBorderColor: "#bd7777",
          data: []
        },
        {
          label: "Secrets",
          backgroundColor: "rgba(151, 187, 205, 0.2)",
          borderColor: "rgb(28, 197, 45)",
          pointBackgroundColor: "rgb(102, 190, 107)",
          pointBorderColor: "#bd7777",
          data: []
        },
        {
          label: "SCA",
          backgroundColor: "rgba(151, 187, 205, 0.2)",
          borderColor: "rgb(210, 124, 56)",
          pointBackgroundColor: "rgb(128, 101, 56)",
          pointBorderColor: "#bd7777",
          data: []
        },
        {
          label: "DAST",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          // Example color, adjust as needed
          borderColor: "rgb(255, 159, 64)",
          pointBackgroundColor: "rgb(255, 159, 64)",
          pointBorderColor: "#fff",
          data: []
        }
      ]
    };
    this.vulns = [];
    this.filteredVulns = [...this.vulns];
    this.filters = {
      actions: "",
      name: "",
      location: "",
      source: "",
      status: "",
      severity: "",
      dates: ""
    };
    this.statusFilter = "";
    this.showRemoved = false;
    this.showSuppressed = false;
    this.showAiSuppressed = false;
    this.showUrgent = false;
    this.showNotable = false;
    this.hasUrgentFindings = false;
    this.hasNotableFindings = false;
    this.detailsModal = false;
    this.selectedRowId = null;
    this.bulkActionMode = false;
    this.selectedFindings = [];
    this.vulnerabilitiesLoading = false;
    this.vulnerabilitiesLimit = 15;
    this.scanInfoLoading = false;
    this.scanInfoLimit = 15;
    this.componentsLimit = 10;
    this.scanInfoFilter = "";
    this.changeTeamModalVisible = false;
    this.confirmationModalVisible = false;
    this.confirmationText = "";
    this.availableTeams = [];
    this.selectedNewTeamId = null;
    this.deleteRepoConfirmationVisible = false;
    this.deleteConfirmationText = "";
    this.newComment = "";
    this.isAddingComment = false;
    this.selectedBranch = null;
    this.selectedBranchId = null;
    this.initialBranchName = null;
    this.filterUiSnapshot = null;
    this.jiraEnabled = false;
    this.teamId = null;
    this.position = "top-end";
    this.visible = false;
    this.percentage = 0;
    this.toastMessage = "";
    this.toastStatus = "";
    iconSet.icons = __spreadValues(__spreadValues({}, brand_exports), free_exports);
  }
  ngAfterViewInit() {
  }
  ngOnInit() {
    this.userRole = localStorage.getItem("userRole");
    this.cdr.detectChanges();
    this.route.paramMap.subscribe((params) => {
      this.repoId = params.get("id") || "";
    });
    this.route.queryParamMap.subscribe((params) => {
      this.initialBranchName = params.get("branch");
    });
    this.authService.hc().subscribe({
      next: () => {
      },
      error: () => {
        this.router.navigate(["/login"]);
      }
    });
    this.loadRepoInfo();
    this.loadSourceStats();
    this.loadFindings();
    this.loadFindingStats();
    this.applyFilters();
    this.options2 = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: "rgba(0, 0, 0, 0.05)"
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)"
          }
        }
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: "circle"
          }
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: 10,
          bodyFont: {
            size: 12
          },
          titleFont: {
            size: 13,
            weight: "bold"
          }
        }
      }
    };
  }
  loadRepoInfo() {
    this.scanInfoLoading = true;
    this.repoService.getRepo(+this.repoId).subscribe({
      next: (response) => {
        this.repoData = response;
        this.grouppedDataTypes = this.groupAppDataTypesByCategory(this.repoData.appDataTypes);
        this.topLanguages = this.getTopLanguages(this.repoData.languages);
        this.filteredComponents = [...this.repoData?.components];
        this.scanInfos = response.scanInfos;
        this.applyScanInfoFilter();
        this.scanInfoLoading = false;
        this.checkJiraConfig(response);
        if (response.sastScan === "RUNNING" || response.scaScan === "RUNNING" || response.secretsScan === "RUNNING" || response.iacScan === "RUNNING" || response.dastScan === "RUNNING") {
          this.scanRunning = true;
        }
        this.selectBranchFromQueryParam();
      },
      error: () => {
        this.scanInfoLoading = false;
      }
    });
  }
  loadFindings() {
    this.vulnerabilitiesLoading = true;
    this.repoService.getFindingsDefBranch(+this.repoId).subscribe({
      next: (response) => {
        this.vulns = response.map((v, i) => __spreadProps(__spreadValues({}, v), { __idx: i }));
        this.filteredVulns = [...this.vulns];
        this.counts = this.countFindings(this.vulns);
        this.checkForSpecialFindings();
        this.restoreFilterStateFromStorage();
        this.applyFilters();
        this.vulnerabilitiesLoading = false;
      },
      error: () => {
        this.vulnerabilitiesLoading = false;
      }
    });
    this.applyFilters();
  }
  loadFindingStats() {
    this.repoService.getFindingStats(+this.repoId).subscribe({
      next: (response) => {
        this.codeRepoFindingStats = response.sort((a, b) => new Date(a.dateInserted).getTime() - new Date(b.dateInserted).getTime());
        this.prepareChartData();
      }
    });
  }
  loadSourceStats() {
    this.repoService.getSourceStats(+this.repoId).subscribe({
      next: (response) => {
        this.sourceStats = response;
        this.chartPieData = {
          labels: ["SAST", "SCA", "Secrets", "IaC", "DAST", "GitLab"],
          datasets: [
            {
              data: [
                this.sourceStats.sast,
                this.sourceStats.sca,
                this.sourceStats.secrets,
                this.sourceStats.iac,
                this.sourceStats.dast,
                this.sourceStats.gitlab
              ],
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#3eabb7",
                "#FFCE12",
                "#FF8929D8",
                "#C34E75F4"
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#449a77",
                "#FFCE12",
                "#FF8929D8",
                "#C34E75F4"
              ]
            }
          ]
        };
      }
    });
  }
  get randomData() {
    return Math.round(Math.random() * 100);
  }
  viewVulnerabilityDetails(row) {
    this.filterUiSnapshot = {
      filters: __spreadValues({}, this.filters),
      showRemoved: this.showRemoved,
      showSuppressed: this.showSuppressed,
      showAiSuppressed: this.showAiSuppressed,
      showUrgent: this.showUrgent,
      showNotable: this.showNotable,
      statusFilter: this.statusFilter
    };
    this.selectedRowId = row.id;
    this.detailsModal = true;
    this.repoService.getFinding(+this.repoId, this.selectedRowId).subscribe({
      next: (response) => {
        this.singleVuln = response;
        this.cdr.markForCheck();
      }
    });
  }
  updateFilterName(event) {
    const val = event.target.value.toLowerCase();
    this.filters["name"] = val;
    this.saveFilterStateToStorage();
    this.applyFilters();
  }
  updateFilterLocation(event) {
    const val = event.target.value.toLowerCase();
    this.filters["location"] = val;
    this.saveFilterStateToStorage();
    this.applyFilters();
  }
  updateFilterSource(event) {
    const val = event.target.value;
    this.filters["source"] = val;
    this.saveFilterStateToStorage();
    this.applyFilters();
  }
  updateFilterStatus(event) {
    const val = (event?.target?.value ?? "").toString();
    this.filters["status"] = val;
    this.statusFilter = val;
    if (val === "REMOVED") {
      if (!this.showRemoved)
        this.showRemoved = true;
    } else if (val === "SUPRESSED") {
      if (!this.showSuppressed)
        this.showSuppressed = true;
    } else if (val === "NEW" || val === "EXISTING" || val === "") {
      if (this.showRemoved)
        this.showRemoved = false;
      if (this.showSuppressed)
        this.showSuppressed = false;
    }
    this.saveFilterStateToStorage();
    this.applyFilters();
  }
  updateFilterSeverity(event) {
    const val = event.target.value;
    this.filters["severity"] = val;
    this.saveFilterStateToStorage();
    this.applyFilters();
  }
  toggleShowRemoved(event) {
    this.showRemoved = event.target.checked;
    this.saveFilterStateToStorage();
    this.applyFilters();
  }
  toggleShowSuppressed(event) {
    this.showSuppressed = event.target.checked;
    this.saveFilterStateToStorage();
    this.applyFilters();
  }
  toggleShowAiSuppressed(event) {
    this.showAiSuppressed = event.target.checked;
    this.saveFilterStateToStorage();
    this.applyFilters();
  }
  toggleShowUrgent(event) {
    this.showUrgent = event.target.checked;
    if (this.showUrgent) {
      this.showNotable = false;
    }
    this.saveFilterStateToStorage();
    this.applyFilters();
  }
  toggleShowNotable(event) {
    this.showNotable = event.target.checked;
    if (this.showNotable) {
      this.showUrgent = false;
    }
    this.saveFilterStateToStorage();
    this.applyFilters();
  }
  checkForSpecialFindings() {
    this.hasUrgentFindings = this.vulns.some((v) => v.urgency === "urgent" && v.status !== "REMOVED" && v.status !== "SUPRESSED");
    this.hasNotableFindings = this.vulns.some((v) => v.urgency === "notable" && v.status !== "REMOVED" && v.status !== "SUPRESSED");
  }
  applyFilters() {
    this.filteredVulns = this.vulns.filter((vuln) => {
      const matchesFilters = Object.keys(this.filters).every((key) => {
        const filterValue = this.filters[key];
        if (!filterValue)
          return true;
        const vulnValue = vuln[key];
        if (!vulnValue)
          return false;
        if (key === "source" || key === "urgency" || key === "status" || key === "severity") {
          return typeof vulnValue === "string" && vulnValue.toLowerCase() === filterValue.toLowerCase();
        }
        return vulnValue.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
      const matchesStatus = (this.showRemoved || vuln.status !== "REMOVED") && (this.showSuppressed || vuln.status !== "SUPRESSED");
      const matchesAiSuppressed = this.showAiSuppressed || !(vuln.status === "SUPRESSED" && vuln.ai_verdict === "FALSE_POSITIVE");
      const matchesUrgency = () => {
        if (this.showUrgent)
          return vuln.urgency === "urgent";
        if (this.showNotable)
          return vuln.urgency === "notable";
        return true;
      };
      return matchesFilters && matchesStatus && matchesAiSuppressed && matchesUrgency();
    });
    this.sortByUrgencyThenOriginal(this.filteredVulns);
    this.saveFilterStateToStorage();
  }
  handleDetailsModal(visible) {
    this.detailsModal = visible;
  }
  closeModal() {
    this.detailsModal = false;
    if (this.filterUiSnapshot) {
      this.filters = __spreadValues({}, this.filterUiSnapshot.filters);
      this.showRemoved = this.filterUiSnapshot.showRemoved;
      this.showSuppressed = this.filterUiSnapshot.showSuppressed;
      this.showAiSuppressed = this.filterUiSnapshot.showAiSuppressed;
      this.showUrgent = this.filterUiSnapshot.showUrgent;
      this.showNotable = this.filterUiSnapshot.showNotable;
      this.statusFilter = this.filterUiSnapshot.statusFilter;
      this.applyFilters();
      this.saveFilterStateToStorage();
      this.filterUiSnapshot = null;
    }
  }
  getTopLanguages(languages) {
    const colors = ["success", "warning", "primary", "secondary", "info"];
    return Object.entries(languages).map(([name, value], index) => ({ name, value, color: colors[index] })).sort((a, b) => b.value - a.value).slice(0, 4);
  }
  // refreshData() {
  //     alert('clicked');
  // }
  suppressFinding() {
    this.closeModal();
    if (this.selectedRowId && this.suppressReason) {
      this.repoService.supressFinding(+this.repoId, this.selectedRowId, this.suppressReason).subscribe({
        next: () => {
          this.toastStatus = "success";
          this.toastMessage = "Successfully Suppressed finding";
          this.toggleToast();
          this.saveFilterStateToStorage();
          this.loadFindings();
        }
      });
    }
  }
  toggleToast() {
    this.visible = !this.visible;
  }
  onVisibleChange($event) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }
  reactivateFinding() {
    if (this.selectedRowId) {
      this.repoService.reActivateFinding(+this.repoId, this.selectedRowId).subscribe({
        next: (response) => {
          this.toastStatus = "success";
          this.toastMessage = "Successfully Re-Activated finding";
          this.toggleToast();
          this.loadFindings();
        }
      });
    }
    this.closeModal();
  }
  onBranchSelect(event) {
    const branchIdValue = event.target.value;
    const allBranches = [this.repoData?.defaultBranch, ...this.repoData?.branches || []];
    const branch = allBranches.find((b) => b && String(b.id) === String(branchIdValue));
    this.selectedBranch = branch?.name || null;
    this.selectedBranchId = branch ? +branch.id : null;
    this.repoService.getFindingsBranch(+this.repoId, branchIdValue).subscribe({
      next: (response) => {
        this.vulns = response.map((v, i) => __spreadProps(__spreadValues({}, v), { __idx: i }));
        this.filteredVulns = [...this.vulns];
        this.counts = this.countFindings(this.vulns);
        this.checkForSpecialFindings();
        this.applyFilters();
        this.toastStatus = "success";
        this.toastMessage = "Successfully switched to another branch";
        this.toggleToast();
      }
    });
  }
  selectBranchFromQueryParam() {
    if (!this.initialBranchName || !this.repoData) {
      return;
    }
    const branchName = this.initialBranchName;
    const allBranches = [...this.repoData.branches || []];
    if (this.repoData.defaultBranch) {
      allBranches.unshift(this.repoData.defaultBranch);
    }
    const matchedBranch = allBranches.find((b) => b.name === branchName);
    if (matchedBranch) {
      this.selectedBranch = matchedBranch.name;
      this.selectedBranchId = +matchedBranch.id;
      this.vulnerabilitiesLoading = true;
      this.repoService.getFindingsBranch(+this.repoId, matchedBranch.id).subscribe({
        next: (response) => {
          this.vulns = response.map((v, i) => __spreadProps(__spreadValues({}, v), { __idx: i }));
          this.filteredVulns = [...this.vulns];
          this.counts = this.countFindings(this.vulns);
          this.checkForSpecialFindings();
          this.restoreFilterStateFromStorage();
          this.applyFilters();
          this.vulnerabilitiesLoading = false;
        },
        error: () => {
          this.vulnerabilitiesLoading = false;
        }
      });
    }
    this.initialBranchName = null;
  }
  sortByUrgencyThenOriginal(rows) {
    const prio = (u) => u === "urgent" ? 0 : u === "notable" ? 1 : 2;
    return rows.sort((a, b) => {
      const pa = prio(a.urgency);
      const pb = prio(b.urgency);
      if (pa !== pb)
        return pa - pb;
      const ia = typeof a.__idx === "number" ? a.__idx : 0;
      const ib = typeof b.__idx === "number" ? b.__idx : 0;
      return ia - ib;
    });
  }
  countFindings(vulnerabilities) {
    const counts = {
      critical: 0,
      high: 0,
      rest: 0,
      urgent: 0,
      notable: 0
    };
    vulnerabilities.forEach((vuln) => {
      if (vuln.status === "EXISTING" || vuln.status === "NEW") {
        if (vuln.severity === "CRITICAL") {
          counts.critical++;
        } else if (vuln.severity === "HIGH") {
          counts.high++;
        } else {
          counts.rest++;
        }
        if (vuln.urgency === "urgent") {
          counts.urgent++;
        } else if (vuln.urgency === "notable") {
          counts.notable++;
        }
      }
    });
    return counts;
  }
  groupAppDataTypesByCategory(appDataTypes) {
    const categoryGroupMap = {};
    appDataTypes.forEach((appDataType) => {
      appDataType.categoryGroups.forEach((categoryGroup) => {
        if (!categoryGroupMap[categoryGroup]) {
          categoryGroupMap[categoryGroup] = [];
        }
        const isDuplicate = categoryGroupMap[categoryGroup].some((existingAppDataType) => existingAppDataType.id === appDataType.id || existingAppDataType.name === appDataType.name);
        if (!isDuplicate) {
          categoryGroupMap[categoryGroup].push(appDataType);
        }
      });
    });
    return Object.keys(categoryGroupMap).map((categoryGroup) => ({
      categoryGroup,
      appDataTypes: categoryGroupMap[categoryGroup]
    }));
  }
  toggleAccordion(index) {
    this.isAccordionVisible[index] = !this.isAccordionVisible[index];
  }
  getKeys(obj) {
    return Object.keys(obj);
  }
  prepareChartData() {
    const labels = this.codeRepoFindingStats.map((stat) => this.datePipe.transform(stat.dateInserted, "dd MMM"));
    const sastData = this.codeRepoFindingStats.map((stat) => stat.sastCritical + stat.sastHigh + stat.sastMedium + stat.sastRest);
    const dastData = this.codeRepoFindingStats.map((stat) => stat.dastCritical + stat.dastHigh + stat.dastMedium + stat.dastRest);
    const iacData = this.codeRepoFindingStats.map((stat) => stat.iacCritical + stat.iacHigh + stat.iacMedium + stat.iacRest);
    const secretsData = this.codeRepoFindingStats.map((stat) => stat.secretsCritical + stat.secretsHigh + stat.secretsMedium + stat.secretsRest);
    const scaData = this.codeRepoFindingStats.map((stat) => stat.scaCritical + stat.scaHigh + stat.scaMedium + stat.scaRest);
    const gitlabData = this.codeRepoFindingStats.map((stat) => stat.gitlabCritical + stat.gitlabHigh + stat.gitlabMedium + stat.gitlabRest);
    this.chartLineData = {
      labels,
      datasets: [
        {
          label: "SAST",
          backgroundColor: "rgba(220, 220, 220, 0.2)",
          borderColor: "rgba(220, 220, 220, 1)",
          pointBackgroundColor: "rgba(220, 220, 220, 1)",
          pointBorderColor: "#fff",
          data: sastData
        },
        {
          label: "IaC",
          backgroundColor: "rgba(151, 187, 205, 0.2)",
          borderColor: "rgb(71, 180, 234)",
          pointBackgroundColor: "rgb(71, 163, 211)",
          pointBorderColor: "#bd7777",
          data: iacData
        },
        {
          label: "Secrets",
          backgroundColor: "rgba(151, 187, 205, 0.2)",
          borderColor: "rgb(28, 197, 45)",
          pointBackgroundColor: "rgb(102, 190, 107)",
          pointBorderColor: "#bd7777",
          data: secretsData
        },
        {
          label: "SCA",
          backgroundColor: "rgba(151, 187, 205, 0.2)",
          borderColor: "rgb(210, 124, 56)",
          pointBackgroundColor: "rgb(128, 101, 56)",
          pointBorderColor: "#bd7777",
          data: scaData
        },
        {
          label: "GitLab",
          backgroundColor: "rgba(255, 165, 0, 0.2)",
          borderColor: "rgb(255, 140, 0)",
          pointBackgroundColor: "rgb(255, 165, 0)",
          pointBorderColor: "#ffa500",
          data: gitlabData
        }
      ]
    };
  }
  getLastOpenedFindings() {
    return this.codeRepoFindingStats.length > 0 ? this.codeRepoFindingStats[this.codeRepoFindingStats.length - 1].openedFindings : 0;
  }
  getLastRemovedFinding() {
    return this.codeRepoFindingStats.length > 0 ? this.codeRepoFindingStats[this.codeRepoFindingStats.length - 1].removedFindings : 0;
  }
  getLastFixTime() {
    return this.codeRepoFindingStats.length > 0 ? this.codeRepoFindingStats[this.codeRepoFindingStats.length - 1].averageFixTime : 0;
  }
  getLastRevievedFinding() {
    return this.codeRepoFindingStats.length > 0 ? this.codeRepoFindingStats[this.codeRepoFindingStats.length - 1].reviewedFindings : 0;
  }
  updateFilterGroup(event) {
    const val = event.target.value.toLowerCase();
    this.filtersNew["group"] = val;
    this.applyFiltersNew();
  }
  updateFilterNameNew(event) {
    const val = event.target.value.toLowerCase();
    this.filtersNew["name"] = val;
    this.applyFiltersNew();
  }
  updateFilterVersion(event) {
    const val = event.target.value.toLowerCase();
    this.filtersNew["version"] = val;
    this.applyFiltersNew();
  }
  applyFiltersNew() {
    this.filteredComponents = this.repoData?.components.filter((component) => {
      return (!this.filtersNew["group"] || component.groupid?.toLowerCase().includes(this.filtersNew["group"])) && (!this.filtersNew["name"] || component.name?.toLowerCase().includes(this.filtersNew["name"])) && (!this.filtersNew["version"] || component.version?.toLowerCase().includes(this.filtersNew["version"]));
    });
  }
  runScan() {
    this.repoService.runScan(+this.repoId).subscribe({
      next: (response) => {
        this.toastStatus = "success";
        this.toastMessage = "Successfully requested a scan";
        this.toggleToast();
        this.loadRepoInfo();
      }
    });
  }
  runScanForBranch(branchName) {
    this.repoService.runScanForBranch(+this.repoId, branchName).subscribe({
      next: () => {
        this.toastStatus = "success";
        this.toastMessage = `Scan requested for branch: ${branchName}`;
        this.toggleToast();
        this.loadRepoInfo();
      },
      error: () => {
        this.toastStatus = "danger";
        this.toastMessage = "Failed to start scan for selected branch";
        this.toggleToast();
      }
    });
  }
  openDeleteRepoModal() {
    this.deleteConfirmationText = "";
    this.deleteRepoConfirmationVisible = true;
  }
  closeDeleteRepoModal() {
    this.deleteRepoConfirmationVisible = false;
    this.deleteConfirmationText = "";
  }
  executeDeleteRepo() {
    const repoId = this.repoData?.id || (this.repoId ? +this.repoId : null);
    if (!repoId || this.deleteConfirmationText !== "accept") {
      return;
    }
    this.repoService.deleteRepo(repoId).subscribe({
      next: () => {
        this.toastStatus = "success";
        this.toastMessage = "Repository deleted successfully";
        this.toggleToast();
        this.closeDeleteRepoModal();
        this.router.navigate(["/dashboard"]);
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = error?.error?.message || "Error deleting repository";
        this.toggleToast();
      }
    });
  }
  toggleBulkAction() {
    this.bulkActionMode = !this.bulkActionMode;
    if (!this.bulkActionMode) {
      this.selectedFindings = [];
    }
  }
  onSelectFinding(id, event) {
    if (event.target.checked) {
      if (!this.selectedFindings.includes(id)) {
        this.selectedFindings.push(id);
      }
    } else {
      this.selectedFindings = this.selectedFindings.filter((findingId) => findingId !== id);
    }
  }
  isSelected(id) {
    return this.selectedFindings.includes(id);
  }
  selectAllFindings(event) {
    if (event.target.checked) {
      this.selectedFindings = this.filteredVulns.map((vuln) => vuln.id);
    } else {
      this.selectedFindings = [];
    }
  }
  suppressSelectedFindings() {
    console.log("Selected Findings IDs:", this.selectedFindings);
    if (this.selectedFindings.length > 0) {
      const suppressReason = "FALSE_POSITIVE";
      this.repoService.suppressMultipleFindings(+this.repoId, this.selectedFindings).subscribe({
        next: (response) => {
          this.toastStatus = "success";
          this.toastMessage = "Successfully Suppressed selected findings";
          this.toggleToast();
          this.loadFindings();
          this.selectedFindings = [];
          this.bulkActionMode = false;
        },
        error: (error) => {
          this.toastStatus = "danger";
          this.toastMessage = "Failed to suppress selected findings";
          this.toggleToast();
        }
      });
    }
  }
  // Scan Info Filter Methods
  updateScanInfoFilter(event) {
    const val = event.target.value.toLowerCase();
    this.scanInfoFilter = val;
    this.applyScanInfoFilter();
  }
  applyScanInfoFilter() {
    this.scanInfosFiltered = this.scanInfos.filter((scanInfo) => {
      return scanInfo.codeRepoBranch.name.toLowerCase().includes(this.scanInfoFilter) || scanInfo.commitId.toLowerCase().includes(this.scanInfoFilter);
    });
  }
  addComment() {
    if (!this.newComment?.trim() || this.isAddingComment || this.selectedRowId === null) {
      return;
    }
    const findingId = this.selectedRowId;
    this.isAddingComment = true;
    this.repoService.addComment(+this.repoId, findingId, this.newComment.trim()).subscribe({
      next: () => {
        if (findingId !== null) {
          this.repoService.getFinding(+this.repoId, findingId).subscribe({
            next: (response) => {
              this.singleVuln = response;
              this.newComment = "";
              this.toastStatus = "success";
              this.toastMessage = "Comment added successfully";
              this.toggleToast();
            }
          });
        }
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = "Error adding comment";
        this.toggleToast();
      },
      complete: () => {
        this.isAddingComment = false;
      }
    });
  }
  openChangeTeamModal() {
    this.teamService.get().subscribe({
      next: (teams) => {
        this.availableTeams = teams.filter((team) => team.id !== this.repoData?.team?.id);
        this.changeTeamModalVisible = true;
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = "Error loading teams";
        this.toggleToast();
      }
    });
  }
  executeTeamChange() {
    if (this.confirmationText === "accept" && this.selectedNewTeamId) {
      this.repoService.changeTeam(this.repoData.id, this.selectedNewTeamId).subscribe({
        next: () => {
          this.toastStatus = "success";
          this.toastMessage = "Team changed successfully";
          this.toggleToast();
          this.loadRepoInfo();
        },
        error: (error) => {
          this.toastStatus = "danger";
          this.toastMessage = error.error?.message || "Error changing team";
          this.toggleToast();
        },
        complete: () => {
          this.confirmationModalVisible = false;
          this.confirmationText = "";
          this.selectedNewTeamId = null;
        }
      });
    }
  }
  closeChangeTeamModal() {
    this.changeTeamModalVisible = false;
    this.selectedNewTeamId = null;
  }
  confirmTeamChange() {
    this.changeTeamModalVisible = false;
    this.confirmationModalVisible = true;
  }
  closeConfirmationModal() {
    this.confirmationModalVisible = false;
    this.confirmationText = "";
  }
  /**
   * Clear all filters for vulnerabilities
   */
  clearVulnerabilityFilters() {
    this.filters = {
      actions: "",
      name: "",
      location: "",
      source: "",
      status: "",
      severity: "",
      dates: ""
    };
    this.showRemoved = false;
    this.showSuppressed = false;
    this.showAiSuppressed = false;
    this.statusFilter = "";
    this.saveFilterStateToStorage();
    this.applyFilters();
  }
  /**
   * Clear all filters for components
   */
  clearComponentFilters() {
    this.filtersNew = {
      group: "",
      name: "",
      version: ""
    };
    this.applyFiltersNew();
  }
  /**
   * Handle refresh data with visual feedback
   */
  refreshData() {
    this.toastStatus = "info";
    this.toastMessage = "Refreshing statistics data...";
    this.toggleToast();
    this.loadFindingStats();
    this.loadSourceStats();
  }
  onFindingSuppressed() {
    this.toastStatus = "success";
    this.toastMessage = "Successfully Suppressed finding";
    this.toggleToast();
    this.loadFindings();
  }
  /**
   * Persist filter/toggle UI state to localStorage for this repo.
   */
  saveFilterStateToStorage() {
    try {
      const payload = {
        filters: this.filters,
        showRemoved: this.showRemoved,
        showSuppressed: this.showSuppressed,
        showAiSuppressed: this.showAiSuppressed,
        showUrgent: this.showUrgent,
        showNotable: this.showNotable,
        statusFilter: this.statusFilter
      };
      localStorage.setItem("repoFilters:" + this.repoId, JSON.stringify(payload));
    } catch {
    }
  }
  /**
   * Restore filter/toggle UI state from localStorage for this repo.
   */
  restoreFilterStateFromStorage() {
    try {
      const raw = localStorage.getItem("repoFilters:" + this.repoId);
      if (!raw)
        return;
      const s = JSON.parse(raw);
      if (s && typeof s === "object") {
        this.filters = __spreadValues(__spreadValues({}, this.filters), s.filters || {});
        this.showRemoved = !!s.showRemoved;
        this.showSuppressed = !!s.showSuppressed;
        this.showAiSuppressed = !!s.showAiSuppressed;
        this.showUrgent = !!s.showUrgent;
        this.showNotable = !!s.showNotable;
        this.statusFilter = s.statusFilter || "";
        this.cdr.detectChanges();
      }
    } catch {
    }
  }
  // ============ JIRA Integration ============
  checkJiraConfig(repoData) {
    if (repoData?.team?.id) {
      this.teamId = repoData.team.id;
      this.jiraService.getConfiguration(repoData.team.id).subscribe({
        next: (config) => {
          this.jiraEnabled = config?.configured || false;
        },
        error: () => {
          this.jiraEnabled = false;
        }
      });
    }
  }
  createJiraTicket(findingId) {
    if (!this.teamId)
      return;
    this.jiraService.createTicket(this.teamId, findingId).subscribe({
      next: (response) => {
        this.toastStatus = "success";
        this.toastMessage = "JIRA ticket created: " + (response?.message || "");
        this.visible = true;
        this.loadFindings();
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = error?.error?.message || "Error creating JIRA ticket";
        this.visible = true;
      }
    });
  }
  createJiraTicketsBulk(findingIds) {
    if (!this.teamId || findingIds.length === 0)
      return;
    this.jiraService.createTicketsBulk(this.teamId, findingIds).subscribe({
      next: (response) => {
        this.toastStatus = "success";
        this.toastMessage = response.message;
        this.visible = true;
        this.loadFindings();
        this.bulkActionMode = false;
        this.selectedFindings = [];
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = "Error creating JIRA tickets";
        this.visible = true;
      }
    });
  }
  static {
    this.\u0275fac = function ShowRepoComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ShowRepoComponent)(\u0275\u0275directiveInject(IconSetService), \u0275\u0275directiveInject(RepoService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(DatePipe), \u0275\u0275directiveInject(TeamService), \u0275\u0275directiveInject(JiraService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ShowRepoComponent, selectors: [["app-show-repo"]], standalone: true, features: [\u0275\u0275ProvidersFeature([DatePipe, provideMarkdown()]), \u0275\u0275StandaloneFeature], decls: 231, vars: 102, consts: [["normalResults", ""], [3, "runScanEvent", "runScanBranchEvent", "openChangeTeamModalEvent", "deleteRepoEvent", "repoData", "scanRunning", "userRole", "topLanguages", "chartPieData", "options"], [1, "mt-4"], [3, "counts", "icons"], [1, "repo-tabs-container", "mt-4"], ["variant", "underline-border"], ["cTab", "", 3, "itemKey"], ["cIcon", "", "name", "cil-bug", 1, "me-2"], ["cIcon", "", "name", "cil-chart-line", 1, "me-2"], ["cIcon", "", "name", "cil-magnifying-glass", 1, "me-2"], ["cIcon", "", "name", "cil-share-alt", 1, "me-2"], ["cIcon", "", "name", "cil-puzzle", 1, "me-2"], ["cIcon", "", "name", "cil-burn", 1, "me-2"], ["cIcon", "", "name", "cil-info", 1, "me-2"], [1, "tab-content-panel", 3, "itemKey"], [3, "updateFilterNameEvent", "updateFilterLocationEvent", "updateFilterSourceEvent", "updateFilterStatusEvent", "updateFilterSeverityEvent", "toggleShowRemovedEvent", "toggleShowSuppressedEvent", "toggleShowAiSuppressedEvent", "toggleShowUrgentEvent", "toggleShowNotableEvent", "toggleBulkActionEvent", "selectAllFindingsEvent", "onSelectFindingEvent", "suppressSelectedFindingsEvent", "onBranchSelectEvent", "viewVulnerabilityDetailsEvent", "clearFiltersEvent", "createJiraTicketEvent", "createJiraTicketsBulkEvent", "repoData", "vulns", "filteredVulns", "selectedBranch", "selectedBranchId", "showRemoved", "showSuppressed", "showAiSuppressed", "showUrgent", "showNotable", "hasUrgentFindings", "hasNotableFindings", "bulkActionMode", "selectedFindings", "vulnerabilitiesLoading", "vulnerabilitiesLimit", "jiraEnabled", "teamId"], [1, "statistics-container"], [1, "trend-chart-card", "mb-4"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "mb-0"], ["cButton", "", "color", "light", "variant", "ghost", 1, "refresh-btn", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-sync"], ["type", "line", 3, "data", "options"], [1, "stats-metrics-container"], [1, "mb-4", 3, "md", "sm"], [1, "metric-card", "opened-findings"], [1, "metric-icon"], ["cIcon", "", "name", "cilChartLine", "height", "36"], [1, "metric-content"], [1, "metric-title"], [1, "metric-value"], ["thin", "", "color", "info", 1, "metric-progress", 3, "value"], [1, "metric-card", "closed-findings"], ["cIcon", "", "name", "cilInput", "height", "36"], ["thin", "", "color", "success", 1, "metric-progress", 3, "value"], [1, "metric-card", "reviewed-findings"], ["cIcon", "", "name", "cilBrush", "height", "36"], ["thin", "", "color", "warning", 1, "metric-progress", 3, "value"], [1, "metric-card", "fix-time"], ["cIcon", "", "name", "cilClock", "height", "36"], [1, "metric-unit"], ["thin", "", "color", "danger", 1, "metric-progress", 3, "value"], [1, "scan-info-card"], ["class", "loading-container", 4, "ngIf"], ["class", "scan-content", 4, "ngIf"], [4, "ngFor", "ngForOf"], [1, "components-card"], [1, "text-muted", "mb-0"], [1, "components-controls", "mb-4"], [1, "components-filter"], [1, "row", "g-3"], [1, "col-md-4"], [1, "filter-group"], [1, "filter-label"], [1, "input-group"], [1, "input-group-text"], ["cIcon", "", "name", "cil-filter", 1, "filter-icon"], ["type", "text", "placeholder", "Filter by group", 1, "form-control", 3, "input"], ["type", "text", "placeholder", "Filter by name", 1, "form-control", 3, "input"], ["type", "text", "placeholder", "Filter by version", 1, "form-control", 3, "input"], [1, "components-pagination", "mt-3", "d-flex", "justify-content-between", "align-items-center"], ["class", "components-count", 4, "ngIf"], [1, "components-page-size", "d-flex", "align-items-center"], [1, "page-size-label", "me-2"], [1, "form-select", "page-size-select", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "components-table"], [1, "bootstrap", "components-datatable", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit"], ["name", "Group", "prop", "groupid"], ["ngx-datatable-cell-template", ""], ["name", "Name", "prop", "name"], ["name", "Version", "prop", "version", 3, "width"], ["class", "empty-state", 4, "ngIf"], ["color", "primary", 1, "d-flex", "align-items-center"], ["width", "24", "height", "24", "role", "img", "aria-label", "Info:", 1, "bi", "flex-shrink-0", "me-2"], [0, "xlink", "href", "#info-fill"], [3, "handleDetailsModalEvent", "closeModalEvent", "suppressFindingEvent", "reactivateFindingEvent", "addCommentEvent", "newCommentChange", "suppressed", "detailsModal", "selectedRowId", "singleVuln", "suppressReason", "suppressReasons", "repoData", "selectedBranch", "isAddingComment", "newComment", "repoId"], ["position", "fixed", 1, "p-3", 3, "placement"], [3, "visibleChange", "color", "visible"], ["size", "lg", "id", "changeTeamModal", "alignment", "center", 3, "visibleChange", "visible"], ["cModalTitle", ""], [1, "mb-3"], ["cLabel", "", "for", "newTeamSelect"], ["id", "newTeamSelect", 1, "form-select", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [3, "ngValue", 4, "ngFor", "ngForOf"], ["cButton", "", "color", "secondary", 3, "click"], ["cButton", "", "color", "primary", 3, "click", "disabled"], ["size", "lg", "id", "deleteRepoConfirmationModal", "alignment", "center", 3, "visibleChange", "visible"], [1, "alert", "alert-warning"], [1, "alert-heading"], ["type", "text", "placeholder", "Type 'accept' to confirm", 1, "form-control", 3, "ngModelChange", "ngModel"], ["cButton", "", "color", "danger", 3, "click", "disabled"], ["size", "lg", "id", "confirmationModal", "alignment", "center", 3, "visibleChange", "visible"], [1, "loading-container"], ["color", "primary"], [1, "loading-text"], [1, "scan-content"], [1, "scan-controls"], [1, "scan-search"], ["cIcon", "", "name", "cil-magnifying-glass"], ["type", "text", "placeholder", "Search by commit ID or branch...", 1, "form-control", 3, "input"], [1, "scan-page-size"], [1, "page-size-label"], [1, "scan-table"], [1, "bootstrap", "scan-datatable", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit", "sorts"], ["name", "Branch", "prop", "codeRepoBranch.name", 3, "width"], ["ngx-datatable-header-template", ""], ["name", "Commit ID", "prop", "commitId", 3, "width"], ["name", "Scan Date", "prop", "insertedDate", 3, "width"], ["name", "Results", 3, "width"], [1, "column-header"], [1, "branch-cell"], ["cIcon", "", "name", "cil-share-alt", 1, "branch-icon"], [1, "branch-name"], [1, "commit-cell"], [1, "commit-id"], [1, "date-cell"], ["cIcon", "", "name", "cil-calendar", 1, "date-icon"], [1, "scan-date"], [1, "results-column-header"], [1, "column-legend"], [1, "legend-c"], [1, "legend-h"], [1, "legend-m"], [4, "ngIf", "ngIfElse"], ["color", "secondary", 3, "cTooltip"], [1, "results-grid"], [1, "results-grid-row"], [1, "grid-label"], [1, "grid-value"], [1, "empty-state"], ["cIcon", "", "name", "cil-magnifying-glass", "width", "48", "height", "48"], ["cButton", "", "color", "primary", 3, "click"], [3, "visible"], ["cTemplateId", "accordionHeaderTemplate"], ["cTemplateId", "accordionBodyTemplate"], ["cAccordionButton", "", 3, "click", "collapsed"], [1, "accordion-body"], ["class", "mb-3", 4, "ngFor", "ngForOf"], ["cListGroup", ""], ["cListGroupItem", "", 4, "ngFor", "ngForOf"], ["cListGroupItem", ""], ["color", "secondary"], [1, "components-count"], [1, "badge", "bg-info"], [1, "group-cell", 3, "cTooltip"], [1, "name-cell"], [1, "version-cell"], ["color", "info"], ["cIcon", "", "name", "cil-puzzle", "width", "48", "height", "48"]], template: function ShowRepoComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "app-repository-info", 1);
        \u0275\u0275listener("runScanEvent", function ShowRepoComponent_Template_app_repository_info_runScanEvent_0_listener() {
          return ctx.runScan();
        })("runScanBranchEvent", function ShowRepoComponent_Template_app_repository_info_runScanBranchEvent_0_listener($event) {
          return ctx.runScanForBranch($event);
        })("openChangeTeamModalEvent", function ShowRepoComponent_Template_app_repository_info_openChangeTeamModalEvent_0_listener() {
          return ctx.openChangeTeamModal();
        })("deleteRepoEvent", function ShowRepoComponent_Template_app_repository_info_deleteRepoEvent_0_listener() {
          return ctx.openDeleteRepoModal();
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(1, "div", 2);
        \u0275\u0275element(2, "app-vulnerability-summary", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "div", 4)(4, "c-card")(5, "c-tabs")(6, "c-tabs-list", 5)(7, "button", 6);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(8, "svg", 7);
        \u0275\u0275text(9, " Vulnerabilities ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(10, "button", 6);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(11, "svg", 8);
        \u0275\u0275text(12, " Statistics & Trends ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(13, "button", 6);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(14, "svg", 9);
        \u0275\u0275text(15, " Scan Info ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(16, "button", 6);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(17, "svg", 10);
        \u0275\u0275text(18, " Data Privacy ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(19, "button", 6);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(20, "svg", 11);
        \u0275\u0275text(21, " Components ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(22, "button", 6);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(23, "svg", 12);
        \u0275\u0275text(24, " Notifications ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(25, "button", 6);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(26, "svg", 13);
        \u0275\u0275text(27, " Additional Info ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(28, "c-tabs-content")(29, "c-tab-panel", 14)(30, "app-vulnerabilities-table", 15);
        \u0275\u0275listener("updateFilterNameEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_updateFilterNameEvent_30_listener($event) {
          return ctx.updateFilterName($event);
        })("updateFilterLocationEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_updateFilterLocationEvent_30_listener($event) {
          return ctx.updateFilterLocation($event);
        })("updateFilterSourceEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_updateFilterSourceEvent_30_listener($event) {
          return ctx.updateFilterSource($event);
        })("updateFilterStatusEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_updateFilterStatusEvent_30_listener($event) {
          return ctx.updateFilterStatus($event);
        })("updateFilterSeverityEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_updateFilterSeverityEvent_30_listener($event) {
          return ctx.updateFilterSeverity($event);
        })("toggleShowRemovedEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_toggleShowRemovedEvent_30_listener($event) {
          return ctx.toggleShowRemoved($event);
        })("toggleShowSuppressedEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_toggleShowSuppressedEvent_30_listener($event) {
          return ctx.toggleShowSuppressed($event);
        })("toggleShowAiSuppressedEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_toggleShowAiSuppressedEvent_30_listener($event) {
          return ctx.toggleShowAiSuppressed($event);
        })("toggleShowUrgentEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_toggleShowUrgentEvent_30_listener($event) {
          return ctx.toggleShowUrgent($event);
        })("toggleShowNotableEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_toggleShowNotableEvent_30_listener($event) {
          return ctx.toggleShowNotable($event);
        })("toggleBulkActionEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_toggleBulkActionEvent_30_listener() {
          return ctx.toggleBulkAction();
        })("selectAllFindingsEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_selectAllFindingsEvent_30_listener($event) {
          return ctx.selectAllFindings($event);
        })("onSelectFindingEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_onSelectFindingEvent_30_listener($event) {
          return ctx.onSelectFinding($event.id, $event.event);
        })("suppressSelectedFindingsEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_suppressSelectedFindingsEvent_30_listener() {
          return ctx.suppressSelectedFindings();
        })("onBranchSelectEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_onBranchSelectEvent_30_listener($event) {
          return ctx.onBranchSelect($event);
        })("viewVulnerabilityDetailsEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_viewVulnerabilityDetailsEvent_30_listener($event) {
          return ctx.viewVulnerabilityDetails($event);
        })("clearFiltersEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_clearFiltersEvent_30_listener() {
          return ctx.clearVulnerabilityFilters();
        })("createJiraTicketEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_createJiraTicketEvent_30_listener($event) {
          return ctx.createJiraTicket($event);
        })("createJiraTicketsBulkEvent", function ShowRepoComponent_Template_app_vulnerabilities_table_createJiraTicketsBulkEvent_30_listener($event) {
          return ctx.createJiraTicketsBulk($event);
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(31, "c-tab-panel", 14)(32, "div", 16)(33, "c-card", 17)(34, "c-card-header", 18)(35, "h5", 19);
        \u0275\u0275text(36, "Vulnerability Trend - Default Branch");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(37, "button", 20);
        \u0275\u0275listener("click", function ShowRepoComponent_Template_button_click_37_listener() {
          return ctx.refreshData();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(38, "svg", 21);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(39, "c-card-body");
        \u0275\u0275element(40, "c-chart", 22);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(41, "div", 23)(42, "c-row")(43, "c-col", 24)(44, "div", 25)(45, "div", 26);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(46, "svg", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(47, "div", 28)(48, "h6", 29);
        \u0275\u0275text(49, "Opened Findings");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(50, "div", 30);
        \u0275\u0275text(51);
        \u0275\u0275elementEnd();
        \u0275\u0275element(52, "c-progress", 31);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(53, "c-col", 24)(54, "div", 32)(55, "div", 26);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(56, "svg", 33);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(57, "div", 28)(58, "h6", 29);
        \u0275\u0275text(59, "Closed Findings");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(60, "div", 30);
        \u0275\u0275text(61);
        \u0275\u0275elementEnd();
        \u0275\u0275element(62, "c-progress", 34);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(63, "c-col", 24)(64, "div", 35)(65, "div", 26);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(66, "svg", 36);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(67, "div", 28)(68, "h6", 29);
        \u0275\u0275text(69, "Reviewed Findings");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(70, "div", 30);
        \u0275\u0275text(71);
        \u0275\u0275elementEnd();
        \u0275\u0275element(72, "c-progress", 37);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(73, "c-col", 24)(74, "div", 38)(75, "div", 26);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(76, "svg", 39);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(77, "div", 28)(78, "h6", 29);
        \u0275\u0275text(79, "Time to Fix");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(80, "div", 30);
        \u0275\u0275text(81);
        \u0275\u0275elementStart(82, "span", 40);
        \u0275\u0275text(83, "days");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(84, "c-progress", 41);
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(85, "c-tab-panel", 14)(86, "c-card", 42)(87, "c-card-header")(88, "h5", 19);
        \u0275\u0275text(89, "Scan History");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(90, "c-card-body");
        \u0275\u0275template(91, ShowRepoComponent_div_91_Template, 4, 0, "div", 43)(92, ShowRepoComponent_div_92_Template, 36, 21, "div", 44);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(93, "c-tab-panel", 14)(94, "c-accordion");
        \u0275\u0275template(95, ShowRepoComponent_ng_container_95_Template, 4, 1, "ng-container", 45);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(96, "c-tab-panel", 14)(97, "c-card", 46)(98, "c-card-header")(99, "h5", 19);
        \u0275\u0275text(100, "Detected Dependencies");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(101, "p", 47);
        \u0275\u0275text(102, "Open-source components identified in the codebase");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(103, "c-card-body")(104, "div", 48)(105, "div", 49)(106, "div", 50)(107, "div", 51)(108, "div", 52)(109, "label", 53);
        \u0275\u0275text(110, "Group");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(111, "div", 54)(112, "span", 55);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(113, "svg", 56);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(114, "input", 57);
        \u0275\u0275listener("input", function ShowRepoComponent_Template_input_input_114_listener($event) {
          return ctx.updateFilterGroup($event);
        });
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(115, "div", 51)(116, "div", 52)(117, "label", 53);
        \u0275\u0275text(118, "Name");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(119, "div", 54)(120, "span", 55);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(121, "svg", 56);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(122, "input", 58);
        \u0275\u0275listener("input", function ShowRepoComponent_Template_input_input_122_listener($event) {
          return ctx.updateFilterNameNew($event);
        });
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(123, "div", 51)(124, "div", 52)(125, "label", 53);
        \u0275\u0275text(126, "Version");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(127, "div", 54)(128, "span", 55);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(129, "svg", 56);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(130, "input", 59);
        \u0275\u0275listener("input", function ShowRepoComponent_Template_input_input_130_listener($event) {
          return ctx.updateFilterVersion($event);
        });
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(131, "div", 60);
        \u0275\u0275template(132, ShowRepoComponent_div_132_Template, 3, 1, "div", 61);
        \u0275\u0275elementStart(133, "div", 62)(134, "label", 63);
        \u0275\u0275text(135, "Show");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(136, "select", 64);
        \u0275\u0275twoWayListener("ngModelChange", function ShowRepoComponent_Template_select_ngModelChange_136_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.componentsLimit, $event) || (ctx.componentsLimit = $event);
          return $event;
        });
        \u0275\u0275elementStart(137, "option", 65);
        \u0275\u0275text(138, "10");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(139, "option", 65);
        \u0275\u0275text(140, "20");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(141, "option", 65);
        \u0275\u0275text(142, "50");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(143, "option", 65);
        \u0275\u0275text(144, "100");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(145, "option", 65);
        \u0275\u0275text(146, "200");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(147, "div", 66)(148, "ngx-datatable", 67)(149, "ngx-datatable-column", 68);
        \u0275\u0275template(150, ShowRepoComponent_ng_template_150_Template, 2, 2, "ng-template", 69);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(151, "ngx-datatable-column", 70);
        \u0275\u0275template(152, ShowRepoComponent_ng_template_152_Template, 3, 1, "ng-template", 69);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(153, "ngx-datatable-column", 71);
        \u0275\u0275template(154, ShowRepoComponent_ng_template_154_Template, 3, 1, "ng-template", 69);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(155, ShowRepoComponent_div_155_Template, 8, 0, "div", 72);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(156, "c-tab-panel", 14)(157, "c-alert", 73);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(158, "svg", 74);
        \u0275\u0275element(159, "use", 75);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(160, "div");
        \u0275\u0275text(161, " This part will be developed in next releases. In this section You will discover information about notification ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(162, "c-tab-panel", 14)(163, "c-alert", 73);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(164, "svg", 74);
        \u0275\u0275element(165, "use", 75);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(166, "div");
        \u0275\u0275text(167, " This part will be developed in next releases. In this section You will discover information about how to integrate MixewayFlow for this repo into CICD smoothly ");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(168, "app-vulnerability-details", 76);
        \u0275\u0275listener("handleDetailsModalEvent", function ShowRepoComponent_Template_app_vulnerability_details_handleDetailsModalEvent_168_listener($event) {
          return ctx.handleDetailsModal($event);
        })("closeModalEvent", function ShowRepoComponent_Template_app_vulnerability_details_closeModalEvent_168_listener() {
          return ctx.closeModal();
        })("suppressFindingEvent", function ShowRepoComponent_Template_app_vulnerability_details_suppressFindingEvent_168_listener() {
          return ctx.suppressFinding();
        })("reactivateFindingEvent", function ShowRepoComponent_Template_app_vulnerability_details_reactivateFindingEvent_168_listener() {
          return ctx.reactivateFinding();
        })("addCommentEvent", function ShowRepoComponent_Template_app_vulnerability_details_addCommentEvent_168_listener() {
          return ctx.addComment();
        })("newCommentChange", function ShowRepoComponent_Template_app_vulnerability_details_newCommentChange_168_listener($event) {
          return ctx.newComment = $event;
        })("suppressed", function ShowRepoComponent_Template_app_vulnerability_details_suppressed_168_listener() {
          return ctx.onFindingSuppressed();
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(169, "c-toaster", 77)(170, "c-toast", 78);
        \u0275\u0275listener("visibleChange", function ShowRepoComponent_Template_c_toast_visibleChange_170_listener($event) {
          return ctx.onVisibleChange($event);
        });
        \u0275\u0275elementStart(171, "c-toast-header");
        \u0275\u0275text(172, " Finding management ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(173, "c-toast-body")(174, "p");
        \u0275\u0275text(175);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(176, "c-modal", 79);
        \u0275\u0275listener("visibleChange", function ShowRepoComponent_Template_c_modal_visibleChange_176_listener($event) {
          return ctx.changeTeamModalVisible = $event;
        });
        \u0275\u0275elementStart(177, "c-modal-header")(178, "h5", 80);
        \u0275\u0275text(179, "Change Team");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(180, "c-modal-body")(181, "div", 81)(182, "label", 82);
        \u0275\u0275text(183, "Select New Team");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(184, "select", 83);
        \u0275\u0275twoWayListener("ngModelChange", function ShowRepoComponent_Template_select_ngModelChange_184_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.selectedNewTeamId, $event) || (ctx.selectedNewTeamId = $event);
          return $event;
        });
        \u0275\u0275elementStart(185, "option", 84);
        \u0275\u0275text(186, "Choose a team...");
        \u0275\u0275elementEnd();
        \u0275\u0275template(187, ShowRepoComponent_option_187_Template, 2, 2, "option", 85);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(188, "c-modal-footer")(189, "button", 86);
        \u0275\u0275listener("click", function ShowRepoComponent_Template_button_click_189_listener() {
          return ctx.closeChangeTeamModal();
        });
        \u0275\u0275text(190, " Close ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(191, "button", 87);
        \u0275\u0275listener("click", function ShowRepoComponent_Template_button_click_191_listener() {
          return ctx.confirmTeamChange();
        });
        \u0275\u0275text(192, " Change Team ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(193, "c-modal", 88);
        \u0275\u0275listener("visibleChange", function ShowRepoComponent_Template_c_modal_visibleChange_193_listener($event) {
          return ctx.deleteRepoConfirmationVisible = $event;
        });
        \u0275\u0275elementStart(194, "c-modal-header")(195, "h5", 80);
        \u0275\u0275text(196, "Confirm Repository Deletion");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(197, "c-modal-body")(198, "div", 89)(199, "h4", 90);
        \u0275\u0275text(200, "Warning!");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(201, "p");
        \u0275\u0275text(202, "You are about to delete this repository. This action cannot be undone.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(203, "p");
        \u0275\u0275text(204, 'Please type "accept" to confirm this change:');
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(205, "div", 81)(206, "input", 91);
        \u0275\u0275twoWayListener("ngModelChange", function ShowRepoComponent_Template_input_ngModelChange_206_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.deleteConfirmationText, $event) || (ctx.deleteConfirmationText = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(207, "c-modal-footer")(208, "button", 86);
        \u0275\u0275listener("click", function ShowRepoComponent_Template_button_click_208_listener() {
          return ctx.closeDeleteRepoModal();
        });
        \u0275\u0275text(209, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(210, "button", 92);
        \u0275\u0275listener("click", function ShowRepoComponent_Template_button_click_210_listener() {
          return ctx.executeDeleteRepo();
        });
        \u0275\u0275text(211, " Delete Repository ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(212, "c-modal", 93);
        \u0275\u0275listener("visibleChange", function ShowRepoComponent_Template_c_modal_visibleChange_212_listener($event) {
          return ctx.confirmationModalVisible = $event;
        });
        \u0275\u0275elementStart(213, "c-modal-header")(214, "h5", 80);
        \u0275\u0275text(215, "Confirm Team Change");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(216, "c-modal-body")(217, "div", 89)(218, "h4", 90);
        \u0275\u0275text(219, "Warning!");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(220, "p");
        \u0275\u0275text(221, "You are about to change the team for this repository. This action cannot be undone.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(222, "p");
        \u0275\u0275text(223, 'Please type "accept" to confirm this change:');
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(224, "div", 81)(225, "input", 91);
        \u0275\u0275twoWayListener("ngModelChange", function ShowRepoComponent_Template_input_ngModelChange_225_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.confirmationText, $event) || (ctx.confirmationText = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(226, "c-modal-footer")(227, "button", 86);
        \u0275\u0275listener("click", function ShowRepoComponent_Template_button_click_227_listener() {
          return ctx.closeConfirmationModal();
        });
        \u0275\u0275text(228, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(229, "button", 92);
        \u0275\u0275listener("click", function ShowRepoComponent_Template_button_click_229_listener() {
          return ctx.executeTeamChange();
        });
        \u0275\u0275text(230, " Change Team ");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275property("repoData", ctx.repoData)("scanRunning", ctx.scanRunning)("userRole", ctx.userRole)("topLanguages", ctx.topLanguages)("chartPieData", ctx.chartPieData)("options", ctx.options);
        \u0275\u0275advance(2);
        \u0275\u0275property("counts", ctx.counts)("icons", ctx.icons);
        \u0275\u0275advance(5);
        \u0275\u0275property("itemKey", 0);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 1);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 2);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 3);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 4);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 5);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 6);
        \u0275\u0275advance(4);
        \u0275\u0275property("itemKey", 0);
        \u0275\u0275advance();
        \u0275\u0275property("repoData", ctx.repoData)("vulns", ctx.vulns)("filteredVulns", ctx.filteredVulns)("selectedBranch", ctx.selectedBranch)("selectedBranchId", ctx.selectedBranchId)("showRemoved", ctx.showRemoved)("showSuppressed", ctx.showSuppressed)("showAiSuppressed", ctx.showAiSuppressed)("showUrgent", ctx.showUrgent)("showNotable", ctx.showNotable)("hasUrgentFindings", ctx.hasUrgentFindings)("hasNotableFindings", ctx.hasNotableFindings)("bulkActionMode", ctx.bulkActionMode)("selectedFindings", ctx.selectedFindings)("vulnerabilitiesLoading", ctx.vulnerabilitiesLoading)("vulnerabilitiesLimit", ctx.vulnerabilitiesLimit)("jiraEnabled", ctx.jiraEnabled)("teamId", ctx.teamId);
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 1);
        \u0275\u0275advance(6);
        \u0275\u0275property("cTooltip", "Refresh data");
        \u0275\u0275advance(3);
        \u0275\u0275property("data", ctx.chartLineData)("options", ctx.options2);
        \u0275\u0275advance(3);
        \u0275\u0275property("md", 6)("sm", 12);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.getLastOpenedFindings() === 0 ? "None" : ctx.getLastOpenedFindings());
        \u0275\u0275advance();
        \u0275\u0275property("value", 75);
        \u0275\u0275advance();
        \u0275\u0275property("md", 6)("sm", 12);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.getLastRemovedFinding() === 0 ? "None" : ctx.getLastRemovedFinding());
        \u0275\u0275advance();
        \u0275\u0275property("value", 75);
        \u0275\u0275advance();
        \u0275\u0275property("md", 6)("sm", 12);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.getLastRevievedFinding() === 0 ? "None" : ctx.getLastRevievedFinding());
        \u0275\u0275advance();
        \u0275\u0275property("value", 80);
        \u0275\u0275advance();
        \u0275\u0275property("md", 6)("sm", 12);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate1("", ctx.getLastFixTime() === 0 ? "Unknown" : ctx.getLastFixTime(), " ");
        \u0275\u0275advance(3);
        \u0275\u0275property("value", 65);
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 2);
        \u0275\u0275advance(6);
        \u0275\u0275property("ngIf", ctx.scanInfoLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.scanInfoLoading);
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 3);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.grouppedDataTypes);
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 4);
        \u0275\u0275advance(36);
        \u0275\u0275property("ngIf", ctx.filteredComponents.length > 0);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.componentsLimit);
        \u0275\u0275advance();
        \u0275\u0275property("value", 10);
        \u0275\u0275advance(2);
        \u0275\u0275property("value", 20);
        \u0275\u0275advance(2);
        \u0275\u0275property("value", 50);
        \u0275\u0275advance(2);
        \u0275\u0275property("value", 100);
        \u0275\u0275advance(2);
        \u0275\u0275property("value", 200);
        \u0275\u0275advance(3);
        \u0275\u0275property("rows", ctx.filteredComponents)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", ctx.componentsLimit);
        \u0275\u0275advance(5);
        \u0275\u0275property("width", 120);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.filteredComponents.length === 0);
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 5);
        \u0275\u0275advance(6);
        \u0275\u0275property("itemKey", 6);
        \u0275\u0275advance(6);
        \u0275\u0275property("detailsModal", ctx.detailsModal)("selectedRowId", ctx.selectedRowId)("singleVuln", ctx.singleVuln)("suppressReason", ctx.suppressReason)("suppressReasons", ctx.suppressReasons)("repoData", ctx.repoData)("selectedBranch", ctx.selectedBranch)("isAddingComment", ctx.isAddingComment)("newComment", ctx.newComment)("repoId", ctx.repoId);
        \u0275\u0275advance();
        \u0275\u0275property("placement", ctx.position);
        \u0275\u0275advance();
        \u0275\u0275property("color", ctx.toastStatus)("visible", ctx.visible);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.toastMessage);
        \u0275\u0275advance();
        \u0275\u0275property("visible", ctx.changeTeamModalVisible);
        \u0275\u0275advance(8);
        \u0275\u0275twoWayProperty("ngModel", ctx.selectedNewTeamId);
        \u0275\u0275advance();
        \u0275\u0275property("ngValue", null);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.availableTeams);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", !ctx.selectedNewTeamId);
        \u0275\u0275advance(2);
        \u0275\u0275property("visible", ctx.deleteRepoConfirmationVisible);
        \u0275\u0275advance(13);
        \u0275\u0275twoWayProperty("ngModel", ctx.deleteConfirmationText);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.deleteConfirmationText !== "accept");
        \u0275\u0275advance(2);
        \u0275\u0275property("visible", ctx.confirmationModalVisible);
        \u0275\u0275advance(13);
        \u0275\u0275twoWayProperty("ngModel", ctx.confirmationText);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.confirmationText !== "accept");
      }
    }, dependencies: [
      RowComponent,
      ColComponent,
      CardComponent,
      ButtonDirective,
      IconDirective,
      ProgressComponent,
      CardBodyComponent,
      ChartjsComponent,
      CardHeaderComponent,
      TemplateIdDirective,
      TabsListComponent,
      TabsContentComponent,
      TabPanelComponent,
      TabsComponent,
      TabDirective,
      NgxDatatableModule,
      DatatableComponent,
      DataTableColumnDirective,
      DataTableColumnHeaderDirective,
      DataTableColumnCellDirective,
      BadgeComponent,
      NgIf,
      AlertComponent,
      SpinnerComponent,
      FormLabelDirective,
      ModalModule,
      ModalBodyComponent,
      ModalComponent,
      ModalFooterComponent,
      ModalHeaderComponent,
      ModalTitleDirective,
      DatePipe,
      NgForOf,
      FormsModule,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgModel,
      ToastBodyComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToasterComponent,
      AccordionItemComponent,
      AccordionButtonDirective,
      AccordionComponent,
      ListGroupDirective,
      ListGroupItemDirective,
      TooltipDirective,
      MarkdownModule,
      RepositoryInfoComponent,
      VulnerabilitySummaryComponent,
      VulnerabilitiesTableComponent,
      VulnerabilityDetailsComponent
    ], styles: ["/* src/app/views/show-repo/show-repo.component.scss */\n.repo-tabs-container {\n  margin-bottom: 2rem;\n}\n.tab-content-panel {\n  padding: 1.5rem;\n}\n::ng-deep .tab-content {\n  padding: 0.5rem;\n}\n.empty-state {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem 1.5rem;\n  text-align: center;\n}\n.empty-state svg {\n  opacity: 0.5;\n  margin-bottom: 1rem;\n  color: var(--cui-primary);\n}\n.empty-state h5 {\n  margin-bottom: 0.5rem;\n  font-weight: 600;\n}\n.empty-state p {\n  color: var(--cui-secondary-color);\n  margin-bottom: 1.5rem;\n  max-width: 300px;\n}\n.loading-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem 0;\n}\n.loading-container .loading-text {\n  margin-top: 1rem;\n  color: var(--cui-secondary-color);\n}\n.statistics-container .trend-chart-card {\n  border-radius: 8px;\n  overflow: hidden;\n}\n.statistics-container .trend-chart-card .refresh-btn {\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n}\n.statistics-container .trend-chart-card .refresh-btn svg {\n  width: 18px;\n  height: 18px;\n}\n.statistics-container .stats-metrics-container .metric-card {\n  display: flex;\n  align-items: center;\n  padding: 1.25rem;\n  border-radius: 8px;\n  background-color: var(--cui-card-bg);\n  border: 1px solid var(--cui-card-border-color);\n  height: 100%;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);\n}\n.statistics-container .stats-metrics-container .metric-card .metric-icon {\n  width: 60px;\n  height: 60px;\n  min-width: 60px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-color: var(--cui-tertiary-bg);\n  border-radius: 12px;\n  margin-right: 1rem;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-icon svg {\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-content {\n  flex-grow: 1;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-content .metric-title {\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: var(--cui-secondary-color);\n  margin-bottom: 0.5rem;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-content .metric-value {\n  font-size: 1.75rem;\n  font-weight: 700;\n  margin-bottom: 0.75rem;\n  color: var(--cui-body-color);\n  display: flex;\n  align-items: baseline;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-content .metric-value .metric-unit {\n  font-size: 0.875rem;\n  font-weight: 400;\n  color: var(--cui-secondary-color);\n  margin-left: 0.5rem;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-content .metric-progress {\n  height: 4px;\n  background-color: var(--cui-tertiary-bg);\n}\n.statistics-container .stats-metrics-container .metric-card.opened-findings .metric-icon {\n  background-color: rgba(var(--cui-info-rgb), 0.1);\n}\n.statistics-container .stats-metrics-container .metric-card.opened-findings .metric-icon svg {\n  color: var(--cui-info);\n}\n.statistics-container .stats-metrics-container .metric-card.closed-findings .metric-icon {\n  background-color: rgba(var(--cui-success-rgb), 0.1);\n}\n.statistics-container .stats-metrics-container .metric-card.closed-findings .metric-icon svg {\n  color: var(--cui-success);\n}\n.statistics-container .stats-metrics-container .metric-card.reviewed-findings .metric-icon {\n  background-color: rgba(var(--cui-warning-rgb), 0.1);\n}\n.statistics-container .stats-metrics-container .metric-card.reviewed-findings .metric-icon svg {\n  color: var(--cui-warning);\n}\n.statistics-container .stats-metrics-container .metric-card.fix-time .metric-icon {\n  background-color: rgba(var(--cui-danger-rgb), 0.1);\n}\n.statistics-container .stats-metrics-container .metric-card.fix-time .metric-icon svg {\n  color: var(--cui-danger);\n}\n.scan-info-card {\n  border-radius: 8px;\n  overflow: hidden;\n}\n.scan-info-card .scan-content .scan-controls {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.scan-info-card .scan-content .scan-controls .scan-search {\n  flex-grow: 1;\n  max-width: 500px;\n}\n.scan-info-card .scan-content .scan-controls .scan-search .input-group-text {\n  background-color: var(--cui-tertiary-bg);\n}\n.scan-info-card .scan-content .scan-controls .scan-page-size {\n  display: flex;\n  align-items: center;\n}\n.scan-info-card .scan-content .scan-controls .scan-page-size .page-size-label {\n  margin-right: 0.5rem;\n  margin-bottom: 0;\n  font-weight: 500;\n}\n.scan-info-card .scan-content .scan-controls .scan-page-size .page-size-select {\n  width: auto;\n}\n.scan-info-card .scan-content .scan-datatable .column-header {\n  font-weight: 600;\n}\n.scan-info-card .scan-content .scan-datatable .branch-cell {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.scan-info-card .scan-content .scan-datatable .branch-cell .branch-icon {\n  width: 14px;\n  height: 14px;\n  opacity: 0.7;\n}\n.scan-info-card .scan-content .scan-datatable .branch-cell .branch-name {\n  font-weight: 500;\n}\n.scan-info-card .scan-content .scan-datatable .commit-cell .commit-id {\n  background-color: var(--cui-tertiary-bg);\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.85rem;\n  display: inline-block;\n}\n.scan-info-card .scan-content .scan-datatable .date-cell {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.scan-info-card .scan-content .scan-datatable .date-cell .date-icon {\n  width: 14px;\n  height: 14px;\n  opacity: 0.7;\n}\n.scan-info-card .scan-content .scan-datatable .date-cell .scan-date {\n  font-size: 0.85rem;\n}\n.scan-info-card .scan-content .scan-datatable .results-column-header {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n}\n.scan-info-card .scan-content .scan-datatable .results-column-header .column-header {\n  font-weight: 600;\n}\n.scan-info-card .scan-content .scan-datatable .results-column-header .column-legend {\n  display: flex;\n  gap: 8px;\n  margin-top: 2px;\n  font-size: 0.65rem;\n  font-weight: 700;\n  letter-spacing: 0.5px;\n}\n.scan-info-card .scan-content .scan-datatable .results-column-header .column-legend .legend-c {\n  color: var(--cui-danger);\n}\n.scan-info-card .scan-content .scan-datatable .results-column-header .column-legend .legend-h {\n  color: var(--cui-warning);\n}\n.scan-info-card .scan-content .scan-datatable .results-column-header .column-legend .legend-m {\n  color: var(--cui-info);\n}\n.scan-info-card .scan-content .scan-datatable .results-grid {\n  width: 100%;\n  padding: 4px 0;\n}\n.scan-info-card .scan-content .scan-datatable .results-grid .results-grid-row {\n  display: grid;\n  grid-template-columns: 58px 34px 34px 34px;\n  gap: 4px;\n  align-items: center;\n  padding: 3px 0;\n}\n.scan-info-card .scan-content .scan-datatable .results-grid .results-grid-row:not(:last-child) {\n  border-bottom: 1px solid rgba(128, 128, 128, 0.08);\n}\n.scan-info-card .scan-content .scan-datatable .results-grid .results-grid-row .grid-label {\n  font-weight: 600;\n  font-size: 0.73rem;\n  color: var(--cui-secondary-color);\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n}\n.scan-info-card .scan-content .scan-datatable .results-grid .results-grid-row .grid-value {\n  text-align: center;\n  font-weight: 600;\n  font-size: 0.73rem;\n  border-radius: 4px;\n  padding: 2px 4px;\n  line-height: 1.4;\n  transition: background-color 0.15s, color 0.15s;\n}\n.scan-info-card .scan-content .scan-datatable .results-grid .results-grid-row .grid-value.zero {\n  color: var(--cui-tertiary-color);\n  opacity: 0.35;\n}\n.scan-info-card .scan-content .scan-datatable .results-grid .results-grid-row .grid-value.critical-active {\n  background-color: var(--cui-danger);\n  color: #fff;\n}\n.scan-info-card .scan-content .scan-datatable .results-grid .results-grid-row .grid-value.high-active {\n  background-color: var(--cui-warning);\n  color: #fff;\n}\n.scan-info-card .scan-content .scan-datatable .results-grid .results-grid-row .grid-value.medium-active {\n  background-color: var(--cui-info);\n  color: #fff;\n}\n.components-card {\n  border-radius: 8px;\n  overflow: hidden;\n}\n.components-card .components-controls .components-filter {\n  margin-bottom: 1rem;\n}\n.components-card .components-controls .components-filter .filter-group {\n  margin-bottom: 0.5rem;\n}\n.components-card .components-controls .components-filter .filter-group .filter-label {\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin-bottom: 0.35rem;\n  color: var(--cui-secondary-color);\n}\n.components-card .components-controls .components-filter .filter-group .input-group-text {\n  background-color: var(--cui-tertiary-bg);\n}\n.components-card .components-controls .components-filter .filter-group .filter-icon {\n  width: 14px;\n  height: 14px;\n  opacity: 0.7;\n}\n.components-card .components-controls .components-pagination .page-size-label {\n  margin-bottom: 0;\n  font-weight: 500;\n}\n.components-card .components-controls .components-pagination .page-size-select {\n  width: auto;\n}\n.components-card .components-datatable .group-cell,\n.components-card .components-datatable .name-cell,\n.components-card .components-datatable .version-cell {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 100%;\n}\n.components-card .components-datatable .version-cell .badge {\n  font-size: 0.8rem;\n}\n@media (max-width: 768px) {\n  .tab-btn .tab-text {\n    font-size: 0.75rem;\n  }\n  .tab-btn .tab-icon {\n    width: 16px;\n    height: 16px;\n  }\n  .scan-controls,\n  .components-pagination {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .scan-controls .scan-search,\n  .scan-controls .scan-page-size,\n  .scan-controls .components-count,\n  .scan-controls .components-page-size,\n  .components-pagination .scan-search,\n  .components-pagination .scan-page-size,\n  .components-pagination .components-count,\n  .components-pagination .components-page-size {\n    width: 100%;\n    margin-bottom: 0.5rem;\n  }\n  .metric-card {\n    flex-direction: column;\n    text-align: center;\n  }\n  .metric-card .metric-icon {\n    margin-right: 0 !important;\n    margin-bottom: 1rem;\n  }\n  .results-cell .result-category {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 0.25rem;\n  }\n}\n::ng-deep .ngx-datatable .datatable-body-row {\n  align-items: center;\n}\n::ng-deep .ngx-datatable .datatable-body-row .datatable-body-cell {\n  display: flex;\n  align-items: center;\n}\n::ng-deep .ngx-datatable .datatable-body-row .datatable-body-cell-label {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n::ng-deep .ngx-datatable .datatable-header .datatable-header-cell {\n  text-align: center;\n}\n/*# sourceMappingURL=show-repo.component.css.map */\n"], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ShowRepoComponent, { className: "ShowRepoComponent" });
})();

// src/app/views/show-repo/routes.ts
var routes = [
  {
    path: "",
    component: ShowRepoComponent,
    data: {
      title: "Show Repo Data"
    }
  }
];
export {
  routes
};
//# sourceMappingURL=routes-GPYIQ656.js.map
