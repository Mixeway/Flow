import {
  AppConfigService
} from "./chunk-AG7WUCT3.js";
import {
  DashboardService
} from "./chunk-CHYMOFHW.js";
import {
  StatsService
} from "./chunk-UPCBRWXR.js";
import {
  TeamService
} from "./chunk-DKK4C6S4.js";
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DataTableColumnHeaderDirective,
  DatatableComponent,
  NgxDatatableModule,
  SelectionType
} from "./chunk-OFWBTEIP.js";
import {
  AuthService
} from "./chunk-YFWDZ3VL.js";
import {
  brand_exports,
  free_exports
} from "./chunk-YOS6CCYB.js";
import {
  ChartjsComponent
} from "./chunk-7DHYWULE.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  RadioControlValueAccessor,
  ReactiveFormsModule,
  RequiredValidator,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
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
  ChangeDetectorRef,
  ColComponent,
  DOCUMENT,
  DatePipe,
  DestroyRef,
  EventEmitter,
  FormControlDirective,
  FormDirective,
  FormSelectDirective,
  HttpClient,
  HttpHeaders,
  IconDirective,
  IconSetService,
  InputGroupComponent,
  InputGroupTextDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  NgClass,
  NgForOf,
  NgIf,
  Renderer2,
  Router,
  RouterLink,
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
  catchError,
  expand,
  inject,
  map,
  of,
  reduce,
  signal,
  takeWhile,
  ɵsetClassDebugInfo,
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
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵpureFunction0,
  ɵɵpureFunction2,
  ɵɵpureFunction4,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-ZG2BHLTP.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// node_modules/@coreui/utils/dist/esm/getStyle.js
var getStyle = function(property, element) {
  if (typeof window === "undefined") {
    return;
  }
  if (typeof document === "undefined") {
    return;
  }
  var _element = element !== null && element !== void 0 ? element : document.body;
  return window.getComputedStyle(_element, null).getPropertyValue(property).replace(/^\s/, "");
};

// node_modules/@coreui/utils/dist/esm/hexToRgba.js
var hexToRgba = function(color, opacity) {
  if (opacity === void 0) {
    opacity = 100;
  }
  if (typeof color === "undefined") {
    throw new TypeError("Hex color is not defined");
  }
  var hex = color.match(/^#(?:[0-9a-f]{3}){1,2}$/i);
  if (!hex) {
    throw new Error("".concat(color, " is not a valid hex color"));
  }
  var r;
  var g;
  var b;
  if (color.length === 7) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else {
    r = parseInt(color.slice(1, 2), 16);
    g = parseInt(color.slice(2, 3), 16);
    b = parseInt(color.slice(3, 5), 16);
  }
  return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(opacity / 100, ")");
};

// src/app/views/widgets/widgets-dropdown/widgets-dropdown.component.ts
var _c0 = (a0, a1) => ({ "up": a0, "down": a1 });
function WidgetsDropdownComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(3, _c0, ctx_r0.activeFindingsDirection === "cilArrowTop", ctx_r0.activeFindingsDirection === "cilArrowBottom"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.activeFindingsPercentage);
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r0.activeFindingsDirection);
  }
}
function WidgetsDropdownComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(3, _c0, ctx_r0.removedFindingsDirection === "cilArrowTop", ctx_r0.removedFindingsDirection === "cilArrowBottom"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.removedFindingsPercentage);
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r0.removedFindingsDirection);
  }
}
function WidgetsDropdownComponent_div_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(3, _c0, ctx_r0.reviewedFindingsDirection === "cilArrowTop", ctx_r0.reviewedFindingsDirection === "cilArrowBottom"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.reviewedFindingsPercentage);
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r0.reviewedFindingsDirection);
  }
}
function WidgetsDropdownComponent_div_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(3, _c0, ctx_r0.averageFixTimeDirection === "cilArrowTop", ctx_r0.averageFixTimeDirection === "cilArrowBottom"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.averageFixTimePercentage);
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r0.averageFixTimeDirection);
  }
}
var WidgetsDropdownComponent = class _WidgetsDropdownComponent {
  constructor(changeDetectorRef) {
    this.changeDetectorRef = changeDetectorRef;
    this.activeFindingsValue = "";
    this.activeFindingsPercentage = "";
    this.activeFindingsDirection = "";
    this.removedFindingsValue = "";
    this.removedFindingsPercentage = "";
    this.removedFindingsDirection = "";
    this.reviewedFindingsValue = "";
    this.reviewedFindingsPercentage = "";
    this.reviewedFindingsDirection = "";
    this.averageFixTimeValue = "";
    this.averageFixTimePercentage = "";
    this.averageFixTimeDirection = "";
    this.data = [];
    this.options = [];
    this.optionsDefault = {
      plugins: {
        legend: {
          display: false
        }
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          border: {
            display: false
          },
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        },
        y: {
          min: 30,
          max: 89,
          display: false,
          grid: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      },
      elements: {
        line: {
          borderWidth: 1,
          tension: 0.4
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 4
        }
      }
    };
  }
  ngOnInit() {
    this.processStats();
  }
  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges();
  }
  processStats() {
    if (this.stats && this.stats.activeFindings && this.stats.activeFindings.length > 0) {
      const activeFindings = this.stats.activeFindings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const activeChange = this.calculatePercentageChange(activeFindings);
      this.activeFindingsValue = this.formatNumber(activeFindings[activeFindings.length - 1].findings);
      this.activeFindingsPercentage = activeChange.percentage;
      this.activeFindingsDirection = activeChange.direction;
    } else {
      this.activeFindingsValue = "0";
      this.activeFindingsPercentage = "";
      this.activeFindingsDirection = "";
    }
    if (this.stats && this.stats.removedFindingsList && this.stats.removedFindingsList.length > 0) {
      const removedFindings = this.stats.removedFindingsList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const removedChange = this.calculatePercentageChange(removedFindings);
      this.removedFindingsValue = this.formatNumber(removedFindings[removedFindings.length - 1].findings);
      this.removedFindingsPercentage = removedChange.percentage;
      this.removedFindingsDirection = removedChange.direction;
    } else {
      this.removedFindingsValue = "0";
      this.removedFindingsPercentage = "";
      this.removedFindingsDirection = "";
    }
    if (this.stats && this.stats.reviewedFindingsList && this.stats.reviewedFindingsList.length > 0) {
      const reviewedFindings = this.stats.reviewedFindingsList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const reviewedChange = this.calculatePercentageChange(reviewedFindings);
      this.reviewedFindingsValue = this.formatNumber(reviewedFindings[reviewedFindings.length - 1].findings);
      this.reviewedFindingsPercentage = reviewedChange.percentage;
      this.reviewedFindingsDirection = reviewedChange.direction;
    } else {
      this.reviewedFindingsValue = "0";
      this.reviewedFindingsPercentage = "";
      this.reviewedFindingsDirection = "";
    }
    if (this.stats && this.stats.averageFixTimeList && this.stats.averageFixTimeList.length > 0) {
      const averageFixTime = this.stats.averageFixTimeList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const averageFixTimeChange = this.calculatePercentageChange(averageFixTime);
      this.averageFixTimeValue = this.formatNumber(averageFixTime[averageFixTime.length - 1].findings);
      this.averageFixTimePercentage = averageFixTimeChange.percentage;
      this.averageFixTimeDirection = averageFixTimeChange.direction;
    } else {
      this.averageFixTimeValue = "0";
      this.averageFixTimePercentage = "";
      this.averageFixTimeDirection = "";
    }
    this.updateChartData();
  }
  calculatePercentageChange(data) {
    const firstValue = data[0].findings;
    const lastValue = data[data.length - 1].findings;
    const percentageChange = (lastValue - firstValue) / firstValue * 100;
    const direction = lastValue >= firstValue ? "cilArrowTop" : "cilArrowBottom";
    return {
      percentage: percentageChange.toFixed(1) + "%",
      direction
    };
  }
  formatNumber(value) {
    if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + "K";
    }
    return value.toString();
  }
  updateChartData() {
    const defaultLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.data[0] = {
      labels: this.stats.activeFindings.length ? this.stats.activeFindings.map((item) => item.date) : defaultLabels.slice(0, 7),
      datasets: [{
        label: "Active Vulnerabilities",
        backgroundColor: "transparent",
        borderColor: "rgba(255,255,255,.55)",
        pointBackgroundColor: getStyle("--cui-primary"),
        pointHoverBorderColor: getStyle("--cui-primary"),
        data: this.stats.activeFindings.length ? this.stats.activeFindings.map((item) => item.findings) : Array(7).fill(0)
      }]
    };
    this.data[1] = {
      labels: this.stats.removedFindingsList.length ? this.stats.removedFindingsList.map((item) => item.date) : defaultLabels.slice(0, 7),
      datasets: [{
        label: "Vulnerabilities Removed",
        backgroundColor: "transparent",
        borderColor: "rgba(255,255,255,.55)",
        pointBackgroundColor: getStyle("--cui-info"),
        pointHoverBorderColor: getStyle("--cui-info"),
        data: this.stats.removedFindingsList.length ? this.stats.removedFindingsList.map((item) => item.findings) : Array(7).fill(0)
      }]
    };
    this.data[2] = {
      labels: this.stats.reviewedFindingsList.length ? this.stats.reviewedFindingsList.map((item) => item.date) : defaultLabels.slice(0, 7),
      datasets: [{
        label: "Vulnerabilities Reviewed",
        backgroundColor: "rgba(255,255,255,.2)",
        borderColor: "rgba(255,255,255,.55)",
        pointBackgroundColor: getStyle("--cui-warning"),
        pointHoverBorderColor: getStyle("--cui-warning"),
        data: this.stats.reviewedFindingsList.length ? this.stats.reviewedFindingsList.map((item) => item.findings) : Array(7).fill(0),
        fill: true
      }]
    };
    this.data[3] = {
      labels: this.stats.averageFixTimeList.length ? this.stats.averageFixTimeList.map((item) => item.date) : defaultLabels.slice(0, 7),
      datasets: [{
        label: "Average Fix Time",
        backgroundColor: "rgba(255,255,255,.2)",
        borderColor: "rgba(255,255,255,.55)",
        data: this.stats.averageFixTimeList.length ? this.stats.averageFixTimeList.map((item) => item.findings) : Array(7).fill(0),
        barPercentage: 0.7
      }]
    };
    this.setOptions();
  }
  setOptions() {
    this.options = [];
    for (let idx = 0; idx < 4; idx++) {
      const options = JSON.parse(JSON.stringify(this.optionsDefault));
      switch (idx) {
        case 0: {
          this.options.push(options);
          break;
        }
        case 1: {
          options.scales.y.min = -9;
          options.scales.y.max = 39;
          options.elements.line.tension = 0;
          this.options.push(options);
          break;
        }
        case 2: {
          options.scales.x = { display: false };
          options.scales.y = { display: false };
          options.elements.line.borderWidth = 2;
          options.elements.point.radius = 0;
          this.options.push(options);
          break;
        }
        case 3: {
          options.scales.x.grid = { display: false, drawTicks: false, drawBorder: false };
          options.scales.y.min = void 0;
          options.scales.y.max = void 0;
          options.elements = {};
          this.options.push(options);
          break;
        }
      }
    }
  }
  static {
    this.\u0275fac = function WidgetsDropdownComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _WidgetsDropdownComponent)(\u0275\u0275directiveInject(ChangeDetectorRef));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WidgetsDropdownComponent, selectors: [["app-widgets-dropdown"]], inputs: { stats: "stats" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 57, vars: 17, consts: [[1, "mb-4"], ["sm", "6", "xl", "3"], [1, "h-100", "dashboard-widget"], [1, "widget-content"], [1, "widget-label"], [1, "text-uppercase", "text-muted", "mb-2"], [1, "widget-value"], [1, "d-flex", "align-items-baseline"], [1, "mb-0", "me-2", "text-primary"], ["class", "trend-indicator", 3, "ngClass", 4, "ngIf"], [1, "widget-chart"], ["height", "50", 3, "data", "options", "type"], [1, "mb-0", "me-2", "text-info"], ["height", "50", "type", "line", 3, "data", "options"], [1, "mb-0", "me-2", "text-warning"], [1, "mb-0", "me-2", "text-danger"], ["height", "50", "type", "bar", 3, "data", "options"], [1, "trend-indicator", 3, "ngClass"], ["cIcon", "", "size", "sm", 3, "name"]], template: function WidgetsDropdownComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-row", 0)(1, "c-col", 1)(2, "c-card", 2)(3, "c-card-body")(4, "div", 3)(5, "div", 4)(6, "h6", 5);
        \u0275\u0275text(7, "Active Vulnerabilities");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "div", 6)(9, "div", 7)(10, "h3", 8);
        \u0275\u0275text(11);
        \u0275\u0275elementEnd();
        \u0275\u0275template(12, WidgetsDropdownComponent_div_12_Template, 4, 6, "div", 9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(13, "div", 10);
        \u0275\u0275element(14, "c-chart", 11);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(15, "c-col", 1)(16, "c-card", 2)(17, "c-card-body")(18, "div", 3)(19, "div", 4)(20, "h6", 5);
        \u0275\u0275text(21, "Vulnerabilities Removed");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(22, "div", 6)(23, "div", 7)(24, "h3", 12);
        \u0275\u0275text(25);
        \u0275\u0275elementEnd();
        \u0275\u0275template(26, WidgetsDropdownComponent_div_26_Template, 4, 6, "div", 9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(27, "div", 10);
        \u0275\u0275element(28, "c-chart", 13);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(29, "c-col", 1)(30, "c-card", 2)(31, "c-card-body")(32, "div", 3)(33, "div", 4)(34, "h6", 5);
        \u0275\u0275text(35, "Vulnerabilities Reviewed");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(36, "div", 6)(37, "div", 7)(38, "h3", 14);
        \u0275\u0275text(39);
        \u0275\u0275elementEnd();
        \u0275\u0275template(40, WidgetsDropdownComponent_div_40_Template, 4, 6, "div", 9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(41, "div", 10);
        \u0275\u0275element(42, "c-chart", 13);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(43, "c-col", 1)(44, "c-card", 2)(45, "c-card-body")(46, "div", 3)(47, "div", 4)(48, "h6", 5);
        \u0275\u0275text(49, "Average Fix Time");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(50, "div", 6)(51, "div", 7)(52, "h3", 15);
        \u0275\u0275text(53);
        \u0275\u0275elementEnd();
        \u0275\u0275template(54, WidgetsDropdownComponent_div_54_Template, 4, 6, "div", 9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(55, "div", 10);
        \u0275\u0275element(56, "c-chart", 16);
        \u0275\u0275elementEnd()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(11);
        \u0275\u0275textInterpolate(ctx.activeFindingsValue);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.activeFindingsPercentage);
        \u0275\u0275advance(2);
        \u0275\u0275property("data", ctx.data[0])("options", ctx.options[0])("type", "line");
        \u0275\u0275advance(11);
        \u0275\u0275textInterpolate(ctx.removedFindingsValue);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.removedFindingsPercentage);
        \u0275\u0275advance(2);
        \u0275\u0275property("data", ctx.data[1])("options", ctx.options[1]);
        \u0275\u0275advance(11);
        \u0275\u0275textInterpolate(ctx.reviewedFindingsValue);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.reviewedFindingsPercentage);
        \u0275\u0275advance(2);
        \u0275\u0275property("data", ctx.data[2])("options", ctx.options[2]);
        \u0275\u0275advance(11);
        \u0275\u0275textInterpolate1("", ctx.averageFixTimeValue, " days");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.averageFixTimePercentage);
        \u0275\u0275advance(2);
        \u0275\u0275property("data", ctx.data[3])("options", ctx.options[3]);
      }
    }, dependencies: [
      RowComponent,
      ColComponent,
      ChartjsComponent,
      IconDirective,
      NgIf,
      CardComponent,
      CardBodyComponent,
      NgClass
    ], styles: ["\n\n.dashboard-widget[_ngcontent-%COMP%] {\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n  border: none;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n  overflow: hidden;\n}\n.dashboard-widget[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);\n}\n.dashboard-widget[_ngcontent-%COMP%]   .widget-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n.dashboard-widget[_ngcontent-%COMP%]   .widget-label[_ngcontent-%COMP%]   h6[_ngcontent-%COMP%] {\n  font-weight: 500;\n  letter-spacing: 0.5px;\n  font-size: 0.75rem;\n}\n.dashboard-widget[_ngcontent-%COMP%]   .widget-value[_ngcontent-%COMP%] {\n  margin: 0.5rem 0 1.5rem;\n}\n.dashboard-widget[_ngcontent-%COMP%]   .widget-value[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 600;\n}\n.dashboard-widget[_ngcontent-%COMP%]   .widget-value[_ngcontent-%COMP%]   h3.text-primary[_ngcontent-%COMP%] {\n  color: #321fdb !important;\n}\n.dashboard-widget[_ngcontent-%COMP%]   .widget-value[_ngcontent-%COMP%]   h3.text-info[_ngcontent-%COMP%] {\n  color: #39f !important;\n}\n.dashboard-widget[_ngcontent-%COMP%]   .widget-value[_ngcontent-%COMP%]   h3.text-warning[_ngcontent-%COMP%] {\n  color: #f9b115 !important;\n}\n.dashboard-widget[_ngcontent-%COMP%]   .widget-value[_ngcontent-%COMP%]   h3.text-danger[_ngcontent-%COMP%] {\n  color: #e55353 !important;\n}\n.dashboard-widget[_ngcontent-%COMP%]   .widget-chart[_ngcontent-%COMP%] {\n  margin-top: auto;\n  position: relative;\n  height: 60px;\n}\n.trend-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0.2rem 0.5rem;\n  border-radius: 12px;\n  font-size: 0.75rem;\n  font-weight: 500;\n  transition: all 0.2s ease;\n}\n.trend-indicator.up[_ngcontent-%COMP%] {\n  color: #2eb85c;\n  background-color: rgba(46, 184, 92, 0.15);\n}\n.trend-indicator.down[_ngcontent-%COMP%] {\n  color: #e55353;\n  background-color: rgba(229, 83, 83, 0.15);\n}\n.trend-indicator[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-right: 0.25rem;\n}\nc-col[_ngcontent-%COMP%]:nth-child(1)   .dashboard-widget[_ngcontent-%COMP%]   .widget-chart[_ngcontent-%COMP%]     canvas {\n  filter: drop-shadow(0 4px 4px rgba(50, 31, 219, 0.1));\n}\nc-col[_ngcontent-%COMP%]:nth-child(2)   .dashboard-widget[_ngcontent-%COMP%]   .widget-chart[_ngcontent-%COMP%]     canvas {\n  filter: drop-shadow(0 4px 4px rgba(51, 153, 255, 0.1));\n}\nc-col[_ngcontent-%COMP%]:nth-child(3)   .dashboard-widget[_ngcontent-%COMP%]   .widget-chart[_ngcontent-%COMP%]     canvas {\n  filter: drop-shadow(0 4px 4px rgba(249, 177, 21, 0.1));\n}\nc-col[_ngcontent-%COMP%]:nth-child(4)   .dashboard-widget[_ngcontent-%COMP%]   .widget-chart[_ngcontent-%COMP%]     canvas {\n  filter: drop-shadow(0 4px 4px rgba(229, 83, 83, 0.1));\n}\n@media (max-width: 1200px) {\n  .dashboard-widget[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n}\n/*# sourceMappingURL=widgets-dropdown.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WidgetsDropdownComponent, { className: "WidgetsDropdownComponent" });
})();

// src/app/views/dashboard/dashboard-charts-data.ts
var DashboardChartsData = class _DashboardChartsData {
  constructor() {
    this.mainChart = { type: "line" };
    this.initMainChart();
  }
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  initMainChart(period = "Month") {
    const brandSuccess = getStyle("--cui-success") ?? "#4dbd74";
    const brandInfo = getStyle("--cui-info") ?? "#20a8d8";
    const brandInfoBg = hexToRgba(getStyle("--cui-info") ?? "#20a8d8", 10);
    const brandDanger = getStyle("--cui-danger") ?? "#f86c6b";
    this.mainChart["elements"] = period === "Month" ? 12 : 27;
    this.mainChart["Data1"] = [];
    this.mainChart["Data2"] = [];
    this.mainChart["Data3"] = [];
    for (let i = 0; i <= this.mainChart["elements"]; i++) {
      this.mainChart["Data1"].push(this.random(50, 240));
      this.mainChart["Data2"].push(this.random(20, 160));
      this.mainChart["Data3"].push(65);
    }
    let labels = [];
    if (period === "Month") {
      labels = [
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
    } else {
      const week = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ];
      labels = week.concat(week, week, week);
    }
    const colors = [
      {
        // brandInfo
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true
      },
      {
        // brandSuccess
        backgroundColor: "transparent",
        borderColor: brandSuccess || "#4dbd74",
        pointHoverBackgroundColor: "#fff"
      },
      {
        // brandDanger
        backgroundColor: "transparent",
        borderColor: brandDanger || "#f86c6b",
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 1,
        borderDash: [8, 5]
      }
    ];
    const datasets = [
      __spreadValues({
        data: this.mainChart["Data1"],
        label: "Current"
      }, colors[0]),
      __spreadValues({
        data: this.mainChart["Data2"],
        label: "Previous"
      }, colors[1]),
      __spreadValues({
        data: this.mainChart["Data3"],
        label: "BEP"
      }, colors[2])
    ];
    const plugins = {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          labelColor: (context) => ({ backgroundColor: context.dataset.borderColor })
        }
      }
    };
    const scales = this.getScales();
    const options = {
      maintainAspectRatio: false,
      plugins,
      scales,
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };
    this.mainChart.type = "line";
    this.mainChart.options = options;
    this.mainChart.data = {
      datasets,
      labels
    };
  }
  getScales() {
    const colorBorderTranslucent = getStyle("--cui-border-color-translucent");
    const colorBody = getStyle("--cui-body-color");
    const scales = {
      x: {
        grid: {
          color: colorBorderTranslucent,
          drawOnChartArea: false
        },
        ticks: {
          color: colorBody
        }
      },
      y: {
        border: {
          color: colorBorderTranslucent
        },
        grid: {
          color: colorBorderTranslucent
        },
        max: 250,
        beginAtZero: true,
        ticks: {
          color: colorBody,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5)
        }
      }
    };
    return scales;
  }
  static {
    this.\u0275fac = function DashboardChartsData_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DashboardChartsData)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DashboardChartsData, factory: _DashboardChartsData.\u0275fac, providedIn: "any" });
  }
};

// src/app/utils/GitRepoUrlValidator.ts
function gitRepoUrlValidator() {
  return (control) => {
    const url = control.value;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.host && parsedUrl.pathname && parsedUrl.pathname !== "/") {
        return null;
      } else {
        return { invalidGitRepoUrl: true };
      }
    } catch (e) {
      return { invalidGitRepoUrl: true };
    }
  };
}

// src/app/service/GitLabService.ts
var GitLabService = class _GitLabService {
  constructor(http) {
    this.http = http;
    this.gitLabApiUrl = "";
  }
  setApiUrl(repoUrl) {
    const urlObject = new URL(repoUrl);
    const host = `${urlObject.protocol}//${urlObject.host}`;
    this.gitLabApiUrl = `${host}/api/v4/projects`;
  }
  getAllProjects(token) {
    return this.getProjects(token).pipe(expand((response, index) => {
      return response.length && index < 9 ? this.getProjects(token, index + 2) : of([]);
    }), takeWhile((response, index) => response.length > 0 && index < 10), reduce((acc, curr) => acc.concat(curr), []), map((projects) => {
      return projects.map((proj) => ({
        id: proj.id,
        name: proj.name,
        path_with_namespace: proj.path_with_namespace,
        web_url: proj.web_url
      }));
    }));
  }
  getProjects(token, page = 1, perPage = 100) {
    const headers = new HttpHeaders({
      "PRIVATE-TOKEN": token
    });
    const url = `${this.gitLabApiUrl}?membership=true&page=${page}&per_page=${perPage}`;
    return this.http.get(url, { headers }).pipe(catchError(this.handleError("getProjects", [])));
  }
  getProjectDetailsFromUrl(repoUrl, token) {
    const projectPath = this.extractProjectPath(repoUrl);
    const encodedProjectPath = encodeURIComponent(projectPath);
    const url = `${this.gitLabApiUrl}/${encodedProjectPath}`;
    const headers = new HttpHeaders({
      "PRIVATE-TOKEN": token
    });
    return this.http.get(url, { headers }).pipe(map((response) => ({
      id: response.id,
      name: response.name
    })), catchError(this.handleError("getProjectDetailsFromUrl", null)));
  }
  extractProjectPath(repoUrl) {
    return repoUrl.replace(/https?:\/\/[^\/]+\//, "").replace(/\.git$/, "");
  }
  handleError(operation = "operation", result) {
    return (error) => {
      console.error(error);
      return of(result);
    };
  }
  static {
    this.\u0275fac = function GitLabService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _GitLabService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GitLabService, factory: _GitLabService.\u0275fac, providedIn: "root" });
  }
};

// src/app/service/GitHubService.ts
var GitHubService = class _GitHubService {
  constructor(http) {
    this.http = http;
    this.gitHubApiUrl = "";
  }
  setApiUrl(repoUrl) {
    repoUrl = repoUrl.replace("github.com", "api.github.com");
    const urlObject = new URL(repoUrl);
    const host = `${urlObject.protocol}//${urlObject.host}`;
    this.gitHubApiUrl = `${host}`;
  }
  // Get repositories from GitHub with pagination
  getRepositories(token, page = 1, perPage = 100) {
    const headers = new HttpHeaders({
      "Authorization": `token ${token}`
    });
    const url = `${this.gitHubApiUrl}/user/repos?visibility=all&affiliation=owner,collaborator,organization_member&page=${page}&per_page=${perPage}`;
    return this.http.get(url, { headers }).pipe(catchError(this.handleError("getRepositories", [])));
  }
  // Get all repositories with pagination support
  getAllRepositories(token) {
    return this.getRepositories(token).pipe(expand((response, index) => {
      return response.length && index < 9 ? this.getRepositories(token, index + 2) : of([]);
    }), takeWhile((response, index) => response.length > 0 && index < 10), reduce((acc, curr) => acc.concat(curr), []), map((repos) => {
      return repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        path_with_namespace: repo.full_name,
        web_url: repo.html_url
      }));
    }));
  }
  // Get repository details by URL
  getRepositoryDetailsFromUrl(repoUrl, token) {
    const repoPath = this.extractRepositoryPath(repoUrl);
    const url = `${this.gitHubApiUrl}/repos/${repoPath}`;
    const headers = new HttpHeaders({
      "Authorization": `token ${token}`
    });
    return this.http.get(url, { headers }).pipe(map((response) => ({
      id: response.id,
      name: response.name,
      full_name: response.full_name
    })), catchError(this.handleError("getRepositoryDetailsFromUrl", null)));
  }
  // Extract repository path from the URL
  extractRepositoryPath(repoUrl) {
    return repoUrl.replace(/https?:\/\/[^\/]+\//, "");
  }
  // Handle any errors that occur during HTTP requests
  handleError(operation = "operation", result) {
    return (error) => {
      console.error(error);
      return of(result);
    };
  }
  static {
    this.\u0275fac = function GitHubService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _GitHubService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GitHubService, factory: _GitHubService.\u0275fac, providedIn: "root" });
  }
};

// src/app/service/GiteaService.ts
var GiteaService = class _GiteaService {
  constructor(http) {
    this.http = http;
    this.giteaBaseUrl = "";
    this.backendUrl = environment.backendUrl;
  }
  setApiUrl(repoUrl) {
    const urlObject = new URL(repoUrl);
    this.giteaBaseUrl = `${urlObject.protocol}//${urlObject.host}`;
  }
  getAllRepositories(token) {
    return this.getRepositories(token).pipe(expand((response, index) => {
      return response.length && index < 9 ? this.getRepositories(token, index + 2) : of([]);
    }), takeWhile((response, index) => response.length > 0 && index < 10), reduce((acc, curr) => acc.concat(curr), []), map((repos) => {
      return repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        path_with_namespace: repo.full_name,
        web_url: repo.html_url
      }));
    }));
  }
  getRepositories(token, page = 1, limit = 50) {
    const headers = new HttpHeaders({
      "X-Gitea-Token": token
    });
    const url = `${this.backendUrl}/api/v1/gitea/proxy/repos?giteaUrl=${encodeURIComponent(this.giteaBaseUrl)}&page=${page}&limit=${limit}`;
    return this.http.get(url, { headers, withCredentials: true }).pipe(catchError(this.handleError("getRepositories", [])));
  }
  getRepositoryDetailsFromUrl(repoUrl, token) {
    const repoPath = this.extractRepositoryPath(repoUrl);
    const pathParts = repoPath.split("/");
    if (pathParts.length < 2) {
      return of(null);
    }
    const owner = pathParts[0];
    const repo = pathParts[1];
    const headers = new HttpHeaders({
      "X-Gitea-Token": token
    });
    const url = `${this.backendUrl}/api/v1/gitea/proxy/repo?giteaUrl=${encodeURIComponent(this.giteaBaseUrl)}&owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`;
    return this.http.get(url, { headers, withCredentials: true }).pipe(map((response) => ({
      id: response.id,
      name: response.name,
      full_name: response.full_name
    })), catchError(this.handleError("getRepositoryDetailsFromUrl", null)));
  }
  extractRepositoryPath(repoUrl) {
    return repoUrl.replace(/https?:\/\/[^\/]+\//, "").replace(/\.git$/, "");
  }
  handleError(operation = "operation", result) {
    return (error) => {
      console.error(error);
      return of(result);
    };
  }
  static {
    this.\u0275fac = function GiteaService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _GiteaService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GiteaService, factory: _GiteaService.\u0275fac, providedIn: "root" });
  }
};

// src/app/service/BitbucketService.ts
var BitbucketService = class _BitbucketService {
  constructor(http) {
    this.http = http;
    this.bitbucketBaseUrl = "";
    this.backendUrl = environment.backendUrl;
    this.pagelen = 100;
  }
  setApiUrl(repoUrl) {
    const urlObject = new URL(repoUrl);
    this.bitbucketBaseUrl = `${urlObject.protocol}//${urlObject.host}`;
  }
  getAllRepositories(token) {
    return this.getRepositories(token, 1, this.pagelen).pipe(expand((response, index) => {
      return response.length >= this.pagelen && index < 9 ? this.getRepositories(token, index + 2, this.pagelen) : of([]);
    }), takeWhile((response, index) => response.length > 0 && index < 10), reduce((acc, curr) => acc.concat(curr), []), map((repos) => {
      return repos.map((repo) => ({
        id: this.computeRemoteId(repo.uuid),
        name: repo.name,
        path_with_namespace: repo.full_name,
        web_url: repo.links?.html?.href || ""
      }));
    }));
  }
  getRepositories(token, page = 1, pagelen = 100) {
    const headers = new HttpHeaders({
      "X-Bitbucket-Token": token
    });
    const apiUrl = this.isCloud() ? "https://api.bitbucket.org" : this.bitbucketBaseUrl;
    const url = `${this.backendUrl}/api/v1/bitbucket/proxy/repos?bitbucketUrl=${encodeURIComponent(apiUrl)}&page=${page}&pagelen=${pagelen}`;
    return this.http.get(url, { headers, withCredentials: true }).pipe(catchError(this.handleError("getRepositories", [])));
  }
  getRepositoryDetailsFromUrl(repoUrl, token) {
    const repoPath = this.extractRepositoryPath(repoUrl);
    const pathParts = repoPath.split("/");
    if (pathParts.length < 2) {
      return of(null);
    }
    const workspace = pathParts[0];
    const repo = pathParts[1];
    const headers = new HttpHeaders({
      "X-Bitbucket-Token": token
    });
    const apiUrl = this.isCloud() ? "https://api.bitbucket.org" : this.bitbucketBaseUrl;
    const url = `${this.backendUrl}/api/v1/bitbucket/proxy/repo?bitbucketUrl=${encodeURIComponent(apiUrl)}&workspace=${encodeURIComponent(workspace)}&repo=${encodeURIComponent(repo)}`;
    return this.http.get(url, { headers, withCredentials: true }).pipe(map((response) => ({
      id: this.computeRemoteId(response.uuid),
      name: response.name,
      full_name: response.full_name
    })), catchError(this.handleError("getRepositoryDetailsFromUrl", null)));
  }
  isCloud() {
    return this.bitbucketBaseUrl.includes("bitbucket.org");
  }
  /**
   * Returns the base API URL to use for backend proxy calls and for the import request body.
   * For Cloud this is the Bitbucket Cloud API host; for on-premise it is the server base URL.
   */
  getApiUrl() {
    return this.isCloud() ? "https://api.bitbucket.org" : this.bitbucketBaseUrl;
  }
  extractRepositoryPath(repoUrl) {
    if (!this.isCloud()) {
      const projectsMatch = repoUrl.match(/\/projects\/([^\/]+)\/repos\/([^\/]+)/);
      if (projectsMatch) {
        return `${projectsMatch[1]}/${projectsMatch[2]}`;
      }
      const scmMatch = repoUrl.match(/\/scm\/([^\/]+)\/([^\/]+?)(?:\.git)?$/);
      if (scmMatch) {
        return `${scmMatch[1].toUpperCase()}/${scmMatch[2]}`;
      }
    }
    return repoUrl.replace(/https?:\/\/[^\/]+\//, "").replace(/\.git$/, "");
  }
  computeRemoteId(uuid) {
    if (!uuid)
      return 0;
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
      const char = uuid.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }
  handleError(operation = "operation", result) {
    return (error) => {
      console.error(error);
      return of(result);
    };
  }
  static {
    this.\u0275fac = function BitbucketService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _BitbucketService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BitbucketService, factory: _BitbucketService.\u0275fac, providedIn: "root" });
  }
};

// src/app/service/CloudService.ts
var CloudService = class _CloudService {
  constructor(http) {
    this.http = http;
    this.loginUrl = environment.backendUrl;
  }
  getCloudSubscriptions() {
    return this.http.get(this.loginUrl + "/api/v1/cloudsubscription/cloudsubscriptions", { withCredentials: true });
  }
  getAggregatedStats() {
    return this.http.get(this.loginUrl + "/api/v1/widget_stats", { withCredentials: true });
  }
  static {
    this.\u0275fac = function CloudService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CloudService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CloudService, factory: _CloudService.\u0275fac, providedIn: "root" });
  }
};

// src/app/views/dashboard/dashboard.component.ts
var _c02 = ["actionsTemplate"];
var _c1 = () => ["/security-dashboard"];
var _c2 = () => ["/stats"];
var _c3 = (a0, a1, a2, a3) => ({ "danger": a0, "success": a1, "warning": a2, "neutral": a3 });
function DashboardComponent_c_row_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-row", 1)(1, "c-col");
    \u0275\u0275element(2, "app-widgets-dropdown", 131);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("stats", ctx_r0.widgetStats);
  }
}
function DashboardComponent_c_card_body_12_c_row_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-row", 132)(1, "c-col", 133)(2, "div", 134)(3, "div", 160);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(4, "svg", 161);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "div", 137)(6, "div", 138);
    \u0275\u0275text(7, "Monitored Teams");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 139);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 140)(11, "span", 102);
    \u0275\u0275text(12, "Active teams");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(13, "c-col", 133)(14, "div", 134)(15, "div", 162);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(16, "svg", 163);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(17, "div", 137)(18, "div", 138);
    \u0275\u0275text(19, "Total Scans");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 139);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 140)(23, "span", 102);
    \u0275\u0275text(24, "All-time scans");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(25, "c-col", 133)(26, "div", 134)(27, "div", 164);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(28, "svg", 165);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(29, "div", 137)(30, "div", 138);
    \u0275\u0275text(31, "Monthly Scans");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 139);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 140)(35, "span", 102);
    \u0275\u0275text(36, "Last 30 days");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(37, "c-col", 133)(38, "div", 134)(39, "div", 166);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(40, "svg", 167);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(41, "div", 137)(42, "div", 138);
    \u0275\u0275text(43, "Security Score");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "div", 139);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 140)(47, "a", 149);
    \u0275\u0275text(48, " View details ");
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(49, "svg", 150);
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((ctx_r0.widgetStats == null ? null : ctx_r0.widgetStats.teams) || "0");
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate((ctx_r0.widgetStats == null ? null : ctx_r0.widgetStats.totalScans) || "0");
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate((ctx_r0.widgetStats == null ? null : ctx_r0.widgetStats.monthlyScans) || "0");
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(ctx_r0.calculateSecurityScore());
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(5, _c2));
  }
}
function DashboardComponent_c_card_body_12_c_chart_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-chart", 168);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("data", ctx_r0.vulnerabilityTrendData)("options", ctx_r0.chartOptions);
  }
}
function DashboardComponent_c_card_body_12_div_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 169);
    \u0275\u0275element(1, "c-spinner", 170);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Loading chart data...");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_c_card_body_12_div_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 171);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 172);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "span", 102);
    \u0275\u0275text(3, "No trend data available");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "small", 173);
    \u0275\u0275text(5, "Run security scans to generate trend data");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_c_card_body_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-card-body")(1, "c-row", 132)(2, "c-col", 133)(3, "div", 134)(4, "div", 135);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(5, "svg", 136);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(6, "div", 137)(7, "div", 138);
    \u0275\u0275text(8, "Total Open Findings");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 139);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 140);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(12, "svg", 141);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(13, "span", 142);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(15, "c-col", 133)(16, "div", 134)(17, "div", 143);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(18, "svg", 144);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(19, "div", 137)(20, "div", 138);
    \u0275\u0275text(21, "Critical Findings");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 139);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 140);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(25, "svg", 141);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(26, "span", 142);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(28, "c-col", 133)(29, "div", 134)(30, "div", 145);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(31, "svg", 146);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(32, "div", 137)(33, "div", 138);
    \u0275\u0275text(34, "Avg. Fix Time");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "div", 139);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div", 140)(38, "span", 102);
    \u0275\u0275text(39, "Current statistics");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(40, "c-col", 133)(41, "div", 134)(42, "div", 147);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(43, "svg", 148);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(44, "div", 137)(45, "div", 138);
    \u0275\u0275text(46, "Total Repositories");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 139);
    \u0275\u0275text(48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "div", 140)(50, "a", 149);
    \u0275\u0275text(51, " View details ");
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(52, "svg", 150);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275template(53, DashboardComponent_c_card_body_12_c_row_53_Template, 50, 6, "c-row", 151);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(54, "c-row")(55, "c-col")(56, "div", 152)(57, "div", 153)(58, "h6", 107);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(59, "svg", 154);
    \u0275\u0275text(60, " Vulnerability Trend (Last 30 Days) ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(61, "a", 155);
    \u0275\u0275text(62, " Details ");
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(63, "svg", 150);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(64, "div", 156);
    \u0275\u0275template(65, DashboardComponent_c_card_body_12_c_chart_65_Template, 1, 2, "c-chart", 157)(66, DashboardComponent_c_card_body_12_div_66_Template, 4, 0, "div", 158)(67, DashboardComponent_c_card_body_12_div_67_Template, 6, 0, "div", 159);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate((ctx_r0.securityStats == null ? null : ctx_r0.securityStats.openTotal) || "0");
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r0.getSecurityTrendIcon("total"));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getSecurityTrendClass("total"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getSecurityTrendText("total"), " ");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((ctx_r0.securityStats == null ? null : ctx_r0.securityStats.criticalTotal) || "0");
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r0.getSecurityTrendIcon("critical"));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getSecurityTrendClass("critical"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getSecurityTrendText("critical"), " ");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("", (ctx_r0.securityStats == null ? null : ctx_r0.securityStats.averageFixTime) || "0", " days ");
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate((ctx_r0.securityStats == null ? null : ctx_r0.securityStats.totalRepos) || "0");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(16, _c1));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r0.widgetStats);
    \u0275\u0275advance(8);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(17, _c1));
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.vulnerabilityTrendData);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.vulnerabilityTrendData && !ctx_r0.trendDataLoaded);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.vulnerabilityTrendData && ctx_r0.trendDataLoaded);
  }
}
function DashboardComponent_c_row_13_button_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 182);
    \u0275\u0275listener("click", function DashboardComponent_c_row_13_button_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.createNewTeamModal());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 14);
    \u0275\u0275text(2, " Add New Team ");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_c_row_13_button_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 183);
    \u0275\u0275listener("click", function DashboardComponent_c_row_13_button_14_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.connectProviderModal());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 184);
    \u0275\u0275text(2, " Connect Repository Provider ");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_c_row_13_button_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 46);
    \u0275\u0275listener("click", function DashboardComponent_c_row_13_button_15_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openChangeTeamModal());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 185);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Edit Selected (", ctx_r0.selectedRepos.length, ") ");
  }
}
function DashboardComponent_c_row_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-row", 1)(1, "c-col")(2, "c-card", 174)(3, "c-card-header")(4, "strong");
    \u0275\u0275text(5, "Administrative Actions");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "c-card-body", 175)(7, "button", 176);
    \u0275\u0275listener("click", function DashboardComponent_c_row_13_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.importRepoModal());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(8, "svg", 12);
    \u0275\u0275text(9, " Bulk Repository Import ");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(10, "button", 177);
    \u0275\u0275listener("click", function DashboardComponent_c_row_13_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.importSingleRepoModal());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(11, "svg", 178);
    \u0275\u0275text(12, " Single Repository Import ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(13, DashboardComponent_c_row_13_button_13_Template, 3, 0, "button", 179)(14, DashboardComponent_c_row_13_button_14_Template, 3, 0, "button", 180)(15, DashboardComponent_c_row_13_button_15_Template, 3, 1, "button", 181);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275property("ngIf", (ctx_r0.appInfo == null ? null : ctx_r0.appInfo.quotaInfo == null ? null : ctx_r0.appInfo.quotaInfo.planType) != "FREE");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.role == "ADMIN");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedRepos.length > 0 && ctx_r0.isAdmin);
  }
}
function DashboardComponent_button_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 11);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 13);
    \u0275\u0275text(2, " Repository Providers ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("itemKey", 3);
  }
}
function DashboardComponent_div_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 186)(1, "div", 187);
    \u0275\u0275element(2, "span", 188);
    \u0275\u0275elementStart(3, "small");
    \u0275\u0275text(4, "Critical Issues");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 187);
    \u0275\u0275element(6, "span", 189);
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8, "Warnings");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 187);
    \u0275\u0275element(10, "span", 190);
    \u0275\u0275elementStart(11, "small");
    \u0275\u0275text(12, "No Issues");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 187);
    \u0275\u0275element(14, "span", 191);
    \u0275\u0275elementStart(15, "small");
    \u0275\u0275text(16, "Not Scanned");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 187);
    \u0275\u0275element(18, "c-spinner", 192);
    \u0275\u0275elementStart(19, "small", 193);
    \u0275\u0275text(20, "Running");
    \u0275\u0275elementEnd()()();
  }
}
function DashboardComponent_ng_template_46_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 194);
    \u0275\u0275listener("click", function DashboardComponent_ng_template_46_Template_button_click_0_listener() {
      const row_r7 = \u0275\u0275restoreView(_r6).row;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.click(row_r7));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 19);
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_template_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 195)(1, "span", 196);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "small", 102)(4, "a", 197);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(5, "svg", 198);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const row_r8 = ctx.row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r8.target);
    \u0275\u0275advance(2);
    \u0275\u0275propertyInterpolate("href", row_r8.repo_url, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r8.repo_url, " ");
  }
}
function DashboardComponent_ng_template_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 199);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r9 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r9.team);
  }
}
function DashboardComponent_ng_template_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 200)(1, "div", 201);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 202);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "div", 203)(4, "div", 204);
    \u0275\u0275text(5, "SAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 204);
    \u0275\u0275text(7, "DAST");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 204);
    \u0275\u0275text(9, "SCA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 204);
    \u0275\u0275text(11, "SECR");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 204);
    \u0275\u0275text(13, "IAC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 204);
    \u0275\u0275text(15, "GIT");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const row_r10 = ctx.row;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("cTooltip", "Overall Risk: " + ctx_r0.getOverallRiskStatus(row_r10));
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r0.getOverallRiskIcon(row_r10))("ngClass", ctx_r0.getOverallRiskClass(row_r10));
    \u0275\u0275advance(2);
    \u0275\u0275property("cTooltip", "SAST: " + row_r10.sast)("ngClass", ctx_r0.getScanStatusClass(row_r10.sast));
    \u0275\u0275advance(2);
    \u0275\u0275property("cTooltip", "DAST: " + row_r10.dast)("ngClass", ctx_r0.getScanStatusClass(row_r10.dast));
    \u0275\u0275advance(2);
    \u0275\u0275property("cTooltip", "SCA: " + row_r10.sca)("ngClass", ctx_r0.getScanStatusClass(row_r10.sca));
    \u0275\u0275advance(2);
    \u0275\u0275property("cTooltip", "Secrets: " + row_r10.secrets)("ngClass", ctx_r0.getScanStatusClass(row_r10.secrets));
    \u0275\u0275advance(2);
    \u0275\u0275property("cTooltip", "IaC: " + row_r10.iac)("ngClass", ctx_r0.getScanStatusClass(row_r10.iac));
    \u0275\u0275advance(2);
    \u0275\u0275property("cTooltip", "GitLab: " + row_r10.gitlab)("ngClass", ctx_r0.getScanStatusClass(row_r10.gitlab));
  }
}
function DashboardComponent_ng_template_63_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 194);
    \u0275\u0275listener("click", function DashboardComponent_ng_template_63_Template_button_click_0_listener() {
      const row_r12 = \u0275\u0275restoreView(_r11).row;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cloudClick(row_r12));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 19);
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_template_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 195)(1, "span", 196);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "small", 102);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r13 = ctx.row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r13.externalProjectName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r13.cloudSubscription);
  }
}
function DashboardComponent_ng_template_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 199);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r14 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r14.team);
  }
}
function DashboardComponent_ng_template_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 205);
    \u0275\u0275text(1, "Cloud Scan");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_template_70__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_70__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 213);
  }
}
function DashboardComponent_ng_template_70__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_70__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 214);
  }
}
function DashboardComponent_ng_template_70_c_spinner_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 192);
  }
}
function DashboardComponent_ng_template_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 206)(1, "div", 207);
    \u0275\u0275template(2, DashboardComponent_ng_template_70__svg_svg_2_Template, 1, 0, "svg", 208)(3, DashboardComponent_ng_template_70__svg_svg_3_Template, 1, 0, "svg", 209)(4, DashboardComponent_ng_template_70__svg_svg_4_Template, 1, 0, "svg", 208)(5, DashboardComponent_ng_template_70__svg_svg_5_Template, 1, 0, "svg", 210)(6, DashboardComponent_ng_template_70_c_spinner_6_Template, 1, 0, "c-spinner", 211);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r15 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(6, _c3, row_r15.scanStatus === "DANGER", row_r15.scanStatus === "SUCCESS", row_r15.scanStatus === "WARNING", row_r15.scanStatus === "NOT_PERFORMED"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r15.scanStatus === "DANGER");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r15.scanStatus === "SUCCESS");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r15.scanStatus === "WARNING");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r15.scanStatus === "NOT_PERFORMED");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r15.scanStatus === "RUNNING");
  }
}
function DashboardComponent_ng_template_81_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 194);
    \u0275\u0275listener("click", function DashboardComponent_ng_template_81_Template_button_click_0_listener() {
      const row_r17 = \u0275\u0275restoreView(_r16).row;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.teamClick(row_r17));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 19);
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_template_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 195)(1, "span", 196);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "small", 102);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r18 = ctx.row;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r18.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r18.remoteIdentifier);
  }
}
function DashboardComponent_ng_template_85_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 215);
    \u0275\u0275text(1, "SAST");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_template_86__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_86__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 213);
  }
}
function DashboardComponent_ng_template_86__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_86__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 214);
  }
}
function DashboardComponent_ng_template_86_c_spinner_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 192);
  }
}
function DashboardComponent_ng_template_86_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 206)(1, "div", 207);
    \u0275\u0275template(2, DashboardComponent_ng_template_86__svg_svg_2_Template, 1, 0, "svg", 208)(3, DashboardComponent_ng_template_86__svg_svg_3_Template, 1, 0, "svg", 209)(4, DashboardComponent_ng_template_86__svg_svg_4_Template, 1, 0, "svg", 208)(5, DashboardComponent_ng_template_86__svg_svg_5_Template, 1, 0, "svg", 210)(6, DashboardComponent_ng_template_86_c_spinner_6_Template, 1, 0, "c-spinner", 211);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r19 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(6, _c3, row_r19.sastStatus === "DANGER", row_r19.sastStatus === "SUCCESS", row_r19.sastStatus === "WARNING", row_r19.sastStatus === "NOT_PERFORMED"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r19.sastStatus === "DANGER");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r19.sastStatus === "SUCCESS");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r19.sastStatus === "WARNING");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r19.sastStatus === "NOT_PERFORMED");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r19.sastStatus === "RUNNING");
  }
}
function DashboardComponent_ng_template_88_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 216);
    \u0275\u0275text(1, "SCA");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_template_89__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_89__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 213);
  }
}
function DashboardComponent_ng_template_89__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_89__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 214);
  }
}
function DashboardComponent_ng_template_89_c_spinner_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 192);
  }
}
function DashboardComponent_ng_template_89_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 206)(1, "div", 207);
    \u0275\u0275template(2, DashboardComponent_ng_template_89__svg_svg_2_Template, 1, 0, "svg", 208)(3, DashboardComponent_ng_template_89__svg_svg_3_Template, 1, 0, "svg", 209)(4, DashboardComponent_ng_template_89__svg_svg_4_Template, 1, 0, "svg", 208)(5, DashboardComponent_ng_template_89__svg_svg_5_Template, 1, 0, "svg", 210)(6, DashboardComponent_ng_template_89_c_spinner_6_Template, 1, 0, "c-spinner", 211);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r20 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(6, _c3, row_r20.scaStatus === "DANGER", row_r20.scaStatus === "SUCCESS", row_r20.scaStatus === "WARNING", row_r20.scaStatus === "NOT_PERFORMED"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r20.scaStatus === "DANGER");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r20.scaStatus === "SUCCESS");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r20.scaStatus === "WARNING");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r20.scaStatus === "NOT_PERFORMED");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r20.scaStatus === "RUNNING");
  }
}
function DashboardComponent_ng_template_91_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 217);
    \u0275\u0275text(1, "Secrets");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_template_92__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_92__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 213);
  }
}
function DashboardComponent_ng_template_92__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_92__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 214);
  }
}
function DashboardComponent_ng_template_92_c_spinner_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 192);
  }
}
function DashboardComponent_ng_template_92_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 206)(1, "div", 207);
    \u0275\u0275template(2, DashboardComponent_ng_template_92__svg_svg_2_Template, 1, 0, "svg", 208)(3, DashboardComponent_ng_template_92__svg_svg_3_Template, 1, 0, "svg", 209)(4, DashboardComponent_ng_template_92__svg_svg_4_Template, 1, 0, "svg", 208)(5, DashboardComponent_ng_template_92__svg_svg_5_Template, 1, 0, "svg", 210)(6, DashboardComponent_ng_template_92_c_spinner_6_Template, 1, 0, "c-spinner", 211);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r21 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(6, _c3, row_r21.secretsStatus === "DANGER", row_r21.secretsStatus === "SUCCESS", row_r21.secretsStatus === "WARNING", row_r21.secretsStatus === "NOT_PERFORMED"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r21.secretsStatus === "DANGER");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r21.secretsStatus === "SUCCESS");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r21.secretsStatus === "WARNING");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r21.secretsStatus === "NOT_PERFORMED");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r21.secretsStatus === "RUNNING");
  }
}
function DashboardComponent_ng_template_94_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 218);
    \u0275\u0275text(1, "IaC");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_template_95__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_95__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 213);
  }
}
function DashboardComponent_ng_template_95__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_95__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 214);
  }
}
function DashboardComponent_ng_template_95_c_spinner_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 192);
  }
}
function DashboardComponent_ng_template_95_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 206)(1, "div", 207);
    \u0275\u0275template(2, DashboardComponent_ng_template_95__svg_svg_2_Template, 1, 0, "svg", 208)(3, DashboardComponent_ng_template_95__svg_svg_3_Template, 1, 0, "svg", 209)(4, DashboardComponent_ng_template_95__svg_svg_4_Template, 1, 0, "svg", 208)(5, DashboardComponent_ng_template_95__svg_svg_5_Template, 1, 0, "svg", 210)(6, DashboardComponent_ng_template_95_c_spinner_6_Template, 1, 0, "c-spinner", 211);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r22 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(6, _c3, row_r22.iacStatus === "DANGER", row_r22.iacStatus === "SUCCESS", row_r22.iacStatus === "WARNING", row_r22.iacStatus === "NOT_PERFORMED"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r22.iacStatus === "DANGER");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r22.iacStatus === "SUCCESS");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r22.iacStatus === "WARNING");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r22.iacStatus === "NOT_PERFORMED");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r22.iacStatus === "RUNNING");
  }
}
function DashboardComponent_ng_template_97_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 219);
    \u0275\u0275text(1, "GitLab Scan");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_template_98__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_98__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 213);
  }
}
function DashboardComponent_ng_template_98__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_98__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 214);
  }
}
function DashboardComponent_ng_template_98_c_spinner_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 192);
  }
}
function DashboardComponent_ng_template_98_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 206)(1, "div", 207);
    \u0275\u0275template(2, DashboardComponent_ng_template_98__svg_svg_2_Template, 1, 0, "svg", 208)(3, DashboardComponent_ng_template_98__svg_svg_3_Template, 1, 0, "svg", 209)(4, DashboardComponent_ng_template_98__svg_svg_4_Template, 1, 0, "svg", 208)(5, DashboardComponent_ng_template_98__svg_svg_5_Template, 1, 0, "svg", 210)(6, DashboardComponent_ng_template_98_c_spinner_6_Template, 1, 0, "c-spinner", 211);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r23 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(6, _c3, row_r23.gitlabStatus === "DANGER", row_r23.gitlabStatus === "SUCCESS", row_r23.gitlabStatus === "WARNING", row_r23.gitlabStatus === "NOT_PERFORMED"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r23.gitlabStatus === "DANGER");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r23.gitlabStatus === "SUCCESS");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r23.gitlabStatus === "WARNING");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r23.gitlabStatus === "NOT_PERFORMED");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r23.gitlabStatus === "RUNNING");
  }
}
function DashboardComponent_ng_template_100_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 205);
    \u0275\u0275text(1, "Cloud Scan");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_template_101__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_101__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 213);
  }
}
function DashboardComponent_ng_template_101__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 212);
  }
}
function DashboardComponent_ng_template_101__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 214);
  }
}
function DashboardComponent_ng_template_101_c_spinner_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "c-spinner", 192);
  }
}
function DashboardComponent_ng_template_101_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 206)(1, "div", 207);
    \u0275\u0275template(2, DashboardComponent_ng_template_101__svg_svg_2_Template, 1, 0, "svg", 208)(3, DashboardComponent_ng_template_101__svg_svg_3_Template, 1, 0, "svg", 209)(4, DashboardComponent_ng_template_101__svg_svg_4_Template, 1, 0, "svg", 208)(5, DashboardComponent_ng_template_101__svg_svg_5_Template, 1, 0, "svg", 210)(6, DashboardComponent_ng_template_101_c_spinner_6_Template, 1, 0, "c-spinner", 211);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r24 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(6, _c3, row_r24.cloudScanStatus === "DANGER", row_r24.cloudScanStatus === "SUCCESS", row_r24.cloudScanStatus === "WARNING", row_r24.cloudScanStatus === "NOT_PERFORMED"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r24.cloudScanStatus === "DANGER");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r24.cloudScanStatus === "SUCCESS");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r24.cloudScanStatus === "WARNING");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r24.cloudScanStatus === "NOT_PERFORMED");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r24.cloudScanStatus === "RUNNING");
  }
}
function DashboardComponent_c_tab_panel_102_ng_template_3__svg_svg_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 230);
  }
}
function DashboardComponent_c_tab_panel_102_ng_template_3__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 231);
  }
}
function DashboardComponent_c_tab_panel_102_ng_template_3__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 232);
  }
}
function DashboardComponent_c_tab_panel_102_ng_template_3__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 233);
  }
}
function DashboardComponent_c_tab_panel_102_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 225);
    \u0275\u0275template(1, DashboardComponent_c_tab_panel_102_ng_template_3__svg_svg_1_Template, 1, 0, "svg", 226)(2, DashboardComponent_c_tab_panel_102_ng_template_3__svg_svg_2_Template, 1, 0, "svg", 227)(3, DashboardComponent_c_tab_panel_102_ng_template_3__svg_svg_3_Template, 1, 0, "svg", 228)(4, DashboardComponent_c_tab_panel_102_ng_template_3__svg_svg_4_Template, 1, 0, "svg", 229);
    \u0275\u0275elementStart(5, "span", 196);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r25 = ctx.row;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r25.providerType === "GITLAB");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r25.providerType === "GITHUB");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r25.providerType === "GITEA");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r25.providerType === "BITBUCKET");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r25.providerType);
  }
}
function DashboardComponent_c_tab_panel_102_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "date");
  }
  if (rf & 2) {
    const row_r26 = ctx.row;
    \u0275\u0275textInterpolate1(" ", row_r26.lastSyncDate ? \u0275\u0275pipeBind2(1, 1, row_r26.lastSyncDate, "medium") : "Never", " ");
  }
}
function DashboardComponent_c_tab_panel_102_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const row_r27 = ctx.row;
    \u0275\u0275textInterpolate1(" ", row_r27.syncedRepoCount || "0", " ");
  }
}
function DashboardComponent_c_tab_panel_102_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-tab-panel", 16)(1, "ngx-datatable", 32)(2, "ngx-datatable-column", 220);
    \u0275\u0275template(3, DashboardComponent_c_tab_panel_102_ng_template_3_Template, 7, 5, "ng-template", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "ngx-datatable-column", 221)(5, "ngx-datatable-column", 222);
    \u0275\u0275elementStart(6, "ngx-datatable-column", 223);
    \u0275\u0275template(7, DashboardComponent_c_tab_panel_102_ng_template_7_Template, 2, 4, "ng-template", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "ngx-datatable-column", 224);
    \u0275\u0275template(9, DashboardComponent_c_tab_panel_102_ng_template_9_Template, 1, 1, "ng-template", 27);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("itemKey", 3);
    \u0275\u0275advance();
    \u0275\u0275property("rows", ctx_r0.providerRows)("columns", ctx_r0.providerColumns)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", 10);
    \u0275\u0275advance();
    \u0275\u0275property("width", 120);
  }
}
function DashboardComponent_div_108_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 234);
    \u0275\u0275element(1, "c-spinner", 235);
    \u0275\u0275elementStart(2, "p", 236);
    \u0275\u0275text(3, "Loading repositories...");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_ng_container_109_ng_template_10_button_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 245);
    \u0275\u0275listener("click", function DashboardComponent_ng_container_109_ng_template_10_button_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r29);
      const row_r30 = \u0275\u0275nextContext().row;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.importRepo(row_r30));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 246);
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_container_109_ng_template_10_button_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 247);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 248);
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_ng_container_109_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DashboardComponent_ng_container_109_ng_template_10_button_0_Template, 2, 0, "button", 243)(1, DashboardComponent_ng_container_109_ng_template_10_button_1_Template, 2, 0, "button", 244);
  }
  if (rf & 2) {
    const row_r30 = ctx.row;
    \u0275\u0275property("ngIf", !row_r30.imported);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r30.imported);
  }
}
function DashboardComponent_ng_container_109_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "c-input-group", 1)(2, "span", 18);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "input", 237);
    \u0275\u0275listener("input", function DashboardComponent_ng_container_109_Template_input_input_4_listener($event) {
      \u0275\u0275restoreView(_r28);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.updateFilterRepo($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "ngx-datatable", 238);
    \u0275\u0275element(6, "ngx-datatable-column", 239)(7, "ngx-datatable-column", 240)(8, "ngx-datatable-column", 241);
    \u0275\u0275elementStart(9, "ngx-datatable-column", 242);
    \u0275\u0275template(10, DashboardComponent_ng_container_109_ng_template_10_Template, 2, 2, "ng-template", 27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("rows", ctx_r0.repoRows)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", 10);
    \u0275\u0275advance(4);
    \u0275\u0275property("width", 80)("sortable", false);
  }
}
function DashboardComponent_div_153_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 249);
    \u0275\u0275text(1, " Please enter a valid URL ");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_div_173_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 249);
    \u0275\u0275text(1, " Access token is required ");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_option_188_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 250);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r31 = ctx.$implicit;
    \u0275\u0275property("value", team_r31.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(team_r31.name);
  }
}
function DashboardComponent_div_189_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 249);
    \u0275\u0275text(1, " Please select a team ");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_div_236_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 249);
    \u0275\u0275text(1, " Please enter a valid repository URL ");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_div_257_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 249);
    \u0275\u0275text(1, " Access token is required ");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_option_272_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 250);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r32 = ctx.$implicit;
    \u0275\u0275property("value", team_r32.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(team_r32.name);
  }
}
function DashboardComponent_div_273_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 249);
    \u0275\u0275text(1, " Please select a team ");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_div_293_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 249);
    \u0275\u0275text(1, " Team name is required ");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_option_359_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 250);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r33 = ctx.$implicit;
    \u0275\u0275property("value", team_r33.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(team_r33.name);
  }
}
function DashboardComponent_li_379_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 251);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const repo_r34 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(repo_r34.target);
  }
}
function DashboardComponent_option_387_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 250);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r35 = ctx.$implicit;
    \u0275\u0275property("value", team_r35.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(team_r35.name);
  }
}
var DashboardComponent = class _DashboardComponent {
  #destroyRef;
  #document;
  #renderer;
  #chartsData;
  constructor(iconSet, fb, router, authService, gitLabService, dashboardService, teamService, gitHubService, giteaService, bitbucketService, cloudService, statsService, appInfoService) {
    this.iconSet = iconSet;
    this.fb = fb;
    this.router = router;
    this.authService = authService;
    this.gitLabService = gitLabService;
    this.dashboardService = dashboardService;
    this.teamService = teamService;
    this.gitHubService = gitHubService;
    this.giteaService = giteaService;
    this.bitbucketService = bitbucketService;
    this.cloudService = cloudService;
    this.statsService = statsService;
    this.appInfoService = appInfoService;
    this.repoImported = new EventEmitter();
    this.isLoading = false;
    this.repoUrl = "";
    this.accessToken = "";
    this.selectedRepo = "GitLab";
    this.teams = [];
    this.canManage = false;
    this.userRoleSet = new EventEmitter();
    this.trendDataLoaded = false;
    this.role = "none";
    this.visibleConnectProvider = false;
    this.isAdmin = false;
    this.providerRows = [];
    this.providerColumns = [
      { prop: "providerType", name: "Provider" },
      { prop: "apiUrl", name: "API URL" },
      { prop: "defaultTeamName", name: "Default Team" },
      { prop: "lastSyncDate", name: "Last Sync" },
      { prop: "syncedRepoCount", name: "Synced Repositories" }
    ];
    this.selectedRepos = [];
    this.visibleChangeTeamModal = false;
    this.selectionType = SelectionType;
    this.rowIdentity = (row) => {
      return row.id;
    };
    this.showSecurityOverview = true;
    this.securityStats = null;
    this.securityTrendData = [];
    this.vulnerabilityTrendData = null;
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1e3,
        easing: "easeOutQuart"
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: "circle",
            padding: 15,
            font: {
              size: 11,
              weight: "bold"
            }
          }
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(33, 37, 41, 0.85)",
          titleFont: {
            size: 13,
            weight: "bold"
          },
          bodyFont: {
            size: 12
          },
          padding: 10,
          cornerRadius: 4,
          displayColors: true,
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          caretSize: 6,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y;
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxRotation: 0,
            padding: 8,
            font: {
              size: 10
            },
            color: "rgba(120, 130, 140, 0.8)"
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(120, 130, 140, 0.1)",
            drawBorder: false,
            lineWidth: 1,
            drawTicks: false
          },
          ticks: {
            padding: 10,
            count: 5,
            stepSize: Math.ceil(10 / 5),
            font: {
              size: 10
            },
            color: "rgba(120, 130, 140, 0.8)"
          },
          border: {
            display: false
          }
        }
      },
      layout: {
        padding: {
          top: 10,
          right: 15,
          bottom: 15,
          left: 15
        }
      },
      elements: {
        line: {
          tension: 0.35
        },
        point: {
          radius: 2,
          hitRadius: 30,
          hoverRadius: 5
        }
      },
      interaction: {
        mode: "index",
        intersect: false
      },
      hover: {
        mode: "nearest",
        intersect: false,
        animationDuration: 200
      }
    };
    this.rows = [];
    this.repoRows = [];
    this.columns = [];
    this.cloudRows = [];
    this.cloudColumns = [];
    this.teamsColumns = [];
    this.#destroyRef = inject(DestroyRef);
    this.#document = inject(DOCUMENT);
    this.#renderer = inject(Renderer2);
    this.#chartsData = inject(DashboardChartsData);
    this.mainChart = { type: "line" };
    this.mainChartRef = signal(void 0);
    this.chart = [];
    this.temp = [...this.rows];
    this.cloudTemp = [...this.cloudRows];
    this.teamsTemp = [...this.teams];
    this.tempRepos = [...this.repoRows];
    this.visible = false;
    this.visibleSingleRepoModal = false;
    this.visibleList = false;
    this.visibleNewTeam = false;
    this.position = "top-end";
    this.visibleToast = false;
    this.percentage = 0;
    this.toastMessage = "";
    this.toastStatus = "";
    this.showStatusLegend = false;
    iconSet.icons = __spreadValues(__spreadValues(__spreadValues({}, free_exports), iconSet), brand_exports);
    this.importRepoForm = this.fb.group({
      repoUrl: ["", [Validators.required, Validators.pattern("https?://.+")]],
      accessToken: ["", Validators.required],
      team: ["", Validators.required],
      repoType: ["gitlab", Validators.required]
    });
    this.importSingleRepoForm = this.fb.group({
      repoUrl: ["", [Validators.required, gitRepoUrlValidator()]],
      accessToken: ["", Validators.required],
      team: ["", Validators.required],
      repoType: ["gitlab", Validators.required]
    });
    this.newTeamForm = this.fb.group({
      name: ["", Validators.required],
      remoteIdentifier: [""]
    });
    this.connectProviderForm = this.fb.group({
      providerType: ["GITHUB", Validators.required],
      apiUrl: ["", Validators.required],
      accessToken: ["", Validators.required],
      defaultTeamId: ["", Validators.required]
    });
    this.changeTeamForm = this.fb.group({
      newTeamId: ["", Validators.required]
    });
  }
  onSelect({ selected }) {
    console.log("Select event fired:", selected);
    this.selectedRepos = [...selected];
  }
  openChangeTeamModal() {
    this.visibleChangeTeamModal = true;
  }
  handleChangeTeamModalChange(event) {
    this.visibleChangeTeamModal = event;
  }
  onSubmitChangeTeam() {
    if (this.changeTeamForm.invalid) {
      this.showToast("danger", "Please select a new team.");
      return;
    }
    if (this.selectedRepos.length === 0) {
      this.showToast("danger", "No repositories selected.");
      return;
    }
    const repoIds = this.selectedRepos.map((repo) => repo.id);
    const { newTeamId } = this.changeTeamForm.value;
    this.dashboardService.changeTeamForRepos(repoIds, newTeamId).subscribe({
      next: () => {
        this.showToast("success", "Teams changed successfully for selected repositories.");
        this.visibleChangeTeamModal = false;
        this.selectedRepos = [];
        this.loadCodeRepos();
      },
      error: (err) => {
        this.showToast("danger", `Error changing teams: ${err.error?.message || "Please try again."}`);
      }
    });
  }
  // Add methods to handle the new modal
  connectProviderModal() {
    this.visibleConnectProvider = true;
  }
  handleConnectProviderChange(event) {
    this.visibleConnectProvider = event;
  }
  // Add the submission logic
  onSubmitConnectProvider() {
    if (this.connectProviderForm.invalid) {
      this.showToast("danger", "Please fill all fields for the provider connection.");
      return;
    }
    const formData = this.connectProviderForm.value;
    this.dashboardService.connectProvider(formData).subscribe({
      next: () => {
        this.showToast("success", "Provider connected successfully. Initial sync has started.");
        this.visibleConnectProvider = false;
      },
      error: (err) => {
        this.showToast("danger", `Connection failed: ${err.error.message || "Please check details and try again."}`);
      }
    });
  }
  ngOnInit() {
    let userRole = localStorage.getItem("userRole");
    this.role = userRole;
    this.isAdmin = userRole === "ADMIN";
    this.authService.hc().subscribe({
      next: (response) => {
        if (!userRole) {
          localStorage.setItem("userRole", response.status.replace("ROLE_", ""));
          location.reload();
        }
        this.canManage = true;
      },
      error: () => {
        this.router.navigate(["/login"]);
      }
    });
    if (this.isAdmin) {
      this.loadRepositoryProviders();
    }
    this.loadCodeRepos();
    this.loadCloudSubscriptions();
    this.loadTeams();
    this.loadSecurityData();
    this.initColumns();
    this.initCloudColumns();
    this.initTeamsColumns();
    this.initCharts();
    this.updateChartOnColorModeChange();
    this.loadWidgetStats();
    this.loadAppInfo();
  }
  // Load security data for the overview section
  loadSecurityData() {
    this.statsService.getVulnerabilitySummary(null).subscribe({
      next: (data) => {
        this.securityStats = data;
      },
      error: (error) => {
        console.error("Error loading security summary data:", error);
      }
    });
    this.trendDataLoaded = false;
    this.statsService.getVulnerabilityTrend(null, 30).subscribe({
      next: (data) => {
        this.securityTrendData = data;
        this.trendDataLoaded = true;
        this.prepareVulnerabilityTrendChart();
      },
      error: (error) => {
        console.error("Error loading security trend data:", error);
      }
    });
  }
  // Add this new method to fetch data
  loadRepositoryProviders() {
    this.dashboardService.getRepositoryProviders().subscribe({
      next: (data) => {
        this.providerRows = data;
      },
      error: (err) => {
        console.error("Failed to load repository providers", err);
        this.showToast("danger", "Could not load repository providers.");
      }
    });
  }
  loadAppInfo() {
    this.appInfoService.getAppModeInfo().subscribe({
      next: (data) => {
        this.appInfo = data;
      },
      error: (err) => {
        console.error("Failed to load app info:", err);
      }
    });
  }
  // Toggle security overview section visibility
  toggleSecurityOverview() {
    this.showSecurityOverview = !this.showSecurityOverview;
  }
  // Prepare vulnerability trend chart data
  prepareVulnerabilityTrendChart() {
    if (!this.securityTrendData || this.securityTrendData.length === 0) {
      return;
    }
    this.securityTrendData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const labels = this.securityTrendData.map((item) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const criticalData = this.securityTrendData.map((item) => (item.sastCritical || 0) + (item.scaCritical || 0) + (item.iacCritical || 0) + (item.secretsCritical || 0) + (item.dastCritical || 0) + (item.gitlabCritical || 0));
    const highData = this.securityTrendData.map((item) => (item.sastHigh || 0) + (item.scaHigh || 0) + (item.iacHigh || 0) + (item.secretsHigh || 0) + (item.dastHigh || 0) + (item.gitlabHigh || 0));
    const createGradient = (ctx, color, opacity) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, "0")}`);
      gradient.addColorStop(1, `${color}00`);
      return gradient;
    };
    this.vulnerabilityTrendData = {
      labels,
      datasets: [
        {
          label: "Critical",
          data: criticalData,
          borderColor: "#dc3545",
          backgroundColor: function(context) {
            const chart = context.chart;
            const { ctx } = chart;
            return createGradient(ctx, "#dc3545", 0.3);
          },
          borderWidth: 2,
          fill: true,
          pointBackgroundColor: "#dc3545",
          pointBorderColor: "#ffffff",
          pointHoverBackgroundColor: "#ffffff",
          pointHoverBorderColor: "#dc3545",
          pointHoverBorderWidth: 2,
          pointHoverRadius: 6,
          pointRadius: 4,
          tension: 0.3
        },
        {
          label: "High",
          data: highData,
          borderColor: "#fd7e14",
          backgroundColor: function(context) {
            const chart = context.chart;
            const { ctx } = chart;
            return createGradient(ctx, "#fd7e14", 0.3);
          },
          borderWidth: 2,
          fill: true,
          pointBackgroundColor: "#fd7e14",
          pointBorderColor: "#ffffff",
          pointHoverBackgroundColor: "#ffffff",
          pointHoverBorderColor: "#fd7e14",
          pointHoverBorderWidth: 2,
          pointHoverRadius: 6,
          pointRadius: 4,
          tension: 0.3
        }
      ]
    };
  }
  // Get security trend indicator (up/down/stable)
  getSecurityTrendIcon(type) {
    const trend = this.getSecurityTrend(type);
    if (trend === "up")
      return "cil-arrow-top";
    if (trend === "down")
      return "cil-arrow-bottom";
    return "cil-minus";
  }
  // Get CSS class for trend indicator
  getSecurityTrendClass(type) {
    const trend = this.getSecurityTrend(type);
    if (trend === "up")
      return "text-danger";
    if (trend === "down")
      return "text-success";
    return "text-muted";
  }
  // Get text for trend indicator
  getSecurityTrendText(type) {
    const trend = this.getSecurityTrend(type);
    if (trend === "up")
      return "Increasing";
    if (trend === "down")
      return "Decreasing";
    return "Stable";
  }
  // Calculate security trend (up/down/stable)
  getSecurityTrend(type) {
    if (this.securityTrendData.length < 2)
      return "stable";
    const latestDataPoint = this.securityTrendData[this.securityTrendData.length - 1];
    const previousDataPoint = this.securityTrendData[this.securityTrendData.length - 2];
    let latest = 0;
    let previous = 0;
    if (type === "critical") {
      latest = (latestDataPoint.sastCritical || 0) + (latestDataPoint.scaCritical || 0) + (latestDataPoint.iacCritical || 0) + (latestDataPoint.secretsCritical || 0) + (latestDataPoint.dastCritical || 0) + (latestDataPoint.gitlabCritical || 0);
      previous = (previousDataPoint.sastCritical || 0) + (previousDataPoint.scaCritical || 0) + (previousDataPoint.iacCritical || 0) + (previousDataPoint.secretsCritical || 0) + (previousDataPoint.dastCritical || 0) + (previousDataPoint.gitlabCritical || 0);
    } else if (type === "high") {
      latest = (latestDataPoint.sastHigh || 0) + (latestDataPoint.scaHigh || 0) + (latestDataPoint.iacHigh || 0) + (latestDataPoint.secretsHigh || 0) + (latestDataPoint.dastHigh || 0) + (latestDataPoint.gitlabHigh || 0);
      previous = (previousDataPoint.sastHigh || 0) + (previousDataPoint.scaHigh || 0) + (previousDataPoint.iacHigh || 0) + (previousDataPoint.secretsHigh || 0) + (previousDataPoint.dastHigh || 0) + (previousDataPoint.gitlabHigh || 0);
    } else if (type === "total") {
      latest = latestDataPoint.openFindings || 0;
      previous = previousDataPoint.openFindings || 0;
    }
    if (latest === previous)
      return "stable";
    return latest > previous ? "up" : "down";
  }
  // Calculate a simple security score based on findings
  calculateSecurityScore() {
    if (!this.securityStats) {
      return "N/A";
    }
    const criticalPenalty = (this.securityStats.criticalTotal || 0) * 5;
    const highPenalty = (this.securityStats.highTotal || 0) * 3;
    const mediumPenalty = this.securityStats.mediumTotal || 0;
    const totalRepos = this.securityStats.totalRepos || 1;
    const totalPenalty = criticalPenalty + highPenalty + mediumPenalty;
    let score = 100 - totalPenalty / (totalRepos * 10);
    score = Math.max(0, Math.min(100, score));
    if (score >= 90)
      return "A";
    if (score >= 80)
      return "B";
    if (score >= 70)
      return "C";
    if (score >= 60)
      return "D";
    return "F";
  }
  loadCodeRepos() {
    this.dashboardService.getRepos().subscribe({
      next: (response) => {
        this.rows = response;
        this.temp = [...this.rows];
        this.loadTeams();
      },
      error: (error) => {
        console.error("Error loading code repos:", error);
      }
    });
  }
  loadCloudSubscriptions() {
    this.cloudService.getCloudSubscriptions().subscribe({
      next: (response) => {
        this.cloudRows = response;
        this.cloudTemp = [...this.cloudRows];
      },
      error: (error) => {
        console.error("Error loading cloud subscriptions:", error);
      }
    });
  }
  loadWidgetStats() {
    this.dashboardService.getAggregatedStats().subscribe({
      next: (response) => {
        this.widgetStats = response || {};
        this.loadDashboardMetrics();
      },
      error: (error) => {
        console.error("Error loading widget stats:", error);
        this.widgetStats = {};
        this.loadDashboardMetrics();
      }
    });
  }
  /**
   * Load additional dashboard metrics (teams count, scan counts, etc.)
   */
  loadDashboardMetrics() {
    this.statsService.getDashboardMetrics().subscribe({
      next: (response) => {
        this.widgetStats = __spreadProps(__spreadValues({}, this.widgetStats), {
          teams: response.teams,
          totalScans: response.totalScans,
          monthlyScans: response.monthlyScans
        });
      },
      error: (error) => {
        console.error("Error loading dashboard metrics:", error);
      }
    });
  }
  loadTeams() {
    this.teamService.get().subscribe({
      next: (response) => {
        this.teams = response.map((team) => {
          const teamRepos = this.rows.filter((repo) => repo.team.toLowerCase() === team.name.toLowerCase());
          const { sast, sca, iac, secrets, dast: string, gitlab } = this.getRepoScanStatus(teamRepos);
          const teamCloudSubscriptions = this.cloudRows.filter((cloudSubscription) => cloudSubscription.team.toLowerCase() === team.name.toLowerCase());
          const { cloudScan } = this.getCloudScanStatus(teamCloudSubscriptions);
          return __spreadProps(__spreadValues({}, team), { sastStatus: sast, scaStatus: sca, iacStatus: iac, secretsStatus: secrets, gitlabStatus: gitlab, cloudScanStatus: cloudScan });
        });
        this.teamsTemp = [...this.teams];
      },
      error: (error) => {
        console.error("Error loading teams:", error);
      }
    });
  }
  getRepoScanStatus(repos) {
    const getStatus = (scanType) => {
      const statuses = repos.map((repo) => repo[scanType]);
      if (statuses.includes("DANGER")) {
        return "DANGER";
      } else if (statuses.includes("WARNING")) {
        return "WARNING";
      } else if (statuses.every((status) => status === "NOT_PERFORMED")) {
        return "NOT_PERFORMED";
      } else if (statuses.includes("SUCCESS")) {
        return "SUCCESS";
      }
      return "UNKNOWN";
    };
    return {
      sast: getStatus("sast"),
      sca: getStatus("sca"),
      iac: getStatus("iac"),
      secrets: getStatus("secrets"),
      dast: getStatus("dast"),
      gitlab: getStatus("gitlab")
    };
  }
  getCloudScanStatus(cloudSubscriptions) {
    const statuses = cloudSubscriptions.map((subscription) => subscription.scanStatus);
    if (statuses.includes("DANGER")) {
      return { cloudScan: "DANGER" };
    } else if (statuses.includes("WARNING")) {
      return { cloudScan: "WARNING" };
    } else if (statuses.every((status) => status === "NOT_PERFORMED")) {
      return { cloudScan: "NOT_PERFORMED" };
    } else if (statuses.includes("SUCCESS")) {
      return { cloudScan: "SUCCESS" };
    }
    return { cloudScan: "UNKNOWN" };
  }
  initColumns() {
    this.columns = [
      { name: "Actions", cellTemplate: this.actionsTemplate },
      { prop: "target", name: "Target" },
      { prop: "team", name: "Team" },
      { prop: "apps", name: "Apps" },
      { prop: "risk", name: "Risk" }
    ];
  }
  initCloudColumns() {
    this.cloudColumns = [
      { name: "Actions", cellTemplate: this.actionsTemplate },
      { prop: "cloudSubscription", name: "Cloud Subscription" },
      { prop: "team", name: "Team" },
      { prop: "externalProjectName", name: "External Project Name" },
      { prop: "risk", name: "Risk" }
    ];
  }
  initTeamsColumns() {
    this.teamsColumns = [
      { name: "Actions", cellTemplate: this.actionsTemplate },
      { prop: "name", name: "Name" },
      { prop: "remoteIdentifier", name: "Remote Identifier" },
      { prop: "risk", name: "Risk" }
    ];
  }
  initCharts() {
    this.mainChart = this.#chartsData.mainChart;
  }
  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, "ColorSchemeChange", () => {
      this.setChartStyles();
    });
    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }
  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options = __spreadValues({}, this.mainChart.options);
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = __spreadValues(__spreadValues({}, options.scales), scales);
        this.mainChartRef().update();
      });
    }
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    if (!val) {
      this.rows = [...this.temp];
      return;
    }
    const temp = this.temp.filter((row) => {
      return row.target?.toLowerCase().includes(val) || row.team?.toLowerCase().includes(val) || row.repo_url?.toLowerCase().includes(val) || row.sast?.toLowerCase().includes(val) || row.sca?.toLowerCase().includes(val) || row.secrets?.toLowerCase().includes(val) || row.iac?.toLowerCase().includes(val) || row.gitlab?.toLowerCase().includes(val);
    });
    this.rows = temp;
  }
  updateCloudFilter(event) {
    const val = event.target.value.toLowerCase();
    if (!val) {
      this.cloudRows = [...this.cloudTemp];
      return;
    }
    const cloudTemp = this.cloudTemp.filter((cloudRow) => {
      return cloudRow.name?.toLowerCase().includes(val) || "" || (cloudRow.team?.toLowerCase().includes(val) || "") || (cloudRow.externalProjectName?.toLowerCase().includes(val) || "");
    });
    this.cloudRows = cloudTemp;
  }
  updateTeamsFilter(event) {
    const val = event.target.value.toLowerCase();
    if (!val) {
      this.teams = [...this.teamsTemp];
      return;
    }
    const teamsTemp = this.teamsTemp.filter((team) => {
      return team.name?.toLowerCase().includes(val) || "" || (team.remoteIdentifier?.toLowerCase().includes(val) || "");
    });
    this.teams = teamsTemp;
  }
  updateFilterRepo(event) {
    const val = event.target.value.toLowerCase();
    const filteredRepos = this.tempRepos.filter((d) => d.name.toLowerCase().includes(val) || d.namespace.toLowerCase().includes(val) || d.repo_url.toLowerCase().includes(val));
    this.repoRows = filteredRepos;
  }
  nextPage(row) {
    console.log("Navigating to next page for:", row);
  }
  click(row) {
    this.router.navigate(["/show-repo/" + row.id]);
  }
  cloudClick(row) {
    this.router.navigate(["/show-cloud-subscription/" + row.id]);
  }
  teamClick(row) {
    this.router.navigate(["/show-team/" + row.id]);
  }
  importRepoModal() {
    this.visible = !this.visible;
  }
  handleImportRepoChange(event) {
    this.visible = event;
  }
  handleListRepoChange(event) {
    this.visibleList = event;
  }
  closeModal() {
    this.visible = false;
    this.visibleList = false;
    this.visibleNewTeam = false;
    this.visibleSingleRepoModal = false;
    this.visibleConnectProvider = false;
  }
  closeNewTeamModal() {
    this.visibleNewTeam = false;
  }
  onSubmit() {
    if (this.importRepoForm.valid) {
      this.repoImported.emit(this.importRepoForm.value);
      this.visible = false;
      this.repoUrl = this.importRepoForm.value.repoUrl;
      this.accessToken = this.importRepoForm.value.accessToken;
      this.isLoading = true;
      if (this.selectedRepo === "GitLab") {
        this.gitLabService.setApiUrl(this.repoUrl);
        this.gitLabService.getAllProjects(this.accessToken).subscribe({
          next: (projects) => {
            this.repoRows = projects.map((proj) => ({
              id: proj.id,
              name: proj.name,
              repo_url: proj.web_url,
              namespace: proj.path_with_namespace,
              imported: false
            }));
            this.tempRepos = [...this.repoRows];
            this.visible = false;
            this.visibleList = true;
            this.repoRows.forEach((repoRow) => {
              repoRow.imported = this.rows.some((row) => row.repo_url === repoRow.repo_url);
            });
          },
          error: (error) => {
            console.error("Error fetching projects:", error);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else if (this.selectedRepo === "GitHub") {
        this.gitHubService.setApiUrl(this.repoUrl);
        this.gitHubService.getAllRepositories(this.accessToken).subscribe({
          next: (projects) => {
            this.repoRows = projects.map((proj) => ({
              id: proj.id,
              name: proj.name,
              repo_url: proj.web_url,
              namespace: proj.path_with_namespace,
              imported: false
            }));
            this.tempRepos = [...this.repoRows];
            this.repoRows.forEach((repoRow) => {
              repoRow.imported = this.rows.some((row) => row.repo_url === repoRow.repo_url);
            });
          },
          error: (error) => {
            console.error("Error fetching projects:", error);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else if (this.selectedRepo === "Gitea") {
        this.giteaService.setApiUrl(this.repoUrl);
        this.giteaService.getAllRepositories(this.accessToken).subscribe({
          next: (projects) => {
            this.repoRows = projects.map((proj) => ({
              id: proj.id,
              name: proj.name,
              repo_url: proj.web_url,
              namespace: proj.path_with_namespace,
              imported: false
            }));
            this.tempRepos = [...this.repoRows];
            this.repoRows.forEach((repoRow) => {
              repoRow.imported = this.rows.some((row) => row.repo_url === repoRow.repo_url);
            });
          },
          error: (error) => {
            console.error("Error fetching repositories:", error);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else if (this.selectedRepo === "Bitbucket") {
        this.bitbucketService.setApiUrl(this.repoUrl);
        this.bitbucketService.getAllRepositories(this.accessToken).subscribe({
          next: (projects) => {
            this.repoRows = projects.map((proj) => ({
              id: proj.id,
              name: proj.name,
              repo_url: proj.web_url,
              namespace: proj.path_with_namespace,
              imported: false
            }));
            this.tempRepos = [...this.repoRows];
            this.repoRows.forEach((repoRow) => {
              repoRow.imported = this.rows.some((row) => row.repo_url === repoRow.repo_url);
            });
          },
          error: (error) => {
            console.error("Error fetching repositories:", error);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else {
        this.toastStatus = "danger";
        this.toastMessage = "Unknown repo type.";
        this.toggleToast();
      }
      this.closeModal();
      this.visibleList = true;
    }
  }
  importRepo(row) {
    this.visible = false;
    var repoObject = {
      name: row.namespace,
      remoteId: row.id,
      repoUrl: this.repoUrl,
      accessToken: this.accessToken,
      team: this.importRepoForm.value.team
    };
    if (this.selectedRepo === "GitHub") {
      repoObject.repoUrl = this.gitHubService.gitHubApiUrl;
    } else if (this.selectedRepo === "Gitea") {
      repoObject.repoUrl = this.repoUrl;
    } else if (this.selectedRepo === "Bitbucket") {
      repoObject.repoUrl = this.bitbucketService.getApiUrl();
    }
    row.imported = true;
    this.dashboardService.createRepo(repoObject, this.selectedRepo.toLowerCase()).subscribe({
      next: (response) => {
        this.toastStatus = "success";
        this.toastMessage = "Successfully imported repo: " + this.repoUrl;
        this.toggleToast();
        this.loadCodeRepos();
        this.loadSecurityData();
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = "Problem during repo import. If it will keep occurring contact system administrator.";
        this.toggleToast();
      }
    });
  }
  handleNewTeam(event) {
    this.visibleNewTeam = event;
  }
  createNewTeamModal() {
    this.visibleNewTeam = true;
  }
  toggleToast() {
    this.visibleToast = !this.visibleToast;
  }
  onVisibleChange($event) {
    this.percentage = !this.visible ? 0 : this.percentage;
  }
  onSubmitNewTeam() {
    if (this.newTeamForm.valid) {
      this.teamService.create(this.newTeamForm.value).subscribe({
        next: (response) => {
          this.toastStatus = "success";
          this.toastMessage = "Team created Successfully";
          this.toggleToast();
          this.loadTeams();
        },
        error: (error) => {
          this.toastStatus = "danger";
          this.toastMessage = "Error during team creation, team already exist or You provided empty name.";
          this.toggleToast();
        }
      });
      this.closeNewTeamModal();
    }
  }
  importSingleRepoModal() {
    this.visibleSingleRepoModal = true;
  }
  selectRepoType(type) {
    this.selectedRepo = type;
  }
  handleImportSingleRepoChange(event) {
    this.visibleSingleRepoModal = event;
  }
  onSubmitSingleRepo() {
    if (this.importSingleRepoForm.invalid) {
      this.showToast("danger", "Please fill in all required fields correctly.");
      return;
    }
    const { repoUrl, accessToken, team } = this.importSingleRepoForm.value;
    if (this.selectedRepo === "GitLab") {
      this.gitLabService.setApiUrl(repoUrl);
      this.gitLabService.getProjectDetailsFromUrl(repoUrl, accessToken).subscribe({
        next: (response) => {
          if (!response || !response.id) {
            this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
            return;
          }
          const strippedRepoUrl = this.getBaseUrl(repoUrl);
          const repoObject = {
            name: response.name,
            remoteId: response.id,
            repoUrl: strippedRepoUrl,
            accessToken,
            team
          };
          this.dashboardService.createRepo(repoObject, this.selectedRepo.toLowerCase()).subscribe({
            next: () => {
              this.showToast("success", `Successfully imported repo: ${repoUrl}`);
              this.loadCodeRepos();
              this.loadSecurityData();
              this.visibleSingleRepoModal = false;
            },
            error: () => {
              this.showToast("danger", "Problem during repo import. If it will keep occurring contact system administrator.");
            }
          });
        },
        error: () => {
          this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
        }
      });
    } else if (this.selectedRepo === "Gitea") {
      this.giteaService.setApiUrl(repoUrl);
      this.giteaService.getRepositoryDetailsFromUrl(repoUrl, accessToken).subscribe({
        next: (response) => {
          if (!response || !response.id) {
            this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
            return;
          }
          const strippedRepoUrl = this.getBaseUrl(repoUrl);
          const repoObject = {
            name: response.full_name,
            remoteId: response.id,
            repoUrl: strippedRepoUrl,
            accessToken,
            team
          };
          this.dashboardService.createRepo(repoObject, this.selectedRepo.toLowerCase()).subscribe({
            next: () => {
              this.showToast("success", `Successfully imported repo: ${repoUrl}`);
              this.loadCodeRepos();
              this.loadSecurityData();
              this.visibleSingleRepoModal = false;
            },
            error: () => {
              this.showToast("danger", "Problem during repo import. If it will keep occurring contact system administrator.");
            }
          });
        },
        error: () => {
          this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
        }
      });
    } else if (this.selectedRepo === "GitHub") {
      this.gitHubService.setApiUrl(repoUrl);
      this.gitHubService.getRepositoryDetailsFromUrl(repoUrl, accessToken).subscribe({
        next: (response) => {
          if (!response || !response.id) {
            this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
            return;
          }
          const strippedRepoUrl = this.getBaseUrl(repoUrl);
          const repoObject = {
            name: response.full_name,
            remoteId: response.id,
            repoUrl: strippedRepoUrl.replace("github.com", "api.github.com"),
            accessToken,
            team
          };
          this.dashboardService.createRepo(repoObject, this.selectedRepo.toLowerCase()).subscribe({
            next: () => {
              this.showToast("success", `Successfully imported repo: ${repoUrl}`);
              this.loadCodeRepos();
              this.loadSecurityData();
              this.visibleSingleRepoModal = false;
            },
            error: () => {
              this.showToast("danger", "Problem during repo import. If it will keep occurring contact system administrator.");
            }
          });
        },
        error: () => {
          this.showToast("danger", "Problem loading Git repo details. Make sure that both URL to repo and AccessToken are correct.");
        }
      });
    } else if (this.selectedRepo === "Bitbucket") {
      this.bitbucketService.setApiUrl(repoUrl);
      this.bitbucketService.getRepositoryDetailsFromUrl(repoUrl, accessToken).subscribe({
        next: (response) => {
          if (!response || !response.id) {
            this.showToast("danger", "Problem loading Bitbucket repo details. Make sure that both URL to repo and AccessToken are correct.");
            return;
          }
          const repoObject = {
            name: response.full_name,
            remoteId: response.id,
            repoUrl: this.bitbucketService.getApiUrl(),
            accessToken,
            team
          };
          this.dashboardService.createRepo(repoObject, this.selectedRepo.toLowerCase()).subscribe({
            next: () => {
              this.showToast("success", `Successfully imported repo: ${repoUrl}`);
              this.loadCodeRepos();
              this.loadSecurityData();
              this.visibleSingleRepoModal = false;
            },
            error: () => {
              this.showToast("danger", "Problem during repo import. If it will keep occurring contact system administrator.");
            }
          });
        },
        error: () => {
          this.showToast("danger", "Problem loading Bitbucket repo details. Make sure that both URL to repo and AccessToken are correct.");
        }
      });
    }
  }
  // Helper method to show toast notifications
  showToast(status, message) {
    this.toastStatus = status;
    this.toastMessage = message;
    this.toggleToast();
  }
  // Helper method to get the base URL
  getBaseUrl(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.port ? `${parsedUrl.protocol}//${parsedUrl.host}` : `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (e) {
      console.error("Invalid URL provided:", e);
      return url;
    }
  }
  // Helper methods for provider-specific placeholders and examples
  getRepoUrlPlaceholder() {
    if (this.selectedRepo === "GitLab") {
      return "https://gitlab.com/namespace/project";
    } else if (this.selectedRepo === "GitHub") {
      return "https://github.com/username/repo";
    } else if (this.selectedRepo === "Gitea") {
      return "https://gitea.example.com/username/repo";
    } else if (this.selectedRepo === "Bitbucket") {
      return "https://bitbucket.org/workspace/repo";
    }
    return "https://example.com/username/repo";
  }
  getRepoUrlExample() {
    if (this.selectedRepo === "GitLab") {
      return "https://gitlab.com/namespace/project";
    } else if (this.selectedRepo === "GitHub") {
      return "https://github.com/username/repo";
    } else if (this.selectedRepo === "Gitea") {
      return "https://gitea.example.com/username/repo";
    } else if (this.selectedRepo === "Bitbucket") {
      return "https://bitbucket.org/workspace/repo";
    }
    return "https://example.com/username/repo";
  }
  getBaseUrlPlaceholder() {
    if (this.selectedRepo === "GitLab") {
      return "https://gitlab.com";
    } else if (this.selectedRepo === "GitHub") {
      return "https://github.com";
    } else if (this.selectedRepo === "Gitea") {
      return "https://gitea.example.com";
    } else if (this.selectedRepo === "Bitbucket") {
      return "https://bitbucket.org";
    }
    return "https://example.com";
  }
  getBaseUrlExample() {
    if (this.selectedRepo === "GitLab") {
      return "https://gitlab.com";
    } else if (this.selectedRepo === "GitHub") {
      return "https://github.com";
    } else if (this.selectedRepo === "Gitea") {
      return "https://gitea.example.com";
    } else if (this.selectedRepo === "Bitbucket") {
      return "https://bitbucket.org";
    }
    return "https://example.com";
  }
  getTokenInstructions() {
    if (this.selectedRepo === "GitLab") {
      return "Create token at GitLab > Settings > Access Tokens";
    } else if (this.selectedRepo === "GitHub") {
      return "Create token at GitHub > Settings > Developer settings > Personal access tokens";
    } else if (this.selectedRepo === "Gitea") {
      return "Create token at Gitea > Settings > Applications > Generate New Token";
    } else if (this.selectedRepo === "Bitbucket") {
      return "For App Password use format username:app_password. For OAuth/Access Token paste the token directly.";
    }
    return "Create a personal access token";
  }
  // Add this method to your DashboardComponent class
  toggleStatusLegend() {
    this.showStatusLegend = !this.showStatusLegend;
  }
  /**
   * Determines the overall risk status by finding the highest severity among all scans.
   * The order of severity is DANGER > RUNNING > WARNING > SUCCESS > NOT_PERFORMED.
   * @param row The repository data row.
   * @returns The highest severity status string.
   */
  getOverallRiskStatus(row) {
    const statuses = [row.sast, row.dast, row.sca, row.secrets, row.iac, row.gitlab];
    if (statuses.includes("DANGER"))
      return "DANGER";
    if (statuses.includes("RUNNING"))
      return "RUNNING";
    if (statuses.includes("WARNING"))
      return "WARNING";
    if (statuses.includes("SUCCESS"))
      return "SUCCESS";
    return "NOT_PERFORMED";
  }
  /**
   * Returns the appropriate CSS class for the overall risk indicator's color.
   * @param row The repository data row.
   * @returns A string with the text color class (e.g., 'text-danger').
   */
  getOverallRiskClass(row) {
    const status = this.getOverallRiskStatus(row);
    switch (status) {
      case "DANGER":
        return "text-danger";
      case "WARNING":
        return "text-warning";
      case "SUCCESS":
        return "text-success";
      case "RUNNING":
        return "text-primary";
      default:
        return "text-muted";
    }
  }
  /**
   * Returns the CoreUI icon name based on the overall risk status.
   * @param row The repository data row.
   * @returns A string with the icon name (e.g., 'cil-shield-alt').
   */
  getOverallRiskIcon(row) {
    const status = this.getOverallRiskStatus(row);
    switch (status) {
      case "DANGER":
        return "cil-warning";
      case "WARNING":
        return "cil-shield-alt";
      case "SUCCESS":
        return "cil-check-circle";
      case "RUNNING":
        return "cil-running";
      default:
        return "cil-ban";
    }
  }
  /**
   * Returns the appropriate CSS class for a scan block's background color.
   * @param status The status string of a single scan (e.g., 'DANGER').
   * @returns A string with the status class (e.g., 'status-danger').
   */
  getScanStatusClass(status) {
    if (!status)
      return "status-neutral";
    switch (status.toUpperCase()) {
      case "DANGER":
        return "status-danger";
      case "WARNING":
        return "status-warning";
      case "SUCCESS":
        return "status-success";
      case "RUNNING":
        return "status-running";
      case "NOT_PERFORMED":
      default:
        return "status-neutral";
    }
  }
  static {
    this.\u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DashboardComponent)(\u0275\u0275directiveInject(IconSetService), \u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(GitLabService), \u0275\u0275directiveInject(DashboardService), \u0275\u0275directiveInject(TeamService), \u0275\u0275directiveInject(GitHubService), \u0275\u0275directiveInject(GiteaService), \u0275\u0275directiveInject(BitbucketService), \u0275\u0275directiveInject(CloudService), \u0275\u0275directiveInject(StatsService), \u0275\u0275directiveInject(AppConfigService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["ng-component"]], viewQuery: function DashboardComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c02, 7);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.actionsTemplate = _t.first);
      }
    }, outputs: { repoImported: "repoImported", userRoleSet: "userRoleSet" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 393, vars: 124, consts: [["class", "mb-4", 4, "ngIf"], [1, "mb-4"], [1, "security-overview-card"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "text-muted", "ms-2"], ["color", "link", "cButton", "", "variant", "ghost", 1, "p-0", 3, "click"], ["cIcon", "", 3, "name"], [4, "ngIf"], ["xs", "12"], [3, "activeItemKey"], ["variant", "underline-border"], ["cTab", "", 1, "px-4", "py-3", 3, "itemKey"], ["cIcon", "", "name", "cil-code", 1, "me-2"], ["cIcon", "", "name", "cil-cloud", 1, "me-2"], ["cIcon", "", "name", "cil-people", 1, "me-2"], ["cTab", "", "class", "px-4 py-3", 3, "itemKey", 4, "ngIf"], [1, "p-3", 3, "itemKey"], [1, "dashboard-search-box"], ["cInputGroupText", ""], ["cIcon", "", "name", "cil-magnifying-glass"], ["aria-label", "Filter repositories", "type", "text", "placeholder", "Search repositories by name, team, or status...", 1, "form-control", 3, "input"], [1, "mb-3"], ["cButton", "", "color", "light", "size", "sm", "variant", "ghost", 1, "mb-2", 3, "click"], ["cIcon", "", "name", "cil-info", 1, "me-1"], ["class", "status-legend d-flex gap-4 align-items-center flex-wrap", 4, "ngIf"], [1, "bootstrap", "security-table", 3, "select", "rows", "columns", "selectionType", "selected", "rowIdentity", "selectAllRowsOnPage", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit"], ["name", "", "prop", "name2", 3, "width", "sortable", "resizeable"], ["ngx-datatable-cell-template", ""], ["name", "Repository", "prop", "target", 3, "width"], ["name", "Team", "prop", "team", 3, "width"], ["name", "Security Posture", 3, "width", "sortable"], ["aria-label", "Filter cloud subscriptions", "type", "text", "placeholder", "Search cloud subscriptions...", 1, "form-control", 3, "input"], [1, "bootstrap", "security-table", 3, "rows", "columns", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit"], ["name", "Cloud Subscription", "prop", "cloudSubscription", 3, "width"], ["name", "Cloud Scan", 3, "width"], ["ngx-datatable-header-template", ""], ["aria-label", "Filter teams", "type", "text", "placeholder", "Search teams...", 1, "form-control", 3, "input"], ["name", "Team", "prop", "name", 3, "width"], ["name", "SAST", 3, "width"], ["name", "SCA", 3, "width"], ["name", "Secrets", 3, "width"], ["name", "IaC", 3, "width"], ["class", "p-3", 3, "itemKey", 4, "ngIf"], ["size", "xl", "id", "repoListModal", "alignment", "center", 3, "visibleChange", "visible"], ["cModalTitle", ""], ["class", "text-center p-5", 4, "ngIf"], ["cButton", "", "color", "primary", 3, "click"], ["id", "importRepoModal", "alignment", "center", 3, "visibleChange", "visible"], [1, "alert", "alert-info", "mb-3"], ["cIcon", "", "name", "cil-info", 1, "me-2"], [1, "repo-type-selector", "mb-4"], [1, "d-flex", "justify-content-center", "gap-4"], ["cButton", "", "type", "button", "cTooltip", "Import from GitLab", "cTooltipPlacement", "top", 1, "repo-type-btn", 3, "click"], ["cIcon", "", "name", "cib-gitlab", "size", "3xl"], [1, "repo-type-label"], ["cButton", "", "type", "button", "cTooltip", "Import from GitHub", "cTooltipPlacement", "top", 1, "repo-type-btn", 3, "click"], ["cIcon", "", "name", "cib-github", "size", "3xl"], ["cButton", "", "type", "button", "cTooltip", "Import from Gitea", "cTooltipPlacement", "top", 1, "repo-type-btn", 3, "click"], ["cIcon", "", "name", "cib-gitea", "size", "3xl"], ["cButton", "", "type", "button", "cTooltip", "Import from Bitbucket", "cTooltipPlacement", "top", 1, "repo-type-btn", 3, "click"], ["cIcon", "", "name", "cib-bitbucket", "size", "3xl"], ["cForm", "", 3, "formGroup"], ["for", "repoUrl", 1, "form-label"], ["cTooltip", "The base URL of your Git provider, not a specific repository", "cTooltipPlacement", "top", 1, "text-info", "ms-1"], ["cIcon", "", "name", "cil-info-circle"], [1, "has-validation"], ["cIcon", "", "name", "cil-link"], ["cFormControl", "", "type", "url", "id", "repoUrl", "formControlName", "repoUrl", "required", "", 3, "placeholder"], ["class", "invalid-feedback", 4, "ngIf"], [1, "text-muted", "d-block", "mt-1"], ["cIcon", "", "name", "cil-check-circle", "size", "sm", 1, "me-1", "text-success"], ["cIcon", "", "name", "cil-x-circle", "size", "sm", 1, "me-1", "text-danger"], ["for", "accessToken", 1, "form-label"], ["cTooltip", "Personal access token with repository read permissions", "cTooltipPlacement", "top", 1, "text-info", "ms-1"], ["cIcon", "", "name", "cil-lock-locked"], ["cFormControl", "", "type", "password", "id", "accessToken", "formControlName", "accessToken", "placeholder", "Your access token", "required", ""], [1, "text-muted", "d-flex", "align-items-center", "mt-1"], ["cIcon", "", "name", "cil-info", "size", "sm", 1, "me-1"], ["for", "inputGroupSelect01", 1, "form-label"], ["cTooltip", "Team that will own the imported repositories", "cTooltipPlacement", "top", 1, "text-info", "ms-1"], ["cIcon", "", "name", "cil-people"], ["cSelect", "", "id", "inputGroupSelect01", "formControlName", "team", "required", ""], ["value", "", "disabled", "", "selected", ""], [3, "value", 4, "ngFor", "ngForOf"], ["cButton", "", "color", "secondary", 3, "click"], ["cButton", "", "color", "primary", 3, "click", "disabled"], ["cIcon", "", "name", "cil-cloud-download", 1, "me-1"], ["id", "importSingleRepoModal", "alignment", "center", 3, "visibleChange", "visible"], ["for", "repoUrl2", 1, "form-label"], ["cTooltip", "The full URL to a specific repository", "cTooltipPlacement", "top", 1, "text-info", "ms-1"], ["cFormControl", "", "type", "url", "id", "repoUrl2", "formControlName", "repoUrl", "required", "", 3, "placeholder"], ["for", "accessToken2", 1, "form-label"], ["cFormControl", "", "type", "password", "id", "accessToken2", "formControlName", "accessToken", "placeholder", "Your access token", "required", ""], ["for", "inputGroupSelect02", 1, "form-label"], ["cTooltip", "Team that will own this repository", "cTooltipPlacement", "top", 1, "text-info", "ms-1"], ["cSelect", "", "id", "inputGroupSelect02", "formControlName", "team", "required", ""], ["id", "newTeamModal", "alignment", "center", 3, "visibleChange", "visible"], ["for", "teamName", 1, "form-label"], ["cFormControl", "", "type", "text", "id", "teamName", "formControlName", "name", "placeholder", "Enter team name", "required", ""], ["for", "remoteIdentifier", 1, "form-label"], ["cIcon", "", "name", "cil-blur"], ["cFormControl", "", "type", "text", "id", "remoteIdentifier", "formControlName", "remoteIdentifier", "placeholder", "Remote identifier (optional)"], [1, "text-muted"], ["cIcon", "", "name", "cil-plus", 1, "me-1"], ["position", "fixed", 1, "p-3", 3, "placement"], [3, "visibleChange", "color", "visible", "autohide", "delay"], ["cIcon", "", "name", "cil-bell", 1, "me-2"], [1, "mb-0"], ["id", "connectProviderModal", "alignment", "center", 3, "visibleChange", "visible"], [1, "alert", "alert-info"], [1, "form-label"], [1, "form-check"], ["type", "radio", "id", "gitlabRadio", "name", "providerType", "formControlName", "providerType", "value", "GITLAB", 1, "form-check-input"], ["for", "gitlabRadio", 1, "form-check-label"], ["type", "radio", "id", "githubRadio", "name", "providerType", "formControlName", "providerType", "value", "GITHUB", 1, "form-check-input"], ["for", "githubRadio", 1, "form-check-label"], ["type", "radio", "id", "giteaRadio", "name", "providerType", "formControlName", "providerType", "value", "GITEA", 1, "form-check-input"], ["for", "giteaRadio", 1, "form-check-label"], ["type", "radio", "id", "bitbucketRadio", "name", "providerType", "formControlName", "providerType", "value", "BITBUCKET", 1, "form-check-input"], ["for", "bitbucketRadio", 1, "form-check-label"], ["for", "apiUrl", 1, "form-label"], ["cFormControl", "", "type", "url", "id", "apiUrl", "formControlName", "apiUrl", "placeholder", "e.g., https://api.github.com, https://gitlab.com, https://gitea.example.com, or https://api.bitbucket.org", "required", ""], ["for", "providerAccessToken", 1, "form-label"], ["cFormControl", "", "type", "password", "id", "providerAccessToken", "formControlName", "accessToken", "placeholder", "Provider access token", "required", ""], ["for", "defaultTeam", 1, "form-label"], ["cSelect", "", "id", "defaultTeam", "formControlName", "defaultTeamId", "required", ""], ["id", "changeTeamModal", "alignment", "center", 3, "visibleChange", "visible"], [1, "list-group", "list-group-flush", 2, "max-height", "150px", "overflow-y", "auto"], ["class", "list-group-item py-1 px-0", 4, "ngFor", "ngForOf"], ["for", "newTeamIdSelect", 1, "form-label"], ["cSelect", "", "id", "newTeamIdSelect", "formControlName", "newTeamId", "required", ""], [3, "stats"], [1, "g-3", "mb-4"], ["md", "6", "lg", "3"], [1, "security-summary-card", "d-flex", "align-items-center", "p-3", "h-100", "rounded"], [1, "summary-icon", "total-icon", "me-3"], ["cIcon", "", "name", "cil-list", "size", "xl", 1, "text-white"], [1, "summary-data"], [1, "summary-title", "text-muted"], [1, "summary-value", "fs-4", "fw-bold"], [1, "summary-trend", "d-flex", "align-items-center"], ["cIcon", "", "size", "sm", 1, "me-1", 3, "name"], [3, "ngClass"], [1, "summary-icon", "critical-icon", "me-3"], ["cIcon", "", "name", "cil-warning", "size", "xl", 1, "text-white"], [1, "summary-icon", "fix-time-icon", "me-3"], ["cIcon", "", "name", "cil-clock", "size", "xl", 1, "text-white"], [1, "summary-icon", "score-icon", "me-3"], ["cIcon", "", "name", "cil-storage", "size", "xl", 1, "text-white"], [1, "text-decoration-none", 3, "routerLink"], ["cIcon", "", "name", "cil-arrow-right", "size", "sm"], ["class", "g-3 mb-4", 4, "ngIf"], [1, "chart-container", "p-3", "rounded"], [1, "d-flex", "justify-content-between", "align-items-center", "mb-3"], ["cIcon", "", "name", "cil-chart-line", "width", "16", 1, "me-2", "text-primary"], [1, "btn", "btn-sm", "btn-link", "text-decoration-none", 3, "routerLink"], [2, "height", "240px", "padding-bottom", "20px", "position", "relative", "overflow", "hidden"], ["type", "line", "style", "max-height: 100%; width: 100%;", 3, "data", "options", 4, "ngIf"], ["class", "d-flex justify-content-center align-items-center h-100", 4, "ngIf"], ["class", "d-flex justify-content-center align-items-center h-100 flex-column", 4, "ngIf"], [1, "summary-icon", "team-icon", "me-3"], ["cIcon", "", "name", "cil-people", "size", "xl", 1, "text-white"], [1, "summary-icon", "scan-icon", "me-3"], ["cIcon", "", "name", "cil-magnifying-glass", "size", "xl", 1, "text-white"], [1, "summary-icon", "monthly-icon", "me-3"], ["cIcon", "", "name", "cil-calendar", "size", "xl", 1, "text-white"], [1, "summary-icon", "grade-icon", "me-3"], ["cIcon", "", "name", "cil-shield-alt", "size", "xl", 1, "text-white"], ["type", "line", 2, "max-height", "100%", "width", "100%", 3, "data", "options"], [1, "d-flex", "justify-content-center", "align-items-center", "h-100"], ["color", "primary", "size", "sm", 1, "me-2"], [1, "d-flex", "justify-content-center", "align-items-center", "h-100", "flex-column"], ["cIcon", "", "name", "cil-chart-line", "width", "24", "height", "24", 1, "text-muted", "mb-2"], [1, "text-muted", "mt-1"], [1, "dashboard-actions-card"], [1, "d-flex", "flex-wrap", "gap-3"], ["color", "primary", "cButton", "", "cTooltip", "Import multiple repositories from a Git provider", 3, "click"], ["color", "light", "cButton", "", "cTooltip", "Import a single specific repository", 3, "click"], ["cIcon", "", "name", "cil-clone", 1, "me-2"], ["color", "info", "cButton", "", "cTooltip", "Create a new team", 3, "click", 4, "ngIf"], ["color", "success", "cButton", "", "cTooltip", "Connect to a Git provider to sync all repositories", 3, "click", 4, "ngIf"], ["cButton", "", "color", "primary", 3, "click", 4, "ngIf"], ["color", "info", "cButton", "", "cTooltip", "Create a new team", 3, "click"], ["color", "success", "cButton", "", "cTooltip", "Connect to a Git provider to sync all repositories", 3, "click"], ["cIcon", "", "name", "cil-sync", 1, "me-2"], ["cIcon", "", "name", "cil-pencil", 1, "me-2"], [1, "status-legend", "d-flex", "gap-4", "align-items-center", "flex-wrap"], [1, "legend-item", "d-flex", "align-items-center"], [1, "status-indicator", "danger"], [1, "status-indicator", "warning"], [1, "status-indicator", "success"], [1, "status-indicator", "neutral"], ["size", "sm"], [1, "ms-2"], ["type", "button", 1, "btn", "btn-sm", "btn-primary", 3, "click"], [1, "d-flex", "flex-column"], [1, "fw-bold"], ["target", "_blank", 1, "repo-link", 3, "href"], ["cIcon", "", "name", "cil-external-link", "size", "sm", 1, "me-1"], [1, "team-badge"], [1, "d-flex", "align-items-center", "security-posture-cell"], [1, "overall-risk-indicator", "me-3", 3, "cTooltip"], ["cIcon", "", "size", "lg", 3, "name", "ngClass"], [1, "scan-health-bar", "d-flex", "flex-wrap", "gap-1"], [1, "scan-block", 3, "cTooltip", "ngClass"], ["cTooltip", "Cloud Security Scan", 1, "scan-type-header"], [1, "scan-status-cell"], [1, "scan-status-indicator", 3, "ngClass"], ["cIcon", "", "name", "cil-warning", "size", "md", 4, "ngIf"], ["cIcon", "", "name", "cil-check", "size", "md", 4, "ngIf"], ["cIcon", "", "name", "cil-ban", "size", "md", 4, "ngIf"], ["size", "sm", 4, "ngIf"], ["cIcon", "", "name", "cil-warning", "size", "md"], ["cIcon", "", "name", "cil-check", "size", "md"], ["cIcon", "", "name", "cil-ban", "size", "md"], ["cTooltip", "Static Application Security Testing", 1, "scan-type-header"], ["cTooltip", "Software Composition Analysis", 1, "scan-type-header"], ["cTooltip", "Secret Detection", 1, "scan-type-header"], ["cTooltip", "Infrastructure as Code", 1, "scan-type-header"], ["cTooltip", "GitLab Scan", 1, "scan-type-header"], ["name", "Provider", "prop", "providerType", 3, "width"], ["name", "API URL", "prop", "apiUrl"], ["name", "Default Team", "prop", "defaultTeamName"], ["name", "Last Sync", "prop", "lastSyncDate"], ["name", "Synced Repositories", "prop", "syncedRepoCount"], [1, "d-flex", "align-items-center"], ["cIcon", "", "name", "cib-gitlab", "size", "xl", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cib-github", "size", "xl", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cib-gitea", "size", "xl", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cib-bitbucket", "size", "xl", "class", "me-2", 4, "ngIf"], ["cIcon", "", "name", "cib-gitlab", "size", "xl", 1, "me-2"], ["cIcon", "", "name", "cib-github", "size", "xl", 1, "me-2"], ["cIcon", "", "name", "cib-gitea", "size", "xl", 1, "me-2"], ["cIcon", "", "name", "cib-bitbucket", "size", "xl", 1, "me-2"], [1, "text-center", "p-5"], ["color", "primary", "size", "sm"], [1, "mt-3"], ["type", "text", "placeholder", "Filter repositories...", 1, "form-control", 3, "input"], [1, "bootstrap", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit"], ["name", "Name", "prop", "name"], ["name", "Namespace", "prop", "namespace"], ["name", "URL", "prop", "repo_url"], ["name", "Import", 3, "width", "sortable"], ["cButton", "", "color", "primary", "size", "sm", 3, "click", 4, "ngIf"], ["cButton", "", "color", "success", "size", "sm", "disabled", "", 4, "ngIf"], ["cButton", "", "color", "primary", "size", "sm", 3, "click"], ["cIcon", "", "name", "cil-cloud-download"], ["cButton", "", "color", "success", "size", "sm", "disabled", ""], ["cIcon", "", "name", "cil-check"], [1, "invalid-feedback"], [3, "value"], [1, "list-group-item", "py-1", "px-0"]], template: function DashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, DashboardComponent_c_row_0_Template, 3, 1, "c-row", 0);
        \u0275\u0275elementStart(1, "c-row", 1)(2, "c-col")(3, "c-card", 2)(4, "c-card-header", 3)(5, "div")(6, "strong");
        \u0275\u0275text(7, "Security & Performance Overview");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "small", 4);
        \u0275\u0275text(9, "Key metrics across your organization");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "button", 5);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_10_listener() {
          return ctx.toggleSecurityOverview();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(11, "svg", 6);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(12, DashboardComponent_c_card_body_12_Template, 68, 18, "c-card-body", 7);
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(13, DashboardComponent_c_row_13_Template, 16, 3, "c-row", 0);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(14, "c-row")(15, "c-col", 8)(16, "c-card", 1)(17, "c-card-body")(18, "c-tabs", 9)(19, "c-tabs-list", 10)(20, "button", 11);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(21, "svg", 12);
        \u0275\u0275text(22, " Repositories ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(23, "button", 11);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(24, "svg", 13);
        \u0275\u0275text(25, " Cloud Subscriptions ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(26, "button", 11);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(27, "svg", 14);
        \u0275\u0275text(28, " Teams ");
        \u0275\u0275elementEnd();
        \u0275\u0275template(29, DashboardComponent_button_29_Template, 3, 1, "button", 15);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(30, "c-tabs-content")(31, "c-tab-panel", 16)(32, "c-row", 1)(33, "c-col")(34, "c-input-group", 17)(35, "span", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(36, "svg", 19);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(37, "input", 20);
        \u0275\u0275listener("input", function DashboardComponent_Template_input_input_37_listener($event) {
          return ctx.updateFilter($event);
        });
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(38, "c-row", 21)(39, "c-col")(40, "button", 22);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_40_listener() {
          return ctx.toggleStatusLegend();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(41, "svg", 23);
        \u0275\u0275text(42);
        \u0275\u0275elementEnd();
        \u0275\u0275template(43, DashboardComponent_div_43_Template, 21, 0, "div", 24);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(44, "ngx-datatable", 25);
        \u0275\u0275listener("select", function DashboardComponent_Template_ngx_datatable_select_44_listener($event) {
          return ctx.onSelect($event);
        });
        \u0275\u0275elementStart(45, "ngx-datatable-column", 26);
        \u0275\u0275template(46, DashboardComponent_ng_template_46_Template, 2, 0, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(47, "ngx-datatable-column", 28);
        \u0275\u0275template(48, DashboardComponent_ng_template_48_Template, 7, 3, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(49, "ngx-datatable-column", 29);
        \u0275\u0275template(50, DashboardComponent_ng_template_50_Template, 2, 1, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(51, "ngx-datatable-column", 30);
        \u0275\u0275template(52, DashboardComponent_ng_template_52_Template, 16, 15, "ng-template", 27);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(53, "c-tabs-content")(54, "c-tab-panel", 16)(55, "c-row", 1)(56, "c-col")(57, "c-input-group", 17)(58, "span", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(59, "svg", 19);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(60, "input", 31);
        \u0275\u0275listener("input", function DashboardComponent_Template_input_input_60_listener($event) {
          return ctx.updateCloudFilter($event);
        });
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(61, "ngx-datatable", 32)(62, "ngx-datatable-column", 26);
        \u0275\u0275template(63, DashboardComponent_ng_template_63_Template, 2, 0, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(64, "ngx-datatable-column", 33);
        \u0275\u0275template(65, DashboardComponent_ng_template_65_Template, 5, 2, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(66, "ngx-datatable-column", 29);
        \u0275\u0275template(67, DashboardComponent_ng_template_67_Template, 2, 1, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(68, "ngx-datatable-column", 34);
        \u0275\u0275template(69, DashboardComponent_ng_template_69_Template, 2, 0, "ng-template", 35)(70, DashboardComponent_ng_template_70_Template, 7, 11, "ng-template", 27);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(71, "c-tabs-content")(72, "c-tab-panel", 16)(73, "c-row", 1)(74, "c-col")(75, "c-input-group", 17)(76, "span", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(77, "svg", 19);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(78, "input", 36);
        \u0275\u0275listener("input", function DashboardComponent_Template_input_input_78_listener($event) {
          return ctx.updateTeamsFilter($event);
        });
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(79, "ngx-datatable", 32)(80, "ngx-datatable-column", 26);
        \u0275\u0275template(81, DashboardComponent_ng_template_81_Template, 2, 0, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(82, "ngx-datatable-column", 37);
        \u0275\u0275template(83, DashboardComponent_ng_template_83_Template, 5, 2, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(84, "ngx-datatable-column", 38);
        \u0275\u0275template(85, DashboardComponent_ng_template_85_Template, 2, 0, "ng-template", 35)(86, DashboardComponent_ng_template_86_Template, 7, 11, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(87, "ngx-datatable-column", 39);
        \u0275\u0275template(88, DashboardComponent_ng_template_88_Template, 2, 0, "ng-template", 35)(89, DashboardComponent_ng_template_89_Template, 7, 11, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(90, "ngx-datatable-column", 40);
        \u0275\u0275template(91, DashboardComponent_ng_template_91_Template, 2, 0, "ng-template", 35)(92, DashboardComponent_ng_template_92_Template, 7, 11, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(93, "ngx-datatable-column", 41);
        \u0275\u0275template(94, DashboardComponent_ng_template_94_Template, 2, 0, "ng-template", 35)(95, DashboardComponent_ng_template_95_Template, 7, 11, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(96, "ngx-datatable-column", 34);
        \u0275\u0275template(97, DashboardComponent_ng_template_97_Template, 2, 0, "ng-template", 35)(98, DashboardComponent_ng_template_98_Template, 7, 11, "ng-template", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(99, "ngx-datatable-column", 34);
        \u0275\u0275template(100, DashboardComponent_ng_template_100_Template, 2, 0, "ng-template", 35)(101, DashboardComponent_ng_template_101_Template, 7, 11, "ng-template", 27);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(102, DashboardComponent_c_tab_panel_102_Template, 10, 9, "c-tab-panel", 42);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(103, "c-modal", 43);
        \u0275\u0275listener("visibleChange", function DashboardComponent_Template_c_modal_visibleChange_103_listener($event) {
          return ctx.handleListRepoChange($event);
        });
        \u0275\u0275elementStart(104, "c-modal-header")(105, "h5", 44);
        \u0275\u0275text(106, "Available Repositories");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(107, "c-modal-body");
        \u0275\u0275template(108, DashboardComponent_div_108_Template, 4, 0, "div", 45)(109, DashboardComponent_ng_container_109_Template, 11, 8, "ng-container", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(110, "c-modal-footer")(111, "button", 46);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_111_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(112, "Done");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(113, "c-modal", 47);
        \u0275\u0275listener("visibleChange", function DashboardComponent_Template_c_modal_visibleChange_113_listener($event) {
          return ctx.handleImportRepoChange($event);
        });
        \u0275\u0275elementStart(114, "c-modal-header")(115, "h5", 44);
        \u0275\u0275text(116, "Bulk Import Repositories");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(117, "c-modal-body")(118, "div", 48);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(119, "svg", 49);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(120, "strong");
        \u0275\u0275text(121, "Bulk Import:");
        \u0275\u0275elementEnd();
        \u0275\u0275text(122, " This option allows you to browse and select multiple repositories from a Git provider. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(123, "div", 50)(124, "h6", 21);
        \u0275\u0275text(125, "Select Git Provider");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(126, "div", 51)(127, "button", 52);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_127_listener() {
          return ctx.selectRepoType("GitLab");
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(128, "svg", 53);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(129, "span", 54);
        \u0275\u0275text(130, "GitLab");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(131, "button", 55);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_131_listener() {
          return ctx.selectRepoType("GitHub");
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(132, "svg", 56);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(133, "span", 54);
        \u0275\u0275text(134, "GitHub");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(135, "button", 57);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_135_listener() {
          return ctx.selectRepoType("Gitea");
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(136, "svg", 58);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(137, "span", 54);
        \u0275\u0275text(138, "Gitea");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(139, "button", 59);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_139_listener() {
          return ctx.selectRepoType("Bitbucket");
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(140, "svg", 60);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(141, "span", 54);
        \u0275\u0275text(142, "Bitbucket");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(143, "form", 61)(144, "div", 21)(145, "label", 62);
        \u0275\u0275text(146, " Git Provider URL ");
        \u0275\u0275elementStart(147, "span", 63);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(148, "svg", 64);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(149, "c-input-group", 65)(150, "span", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(151, "svg", 66);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(152, "input", 67);
        \u0275\u0275template(153, DashboardComponent_div_153_Template, 2, 0, "div", 68);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(154, "small", 69);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(155, "svg", 70);
        \u0275\u0275text(156, " Example: ");
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(157, "code");
        \u0275\u0275text(158);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(159, "small", 69);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(160, "svg", 71);
        \u0275\u0275text(161, " Not: ");
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(162, "code");
        \u0275\u0275text(163);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(164, "div", 21)(165, "label", 72);
        \u0275\u0275text(166, " Access Token ");
        \u0275\u0275elementStart(167, "span", 73);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(168, "svg", 64);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(169, "c-input-group", 65)(170, "span", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(171, "svg", 74);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(172, "input", 75);
        \u0275\u0275template(173, DashboardComponent_div_173_Template, 2, 0, "div", 68);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(174, "small", 76);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(175, "svg", 77);
        \u0275\u0275text(176);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(177, "div", 21)(178, "label", 78);
        \u0275\u0275text(179, " Team ");
        \u0275\u0275elementStart(180, "span", 79);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(181, "svg", 64);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(182, "c-input-group", 65)(183, "span", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(184, "svg", 80);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(185, "select", 81)(186, "option", 82);
        \u0275\u0275text(187, "Select Team...");
        \u0275\u0275elementEnd();
        \u0275\u0275template(188, DashboardComponent_option_188_Template, 2, 2, "option", 83);
        \u0275\u0275elementEnd();
        \u0275\u0275template(189, DashboardComponent_div_189_Template, 2, 0, "div", 68);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(190, "c-modal-footer")(191, "button", 84);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_191_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(192, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(193, "button", 85);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_193_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(194, "svg", 86);
        \u0275\u0275text(195, " Browse Repositories ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(196, "c-modal", 87);
        \u0275\u0275listener("visibleChange", function DashboardComponent_Template_c_modal_visibleChange_196_listener($event) {
          return ctx.handleImportSingleRepoChange($event);
        });
        \u0275\u0275elementStart(197, "c-modal-header")(198, "h5", 44);
        \u0275\u0275text(199, "Import Single Repository");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(200, "c-modal-body")(201, "div", 48);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(202, "svg", 49);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(203, "strong");
        \u0275\u0275text(204, "Single Import:");
        \u0275\u0275elementEnd();
        \u0275\u0275text(205, " This option allows you to import a specific repository by providing its direct URL. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(206, "div", 50)(207, "h6", 21);
        \u0275\u0275text(208, "Select Git Provider");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(209, "div", 51)(210, "button", 52);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_210_listener() {
          return ctx.selectRepoType("GitLab");
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(211, "svg", 53);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(212, "span", 54);
        \u0275\u0275text(213, "GitLab");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(214, "button", 55);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_214_listener() {
          return ctx.selectRepoType("GitHub");
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(215, "svg", 56);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(216, "span", 54);
        \u0275\u0275text(217, "GitHub");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(218, "button", 57);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_218_listener() {
          return ctx.selectRepoType("Gitea");
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(219, "svg", 58);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(220, "span", 54);
        \u0275\u0275text(221, "Gitea");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(222, "button", 59);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_222_listener() {
          return ctx.selectRepoType("Bitbucket");
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(223, "svg", 60);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(224, "span", 54);
        \u0275\u0275text(225, "Bitbucket");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(226, "form", 61)(227, "div", 21)(228, "label", 88);
        \u0275\u0275text(229, " Repository URL ");
        \u0275\u0275elementStart(230, "span", 89);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(231, "svg", 64);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(232, "c-input-group", 65)(233, "span", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(234, "svg", 66);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(235, "input", 90);
        \u0275\u0275template(236, DashboardComponent_div_236_Template, 2, 0, "div", 68);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(237, "small", 69);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(238, "svg", 70);
        \u0275\u0275text(239, " Example: ");
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(240, "code");
        \u0275\u0275text(241);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(242, "small", 69);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(243, "svg", 71);
        \u0275\u0275text(244, " Not: ");
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(245, "code");
        \u0275\u0275text(246);
        \u0275\u0275elementEnd();
        \u0275\u0275text(247, " (base URL only) ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(248, "div", 21)(249, "label", 91);
        \u0275\u0275text(250, " Access Token ");
        \u0275\u0275elementStart(251, "span", 73);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(252, "svg", 64);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(253, "c-input-group", 65)(254, "span", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(255, "svg", 74);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(256, "input", 92);
        \u0275\u0275template(257, DashboardComponent_div_257_Template, 2, 0, "div", 68);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(258, "small", 76);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(259, "svg", 77);
        \u0275\u0275text(260);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(261, "div", 21)(262, "label", 93);
        \u0275\u0275text(263, " Team ");
        \u0275\u0275elementStart(264, "span", 94);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(265, "svg", 64);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(266, "c-input-group", 65)(267, "span", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(268, "svg", 80);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(269, "select", 95)(270, "option", 82);
        \u0275\u0275text(271, "Select Team...");
        \u0275\u0275elementEnd();
        \u0275\u0275template(272, DashboardComponent_option_272_Template, 2, 2, "option", 83);
        \u0275\u0275elementEnd();
        \u0275\u0275template(273, DashboardComponent_div_273_Template, 2, 0, "div", 68);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(274, "c-modal-footer")(275, "button", 84);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_275_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(276, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(277, "button", 85);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_277_listener() {
          return ctx.onSubmitSingleRepo();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(278, "svg", 86);
        \u0275\u0275text(279, " Import Repository ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(280, "c-modal", 96);
        \u0275\u0275listener("visibleChange", function DashboardComponent_Template_c_modal_visibleChange_280_listener($event) {
          return ctx.handleNewTeam($event);
        });
        \u0275\u0275elementStart(281, "c-modal-header")(282, "h5", 44);
        \u0275\u0275text(283, "Add New Team");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(284, "c-modal-body")(285, "form", 61)(286, "div", 21)(287, "label", 97);
        \u0275\u0275text(288, "Team Name");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(289, "c-input-group", 65)(290, "span", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(291, "svg", 80);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(292, "input", 98);
        \u0275\u0275template(293, DashboardComponent_div_293_Template, 2, 0, "div", 68);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(294, "div", 21)(295, "label", 99);
        \u0275\u0275text(296, "Remote Identifier (Optional)");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(297, "c-input-group")(298, "span", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(299, "svg", 100);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(300, "input", 101);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(301, "small", 102);
        \u0275\u0275text(302, "Used for mapping to external systems");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(303, "c-modal-footer")(304, "button", 84);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_304_listener() {
          return ctx.closeNewTeamModal();
        });
        \u0275\u0275text(305, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(306, "button", 85);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_306_listener() {
          return ctx.onSubmitNewTeam();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(307, "svg", 103);
        \u0275\u0275text(308, " Create Team ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(309, "c-toaster", 104)(310, "c-toast", 105);
        \u0275\u0275listener("visibleChange", function DashboardComponent_Template_c_toast_visibleChange_310_listener($event) {
          return ctx.onVisibleChange($event);
        });
        \u0275\u0275elementStart(311, "c-toast-header");
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(312, "svg", 106);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(313, "strong");
        \u0275\u0275text(314, "Notification");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(315, "c-toast-body")(316, "p", 107);
        \u0275\u0275text(317);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(318, "c-modal", 108);
        \u0275\u0275listener("visibleChange", function DashboardComponent_Template_c_modal_visibleChange_318_listener($event) {
          return ctx.handleConnectProviderChange($event);
        });
        \u0275\u0275elementStart(319, "c-modal-header")(320, "h5", 44);
        \u0275\u0275text(321, "Connect Repository Provider");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(322, "c-modal-body")(323, "div", 109);
        \u0275\u0275text(324, " Connect to a Git provider to automatically discover and import all accessible repositories into a default team. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(325, "form", 61)(326, "div", 21)(327, "label", 110);
        \u0275\u0275text(328, "Git Provider");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(329, "div", 111);
        \u0275\u0275element(330, "input", 112);
        \u0275\u0275elementStart(331, "label", 113);
        \u0275\u0275text(332, "GitLab");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(333, "div", 111);
        \u0275\u0275element(334, "input", 114);
        \u0275\u0275elementStart(335, "label", 115);
        \u0275\u0275text(336, "GitHub");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(337, "div", 111);
        \u0275\u0275element(338, "input", 116);
        \u0275\u0275elementStart(339, "label", 117);
        \u0275\u0275text(340, "Gitea");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(341, "div", 111);
        \u0275\u0275element(342, "input", 118);
        \u0275\u0275elementStart(343, "label", 119);
        \u0275\u0275text(344, "Bitbucket");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(345, "div", 21)(346, "label", 120);
        \u0275\u0275text(347, "API URL");
        \u0275\u0275elementEnd();
        \u0275\u0275element(348, "input", 121);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(349, "div", 21)(350, "label", 122);
        \u0275\u0275text(351, "Access Token");
        \u0275\u0275elementEnd();
        \u0275\u0275element(352, "input", 123);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(353, "div", 21)(354, "label", 124);
        \u0275\u0275text(355, "Default Team");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(356, "select", 125)(357, "option", 82);
        \u0275\u0275text(358, "Assign to team...");
        \u0275\u0275elementEnd();
        \u0275\u0275template(359, DashboardComponent_option_359_Template, 2, 2, "option", 83);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(360, "c-modal-footer")(361, "button", 84);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_361_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(362, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(363, "button", 85);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_363_listener() {
          return ctx.onSubmitConnectProvider();
        });
        \u0275\u0275text(364, " Connect and Sync ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(365, "c-modal", 126);
        \u0275\u0275listener("visibleChange", function DashboardComponent_Template_c_modal_visibleChange_365_listener($event) {
          return ctx.handleChangeTeamModalChange($event);
        });
        \u0275\u0275elementStart(366, "c-modal-header")(367, "h5", 44);
        \u0275\u0275text(368, "Change Team for Selected Repositories");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(369, "c-modal-body")(370, "p");
        \u0275\u0275text(371, "You are about to change the team for ");
        \u0275\u0275elementStart(372, "strong");
        \u0275\u0275text(373);
        \u0275\u0275elementEnd();
        \u0275\u0275text(374, " selected repositories.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(375, "div", 21)(376, "small");
        \u0275\u0275text(377, "Repositories:");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(378, "ul", 127);
        \u0275\u0275template(379, DashboardComponent_li_379_Template, 2, 1, "li", 128);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(380, "form", 61)(381, "div", 21)(382, "label", 129);
        \u0275\u0275text(383, "New Team");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(384, "select", 130)(385, "option", 82);
        \u0275\u0275text(386, "Select new team...");
        \u0275\u0275elementEnd();
        \u0275\u0275template(387, DashboardComponent_option_387_Template, 2, 2, "option", 83);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(388, "c-modal-footer")(389, "button", 84);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_389_listener() {
          return ctx.visibleChangeTeamModal = false;
        });
        \u0275\u0275text(390, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(391, "button", 85);
        \u0275\u0275listener("click", function DashboardComponent_Template_button_click_391_listener() {
          return ctx.onSubmitChangeTeam();
        });
        \u0275\u0275text(392, " Change Team ");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        let tmp_73_0;
        let tmp_76_0;
        let tmp_79_0;
        let tmp_88_0;
        let tmp_91_0;
        let tmp_94_0;
        let tmp_98_0;
        \u0275\u0275property("ngIf", ctx.widgetStats && !ctx.showSecurityOverview);
        \u0275\u0275advance(11);
        \u0275\u0275property("name", ctx.showSecurityOverview ? "cil-chevron-top" : "cil-chevron-bottom");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showSecurityOverview);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.canManage);
        \u0275\u0275advance(5);
        \u0275\u0275property("activeItemKey", 0);
        \u0275\u0275advance(2);
        \u0275\u0275property("itemKey", 0);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 1);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 2);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.isAdmin);
        \u0275\u0275advance(2);
        \u0275\u0275property("itemKey", 0);
        \u0275\u0275advance(11);
        \u0275\u0275textInterpolate1(" ", ctx.showStatusLegend ? "Hide Status Legend" : "View Status Legend", " ");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showStatusLegend);
        \u0275\u0275advance();
        \u0275\u0275property("rows", ctx.rows)("columns", ctx.columns)("selectionType", ctx.selectionType.multiClick)("selected", ctx.selectedRepos)("rowIdentity", ctx.rowIdentity)("selectAllRowsOnPage", false)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", 10);
        \u0275\u0275advance();
        \u0275\u0275property("width", 60)("sortable", false)("resizeable", false);
        \u0275\u0275advance(2);
        \u0275\u0275property("width", 350);
        \u0275\u0275advance(2);
        \u0275\u0275property("width", 150);
        \u0275\u0275advance(2);
        \u0275\u0275property("width", 320)("sortable", false);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 1);
        \u0275\u0275advance(7);
        \u0275\u0275property("rows", ctx.cloudRows)("columns", ctx.cloudColumns)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", 10);
        \u0275\u0275advance();
        \u0275\u0275property("width", 60)("sortable", false)("resizeable", false);
        \u0275\u0275advance(2);
        \u0275\u0275property("width", 350);
        \u0275\u0275advance(2);
        \u0275\u0275property("width", 150);
        \u0275\u0275advance(2);
        \u0275\u0275property("width", 100);
        \u0275\u0275advance(4);
        \u0275\u0275property("itemKey", 2);
        \u0275\u0275advance(7);
        \u0275\u0275property("rows", ctx.teams)("columns", ctx.teamsColumns)("columnMode", "force")("footerHeight", 50)("headerHeight", 50)("rowHeight", "auto")("limit", 10);
        \u0275\u0275advance();
        \u0275\u0275property("width", 60)("sortable", false)("resizeable", false);
        \u0275\u0275advance(2);
        \u0275\u0275property("width", 350);
        \u0275\u0275advance(2);
        \u0275\u0275property("width", 100);
        \u0275\u0275advance(3);
        \u0275\u0275property("width", 100);
        \u0275\u0275advance(3);
        \u0275\u0275property("width", 100);
        \u0275\u0275advance(3);
        \u0275\u0275property("width", 100);
        \u0275\u0275advance(3);
        \u0275\u0275property("width", 100);
        \u0275\u0275advance(3);
        \u0275\u0275property("width", 100);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.isAdmin);
        \u0275\u0275advance();
        \u0275\u0275property("visible", ctx.visibleList);
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading);
        \u0275\u0275advance(4);
        \u0275\u0275property("visible", ctx.visible);
        \u0275\u0275advance(14);
        \u0275\u0275classProp("active", ctx.selectedRepo === "GitLab");
        \u0275\u0275advance(4);
        \u0275\u0275classProp("active", ctx.selectedRepo === "GitHub");
        \u0275\u0275advance(4);
        \u0275\u0275classProp("active", ctx.selectedRepo === "Gitea");
        \u0275\u0275advance(4);
        \u0275\u0275classProp("active", ctx.selectedRepo === "Bitbucket");
        \u0275\u0275advance(4);
        \u0275\u0275property("formGroup", ctx.importRepoForm);
        \u0275\u0275advance(9);
        \u0275\u0275property("placeholder", ctx.getBaseUrlPlaceholder());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ((tmp_73_0 = ctx.importRepoForm.get("repoUrl")) == null ? null : tmp_73_0.invalid) && ((tmp_73_0 = ctx.importRepoForm.get("repoUrl")) == null ? null : tmp_73_0.touched));
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.getBaseUrlExample());
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.getRepoUrlExample());
        \u0275\u0275advance(10);
        \u0275\u0275property("ngIf", ((tmp_76_0 = ctx.importRepoForm.get("accessToken")) == null ? null : tmp_76_0.invalid) && ((tmp_76_0 = ctx.importRepoForm.get("accessToken")) == null ? null : tmp_76_0.touched));
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", ctx.getTokenInstructions(), " ");
        \u0275\u0275advance(12);
        \u0275\u0275property("ngForOf", ctx.teams);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ((tmp_79_0 = ctx.importRepoForm.get("team")) == null ? null : tmp_79_0.invalid) && ((tmp_79_0 = ctx.importRepoForm.get("team")) == null ? null : tmp_79_0.touched));
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.importRepoForm.invalid);
        \u0275\u0275advance(3);
        \u0275\u0275property("visible", ctx.visibleSingleRepoModal);
        \u0275\u0275advance(14);
        \u0275\u0275classProp("active", ctx.selectedRepo === "GitLab");
        \u0275\u0275advance(4);
        \u0275\u0275classProp("active", ctx.selectedRepo === "GitHub");
        \u0275\u0275advance(4);
        \u0275\u0275classProp("active", ctx.selectedRepo === "Gitea");
        \u0275\u0275advance(4);
        \u0275\u0275classProp("active", ctx.selectedRepo === "Bitbucket");
        \u0275\u0275advance(4);
        \u0275\u0275property("formGroup", ctx.importSingleRepoForm);
        \u0275\u0275advance(9);
        \u0275\u0275property("placeholder", ctx.getRepoUrlPlaceholder());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ((tmp_88_0 = ctx.importSingleRepoForm.get("repoUrl")) == null ? null : tmp_88_0.invalid) && ((tmp_88_0 = ctx.importSingleRepoForm.get("repoUrl")) == null ? null : tmp_88_0.touched));
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.getRepoUrlExample());
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.getBaseUrlExample());
        \u0275\u0275advance(11);
        \u0275\u0275property("ngIf", ((tmp_91_0 = ctx.importSingleRepoForm.get("accessToken")) == null ? null : tmp_91_0.invalid) && ((tmp_91_0 = ctx.importSingleRepoForm.get("accessToken")) == null ? null : tmp_91_0.touched));
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", ctx.getTokenInstructions(), " ");
        \u0275\u0275advance(12);
        \u0275\u0275property("ngForOf", ctx.teams);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ((tmp_94_0 = ctx.importSingleRepoForm.get("team")) == null ? null : tmp_94_0.invalid) && ((tmp_94_0 = ctx.importSingleRepoForm.get("team")) == null ? null : tmp_94_0.touched));
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.importSingleRepoForm.invalid);
        \u0275\u0275advance(3);
        \u0275\u0275property("visible", ctx.visibleNewTeam);
        \u0275\u0275advance(5);
        \u0275\u0275property("formGroup", ctx.newTeamForm);
        \u0275\u0275advance(8);
        \u0275\u0275property("ngIf", ((tmp_98_0 = ctx.newTeamForm.get("name")) == null ? null : tmp_98_0.invalid) && ((tmp_98_0 = ctx.newTeamForm.get("name")) == null ? null : tmp_98_0.touched));
        \u0275\u0275advance(13);
        \u0275\u0275property("disabled", ctx.newTeamForm.invalid);
        \u0275\u0275advance(3);
        \u0275\u0275property("placement", ctx.position);
        \u0275\u0275advance();
        \u0275\u0275property("color", ctx.toastStatus)("visible", ctx.visibleToast)("autohide", true)("delay", 5e3);
        \u0275\u0275advance(7);
        \u0275\u0275textInterpolate(ctx.toastMessage);
        \u0275\u0275advance();
        \u0275\u0275property("visible", ctx.visibleConnectProvider);
        \u0275\u0275advance(7);
        \u0275\u0275property("formGroup", ctx.connectProviderForm);
        \u0275\u0275advance(34);
        \u0275\u0275property("ngForOf", ctx.teams);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.connectProviderForm.invalid);
        \u0275\u0275advance(2);
        \u0275\u0275property("visible", ctx.visibleChangeTeamModal);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.selectedRepos.length);
        \u0275\u0275advance(6);
        \u0275\u0275property("ngForOf", ctx.selectedRepos);
        \u0275\u0275advance();
        \u0275\u0275property("formGroup", ctx.changeTeamForm);
        \u0275\u0275advance(7);
        \u0275\u0275property("ngForOf", ctx.teams);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.changeTeamForm.invalid);
      }
    }, dependencies: [
      WidgetsDropdownComponent,
      CardComponent,
      CardBodyComponent,
      RowComponent,
      ColComponent,
      ButtonDirective,
      IconDirective,
      ReactiveFormsModule,
      \u0275NgNoValidate,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      SelectControlValueAccessor,
      RadioControlValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      RequiredValidator,
      FormGroupDirective,
      FormControlName,
      ChartjsComponent,
      CardHeaderComponent,
      NgxDatatableModule,
      DatatableComponent,
      DataTableColumnDirective,
      DataTableColumnHeaderDirective,
      DataTableColumnCellDirective,
      ModalComponent,
      ModalHeaderComponent,
      ModalBodyComponent,
      ModalFooterComponent,
      InputGroupComponent,
      InputGroupTextDirective,
      FormControlDirective,
      NgIf,
      FormSelectDirective,
      FormDirective,
      ModalTitleDirective,
      SpinnerComponent,
      TooltipDirective,
      NgForOf,
      ToasterComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToastBodyComponent,
      TabDirective,
      TabsComponent,
      TabsListComponent,
      TabsContentComponent,
      TabPanelComponent,
      NgClass,
      RouterLink,
      DatePipe
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.dashboard-actions-card[_ngcontent-%COMP%] {\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n  transition: box-shadow 0.3s ease;\n}\n.dashboard-actions-card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);\n}\n.security-overview-card[_ngcontent-%COMP%] {\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n  transition: box-shadow 0.3s ease;\n}\n.security-overview-card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);\n}\n.security-overview-card[_ngcontent-%COMP%]   .security-summary-card[_ngcontent-%COMP%] {\n  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.03);\n  transition: transform 0.2s, box-shadow 0.2s;\n  background-color: var(--cui-card-bg, #fff);\n  border: 1px solid var(--cui-card-border-color, rgba(0, 0, 21, 0.125));\n}\n.security-overview-card[_ngcontent-%COMP%]   .security-summary-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-icon[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-icon.total-icon[_ngcontent-%COMP%] {\n  background-color: #0d6efd;\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-icon.critical-icon[_ngcontent-%COMP%] {\n  background-color: #dc3545;\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-icon.fix-time-icon[_ngcontent-%COMP%] {\n  background-color: #6f42c1;\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-icon.team-icon[_ngcontent-%COMP%] {\n  background-color: #0d6efd;\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-icon.scan-icon[_ngcontent-%COMP%] {\n  background-color: #198754;\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-icon.monthly-icon[_ngcontent-%COMP%] {\n  background-color: #0dcaf0;\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-icon.grade-icon[_ngcontent-%COMP%] {\n  background-color: #6610f2;\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-data[_ngcontent-%COMP%]   .summary-title[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--cui-text-muted, #768192);\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-data[_ngcontent-%COMP%]   .summary-value[_ngcontent-%COMP%] {\n  line-height: 1.2;\n  margin: 0.25rem 0;\n  color: var(--cui-body-color, #3c4b64);\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-data[_ngcontent-%COMP%]   .summary-trend[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-data[_ngcontent-%COMP%]   .summary-trend[_ngcontent-%COMP%]   .text-success[_ngcontent-%COMP%] {\n  color: var(--cui-success, #198754) !important;\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-data[_ngcontent-%COMP%]   .summary-trend[_ngcontent-%COMP%]   .text-danger[_ngcontent-%COMP%] {\n  color: var(--cui-danger, #dc3545) !important;\n}\n.security-overview-card[_ngcontent-%COMP%]   .summary-data[_ngcontent-%COMP%]   .summary-trend[_ngcontent-%COMP%]   .text-muted[_ngcontent-%COMP%] {\n  color: var(--cui-text-muted, #768192) !important;\n}\n.security-overview-card[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%] {\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n  transition: all 0.3s ease;\n  background-color: var(--cui-card-bg, #fff);\n  border: 1px solid var(--cui-card-border-color, rgba(0, 0, 21, 0.125));\n  border-radius: 8px;\n  margin-bottom: 15px;\n}\n.security-overview-card[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);\n}\n.security-overview-card[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%]   h6[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--cui-body-color, #3c4b64);\n}\n.security-overview-card[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%] {\n  display: block;\n  max-width: 100%;\n  height: auto !important;\n}\n.security-overview-card[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%]   .d-flex[_ngcontent-%COMP%] {\n  padding: 0 6px;\n}\n.security-overview-card[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%]   .d-flex[_ngcontent-%COMP%]   h6[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  letter-spacing: 0.2px;\n}\n.security-overview-card[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%]   .d-flex[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n  font-weight: 500;\n}\n.security-overview-card[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%]   .d-flex[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]:hover {\n  transform: translateX(2px);\n}\n.security-overview-card[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%]   .d-flex[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: transform 0.2s ease;\n}\n.security-overview-card[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%]   .d-flex[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  transform: translateX(2px);\n}\n.dashboard-search-box[_ngcontent-%COMP%] {\n  max-width: 100%;\n  margin-bottom: 1rem;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);\n  transition: all 0.3s ease;\n}\n.dashboard-search-box[_ngcontent-%COMP%]:focus-within {\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);\n}\n.dashboard-search-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border-radius: 0 4px 4px 0;\n  padding: 0.75rem 1rem;\n}\n.dashboard-search-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  border-color: #47a3f3;\n  box-shadow: none;\n}\n.dashboard-search-box[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  border-right: none;\n}\n.dashboard-search-box[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: inherit;\n}\n.status-legend[_ngcontent-%COMP%] {\n  padding: 0.5rem 0;\n}\n.status-legend[_ngcontent-%COMP%]   .legend-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-right: 1rem;\n}\n.status-legend[_ngcontent-%COMP%]   .legend-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-left: 0.35rem;\n  font-size: 0.8rem;\n  color: #6c757d;\n}\n.status-indicator[_ngcontent-%COMP%] {\n  width: 1rem;\n  height: 1rem;\n  border-radius: 50%;\n  display: inline-block;\n}\n.status-indicator.danger[_ngcontent-%COMP%] {\n  background-color: #e55353;\n}\n.status-indicator.warning[_ngcontent-%COMP%] {\n  background-color: #f9b115;\n}\n.status-indicator.success[_ngcontent-%COMP%] {\n  background-color: #2eb85c;\n}\n.status-indicator.neutral[_ngcontent-%COMP%] {\n  background-color: #ced2d8;\n}\n.security-table[_ngcontent-%COMP%] {\n  border-radius: 4px;\n  overflow: hidden;\n}\n.security-table[_ngcontent-%COMP%]   .datatable-header-cell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 0.75rem 1rem;\n  background-color: #f8f9fa;\n  border-bottom: 1px solid rgba(0, 0, 21, 0.125);\n  height: auto;\n  min-height: 50px;\n}\n.security-table[_ngcontent-%COMP%]   .datatable-header-cell[_ngcontent-%COMP%]   .datatable-header-cell-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  justify-content: center;\n}\n.security-table[_ngcontent-%COMP%]   .datatable-header-cell[_ngcontent-%COMP%]   .datatable-header-cell-label[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n.security-table[_ngcontent-%COMP%]   .scan-type-header[_ngcontent-%COMP%] {\n  display: inline-block;\n  text-align: center;\n  font-weight: 600;\n  color: #3c4b64;\n  white-space: nowrap;\n  width: 100%;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-cell[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  padding: 0.5rem;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 2.5rem;\n  height: 2.5rem;\n  border-radius: 50%;\n  margin: 0 auto;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-indicator[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 1.25rem;\n  height: 1.25rem;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-indicator.danger[_ngcontent-%COMP%] {\n  background-color: rgba(229, 83, 83, 0.15);\n  color: #e55353;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-indicator.warning[_ngcontent-%COMP%] {\n  background-color: rgba(249, 177, 21, 0.15);\n  color: #f9b115;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-indicator.success[_ngcontent-%COMP%] {\n  background-color: rgba(46, 184, 92, 0.15);\n  color: #2eb85c;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-indicator.neutral[_ngcontent-%COMP%] {\n  background-color: rgba(206, 210, 216, 0.15);\n  color: #8a93a2;\n}\n.security-table[_ngcontent-%COMP%]   .datatable-body-cell[_ngcontent-%COMP%] {\n  text-align: center;\n  vertical-align: middle;\n}\n.security-table[_ngcontent-%COMP%]   .datatable-header-cell[_ngcontent-%COMP%] {\n  text-align: center;\n  vertical-align: middle;\n}\n.repo-link[_ngcontent-%COMP%] {\n  color: #768192;\n  text-decoration: none;\n  transition: color 0.2s ease;\n}\n.repo-link[_ngcontent-%COMP%]:hover {\n  color: #321fdb;\n  text-decoration: underline;\n}\n.team-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.25rem 0.75rem;\n  border-radius: 16px;\n  background-color: #ebedef;\n  color: #4f5d73;\n  font-size: 0.85rem;\n  font-weight: 500;\n}\n.repo-type-selector[_ngcontent-%COMP%]   h6[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #3c4b64;\n}\n.repo-type-btn[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 120px;\n  height: 120px;\n  border-radius: 8px;\n  transition: all 0.2s ease;\n  background-color: #f8f9fa;\n  border: 2px solid transparent;\n}\n.repo-type-btn[_ngcontent-%COMP%]:hover {\n  background-color: #ebedef;\n}\n.repo-type-btn.active[_ngcontent-%COMP%] {\n  border-color: #321fdb;\n  background-color: rgba(50, 31, 219, 0.1);\n}\n.repo-type-btn[_ngcontent-%COMP%]   .repo-type-label[_ngcontent-%COMP%] {\n  margin-top: 0.75rem;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.repo-type-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n}\n.team-members-count[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  color: #768192;\n  font-size: 0.9rem;\n}\nc-modal[_ngcontent-%COMP%]   c-modal-header[_ngcontent-%COMP%] {\n  border-bottom: 1px solid rgba(0, 0, 21, 0.1);\n}\nc-modal[_ngcontent-%COMP%]   c-modal-footer[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(0, 0, 21, 0.1);\n}\nc-modal[_ngcontent-%COMP%]   label.form-label[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: #3c4b64;\n  margin-bottom: 0.35rem;\n}\nc-modal[_ngcontent-%COMP%]   small.text-muted[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #768192;\n}\nc-toast[_ngcontent-%COMP%] {\n  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);\n}\nc-toast[_ngcontent-%COMP%]   c-toast-header[_ngcontent-%COMP%] {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n@media (max-width: 767.98px) {\n  .security-summary-card[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n  .chart-container[_ngcontent-%COMP%] {\n    margin-top: 1rem;\n  }\n}\n.security-table[_ngcontent-%COMP%] {\n  border-radius: 4px;\n  overflow: hidden;\n}\n.security-table[_ngcontent-%COMP%]   .datatable-header-cell[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--cui-body-color, #3c4b64);\n  padding: 0.75rem 1rem;\n  background-color: #f8f9fa;\n  border-bottom: 1px solid rgba(0, 0, 21, 0.125);\n}\n.security-table[_ngcontent-%COMP%]   .datatable-body-row[_ngcontent-%COMP%] {\n  border-bottom: 1px solid rgba(0, 0, 21, 0.075);\n  transition: background-color 0.2s ease;\n}\n.security-table[_ngcontent-%COMP%]   .datatable-body-row[_ngcontent-%COMP%]:hover {\n  background-color: rgba(0, 0, 21, 0.03);\n}\n.security-table[_ngcontent-%COMP%]   .datatable-body-cell[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  vertical-align: middle;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-cell[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 2.5rem;\n  height: 2.5rem;\n  border-radius: 50%;\n  color: white;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-indicator.danger[_ngcontent-%COMP%] {\n  background-color: rgba(229, 83, 83, 0.15);\n  color: #e55353;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-indicator.warning[_ngcontent-%COMP%] {\n  background-color: rgba(249, 177, 21, 0.15);\n  color: #f9b115;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-indicator.success[_ngcontent-%COMP%] {\n  background-color: rgba(46, 184, 92, 0.15);\n  color: #2eb85c;\n}\n.security-table[_ngcontent-%COMP%]   .scan-status-indicator.neutral[_ngcontent-%COMP%] {\n  background-color: rgba(206, 210, 216, 0.15);\n  color: #8a93a2;\n}\n.security-table[_ngcontent-%COMP%]   .scan-type-header[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #3c4b64;\n  white-space: nowrap;\n}\n.team-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.25rem 0.75rem;\n  border-radius: 16px;\n  background-color: #ebedef;\n  color: #4f5d73;\n  font-size: 0.85rem;\n  font-weight: 500;\n}\n.status-legend[_ngcontent-%COMP%] {\n  padding: 0.5rem 0;\n  margin-bottom: 1rem;\n}\n.status-legend[_ngcontent-%COMP%]   .legend-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-right: 1rem;\n}\n.status-legend[_ngcontent-%COMP%]   .legend-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-left: 0.35rem;\n  font-size: 0.8rem;\n  color: #6c757d;\n}\n.security-posture-cell[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 40px;\n}\n.overall-risk-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.scan-health-bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.scan-block[_ngcontent-%COMP%] {\n  display: inline-block;\n  font-size: 0.7rem;\n  font-weight: 600;\n  padding: 0.25em 0.6em;\n  border-radius: 4px;\n  color: #fff;\n  text-align: center;\n  letter-spacing: 0.5px;\n  line-height: 1.2;\n}\n.status-danger[_ngcontent-%COMP%] {\n  background-color: #dc3545;\n}\n.status-warning[_ngcontent-%COMP%] {\n  background-color: #fd7e14;\n}\n.status-success[_ngcontent-%COMP%] {\n  background-color: #2eb85c;\n}\n.status-neutral[_ngcontent-%COMP%] {\n  background-color: #adb5bd;\n}\n.status-running[_ngcontent-%COMP%] {\n  background-color: #3399ff;\n  animation: _ngcontent-%COMP%_pulse-animation 1.5s infinite;\n}\n@keyframes _ngcontent-%COMP%_pulse-animation {\n  0% {\n    box-shadow: 0 0 0 0 rgba(51, 153, 255, 0.7);\n  }\n  100% {\n    box-shadow: 0 0 0 10px rgba(51, 153, 255, 0);\n  }\n}\n/*# sourceMappingURL=dashboard.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent" });
})();
export {
  DashboardComponent
};
//# sourceMappingURL=dashboard.component-N2B4GHTY.js.map
