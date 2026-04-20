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
  free_exports
} from "./chunk-YOS6CCYB.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-MENGJYBG.js";
import {
  environment
} from "./chunk-YLFWSDV3.js";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  HttpClient,
  IconDirective,
  IconSetService,
  InputGroupComponent,
  InputGroupTextDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  NgForOf,
  NgIf,
  Router,
  RowComponent,
  ToastBodyComponent,
  ToastComponent,
  ToastHeaderComponent,
  ToasterComponent,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZG2BHLTP.js";
import {
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/service/VulnerabilityService.ts
var VulnerabilityService = class _VulnerabilityService {
  constructor(http) {
    this.http = http;
    this.loginUrl = environment.backendUrl;
  }
  getVulnerabilities() {
    return this.http.get(this.loginUrl + "/api/v1/vulnerabilities", { withCredentials: true });
  }
  patchVuln(vuln) {
    return this.http.post(this.loginUrl + "/api/v1/vulnerability", vuln, { withCredentials: true });
  }
  static {
    this.\u0275fac = function VulnerabilityService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _VulnerabilityService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _VulnerabilityService, factory: _VulnerabilityService.\u0275fac, providedIn: "root" });
  }
};

// src/app/views/vulnerabilities/vulnerabilities.component.ts
function VulnerabilitiesComponent_ngx_datatable_column_12_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275listener("click", function VulnerabilitiesComponent_ngx_datatable_column_12_ng_template_1_Template_button_click_0_listener() {
      const row_r2 = \u0275\u0275restoreView(_r1).row;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openEditModal(row_r2));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 26);
    \u0275\u0275elementEnd();
  }
}
function VulnerabilitiesComponent_ngx_datatable_column_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ngx-datatable-column", 24);
    \u0275\u0275template(1, VulnerabilitiesComponent_ngx_datatable_column_12_ng_template_1_Template, 2, 0, "ng-template", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("width", 10)("sortable", false);
  }
}
function VulnerabilitiesComponent_ng_template_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-input-group", 15)(1, "span", 27);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "input", 29);
    \u0275\u0275listener("input", function VulnerabilitiesComponent_ng_template_14_Template_input_input_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.updateFilterVulnerability($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 30);
    \u0275\u0275listener("click", function VulnerabilitiesComponent_ng_template_14_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.clearFilter("vulnerability"));
    });
    \u0275\u0275text(5, "Clear");
    \u0275\u0275elementEnd()();
  }
}
function VulnerabilitiesComponent_ng_template_15_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1, "\u{1F916} AI: False Positive");
    \u0275\u0275elementEnd();
  }
}
function VulnerabilitiesComponent_ng_template_15_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1, "\u{1F916} AI Reviewed");
    \u0275\u0275elementEnd();
  }
}
function VulnerabilitiesComponent_ng_template_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 31);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, VulnerabilitiesComponent_ng_template_15_span_3_Template, 2, 0, "span", 32)(4, VulnerabilitiesComponent_ng_template_15_span_4_Template, 2, 0, "span", 33);
  }
  if (rf & 2) {
    const row_r5 = ctx.row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r5 == null ? null : row_r5.vulnerability == null ? null : row_r5.vulnerability.name);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r5 == null ? null : row_r5.anyAiFalsePositiveSuppressed);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (row_r5 == null ? null : row_r5.anyAiAnalyzed) && !(row_r5 == null ? null : row_r5.anyAiFalsePositiveSuppressed));
  }
}
function VulnerabilitiesComponent_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-input-group", 15)(1, "span", 36);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "input", 37);
    \u0275\u0275listener("input", function VulnerabilitiesComponent_ng_template_17_Template_input_input_3_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.updateFilterRepos($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 30);
    \u0275\u0275listener("click", function VulnerabilitiesComponent_ng_template_17_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.clearFilter("repos"));
    });
    \u0275\u0275text(5, "Clear");
    \u0275\u0275elementEnd()();
  }
}
function VulnerabilitiesComponent_ng_template_18_li_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 40);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 41);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const repo_r7 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(repo_r7);
  }
}
function VulnerabilitiesComponent_ng_template_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 38);
    \u0275\u0275template(1, VulnerabilitiesComponent_ng_template_18_li_1_Template, 4, 1, "li", 39);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r8 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", row_r8 == null ? null : row_r8.affectedRepositories);
  }
}
var VulnerabilitiesComponent = class _VulnerabilitiesComponent {
  constructor(authService, router, vulnerabilityService, iconSet, formBuilder) {
    this.authService = authService;
    this.router = router;
    this.vulnerabilityService = vulnerabilityService;
    this.iconSet = iconSet;
    this.formBuilder = formBuilder;
    this.vulns = [];
    this.filteredVulns = [];
    this.filters = {
      vulnerability: "",
      repos: ""
    };
    this.showAiSuppressed = false;
    this.userRole = localStorage.getItem("userRole");
    this.editModalVisible = false;
    this.selectedVuln = null;
    this.position = "top-end";
    this.visible = false;
    this.percentage = 0;
    this.toastMessage = "";
    this.toastStatus = "";
    iconSet.icons = __spreadValues(__spreadValues(__spreadValues({}, free_exports), iconSet), brand_exports);
    this.editForm = this.formBuilder.group({
      description: ["", Validators.required],
      recommendation: ["", Validators.required],
      ref: ["", Validators.required]
    });
  }
  ngOnInit() {
    this.authService.hc().subscribe({
      next: () => {
      },
      error: () => {
        this.router.navigate(["/login"]);
      }
    });
    this.loadVulns();
  }
  loadVulns() {
    this.vulnerabilityService.getVulnerabilities().subscribe({
      next: (response) => {
        this.vulns = response;
        this.filteredVulns = [...this.vulns];
      }
    });
  }
  updateFilterVulnerability(event) {
    const val = event.target.value.toLowerCase();
    this.filters["vulnerability"] = val;
    this.applyFilters();
  }
  updateFilterRepos(event) {
    const val = event.target.value.toLowerCase();
    this.filters["repos"] = val;
    this.applyFilters();
  }
  applyFilters() {
    this.filteredVulns = this.vulns.filter((vuln) => {
      const matchesVulnerability = vuln.vulnerability.name.toLowerCase().includes(this.filters["vulnerability"]);
      const matchesRepos = vuln.affectedRepositories.some((repo) => repo.toLowerCase().includes(this.filters["repos"]));
      const hideAiFp = !this.showAiSuppressed && vuln.anyAiFalsePositiveSuppressed === true;
      return matchesVulnerability && matchesRepos && !hideAiFp;
    });
  }
  toggleShowAiSuppressed(checked) {
    this.showAiSuppressed = checked;
    this.applyFilters();
  }
  clearFilter(filterType) {
    this.filters[filterType] = "";
    this.applyFilters();
  }
  openEditModal(row) {
    this.selectedVuln = row;
    this.editForm.patchValue({
      description: row.vulnerability.description || "",
      recommendation: row.vulnerability.recommendation || "",
      ref: row.vulnerability.ref || ""
    });
    this.editModalVisible = true;
  }
  closeEditModal() {
    this.editModalVisible = false;
  }
  submitEditForm() {
    if (this.editForm.valid) {
      const updatedData = __spreadValues({
        id: this.selectedVuln.vulnerability.id
      }, this.editForm.value);
      this.vulnerabilityService.patchVuln(updatedData).subscribe({
        next: (response) => {
          this.toastStatus = "success";
          this.toastMessage = "Successfully edited details of vulnerability";
          this.toggleToast();
        },
        error: (error) => {
          this.toastStatus = "danger";
          this.toastMessage = "Problem changing updating details of the vulnerability.";
          this.toggleToast();
        }
      });
      this.closeEditModal();
    } else {
      console.error("Form is invalid");
    }
  }
  toggleToast() {
    this.visible = !this.visible;
  }
  onVisibleChange($event) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }
  static {
    this.\u0275fac = function VulnerabilitiesComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _VulnerabilitiesComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(VulnerabilityService), \u0275\u0275directiveInject(IconSetService), \u0275\u0275directiveInject(FormBuilder));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VulnerabilitiesComponent, selectors: [["app-vulnerabilities"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 49, vars: 20, consts: [["xs", "12"], [1, "mb-4", "h-100"], [1, "d-flex", "flex-wrap", "align-items-center", "justify-content-between", "gap-2"], ["switch", "", 1, "m-0"], ["cFormCheckInput", "", "id", "showAiSuppressedGlobal", "type", "checkbox", 3, "ngModelChange", "ngModel"], ["cFormCheckLabel", "", "for", "showAiSuppressedGlobal"], [1, "bootstrap", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit"], ["name", "Edit", 3, "width", "sortable", 4, "ngIf"], ["name", "Vulnerability", "prop", "vulnerability.name", 3, "sortable", "width"], ["ngx-datatable-header-template", ""], ["ngx-datatable-cell-template", ""], ["name", "Repos Affected", "prop", "groupid", 3, "sortable", "width"], ["size", "lg", 3, "visibleChange", "visible"], ["cModalTitle", ""], [3, "formGroup"], [1, "mb-3"], ["cInputGroupText", ""], ["cFormControl", "", "formControlName", "description", "rows", "3"], ["cFormControl", "", "formControlName", "recommendation", "rows", "3"], ["cFormControl", "", "formControlName", "ref", "rows", "3"], ["cButton", "", "color", "secondary", 3, "click"], ["cButton", "", "color", "primary", 3, "click", "disabled"], ["position", "fixed", 1, "p-3", 3, "placement"], [3, "visibleChange", "color", "visible"], ["name", "Edit", 3, "width", "sortable"], ["type", "button", 1, "btn", "btn-outline-primary", 3, "click"], ["cIcon", "", "name", "cil-pencil", 1, "icon"], ["cInputGroupText", "", "id", "filterVulnerability"], ["cIcon", "", "name", "cil-magnifying-glass", 1, "icon"], ["aria-describedby", "addon-wrapping", "aria-label", "Filter Vulnerability", "type", "text", "placeholder", "Filter Vulnerability", 1, "form-control", 3, "input"], ["type", "button", 1, "btn", "btn-outline-secondary", 3, "click"], ["cIcon", "", "name", "cil-bug", 1, "me-2"], ["class", "badge bg-info-subtle text-info ms-2", 4, "ngIf"], ["class", "badge bg-secondary-subtle text-secondary ms-2", 4, "ngIf"], [1, "badge", "bg-info-subtle", "text-info", "ms-2"], [1, "badge", "bg-secondary-subtle", "text-secondary", "ms-2"], ["cInputGroupText", "", "id", "filterRepos"], ["aria-describedby", "addon-wrapping", "aria-label", "Filter Repos", "type", "text", "placeholder", "Filter Repos", 1, "form-control", 3, "input"], ["cListGroup", ""], ["cListGroupItem", "", 4, "ngFor", "ngForOf"], ["cListGroupItem", ""], ["cIcon", "", "name", "cib-gitlab", 1, "me-2"]], template: function VulnerabilitiesComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-row")(1, "c-col", 0)(2, "c-card", 1)(3, "c-card-header", 2)(4, "span");
        \u0275\u0275text(5, "List of vulnerabilities and links with all resources You have access to");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "c-form-check", 3)(7, "input", 4);
        \u0275\u0275listener("ngModelChange", function VulnerabilitiesComponent_Template_input_ngModelChange_7_listener($event) {
          return ctx.toggleShowAiSuppressed($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "label", 5);
        \u0275\u0275text(9, "Show AI-suppressed");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(10, "c-card-body")(11, "ngx-datatable", 6);
        \u0275\u0275template(12, VulnerabilitiesComponent_ngx_datatable_column_12_Template, 2, 2, "ngx-datatable-column", 7);
        \u0275\u0275elementStart(13, "ngx-datatable-column", 8);
        \u0275\u0275template(14, VulnerabilitiesComponent_ng_template_14_Template, 6, 0, "ng-template", 9)(15, VulnerabilitiesComponent_ng_template_15_Template, 5, 3, "ng-template", 10);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "ngx-datatable-column", 11);
        \u0275\u0275template(17, VulnerabilitiesComponent_ng_template_17_Template, 6, 0, "ng-template", 9)(18, VulnerabilitiesComponent_ng_template_18_Template, 2, 1, "ng-template", 10);
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(19, "c-modal", 12);
        \u0275\u0275listener("visibleChange", function VulnerabilitiesComponent_Template_c_modal_visibleChange_19_listener($event) {
          return ctx.editModalVisible = $event;
        });
        \u0275\u0275elementStart(20, "c-modal-header")(21, "h5", 13);
        \u0275\u0275text(22);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(23, "c-modal-body")(24, "form", 14)(25, "c-input-group", 15)(26, "span", 16);
        \u0275\u0275text(27, "Description");
        \u0275\u0275elementEnd();
        \u0275\u0275element(28, "textarea", 17);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "c-input-group", 15)(30, "span", 16);
        \u0275\u0275text(31, "Recommendation");
        \u0275\u0275elementEnd();
        \u0275\u0275element(32, "textarea", 18);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(33, "c-input-group", 15)(34, "span", 16);
        \u0275\u0275text(35, "References");
        \u0275\u0275elementEnd();
        \u0275\u0275element(36, "textarea", 19);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(37, "c-modal-footer")(38, "button", 20);
        \u0275\u0275listener("click", function VulnerabilitiesComponent_Template_button_click_38_listener() {
          return ctx.closeEditModal();
        });
        \u0275\u0275text(39, "Close");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "button", 21);
        \u0275\u0275listener("click", function VulnerabilitiesComponent_Template_button_click_40_listener() {
          return ctx.submitEditForm();
        });
        \u0275\u0275text(41, "Submit");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(42, "c-toaster", 22)(43, "c-toast", 23);
        \u0275\u0275listener("visibleChange", function VulnerabilitiesComponent_Template_c_toast_visibleChange_43_listener($event) {
          return ctx.onVisibleChange($event);
        });
        \u0275\u0275elementStart(44, "c-toast-header");
        \u0275\u0275text(45, " Team Management ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(46, "c-toast-body")(47, "p");
        \u0275\u0275text(48);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(7);
        \u0275\u0275property("ngModel", ctx.showAiSuppressed);
        \u0275\u0275advance(4);
        \u0275\u0275property("rows", ctx.filteredVulns)("columnMode", "force")("footerHeight", 50)("headerHeight", 80)("rowHeight", "auto")("limit", 15);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.userRole === "ADMIN");
        \u0275\u0275advance();
        \u0275\u0275property("sortable", false)("width", 300);
        \u0275\u0275advance(3);
        \u0275\u0275property("sortable", false)("width", 300);
        \u0275\u0275advance(3);
        \u0275\u0275property("visible", ctx.editModalVisible);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1("Edit Vulnerability: ", ctx.selectedVuln == null ? null : ctx.selectedVuln.vulnerability == null ? null : ctx.selectedVuln.vulnerability.name, "");
        \u0275\u0275advance(2);
        \u0275\u0275property("formGroup", ctx.editForm);
        \u0275\u0275advance(16);
        \u0275\u0275property("disabled", ctx.editForm.invalid);
        \u0275\u0275advance(2);
        \u0275\u0275property("placement", ctx.position);
        \u0275\u0275advance();
        \u0275\u0275property("color", ctx.toastStatus)("visible", ctx.visible);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.toastMessage);
      }
    }, dependencies: [
      CardBodyComponent,
      CardComponent,
      CardHeaderComponent,
      ColComponent,
      FormCheckComponent,
      FormCheckInputDirective,
      FormCheckLabelDirective,
      IconDirective,
      InputGroupComponent,
      InputGroupTextDirective,
      ListGroupDirective,
      ListGroupItemDirective,
      NgForOf,
      NgIf,
      NgxDatatableModule,
      DatatableComponent,
      DataTableColumnDirective,
      DataTableColumnHeaderDirective,
      DataTableColumnCellDirective,
      RowComponent,
      ModalComponent,
      ModalHeaderComponent,
      ModalBodyComponent,
      ModalFooterComponent,
      FormsModule,
      \u0275NgNoValidate,
      DefaultValueAccessor,
      CheckboxControlValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      NgModel,
      FormControlDirective,
      ButtonDirective,
      ModalTitleDirective,
      ReactiveFormsModule,
      FormGroupDirective,
      FormControlName,
      ToastBodyComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToasterComponent
    ] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VulnerabilitiesComponent, { className: "VulnerabilitiesComponent" });
})();

// src/app/views/vulnerabilities/routes.ts
var routes = [
  {
    path: "",
    component: VulnerabilitiesComponent,
    data: {
      title: "Vulnerabilities"
    }
  }
];
export {
  routes
};
//# sourceMappingURL=routes-LLMBKM3O.js.map
