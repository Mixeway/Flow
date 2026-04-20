import {
  ColComponent,
  IconDirective,
  NgIf,
  RowComponent,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZG2BHLTP.js";

// src/app/views/show-repo/vulnerability-summary/vulnerability-summary.component.ts
function VulnerabilitySummaryComponent_div_9_span_2_Template(rf, ctx) {
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
function VulnerabilitySummaryComponent_div_9_span_3_Template(rf, ctx) {
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
function VulnerabilitySummaryComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275text(1, " Including ");
    \u0275\u0275template(2, VulnerabilitySummaryComponent_div_9_span_2_Template, 2, 1, "span", 31)(3, VulnerabilitySummaryComponent_div_9_span_3_Template, 2, 1, "span", 32);
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
function VulnerabilitySummaryComponent_c_row_71_c_col_1_Template(rf, ctx) {
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
function VulnerabilitySummaryComponent_c_row_71_c_col_2_Template(rf, ctx) {
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
function VulnerabilitySummaryComponent_c_row_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-row", 35);
    \u0275\u0275template(1, VulnerabilitySummaryComponent_c_row_71_c_col_1_Template, 11, 5, "c-col", 36)(2, VulnerabilitySummaryComponent_c_row_71_c_col_2_Template, 11, 5, "c-col", 36);
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
var VulnerabilitySummaryComponent = class _VulnerabilitySummaryComponent {
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
  /**
   * Calculate the total number of vulnerabilities
   */
  getTotalCount() {
    return (this.counts?.critical || 0) + (this.counts?.high || 0) + (this.counts?.rest || 0);
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
    this.\u0275fac = function VulnerabilitySummaryComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _VulnerabilitySummaryComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VulnerabilitySummaryComponent, selectors: [["app-vulnerability-summary"]], inputs: { counts: "counts", icons: "icons" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 72, vars: 27, consts: [[1, "vulnerability-dashboard"], [1, "dashboard-header", "mb-3"], [1, "dashboard-title"], [1, "total-vulnerabilities"], [1, "total-count"], [1, "total-label"], ["class", "total-breakdown", 4, "ngIf"], [1, "vulnerability-cards"], [1, "mb-3", 3, "lg", "md", "sm"], [1, "vuln-card", "critical-card"], [1, "vuln-card-header"], [1, "severity-badge", "critical"], [1, "vuln-count"], [1, "vuln-card-body"], [1, "vuln-icon"], ["width", "24", 3, "cIcon"], [1, "vuln-info"], [1, "vuln-percent"], [1, "vuln-bar-container"], [1, "vuln-bar", "critical-bar"], [1, "vuln-card-footer"], [1, "risk-level"], [1, "action-required"], [1, "vuln-card", "high-card"], [1, "severity-badge", "high"], [1, "vuln-bar", "high-bar"], [1, "vuln-card", "other-card"], [1, "severity-badge", "other"], [1, "vuln-bar", "other-bar"], ["class", "additional-metrics mt-2", 4, "ngIf"], [1, "total-breakdown"], ["class", "breakdown-badge urgent", 4, "ngIf"], ["class", "breakdown-badge notable", 4, "ngIf"], [1, "breakdown-badge", "urgent"], [1, "breakdown-badge", "notable"], [1, "additional-metrics", "mt-2"], ["class", "mb-3", 3, "lg", "md", "sm", 4, "ngIf"], [1, "metric-card", "autofix-card"], [1, "metric-icon"], ["width", "20", 3, "cIcon"], [1, "metric-content"], [1, "metric-title"], [1, "metric-value"], [1, "metric-description"], [1, "metric-card", "fixed-card"]], template: function VulnerabilitySummaryComponent_Template(rf, ctx) {
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
        \u0275\u0275template(9, VulnerabilitySummaryComponent_div_9_Template, 4, 2, "div", 6);
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
        \u0275\u0275template(71, VulnerabilitySummaryComponent_c_row_71_Template, 3, 2, "c-row", 29);
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
    ], styles: ["\n\n.vulnerability-dashboard[_ngcontent-%COMP%] {\n  padding: 0.5rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .dashboard-title[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 600;\n  margin: 0;\n  color: var(--cui-body-color);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-count[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-breakdown[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  margin-top: 0.25rem;\n  color: var(--cui-body-color);\n  opacity: 0.8;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-breakdown[_ngcontent-%COMP%]   .breakdown-badge[_ngcontent-%COMP%] {\n  padding: 0.2em 0.5em;\n  border-radius: 4px;\n  font-weight: 600;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-breakdown[_ngcontent-%COMP%]   .breakdown-badge.urgent[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-danger-rgb), 0.15);\n  color: var(--cui-danger);\n  border: 1px solid rgba(var(--cui-danger-rgb), 0.4);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%]   .total-breakdown[_ngcontent-%COMP%]   .breakdown-badge.notable[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-warning-rgb), 0.15);\n  color: var(--cui-warning);\n  border: 1px solid rgba(var(--cui-warning-rgb), 0.4);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%] {\n  border-radius: 10px;\n  overflow: hidden;\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);\n  background-color: var(--cui-card-bg);\n  border: 1px solid var(--cui-card-border-color);\n  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;\n  height: 100%;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card.critical-card[_ngcontent-%COMP%] {\n  border-top: 4px solid var(--cui-danger);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card.high-card[_ngcontent-%COMP%] {\n  border-top: 4px solid var(--cui-warning);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card.other-card[_ngcontent-%COMP%] {\n  border-top: 4px solid var(--cui-primary);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem;\n  border-bottom: 1px solid var(--cui-card-border-color);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.75rem;\n  border-radius: 30px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge.critical[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-danger-rgb), 0.15);\n  color: var(--cui-danger);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge.high[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-warning-rgb), 0.15);\n  color: var(--cui-warning);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .severity-badge.other[_ngcontent-%COMP%] {\n  background-color: rgba(var(--cui-primary-rgb), 0.15);\n  color: var(--cui-primary);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-header[_ngcontent-%COMP%]   .vuln-count[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--cui-body-color);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%] {\n  display: flex;\n  padding: 1.25rem 1rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  margin-right: 1rem;\n  background-color: var(--cui-tertiary-bg);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%] {\n  flex-grow: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-percent[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 600;\n  margin-bottom: 0.5rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%] {\n  height: 6px;\n  background-color: var(--cui-tertiary-bg);\n  border-radius: 3px;\n  overflow: hidden;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: 3px;\n  transition: width 0.8s ease-in-out;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar.critical-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-danger);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar.high-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-warning);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-body[_ngcontent-%COMP%]   .vuln-info[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%]   .vuln-bar.other-bar[_ngcontent-%COMP%] {\n  background-color: var(--cui-primary);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%] {\n  padding: 1rem;\n  border-top: 1px solid var(--cui-card-border-color);\n  background-color: var(--cui-tertiary-bg);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%]   .risk-level[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  font-weight: 600;\n  margin-bottom: 0.25rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .vulnerability-cards[_ngcontent-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%]   .action-required[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 1rem;\n  border-radius: 8px;\n  background-color: var(--cui-card-bg);\n  border: 1px solid var(--cui-card-border-color);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n  height: 100%;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  margin-right: 1rem;\n  background-color: var(--cui-tertiary-bg);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%] {\n  flex-grow: 1;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%]   .metric-title[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin-bottom: 0.25rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 700;\n  margin-bottom: 0.25rem;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-content[_ngcontent-%COMP%]   .metric-description[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  opacity: 0.7;\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card.autofix-card[_ngcontent-%COMP%] {\n  border-left: 3px solid var(--cui-success);\n}\n.vulnerability-dashboard[_ngcontent-%COMP%]   .additional-metrics[_ngcontent-%COMP%]   .metric-card.fixed-card[_ngcontent-%COMP%] {\n  border-left: 3px solid var(--cui-info);\n}\n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  background-color: var(--cui-card-bg);\n}\n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-card-footer[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.05);\n}\n[class*=dark-theme][_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .vuln-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%], \n[class*=dark-theme][_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%], [class*=dark-theme]   [_nghost-%COMP%]   .metric-card[_ngcontent-%COMP%]   .vuln-bar-container[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n@keyframes _ngcontent-%COMP%_barFill {\n  from {\n    width: 0;\n  }\n  to {\n    width: 100%;\n  }\n}\n.vuln-bar[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_barFill 1s ease-out forwards;\n}\n@media (max-width: 768px) {\n  .dashboard-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start !important;\n  }\n  .dashboard-header[_ngcontent-%COMP%]   .total-vulnerabilities[_ngcontent-%COMP%] {\n    align-items: flex-start;\n    margin-top: 0.5rem;\n  }\n}\n/*# sourceMappingURL=vulnerability-summary.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VulnerabilitySummaryComponent, { className: "VulnerabilitySummaryComponent" });
})();

export {
  VulnerabilitySummaryComponent
};
//# sourceMappingURL=chunk-YJUN7Y32.js.map
