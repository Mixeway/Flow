import {
  StatsService
} from "./chunk-UPCBRWXR.js";
import {
  ChartjsComponent
} from "./chunk-7DHYWULE.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-MENGJYBG.js";
import "./chunk-YLFWSDV3.js";
import {
  IconDirective,
  NgClass,
  NgForOf,
  NgIf,
  SpinnerComponent,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  forkJoin,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZG2BHLTP.js";
import "./chunk-4MWRP73S.js";

// src/app/views/security-dashboard/security-dashboard.component.ts
function SecurityDashboardComponent_option_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r1 = ctx.$implicit;
    \u0275\u0275property("value", team_r1.teamId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(team_r1.teamName);
  }
}
function SecurityDashboardComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275element(1, "c-spinner", 20);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Loading dashboard data...");
    \u0275\u0275elementEnd()();
  }
}
function SecurityDashboardComponent_div_28_c_chart_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-chart", 75);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("data", ctx_r1.vulnerabilityTrendChartData)("options", ctx_r1.lineChartOptions);
  }
}
function SecurityDashboardComponent_div_28_c_chart_75_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-chart", 76);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("data", ctx_r1.severityDistributionChartData)("options", ctx_r1.doughnutChartOptions);
  }
}
function SecurityDashboardComponent_div_28_c_chart_81_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-chart", 76);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("data", ctx_r1.sourceDistributionChartData)("options", ctx_r1.doughnutChartOptions);
  }
}
function SecurityDashboardComponent_div_28_c_chart_87_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-chart", 76);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("data", ctx_r1.statusDistributionChartData)("options", ctx_r1.doughnutChartOptions);
  }
}
function SecurityDashboardComponent_div_28_c_chart_94_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-chart", 75);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("data", ctx_r1.fixProgressChartData)("options", ctx_r1.lineChartOptions);
  }
}
function SecurityDashboardComponent_div_28_tr_117_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 77);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 78);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 60)(6, "span", 79);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 60)(9, "span", 80);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 81);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 82);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const repo_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r3.repoName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r3.teamName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(repo_r3.criticalCount);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(repo_r3.highCount);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r3.totalVulnerabilities);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", repo_r3.averageFixTime, "d");
  }
}
function SecurityDashboardComponent_div_28_tr_118_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 83);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 84);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "No vulnerability data available");
    \u0275\u0275elementEnd()()();
  }
}
function SecurityDashboardComponent_div_28_tr_141_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 85);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 60);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 60)(6, "span", 79);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 60)(9, "span", 80);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 81);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 60)(14, "span", 86);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const team_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(team_r4.teamName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(team_r4.repoCount);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(team_r4.criticalCount);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(team_r4.highCount);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(team_r4.totalVulnerabilities);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(team_r4.fixedVulnerabilities);
  }
}
function SecurityDashboardComponent_div_28_tr_142_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 83);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 84);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "No teams with vulnerability data");
    \u0275\u0275elementEnd()()();
  }
}
function SecurityDashboardComponent_div_28_tr_179_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 87);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 78);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 60);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 60);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 60);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 60);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 60);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 60);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 60)(18, "span", 79);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td", 60)(21, "span", 88);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "td", 81);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const repo_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r5.repoName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r5.teamName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r5.sast || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r5.sca || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r5.iac || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r5.secrets || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r5.dast || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r5.gitlab || 0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(repo_r5.urgent || 0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(repo_r5.notable || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repo_r5.total || 0);
  }
}
function SecurityDashboardComponent_div_28_tr_180_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 89);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 84);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "No repository findings data available");
    \u0275\u0275elementEnd()()();
  }
}
function SecurityDashboardComponent_div_28_div_184_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 92);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 60)(4, "span", 93);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 81);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("title", v_r6.vulnName);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r6.vulnName);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getSeverityClass(v_r6.severity));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r6.severity);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r6.count);
  }
}
function SecurityDashboardComponent_div_28_div_184_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "div", 48)(2, "h3");
    \u0275\u0275element(3, "span", 90);
    \u0275\u0275text(4, "SAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 49);
    \u0275\u0275text(6, "Top 20");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 58)(8, "table", 91)(9, "thead")(10, "tr")(11, "th");
    \u0275\u0275text(12, "Vulnerability");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 60);
    \u0275\u0275text(14, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 60);
    \u0275\u0275text(16, "Count");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275template(18, SecurityDashboardComponent_div_28_div_184_tr_18_Template, 8, 5, "tr", 62);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(18);
    \u0275\u0275property("ngForOf", ctx_r1.vulnsBySast);
  }
}
function SecurityDashboardComponent_div_28_div_185_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 92);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 60)(4, "span", 93);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 81);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("title", v_r7.vulnName);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r7.vulnName);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getSeverityClass(v_r7.severity));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r7.severity);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r7.count);
  }
}
function SecurityDashboardComponent_div_28_div_185_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "div", 48)(2, "h3");
    \u0275\u0275element(3, "span", 94);
    \u0275\u0275text(4, "SCA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 49);
    \u0275\u0275text(6, "Top 20");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 58)(8, "table", 91)(9, "thead")(10, "tr")(11, "th");
    \u0275\u0275text(12, "Vulnerability");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 60);
    \u0275\u0275text(14, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 60);
    \u0275\u0275text(16, "Count");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275template(18, SecurityDashboardComponent_div_28_div_185_tr_18_Template, 8, 5, "tr", 62);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(18);
    \u0275\u0275property("ngForOf", ctx_r1.vulnsBySca);
  }
}
function SecurityDashboardComponent_div_28_div_186_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 92);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 60)(4, "span", 93);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 81);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("title", v_r8.vulnName);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r8.vulnName);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getSeverityClass(v_r8.severity));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r8.severity);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r8.count);
  }
}
function SecurityDashboardComponent_div_28_div_186_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "div", 48)(2, "h3");
    \u0275\u0275element(3, "span", 95);
    \u0275\u0275text(4, "IaC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 49);
    \u0275\u0275text(6, "Top 20");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 58)(8, "table", 91)(9, "thead")(10, "tr")(11, "th");
    \u0275\u0275text(12, "Vulnerability");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 60);
    \u0275\u0275text(14, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 60);
    \u0275\u0275text(16, "Count");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275template(18, SecurityDashboardComponent_div_28_div_186_tr_18_Template, 8, 5, "tr", 62);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(18);
    \u0275\u0275property("ngForOf", ctx_r1.vulnsByIac);
  }
}
function SecurityDashboardComponent_div_28_div_187_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 92);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 60)(4, "span", 93);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 81);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("title", v_r9.vulnName);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r9.vulnName);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getSeverityClass(v_r9.severity));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r9.severity);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r9.count);
  }
}
function SecurityDashboardComponent_div_28_div_187_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "div", 48)(2, "h3");
    \u0275\u0275element(3, "span", 96);
    \u0275\u0275text(4, "Secrets");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 49);
    \u0275\u0275text(6, "Top 20");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 58)(8, "table", 91)(9, "thead")(10, "tr")(11, "th");
    \u0275\u0275text(12, "Vulnerability");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 60);
    \u0275\u0275text(14, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 60);
    \u0275\u0275text(16, "Count");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275template(18, SecurityDashboardComponent_div_28_div_187_tr_18_Template, 8, 5, "tr", 62);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(18);
    \u0275\u0275property("ngForOf", ctx_r1.vulnsBySecrets);
  }
}
function SecurityDashboardComponent_div_28_div_188_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 92);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 60)(4, "span", 93);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 81);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("title", v_r10.vulnName);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r10.vulnName);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getSeverityClass(v_r10.severity));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r10.severity);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r10.count);
  }
}
function SecurityDashboardComponent_div_28_div_188_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "div", 48)(2, "h3");
    \u0275\u0275element(3, "span", 97);
    \u0275\u0275text(4, "DAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 49);
    \u0275\u0275text(6, "Top 20");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 58)(8, "table", 91)(9, "thead")(10, "tr")(11, "th");
    \u0275\u0275text(12, "Vulnerability");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 60);
    \u0275\u0275text(14, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 60);
    \u0275\u0275text(16, "Count");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275template(18, SecurityDashboardComponent_div_28_div_188_tr_18_Template, 8, 5, "tr", 62);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(18);
    \u0275\u0275property("ngForOf", ctx_r1.vulnsByDast);
  }
}
function SecurityDashboardComponent_div_28_div_189_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 92);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 60)(4, "span", 93);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 81);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("title", v_r11.vulnName);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r11.vulnName);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getSeverityClass(v_r11.severity));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r11.severity);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r11.count);
  }
}
function SecurityDashboardComponent_div_28_div_189_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "div", 48)(2, "h3");
    \u0275\u0275element(3, "span", 98);
    \u0275\u0275text(4, "GitLab");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 49);
    \u0275\u0275text(6, "Top 20");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 58)(8, "table", 91)(9, "thead")(10, "tr")(11, "th");
    \u0275\u0275text(12, "Vulnerability");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 60);
    \u0275\u0275text(14, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 60);
    \u0275\u0275text(16, "Count");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275template(18, SecurityDashboardComponent_div_28_div_189_tr_18_Template, 8, 5, "tr", 62);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(18);
    \u0275\u0275property("ngForOf", ctx_r1.vulnsByGitlab);
  }
}
function SecurityDashboardComponent_div_28_div_190_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 99);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 100);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "No vulnerability data available for any source");
    \u0275\u0275elementEnd()();
  }
}
function SecurityDashboardComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "c-tabs", 22)(2, "c-tabs-list", 23)(3, "button", 24);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(4, "svg", 25);
    \u0275\u0275text(5, " Overview ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(6, "button", 24);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(7, "svg", 26);
    \u0275\u0275text(8, " Top Repositories ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(9, "button", 24);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(10, "svg", 27);
    \u0275\u0275text(11, " Top Vulnerabilities ");
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(12, "c-tabs-content")(13, "c-tab-panel", 28)(14, "div", 29)(15, "div", 30)(16, "div", 31)(17, "div", 32);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(18, "svg", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(19, "div", 34)(20, "span", 35);
    \u0275\u0275text(21, "Total Open Findings");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 36);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 37);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(25, "svg", 38);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(27, "div", 39)(28, "div", 32);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(29, "svg", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(30, "div", 34)(31, "span", 35);
    \u0275\u0275text(32, "Critical");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 36);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span", 37);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(36, "svg", 38);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(38, "div", 41)(39, "div", 32);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(40, "svg", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(41, "div", 34)(42, "span", 35);
    \u0275\u0275text(43, "Avg. Fix Time");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "span", 36);
    \u0275\u0275text(45);
    \u0275\u0275elementStart(46, "small");
    \u0275\u0275text(47, "d");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(48, "span", 43);
    \u0275\u0275text(49, "Based on resolved findings");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(50, "div", 44)(51, "div", 32);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(52, "svg", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(53, "div", 34)(54, "span", 35);
    \u0275\u0275text(55, "Repositories");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "span", 36);
    \u0275\u0275text(57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "span", 43);
    \u0275\u0275text(59, "Monitored for issues");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(60, "div", 46)(61, "div", 47)(62, "div", 48)(63, "h3");
    \u0275\u0275text(64, "Vulnerability Trend");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "span", 49);
    \u0275\u0275text(66);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(67, "div", 50);
    \u0275\u0275template(68, SecurityDashboardComponent_div_28_c_chart_68_Template, 1, 2, "c-chart", 51);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(69, "div", 52)(70, "div", 53)(71, "div", 48)(72, "h3");
    \u0275\u0275text(73, "By Severity");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(74, "div", 54);
    \u0275\u0275template(75, SecurityDashboardComponent_div_28_c_chart_75_Template, 1, 2, "c-chart", 55);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(76, "div", 53)(77, "div", 48)(78, "h3");
    \u0275\u0275text(79, "By Source");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(80, "div", 54);
    \u0275\u0275template(81, SecurityDashboardComponent_div_28_c_chart_81_Template, 1, 2, "c-chart", 55);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(82, "div", 53)(83, "div", 48)(84, "h3");
    \u0275\u0275text(85, "By Status");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(86, "div", 54);
    \u0275\u0275template(87, SecurityDashboardComponent_div_28_c_chart_87_Template, 1, 2, "c-chart", 55);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(88, "div", 46)(89, "div", 47)(90, "div", 48)(91, "h3");
    \u0275\u0275text(92, "Fix Progress");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(93, "div", 56);
    \u0275\u0275template(94, SecurityDashboardComponent_div_28_c_chart_94_Template, 1, 2, "c-chart", 51);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(95, "div", 57)(96, "div", 47)(97, "div", 48)(98, "h3");
    \u0275\u0275text(99, "Top Vulnerable Repositories");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(100, "div", 58)(101, "table", 59)(102, "thead")(103, "tr")(104, "th");
    \u0275\u0275text(105, "Repository");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(106, "th");
    \u0275\u0275text(107, "Team");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(108, "th", 60);
    \u0275\u0275text(109, "Critical");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "th", 60);
    \u0275\u0275text(111, "High");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(112, "th", 60);
    \u0275\u0275text(113, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(114, "th", 61);
    \u0275\u0275text(115, "Fix Time");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(116, "tbody");
    \u0275\u0275template(117, SecurityDashboardComponent_div_28_tr_117_Template, 15, 6, "tr", 62)(118, SecurityDashboardComponent_div_28_tr_118_Template, 5, 0, "tr", 63);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(119, "div", 57)(120, "div", 47)(121, "div", 48)(122, "h3");
    \u0275\u0275text(123, "Teams Overview");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(124, "div", 58)(125, "table", 59)(126, "thead")(127, "tr")(128, "th");
    \u0275\u0275text(129, "Team");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(130, "th", 60);
    \u0275\u0275text(131, "Repos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(132, "th", 60);
    \u0275\u0275text(133, "Critical");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(134, "th", 60);
    \u0275\u0275text(135, "High");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(136, "th", 60);
    \u0275\u0275text(137, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "th", 60);
    \u0275\u0275text(139, "Fixed");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(140, "tbody");
    \u0275\u0275template(141, SecurityDashboardComponent_div_28_tr_141_Template, 16, 6, "tr", 62)(142, SecurityDashboardComponent_div_28_tr_142_Template, 5, 0, "tr", 63);
    \u0275\u0275elementEnd()()()()()()();
    \u0275\u0275elementStart(143, "c-tab-panel", 28)(144, "div", 29)(145, "div", 57)(146, "div", 47)(147, "div", 48)(148, "h3");
    \u0275\u0275text(149, "Top 20 Repositories \u2014 Findings by Scanner");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(150, "span", 49);
    \u0275\u0275text(151, "Active findings (New + Existing)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(152, "div", 58)(153, "table", 64)(154, "thead")(155, "tr")(156, "th", 65);
    \u0275\u0275text(157, "Repository");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(158, "th");
    \u0275\u0275text(159, "Team");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(160, "th", 66);
    \u0275\u0275text(161, "SAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(162, "th", 67);
    \u0275\u0275text(163, "SCA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(164, "th", 68);
    \u0275\u0275text(165, "IaC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(166, "th", 69);
    \u0275\u0275text(167, "Secrets");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(168, "th", 70);
    \u0275\u0275text(169, "DAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(170, "th", 71);
    \u0275\u0275text(171, "GitLab");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(172, "th", 60);
    \u0275\u0275text(173, "Urgent");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(174, "th", 60);
    \u0275\u0275text(175, "Notable");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(176, "th", 60);
    \u0275\u0275text(177, "Total");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(178, "tbody");
    \u0275\u0275template(179, SecurityDashboardComponent_div_28_tr_179_Template, 25, 11, "tr", 62)(180, SecurityDashboardComponent_div_28_tr_180_Template, 5, 0, "tr", 63);
    \u0275\u0275elementEnd()()()()()()();
    \u0275\u0275elementStart(181, "c-tab-panel", 28)(182, "div", 29)(183, "div", 72);
    \u0275\u0275template(184, SecurityDashboardComponent_div_28_div_184_Template, 19, 1, "div", 73)(185, SecurityDashboardComponent_div_28_div_185_Template, 19, 1, "div", 73)(186, SecurityDashboardComponent_div_28_div_186_Template, 19, 1, "div", 73)(187, SecurityDashboardComponent_div_28_div_187_Template, 19, 1, "div", 73)(188, SecurityDashboardComponent_div_28_div_188_Template, 19, 1, "div", 73)(189, SecurityDashboardComponent_div_28_div_189_Template, 19, 1, "div", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275template(190, SecurityDashboardComponent_div_28_div_190_Template, 4, 0, "div", 74);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("activeItemKey", ctx_r1.activeTab);
    \u0275\u0275advance(2);
    \u0275\u0275property("itemKey", 0);
    \u0275\u0275advance(3);
    \u0275\u0275property("itemKey", 1);
    \u0275\u0275advance(3);
    \u0275\u0275property("itemKey", 2);
    \u0275\u0275advance(4);
    \u0275\u0275property("itemKey", 0);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.formatNumber(ctx_r1.summaryData.openTotal || 0));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.getTrendClass(ctx_r1.getSeverityTrend("critical")));
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.getTrendIcon(ctx_r1.getSeverityTrend("critical")));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getSeverityTrend("critical") === "up" ? "Increasing" : ctx_r1.getSeverityTrend("critical") === "down" ? "Decreasing" : "Stable", " ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.formatNumber(ctx_r1.summaryData.criticalTotal || 0));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.getTrendClass(ctx_r1.getSeverityTrend("critical")));
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.getTrendIcon(ctx_r1.getSeverityTrend("critical")));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getSeverityTrend("critical") === "up" ? "Increasing" : ctx_r1.getSeverityTrend("critical") === "down" ? "Decreasing" : "Stable", " ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.summaryData.averageFixTime || 0);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(ctx_r1.formatNumber(ctx_r1.summaryData.totalRepos || 0));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("Last ", ctx_r1.timeRange, " days");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.vulnerabilityTrendChartData);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", ctx_r1.severityDistributionChartData);
    \u0275\u0275advance(6);
    \u0275\u0275property("ngIf", ctx_r1.sourceDistributionChartData);
    \u0275\u0275advance(6);
    \u0275\u0275property("ngIf", ctx_r1.statusDistributionChartData);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", ctx_r1.fixProgressChartData);
    \u0275\u0275advance(23);
    \u0275\u0275property("ngForOf", ctx_r1.topRepos);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.topRepos.length === 0);
    \u0275\u0275advance(23);
    \u0275\u0275property("ngForOf", ctx_r1.teamsSummary);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.teamsSummary.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("itemKey", 1);
    \u0275\u0275advance(36);
    \u0275\u0275property("ngForOf", ctx_r1.topReposDetailed);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.topReposDetailed.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("itemKey", 2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.vulnsBySast.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.vulnsBySca.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.vulnsByIac.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.vulnsBySecrets.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.vulnsByDast.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.vulnsByGitlab.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.vulnsBySast.length === 0 && ctx_r1.vulnsBySca.length === 0 && ctx_r1.vulnsByIac.length === 0 && ctx_r1.vulnsBySecrets.length === 0 && ctx_r1.vulnsByDast.length === 0 && ctx_r1.vulnsByGitlab.length === 0);
  }
}
var SecurityDashboardComponent = class _SecurityDashboardComponent {
  constructor(statsService) {
    this.statsService = statsService;
    this.summaryData = {};
    this.trendData = [];
    this.topRepos = [];
    this.teamsSummary = [];
    this.availableTeams = [];
    this.topReposDetailed = [];
    this.vulnsBySast = [];
    this.vulnsBySca = [];
    this.vulnsByIac = [];
    this.vulnsBySecrets = [];
    this.vulnsByDast = [];
    this.vulnsByGitlab = [];
    this.activeTab = 0;
    this.vulnerabilityTrendChartData = null;
    this.severityDistributionChartData = null;
    this.sourceDistributionChartData = null;
    this.statusDistributionChartData = null;
    this.fixProgressChartData = null;
    this.isLoading = true;
    this.selectedTeamId = null;
    this.selectedTeamValue = "";
    this.timeRange = 30;
    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top"
          // Type as const to match expected literals
        },
        tooltip: {
          mode: "index",
          intersect: false
        }
      },
      scales: {
        x: {
          grid: {
            drawOnChartArea: false,
            display: false,
            // Hide x-axis grid lines
            drawBorder: false
            // Hide axis line
          },
          ticks: {
            padding: 10
            // Add padding to labels
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            // Hide axis line
            color: "rgba(0, 0, 0, 0.05)"
            // Very light grid lines
          },
          ticks: {
            padding: 10
            // Add padding to labels
          }
        }
      },
      elements: {
        line: {
          tension: 0.4
          // Makes the line smoother
        },
        point: {
          radius: 0,
          // Hide points for cleaner look
          hitRadius: 10
          // Area that responds to hover
        }
      }
    };
    this.doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right"
          // Type as const to match expected literals
        }
      },
      cutout: "70%"
    };
  }
  ngOnInit() {
    this.loadTeamsAndData();
  }
  loadTeamsAndData() {
    this.isLoading = true;
    this.statsService.getTeamsSummary().subscribe({
      next: (teams) => {
        this.availableTeams = teams;
        this.teamsSummary = teams;
        this.loadFilteredData();
      },
      error: () => {
        this.loadFilteredData();
      }
    });
  }
  clearChartData() {
    this.vulnerabilityTrendChartData = null;
    this.severityDistributionChartData = null;
    this.sourceDistributionChartData = null;
    this.statusDistributionChartData = null;
    this.fixProgressChartData = null;
  }
  loadFilteredData() {
    this.isLoading = true;
    this.clearChartData();
    forkJoin({
      summary: this.statsService.getVulnerabilitySummary(this.selectedTeamId),
      trend: this.statsService.getVulnerabilityTrend(this.selectedTeamId, this.timeRange),
      topRepos: this.statsService.getTopVulnerableRepos(this.selectedTeamId, 10),
      teamsSummary: this.statsService.getTeamsSummary(),
      topReposDetailed: this.statsService.getTopReposDetailed(this.selectedTeamId, 20),
      vulnsSast: this.statsService.getTopVulnerabilities(this.selectedTeamId, "SAST", 20),
      vulnsSca: this.statsService.getTopVulnerabilities(this.selectedTeamId, "SCA", 20),
      vulnsIac: this.statsService.getTopVulnerabilities(this.selectedTeamId, "IAC", 20),
      vulnsSecrets: this.statsService.getTopVulnerabilities(this.selectedTeamId, "SECRETS", 20),
      vulnsDast: this.statsService.getTopVulnerabilities(this.selectedTeamId, "DAST", 20),
      vulnsGitlab: this.statsService.getTopVulnerabilities(this.selectedTeamId, "GITLAB_SCANNER", 20)
    }).subscribe({
      next: (results) => {
        this.summaryData = results.summary;
        this.trendData = results.trend;
        this.topRepos = results.topRepos;
        this.teamsSummary = results.teamsSummary;
        this.topReposDetailed = results.topReposDetailed;
        this.vulnsBySast = results.vulnsSast;
        this.vulnsBySca = results.vulnsSca;
        this.vulnsByIac = results.vulnsIac;
        this.vulnsBySecrets = results.vulnsSecrets;
        this.vulnsByDast = results.vulnsDast;
        this.vulnsByGitlab = results.vulnsGitlab;
        this.prepareChartData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading dashboard data:", error);
        this.isLoading = false;
      }
    });
  }
  /**
   * Prepare all chart data based on the loaded API data
   */
  prepareChartData() {
    this.prepareVulnerabilityTrendChart();
    this.prepareSeverityDistributionChart();
    this.prepareSourceDistributionChart();
    this.prepareStatusDistributionChart();
    this.prepareFixProgressChart();
  }
  /**
   * Prepare data for the vulnerability trend chart
   */
  prepareVulnerabilityTrendChart() {
    this.trendData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const labels = this.trendData.map((item) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const criticalData = this.trendData.map((item) => (item.sastCritical || 0) + (item.scaCritical || 0) + (item.iacCritical || 0) + (item.secretsCritical || 0) + (item.dastCritical || 0) + (item.gitlabCritical || 0));
    const highData = this.trendData.map((item) => (item.sastHigh || 0) + (item.scaHigh || 0) + (item.iacHigh || 0) + (item.secretsHigh || 0) + (item.dastHigh || 0) + (item.gitlabHigh || 0));
    const mediumData = this.trendData.map((item) => (item.sastMedium || 0) + (item.scaMedium || 0) + (item.iacMedium || 0) + (item.secretsMedium || 0) + (item.dastMedium || 0) + (item.gitlabMedium || 0));
    const lowData = this.trendData.map((item) => (item.sastRest || 0) + (item.scaRest || 0) + (item.iacRest || 0) + (item.secretsRest || 0) + (item.dastRest || 0) + (item.gitlabRest || 0));
    this.vulnerabilityTrendChartData = {
      labels,
      datasets: [
        {
          label: "Critical",
          data: criticalData,
          fill: false,
          borderColor: "#dc3545",
          // Red
          backgroundColor: "#dc3545",
          borderWidth: 2
        },
        {
          label: "High",
          data: highData,
          fill: false,
          borderColor: "#fd7e14",
          // Orange
          backgroundColor: "#fd7e14",
          borderWidth: 2
        },
        {
          label: "Medium",
          data: mediumData,
          fill: false,
          borderColor: "#ffc107",
          // Yellow
          backgroundColor: "#ffc107",
          borderWidth: 2
        },
        {
          label: "Low",
          data: lowData,
          fill: false,
          borderColor: "#6c757d",
          // Gray
          backgroundColor: "#6c757d",
          borderWidth: 2
        }
      ]
    };
  }
  /**
   * Prepare data for the severity distribution chart
   */
  prepareSeverityDistributionChart() {
    const labels = ["Critical", "High", "Medium", "Low"];
    const data = [
      this.summaryData.criticalTotal || 0,
      this.summaryData.highTotal || 0,
      this.summaryData.mediumTotal || 0,
      this.summaryData.lowTotal || 0
    ];
    this.severityDistributionChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#dc3545",
            // Red for Critical
            "#fd7e14",
            // Orange for High
            "#ffc107",
            // Yellow for Medium
            "#6c757d"
            // Gray for Low
          ],
          hoverBackgroundColor: [
            "#c82333",
            // Darker red on hover
            "#e96b02",
            // Darker orange on hover
            "#e0a800",
            // Darker yellow on hover
            "#5a6268"
            // Darker gray on hover
          ]
        }
      ]
    };
  }
  /**
   * Prepare data for the source distribution chart
   */
  prepareSourceDistributionChart() {
    const labels = ["SAST", "SCA", "IaC", "Secrets", "DAST"];
    const data = [
      this.summaryData.sastTotal || 0,
      this.summaryData.scaTotal || 0,
      this.summaryData.iacTotal || 0,
      this.summaryData.secretsTotal || 0,
      this.summaryData.dastTotal || 0
    ];
    this.sourceDistributionChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#20c997",
            // Teal for SAST
            "#0dcaf0",
            // Cyan for SCA
            "#6610f2",
            // Purple for IaC
            "#d63384",
            // Pink for Secrets
            "#8B4513"
            // Brown for DAST
          ],
          hoverBackgroundColor: [
            "#1ba87e",
            // Darker teal on hover
            "#0bb2d4",
            // Darker cyan on hover
            "#570dcf",
            // Darker purple on hover
            "#b92c72",
            // Darker pink on hover
            "#6E3B0E"
            //Darker Brown on hover
          ]
        }
      ]
    };
  }
  /**
   * Prepare data for the status distribution chart
   */
  prepareStatusDistributionChart() {
    const labels = ["Open", "Removed", "Reviewed"];
    const data = [
      this.summaryData.openTotal || 0,
      this.summaryData.removedTotal || 0,
      this.summaryData.reviewedTotal || 0
    ];
    this.statusDistributionChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#0d6efd",
            // Blue for Open
            "#198754",
            // Green for Removed
            "#6c757d"
            // Gray for Reviewed
          ],
          hoverBackgroundColor: [
            "#0b5ed7",
            // Darker blue on hover
            "#157347",
            // Darker green on hover
            "#5a6268"
            // Darker gray on hover
          ]
        }
      ]
    };
  }
  /**
   * Prepare data for the fix progress chart
   */
  prepareFixProgressChart() {
    const fixProgressData = this.trendData.filter((item) => item.openFindings !== void 0 || item.removedFindings !== void 0);
    fixProgressData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const labels = fixProgressData.map((item) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const openData = fixProgressData.map((item) => item.openFindings || 0);
    const removedData = fixProgressData.map((item) => item.removedFindings || 0);
    const reviewedData = fixProgressData.map((item) => item.reviewedFindings || 0);
    this.fixProgressChartData = {
      labels,
      datasets: [
        {
          label: "Open Findings",
          data: openData,
          fill: false,
          borderColor: "#0d6efd",
          // Blue
          backgroundColor: "#0d6efd",
          borderWidth: 2
        },
        {
          label: "Removed Findings",
          data: removedData,
          fill: false,
          borderColor: "#198754",
          // Green
          backgroundColor: "#198754",
          borderWidth: 2
        },
        {
          label: "Reviewed Findings",
          data: reviewedData,
          fill: false,
          borderColor: "#6c757d",
          // Gray
          backgroundColor: "#6c757d",
          borderWidth: 2
        }
      ]
    };
  }
  refreshData() {
    this.loadFilteredData();
  }
  onTeamChange(value) {
    this.selectedTeamId = value === "" ? null : parseInt(value, 10);
    this.loadFilteredData();
  }
  onTimeRangeChange(days) {
    this.timeRange = days;
    this.loadFilteredData();
  }
  /**
   * Calculate the severity trend indicator (up/down/stable)
   */
  getSeverityTrend(severityType) {
    if (this.trendData.length < 2)
      return "stable";
    const latestDataPoint = this.trendData[this.trendData.length - 1];
    const previousDataPoint = this.trendData[this.trendData.length - 2];
    let latest = 0;
    let previous = 0;
    if (severityType === "critical") {
      latest = (latestDataPoint.sastCritical || 0) + (latestDataPoint.scaCritical || 0) + (latestDataPoint.iacCritical || 0) + (latestDataPoint.secretsCritical || 0) + (latestDataPoint.gitlabCritical || 0);
      previous = (previousDataPoint.sastCritical || 0) + (previousDataPoint.scaCritical || 0) + (previousDataPoint.iacCritical || 0) + (previousDataPoint.secretsCritical || 0) + (previousDataPoint.gitlabCritical || 0);
    } else if (severityType === "high") {
      latest = (latestDataPoint.sastHigh || 0) + (latestDataPoint.scaHigh || 0) + (latestDataPoint.iacHigh || 0) + (latestDataPoint.secretsHigh || 0) + (latestDataPoint.gitlabHigh || 0);
      previous = (previousDataPoint.sastHigh || 0) + (previousDataPoint.scaHigh || 0) + (previousDataPoint.iacHigh || 0) + (previousDataPoint.secretsHigh || 0) + (previousDataPoint.gitlabHigh || 0);
    }
    if (latest === previous)
      return "stable";
    return latest > previous ? "up" : "down";
  }
  /**
   * Get CSS class for trend indicator
   */
  getTrendClass(trend) {
    if (trend === "up")
      return "text-danger";
    if (trend === "down")
      return "text-success";
    return "";
  }
  /**
   * Get icon for trend indicator
   */
  getTrendIcon(trend) {
    if (trend === "up")
      return "cil-arrow-top";
    if (trend === "down")
      return "cil-arrow-bottom";
    return "cil-minus";
  }
  /**
   * Calculate the total vulnerabilities from trend data
   */
  calculateTotalFromTrend(type) {
    if (this.trendData.length === 0)
      return 0;
    const latestData = this.trendData[this.trendData.length - 1];
    if (type === "open")
      return latestData.openFindings || 0;
    if (type === "removed")
      return latestData.removedFindings || 0;
    if (type === "reviewed")
      return latestData.reviewedFindings || 0;
    return 0;
  }
  getSeverityClass(severity) {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return "pill-critical";
      case "HIGH":
        return "pill-high";
      case "MEDIUM":
        return "pill-medium";
      case "LOW":
        return "pill-low";
      default:
        return "pill-low";
    }
  }
  /**
   * Format a number for display with K/M suffixes
   */
  formatNumber(num) {
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M";
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "K";
    }
    return num.toString();
  }
  static {
    this.\u0275fac = function SecurityDashboardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SecurityDashboardComponent)(\u0275\u0275directiveInject(StatsService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SecurityDashboardComponent, selectors: [["app-security-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 29, vars: 10, consts: [[1, "dashboard-container"], [1, "dashboard-header"], [1, "title-section"], [1, "dashboard-title"], [1, "dashboard-subtitle"], [1, "filter-bar"], [1, "filter-group"], ["for", "teamSelect", 1, "filter-label"], ["id", "teamSelect", 1, "filter-select", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [1, "filter-label"], [1, "btn-group-toggle"], [1, "toggle-btn", 3, "click"], ["title", "Refresh data", 1, "refresh-btn", 3, "click"], ["cIcon", "", "name", "cil-sync"], ["class", "loading-state", 4, "ngIf"], ["class", "dashboard-content", 4, "ngIf"], [3, "value"], [1, "loading-state"], ["color", "primary"], [1, "dashboard-content"], [3, "activeItemKey"], ["variant", "underline-border", 1, "dashboard-tabs"], ["cTab", "", 1, "px-4", "py-3", 3, "itemKey"], ["cIcon", "", "name", "cil-chart-pie", 1, "me-2"], ["cIcon", "", "name", "cil-code", 1, "me-2"], ["cIcon", "", "name", "cil-bug", 1, "me-2"], [3, "itemKey"], [1, "tab-body"], [1, "kpi-grid"], [1, "kpi-card", "kpi-blue"], [1, "kpi-icon"], ["cIcon", "", "name", "cil-list", "size", "xl"], [1, "kpi-body"], [1, "kpi-label"], [1, "kpi-value"], [1, "kpi-trend", 3, "ngClass"], ["cIcon", "", "size", "sm", 3, "name"], [1, "kpi-card", "kpi-red"], ["cIcon", "", "name", "cil-warning", "size", "xl"], [1, "kpi-card", "kpi-purple"], ["cIcon", "", "name", "cil-clock", "size", "xl"], [1, "kpi-trend", "text-muted"], [1, "kpi-card", "kpi-teal"], ["cIcon", "", "name", "cil-storage", "size", "xl"], [1, "chart-section"], [1, "section-card", "full-width"], [1, "section-header"], [1, "section-badge"], [1, "chart-wrapper", 2, "height", "300px"], ["type", "line", "style", "max-height: 100%; width: 100%;", 3, "data", "options", 4, "ngIf"], [1, "distribution-grid"], [1, "section-card"], [1, "chart-wrapper", 2, "height", "240px"], ["type", "doughnut", 3, "data", "options", 4, "ngIf"], [1, "chart-wrapper", 2, "height", "260px"], [1, "table-section"], [1, "table-wrapper"], [1, "data-table"], [1, "text-center"], [1, "text-end"], [4, "ngFor", "ngForOf"], [4, "ngIf"], [1, "data-table", "detailed-table"], [1, "sticky-col"], [1, "text-center", "group-header", "group-sast"], [1, "text-center", "group-header", "group-sca"], [1, "text-center", "group-header", "group-iac"], [1, "text-center", "group-header", "group-secrets"], [1, "text-center", "group-header", "group-dast"], [1, "text-center", "group-header", "group-gitlab"], [1, "vuln-tables-grid"], ["class", "section-card", 4, "ngIf"], ["class", "empty-state-block", 4, "ngIf"], ["type", "line", 2, "max-height", "100%", "width", "100%", 3, "data", "options"], ["type", "doughnut", 3, "data", "options"], [1, "repo-name"], [1, "team-name"], [1, "pill", "pill-critical"], [1, "pill", "pill-high"], [1, "text-center", "fw-bold"], [1, "text-end", "text-muted"], ["colspan", "6", 1, "empty-state"], ["cIcon", "", "name", "cil-check-circle", "size", "lg"], [1, "team-name-primary"], [1, "pill", "pill-success"], [1, "repo-name", "sticky-col"], [1, "pill", "pill-medium"], ["colspan", "11", 1, "empty-state"], [1, "source-dot", "source-sast"], [1, "data-table", "vuln-source-table"], [1, "vuln-name", 3, "title"], [1, "pill", 3, "ngClass"], [1, "source-dot", "source-sca"], [1, "source-dot", "source-iac"], [1, "source-dot", "source-secrets"], [1, "source-dot", "source-dast"], [1, "source-dot", "source-gitlab"], [1, "empty-state-block"], ["cIcon", "", "name", "cil-check-circle", "size", "xl"]], template: function SecurityDashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
        \u0275\u0275text(4, "Security Dashboard");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 4);
        \u0275\u0275text(6, "Overview of security findings across your repositories");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 5)(8, "div", 6)(9, "label", 7);
        \u0275\u0275text(10, "Scope");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "select", 8);
        \u0275\u0275twoWayListener("ngModelChange", function SecurityDashboardComponent_Template_select_ngModelChange_11_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.selectedTeamValue, $event) || (ctx.selectedTeamValue = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function SecurityDashboardComponent_Template_select_ngModelChange_11_listener($event) {
          return ctx.onTeamChange($event);
        });
        \u0275\u0275elementStart(12, "option", 9);
        \u0275\u0275text(13, "All Teams");
        \u0275\u0275elementEnd();
        \u0275\u0275template(14, SecurityDashboardComponent_option_14_Template, 2, 2, "option", 10);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "div", 6)(16, "label", 11);
        \u0275\u0275text(17, "Time Range");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "div", 12)(19, "button", 13);
        \u0275\u0275listener("click", function SecurityDashboardComponent_Template_button_click_19_listener() {
          return ctx.onTimeRangeChange(7);
        });
        \u0275\u0275text(20, "7d");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "button", 13);
        \u0275\u0275listener("click", function SecurityDashboardComponent_Template_button_click_21_listener() {
          return ctx.onTimeRangeChange(30);
        });
        \u0275\u0275text(22, "30d");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "button", 13);
        \u0275\u0275listener("click", function SecurityDashboardComponent_Template_button_click_23_listener() {
          return ctx.onTimeRangeChange(90);
        });
        \u0275\u0275text(24, "90d");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(25, "button", 14);
        \u0275\u0275listener("click", function SecurityDashboardComponent_Template_button_click_25_listener() {
          return ctx.refreshData();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(26, "svg", 15);
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(27, SecurityDashboardComponent_div_27_Template, 4, 0, "div", 16)(28, SecurityDashboardComponent_div_28_Template, 191, 36, "div", 17);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(11);
        \u0275\u0275twoWayProperty("ngModel", ctx.selectedTeamValue);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngForOf", ctx.availableTeams);
        \u0275\u0275advance(5);
        \u0275\u0275classProp("active", ctx.timeRange === 7);
        \u0275\u0275advance(2);
        \u0275\u0275classProp("active", ctx.timeRange === 30);
        \u0275\u0275advance(2);
        \u0275\u0275classProp("active", ctx.timeRange === 90);
        \u0275\u0275advance(4);
        \u0275\u0275property("ngIf", ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading);
      }
    }, dependencies: [
      IconDirective,
      NgIf,
      NgForOf,
      NgClass,
      ChartjsComponent,
      SpinnerComponent,
      FormsModule,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      SelectControlValueAccessor,
      NgControlStatus,
      NgModel,
      TabsComponent,
      TabsListComponent,
      TabsContentComponent,
      TabPanelComponent,
      TabDirective
    ], styles: [`

.dashboard-container[_ngcontent-%COMP%] {
  padding: 1.5rem 2rem;
  max-width: 1440px;
  margin: 0 auto;
}
.dashboard-header[_ngcontent-%COMP%] {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--cui-border-color, #e5e7eb);
}
.title-section[_ngcontent-%COMP%]   .dashboard-title[_ngcontent-%COMP%] {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 0 0 0.25rem;
  color: var(--cui-body-color, #1f2937);
}
.title-section[_ngcontent-%COMP%]   .dashboard-subtitle[_ngcontent-%COMP%] {
  font-size: 0.875rem;
  color: var(--cui-secondary-color, #6b7280);
  margin: 0;
}
.filter-bar[_ngcontent-%COMP%] {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
}
.filter-group[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.filter-label[_ngcontent-%COMP%] {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cui-secondary-color, #6b7280);
}
.filter-select[_ngcontent-%COMP%] {
  appearance: none;
  background-color: var(--cui-body-bg, #fff);
  border: 1px solid var(--cui-border-color, #d1d5db);
  border-radius: 6px;
  padding: 0.45rem 2rem 0.45rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--cui-body-color, #1f2937);
  cursor: pointer;
  transition: border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  min-width: 160px;
}
.filter-select[_ngcontent-%COMP%]:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.filter-select[_ngcontent-%COMP%]   option[_ngcontent-%COMP%] {
  background-color: var(--cui-body-bg, #fff);
  color: var(--cui-body-color, #1f2937);
}
.btn-group-toggle[_ngcontent-%COMP%] {
  display: flex;
  border: 1px solid var(--cui-border-color, #d1d5db);
  border-radius: 6px;
  overflow: hidden;
}
.toggle-btn[_ngcontent-%COMP%] {
  background: var(--cui-body-bg, #fff);
  border: none;
  border-right: 1px solid var(--cui-border-color, #d1d5db);
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--cui-secondary-color, #6b7280);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.toggle-btn[_ngcontent-%COMP%]:last-child {
  border-right: none;
}
.toggle-btn[_ngcontent-%COMP%]:hover:not(.active) {
  background: var(--cui-tertiary-bg, #f3f4f6);
}
.toggle-btn.active[_ngcontent-%COMP%] {
  background: #3b82f6;
  color: #fff;
}
.refresh-btn[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--cui-border-color, #d1d5db);
  border-radius: 6px;
  background: var(--cui-body-bg, #fff);
  color: var(--cui-secondary-color, #6b7280);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.refresh-btn[_ngcontent-%COMP%]:hover {
  background: var(--cui-tertiary-bg, #f3f4f6);
  color: var(--cui-body-color, #1f2937);
}
.loading-state[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
}
.loading-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
  margin-top: 1rem;
  color: var(--cui-secondary-color, #6b7280);
  font-size: 0.875rem;
}
.kpi-grid[_ngcontent-%COMP%] {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}
.kpi-card[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: var(--cui-body-bg, #fff);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--cui-border-color, #e5e7eb);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.kpi-card[_ngcontent-%COMP%]::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 0 2px 2px 0;
}
.kpi-card[_ngcontent-%COMP%]:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.kpi-card.kpi-blue[_ngcontent-%COMP%]::before {
  background: #3b82f6;
}
.kpi-card.kpi-red[_ngcontent-%COMP%]::before {
  background: #ef4444;
}
.kpi-card.kpi-purple[_ngcontent-%COMP%]::before {
  background: #8b5cf6;
}
.kpi-card.kpi-teal[_ngcontent-%COMP%]::before {
  background: #14b8a6;
}
.kpi-icon[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 6px;
  flex-shrink: 0;
}
.kpi-blue[_ngcontent-%COMP%]   .kpi-icon[_ngcontent-%COMP%] {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}
.kpi-red[_ngcontent-%COMP%]   .kpi-icon[_ngcontent-%COMP%] {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}
.kpi-purple[_ngcontent-%COMP%]   .kpi-icon[_ngcontent-%COMP%] {
  background: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
}
.kpi-teal[_ngcontent-%COMP%]   .kpi-icon[_ngcontent-%COMP%] {
  background: rgba(20, 184, 166, 0.12);
  color: #14b8a6;
}
.kpi-body[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.kpi-label[_ngcontent-%COMP%] {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--cui-secondary-color, #6b7280);
}
.kpi-value[_ngcontent-%COMP%] {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--cui-body-color, #1f2937);
}
.kpi-value[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--cui-secondary-color, #6b7280);
  margin-left: 2px;
}
.kpi-trend[_ngcontent-%COMP%] {
  font-size: 0.7rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-top: 0.15rem;
}
.kpi-trend.text-danger[_ngcontent-%COMP%] {
  color: #ef4444 !important;
}
.kpi-trend.text-success[_ngcontent-%COMP%] {
  color: #22c55e !important;
}
.kpi-trend.text-muted[_ngcontent-%COMP%] {
  color: var(--cui-secondary-color, #6b7280) !important;
}
.section-card[_ngcontent-%COMP%] {
  background: var(--cui-body-bg, #fff);
  border: 1px solid var(--cui-border-color, #e5e7eb);
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.section-card[_ngcontent-%COMP%]:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.section-card.full-width[_ngcontent-%COMP%] {
  width: 100%;
}
.section-header[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--cui-border-color, #f3f4f6);
}
.section-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: var(--cui-body-color, #1f2937);
}
.section-badge[_ngcontent-%COMP%] {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: var(--cui-tertiary-bg, #f3f4f6);
  color: var(--cui-secondary-color, #6b7280);
}
.chart-wrapper[_ngcontent-%COMP%] {
  padding: 1rem 1.25rem;
  width: 100%;
  position: relative;
}
.chart-wrapper[_ngcontent-%COMP%]   c-chart[_ngcontent-%COMP%], 
.chart-wrapper[_ngcontent-%COMP%]   .c-chart[_ngcontent-%COMP%] {
  background: transparent !important;
}
.chart-section[_ngcontent-%COMP%] {
  margin-bottom: 1.5rem;
}
.distribution-grid[_ngcontent-%COMP%] {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}
.table-section[_ngcontent-%COMP%] {
  margin-bottom: 1.5rem;
}
.table-wrapper[_ngcontent-%COMP%] {
  overflow-x: auto;
}
.data-table[_ngcontent-%COMP%] {
  width: 100%;
  border-collapse: collapse;
}
.data-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cui-secondary-color, #6b7280);
  padding: 0.75rem 1rem;
  border-bottom: 2px solid var(--cui-border-color, #e5e7eb);
  white-space: nowrap;
}
.data-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.data-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {
  background-color: var(--cui-tertiary-bg, #f9fafb);
}
.data-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {
  padding: 0.7rem 1rem;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--cui-border-color, #f3f4f6);
  color: var(--cui-body-color, #374151);
}
.repo-name[_ngcontent-%COMP%] {
  font-weight: 600;
  color: var(--cui-body-color, #1f2937) !important;
}
.team-name[_ngcontent-%COMP%] {
  color: var(--cui-secondary-color, #6b7280) !important;
  font-size: 0.8rem !important;
}
.team-name-primary[_ngcontent-%COMP%] {
  font-weight: 600;
  color: var(--cui-body-color, #1f2937) !important;
}
.pill[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
}
.pill.pill-critical[_ngcontent-%COMP%] {
  background: #ef4444;
}
.pill.pill-high[_ngcontent-%COMP%] {
  background: #f97316;
}
.pill.pill-medium[_ngcontent-%COMP%] {
  background: #eab308;
  color: #1f2937;
}
.pill.pill-low[_ngcontent-%COMP%] {
  background: #6b7280;
}
.pill.pill-success[_ngcontent-%COMP%] {
  background: #22c55e;
}
.empty-state[_ngcontent-%COMP%] {
  text-align: center;
  padding: 2.5rem 1rem !important;
  color: var(--cui-secondary-color, #6b7280) !important;
}
.empty-state[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
  margin-bottom: 0.5rem;
  opacity: 0.5;
}
.empty-state[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
  display: block;
  font-size: 0.85rem;
}
.dashboard-tabs[_ngcontent-%COMP%] {
  margin-bottom: 0;
}
.tab-body[_ngcontent-%COMP%] {
  padding-top: 1.5rem;
}
.detailed-table[_ngcontent-%COMP%] {
  font-size: 0.8rem;
}
.detailed-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {
  font-size: 0.65rem;
  padding: 0.5rem 0.55rem;
  white-space: nowrap;
}
.detailed-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {
  padding: 0.5rem 0.55rem;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}
.detailed-table[_ngcontent-%COMP%]   .sticky-col[_ngcontent-%COMP%] {
  position: sticky;
  left: 0;
  z-index: 1;
  background: var(--cui-body-bg, #fff);
}
.group-header[_ngcontent-%COMP%] {
  border-bottom: 2px solid var(--cui-border-color, #e5e7eb);
  font-weight: 700;
  letter-spacing: 0.04em;
}
.group-header.group-sast[_ngcontent-%COMP%] {
  color: #20c997;
}
.group-header.group-sca[_ngcontent-%COMP%] {
  color: #0dcaf0;
}
.group-header.group-iac[_ngcontent-%COMP%] {
  color: #6610f2;
}
.group-header.group-secrets[_ngcontent-%COMP%] {
  color: #d63384;
}
.group-header.group-dast[_ngcontent-%COMP%] {
  color: #8B4513;
}
.group-header.group-gitlab[_ngcontent-%COMP%] {
  color: #fc6d26;
}
.sub-header[_ngcontent-%COMP%] {
  font-size: 0.6rem !important;
  font-weight: 600;
  color: var(--cui-secondary-color, #9da5b1);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.vuln-name[_ngcontent-%COMP%] {
  font-weight: 600;
  color: var(--cui-body-color, #1f2937) !important;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vuln-tables-grid[_ngcontent-%COMP%] {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}
.vuln-source-table[_ngcontent-%COMP%] {
  font-size: 0.8rem;
}
.vuln-source-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {
  font-size: 0.7rem;
}
.source-dot[_ngcontent-%COMP%] {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.4rem;
  vertical-align: middle;
}
.source-dot.source-sast[_ngcontent-%COMP%] {
  background: #20c997;
}
.source-dot.source-sca[_ngcontent-%COMP%] {
  background: #0dcaf0;
}
.source-dot.source-iac[_ngcontent-%COMP%] {
  background: #6610f2;
}
.source-dot.source-secrets[_ngcontent-%COMP%] {
  background: #d63384;
}
.source-dot.source-dast[_ngcontent-%COMP%] {
  background: #8B4513;
}
.source-dot.source-gitlab[_ngcontent-%COMP%] {
  background: #fc6d26;
}
.empty-state-block[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--cui-secondary-color, #6b7280);
}
.empty-state-block[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
  margin-bottom: 0.75rem;
  opacity: 0.5;
}
.empty-state-block[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
  font-size: 0.9rem;
}
.text-center[_ngcontent-%COMP%] {
  text-align: center;
}
.text-end[_ngcontent-%COMP%] {
  text-align: right;
}
.fw-bold[_ngcontent-%COMP%] {
  font-weight: 700;
}
.text-muted[_ngcontent-%COMP%] {
  color: var(--cui-secondary-color, #6b7280) !important;
}
@media (max-width: 1200px) {
  .kpi-grid[_ngcontent-%COMP%] {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 992px) {
  .distribution-grid[_ngcontent-%COMP%], 
   .vuln-tables-grid[_ngcontent-%COMP%] {
    grid-template-columns: 1fr;
  }
  .dashboard-container[_ngcontent-%COMP%] {
    padding: 1rem;
  }
}
@media (max-width: 768px) {
  .dashboard-header[_ngcontent-%COMP%] {
    flex-direction: column;
    align-items: flex-start;
  }
  .filter-bar[_ngcontent-%COMP%] {
    width: 100%;
    flex-wrap: wrap;
  }
  .kpi-grid[_ngcontent-%COMP%] {
    grid-template-columns: 1fr;
  }
  .filter-select[_ngcontent-%COMP%] {
    min-width: auto;
    width: 100%;
  }
  .filter-group[_ngcontent-%COMP%] {
    flex: 1;
    min-width: 120px;
  }
}
/*# sourceMappingURL=security-dashboard.component.css.map */`] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SecurityDashboardComponent, { className: "SecurityDashboardComponent" });
})();

// src/app/views/security-dashboard/routes.ts
var routes = [
  {
    path: "",
    component: SecurityDashboardComponent,
    data: {
      title: "Statistics"
    }
  }
];
export {
  routes
};
//# sourceMappingURL=routes-MLS5FEDK.js.map
