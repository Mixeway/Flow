import {
  utils,
  writeFileSync
} from "./chunk-OYEOMEKY.js";
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DataTableColumnHeaderDirective,
  DatatableComponent,
  NgxDatatableModule
} from "./chunk-OFWBTEIP.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-MENGJYBG.js";
import {
  environment
} from "./chunk-YLFWSDV3.js";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  DatePipe,
  EventEmitter,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormLabelDirective,
  FormSelectDirective,
  HttpClient,
  IconDirective,
  NgClass,
  NgForOf,
  NgIf,
  SpinnerComponent,
  TooltipDirective,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
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
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZG2BHLTP.js";

// src/app/service/RepoService.ts
var RepoService = class _RepoService {
  constructor(http) {
    this.http = http;
    this.loginUrl = environment.backendUrl;
  }
  getRepo(id) {
    return this.http.get(this.loginUrl + "/api/v1/coderepo/" + id, { withCredentials: true });
  }
  getReposByTeam(id) {
    return this.http.get(this.loginUrl + "/api/v1/coderepo/team/" + id, { withCredentials: true });
  }
  getSourceStats(id) {
    return this.http.get(this.loginUrl + "/api/v1/coderepo/" + id + "/source_stats", { withCredentials: true });
  }
  getFindingStats(id) {
    return this.http.get(this.loginUrl + "/api/v1/coderepo/" + id + "/finding_stats", { withCredentials: true });
  }
  getFindingsDefBranch(id) {
    return this.http.get(this.loginUrl + "/api/v1/coderepo/" + id + "/findings", { withCredentials: true });
  }
  getFinding(id, finding) {
    return this.http.get(this.loginUrl + "/api/v1/coderepo/" + id + "/finding/" + finding, { withCredentials: true });
  }
  supressFinding(id, finding, reason) {
    return this.http.get(this.loginUrl + "/api/v1/coderepo/" + id + "/supress/" + finding + "/reason/" + reason, { withCredentials: true });
  }
  reActivateFinding(id, finding) {
    return this.http.get(this.loginUrl + "/api/v1/coderepo/" + id + "/reactivate/" + finding, { withCredentials: true });
  }
  getFindingsBranch(id, branch) {
    return this.http.get(this.loginUrl + "/api/v1/coderepo/" + id + "/findings/branch/" + branch, { withCredentials: true });
  }
  runScan(id) {
    return this.http.get(this.loginUrl + "/api/v1/coderepo/" + id + "/run", { withCredentials: true });
  }
  getRemoteBranches(id) {
    return this.http.get(this.loginUrl + "/api/v1/coderepo/" + id + "/git-branches", { withCredentials: true });
  }
  runScanForBranch(id, branchName) {
    return this.http.post(this.loginUrl + "/api/v1/coderepo/" + id + "/run/branch", { branchName }, { withCredentials: true });
  }
  suppressMultipleFindings(number, selectedFindings) {
    return this.http.post(this.loginUrl + "/api/v1/coderepo/" + number + "/supress", selectedFindings, { withCredentials: true });
  }
  addComment(repoId, findingId, message) {
    return this.http.post(`${this.loginUrl}/api/v1/coderepo/${repoId}/finding/${findingId}/comment`, { message }, { withCredentials: true });
  }
  changeTeam(repoId, newTeamId) {
    return this.http.put(`${this.loginUrl}/api/v1/coderepo/${repoId}/team`, { newTeamId }, { withCredentials: true });
  }
  rename(repoId, newName) {
    return this.http.put(`${this.loginUrl}/api/v1/coderepo/${repoId}/rename`, { newName }, { withCredentials: true });
  }
  deleteRepo(repoId) {
    return this.http.delete(`${this.loginUrl}/api/v1/coderepo/${repoId}`, { withCredentials: true });
  }
  static {
    this.\u0275fac = function RepoService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RepoService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RepoService, factory: _RepoService.\u0275fac, providedIn: "root" });
  }
};

// src/app/views/show-repo/vulnerabilities-table/vulnerabilities-table.component.ts
var _c0 = () => ({ standalone: true });
var _c1 = (a0) => ({ "pulse-urgent": a0 });
var _c2 = (a0) => ({ "pulse-notable": a0 });
var _c3 = () => ({ "datatable-column": true, "centered-column": true });
function VulnerabilitiesTableComponent_option_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const branch_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", branch_r1.id)("selected", ctx_r1.selectedBranchId === branch_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", branch_r1.name, " ");
  }
}
function VulnerabilitiesTableComponent_div_53_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 43);
    \u0275\u0275listener("click", function VulnerabilitiesTableComponent_div_53_button_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.createJiraTicketsBulk());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 44);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.selectedFindings.length === 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Create JIRA Tickets (", ctx_r1.selectedFindings.length, ") ");
  }
}
function VulnerabilitiesTableComponent_div_53_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.selectedFindings.length, " items selected");
  }
}
function VulnerabilitiesTableComponent_div_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 37)(1, "div", 38)(2, "button", 39);
    \u0275\u0275listener("click", function VulnerabilitiesTableComponent_div_53_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.suppressSelectedFindings());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 40);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, VulnerabilitiesTableComponent_div_53_button_5_Template, 3, 2, "button", 41)(6, VulnerabilitiesTableComponent_div_53_div_6_Template, 3, 1, "div", 42);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.selectedFindings.length === 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Suppress Selected (", ctx_r1.selectedFindings.length, ") ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.jiraEnabled);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.selectedFindings.length > 0);
  }
}
function VulnerabilitiesTableComponent_div_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46);
    \u0275\u0275element(1, "c-spinner", 47);
    \u0275\u0275elementStart(2, "span", 48);
    \u0275\u0275text(3, "Loading vulnerabilities...");
    \u0275\u0275elementEnd()();
  }
}
function VulnerabilitiesTableComponent_div_56_ngx_datatable_column_2_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 61)(1, "c-form-check")(2, "input", 62);
    \u0275\u0275listener("change", function VulnerabilitiesTableComponent_div_56_ngx_datatable_column_2_ng_template_1_Template_input_change_2_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectAllFindings($event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", ctx_r1.selectedFindings.length > 0 && ctx_r1.selectedFindings.length === ctx_r1.filteredVulns.length);
  }
}
function VulnerabilitiesTableComponent_div_56_ngx_datatable_column_2_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 63)(1, "c-form-check")(2, "input", 62);
    \u0275\u0275listener("change", function VulnerabilitiesTableComponent_div_56_ngx_datatable_column_2_ng_template_2_Template_input_change_2_listener($event) {
      const row_r7 = \u0275\u0275restoreView(_r6).row;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onSelectFinding(row_r7.id, $event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const row_r7 = ctx.row;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", ctx_r1.isSelected(row_r7.id));
  }
}
function VulnerabilitiesTableComponent_div_56_ngx_datatable_column_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ngx-datatable-column", 60);
    \u0275\u0275template(1, VulnerabilitiesTableComponent_div_56_ngx_datatable_column_2_ng_template_1_Template, 3, 1, "ng-template", 55)(2, VulnerabilitiesTableComponent_div_56_ngx_datatable_column_2_ng_template_2_Template, 3, 1, "ng-template", 53);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("width", 50)("sortable", false)("resizeable", false)("draggable", false)("canAutoResize", false)("ngClass", \u0275\u0275pureFunction0(6, _c3));
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_4_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 69);
    \u0275\u0275listener("click", function VulnerabilitiesTableComponent_div_56_ng_template_4_button_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const row_r9 = \u0275\u0275nextContext().row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.createJiraTicket(row_r9.id));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 70);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("cTooltip", "Create JIRA ticket");
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_4_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 71);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r9 = \u0275\u0275nextContext().row;
    \u0275\u0275property("cTooltip", "JIRA: " + row_r9.jira_ticket_key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r9.jira_ticket_key, " ");
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 64)(1, "button", 65);
    \u0275\u0275listener("click", function VulnerabilitiesTableComponent_div_56_ng_template_4_Template_button_click_1_listener() {
      const row_r9 = \u0275\u0275restoreView(_r8).row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.click(row_r9));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 66);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, VulnerabilitiesTableComponent_div_56_ng_template_4_button_3_Template, 2, 1, "button", 67)(4, VulnerabilitiesTableComponent_div_56_ng_template_4_span_4_Template, 2, 2, "span", 68);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r9 = ctx.row;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("cTooltip", "View vulnerability details");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.jiraEnabled && !ctx_r1.hasJiraTicket(row_r9));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.jiraEnabled && ctx_r1.hasJiraTicket(row_r9));
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 72)(1, "span");
    \u0275\u0275text(2, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 73)(4, "select", 74);
    \u0275\u0275twoWayListener("ngModelChange", function VulnerabilitiesTableComponent_div_56_ng_template_6_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.cf["severity"], $event) || (ctx_r1.cf["severity"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function VulnerabilitiesTableComponent_div_56_ng_template_6_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateFilterSeverity($event));
    });
    \u0275\u0275elementStart(5, "option", 75);
    \u0275\u0275text(6, "All");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "option", 76);
    \u0275\u0275text(8, "Critical");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "option", 77);
    \u0275\u0275text(10, "High");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "option", 78);
    \u0275\u0275text(12, "Medium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "option", 79);
    \u0275\u0275text(14, "Low");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 80);
    \u0275\u0275text(16, "Info");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.cf["severity"]);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(2, _c0));
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 81)(1, "div", 82);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r12 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", "severity-badge severity-" + (row_r12 == null ? null : row_r12.severity == null ? null : row_r12.severity.toLowerCase()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r12 == null ? null : row_r12.severity, " ");
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 83)(1, "span");
    \u0275\u0275text(2, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 84)(4, "div", 85)(5, "input", 86);
    \u0275\u0275twoWayListener("ngModelChange", function VulnerabilitiesTableComponent_div_56_ng_template_9_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.cf["name"], $event) || (ctx_r1.cf["name"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function VulnerabilitiesTableComponent_div_56_ng_template_9_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateFilterName($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 87);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(7, "select", 88);
    \u0275\u0275twoWayListener("ngModelChange", function VulnerabilitiesTableComponent_div_56_ng_template_9_Template_select_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.cf["status"], $event) || (ctx_r1.cf["status"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function VulnerabilitiesTableComponent_div_56_ng_template_9_Template_select_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateFilterStatus($event));
    });
    \u0275\u0275elementStart(8, "option", 75);
    \u0275\u0275text(9, "All Statuses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "option", 89);
    \u0275\u0275text(11, "New");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "option", 90);
    \u0275\u0275text(13, "Existing");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "option", 91);
    \u0275\u0275text(15, "Removed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "option", 92);
    \u0275\u0275text(17, "Suppressed");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.cf["name"]);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(4, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.cf["status"]);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(5, _c0));
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_10_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 104);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 105);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r14 = \u0275\u0275nextContext().row;
    \u0275\u0275property("ngClass", row_r14.urgency);
    \u0275\u0275advance();
    \u0275\u0275property("name", row_r14.urgency === "urgent" ? "cil-warning" : "cil-bell");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r14.urgency === "urgent" ? "Urgent" : "Notable", " ");
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_10_span_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 106);
    \u0275\u0275text(1, "\u{1F916} AI: False Positive");
    \u0275\u0275elementEnd();
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_10_span_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 107);
    \u0275\u0275text(1, "\u{1F916} AI Reviewed");
    \u0275\u0275elementEnd();
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 93)(1, "div", 94);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 95)(4, "div", 96)(5, "div", 97);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 98);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(7, "span", 82);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, VulnerabilitiesTableComponent_div_56_ng_template_10_span_9_Template, 3, 3, "span", 99)(10, VulnerabilitiesTableComponent_div_56_ng_template_10_span_10_Template, 2, 0, "span", 100)(11, VulnerabilitiesTableComponent_div_56_ng_template_10_span_11_Template, 2, 0, "span", 101);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 102)(13, "span", 103);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "date");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const row_r14 = ctx.row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r14 == null ? null : row_r14.name);
    \u0275\u0275advance(4);
    \u0275\u0275property("name", (row_r14 == null ? null : row_r14.status) === "NEW" ? "cil-burn" : (row_r14 == null ? null : row_r14.status) === "EXISTING" ? "cil-graph" : (row_r14 == null ? null : row_r14.status) === "REMOVED" ? "cil-trash" : "cil-volume-off");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", "status-text status-" + (row_r14 == null ? null : row_r14.status == null ? null : row_r14.status.toLowerCase()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r14 == null ? null : row_r14.status);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r14.urgency);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r14.ai_verdict === "FALSE_POSITIVE" && row_r14.status === "SUPRESSED");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r14.ai_analyzed && row_r14.ai_verdict === "REAL_ISSUE");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Last seen: ", \u0275\u0275pipeBind2(15, 8, row_r14 == null ? null : row_r14.last_seen, "short"), "");
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 72)(1, "span");
    \u0275\u0275text(2, "Source");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 73)(4, "select", 74);
    \u0275\u0275twoWayListener("ngModelChange", function VulnerabilitiesTableComponent_div_56_ng_template_12_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.cf["source"], $event) || (ctx_r1.cf["source"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function VulnerabilitiesTableComponent_div_56_ng_template_12_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateFilterSource($event));
    });
    \u0275\u0275elementStart(5, "option", 75);
    \u0275\u0275text(6, "All");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "option", 108);
    \u0275\u0275text(8, "SAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "option", 109);
    \u0275\u0275text(10, "IaC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "option", 110);
    \u0275\u0275text(12, "Secrets");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "option", 111);
    \u0275\u0275text(14, "SCA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 112);
    \u0275\u0275text(16, "GitLab");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "option", 113);
    \u0275\u0275text(18, "DAST");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.cf["source"]);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(2, _c0));
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 114)(1, "div", 82);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r16 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", "source-badge source-" + (row_r16 == null ? null : row_r16.source == null ? null : row_r16.source.toLowerCase()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r16 == null ? null : row_r16.source == null ? null : row_r16.source.replace("_", " "), " ");
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 83)(1, "span");
    \u0275\u0275text(2, "Location");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 73)(4, "div", 85)(5, "input", 115);
    \u0275\u0275twoWayListener("ngModelChange", function VulnerabilitiesTableComponent_div_56_ng_template_15_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.cf["location"], $event) || (ctx_r1.cf["location"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function VulnerabilitiesTableComponent_div_56_ng_template_15_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateFilterLocation($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 87);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.cf["location"]);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(2, _c0));
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_16_ng_container_1__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 123);
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_16_ng_container_1__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 124);
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_16_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "a", 118);
    \u0275\u0275template(2, VulnerabilitiesTableComponent_div_56_ng_template_16_ng_container_1__svg_svg_2_Template, 1, 0, "svg", 119)(3, VulnerabilitiesTableComponent_div_56_ng_template_16_ng_container_1__svg_svg_3_Template, 1, 0, "svg", 120);
    \u0275\u0275elementStart(4, "span", 121);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 122);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const row_r18 = \u0275\u0275nextContext().row;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("href", ctx_r1.getRepositoryLinkForRow(row_r18), \u0275\u0275sanitizeUrl)("cTooltip", "Open in repository");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r18.source !== "DAST");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r18.source === "DAST");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getFormattedLocationForRow(row_r18));
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_16_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 125);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r18 = \u0275\u0275nextContext().row;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getFormattedLocationForRow(row_r18), " ");
  }
}
function VulnerabilitiesTableComponent_div_56_ng_template_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 116);
    \u0275\u0275template(1, VulnerabilitiesTableComponent_div_56_ng_template_16_ng_container_1_Template, 7, 5, "ng-container", 117)(2, VulnerabilitiesTableComponent_div_56_ng_template_16_ng_template_2_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r18 = ctx.row;
    const plainTextLocation_r19 = \u0275\u0275reference(3);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isLinkableSource(row_r18.source))("ngIfElse", plainTextLocation_r19);
  }
}
function VulnerabilitiesTableComponent_div_56_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 126);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 127);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "h4");
    \u0275\u0275text(3, "No vulnerabilities found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "No vulnerabilities match your current filter criteria.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 128);
    \u0275\u0275listener("click", function VulnerabilitiesTableComponent_div_56_div_17_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clearFilters());
    });
    \u0275\u0275text(7, "Clear filters");
    \u0275\u0275elementEnd()();
  }
}
function VulnerabilitiesTableComponent_div_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49)(1, "ngx-datatable", 50);
    \u0275\u0275template(2, VulnerabilitiesTableComponent_div_56_ngx_datatable_column_2_Template, 3, 7, "ngx-datatable-column", 51);
    \u0275\u0275elementStart(3, "ngx-datatable-column", 52);
    \u0275\u0275template(4, VulnerabilitiesTableComponent_div_56_ng_template_4_Template, 5, 3, "ng-template", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ngx-datatable-column", 54);
    \u0275\u0275template(6, VulnerabilitiesTableComponent_div_56_ng_template_6_Template, 17, 3, "ng-template", 55)(7, VulnerabilitiesTableComponent_div_56_ng_template_7_Template, 3, 2, "ng-template", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "ngx-datatable-column", 56);
    \u0275\u0275template(9, VulnerabilitiesTableComponent_div_56_ng_template_9_Template, 18, 6, "ng-template", 55)(10, VulnerabilitiesTableComponent_div_56_ng_template_10_Template, 16, 11, "ng-template", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "ngx-datatable-column", 57);
    \u0275\u0275template(12, VulnerabilitiesTableComponent_div_56_ng_template_12_Template, 19, 3, "ng-template", 55)(13, VulnerabilitiesTableComponent_div_56_ng_template_13_Template, 3, 2, "ng-template", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "ngx-datatable-column", 58);
    \u0275\u0275template(15, VulnerabilitiesTableComponent_div_56_ng_template_15_Template, 7, 3, "ng-template", 55)(16, VulnerabilitiesTableComponent_div_56_ng_template_16_Template, 4, 2, "ng-template", 53);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(17, VulnerabilitiesTableComponent_div_56_div_17_Template, 8, 0, "div", 59);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("rows", ctx_r1.filteredVulns)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", ctx_r1.vulnerabilitiesLimit);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.bulkActionMode);
    \u0275\u0275advance();
    \u0275\u0275property("width", ctx_r1.jiraEnabled ? 100 : 60)("sortable", false)("resizeable", false)("draggable", false)("canAutoResize", false)("ngClass", \u0275\u0275pureFunction0(24, _c3));
    \u0275\u0275advance(2);
    \u0275\u0275property("width", 100)("sortable", true)("canAutoResize", false)("ngClass", \u0275\u0275pureFunction0(25, _c3));
    \u0275\u0275advance(3);
    \u0275\u0275property("sortable", true);
    \u0275\u0275advance(3);
    \u0275\u0275property("width", 150)("sortable", true)("canAutoResize", false)("ngClass", \u0275\u0275pureFunction0(26, _c3));
    \u0275\u0275advance(3);
    \u0275\u0275property("sortable", true);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.filteredVulns.length === 0);
  }
}
var VulnerabilitiesTableComponent = class _VulnerabilitiesTableComponent {
  constructor() {
    this.vulns = [];
    this.filteredVulns = [];
    this.selectedBranch = null;
    this.selectedBranchId = null;
    this.showRemoved = false;
    this.showSuppressed = false;
    this.showAiSuppressed = false;
    this.showUrgent = false;
    this.showNotable = false;
    this.hasUrgentFindings = false;
    this.hasNotableFindings = false;
    this.bulkActionMode = false;
    this.selectedFindings = [];
    this.vulnerabilitiesLoading = false;
    this.vulnerabilitiesLimit = 20;
    this.currentFilters = null;
    this.jiraEnabled = false;
    this.teamId = null;
    this.updateFilterNameEvent = new EventEmitter();
    this.updateFilterLocationEvent = new EventEmitter();
    this.updateFilterSourceEvent = new EventEmitter();
    this.updateFilterStatusEvent = new EventEmitter();
    this.updateFilterSeverityEvent = new EventEmitter();
    this.toggleShowRemovedEvent = new EventEmitter();
    this.toggleShowSuppressedEvent = new EventEmitter();
    this.toggleShowAiSuppressedEvent = new EventEmitter();
    this.toggleShowUrgentEvent = new EventEmitter();
    this.toggleShowNotableEvent = new EventEmitter();
    this.toggleBulkActionEvent = new EventEmitter();
    this.selectAllFindingsEvent = new EventEmitter();
    this.onSelectFindingEvent = new EventEmitter();
    this.suppressSelectedFindingsEvent = new EventEmitter();
    this.onBranchSelectEvent = new EventEmitter();
    this.viewVulnerabilityDetailsEvent = new EventEmitter();
    this.clearFiltersEvent = new EventEmitter();
    this.createJiraTicketEvent = new EventEmitter();
    this.createJiraTicketsBulkEvent = new EventEmitter();
    this.statusFilter = "";
  }
  // Ensure we have a local object to bind to when parent hasn't provided one yet
  ensureCurrentFilters() {
    if (!this.currentFilters) {
      this.currentFilters = { name: "", location: "", source: "", status: "", severity: "" };
    }
    return this.currentFilters;
  }
  // Safe proxy for template bindings (always non-null)
  get cf() {
    return this.ensureCurrentFilters();
  }
  ngOnInit() {
  }
  ngOnChanges(changes) {
  }
  /**
   * Update name filter
   */
  updateFilterName(valueOrEvent) {
    const v = typeof valueOrEvent === "string" ? valueOrEvent : (valueOrEvent?.target?.value ?? "").toString();
    this.ensureCurrentFilters()["name"] = v;
    this.updateFilterNameEvent.emit({ target: { value: v } });
  }
  /**
   * Update location filter
   */
  updateFilterLocation(valueOrEvent) {
    const v = typeof valueOrEvent === "string" ? valueOrEvent : (valueOrEvent?.target?.value ?? "").toString();
    this.ensureCurrentFilters()["location"] = v;
    this.updateFilterLocationEvent.emit({ target: { value: v } });
  }
  /**
   * Update source filter
   */
  updateFilterSource(valueOrEvent) {
    const v = typeof valueOrEvent === "string" ? valueOrEvent : (valueOrEvent?.target?.value ?? "").toString();
    this.ensureCurrentFilters()["source"] = v;
    this.updateFilterSourceEvent.emit({ target: { value: v } });
  }
  /**
   * Update status filter
   */
  updateFilterStatus(valueOrEvent) {
    const v = typeof valueOrEvent === "string" ? valueOrEvent : (valueOrEvent?.target?.value ?? "").toString();
    this.ensureCurrentFilters()["status"] = v;
    this.updateFilterStatusEvent.emit({ target: { value: v } });
  }
  /**
   * Update severity filter
   */
  updateFilterSeverity(valueOrEvent) {
    const v = typeof valueOrEvent === "string" ? valueOrEvent : (valueOrEvent?.target?.value ?? "").toString();
    this.ensureCurrentFilters()["severity"] = v;
    this.updateFilterSeverityEvent.emit({ target: { value: v } });
  }
  /**
   * Toggle showing removed vulnerabilities
   */
  toggleShowRemoved(stateOrEvent) {
    const checked = typeof stateOrEvent === "boolean" ? stateOrEvent : !!stateOrEvent?.target?.checked;
    this.toggleShowRemovedEvent.emit({ target: { checked } });
  }
  /**
   * Toggle showing suppressed vulnerabilities
   */
  toggleShowSuppressed(stateOrEvent) {
    const checked = typeof stateOrEvent === "boolean" ? stateOrEvent : !!stateOrEvent?.target?.checked;
    this.toggleShowSuppressedEvent.emit({ target: { checked } });
  }
  toggleShowAiSuppressed(stateOrEvent) {
    const checked = typeof stateOrEvent === "boolean" ? stateOrEvent : !!stateOrEvent?.target?.checked;
    this.toggleShowAiSuppressedEvent.emit({ target: { checked } });
  }
  /**
   * Toggle showing urgent vulnerabilities
   */
  toggleShowUrgent(stateOrEvent) {
    const checked = typeof stateOrEvent === "boolean" ? stateOrEvent : !!stateOrEvent?.target?.checked;
    this.toggleShowUrgentEvent.emit({ target: { checked } });
  }
  /**
   * Toggle showing notable vulnerabilities
   */
  toggleShowNotable(stateOrEvent) {
    const checked = typeof stateOrEvent === "boolean" ? stateOrEvent : !!stateOrEvent?.target?.checked;
    this.toggleShowNotableEvent.emit({ target: { checked } });
  }
  /**
   * Toggle bulk action mode
   */
  toggleBulkAction() {
    this.toggleBulkActionEvent.emit();
  }
  /**
   * Select all findings
   */
  selectAllFindings(event) {
    this.selectAllFindingsEvent.emit(event);
  }
  /**
   * Select an individual finding
   */
  onSelectFinding(id, event) {
    this.onSelectFindingEvent.emit({ id, event });
  }
  /**
   * Suppress selected findings
   */
  suppressSelectedFindings() {
    this.suppressSelectedFindingsEvent.emit();
  }
  /**
   * Handle branch selection
   */
  onBranchSelect(event) {
    this.onBranchSelectEvent.emit(event);
  }
  /**
   * Check if a vulnerability is selected
   */
  isSelected(id) {
    return this.selectedFindings.includes(id);
  }
  /**
   * Show vulnerability details
   */
  click(row) {
    this.viewVulnerabilityDetailsEvent.emit(row);
  }
  /**
   * Clear all filters
   */
  clearFilters() {
    this.clearFiltersEvent.emit();
  }
  createJiraTicket(findingId) {
    this.createJiraTicketEvent.emit(findingId);
  }
  createJiraTicketsBulk() {
    this.createJiraTicketsBulkEvent.emit(this.selectedFindings);
  }
  hasJiraTicket(row) {
    return row?.jira_ticket_key != null && row?.jira_ticket_key !== "";
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
   * Get repository link for a vulnerability row
   */
  getRepositoryLinkForRow(row) {
    if (!row?.location) {
      return "#";
    }
    if (row.source === "DAST") {
      return row.location.startsWith("http") ? row.location : `//${row.location}`;
    }
    if (!this.repoData?.repourl || !this.repoData?.type) {
      return "#";
    }
    const location = row.location;
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
   * NEW: Gets the shortened display text for the location column.
   */
  getShortenedLocationText(row) {
    if (!row?.location) {
      return "Location not available";
    }
    const fullLocation = row.location;
    if (["DAST", "SCA", "GITLAB_SCANNER", "SECRETS"].includes(row.source)) {
      return fullLocation;
    }
    const pathParts = fullLocation.split("/");
    if (pathParts.length > 4) {
      return "..." + pathParts.slice(-3).join("/");
    }
    return fullLocation;
  }
  /**
   * UNCHANGED: Get formatted location for a vulnerability row.
   * This is still used by the Excel export and should return the full path.
   */
  getFormattedLocationForRow(row) {
    if (!row?.location) {
      return "Location not available";
    }
    if (["DAST", "SCA", "GITLAB_SCANNER", "SECRETS"].includes(row.source)) {
      return row.location;
    }
    const location = row.location;
    const match = location.match(/(.*):(\d+)/);
    if (!match)
      return location;
    const [, filePath, lineNumber] = match;
    return `${filePath}:${lineNumber}`;
  }
  // === XLSX Export ===
  formatDateForXlsx(d) {
    if (!d)
      return "";
    const date = typeof d === "string" ? new Date(d) : d;
    if (isNaN(date.getTime()))
      return "";
    return date.toISOString();
  }
  mapRowForExport(row) {
    return {
      Severity: row?.severity ?? "",
      Name: row?.name ?? "",
      Status: row?.status ?? "",
      Urgency: row?.urgency ? row.urgency === "urgent" ? "Urgent" : "Notable" : "",
      "Last Seen": this.formatDateForXlsx(row?.last_seen),
      Source: row?.source ?? "",
      Location: this.getFormattedLocationForRow(row)
    };
  }
  buildFiltersSheet() {
    const filters = [
      { Key: "Branch", Value: this.selectedBranch || this.repoData?.defaultBranch?.name || "" },
      { Key: "Status filter (header select)", Value: this.cf?.["status"] ?? "" },
      { Key: "Severity", Value: this.cf?.["severity"] ?? "" },
      { Key: "Name contains", Value: this.cf?.["name"] ?? "" },
      { Key: "Source", Value: this.cf?.["source"] ?? "" },
      { Key: "Location contains", Value: this.cf?.["location"] ?? "" },
      { Key: "Show Removed toggle", Value: !!this.showRemoved },
      { Key: "Show Suppressed toggle", Value: !!this.showSuppressed },
      { Key: "Urgent Only toggle", Value: !!this.showUrgent },
      { Key: "Notable Only toggle", Value: !!this.showNotable },
      { Key: "StatusFilter (global)", Value: this.statusFilter ?? "" },
      { Key: "Page Size (limit)", Value: this.vulnerabilitiesLimit ?? "" }
    ];
    const ws = utils.json_to_sheet(filters);
    ws["!cols"] = [{ wch: 28 }, { wch: 50 }];
    return ws;
  }
  getDataForExport(mode) {
    if (mode === "selected") {
      const selectedIds = new Set(this.selectedFindings ?? []);
      return (this.filteredVulns ?? []).filter((r) => selectedIds.has(r.id));
    }
    return this.filteredVulns ?? [];
  }
  exportToExcel(mode = "filtered") {
    const rows = this.getDataForExport(mode);
    if (!rows?.length) {
      return;
    }
    const exportRows = rows.map((r) => this.mapRowForExport(r));
    const wb = utils.book_new();
    const wsData = utils.json_to_sheet(exportRows, { dateNF: "yyyy-mm-dd hh:mm" });
    const headers = Object.keys(exportRows[0] || {});
    wsData["!cols"] = headers.map((h) => ({ wch: Math.max(12, h.length + 2) }));
    utils.book_append_sheet(wb, wsData, mode === "selected" ? "Selected" : "Filtered");
    const wsFilters = this.buildFiltersSheet();
    utils.book_append_sheet(wb, wsFilters, "Filters");
    const branchName = (this.selectedBranch || this.repoData?.defaultBranch?.name || "branch").toString().replace(/[^\w.-]+/g, "_");
    const ts = /* @__PURE__ */ new Date();
    const stamp = [
      ts.getFullYear(),
      String(ts.getMonth() + 1).padStart(2, "0"),
      String(ts.getDate()).padStart(2, "0"),
      String(ts.getHours()).padStart(2, "0"),
      String(ts.getMinutes()).padStart(2, "0")
    ].join("");
    const fileName = `vulnerabilities_${branchName}_${mode}_${stamp}.xlsx`;
    writeFileSync(wb, fileName);
  }
  static {
    this.\u0275fac = function VulnerabilitiesTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _VulnerabilitiesTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VulnerabilitiesTableComponent, selectors: [["app-vulnerabilities-table"]], inputs: { repoData: "repoData", vulns: "vulns", filteredVulns: "filteredVulns", selectedBranch: "selectedBranch", selectedBranchId: "selectedBranchId", showRemoved: "showRemoved", showSuppressed: "showSuppressed", showAiSuppressed: "showAiSuppressed", showUrgent: "showUrgent", showNotable: "showNotable", hasUrgentFindings: "hasUrgentFindings", hasNotableFindings: "hasNotableFindings", bulkActionMode: "bulkActionMode", selectedFindings: "selectedFindings", vulnerabilitiesLoading: "vulnerabilitiesLoading", vulnerabilitiesLimit: "vulnerabilitiesLimit", currentFilters: "currentFilters", jiraEnabled: "jiraEnabled", teamId: "teamId" }, outputs: { updateFilterNameEvent: "updateFilterNameEvent", updateFilterLocationEvent: "updateFilterLocationEvent", updateFilterSourceEvent: "updateFilterSourceEvent", updateFilterStatusEvent: "updateFilterStatusEvent", updateFilterSeverityEvent: "updateFilterSeverityEvent", toggleShowRemovedEvent: "toggleShowRemovedEvent", toggleShowSuppressedEvent: "toggleShowSuppressedEvent", toggleShowAiSuppressedEvent: "toggleShowAiSuppressedEvent", toggleShowUrgentEvent: "toggleShowUrgentEvent", toggleShowNotableEvent: "toggleShowNotableEvent", toggleBulkActionEvent: "toggleBulkActionEvent", selectAllFindingsEvent: "selectAllFindingsEvent", onSelectFindingEvent: "onSelectFindingEvent", suppressSelectedFindingsEvent: "suppressSelectedFindingsEvent", onBranchSelectEvent: "onBranchSelectEvent", viewVulnerabilityDetailsEvent: "viewVulnerabilityDetailsEvent", clearFiltersEvent: "clearFiltersEvent", createJiraTicketEvent: "createJiraTicketEvent", createJiraTicketsBulkEvent: "createJiraTicketsBulkEvent" }, standalone: true, features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature], decls: 57, vars: 41, consts: [["plainTextLocation", ""], [1, "vuln-table-card"], [1, "vuln-table-header"], [1, "filter-controls"], [1, "filter-row", "primary-controls", "d-flex", "align-items-end", "gap-3", "flex-wrap"], [1, "branch-select"], ["cLabel", "", "for", "branchSelect", 1, "form-label"], ["cSelect", "", "id", "branchSelect", 1, "form-select", "branch-selector", 3, "change"], [3, "value", "selected"], [3, "value", "selected", 4, "ngFor", "ngForOf"], [1, "toggle-controls", "d-flex", "align-items-end"], [1, "toggle-group", "d-flex", "align-items-center", "gap-3", "flex-wrap"], ["switch", "", 1, "toggle-check"], ["cFormCheckInput", "", "id", "showRemoved", "type", "checkbox", 3, "ngModelChange", "ngModel", "ngModelOptions", "disabled"], ["cFormCheckLabel", "", "for", "showRemoved"], ["cFormCheckInput", "", "id", "showSuppressed", "type", "checkbox", 3, "ngModelChange", "ngModel", "ngModelOptions", "disabled"], ["cFormCheckLabel", "", "for", "showSuppressed"], ["cFormCheckInput", "", "id", "showAiSuppressed", "type", "checkbox", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["cFormCheckLabel", "", "for", "showAiSuppressed"], ["switch", "", 1, "toggle-check", 3, "ngClass"], ["cFormCheckInput", "", "id", "showUrgent", "type", "checkbox", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["cFormCheckLabel", "", "for", "showUrgent"], ["cFormCheckInput", "", "id", "showNotable", "type", "checkbox", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["cFormCheckLabel", "", "for", "showNotable"], [1, "action-controls", "ms-auto"], ["cButton", "", "color", "success", "variant", "ghost", "size", "sm", "aria-label", "Export filtered to Excel", 1, "export-icon-btn", "me-2", 3, "click", "disabled", "cTooltip"], ["cIcon", "", "name", "cilCloudDownload"], ["cButton", "", "variant", "outline", 1, "bulk-action-btn", 3, "click", "color"], ["cIcon", "", 1, "me-1", 3, "name"], [1, "page-size-control", "ms-2"], [1, "form-label"], [1, "form-select", 3, "ngModelChange", "ngModel"], [3, "value"], ["class", "bulk-actions-row", 4, "ngIf"], [1, "vuln-table-body"], ["class", "loading-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], [1, "bulk-actions-row"], [1, "bulk-actions-container"], ["cButton", "", "color", "warning", 1, "bulk-suppress-btn", 3, "click", "disabled"], ["cIcon", "", "name", "cil-volume-off", 1, "me-1"], ["cButton", "", "color", "info", "class", "bulk-suppress-btn ms-2", 3, "disabled", "click", 4, "ngIf"], ["class", "selection-info", 4, "ngIf"], ["cButton", "", "color", "info", 1, "bulk-suppress-btn", "ms-2", 3, "click", "disabled"], ["cIcon", "", "name", "cil-task", 1, "me-1"], [1, "selection-info"], [1, "loading-container"], ["color", "primary"], [1, "loading-text"], [1, "table-container"], [1, "bootstrap", "vuln-datatable", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit"], ["name", "Select", 3, "width", "sortable", "resizeable", "draggable", "canAutoResize", "ngClass", 4, "ngIf"], ["name", "Actions", 3, "width", "sortable", "resizeable", "draggable", "canAutoResize", "ngClass"], ["ngx-datatable-cell-template", ""], ["name", "Severity", "prop", "severity", 3, "width", "sortable", "canAutoResize", "ngClass"], ["ngx-datatable-header-template", ""], ["name", "Name", "prop", "name", 3, "sortable"], ["name", "Source", "prop", "source", 3, "width", "sortable", "canAutoResize", "ngClass"], ["name", "Location", "prop", "location", 3, "sortable"], ["class", "empty-state", 4, "ngIf"], ["name", "Select", 3, "width", "sortable", "resizeable", "draggable", "canAutoResize", "ngClass"], [1, "select-all-container"], ["cFormCheckInput", "", "type", "checkbox", 3, "change", "checked"], [1, "select-row-container"], [1, "details-action-container", "d-flex", "gap-1"], ["cButton", "", "color", "primary", "variant", "ghost", "size", "sm", 1, "details-btn", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-magnifying-glass"], ["cButton", "", "color", "info", "variant", "ghost", "size", "sm", "class", "details-btn", 3, "cTooltip", "click", 4, "ngIf"], ["class", "badge bg-success-subtle text-success", 3, "cTooltip", 4, "ngIf"], ["cButton", "", "color", "info", "variant", "ghost", "size", "sm", 1, "details-btn", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-task"], [1, "badge", "bg-success-subtle", "text-success", 3, "cTooltip"], [1, "column-header", "header-centered"], [1, "filter-container"], [1, "form-select", "form-select-sm", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["value", ""], ["value", "Critical"], ["value", "High"], ["value", "Medium"], ["value", "Low"], ["value", "Info"], [1, "severity-cell"], [3, "ngClass"], [1, "column-header"], [1, "multi-filter-container"], [1, "search-input"], ["type", "text", "placeholder", "Search name", 1, "form-control", "form-control-sm", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["cIcon", "", "name", "cil-magnifying-glass", 1, "search-icon"], [1, "form-select", "form-select-sm", "mt-1", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["value", "NEW"], ["value", "EXISTING"], ["value", "REMOVED"], ["value", "SUPRESSED"], [1, "vuln-info"], [1, "vuln-name"], [1, "vuln-metadata"], [1, "meta-row"], [1, "meta-item", "status-info"], ["cIcon", "", 1, "meta-icon", 3, "name"], ["class", "urgency-badge ms-2", 3, "ngClass", 4, "ngIf"], ["class", "badge bg-info-subtle text-info ms-2", 4, "ngIf"], ["class", "badge bg-secondary-subtle text-secondary ms-2", 4, "ngIf"], [1, "meta-item", "date-info"], [1, "date-value"], [1, "urgency-badge", "ms-2", 3, "ngClass"], ["cIcon", "", 3, "name"], [1, "badge", "bg-info-subtle", "text-info", "ms-2"], [1, "badge", "bg-secondary-subtle", "text-secondary", "ms-2"], ["value", "SAST"], ["value", "IAC"], ["value", "SECRETS"], ["value", "SCA"], ["value", "GITLAB_SCANNER"], ["value", "DAST"], [1, "source-cell"], ["type", "text", "placeholder", "Search", 1, "form-control", "form-control-sm", 3, "ngModelChange", "ngModel", "ngModelOptions"], [1, "location-cell"], [4, "ngIf", "ngIfElse"], ["target", "_blank", 1, "location-link", 3, "href", "cTooltip"], ["cIcon", "", "name", "cib-git", "class", "location-icon", 4, "ngIf"], ["cIcon", "", "name", "cil-link", "class", "location-icon", 4, "ngIf"], [1, "location-text"], ["cIcon", "", "name", "cil-external-link", "size", "sm", 1, "external-link-icon"], ["cIcon", "", "name", "cib-git", 1, "location-icon"], ["cIcon", "", "name", "cil-link", 1, "location-icon"], [1, "location-text-no-link"], [1, "empty-state"], ["cIcon", "", "name", "cil-check-circle", "width", "48", "height", "48"], ["cButton", "", "color", "primary", 3, "click"]], template: function VulnerabilitiesTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-card", 1)(1, "c-card-header", 2)(2, "div", 3)(3, "div", 4)(4, "div", 5)(5, "label", 6);
        \u0275\u0275text(6, "Branch");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "select", 7);
        \u0275\u0275listener("change", function VulnerabilitiesTableComponent_Template_select_change_7_listener($event) {
          return ctx.onBranchSelect($event);
        });
        \u0275\u0275elementStart(8, "option", 8);
        \u0275\u0275text(9);
        \u0275\u0275elementEnd();
        \u0275\u0275template(10, VulnerabilitiesTableComponent_option_10_Template, 2, 3, "option", 9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "div", 10)(12, "div", 11)(13, "c-form-check", 12)(14, "input", 13);
        \u0275\u0275twoWayListener("ngModelChange", function VulnerabilitiesTableComponent_Template_input_ngModelChange_14_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.showRemoved, $event) || (ctx.showRemoved = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function VulnerabilitiesTableComponent_Template_input_ngModelChange_14_listener($event) {
          return ctx.toggleShowRemoved($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "label", 14);
        \u0275\u0275text(16, "Show Removed");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(17, "c-form-check", 12)(18, "input", 15);
        \u0275\u0275twoWayListener("ngModelChange", function VulnerabilitiesTableComponent_Template_input_ngModelChange_18_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.showSuppressed, $event) || (ctx.showSuppressed = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function VulnerabilitiesTableComponent_Template_input_ngModelChange_18_listener($event) {
          return ctx.toggleShowSuppressed($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "label", 16);
        \u0275\u0275text(20, "Show Suppressed");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(21, "c-form-check", 12)(22, "input", 17);
        \u0275\u0275twoWayListener("ngModelChange", function VulnerabilitiesTableComponent_Template_input_ngModelChange_22_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.showAiSuppressed, $event) || (ctx.showAiSuppressed = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function VulnerabilitiesTableComponent_Template_input_ngModelChange_22_listener($event) {
          return ctx.toggleShowAiSuppressed($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "label", 18);
        \u0275\u0275text(24, "Show AI-suppressed");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(25, "c-form-check", 19)(26, "input", 20);
        \u0275\u0275twoWayListener("ngModelChange", function VulnerabilitiesTableComponent_Template_input_ngModelChange_26_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.showUrgent, $event) || (ctx.showUrgent = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function VulnerabilitiesTableComponent_Template_input_ngModelChange_26_listener($event) {
          return ctx.toggleShowUrgent($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "label", 21);
        \u0275\u0275text(28, "Urgent Only");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(29, "c-form-check", 19)(30, "input", 22);
        \u0275\u0275twoWayListener("ngModelChange", function VulnerabilitiesTableComponent_Template_input_ngModelChange_30_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.showNotable, $event) || (ctx.showNotable = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function VulnerabilitiesTableComponent_Template_input_ngModelChange_30_listener($event) {
          return ctx.toggleShowNotable($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "label", 23);
        \u0275\u0275text(32, "Notable Only");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(33, "div", 24)(34, "button", 25);
        \u0275\u0275listener("click", function VulnerabilitiesTableComponent_Template_button_click_34_listener() {
          return ctx.exportToExcel("filtered");
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(35, "svg", 26);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(36, "button", 27);
        \u0275\u0275listener("click", function VulnerabilitiesTableComponent_Template_button_click_36_listener() {
          return ctx.toggleBulkAction();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(37, "svg", 28);
        \u0275\u0275text(38);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(39, "div", 29)(40, "label", 30);
        \u0275\u0275text(41, "Page Size");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(42, "select", 31);
        \u0275\u0275twoWayListener("ngModelChange", function VulnerabilitiesTableComponent_Template_select_ngModelChange_42_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.vulnerabilitiesLimit, $event) || (ctx.vulnerabilitiesLimit = $event);
          return $event;
        });
        \u0275\u0275elementStart(43, "option", 32);
        \u0275\u0275text(44, "10");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(45, "option", 32);
        \u0275\u0275text(46, "20");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(47, "option", 32);
        \u0275\u0275text(48, "50");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(49, "option", 32);
        \u0275\u0275text(50, "100");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(51, "option", 32);
        \u0275\u0275text(52, "200");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275template(53, VulnerabilitiesTableComponent_div_53_Template, 7, 4, "div", 33);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(54, "c-card-body", 34);
        \u0275\u0275template(55, VulnerabilitiesTableComponent_div_55_Template, 4, 0, "div", 35)(56, VulnerabilitiesTableComponent_div_56_Template, 18, 27, "div", 36);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(8);
        \u0275\u0275property("value", ctx.repoData == null ? null : ctx.repoData.defaultBranch.id)("selected", !ctx.selectedBranchId || ctx.selectedBranchId === (ctx.repoData == null ? null : ctx.repoData.defaultBranch == null ? null : ctx.repoData.defaultBranch.id));
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" Default: ", ctx.repoData == null ? null : ctx.repoData.defaultBranch == null ? null : ctx.repoData.defaultBranch.name, " ");
        \u0275\u0275advance();
        \u0275\u0275property("ngForOf", ctx.repoData == null ? null : ctx.repoData.branches);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.showRemoved);
        \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(32, _c0))("disabled", ctx.statusFilter === "NEW" || ctx.statusFilter === "EXISTING");
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.showSuppressed);
        \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(33, _c0))("disabled", ctx.statusFilter === "NEW" || ctx.statusFilter === "EXISTING");
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.showAiSuppressed);
        \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(34, _c0));
        \u0275\u0275advance(3);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(35, _c1, ctx.hasUrgentFindings && !ctx.showUrgent));
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.showUrgent);
        \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(37, _c0));
        \u0275\u0275advance(3);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(38, _c2, ctx.hasNotableFindings && !ctx.showNotable));
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.showNotable);
        \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(40, _c0));
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", !ctx.filteredVulns.length)("cTooltip", "Export filtered to Excel");
        \u0275\u0275advance(2);
        \u0275\u0275property("color", ctx.bulkActionMode ? "danger" : "primary");
        \u0275\u0275advance();
        \u0275\u0275property("name", ctx.bulkActionMode ? "cil-x" : "cil-list");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.bulkActionMode ? "Exit Bulk Mode" : "Bulk Actions", " ");
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
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.bulkActionMode);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.vulnerabilitiesLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.vulnerabilitiesLoading);
      }
    }, dependencies: [
      CardComponent,
      CardHeaderComponent,
      CardBodyComponent,
      FormSelectDirective,
      NgIf,
      NgForOf,
      NgClass,
      FormCheckComponent,
      FormCheckInputDirective,
      FormCheckLabelDirective,
      ButtonDirective,
      SpinnerComponent,
      NgxDatatableModule,
      DatatableComponent,
      DataTableColumnDirective,
      DataTableColumnHeaderDirective,
      DataTableColumnCellDirective,
      IconDirective,
      FormsModule,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      CheckboxControlValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgModel,
      DatePipe,
      FormLabelDirective,
      TooltipDirective
    ], styles: ["\n\n[_nghost-%COMP%]     .ngx-datatable .datatable-body-row {\n  align-items: center;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body-row .datatable-body-cell {\n  align-self: center;\n}\n.vuln-table-card[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n}\n[class*=dark-theme][_nghost-%COMP%]   .vuln-table-card[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-table-card[_ngcontent-%COMP%] {\n  background-color: var(--cui-card-bg);\n}\n.vuln-table-header[_ngcontent-%COMP%] {\n  padding: 1rem;\n  border-bottom: 1px solid var(--cui-card-border-color);\n}\n.vuln-table-header[_ngcontent-%COMP%]   .filter-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1rem;\n  margin-bottom: 0.5rem;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .filter-row[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .primary-controls[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .branch-select[_ngcontent-%COMP%] {\n  min-width: 180px;\n  max-width: 250px;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .branch-select[_ngcontent-%COMP%]   .form-label[_ngcontent-%COMP%] {\n  margin-bottom: 0.25rem;\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: var(--cui-body-color);\n  opacity: 0.8;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .branch-select[_ngcontent-%COMP%]   .branch-selector[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .toggle-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .toggle-controls[_ngcontent-%COMP%]   .toggle-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .toggle-controls[_ngcontent-%COMP%]   .toggle-check[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .toggle-controls[_ngcontent-%COMP%]   .toggle-check[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  margin-bottom: 0;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-left: auto;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%]   .bulk-action-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  font-size: 0.875rem;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%]   .page-size-control[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-width: 80px;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%]   .page-size-control[_ngcontent-%COMP%]   .form-label[_ngcontent-%COMP%] {\n  margin-bottom: 0.25rem;\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: var(--cui-body-color);\n  opacity: 0.8;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%]   .page-size-control[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .bulk-actions-row[_ngcontent-%COMP%] {\n  width: 100%;\n  padding-top: 0.75rem;\n  margin-top: 0.75rem;\n  border-top: 1px dashed var(--cui-border-color);\n}\n.vuln-table-header[_ngcontent-%COMP%]   .bulk-actions-row[_ngcontent-%COMP%]   .bulk-actions-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .bulk-actions-row[_ngcontent-%COMP%]   .bulk-suppress-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  font-size: 0.875rem;\n}\n.vuln-table-header[_ngcontent-%COMP%]   .bulk-actions-row[_ngcontent-%COMP%]   .selection-info[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--cui-body-color);\n  opacity: 0.8;\n}\n.vuln-table-body[_ngcontent-%COMP%] {\n  padding: 0;\n}\n.vuln-table-body[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 200px;\n  gap: 1rem;\n}\n.vuln-table-body[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%]   .loading-text[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.vuln-table-body[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%] {\n  position: relative;\n}\n.vuln-table-body[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem 1rem;\n  text-align: center;\n}\n.vuln-table-body[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: var(--cui-primary);\n  opacity: 0.7;\n  margin-bottom: 1rem;\n}\n.vuln-table-body[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  margin-bottom: 0.5rem;\n  font-weight: 600;\n}\n.vuln-table-body[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n  opacity: 0.7;\n  margin-bottom: 1.5rem;\n  max-width: 300px;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n  text-align: center;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 0.875rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .filter-container[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .multi-filter-container[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .filter-container[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .filter-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .multi-filter-container[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .multi-filter-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  font-size: 0.75rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .filter-container[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .multi-filter-container[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%] {\n  position: relative;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .filter-container[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .multi-filter-container[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  padding-right: 2rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .filter-container[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]   .search-icon[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .multi-filter-container[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]   .search-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.5rem;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 14px;\n  height: 14px;\n  color: var(--cui-body-color);\n  opacity: 0.5;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .multi-filter-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .select-all-container[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .select-row-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .details-action-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .details-action-container[_ngcontent-%COMP%]   .details-btn[_ngcontent-%COMP%] {\n  border-radius: 6px;\n  padding: 0.25rem;\n  min-width: auto;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .details-action-container[_ngcontent-%COMP%]   .details-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.75rem;\n  border-radius: 30px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  display: inline-block;\n  line-height: 1;\n  white-space: nowrap;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-critical[_ngcontent-%COMP%] {\n  background-color: rgba(220, 53, 69, 0.15);\n  color: #dc3545;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-high[_ngcontent-%COMP%] {\n  background-color: rgba(244, 67, 54, 0.15);\n  color: #f44336;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-medium[_ngcontent-%COMP%] {\n  background-color: rgba(255, 152, 0, 0.15);\n  color: #ff9800;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-low[_ngcontent-%COMP%] {\n  background-color: rgba(33, 150, 243, 0.15);\n  color: #2196f3;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-info[_ngcontent-%COMP%] {\n  background-color: rgba(0, 188, 212, 0.15);\n  color: #00bcd4;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .source-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .source-cell[_ngcontent-%COMP%]   .source-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  letter-spacing: 0.3px;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .source-cell[_ngcontent-%COMP%]   .source-badge.source-sast[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-primary-rgb), 0.15);\n  color: var(--cui-primary);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .source-cell[_ngcontent-%COMP%]   .source-badge.source-dast[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-primary-rgb), 0.15);\n  color: var(--cui-primary);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .source-cell[_ngcontent-%COMP%]   .source-badge.source-iac[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-info-rgb), 0.15);\n  color: var(--cui-info);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .source-cell[_ngcontent-%COMP%]   .source-badge.source-secrets[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-danger-rgb), 0.15);\n  color: var(--cui-danger);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .source-cell[_ngcontent-%COMP%]   .source-badge.source-sca[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-warning-rgb), 0.15);\n  color: var(--cui-warning);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .source-cell[_ngcontent-%COMP%]   .source-badge.source-gitlab_scanner[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-success-rgb), 0.15);\n  color: var(--cui-success);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .status-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  height: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .status-cell[_ngcontent-%COMP%]   .status-badge[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  gap: 0.35rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .status-cell[_ngcontent-%COMP%]   .status-badge[_ngcontent-%COMP%]   .status-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .status-cell[_ngcontent-%COMP%]   .status-badge.status-new[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-danger-rgb), 0.15);\n  color: var(--cui-danger);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .status-cell[_ngcontent-%COMP%]   .status-badge.status-existing[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-warning-rgb), 0.15);\n  color: var(--cui-warning);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .status-cell[_ngcontent-%COMP%]   .status-badge.status-removed[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-success-rgb), 0.15);\n  color: var(--cui-success);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .status-cell[_ngcontent-%COMP%]   .status-badge.status-supressed[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-secondary-rgb), 0.15);\n  color: var(--cui-secondary);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  text-align: left;\n  padding: 0.5rem 0;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-name[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--cui-body-color);\n  margin-bottom: 0.5rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%] {\n  width: 100%;\n  font-size: 0.75rem;\n  color: var(--cui-secondary-color);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%]   .meta-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  opacity: 0.7;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-new[_ngcontent-%COMP%] {\n  color: var(--cui-danger);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-existing[_ngcontent-%COMP%] {\n  color: var(--cui-warning);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-removed[_ngcontent-%COMP%] {\n  color: var(--cui-success);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-supressed[_ngcontent-%COMP%] {\n  color: var(--cui-secondary);\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.date-info[_ngcontent-%COMP%]   .date-label[_ngcontent-%COMP%] {\n  opacity: 0.7;\n  font-weight: 500;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.date-info[_ngcontent-%COMP%]   .date-value[_ngcontent-%COMP%] {\n  font-weight: 400;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  height: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.35rem;\n  color: var(--cui-primary);\n  text-decoration: none;\n  font-size: 0.875rem;\n  transition: color 0.2s;\n  text-align: left;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]:hover {\n  color: var(--cui-primary-hover);\n  text-decoration: underline;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]   .location-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  flex-shrink: 0;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]   .location-text[_ngcontent-%COMP%] {\n  white-space: normal;\n  word-break: break-word;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]   .external-link-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  flex-shrink: 0;\n  opacity: 0.7;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .dates-cell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  padding: 0.25rem 0;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .dates-cell[_ngcontent-%COMP%]   .date-item[_ngcontent-%COMP%] {\n  display: flex;\n  font-size: 0.75rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .dates-cell[_ngcontent-%COMP%]   .date-item[_ngcontent-%COMP%]   .date-label[_ngcontent-%COMP%] {\n  width: 65px;\n  font-weight: 600;\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .dates-cell[_ngcontent-%COMP%]   .date-item[_ngcontent-%COMP%]   .date-value[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n}\n@media (max-width: 768px) {\n  .vuln-table-header[_ngcontent-%COMP%]   .primary-controls[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 1rem;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .branch-select[_ngcontent-%COMP%], \n   .vuln-table-header[_ngcontent-%COMP%]   .toggle-controls[_ngcontent-%COMP%], \n   .vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 100%;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .toggle-group[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%]   .page-size-control[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .vuln-datatable[_ngcontent-%COMP%]   .datatable-header[_ngcontent-%COMP%]   .datatable-header-cell[_ngcontent-%COMP%] {\n    min-width: 100px;\n  }\n}\n.urgency-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  padding: 0.25em 0.6em;\n  font-size: 0.8em;\n  font-weight: 700;\n  line-height: 1;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: 0.375rem;\n}\n.urgency-badge[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  margin-right: 0.3rem;\n}\n.urgency-badge.urgent[_ngcontent-%COMP%] {\n  color: #fff;\n  background-color: #e55353;\n}\n.urgency-badge.notable[_ngcontent-%COMP%] {\n  color: #fff;\n  background-color: #f9b115;\n}\n@keyframes _ngcontent-%COMP%_pulse-warning {\n  0% {\n    box-shadow: 0 0 0 0 rgba(249, 177, 21, 0.7);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(249, 177, 21, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(249, 177, 21, 0);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse-danger {\n  0% {\n    box-shadow: 0 0 0 0 rgba(229, 83, 83, 0.7);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(229, 83, 83, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(229, 83, 83, 0);\n  }\n}\n[_nghost-%COMP%]     .form-check.pulse-notable .form-check-label {\n  animation: _ngcontent-%COMP%_pulse-warning 2s infinite;\n  border-radius: 5px;\n}\n[_nghost-%COMP%]     .form-check.pulse-urgent .form-check-label {\n  animation: _ngcontent-%COMP%_pulse-danger 2s infinite;\n  border-radius: 5px;\n}\n/*# sourceMappingURL=vulnerabilities-table.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VulnerabilitiesTableComponent, { className: "VulnerabilitiesTableComponent" });
})();

export {
  RepoService,
  VulnerabilitiesTableComponent
};
//# sourceMappingURL=chunk-POCT43DP.js.map
