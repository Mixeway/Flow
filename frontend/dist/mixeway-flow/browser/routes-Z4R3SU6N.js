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
  environment
} from "./chunk-YLFWSDV3.js";
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  HttpClient,
  IconDirective,
  IconSetService,
  InputGroupComponent,
  InputGroupTextDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  NgForOf,
  NgIf,
  Router,
  RowComponent,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
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
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-ZG2BHLTP.js";
import {
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/service/ComponentsService.ts
var ComponentsService = class _ComponentsService {
  constructor(http) {
    this.http = http;
    this.loginUrl = environment.backendUrl;
  }
  getComponents() {
    return this.http.get(this.loginUrl + "/api/v1/components", { withCredentials: true });
  }
  static {
    this.\u0275fac = function ComponentsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ComponentsService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ComponentsService, factory: _ComponentsService.\u0275fac, providedIn: "root" });
  }
};

// src/app/views/components/components.component.ts
function ComponentsComponent_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-input-group", 8)(1, "span", 9);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "input", 11);
    \u0275\u0275listener("input", function ComponentsComponent_ng_template_8_Template_input_input_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateFilterComponent($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 12);
    \u0275\u0275listener("click", function ComponentsComponent_ng_template_8_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearFilter("component"));
    });
    \u0275\u0275text(5, "Clear");
    \u0275\u0275elementEnd()();
  }
}
function ComponentsComponent_ng_template_9_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const row_r3 = \u0275\u0275nextContext().row;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r3 == null ? null : row_r3.component.groupid, " : ");
  }
}
function ComponentsComponent_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275template(1, ComponentsComponent_ng_template_9_ng_container_1_Template, 2, 1, "ng-container", 14);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r3 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r3 == null ? null : row_r3.component.groupid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", row_r3 == null ? null : row_r3.component.name, " : ", row_r3 == null ? null : row_r3.component.version, " ");
  }
}
function ComponentsComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-input-group", 8)(1, "span", 15);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "input", 16);
    \u0275\u0275listener("input", function ComponentsComponent_ng_template_11_Template_input_input_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateFilterVulnerabilities($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 12);
    \u0275\u0275listener("click", function ComponentsComponent_ng_template_11_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearFilter("vulnerabilities"));
    });
    \u0275\u0275text(5, "Clear");
    \u0275\u0275elementEnd()();
  }
}
function ComponentsComponent_ng_template_12_li_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 19);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 20);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cve_r5 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(cve_r5);
  }
}
function ComponentsComponent_ng_template_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 17);
    \u0275\u0275template(1, ComponentsComponent_ng_template_12_li_1_Template, 4, 1, "li", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r6 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", row_r6 == null ? null : row_r6.vulnerabilities);
  }
}
function ComponentsComponent_ng_template_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-input-group", 8)(1, "span", 21);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "input", 22);
    \u0275\u0275listener("input", function ComponentsComponent_ng_template_14_Template_input_input_3_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateFilterRepos($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 12);
    \u0275\u0275listener("click", function ComponentsComponent_ng_template_14_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearFilter("repos"));
    });
    \u0275\u0275text(5, "Clear");
    \u0275\u0275elementEnd()();
  }
}
function ComponentsComponent_ng_template_15_li_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 19);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 23);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const repo_r8 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(repo_r8);
  }
}
function ComponentsComponent_ng_template_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 17);
    \u0275\u0275template(1, ComponentsComponent_ng_template_15_li_1_Template, 4, 1, "li", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r9 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", row_r9 == null ? null : row_r9.affectedReposUrl);
  }
}
var ComponentsComponent = class _ComponentsComponent {
  constructor(router, iconSet, authService, componentsService) {
    this.router = router;
    this.iconSet = iconSet;
    this.authService = authService;
    this.componentsService = componentsService;
    this.filteredComponents = [];
    this.filters = {
      component: "",
      vulnerabilities: "",
      repos: ""
    };
    iconSet.icons = __spreadValues(__spreadValues(__spreadValues({}, free_exports), iconSet), brand_exports);
  }
  ngOnInit() {
    this.authService.hc().subscribe({
      next: () => {
      },
      error: () => {
        this.router.navigate(["/login"]);
      }
    });
    this.loadComponents();
  }
  loadComponents() {
    this.componentsService.getComponents().subscribe({
      next: (response) => {
        this.components = response;
        this.filteredComponents = [...this.components];
      }
    });
  }
  updateFilterComponent(event) {
    const val = event.target.value.toLowerCase();
    this.filters["component"] = val;
    this.applyFilters();
  }
  updateFilterVulnerabilities(event) {
    const val = event.target.value.toLowerCase();
    this.filters["vulnerabilities"] = val;
    this.applyFilters();
  }
  updateFilterRepos(event) {
    const val = event.target.value.toLowerCase();
    this.filters["repos"] = val;
    this.applyFilters();
  }
  clearFilter(filterKey) {
    this.filters[filterKey] = "";
    this.applyFilters();
  }
  applyFilters() {
    this.filteredComponents = this.components.filter((comp) => {
      const matchesComponent = !this.filters["component"] || comp.component.name.toLowerCase().includes(this.filters["component"]) || (comp.component.groupid?.toLowerCase().includes(this.filters["component"]) || "") || comp.component.version.toLowerCase().includes(this.filters["component"]);
      const matchesVulnerabilities = !this.filters["vulnerabilities"] || comp.vulnerabilities && comp.vulnerabilities.some((vul) => vul.toLowerCase().includes(this.filters["vulnerabilities"]));
      const matchesRepos = !this.filters["repos"] || comp.affectedReposUrl && comp.affectedReposUrl.some((repo) => repo.toLowerCase().includes(this.filters["repos"]));
      return matchesComponent && matchesVulnerabilities && matchesRepos;
    });
  }
  static {
    this.\u0275fac = function ComponentsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ComponentsComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(IconSetService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(ComponentsService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ComponentsComponent, selectors: [["app-components"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 16, vars: 10, consts: [["xs", "12"], [1, "mb-4", "h-100"], [1, "bootstrap", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit"], ["name", "Component", "prop", "groupid", 3, "sortable"], ["ngx-datatable-header-template", ""], ["ngx-datatable-cell-template", ""], ["name", "Vulnerabilities", "prop", "groupid", 3, "sortable", "width"], ["name", "Repos Affected", "prop", "groupid", 3, "sortable"], [1, "mb-3"], ["cInputGroupText", "", "id", "filterComponent"], ["cIcon", "", "name", "cil-magnifying-glass", 1, "icon"], ["aria-describedby", "addon-wrapping", "aria-label", "Filter Component", "type", "text", "placeholder", "Filter Component", 1, "form-control", 3, "input"], ["type", "button", 1, "btn", "btn-outline-secondary", 3, "click"], [1, "d-flex", "align-items-center", "justify-content-center", 2, "height", "100%"], [4, "ngIf"], ["cInputGroupText", "", "id", "filterVulnerabilities"], ["aria-describedby", "addon-wrapping", "aria-label", "Filter Vulnerabilities", "type", "text", "placeholder", "Filter Vulnerabilities", 1, "form-control", 3, "input"], ["cListGroup", ""], ["cListGroupItem", "", 4, "ngFor", "ngForOf"], ["cListGroupItem", ""], ["cIcon", "", "name", "cil-bug", 1, "me-2"], ["cInputGroupText", "", "id", "filterRepos"], ["aria-describedby", "addon-wrapping", "aria-label", "Filter Repos", "type", "text", "placeholder", "Filter Repos", 1, "form-control", 3, "input"], ["cIcon", "", "name", "cib-gitlab", 1, "me-2"]], template: function ComponentsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-row")(1, "c-col", 0)(2, "c-card", 1)(3, "c-card-header");
        \u0275\u0275text(4, " List of components and link with all resources You have access too ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "c-card-body")(6, "ngx-datatable", 2)(7, "ngx-datatable-column", 3);
        \u0275\u0275template(8, ComponentsComponent_ng_template_8_Template, 6, 0, "ng-template", 4)(9, ComponentsComponent_ng_template_9_Template, 3, 3, "ng-template", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "ngx-datatable-column", 6);
        \u0275\u0275template(11, ComponentsComponent_ng_template_11_Template, 6, 0, "ng-template", 4)(12, ComponentsComponent_ng_template_12_Template, 2, 1, "ng-template", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "ngx-datatable-column", 7);
        \u0275\u0275template(14, ComponentsComponent_ng_template_14_Template, 6, 0, "ng-template", 4)(15, ComponentsComponent_ng_template_15_Template, 2, 1, "ng-template", 5);
        \u0275\u0275elementEnd()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275property("rows", ctx.filteredComponents)("columnMode", "force")("footerHeight", 50)("headerHeight", 80)("rowHeight", "auto")("limit", 20);
        \u0275\u0275advance();
        \u0275\u0275property("sortable", false);
        \u0275\u0275advance(3);
        \u0275\u0275property("sortable", false)("width", 50);
        \u0275\u0275advance(3);
        \u0275\u0275property("sortable", false);
      }
    }, dependencies: [
      RowComponent,
      CardComponent,
      CardHeaderComponent,
      CardBodyComponent,
      ColComponent,
      IconDirective,
      InputGroupComponent,
      InputGroupTextDirective,
      NgxDatatableModule,
      DatatableComponent,
      DataTableColumnDirective,
      DataTableColumnHeaderDirective,
      DataTableColumnCellDirective,
      NgIf,
      ListGroupDirective,
      ListGroupItemDirective,
      NgForOf
    ] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ComponentsComponent, { className: "ComponentsComponent" });
})();

// src/app/views/components/routes.ts
var routes = [
  {
    path: "",
    component: ComponentsComponent,
    data: {
      title: "Components"
    }
  }
];
export {
  routes
};
//# sourceMappingURL=routes-Z4R3SU6N.js.map
