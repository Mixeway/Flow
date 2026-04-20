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

// src/app/views/show-team/team-vulnerabilities-table/team-vulnerabilities-table.component.ts
var _c0 = () => ({ standalone: true });
var _c1 = (a0) => ({ "pulse-urgent": a0 });
var _c2 = (a0) => ({ "pulse-notable": a0 });
var _c3 = () => ({ "datatable-column": true, "centered-column": true });
function TeamVulnerabilitiesTableComponent_option_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const branch_r1 = ctx.$implicit;
    \u0275\u0275property("value", branch_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", branch_r1.name, " ");
  }
}
function TeamVulnerabilitiesTableComponent_div_49_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 40);
    \u0275\u0275listener("click", function TeamVulnerabilitiesTableComponent_div_49_button_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.createJiraTicketsBulk());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 41);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r2.selectedFindings.length === 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Create JIRA Tickets (", ctx_r2.selectedFindings.length, ") ");
  }
}
function TeamVulnerabilitiesTableComponent_div_49_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r2.selectedFindings.length, " items selected");
  }
}
function TeamVulnerabilitiesTableComponent_div_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 34)(1, "div", 35)(2, "button", 36);
    \u0275\u0275listener("click", function TeamVulnerabilitiesTableComponent_div_49_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.suppressSelectedFindings());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 37);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, TeamVulnerabilitiesTableComponent_div_49_button_5_Template, 3, 2, "button", 38)(6, TeamVulnerabilitiesTableComponent_div_49_div_6_Template, 3, 1, "div", 39);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.selectedFindings.length === 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Suppress Selected (", ctx_r2.selectedFindings.length, ") ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.jiraEnabled);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.selectedFindings.length > 0);
  }
}
function TeamVulnerabilitiesTableComponent_div_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275element(1, "c-spinner", 44);
    \u0275\u0275elementStart(2, "span", 45);
    \u0275\u0275text(3, "Loading vulnerabilities...");
    \u0275\u0275elementEnd()();
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ngx_datatable_column_2_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 58)(1, "c-form-check")(2, "input", 59);
    \u0275\u0275listener("change", function TeamVulnerabilitiesTableComponent_div_52_ngx_datatable_column_2_ng_template_1_Template_input_change_2_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.selectAllFindings($event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", ctx_r2.selectedFindings.length > 0 && ctx_r2.selectedFindings.length === ctx_r2.filteredVulns.length);
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ngx_datatable_column_2_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 60)(1, "c-form-check")(2, "input", 59);
    \u0275\u0275listener("change", function TeamVulnerabilitiesTableComponent_div_52_ngx_datatable_column_2_ng_template_2_Template_input_change_2_listener($event) {
      const row_r7 = \u0275\u0275restoreView(_r6).row;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onSelectFinding(row_r7.id, $event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const row_r7 = ctx.row;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", ctx_r2.isSelected(row_r7.id));
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ngx_datatable_column_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ngx-datatable-column", 57);
    \u0275\u0275template(1, TeamVulnerabilitiesTableComponent_div_52_ngx_datatable_column_2_ng_template_1_Template, 3, 1, "ng-template", 52)(2, TeamVulnerabilitiesTableComponent_div_52_ngx_datatable_column_2_ng_template_2_Template, 3, 1, "ng-template", 50);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("width", 50)("sortable", false)("resizeable", false)("draggable", false)("canAutoResize", false)("ngClass", \u0275\u0275pureFunction0(6, _c3));
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_4_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 66);
    \u0275\u0275listener("click", function TeamVulnerabilitiesTableComponent_div_52_ng_template_4_button_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const row_r9 = \u0275\u0275nextContext().row;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.createJiraTicket(row_r9.id));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 67);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("cTooltip", "Create JIRA ticket");
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_4_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 68);
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
function TeamVulnerabilitiesTableComponent_div_52_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 61)(1, "button", 62);
    \u0275\u0275listener("click", function TeamVulnerabilitiesTableComponent_div_52_ng_template_4_Template_button_click_1_listener() {
      const row_r9 = \u0275\u0275restoreView(_r8).row;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.click(row_r9));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, TeamVulnerabilitiesTableComponent_div_52_ng_template_4_button_3_Template, 2, 1, "button", 64)(4, TeamVulnerabilitiesTableComponent_div_52_ng_template_4_span_4_Template, 2, 2, "span", 65);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r9 = ctx.row;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("cTooltip", "View vulnerability details");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r2.jiraEnabled && !ctx_r2.hasJiraTicket(row_r9));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.jiraEnabled && ctx_r2.hasJiraTicket(row_r9));
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 69)(1, "span");
    \u0275\u0275text(2, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 70)(4, "select", 71);
    \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilitiesTableComponent_div_52_ng_template_6_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.cf["severity"], $event) || (ctx_r2.cf["severity"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function TeamVulnerabilitiesTableComponent_div_52_ng_template_6_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.updateFilterSeverity($event));
    });
    \u0275\u0275elementStart(5, "option", 72);
    \u0275\u0275text(6, "All");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "option", 73);
    \u0275\u0275text(8, "Critical");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "option", 74);
    \u0275\u0275text(10, "High");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "option", 75);
    \u0275\u0275text(12, "Medium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "option", 76);
    \u0275\u0275text(14, "Low");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 77);
    \u0275\u0275text(16, "Info");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.cf["severity"]);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(2, _c0));
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 78)(1, "div", 79);
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
function TeamVulnerabilitiesTableComponent_div_52_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 80)(1, "span");
    \u0275\u0275text(2, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 81)(4, "div", 82)(5, "input", 83);
    \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilitiesTableComponent_div_52_ng_template_9_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.cf["name"], $event) || (ctx_r2.cf["name"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function TeamVulnerabilitiesTableComponent_div_52_ng_template_9_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.updateFilterName($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 84);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(7, "select", 85);
    \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilitiesTableComponent_div_52_ng_template_9_Template_select_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.cf["status"], $event) || (ctx_r2.cf["status"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function TeamVulnerabilitiesTableComponent_div_52_ng_template_9_Template_select_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.updateFilterStatus($event));
    });
    \u0275\u0275elementStart(8, "option", 72);
    \u0275\u0275text(9, "All Statuses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "option", 86);
    \u0275\u0275text(11, "New");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "option", 87);
    \u0275\u0275text(13, "Existing");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "option", 88);
    \u0275\u0275text(15, "Removed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "option", 89);
    \u0275\u0275text(17, "Suppressed");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.cf["name"]);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(4, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.cf["status"]);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(5, _c0));
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_10_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 99);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 100);
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
function TeamVulnerabilitiesTableComponent_div_52_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 90)(1, "div", 91);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 92)(4, "div", 93)(5, "div", 94);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 95);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(7, "span", 79);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, TeamVulnerabilitiesTableComponent_div_52_ng_template_10_span_9_Template, 3, 3, "span", 96);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 97)(11, "span", 98);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "date");
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
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Last seen: ", \u0275\u0275pipeBind2(13, 6, row_r14 == null ? null : row_r14.last_seen, "short"), "");
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 69)(1, "span");
    \u0275\u0275text(2, "Source");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 70)(4, "select", 71);
    \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilitiesTableComponent_div_52_ng_template_12_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.cf["source"], $event) || (ctx_r2.cf["source"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function TeamVulnerabilitiesTableComponent_div_52_ng_template_12_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.updateFilterSource($event));
    });
    \u0275\u0275elementStart(5, "option", 72);
    \u0275\u0275text(6, "All");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "option", 101);
    \u0275\u0275text(8, "SAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "option", 102);
    \u0275\u0275text(10, "IaC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "option", 103);
    \u0275\u0275text(12, "Secrets");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "option", 104);
    \u0275\u0275text(14, "SCA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 105);
    \u0275\u0275text(16, "GitLab");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "option", 106);
    \u0275\u0275text(18, "DAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "option", 107);
    \u0275\u0275text(20, "Cloud Scanner");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "option", 108);
    \u0275\u0275text(22, "Cloud Issues");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.cf["source"]);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(2, _c0));
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 109)(1, "div", 79);
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
function TeamVulnerabilitiesTableComponent_div_52_ng_template_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 80)(1, "span");
    \u0275\u0275text(2, "Location");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 70)(4, "div", 82)(5, "input", 110);
    \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilitiesTableComponent_div_52_ng_template_15_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.cf["location"], $event) || (ctx_r2.cf["location"] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function TeamVulnerabilitiesTableComponent_div_52_ng_template_15_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r17);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.updateFilterLocation($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 84);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.cf["location"]);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(2, _c0));
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_16_ng_container_1__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 119);
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_16_ng_container_1__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 120);
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_16_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "a", 114);
    \u0275\u0275template(2, TeamVulnerabilitiesTableComponent_div_52_ng_template_16_ng_container_1__svg_svg_2_Template, 1, 0, "svg", 115)(3, TeamVulnerabilitiesTableComponent_div_52_ng_template_16_ng_container_1__svg_svg_3_Template, 1, 0, "svg", 116);
    \u0275\u0275elementStart(4, "span", 117);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 118);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const row_r18 = \u0275\u0275nextContext().row;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("href", ctx_r2.getRepositoryLinkForRow(row_r18), \u0275\u0275sanitizeUrl)("cTooltip", "Open in repository");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r18.source !== "DAST");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r18.source === "DAST");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.getFormattedLocationForRow(row_r18));
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_16_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 121);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r18 = \u0275\u0275nextContext().row;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.getFormattedLocationForRow(row_r18), " ");
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_16_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 122)(1, "small", 123);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r18 = \u0275\u0275nextContext().row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r18.repoUrl);
  }
}
function TeamVulnerabilitiesTableComponent_div_52_ng_template_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 111);
    \u0275\u0275template(1, TeamVulnerabilitiesTableComponent_div_52_ng_template_16_ng_container_1_Template, 7, 5, "ng-container", 112)(2, TeamVulnerabilitiesTableComponent_div_52_ng_template_16_ng_template_2_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(4, TeamVulnerabilitiesTableComponent_div_52_ng_template_16_div_4_Template, 3, 1, "div", 113);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r18 = ctx.row;
    const plainText_r19 = \u0275\u0275reference(3);
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.isLinkableSource(row_r18.source))("ngIfElse", plainText_r19);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", row_r18.repoUrl);
  }
}
function TeamVulnerabilitiesTableComponent_div_52_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 124);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 125);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "h4");
    \u0275\u0275text(3, "No vulnerabilities found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "No vulnerabilities match your current filter criteria.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 126);
    \u0275\u0275listener("click", function TeamVulnerabilitiesTableComponent_div_52_div_17_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.clearFilters());
    });
    \u0275\u0275text(7, "Clear filters");
    \u0275\u0275elementEnd()();
  }
}
function TeamVulnerabilitiesTableComponent_div_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46)(1, "ngx-datatable", 47);
    \u0275\u0275template(2, TeamVulnerabilitiesTableComponent_div_52_ngx_datatable_column_2_Template, 3, 7, "ngx-datatable-column", 48);
    \u0275\u0275elementStart(3, "ngx-datatable-column", 49);
    \u0275\u0275template(4, TeamVulnerabilitiesTableComponent_div_52_ng_template_4_Template, 5, 3, "ng-template", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ngx-datatable-column", 51);
    \u0275\u0275template(6, TeamVulnerabilitiesTableComponent_div_52_ng_template_6_Template, 17, 3, "ng-template", 52)(7, TeamVulnerabilitiesTableComponent_div_52_ng_template_7_Template, 3, 2, "ng-template", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "ngx-datatable-column", 53);
    \u0275\u0275template(9, TeamVulnerabilitiesTableComponent_div_52_ng_template_9_Template, 18, 6, "ng-template", 52)(10, TeamVulnerabilitiesTableComponent_div_52_ng_template_10_Template, 14, 9, "ng-template", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "ngx-datatable-column", 54);
    \u0275\u0275template(12, TeamVulnerabilitiesTableComponent_div_52_ng_template_12_Template, 23, 3, "ng-template", 52)(13, TeamVulnerabilitiesTableComponent_div_52_ng_template_13_Template, 3, 2, "ng-template", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "ngx-datatable-column", 55);
    \u0275\u0275template(15, TeamVulnerabilitiesTableComponent_div_52_ng_template_15_Template, 7, 3, "ng-template", 52)(16, TeamVulnerabilitiesTableComponent_div_52_ng_template_16_Template, 5, 3, "ng-template", 50);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(17, TeamVulnerabilitiesTableComponent_div_52_div_17_Template, 8, 0, "div", 56);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("rows", ctx_r2.filteredVulns)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", ctx_r2.vulnerabilitiesLimit);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.bulkActionMode);
    \u0275\u0275advance();
    \u0275\u0275property("width", ctx_r2.jiraEnabled ? 100 : 60)("sortable", false)("resizeable", false)("draggable", false)("canAutoResize", false)("ngClass", \u0275\u0275pureFunction0(24, _c3));
    \u0275\u0275advance(2);
    \u0275\u0275property("width", 100)("sortable", true)("canAutoResize", false)("ngClass", \u0275\u0275pureFunction0(25, _c3));
    \u0275\u0275advance(3);
    \u0275\u0275property("sortable", true);
    \u0275\u0275advance(3);
    \u0275\u0275property("width", 150)("sortable", true)("canAutoResize", false)("ngClass", \u0275\u0275pureFunction0(26, _c3));
    \u0275\u0275advance(3);
    \u0275\u0275property("sortable", true);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r2.filteredVulns.length === 0);
  }
}
var TeamVulnerabilitiesTableComponent = class _TeamVulnerabilitiesTableComponent {
  constructor() {
    this.filteredVulns = [];
    this.showRemoved = false;
    this.showSuppressed = false;
    this.bulkActionMode = false;
    this.selectedFindings = [];
    this.vulnerabilitiesLoading = false;
    this.vulnerabilitiesLimit = 15;
    this.vulns = [];
    this.selectedBranch = null;
    this.showUrgent = false;
    this.showNotable = false;
    this.hasUrgentFindings = false;
    this.hasNotableFindings = false;
    this.currentFilters = null;
    this.jiraEnabled = false;
    this.teamId = null;
    this.updateFilterNameEvent = new EventEmitter();
    this.updateFilterComponentEvent = new EventEmitter();
    this.updateFilterSourceEvent = new EventEmitter();
    this.updateFilterStatusEvent = new EventEmitter();
    this.updateFilterSeverityEvent = new EventEmitter();
    this.toggleShowRemovedEvent = new EventEmitter();
    this.toggleShowSuppressedEvent = new EventEmitter();
    this.toggleBulkActionEvent = new EventEmitter();
    this.selectAllFindingsEvent = new EventEmitter();
    this.onSelectFindingEvent = new EventEmitter();
    this.suppressSelectedFindingsEvent = new EventEmitter();
    this.vulnerabilitiesLimitChange = new EventEmitter();
    this.viewVulnerabilityDetailsEvent = new EventEmitter();
    this.clearFiltersEvent = new EventEmitter();
    this.createJiraTicketEvent = new EventEmitter();
    this.createJiraTicketsBulkEvent = new EventEmitter();
    this.updateFilterLocationEvent = new EventEmitter();
    this.toggleShowUrgentEvent = new EventEmitter();
    this.toggleShowNotableEvent = new EventEmitter();
    this.onBranchSelectEvent = new EventEmitter();
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
  //
  // filters: { [key: string]: string } = {
  //   name: '',
  //   location: '',
  //   source: '',
  //   status: '',
  //   severity: '',
  // };
  updateFilterName(event) {
    const v = typeof event === "string" ? event : (event?.target?.value ?? "").toString();
    this.ensureCurrentFilters()["name"] = v;
    this.updateFilterNameEvent.emit({ target: { value: v } });
  }
  updateFilterLocation(event) {
    const v = typeof event === "string" ? event : (event?.target?.value ?? "").toString();
    this.ensureCurrentFilters()["location"] = v;
    this.updateFilterLocationEvent.emit({ target: { value: v } });
  }
  updateFilterComponent(event) {
    const v = typeof event === "string" ? event : (event?.target?.value ?? "").toString();
    this.ensureCurrentFilters()["location"] = v;
    this.updateFilterComponentEvent.emit({ target: { value: v } });
  }
  updateFilterSource(event) {
    const v = typeof event === "string" ? event : (event?.target?.value ?? "").toString();
    this.ensureCurrentFilters()["source"] = v;
    this.updateFilterSourceEvent.emit({ target: { value: v } });
  }
  updateFilterStatus(event) {
    const v = typeof event === "string" ? event : (event?.target?.value ?? "").toString();
    this.statusFilter = v || "";
    this.ensureCurrentFilters()["status"] = v;
    this.updateFilterStatusEvent.emit({ target: { value: v } });
  }
  updateFilterSeverity(event) {
    const v = typeof event === "string" ? event : (event?.target?.value ?? "").toString();
    this.ensureCurrentFilters()["severity"] = v;
    this.updateFilterSeverityEvent.emit({ target: { value: v } });
  }
  toggleShowRemoved(event) {
    const checked = typeof event === "boolean" ? event : !!event?.target?.checked;
    this.toggleShowRemovedEvent.emit({ target: { checked } });
  }
  toggleShowSuppressed(event) {
    const checked = typeof event === "boolean" ? event : !!event?.target?.checked;
    this.toggleShowSuppressedEvent.emit({ target: { checked } });
  }
  toggleShowUrgent(stateOrEvent) {
    const checked = typeof stateOrEvent === "boolean" ? stateOrEvent : !!stateOrEvent?.target?.checked;
    this.showUrgent = checked;
    if (checked && this.showNotable) {
      this.showNotable = false;
      this.toggleShowNotableEvent.emit({ target: { checked: false } });
    }
    this.toggleShowUrgentEvent.emit({ target: { checked } });
  }
  toggleShowNotable(stateOrEvent) {
    const checked = typeof stateOrEvent === "boolean" ? stateOrEvent : !!stateOrEvent?.target?.checked;
    this.showNotable = checked;
    if (checked && this.showUrgent) {
      this.showUrgent = false;
      this.toggleShowUrgentEvent.emit({ target: { checked: false } });
    }
    this.toggleShowNotableEvent.emit({ target: { checked } });
  }
  onBranchSelect(event) {
    this.onBranchSelectEvent.emit(event);
  }
  isLinkableSource(source) {
    const linkableSources = ["SAST", "IAC", "SECRETS", "DAST"];
    return linkableSources.includes(source);
  }
  getRepositoryLinkForRow(row) {
    if (!row?.location)
      return "#";
    if (row.source === "DAST") {
      return row.location.startsWith("http") ? row.location : `//${row.location}`;
    }
    if (!this.repoData?.repourl)
      return "#";
    const location = row.location;
    const repoUrl = this.repoData.repourl;
    const branch = this.selectedBranch || this.repoData?.defaultBranch?.name;
    const match = location.match(/(.*):(\d+)/);
    if (!match)
      return repoUrl;
    const [, filePath, lineNumber] = match;
    if (repoUrl.includes("github.com")) {
      return `${repoUrl}/blob/${branch}/${filePath}#L${lineNumber}`;
    } else if (repoUrl.includes("gitlab.com")) {
      const baseUrl = repoUrl.replace(/\/?$/, "");
      return `${baseUrl}/-/blob/${branch}/${filePath}#L${lineNumber}`;
    }
    return repoUrl;
  }
  getFormattedLocationForRow(row) {
    if (!row?.location)
      return "Location not available";
    if (row.source === "DAST" || row.source === "SCA" || row.source === "GITLAB_SCANNER") {
      return row.location;
    }
    const match = row.location.match(/(.*):(\d+)/);
    if (!match)
      return row.location;
    const [, filePath, lineNumber] = match;
    return `${filePath}:${lineNumber} `;
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
      Location: this.getFormattedLocationForRow(row),
      RepoUrl: row?.repoUrl ?? ""
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
  toggleBulkAction() {
    this.toggleBulkActionEvent.emit();
  }
  selectAllFindings(event) {
    this.selectAllFindingsEvent.emit(event);
  }
  onSelectFinding(id, event) {
    this.onSelectFindingEvent.emit({ id, event });
  }
  suppressSelectedFindings() {
    this.suppressSelectedFindingsEvent.emit();
  }
  onLimitChange(newLimit) {
    this.vulnerabilitiesLimit = newLimit;
    this.vulnerabilitiesLimitChange.emit(newLimit);
  }
  isSelected(id) {
    return this.selectedFindings.includes(id);
  }
  click(row) {
    this.viewVulnerabilityDetailsEvent.emit(row);
  }
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
  ngOnInit() {
  }
  ngOnChanges(changes) {
  }
  static {
    this.\u0275fac = function TeamVulnerabilitiesTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TeamVulnerabilitiesTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeamVulnerabilitiesTableComponent, selectors: [["app-team-vulnerabilities-table"]], inputs: { filteredVulns: "filteredVulns", showRemoved: "showRemoved", showSuppressed: "showSuppressed", bulkActionMode: "bulkActionMode", selectedFindings: "selectedFindings", vulnerabilitiesLoading: "vulnerabilitiesLoading", vulnerabilitiesLimit: "vulnerabilitiesLimit", filters: "filters", repoData: "repoData", vulns: "vulns", selectedBranch: "selectedBranch", showUrgent: "showUrgent", showNotable: "showNotable", hasUrgentFindings: "hasUrgentFindings", hasNotableFindings: "hasNotableFindings", currentFilters: "currentFilters", jiraEnabled: "jiraEnabled", teamId: "teamId" }, outputs: { updateFilterNameEvent: "updateFilterNameEvent", updateFilterComponentEvent: "updateFilterComponentEvent", updateFilterSourceEvent: "updateFilterSourceEvent", updateFilterStatusEvent: "updateFilterStatusEvent", updateFilterSeverityEvent: "updateFilterSeverityEvent", toggleShowRemovedEvent: "toggleShowRemovedEvent", toggleShowSuppressedEvent: "toggleShowSuppressedEvent", toggleBulkActionEvent: "toggleBulkActionEvent", selectAllFindingsEvent: "selectAllFindingsEvent", onSelectFindingEvent: "onSelectFindingEvent", suppressSelectedFindingsEvent: "suppressSelectedFindingsEvent", vulnerabilitiesLimitChange: "vulnerabilitiesLimitChange", viewVulnerabilityDetailsEvent: "viewVulnerabilityDetailsEvent", clearFiltersEvent: "clearFiltersEvent", createJiraTicketEvent: "createJiraTicketEvent", createJiraTicketsBulkEvent: "createJiraTicketsBulkEvent", updateFilterLocationEvent: "updateFilterLocationEvent", toggleShowUrgentEvent: "toggleShowUrgentEvent", toggleShowNotableEvent: "toggleShowNotableEvent", onBranchSelectEvent: "onBranchSelectEvent" }, standalone: true, features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature], decls: 53, vars: 37, consts: [["plainText", ""], ["xmlns", "http://www.w3.org/1999/html", 1, "vuln-table-card"], [1, "vuln-table-header"], [1, "filter-controls"], [1, "filter-row", "primary-controls", "d-flex", "align-items-end", "gap-3", "flex-wrap"], [1, "branch-select"], ["cLabel", "", "for", "branchSelect", 1, "form-label"], ["cSelect", "", "id", "branchSelect", "disabled", "", 1, "form-select", "branch-selector", 3, "change"], [3, "value"], [3, "value", 4, "ngFor", "ngForOf"], [1, "toggle-controls", "d-flex", "align-items-end"], [1, "toggle-group", "d-flex", "align-items-center", "gap-3", "flex-wrap"], ["switch", "", 1, "toggle-check"], ["cFormCheckInput", "", "id", "showRemoved", "type", "checkbox", 3, "ngModelChange", "ngModel", "ngModelOptions", "disabled"], ["cFormCheckLabel", "", "for", "showRemoved"], ["cFormCheckInput", "", "id", "showSuppressed", "type", "checkbox", 3, "ngModelChange", "ngModel", "ngModelOptions", "disabled"], ["cFormCheckLabel", "", "for", "showSuppressed"], ["switch", "", 1, "toggle-check", 3, "ngClass"], ["cFormCheckInput", "", "id", "showUrgent", "type", "checkbox", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["cFormCheckLabel", "", "for", "showUrgent"], ["cFormCheckInput", "", "id", "showNotable", "type", "checkbox", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["cFormCheckLabel", "", "for", "showNotable"], [1, "action-controls", "ms-auto", "d-flex", "align-items-end"], ["cButton", "", "color", "success", "variant", "ghost", "size", "sm", "aria-label", "Export filtered to Excel", 1, "export-icon-btn", "me-2", 3, "click", "disabled", "cTooltip"], ["cIcon", "", "name", "cil-cloud-download"], ["cButton", "", "variant", "outline", 1, "bulk-action-btn", 3, "click", "color"], ["cIcon", "", 1, "me-1", 3, "name"], [1, "page-size-control", "ms-2"], [1, "form-label"], [1, "form-select", 3, "ngModelChange", "ngModel"], ["class", "bulk-actions-row", 4, "ngIf"], [1, "vuln-table-body"], ["class", "loading-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], [1, "bulk-actions-row"], [1, "bulk-actions-container"], ["cButton", "", "color", "warning", 1, "bulk-suppress-btn", 3, "click", "disabled"], ["cIcon", "", "name", "cil-volume-off", 1, "me-1"], ["cButton", "", "color", "info", "class", "bulk-suppress-btn ms-2", 3, "disabled", "click", 4, "ngIf"], ["class", "selection-info", 4, "ngIf"], ["cButton", "", "color", "info", 1, "bulk-suppress-btn", "ms-2", 3, "click", "disabled"], ["cIcon", "", "name", "cil-task", 1, "me-1"], [1, "selection-info"], [1, "loading-container"], ["color", "primary"], [1, "loading-text"], [1, "table-container"], [1, "bootstrap", "vuln-datatable", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit"], ["name", "Select", 3, "width", "sortable", "resizeable", "draggable", "canAutoResize", "ngClass", 4, "ngIf"], ["name", "Actions", 3, "width", "sortable", "resizeable", "draggable", "canAutoResize", "ngClass"], ["ngx-datatable-cell-template", ""], ["name", "Severity", "prop", "severity", 3, "width", "sortable", "canAutoResize", "ngClass"], ["ngx-datatable-header-template", ""], ["name", "Name", "prop", "name", 3, "sortable"], ["name", "Source", "prop", "source", 3, "width", "sortable", "canAutoResize", "ngClass"], ["name", "Location", "prop", "location", 3, "sortable"], ["class", "empty-state", 4, "ngIf"], ["name", "Select", 3, "width", "sortable", "resizeable", "draggable", "canAutoResize", "ngClass"], [1, "select-all-container"], ["cFormCheckInput", "", "type", "checkbox", 3, "change", "checked"], [1, "select-row-container"], [1, "details-action-container", "d-flex", "gap-1"], ["cButton", "", "color", "primary", "variant", "ghost", "size", "sm", 1, "details-btn", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-magnifying-glass"], ["cButton", "", "color", "info", "variant", "ghost", "size", "sm", "class", "details-btn", 3, "cTooltip", "click", 4, "ngIf"], ["class", "badge bg-success-subtle text-success", 3, "cTooltip", 4, "ngIf"], ["cButton", "", "color", "info", "variant", "ghost", "size", "sm", 1, "details-btn", 3, "click", "cTooltip"], ["cIcon", "", "name", "cil-task"], [1, "badge", "bg-success-subtle", "text-success", 3, "cTooltip"], [1, "column-header", "header-centered"], [1, "filter-container"], [1, "form-select", "form-select-sm", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["value", ""], ["value", "Critical"], ["value", "High"], ["value", "Medium"], ["value", "Low"], ["value", "Info"], [1, "severity-cell"], [3, "ngClass"], [1, "column-header"], [1, "multi-filter-container"], [1, "search-input"], ["type", "text", "placeholder", "Search name", 1, "form-control", "form-control-sm", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["cIcon", "", "name", "cil-magnifying-glass", 1, "search-icon"], [1, "form-select", "form-select-sm", "mt-1", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["value", "NEW"], ["value", "EXISTING"], ["value", "REMOVED"], ["value", "SUPPRESSED"], [1, "vuln-info"], [1, "vuln-name"], [1, "vuln-metadata"], [1, "meta-row"], [1, "meta-item", "status-info"], ["cIcon", "", 1, "meta-icon", 3, "name"], ["class", "urgency-badge ms-2", 3, "ngClass", 4, "ngIf"], [1, "meta-item", "date-info"], [1, "date-value"], [1, "urgency-badge", "ms-2", 3, "ngClass"], ["cIcon", "", 3, "name"], ["value", "SAST"], ["value", "IAC"], ["value", "SECRETS"], ["value", "SCA"], ["value", "GITLAB_SCANNER"], ["value", "DAST"], ["value", "CLOUD_SCANNER"], ["value", "CLOUD_ISSUE"], [1, "source-cell"], ["type", "text", "placeholder", "Search location", 1, "form-control", "form-control-sm", 3, "ngModelChange", "ngModel", "ngModelOptions"], [1, "location-cell"], [4, "ngIf", "ngIfElse"], ["class", "repo-url mt-1", 4, "ngIf"], ["target", "_blank", 1, "location-link", 3, "href", "cTooltip"], ["cIcon", "", "name", "cib-git", "class", "location-icon", 4, "ngIf"], ["cIcon", "", "name", "cil-link", "class", "location-icon", 4, "ngIf"], [1, "location-text"], ["cIcon", "", "name", "cil-external-link", "size", "sm", 1, "external-link-icon"], ["cIcon", "", "name", "cib-git", 1, "location-icon"], ["cIcon", "", "name", "cil-link", 1, "location-icon"], [1, "location-text-no-link"], [1, "repo-url", "mt-1"], [1, "text-muted"], [1, "empty-state"], ["cIcon", "", "name", "cil-check-circle", "width", "48", "height", "48"], ["cButton", "", "color", "primary", 3, "click"]], template: function TeamVulnerabilitiesTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-card", 1)(1, "c-card-header", 2)(2, "div", 3)(3, "div", 4)(4, "div", 5)(5, "label", 6);
        \u0275\u0275text(6, "Branch");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "select", 7);
        \u0275\u0275listener("change", function TeamVulnerabilitiesTableComponent_Template_select_change_7_listener($event) {
          return ctx.onBranchSelect($event);
        });
        \u0275\u0275elementStart(8, "option", 8);
        \u0275\u0275text(9);
        \u0275\u0275elementEnd();
        \u0275\u0275template(10, TeamVulnerabilitiesTableComponent_option_10_Template, 2, 2, "option", 9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "div", 10)(12, "div", 11)(13, "c-form-check", 12)(14, "input", 13);
        \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilitiesTableComponent_Template_input_ngModelChange_14_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.showRemoved, $event) || (ctx.showRemoved = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function TeamVulnerabilitiesTableComponent_Template_input_ngModelChange_14_listener($event) {
          return ctx.toggleShowRemoved($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "label", 14);
        \u0275\u0275text(16, "Show Removed");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(17, "c-form-check", 12)(18, "input", 15);
        \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilitiesTableComponent_Template_input_ngModelChange_18_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.showSuppressed, $event) || (ctx.showSuppressed = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function TeamVulnerabilitiesTableComponent_Template_input_ngModelChange_18_listener($event) {
          return ctx.toggleShowSuppressed($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "label", 16);
        \u0275\u0275text(20, "Show Suppressed");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(21, "c-form-check", 17)(22, "input", 18);
        \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilitiesTableComponent_Template_input_ngModelChange_22_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.showUrgent, $event) || (ctx.showUrgent = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function TeamVulnerabilitiesTableComponent_Template_input_ngModelChange_22_listener($event) {
          return ctx.toggleShowUrgent($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "label", 19);
        \u0275\u0275text(24, "Urgent Only");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(25, "c-form-check", 17)(26, "input", 20);
        \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilitiesTableComponent_Template_input_ngModelChange_26_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.showNotable, $event) || (ctx.showNotable = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function TeamVulnerabilitiesTableComponent_Template_input_ngModelChange_26_listener($event) {
          return ctx.toggleShowNotable($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "label", 21);
        \u0275\u0275text(28, "Notable Only");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(29, "div", 22)(30, "button", 23);
        \u0275\u0275listener("click", function TeamVulnerabilitiesTableComponent_Template_button_click_30_listener() {
          return ctx.exportToExcel("filtered");
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(31, "svg", 24);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(32, "button", 25);
        \u0275\u0275listener("click", function TeamVulnerabilitiesTableComponent_Template_button_click_32_listener() {
          return ctx.toggleBulkAction();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(33, "svg", 26);
        \u0275\u0275text(34);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(35, "div", 27)(36, "label", 28);
        \u0275\u0275text(37, "Page Size");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(38, "select", 29);
        \u0275\u0275twoWayListener("ngModelChange", function TeamVulnerabilitiesTableComponent_Template_select_ngModelChange_38_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.vulnerabilitiesLimit, $event) || (ctx.vulnerabilitiesLimit = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function TeamVulnerabilitiesTableComponent_Template_select_ngModelChange_38_listener($event) {
          return ctx.onLimitChange($event);
        });
        \u0275\u0275elementStart(39, "option", 8);
        \u0275\u0275text(40, "10");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(41, "option", 8);
        \u0275\u0275text(42, "20");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(43, "option", 8);
        \u0275\u0275text(44, "50");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(45, "option", 8);
        \u0275\u0275text(46, "100");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(47, "option", 8);
        \u0275\u0275text(48, "200");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275template(49, TeamVulnerabilitiesTableComponent_div_49_Template, 7, 4, "div", 30);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(50, "c-card-body", 31);
        \u0275\u0275template(51, TeamVulnerabilitiesTableComponent_div_51_Template, 4, 0, "div", 32)(52, TeamVulnerabilitiesTableComponent_div_52_Template, 18, 27, "div", 33);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(8);
        \u0275\u0275property("value", ctx.repoData == null ? null : ctx.repoData.defaultBranch == null ? null : ctx.repoData.defaultBranch.id);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.selectedBranch || "Default: " + ((ctx.repoData == null ? null : ctx.repoData.defaultBranch == null ? null : ctx.repoData.defaultBranch.name) || ""), " ");
        \u0275\u0275advance();
        \u0275\u0275property("ngForOf", ctx.repoData == null ? null : ctx.repoData.branches);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.showRemoved);
        \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(29, _c0))("disabled", ctx.statusFilter === "NEW" || ctx.statusFilter === "EXISTING");
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.showSuppressed);
        \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(30, _c0))("disabled", ctx.statusFilter === "NEW" || ctx.statusFilter === "EXISTING");
        \u0275\u0275advance(3);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(31, _c1, ctx.hasUrgentFindings && !ctx.showUrgent));
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.showUrgent);
        \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(33, _c0));
        \u0275\u0275advance(3);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(34, _c2, ctx.hasNotableFindings && !ctx.showNotable));
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.showNotable);
        \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(36, _c0));
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
      DatePipe,
      NgIf,
      NgForOf,
      NgClass,
      FormsModule,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      CheckboxControlValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgModel,
      TooltipDirective,
      FormCheckComponent,
      FormLabelDirective,
      FormSelectDirective
    ], styles: ['@charset "UTF-8";\n\n\n\n.vulnerability-table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.vulnerability-table[_ngcontent-%COMP%]   .table-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n.vulnerability-table[_ngcontent-%COMP%]   .table-actions[_ngcontent-%COMP%]   .form-switch[_ngcontent-%COMP%] {\n  min-height: auto;\n  margin-bottom: 0;\n}\n.vulnerability-table[_ngcontent-%COMP%]   .table-actions[_ngcontent-%COMP%]   .ms-auto[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n@media (max-width: 768px) {\n  .vulnerability-table[_ngcontent-%COMP%]   .table-actions[_ngcontent-%COMP%]   .ms-auto[_ngcontent-%COMP%] {\n    margin-left: 0;\n    margin-top: 0.5rem;\n    width: 100%;\n  }\n}\n.vulnerability-table[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: var(--cui-border-radius);\n}\n.vulnerability-table[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n}\n.vulnerability-table[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body .datatable-body-cell {\n  display: flex;\n  align-items: center;\n  padding: 0.75rem;\n}\n.status-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  height: 100%;\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  gap: 0.35rem;\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge[_ngcontent-%COMP%]   .status-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge.status-new[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-danger-rgb), 0.15);\n  color: var(--cui-danger);\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge.status-existing[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-warning-rgb), 0.15);\n  color: var(--cui-warning);\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge.status-removed[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-success-rgb), 0.15);\n  color: var(--cui-success);\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge.status-supressed[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-secondary-rgb), 0.15);\n  color: var(--cui-secondary);\n}\n.severity-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n.severity-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.75rem;\n  border-radius: 30px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  display: inline-block;\n  line-height: 1;\n  white-space: nowrap;\n}\n.severity-critical[_ngcontent-%COMP%] {\n  background-color: rgba(220, 53, 69, 0.15);\n  color: #dc3545;\n}\n.severity-high[_ngcontent-%COMP%] {\n  background-color: rgba(244, 67, 54, 0.15);\n  color: #f44336;\n}\n.severity-medium[_ngcontent-%COMP%] {\n  background-color: rgba(255, 152, 0, 0.15);\n  color: #ff9800;\n}\n.severity-low[_ngcontent-%COMP%] {\n  background-color: rgba(33, 150, 243, 0.15);\n  color: #2196f3;\n}\n.severity-info[_ngcontent-%COMP%] {\n  background-color: rgba(0, 188, 212, 0.15);\n  color: #00bcd4;\n}\n.vuln-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  text-align: left;\n  padding: 0.5rem 0;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-name[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--cui-body-color);\n  margin-bottom: 0.5rem;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%] {\n  width: 100%;\n  font-size: 0.75rem;\n  color: var(--cui-secondary-color);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  gap: 1rem;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%]   .meta-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  opacity: 0.7;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-new[_ngcontent-%COMP%] {\n  color: var(--cui-danger);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-existing[_ngcontent-%COMP%] {\n  color: var(--cui-warning);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-removed[_ngcontent-%COMP%] {\n  color: var(--cui-success);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-supressed[_ngcontent-%COMP%] {\n  color: var(--cui-secondary);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.date-info[_ngcontent-%COMP%]   .date-label[_ngcontent-%COMP%] {\n  opacity: 0.7;\n  font-weight: 500;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.date-info[_ngcontent-%COMP%]   .date-value[_ngcontent-%COMP%] {\n  font-weight: 400;\n}\n.location-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  height: 100%;\n}\n.location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.35rem;\n  color: var(--cui-primary);\n  text-decoration: none;\n  font-size: 0.875rem;\n  transition: color 0.2s;\n  text-align: left;\n}\n.location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]:hover {\n  color: var(--cui-primary-hover);\n  text-decoration: underline;\n}\n.location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]   .location-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  flex-shrink: 0;\n}\n.location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]   .location-text[_ngcontent-%COMP%] {\n  white-space: normal;\n  word-break: break-word;\n}\n.location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]   .external-link-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  flex-shrink: 0;\n  opacity: 0.7;\n}\n.dates-cell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  padding: 0.25rem 0;\n}\n.dates-cell[_ngcontent-%COMP%]   .date-item[_ngcontent-%COMP%] {\n  display: flex;\n  font-size: 0.75rem;\n}\n.dates-cell[_ngcontent-%COMP%]   .date-item[_ngcontent-%COMP%]   .date-label[_ngcontent-%COMP%] {\n  width: 65px;\n  font-weight: 600;\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.dates-cell[_ngcontent-%COMP%]   .date-item[_ngcontent-%COMP%]   .date-value[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n}\n@media (max-width: 768px) {\n  .vuln-table-header[_ngcontent-%COMP%]   .primary-controls[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 1rem;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .branch-select[_ngcontent-%COMP%], \n   .vuln-table-header[_ngcontent-%COMP%]   .toggle-controls[_ngcontent-%COMP%], \n   .vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 100%;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .toggle-group[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%]   .page-size-control[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n.source-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  letter-spacing: 0.3px;\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-sast[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-primary-rgb), 0.15);\n  color: var(--cui-primary);\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-iac[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-info-rgb), 0.15);\n  color: var(--cui-info);\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-secrets[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-danger-rgb), 0.15);\n  color: var(--cui-danger);\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-sca[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-warning-rgb), 0.15);\n  color: var(--cui-warning);\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-gitlab_scanner[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-success-rgb), 0.15);\n  color: var(--cui-success);\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-cloud_scanner[_ngcontent-%COMP%] {\n  background-color: rgba(199, 225, 222, 0.71);\n  color: rgba(0, 89, 89, 0.78);\n}\n.location-display[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  word-break: break-all;\n  max-width: 100%;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n[_nghost-%COMP%]     .ngx-datatable {\n  box-shadow: none !important;\n  border: 1px solid var(--cui-border-color);\n  border-radius: var(--cui-border-radius);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header {\n  background-color: var(--cui-card-cap-bg);\n  border-bottom: 1px solid var(--cui-border-color);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header .datatable-header-cell {\n  font-weight: 600;\n  padding: 0.75rem;\n  vertical-align: middle;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body .datatable-body-row {\n  border-top: none;\n  border-bottom: 1px solid var(--cui-border-color);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body .datatable-body-row:hover {\n  background-color: var(--cui-body-bg);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body .datatable-body-cell {\n  padding: 0.75rem;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-footer {\n  background-color: var(--cui-card-cap-bg);\n  border-top: 1px solid var(--cui-border-color);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-footer .datatable-pager li {\n  margin: 0 0.2rem;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-footer .datatable-pager li a {\n  border-radius: var(--cui-border-radius);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-footer .datatable-pager li a:hover {\n  background-color: var(--cui-primary-rgb);\n  color: white;\n}\n[_nghost-%COMP%]     .filter-input {\n  height: 38px;\n  width: 100%;\n}\n[_nghost-%COMP%]     .filter-select {\n  height: 38px;\n  width: 100%;\n}\n.custom-checkbox[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n.custom-checkbox[_ngcontent-%COMP%]   input[disabled][_ngcontent-%COMP%] {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 2rem;\n  text-align: center;\n}\n.empty-state[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  margin-bottom: 1rem;\n  color: var(--cui-secondary);\n}\n.empty-state[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n  font-weight: 600;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n  opacity: 0.8;\n  max-width: 400px;\n  margin: 0 auto;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.75rem;\n  border-radius: 30px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  display: inline-block;\n  line-height: 1;\n  white-space: nowrap;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-critical[_ngcontent-%COMP%] {\n  background-color: rgba(220, 53, 69, 0.15);\n  color: #dc3545;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-high[_ngcontent-%COMP%] {\n  background-color: rgba(244, 67, 54, 0.15);\n  color: #f44336;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-medium[_ngcontent-%COMP%] {\n  background-color: rgba(255, 152, 0, 0.15);\n  color: #ff9800;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-low[_ngcontent-%COMP%] {\n  background-color: rgba(33, 150, 243, 0.15);\n  color: #2196f3;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-info[_ngcontent-%COMP%] {\n  background-color: rgba(0, 188, 212, 0.15);\n  color: #00bcd4;\n}\n.urgency-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  padding: 0.25em 0.6em;\n  font-size: 0.8em;\n  font-weight: 700;\n  line-height: 1;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: 0.375rem;\n}\n.urgency-badge[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  margin-right: 0.3rem;\n}\n.urgency-badge.urgent[_ngcontent-%COMP%] {\n  color: #fff;\n  background-color: #e55353;\n}\n.urgency-badge.notable[_ngcontent-%COMP%] {\n  color: #fff;\n  background-color: #f9b115;\n}\n@keyframes _ngcontent-%COMP%_pulse-warning {\n  0% {\n    box-shadow: 0 0 0 0 rgba(249, 177, 21, 0.7);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(249, 177, 21, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(249, 177, 21, 0);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse-danger {\n  0% {\n    box-shadow: 0 0 0 0 rgba(229, 83, 83, 0.7);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(229, 83, 83, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(229, 83, 83, 0);\n  }\n}\n[_nghost-%COMP%]     .form-check.pulse-notable .form-check-label {\n  animation: _ngcontent-%COMP%_pulse-warning 2s infinite;\n  border-radius: 5px;\n}\n[_nghost-%COMP%]     .form-check.pulse-urgent .form-check-label {\n  animation: _ngcontent-%COMP%_pulse-danger 2s infinite;\n  border-radius: 5px;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%]   .location-text-no-link[_ngcontent-%COMP%] {\n  display: inline-block;\n  white-space: normal;\n  word-break: break-word;\n  line-height: 1.25;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%]   .repo-url[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 2px;\n  line-height: 1.2;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body-cell-label {\n  display: block !important;\n  white-space: normal !important;\n  word-break: break-word;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header.header-centered[_ngcontent-%COMP%] {\n  align-items: center;\n  text-align: center;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .filter-container[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .multi-filter-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  width: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%] {\n  position: relative;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]   .form-control.form-control-sm[_ngcontent-%COMP%] {\n  height: 30px;\n  line-height: 30px;\n  padding-right: 2rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]   .search-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.5rem;\n  top: 50%;\n  transform: translateY(-50%);\n  pointer-events: none;\n  width: 1rem;\n  height: 1rem;\n  opacity: 0.7;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .form-select.form-select-sm[_ngcontent-%COMP%] {\n  height: 30px;\n  padding-top: 2px;\n  padding-bottom: 2px;\n  line-height: 26px;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell, \n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .datatable-header-cell-template-wrap {\n  white-space: nowrap;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .datatable-header-cell-template-wrap > * {\n  width: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::placeholder {\n  opacity: 0.7;\n}\n@media (max-width: 768px) {\n  .vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .filter-container[_ngcontent-%COMP%], \n   .vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .multi-filter-container[_ngcontent-%COMP%] {\n    gap: 0.2rem;\n  }\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell {\n  position: relative;\n  padding-right: 1.5rem;\n  vertical-align: top;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .sort-btn {\n  position: absolute !important;\n  right: 0.5rem;\n  top: 0.5rem;\n  margin: 0 !important;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .sort-btn .datatable-icon-up, \n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .sort-btn .datatable-icon-down, \n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .sort-btn .datatable-icon-sort {\n  width: 0.9rem;\n  height: 0.9rem;\n  line-height: 0.9rem;\n}\n.vulnerability-table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.vulnerability-table[_ngcontent-%COMP%]   .table-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n.vulnerability-table[_ngcontent-%COMP%]   .table-actions[_ngcontent-%COMP%]   .form-switch[_ngcontent-%COMP%] {\n  min-height: auto;\n  margin-bottom: 0;\n}\n.vulnerability-table[_ngcontent-%COMP%]   .table-actions[_ngcontent-%COMP%]   .ms-auto[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n@media (max-width: 768px) {\n  .vulnerability-table[_ngcontent-%COMP%]   .table-actions[_ngcontent-%COMP%]   .ms-auto[_ngcontent-%COMP%] {\n    margin-left: 0;\n    margin-top: 0.5rem;\n    width: 100%;\n  }\n}\n.vulnerability-table[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: var(--cui-border-radius);\n}\n.vulnerability-table[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n}\n.vulnerability-table[_ngcontent-%COMP%]   .action-btn[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body .datatable-body-cell {\n  display: flex;\n  align-items: center;\n  padding: 0.75rem;\n}\n.status-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  height: 100%;\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  gap: 0.35rem;\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge[_ngcontent-%COMP%]   .status-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge.status-new[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-danger-rgb), 0.15);\n  color: var(--cui-danger);\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge.status-existing[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-warning-rgb), 0.15);\n  color: var(--cui-warning);\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge.status-removed[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-success-rgb), 0.15);\n  color: var(--cui-success);\n}\n.status-cell[_ngcontent-%COMP%]   .status-badge.status-supressed[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-secondary-rgb), 0.15);\n  color: var(--cui-secondary);\n}\n.severity-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n.severity-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.75rem;\n  border-radius: 30px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  display: inline-block;\n  line-height: 1;\n  white-space: nowrap;\n}\n.severity-critical[_ngcontent-%COMP%] {\n  background-color: rgba(220, 53, 69, 0.15);\n  color: #dc3545;\n}\n.severity-high[_ngcontent-%COMP%] {\n  background-color: rgba(244, 67, 54, 0.15);\n  color: #f44336;\n}\n.severity-medium[_ngcontent-%COMP%] {\n  background-color: rgba(255, 152, 0, 0.15);\n  color: #ff9800;\n}\n.severity-low[_ngcontent-%COMP%] {\n  background-color: rgba(33, 150, 243, 0.15);\n  color: #2196f3;\n}\n.severity-info[_ngcontent-%COMP%] {\n  background-color: rgba(0, 188, 212, 0.15);\n  color: #00bcd4;\n}\n.vuln-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  text-align: left;\n  padding: 0.5rem 0;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-name[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--cui-body-color);\n  margin-bottom: 0.5rem;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%] {\n  width: 100%;\n  font-size: 0.75rem;\n  color: var(--cui-secondary-color);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  gap: 1rem;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%]   .meta-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  opacity: 0.7;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-new[_ngcontent-%COMP%] {\n  color: var(--cui-danger);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-existing[_ngcontent-%COMP%] {\n  color: var(--cui-warning);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-removed[_ngcontent-%COMP%] {\n  color: var(--cui-success);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.status-info[_ngcontent-%COMP%]   .status-text.status-supressed[_ngcontent-%COMP%] {\n  color: var(--cui-secondary);\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.date-info[_ngcontent-%COMP%]   .date-label[_ngcontent-%COMP%] {\n  opacity: 0.7;\n  font-weight: 500;\n}\n.vuln-info[_ngcontent-%COMP%]   .vuln-metadata[_ngcontent-%COMP%]   .meta-item.date-info[_ngcontent-%COMP%]   .date-value[_ngcontent-%COMP%] {\n  font-weight: 400;\n}\n.location-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  height: 100%;\n}\n.location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.35rem;\n  color: var(--cui-primary);\n  text-decoration: none;\n  font-size: 0.875rem;\n  transition: color 0.2s;\n  text-align: left;\n}\n.location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]:hover {\n  color: var(--cui-primary-hover);\n  text-decoration: underline;\n}\n.location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]   .location-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  flex-shrink: 0;\n}\n.location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]   .location-text[_ngcontent-%COMP%] {\n  white-space: normal;\n  word-break: break-word;\n}\n.location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%]   .external-link-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  flex-shrink: 0;\n  opacity: 0.7;\n}\n.dates-cell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  padding: 0.25rem 0;\n}\n.dates-cell[_ngcontent-%COMP%]   .date-item[_ngcontent-%COMP%] {\n  display: flex;\n  font-size: 0.75rem;\n}\n.dates-cell[_ngcontent-%COMP%]   .date-item[_ngcontent-%COMP%]   .date-label[_ngcontent-%COMP%] {\n  width: 65px;\n  font-weight: 600;\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.dates-cell[_ngcontent-%COMP%]   .date-item[_ngcontent-%COMP%]   .date-value[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n}\n@media (max-width: 768px) {\n  .vuln-table-header[_ngcontent-%COMP%]   .primary-controls[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 1rem;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .branch-select[_ngcontent-%COMP%], \n   .vuln-table-header[_ngcontent-%COMP%]   .toggle-controls[_ngcontent-%COMP%], \n   .vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 100%;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .toggle-group[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .vuln-table-header[_ngcontent-%COMP%]   .action-controls[_ngcontent-%COMP%]   .page-size-control[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n.source-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  letter-spacing: 0.3px;\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-sast[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-primary-rgb), 0.15);\n  color: var(--cui-primary);\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-iac[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-info-rgb), 0.15);\n  color: var(--cui-info);\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-secrets[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-danger-rgb), 0.15);\n  color: var(--cui-danger);\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-sca[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-warning-rgb), 0.15);\n  color: var(--cui-warning);\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-gitlab_scanner[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-success-rgb), 0.15);\n  color: var(--cui-success);\n}\n.source-cell[_ngcontent-%COMP%]   .source-badge.source-cloud_scanner[_ngcontent-%COMP%] {\n  background-color: rgba(199, 225, 222, 0.71);\n  color: rgba(0, 89, 89, 0.78);\n}\n.location-display[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  word-break: break-all;\n  max-width: 100%;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n[_nghost-%COMP%]     .ngx-datatable {\n  box-shadow: none !important;\n  border: 1px solid var(--cui-border-color);\n  border-radius: var(--cui-border-radius);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header {\n  background-color: var(--cui-card-cap-bg);\n  border-bottom: 1px solid var(--cui-border-color);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header .datatable-header-cell {\n  font-weight: 600;\n  padding: 0.75rem;\n  vertical-align: middle;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body .datatable-body-row {\n  border-top: none;\n  border-bottom: 1px solid var(--cui-border-color);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body .datatable-body-row:hover {\n  background-color: var(--cui-body-bg);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body .datatable-body-cell {\n  padding: 0.75rem;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-footer {\n  background-color: var(--cui-card-cap-bg);\n  border-top: 1px solid var(--cui-border-color);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-footer .datatable-pager li {\n  margin: 0 0.2rem;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-footer .datatable-pager li a {\n  border-radius: var(--cui-border-radius);\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-footer .datatable-pager li a:hover {\n  background-color: var(--cui-primary-rgb);\n  color: white;\n}\n[_nghost-%COMP%]     .filter-input {\n  height: 38px;\n  width: 100%;\n}\n[_nghost-%COMP%]     .filter-select {\n  height: 38px;\n  width: 100%;\n}\n.custom-checkbox[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n.custom-checkbox[_ngcontent-%COMP%]   input[disabled][_ngcontent-%COMP%] {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 2rem;\n  text-align: center;\n}\n.empty-state[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  margin-bottom: 1rem;\n  color: var(--cui-secondary);\n}\n.empty-state[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n  font-weight: 600;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n  opacity: 0.8;\n  max-width: 400px;\n  margin: 0 auto;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.75rem;\n  border-radius: 30px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  display: inline-block;\n  line-height: 1;\n  white-space: nowrap;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-critical[_ngcontent-%COMP%] {\n  background-color: rgba(220, 53, 69, 0.15);\n  color: #dc3545;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-high[_ngcontent-%COMP%] {\n  background-color: rgba(244, 67, 54, 0.15);\n  color: #f44336;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-medium[_ngcontent-%COMP%] {\n  background-color: rgba(255, 152, 0, 0.15);\n  color: #ff9800;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-low[_ngcontent-%COMP%] {\n  background-color: rgba(33, 150, 243, 0.15);\n  color: #2196f3;\n}\n.empty-state[_ngcontent-%COMP%]   .severity-cell[_ngcontent-%COMP%]   .severity-badge.severity-info[_ngcontent-%COMP%] {\n  background-color: rgba(0, 188, 212, 0.15);\n  color: #00bcd4;\n}\n.urgency-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  padding: 0.25em 0.6em;\n  font-size: 0.8em;\n  font-weight: 700;\n  line-height: 1;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: 0.375rem;\n}\n.urgency-badge[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  margin-right: 0.3rem;\n}\n.urgency-badge.urgent[_ngcontent-%COMP%] {\n  color: #fff;\n  background-color: #e55353;\n}\n.urgency-badge.notable[_ngcontent-%COMP%] {\n  color: #fff;\n  background-color: #f9b115;\n}\n@keyframes _ngcontent-%COMP%_pulse-warning {\n  0% {\n    box-shadow: 0 0 0 0 rgba(249, 177, 21, 0.7);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(249, 177, 21, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(249, 177, 21, 0);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse-danger {\n  0% {\n    box-shadow: 0 0 0 0 rgba(229, 83, 83, 0.7);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(229, 83, 83, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(229, 83, 83, 0);\n  }\n}\n[_nghost-%COMP%]     .form-check.pulse-notable .form-check-label {\n  animation: _ngcontent-%COMP%_pulse-warning 2s infinite;\n  border-radius: 5px;\n}\n[_nghost-%COMP%]     .form-check.pulse-urgent .form-check-label {\n  animation: _ngcontent-%COMP%_pulse-danger 2s infinite;\n  border-radius: 5px;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%]   .location-link[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%]   .location-text-no-link[_ngcontent-%COMP%] {\n  display: inline-block;\n  white-space: normal;\n  word-break: break-word;\n  line-height: 1.25;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .location-cell[_ngcontent-%COMP%]   .repo-url[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 2px;\n  line-height: 1.2;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-body-cell-label {\n  display: block !important;\n  white-space: normal !important;\n  word-break: break-word;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header.header-centered[_ngcontent-%COMP%] {\n  align-items: center;\n  text-align: center;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .filter-container[_ngcontent-%COMP%], \n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .multi-filter-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n  width: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%] {\n  position: relative;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]   .form-control.form-control-sm[_ngcontent-%COMP%] {\n  height: 30px;\n  line-height: 30px;\n  padding-right: 2rem;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]   .search-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.5rem;\n  top: 50%;\n  transform: translateY(-50%);\n  pointer-events: none;\n  width: 1rem;\n  height: 1rem;\n  opacity: 0.7;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .form-select.form-select-sm[_ngcontent-%COMP%] {\n  height: 30px;\n  padding-top: 2px;\n  padding-bottom: 2px;\n  line-height: 26px;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell, \n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .datatable-header-cell-template-wrap {\n  white-space: nowrap;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .datatable-header-cell-template-wrap > * {\n  width: 100%;\n}\n.vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::placeholder {\n  opacity: 0.7;\n}\n@media (max-width: 768px) {\n  .vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .filter-container[_ngcontent-%COMP%], \n   .vuln-datatable[_ngcontent-%COMP%]   .column-header[_ngcontent-%COMP%]   .multi-filter-container[_ngcontent-%COMP%] {\n    gap: 0.2rem;\n  }\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell {\n  position: relative;\n  padding-right: 1.5rem;\n  vertical-align: top;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .sort-btn {\n  position: absolute !important;\n  right: 0.5rem;\n  top: 0.5rem;\n  margin: 0 !important;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .sort-btn .datatable-icon-up, \n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .sort-btn .datatable-icon-down, \n[_nghost-%COMP%]     .ngx-datatable .datatable-header-cell .sort-btn .datatable-icon-sort {\n  width: 0.9rem;\n  height: 0.9rem;\n  line-height: 0.9rem;\n}\n/*# sourceMappingURL=team-vulnerabilities-table.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeamVulnerabilitiesTableComponent, { className: "TeamVulnerabilitiesTableComponent" });
})();

export {
  TeamVulnerabilitiesTableComponent
};
//# sourceMappingURL=chunk-BSKMGQ6C.js.map
