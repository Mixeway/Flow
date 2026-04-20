import {
  RepoService
} from "./chunk-POCT43DP.js";
import {
  JiraService
} from "./chunk-45TX6GGP.js";
import {
  TeamVulnerabilitiesTableComponent
} from "./chunk-BSKMGQ6C.js";
import {
  CloudSubscriptionService
} from "./chunk-WQBYKFMD.js";
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
import {
  environment
} from "./chunk-YLFWSDV3.js";
import {
  ActivatedRoute,
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ChangeDetectorRef,
  ColComponent,
  DatePipe,
  EventEmitter,
  FormLabelDirective,
  HttpClient,
  IconDirective,
  IconSetService,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalModule,
  ModalTitleDirective,
  NgForOf,
  NgIf,
  Router,
  RowComponent,
  SpinnerComponent,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  ToastBodyComponent,
  ToastComponent,
  ToastHeaderComponent,
  ToasterComponent,
  TooltipDirective,
  forkJoin,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
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
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-ZG2BHLTP.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/model/TeamFindingSourceStatDTO.ts
var TeamFindingSourceStatDTO = class {
  constructor() {
    this.sast = 0;
    this.iac = 0;
    this.secrets = 0;
    this.sca = 0;
    this.gitlab = 0;
    this.cloud = 0;
    this.dast = 0;
  }
};

// src/app/service/TeamFindingsService.ts
var TeamFindingsService = class _TeamFindingsService {
  constructor(http) {
    this.http = http;
    this.loginUrl = environment.backendUrl;
  }
  getFindingByTeam(id, findingId) {
    return this.http.get(this.loginUrl + "/api/v1/teamfindings/" + id + "/finding/" + findingId, { withCredentials: true });
  }
  getFindingsByTeam(id) {
    return this.http.get(this.loginUrl + "/api/v1/teamfindings/" + id + "/findings", { withCredentials: true });
  }
  getTeamFindingStats(id) {
    return this.http.get(this.loginUrl + "/api/v1/teamfindings/" + id + "/finding_stats", { withCredentials: true });
  }
  getTeamFindingSourceStats(id) {
    return this.http.get(this.loginUrl + "/api/v1/teamfindings/" + id + "/source_stats", { withCredentials: true });
  }
  suppressMultipleTeamFindings(number, selectedFindings) {
    return this.http.post(this.loginUrl + "/api/v1/teamfindings/" + number + "/supress", selectedFindings, { withCredentials: true });
  }
  supressFinding(id, finding, reason) {
    return this.http.get(this.loginUrl + "/api/v1/teamfindings/" + id + "/supress/" + finding + "/reason/" + reason, { withCredentials: true });
  }
  reActivateFinding(id, finding) {
    return this.http.get(this.loginUrl + "/api/v1/teamfindings/" + id + "/reactivate/" + finding, { withCredentials: true });
  }
  static {
    this.\u0275fac = function TeamFindingsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TeamFindingsService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TeamFindingsService, factory: _TeamFindingsService.\u0275fac, providedIn: "root" });
  }
};

// src/app/views/show-team/team-vulnerability-details/team-vulnerability-details.component.ts
function TeamVulnerabilityDetailsComponent_div_5_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 24);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "a", 25);
    \u0275\u0275text(3);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(4, "svg", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("href", ctx_r0.getRepositoryLink(), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFormattedLocation(), " ");
  }
}
function TeamVulnerabilityDetailsComponent_div_5_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.location, " ");
  }
}
function TeamVulnerabilityDetailsComponent_div_5__svg_svg_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 27);
  }
}
function TeamVulnerabilityDetailsComponent_div_5__svg_svg_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 28);
  }
}
function TeamVulnerabilityDetailsComponent_div_5__svg_svg_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 29);
  }
}
function TeamVulnerabilityDetailsComponent_div_5__svg_svg_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 30);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_span_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 31);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_span_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 32);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_span_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 33);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_span_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 33);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_c_spinner_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 34);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_span_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_span_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_span_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_span_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 37);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_span_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 37);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_badge_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-badge", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.singleVuln.comments.length, " ");
  }
}
function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 44);
    \u0275\u0275element(1, "markdown", 45);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 0);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.description || "No description available at this moment");
  }
}
function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 44);
    \u0275\u0275element(1, "markdown", 45);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 1);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.recommendation || "No recommendation available at this moment");
  }
}
function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 44);
    \u0275\u0275element(1, "markdown", 45);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 2);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.explanation || "No explanation available at this moment");
  }
}
function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 44);
    \u0275\u0275element(1, "markdown", 45);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 3);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.refs || "No references available at this moment");
  }
}
function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_18_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275text(1, " No comments yet. Be the first to comment! ");
    \u0275\u0275elementEnd();
  }
}
function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_18_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55)(1, "div", 56)(2, "div", 57)(3, "div", 58);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 59)(6, "div", 60)(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "small", 61);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 62);
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
function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_18_c_spinner_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 63);
  }
}
function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-tab-panel", 44);
    \u0275\u0275template(1, TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_18_div_1_Template, 2, 0, "div", 46);
    \u0275\u0275elementStart(2, "div", 47);
    \u0275\u0275template(3, TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_18_div_3_Template, 14, 7, "div", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 49)(5, "form", 50);
    \u0275\u0275listener("ngSubmit", function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_18_Template_form_ngSubmit_5_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.addComment());
    });
    \u0275\u0275elementStart(6, "input", 51);
    \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_18_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r0.newComment, $event) || (ctx_r0.newComment = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_18_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onNewCommentChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 52);
    \u0275\u0275template(8, TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_18_c_spinner_8_Template, 1, 0, "c-spinner", 53);
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
function TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tabs", 38)(1, "c-tabs-list", 39)(2, "button", 40);
    \u0275\u0275text(3, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 40);
    \u0275\u0275text(5, "Recommendation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 40);
    \u0275\u0275text(7, "Explanation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 40);
    \u0275\u0275text(9, "References");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 40);
    \u0275\u0275text(11, " Comments ");
    \u0275\u0275template(12, TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_badge_12_Template, 2, 1, "c-badge", 41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "c-tabs-content");
    \u0275\u0275template(14, TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_14_Template, 2, 2, "c-tab-panel", 42)(15, TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_15_Template, 2, 2, "c-tab-panel", 42)(16, TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_16_Template, 2, 2, "c-tab-panel", 42)(17, TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_17_Template, 2, 2, "c-tab-panel", 42)(18, TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_c_tab_panel_18_Template, 10, 7, "c-tab-panel", 42);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("activeItemKey", 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("itemKey", 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("itemKey", 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("itemKey", 2);
    \u0275\u0275advance(2);
    \u0275\u0275property("itemKey", 3);
    \u0275\u0275advance(2);
    \u0275\u0275property("itemKey", 4);
    \u0275\u0275advance(2);
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
function TeamVulnerabilityDetailsComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "c-row")(2, "c-col", 4)(3, "c-card", 5)(4, "c-card-header");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "c-card-body")(7, "div", 6)(8, "u")(9, "b");
    \u0275\u0275text(10, "Location/VM Instance:");
    \u0275\u0275elementEnd()();
    \u0275\u0275text(11, " \xA0\xA0 ");
    \u0275\u0275template(12, TeamVulnerabilityDetailsComponent_div_5_ng_container_12_Template, 5, 2, "ng-container", 7)(13, TeamVulnerabilityDetailsComponent_div_5_ng_template_13_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "c-card-footer")(16, "u")(17, "b");
    \u0275\u0275text(18, "Status:");
    \u0275\u0275elementEnd()();
    \u0275\u0275text(19, " \xA0\xA0 ");
    \u0275\u0275template(20, TeamVulnerabilityDetailsComponent_div_5__svg_svg_20_Template, 1, 0, "svg", 8)(21, TeamVulnerabilityDetailsComponent_div_5__svg_svg_21_Template, 1, 0, "svg", 9)(22, TeamVulnerabilityDetailsComponent_div_5__svg_svg_22_Template, 1, 0, "svg", 10)(23, TeamVulnerabilityDetailsComponent_div_5__svg_svg_23_Template, 1, 0, "svg", 11);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "c-col", 12)(26, "c-card", 5)(27, "c-card-header")(28, "div", 13);
    \u0275\u0275template(29, TeamVulnerabilityDetailsComponent_div_5_span_29_Template, 1, 0, "span", 14)(30, TeamVulnerabilityDetailsComponent_div_5_span_30_Template, 1, 0, "span", 15)(31, TeamVulnerabilityDetailsComponent_div_5_span_31_Template, 1, 0, "span", 16)(32, TeamVulnerabilityDetailsComponent_div_5_span_32_Template, 1, 0, "span", 16)(33, TeamVulnerabilityDetailsComponent_div_5_c_spinner_33_Template, 1, 0, "c-spinner", 17)(34, TeamVulnerabilityDetailsComponent_div_5_span_34_Template, 2, 1, "span", 18)(35, TeamVulnerabilityDetailsComponent_div_5_span_35_Template, 2, 1, "span", 18)(36, TeamVulnerabilityDetailsComponent_div_5_span_36_Template, 2, 1, "span", 19)(37, TeamVulnerabilityDetailsComponent_div_5_span_37_Template, 2, 1, "span", 20)(38, TeamVulnerabilityDetailsComponent_div_5_span_38_Template, 2, 1, "span", 20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "c-card-body")(40, "div")(41, "u")(42, "b");
    \u0275\u0275text(43, "Detected:");
    \u0275\u0275elementEnd()();
    \u0275\u0275text(44);
    \u0275\u0275pipe(45, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 21)(47, "u")(48, "b");
    \u0275\u0275text(49, "Last Seen:");
    \u0275\u0275elementEnd()();
    \u0275\u0275text(50);
    \u0275\u0275pipe(51, "date");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(52, "c-row")(53, "c-col", 22);
    \u0275\u0275template(54, TeamVulnerabilityDetailsComponent_div_5_c_tabs_54_Template, 19, 12, "c-tabs", 23);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const cloudScanner_r4 = \u0275\u0275reference(14);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.name, " ");
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.source) !== "CLOUD_SCANNER")("ngIfElse", cloudScanner_r4);
    \u0275\u0275advance(8);
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.status) === "NEW");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.status) === "EXISTING");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.status) === "REMOVED");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.status) === "SUPRESSED");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.status, " ");
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) === "HIGH");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) == "MEDIUM");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) == "LOW");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity) == "INFO");
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
    \u0275\u0275textInterpolate1(" \xA0\xA0 ", \u0275\u0275pipeBind1(45, 21, ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.inserted), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" \xA0\xA0 ", \u0275\u0275pipeBind1(51, 23, ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.last_seen), " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.singleVuln);
  }
}
function TeamVulnerabilityDetailsComponent_c_modal_footer_6_form_3_option_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 75);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const reason_r7 = ctx.$implicit;
    \u0275\u0275property("value", reason_r7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(reason_r7);
  }
}
function TeamVulnerabilityDetailsComponent_c_modal_footer_6_form_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 68);
    \u0275\u0275listener("ngSubmit", function TeamVulnerabilityDetailsComponent_c_modal_footer_6_form_3_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.suppressFinding());
    });
    \u0275\u0275elementStart(1, "label", 69);
    \u0275\u0275text(2, "Suppress finding: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 70);
    \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilityDetailsComponent_c_modal_footer_6_form_3_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.suppressReason, $event) || (ctx_r0.suppressReason = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(4, "option", 71);
    \u0275\u0275text(5, "Select a reason");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, TeamVulnerabilityDetailsComponent_c_modal_footer_6_form_3_option_6_Template, 2, 2, "option", 72);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 73);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(8, "svg", 74);
    \u0275\u0275text(9, " Suppress ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.suppressReason);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r0.suppressReasons);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.suppressReason);
  }
}
function TeamVulnerabilityDetailsComponent_c_modal_footer_6_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 76);
    \u0275\u0275listener("click", function TeamVulnerabilityDetailsComponent_c_modal_footer_6_button_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.reactivateFinding());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 77);
    \u0275\u0275text(2, " Re-Activate Finding ");
    \u0275\u0275elementEnd();
  }
}
function TeamVulnerabilityDetailsComponent_c_modal_footer_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-modal-footer")(1, "div", 64)(2, "div");
    \u0275\u0275template(3, TeamVulnerabilityDetailsComponent_c_modal_footer_6_form_3_Template, 10, 3, "form", 65)(4, TeamVulnerabilityDetailsComponent_c_modal_footer_6_button_4_Template, 3, 0, "button", 66);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 67);
    \u0275\u0275listener("click", function TeamVulnerabilityDetailsComponent_c_modal_footer_6_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeModal());
    });
    \u0275\u0275text(6, "Close");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.status) != "SUPRESSED");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.status) == "SUPRESSED");
  }
}
function TeamVulnerabilityDetailsComponent_c_modal_footer_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-modal-footer")(1, "div", 78)(2, "button", 67);
    \u0275\u0275listener("click", function TeamVulnerabilityDetailsComponent_c_modal_footer_7_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeModal());
    });
    \u0275\u0275text(3, "Close");
    \u0275\u0275elementEnd()()();
  }
}
var TeamVulnerabilityDetailsComponent = class _TeamVulnerabilityDetailsComponent {
  constructor(teamFindingsService) {
    this.teamFindingsService = teamFindingsService;
    this.detailsModal = false;
    this.selectedRowId = null;
    this.suppressReason = "";
    this.suppressReasons = [];
    this.reposData = [];
    this.isAddingComment = false;
    this.newComment = "";
    this.vulns = [];
    this.teamId = "";
    this.handleDetailsModalEvent = new EventEmitter();
    this.closeModalEvent = new EventEmitter();
    this.suppressFindingEvent = new EventEmitter();
    this.reactivateFindingEvent = new EventEmitter();
    this.addCommentEvent = new EventEmitter();
    this.newCommentChange = new EventEmitter();
    this.suppressed = new EventEmitter();
  }
  handleDetailsModal(visible) {
    this.handleDetailsModalEvent.emit(visible);
  }
  closeModal() {
    this.closeModalEvent.emit();
  }
  suppressFinding() {
    console.log(this.suppressReason);
    if (this.selectedRowId && this.suppressReason) {
      this.teamFindingsService.supressFinding(+this.teamId, this.selectedRowId, this.suppressReason).subscribe({
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
  reactivateFinding() {
    this.reactivateFindingEvent.emit();
  }
  addComment() {
    this.addCommentEvent.emit();
  }
  onNewCommentChange(value) {
    this.newComment = value;
    this.newCommentChange.emit(value);
  }
  /**
   * Checks if the vulnerability source type should have a clickable link.
   * @param source The vulnerability source (e.g., 'SAST', 'SCA').
   */
  isLinkableSource(source) {
    const linkableSources = ["SAST", "IAC", "SECRETS", "DAST"];
    return linkableSources.includes(source);
  }
  getRepositoryLink() {
    const finding = this.singleVuln?.vulnsResponseDto;
    if (!finding?.location) {
      return "#";
    }
    if (finding.source === "DAST") {
      return finding.location.startsWith("http") ? finding.location : `//${finding.location}`;
    }
    const repoUrl = finding?.repoUrl || this.reposData.find((r) => r?.target === this.vulns.find((f) => f?.id == finding?.id)?.component_name)?.repo_url;
    if (!repoUrl)
      return "#";
    return repoUrl;
  }
  getFormattedLocation() {
    const finding = this.singleVuln?.vulnsResponseDto;
    if (!finding?.location) {
      return "Location not available";
    }
    if (finding.source === "DAST" || finding.source === "SCA" || finding.source === "GITLAB_SCANNER") {
      return finding.location;
    }
    const location = finding.location.toString();
    const match = location.match(/(.*):(\d+)/);
    if (!match)
      return location;
    const [, filePath, lineNumber] = match;
    return `${filePath}:${lineNumber}`;
  }
  static {
    this.\u0275fac = function TeamVulnerabilityDetailsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TeamVulnerabilityDetailsComponent)(\u0275\u0275directiveInject(TeamFindingsService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeamVulnerabilityDetailsComponent, selectors: [["app-team-vulnerability-details"]], inputs: { detailsModal: "detailsModal", selectedRowId: "selectedRowId", singleVuln: "singleVuln", suppressReason: "suppressReason", suppressReasons: "suppressReasons", reposData: "reposData", isAddingComment: "isAddingComment", newComment: "newComment", vulns: "vulns", teamId: "teamId" }, outputs: { handleDetailsModalEvent: "handleDetailsModalEvent", closeModalEvent: "closeModalEvent", suppressFindingEvent: "suppressFindingEvent", reactivateFindingEvent: "reactivateFindingEvent", addCommentEvent: "addCommentEvent", newCommentChange: "newCommentChange", suppressed: "suppressed" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 8, vars: 4, consts: [["cloudScanner", ""], ["size", "lg", "id", "detailsModal", "alignment", "center", 3, "visibleChange", "visible"], ["cModalTitle", ""], [4, "ngIf"], ["xs", "8"], [1, "mb-4"], [1, "d-flex", "align-items-center"], [4, "ngIf", "ngIfElse"], ["cIcon", "", "name", "cil-burn", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cil-graph", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cil-trash", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cil-volume-off", "class", "me-2", 4, "ngIf"], ["xs", "4"], [1, "d-flex", "align-items-center", "justify-content-center"], ["class", "dot high", 4, "ngIf"], ["class", "dot medium", 4, "ngIf"], ["class", "dot low", 4, "ngIf"], ["color", "danger", "variant", "grow", "size", "sm", 4, "ngIf"], ["class", "high-t ms-2", 4, "ngIf"], ["class", "medium-t ms-2", 4, "ngIf"], ["class", "low-t ms-2", 4, "ngIf"], [1, "mt-2"], ["xs", "12"], [3, "activeItemKey", 4, "ngIf"], ["cIcon", "", "name", "cib-git", 1, "me-2"], ["target", "_blank", 1, "text-primary", "text-decoration-none", 3, "href"], ["cIcon", "", "name", "cil-external-link", "size", "sm", 1, "ms-1"], ["cIcon", "", "name", "cil-burn", 1, "me-2"], ["cIcon", "", "name", "cil-graph", 1, "me-2"], ["cIcon", "", "name", "cil-trash", 1, "me-2"], ["cIcon", "", "name", "cil-volume-off", 1, "me-2"], [1, "dot", "high"], [1, "dot", "medium"], [1, "dot", "low"], ["color", "danger", "variant", "grow", "size", "sm"], [1, "high-t", "ms-2"], [1, "medium-t", "ms-2"], [1, "low-t", "ms-2"], [3, "activeItemKey"], ["variant", "underline-border"], ["cTab", "", 3, "itemKey"], ["color", "info", "class", "ms-1", 4, "ngIf"], ["class", "p-3", 3, "itemKey", 4, "ngIf"], ["color", "info", 1, "ms-1"], [1, "p-3", 3, "itemKey"], [3, "data"], ["class", "text-center text-muted my-4", 4, "ngIf"], [1, "comments-container"], ["class", "comment-item mb-3", 4, "ngFor", "ngForOf"], [1, "mt-3"], [1, "d-flex", 3, "ngSubmit"], ["type", "text", "name", "newComment", "placeholder", "Type your comment...", "required", "", 1, "form-control", "me-2", 3, "ngModelChange", "ngModel", "disabled"], ["cButton", "", "color", "primary", "type", "submit", 3, "disabled"], ["size", "sm", "class", "me-1", 4, "ngIf"], [1, "text-center", "text-muted", "my-4"], [1, "comment-item", "mb-3"], [1, "d-flex"], [1, "comment-avatar"], [1, "rounded-circle", "bg-light", "d-flex", "align-items-center", "justify-content-center", 2, "width", "40px", "height", "40px"], [1, "ms-3", "flex-grow-1"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "text-muted"], [1, "comment-content", "mt-1", "p-2", "bg-light", "rounded"], ["size", "sm", 1, "me-1"], [1, "w-100", "d-flex", "justify-content-between", "align-items-center"], ["class", "d-flex align-items-center", 3, "ngSubmit", 4, "ngIf"], ["cButton", "", "color", "success", 3, "click", 4, "ngIf"], ["cButton", "", "color", "secondary", 3, "click"], [1, "d-flex", "align-items-center", 3, "ngSubmit"], ["for", "suppressReason", 1, "me-2"], ["id", "suppressReason", "name", "suppressReason", "required", "", 1, "form-select", "me-2", 3, "ngModelChange", "ngModel"], ["value", "", "disabled", "", "selected", ""], [3, "value", 4, "ngFor", "ngForOf"], ["type", "submit", "cButton", "", "color", "warning", 3, "disabled"], ["cIcon", "", "name", "cil-volume-off", 1, "me-1"], [3, "value"], ["cButton", "", "color", "success", 3, "click"], ["cIcon", "", "name", "cil-volume-high", 1, "me-1"], [1, "w-100", "d-flex", "justify-content-end", "align-items-center"]], template: function TeamVulnerabilityDetailsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-modal", 1);
        \u0275\u0275listener("visibleChange", function TeamVulnerabilityDetailsComponent_Template_c_modal_visibleChange_0_listener($event) {
          return ctx.handleDetailsModal($event);
        });
        \u0275\u0275elementStart(1, "c-modal-header")(2, "h5", 2);
        \u0275\u0275text(3, "Vulnerability Details");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(4, "c-modal-body");
        \u0275\u0275template(5, TeamVulnerabilityDetailsComponent_div_5_Template, 55, 25, "div", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275template(6, TeamVulnerabilityDetailsComponent_c_modal_footer_6_Template, 7, 2, "c-modal-footer", 3)(7, TeamVulnerabilityDetailsComponent_c_modal_footer_7_Template, 4, 0, "c-modal-footer", 3);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("visible", ctx.detailsModal);
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ctx.selectedRowId !== null);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", (ctx.singleVuln == null ? null : ctx.singleVuln.vulnsResponseDto == null ? null : ctx.singleVuln.vulnsResponseDto.source) !== "CLOUD_SCANNER");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", (ctx.singleVuln == null ? null : ctx.singleVuln.vulnsResponseDto == null ? null : ctx.singleVuln.vulnsResponseDto.source) === "CLOUD_SCANNER");
      }
    }, dependencies: [
      ModalComponent,
      ModalHeaderComponent,
      ModalTitleDirective,
      ModalBodyComponent,
      ModalFooterComponent,
      RowComponent,
      ColComponent,
      CardComponent,
      CardHeaderComponent,
      CardBodyComponent,
      CardFooterComponent,
      ButtonDirective,
      IconDirective,
      SpinnerComponent,
      TabsComponent,
      TabsListComponent,
      TabsContentComponent,
      TabPanelComponent,
      TabDirective,
      BadgeComponent,
      NgIf,
      NgForOf,
      DatePipe,
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
      MarkdownModule,
      MarkdownComponent
    ], styles: ["\n\n.dot[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  display: inline-block;\n}\n.critical[_ngcontent-%COMP%] {\n  background-color: red;\n}\n.high[_ngcontent-%COMP%] {\n  background-color: #f33d3d;\n}\n.medium[_ngcontent-%COMP%] {\n  background-color: #e38334;\n}\n.low[_ngcontent-%COMP%] {\n  background-color: #47a3d3;\n}\n.critical-t[_ngcontent-%COMP%] {\n  color: red;\n}\n.high-t[_ngcontent-%COMP%] {\n  color: #f33d3d;\n}\n.medium-t[_ngcontent-%COMP%] {\n  color: #e38334;\n}\n.low-t[_ngcontent-%COMP%] {\n  color: #47a3d3;\n}\n.comments-container[_ngcontent-%COMP%]   .comment-item[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.125);\n  padding-bottom: 1rem;\n}\n.comments-container[_ngcontent-%COMP%]   .comment-item[_ngcontent-%COMP%]   .comment-avatar[_ngcontent-%COMP%]   .rounded-circle[_ngcontent-%COMP%] {\n  background-color: #f8f9fa;\n  color: #6c757d;\n  font-weight: bold;\n}\n.comments-container[_ngcontent-%COMP%]   .comment-item[_ngcontent-%COMP%]   .comment-content[_ngcontent-%COMP%] {\n  background-color: #f8f9fa;\n  border-radius: 0.5rem;\n  padding: 0.5rem 1rem;\n}\n.markdown-body[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  min-width: 200px;\n  max-width: 980px;\n  margin: 0 auto;\n  padding: 45px;\n}\n/*# sourceMappingURL=team-vulnerability-details.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeamVulnerabilityDetailsComponent, { className: "TeamVulnerabilityDetailsComponent" });
})();

// src/app/views/show-team/team-info/team-info.component.ts
var _c0 = ["chartCanvas"];
function TeamInfoComponent_c_badge_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-badge", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.teamData == null ? null : ctx_r0.teamData.status);
  }
}
function TeamInfoComponent_c_row_11_div_2_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 29);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 30);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cloudSubscription_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(cloudSubscription_r2.external_project_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("ID: ", cloudSubscription_r2.name, "");
  }
}
function TeamInfoComponent_c_row_11_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 24);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 25);
    \u0275\u0275text(3, " Cloud Subscriptions ");
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "c-badge", 26);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, TeamInfoComponent_c_row_11_div_2_div_6_Template, 5, 2, "div", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.cloudSubscriptionsData.length);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.cloudSubscriptionsData);
  }
}
function TeamInfoComponent_c_row_11_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 32);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "No cloud subscriptions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 33);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(5, "svg", 34);
    \u0275\u0275text(6, " Add Subscription ");
    \u0275\u0275elementEnd()();
  }
}
function TeamInfoComponent_c_row_11_div_5_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 29);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 36)(4, "a", 37);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(5, "svg", 38);
    \u0275\u0275text(6, " View Repository ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const codeRepo_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(codeRepo_r3 == null ? null : codeRepo_r3.target);
    \u0275\u0275advance(2);
    \u0275\u0275property("href", codeRepo_r3 == null ? null : codeRepo_r3.repo_url, \u0275\u0275sanitizeUrl);
  }
}
function TeamInfoComponent_c_row_11_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 24);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 35);
    \u0275\u0275text(3, " Code Repositories ");
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "c-badge", 26);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, TeamInfoComponent_c_row_11_div_5_div_6_Template, 7, 2, "div", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.reposData.length);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.reposData);
  }
}
function TeamInfoComponent_c_row_11_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 39);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "No code repositories");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 33);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(5, "svg", 34);
    \u0275\u0275text(6, " Add Repository ");
    \u0275\u0275elementEnd()();
  }
}
function TeamInfoComponent_c_row_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-row")(1, "c-col", 21);
    \u0275\u0275template(2, TeamInfoComponent_c_row_11_div_2_Template, 7, 2, "div", 22)(3, TeamInfoComponent_c_row_11_div_3_Template, 7, 0, "div", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "c-col", 21);
    \u0275\u0275template(5, TeamInfoComponent_c_row_11_div_5_Template, 7, 2, "div", 22)(6, TeamInfoComponent_c_row_11_div_6_Template, 7, 0, "div", 9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.cloudSubscriptionsData && ctx_r0.cloudSubscriptionsData.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.cloudSubscriptionsData || ctx_r0.cloudSubscriptionsData.length === 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.reposData && ctx_r0.reposData.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.reposData || ctx_r0.reposData.length === 0);
  }
}
function TeamInfoComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 40);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "No assets registered for this team");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 33);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(5, "svg", 34);
    \u0275\u0275text(6, " Add Assets ");
    \u0275\u0275elementEnd()();
  }
}
function TeamInfoComponent_c_card_footer_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-card-footer", 41);
  }
}
var TeamInfoComponent = class _TeamInfoComponent {
  constructor() {
    this.reposData = [];
    this.cloudSubscriptionsData = [];
    this.lastScanDate = /* @__PURE__ */ new Date();
    this.totalVulnerabilities = 0;
    this.hoveredSlice = -1;
  }
  ngOnInit() {
    if (!this.chartPieData) {
      this.renderChart();
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.renderChart();
      this.setupEventListeners();
    }, 100);
  }
  setupEventListeners() {
    if (!this.chartCanvas)
      return;
    const canvas = this.chartCanvas.nativeElement;
    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.checkHover(x, y);
    });
    canvas.addEventListener("mouseleave", () => {
      if (this.hoveredSlice !== -1) {
        this.hoveredSlice = -1;
        this.renderChart();
      }
    });
  }
  checkHover(x, y) {
    if (!this.chartPieData)
      return;
    const canvas = this.chartCanvas.nativeElement;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const radius = Math.min(width, height) / 2 - 10;
    const innerRadius = radius * 0.5;
    if (distanceFromCenter > innerRadius && distanceFromCenter < radius) {
      const angle = Math.atan2(y - centerY, x - centerX);
      let targetAngle = angle;
      if (targetAngle < 0)
        targetAngle += 2 * Math.PI;
      const data = this.chartPieData.datasets[0].data;
      const total = data.reduce((sum, value) => sum + value, 0);
      let currentAngle = 0;
      for (let i = 0; i < data.length; i++) {
        const sliceAngle = data[i] / total * 2 * Math.PI;
        if (targetAngle >= currentAngle && targetAngle < currentAngle + sliceAngle) {
          if (this.hoveredSlice !== i) {
            this.hoveredSlice = i;
            this.renderChart();
          }
          return;
        }
        currentAngle += sliceAngle;
      }
    } else {
      if (this.hoveredSlice !== -1) {
        this.hoveredSlice = -1;
        this.renderChart();
      }
    }
  }
  renderChart() {
    if (!this.chartCanvas || !this.chartPieData)
      return;
    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 15;
    const innerRadius = radius * 0.5;
    const data = this.chartPieData.datasets[0].data;
    const total = data.reduce((sum, value) => sum + value, 0);
    this.totalVulnerabilities = total;
    let startAngle = 0;
    data.forEach((value, index) => {
      if (value <= 0)
        return;
      const sliceAngle = value / total * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      const colors = this.chartPieData?.datasets[0].backgroundColor;
      let color = "#cccccc";
      if (colors) {
        if (Array.isArray(colors)) {
          color = colors[index]?.toString() || color;
        } else if (typeof colors === "string") {
          color = colors;
        }
      }
      if (index === this.hoveredSlice) {
        ctx.fillStyle = this.lightenColor(color, 15);
        ctx.save();
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        const offsetX = Math.cos(midAngle) * 5;
        const offsetY = Math.sin(midAngle) * 5;
        ctx.translate(offsetX, offsetY);
      } else {
        ctx.fillStyle = color;
      }
      ctx.fill();
      if (index === this.hoveredSlice) {
        ctx.restore();
      }
      ctx.beginPath();
      ctx.moveTo(centerX + innerRadius * Math.cos(startAngle), centerY + innerRadius * Math.sin(startAngle));
      ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      if (this.chartPieData.labels && index < this.chartPieData.labels.length) {
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        const labelRadius = (radius + innerRadius) / 2;
        const labelX = centerX + labelRadius * Math.cos(midAngle);
        const labelY = centerY + labelRadius * Math.sin(midAngle);
        const label = this.getLabelText(index);
        const percentage = this.getPercentage(value);
        const fontSize = Math.max(10, Math.min(16, sliceAngle * radius / 6));
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, labelX, labelY - fontSize / 2);
        ctx.font = `${fontSize * 0.9}px Arial`;
        ctx.fillText(percentage, labelX, labelY + fontSize / 2);
      }
      if (index === this.hoveredSlice) {
        this.drawTooltip(ctx, centerX, centerY, index);
      }
      startAngle = endAngle;
    });
  }
  drawTooltip(ctx, centerX, centerY, index) {
    if (!this.chartPieData)
      return;
    const label = this.getLabelText(index);
    const data = this.chartPieData.datasets[0].data;
    const value = data[index];
    const percentage = this.getPercentage(value);
    const tooltipText = `${label}: ${value} (${percentage})`;
    const padding = 10;
    const fontSize = 14;
    ctx.font = `${fontSize}px Arial`;
    const textWidth = ctx.measureText(tooltipText).width;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = fontSize + padding * 2;
    const tooltipX = centerX - boxWidth / 2;
    const tooltipY = centerY - 100;
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.beginPath();
    ctx.roundRect(tooltipX, tooltipY, boxWidth, boxHeight, 5);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tooltipText, centerX, tooltipY + boxHeight / 2);
  }
  lightenColor(color, percent) {
    let r, g, b;
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else if (color.startsWith("rgb")) {
      const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (!match)
        return color;
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
    } else {
      return color;
    }
    r = Math.min(255, r + percent);
    g = Math.min(255, g + percent);
    b = Math.min(255, b + percent);
    return `rgb(${r}, ${g}, ${b})`;
  }
  getPercentage(value) {
    if (!this.chartPieData || !value)
      return "0%";
    const data = this.chartPieData.datasets[0].data;
    const total = data.reduce((sum, val) => sum + val, 0);
    if (total === 0)
      return "0%";
    const numValue = Number(value) || 0;
    return (numValue / total * 100).toFixed(0) + "%";
  }
  getBackgroundColor(index) {
    if (!this.chartPieData || !this.chartPieData.datasets[0].backgroundColor) {
      return "#cccccc";
    }
    const colors = this.chartPieData.datasets[0].backgroundColor;
    if (Array.isArray(colors)) {
      return colors[index]?.toString() || "#cccccc";
    } else if (typeof colors === "string") {
      return colors;
    }
    return "#cccccc";
  }
  getLabelText(index) {
    if (!this.chartPieData || !this.chartPieData.labels) {
      return "Unknown";
    }
    const labels = this.chartPieData.labels;
    if (Array.isArray(labels)) {
      return labels[index]?.toString() || "Unknown";
    }
    return "Unknown";
  }
  static {
    this.\u0275fac = function TeamInfoComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TeamInfoComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeamInfoComponent, selectors: [["app-team-info"]], viewQuery: function TeamInfoComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.chartCanvas = _t.first);
      }
    }, inputs: { teamData: "teamData", reposData: "reposData", cloudSubscriptionsData: "cloudSubscriptionsData", chartPieData: "chartPieData" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 30, vars: 7, consts: [["chartCanvas", ""], [1, "team-info-row", "g-4"], ["lg", "8", 1, "team-col"], [1, "team-card"], [1, "team-header"], ["color", "info", "class", "me-1", 4, "ngIf"], ["color", "light", 1, "team-id"], [1, "asset-container", 2, "max-height", "350px", "overflow-y", "auto"], [4, "ngIf"], ["class", "asset-section text-center", 4, "ngIf"], ["style", "height: 60px;", 4, "ngIf"], ["lg", "4", 1, "chart-col"], [1, "h-100"], ["cIcon", "", "name", "cilChartPie", "size", "sm", 1, "me-1"], [1, "chart-container"], ["width", "250", "height", "250"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "text-muted"], ["cButton", "", "color", "primary", "size", "sm", "variant", "outline"], ["cIcon", "", "name", "cilList", "size", "sm", 1, "me-1"], ["color", "info", 1, "me-1"], ["md", "6"], ["class", "asset-section", 4, "ngIf"], [1, "asset-section"], [1, "asset-title"], ["cIcon", "", "name", "cilCloud", "size", "sm", 1, "me-1"], ["color", "primary", "shape", "rounded-pill", 1, "ms-2"], ["class", "asset-item", 4, "ngFor", "ngForOf"], [1, "asset-item"], [1, "asset-name"], [1, "asset-id"], [1, "asset-section", "text-center"], ["cIcon", "", "name", "cilCloud", "size", "xl", 1, "mb-3", "text-secondary"], ["cButton", "", "color", "primary", "size", "sm"], ["cIcon", "", "name", "cilPlus", "size", "sm", 1, "me-1"], ["cIcon", "", "name", "cilCode", "size", "sm", 1, "me-1"], [1, "repo-link", "mt-2"], ["cButton", "", "color", "light", "size", "sm", "variant", "outline", "target", "_blank", "rel", "noopener noreferrer", 1, "w-100", 3, "href"], ["cIcon", "", "name", "cibGithub", "size", "sm", 1, "me-1"], ["cIcon", "", "name", "cilCode", "size", "xl", 1, "mb-3", "text-secondary"], ["cIcon", "", "name", "cilBan", "size", "xl", 1, "mb-3", "text-secondary"], [2, "height", "60px"]], template: function TeamInfoComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-row", 1)(1, "c-col", 2)(2, "c-card", 3)(3, "div", 4)(4, "div")(5, "h2");
        \u0275\u0275text(6);
        \u0275\u0275elementEnd();
        \u0275\u0275template(7, TeamInfoComponent_c_badge_7_Template, 2, 1, "c-badge", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "c-badge", 6);
        \u0275\u0275text(9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "div", 7);
        \u0275\u0275template(11, TeamInfoComponent_c_row_11_Template, 7, 4, "c-row", 8)(12, TeamInfoComponent_div_12_Template, 7, 0, "div", 9);
        \u0275\u0275elementEnd();
        \u0275\u0275template(13, TeamInfoComponent_c_card_footer_13_Template, 1, 0, "c-card-footer", 10);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(14, "c-col", 11)(15, "c-card", 12)(16, "c-card-header");
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(17, "svg", 13);
        \u0275\u0275text(18, " Vulnerabilities by Source ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(19, "c-card-body")(20, "div", 14);
        \u0275\u0275element(21, "canvas", 15, 0);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(23, "c-card-footer")(24, "div", 16)(25, "small", 17);
        \u0275\u0275text(26);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "button", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(28, "svg", 19);
        \u0275\u0275text(29, " View Details ");
        \u0275\u0275elementEnd()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.teamData == null ? null : ctx.teamData.name);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.teamData == null ? null : ctx.teamData.status);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1("ID: ", ctx.teamData == null ? null : ctx.teamData.remoteIdentifier, "");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.cloudSubscriptionsData && ctx.cloudSubscriptionsData.length > 0 || ctx.reposData && ctx.reposData.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", (!ctx.cloudSubscriptionsData || ctx.cloudSubscriptionsData.length === 0) && (!ctx.reposData || ctx.reposData.length === 0));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.cloudSubscriptionsData && ctx.cloudSubscriptionsData.length > 0 || ctx.reposData && ctx.reposData.length > 0);
        \u0275\u0275advance(13);
        \u0275\u0275textInterpolate1("Total: ", ctx.totalVulnerabilities, " vulnerabilities");
      }
    }, dependencies: [
      RowComponent,
      ColComponent,
      CardComponent,
      CardBodyComponent,
      CardFooterComponent,
      CardHeaderComponent,
      ButtonDirective,
      IconDirective,
      NgIf,
      NgForOf,
      BadgeComponent
    ], styles: ["\n\n.team-card[_ngcontent-%COMP%] {\n  height: 100%;\n  transition: box-shadow 0.3s ease;\n}\n.team-card[_ngcontent-%COMP%]:hover {\n  box-shadow: var(--cui-shadow-lg);\n}\n.team-card[_ngcontent-%COMP%]   .team-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 1rem;\n  border-bottom: 1px solid var(--cui-border-color);\n}\n.team-card[_ngcontent-%COMP%]   .team-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n  font-weight: 600;\n}\n.team-card[_ngcontent-%COMP%]   .team-header[_ngcontent-%COMP%]   .team-id[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--cui-body-color-rgb);\n  opacity: 0.7;\n}\n.team-card[_ngcontent-%COMP%]   .asset-container[_ngcontent-%COMP%] {\n  padding: 1rem;\n  gap: 1rem;\n}\n.team-card[_ngcontent-%COMP%]   .asset-container[_ngcontent-%COMP%]   .asset-section[_ngcontent-%COMP%] {\n  background-color: var(--cui-card-cap-bg);\n  border-radius: var(--cui-border-radius);\n  padding: 1rem;\n  margin-bottom: 1rem;\n  height: calc(100% - 1rem);\n}\n.team-card[_ngcontent-%COMP%]   .asset-container[_ngcontent-%COMP%]   .asset-section[_ngcontent-%COMP%]   .asset-title[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  margin-bottom: 0.75rem;\n  display: flex;\n  align-items: center;\n}\n.team-card[_ngcontent-%COMP%]   .asset-container[_ngcontent-%COMP%]   .asset-section[_ngcontent-%COMP%]   .asset-title[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n.team-card[_ngcontent-%COMP%]   .asset-container[_ngcontent-%COMP%]   .asset-section[_ngcontent-%COMP%]   .asset-item[_ngcontent-%COMP%] {\n  padding: 0.75rem;\n  margin-bottom: 0.5rem;\n  background-color: var(--cui-card-bg);\n  border-radius: var(--cui-border-radius-sm);\n  border-left: 3px solid var(--cui-primary);\n  transition: transform 0.2s ease;\n}\n.team-card[_ngcontent-%COMP%]   .asset-container[_ngcontent-%COMP%]   .asset-section[_ngcontent-%COMP%]   .asset-item[_ngcontent-%COMP%]:hover {\n  transform: translateX(3px);\n}\n.team-card[_ngcontent-%COMP%]   .asset-container[_ngcontent-%COMP%]   .asset-section[_ngcontent-%COMP%]   .asset-item[_ngcontent-%COMP%]   .asset-name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  margin-bottom: 0.25rem;\n}\n.team-card[_ngcontent-%COMP%]   .asset-container[_ngcontent-%COMP%]   .asset-section[_ngcontent-%COMP%]   .asset-item[_ngcontent-%COMP%]   .asset-id[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  opacity: 0.8;\n}\n.team-card[_ngcontent-%COMP%]   .asset-container[_ngcontent-%COMP%]   .asset-section[_ngcontent-%COMP%]   .asset-item[_ngcontent-%COMP%]   .repo-link[_ngcontent-%COMP%] {\n  margin-top: 0.5rem;\n}\n.chart-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 15px;\n}\n.chart-container[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n@media (max-width: 992px) {\n  .team-info-row[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .team-info-row[_ngcontent-%COMP%]   .team-col[_ngcontent-%COMP%], \n   .team-info-row[_ngcontent-%COMP%]   .chart-col[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n@media (max-width: 992px) {\n  .team-info-row[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .team-info-row[_ngcontent-%COMP%]   .team-col[_ngcontent-%COMP%], \n   .team-info-row[_ngcontent-%COMP%]   .chart-col[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=team-info.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeamInfoComponent, { className: "TeamInfoComponent" });
})();

// src/app/views/show-team/team-vulnerability-summary/team-vulnerability-summary.component.ts
function TeamVulnerabilitySummaryComponent_div_9_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.counts.urgent, " Urgent ");
  }
}
function TeamVulnerabilitySummaryComponent_div_9_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.counts.notable, " Notable ");
  }
}
function TeamVulnerabilitySummaryComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275text(1, " Including ");
    \u0275\u0275template(2, TeamVulnerabilitySummaryComponent_div_9_span_2_Template, 2, 1, "span", 31)(3, TeamVulnerabilitySummaryComponent_div_9_span_3_Template, 2, 1, "span", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", (ctx_r0.counts == null ? null : ctx_r0.counts.urgent) > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.counts == null ? null : ctx_r0.counts.notable) > 0);
  }
}
function TeamVulnerabilitySummaryComponent_c_row_71_c_col_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-col", 8)(1, "div", 37)(2, "div", 38);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "div", 40)(5, "div", 41);
    \u0275\u0275text(6, "Auto-Fixable");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 42);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 43);
    \u0275\u0275text(10, "Vulnerabilities that can be automatically remediated");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("lg", 6)("md", 6)("sm", 12);
    \u0275\u0275advance(3);
    \u0275\u0275property("cIcon", ctx_r0.icons.cilWrench);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((ctx_r0.counts == null ? null : ctx_r0.counts.autoFixable) || 0);
  }
}
function TeamVulnerabilitySummaryComponent_c_row_71_c_col_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-col", 8)(1, "div", 44)(2, "div", 38);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "div", 40)(5, "div", 41);
    \u0275\u0275text(6, "Recently Fixed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 42);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 43);
    \u0275\u0275text(10, "Vulnerabilities remediated in the last 30 days");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("lg", 6)("md", 6)("sm", 12);
    \u0275\u0275advance(3);
    \u0275\u0275property("cIcon", ctx_r0.icons.cilCheckAlt);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((ctx_r0.counts == null ? null : ctx_r0.counts.fixed) || 0);
  }
}
function TeamVulnerabilitySummaryComponent_c_row_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-row", 35);
    \u0275\u0275template(1, TeamVulnerabilitySummaryComponent_c_row_71_c_col_1_Template, 11, 5, "c-col", 36)(2, TeamVulnerabilitySummaryComponent_c_row_71_c_col_2_Template, 11, 5, "c-col", 36);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.counts == null ? null : ctx_r0.counts.autoFixable);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.counts == null ? null : ctx_r0.counts.fixed);
  }
}
var TeamVulnerabilitySummaryComponent = class _TeamVulnerabilitySummaryComponent {
  constructor() {
    this.counts = {
      critical: 0,
      high: 0,
      rest: 0,
      urgent: 0,
      notable: 0,
      autoFixable: 0,
      fixed: 0
    };
    this.totalVulnerabilities = 0;
  }
  ngOnInit() {
    if (!this.icons) {
      this.icons = {
        cilBug: { name: "cil-bug" },
        cilCenterFocus: { name: "cil-center-focus" },
        cilCommentSquare: { name: "cil-comment-square" },
        cilWrench: { name: "cil-wrench" },
        cilCheckAlt: { name: "cil-check-alt" }
      };
      this.counts = {
        critical: this.counts?.critical || 0,
        high: this.counts?.high || 0,
        rest: this.counts?.rest || 0,
        urgent: this.counts?.urgent || 0,
        notable: this.counts?.notable || 0,
        autoFixable: this.counts?.autoFixable || 0,
        fixed: this.counts?.fixed || 0
      };
    }
  }
  ngOnChanges() {
    this.calculateTotal();
  }
  getTotalCount() {
    return (this.counts?.critical || 0) + (this.counts?.high || 0) + (this.counts?.rest || 0);
  }
  calculateTotal() {
    if (!this.counts) {
      this.totalVulnerabilities = 0;
      return;
    }
    this.totalVulnerabilities = this.getTotalCount();
  }
  /**
   * Calculate percentage of a specific vulnerability type
   */
  getPercentage(count) {
    const total = this.getTotalCount();
    if (total === 0)
      return 0;
    return Math.round(count / total * 100);
  }
  static {
    this.\u0275fac = function TeamVulnerabilitySummaryComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TeamVulnerabilitySummaryComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeamVulnerabilitySummaryComponent, selectors: [["app-team-vulnerability-summary"]], inputs: { counts: "counts", icons: "icons" }, standalone: true, features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature], decls: 72, vars: 27, consts: [[1, "vulnerability-dashboard"], [1, "dashboard-header", "mb-3"], [1, "dashboard-title"], [1, "total-vulnerabilities"], [1, "total-count"], [1, "total-label"], ["class", "total-breakdown", 4, "ngIf"], [1, "vulnerability-cards"], [1, "mb-3", 3, "lg", "md", "sm"], [1, "vuln-card", "critical-card"], [1, "vuln-card-header"], [1, "severity-badge", "critical"], [1, "vuln-count"], [1, "vuln-card-body"], [1, "vuln-icon"], ["width", "24", 3, "cIcon"], [1, "vuln-info"], [1, "vuln-percent"], [1, "vuln-bar-container"], [1, "vuln-bar", "critical-bar"], [1, "vuln-card-footer"], [1, "risk-level"], [1, "action-required"], [1, "vuln-card", "high-card"], [1, "severity-badge", "high"], [1, "vuln-bar", "high-bar"], [1, "vuln-card", "other-card"], [1, "severity-badge", "other"], [1, "vuln-bar", "other-bar"], ["class", "additional-metrics mt-2", 4, "ngIf"], [1, "total-breakdown"], ["class", "breakdown-badge urgent", 4, "ngIf"], ["class", "breakdown-badge notable", 4, "ngIf"], [1, "breakdown-badge", "urgent"], [1, "breakdown-badge", "notable"], [1, "additional-metrics", "mt-2"], ["class", "mb-3", 3, "lg", "md", "sm", 4, "ngIf"], [1, "metric-card", "autofix-card"], [1, "metric-icon"], ["width", "20", 3, "cIcon"], [1, "metric-content"], [1, "metric-title"], [1, "metric-value"], [1, "metric-description"], [1, "metric-card", "fixed-card"]], template: function TeamVulnerabilitySummaryComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h2", 2);
        \u0275\u0275text(3, "Vulnerability Summary");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 3)(5, "span", 4);
        \u0275\u0275text(6);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "span", 5);
        \u0275\u0275text(8, "Total Findings");
        \u0275\u0275elementEnd();
        \u0275\u0275template(9, TeamVulnerabilitySummaryComponent_div_9_Template, 4, 2, "div", 6);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "c-row", 7)(11, "c-col", 8)(12, "div", 9)(13, "div", 10)(14, "div", 11);
        \u0275\u0275text(15, "Critical");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "div", 12);
        \u0275\u0275text(17);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(18, "div", 13)(19, "div", 14);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(20, "svg", 15);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(21, "div", 16)(22, "div", 17);
        \u0275\u0275text(23);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(24, "div", 18);
        \u0275\u0275element(25, "div", 19);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(26, "div", 20)(27, "div", 21);
        \u0275\u0275text(28, "Highest Risk Level");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "div", 22);
        \u0275\u0275text(30, "Immediate Action Required");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(31, "c-col", 8)(32, "div", 23)(33, "div", 10)(34, "div", 24);
        \u0275\u0275text(35, "High");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(36, "div", 12);
        \u0275\u0275text(37);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(38, "div", 13)(39, "div", 14);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(40, "svg", 15);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(41, "div", 16)(42, "div", 17);
        \u0275\u0275text(43);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(44, "div", 18);
        \u0275\u0275element(45, "div", 25);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(46, "div", 20)(47, "div", 21);
        \u0275\u0275text(48, "Significant Risk Level");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(49, "div", 22);
        \u0275\u0275text(50, "Prioritize Remediation");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(51, "c-col", 8)(52, "div", 26)(53, "div", 10)(54, "div", 27);
        \u0275\u0275text(55, "Other");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(56, "div", 12);
        \u0275\u0275text(57);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(58, "div", 13)(59, "div", 14);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(60, "svg", 15);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(61, "div", 16)(62, "div", 17);
        \u0275\u0275text(63);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(64, "div", 18);
        \u0275\u0275element(65, "div", 28);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(66, "div", 20)(67, "div", 21);
        \u0275\u0275text(68, "Lower Risk Level");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(69, "div", 22);
        \u0275\u0275text(70, "Address When Possible");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275template(71, TeamVulnerabilitySummaryComponent_c_row_71_Template, 3, 2, "c-row", 29);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.getTotalCount());
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", (ctx.counts == null ? null : ctx.counts.urgent) > 0 || (ctx.counts == null ? null : ctx.counts.notable) > 0);
        \u0275\u0275advance(2);
        \u0275\u0275property("lg", 4)("md", 6)("sm", 12);
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate((ctx.counts == null ? null : ctx.counts.critical) || 0);
        \u0275\u0275advance(3);
        \u0275\u0275property("cIcon", ctx.icons.cilBug);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", ctx.getPercentage(ctx.counts == null ? null : ctx.counts.critical), "% ");
        \u0275\u0275advance(2);
        \u0275\u0275styleProp("width", ctx.getPercentage(ctx.counts == null ? null : ctx.counts.critical), "%");
        \u0275\u0275advance(6);
        \u0275\u0275property("lg", 4)("md", 6)("sm", 12);
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate((ctx.counts == null ? null : ctx.counts.high) || 0);
        \u0275\u0275advance(3);
        \u0275\u0275property("cIcon", ctx.icons.cilCenterFocus);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", ctx.getPercentage(ctx.counts == null ? null : ctx.counts.high), "% ");
        \u0275\u0275advance(2);
        \u0275\u0275styleProp("width", ctx.getPercentage(ctx.counts == null ? null : ctx.counts.high), "%");
        \u0275\u0275advance(6);
        \u0275\u0275property("lg", 4)("md", 6)("sm", 12);
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate((ctx.counts == null ? null : ctx.counts.rest) || 0);
        \u0275\u0275advance(3);
        \u0275\u0275property("cIcon", ctx.icons.cilCommentSquare);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", ctx.getPercentage(ctx.counts == null ? null : ctx.counts.rest), "% ");
        \u0275\u0275advance(2);
        \u0275\u0275styleProp("width", ctx.getPercentage(ctx.counts == null ? null : ctx.counts.rest), "%");
        \u0275\u0275advance(6);
        \u0275\u0275property("ngIf", (ctx.counts == null ? null : ctx.counts.autoFixable) || (ctx.counts == null ? null : ctx.counts.fixed));
      }
    }, dependencies: [
      RowComponent,
      ColComponent,
      NgIf,
      IconDirective
    ], styles: ["\n\n.vulnerability-dashboard[_ngcontent-%COMP%] {\n  padding: 0.5rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .dashboard-title[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 600;\n  margin: 0;\n  color: var(--cui-body-color);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-count[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-breakdown[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  margin-top: 0.25rem;\n  color: var(--cui-body-color);\n  opacity: 0.8;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-breakdown[_ngcontent-%COMP%]   .breakdown-badge[_ngcontent-%COMP%] {\n  padding: 0.2em 0.5em;\n  border-radius: 4px;\n  font-weight: 600;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-breakdown[_ngcontent-%COMP%]   .breakdown-badge.urgent[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-danger-rgb), 0.15);\n  color: var(--cui-danger);\n  border: 1px solid rgba(var(--cui-danger-rgb), 0.4);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-breakdown[_ngcontent-%COMP%]   .breakdown-badge.notable[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-warning-rgb), 0.15);\n  color: var(--cui-warning);\n  border: 1px solid rgba(var(--cui-warning-rgb), 0.4);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%] {\n  border-radius: 10px;\n  overflow: hidden;\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);\n  background-color: var(--cui-card-bg);\n  border: 1px solid var(--cui-card-border-color);\n  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;\n  height: 100%;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card.critical-card[_ngcontent-%COMP%] {\n  border-top: 4px solid var(--cui-danger);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card.high-card[_ngcontent-%COMP%] {\n  border-top: 4px solid var(--cui-warning);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card.other-card[_ngcontent-%COMP%] {\n  border-top: 4px solid var(--cui-primary);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem;\n  border-bottom: 1px solid var(--cui-card-border-color);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.75rem;\n  border-radius: 30px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge.critical[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-danger-rgb), 0.15);\n  color: var(--cui-danger);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge.high[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-warning-rgb), 0.15);\n  color: var(--cui-warning);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge.other[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-primary-rgb), 0.15);\n  color: var(--cui-primary);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .vuln-count[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--cui-body-color);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%] {\n  display: flex;\n  padding: 1.25rem 1rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  margin-right: 1rem;\n  background-color: var(--cui-tertiary-bg);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%] {\n  flex-grow: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-percent[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 600;\n  margin-bottom: 0.5rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%] {\n  height: 6px;\n  background-color: var(--cui-tertiary-bg);\n  border-radius: 3px;\n  overflow: hidden;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: 3px;\n  transition: width 0.8s ease-in-out;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar.critical-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-danger);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar.high-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-warning);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar.other-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-primary);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%] {\n  padding: 1rem;\n  border-top: 1px solid var(--cui-card-border-color);\n  background-color: var(--cui-tertiary-bg);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%]   .risk-level[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  font-weight: 600;\n  margin-bottom: 0.25rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%]   .action-required[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 1rem;\n  border-radius: 8px;\n  background-color: var(--cui-card-bg);\n  border: 1px solid var(--cui-card-border-color);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n  height: 100%;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  margin-right: 1rem;\n  background-color: var(--cui-tertiary-bg);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%] {\n  flex-grow: 1;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%]   .metric-title[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin-bottom: 0.25rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 700;\n  margin-bottom: 0.25rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%]   .metric-description[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card.autofix-card[_ngcontent-%COMP%] {\n  border-left: 3px solid var(--cui-success);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card.fixed-card[_ngcontent-%COMP%] {\n  border-left: 3px solid var(--cui-info);\n}\n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  background-color: var(--cui-card-bg);\n}\n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.05);\n}\n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n@keyframes _ngcontent-%COMP%_barFill {\n  from {\n    width: 0;\n  }\n  to {\n    width: 100%;\n  }\n}\n.vuln-bar[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_barFill 1s ease-out forwards;\n}\n@media (max-width: 768px) {\n  .dashboard-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start !important;\n  }\n  .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%] {\n    align-items: flex-start;\n    margin-top: 0.5rem;\n  }\n}\n/*# sourceMappingURL=team-vulnerability-summary.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeamVulnerabilitySummaryComponent, { className: "TeamVulnerabilitySummaryComponent" });
})();

// src/app/views/show-team/team-scan-info/team-scan-info.component.ts
var _c02 = () => ({ prop: "insertedDate", dir: "desc" });
var _c1 = (a0) => [a0];
function TeamScanInfoComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "c-spinner", 7);
    \u0275\u0275elementEnd();
  }
}
function TeamScanInfoComponent_div_9_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1, "Scan Date");
    \u0275\u0275elementEnd();
  }
}
function TeamScanInfoComponent_div_9_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 16);
    \u0275\u0275text(2, " \xA0 ");
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "span", 17);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r1 = ctx.row;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 1, row_r1.insertedDate, "medium"));
  }
}
function TeamScanInfoComponent_div_9_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1, "Cloud Subscription/Repository");
    \u0275\u0275elementEnd();
  }
}
function TeamScanInfoComponent_div_9_ng_template_7_div_3_small_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext(2).row;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Branch: ", row_r2.codeRepoBranch.name, "");
  }
}
function TeamScanInfoComponent_div_9_ng_template_7_div_3_br_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "br");
  }
}
function TeamScanInfoComponent_div_9_ng_template_7_div_3_small_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext(2).row;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("CommitId: ", row_r2.commitId, "");
  }
}
function TeamScanInfoComponent_div_9_ng_template_7_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275template(1, TeamScanInfoComponent_div_9_ng_template_7_div_3_small_1_Template, 2, 1, "small", 22)(2, TeamScanInfoComponent_div_9_ng_template_7_div_3_br_2_Template, 1, 0, "br", 5)(3, TeamScanInfoComponent_div_9_ng_template_7_div_3_small_3_Template, 2, 1, "small", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext().row;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r2 == null ? null : row_r2.codeRepoBranch == null ? null : row_r2.codeRepoBranch.name);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (row_r2 == null ? null : row_r2.codeRepoBranch == null ? null : row_r2.codeRepoBranch.name) && (row_r2 == null ? null : row_r2.commitId));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r2 == null ? null : row_r2.commitId);
  }
}
function TeamScanInfoComponent_div_9_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, TeamScanInfoComponent_div_9_ng_template_7_div_3_Template, 4, 3, "div", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = ctx.row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.target);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (row_r2 == null ? null : row_r2.codeRepoBranch == null ? null : row_r2.codeRepoBranch.name) || (row_r2 == null ? null : row_r2.commitId));
  }
}
function TeamScanInfoComponent_div_9_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "span", 14);
    \u0275\u0275text(2, "Results");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 25)(4, "span", 26);
    \u0275\u0275text(5, "C");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 27);
    \u0275\u0275text(7, "H");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 28);
    \u0275\u0275text(9, "M");
    \u0275\u0275elementEnd()()();
  }
}
function TeamScanInfoComponent_div_9_ng_template_10_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "c-badge", 30);
    \u0275\u0275text(2, " SCAN NOT PERFORMED ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("cTooltip", "Scan requested while previous was running or was run too early (limit: 1 scan per 10 minutes)");
  }
}
function TeamScanInfoComponent_div_9_ng_template_10_ng_template_1_div_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "span", 33);
    \u0275\u0275text(2, "Cloud");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 34);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 36);
    \u0275\u0275text(6, "\u2013");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 36);
    \u0275\u0275text(8, "\u2013");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext(2).row;
    \u0275\u0275advance(3);
    \u0275\u0275classProp("critical-active", row_r3.criticalFindings > 0)("zero", !row_r3.criticalFindings);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.criticalFindings || 0);
  }
}
function TeamScanInfoComponent_div_9_ng_template_10_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 32)(2, "span", 33);
    \u0275\u0275text(3, "SAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 34);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 34);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 34);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 32)(11, "span", 33);
    \u0275\u0275text(12, "SCA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 34);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 34);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 34);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 32)(20, "span", 33);
    \u0275\u0275text(21, "IaC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 34);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 34);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 34);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 32)(29, "span", 33);
    \u0275\u0275text(30, "Secrets");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span", 34);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 34);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span", 34);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 32)(38, "span", 33);
    \u0275\u0275text(39, "GitLab");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "span", 34);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "span", 34);
    \u0275\u0275text(43);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "span", 34);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 32)(47, "span", 33);
    \u0275\u0275text(48, "DAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "span", 34);
    \u0275\u0275text(50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "span", 34);
    \u0275\u0275text(52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "span", 34);
    \u0275\u0275text(54);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(55, TeamScanInfoComponent_div_9_ng_template_10_ng_template_1_div_55_Template, 9, 5, "div", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().row;
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r3.sastCritical > 0)("zero", !row_r3.sastCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.sastCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r3.sastHigh > 0)("zero", !row_r3.sastHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.sastHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r3.sastMedium > 0)("zero", !row_r3.sastMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.sastMedium || 0);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r3.scaCritical > 0)("zero", !row_r3.scaCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.scaCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r3.scaHigh > 0)("zero", !row_r3.scaHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.scaHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r3.scaMedium > 0)("zero", !row_r3.scaMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.scaMedium || 0);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r3.iacCritical > 0)("zero", !row_r3.iacCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.iacCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r3.iacHigh > 0)("zero", !row_r3.iacHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.iacHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r3.iacMedium > 0)("zero", !row_r3.iacMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.iacMedium || 0);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r3.secretsCritical > 0)("zero", !row_r3.secretsCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.secretsCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r3.secretsHigh > 0)("zero", !row_r3.secretsHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.secretsHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r3.secretsMedium > 0)("zero", !row_r3.secretsMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.secretsMedium || 0);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r3.gitlabCritical > 0)("zero", !row_r3.gitlabCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.gitlabCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r3.gitlabHigh > 0)("zero", !row_r3.gitlabHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.gitlabHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r3.gitlabMedium > 0)("zero", !row_r3.gitlabMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.gitlabMedium || 0);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("critical-active", row_r3.dastCritical > 0)("zero", !row_r3.dastCritical);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.dastCritical || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("high-active", row_r3.dastHigh > 0)("zero", !row_r3.dastHigh);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.dastHigh || 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("medium-active", row_r3.dastMedium > 0)("zero", !row_r3.dastMedium);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r3.dastMedium || 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r3.criticalFindings !== void 0);
  }
}
function TeamScanInfoComponent_div_9_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, TeamScanInfoComponent_div_9_ng_template_10_ng_container_0_Template, 3, 1, "ng-container", 29)(1, TeamScanInfoComponent_div_9_ng_template_10_ng_template_1_Template, 56, 91, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    const row_r3 = ctx.row;
    const normalResults_r4 = \u0275\u0275reference(2);
    \u0275\u0275property("ngIf", (row_r3 == null ? null : row_r3.sastCritical) === -1 || (row_r3 == null ? null : row_r3.sastHigh) === -1 || (row_r3 == null ? null : row_r3.sastMedium) === -1 || (row_r3 == null ? null : row_r3.scaCritical) === -1 || (row_r3 == null ? null : row_r3.scaHigh) === -1 || (row_r3 == null ? null : row_r3.scaMedium) === -1 || (row_r3 == null ? null : row_r3.iacCritical) === -1 || (row_r3 == null ? null : row_r3.iacHigh) === -1 || (row_r3 == null ? null : row_r3.iacMedium) === -1 || (row_r3 == null ? null : row_r3.secretsCritical) === -1 || (row_r3 == null ? null : row_r3.secretsHigh) === -1 || (row_r3 == null ? null : row_r3.secretsMedium) === -1)("ngIfElse", normalResults_r4);
  }
}
function TeamScanInfoComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "ngx-datatable", 8)(2, "ngx-datatable-column", 9);
    \u0275\u0275template(3, TeamScanInfoComponent_div_9_ng_template_3_Template, 2, 0, "ng-template", 10)(4, TeamScanInfoComponent_div_9_ng_template_4_Template, 6, 4, "ng-template", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ngx-datatable-column", 12);
    \u0275\u0275template(6, TeamScanInfoComponent_div_9_ng_template_6_Template, 2, 0, "ng-template", 10)(7, TeamScanInfoComponent_div_9_ng_template_7_Template, 4, 2, "ng-template", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "ngx-datatable-column", 13);
    \u0275\u0275template(9, TeamScanInfoComponent_div_9_ng_template_9_Template, 10, 0, "ng-template", 10)(10, TeamScanInfoComponent_div_9_ng_template_10_Template, 3, 2, "ng-template", 11);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("rows", ctx_r4.allScanInfos)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", ctx_r4.scanInfoLimit)("sorts", \u0275\u0275pureFunction1(10, _c1, \u0275\u0275pureFunction0(9, _c02)));
    \u0275\u0275advance();
    \u0275\u0275property("width", 170);
    \u0275\u0275advance(6);
    \u0275\u0275property("width", 320);
  }
}
var TeamScanInfoComponent = class _TeamScanInfoComponent {
  constructor() {
    this.scanInfoLoading = false;
    this.allScanInfos = [];
    this.scanInfoLimit = 15;
  }
  static {
    this.\u0275fac = function TeamScanInfoComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TeamScanInfoComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeamScanInfoComponent, selectors: [["app-team-scan-info"]], inputs: { scanInfoLoading: "scanInfoLoading", allScanInfos: "allScanInfos", scanInfoLimit: "scanInfoLimit" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 10, vars: 2, consts: [["normalResults", ""], [1, "d-flex", "align-items-stretch"], ["xs", "12"], [1, "mb-0", "text-center"], ["class", "d-flex justify-content-center align-items-center", "style", "height: 200px;", 4, "ngIf"], [4, "ngIf"], [1, "d-flex", "justify-content-center", "align-items-center", 2, "height", "200px"], ["color", "primary"], [1, "bootstrap", "scan-datatable", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit", "sorts"], ["name", "Scan Date", "prop", "insertedDate", 3, "width"], ["ngx-datatable-header-template", ""], ["ngx-datatable-cell-template", ""], ["name", "Cloud Subscription/Repository", "prop", "target"], ["name", "Results", 3, "width"], [1, "column-header"], [1, "date-cell"], ["cIcon", "", "name", "cil-calendar", 1, "date-icon"], [1, "scan-date"], [1, "target-cell"], [1, "target-main"], ["class", "target-sub", 4, "ngIf"], [1, "target-sub"], ["class", "text-muted", 4, "ngIf"], [1, "text-muted"], [1, "results-column-header"], [1, "column-legend"], [1, "legend-c"], [1, "legend-h"], [1, "legend-m"], [4, "ngIf", "ngIfElse"], ["color", "secondary", 3, "cTooltip"], [1, "results-grid"], [1, "results-grid-row"], [1, "grid-label"], [1, "grid-value"], ["class", "results-grid-row", 4, "ngIf"], [1, "grid-value", "zero"]], template: function TeamScanInfoComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-row", 1)(1, "c-col", 2)(2, "c-card")(3, "c-card-header")(4, "h5", 3)(5, "strong");
        \u0275\u0275text(6, "Scan Statistics");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(7, "c-card-body");
        \u0275\u0275template(8, TeamScanInfoComponent_div_8_Template, 2, 0, "div", 4)(9, TeamScanInfoComponent_div_9_Template, 11, 12, "div", 5);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(8);
        \u0275\u0275property("ngIf", ctx.scanInfoLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.scanInfoLoading);
      }
    }, dependencies: [
      RowComponent,
      ColComponent,
      CardComponent,
      CardHeaderComponent,
      CardBodyComponent,
      SpinnerComponent,
      NgxDatatableModule,
      DatatableComponent,
      DataTableColumnDirective,
      DataTableColumnHeaderDirective,
      DataTableColumnCellDirective,
      BadgeComponent,
      DatePipe,
      NgIf,
      FormsModule,
      IconDirective,
      TooltipDirective
    ], styles: ["\n\n.results-column-header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n}\n.results-column-header[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.results-column-header[_ngcontent-%COMP%]   .column-legend[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  margin-top: 2px;\n  font-size: 0.65rem;\n  font-weight: 700;\n  letter-spacing: 0.5px;\n}\n.results-column-header[_ngcontent-%COMP%]   .column-legend[_ngcontent-%COMP%]   .legend-c[_ngcontent-%COMP%] {\n  color: var(--cui-danger);\n}\n.results-column-header[_ngcontent-%COMP%]   .column-legend[_ngcontent-%COMP%]   .legend-h[_ngcontent-%COMP%] {\n  color: var(--cui-warning);\n}\n.results-column-header[_ngcontent-%COMP%]   .column-legend[_ngcontent-%COMP%]   .legend-m[_ngcontent-%COMP%] {\n  color: var(--cui-info);\n}\n.results-grid[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 4px 0;\n}\n.results-grid[_ngcontent-%COMP%]   .results-grid-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 58px 34px 34px 34px;\n  gap: 4px;\n  align-items: center;\n  padding: 3px 0;\n}\n.results-grid[_ngcontent-%COMP%]   .results-grid-row[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid rgba(128, 128, 128, 0.08);\n}\n.results-grid[_ngcontent-%COMP%]   .results-grid-row[_ngcontent-%COMP%]   .grid-label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 0.73rem;\n  color: var(--cui-secondary-color);\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n}\n.results-grid[_ngcontent-%COMP%]   .results-grid-row[_ngcontent-%COMP%]   .grid-value[_ngcontent-%COMP%] {\n  text-align: center;\n  font-weight: 600;\n  font-size: 0.73rem;\n  border-radius: 4px;\n  padding: 2px 4px;\n  line-height: 1.4;\n  transition: background-color 0.15s, color 0.15s;\n}\n.results-grid[_ngcontent-%COMP%]   .results-grid-row[_ngcontent-%COMP%]   .grid-value.zero[_ngcontent-%COMP%] {\n  color: var(--cui-tertiary-color);\n  opacity: 0.35;\n}\n.results-grid[_ngcontent-%COMP%]   .results-grid-row[_ngcontent-%COMP%]   .grid-value.critical-active[_ngcontent-%COMP%] {\n  background-color: var(--cui-danger);\n  color: #fff;\n}\n.results-grid[_ngcontent-%COMP%]   .results-grid-row[_ngcontent-%COMP%]   .grid-value.high-active[_ngcontent-%COMP%] {\n  background-color: var(--cui-warning);\n  color: #fff;\n}\n.results-grid[_ngcontent-%COMP%]   .results-grid-row[_ngcontent-%COMP%]   .grid-value.medium-active[_ngcontent-%COMP%] {\n  background-color: var(--cui-info);\n  color: #fff;\n}\n.scan-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.scan-datatable[_ngcontent-%COMP%]   .date-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.scan-datatable[_ngcontent-%COMP%]   .date-cell[_ngcontent-%COMP%]   .date-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  opacity: 0.7;\n}\n.scan-datatable[_ngcontent-%COMP%]   .date-cell[_ngcontent-%COMP%]   .scan-date[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n}\n.scan-datatable[_ngcontent-%COMP%]   .target-cell[_ngcontent-%COMP%]   .target-main[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.scan-datatable[_ngcontent-%COMP%]   .target-cell[_ngcontent-%COMP%]   .target-sub[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  line-height: 1.4;\n}\n/*# sourceMappingURL=team-scan-info.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeamScanInfoComponent, { className: "TeamScanInfoComponent" });
})();

// src/app/views/show-team/team-statistics-chart/team-statistics-chart.component.ts
var TeamStatisticsChartComponent = class _TeamStatisticsChartComponent {
  constructor() {
    this.openedFindings = 0;
    this.removedFindings = 0;
    this.reviewedFindings = 0;
    this.fixTime = 0;
    this.refreshDataEvent = new EventEmitter();
    this.isRefreshing = false;
    this.chartOptions = {};
  }
  ngOnInit() {
    this.initializeChartOptions();
  }
  initializeChartOptions() {
    if (this.options2) {
      this.chartOptions = this.options2;
    } else {
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            bodyFont: {
              size: 12
            },
            titleFont: {
              size: 14,
              weight: "bold"
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            suggestedMin: 0,
            ticks: {
              precision: 0
            }
          }
        },
        elements: {
          line: {
            tension: 0.4,
            // Smoother curves
            borderWidth: 2
          },
          point: {
            radius: 3,
            hoverRadius: 5,
            borderWidth: 2,
            backgroundColor: "white"
          }
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false
        }
      };
    }
  }
  refreshData() {
    this.isRefreshing = true;
    this.refreshDataEvent.emit();
    setTimeout(() => {
      this.isRefreshing = false;
    }, 1e3);
  }
  static {
    this.\u0275fac = function TeamStatisticsChartComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TeamStatisticsChartComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeamStatisticsChartComponent, selectors: [["app-team-statistics-chart"]], inputs: { chartLineData: "chartLineData", options2: "options2", openedFindings: "openedFindings", removedFindings: "removedFindings", reviewedFindings: "reviewedFindings", fixTime: "fixTime" }, outputs: { refreshDataEvent: "refreshDataEvent" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 63, vars: 16, consts: [["lg", "8", "md", "12"], [1, "statistics-card", "chart-card", "mb-4"], [1, "card-header"], [1, "title"], ["cTooltip", "Refresh data", 1, "refresh-button", 3, "click"], ["cIcon", "", "name", "cilSync"], [1, "chart-container"], ["type", "line", 3, "data", "options"], ["lg", "4", "md", "12"], [1, "statistics-card", "stats-card", "mb-4"], [1, "stats-container"], ["md", "6", "sm", "6", 1, "mb-3"], [1, "stat-widget", "info"], [1, "stat-header"], [1, "stat-title"], [1, "stat-icon"], ["cIcon", "", "name", "cilChartLine"], [1, "stat-value"], [1, "stat-progress"], [1, "progress-bar"], [1, "stat-widget", "success"], ["cIcon", "", "name", "cilInput"], [1, "stat-widget", "warning"], ["cIcon", "", "name", "cilBrush"], [1, "stat-widget", "danger"], ["cIcon", "", "name", "cilClock"]], template: function TeamStatisticsChartComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-row")(1, "c-col", 0)(2, "c-card", 1)(3, "c-card-header", 2)(4, "h5", 3);
        \u0275\u0275text(5, "Vulnerability Trend");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "div", 4);
        \u0275\u0275listener("click", function TeamStatisticsChartComponent_Template_div_click_6_listener() {
          return ctx.refreshData();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(7, "svg", 5);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(8, "c-card-body")(9, "div", 6);
        \u0275\u0275element(10, "c-chart", 7);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(11, "c-col", 8)(12, "c-card", 9)(13, "c-card-header", 2)(14, "h5", 3);
        \u0275\u0275text(15, "Key Metrics");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(16, "c-card-body")(17, "div", 10)(18, "c-row")(19, "c-col", 11)(20, "div", 12)(21, "div", 13)(22, "h6", 14);
        \u0275\u0275text(23, "OPENED FINDINGS");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(24, "div", 15);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(25, "svg", 16);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(26, "div", 17);
        \u0275\u0275text(27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "div", 18);
        \u0275\u0275element(29, "div", 19);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(30, "c-col", 11)(31, "div", 20)(32, "div", 13)(33, "h6", 14);
        \u0275\u0275text(34, "CLOSED FINDINGS");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(35, "div", 15);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(36, "svg", 21);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(37, "div", 17);
        \u0275\u0275text(38);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(39, "div", 18);
        \u0275\u0275element(40, "div", 19);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(41, "c-col", 11)(42, "div", 22)(43, "div", 13)(44, "h6", 14);
        \u0275\u0275text(45, "REVIEWED FINDINGS");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(46, "div", 15);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(47, "svg", 23);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(48, "div", 17);
        \u0275\u0275text(49);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(50, "div", 18);
        \u0275\u0275element(51, "div", 19);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(52, "c-col", 11)(53, "div", 24)(54, "div", 13)(55, "h6", 14);
        \u0275\u0275text(56, "TIME TO FIX [DAYS]");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(57, "div", 15);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(58, "svg", 25);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(59, "div", 17);
        \u0275\u0275text(60);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(61, "div", 18);
        \u0275\u0275element(62, "div", 19);
        \u0275\u0275elementEnd()()()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275classProp("refreshing", ctx.isRefreshing);
        \u0275\u0275advance(4);
        \u0275\u0275property("data", ctx.chartLineData)("options", ctx.chartOptions);
        \u0275\u0275advance(17);
        \u0275\u0275textInterpolate(ctx.openedFindings);
        \u0275\u0275advance(2);
        \u0275\u0275styleProp("width", 75, "%");
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate(ctx.removedFindings);
        \u0275\u0275advance(2);
        \u0275\u0275styleProp("width", 75, "%");
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate(ctx.reviewedFindings);
        \u0275\u0275advance(2);
        \u0275\u0275styleProp("width", 80, "%");
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate(ctx.fixTime);
        \u0275\u0275advance(2);
        \u0275\u0275styleProp("width", 65, "%");
      }
    }, dependencies: [
      RowComponent,
      ColComponent,
      CardComponent,
      CardHeaderComponent,
      CardBodyComponent,
      ChartjsComponent,
      IconDirective,
      TooltipDirective
    ], styles: ["\n\n.statistics-card[_ngcontent-%COMP%] {\n  height: 100%;\n  transition: box-shadow 0.2s ease;\n}\n.statistics-card[_ngcontent-%COMP%]:hover {\n  box-shadow: var(--cui-shadow);\n}\n.statistics-card[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.statistics-card[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-weight: 600;\n  margin: 0;\n}\n.statistics-card[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%]   .refresh-button[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.statistics-card[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%]   .refresh-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--cui-card-cap-bg);\n  transform: rotate(30deg);\n}\n.statistics-card[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%]   .refresh-button.refreshing[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n.statistics-card[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%]   .refresh-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n}\n.statistics-card[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%] {\n  position: relative;\n  height: 300px;\n  width: 100%;\n}\n.statistics-card[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%] {\n  padding: 1rem 0;\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget[_ngcontent-%COMP%] {\n  background-color: var(--cui-card-bg);\n  border-radius: var(--cui-border-radius);\n  padding: 1.25rem;\n  margin-bottom: 1rem;\n  transition: transform 0.2s ease;\n  border: 1px solid var(--cui-border-color);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget[_ngcontent-%COMP%]   .stat-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget[_ngcontent-%COMP%]   .stat-header[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget[_ngcontent-%COMP%]   .stat-header[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  color: white;\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget[_ngcontent-%COMP%]   .stat-header[_ngcontent-%COMP%]   .stat-title[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--cui-body-color);\n  opacity: 0.8;\n  margin: 0;\n  font-weight: 500;\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 700;\n  margin-bottom: 0.75rem;\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget[_ngcontent-%COMP%]   .stat-progress[_ngcontent-%COMP%] {\n  height: 6px;\n  background-color: rgba(0, 0, 0, 0.05);\n  border-radius: 1rem;\n  overflow: hidden;\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget[_ngcontent-%COMP%]   .stat-progress[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: 1rem;\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.info[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  background-color: var(--cui-info);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.info[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  color: var(--cui-info);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.info[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-info);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.success[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  background-color: var(--cui-success);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.success[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  color: var(--cui-success);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.success[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-success);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.warning[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  background-color: var(--cui-warning);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.warning[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  color: var(--cui-warning);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.warning[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-warning);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.danger[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  background-color: var(--cui-danger);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.danger[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  color: var(--cui-danger);\n}\n.statistics-card[_ngcontent-%COMP%]   .stat-widget.danger[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-danger);\n}\n@keyframes _ngcontent-%COMP%_spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@media (max-width: 992px) {\n  .statistics-card[_ngcontent-%COMP%] {\n    margin-bottom: 1.5rem;\n  }\n  .chart-card[_ngcontent-%COMP%], \n   .stats-card[_ngcontent-%COMP%] {\n    height: auto !important;\n  }\n}\n/*# sourceMappingURL=team-statistics-chart.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeamStatisticsChartComponent, { className: "TeamStatisticsChartComponent" });
})();

// src/app/views/show-team/show-team.component.ts
function ShowTeamComponent_option_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r1 = ctx.$implicit;
    \u0275\u0275property("ngValue", team_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", team_r1.name, " ");
  }
}
var ShowTeamComponent = class _ShowTeamComponent {
  storageKey() {
    return `teamFilters:${this.teamId || "unknown"}`;
  }
  saveFilterState() {
    try {
      const state = {
        filters: this.filters,
        showRemoved: this.showRemoved,
        showSuppressed: this.showSuppressed,
        showUrgent: this.showUrgent,
        showNotable: this.showNotable,
        statusFilter: this.statusFilter,
        vulnerabilitiesLimit: this.vulnerabilitiesLimit
      };
      localStorage.setItem(this.storageKey(), JSON.stringify(state));
    } catch (_) {
    }
  }
  restoreFilterState() {
    try {
      const raw = localStorage.getItem(this.storageKey());
      if (!raw)
        return;
      const state = JSON.parse(raw);
      if (state?.filters)
        this.filters = __spreadValues(__spreadValues({}, this.filters), state.filters);
      if (typeof state?.showRemoved === "boolean")
        this.showRemoved = state.showRemoved;
      if (typeof state?.showSuppressed === "boolean")
        this.showSuppressed = state.showSuppressed;
      if (typeof state?.vulnerabilitiesLimit === "number")
        this.vulnerabilitiesLimit = state.vulnerabilitiesLimit;
      if (typeof state?.showUrgent === "boolean")
        this.showUrgent = state.showUrgent;
      if (typeof state?.showNotable === "boolean")
        this.showNotable = state.showNotable;
      if (typeof state?.statusFilter === "string")
        this.statusFilter = state.statusFilter;
    } catch (_) {
    }
  }
  constructor(iconSet, repoService, cloudSubscriptionService, authService, router, route, cdr, datePipe, teamService, teamFindingsService, jiraService) {
    this.iconSet = iconSet;
    this.repoService = repoService;
    this.cloudSubscriptionService = cloudSubscriptionService;
    this.authService = authService;
    this.router = router;
    this.route = route;
    this.cdr = cdr;
    this.datePipe = datePipe;
    this.teamService = teamService;
    this.teamFindingsService = teamFindingsService;
    this.jiraService = jiraService;
    this.teamId = "";
    this.reposData = [];
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
    this.sourceStats = new TeamFindingSourceStatDTO();
    this.suppressReason = "";
    this.suppressReasons = ["WONT_FIX", "FALSE_POSITIVE", "ACCEPTED"];
    this.isAccordionVisible = [];
    this.teamFindingStats = [];
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
    this.cloudScanInfos = [];
    this.allScanInfos = [];
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
          stacked: false
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
          label: "GitLab",
          backgroundColor: "rgba(151, 187, 205, 0.2)",
          borderColor: "rgba(255,127,52,0.68)",
          pointBackgroundColor: "rgba(255,118,151,0.68)",
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
      component_name: "",
      source: "",
      status: "",
      severity: "",
      dates: ""
    };
    this.showRemoved = false;
    this.showSuppressed = false;
    this.showUrgent = false;
    this.showNotable = false;
    this.hasUrgentFindings = false;
    this.hasNotableFindings = false;
    this.statusFilter = "";
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
    this.jiraEnabled = false;
    this.teamIdForJira = null;
    this.position = "top-end";
    this.visible = false;
    this.percentage = 0;
    this.toastMessage = "";
    this.toastStatus = "";
    this.newComment = "";
    this.isAddingComment = false;
    iconSet.icons = __spreadValues(__spreadValues({}, brand_exports), free_exports);
    this.applyFilters();
  }
  ngAfterViewInit() {
  }
  ngOnInit() {
    this.userRole = localStorage.getItem("userRole");
    this.cdr.detectChanges();
    this.route.paramMap.subscribe((params) => {
      this.teamId = params.get("id") || "";
      this.teamIdForJira = +this.teamId || null;
      this.checkJiraConfig();
    });
    this.authService.hc().subscribe({
      next: () => {
      },
      error: () => {
        this.router.navigate(["/login"]);
      }
    });
    this.loadTeamInfo();
    this.loadCodeReposAndCloudSubscriptionsInfo();
    this.loadSourceStats();
    this.loadFindings();
    this.loadFindingStats();
  }
  loadTeamInfo() {
    this.teamService.getTeam(this.teamId).subscribe({
      next: (response) => {
        this.teamData = response;
      },
      error: (error) => {
        console.error("Error loading teams:", error);
      }
    });
  }
  loadCodeReposAndCloudSubscriptionsInfo() {
    this.scanInfoLoading = true;
    const reposObservable = this.repoService.getReposByTeam(+this.teamId);
    const cloudSubscriptionsObservable = this.cloudSubscriptionService.getCloudSubscriptionsByTeam(+this.teamId);
    forkJoin([reposObservable, cloudSubscriptionsObservable]).subscribe({
      next: ([reposResponse, cloudSubscriptionsResponse]) => {
        this.reposData = Array.isArray(reposResponse) ? reposResponse : [];
        this.cloudSubscriptionsData = Array.isArray(cloudSubscriptionsResponse) ? cloudSubscriptionsResponse : [];
        this.scanInfos = this.reposData.flatMap((item) => (item.scanInfos || []).map((scanInfo) => __spreadProps(__spreadValues({}, scanInfo), { target: item.target })));
        this.cloudScanInfos = this.cloudSubscriptionsData.flatMap((item) => (item.cloudScanInfos || []).map((cloudScanInfo) => __spreadProps(__spreadValues({}, cloudScanInfo), { target: item.external_project_name })));
        this.allScanInfos = [...this.scanInfos, ...this.cloudScanInfos];
        this.scanInfoLoading = false;
        this.checkScanStatus();
      },
      error: () => {
        this.scanInfoLoading = false;
      }
    });
  }
  checkScanStatus() {
    const reposRunning = Array.isArray(this.reposData) && this.reposData.some((repo) => repo.sast === "RUNNING" || repo.sca === "RUNNING" || repo.secrets === "RUNNING" || repo.iac === "RUNNING" || repo.gitlab === "RUNNING" || repo.dast === "RUNNING");
    const cloudRunning = Array.isArray(this.cloudSubscriptionsData) && this.cloudSubscriptionsData.some((cloud) => cloud.scan_status === "RUNNING");
    this.scanRunning = reposRunning || cloudRunning;
  }
  loadFindings() {
    this.vulnerabilitiesLoading = true;
    this.teamFindingsService.getFindingsByTeam(+this.teamId).subscribe({
      next: (response) => {
        this.vulns = (response || []).map((v, i) => __spreadProps(__spreadValues({}, v), { __idx: i }));
        this.filteredVulns = [...this.vulns];
        this.counts = this.countFindings(this.vulns);
        this.checkForSpecialFindings();
        this.applyFilters();
        this.vulnerabilitiesLoading = false;
      },
      error: () => {
        this.vulnerabilitiesLoading = false;
      }
    });
  }
  loadFindingStats() {
    this.teamFindingsService.getTeamFindingStats(+this.teamId).subscribe({
      next: (response) => {
        if (response && response.codeReposStats && response.cloudSubscriptionsStats) {
          const combinedStats = [
            ...response.codeReposStats.map((stat) => ({
              date: stat.date,
              sastCritical: stat.sastCritical ?? 0,
              sastHigh: stat.sastHigh ?? 0,
              sastMedium: stat.sastMedium ?? 0,
              sastRest: stat.sastRest ?? 0,
              dastCritical: stat.sastCritical ?? 0,
              dastHigh: stat.sastHigh ?? 0,
              dastMedium: stat.sastMedium ?? 0,
              dastRest: stat.sastRest ?? 0,
              scaCritical: stat.scaCritical ?? 0,
              scaHigh: stat.scaHigh ?? 0,
              scaMedium: stat.scaMedium ?? 0,
              scaRest: stat.scaRest ?? 0,
              iacCritical: stat.iacCritical ?? 0,
              iacHigh: stat.iacHigh ?? 0,
              iacMedium: stat.iacMedium ?? 0,
              iacRest: stat.iacRest ?? 0,
              secretsCritical: stat.secretsCritical ?? 0,
              secretsHigh: stat.secretsHigh ?? 0,
              secretsMedium: stat.secretsMedium ?? 0,
              secretsRest: stat.secretsRest ?? 0,
              gitlabCritical: stat.gitlabCritical ?? 0,
              gitlabHigh: stat.gitlabHigh ?? 0,
              gitlabMedium: stat.gitlabMedium ?? 0,
              gitlabRest: stat.gitlabRest ?? 0,
              criticalFindings: 0,
              // No cloud data in codeReposStats
              highFindings: 0,
              // No cloud data in codeReposStats
              openedFindings: stat.openedFindings ?? 0,
              removedFindings: stat.removedFindings ?? 0,
              reviewedFindings: stat.reviewedFindings ?? 0,
              averageFixTime: stat.averageFixTime ?? 0
            })),
            ...response.cloudSubscriptionsStats.map((stat) => ({
              date: stat.date,
              sastCritical: 0,
              // No SAST data in cloudSubscriptionsStats
              sastHigh: 0,
              sastMedium: 0,
              sastRest: 0,
              scaCritical: 0,
              // No SCA data in cloudSubscriptionsStats
              scaHigh: 0,
              scaMedium: 0,
              scaRest: 0,
              iacCritical: 0,
              // No IaC data in cloudSubscriptionsStats
              iacHigh: 0,
              iacMedium: 0,
              iacRest: 0,
              secretsCritical: 0,
              // No Secrets data in cloudSubscriptionsStats
              secretsHigh: 0,
              secretsMedium: 0,
              secretsRest: 0,
              gitlabCritical: 0,
              // No Secrets data in cloudSubscriptionsStats
              gitlabHigh: 0,
              gitlabMedium: 0,
              gitlabRest: 0,
              criticalFindings: stat.criticalFindings ?? 0,
              highFindings: stat.highFindings ?? 0,
              openedFindings: 0,
              // No openedFindings in cloudSubscriptionsStats
              removedFindings: 0,
              // No removedFindings in cloudSubscriptionsStats
              reviewedFindings: 0,
              // No reviewedFindings in cloudSubscriptionsStats
              averageFixTime: 0
              // No averageFixTime in cloudSubscriptionsStats
            }))
          ];
          this.teamFindingStats = this.combineStatsByDate(combinedStats);
          this.prepareChartData();
        } else {
          console.error("Unexpected response format:", response);
        }
      },
      error: (error) => {
        console.error("Error loading team finding stats:", error);
      }
    });
  }
  combineStatsByDate(stats) {
    const combinedMap = {};
    stats.forEach((stat) => {
      const date = stat.date;
      if (!combinedMap[date]) {
        combinedMap[date] = {
          date,
          sastCritical: 0,
          sastHigh: 0,
          sastMedium: 0,
          sastRest: 0,
          scaCritical: 0,
          scaHigh: 0,
          scaMedium: 0,
          scaRest: 0,
          iacCritical: 0,
          iacHigh: 0,
          iacMedium: 0,
          iacRest: 0,
          secretsCritical: 0,
          secretsHigh: 0,
          secretsMedium: 0,
          secretsRest: 0,
          gitlabCritical: 0,
          gitlabHigh: 0,
          gitlabMedium: 0,
          gitlabRest: 0,
          criticalFindings: 0,
          highFindings: 0,
          openedFindings: 0,
          removedFindings: 0,
          reviewedFindings: 0,
          totalFixTime: 0,
          // Track total fix time
          fixTimeCount: 0
          // Track count of entries for averaging
        };
      }
      combinedMap[date].sastCritical += stat.sastCritical ?? 0;
      combinedMap[date].sastHigh += stat.sastHigh ?? 0;
      combinedMap[date].sastMedium += stat.sastMedium ?? 0;
      combinedMap[date].sastRest += stat.sastRest ?? 0;
      combinedMap[date].scaCritical += stat.scaCritical ?? 0;
      combinedMap[date].scaHigh += stat.scaHigh ?? 0;
      combinedMap[date].scaMedium += stat.scaMedium ?? 0;
      combinedMap[date].scaRest += stat.scaRest ?? 0;
      combinedMap[date].iacCritical += stat.iacCritical ?? 0;
      combinedMap[date].iacHigh += stat.iacHigh ?? 0;
      combinedMap[date].iacMedium += stat.iacMedium ?? 0;
      combinedMap[date].iacRest += stat.iacRest ?? 0;
      combinedMap[date].secretsCritical += stat.secretsCritical ?? 0;
      combinedMap[date].secretsHigh += stat.secretsHigh ?? 0;
      combinedMap[date].secretsMedium += stat.secretsMedium ?? 0;
      combinedMap[date].secretsRest += stat.secretsRest ?? 0;
      combinedMap[date].gitlabCritical += stat.gitlabCritical ?? 0;
      combinedMap[date].gitlabHigh += stat.gitlabHigh ?? 0;
      combinedMap[date].gitlabMedium += stat.gitlabMedium ?? 0;
      combinedMap[date].gitlabRest += stat.gitlabRest ?? 0;
      combinedMap[date].criticalFindings += stat.criticalFindings ?? 0;
      combinedMap[date].highFindings += stat.highFindings ?? 0;
      combinedMap[date].openedFindings += stat.openedFindings ?? 0;
      combinedMap[date].removedFindings += stat.removedFindings ?? 0;
      combinedMap[date].reviewedFindings += stat.reviewedFindings ?? 0;
      if (stat.averageFixTime !== void 0 && stat.averageFixTime > 0) {
        combinedMap[date].totalFixTime += stat.averageFixTime;
        combinedMap[date].fixTimeCount += 1;
      }
    });
    return Object.values(combinedMap).map((entry) => {
      if (entry.fixTimeCount > 0) {
        entry.averageFixTime = entry.totalFixTime / entry.fixTimeCount;
      } else {
        entry.averageFixTime = 0;
      }
      delete entry.totalFixTime;
      delete entry.fixTimeCount;
      return entry;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  loadSourceStats() {
    this.teamFindingsService.getTeamFindingSourceStats(+this.teamId).subscribe({
      next: (response) => {
        this.sourceStats = response;
        this.chartPieData = {
          labels: ["SAST", "SCA", "Secrets", "IaC", "GitLab", "Cloud"],
          datasets: [
            {
              data: [
                this.sourceStats.sast,
                this.sourceStats.sca,
                this.sourceStats.secrets,
                this.sourceStats.iac,
                this.sourceStats.gitlab,
                this.sourceStats.cloud
              ],
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#3eabb7",
                "#FFCE12",
                "#CF78DCFF"
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#449a77",
                "#FFCE12",
                "#CF78DCFF"
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
  toggleToast() {
    this.visible = !this.visible;
  }
  click(row) {
    this.selectedRowId = row.id;
    this.detailsModal = true;
    this.teamFindingsService.getFindingByTeam(+this.teamId, this.selectedRowId).subscribe({
      next: (response) => {
        this.singleVuln = response;
        this.cdr.markForCheck();
      }
    });
  }
  updateFilterName(event) {
    const val = event.target.value.toLowerCase();
    this.filters["name"] = val;
    this.applyFilters();
    this.saveFilterState();
  }
  updateFilterLocation(event) {
    const val = (event?.target?.value ?? "").toString().toLowerCase();
    this.filters["location"] = val;
    this.applyFilters();
    this.saveFilterState();
  }
  updateFilterComponent(event) {
    const val = event.target.value.toLowerCase();
    this.filters["component_name"] = val;
    this.applyFilters();
    this.saveFilterState();
  }
  updateFilterSource(event) {
    const val = event.target.value;
    this.filters["source"] = val;
    this.applyFilters();
    this.saveFilterState();
  }
  updateFilterStatus(event) {
    const valRaw = event.target.value;
    const val = (valRaw || "").toUpperCase();
    this.filters["status"] = val;
    this.statusFilter = val;
    if (val === "SUPPRESSED" || val === "SUPRESSED") {
      this.showSuppressed = true;
      this.showRemoved = false;
    } else if (val === "REMOVED") {
      this.showRemoved = true;
      this.showSuppressed = false;
    } else if (val === "NEW" || val === "EXISTING" || val === "") {
      this.showRemoved = false;
      this.showSuppressed = false;
    }
    this.applyFilters();
    this.saveFilterState();
  }
  updateFilterSeverity(event) {
    const val = event.target.value;
    this.filters["severity"] = val;
    this.applyFilters();
    this.saveFilterState();
  }
  toggleShowUrgent(event) {
    this.showUrgent = !!event?.target?.checked;
    if (this.showUrgent) {
      this.showNotable = false;
    }
    this.applyFilters();
    this.saveFilterState();
  }
  toggleShowNotable(event) {
    this.showNotable = !!event?.target?.checked;
    if (this.showNotable) {
      this.showUrgent = false;
    }
    this.applyFilters();
    this.saveFilterState();
  }
  checkForSpecialFindings() {
    this.hasUrgentFindings = this.vulns.some((v) => v.urgency === "urgent" && v.status !== "REMOVED" && v.status !== "SUPRESSED");
    this.hasNotableFindings = this.vulns.some((v) => v.urgency === "notable" && v.status !== "REMOVED" && v.status !== "SUPRESSED");
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
  toggleShowRemoved(event) {
    this.showRemoved = event.target.checked;
    this.applyFilters();
    this.saveFilterState();
  }
  toggleShowSuppressed(event) {
    this.showSuppressed = event.target.checked;
    this.applyFilters();
    this.saveFilterState();
  }
  applyFilters() {
    this.filteredVulns = this.vulns.filter((vuln) => {
      const matchesFilters = Object.keys(this.filters).every((key) => {
        const filterValue = this.filters[key];
        if (!filterValue)
          return true;
        const fv = filterValue.toString().toLowerCase();
        if (key === "source" || key === "status" || key === "severity" || key === "urgency") {
          const v = vuln[key];
          return typeof v === "string" && v.toLowerCase() === fv;
        }
        if (key === "location") {
          const loc = vuln.location ? vuln.location.toString().toLowerCase() : "";
          const repo = vuln.repoUrl ? vuln.repoUrl.toString().toLowerCase() : "";
          return loc.includes(fv) || repo.includes(fv);
        }
        const raw = vuln[key];
        if (raw === void 0 || raw === null)
          return false;
        return raw.toString().toLowerCase().includes(fv);
      });
      const statusUpper = (vuln.status || "").toUpperCase();
      const isRemoved = statusUpper === "REMOVED";
      const isSuppressed = statusUpper === "SUPPRESSED" || statusUpper === "SUPRESSED";
      const matchesStatus = (this.showRemoved || !isRemoved) && (this.showSuppressed || !isSuppressed);
      const matchesUrgency = () => {
        if (this.showUrgent)
          return vuln.urgency === "urgent";
        if (this.showNotable)
          return vuln.urgency === "notable";
        return true;
      };
      return matchesFilters && matchesStatus && matchesUrgency();
    });
    this.sortByUrgencyThenOriginal(this.filteredVulns);
    this.saveFilterState();
  }
  handleDetailsModal(visible) {
    this.detailsModal = visible;
  }
  closeModal() {
    this.detailsModal = false;
  }
  refreshData() {
    alert("clicked");
  }
  suppressFinding() {
    console.log(this.suppressReason);
    if (this.selectedRowId && this.suppressReason) {
      this.teamFindingsService.supressFinding(+this.teamId, this.selectedRowId, this.suppressReason).subscribe({
        next: (response) => {
          this.toastStatus = "success";
          this.toastMessage = "Successfully Suppressed finding";
          this.toggleToast();
          this.loadFindings();
        }
      });
    }
    console.log(this.teamId, this.selectedRowId, this.suppressReason);
    this.closeModal();
    this.applyFilters();
  }
  // toggleToast() {
  //     this.visible = !this.visible;
  // }
  onVisibleChange($event) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }
  reactivateFinding() {
    if (this.selectedRowId) {
      this.teamFindingsService.reActivateFinding(+this.teamId, this.selectedRowId).subscribe({
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
  //
  // groupAppDataTypesByCategory(appDataTypes: AppDataType[]): GroupedAppDataType[] {
  //     const categoryGroupMap: { [key: string]: AppDataType[] } = {};
  //
  //     appDataTypes.forEach((appDataType) => {
  //         appDataType.categoryGroups.forEach((categoryGroup) => {
  //             if (!categoryGroupMap[categoryGroup]) {
  //                 categoryGroupMap[categoryGroup] = [];
  //             }
  //
  //             // Check if appDataType already exists in the category group based on a unique property
  //             const isDuplicate = categoryGroupMap[categoryGroup].some(
  //                 (existingAppDataType) =>
  //                     existingAppDataType.id === appDataType.id ||
  //                     existingAppDataType.name === appDataType.name
  //             );
  //
  //             if (!isDuplicate) {
  //                 categoryGroupMap[categoryGroup].push(appDataType);
  //             }
  //         });
  //     });
  //
  //     return Object.keys(categoryGroupMap).map((categoryGroup) => ({
  //         categoryGroup,
  //         appDataTypes: categoryGroupMap[categoryGroup],
  //     }));
  // }
  //
  // toggleAccordion(index: number): void {
  //     this.isAccordionVisible[index] = !this.isAccordionVisible[index];
  // }
  //
  // getKeys(obj: any): string[] {
  //     return Object.keys(obj);
  // }
  prepareChartData() {
    if (!this.teamFindingStats || this.teamFindingStats.length === 0) {
      console.log("No stats data available");
      return;
    }
    const sortedStats = [...this.teamFindingStats].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    const labels = sortedStats.map((stat) => {
      return stat.date ? this.datePipe.transform(stat.date, "MMM dd, yyyy") || "Invalid Date" : "No Date";
    });
    const datasets = [
      {
        label: "SAST",
        data: sortedStats.map((stat) => (stat.sastCritical || 0) + (stat.sastHigh || 0) + (stat.sastMedium || 0) + (stat.sastRest || 0)),
        backgroundColor: "rgba(220, 220, 220, 0.2)",
        borderColor: "rgba(220, 220, 220, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: "SCA",
        data: sortedStats.map((stat) => (stat.scaCritical || 0) + (stat.scaHigh || 0) + (stat.scaMedium || 0) + (stat.scaRest || 0)),
        backgroundColor: "rgba(151, 187, 205, 0.2)",
        borderColor: "rgb(71, 180, 234)",
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: "IaC",
        data: sortedStats.map((stat) => (stat.iacCritical || 0) + (stat.iacHigh || 0) + (stat.iacMedium || 0) + (stat.iacRest || 0)),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: "Secrets",
        data: sortedStats.map((stat) => (stat.secretsCritical || 0) + (stat.secretsHigh || 0) + (stat.secretsMedium || 0) + (stat.secretsRest || 0)),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: "GitLab",
        data: sortedStats.map((stat) => (stat.gitlabCritical || 0) + (stat.gitlabHigh || 0) + (stat.gitlabMedium || 0) + (stat.gitlabRest || 0)),
        backgroundColor: "rgba(255,60,68,0.76)",
        borderColor: "rgb(237,104,60)",
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: "Cloud",
        data: sortedStats.map((stat) => (stat.criticalFindings || 0) + (stat.highFindings || 0)),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ];
    this.chartLineData = {
      labels,
      datasets
    };
  }
  getLastOpenedFindings() {
    return this.teamFindingStats.length > 0 ? this.teamFindingStats[this.teamFindingStats.length - 1].openedFindings : 0;
  }
  getLastRemovedFinding() {
    return this.teamFindingStats.length > 0 ? this.teamFindingStats[this.teamFindingStats.length - 1].removedFindings : 0;
  }
  getLastFixTime() {
    return this.teamFindingStats.length > 0 ? this.teamFindingStats[this.teamFindingStats.length - 1].averageFixTime : 0;
  }
  getLastRevievedFinding() {
    return this.teamFindingStats.length > 0 ? this.teamFindingStats[this.teamFindingStats.length - 1].reviewedFindings ?? 0 : 0;
  }
  //
  // updateFilterGroup(event: any) {
  //     const val = event.target.value.toLowerCase();
  //     this.filtersNew['group'] = val;
  //     this.applyFiltersNew();
  // }
  //
  // updateFilterNameNew(event: any) {
  //     const val = event.target.value.toLowerCase();
  //     this.filtersNew['name'] = val;
  //     this.applyFiltersNew();
  // }
  //
  // updateFilterVersion(event: any) {
  //     const val = event.target.value.toLowerCase();
  //     this.filtersNew['version'] = val;
  //     this.applyFiltersNew();
  // }
  //
  // applyFiltersNew() {
  //     this.filteredComponents = this.reposData?.components.filter(
  //         (component: { groupid: string; name: string; version: string }) => {
  //             return (
  //                 (!this.filtersNew['group'] ||
  //                     component.groupid?.toLowerCase().includes(this.filtersNew['group'])) &&
  //                 (!this.filtersNew['name'] ||
  //                     component.name?.toLowerCase().includes(this.filtersNew['name'])) &&
  //                 (!this.filtersNew['version'] ||
  //                     component.version?.toLowerCase().includes(this.filtersNew['version']))
  //             );
  //         }
  //     );
  // }
  //
  // protected readonly JSON = JSON;
  //
  // runScan() {
  //     this.repoService.runScan(+this.repoId).subscribe({
  //         next: (response) => {
  //             this.toastStatus = 'success';
  //             this.toastMessage = 'Successfully requested a scan';
  //             this.toggleToast();
  //             this.loadRepoInfo();
  //         },
  //     });
  // }
  //
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
      this.teamFindingsService.suppressMultipleTeamFindings(+this.teamId, this.selectedFindings).subscribe({
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
  addComment() {
    if (!this.newComment?.trim() || this.isAddingComment || this.selectedRowId === null) {
      return;
    }
    const findingId = this.selectedRowId;
    const source = this.vulns.find((finding) => finding.id == findingId)?.source;
    const target = this.vulns.find((finding) => finding.id == findingId)?.component_name;
    this.isAddingComment = true;
    if (source == "CLOUD_SCANNER") {
      const cloudSubscriptionId = this.cloudSubscriptionsData.find((cloudSubscription) => cloudSubscription.external_project_name == target)?.id;
      this.cloudSubscriptionService.addComment(+cloudSubscriptionId, findingId, this.newComment.trim()).subscribe({
        next: () => {
          if (findingId !== null) {
            this.cloudSubscriptionService.getFinding(+cloudSubscriptionId, findingId).subscribe({
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
    } else {
      const repoId = this.reposData.find((repo) => repo.target == target)?.id;
      this.repoService.addComment(+repoId, findingId, this.newComment.trim()).subscribe({
        next: () => {
          if (findingId !== null) {
            this.repoService.getFinding(+repoId, findingId).subscribe({
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
  }
  getRepositoryLink() {
    if (!this.singleVuln?.vulnsResponseDto?.location) {
      return "#";
    }
    const id = this.singleVuln.vulnsResponseDto.id;
    const target = this.vulns.find((finding) => finding.id == id)?.component_name;
    const repoUrl = this.reposData.find((repo) => repo.target == target)?.repo_url;
    if (!repoUrl)
      return "#";
    return repoUrl;
  }
  getFormattedLocation() {
    if (!this.singleVuln?.vulnsResponseDto?.location) {
      return "Location not available";
    }
    const location = this.singleVuln.vulnsResponseDto.location;
    const match = location.match(/(.*):(\d+)/);
    if (!match)
      return location;
    const [, filePath, lineNumber] = match;
    const fileName = filePath.split("/").pop();
    return `${fileName}:${lineNumber}`;
  }
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
    this.showUrgent = false;
    this.showNotable = false;
    this.statusFilter = "";
    this.applyFilters();
    this.saveFilterState();
  }
  // openChangeTeamModal() {
  //     // Load available teams first
  //     this.teamService.get().subscribe({
  //         next: (teams: Team[]) => {
  //             this.availableTeams = teams.filter(team => team.id !== this.reposData?.team?.id);
  //             this.changeTeamModalVisible = true;
  //         },
  //         error: (error: any) => {
  //             this.toastStatus = 'danger';
  //             this.toastMessage = 'Error loading teams';
  //             this.toggleToast();
  //         }
  //     });
  // }
  //
  // executeTeamChange() {
  //     if (this.confirmationText === 'accept' && this.selectedNewTeamId) {
  //         this.repoService.changeTeam(this.reposData.id, this.selectedNewTeamId).subscribe({
  //             next: () => {
  //                 this.toastStatus = 'success';
  //                 this.toastMessage = 'Team changed successfully';
  //                 this.toggleToast();
  //                 this.loadRepoInfo();
  //             },
  //             error: (error: any) => {
  //                 this.toastStatus = 'danger';
  //                 this.toastMessage = error.error?.message || 'Error changing team';
  //                 this.toggleToast();
  //             },
  //             complete: () => {
  //                 this.confirmationModalVisible = false;
  //                 this.confirmationText = '';
  //                 this.selectedNewTeamId = null;
  //             }
  //         });
  //     }
  // }
  // closeChangeTeamModal() {
  //     this.changeTeamModalVisible = false;
  //     this.selectedNewTeamId = 0;
  // }
  //
  // confirmTeamChange() {
  //     this.changeTeamModalVisible = false;
  //     this.confirmationModalVisible = true;
  // }
  //
  // closeConfirmationModal() {
  //     this.confirmationModalVisible = false;
  //     this.confirmationText = '';
  // }
  // ============ JIRA Integration ============
  checkJiraConfig() {
    if (this.teamIdForJira) {
      this.jiraService.getConfiguration(this.teamIdForJira).subscribe({
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
    if (!this.teamIdForJira)
      return;
    this.jiraService.createTicket(this.teamIdForJira, findingId).subscribe({
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
    if (!this.teamIdForJira || findingIds.length === 0)
      return;
    this.jiraService.createTicketsBulk(this.teamIdForJira, findingIds).subscribe({
      next: (response) => {
        this.toastStatus = "success";
        this.toastMessage = response.message;
        this.visible = true;
        this.loadFindings();
        this.bulkActionMode = false;
        this.selectedFindings = [];
      },
      error: () => {
        this.toastStatus = "danger";
        this.toastMessage = "Error creating JIRA tickets";
        this.visible = true;
      }
    });
  }
  static {
    this.\u0275fac = function ShowTeamComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ShowTeamComponent)(\u0275\u0275directiveInject(IconSetService), \u0275\u0275directiveInject(RepoService), \u0275\u0275directiveInject(CloudSubscriptionService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(DatePipe), \u0275\u0275directiveInject(TeamService), \u0275\u0275directiveInject(TeamFindingsService), \u0275\u0275directiveInject(JiraService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ShowTeamComponent, selectors: [["app-show-team"]], standalone: true, features: [\u0275\u0275ProvidersFeature([DatePipe, provideMarkdown()]), \u0275\u0275StandaloneFeature], decls: 73, vars: 53, consts: [[1, "dashboard-container"], [1, "dashboard-header"], [3, "teamData", "reposData", "cloudSubscriptionsData", "chartPieData"], [1, "mt-4"], [3, "counts", "icons"], [1, "team-tabs-container", "mt-4"], ["variant", "underline-border"], ["cTab", "", 3, "itemKey"], ["cIcon", "", "name", "cil-bug", 1, "me-2"], ["cIcon", "", "name", "cil-chart-line", 1, "me-2"], ["cIcon", "", "name", "cil-magnifying-glass", 1, "me-2"], ["cIcon", "", "name", "cil-bell", 1, "me-2"], ["cIcon", "", "name", "cil-info", 1, "me-2"], [1, "tab-content-panel", 3, "itemKey"], [3, "updateFilterNameEvent", "updateFilterLocationEvent", "updateFilterComponentEvent", "updateFilterSourceEvent", "updateFilterStatusEvent", "updateFilterSeverityEvent", "toggleShowRemovedEvent", "toggleShowSuppressedEvent", "toggleBulkActionEvent", "selectAllFindingsEvent", "onSelectFindingEvent", "suppressSelectedFindingsEvent", "vulnerabilitiesLimitChange", "viewVulnerabilityDetailsEvent", "toggleShowNotableEvent", "toggleShowUrgentEvent", "createJiraTicketEvent", "createJiraTicketsBulkEvent", "clearFiltersEvent", "filteredVulns", "showRemoved", "showSuppressed", "bulkActionMode", "selectedFindings", "vulnerabilitiesLoading", "vulnerabilitiesLimit", "jiraEnabled", "teamId"], [3, "refreshDataEvent", "chartLineData", "options2", "openedFindings", "removedFindings", "reviewedFindings", "fixTime"], [3, "scanInfoLoading", "allScanInfos", "scanInfoLimit"], [1, "notification-message"], ["cIcon", "", "name", "cil-info", "width", "24", "height", "24"], [1, "message-content"], [3, "handleDetailsModalEvent", "closeModalEvent", "suppressFindingEvent", "reactivateFindingEvent", "addCommentEvent", "newCommentChange", "detailsModal", "selectedRowId", "singleVuln", "suppressReason", "suppressReasons", "reposData", "isAddingComment", "newComment", "vulns", "teamId"], ["position", "fixed", 1, "p-3", "toast-container", 3, "placement"], [3, "visibleChange", "color", "visible"], ["cIcon", "", "name", "cilBell", 1, "me-2"], ["id", "changeTeamModal", "alignment", "center", 1, "modal-container", 3, "visibleChange", "visible"], ["cModalTitle", ""], [1, "modal-body"], [1, "mb-3"], ["cLabel", "", "for", "newTeamSelect", 1, "form-label"], ["id", "newTeamSelect", 1, "form-select", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [3, "ngValue", 4, "ngFor", "ngForOf"], ["cButton", "", "color", "secondary", 3, "click"], ["cButton", "", "color", "primary", 3, "disabled"]], template: function ShowTeamComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
        \u0275\u0275element(2, "app-team-info", 2);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "div", 3);
        \u0275\u0275element(4, "app-team-vulnerability-summary", 4);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "div", 5)(6, "c-card")(7, "c-tabs")(8, "c-tabs-list", 6)(9, "button", 7);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(10, "svg", 8);
        \u0275\u0275text(11, " Vulnerabilities ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(12, "button", 7);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(13, "svg", 9);
        \u0275\u0275text(14, " Statistics & Trends ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(15, "button", 7);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(16, "svg", 10);
        \u0275\u0275text(17, " Scan Info ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(18, "button", 7);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(19, "svg", 11);
        \u0275\u0275text(20, " Notifications ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(21, "button", 7);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(22, "svg", 12);
        \u0275\u0275text(23, " Additional Info ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(24, "c-tabs-content")(25, "c-tab-panel", 13)(26, "app-team-vulnerabilities-table", 14);
        \u0275\u0275listener("updateFilterNameEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_updateFilterNameEvent_26_listener($event) {
          return ctx.updateFilterName($event);
        })("updateFilterLocationEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_updateFilterLocationEvent_26_listener($event) {
          return ctx.updateFilterLocation($event);
        })("updateFilterComponentEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_updateFilterComponentEvent_26_listener($event) {
          return ctx.updateFilterComponent($event);
        })("updateFilterSourceEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_updateFilterSourceEvent_26_listener($event) {
          return ctx.updateFilterSource($event);
        })("updateFilterStatusEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_updateFilterStatusEvent_26_listener($event) {
          return ctx.updateFilterStatus($event);
        })("updateFilterSeverityEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_updateFilterSeverityEvent_26_listener($event) {
          return ctx.updateFilterSeverity($event);
        })("toggleShowRemovedEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_toggleShowRemovedEvent_26_listener($event) {
          return ctx.toggleShowRemoved($event);
        })("toggleShowSuppressedEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_toggleShowSuppressedEvent_26_listener($event) {
          return ctx.toggleShowSuppressed($event);
        })("toggleBulkActionEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_toggleBulkActionEvent_26_listener() {
          return ctx.toggleBulkAction();
        })("selectAllFindingsEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_selectAllFindingsEvent_26_listener($event) {
          return ctx.selectAllFindings($event);
        })("onSelectFindingEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_onSelectFindingEvent_26_listener($event) {
          return ctx.onSelectFinding($event.id, $event.event);
        })("suppressSelectedFindingsEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_suppressSelectedFindingsEvent_26_listener() {
          return ctx.suppressSelectedFindings();
        })("vulnerabilitiesLimitChange", function ShowTeamComponent_Template_app_team_vulnerabilities_table_vulnerabilitiesLimitChange_26_listener($event) {
          return ctx.vulnerabilitiesLimit = $event;
        })("viewVulnerabilityDetailsEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_viewVulnerabilityDetailsEvent_26_listener($event) {
          return ctx.click($event);
        })("toggleShowNotableEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_toggleShowNotableEvent_26_listener($event) {
          return ctx.toggleShowNotable($event);
        })("toggleShowUrgentEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_toggleShowUrgentEvent_26_listener($event) {
          return ctx.toggleShowUrgent($event);
        })("createJiraTicketEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_createJiraTicketEvent_26_listener($event) {
          return ctx.createJiraTicket($event);
        })("createJiraTicketsBulkEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_createJiraTicketsBulkEvent_26_listener($event) {
          return ctx.createJiraTicketsBulk($event);
        })("clearFiltersEvent", function ShowTeamComponent_Template_app_team_vulnerabilities_table_clearFiltersEvent_26_listener() {
          return ctx.clearVulnerabilityFilters();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(27, "c-tab-panel", 13)(28, "app-team-statistics-chart", 15);
        \u0275\u0275listener("refreshDataEvent", function ShowTeamComponent_Template_app_team_statistics_chart_refreshDataEvent_28_listener() {
          return ctx.refreshData();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(29, "c-tab-panel", 13);
        \u0275\u0275element(30, "app-team-scan-info", 16);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "c-tab-panel", 13)(32, "div", 17);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(33, "svg", 18);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(34, "div", 19)(35, "h5");
        \u0275\u0275text(36, "Coming Soon");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(37, "p");
        \u0275\u0275text(38, "This section will provide notification management for vulnerability alerts. You'll be able to configure notification preferences and view alert history.");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(39, "c-tab-panel", 13)(40, "div", 17);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(41, "svg", 18);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(42, "div", 19)(43, "h5");
        \u0275\u0275text(44, "Coming Soon");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(45, "p");
        \u0275\u0275text(46, "This section will provide integration guidance for adding MixewayFlow to your CI/CD pipeline, including configuration examples and best practices.");
        \u0275\u0275elementEnd()()()()()()()();
        \u0275\u0275elementStart(47, "app-team-vulnerability-details", 20);
        \u0275\u0275listener("handleDetailsModalEvent", function ShowTeamComponent_Template_app_team_vulnerability_details_handleDetailsModalEvent_47_listener($event) {
          return ctx.handleDetailsModal($event);
        })("closeModalEvent", function ShowTeamComponent_Template_app_team_vulnerability_details_closeModalEvent_47_listener() {
          return ctx.closeModal();
        })("suppressFindingEvent", function ShowTeamComponent_Template_app_team_vulnerability_details_suppressFindingEvent_47_listener() {
          return ctx.suppressFinding();
        })("reactivateFindingEvent", function ShowTeamComponent_Template_app_team_vulnerability_details_reactivateFindingEvent_47_listener() {
          return ctx.reactivateFinding();
        })("addCommentEvent", function ShowTeamComponent_Template_app_team_vulnerability_details_addCommentEvent_47_listener() {
          return ctx.addComment();
        })("newCommentChange", function ShowTeamComponent_Template_app_team_vulnerability_details_newCommentChange_47_listener($event) {
          return ctx.newComment = $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(48, "c-toaster", 21)(49, "c-toast", 22);
        \u0275\u0275listener("visibleChange", function ShowTeamComponent_Template_c_toast_visibleChange_49_listener($event) {
          return ctx.onVisibleChange($event);
        });
        \u0275\u0275elementStart(50, "c-toast-header");
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(51, "svg", 23);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(52, "span");
        \u0275\u0275text(53, "Security Alert");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(54, "c-toast-body");
        \u0275\u0275text(55);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(56, "c-modal", 24);
        \u0275\u0275listener("visibleChange", function ShowTeamComponent_Template_c_modal_visibleChange_56_listener($event) {
          return ctx.changeTeamModalVisible = $event;
        });
        \u0275\u0275elementStart(57, "c-modal-header")(58, "h5", 25);
        \u0275\u0275text(59, "Change Team Assignment");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(60, "c-modal-body", 26)(61, "div", 27)(62, "label", 28);
        \u0275\u0275text(63, "Select New Team");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(64, "select", 29);
        \u0275\u0275twoWayListener("ngModelChange", function ShowTeamComponent_Template_select_ngModelChange_64_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.selectedNewTeamId, $event) || (ctx.selectedNewTeamId = $event);
          return $event;
        });
        \u0275\u0275elementStart(65, "option", 30);
        \u0275\u0275text(66, "Choose a team...");
        \u0275\u0275elementEnd();
        \u0275\u0275template(67, ShowTeamComponent_option_67_Template, 2, 2, "option", 31);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(68, "c-modal-footer")(69, "button", 32);
        \u0275\u0275listener("click", function ShowTeamComponent_Template_button_click_69_listener() {
          return ctx.changeTeamModalVisible = false;
        });
        \u0275\u0275text(70, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(71, "button", 33);
        \u0275\u0275text(72, " Confirm Change ");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275property("teamData", ctx.teamData)("reposData", ctx.reposData)("cloudSubscriptionsData", ctx.cloudSubscriptionsData)("chartPieData", ctx.chartPieData);
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
        \u0275\u0275advance(4);
        \u0275\u0275property("itemKey", 0);
        \u0275\u0275advance();
        \u0275\u0275property("filteredVulns", ctx.filteredVulns)("showRemoved", ctx.showRemoved)("showSuppressed", ctx.showSuppressed)("bulkActionMode", ctx.bulkActionMode)("selectedFindings", ctx.selectedFindings)("vulnerabilitiesLoading", ctx.vulnerabilitiesLoading)("vulnerabilitiesLimit", ctx.vulnerabilitiesLimit)("jiraEnabled", ctx.jiraEnabled)("teamId", ctx.teamIdForJira);
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 1);
        \u0275\u0275advance();
        \u0275\u0275property("chartLineData", ctx.chartLineData)("options2", ctx.options2)("openedFindings", ctx.getLastOpenedFindings() == 0 ? "None" : ctx.getLastOpenedFindings())("removedFindings", ctx.getLastRemovedFinding() == 0 ? "None" : ctx.getLastRemovedFinding())("reviewedFindings", ctx.getLastRevievedFinding() == 0 ? "None" : ctx.getLastRevievedFinding())("fixTime", ctx.getLastFixTime() == 0 ? "Unknown" : ctx.getLastFixTime());
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 2);
        \u0275\u0275advance();
        \u0275\u0275property("scanInfoLoading", ctx.scanInfoLoading)("allScanInfos", ctx.allScanInfos)("scanInfoLimit", ctx.scanInfoLimit);
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 3);
        \u0275\u0275advance(8);
        \u0275\u0275property("itemKey", 4);
        \u0275\u0275advance(8);
        \u0275\u0275property("detailsModal", ctx.detailsModal)("selectedRowId", ctx.selectedRowId)("singleVuln", ctx.singleVuln)("suppressReason", ctx.suppressReason)("suppressReasons", ctx.suppressReasons)("reposData", ctx.reposData)("isAddingComment", ctx.isAddingComment)("newComment", ctx.newComment)("vulns", ctx.vulns)("teamId", ctx.teamId);
        \u0275\u0275advance();
        \u0275\u0275property("placement", ctx.position);
        \u0275\u0275advance();
        \u0275\u0275property("color", ctx.toastStatus)("visible", ctx.visible);
        \u0275\u0275advance(6);
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
      }
    }, dependencies: [
      CardComponent,
      ButtonDirective,
      IconDirective,
      TabsListComponent,
      TabsContentComponent,
      TabPanelComponent,
      TabsComponent,
      TabDirective,
      NgxDatatableModule,
      FormLabelDirective,
      ModalModule,
      ModalBodyComponent,
      ModalComponent,
      ModalFooterComponent,
      ModalHeaderComponent,
      ModalTitleDirective,
      NgForOf,
      FormsModule,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      SelectControlValueAccessor,
      NgControlStatus,
      NgModel,
      ToastBodyComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToasterComponent,
      MarkdownModule,
      TeamVulnerabilityDetailsComponent,
      TeamInfoComponent,
      TeamVulnerabilitySummaryComponent,
      TeamScanInfoComponent,
      TeamStatisticsChartComponent,
      TeamVulnerabilitiesTableComponent
    ], styles: ["/* src/app/views/show-team/show-team.component.scss */\n.dashboard-container {\n  padding: 1rem;\n}\n.dashboard-container .dashboard-header {\n  margin-bottom: 1.5rem;\n}\n.dashboard-container .dashboard-content {\n  margin-bottom: 1.5rem;\n}\n.dashboard-container .tab-container {\n  background-color: var(--cui-card-bg);\n  border-radius: var(--cui-border-radius);\n  box-shadow: var(--cui-shadow-sm);\n  margin-bottom: 1.5rem;\n  overflow: hidden;\n}\n.dashboard-container .tab-container .nav-tabs {\n  background-color: var(--cui-card-cap-bg);\n  border-bottom: 1px solid var(--cui-border-color);\n}\n.dashboard-container .tab-container .nav-tabs .nav-link {\n  border: none;\n  font-weight: 500;\n  color: var(--cui-body-color);\n  padding: 1rem 1.25rem;\n  display: flex;\n  align-items: center;\n  transition: all 0.2s ease;\n}\n.dashboard-container .tab-container .nav-tabs .nav-link svg {\n  margin-right: 0.5rem;\n  color: var(--cui-secondary);\n  transition: color 0.2s ease;\n}\n.dashboard-container .tab-container .nav-tabs .nav-link:hover {\n  background-color: rgba(var(--cui-primary-rgb), 0.05);\n  color: var(--cui-primary);\n}\n.dashboard-container .tab-container .nav-tabs .nav-link:hover svg {\n  color: var(--cui-primary);\n}\n.dashboard-container .tab-container .nav-tabs .nav-link.active {\n  color: var(--cui-primary);\n  background-color: var(--cui-card-bg);\n  border-bottom: 2px solid var(--cui-primary);\n}\n.dashboard-container .tab-container .nav-tabs .nav-link.active svg {\n  color: var(--cui-primary);\n}\n.dashboard-container .tab-container .tab-content {\n  padding: 1.5rem;\n  background-color: var(--cui-card-bg);\n}\n.dashboard-container .tab-container .tab-content.tab-content-full {\n  padding: 0;\n}\n.dashboard-container .notification-message {\n  display: flex;\n  align-items: center;\n  padding: 1.5rem;\n  background-color: rgba(var(--cui-info-rgb), 0.05);\n  border-left: 4px solid var(--cui-info);\n  border-radius: var(--cui-border-radius);\n}\n.dashboard-container .notification-message svg {\n  color: var(--cui-info);\n  margin-right: 1rem;\n  flex-shrink: 0;\n}\n.dashboard-container .notification-message .message-content {\n  font-size: 0.95rem;\n}\n.dashboard-container .notification-message .message-content h5 {\n  margin-bottom: 0.5rem;\n  font-weight: 600;\n}\n.dashboard-container .notification-message .message-content p {\n  margin-bottom: 0;\n  color: var(--cui-body-color);\n  opacity: 0.85;\n}\n.dashboard-container .modal-container .modal-body {\n  padding: 1.5rem;\n}\n.dashboard-container .modal-container .form-label {\n  font-weight: 500;\n}\n.dashboard-container .toast-container {\n  z-index: 1100;\n}\n@media (max-width: 768px) {\n  .dashboard-container {\n    padding: 0.5rem;\n  }\n  .dashboard-container .tab-container .nav-tabs .nav-link {\n    padding: 0.75rem 1rem;\n    font-size: 0.875rem;\n  }\n  .dashboard-container .tab-container .nav-tabs .nav-link svg {\n    margin-right: 0.25rem;\n  }\n  .dashboard-container .tab-container .tab-content {\n    padding: 1rem;\n  }\n}\n/*# sourceMappingURL=show-team.component.css.map */\n"], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ShowTeamComponent, { className: "ShowTeamComponent" });
})();

// src/app/views/show-team/routes.ts
var routes = [
  {
    path: "",
    component: ShowTeamComponent,
    data: {
      title: "Show Team Data"
    }
  }
];
export {
  routes
};
//# sourceMappingURL=routes-7U63WAO4.js.map
