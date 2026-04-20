import "./chunk-YJUN7Y32.js";
import "./chunk-BSKMGQ6C.js";
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
import "./chunk-YLFWSDV3.js";
import {
  ActivatedRoute,
  AlertComponent,
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
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormLabelDirective,
  IconDirective,
  IconSetService,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  NgClass,
  NgForOf,
  NgIf,
  ProgressBarComponent,
  ProgressComponent,
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
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
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
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZG2BHLTP.js";
import {
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/views/show-cloud-subscription/cloud-subscription-info/cloud-subscription-info.component.ts
function CloudSubscriptionInfoComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275element(1, "c-spinner", 17);
    \u0275\u0275elementStart(2, "span", 18);
    \u0275\u0275text(3, "Scanning");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("cTooltip", "Scan in progress");
  }
}
function CloudSubscriptionInfoComponent_div_8_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function CloudSubscriptionInfoComponent_div_8_button_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.runScan());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 24);
    \u0275\u0275text(2, " Scan ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("cTooltip", "Start a new security scan");
  }
}
function CloudSubscriptionInfoComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275template(1, CloudSubscriptionInfoComponent_div_8_button_1_Template, 3, 1, "button", 20);
    \u0275\u0275elementStart(2, "button", 21);
    \u0275\u0275listener("click", function CloudSubscriptionInfoComponent_div_8_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openChangeTeamModal());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 22);
    \u0275\u0275text(4, " Team ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.scanRunning);
    \u0275\u0275advance();
    \u0275\u0275property("cTooltip", "Change subscription team");
  }
}
function CloudSubscriptionInfoComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 11);
    \u0275\u0275text(2, "Cloud Provider");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 12);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(4, "svg", 25);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("cIcon", ctx_r2.getProviderIcon());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.getFormattedProvider(), " ");
  }
}
function CloudSubscriptionInfoComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 11);
    \u0275\u0275text(2, "Added on");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 12);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(4, "svg", 26);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(6, 1, ctx_r2.cloudSubscriptionData == null ? null : ctx_r2.cloudSubscriptionData.insertedDate), " ");
  }
}
var CloudSubscriptionInfoComponent = class _CloudSubscriptionInfoComponent {
  constructor() {
    this.scanRunning = false;
    this.userRole = "USER";
    this.runScanEvent = new EventEmitter();
    this.openChangeTeamModalEvent = new EventEmitter();
  }
  /**
   * Run a scan for the cloud subscription
   */
  runScan() {
    this.runScanEvent.emit();
  }
  /**
   * Open the change team modal
   */
  openChangeTeamModal() {
    this.openChangeTeamModalEvent.emit();
  }
  /**
   * Get the appropriate icon for the cloud provider
   */
  getProviderIcon() {
    const provider = this.cloudSubscriptionData?.provider?.toLowerCase();
    if (provider?.includes("aws")) {
      return "cib-amazon-aws";
    } else if (provider?.includes("azure") || provider?.includes("microsoft")) {
      return "cib-microsoft-azure";
    } else if (provider?.includes("gcp") || provider?.includes("google")) {
      return "cib-google-cloud";
    }
    return "cil-cloud";
  }
  /**
   * Get formatted provider name
   */
  getFormattedProvider() {
    const provider = this.cloudSubscriptionData?.provider;
    if (!provider)
      return "Unknown";
    if (provider.toLowerCase().includes("aws")) {
      return "Amazon Web Services";
    } else if (provider.toLowerCase().includes("azure")) {
      return "Microsoft Azure";
    } else if (provider.toLowerCase().includes("gcp")) {
      return "Google Cloud Platform";
    }
    return provider;
  }
  static {
    this.\u0275fac = function CloudSubscriptionInfoComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CloudSubscriptionInfoComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CloudSubscriptionInfoComponent, selectors: [["app-cloud-subscription-info"]], inputs: { cloudSubscriptionData: "cloudSubscriptionData", scanRunning: "scanRunning", userRole: "userRole" }, outputs: { runScanEvent: "runScanEvent", openChangeTeamModalEvent: "openChangeTeamModalEvent" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 26, vars: 9, consts: [[3, "md", "sm"], [1, "mb-4", "subscription-card", "h-100", "d-flex", "flex-column"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "d-flex", "align-items-center", "gap-2"], [1, "mb-0", "subscription-title"], ["class", "scan-status", 4, "ngIf"], ["class", "subscription-actions", 4, "ngIf"], [1, "d-flex", "flex-column", "justify-content-center", "flex-grow-1"], [1, "subscription-metadata"], [1, "metadata-grid"], [1, "metadata-item"], [1, "metadata-label"], [1, "metadata-value"], ["cIcon", "", "name", "cil-people", 1, "metadata-icon", "me-2"], ["cIcon", "", "name", "cil-fingerprint", 1, "metadata-icon", "me-2"], ["class", "metadata-item", 4, "ngIf"], [1, "scan-status"], ["size", "sm", 1, "scan-spinner", 3, "cTooltip"], [1, "scan-text", "ms-2"], [1, "subscription-actions"], ["cButton", "", "color", "info", "variant", "ghost", "size", "sm", 3, "cTooltip", "click", 4, "ngIf"], ["cButton", "", "color", "primary", "variant", "ghost", "size", "sm", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-people", 1, "me-1"], ["cButton", "", "color", "info", "variant", "ghost", "size", "sm", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-media-play", 1, "me-1"], [1, "metadata-icon", "me-2", 3, "cIcon"], ["cIcon", "", "name", "cil-calendar", 1, "metadata-icon", "me-2"]], template: function CloudSubscriptionInfoComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-row")(1, "c-col", 0)(2, "c-card", 1)(3, "c-card-header", 2)(4, "div", 3)(5, "h2", 4);
        \u0275\u0275text(6);
        \u0275\u0275elementEnd();
        \u0275\u0275template(7, CloudSubscriptionInfoComponent_div_7_Template, 4, 1, "div", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275template(8, CloudSubscriptionInfoComponent_div_8_Template, 5, 2, "div", 6);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "c-card-body", 7)(10, "div", 8)(11, "div", 9)(12, "div", 10)(13, "div", 11);
        \u0275\u0275text(14, "Team");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "div", 12);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(16, "svg", 13);
        \u0275\u0275text(17);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(18, "div", 10)(19, "div", 11);
        \u0275\u0275text(20, "Project ID");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "div", 12);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(22, "svg", 14);
        \u0275\u0275text(23);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(24, CloudSubscriptionInfoComponent_div_24_Template, 6, 2, "div", 15)(25, CloudSubscriptionInfoComponent_div_25_Template, 7, 3, "div", 15);
        \u0275\u0275elementEnd()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275property("md", 12)("sm", 12);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1(" ", ctx.cloudSubscriptionData == null ? null : ctx.cloudSubscriptionData.external_project_name, " ");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.scanRunning);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.userRole === "ADMIN" || ctx.userRole === "TEAM_MANAGER");
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate1(" ", ctx.cloudSubscriptionData == null ? null : ctx.cloudSubscriptionData.team.name, " ");
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate1(" ", ctx.cloudSubscriptionData == null ? null : ctx.cloudSubscriptionData.name, " ");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.cloudSubscriptionData == null ? null : ctx.cloudSubscriptionData.provider);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.cloudSubscriptionData == null ? null : ctx.cloudSubscriptionData.insertedDate);
      }
    }, dependencies: [
      RowComponent,
      ColComponent,
      CardComponent,
      CardBodyComponent,
      CardHeaderComponent,
      ButtonDirective,
      IconDirective,
      SpinnerComponent,
      NgIf,
      TooltipDirective,
      DatePipe
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.subscription-card[_ngcontent-%COMP%] {\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n  transition: box-shadow 0.3s ease;\n  border-radius: 8px;\n  overflow: hidden;\n  width: 100%;\n}\n.subscription-card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);\n}\n.subscription-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: var(--cui-body-color);\n}\n.scan-status[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n}\n.scan-status[_ngcontent-%COMP%]   .scan-spinner[_ngcontent-%COMP%] {\n  color: var(--cui-info);\n}\n.scan-status[_ngcontent-%COMP%]   .scan-text[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--cui-info);\n}\n.subscription-metadata[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.subscription-metadata[_ngcontent-%COMP%]   .metadata-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1.5rem;\n  width: 100%;\n}\n.subscription-metadata[_ngcontent-%COMP%]   .metadata-grid[_ngcontent-%COMP%]   .metadata-item[_ngcontent-%COMP%]   .metadata-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: var(--cui-body-color-rgb);\n  opacity: 0.7;\n  margin-bottom: 0.5rem;\n  font-weight: 600;\n}\n.subscription-metadata[_ngcontent-%COMP%]   .metadata-grid[_ngcontent-%COMP%]   .metadata-item[_ngcontent-%COMP%]   .metadata-value[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  display: flex;\n  white-space: normal;\n  word-break: break-word;\n  align-items: center;\n  color: var(--cui-body-color);\n}\n.subscription-metadata[_ngcontent-%COMP%]   .metadata-grid[_ngcontent-%COMP%]   .metadata-item[_ngcontent-%COMP%]   .metadata-value[_ngcontent-%COMP%]   .metadata-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  opacity: 0.7;\n}\n@media (max-width: 768px) {\n  .subscription-actions[_ngcontent-%COMP%] {\n    margin-top: 1rem;\n  }\n  c-card-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start !important;\n  }\n}\n.metadata-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n  gap: 16px;\n}\n.metadata-value[_ngcontent-%COMP%] {\n  white-space: normal;\n  word-break: break-word;\n}\n/*# sourceMappingURL=cloud-subscription-info.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CloudSubscriptionInfoComponent, { className: "CloudSubscriptionInfoComponent" });
})();

// src/app/views/show-cloud-subscription/cloud-vulnerability-summary/cloud-vulnerability-summary.component.ts
function CloudVulnerabilitySummaryComponent_c_row_70_c_col_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-col", 7)(1, "div", 31)(2, "div", 32);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "div", 34)(5, "div", 35);
    \u0275\u0275text(6, "Auto-Fixable");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 36);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 37);
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
function CloudVulnerabilitySummaryComponent_c_row_70_c_col_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-col", 7)(1, "div", 38)(2, "div", 32);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "div", 34)(5, "div", 35);
    \u0275\u0275text(6, "Recently Fixed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 36);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 37);
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
function CloudVulnerabilitySummaryComponent_c_row_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-row", 29);
    \u0275\u0275template(1, CloudVulnerabilitySummaryComponent_c_row_70_c_col_1_Template, 11, 5, "c-col", 30)(2, CloudVulnerabilitySummaryComponent_c_row_70_c_col_2_Template, 11, 5, "c-col", 30);
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
var CloudVulnerabilitySummaryComponent = class _CloudVulnerabilitySummaryComponent {
  constructor() {
    this.counts = {
      critical: 0,
      high: 0,
      rest: 0
    };
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
    }
  }
  ngOnChanges(changes) {
    if (changes["counts"]) {
      const total = this.getTotalCount();
      console.log("Total Count:", total);
    }
  }
  getTotalCount() {
    return (this.counts?.critical || 0) + (this.counts?.high || 0) + (this.counts?.rest || 0);
  }
  getPercentage(count) {
    const total = this.getTotalCount();
    if (total === 0)
      return 0;
    return Math.round(count / total * 100);
  }
  static {
    this.\u0275fac = function CloudVulnerabilitySummaryComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CloudVulnerabilitySummaryComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CloudVulnerabilitySummaryComponent, selectors: [["app-cloud-vulnerability-summary"]], inputs: { counts: "counts", icons: "icons" }, standalone: true, features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature], decls: 71, vars: 26, consts: [[1, "vulnerability-dashboard"], [1, "dashboard-header", "mb-3"], [1, "dashboard-title"], [1, "total-vulnerabilities"], [1, "total-count"], [1, "total-label"], [1, "vulnerability-cards"], [1, "mb-3", 3, "lg", "md", "sm"], [1, "vuln-card", "critical-card"], [1, "vuln-card-header"], [1, "severity-badge", "critical"], [1, "vuln-count"], [1, "vuln-card-body"], [1, "vuln-icon"], ["width", "24", 3, "cIcon"], [1, "vuln-info"], [1, "vuln-percent"], [1, "vuln-bar-container"], [1, "vuln-bar", "critical-bar"], [1, "vuln-card-footer"], [1, "risk-level"], [1, "action-required"], [1, "vuln-card", "high-card"], [1, "severity-badge", "high"], [1, "vuln-bar", "high-bar"], [1, "vuln-card", "other-card"], [1, "severity-badge", "other"], [1, "vuln-bar", "other-bar"], ["class", "additional-metrics mt-2", 4, "ngIf"], [1, "additional-metrics", "mt-2"], ["class", "mb-3", 3, "lg", "md", "sm", 4, "ngIf"], [1, "metric-card", "autofix-card"], [1, "metric-icon"], ["width", "20", 3, "cIcon"], [1, "metric-content"], [1, "metric-title"], [1, "metric-value"], [1, "metric-description"], [1, "metric-card", "fixed-card"]], template: function CloudVulnerabilitySummaryComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h2", 2);
        \u0275\u0275text(3, "Vulnerability Summary");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 3)(5, "span", 4);
        \u0275\u0275text(6);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "span", 5);
        \u0275\u0275text(8, "Total Findings");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(9, "c-row", 6)(10, "c-col", 7)(11, "div", 8)(12, "div", 9)(13, "div", 10);
        \u0275\u0275text(14, "Critical");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "div", 11);
        \u0275\u0275text(16);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(17, "div", 12)(18, "div", 13);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(19, "svg", 14);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(20, "div", 15)(21, "div", 16);
        \u0275\u0275text(22);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "div", 17);
        \u0275\u0275element(24, "div", 18);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(25, "div", 19)(26, "div", 20);
        \u0275\u0275text(27, "Highest Risk Level");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "div", 21);
        \u0275\u0275text(29, "Immediate Action Required");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(30, "c-col", 7)(31, "div", 22)(32, "div", 9)(33, "div", 23);
        \u0275\u0275text(34, "High");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(35, "div", 11);
        \u0275\u0275text(36);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(37, "div", 12)(38, "div", 13);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(39, "svg", 14);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(40, "div", 15)(41, "div", 16);
        \u0275\u0275text(42);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(43, "div", 17);
        \u0275\u0275element(44, "div", 24);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(45, "div", 19)(46, "div", 20);
        \u0275\u0275text(47, "Significant Risk Level");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(48, "div", 21);
        \u0275\u0275text(49, "Prioritize Remediation");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(50, "c-col", 7)(51, "div", 25)(52, "div", 9)(53, "div", 26);
        \u0275\u0275text(54, "Other");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(55, "div", 11);
        \u0275\u0275text(56);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(57, "div", 12)(58, "div", 13);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(59, "svg", 14);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(60, "div", 15)(61, "div", 16);
        \u0275\u0275text(62);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(63, "div", 17);
        \u0275\u0275element(64, "div", 27);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(65, "div", 19)(66, "div", 20);
        \u0275\u0275text(67, "Lower Risk Level");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(68, "div", 21);
        \u0275\u0275text(69, "Address When Possible");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275template(70, CloudVulnerabilitySummaryComponent_c_row_70_Template, 3, 2, "c-row", 28);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.getTotalCount());
        \u0275\u0275advance(4);
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
      IconDirective,
      NgIf
    ], styles: ["\n\n.vulnerability-dashboard[_ngcontent-%COMP%] {\n  padding: 0.5rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .dashboard-title[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 600;\n  margin: 0;\n  color: var(--cui-body-color);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-count[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%] {\n  border-radius: 10px;\n  overflow: hidden;\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);\n  background-color: var(--cui-card-bg);\n  border: 1px solid var(--cui-card-border-color);\n  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;\n  height: 100%;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card.critical-card[_ngcontent-%COMP%] {\n  border-top: 4px solid var(--cui-danger);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card.high-card[_ngcontent-%COMP%] {\n  border-top: 4px solid var(--cui-warning);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card.other-card[_ngcontent-%COMP%] {\n  border-top: 4px solid var(--cui-primary);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem;\n  border-bottom: 1px solid var(--cui-card-border-color);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.75rem;\n  border-radius: 30px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge.critical[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-danger-rgb), 0.15);\n  color: var(--cui-danger);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge.high[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-warning-rgb), 0.15);\n  color: var(--cui-warning);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge.other[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-primary-rgb), 0.15);\n  color: var(--cui-primary);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .vuln-count[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--cui-body-color);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%] {\n  display: flex;\n  padding: 1.25rem 1rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  margin-right: 1rem;\n  background-color: var(--cui-tertiary-bg);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%] {\n  flex-grow: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-percent[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 600;\n  margin-bottom: 0.5rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%] {\n  height: 6px;\n  background-color: var(--cui-tertiary-bg);\n  border-radius: 3px;\n  overflow: hidden;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: 3px;\n  transition: width 0.8s ease-in-out;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar.critical-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-danger);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar.high-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-warning);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar.other-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-primary);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%] {\n  padding: 1rem;\n  border-top: 1px solid var(--cui-card-border-color);\n  background-color: var(--cui-tertiary-bg);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%]   .risk-level[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  font-weight: 600;\n  margin-bottom: 0.25rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%]   .action-required[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 1rem;\n  border-radius: 8px;\n  background-color: var(--cui-card-bg);\n  border: 1px solid var(--cui-card-border-color);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n  height: 100%;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  margin-right: 1rem;\n  background-color: var(--cui-tertiary-bg);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%] {\n  flex-grow: 1;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%]   .metric-title[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin-bottom: 0.25rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 700;\n  margin-bottom: 0.25rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%]   .metric-description[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card.autofix-card[_ngcontent-%COMP%] {\n  border-left: 3px solid var(--cui-success);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card.fixed-card[_ngcontent-%COMP%] {\n  border-left: 3px solid var(--cui-info);\n}\n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  background-color: var(--cui-card-bg);\n}\n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.05);\n}\n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n@keyframes _ngcontent-%COMP%_barFill {\n  from {\n    width: 0;\n  }\n  to {\n    width: 100%;\n  }\n}\n.vuln-bar[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_barFill 1s ease-out forwards;\n}\n@media (max-width: 768px) {\n  .dashboard-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start !important;\n  }\n  .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%] {\n    align-items: flex-start;\n    margin-top: 0.5rem;\n  }\n}\n/*# sourceMappingURL=cloud-vulnerability-summary.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CloudVulnerabilitySummaryComponent, { className: "CloudVulnerabilitySummaryComponent" });
})();

// src/app/views/show-cloud-subscription/cloud-vulnerabilities-table/cloud-vulnerabilities-table.component.ts
var _c0 = () => ({ "datatable-column": true, "centered-column": true });
function CloudVulnerabilitiesTableComponent_c_form_check_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-form-check", 13)(1, "input", 14);
    \u0275\u0275listener("change", function CloudVulnerabilitiesTableComponent_c_form_check_4_Template_input_change_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleShowRemoved($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "label", 15);
    \u0275\u0275text(3, "Show Removed");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.showRemoved)("disabled", ctx_r1.statusFilter === "NEW" || ctx_r1.statusFilter === "EXISTING");
  }
}
function CloudVulnerabilitiesTableComponent_c_form_check_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-form-check", 13)(1, "input", 16);
    \u0275\u0275listener("change", function CloudVulnerabilitiesTableComponent_c_form_check_5_Template_input_change_1_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleShowIssuesRemoved($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "label", 17);
    \u0275\u0275text(3, "Show Removed");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.showIssuesRemoved)("disabled", ctx_r1.statusIssuesFilter === "NEW" || ctx_r1.statusIssuesFilter === "EXISTING");
  }
}
function CloudVulnerabilitiesTableComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275element(1, "c-spinner", 19);
    \u0275\u0275elementStart(2, "span", 20);
    \u0275\u0275text(3, "Loading vulnerabilities...");
    \u0275\u0275elementEnd()();
  }
}
function CloudVulnerabilitiesTableComponent_div_22_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 31)(1, "button", 32);
    \u0275\u0275listener("click", function CloudVulnerabilitiesTableComponent_div_22_ng_template_3_Template_button_click_1_listener() {
      const row_r5 = \u0275\u0275restoreView(_r4).row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.click(row_r5));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 33);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("cTooltip", "View vulnerability details");
  }
}
function CloudVulnerabilitiesTableComponent_div_22_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 34)(1, "span");
    \u0275\u0275text(2, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 35)(4, "select", 36);
    \u0275\u0275listener("change", function CloudVulnerabilitiesTableComponent_div_22_ng_template_5_Template_select_change_4_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.sourceType === "CLOUD_SCANNER" ? ctx_r1.updateFilterSeverity($event) : ctx_r1.updateIssuesFilterSeverity($event));
    });
    \u0275\u0275elementStart(5, "option", 37);
    \u0275\u0275text(6, "All");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "option", 38);
    \u0275\u0275text(8, "Critical");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "option", 39);
    \u0275\u0275text(10, "High");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "option", 40);
    \u0275\u0275text(12, "Medium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "option", 41);
    \u0275\u0275text(14, "Low");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 42);
    \u0275\u0275text(16, "Info");
    \u0275\u0275elementEnd()()()();
  }
}
function CloudVulnerabilitiesTableComponent_div_22_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "div", 44);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r7 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", "severity-badge severity-" + (row_r7 == null ? null : row_r7.severity == null ? null : row_r7.severity.toLowerCase()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r7 == null ? null : row_r7.severity, " ");
  }
}
function CloudVulnerabilitiesTableComponent_div_22_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 45)(1, "span");
    \u0275\u0275text(2, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 46)(4, "div", 47)(5, "input", 48);
    \u0275\u0275listener("input", function CloudVulnerabilitiesTableComponent_div_22_ng_template_8_Template_input_input_5_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.sourceType === "CLOUD_SCANNER" ? ctx_r1.updateFilterName($event) : ctx_r1.updateIssuesFilterName($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(7, "select", 50);
    \u0275\u0275listener("change", function CloudVulnerabilitiesTableComponent_div_22_ng_template_8_Template_select_change_7_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.sourceType === "CLOUD_SCANNER" ? ctx_r1.updateFilterStatus($event) : ctx_r1.updateIssuesFilterStatus($event));
    });
    \u0275\u0275elementStart(8, "option", 37);
    \u0275\u0275text(9, "All Statuses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "option", 51);
    \u0275\u0275text(11, "New");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "option", 52);
    \u0275\u0275text(13, "Existing");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "option", 53);
    \u0275\u0275text(15, "Removed");
    \u0275\u0275elementEnd()()()();
  }
}
function CloudVulnerabilitiesTableComponent_div_22_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54)(1, "div", 55);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 56)(4, "div", 57)(5, "div", 58);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 59);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(7, "span", 44);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 60)(10, "span", 61);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "date");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const row_r9 = ctx.row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r9 == null ? null : row_r9.name);
    \u0275\u0275advance(4);
    \u0275\u0275property("name", (row_r9 == null ? null : row_r9.status) === "NEW" ? "cil-burn" : (row_r9 == null ? null : row_r9.status) === "EXISTING" ? "cil-graph" : (row_r9 == null ? null : row_r9.status) === "REMOVED" ? "cil-trash" : "cil-volume-off");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", "status-text status-" + (row_r9 == null ? null : row_r9.status == null ? null : row_r9.status.toLowerCase()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r9 == null ? null : row_r9.status);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Last seen: ", \u0275\u0275pipeBind2(12, 5, row_r9 == null ? null : row_r9.last_seen, "short"), "");
  }
}
function CloudVulnerabilitiesTableComponent_div_22_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "span");
    \u0275\u0275text(2, "Source");
    \u0275\u0275elementEnd()();
  }
}
function CloudVulnerabilitiesTableComponent_div_22_ng_template_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62)(1, "div", 44);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r10 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", "source-badge source-" + (row_r10 == null ? null : row_r10.source == null ? null : row_r10.source.toLowerCase()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r10 == null ? null : row_r10.source == null ? null : row_r10.source.replace("_", " "), " ");
  }
}
function CloudVulnerabilitiesTableComponent_div_22_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 35)(1, "select", 36);
    \u0275\u0275listener("change", function CloudVulnerabilitiesTableComponent_div_22_ng_template_13_Template_select_change_1_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateFilterStatus($event));
    });
    \u0275\u0275elementStart(2, "option", 37);
    \u0275\u0275text(3, "All Statuses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "option", 51);
    \u0275\u0275text(5, "New");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "option", 52);
    \u0275\u0275text(7, "Existing");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "option", 53);
    \u0275\u0275text(9, "Removed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "option", 63);
    \u0275\u0275text(11, "Suppressed");
    \u0275\u0275elementEnd()()();
  }
}
function CloudVulnerabilitiesTableComponent_div_22_ng_template_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 45)(1, "span");
    \u0275\u0275text(2, "Location");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 35)(4, "div", 47)(5, "input", 64);
    \u0275\u0275listener("input", function CloudVulnerabilitiesTableComponent_div_22_ng_template_16_Template_input_input_5_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.sourceType === "CLOUD_SCANNER" ? ctx_r1.updateFilterLocation($event) : ctx_r1.updateIssuesFilterLocation($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 49);
    \u0275\u0275elementEnd()()();
  }
}
function CloudVulnerabilitiesTableComponent_div_22_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 65);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 66);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r13 = ctx.row;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(row_r13 == null ? null : row_r13.location);
  }
}
function CloudVulnerabilitiesTableComponent_div_22_div_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 67);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 68);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "h4");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 69);
    \u0275\u0275listener("click", function CloudVulnerabilitiesTableComponent_div_22_div_18_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clearFilters());
    });
    \u0275\u0275text(7, "Clear filters");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" No ", ctx_r1.sourceType === "CLOUD_SCANNER" ? "vulnerabilities" : "issues", " found ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" No ", ctx_r1.sourceType === "CLOUD_SCANNER" ? "vulnerabilities" : "issues", " match your current filter criteria. ");
  }
}
function CloudVulnerabilitiesTableComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "ngx-datatable", 22)(2, "ngx-datatable-column", 23);
    \u0275\u0275template(3, CloudVulnerabilitiesTableComponent_div_22_ng_template_3_Template, 3, 1, "ng-template", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ngx-datatable-column", 25);
    \u0275\u0275template(5, CloudVulnerabilitiesTableComponent_div_22_ng_template_5_Template, 17, 0, "ng-template", 26)(6, CloudVulnerabilitiesTableComponent_div_22_ng_template_6_Template, 3, 2, "ng-template", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "ngx-datatable-column", 27);
    \u0275\u0275template(8, CloudVulnerabilitiesTableComponent_div_22_ng_template_8_Template, 16, 0, "ng-template", 26)(9, CloudVulnerabilitiesTableComponent_div_22_ng_template_9_Template, 13, 8, "ng-template", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "ngx-datatable-column", 28);
    \u0275\u0275template(11, CloudVulnerabilitiesTableComponent_div_22_ng_template_11_Template, 3, 0, "ng-template", 26)(12, CloudVulnerabilitiesTableComponent_div_22_ng_template_12_Template, 3, 2, "ng-template", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275template(13, CloudVulnerabilitiesTableComponent_div_22_ng_template_13_Template, 12, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementStart(15, "ngx-datatable-column", 29);
    \u0275\u0275template(16, CloudVulnerabilitiesTableComponent_div_22_ng_template_16_Template, 7, 0, "ng-template", 26)(17, CloudVulnerabilitiesTableComponent_div_22_ng_template_17_Template, 4, 1, "ng-template", 24);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(18, CloudVulnerabilitiesTableComponent_div_22_div_18_Template, 8, 2, "div", 30);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("rows", ctx_r1.tableRows)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", ctx_r1.vulnerabilitiesLimit);
    \u0275\u0275advance();
    \u0275\u0275property("width", 60)("sortable", false)("resizeable", false)("draggable", false)("canAutoResize", false)("ngClass", \u0275\u0275pureFunction0(25, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275property("width", 100)("sortable", true)("canAutoResize", false)("ngClass", \u0275\u0275pureFunction0(26, _c0));
    \u0275\u0275advance(3);
    \u0275\u0275property("width", 80)("sortable", true);
    \u0275\u0275advance(3);
    \u0275\u0275property("width", 180)("sortable", true)("canAutoResize", false)("ngClass", \u0275\u0275pureFunction0(27, _c0));
    \u0275\u0275advance(5);
    \u0275\u0275property("width", 100)("sortable", true);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.tableRows.length === 0);
  }
}
var CloudVulnerabilitiesTableComponent = class _CloudVulnerabilitiesTableComponent {
  constructor() {
    this.sourceType = "CLOUD_SCANNER";
    this.filteredVulns = [];
    this.filteredIssues = [];
    this.vulnerabilitiesLoading = false;
    this.vulnerabilitiesLimit = 15;
    this.issuesLoading = false;
    this.issuesLimit = 15;
    this.showRemoved = false;
    this.showIssuesRemoved = false;
    this.updateFilterNameEvent = new EventEmitter();
    this.updateFilterLocationEvent = new EventEmitter();
    this.updateFilterStatusEvent = new EventEmitter();
    this.updateFilterSeverityEvent = new EventEmitter();
    this.toggleShowRemovedEvent = new EventEmitter();
    this.viewVulnerabilityDetailsEvent = new EventEmitter();
    this.vulnerabilitiesLimitChange = new EventEmitter();
    this.statusFilter = "";
    this.statusIssuesFilter = "";
    this.updateIssuesFilterNameEvent = new EventEmitter();
    this.updateIssuesFilterLocationEvent = new EventEmitter();
    this.updateIssuesFilterStatusEvent = new EventEmitter();
    this.updateIssuesFilterSeverityEvent = new EventEmitter();
    this.toggleShowIssuesRemovedEvent = new EventEmitter();
    this.viewIssueDetailsEvent = new EventEmitter();
    this.clearVulnFiltersEvent = new EventEmitter();
    this.clearIssuesFiltersEvent = new EventEmitter();
  }
  /**
  * Update name filter
  */
  updateFilterName(event) {
    this.updateFilterNameEvent.emit(event);
  }
  /**
   * Update location filter
   */
  updateFilterLocation(event) {
    this.updateFilterLocationEvent.emit(event);
  }
  /**
   * Update status filter
   */
  updateFilterStatus(event) {
    this.updateFilterStatusEvent.emit(event);
  }
  /**
   * Update severity filter
   */
  updateFilterSeverity(event) {
    this.updateFilterSeverityEvent.emit(event);
  }
  toggleShowRemoved(event) {
    const checked = event.target.checked;
    this.toggleShowRemovedEvent.emit(event);
  }
  updateIssuesFilterName(event) {
    this.updateIssuesFilterNameEvent.emit(event);
  }
  updateIssuesFilterLocation(event) {
    this.updateIssuesFilterLocationEvent.emit(event);
  }
  updateIssuesFilterStatus(event) {
    this.updateIssuesFilterStatusEvent.emit(event);
  }
  updateIssuesFilterSeverity(event) {
    this.updateIssuesFilterSeverityEvent.emit(event);
  }
  toggleShowIssuesRemoved(event) {
    const checked = event.target.checked;
    this.toggleShowIssuesRemovedEvent.emit(event);
  }
  get tableRows() {
    return this.sourceType === "CLOUD_SCANNER" ? this.filteredVulns : this.filteredIssues;
  }
  /**
  * Handle limit change for pagination
  */
  onLimitChange(newLimit) {
    this.vulnerabilitiesLimit = newLimit;
    this.vulnerabilitiesLimitChange.emit(newLimit);
  }
  /**
   * View vulnerability details
   */
  click(row) {
    this.viewVulnerabilityDetailsEvent.emit(row);
  }
  /**
   * Clear all filters
   */
  clearFilters() {
    if (this.sourceType === "CLOUD_SCANNER") {
      this.clearVulnFiltersEvent.emit();
    } else {
      this.clearIssuesFiltersEvent.emit();
    }
  }
  static {
    this.\u0275fac = function CloudVulnerabilitiesTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CloudVulnerabilitiesTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CloudVulnerabilitiesTableComponent, selectors: [["app-cloud-vulnerabilities-table"]], inputs: { sourceType: "sourceType", filteredVulns: "filteredVulns", filteredIssues: "filteredIssues", vulnerabilitiesLoading: "vulnerabilitiesLoading", vulnerabilitiesLimit: "vulnerabilitiesLimit", issuesLoading: "issuesLoading", issuesLimit: "issuesLimit", showRemoved: "showRemoved", showIssuesRemoved: "showIssuesRemoved" }, outputs: { updateFilterNameEvent: "updateFilterNameEvent", updateFilterLocationEvent: "updateFilterLocationEvent", updateFilterStatusEvent: "updateFilterStatusEvent", updateFilterSeverityEvent: "updateFilterSeverityEvent", toggleShowRemovedEvent: "toggleShowRemovedEvent", viewVulnerabilityDetailsEvent: "viewVulnerabilityDetailsEvent", vulnerabilitiesLimitChange: "vulnerabilitiesLimitChange", updateIssuesFilterNameEvent: "updateIssuesFilterNameEvent", updateIssuesFilterLocationEvent: "updateIssuesFilterLocationEvent", updateIssuesFilterStatusEvent: "updateIssuesFilterStatusEvent", updateIssuesFilterSeverityEvent: "updateIssuesFilterSeverityEvent", toggleShowIssuesRemovedEvent: "toggleShowIssuesRemovedEvent", viewIssueDetailsEvent: "viewIssueDetailsEvent", clearVulnFiltersEvent: "clearVulnFiltersEvent", clearIssuesFiltersEvent: "clearIssuesFiltersEvent" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 23, vars: 10, consts: [["statusFilter", ""], [1, "cloud-vuln-table-card"], [1, "cloud-vuln-table-header"], [1, "filter-controls"], [1, "toggle-controls", "d-flex", "align-items-center"], ["class", "toggle-check", "switch", "", 4, "ngIf"], [1, "action-controls", "d-flex", "align-items-center", "gap-2"], [1, "form-label", "mb-0"], [1, "form-select", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "vuln-table-body"], ["class", "loading-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], ["switch", "", 1, "toggle-check"], ["cFormCheckInput", "", "id", "showRemoved", "type", "checkbox", 3, "change", "checked", "disabled"], ["cFormCheckLabel", "", "for", "showRemoved"], ["cFormCheckInput", "", "id", "showIssuesRemoved", "type", "checkbox", 3, "change", "checked", "disabled"], ["cFormCheckLabel", "", "for", "showIssuesRemoved"], [1, "loading-container"], ["color", "primary"], [1, "loading-text"], [1, "table-container"], [1, "bootstrap", "vuln-datatable", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit"], ["name", "Actions", 3, "width", "sortable", "resizeable", "draggable", "canAutoResize", "ngClass"], ["ngx-datatable-cell-template", ""], ["name", "Severity", "prop", "severity", 3, "width", "sortable", "canAutoResize", "ngClass"], ["ngx-datatable-header-template", ""], ["name", "Name", "prop", "name", 3, "width", "sortable"], ["name", "Source", "prop", "source", 3, "width", "sortable", "canAutoResize", "ngClass"], ["name", "Location", "prop", "location", 3, "width", "sortable"], ["class", "empty-state", 4, "ngIf"], [1, "details-action-container"], ["cButton", "", "color", "primary", "variant", "ghost", "size", "sm", 1, "details-btn", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-magnifying-glass"], [1, "column-header", "header-centered"], [1, "filter-container"], [1, "form-select", "form-select-sm", 3, "change"], ["value", ""], ["value", "Critical"], ["value", "High"], ["value", "Medium"], ["value", "Low"], ["value", "Info"], [1, "severity-cell"], [3, "ngClass"], [1, "column-header"], [1, "multi-filter-container"], [1, "search-input"], ["type", "text", "placeholder", "Search name", 1, "form-control", "form-control-sm", 3, "input"], ["cIcon", "", "name", "cil-magnifying-glass", 1, "search-icon"], [1, "form-select", "form-select-sm", "mt-1", 3, "change"], ["value", "New"], ["value", "Existing"], ["value", "Removed"], [1, "vuln-info"], [1, "vuln-name"], [1, "vuln-metadata"], [1, "meta-row"], [1, "meta-item", "status-info"], ["cIcon", "", 1, "meta-icon", 3, "name"], [1, "meta-item", "date-info"], [1, "date-value"], [1, "source-cell"], ["value", "Supressed"], ["type", "text", "placeholder", "Search", 1, "form-control", "form-control-sm", 3, "input"], [1, "location-cell"], ["cIcon", "", "name", "cil-terminal", 1, "me-2"], [1, "empty-state"], ["cIcon", "", "name", "cil-check-circle", "width", "48", "height", "48"], ["cButton", "", "color", "primary", 3, "click"]], template: function CloudVulnerabilitiesTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-card", 1)(1, "c-card-header", 2)(2, "div", 3)(3, "div", 4);
        \u0275\u0275template(4, CloudVulnerabilitiesTableComponent_c_form_check_4_Template, 4, 2, "c-form-check", 5)(5, CloudVulnerabilitiesTableComponent_c_form_check_5_Template, 4, 2, "c-form-check", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "div", 6)(7, "label", 7);
        \u0275\u0275text(8, "Page Size");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "select", 8);
        \u0275\u0275twoWayListener("ngModelChange", function CloudVulnerabilitiesTableComponent_Template_select_ngModelChange_9_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.vulnerabilitiesLimit, $event) || (ctx.vulnerabilitiesLimit = $event);
          return $event;
        });
        \u0275\u0275elementStart(10, "option", 9);
        \u0275\u0275text(11, "10");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "option", 9);
        \u0275\u0275text(13, "20");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "option", 9);
        \u0275\u0275text(15, "50");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "option", 9);
        \u0275\u0275text(17, "100");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "option", 9);
        \u0275\u0275text(19, "200");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(20, "c-card-body", 10);
        \u0275\u0275template(21, CloudVulnerabilitiesTableComponent_div_21_Template, 4, 0, "div", 11)(22, CloudVulnerabilitiesTableComponent_div_22_Template, 19, 28, "div", 12);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(4);
        \u0275\u0275property("ngIf", ctx.sourceType === "CLOUD_SCANNER");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.sourceType === "CLOUD_ISSUE");
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.vulnerabilitiesLimit);
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
        \u0275\u0275property("ngIf", ctx.vulnerabilitiesLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.vulnerabilitiesLoading);
      }
    }, dependencies: [
      CardComponent,
      CardHeaderComponent,
      CardBodyComponent,
      ButtonDirective,
      SpinnerComponent,
      NgxDatatableModule,
      DatatableComponent,
      DataTableColumnDirective,
      DataTableColumnHeaderDirective,
      DataTableColumnCellDirective,
      IconDirective,
      DatePipe,
      NgIf,
      NgClass,
      FormsModule,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      SelectControlValueAccessor,
      NgControlStatus,
      NgModel,
      TooltipDirective,
      FormCheckComponent,
      FormCheckInputDirective,
      FormCheckLabelDirective
    ], styles: ["\n\n.dot[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  display: inline-block;\n}\n.critical[_ngcontent-%COMP%] {\n  background-color: red;\n}\n.high[_ngcontent-%COMP%] {\n  background-color: #f33d3d;\n}\n.medium[_ngcontent-%COMP%] {\n  background-color: #e38334;\n}\n.low[_ngcontent-%COMP%] {\n  background-color: #47a3d3;\n}\n.critical-t[_ngcontent-%COMP%] {\n  color: red;\n}\n.high-t[_ngcontent-%COMP%] {\n  color: #f33d3d;\n}\n.medium-t[_ngcontent-%COMP%] {\n  color: #e38334;\n}\n.low-t[_ngcontent-%COMP%] {\n  color: #47a3d3;\n}\n.location-cell[_ngcontent-%COMP%] {\n  white-space: normal;\n  word-break: break-word;\n  max-width: 100%;\n  display: flex;\n  align-items: center;\n}\n.btn-icon[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  padding: 0;\n}\n.page-size-control[_ngcontent-%COMP%]   .form-select[_ngcontent-%COMP%] {\n  width: auto;\n  max-width: 150px;\n  display: inline-block;\n}\n.filter-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n}\n.toggle-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-right: 1rem;\n}\n.action-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-top: 0;\n}\n.vuln-name[_ngcontent-%COMP%], \n.location-cell[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: normal;\n  word-break: break-word;\n  display: block;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-name[_ngcontent-%COMP%] {\n  font-weight: 500;\n  margin-bottom: 0.5rem;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--cui-secondary-color);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-row[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-row[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%]   .meta-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  opacity: 0.75;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-row[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-row[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-new[_ngcontent-%COMP%] {\n  color: var(--cui-danger);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-row[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-existing[_ngcontent-%COMP%] {\n  color: var(--cui-warning);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-row[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-removed[_ngcontent-%COMP%] {\n  color: var(--cui-success);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-row[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-supressed[_ngcontent-%COMP%] {\n  color: var(--cui-secondary);\n}\n.empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem 1rem;\n  text-align: center;\n}\n.empty-state[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: var(--cui-primary);\n  opacity: 0.7;\n  margin-bottom: 1rem;\n}\n.empty-state[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--cui-secondary-color);\n  max-width: 300px;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body-cell {\n  display: flex;\n  align-items: center;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body-cell-label {\n  flex: 1;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-column.centered-column .datatable-header-cell {\n  text-align: center;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-column.centered-column .datatable-body-cell {\n  justify-content: center;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-column.centered-column .datatable-body-cell .datatable-body-cell-label {\n  justify-content: center;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body-row {\n  align-items: center;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body-row .datatable-body-cell {\n  align-self: center;\n}\n[_nghost-%COMP%]     .source-cell {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n[_nghost-%COMP%]     .source-cell .source-badge {\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  letter-spacing: 0.3px;\n}\n[_nghost-%COMP%]     .source-cell .source-badge.source-cloud_scanner {\n  background-color: rgba(199, 225, 222, 0.71);\n  color: rgba(0, 89, 89, 0.78);\n}\n[_nghost-%COMP%]     .source-cell .source-badge.source-cloud_issue {\n  background-color: rgba(241, 192, 205, 0.71);\n  color: rgba(159, 38, 74, 0.78);\n}\n[_nghost-%COMP%]     .severity-cell {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n[_nghost-%COMP%]     .severity-cell .severity-badge {\n  padding: 0.25rem 0.75rem;\n  border-radius: 30px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  display: inline-block;\n  line-height: 1;\n  white-space: nowrap;\n}\n[_nghost-%COMP%]     .severity-cell .severity-badge.severity-critical {\n  background-color: rgba(220, 53, 69, 0.15);\n  color: #dc3545;\n}\n[_nghost-%COMP%]     .severity-cell .severity-badge.severity-high {\n  background-color: rgba(244, 67, 54, 0.15);\n  color: #f44336;\n}\n[_nghost-%COMP%]     .severity-cell .severity-badge.severity-medium {\n  background-color: rgba(255, 152, 0, 0.15);\n  color: #ff9800;\n}\n[_nghost-%COMP%]     .severity-cell .severity-badge.severity-low {\n  background-color: rgba(33, 150, 243, 0.15);\n  color: #2196f3;\n}\n[_nghost-%COMP%]     .severity-cell .severity-badge.severity-info {\n  background-color: rgba(0, 188, 212, 0.15);\n  color: #00bcd4;\n}\n/*# sourceMappingURL=cloud-vulnerabilities-table.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CloudVulnerabilitiesTableComponent, { className: "CloudVulnerabilitiesTableComponent" });
})();

// src/app/views/show-cloud-subscription/cloud-vulnerability-details/cloud-vulnerability-details.component.ts
function CloudVulnerabilityDetailsComponent_div_5__svg_svg_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 24);
  }
}
function CloudVulnerabilityDetailsComponent_div_5__svg_svg_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 25);
  }
}
function CloudVulnerabilityDetailsComponent_div_5__svg_svg_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 26);
  }
}
function CloudVulnerabilityDetailsComponent_div_5__svg_svg_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 27);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_span_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 28);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_span_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 29);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_span_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 30);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_span_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 30);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_c_spinner_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 31);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_span_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_span_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_span_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_span_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_span_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.severity);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_badge_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-badge", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.singleVuln.comments.length, " ");
  }
}
function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 41);
    \u0275\u0275element(1, "markdown", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 0);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.description || "No description available at this moment");
  }
}
function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 41);
    \u0275\u0275element(1, "markdown", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 1);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.recommendation || "No recommendation available at this moment");
  }
}
function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 41);
    \u0275\u0275element(1, "markdown", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 2);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.explanation || "No explanation available at this moment");
  }
}
function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 41);
    \u0275\u0275element(1, "markdown", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("itemKey", 3);
    \u0275\u0275advance();
    \u0275\u0275property("data", ctx_r0.singleVuln.refs || "No references available at this moment");
  }
}
function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_18_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275text(1, " No comments yet. Be the first to comment! ");
    \u0275\u0275elementEnd();
  }
}
function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_18_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52)(1, "div", 53)(2, "div", 54)(3, "div", 55);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 56)(6, "div", 57)(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "small", 58);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 59);
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
function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_18_c_spinner_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 60);
  }
}
function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-tab-panel", 41);
    \u0275\u0275template(1, CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_18_div_1_Template, 2, 0, "div", 43);
    \u0275\u0275elementStart(2, "div", 44);
    \u0275\u0275template(3, CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_18_div_3_Template, 14, 7, "div", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 46)(5, "form", 47);
    \u0275\u0275listener("ngSubmit", function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_18_Template_form_ngSubmit_5_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.addComment());
    });
    \u0275\u0275elementStart(6, "input", 48);
    \u0275\u0275twoWayListener("ngModelChange", function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_18_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r0.newComment, $event) || (ctx_r0.newComment = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_18_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onNewCommentChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 49);
    \u0275\u0275template(8, CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_18_c_spinner_8_Template, 1, 0, "c-spinner", 50);
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
function CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tabs", 35)(1, "c-tabs-list", 36)(2, "button", 37);
    \u0275\u0275text(3, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 37);
    \u0275\u0275text(5, "Recommendation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 37);
    \u0275\u0275text(7, "Explanation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 37);
    \u0275\u0275text(9, "References");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 37);
    \u0275\u0275text(11, " Comments ");
    \u0275\u0275template(12, CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_badge_12_Template, 2, 1, "c-badge", 38);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "c-tabs-content");
    \u0275\u0275template(14, CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_14_Template, 2, 2, "c-tab-panel", 39)(15, CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_15_Template, 2, 2, "c-tab-panel", 39)(16, CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_16_Template, 2, 2, "c-tab-panel", 39)(17, CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_17_Template, 2, 2, "c-tab-panel", 39)(18, CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_c_tab_panel_18_Template, 10, 7, "c-tab-panel", 39);
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
function CloudVulnerabilityDetailsComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "c-row")(2, "c-col", 5)(3, "c-card", 6)(4, "c-card-header");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "c-card-body")(7, "div", 7)(8, "u")(9, "b");
    \u0275\u0275text(10, "Component:");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "c-card-footer")(14, "u")(15, "b");
    \u0275\u0275text(16, "Status:");
    \u0275\u0275elementEnd()();
    \u0275\u0275text(17, " \xA0\xA0 ");
    \u0275\u0275template(18, CloudVulnerabilityDetailsComponent_div_5__svg_svg_18_Template, 1, 0, "svg", 8)(19, CloudVulnerabilityDetailsComponent_div_5__svg_svg_19_Template, 1, 0, "svg", 9)(20, CloudVulnerabilityDetailsComponent_div_5__svg_svg_20_Template, 1, 0, "svg", 10)(21, CloudVulnerabilityDetailsComponent_div_5__svg_svg_21_Template, 1, 0, "svg", 11);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "c-col", 12)(24, "c-card", 6)(25, "c-card-header")(26, "div", 13);
    \u0275\u0275template(27, CloudVulnerabilityDetailsComponent_div_5_span_27_Template, 1, 0, "span", 14)(28, CloudVulnerabilityDetailsComponent_div_5_span_28_Template, 1, 0, "span", 15)(29, CloudVulnerabilityDetailsComponent_div_5_span_29_Template, 1, 0, "span", 16)(30, CloudVulnerabilityDetailsComponent_div_5_span_30_Template, 1, 0, "span", 16)(31, CloudVulnerabilityDetailsComponent_div_5_c_spinner_31_Template, 1, 0, "c-spinner", 17)(32, CloudVulnerabilityDetailsComponent_div_5_span_32_Template, 2, 1, "span", 18)(33, CloudVulnerabilityDetailsComponent_div_5_span_33_Template, 2, 1, "span", 18)(34, CloudVulnerabilityDetailsComponent_div_5_span_34_Template, 2, 1, "span", 19)(35, CloudVulnerabilityDetailsComponent_div_5_span_35_Template, 2, 1, "span", 20)(36, CloudVulnerabilityDetailsComponent_div_5_span_36_Template, 2, 1, "span", 20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "c-card-body")(38, "div")(39, "u")(40, "b");
    \u0275\u0275text(41, "Detected:");
    \u0275\u0275elementEnd()();
    \u0275\u0275text(42);
    \u0275\u0275pipe(43, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "div", 21)(45, "u")(46, "b");
    \u0275\u0275text(47, "Last Seen:");
    \u0275\u0275elementEnd()();
    \u0275\u0275text(48);
    \u0275\u0275pipe(49, "date");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(50, "c-row")(51, "c-col", 22);
    \u0275\u0275template(52, CloudVulnerabilityDetailsComponent_div_5_c_tabs_52_Template, 19, 12, "c-tabs", 23);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.name, " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.location, " ");
    \u0275\u0275advance(6);
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
    \u0275\u0275textInterpolate1(" \xA0\xA0 ", \u0275\u0275pipeBind1(43, 20, ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.inserted), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" \xA0\xA0 ", \u0275\u0275pipeBind1(49, 22, ctx_r0.singleVuln == null ? null : ctx_r0.singleVuln.vulnsResponseDto == null ? null : ctx_r0.singleVuln.vulnsResponseDto.last_seen), " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.singleVuln);
  }
}
var CloudVulnerabilityDetailsComponent = class _CloudVulnerabilityDetailsComponent {
  constructor() {
    this.detailsModal = false;
    this.selectedRowId = null;
    this.isAddingComment = false;
    this.newComment = "";
    this.handleDetailsModalEvent = new EventEmitter();
    this.closeModalEvent = new EventEmitter();
    this.addCommentEvent = new EventEmitter();
    this.newCommentChange = new EventEmitter();
  }
  handleDetailsModal(visible) {
    this.handleDetailsModalEvent.emit(visible);
  }
  closeModal() {
    this.closeModalEvent.emit();
  }
  addComment() {
    this.addCommentEvent.emit();
  }
  onNewCommentChange(value) {
    this.newComment = value;
    this.newCommentChange.emit(value);
  }
  static {
    this.\u0275fac = function CloudVulnerabilityDetailsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CloudVulnerabilityDetailsComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CloudVulnerabilityDetailsComponent, selectors: [["app-cloud-vulnerability-details"]], inputs: { detailsModal: "detailsModal", selectedRowId: "selectedRowId", singleVuln: "singleVuln", isAddingComment: "isAddingComment", newComment: "newComment" }, outputs: { handleDetailsModalEvent: "handleDetailsModalEvent", closeModalEvent: "closeModalEvent", addCommentEvent: "addCommentEvent", newCommentChange: "newCommentChange" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 10, vars: 2, consts: [["size", "lg", "id", "detailsModal", "alignment", "center", 3, "visibleChange", "visible"], ["cModalTitle", ""], [4, "ngIf"], [1, "w-100", "d-flex", "justify-content-end", "align-items-center"], ["cButton", "", "color", "secondary", 3, "click"], ["xs", "8"], [1, "mb-4"], [1, "d-flex", "align-items-center"], ["cIcon", "", "name", "cil-burn", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cil-graph", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cil-trash", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cil-volume-off", "class", "me-2", 4, "ngIf"], ["xs", "4"], [1, "d-flex", "align-items-center", "justify-content-center"], ["class", "dot high", 4, "ngIf"], ["class", "dot medium", 4, "ngIf"], ["class", "dot low", 4, "ngIf"], ["color", "danger", "variant", "grow", "size", "sm", 4, "ngIf"], ["class", "high-t ms-2", 4, "ngIf"], ["class", "medium-t ms-2", 4, "ngIf"], ["class", "low-t ms-2", 4, "ngIf"], [1, "mt-2"], ["xs", "12"], [3, "activeItemKey", 4, "ngIf"], ["cIcon", "", "name", "cil-burn", 1, "me-2"], ["cIcon", "", "name", "cil-graph", 1, "me-2"], ["cIcon", "", "name", "cil-trash", 1, "me-2"], ["cIcon", "", "name", "cil-volume-off", 1, "me-2"], [1, "dot", "high"], [1, "dot", "medium"], [1, "dot", "low"], ["color", "danger", "variant", "grow", "size", "sm"], [1, "high-t", "ms-2"], [1, "medium-t", "ms-2"], [1, "low-t", "ms-2"], [3, "activeItemKey"], ["variant", "underline-border"], ["cTab", "", 3, "itemKey"], ["color", "info", "class", "ms-1", 4, "ngIf"], ["class", "p-3", 3, "itemKey", 4, "ngIf"], ["color", "info", 1, "ms-1"], [1, "p-3", 3, "itemKey"], [3, "data"], ["class", "text-center text-muted my-4", 4, "ngIf"], [1, "comments-container"], ["class", "comment-item mb-3", 4, "ngFor", "ngForOf"], [1, "mt-3"], [1, "d-flex", 3, "ngSubmit"], ["type", "text", "name", "newComment", "placeholder", "Type your comment...", "required", "", 1, "form-control", "me-2", 3, "ngModelChange", "ngModel", "disabled"], ["cButton", "", "color", "primary", "type", "submit", 3, "disabled"], ["size", "sm", "class", "me-1", 4, "ngIf"], [1, "text-center", "text-muted", "my-4"], [1, "comment-item", "mb-3"], [1, "d-flex"], [1, "comment-avatar"], [1, "rounded-circle", "bg-light", "d-flex", "align-items-center", "justify-content-center", 2, "width", "40px", "height", "40px"], [1, "ms-3", "flex-grow-1"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "text-muted"], [1, "comment-content", "mt-1", "p-2", "bg-light", "rounded"], ["size", "sm", 1, "me-1"]], template: function CloudVulnerabilityDetailsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-modal", 0);
        \u0275\u0275listener("visibleChange", function CloudVulnerabilityDetailsComponent_Template_c_modal_visibleChange_0_listener($event) {
          return ctx.handleDetailsModal($event);
        });
        \u0275\u0275elementStart(1, "c-modal-header")(2, "h5", 1);
        \u0275\u0275text(3, "Vulnerability Details");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(4, "c-modal-body");
        \u0275\u0275template(5, CloudVulnerabilityDetailsComponent_div_5_Template, 53, 24, "div", 2);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "c-modal-footer")(7, "div", 3)(8, "button", 4);
        \u0275\u0275listener("click", function CloudVulnerabilityDetailsComponent_Template_button_click_8_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(9, "Close");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275property("visible", ctx.detailsModal);
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ctx.selectedRowId !== null);
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
      DefaultValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      RequiredValidator,
      NgModel,
      NgForm,
      MarkdownModule,
      MarkdownComponent
    ], styles: ["\n\n.dot[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  display: inline-block;\n}\n.critical[_ngcontent-%COMP%] {\n  background-color: red;\n}\n.high[_ngcontent-%COMP%] {\n  background-color: #f33d3d;\n}\n.medium[_ngcontent-%COMP%] {\n  background-color: #e38334;\n}\n.low[_ngcontent-%COMP%] {\n  background-color: #47a3d3;\n}\n.critical-t[_ngcontent-%COMP%] {\n  color: red;\n}\n.high-t[_ngcontent-%COMP%] {\n  color: #f33d3d;\n}\n.medium-t[_ngcontent-%COMP%] {\n  color: #e38334;\n}\n.low-t[_ngcontent-%COMP%] {\n  color: #47a3d3;\n}\n.comments-container[_ngcontent-%COMP%]   .comment-item[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.125);\n  padding-bottom: 1rem;\n}\n.comments-container[_ngcontent-%COMP%]   .comment-item[_ngcontent-%COMP%]   .comment-avatar[_ngcontent-%COMP%]   .rounded-circle[_ngcontent-%COMP%] {\n  background-color: #f8f9fa;\n  color: #6c757d;\n  font-weight: bold;\n}\n.comments-container[_ngcontent-%COMP%]   .comment-item[_ngcontent-%COMP%]   .comment-content[_ngcontent-%COMP%] {\n  background-color: #f8f9fa;\n  border-radius: 0.5rem;\n  padding: 0.5rem 1rem;\n}\n.markdown-body[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  min-width: 200px;\n  max-width: 980px;\n  margin: 0 auto;\n  padding: 45px;\n}\n/*# sourceMappingURL=cloud-vulnerability-details.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CloudVulnerabilityDetailsComponent, { className: "CloudVulnerabilityDetailsComponent" });
})();

// src/app/views/show-cloud-subscription/show-cloud-subscription.component.ts
var _c02 = () => ({ prop: "insertedDate", dir: "desc" });
var _c1 = (a0) => [a0];
var _c2 = () => ({ "datatable-column": true, "centered-column": true });
function ShowCloudSubscriptionComponent_div_104_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68);
    \u0275\u0275element(1, "c-spinner", 69);
    \u0275\u0275elementStart(2, "span", 70);
    \u0275\u0275text(3, "Loading scan history...");
    \u0275\u0275elementEnd()();
  }
}
function ShowCloudSubscriptionComponent_div_105_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 78);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 79);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r1 = ctx.row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(3, 1, row_r1.insertedDate, "medium"), " ");
  }
}
function ShowCloudSubscriptionComponent_div_105_ng_template_5_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 81)(1, "span", 82);
    \u0275\u0275text(2, "High:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "c-badge", 85);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r2 = \u0275\u0275nextContext().row;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(row_r2.highFindings);
  }
}
function ShowCloudSubscriptionComponent_div_105_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 80)(1, "div", 81)(2, "span", 82);
    \u0275\u0275text(3, "Critical:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "c-badge", 83);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, ShowCloudSubscriptionComponent_div_105_ng_template_5_div_6_Template, 5, 1, "div", 84);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r2 = ctx.row;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(row_r2.criticalFindings);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r2.highFindings !== void 0);
  }
}
function ShowCloudSubscriptionComponent_div_105_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 86);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 87);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("cTooltip", "View scan details");
  }
}
function ShowCloudSubscriptionComponent_div_105_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 88);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 89);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "h5");
    \u0275\u0275text(3, "No scan history");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "No scans have been performed on this cloud subscription yet.");
    \u0275\u0275elementEnd()();
  }
}
function ShowCloudSubscriptionComponent_div_105_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 71)(1, "ngx-datatable", 72)(2, "ngx-datatable-column", 73);
    \u0275\u0275template(3, ShowCloudSubscriptionComponent_div_105_ng_template_3_Template, 4, 4, "ng-template", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ngx-datatable-column", 75);
    \u0275\u0275template(5, ShowCloudSubscriptionComponent_div_105_ng_template_5_Template, 7, 2, "ng-template", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "ngx-datatable-column", 76);
    \u0275\u0275template(7, ShowCloudSubscriptionComponent_div_105_ng_template_7_Template, 2, 1, "ng-template", 74);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(8, ShowCloudSubscriptionComponent_div_105_div_8_Template, 6, 0, "div", 77);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("rows", ctx_r2.cloudScanInfos)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", ctx_r2.cloudScanInfoLimit)("sorts", \u0275\u0275pureFunction1(15, _c1, \u0275\u0275pureFunction0(14, _c02)));
    \u0275\u0275advance();
    \u0275\u0275property("width", 200)("sortable", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("sortable", false);
    \u0275\u0275advance(2);
    \u0275\u0275property("width", 100)("sortable", false)("ngClass", \u0275\u0275pureFunction0(17, _c2));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r2.cloudScanInfos.length === 0);
  }
}
function ShowCloudSubscriptionComponent_option_135_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 59);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r4 = ctx.$implicit;
    \u0275\u0275property("ngValue", team_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", team_r4.name, " ");
  }
}
var ShowCloudSubscriptionComponent = class _ShowCloudSubscriptionComponent {
  constructor(iconSet, cloudSubscriptionService, authService, router, route, datePipe, cdr, teamService) {
    this.iconSet = iconSet;
    this.cloudSubscriptionService = cloudSubscriptionService;
    this.authService = authService;
    this.router = router;
    this.route = route;
    this.datePipe = datePipe;
    this.cdr = cdr;
    this.teamService = teamService;
    this.id = "";
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
    this.findingsCounts = { critical: 0, high: 0, rest: 0 };
    this.issuesCounts = { critical: 0, high: 0, rest: 0 };
    this.counts = { critical: 0, high: 0, rest: 0 };
    this.vulns = [];
    this.issues = [];
    this.filteredVulns = [...this.vulns];
    this.filteredIssues = [...this.issues];
    this.cloudSubscriptionFindingStats = [];
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
          label: "Cloud Scan",
          backgroundColor: "rgba(220, 220, 220, 0.2)",
          borderColor: "rgba(220, 220, 220, 1)",
          pointBackgroundColor: "rgba(220, 220, 220, 1)",
          pointBorderColor: "#fff",
          data: []
        }
      ]
    };
    this.filters = {
      actions: "",
      name: "",
      location: "",
      source: "",
      status: "",
      severity: "",
      dates: ""
    };
    this.issuesFilters = {
      actions: "",
      name: "",
      location: "",
      source: "",
      status: "",
      severity: "",
      dates: ""
    };
    this.statusFilter = "";
    this.statusIssuesFilter = "";
    this.showRemoved = false;
    this.showIssuesRemoved = false;
    this.detailsModal = false;
    this.selectedRowId = null;
    this.cloudScanInfosLoading = false;
    this.cloudScanInfoLimit = 15;
    this.vulnerabilitiesLoading = false;
    this.vulnerabilitiesLimit = 15;
    this.issuesLoading = false;
    this.issuesLimit = 15;
    this.scanRunning = false;
    this.userRole = "USER";
    this.changeTeamModalVisible = false;
    this.confirmationModalVisible = false;
    this.confirmationText = "";
    this.availableTeams = [];
    this.selectedNewTeamId = null;
    this.cloudScanInfos = [];
    this.newComment = "";
    this.isAddingComment = false;
    this.filterUiSnapshot = null;
    this.issuesFilterUiSnapshot = null;
    this.findingsLoaded = false;
    this.issuesLoaded = false;
    this.findingsIssuesChartData = {
      labels: ["Findings", "Issues"],
      datasets: [
        {
          data: [this.findingsPercentage, this.issuesPercentage],
          backgroundColor: ["#36A2EB", "#FF6384"]
        }
      ]
    };
    this.findingsIssuesChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const value = context.parsed || 0;
              return `${label}: ${value}%`;
            }
          }
        }
      }
    };
    this.position = "top-end";
    this.visible = false;
    this.percentage = 0;
    this.toastMessage = "";
    this.toastStatus = "";
    iconSet.icons = __spreadValues(__spreadValues({}, brand_exports), free_exports);
    this.applyFilters();
  }
  ngAfterViewInit() {
  }
  ngOnInit() {
    this.userRole = localStorage.getItem("userRole");
    this.cdr.detectChanges();
    this.route.paramMap.subscribe((params) => {
      this.id = params.get("id") || "";
    });
    this.authService.hc().subscribe({
      next: () => {
      },
      error: () => {
        this.router.navigate(["/login"]);
      }
    });
    this.loadCloudSubscriptionInfo();
    this.loadCloudFindings();
    this.loadCloudIssues();
    this.loadCloudSubscriptionFindingStats();
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
  loadCloudSubscriptionInfo() {
    this.cloudScanInfosLoading = true;
    this.cloudSubscriptionService.getCloudSubscription(+this.id).subscribe({
      next: (response) => {
        this.cloudSubscriptionData = response;
        this.cloudScanInfos = response.cloudScanInfos;
        this.cloudScanInfosLoading = false;
        if (response.scanStatus === "RUNNING") {
          this.scanRunning = true;
        }
      },
      error: () => {
        this.cloudScanInfosLoading = false;
      }
    });
  }
  loadCloudFindings() {
    this.vulnerabilitiesLoading = true;
    this.cloudSubscriptionService.getFindings(+this.id).subscribe({
      next: (response) => {
        this.vulns = response;
        this.filteredVulns = [...this.vulns];
        this.findingsCounts = this.countFindings(this.vulns);
        this.findingsLoaded = true;
        this.tryUpdateSummaryCounts();
        this.applyFilters();
        this.vulnerabilitiesLoading = false;
      },
      error: () => {
        this.vulnerabilitiesLoading = false;
      }
    });
  }
  loadCloudIssues() {
    this.issuesLoading = true;
    this.cloudSubscriptionService.getIssues(+this.id).subscribe({
      next: (response) => {
        this.issues = response;
        this.filteredIssues = [...this.issues];
        this.issuesCounts = this.countFindings(this.issues);
        this.issuesLoaded = true;
        this.tryUpdateSummaryCounts();
        this.applyIssuesFilters();
        this.issuesLoading = false;
      },
      error: () => {
        this.issuesLoading = false;
      }
    });
  }
  tryUpdateSummaryCounts() {
    if (this.findingsLoaded && this.issuesLoaded) {
      this.updateSummaryCounts();
    }
  }
  updateSummaryCounts() {
    const findings = this.findingsCounts || {};
    const issues = this.issuesCounts || {};
    this.counts = {
      critical: (findings.critical || 0) + (issues.critical || 0),
      high: (findings.high || 0) + (issues.high || 0),
      rest: (findings.rest || 0) + (issues.rest || 0)
    };
    this.updateFindingsIssuesChartData();
    this.findingsLoaded = false;
    this.issuesLoaded = false;
  }
  get findingsTotal() {
    return Object.values(this.findingsCounts).reduce((a, b) => a + b, 0);
  }
  get issuesTotal() {
    return Object.values(this.issuesCounts).reduce((a, b) => a + b, 0);
  }
  get total() {
    return this.findingsTotal + this.issuesTotal;
  }
  get findingsPercentage() {
    return this.total === 0 ? 0 : Math.round(this.findingsTotal / this.total * 100);
  }
  get issuesPercentage() {
    return this.total === 0 ? 0 : Math.round(this.issuesTotal / this.total * 100);
  }
  updateFindingsIssuesChartData() {
    this.findingsIssuesChartData = {
      labels: ["Findings", "Issues"],
      datasets: [
        {
          data: [this.findingsPercentage, this.issuesPercentage],
          backgroundColor: ["#36A2EB", "#FF6384"]
        }
      ]
    };
    this.cdr.detectChanges();
  }
  loadCloudSubscriptionFindingStats() {
    this.cloudSubscriptionService.getCloudFindingStats(+this.id).subscribe({
      next: (response) => {
        this.cloudSubscriptionFindingStats = response.sort((a, b) => new Date(a.dateInserted).getTime() - new Date(b.dateInserted).getTime());
        this.prepareChartData();
      }
    });
  }
  prepareChartData() {
    const labels = this.cloudSubscriptionFindingStats.map((stat) => this.datePipe.transform(stat.dateInserted, "dd MMM"));
    const cloudScanData = this.cloudSubscriptionFindingStats.map((stat) => stat.criticalFindings + stat.highFindings);
    this.chartLineData = {
      labels,
      datasets: [
        {
          label: "Cloud Scan",
          backgroundColor: "rgba(220, 220, 220, 0.2)",
          borderColor: "rgba(220, 220, 220, 1)",
          pointBackgroundColor: "rgba(220, 220, 220, 1)",
          pointBorderColor: "#fff",
          data: cloudScanData
        }
      ]
    };
    this.cdr.detectChanges();
  }
  getLastOpenedFindings() {
    return this.cloudSubscriptionFindingStats.length > 0 ? this.cloudSubscriptionFindingStats[this.cloudSubscriptionFindingStats.length - 1].openedFindings : 0;
  }
  getLastRemovedFinding() {
    return this.cloudSubscriptionFindingStats.length > 0 ? this.cloudSubscriptionFindingStats[this.cloudSubscriptionFindingStats.length - 1].removedFindings : 0;
  }
  getLastFixTime() {
    return this.cloudSubscriptionFindingStats.length > 0 ? this.cloudSubscriptionFindingStats[this.cloudSubscriptionFindingStats.length - 1].averageFixTime : 0;
  }
  countFindings(vulnerabilities) {
    const counts = {
      critical: 0,
      high: 0,
      rest: 0
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
      }
    });
    return counts;
  }
  updateFilterName(event) {
    const val = event.target.value.toLowerCase();
    this.filters["name"] = val;
    this.applyFilters();
  }
  updateIssuesFilterName(event) {
    const val = event.target.value.toLowerCase();
    this.issuesFilters["name"] = val;
    this.applyIssuesFilters();
  }
  updateFilterLocation(event) {
    const val = event.target.value.toLowerCase();
    this.filters["location"] = val;
    this.applyFilters();
  }
  updateIssuesFilterLocation(event) {
    const val = event.target.value.toLowerCase();
    this.issuesFilters["location"] = val;
    this.applyIssuesFilters();
  }
  updateFilterStatus(event) {
    const val = event.target.value;
    this.filters["status"] = val;
    this.statusFilter = val;
    if (val === "REMOVED") {
      if (!this.showRemoved)
        this.showRemoved = true;
    } else if (val === "SUPRESSED") {
    } else if (val === "NEW" || val === "EXISTING" || val === "") {
      if (this.showRemoved)
        this.showRemoved = false;
    }
    this.applyFilters();
  }
  updateIssuesFilterStatus(event) {
    const val = event.target.value;
    this.issuesFilters["status"] = val;
    this.statusIssuesFilter = val;
    if (val === "REMOVED") {
      if (!this.showIssuesRemoved)
        this.showIssuesRemoved = true;
    } else if (val === "SUPRESSED") {
    } else if (val === "NEW" || val === "EXISTING" || val === "") {
      if (this.showIssuesRemoved)
        this.showIssuesRemoved = false;
    }
    this.applyIssuesFilters();
  }
  updateFilterSeverity(event) {
    const val = event.target.value;
    this.filters["severity"] = val;
    this.applyFilters();
  }
  updateIssuesFilterSeverity(event) {
    const val = event.target.value;
    this.issuesFilters["severity"] = val;
    this.applyIssuesFilters();
  }
  toggleShowRemoved(event) {
    this.showRemoved = event.target.checked;
    this.applyFilters();
  }
  toggleShowIssuesRemoved(event) {
    this.showIssuesRemoved = event.target.checked;
    this.applyIssuesFilters();
  }
  applyFilters() {
    this.filteredVulns = this.vulns.filter((vuln) => {
      const matchesFilters = Object.keys(this.filters).every((key) => {
        const filterValue = this.filters[key];
        if (!filterValue)
          return true;
        const vulnValue = vuln[key];
        return vulnValue.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
      const matchesStatus = this.showRemoved || vuln.status !== "REMOVED";
      return matchesFilters && matchesStatus;
    });
  }
  applyIssuesFilters() {
    this.filteredIssues = this.issues.filter((issue) => {
      const matchesIssuesFilters = Object.keys(this.issuesFilters).every((key) => {
        const filterIssueValue = this.issuesFilters[key];
        if (!filterIssueValue)
          return true;
        const issueValue = issue[key];
        return issueValue.toString().toLowerCase().includes(filterIssueValue.toLowerCase());
      });
      const matchesIssuesStatus = this.showIssuesRemoved || issue.status !== "REMOVED";
      return matchesIssuesFilters && matchesIssuesStatus;
    });
  }
  clearVulnFilters() {
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
    this.statusFilter = "";
    this.applyFilters();
  }
  clearIssuesFilters() {
    this.issuesFilters = {
      actions: "",
      name: "",
      location: "",
      source: "",
      status: "",
      severity: "",
      dates: ""
    };
    this.showIssuesRemoved = false;
    this.statusIssuesFilter = "";
    this.applyIssuesFilters();
  }
  runScan() {
    this.scanRunning = true;
    this.cdr.detectChanges();
    this.cloudSubscriptionService.runScan(+this.id).subscribe({
      next: (response) => {
        this.toastStatus = "success";
        this.toastMessage = "Successfully requested a scan";
        this.toggleToast();
        this.scanRunning = false;
        this.loadCloudFindings();
        this.loadCloudIssues();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.scanRunning = false;
        this.toastStatus = "danger";
        this.toastMessage = "Error starting scan";
        this.toggleToast();
      }
    });
  }
  openChangeTeamModal() {
    this.teamService.get().subscribe({
      next: (teams) => {
        this.availableTeams = teams.filter((team) => team.id !== this.cloudSubscriptionData?.team?.id);
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
      this.cloudSubscriptionService.changeTeam(this.cloudSubscriptionData.id, this.selectedNewTeamId).subscribe({
        next: () => {
          this.toastStatus = "success";
          this.toastMessage = "Team changed successfully";
          this.toggleToast();
          this.loadCloudSubscriptionInfo();
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
  addComment() {
    if (!this.newComment?.trim() || this.isAddingComment || this.selectedRowId === null) {
      return;
    }
    const findingId = this.selectedRowId;
    this.isAddingComment = true;
    this.cloudSubscriptionService.addComment(+this.id, findingId, this.newComment.trim()).subscribe({
      next: () => {
        if (findingId !== null) {
          this.cloudSubscriptionService.getFinding(+this.id, findingId).subscribe({
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
  toggleToast() {
    this.visible = !this.visible;
  }
  viewVulnerabilityDetails(row) {
    this.filterUiSnapshot = {
      filters: __spreadValues({}, this.filters),
      showRemoved: this.showRemoved,
      statusFilter: this.statusFilter
    };
    this.selectedRowId = row.id;
    this.detailsModal = true;
    this.cloudSubscriptionService.getFinding(+this.id, this.selectedRowId).subscribe({
      next: (response) => {
        this.singleVuln = response;
        this.cdr.markForCheck();
      }
    });
  }
  viewIssueDetails(row) {
    this.issuesFilterUiSnapshot = {
      issuesFilters: __spreadValues({}, this.issuesFilters),
      showIssuesRemoved: this.showIssuesRemoved,
      statusIssuesFilter: this.statusIssuesFilter
    };
    this.selectedRowId = row.id;
    this.detailsModal = true;
    this.cloudSubscriptionService.getFinding(+this.id, this.selectedRowId).subscribe({
      next: (response) => {
        this.singleVuln = response;
        this.cdr.markForCheck();
      }
    });
  }
  onVisibleChange($event) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }
  handleDetailsModal(visible) {
    this.detailsModal = visible;
  }
  closeModal() {
    this.detailsModal = false;
  }
  /**
   * Handle refresh data with visual feedback
   */
  refreshData() {
    this.toastStatus = "info";
    this.toastMessage = "Refreshing statistics data...";
    this.toggleToast();
    this.loadCloudSubscriptionFindingStats();
  }
  static {
    this.\u0275fac = function ShowCloudSubscriptionComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ShowCloudSubscriptionComponent)(\u0275\u0275directiveInject(IconSetService), \u0275\u0275directiveInject(CloudSubscriptionService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(DatePipe), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(TeamService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ShowCloudSubscriptionComponent, selectors: [["app-show-cloud-subscription"]], standalone: true, features: [\u0275\u0275ProvidersFeature([DatePipe, provideMarkdown()]), \u0275\u0275StandaloneFeature], decls: 160, vars: 72, consts: [[1, "cloud-subscription-container"], [1, "header-section"], [1, "align-items-stretch"], [3, "lg", "md"], [1, "h-100"], [1, "h-100", "d-flex", "flex-column", 3, "runScanEvent", "openChangeTeamModalEvent", "cloudSubscriptionData", "scanRunning", "userRole"], [1, "h-100", "d-flex", "flex-column", "flex-grow-1", "justify-content-center"], [1, "d-flex", "flex-column", "flex-grow-1", "justify-content-center"], [1, "mb-3"], ["textWhite", "", 1, "findings-bar", 3, "value"], ["textWhite", "", 1, "issues-bar", 3, "value"], [1, "text-center", "mt-2"], [3, "counts"], ["variant", "underline-border"], ["cTab", "", 3, "itemKey"], ["cIcon", "", "name", "cil-bug", 1, "me-2"], ["cIcon", "", "name", "cil-shield-alt", 1, "me-2"], ["cIcon", "", "name", "cil-chart-line", 1, "me-2"], ["cIcon", "", "name", "cil-magnifying-glass", 1, "me-2"], ["cIcon", "", "name", "cil-burn", 1, "me-2"], ["cIcon", "", "name", "cil-info", 1, "me-2"], [1, "p-3", 3, "itemKey"], [3, "updateFilterNameEvent", "updateFilterLocationEvent", "updateFilterStatusEvent", "updateFilterSeverityEvent", "toggleShowRemovedEvent", "viewVulnerabilityDetailsEvent", "vulnerabilitiesLimitChange", "clearVulnFiltersEvent", "filteredVulns", "vulnerabilitiesLoading", "vulnerabilitiesLimit", "showRemoved", "sourceType"], [3, "updateIssuesFilterNameEvent", "updateIssuesFilterLocationEvent", "updateIssuesFilterStatusEvent", "updateIssuesFilterSeverityEvent", "toggleShowIssuesRemovedEvent", "viewVulnerabilityDetailsEvent", "vulnerabilitiesLimitChange", "clearIssuesFiltersEvent", "filteredIssues", "vulnerabilitiesLoading", "vulnerabilitiesLimit", "showIssuesRemoved", "sourceType"], [1, "statistics-container"], [1, "trend-chart-card", "mb-4"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "mb-0"], ["cButton", "", "color", "light", "variant", "ghost", 1, "refresh-btn", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-sync"], ["type", "line", 3, "data", "options"], [1, "stats-metrics-container"], [1, "mb-4", 3, "md", "sm"], [1, "metric-card", "opened-findings"], [1, "metric-icon"], ["cIcon", "", "name", "cilChartLine", "height", "36"], [1, "metric-content"], [1, "metric-title"], [1, "metric-value"], ["thin", "", "color", "info", 1, "metric-progress", 3, "value"], [1, "metric-card", "closed-findings"], ["cIcon", "", "name", "cilInput", "height", "36"], ["thin", "", "color", "success", 1, "metric-progress", 3, "value"], [1, "metric-card", "fix-time"], ["cIcon", "", "name", "cilClock", "height", "36"], [1, "metric-unit"], ["thin", "", "color", "danger", 1, "metric-progress", 3, "value"], [1, "scan-info-card"], ["class", "loading-container", 4, "ngIf"], ["class", "scan-content", 4, "ngIf"], ["color", "primary", 1, "d-flex", "align-items-center"], ["cIcon", "", "name", "cil-info", "width", "24", "height", "24", 1, "flex-shrink-0", "me-2"], [3, "handleDetailsModalEvent", "closeModalEvent", "addCommentEvent", "newCommentChange", "detailsModal", "selectedRowId", "singleVuln", "isAddingComment", "newComment"], ["position", "fixed", 1, "p-3", 3, "placement"], [3, "visibleChange", "color", "visible"], ["size", "lg", "id", "changeTeamModal", "alignment", "center", 3, "visibleChange", "visible"], ["cModalTitle", ""], ["cLabel", "", "for", "newTeamSelect"], ["id", "newTeamSelect", 1, "form-select", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [3, "ngValue", 4, "ngFor", "ngForOf"], ["cButton", "", "color", "secondary", 3, "click"], ["cButton", "", "color", "primary", 3, "click", "disabled"], ["size", "lg", "id", "confirmationModal", "alignment", "center", 3, "visibleChange", "visible"], [1, "alert", "alert-warning"], [1, "alert-heading"], ["type", "text", "placeholder", "Type 'accept' to confirm", 1, "form-control", 3, "ngModelChange", "ngModel"], ["cButton", "", "color", "danger", 3, "click", "disabled"], [1, "loading-container"], ["color", "primary"], [1, "loading-text"], [1, "scan-content"], [1, "bootstrap", "scan-datatable", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit", "sorts"], ["name", "Scan Date", "prop", "insertedDate", 3, "width", "sortable"], ["ngx-datatable-cell-template", ""], ["name", "Findings", 3, "sortable"], ["name", "Actions", 3, "width", "sortable", "ngClass"], ["class", "empty-state", 4, "ngIf"], [1, "date-display"], ["cIcon", "", "name", "cil-calendar", 1, "me-2"], [1, "findings-display"], [1, "finding-category"], [1, "category-label"], ["color", "danger", 1, "finding-badge"], ["class", "finding-category", 4, "ngIf"], ["color", "warning", 1, "finding-badge"], ["cButton", "", "color", "primary", "variant", "ghost", "size", "sm", 1, "action-btn", 3, "cTooltip"], ["cIcon", "", "name", "cil-magnifying-glass"], [1, "empty-state"], ["cIcon", "", "name", "cil-history", "width", "48", "height", "48"]], template: function ShowCloudSubscriptionComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "c-row", 2)(3, "c-col", 3)(4, "div", 4)(5, "app-cloud-subscription-info", 5);
        \u0275\u0275listener("runScanEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_subscription_info_runScanEvent_5_listener() {
          return ctx.runScan();
        })("openChangeTeamModalEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_subscription_info_openChangeTeamModalEvent_5_listener() {
          return ctx.openChangeTeamModal();
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(6, "c-col", 3)(7, "div", 4)(8, "c-card", 6)(9, "c-card-header")(10, "strong");
        \u0275\u0275text(11, "Findings vs Issues Distribution");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "c-card-body", 7)(13, "c-progress", 8)(14, "c-progress-bar", 9);
        \u0275\u0275text(15);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "c-progress-bar", 10);
        \u0275\u0275text(17);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(18, "div", 11)(19, "strong");
        \u0275\u0275text(20, "Findings:");
        \u0275\u0275elementEnd();
        \u0275\u0275text(21);
        \u0275\u0275elementStart(22, "strong");
        \u0275\u0275text(23, "Issues:");
        \u0275\u0275elementEnd();
        \u0275\u0275text(24);
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(25, "c-row")(26, "c-col", 3);
        \u0275\u0275element(27, "app-cloud-vulnerability-summary", 12);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(28, "c-card")(29, "c-tabs")(30, "c-tabs-list", 13)(31, "button", 14);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(32, "svg", 15);
        \u0275\u0275text(33, " Vulnerabilities ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(34, "button", 14);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(35, "svg", 16);
        \u0275\u0275text(36, " Issues ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(37, "button", 14);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(38, "svg", 17);
        \u0275\u0275text(39, " Statistics & Trends ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(40, "button", 14);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(41, "svg", 18);
        \u0275\u0275text(42, " Scan History ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(43, "button", 14);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(44, "svg", 19);
        \u0275\u0275text(45, " Notifications ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(46, "button", 14);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(47, "svg", 20);
        \u0275\u0275text(48, " Additional Info ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(49, "c-tabs-content")(50, "c-tab-panel", 21)(51, "app-cloud-vulnerabilities-table", 22);
        \u0275\u0275listener("updateFilterNameEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_updateFilterNameEvent_51_listener($event) {
          return ctx.updateFilterName($event);
        })("updateFilterLocationEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_updateFilterLocationEvent_51_listener($event) {
          return ctx.updateFilterLocation($event);
        })("updateFilterStatusEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_updateFilterStatusEvent_51_listener($event) {
          return ctx.updateFilterStatus($event);
        })("updateFilterSeverityEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_updateFilterSeverityEvent_51_listener($event) {
          return ctx.updateFilterSeverity($event);
        })("toggleShowRemovedEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_toggleShowRemovedEvent_51_listener($event) {
          return ctx.toggleShowRemoved($event);
        })("viewVulnerabilityDetailsEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_viewVulnerabilityDetailsEvent_51_listener($event) {
          return ctx.viewVulnerabilityDetails($event);
        })("vulnerabilitiesLimitChange", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_vulnerabilitiesLimitChange_51_listener($event) {
          return ctx.vulnerabilitiesLimit = $event;
        })("clearVulnFiltersEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_clearVulnFiltersEvent_51_listener() {
          return ctx.clearVulnFilters();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(52, "c-tab-panel", 21)(53, "app-cloud-vulnerabilities-table", 23);
        \u0275\u0275listener("updateIssuesFilterNameEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_updateIssuesFilterNameEvent_53_listener($event) {
          return ctx.updateIssuesFilterName($event);
        })("updateIssuesFilterLocationEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_updateIssuesFilterLocationEvent_53_listener($event) {
          return ctx.updateIssuesFilterLocation($event);
        })("updateIssuesFilterStatusEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_updateIssuesFilterStatusEvent_53_listener($event) {
          return ctx.updateIssuesFilterStatus($event);
        })("updateIssuesFilterSeverityEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_updateIssuesFilterSeverityEvent_53_listener($event) {
          return ctx.updateIssuesFilterSeverity($event);
        })("toggleShowIssuesRemovedEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_toggleShowIssuesRemovedEvent_53_listener($event) {
          return ctx.toggleShowIssuesRemoved($event);
        })("viewVulnerabilityDetailsEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_viewVulnerabilityDetailsEvent_53_listener($event) {
          return ctx.viewIssueDetails($event);
        })("vulnerabilitiesLimitChange", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_vulnerabilitiesLimitChange_53_listener($event) {
          return ctx.vulnerabilitiesLimit = $event;
        })("clearIssuesFiltersEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerabilities_table_clearIssuesFiltersEvent_53_listener() {
          return ctx.clearIssuesFilters();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(54, "c-tab-panel", 21)(55, "div", 24)(56, "c-card", 25)(57, "c-card-header", 26)(58, "h5", 27);
        \u0275\u0275text(59, "Vulnerability Trend - Cloud Subscription");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(60, "button", 28);
        \u0275\u0275listener("click", function ShowCloudSubscriptionComponent_Template_button_click_60_listener() {
          return ctx.refreshData();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(61, "svg", 29);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(62, "c-card-body");
        \u0275\u0275element(63, "c-chart", 30);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(64, "div", 31)(65, "c-row")(66, "c-col", 32)(67, "div", 33)(68, "div", 34);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(69, "svg", 35);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(70, "div", 36)(71, "h6", 37);
        \u0275\u0275text(72, "Opened Findings");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(73, "div", 38);
        \u0275\u0275text(74);
        \u0275\u0275elementEnd();
        \u0275\u0275element(75, "c-progress", 39);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(76, "c-col", 32)(77, "div", 40)(78, "div", 34);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(79, "svg", 41);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(80, "div", 36)(81, "h6", 37);
        \u0275\u0275text(82, "Closed Findings");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(83, "div", 38);
        \u0275\u0275text(84);
        \u0275\u0275elementEnd();
        \u0275\u0275element(85, "c-progress", 42);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(86, "c-col", 32)(87, "div", 43)(88, "div", 34);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(89, "svg", 44);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(90, "div", 36)(91, "h6", 37);
        \u0275\u0275text(92, "Time to Fix");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(93, "div", 38);
        \u0275\u0275text(94);
        \u0275\u0275elementStart(95, "span", 45);
        \u0275\u0275text(96, "days");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(97, "c-progress", 46);
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(98, "c-tab-panel", 21)(99, "c-card", 47)(100, "c-card-header")(101, "h5", 27);
        \u0275\u0275text(102, "Scan History");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(103, "c-card-body");
        \u0275\u0275template(104, ShowCloudSubscriptionComponent_div_104_Template, 4, 0, "div", 48)(105, ShowCloudSubscriptionComponent_div_105_Template, 9, 18, "div", 49);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(106, "c-tab-panel", 21)(107, "c-alert", 50);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(108, "svg", 51);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(109, "div");
        \u0275\u0275text(110, " This part will be developed in next releases. In this section You will discover information about notification ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(111, "c-tab-panel", 21)(112, "c-alert", 50);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(113, "svg", 51);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(114, "div");
        \u0275\u0275text(115, " This part will be developed in next releases. In this section You will discover information about how to integrate MixewayFlow for this repo into CICD smoothly ");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(116, "app-cloud-vulnerability-details", 52);
        \u0275\u0275listener("handleDetailsModalEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerability_details_handleDetailsModalEvent_116_listener($event) {
          return ctx.handleDetailsModal($event);
        })("closeModalEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerability_details_closeModalEvent_116_listener() {
          return ctx.closeModal();
        })("addCommentEvent", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerability_details_addCommentEvent_116_listener() {
          return ctx.addComment();
        })("newCommentChange", function ShowCloudSubscriptionComponent_Template_app_cloud_vulnerability_details_newCommentChange_116_listener($event) {
          return ctx.newComment = $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(117, "c-toaster", 53)(118, "c-toast", 54);
        \u0275\u0275listener("visibleChange", function ShowCloudSubscriptionComponent_Template_c_toast_visibleChange_118_listener($event) {
          return ctx.onVisibleChange($event);
        });
        \u0275\u0275elementStart(119, "c-toast-header");
        \u0275\u0275text(120, " Finding management ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(121, "c-toast-body")(122, "p");
        \u0275\u0275text(123);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(124, "c-modal", 55);
        \u0275\u0275listener("visibleChange", function ShowCloudSubscriptionComponent_Template_c_modal_visibleChange_124_listener($event) {
          return ctx.changeTeamModalVisible = $event;
        });
        \u0275\u0275elementStart(125, "c-modal-header")(126, "h5", 56);
        \u0275\u0275text(127, "Change Team");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(128, "c-modal-body")(129, "div", 8)(130, "label", 57);
        \u0275\u0275text(131, "Select New Team");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(132, "select", 58);
        \u0275\u0275twoWayListener("ngModelChange", function ShowCloudSubscriptionComponent_Template_select_ngModelChange_132_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.selectedNewTeamId, $event) || (ctx.selectedNewTeamId = $event);
          return $event;
        });
        \u0275\u0275elementStart(133, "option", 59);
        \u0275\u0275text(134, "Choose a team...");
        \u0275\u0275elementEnd();
        \u0275\u0275template(135, ShowCloudSubscriptionComponent_option_135_Template, 2, 2, "option", 60);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(136, "c-modal-footer")(137, "button", 61);
        \u0275\u0275listener("click", function ShowCloudSubscriptionComponent_Template_button_click_137_listener() {
          return ctx.closeChangeTeamModal();
        });
        \u0275\u0275text(138, " Close ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(139, "button", 62);
        \u0275\u0275listener("click", function ShowCloudSubscriptionComponent_Template_button_click_139_listener() {
          return ctx.confirmTeamChange();
        });
        \u0275\u0275text(140, " Change Team ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(141, "c-modal", 63);
        \u0275\u0275listener("visibleChange", function ShowCloudSubscriptionComponent_Template_c_modal_visibleChange_141_listener($event) {
          return ctx.confirmationModalVisible = $event;
        });
        \u0275\u0275elementStart(142, "c-modal-header")(143, "h5", 56);
        \u0275\u0275text(144, "Confirm Team Change");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(145, "c-modal-body")(146, "div", 64)(147, "h4", 65);
        \u0275\u0275text(148, "Warning!");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(149, "p");
        \u0275\u0275text(150, "You are about to change the team for this cloud subscription. This action cannot be undone.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(151, "p");
        \u0275\u0275text(152, 'Please type "accept" to confirm this change:');
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(153, "div", 8)(154, "input", 66);
        \u0275\u0275twoWayListener("ngModelChange", function ShowCloudSubscriptionComponent_Template_input_ngModelChange_154_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.confirmationText, $event) || (ctx.confirmationText = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(155, "c-modal-footer")(156, "button", 61);
        \u0275\u0275listener("click", function ShowCloudSubscriptionComponent_Template_button_click_156_listener() {
          return ctx.closeConfirmationModal();
        });
        \u0275\u0275text(157, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(158, "button", 67);
        \u0275\u0275listener("click", function ShowCloudSubscriptionComponent_Template_button_click_158_listener() {
          return ctx.executeTeamChange();
        });
        \u0275\u0275text(159, " Change Team ");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("lg", 6)("md", 6);
        \u0275\u0275advance(2);
        \u0275\u0275property("cloudSubscriptionData", ctx.cloudSubscriptionData)("scanRunning", ctx.scanRunning)("userRole", ctx.userRole);
        \u0275\u0275advance();
        \u0275\u0275property("lg", 6)("md", 6);
        \u0275\u0275advance(8);
        \u0275\u0275property("value", ctx.findingsPercentage);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.findingsPercentage, "% ");
        \u0275\u0275advance();
        \u0275\u0275property("value", ctx.issuesPercentage);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.issuesPercentage, "% ");
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1(" ", ctx.findingsPercentage, "% \xA0 | \xA0 ");
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", ctx.issuesPercentage, "% ");
        \u0275\u0275advance(2);
        \u0275\u0275property("lg", 12)("md", 12);
        \u0275\u0275advance();
        \u0275\u0275property("counts", ctx.counts);
        \u0275\u0275advance(4);
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
        \u0275\u0275advance(4);
        \u0275\u0275property("itemKey", 0);
        \u0275\u0275advance();
        \u0275\u0275property("filteredVulns", ctx.filteredVulns)("vulnerabilitiesLoading", ctx.vulnerabilitiesLoading)("vulnerabilitiesLimit", ctx.vulnerabilitiesLimit)("showRemoved", ctx.showRemoved)("sourceType", "CLOUD_SCANNER");
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 1);
        \u0275\u0275advance();
        \u0275\u0275property("filteredIssues", ctx.filteredIssues)("vulnerabilitiesLoading", ctx.issuesLoading)("vulnerabilitiesLimit", ctx.issuesLimit)("showIssuesRemoved", ctx.showIssuesRemoved)("sourceType", "CLOUD_ISSUE");
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 2);
        \u0275\u0275advance(6);
        \u0275\u0275property("cTooltip", "Refresh data");
        \u0275\u0275advance(3);
        \u0275\u0275property("data", ctx.chartLineData)("options", ctx.options2);
        \u0275\u0275advance(3);
        \u0275\u0275property("md", 4)("sm", 12);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.getLastOpenedFindings() === 0 ? "None" : ctx.getLastOpenedFindings());
        \u0275\u0275advance();
        \u0275\u0275property("value", 75);
        \u0275\u0275advance();
        \u0275\u0275property("md", 4)("sm", 12);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.getLastRemovedFinding() === 0 ? "None" : ctx.getLastRemovedFinding());
        \u0275\u0275advance();
        \u0275\u0275property("value", 75);
        \u0275\u0275advance();
        \u0275\u0275property("md", 4)("sm", 12);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate1("", ctx.getLastFixTime() === 0 ? "Unknown" : ctx.getLastFixTime(), " ");
        \u0275\u0275advance(3);
        \u0275\u0275property("value", 65);
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 3);
        \u0275\u0275advance(6);
        \u0275\u0275property("ngIf", ctx.cloudScanInfosLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.cloudScanInfosLoading);
        \u0275\u0275advance();
        \u0275\u0275property("itemKey", 4);
        \u0275\u0275advance(5);
        \u0275\u0275property("itemKey", 5);
        \u0275\u0275advance(5);
        \u0275\u0275property("detailsModal", ctx.detailsModal)("selectedRowId", ctx.selectedRowId)("singleVuln", ctx.singleVuln)("isAddingComment", ctx.isAddingComment)("newComment", ctx.newComment);
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
        \u0275\u0275property("visible", ctx.confirmationModalVisible);
        \u0275\u0275advance(13);
        \u0275\u0275twoWayProperty("ngModel", ctx.confirmationText);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.confirmationText !== "accept");
      }
    }, dependencies: [
      NgxDatatableModule,
      DatatableComponent,
      DataTableColumnDirective,
      DataTableColumnCellDirective,
      DatePipe,
      NgForOf,
      NgIf,
      FormsModule,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgModel,
      CardBodyComponent,
      ColComponent,
      RowComponent,
      CardHeaderComponent,
      CardComponent,
      TabPanelComponent,
      TabsContentComponent,
      TabsListComponent,
      TabDirective,
      AlertComponent,
      BadgeComponent,
      ButtonDirective,
      ChartjsComponent,
      FormLabelDirective,
      IconDirective,
      MarkdownModule,
      ModalComponent,
      ModalFooterComponent,
      ModalHeaderComponent,
      ModalTitleDirective,
      ProgressComponent,
      ProgressBarComponent,
      SpinnerComponent,
      TabsComponent,
      ToastBodyComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToasterComponent,
      ModalBodyComponent,
      TooltipDirective,
      CloudSubscriptionInfoComponent,
      CloudVulnerabilitySummaryComponent,
      CloudVulnerabilitiesTableComponent,
      CloudVulnerabilityDetailsComponent,
      NgClass
    ], styles: ["/* src/app/views/show-cloud-subscription/show-cloud-subscription.component.scss */\n.cloud-subscription-container {\n  margin-bottom: 2rem;\n}\n.statistics-container .trend-chart-card {\n  border-radius: 8px;\n  overflow: hidden;\n}\n.statistics-container .trend-chart-card .refresh-btn {\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n}\n.statistics-container .trend-chart-card .refresh-btn svg {\n  width: 18px;\n  height: 18px;\n}\n.statistics-container .stats-metrics-container .metric-card {\n  display: flex;\n  align-items: center;\n  padding: 1.25rem;\n  border-radius: 8px;\n  background-color: var(--cui-card-bg);\n  border: 1px solid var(--cui-card-border-color);\n  height: 100%;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);\n}\n.statistics-container .stats-metrics-container .metric-card .metric-icon {\n  width: 60px;\n  height: 60px;\n  min-width: 60px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-color: var(--cui-tertiary-bg);\n  border-radius: 12px;\n  margin-right: 1rem;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-icon svg {\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-content {\n  flex-grow: 1;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-content .metric-title {\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: var(--cui-secondary-color);\n  margin-bottom: 0.5rem;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-content .metric-value {\n  font-size: 1.75rem;\n  font-weight: 700;\n  margin-bottom: 0.75rem;\n  color: var(--cui-body-color);\n  display: flex;\n  align-items: baseline;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-content .metric-value .metric-unit {\n  font-size: 0.875rem;\n  font-weight: 400;\n  color: var(--cui-secondary-color);\n  margin-left: 0.5rem;\n}\n.statistics-container .stats-metrics-container .metric-card .metric-content .metric-progress {\n  height: 4px;\n  background-color: var(--cui-tertiary-bg);\n}\n.statistics-container .stats-metrics-container .metric-card.opened-findings .metric-icon {\n  background-color: rgba(var(--cui-info-rgb), 0.1);\n}\n.statistics-container .stats-metrics-container .metric-card.opened-findings .metric-icon svg {\n  color: var(--cui-info);\n}\n.statistics-container .stats-metrics-container .metric-card.closed-findings .metric-icon {\n  background-color: rgba(var(--cui-success-rgb), 0.1);\n}\n.statistics-container .stats-metrics-container .metric-card.closed-findings .metric-icon svg {\n  color: var(--cui-success);\n}\n.statistics-container .stats-metrics-container .metric-card.fix-time .metric-icon {\n  background-color: rgba(var(--cui-danger-rgb), 0.1);\n}\n.statistics-container .stats-metrics-container .metric-card.fix-time .metric-icon svg {\n  color: var(--cui-danger);\n}\n.scan-info-card {\n  border-radius: 8px;\n  overflow: hidden;\n}\n.scan-info-card .loading-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 200px;\n  gap: 1rem;\n}\n.scan-info-card .loading-container .loading-text {\n  font-size: 0.875rem;\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.scan-info-card .date-display {\n  display: flex;\n  align-items: center;\n}\n.scan-info-card .date-display svg {\n  opacity: 0.7;\n}\n.scan-info-card .findings-display {\n  display: flex;\n  gap: 1.5rem;\n}\n.scan-info-card .findings-display .finding-category {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.scan-info-card .findings-display .finding-category .category-label {\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.scan-info-card .findings-display .finding-category .finding-badge {\n  font-size: 0.85rem;\n  min-width: 28px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.scan-info-card .action-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border-radius: 6px;\n}\n.scan-info-card .empty-state {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem 1rem;\n  text-align: center;\n}\n.scan-info-card .empty-state svg {\n  color: var(--cui-primary);\n  opacity: 0.7;\n  margin-bottom: 1rem;\n}\n.scan-info-card .empty-state h5 {\n  margin-bottom: 0.5rem;\n}\n.scan-info-card .empty-state p {\n  color: var(--cui-secondary-color);\n  max-width: 300px;\n}\n:host ::ng-deep .ngx-datatable .datatable-body-cell {\n  display: flex;\n  align-items: center;\n}\n:host ::ng-deep .ngx-datatable .datatable-body-cell-label {\n  flex: 1;\n}\n:host ::ng-deep .ngx-datatable .datatable-column.centered-column .datatable-header-cell {\n  text-align: center;\n}\n:host ::ng-deep .ngx-datatable .datatable-column.centered-column .datatable-body-cell {\n  justify-content: center;\n}\n:host ::ng-deep .ngx-datatable .datatable-column.centered-column .datatable-body-cell .datatable-body-cell-label {\n  justify-content: center;\n}\n@media (max-width: 768px) {\n  .metric-card {\n    flex-direction: column;\n    text-align: center;\n  }\n  .metric-card .metric-icon {\n    margin-right: 0 !important;\n    margin-bottom: 1rem;\n  }\n}\n.findings-bar {\n  background-color: rgb(114, 175, 168) !important;\n}\n.issues-bar {\n  background-color: rgb(237, 136, 161) !important;\n}\n/*# sourceMappingURL=show-cloud-subscription.component.css.map */\n"], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ShowCloudSubscriptionComponent, { className: "ShowCloudSubscriptionComponent" });
})();

// src/app/views/show-cloud-subscription/routes.ts
var routes = [
  {
    path: "",
    component: ShowCloudSubscriptionComponent,
    data: {
      title: "Show Cloud Subscription Data"
    }
  }
];
export {
  routes
};
//# sourceMappingURL=routes-UKPVQIHO.js.map
