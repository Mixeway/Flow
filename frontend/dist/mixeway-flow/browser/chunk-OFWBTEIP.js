import {
  AsyncPipe,
  BehaviorSubject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  ContentChild,
  ContentChildren,
  DOCUMENT,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Injectable,
  Input,
  KeyValueDiffers,
  NgClass,
  NgForOf,
  NgIf,
  NgModule,
  NgStyle,
  NgTemplateOutlet,
  NgZone,
  Optional,
  Output,
  Renderer2,
  SkipSelf,
  Subject,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation$1,
  __decorate,
  fromEvent,
  setClassMetadata,
  takeUntil,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassMapInterpolate1,
  ɵɵclassProp,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
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
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction5,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-ZG2BHLTP.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// node_modules/@swimlane/ngx-datatable/fesm2020/swimlane-ngx-datatable.mjs
var _c0 = ["*"];
var _c1 = ["cellTemplate"];
var _c2 = (a0) => ({
  cellContext: a0
});
function DataTableBodyCellComponent_label_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 5)(1, "input", 6);
    \u0275\u0275listener("click", function DataTableBodyCellComponent_label_1_Template_input_click_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCheckboxChange($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.isSelected);
  }
}
function DataTableBodyCellComponent_ng_container_2_button_1_i_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 12);
  }
}
function DataTableBodyCellComponent_ng_container_2_button_1_i_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 13);
  }
}
function DataTableBodyCellComponent_ng_container_2_button_1_i_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 14);
  }
}
function DataTableBodyCellComponent_ng_container_2_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function DataTableBodyCellComponent_ng_container_2_button_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onTreeAction());
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275template(2, DataTableBodyCellComponent_ng_container_2_button_1_i_2_Template, 1, 0, "i", 9)(3, DataTableBodyCellComponent_ng_container_2_button_1_i_3_Template, 1, 0, "i", 10)(4, DataTableBodyCellComponent_ng_container_2_button_1_i_4_Template, 1, 0, "i", 11);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.treeStatus === "disabled");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.treeStatus === "loading");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.treeStatus === "collapsed");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.treeStatus === "expanded" || ctx_r1.treeStatus === "disabled");
  }
}
function DataTableBodyCellComponent_ng_container_2_2_ng_template_0_Template(rf, ctx) {
}
function DataTableBodyCellComponent_ng_container_2_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DataTableBodyCellComponent_ng_container_2_2_ng_template_0_Template, 0, 0, "ng-template", 15);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.column.treeToggleTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction1(2, _c2, ctx_r1.cellContext));
  }
}
function DataTableBodyCellComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, DataTableBodyCellComponent_ng_container_2_button_1_Template, 5, 4, "button", 7)(2, DataTableBodyCellComponent_ng_container_2_2_Template, 1, 4, null, 3);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.column.treeToggleTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.column.treeToggleTemplate);
  }
}
function DataTableBodyCellComponent_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 16);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("title", ctx_r1.sanitizedValue)("innerHTML", ctx_r1.value, \u0275\u0275sanitizeHtml);
  }
}
function DataTableBodyCellComponent_4_ng_template_0_Template(rf, ctx) {
}
function DataTableBodyCellComponent_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DataTableBodyCellComponent_4_ng_template_0_Template, 0, 0, "ng-template", 15, 0, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.column.cellTemplate)("ngTemplateOutletContext", ctx_r1.cellContext);
  }
}
function DataTableBodyRowComponent_div_0_datatable_body_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "datatable-body-cell", 3);
    \u0275\u0275listener("activate", function DataTableBodyRowComponent_div_0_datatable_body_cell_1_Template_datatable_body_cell_activate_0_listener($event) {
      const ii_r2 = \u0275\u0275restoreView(_r1).index;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onActivate($event, ii_r2));
    })("treeAction", function DataTableBodyRowComponent_div_0_datatable_body_cell_1_Template_datatable_body_cell_treeAction_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onTreeAction());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("row", ctx_r2.row)("group", ctx_r2.group)("expanded", ctx_r2.expanded)("isSelected", ctx_r2.isSelected)("rowIndex", ctx_r2.rowIndex)("column", column_r4)("rowHeight", ctx_r2.rowHeight)("displayCheck", ctx_r2.displayCheck)("treeStatus", ctx_r2.treeStatus);
  }
}
function DataTableBodyRowComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275template(1, DataTableBodyRowComponent_div_0_datatable_body_cell_1_Template, 1, 9, "datatable-body-cell", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const colGroup_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMapInterpolate1("datatable-row-", colGroup_r5.type, " datatable-row-group");
    \u0275\u0275property("ngStyle", ctx_r2._groupStyles[colGroup_r5.type]);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", colGroup_r5.columns)("ngForTrackBy", ctx_r2.columnTrackingFn);
  }
}
function DataTableSummaryRowComponent_datatable_body_row_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "datatable-body-row", 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("innerWidth", ctx_r0.innerWidth)("offsetX", ctx_r0.offsetX)("columns", ctx_r0._internalColumns)("rowHeight", ctx_r0.rowHeight)("row", ctx_r0.summaryRow)("rowIndex", -1);
  }
}
function DataTableRowWrapperComponent_div_0_1_ng_template_0_Template(rf, ctx) {
}
function DataTableRowWrapperComponent_div_0_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DataTableRowWrapperComponent_div_0_1_ng_template_0_Template, 0, 0, "ng-template", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.groupHeader.template)("ngTemplateOutletContext", ctx_r0.groupContext);
  }
}
function DataTableRowWrapperComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275template(1, DataTableRowWrapperComponent_div_0_1_Template, 1, 2, null, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngStyle", ctx_r0.getGroupHeaderStyle());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.groupHeader && ctx_r0.groupHeader.template);
  }
}
function DataTableRowWrapperComponent_ng_content_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0, 0, ["*ngIf", "(groupHeader && groupHeader.template && expanded) || !groupHeader || !groupHeader.template"]);
  }
}
function DataTableRowWrapperComponent_div_2_1_ng_template_0_Template(rf, ctx) {
}
function DataTableRowWrapperComponent_div_2_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DataTableRowWrapperComponent_div_2_1_ng_template_0_Template, 0, 0, "ng-template", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.rowDetail.template)("ngTemplateOutletContext", ctx_r0.rowContext);
  }
}
function DataTableRowWrapperComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275template(1, DataTableRowWrapperComponent_div_2_1_Template, 1, 2, null, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("height", ctx_r0.detailRowHeight, "px");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.rowDetail && ctx_r0.rowDetail.template);
  }
}
function DataTableBodyComponent_datatable_progress_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "datatable-progress");
  }
}
function DataTableBodyComponent_datatable_scroller_3_datatable_summary_row_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "datatable-summary-row", 10);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("rowHeight", ctx_r2.summaryHeight)("offsetX", ctx_r2.offsetX)("innerWidth", ctx_r2.innerWidth)("rows", ctx_r2.rows)("columns", ctx_r2.columns);
  }
}
function DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_datatable_body_row_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "datatable-body-row", 13);
    \u0275\u0275listener("treeAction", function DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_datatable_body_row_1_Template_datatable_body_row_treeAction_0_listener() {
      \u0275\u0275restoreView(_r5);
      const group_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onTreeAction(group_r6));
    })("activate", function DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_datatable_body_row_1_Template_datatable_body_row_activate_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const i_r7 = \u0275\u0275nextContext().index;
      const ctx_r2 = \u0275\u0275nextContext(2);
      const selector_r8 = \u0275\u0275reference(2);
      return \u0275\u0275resetView(selector_r8.onActivate($event, ctx_r2.indexes.first + i_r7));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    const selector_r8 = \u0275\u0275reference(2);
    \u0275\u0275property("isSelected", selector_r8.getRowSelected(group_r6))("innerWidth", ctx_r2.innerWidth)("offsetX", ctx_r2.offsetX)("columns", ctx_r2.columns)("rowHeight", ctx_r2.getRowHeight(group_r6))("row", group_r6)("rowIndex", ctx_r2.getRowIndex(group_r6))("expanded", ctx_r2.getRowExpanded(group_r6))("rowClass", ctx_r2.rowClass)("displayCheck", ctx_r2.displayCheck)("treeStatus", group_r6 && group_r6.treeStatus);
  }
}
function DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_ng_template_2_datatable_body_row_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "datatable-body-row", 15);
    \u0275\u0275listener("activate", function DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_ng_template_2_datatable_body_row_0_Template_datatable_body_row_activate_0_listener($event) {
      const i_r10 = \u0275\u0275restoreView(_r9).index;
      \u0275\u0275nextContext(4);
      const selector_r8 = \u0275\u0275reference(2);
      return \u0275\u0275resetView(selector_r8.onActivate($event, i_r10));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r11 = ctx.$implicit;
    const group_r6 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    const selector_r8 = \u0275\u0275reference(2);
    \u0275\u0275property("isSelected", selector_r8.getRowSelected(row_r11))("innerWidth", ctx_r2.innerWidth)("offsetX", ctx_r2.offsetX)("columns", ctx_r2.columns)("rowHeight", ctx_r2.getRowHeight(row_r11))("row", row_r11)("group", group_r6.value)("rowIndex", ctx_r2.getRowIndex(row_r11))("expanded", ctx_r2.getRowExpanded(row_r11))("rowClass", ctx_r2.rowClass);
  }
}
function DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_ng_template_2_datatable_body_row_0_Template, 1, 10, "datatable-body-row", 14);
  }
  if (rf & 2) {
    const group_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngForOf", group_r6.value)("ngForTrackBy", ctx_r2.rowTrackingFn);
  }
}
function DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "datatable-row-wrapper", 11);
    \u0275\u0275listener("rowContextmenu", function DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_Template_datatable_row_wrapper_rowContextmenu_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.rowContextmenu.emit($event));
    });
    \u0275\u0275template(1, DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_datatable_body_row_1_Template, 1, 11, "datatable-body-row", 12)(2, DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_ng_template_2_Template, 1, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r6 = ctx.$implicit;
    const i_r7 = ctx.index;
    const groupedRowsTemplate_r12 = \u0275\u0275reference(3);
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("groupedRows", ctx_r2.groupedRows)("innerWidth", ctx_r2.innerWidth)("ngStyle", ctx_r2.getRowsStyles(group_r6))("rowDetail", ctx_r2.rowDetail)("groupHeader", ctx_r2.groupHeader)("offsetX", ctx_r2.offsetX)("detailRowHeight", ctx_r2.getDetailRowHeight(group_r6 && group_r6[i_r7], i_r7))("row", group_r6)("expanded", ctx_r2.getRowExpanded(group_r6))("rowIndex", ctx_r2.getRowIndex(group_r6 && group_r6[i_r7]));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.groupedRows)("ngIfElse", groupedRowsTemplate_r12);
  }
}
function DataTableBodyComponent_datatable_scroller_3_datatable_summary_row_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "datatable-summary-row", 16);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngStyle", ctx_r2.getBottomSummaryRowStyles())("rowHeight", ctx_r2.summaryHeight)("offsetX", ctx_r2.offsetX)("innerWidth", ctx_r2.innerWidth)("rows", ctx_r2.rows)("columns", ctx_r2.columns);
  }
}
function DataTableBodyComponent_datatable_scroller_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "datatable-scroller", 6);
    \u0275\u0275listener("scroll", function DataTableBodyComponent_datatable_scroller_3_Template_datatable_scroller_scroll_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onBodyScroll($event));
    });
    \u0275\u0275template(1, DataTableBodyComponent_datatable_scroller_3_datatable_summary_row_1_Template, 1, 5, "datatable-summary-row", 7)(2, DataTableBodyComponent_datatable_scroller_3_datatable_row_wrapper_2_Template, 4, 12, "datatable-row-wrapper", 8)(3, DataTableBodyComponent_datatable_scroller_3_datatable_summary_row_3_Template, 1, 6, "datatable-summary-row", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("scrollbarV", ctx_r2.scrollbarV)("scrollbarH", ctx_r2.scrollbarH)("scrollHeight", ctx_r2.scrollHeight)("scrollWidth", ctx_r2.columnGroupWidths == null ? null : ctx_r2.columnGroupWidths.total);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.summaryRow && ctx_r2.summaryPosition === "top");
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.temp)("ngForTrackBy", ctx_r2.rowTrackingFn);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.summaryRow && ctx_r2.summaryPosition === "bottom");
  }
}
function DataTableBodyComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 17);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("innerHTML", ctx_r2.emptyMessage, \u0275\u0275sanitizeHtml);
  }
}
function DataTableHeaderCellComponent_1_ng_template_0_Template(rf, ctx) {
}
function DataTableHeaderCellComponent_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DataTableHeaderCellComponent_1_ng_template_0_Template, 0, 0, "ng-template", 5);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.targetMarkerTemplate)("ngTemplateOutletContext", ctx_r0.targetMarkerContext);
  }
}
function DataTableHeaderCellComponent_label_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 6)(1, "input", 7);
    \u0275\u0275listener("change", function DataTableHeaderCellComponent_label_2_Template_input_change_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.select.emit(!ctx_r0.allRowsSelected));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r0.allRowsSelected);
  }
}
function DataTableHeaderCellComponent_span_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 8)(1, "span", 9);
    \u0275\u0275listener("click", function DataTableHeaderCellComponent_span_3_Template_span_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSort());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("innerHTML", ctx_r0.name, \u0275\u0275sanitizeHtml);
  }
}
function DataTableHeaderCellComponent_4_ng_template_0_Template(rf, ctx) {
}
function DataTableHeaderCellComponent_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DataTableHeaderCellComponent_4_ng_template_0_Template, 0, 0, "ng-template", 5);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.column.headerTemplate)("ngTemplateOutletContext", ctx_r0.cellContext);
  }
}
function DataTableHeaderComponent_div_1_datatable_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "datatable-header-cell", 4);
    \u0275\u0275listener("resize", function DataTableHeaderComponent_div_1_datatable_header_cell_1_Template_datatable_header_cell_resize_0_listener($event) {
      const column_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onColumnResized($event, column_r2));
    })("longPressStart", function DataTableHeaderComponent_div_1_datatable_header_cell_1_Template_datatable_header_cell_longPressStart_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onLongPressStart($event));
    })("longPressEnd", function DataTableHeaderComponent_div_1_datatable_header_cell_1_Template_datatable_header_cell_longPressEnd_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onLongPressEnd($event));
    })("sort", function DataTableHeaderComponent_div_1_datatable_header_cell_1_Template_datatable_header_cell_sort_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onSort($event));
    })("select", function DataTableHeaderComponent_div_1_datatable_header_cell_1_Template_datatable_header_cell_select_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.select.emit($event));
    })("columnContextmenu", function DataTableHeaderComponent_div_1_datatable_header_cell_1_Template_datatable_header_cell_columnContextmenu_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.columnContextmenu.emit($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("resizeEnabled", column_r2.resizeable)("pressModel", column_r2)("pressEnabled", ctx_r2.reorderable && column_r2.draggable)("dragX", ctx_r2.reorderable && column_r2.draggable && column_r2.dragging)("dragY", false)("dragModel", column_r2)("dragEventTarget", ctx_r2.dragEventTarget)("headerHeight", ctx_r2.headerHeight)("isTarget", column_r2.isTarget)("targetMarkerTemplate", ctx_r2.targetMarkerTemplate)("targetMarkerContext", column_r2.targetMarkerContext)("column", column_r2)("sortType", ctx_r2.sortType)("sorts", ctx_r2.sorts)("selectionType", ctx_r2.selectionType)("sortAscendingIcon", ctx_r2.sortAscendingIcon)("sortDescendingIcon", ctx_r2.sortDescendingIcon)("sortUnsetIcon", ctx_r2.sortUnsetIcon)("allRowsSelected", ctx_r2.allRowsSelected);
  }
}
function DataTableHeaderComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275template(1, DataTableHeaderComponent_div_1_datatable_header_cell_1_Template, 1, 19, "datatable-header-cell", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const colGroup_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap("datatable-row-" + colGroup_r4.type);
    \u0275\u0275property("ngStyle", ctx_r2._styleByGroup[colGroup_r4.type]);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", colGroup_r4.columns)("ngForTrackBy", ctx_r2.columnTrackingFn);
  }
}
function DataTablePagerComponent_li_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 6)(1, "a", 7);
    \u0275\u0275listener("click", function DataTablePagerComponent_li_7_Template_a_click_1_listener() {
      const pg_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.selectPage(pg_r2.number));
    });
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const pg_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("active", pg_r2.number === ctx_r2.page);
    \u0275\u0275attribute("aria-label", "page " + pg_r2.number);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", pg_r2.text, " ");
  }
}
var _c3 = (a0) => ({
  "selected-count": a0
});
var _c4 = (a0, a1, a2, a3, a4) => ({
  rowCount: a0,
  pageSize: a1,
  selectedCount: a2,
  curPage: a3,
  offset: a4
});
function DataTableFooterComponent_1_ng_template_0_Template(rf, ctx) {
}
function DataTableFooterComponent_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DataTableFooterComponent_1_ng_template_0_Template, 0, 0, "ng-template", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.footerTemplate.template)("ngTemplateOutletContext", \u0275\u0275pureFunction5(2, _c4, ctx_r0.rowCount, ctx_r0.pageSize, ctx_r0.selectedCount, ctx_r0.curPage, ctx_r0.offset));
  }
}
function DataTableFooterComponent_div_2_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.selectedCount == null ? null : ctx_r0.selectedCount.toLocaleString(), " ", ctx_r0.selectedMessage, " / ");
  }
}
function DataTableFooterComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275template(1, DataTableFooterComponent_div_2_span_1_Template, 2, 2, "span", 1);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedMessage);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.rowCount == null ? null : ctx_r0.rowCount.toLocaleString(), " ", ctx_r0.totalMessage, " ");
  }
}
function DataTableFooterComponent_datatable_pager_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "datatable-pager", 6);
    \u0275\u0275listener("change", function DataTableFooterComponent_datatable_pager_3_Template_datatable_pager_change_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.page.emit($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("pagerLeftArrowIcon", ctx_r0.pagerLeftArrowIcon)("pagerRightArrowIcon", ctx_r0.pagerRightArrowIcon)("pagerPreviousIcon", ctx_r0.pagerPreviousIcon)("pagerNextIcon", ctx_r0.pagerNextIcon)("page", ctx_r0.curPage)("size", ctx_r0.pageSize)("count", ctx_r0.rowCount)("hidden", !ctx_r0.isVisible);
  }
}
function DatatableComponent_datatable_header_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "datatable-header", 4);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275listener("sort", function DatatableComponent_datatable_header_1_Template_datatable_header_sort_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onColumnSort($event));
    })("resize", function DatatableComponent_datatable_header_1_Template_datatable_header_resize_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onColumnResize($event));
    })("reorder", function DatatableComponent_datatable_header_1_Template_datatable_header_reorder_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onColumnReorder($event));
    })("select", function DatatableComponent_datatable_header_1_Template_datatable_header_select_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onHeaderSelect($event));
    })("columnContextmenu", function DatatableComponent_datatable_header_1_Template_datatable_header_columnContextmenu_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onColumnContextmenu($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("sorts", ctx_r1.sorts)("sortType", ctx_r1.sortType)("scrollbarH", ctx_r1.scrollbarH)("innerWidth", ctx_r1._innerWidth)("offsetX", \u0275\u0275pipeBind1(1, 15, ctx_r1._offsetX))("dealsWithGroup", ctx_r1.groupedRows !== void 0)("columns", ctx_r1._internalColumns)("headerHeight", ctx_r1.headerHeight)("reorderable", ctx_r1.reorderable)("targetMarkerTemplate", ctx_r1.targetMarkerTemplate)("sortAscendingIcon", ctx_r1.cssClasses.sortAscending)("sortDescendingIcon", ctx_r1.cssClasses.sortDescending)("sortUnsetIcon", ctx_r1.cssClasses.sortUnset)("allRowsSelected", ctx_r1.allRowsSelected)("selectionType", ctx_r1.selectionType);
  }
}
function DatatableComponent_datatable_footer_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "datatable-footer", 5);
    \u0275\u0275listener("page", function DatatableComponent_datatable_footer_4_Template_datatable_footer_page_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFooterPage($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("rowCount", ctx_r1.rowCount)("pageSize", ctx_r1.pageSize)("offset", ctx_r1.offset)("footerHeight", ctx_r1.footerHeight)("footerTemplate", ctx_r1.footer)("totalMessage", ctx_r1.messages.totalMessage)("pagerLeftArrowIcon", ctx_r1.cssClasses.pagerLeftArrow)("pagerRightArrowIcon", ctx_r1.cssClasses.pagerRightArrow)("pagerPreviousIcon", ctx_r1.cssClasses.pagerPrevious)("selectedCount", ctx_r1.selected.length)("selectedMessage", !!ctx_r1.selectionType && ctx_r1.messages.selectedMessage)("pagerNextIcon", ctx_r1.cssClasses.pagerNext);
  }
}
var ScrollbarHelper = class {
  constructor(document2) {
    this.document = document2;
    this.width = this.getWidth();
  }
  getWidth() {
    const outer = this.document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar";
    this.document.body.appendChild(outer);
    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = "scroll";
    const inner = this.document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);
    const widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
  }
};
ScrollbarHelper.\u0275fac = function ScrollbarHelper_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || ScrollbarHelper)(\u0275\u0275inject(DOCUMENT));
};
ScrollbarHelper.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: ScrollbarHelper,
  factory: ScrollbarHelper.\u0275fac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollbarHelper, [{
    type: Injectable
  }], function() {
    return [{
      type: void 0,
      decorators: [{
        type: Inject,
        args: [DOCUMENT]
      }]
    }];
  }, null);
})();
var DimensionsHelper = class {
  getDimensions(element) {
    return element.getBoundingClientRect();
  }
};
DimensionsHelper.\u0275fac = function DimensionsHelper_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DimensionsHelper)();
};
DimensionsHelper.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: DimensionsHelper,
  factory: DimensionsHelper.\u0275fac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DimensionsHelper, [{
    type: Injectable
  }], null, null);
})();
var ColumnChangesService = class {
  constructor() {
    this.columnInputChanges = new Subject();
  }
  get columnInputChanges$() {
    return this.columnInputChanges.asObservable();
  }
  onInputChange() {
    this.columnInputChanges.next();
  }
};
ColumnChangesService.\u0275fac = function ColumnChangesService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || ColumnChangesService)();
};
ColumnChangesService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: ColumnChangesService,
  factory: ColumnChangesService.\u0275fac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ColumnChangesService, [{
    type: Injectable
  }], null, null);
})();
var DataTableFooterTemplateDirective = class {
  constructor(template) {
    this.template = template;
  }
};
DataTableFooterTemplateDirective.\u0275fac = function DataTableFooterTemplateDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableFooterTemplateDirective)(\u0275\u0275directiveInject(TemplateRef));
};
DataTableFooterTemplateDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: DataTableFooterTemplateDirective,
  selectors: [["", "ngx-datatable-footer-template", ""]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableFooterTemplateDirective, [{
    type: Directive,
    args: [{
      selector: "[ngx-datatable-footer-template]"
    }]
  }], function() {
    return [{
      type: TemplateRef
    }];
  }, null);
})();
var VisibilityDirective = class {
  constructor(element, zone) {
    this.element = element;
    this.zone = zone;
    this.isVisible = false;
    this.visible = new EventEmitter();
  }
  ngOnInit() {
    this.runCheck();
  }
  ngOnDestroy() {
    clearTimeout(this.timeout);
  }
  onVisibilityChange() {
    this.zone.run(() => {
      this.isVisible = true;
      this.visible.emit(true);
    });
  }
  runCheck() {
    const check = () => {
      const {
        offsetHeight,
        offsetWidth
      } = this.element.nativeElement;
      if (offsetHeight && offsetWidth) {
        clearTimeout(this.timeout);
        this.onVisibilityChange();
      } else {
        clearTimeout(this.timeout);
        this.zone.runOutsideAngular(() => {
          this.timeout = setTimeout(() => check(), 50);
        });
      }
    };
    this.timeout = setTimeout(() => check());
  }
};
VisibilityDirective.\u0275fac = function VisibilityDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisibilityDirective)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(NgZone));
};
VisibilityDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: VisibilityDirective,
  selectors: [["", "visibilityObserver", ""]],
  hostVars: 2,
  hostBindings: function VisibilityDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("visible", ctx.isVisible);
    }
  },
  outputs: {
    visible: "visible"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisibilityDirective, [{
    type: Directive,
    args: [{
      selector: "[visibilityObserver]"
    }]
  }], function() {
    return [{
      type: ElementRef
    }, {
      type: NgZone
    }];
  }, {
    isVisible: [{
      type: HostBinding,
      args: ["class.visible"]
    }],
    visible: [{
      type: Output
    }]
  });
})();
var DraggableDirective = class {
  constructor(element) {
    this.dragX = true;
    this.dragY = true;
    this.dragStart = new EventEmitter();
    this.dragging = new EventEmitter();
    this.dragEnd = new EventEmitter();
    this.isDragging = false;
    this.element = element.nativeElement;
  }
  ngOnChanges(changes) {
    if (changes["dragEventTarget"] && changes["dragEventTarget"].currentValue && this.dragModel.dragging) {
      this.onMousedown(changes["dragEventTarget"].currentValue);
    }
  }
  ngOnDestroy() {
    this._destroySubscription();
  }
  onMouseup(event) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.element.classList.remove("dragging");
    if (this.subscription) {
      this._destroySubscription();
      this.dragEnd.emit({
        event,
        element: this.element,
        model: this.dragModel
      });
    }
  }
  onMousedown(event) {
    const isDragElm = event.target.classList.contains("draggable");
    if (isDragElm && (this.dragX || this.dragY)) {
      event.preventDefault();
      this.isDragging = true;
      const mouseDownPos = {
        x: event.clientX,
        y: event.clientY
      };
      const mouseup = fromEvent(document, "mouseup");
      this.subscription = mouseup.subscribe((ev) => this.onMouseup(ev));
      const mouseMoveSub = fromEvent(document, "mousemove").pipe(takeUntil(mouseup)).subscribe((ev) => this.move(ev, mouseDownPos));
      this.subscription.add(mouseMoveSub);
      this.dragStart.emit({
        event,
        element: this.element,
        model: this.dragModel
      });
    }
  }
  move(event, mouseDownPos) {
    if (!this.isDragging) return;
    const x = event.clientX - mouseDownPos.x;
    const y = event.clientY - mouseDownPos.y;
    if (this.dragX) this.element.style.left = `${x}px`;
    if (this.dragY) this.element.style.top = `${y}px`;
    this.element.classList.add("dragging");
    this.dragging.emit({
      event,
      element: this.element,
      model: this.dragModel
    });
  }
  _destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = void 0;
    }
  }
};
DraggableDirective.\u0275fac = function DraggableDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DraggableDirective)(\u0275\u0275directiveInject(ElementRef));
};
DraggableDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: DraggableDirective,
  selectors: [["", "draggable", ""]],
  inputs: {
    dragEventTarget: "dragEventTarget",
    dragModel: "dragModel",
    dragX: "dragX",
    dragY: "dragY"
  },
  outputs: {
    dragStart: "dragStart",
    dragging: "dragging",
    dragEnd: "dragEnd"
  },
  features: [\u0275\u0275NgOnChangesFeature]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DraggableDirective, [{
    type: Directive,
    args: [{
      selector: "[draggable]"
    }]
  }], function() {
    return [{
      type: ElementRef
    }];
  }, {
    dragEventTarget: [{
      type: Input
    }],
    dragModel: [{
      type: Input
    }],
    dragX: [{
      type: Input
    }],
    dragY: [{
      type: Input
    }],
    dragStart: [{
      type: Output
    }],
    dragging: [{
      type: Output
    }],
    dragEnd: [{
      type: Output
    }]
  });
})();
var ResizeableDirective = class {
  constructor(element, renderer) {
    this.renderer = renderer;
    this.resizeEnabled = true;
    this.resize = new EventEmitter();
    this.resizing = false;
    this.element = element.nativeElement;
  }
  ngAfterViewInit() {
    const renderer2 = this.renderer;
    this.resizeHandle = renderer2.createElement("span");
    if (this.resizeEnabled) {
      renderer2.addClass(this.resizeHandle, "resize-handle");
    } else {
      renderer2.addClass(this.resizeHandle, "resize-handle--not-resizable");
    }
    renderer2.appendChild(this.element, this.resizeHandle);
  }
  ngOnDestroy() {
    this._destroySubscription();
    if (this.renderer.destroyNode) {
      this.renderer.destroyNode(this.resizeHandle);
    } else if (this.resizeHandle) {
      this.renderer.removeChild(this.renderer.parentNode(this.resizeHandle), this.resizeHandle);
    }
  }
  onMouseup() {
    this.resizing = false;
    if (this.subscription && !this.subscription.closed) {
      this._destroySubscription();
      this.resize.emit(this.element.clientWidth);
    }
  }
  onMousedown(event) {
    const isHandle = event.target.classList.contains("resize-handle");
    const initialWidth = this.element.clientWidth;
    const mouseDownScreenX = event.screenX;
    if (isHandle) {
      event.stopPropagation();
      this.resizing = true;
      const mouseup = fromEvent(document, "mouseup");
      this.subscription = mouseup.subscribe((ev) => this.onMouseup());
      const mouseMoveSub = fromEvent(document, "mousemove").pipe(takeUntil(mouseup)).subscribe((e) => this.move(e, initialWidth, mouseDownScreenX));
      this.subscription.add(mouseMoveSub);
    }
  }
  move(event, initialWidth, mouseDownScreenX) {
    const movementX = event.screenX - mouseDownScreenX;
    const newWidth = initialWidth + movementX;
    const overMinWidth = !this.minWidth || newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || newWidth <= this.maxWidth;
    if (overMinWidth && underMaxWidth) {
      this.element.style.width = `${newWidth}px`;
    }
  }
  _destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = void 0;
    }
  }
};
ResizeableDirective.\u0275fac = function ResizeableDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || ResizeableDirective)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Renderer2));
};
ResizeableDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: ResizeableDirective,
  selectors: [["", "resizeable", ""]],
  hostVars: 2,
  hostBindings: function ResizeableDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("mousedown", function ResizeableDirective_mousedown_HostBindingHandler($event) {
        return ctx.onMousedown($event);
      });
    }
    if (rf & 2) {
      \u0275\u0275classProp("resizeable", ctx.resizeEnabled);
    }
  },
  inputs: {
    resizeEnabled: "resizeEnabled",
    minWidth: "minWidth",
    maxWidth: "maxWidth"
  },
  outputs: {
    resize: "resize"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResizeableDirective, [{
    type: Directive,
    args: [{
      selector: "[resizeable]",
      host: {
        "[class.resizeable]": "resizeEnabled"
      }
    }]
  }], function() {
    return [{
      type: ElementRef
    }, {
      type: Renderer2
    }];
  }, {
    resizeEnabled: [{
      type: Input
    }],
    minWidth: [{
      type: Input
    }],
    maxWidth: [{
      type: Input
    }],
    resize: [{
      type: Output
    }],
    onMousedown: [{
      type: HostListener,
      args: ["mousedown", ["$event"]]
    }]
  });
})();
var OrderableDirective = class {
  constructor(differs, document2) {
    this.document = document2;
    this.reorder = new EventEmitter();
    this.targetChanged = new EventEmitter();
    this.differ = differs.find({}).create();
  }
  ngAfterContentInit() {
    this.updateSubscriptions();
    this.draggables.changes.subscribe(this.updateSubscriptions.bind(this));
  }
  ngOnDestroy() {
    this.draggables.forEach((d) => {
      d.dragStart.unsubscribe();
      d.dragging.unsubscribe();
      d.dragEnd.unsubscribe();
    });
  }
  updateSubscriptions() {
    const diffs = this.differ.diff(this.createMapDiffs());
    if (diffs) {
      const subscribe = ({
        currentValue,
        previousValue
      }) => {
        unsubscribe({
          previousValue
        });
        if (currentValue) {
          currentValue.dragStart.subscribe(this.onDragStart.bind(this));
          currentValue.dragging.subscribe(this.onDragging.bind(this));
          currentValue.dragEnd.subscribe(this.onDragEnd.bind(this));
        }
      };
      const unsubscribe = ({
        previousValue
      }) => {
        if (previousValue) {
          previousValue.dragStart.unsubscribe();
          previousValue.dragging.unsubscribe();
          previousValue.dragEnd.unsubscribe();
        }
      };
      diffs.forEachAddedItem(subscribe);
      diffs.forEachRemovedItem(unsubscribe);
    }
  }
  onDragStart() {
    this.positions = {};
    let i = 0;
    for (const dragger of this.draggables.toArray()) {
      const elm = dragger.element;
      const left = parseInt(elm.offsetLeft.toString(), 0);
      this.positions[dragger.dragModel.prop] = {
        left,
        right: left + parseInt(elm.offsetWidth.toString(), 0),
        index: i++,
        element: elm
      };
    }
  }
  onDragging({
    element,
    model,
    event
  }) {
    const prevPos = this.positions[model.prop];
    const target = this.isTarget(model, event);
    if (target) {
      if (this.lastDraggingIndex !== target.i) {
        this.targetChanged.emit({
          prevIndex: this.lastDraggingIndex,
          newIndex: target.i,
          initialIndex: prevPos.index
        });
        this.lastDraggingIndex = target.i;
      }
    } else if (this.lastDraggingIndex !== prevPos.index) {
      this.targetChanged.emit({
        prevIndex: this.lastDraggingIndex,
        initialIndex: prevPos.index
      });
      this.lastDraggingIndex = prevPos.index;
    }
  }
  onDragEnd({
    element,
    model,
    event
  }) {
    const prevPos = this.positions[model.prop];
    const target = this.isTarget(model, event);
    if (target) {
      this.reorder.emit({
        prevIndex: prevPos.index,
        newIndex: target.i,
        model
      });
    }
    this.lastDraggingIndex = void 0;
    element.style.left = "auto";
  }
  isTarget(model, event) {
    let i = 0;
    const x = event.x || event.clientX;
    const y = event.y || event.clientY;
    const targets = this.document.elementsFromPoint(x, y);
    for (const prop in this.positions) {
      const pos = this.positions[prop];
      if (model.prop !== prop && targets.find((el) => el === pos.element)) {
        return {
          pos,
          i
        };
      }
      i++;
    }
  }
  createMapDiffs() {
    return this.draggables.toArray().reduce((acc, curr) => {
      acc[curr.dragModel.$$id] = curr;
      return acc;
    }, {});
  }
};
OrderableDirective.\u0275fac = function OrderableDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || OrderableDirective)(\u0275\u0275directiveInject(KeyValueDiffers), \u0275\u0275directiveInject(DOCUMENT));
};
OrderableDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: OrderableDirective,
  selectors: [["", "orderable", ""]],
  contentQueries: function OrderableDirective_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      \u0275\u0275contentQuery(dirIndex, DraggableDirective, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.draggables = _t);
    }
  },
  outputs: {
    reorder: "reorder",
    targetChanged: "targetChanged"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OrderableDirective, [{
    type: Directive,
    args: [{
      selector: "[orderable]"
    }]
  }], function() {
    return [{
      type: KeyValueDiffers
    }, {
      type: void 0,
      decorators: [{
        type: Inject,
        args: [DOCUMENT]
      }]
    }];
  }, {
    reorder: [{
      type: Output
    }],
    targetChanged: [{
      type: Output
    }],
    draggables: [{
      type: ContentChildren,
      args: [DraggableDirective, {
        descendants: true
      }]
    }]
  });
})();
var LongPressDirective = class {
  constructor() {
    this.pressEnabled = true;
    this.duration = 500;
    this.longPressStart = new EventEmitter();
    this.longPressing = new EventEmitter();
    this.longPressEnd = new EventEmitter();
    this.mouseX = 0;
    this.mouseY = 0;
  }
  get press() {
    return this.pressing;
  }
  get isLongPress() {
    return this.isLongPressing;
  }
  onMouseDown(event) {
    if (event.which !== 1 || !this.pressEnabled) return;
    const target = event.target;
    if (target.classList.contains("resize-handle")) return;
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.pressing = true;
    this.isLongPressing = false;
    const mouseup = fromEvent(document, "mouseup");
    this.subscription = mouseup.subscribe((ev) => this.onMouseup());
    this.timeout = setTimeout(() => {
      this.isLongPressing = true;
      this.longPressStart.emit({
        event,
        model: this.pressModel
      });
      this.subscription.add(fromEvent(document, "mousemove").pipe(takeUntil(mouseup)).subscribe((mouseEvent) => this.onMouseMove(mouseEvent)));
      this.loop(event);
    }, this.duration);
    this.loop(event);
  }
  onMouseMove(event) {
    if (this.pressing && !this.isLongPressing) {
      const xThres = Math.abs(event.clientX - this.mouseX) > 10;
      const yThres = Math.abs(event.clientY - this.mouseY) > 10;
      if (xThres || yThres) {
        this.endPress();
      }
    }
  }
  loop(event) {
    if (this.isLongPressing) {
      this.timeout = setTimeout(() => {
        this.longPressing.emit({
          event,
          model: this.pressModel
        });
        this.loop(event);
      }, 50);
    }
  }
  endPress() {
    clearTimeout(this.timeout);
    this.isLongPressing = false;
    this.pressing = false;
    this._destroySubscription();
    this.longPressEnd.emit({
      model: this.pressModel
    });
  }
  onMouseup() {
    this.endPress();
  }
  ngOnDestroy() {
    this._destroySubscription();
  }
  _destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = void 0;
    }
  }
};
LongPressDirective.\u0275fac = function LongPressDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || LongPressDirective)();
};
LongPressDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: LongPressDirective,
  selectors: [["", "long-press", ""]],
  hostVars: 4,
  hostBindings: function LongPressDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("mousedown", function LongPressDirective_mousedown_HostBindingHandler($event) {
        return ctx.onMouseDown($event);
      });
    }
    if (rf & 2) {
      \u0275\u0275classProp("press", ctx.press)("longpress", ctx.isLongPress);
    }
  },
  inputs: {
    pressEnabled: "pressEnabled",
    pressModel: "pressModel",
    duration: "duration"
  },
  outputs: {
    longPressStart: "longPressStart",
    longPressing: "longPressing",
    longPressEnd: "longPressEnd"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LongPressDirective, [{
    type: Directive,
    args: [{
      selector: "[long-press]"
    }]
  }], null, {
    pressEnabled: [{
      type: Input
    }],
    pressModel: [{
      type: Input
    }],
    duration: [{
      type: Input
    }],
    longPressStart: [{
      type: Output
    }],
    longPressing: [{
      type: Output
    }],
    longPressEnd: [{
      type: Output
    }],
    press: [{
      type: HostBinding,
      args: ["class.press"]
    }],
    isLongPress: [{
      type: HostBinding,
      args: ["class.longpress"]
    }],
    onMouseDown: [{
      type: HostListener,
      args: ["mousedown", ["$event"]]
    }]
  });
})();
var ScrollerComponent = class {
  constructor(ngZone, element, renderer) {
    this.ngZone = ngZone;
    this.renderer = renderer;
    this.scrollbarV = false;
    this.scrollbarH = false;
    this.scroll = new EventEmitter();
    this.scrollYPos = 0;
    this.scrollXPos = 0;
    this.prevScrollYPos = 0;
    this.prevScrollXPos = 0;
    this._scrollEventListener = null;
    this.element = element.nativeElement;
  }
  ngOnInit() {
    if (this.scrollbarV || this.scrollbarH) {
      const renderer = this.renderer;
      this.parentElement = renderer.parentNode(renderer.parentNode(this.element));
      this._scrollEventListener = this.onScrolled.bind(this);
      this.parentElement.addEventListener("scroll", this._scrollEventListener);
    }
  }
  ngOnDestroy() {
    if (this._scrollEventListener) {
      this.parentElement.removeEventListener("scroll", this._scrollEventListener);
      this._scrollEventListener = null;
    }
  }
  setOffset(offsetY) {
    if (this.parentElement) {
      this.parentElement.scrollTop = offsetY;
    }
  }
  onScrolled(event) {
    const dom = event.currentTarget;
    requestAnimationFrame(() => {
      this.scrollYPos = dom.scrollTop;
      this.scrollXPos = dom.scrollLeft;
      this.updateOffset();
    });
  }
  updateOffset() {
    let direction;
    if (this.scrollYPos < this.prevScrollYPos) {
      direction = "down";
    } else if (this.scrollYPos > this.prevScrollYPos) {
      direction = "up";
    }
    this.scroll.emit({
      direction,
      scrollYPos: this.scrollYPos,
      scrollXPos: this.scrollXPos
    });
    this.prevScrollYPos = this.scrollYPos;
    this.prevScrollXPos = this.scrollXPos;
  }
};
ScrollerComponent.\u0275fac = function ScrollerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || ScrollerComponent)(\u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Renderer2));
};
ScrollerComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: ScrollerComponent,
  selectors: [["datatable-scroller"]],
  hostAttrs: [1, "datatable-scroll"],
  hostVars: 4,
  hostBindings: function ScrollerComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275styleProp("height", ctx.scrollHeight, "px")("width", ctx.scrollWidth, "px");
    }
  },
  inputs: {
    scrollbarV: "scrollbarV",
    scrollbarH: "scrollbarH",
    scrollHeight: "scrollHeight",
    scrollWidth: "scrollWidth"
  },
  outputs: {
    scroll: "scroll"
  },
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ScrollerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275projection(0);
    }
  },
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollerComponent, [{
    type: Component,
    args: [{
      selector: "datatable-scroller",
      template: ` <ng-content></ng-content> `,
      host: {
        class: "datatable-scroll"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], function() {
    return [{
      type: NgZone
    }, {
      type: ElementRef
    }, {
      type: Renderer2
    }];
  }, {
    scrollbarV: [{
      type: Input
    }],
    scrollbarH: [{
      type: Input
    }],
    scrollHeight: [{
      type: HostBinding,
      args: ["style.height.px"]
    }, {
      type: Input
    }],
    scrollWidth: [{
      type: HostBinding,
      args: ["style.width.px"]
    }, {
      type: Input
    }],
    scroll: [{
      type: Output
    }]
  });
})();
var DatatableGroupHeaderTemplateDirective = class {
  constructor(template) {
    this.template = template;
  }
};
DatatableGroupHeaderTemplateDirective.\u0275fac = function DatatableGroupHeaderTemplateDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DatatableGroupHeaderTemplateDirective)(\u0275\u0275directiveInject(TemplateRef));
};
DatatableGroupHeaderTemplateDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: DatatableGroupHeaderTemplateDirective,
  selectors: [["", "ngx-datatable-group-header-template", ""]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DatatableGroupHeaderTemplateDirective, [{
    type: Directive,
    args: [{
      selector: "[ngx-datatable-group-header-template]"
    }]
  }], function() {
    return [{
      type: TemplateRef
    }];
  }, null);
})();
var DatatableGroupHeaderDirective = class {
  constructor() {
    this.rowHeight = 0;
    this.toggle = new EventEmitter();
  }
  get template() {
    return this._templateInput || this._templateQuery;
  }
  /**
   * Toggle the expansion of a group
   */
  toggleExpandGroup(group) {
    this.toggle.emit({
      type: "group",
      value: group
    });
  }
  /**
   * Expand all groups
   */
  expandAllGroups() {
    this.toggle.emit({
      type: "all",
      value: true
    });
  }
  /**
   * Collapse all groups
   */
  collapseAllGroups() {
    this.toggle.emit({
      type: "all",
      value: false
    });
  }
};
DatatableGroupHeaderDirective.\u0275fac = function DatatableGroupHeaderDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DatatableGroupHeaderDirective)();
};
DatatableGroupHeaderDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: DatatableGroupHeaderDirective,
  selectors: [["ngx-datatable-group-header"]],
  contentQueries: function DatatableGroupHeaderDirective_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      \u0275\u0275contentQuery(dirIndex, DatatableGroupHeaderTemplateDirective, 7, TemplateRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._templateQuery = _t.first);
    }
  },
  inputs: {
    rowHeight: "rowHeight",
    _templateInput: [0, "template", "_templateInput"]
  },
  outputs: {
    toggle: "toggle"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DatatableGroupHeaderDirective, [{
    type: Directive,
    args: [{
      selector: "ngx-datatable-group-header"
    }]
  }], null, {
    rowHeight: [{
      type: Input
    }],
    _templateInput: [{
      type: Input,
      args: ["template"]
    }],
    _templateQuery: [{
      type: ContentChild,
      args: [DatatableGroupHeaderTemplateDirective, {
        read: TemplateRef,
        static: true
      }]
    }],
    toggle: [{
      type: Output
    }]
  });
})();
function emptyStringGetter() {
  return "";
}
function getterForProp(prop) {
  if (prop == null) {
    return emptyStringGetter;
  }
  if (typeof prop === "number") {
    return numericIndexGetter;
  } else {
    if (prop.indexOf(".") !== -1) {
      return deepValueGetter;
    } else {
      return shallowValueGetter;
    }
  }
}
function numericIndexGetter(row, index) {
  if (row == null) {
    return "";
  }
  if (!row || index == null) {
    return row;
  }
  const value = row[index];
  if (value == null) {
    return "";
  }
  return value;
}
function shallowValueGetter(obj, fieldName) {
  if (obj == null) {
    return "";
  }
  if (!obj || !fieldName) {
    return obj;
  }
  const value = obj[fieldName];
  if (value == null) {
    return "";
  }
  return value;
}
function deepValueGetter(obj, path) {
  if (obj == null) {
    return "";
  }
  if (!obj || !path) {
    return obj;
  }
  let current = obj[path];
  if (current !== void 0) {
    return current;
  }
  current = obj;
  const split = path.split(".");
  if (split.length) {
    for (let i = 0; i < split.length; i++) {
      current = current[split[i]];
      if (current === void 0 || current === null) {
        return "";
      }
    }
  }
  return current;
}
function optionalGetterForProp(prop) {
  return prop && ((row) => getterForProp(prop)(row, prop));
}
function groupRowsByParents(rows, from, to) {
  if (from && to) {
    const nodeById = {};
    const l = rows.length;
    let node = null;
    nodeById[0] = new TreeNode();
    const uniqIDs = rows.reduce((arr, item) => {
      const toValue = to(item);
      if (arr.indexOf(toValue) === -1) {
        arr.push(toValue);
      }
      return arr;
    }, []);
    for (let i = 0; i < l; i++) {
      nodeById[to(rows[i])] = new TreeNode(rows[i]);
    }
    for (let i = 0; i < l; i++) {
      node = nodeById[to(rows[i])];
      let parent = 0;
      const fromValue = from(node.row);
      if (!!fromValue && uniqIDs.indexOf(fromValue) > -1) {
        parent = fromValue;
      }
      node.parent = nodeById[parent];
      node.row["level"] = node.parent.row["level"] + 1;
      node.parent.children.push(node);
    }
    let resolvedRows = [];
    nodeById[0].flatten(function() {
      resolvedRows = [...resolvedRows, this.row];
    }, true);
    return resolvedRows;
  } else {
    return rows;
  }
}
var TreeNode = class {
  constructor(row = null) {
    if (!row) {
      row = {
        level: -1,
        treeStatus: "expanded"
      };
    }
    this.row = row;
    this.parent = null;
    this.children = [];
  }
  flatten(f, recursive) {
    if (this.row["treeStatus"] === "expanded") {
      for (let i = 0, l = this.children.length; i < l; i++) {
        const child = this.children[i];
        f.apply(child, Array.prototype.slice.call(arguments, 2));
        if (recursive) child.flatten.apply(child, arguments);
      }
    }
  }
};
function camelCase(str) {
  str = str.replace(/[^a-zA-Z0-9 ]/g, " ");
  str = str.replace(/([a-z](?=[A-Z]))/g, "$1 ");
  str = str.replace(/([^a-zA-Z0-9 ])|^[0-9]+/g, "").trim().toLowerCase();
  str = str.replace(/([ 0-9]+)([a-zA-Z])/g, function(a, b, c) {
    return b.trim() + c.toUpperCase();
  });
  return str;
}
function deCamelCase(str) {
  return str.replace(/([A-Z])/g, (match) => ` ${match}`).replace(/^./, (match) => match.toUpperCase());
}
function id() {
  return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
}
function setColumnDefaults(columns) {
  if (!columns) return;
  let treeColumnFound = false;
  for (const column of columns) {
    if (!column.$$id) {
      column.$$id = id();
    }
    if (isNullOrUndefined(column.prop) && column.name) {
      column.prop = camelCase(column.name);
    }
    if (!column.$$valueGetter) {
      column.$$valueGetter = getterForProp(column.prop);
    }
    if (!isNullOrUndefined(column.prop) && isNullOrUndefined(column.name)) {
      column.name = deCamelCase(String(column.prop));
    }
    if (isNullOrUndefined(column.prop) && isNullOrUndefined(column.name)) {
      column.name = "";
    }
    if (!column.hasOwnProperty("resizeable")) {
      column.resizeable = true;
    }
    if (!column.hasOwnProperty("sortable")) {
      column.sortable = true;
    }
    if (!column.hasOwnProperty("draggable")) {
      column.draggable = true;
    }
    if (!column.hasOwnProperty("canAutoResize")) {
      column.canAutoResize = true;
    }
    if (!column.hasOwnProperty("width")) {
      column.width = 150;
    }
    if (!column.hasOwnProperty("isTreeColumn")) {
      column.isTreeColumn = false;
    } else {
      if (column.isTreeColumn && !treeColumnFound) {
        treeColumnFound = true;
      } else {
        column.isTreeColumn = false;
      }
    }
  }
}
function isNullOrUndefined(value) {
  return value === null || value === void 0;
}
function translateTemplates(templates) {
  const result = [];
  for (const temp of templates) {
    const col = {};
    const props = Object.getOwnPropertyNames(temp);
    for (const prop of props) {
      col[prop] = temp[prop];
    }
    if (temp.headerTemplate) {
      col.headerTemplate = temp.headerTemplate;
    }
    if (temp.cellTemplate) {
      col.cellTemplate = temp.cellTemplate;
    }
    if (temp.summaryFunc) {
      col.summaryFunc = temp.summaryFunc;
    }
    if (temp.summaryTemplate) {
      col.summaryTemplate = temp.summaryTemplate;
    }
    result.push(col);
  }
  return result;
}
var ColumnMode;
(function(ColumnMode2) {
  ColumnMode2["standard"] = "standard";
  ColumnMode2["flex"] = "flex";
  ColumnMode2["force"] = "force";
})(ColumnMode || (ColumnMode = {}));
var SelectionType;
(function(SelectionType2) {
  SelectionType2["single"] = "single";
  SelectionType2["multi"] = "multi";
  SelectionType2["multiClick"] = "multiClick";
  SelectionType2["cell"] = "cell";
  SelectionType2["checkbox"] = "checkbox";
})(SelectionType || (SelectionType = {}));
var SortType;
(function(SortType2) {
  SortType2["single"] = "single";
  SortType2["multi"] = "multi";
})(SortType || (SortType = {}));
var ContextmenuType;
(function(ContextmenuType2) {
  ContextmenuType2["header"] = "header";
  ContextmenuType2["body"] = "body";
})(ContextmenuType || (ContextmenuType = {}));
var DataTableColumnHeaderDirective = class {
  constructor(template) {
    this.template = template;
  }
};
DataTableColumnHeaderDirective.\u0275fac = function DataTableColumnHeaderDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableColumnHeaderDirective)(\u0275\u0275directiveInject(TemplateRef));
};
DataTableColumnHeaderDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: DataTableColumnHeaderDirective,
  selectors: [["", "ngx-datatable-header-template", ""]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableColumnHeaderDirective, [{
    type: Directive,
    args: [{
      selector: "[ngx-datatable-header-template]"
    }]
  }], function() {
    return [{
      type: TemplateRef
    }];
  }, null);
})();
var DataTableColumnCellDirective = class {
  constructor(template) {
    this.template = template;
  }
};
DataTableColumnCellDirective.\u0275fac = function DataTableColumnCellDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableColumnCellDirective)(\u0275\u0275directiveInject(TemplateRef));
};
DataTableColumnCellDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: DataTableColumnCellDirective,
  selectors: [["", "ngx-datatable-cell-template", ""]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableColumnCellDirective, [{
    type: Directive,
    args: [{
      selector: "[ngx-datatable-cell-template]"
    }]
  }], function() {
    return [{
      type: TemplateRef
    }];
  }, null);
})();
var DataTableColumnCellTreeToggle = class {
  constructor(template) {
    this.template = template;
  }
};
DataTableColumnCellTreeToggle.\u0275fac = function DataTableColumnCellTreeToggle_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableColumnCellTreeToggle)(\u0275\u0275directiveInject(TemplateRef));
};
DataTableColumnCellTreeToggle.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: DataTableColumnCellTreeToggle,
  selectors: [["", "ngx-datatable-tree-toggle", ""]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableColumnCellTreeToggle, [{
    type: Directive,
    args: [{
      selector: "[ngx-datatable-tree-toggle]"
    }]
  }], function() {
    return [{
      type: TemplateRef
    }];
  }, null);
})();
var DataTableColumnDirective = class {
  constructor(columnChangesService) {
    this.columnChangesService = columnChangesService;
    this.isFirstChange = true;
  }
  get cellTemplate() {
    return this._cellTemplateInput || this._cellTemplateQuery;
  }
  get headerTemplate() {
    return this._headerTemplateInput || this._headerTemplateQuery;
  }
  get treeToggleTemplate() {
    return this._treeToggleTemplateInput || this._treeToggleTemplateQuery;
  }
  ngOnChanges() {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.columnChangesService.onInputChange();
    }
  }
};
DataTableColumnDirective.\u0275fac = function DataTableColumnDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableColumnDirective)(\u0275\u0275directiveInject(ColumnChangesService));
};
DataTableColumnDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: DataTableColumnDirective,
  selectors: [["ngx-datatable-column"]],
  contentQueries: function DataTableColumnDirective_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      \u0275\u0275contentQuery(dirIndex, DataTableColumnCellDirective, 7, TemplateRef);
      \u0275\u0275contentQuery(dirIndex, DataTableColumnHeaderDirective, 7, TemplateRef);
      \u0275\u0275contentQuery(dirIndex, DataTableColumnCellTreeToggle, 7, TemplateRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._cellTemplateQuery = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._headerTemplateQuery = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._treeToggleTemplateQuery = _t.first);
    }
  },
  inputs: {
    name: "name",
    prop: "prop",
    frozenLeft: "frozenLeft",
    frozenRight: "frozenRight",
    flexGrow: "flexGrow",
    resizeable: "resizeable",
    comparator: "comparator",
    pipe: "pipe",
    sortable: "sortable",
    draggable: "draggable",
    canAutoResize: "canAutoResize",
    minWidth: "minWidth",
    width: "width",
    maxWidth: "maxWidth",
    checkboxable: "checkboxable",
    headerCheckboxable: "headerCheckboxable",
    headerClass: "headerClass",
    cellClass: "cellClass",
    isTreeColumn: "isTreeColumn",
    treeLevelIndent: "treeLevelIndent",
    summaryFunc: "summaryFunc",
    summaryTemplate: "summaryTemplate",
    _cellTemplateInput: [0, "cellTemplate", "_cellTemplateInput"],
    _headerTemplateInput: [0, "headerTemplate", "_headerTemplateInput"],
    _treeToggleTemplateInput: [0, "treeToggleTemplate", "_treeToggleTemplateInput"]
  },
  features: [\u0275\u0275NgOnChangesFeature]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableColumnDirective, [{
    type: Directive,
    args: [{
      selector: "ngx-datatable-column"
    }]
  }], function() {
    return [{
      type: ColumnChangesService
    }];
  }, {
    name: [{
      type: Input
    }],
    prop: [{
      type: Input
    }],
    frozenLeft: [{
      type: Input
    }],
    frozenRight: [{
      type: Input
    }],
    flexGrow: [{
      type: Input
    }],
    resizeable: [{
      type: Input
    }],
    comparator: [{
      type: Input
    }],
    pipe: [{
      type: Input
    }],
    sortable: [{
      type: Input
    }],
    draggable: [{
      type: Input
    }],
    canAutoResize: [{
      type: Input
    }],
    minWidth: [{
      type: Input
    }],
    width: [{
      type: Input
    }],
    maxWidth: [{
      type: Input
    }],
    checkboxable: [{
      type: Input
    }],
    headerCheckboxable: [{
      type: Input
    }],
    headerClass: [{
      type: Input
    }],
    cellClass: [{
      type: Input
    }],
    isTreeColumn: [{
      type: Input
    }],
    treeLevelIndent: [{
      type: Input
    }],
    summaryFunc: [{
      type: Input
    }],
    summaryTemplate: [{
      type: Input
    }],
    _cellTemplateInput: [{
      type: Input,
      args: ["cellTemplate"]
    }],
    _cellTemplateQuery: [{
      type: ContentChild,
      args: [DataTableColumnCellDirective, {
        read: TemplateRef,
        static: true
      }]
    }],
    _headerTemplateInput: [{
      type: Input,
      args: ["headerTemplate"]
    }],
    _headerTemplateQuery: [{
      type: ContentChild,
      args: [DataTableColumnHeaderDirective, {
        read: TemplateRef,
        static: true
      }]
    }],
    _treeToggleTemplateInput: [{
      type: Input,
      args: ["treeToggleTemplate"]
    }],
    _treeToggleTemplateQuery: [{
      type: ContentChild,
      args: [DataTableColumnCellTreeToggle, {
        read: TemplateRef,
        static: true
      }]
    }]
  });
})();
var DatatableRowDetailTemplateDirective = class {
  constructor(template) {
    this.template = template;
  }
};
DatatableRowDetailTemplateDirective.\u0275fac = function DatatableRowDetailTemplateDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DatatableRowDetailTemplateDirective)(\u0275\u0275directiveInject(TemplateRef));
};
DatatableRowDetailTemplateDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: DatatableRowDetailTemplateDirective,
  selectors: [["", "ngx-datatable-row-detail-template", ""]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DatatableRowDetailTemplateDirective, [{
    type: Directive,
    args: [{
      selector: "[ngx-datatable-row-detail-template]"
    }]
  }], function() {
    return [{
      type: TemplateRef
    }];
  }, null);
})();
var DatatableRowDetailDirective = class {
  constructor() {
    this.rowHeight = 0;
    this.toggle = new EventEmitter();
  }
  get template() {
    return this._templateInput || this._templateQuery;
  }
  /**
   * Toggle the expansion of the row
   */
  toggleExpandRow(row) {
    this.toggle.emit({
      type: "row",
      value: row
    });
  }
  /**
   * API method to expand all the rows.
   */
  expandAllRows() {
    this.toggle.emit({
      type: "all",
      value: true
    });
  }
  /**
   * API method to collapse all the rows.
   */
  collapseAllRows() {
    this.toggle.emit({
      type: "all",
      value: false
    });
  }
};
DatatableRowDetailDirective.\u0275fac = function DatatableRowDetailDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DatatableRowDetailDirective)();
};
DatatableRowDetailDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: DatatableRowDetailDirective,
  selectors: [["ngx-datatable-row-detail"]],
  contentQueries: function DatatableRowDetailDirective_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      \u0275\u0275contentQuery(dirIndex, DatatableRowDetailTemplateDirective, 7, TemplateRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._templateQuery = _t.first);
    }
  },
  inputs: {
    rowHeight: "rowHeight",
    _templateInput: [0, "template", "_templateInput"]
  },
  outputs: {
    toggle: "toggle"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DatatableRowDetailDirective, [{
    type: Directive,
    args: [{
      selector: "ngx-datatable-row-detail"
    }]
  }], null, {
    rowHeight: [{
      type: Input
    }],
    _templateInput: [{
      type: Input,
      args: ["template"]
    }],
    _templateQuery: [{
      type: ContentChild,
      args: [DatatableRowDetailTemplateDirective, {
        read: TemplateRef,
        static: true
      }]
    }],
    toggle: [{
      type: Output
    }]
  });
})();
var DatatableFooterDirective = class {
  get template() {
    return this._templateInput || this._templateQuery;
  }
};
DatatableFooterDirective.\u0275fac = function DatatableFooterDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DatatableFooterDirective)();
};
DatatableFooterDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: DatatableFooterDirective,
  selectors: [["ngx-datatable-footer"]],
  contentQueries: function DatatableFooterDirective_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      \u0275\u0275contentQuery(dirIndex, DataTableFooterTemplateDirective, 5, TemplateRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._templateQuery = _t.first);
    }
  },
  inputs: {
    footerHeight: "footerHeight",
    totalMessage: "totalMessage",
    selectedMessage: "selectedMessage",
    pagerLeftArrowIcon: "pagerLeftArrowIcon",
    pagerRightArrowIcon: "pagerRightArrowIcon",
    pagerPreviousIcon: "pagerPreviousIcon",
    pagerNextIcon: "pagerNextIcon",
    _templateInput: [0, "template", "_templateInput"]
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DatatableFooterDirective, [{
    type: Directive,
    args: [{
      selector: "ngx-datatable-footer"
    }]
  }], null, {
    footerHeight: [{
      type: Input
    }],
    totalMessage: [{
      type: Input
    }],
    selectedMessage: [{
      type: Input
    }],
    pagerLeftArrowIcon: [{
      type: Input
    }],
    pagerRightArrowIcon: [{
      type: Input
    }],
    pagerPreviousIcon: [{
      type: Input
    }],
    pagerNextIcon: [{
      type: Input
    }],
    _templateInput: [{
      type: Input,
      args: ["template"]
    }],
    _templateQuery: [{
      type: ContentChild,
      args: [DataTableFooterTemplateDirective, {
        read: TemplateRef
      }]
    }]
  });
})();
function columnsByPin(cols) {
  const ret = {
    left: [],
    center: [],
    right: []
  };
  if (cols) {
    for (const col of cols) {
      if (col.frozenLeft) {
        ret.left.push(col);
      } else if (col.frozenRight) {
        ret.right.push(col);
      } else {
        ret.center.push(col);
      }
    }
  }
  return ret;
}
function columnGroupWidths(groups, all) {
  return {
    left: columnTotalWidth(groups.left),
    center: columnTotalWidth(groups.center),
    right: columnTotalWidth(groups.right),
    total: Math.floor(columnTotalWidth(all))
  };
}
function columnTotalWidth(columns, prop) {
  let totalWidth = 0;
  if (columns) {
    for (const c of columns) {
      const has = prop && c[prop];
      const width = has ? c[prop] : c.width;
      totalWidth = totalWidth + parseFloat(width);
    }
  }
  return totalWidth;
}
function columnsTotalWidth(columns, prop) {
  let totalWidth = 0;
  for (const column of columns) {
    const has = prop && column[prop];
    totalWidth = totalWidth + (has ? column[prop] : column.width);
  }
  return totalWidth;
}
function columnsByPinArr(val) {
  const colsByPinArr = [];
  const colsByPin = columnsByPin(val);
  colsByPinArr.push({
    type: "left",
    columns: colsByPin["left"]
  });
  colsByPinArr.push({
    type: "center",
    columns: colsByPin["center"]
  });
  colsByPinArr.push({
    type: "right",
    columns: colsByPin["right"]
  });
  return colsByPinArr;
}
var RowHeightCache = class {
  constructor() {
    this.treeArray = [];
  }
  /**
   * Clear the Tree array.
   */
  clearCache() {
    this.treeArray = [];
  }
  /**
   * Initialize the Fenwick tree with row Heights.
   *
   * @param rows The array of rows which contain the expanded status.
   * @param rowHeight The row height.
   * @param detailRowHeight The detail row height.
   */
  initCache(details) {
    const {
      rows,
      rowHeight,
      detailRowHeight,
      externalVirtual,
      rowCount,
      rowIndexes,
      rowExpansions
    } = details;
    const isFn = typeof rowHeight === "function";
    const isDetailFn = typeof detailRowHeight === "function";
    if (!isFn && isNaN(rowHeight)) {
      throw new Error(`Row Height cache initialization failed. Please ensure that 'rowHeight' is a
        valid number or function value: (${rowHeight}) when 'scrollbarV' is enabled.`);
    }
    if (!isDetailFn && isNaN(detailRowHeight)) {
      throw new Error(`Row Height cache initialization failed. Please ensure that 'detailRowHeight' is a
        valid number or function value: (${detailRowHeight}) when 'scrollbarV' is enabled.`);
    }
    const n = externalVirtual ? rowCount : rows.length;
    this.treeArray = new Array(n);
    for (let i = 0; i < n; ++i) {
      this.treeArray[i] = 0;
    }
    for (let i = 0; i < n; ++i) {
      const row = rows[i];
      let currentRowHeight = rowHeight;
      if (isFn) {
        currentRowHeight = rowHeight(row);
      }
      const expanded = rowExpansions.has(row);
      if (row && expanded) {
        if (isDetailFn) {
          const index = rowIndexes.get(row);
          currentRowHeight += detailRowHeight(row, index);
        } else {
          currentRowHeight += detailRowHeight;
        }
      }
      this.update(i, currentRowHeight);
    }
  }
  /**
   * Given the ScrollY position i.e. sum, provide the rowIndex
   * that is present in the current view port.  Below handles edge cases.
   */
  getRowIndex(scrollY) {
    if (scrollY === 0) return 0;
    return this.calcRowIndex(scrollY);
  }
  /**
   * When a row is expanded or rowHeight is changed, update the height.  This can
   * be utilized in future when Angular Data table supports dynamic row heights.
   */
  update(atRowIndex, byRowHeight) {
    if (!this.treeArray.length) {
      throw new Error(`Update at index ${atRowIndex} with value ${byRowHeight} failed:
        Row Height cache not initialized.`);
    }
    const n = this.treeArray.length;
    atRowIndex |= 0;
    while (atRowIndex < n) {
      this.treeArray[atRowIndex] += byRowHeight;
      atRowIndex |= atRowIndex + 1;
    }
  }
  /**
   * Range Sum query from 1 to the rowIndex
   */
  query(atIndex) {
    if (!this.treeArray.length) {
      throw new Error(`query at index ${atIndex} failed: Fenwick tree array not initialized.`);
    }
    let sum = 0;
    atIndex |= 0;
    while (atIndex >= 0) {
      sum += this.treeArray[atIndex];
      atIndex = (atIndex & atIndex + 1) - 1;
    }
    return sum;
  }
  /**
   * Find the total height between 2 row indexes
   */
  queryBetween(atIndexA, atIndexB) {
    return this.query(atIndexB) - this.query(atIndexA - 1);
  }
  /**
   * Given the ScrollY position i.e. sum, provide the rowIndex
   * that is present in the current view port.
   */
  calcRowIndex(sum) {
    if (!this.treeArray.length) return 0;
    let pos = -1;
    const dataLength = this.treeArray.length;
    const highestBit = Math.pow(2, dataLength.toString(2).length - 1);
    for (let blockSize = highestBit; blockSize !== 0; blockSize >>= 1) {
      const nextPos = pos + blockSize;
      if (nextPos < dataLength && sum >= this.treeArray[nextPos]) {
        sum -= this.treeArray[nextPos];
        pos = nextPos;
      }
    }
    return pos + 1;
  }
};
var cache = {};
var testStyle = typeof document !== "undefined" ? document.createElement("div").style : void 0;
var prefix = function() {
  const styles = typeof window !== "undefined" ? window.getComputedStyle(document.documentElement, "") : void 0;
  const match = typeof styles !== "undefined" ? Array.prototype.slice.call(styles).join("").match(/-(moz|webkit|ms)-/) : null;
  const pre = match !== null ? match[1] : void 0;
  const dom = typeof pre !== "undefined" ? "WebKit|Moz|MS|O".match(new RegExp("(" + pre + ")", "i"))[1] : void 0;
  return dom ? {
    dom,
    lowercase: pre,
    css: `-${pre}-`,
    js: pre[0].toUpperCase() + pre.substr(1)
  } : void 0;
}();
function getVendorPrefixedName(property) {
  const name = camelCase(property);
  if (!cache[name]) {
    if (prefix !== void 0 && testStyle[prefix.css + property] !== void 0) {
      cache[name] = prefix.css + property;
    } else if (testStyle[property] !== void 0) {
      cache[name] = property;
    }
  }
  return cache[name];
}
var transform = typeof window !== "undefined" ? getVendorPrefixedName("transform") : void 0;
var backfaceVisibility = typeof window !== "undefined" ? getVendorPrefixedName("backfaceVisibility") : void 0;
var hasCSSTransforms = typeof window !== "undefined" ? !!getVendorPrefixedName("transform") : void 0;
var hasCSS3DTransforms = typeof window !== "undefined" ? !!getVendorPrefixedName("perspective") : void 0;
var ua = typeof window !== "undefined" ? window.navigator.userAgent : "Chrome";
var isSafari = /Safari\//.test(ua) && !/Chrome\//.test(ua);
function translateXY(styles, x, y) {
  if (typeof transform !== "undefined" && hasCSSTransforms) {
    if (!isSafari && hasCSS3DTransforms) {
      styles[transform] = `translate3d(${x}px, ${y}px, 0)`;
      styles[backfaceVisibility] = "hidden";
    } else {
      styles[camelCase(transform)] = `translate(${x}px, ${y}px)`;
    }
  } else {
    styles.top = `${y}px`;
    styles.left = `${x}px`;
  }
}
var ProgressBarComponent = class {
};
ProgressBarComponent.\u0275fac = function ProgressBarComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || ProgressBarComponent)();
};
ProgressBarComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: ProgressBarComponent,
  selectors: [["datatable-progress"]],
  decls: 3,
  vars: 0,
  consts: [["role", "progressbar", 1, "progress-linear"], [1, "container"], [1, "bar"]],
  template: function ProgressBarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275element(2, "div", 2);
      \u0275\u0275elementEnd()();
    }
  },
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressBarComponent, [{
    type: Component,
    args: [{
      selector: "datatable-progress",
      template: `
    <div class="progress-linear" role="progressbar">
      <div class="container">
        <div class="bar"></div>
      </div>
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
function selectRows(selected, row, comparefn) {
  const selectedIndex = comparefn(row, selected);
  if (selectedIndex > -1) {
    selected.splice(selectedIndex, 1);
  } else {
    selected.push(row);
  }
  return selected;
}
function selectRowsBetween(selected, rows, index, prevIndex, comparefn) {
  const reverse = index < prevIndex;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const greater = i >= prevIndex && i <= index;
    const lesser = i <= prevIndex && i >= index;
    let range = {
      start: 0,
      end: 0
    };
    if (reverse) {
      range = {
        start: index,
        end: prevIndex
      };
    } else {
      range = {
        start: prevIndex,
        end: index + 1
      };
    }
    if (reverse && lesser || !reverse && greater) {
      if (i >= range.start && i <= range.end) {
        selected.push(row);
      }
    }
  }
  return selected;
}
var Keys;
(function(Keys2) {
  Keys2[Keys2["up"] = 38] = "up";
  Keys2[Keys2["down"] = 40] = "down";
  Keys2[Keys2["return"] = 13] = "return";
  Keys2[Keys2["escape"] = 27] = "escape";
  Keys2[Keys2["left"] = 37] = "left";
  Keys2[Keys2["right"] = 39] = "right";
})(Keys || (Keys = {}));
var DataTableSelectionComponent = class {
  constructor() {
    this.activate = new EventEmitter();
    this.select = new EventEmitter();
  }
  selectRow(event, index, row) {
    if (!this.selectEnabled) return;
    const chkbox = this.selectionType === SelectionType.checkbox;
    const multi = this.selectionType === SelectionType.multi;
    const multiClick = this.selectionType === SelectionType.multiClick;
    let selected = [];
    if (multi || chkbox || multiClick) {
      if (event.shiftKey) {
        selected = selectRowsBetween([], this.rows, index, this.prevIndex, this.getRowSelectedIdx.bind(this));
      } else if (event.ctrlKey || event.metaKey || multiClick || chkbox) {
        selected = selectRows([...this.selected], row, this.getRowSelectedIdx.bind(this));
      } else {
        selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
      }
    } else {
      selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
    }
    if (typeof this.selectCheck === "function") {
      selected = selected.filter(this.selectCheck.bind(this));
    }
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.prevIndex = index;
    this.select.emit({
      selected
    });
  }
  onActivate(model, index) {
    const {
      type,
      event,
      row
    } = model;
    const chkbox = this.selectionType === SelectionType.checkbox;
    const select = !chkbox && (type === "click" || type === "dblclick") || chkbox && type === "checkbox";
    if (select) {
      this.selectRow(event, index, row);
    } else if (type === "keydown") {
      if (event.keyCode === Keys.return) {
        this.selectRow(event, index, row);
      } else {
        this.onKeyboardFocus(model);
      }
    }
    this.activate.emit(model);
  }
  onKeyboardFocus(model) {
    const {
      keyCode
    } = model.event;
    const shouldFocus = keyCode === Keys.up || keyCode === Keys.down || keyCode === Keys.right || keyCode === Keys.left;
    if (shouldFocus) {
      const isCellSelection = this.selectionType === SelectionType.cell;
      if (!model.cellElement || !isCellSelection) {
        this.focusRow(model.rowElement, keyCode);
      } else if (isCellSelection) {
        this.focusCell(model.cellElement, model.rowElement, keyCode, model.cellIndex);
      }
    }
  }
  focusRow(rowElement, keyCode) {
    const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
    if (nextRowElement) nextRowElement.focus();
  }
  getPrevNextRow(rowElement, keyCode) {
    const parentElement = rowElement.parentElement;
    if (parentElement) {
      let focusElement;
      if (keyCode === Keys.up) {
        focusElement = parentElement.previousElementSibling;
      } else if (keyCode === Keys.down) {
        focusElement = parentElement.nextElementSibling;
      }
      if (focusElement && focusElement.children.length) {
        return focusElement.children[0];
      }
    }
  }
  focusCell(cellElement, rowElement, keyCode, cellIndex) {
    let nextCellElement;
    if (keyCode === Keys.left) {
      nextCellElement = cellElement.previousElementSibling;
    } else if (keyCode === Keys.right) {
      nextCellElement = cellElement.nextElementSibling;
    } else if (keyCode === Keys.up || keyCode === Keys.down) {
      const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
      if (nextRowElement) {
        const children = nextRowElement.getElementsByClassName("datatable-body-cell");
        if (children.length) nextCellElement = children[cellIndex];
      }
    }
    if (nextCellElement) nextCellElement.focus();
  }
  getRowSelected(row) {
    return this.getRowSelectedIdx(row, this.selected) > -1;
  }
  getRowSelectedIdx(row, selected) {
    if (!selected || !selected.length) return -1;
    const rowId = this.rowIdentity(row);
    return selected.findIndex((r) => {
      const id2 = this.rowIdentity(r);
      return id2 === rowId;
    });
  }
};
DataTableSelectionComponent.\u0275fac = function DataTableSelectionComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableSelectionComponent)();
};
DataTableSelectionComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: DataTableSelectionComponent,
  selectors: [["datatable-selection"]],
  inputs: {
    rows: "rows",
    selected: "selected",
    selectEnabled: "selectEnabled",
    selectionType: "selectionType",
    rowIdentity: "rowIdentity",
    selectCheck: "selectCheck"
  },
  outputs: {
    activate: "activate",
    select: "select"
  },
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function DataTableSelectionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275projection(0);
    }
  },
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableSelectionComponent, [{
    type: Component,
    args: [{
      selector: "datatable-selection",
      template: ` <ng-content></ng-content> `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, {
    rows: [{
      type: Input
    }],
    selected: [{
      type: Input
    }],
    selectEnabled: [{
      type: Input
    }],
    selectionType: [{
      type: Input
    }],
    rowIdentity: [{
      type: Input
    }],
    selectCheck: [{
      type: Input
    }],
    activate: [{
      type: Output
    }],
    select: [{
      type: Output
    }]
  });
})();
var SortDirection;
(function(SortDirection2) {
  SortDirection2["asc"] = "asc";
  SortDirection2["desc"] = "desc";
})(SortDirection || (SortDirection = {}));
var DataTableBodyCellComponent = class {
  constructor(element, cd) {
    this.cd = cd;
    this.activate = new EventEmitter();
    this.treeAction = new EventEmitter();
    this.isFocused = false;
    this.onCheckboxChangeFn = this.onCheckboxChange.bind(this);
    this.activateFn = this.activate.emit.bind(this.activate);
    this.cellContext = {
      onCheckboxChangeFn: this.onCheckboxChangeFn,
      activateFn: this.activateFn,
      row: this.row,
      group: this.group,
      value: this.value,
      column: this.column,
      rowHeight: this.rowHeight,
      isSelected: this.isSelected,
      rowIndex: this.rowIndex,
      treeStatus: this.treeStatus,
      onTreeAction: this.onTreeAction.bind(this)
    };
    this._element = element.nativeElement;
  }
  set group(group) {
    this._group = group;
    this.cellContext.group = group;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }
  get group() {
    return this._group;
  }
  set rowHeight(val) {
    this._rowHeight = val;
    this.cellContext.rowHeight = val;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }
  get rowHeight() {
    return this._rowHeight;
  }
  set isSelected(val) {
    this._isSelected = val;
    this.cellContext.isSelected = val;
    this.cd.markForCheck();
  }
  get isSelected() {
    return this._isSelected;
  }
  set expanded(val) {
    this._expanded = val;
    this.cellContext.expanded = val;
    this.cd.markForCheck();
  }
  get expanded() {
    return this._expanded;
  }
  set rowIndex(val) {
    this._rowIndex = val;
    this.cellContext.rowIndex = val;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }
  get rowIndex() {
    return this._rowIndex;
  }
  set column(column) {
    this._column = column;
    this.cellContext.column = column;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }
  get column() {
    return this._column;
  }
  set row(row) {
    this._row = row;
    this.cellContext.row = row;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }
  get row() {
    return this._row;
  }
  set sorts(val) {
    this._sorts = val;
    this.calcSortDir = this.calcSortDir(val);
  }
  get sorts() {
    return this._sorts;
  }
  set treeStatus(status) {
    if (status !== "collapsed" && status !== "expanded" && status !== "loading" && status !== "disabled") {
      this._treeStatus = "collapsed";
    } else {
      this._treeStatus = status;
    }
    this.cellContext.treeStatus = this._treeStatus;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }
  get treeStatus() {
    return this._treeStatus;
  }
  get columnCssClasses() {
    let cls = "datatable-body-cell";
    if (this.column.cellClass) {
      if (typeof this.column.cellClass === "string") {
        cls += " " + this.column.cellClass;
      } else if (typeof this.column.cellClass === "function") {
        const res = this.column.cellClass({
          row: this.row,
          group: this.group,
          column: this.column,
          value: this.value,
          rowHeight: this.rowHeight
        });
        if (typeof res === "string") {
          cls += " " + res;
        } else if (typeof res === "object") {
          const keys = Object.keys(res);
          for (const k of keys) {
            if (res[k] === true) {
              cls += ` ${k}`;
            }
          }
        }
      }
    }
    if (!this.sortDir) {
      cls += " sort-active";
    }
    if (this.isFocused) {
      cls += " active";
    }
    if (this.sortDir === SortDirection.asc) {
      cls += " sort-asc";
    }
    if (this.sortDir === SortDirection.desc) {
      cls += " sort-desc";
    }
    return cls;
  }
  get width() {
    return this.column.width;
  }
  get minWidth() {
    return this.column.minWidth;
  }
  get maxWidth() {
    return this.column.maxWidth;
  }
  get height() {
    const height = this.rowHeight;
    if (isNaN(height)) {
      return height;
    }
    return height + "px";
  }
  ngDoCheck() {
    this.checkValueUpdates();
  }
  ngOnDestroy() {
    if (this.cellTemplate) {
      this.cellTemplate.clear();
    }
  }
  checkValueUpdates() {
    let value = "";
    if (!this.row || !this.column) {
      value = "";
    } else {
      const val = this.column.$$valueGetter(this.row, this.column.prop);
      const userPipe = this.column.pipe;
      if (userPipe) {
        value = userPipe.transform(val);
      } else if (value !== void 0) {
        value = val;
      }
    }
    if (this.value !== value) {
      this.value = value;
      this.cellContext.value = value;
      this.sanitizedValue = value !== null && value !== void 0 ? this.stripHtml(value) : value;
      this.cd.markForCheck();
    }
  }
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }
  onClick(event) {
    this.activate.emit({
      type: "click",
      event,
      row: this.row,
      group: this.group,
      rowHeight: this.rowHeight,
      column: this.column,
      value: this.value,
      cellElement: this._element
    });
  }
  onDblClick(event) {
    this.activate.emit({
      type: "dblclick",
      event,
      row: this.row,
      group: this.group,
      rowHeight: this.rowHeight,
      column: this.column,
      value: this.value,
      cellElement: this._element
    });
  }
  onKeyDown(event) {
    const keyCode = event.keyCode;
    const isTargetCell = event.target === this._element;
    const isAction = keyCode === Keys.return || keyCode === Keys.down || keyCode === Keys.up || keyCode === Keys.left || keyCode === Keys.right;
    if (isAction && isTargetCell) {
      event.preventDefault();
      event.stopPropagation();
      this.activate.emit({
        type: "keydown",
        event,
        row: this.row,
        group: this.group,
        rowHeight: this.rowHeight,
        column: this.column,
        value: this.value,
        cellElement: this._element
      });
    }
  }
  onCheckboxChange(event) {
    this.activate.emit({
      type: "checkbox",
      event,
      row: this.row,
      group: this.group,
      rowHeight: this.rowHeight,
      column: this.column,
      value: this.value,
      cellElement: this._element,
      treeStatus: "collapsed"
    });
  }
  calcSortDir(sorts) {
    if (!sorts) {
      return;
    }
    const sort = sorts.find((s) => {
      return s.prop === this.column.prop;
    });
    if (sort) {
      return sort.dir;
    }
  }
  stripHtml(html) {
    if (!html.replace) {
      return html;
    }
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }
  onTreeAction() {
    this.treeAction.emit(this.row);
  }
  calcLeftMargin(column, row) {
    const levelIndent = column.treeLevelIndent != null ? column.treeLevelIndent : 50;
    return column.isTreeColumn ? row.level * levelIndent : 0;
  }
};
DataTableBodyCellComponent.\u0275fac = function DataTableBodyCellComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableBodyCellComponent)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(ChangeDetectorRef));
};
DataTableBodyCellComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: DataTableBodyCellComponent,
  selectors: [["datatable-body-cell"]],
  viewQuery: function DataTableBodyCellComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c1, 7, ViewContainerRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.cellTemplate = _t.first);
    }
  },
  hostVars: 10,
  hostBindings: function DataTableBodyCellComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("focus", function DataTableBodyCellComponent_focus_HostBindingHandler() {
        return ctx.onFocus();
      })("blur", function DataTableBodyCellComponent_blur_HostBindingHandler() {
        return ctx.onBlur();
      })("click", function DataTableBodyCellComponent_click_HostBindingHandler($event) {
        return ctx.onClick($event);
      })("dblclick", function DataTableBodyCellComponent_dblclick_HostBindingHandler($event) {
        return ctx.onDblClick($event);
      })("keydown", function DataTableBodyCellComponent_keydown_HostBindingHandler($event) {
        return ctx.onKeyDown($event);
      });
    }
    if (rf & 2) {
      \u0275\u0275classMap(ctx.columnCssClasses);
      \u0275\u0275styleProp("width", ctx.width, "px")("min-width", ctx.minWidth, "px")("max-width", ctx.maxWidth, "px")("height", ctx.height);
    }
  },
  inputs: {
    displayCheck: "displayCheck",
    group: "group",
    rowHeight: "rowHeight",
    isSelected: "isSelected",
    expanded: "expanded",
    rowIndex: "rowIndex",
    column: "column",
    row: "row",
    sorts: "sorts",
    treeStatus: "treeStatus"
  },
  outputs: {
    activate: "activate",
    treeAction: "treeAction"
  },
  decls: 5,
  vars: 6,
  consts: [["cellTemplate", ""], [1, "datatable-body-cell-label"], ["class", "datatable-checkbox", 4, "ngIf"], [4, "ngIf"], [3, "title", "innerHTML", 4, "ngIf"], [1, "datatable-checkbox"], ["type", "checkbox", 3, "click", "checked"], ["class", "datatable-tree-button", 3, "disabled", "click", 4, "ngIf"], [1, "datatable-tree-button", 3, "click", "disabled"], ["class", "icon datatable-icon-collapse", 4, "ngIf"], ["class", "icon datatable-icon-up", 4, "ngIf"], ["class", "icon datatable-icon-down", 4, "ngIf"], [1, "icon", "datatable-icon-collapse"], [1, "icon", "datatable-icon-up"], [1, "icon", "datatable-icon-down"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [3, "title", "innerHTML"]],
  template: function DataTableBodyCellComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1);
      \u0275\u0275template(1, DataTableBodyCellComponent_label_1_Template, 2, 1, "label", 2)(2, DataTableBodyCellComponent_ng_container_2_Template, 3, 2, "ng-container", 3)(3, DataTableBodyCellComponent_span_3_Template, 1, 2, "span", 4)(4, DataTableBodyCellComponent_4_Template, 2, 2, null, 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275styleProp("margin-left", ctx.calcLeftMargin(ctx.column, ctx.row), "px");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.column.checkboxable && (!ctx.displayCheck || ctx.displayCheck(ctx.row, ctx.column, ctx.value)));
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.column.isTreeColumn);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.column.cellTemplate);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.column.cellTemplate);
    }
  },
  dependencies: [NgIf, NgTemplateOutlet],
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableBodyCellComponent, [{
    type: Component,
    args: [{
      selector: "datatable-body-cell",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="datatable-body-cell-label" [style.margin-left.px]="calcLeftMargin(column, row)">
      <label
        *ngIf="column.checkboxable && (!displayCheck || displayCheck(row, column, value))"
        class="datatable-checkbox"
      >
        <input type="checkbox" [checked]="isSelected" (click)="onCheckboxChange($event)" />
      </label>
      <ng-container *ngIf="column.isTreeColumn">
        <button
          *ngIf="!column.treeToggleTemplate"
          class="datatable-tree-button"
          [disabled]="treeStatus === 'disabled'"
          (click)="onTreeAction()"
        >
          <span>
            <i *ngIf="treeStatus === 'loading'" class="icon datatable-icon-collapse"></i>
            <i *ngIf="treeStatus === 'collapsed'" class="icon datatable-icon-up"></i>
            <i *ngIf="treeStatus === 'expanded' || treeStatus === 'disabled'" class="icon datatable-icon-down"></i>
          </span>
        </button>
        <ng-template
          *ngIf="column.treeToggleTemplate"
          [ngTemplateOutlet]="column.treeToggleTemplate"
          [ngTemplateOutletContext]="{ cellContext: cellContext }"
        >
        </ng-template>
      </ng-container>

      <span *ngIf="!column.cellTemplate" [title]="sanitizedValue" [innerHTML]="value"> </span>
      <ng-template
        #cellTemplate
        *ngIf="column.cellTemplate"
        [ngTemplateOutlet]="column.cellTemplate"
        [ngTemplateOutletContext]="cellContext"
      >
      </ng-template>
    </div>
  `
    }]
  }], function() {
    return [{
      type: ElementRef
    }, {
      type: ChangeDetectorRef
    }];
  }, {
    displayCheck: [{
      type: Input
    }],
    group: [{
      type: Input
    }],
    rowHeight: [{
      type: Input
    }],
    isSelected: [{
      type: Input
    }],
    expanded: [{
      type: Input
    }],
    rowIndex: [{
      type: Input
    }],
    column: [{
      type: Input
    }],
    row: [{
      type: Input
    }],
    sorts: [{
      type: Input
    }],
    treeStatus: [{
      type: Input
    }],
    activate: [{
      type: Output
    }],
    treeAction: [{
      type: Output
    }],
    cellTemplate: [{
      type: ViewChild,
      args: ["cellTemplate", {
        read: ViewContainerRef,
        static: true
      }]
    }],
    columnCssClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    width: [{
      type: HostBinding,
      args: ["style.width.px"]
    }],
    minWidth: [{
      type: HostBinding,
      args: ["style.minWidth.px"]
    }],
    maxWidth: [{
      type: HostBinding,
      args: ["style.maxWidth.px"]
    }],
    height: [{
      type: HostBinding,
      args: ["style.height"]
    }],
    onFocus: [{
      type: HostListener,
      args: ["focus"]
    }],
    onBlur: [{
      type: HostListener,
      args: ["blur"]
    }],
    onClick: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }],
    onDblClick: [{
      type: HostListener,
      args: ["dblclick", ["$event"]]
    }],
    onKeyDown: [{
      type: HostListener,
      args: ["keydown", ["$event"]]
    }]
  });
})();
var DataTableBodyRowComponent = class {
  constructor(differs, scrollbarHelper, cd, element) {
    this.differs = differs;
    this.scrollbarHelper = scrollbarHelper;
    this.cd = cd;
    this.treeStatus = "collapsed";
    this.activate = new EventEmitter();
    this.treeAction = new EventEmitter();
    this._groupStyles = {
      left: {},
      center: {},
      right: {}
    };
    this._element = element.nativeElement;
    this._rowDiffer = differs.find({}).create();
  }
  set columns(val) {
    this._columns = val;
    this.recalculateColumns(val);
    this.buildStylesByGroup();
  }
  get columns() {
    return this._columns;
  }
  set innerWidth(val) {
    if (this._columns) {
      const colByPin = columnsByPin(this._columns);
      this._columnGroupWidths = columnGroupWidths(colByPin, this._columns);
    }
    this._innerWidth = val;
    this.recalculateColumns();
    this.buildStylesByGroup();
  }
  get innerWidth() {
    return this._innerWidth;
  }
  set offsetX(val) {
    this._offsetX = val;
    this.buildStylesByGroup();
  }
  get offsetX() {
    return this._offsetX;
  }
  get cssClass() {
    let cls = "datatable-body-row";
    if (this.isSelected) {
      cls += " active";
    }
    if (this.rowIndex % 2 !== 0) {
      cls += " datatable-row-odd";
    }
    if (this.rowIndex % 2 === 0) {
      cls += " datatable-row-even";
    }
    if (this.rowClass) {
      const res = this.rowClass(this.row);
      if (typeof res === "string") {
        cls += ` ${res}`;
      } else if (typeof res === "object") {
        const keys = Object.keys(res);
        for (const k of keys) {
          if (res[k] === true) {
            cls += ` ${k}`;
          }
        }
      }
    }
    return cls;
  }
  get columnsTotalWidths() {
    return this._columnGroupWidths.total;
  }
  ngDoCheck() {
    if (this._rowDiffer.diff(this.row)) {
      this.cd.markForCheck();
    }
  }
  trackByGroups(index, colGroup) {
    return colGroup.type;
  }
  columnTrackingFn(index, column) {
    return column.$$id;
  }
  buildStylesByGroup() {
    this._groupStyles.left = this.calcStylesByGroup("left");
    this._groupStyles.center = this.calcStylesByGroup("center");
    this._groupStyles.right = this.calcStylesByGroup("right");
    this.cd.markForCheck();
  }
  calcStylesByGroup(group) {
    const widths = this._columnGroupWidths;
    const offsetX = this.offsetX;
    const styles = {
      width: `${widths[group]}px`
    };
    if (group === "left") {
      translateXY(styles, offsetX, 0);
    } else if (group === "right") {
      const bodyWidth = parseInt(this.innerWidth + "", 0);
      const totalDiff = widths.total - bodyWidth;
      const offsetDiff = totalDiff - offsetX;
      const offset = (offsetDiff + this.scrollbarHelper.width) * -1;
      translateXY(styles, offset, 0);
    }
    return styles;
  }
  onActivate(event, index) {
    event.cellIndex = index;
    event.rowElement = this._element;
    this.activate.emit(event);
  }
  onKeyDown(event) {
    const keyCode = event.keyCode;
    const isTargetRow = event.target === this._element;
    const isAction = keyCode === Keys.return || keyCode === Keys.down || keyCode === Keys.up || keyCode === Keys.left || keyCode === Keys.right;
    if (isAction && isTargetRow) {
      event.preventDefault();
      event.stopPropagation();
      this.activate.emit({
        type: "keydown",
        event,
        row: this.row,
        rowElement: this._element
      });
    }
  }
  onMouseenter(event) {
    this.activate.emit({
      type: "mouseenter",
      event,
      row: this.row,
      rowElement: this._element
    });
  }
  recalculateColumns(val = this.columns) {
    this._columns = val;
    const colsByPin = columnsByPin(this._columns);
    this._columnsByPin = columnsByPinArr(this._columns);
    this._columnGroupWidths = columnGroupWidths(colsByPin, this._columns);
  }
  onTreeAction() {
    this.treeAction.emit();
  }
};
DataTableBodyRowComponent.\u0275fac = function DataTableBodyRowComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableBodyRowComponent)(\u0275\u0275directiveInject(KeyValueDiffers), \u0275\u0275directiveInject(ScrollbarHelper, 4), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(ElementRef));
};
DataTableBodyRowComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: DataTableBodyRowComponent,
  selectors: [["datatable-body-row"]],
  hostVars: 6,
  hostBindings: function DataTableBodyRowComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown", function DataTableBodyRowComponent_keydown_HostBindingHandler($event) {
        return ctx.onKeyDown($event);
      })("mouseenter", function DataTableBodyRowComponent_mouseenter_HostBindingHandler($event) {
        return ctx.onMouseenter($event);
      });
    }
    if (rf & 2) {
      \u0275\u0275classMap(ctx.cssClass);
      \u0275\u0275styleProp("height", ctx.rowHeight, "px")("width", ctx.columnsTotalWidths, "px");
    }
  },
  inputs: {
    columns: "columns",
    innerWidth: "innerWidth",
    expanded: "expanded",
    rowClass: "rowClass",
    row: "row",
    group: "group",
    isSelected: "isSelected",
    rowIndex: "rowIndex",
    displayCheck: "displayCheck",
    treeStatus: "treeStatus",
    offsetX: "offsetX",
    rowHeight: "rowHeight"
  },
  outputs: {
    activate: "activate",
    treeAction: "treeAction"
  },
  decls: 1,
  vars: 2,
  consts: [[3, "class", "ngStyle", 4, "ngFor", "ngForOf", "ngForTrackBy"], [3, "ngStyle"], ["role", "cell", "tabindex", "-1", 3, "row", "group", "expanded", "isSelected", "rowIndex", "column", "rowHeight", "displayCheck", "treeStatus", "activate", "treeAction", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["role", "cell", "tabindex", "-1", 3, "activate", "treeAction", "row", "group", "expanded", "isSelected", "rowIndex", "column", "rowHeight", "displayCheck", "treeStatus"]],
  template: function DataTableBodyRowComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, DataTableBodyRowComponent_div_0_Template, 2, 6, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("ngForOf", ctx._columnsByPin)("ngForTrackBy", ctx.trackByGroups);
    }
  },
  dependencies: [DataTableBodyCellComponent, NgForOf, NgStyle],
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableBodyRowComponent, [{
    type: Component,
    args: [{
      selector: "datatable-body-row",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div
      *ngFor="let colGroup of _columnsByPin; let i = index; trackBy: trackByGroups"
      class="datatable-row-{{ colGroup.type }} datatable-row-group"
      [ngStyle]="_groupStyles[colGroup.type]"
    >
      <datatable-body-cell
        role="cell"
        *ngFor="let column of colGroup.columns; let ii = index; trackBy: columnTrackingFn"
        tabindex="-1"
        [row]="row"
        [group]="group"
        [expanded]="expanded"
        [isSelected]="isSelected"
        [rowIndex]="rowIndex"
        [column]="column"
        [rowHeight]="rowHeight"
        [displayCheck]="displayCheck"
        [treeStatus]="treeStatus"
        (activate)="onActivate($event, ii)"
        (treeAction)="onTreeAction()"
      >
      </datatable-body-cell>
    </div>
  `
    }]
  }], function() {
    return [{
      type: KeyValueDiffers
    }, {
      type: ScrollbarHelper,
      decorators: [{
        type: SkipSelf
      }]
    }, {
      type: ChangeDetectorRef
    }, {
      type: ElementRef
    }];
  }, {
    columns: [{
      type: Input
    }],
    innerWidth: [{
      type: Input
    }],
    expanded: [{
      type: Input
    }],
    rowClass: [{
      type: Input
    }],
    row: [{
      type: Input
    }],
    group: [{
      type: Input
    }],
    isSelected: [{
      type: Input
    }],
    rowIndex: [{
      type: Input
    }],
    displayCheck: [{
      type: Input
    }],
    treeStatus: [{
      type: Input
    }],
    offsetX: [{
      type: Input
    }],
    cssClass: [{
      type: HostBinding,
      args: ["class"]
    }],
    rowHeight: [{
      type: HostBinding,
      args: ["style.height.px"]
    }, {
      type: Input
    }],
    columnsTotalWidths: [{
      type: HostBinding,
      args: ["style.width.px"]
    }],
    activate: [{
      type: Output
    }],
    treeAction: [{
      type: Output
    }],
    onKeyDown: [{
      type: HostListener,
      args: ["keydown", ["$event"]]
    }],
    onMouseenter: [{
      type: HostListener,
      args: ["mouseenter", ["$event"]]
    }]
  });
})();
function defaultSumFunc(cells) {
  const cellsWithValues = cells.filter((cell) => !!cell);
  if (!cellsWithValues.length) {
    return null;
  }
  if (cellsWithValues.some((cell) => typeof cell !== "number")) {
    return null;
  }
  return cellsWithValues.reduce((res, cell) => res + cell);
}
function noopSumFunc(cells) {
  return null;
}
var DataTableSummaryRowComponent = class {
  constructor() {
    this.summaryRow = {};
  }
  ngOnChanges() {
    if (!this.columns || !this.rows) {
      return;
    }
    this.updateInternalColumns();
    this.updateValues();
  }
  updateInternalColumns() {
    this._internalColumns = this.columns.map((col) => __spreadProps(__spreadValues({}, col), {
      cellTemplate: col.summaryTemplate
    }));
  }
  updateValues() {
    this.summaryRow = {};
    this.columns.filter((col) => !col.summaryTemplate).forEach((col) => {
      const cellsFromSingleColumn = this.rows.map((row) => row[col.prop]);
      const sumFunc = this.getSummaryFunction(col);
      this.summaryRow[col.prop] = col.pipe ? col.pipe.transform(sumFunc(cellsFromSingleColumn)) : sumFunc(cellsFromSingleColumn);
    });
  }
  getSummaryFunction(column) {
    if (column.summaryFunc === void 0) {
      return defaultSumFunc;
    } else if (column.summaryFunc === null) {
      return noopSumFunc;
    } else {
      return column.summaryFunc;
    }
  }
};
DataTableSummaryRowComponent.\u0275fac = function DataTableSummaryRowComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableSummaryRowComponent)();
};
DataTableSummaryRowComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: DataTableSummaryRowComponent,
  selectors: [["datatable-summary-row"]],
  hostAttrs: [1, "datatable-summary-row"],
  inputs: {
    rows: "rows",
    columns: "columns",
    rowHeight: "rowHeight",
    offsetX: "offsetX",
    innerWidth: "innerWidth"
  },
  features: [\u0275\u0275NgOnChangesFeature],
  decls: 1,
  vars: 1,
  consts: [["tabindex", "-1", 3, "innerWidth", "offsetX", "columns", "rowHeight", "row", "rowIndex", 4, "ngIf"], ["tabindex", "-1", 3, "innerWidth", "offsetX", "columns", "rowHeight", "row", "rowIndex"]],
  template: function DataTableSummaryRowComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, DataTableSummaryRowComponent_datatable_body_row_0_Template, 1, 6, "datatable-body-row", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.summaryRow && ctx._internalColumns);
    }
  },
  dependencies: [DataTableBodyRowComponent, NgIf],
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableSummaryRowComponent, [{
    type: Component,
    args: [{
      selector: "datatable-summary-row",
      template: `
    <datatable-body-row
      *ngIf="summaryRow && _internalColumns"
      tabindex="-1"
      [innerWidth]="innerWidth"
      [offsetX]="offsetX"
      [columns]="_internalColumns"
      [rowHeight]="rowHeight"
      [row]="summaryRow"
      [rowIndex]="-1"
    >
    </datatable-body-row>
  `,
      host: {
        class: "datatable-summary-row"
      }
    }]
  }], null, {
    rows: [{
      type: Input
    }],
    columns: [{
      type: Input
    }],
    rowHeight: [{
      type: Input
    }],
    offsetX: [{
      type: Input
    }],
    innerWidth: [{
      type: Input
    }]
  });
})();
var DataTableRowWrapperComponent = class {
  constructor(cd, differs) {
    this.cd = cd;
    this.differs = differs;
    this.rowContextmenu = new EventEmitter(false);
    this._expanded = false;
    this.groupContext = {
      group: this.row,
      expanded: this.expanded,
      rowIndex: this.rowIndex
    };
    this.rowContext = {
      row: this.row,
      expanded: this.expanded,
      rowIndex: this.rowIndex
    };
    this.rowDiffer = differs.find({}).create();
  }
  set rowIndex(val) {
    this._rowIndex = val;
    this.rowContext.rowIndex = val;
    this.groupContext.rowIndex = val;
    this.cd.markForCheck();
  }
  get rowIndex() {
    return this._rowIndex;
  }
  set expanded(val) {
    this._expanded = val;
    this.groupContext.expanded = val;
    this.rowContext.expanded = val;
    this.cd.markForCheck();
  }
  get expanded() {
    return this._expanded;
  }
  ngDoCheck() {
    if (this.rowDiffer.diff(this.row)) {
      this.rowContext.row = this.row;
      this.groupContext.group = this.row;
      this.cd.markForCheck();
    }
  }
  onContextmenu($event) {
    this.rowContextmenu.emit({
      event: $event,
      row: this.row
    });
  }
  getGroupHeaderStyle() {
    const styles = {};
    styles["transform"] = "translate3d(" + this.offsetX + "px, 0px, 0px)";
    styles["backface-visibility"] = "hidden";
    styles["width"] = this.innerWidth;
    return styles;
  }
};
DataTableRowWrapperComponent.\u0275fac = function DataTableRowWrapperComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableRowWrapperComponent)(\u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(KeyValueDiffers));
};
DataTableRowWrapperComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: DataTableRowWrapperComponent,
  selectors: [["datatable-row-wrapper"]],
  hostAttrs: [1, "datatable-row-wrapper"],
  hostBindings: function DataTableRowWrapperComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("contextmenu", function DataTableRowWrapperComponent_contextmenu_HostBindingHandler($event) {
        return ctx.onContextmenu($event);
      });
    }
  },
  inputs: {
    innerWidth: "innerWidth",
    rowDetail: "rowDetail",
    groupHeader: "groupHeader",
    offsetX: "offsetX",
    detailRowHeight: "detailRowHeight",
    row: "row",
    groupedRows: "groupedRows",
    rowIndex: "rowIndex",
    expanded: "expanded"
  },
  outputs: {
    rowContextmenu: "rowContextmenu"
  },
  ngContentSelectors: _c0,
  decls: 3,
  vars: 3,
  consts: [["class", "datatable-group-header", 3, "ngStyle", 4, "ngIf"], [4, "ngIf"], ["class", "datatable-row-detail", 3, "height", 4, "ngIf"], [1, "datatable-group-header", 3, "ngStyle"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "datatable-row-detail"]],
  template: function DataTableRowWrapperComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275template(0, DataTableRowWrapperComponent_div_0_Template, 2, 2, "div", 0)(1, DataTableRowWrapperComponent_ng_content_1_Template, 1, 0, "ng-content", 1)(2, DataTableRowWrapperComponent_div_2_Template, 2, 3, "div", 2);
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.groupHeader && ctx.groupHeader.template);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.groupHeader && ctx.groupHeader.template && ctx.expanded || !ctx.groupHeader || !ctx.groupHeader.template);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.rowDetail && ctx.rowDetail.template && ctx.expanded);
    }
  },
  dependencies: [NgIf, NgStyle, NgTemplateOutlet],
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableRowWrapperComponent, [{
    type: Component,
    args: [{
      selector: "datatable-row-wrapper",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div *ngIf="groupHeader && groupHeader.template" class="datatable-group-header" [ngStyle]="getGroupHeaderStyle()">
      <ng-template
        *ngIf="groupHeader && groupHeader.template"
        [ngTemplateOutlet]="groupHeader.template"
        [ngTemplateOutletContext]="groupContext"
      >
      </ng-template>
    </div>
    <ng-content *ngIf="(groupHeader && groupHeader.template && expanded) || !groupHeader || !groupHeader.template">
    </ng-content>
    <div
      *ngIf="rowDetail && rowDetail.template && expanded"
      [style.height.px]="detailRowHeight"
      class="datatable-row-detail"
    >
      <ng-template
        *ngIf="rowDetail && rowDetail.template"
        [ngTemplateOutlet]="rowDetail.template"
        [ngTemplateOutletContext]="rowContext"
      >
      </ng-template>
    </div>
  `,
      host: {
        class: "datatable-row-wrapper"
      }
    }]
  }], function() {
    return [{
      type: ChangeDetectorRef
    }, {
      type: KeyValueDiffers
    }];
  }, {
    innerWidth: [{
      type: Input
    }],
    rowDetail: [{
      type: Input
    }],
    groupHeader: [{
      type: Input
    }],
    offsetX: [{
      type: Input
    }],
    detailRowHeight: [{
      type: Input
    }],
    row: [{
      type: Input
    }],
    groupedRows: [{
      type: Input
    }],
    rowContextmenu: [{
      type: Output
    }],
    rowIndex: [{
      type: Input
    }],
    expanded: [{
      type: Input
    }],
    onContextmenu: [{
      type: HostListener,
      args: ["contextmenu", ["$event"]]
    }]
  });
})();
var DataTableBodyComponent = class {
  /**
   * Creates an instance of DataTableBodyComponent.
   */
  constructor(cd) {
    this.cd = cd;
    this.selected = [];
    this.scroll = new EventEmitter();
    this.page = new EventEmitter();
    this.activate = new EventEmitter();
    this.select = new EventEmitter();
    this.detailToggle = new EventEmitter();
    this.rowContextmenu = new EventEmitter(false);
    this.treeAction = new EventEmitter();
    this.rowHeightsCache = new RowHeightCache();
    this.temp = [];
    this.offsetY = 0;
    this.indexes = {};
    this.rowIndexes = /* @__PURE__ */ new WeakMap();
    this.rowExpansions = [];
    this.getDetailRowHeight = (row, index) => {
      if (!this.rowDetail) {
        return 0;
      }
      const rowHeight = this.rowDetail.rowHeight;
      return typeof rowHeight === "function" ? rowHeight(row, index) : rowHeight;
    };
    this.rowTrackingFn = (index, row) => {
      const idx = this.getRowIndex(row);
      if (this.trackByProp) {
        return row[this.trackByProp];
      } else {
        return idx;
      }
    };
  }
  set pageSize(val) {
    this._pageSize = val;
    this.recalcLayout();
  }
  get pageSize() {
    return this._pageSize;
  }
  set rows(val) {
    this._rows = val;
    this.recalcLayout();
  }
  get rows() {
    return this._rows;
  }
  set columns(val) {
    this._columns = val;
    const colsByPin = columnsByPin(val);
    this.columnGroupWidths = columnGroupWidths(colsByPin, val);
  }
  get columns() {
    return this._columns;
  }
  set offset(val) {
    this._offset = val;
    if (!this.scrollbarV || this.scrollbarV && !this.virtualization) this.recalcLayout();
  }
  get offset() {
    return this._offset;
  }
  set rowCount(val) {
    this._rowCount = val;
    this.recalcLayout();
  }
  get rowCount() {
    return this._rowCount;
  }
  get bodyWidth() {
    if (this.scrollbarH) {
      return this.innerWidth + "px";
    } else {
      return "100%";
    }
  }
  set bodyHeight(val) {
    if (this.scrollbarV) {
      this._bodyHeight = val + "px";
    } else {
      this._bodyHeight = "auto";
    }
    this.recalcLayout();
  }
  get bodyHeight() {
    return this._bodyHeight;
  }
  /**
   * Returns if selection is enabled.
   */
  get selectEnabled() {
    return !!this.selectionType;
  }
  /**
   * Property that would calculate the height of scroll bar
   * based on the row heights cache for virtual scroll and virtualization. Other scenarios
   * calculate scroll height automatically (as height will be undefined).
   */
  get scrollHeight() {
    if (this.scrollbarV && this.virtualization && this.rowCount) {
      return this.rowHeightsCache.query(this.rowCount - 1);
    }
    return void 0;
  }
  /**
   * Called after the constructor, initializing input properties
   */
  ngOnInit() {
    if (this.rowDetail) {
      this.listener = this.rowDetail.toggle.subscribe(({
        type,
        value
      }) => {
        if (type === "row") {
          this.toggleRowExpansion(value);
        }
        if (type === "all") {
          this.toggleAllRows(value);
        }
        this.updateIndexes();
        this.updateRows();
        this.cd.markForCheck();
      });
    }
    if (this.groupHeader) {
      this.listener = this.groupHeader.toggle.subscribe(({
        type,
        value
      }) => {
        if (type === "group") {
          this.toggleRowExpansion(value);
        }
        if (type === "all") {
          this.toggleAllRows(value);
        }
        this.updateIndexes();
        this.updateRows();
        this.cd.markForCheck();
      });
    }
  }
  /**
   * Called once, before the instance is destroyed.
   */
  ngOnDestroy() {
    if (this.rowDetail || this.groupHeader) {
      this.listener.unsubscribe();
    }
  }
  /**
   * Updates the Y offset given a new offset.
   */
  updateOffsetY(offset) {
    if (!this.scroller) {
      return;
    }
    if (this.scrollbarV && this.virtualization && offset) {
      const rowIndex = this.pageSize * offset;
      offset = this.rowHeightsCache.query(rowIndex - 1);
    } else if (this.scrollbarV && !this.virtualization) {
      offset = 0;
    }
    this.scroller.setOffset(offset || 0);
  }
  /**
   * Body was scrolled, this is mainly useful for
   * when a user is server-side pagination via virtual scroll.
   */
  onBodyScroll(event) {
    const scrollYPos = event.scrollYPos;
    const scrollXPos = event.scrollXPos;
    if (this.offsetY !== scrollYPos || this.offsetX !== scrollXPos) {
      this.scroll.emit({
        offsetY: scrollYPos,
        offsetX: scrollXPos
      });
    }
    this.offsetY = scrollYPos;
    this.offsetX = scrollXPos;
    this.updateIndexes();
    this.updatePage(event.direction);
    this.updateRows();
  }
  /**
   * Updates the page given a direction.
   */
  updatePage(direction) {
    let offset = this.indexes.first / this.pageSize;
    if (direction === "up") {
      offset = Math.ceil(offset);
    } else if (direction === "down") {
      offset = Math.floor(offset);
    }
    if (direction !== void 0 && !isNaN(offset)) {
      this.page.emit({
        offset
      });
    }
  }
  /**
   * Updates the rows in the view port
   */
  updateRows() {
    const {
      first,
      last
    } = this.indexes;
    let rowIndex = first;
    let idx = 0;
    const temp = [];
    if (this.groupedRows) {
      let maxRowsPerGroup = 3;
      if (this.groupedRows.length === 1) {
        maxRowsPerGroup = this.groupedRows[0].value.length;
      }
      while (rowIndex < last && rowIndex < this.groupedRows.length) {
        const group = this.groupedRows[rowIndex];
        this.rowIndexes.set(group, rowIndex);
        if (group.value) {
          group.value.forEach((g, i) => {
            const _idx = `${rowIndex}-${i}`;
            this.rowIndexes.set(g, _idx);
          });
        }
        temp[idx] = group;
        idx++;
        rowIndex++;
      }
    } else {
      while (rowIndex < last && rowIndex < this.rowCount) {
        const row = this.rows[rowIndex];
        if (row) {
          this.rowIndexes.set(row, rowIndex);
          temp[idx] = row;
        }
        idx++;
        rowIndex++;
      }
    }
    this.temp = temp;
  }
  /**
   * Get the row height
   */
  getRowHeight(row) {
    if (typeof this.rowHeight === "function") {
      return this.rowHeight(row);
    }
    return this.rowHeight;
  }
  /**
   * @param group the group with all rows
   */
  getGroupHeight(group) {
    let rowHeight = 0;
    if (group.value) {
      for (let index = 0; index < group.value.length; index++) {
        rowHeight += this.getRowAndDetailHeight(group.value[index]);
      }
    }
    return rowHeight;
  }
  /**
   * Calculate row height based on the expanded state of the row.
   */
  getRowAndDetailHeight(row) {
    let rowHeight = this.getRowHeight(row);
    const expanded = this.getRowExpanded(row);
    if (expanded) {
      rowHeight += this.getDetailRowHeight(row);
    }
    return rowHeight;
  }
  /**
   * Calculates the styles for the row so that the rows can be moved in 2D space
   * during virtual scroll inside the DOM.   In the below case the Y position is
   * manipulated.   As an example, if the height of row 0 is 30 px and row 1 is
   * 100 px then following styles are generated:
   *
   * transform: translate3d(0px, 0px, 0px);    ->  row0
   * transform: translate3d(0px, 30px, 0px);   ->  row1
   * transform: translate3d(0px, 130px, 0px);  ->  row2
   *
   * Row heights have to be calculated based on the row heights cache as we wont
   * be able to determine which row is of what height before hand.  In the above
   * case the positionY of the translate3d for row2 would be the sum of all the
   * heights of the rows before it (i.e. row0 and row1).
   *
   * @param rows the row that needs to be placed in the 2D space.
   * @returns the CSS3 style to be applied
   *
   * @memberOf DataTableBodyComponent
   */
  getRowsStyles(rows) {
    const styles = {};
    if (this.groupedRows) {
      styles.width = this.columnGroupWidths.total;
    }
    if (this.scrollbarV && this.virtualization) {
      let idx = 0;
      if (this.groupedRows) {
        const row = rows[rows.length - 1];
        idx = row ? this.getRowIndex(row) : 0;
      } else {
        idx = this.getRowIndex(rows);
      }
      const pos = this.rowHeightsCache.query(idx - 1);
      translateXY(styles, 0, pos);
    }
    return styles;
  }
  /**
   * Calculate bottom summary row offset for scrollbar mode.
   * For more information about cache and offset calculation
   * see description for `getRowsStyles` method
   *
   * @returns the CSS3 style to be applied
   *
   * @memberOf DataTableBodyComponent
   */
  getBottomSummaryRowStyles() {
    if (!this.scrollbarV || !this.rows || !this.rows.length) {
      return null;
    }
    const styles = {
      position: "absolute"
    };
    const pos = this.rowHeightsCache.query(this.rows.length - 1);
    translateXY(styles, 0, pos);
    return styles;
  }
  /**
   * Hides the loading indicator
   */
  hideIndicator() {
    setTimeout(() => this.loadingIndicator = false, 500);
  }
  /**
   * Updates the index of the rows in the viewport
   */
  updateIndexes() {
    let first = 0;
    let last = 0;
    if (this.scrollbarV) {
      if (this.virtualization) {
        const height = parseInt(this.bodyHeight, 0);
        first = this.rowHeightsCache.getRowIndex(this.offsetY);
        last = this.rowHeightsCache.getRowIndex(height + this.offsetY) + 1;
      } else {
        first = 0;
        last = this.rowCount;
      }
    } else {
      if (!this.externalPaging) {
        first = Math.max(this.offset * this.pageSize, 0);
      }
      last = Math.min(first + this.pageSize, this.rowCount);
    }
    this.indexes = {
      first,
      last
    };
  }
  /**
   * Refreshes the full Row Height cache.  Should be used
   * when the entire row array state has changed.
   */
  refreshRowHeightCache() {
    if (!this.scrollbarV || this.scrollbarV && !this.virtualization) {
      return;
    }
    this.rowHeightsCache.clearCache();
    if (this.rows && this.rows.length) {
      const rowExpansions = /* @__PURE__ */ new Set();
      for (const row of this.rows) {
        if (this.getRowExpanded(row)) {
          rowExpansions.add(row);
        }
      }
      this.rowHeightsCache.initCache({
        rows: this.rows,
        rowHeight: this.rowHeight,
        detailRowHeight: this.getDetailRowHeight,
        externalVirtual: this.scrollbarV && this.externalPaging,
        rowCount: this.rowCount,
        rowIndexes: this.rowIndexes,
        rowExpansions
      });
    }
  }
  /**
   * Gets the index for the view port
   */
  getAdjustedViewPortIndex() {
    const viewPortFirstRowIndex = this.indexes.first;
    if (this.scrollbarV && this.virtualization) {
      const offsetScroll = this.rowHeightsCache.query(viewPortFirstRowIndex - 1);
      return offsetScroll <= this.offsetY ? viewPortFirstRowIndex - 1 : viewPortFirstRowIndex;
    }
    return viewPortFirstRowIndex;
  }
  /**
   * Toggle the Expansion of the row i.e. if the row is expanded then it will
   * collapse and vice versa.   Note that the expanded status is stored as
   * a part of the row object itself as we have to preserve the expanded row
   * status in case of sorting and filtering of the row set.
   */
  toggleRowExpansion(row) {
    const viewPortFirstRowIndex = this.getAdjustedViewPortIndex();
    const rowExpandedIdx = this.getRowExpandedIdx(row, this.rowExpansions);
    const expanded = rowExpandedIdx > -1;
    if (this.scrollbarV && this.virtualization) {
      const detailRowHeight = this.getDetailRowHeight(row) * (expanded ? -1 : 1);
      const idx = this.getRowIndex(row);
      this.rowHeightsCache.update(idx, detailRowHeight);
    }
    if (expanded) {
      this.rowExpansions.splice(rowExpandedIdx, 1);
    } else {
      this.rowExpansions.push(row);
    }
    this.detailToggle.emit({
      rows: [row],
      currentIndex: viewPortFirstRowIndex
    });
  }
  /**
   * Expand/Collapse all the rows no matter what their state is.
   */
  toggleAllRows(expanded) {
    this.rowExpansions = [];
    const viewPortFirstRowIndex = this.getAdjustedViewPortIndex();
    if (expanded) {
      for (const row of this.rows) {
        this.rowExpansions.push(row);
      }
    }
    if (this.scrollbarV) {
      this.recalcLayout();
    }
    this.detailToggle.emit({
      rows: this.rows,
      currentIndex: viewPortFirstRowIndex
    });
  }
  /**
   * Recalculates the table
   */
  recalcLayout() {
    this.refreshRowHeightCache();
    this.updateIndexes();
    this.updateRows();
  }
  /**
   * Tracks the column
   */
  columnTrackingFn(index, column) {
    return column.$$id;
  }
  /**
   * Gets the row pinning group styles
   */
  stylesByGroup(group) {
    const widths = this.columnGroupWidths;
    const offsetX = this.offsetX;
    const styles = {
      width: `${widths[group]}px`
    };
    if (group === "left") {
      translateXY(styles, offsetX, 0);
    } else if (group === "right") {
      const bodyWidth = parseInt(this.innerWidth + "", 0);
      const totalDiff = widths.total - bodyWidth;
      const offsetDiff = totalDiff - offsetX;
      const offset = offsetDiff * -1;
      translateXY(styles, offset, 0);
    }
    return styles;
  }
  /**
   * Returns if the row was expanded and set default row expansion when row expansion is empty
   */
  getRowExpanded(row) {
    if (this.rowExpansions.length === 0 && this.groupExpansionDefault) {
      for (const group of this.groupedRows) {
        this.rowExpansions.push(group);
      }
    }
    return this.getRowExpandedIdx(row, this.rowExpansions) > -1;
  }
  getRowExpandedIdx(row, expanded) {
    if (!expanded || !expanded.length) return -1;
    const rowId = this.rowIdentity(row);
    return expanded.findIndex((r) => {
      const id2 = this.rowIdentity(r);
      return id2 === rowId;
    });
  }
  /**
   * Gets the row index given a row
   */
  getRowIndex(row) {
    return this.rowIndexes.get(row) || 0;
  }
  onTreeAction(row) {
    this.treeAction.emit({
      row
    });
  }
};
DataTableBodyComponent.\u0275fac = function DataTableBodyComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableBodyComponent)(\u0275\u0275directiveInject(ChangeDetectorRef));
};
DataTableBodyComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: DataTableBodyComponent,
  selectors: [["datatable-body"]],
  viewQuery: function DataTableBodyComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(ScrollerComponent, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.scroller = _t.first);
    }
  },
  hostAttrs: [1, "datatable-body"],
  hostVars: 4,
  hostBindings: function DataTableBodyComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275styleProp("width", ctx.bodyWidth)("height", ctx.bodyHeight);
    }
  },
  inputs: {
    scrollbarV: "scrollbarV",
    scrollbarH: "scrollbarH",
    loadingIndicator: "loadingIndicator",
    externalPaging: "externalPaging",
    rowHeight: "rowHeight",
    offsetX: "offsetX",
    emptyMessage: "emptyMessage",
    selectionType: "selectionType",
    selected: "selected",
    rowIdentity: "rowIdentity",
    rowDetail: "rowDetail",
    groupHeader: "groupHeader",
    selectCheck: "selectCheck",
    displayCheck: "displayCheck",
    trackByProp: "trackByProp",
    rowClass: "rowClass",
    groupedRows: "groupedRows",
    groupExpansionDefault: "groupExpansionDefault",
    innerWidth: "innerWidth",
    groupRowsBy: "groupRowsBy",
    virtualization: "virtualization",
    summaryRow: "summaryRow",
    summaryPosition: "summaryPosition",
    summaryHeight: "summaryHeight",
    pageSize: "pageSize",
    rows: "rows",
    columns: "columns",
    offset: "offset",
    rowCount: "rowCount",
    bodyHeight: "bodyHeight"
  },
  outputs: {
    scroll: "scroll",
    page: "page",
    activate: "activate",
    select: "select",
    detailToggle: "detailToggle",
    rowContextmenu: "rowContextmenu",
    treeAction: "treeAction"
  },
  decls: 5,
  vars: 9,
  consts: [["selector", ""], ["groupedRowsTemplate", ""], [4, "ngIf"], [3, "select", "activate", "selected", "rows", "selectCheck", "selectEnabled", "selectionType", "rowIdentity"], [3, "scrollbarV", "scrollbarH", "scrollHeight", "scrollWidth", "scroll", 4, "ngIf"], ["class", "empty-row", 3, "innerHTML", 4, "ngIf"], [3, "scroll", "scrollbarV", "scrollbarH", "scrollHeight", "scrollWidth"], [3, "rowHeight", "offsetX", "innerWidth", "rows", "columns", 4, "ngIf"], [3, "groupedRows", "innerWidth", "ngStyle", "rowDetail", "groupHeader", "offsetX", "detailRowHeight", "row", "expanded", "rowIndex", "rowContextmenu", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["role", "row", 3, "ngStyle", "rowHeight", "offsetX", "innerWidth", "rows", "columns", 4, "ngIf"], [3, "rowHeight", "offsetX", "innerWidth", "rows", "columns"], [3, "rowContextmenu", "groupedRows", "innerWidth", "ngStyle", "rowDetail", "groupHeader", "offsetX", "detailRowHeight", "row", "expanded", "rowIndex"], ["role", "row", "tabindex", "-1", 3, "isSelected", "innerWidth", "offsetX", "columns", "rowHeight", "row", "rowIndex", "expanded", "rowClass", "displayCheck", "treeStatus", "treeAction", "activate", 4, "ngIf", "ngIfElse"], ["role", "row", "tabindex", "-1", 3, "treeAction", "activate", "isSelected", "innerWidth", "offsetX", "columns", "rowHeight", "row", "rowIndex", "expanded", "rowClass", "displayCheck", "treeStatus"], ["role", "row", "tabindex", "-1", 3, "isSelected", "innerWidth", "offsetX", "columns", "rowHeight", "row", "group", "rowIndex", "expanded", "rowClass", "activate", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["role", "row", "tabindex", "-1", 3, "activate", "isSelected", "innerWidth", "offsetX", "columns", "rowHeight", "row", "group", "rowIndex", "expanded", "rowClass"], ["role", "row", 3, "ngStyle", "rowHeight", "offsetX", "innerWidth", "rows", "columns"], [1, "empty-row", 3, "innerHTML"]],
  template: function DataTableBodyComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275template(0, DataTableBodyComponent_datatable_progress_0_Template, 1, 0, "datatable-progress", 2);
      \u0275\u0275elementStart(1, "datatable-selection", 3, 0);
      \u0275\u0275listener("select", function DataTableBodyComponent_Template_datatable_selection_select_1_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.select.emit($event));
      })("activate", function DataTableBodyComponent_Template_datatable_selection_activate_1_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.activate.emit($event));
      });
      \u0275\u0275template(3, DataTableBodyComponent_datatable_scroller_3_Template, 4, 8, "datatable-scroller", 4)(4, DataTableBodyComponent_div_4_Template, 1, 1, "div", 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.loadingIndicator);
      \u0275\u0275advance();
      \u0275\u0275property("selected", ctx.selected)("rows", ctx.rows)("selectCheck", ctx.selectCheck)("selectEnabled", ctx.selectEnabled)("selectionType", ctx.selectionType)("rowIdentity", ctx.rowIdentity);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.rows == null ? null : ctx.rows.length);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !(ctx.rows == null ? null : ctx.rows.length) && !ctx.loadingIndicator);
    }
  },
  dependencies: [ProgressBarComponent, DataTableSelectionComponent, ScrollerComponent, DataTableSummaryRowComponent, DataTableRowWrapperComponent, DataTableBodyRowComponent, NgIf, NgForOf, NgStyle],
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableBodyComponent, [{
    type: Component,
    args: [{
      selector: "datatable-body",
      template: `
    <datatable-progress *ngIf="loadingIndicator"> </datatable-progress>
    <datatable-selection
      #selector
      [selected]="selected"
      [rows]="rows"
      [selectCheck]="selectCheck"
      [selectEnabled]="selectEnabled"
      [selectionType]="selectionType"
      [rowIdentity]="rowIdentity"
      (select)="select.emit($event)"
      (activate)="activate.emit($event)"
    >
      <datatable-scroller
        *ngIf="rows?.length"
        [scrollbarV]="scrollbarV"
        [scrollbarH]="scrollbarH"
        [scrollHeight]="scrollHeight"
        [scrollWidth]="columnGroupWidths?.total"
        (scroll)="onBodyScroll($event)"
      >
        <datatable-summary-row
          *ngIf="summaryRow && summaryPosition === 'top'"
          [rowHeight]="summaryHeight"
          [offsetX]="offsetX"
          [innerWidth]="innerWidth"
          [rows]="rows"
          [columns]="columns"
        >
        </datatable-summary-row>
        <datatable-row-wrapper
          [groupedRows]="groupedRows"
          *ngFor="let group of temp; let i = index; trackBy: rowTrackingFn"
          [innerWidth]="innerWidth"
          [ngStyle]="getRowsStyles(group)"
          [rowDetail]="rowDetail"
          [groupHeader]="groupHeader"
          [offsetX]="offsetX"
          [detailRowHeight]="getDetailRowHeight(group && group[i], i)"
          [row]="group"
          [expanded]="getRowExpanded(group)"
          [rowIndex]="getRowIndex(group && group[i])"
          (rowContextmenu)="rowContextmenu.emit($event)"
        >
          <datatable-body-row
            role="row"
            *ngIf="!groupedRows; else groupedRowsTemplate"
            tabindex="-1"
            [isSelected]="selector.getRowSelected(group)"
            [innerWidth]="innerWidth"
            [offsetX]="offsetX"
            [columns]="columns"
            [rowHeight]="getRowHeight(group)"
            [row]="group"
            [rowIndex]="getRowIndex(group)"
            [expanded]="getRowExpanded(group)"
            [rowClass]="rowClass"
            [displayCheck]="displayCheck"
            [treeStatus]="group && group.treeStatus"
            (treeAction)="onTreeAction(group)"
            (activate)="selector.onActivate($event, indexes.first + i)"
          >
          </datatable-body-row>
          <ng-template #groupedRowsTemplate>
            <datatable-body-row
              role="row"
              *ngFor="let row of group.value; let i = index; trackBy: rowTrackingFn"
              tabindex="-1"
              [isSelected]="selector.getRowSelected(row)"
              [innerWidth]="innerWidth"
              [offsetX]="offsetX"
              [columns]="columns"
              [rowHeight]="getRowHeight(row)"
              [row]="row"
              [group]="group.value"
              [rowIndex]="getRowIndex(row)"
              [expanded]="getRowExpanded(row)"
              [rowClass]="rowClass"
              (activate)="selector.onActivate($event, i)"
            >
            </datatable-body-row>
          </ng-template>
        </datatable-row-wrapper>
        <datatable-summary-row
          role="row"
          *ngIf="summaryRow && summaryPosition === 'bottom'"
          [ngStyle]="getBottomSummaryRowStyles()"
          [rowHeight]="summaryHeight"
          [offsetX]="offsetX"
          [innerWidth]="innerWidth"
          [rows]="rows"
          [columns]="columns"
        >
        </datatable-summary-row>
      </datatable-scroller>
      <div class="empty-row" *ngIf="!rows?.length && !loadingIndicator" [innerHTML]="emptyMessage"></div>
    </datatable-selection>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "datatable-body"
      }
    }]
  }], function() {
    return [{
      type: ChangeDetectorRef
    }];
  }, {
    scrollbarV: [{
      type: Input
    }],
    scrollbarH: [{
      type: Input
    }],
    loadingIndicator: [{
      type: Input
    }],
    externalPaging: [{
      type: Input
    }],
    rowHeight: [{
      type: Input
    }],
    offsetX: [{
      type: Input
    }],
    emptyMessage: [{
      type: Input
    }],
    selectionType: [{
      type: Input
    }],
    selected: [{
      type: Input
    }],
    rowIdentity: [{
      type: Input
    }],
    rowDetail: [{
      type: Input
    }],
    groupHeader: [{
      type: Input
    }],
    selectCheck: [{
      type: Input
    }],
    displayCheck: [{
      type: Input
    }],
    trackByProp: [{
      type: Input
    }],
    rowClass: [{
      type: Input
    }],
    groupedRows: [{
      type: Input
    }],
    groupExpansionDefault: [{
      type: Input
    }],
    innerWidth: [{
      type: Input
    }],
    groupRowsBy: [{
      type: Input
    }],
    virtualization: [{
      type: Input
    }],
    summaryRow: [{
      type: Input
    }],
    summaryPosition: [{
      type: Input
    }],
    summaryHeight: [{
      type: Input
    }],
    pageSize: [{
      type: Input
    }],
    rows: [{
      type: Input
    }],
    columns: [{
      type: Input
    }],
    offset: [{
      type: Input
    }],
    rowCount: [{
      type: Input
    }],
    bodyWidth: [{
      type: HostBinding,
      args: ["style.width"]
    }],
    bodyHeight: [{
      type: Input
    }, {
      type: HostBinding,
      args: ["style.height"]
    }],
    scroll: [{
      type: Output
    }],
    page: [{
      type: Output
    }],
    activate: [{
      type: Output
    }],
    select: [{
      type: Output
    }],
    detailToggle: [{
      type: Output
    }],
    rowContextmenu: [{
      type: Output
    }],
    treeAction: [{
      type: Output
    }],
    scroller: [{
      type: ViewChild,
      args: [ScrollerComponent]
    }]
  });
})();
function nextSortDir(sortType, current) {
  if (sortType === SortType.single) {
    if (current === SortDirection.asc) {
      return SortDirection.desc;
    } else {
      return SortDirection.asc;
    }
  } else {
    if (!current) {
      return SortDirection.asc;
    } else if (current === SortDirection.asc) {
      return SortDirection.desc;
    } else if (current === SortDirection.desc) {
      return void 0;
    }
    return void 0;
  }
}
function orderByComparator(a, b) {
  if (a === null || typeof a === "undefined") a = 0;
  if (b === null || typeof b === "undefined") b = 0;
  if (a instanceof Date && b instanceof Date) {
    if (a < b) return -1;
    if (a > b) return 1;
  } else if (isNaN(parseFloat(a)) || !isFinite(a) || isNaN(parseFloat(b)) || !isFinite(b)) {
    a = String(a);
    b = String(b);
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
  } else {
    if (parseFloat(a) < parseFloat(b)) return -1;
    if (parseFloat(a) > parseFloat(b)) return 1;
  }
  return 0;
}
function sortRows(rows, columns, dirs) {
  if (!rows) return [];
  if (!dirs || !dirs.length || !columns) return [...rows];
  const rowToIndexMap = /* @__PURE__ */ new Map();
  rows.forEach((row, index) => rowToIndexMap.set(row, index));
  const temp = [...rows];
  const cols = columns.reduce((obj, col) => {
    if (col.comparator && typeof col.comparator === "function") {
      obj[col.prop] = col.comparator;
    }
    return obj;
  }, {});
  const cachedDirs = dirs.map((dir) => {
    const prop = dir.prop;
    return {
      prop,
      dir: dir.dir,
      valueGetter: getterForProp(prop),
      compareFn: cols[prop] || orderByComparator
    };
  });
  return temp.sort(function(rowA, rowB) {
    for (const cachedDir of cachedDirs) {
      const {
        prop,
        valueGetter
      } = cachedDir;
      const propA = valueGetter(rowA, prop);
      const propB = valueGetter(rowB, prop);
      const comparison = cachedDir.dir !== SortDirection.desc ? cachedDir.compareFn(propA, propB, rowA, rowB, cachedDir.dir) : -cachedDir.compareFn(propA, propB, rowA, rowB, cachedDir.dir);
      if (comparison !== 0) return comparison;
    }
    if (!(rowToIndexMap.has(rowA) && rowToIndexMap.has(rowB))) return 0;
    return rowToIndexMap.get(rowA) < rowToIndexMap.get(rowB) ? -1 : 1;
  });
}
var DataTableHeaderCellComponent = class {
  constructor(cd) {
    this.cd = cd;
    this.sort = new EventEmitter();
    this.select = new EventEmitter();
    this.columnContextmenu = new EventEmitter(false);
    this.sortFn = this.onSort.bind(this);
    this.selectFn = this.select.emit.bind(this.select);
    this.cellContext = {
      column: this.column,
      sortDir: this.sortDir,
      sortFn: this.sortFn,
      allRowsSelected: this.allRowsSelected,
      selectFn: this.selectFn
    };
  }
  set allRowsSelected(value) {
    this._allRowsSelected = value;
    this.cellContext.allRowsSelected = value;
  }
  get allRowsSelected() {
    return this._allRowsSelected;
  }
  set column(column) {
    this._column = column;
    this.cellContext.column = column;
    this.cd.markForCheck();
  }
  get column() {
    return this._column;
  }
  set sorts(val) {
    this._sorts = val;
    this.sortDir = this.calcSortDir(val);
    this.cellContext.sortDir = this.sortDir;
    this.sortClass = this.calcSortClass(this.sortDir);
    this.cd.markForCheck();
  }
  get sorts() {
    return this._sorts;
  }
  get columnCssClasses() {
    let cls = "datatable-header-cell";
    if (this.column.sortable) cls += " sortable";
    if (this.column.resizeable) cls += " resizeable";
    if (this.column.headerClass) {
      if (typeof this.column.headerClass === "string") {
        cls += " " + this.column.headerClass;
      } else if (typeof this.column.headerClass === "function") {
        const res = this.column.headerClass({
          column: this.column
        });
        if (typeof res === "string") {
          cls += res;
        } else if (typeof res === "object") {
          const keys = Object.keys(res);
          for (const k of keys) {
            if (res[k] === true) cls += ` ${k}`;
          }
        }
      }
    }
    const sortDir = this.sortDir;
    if (sortDir) {
      cls += ` sort-active sort-${sortDir}`;
    }
    return cls;
  }
  get name() {
    return this.column.headerTemplate === void 0 ? this.column.name : void 0;
  }
  get minWidth() {
    return this.column.minWidth;
  }
  get maxWidth() {
    return this.column.maxWidth;
  }
  get width() {
    return this.column.width;
  }
  get isCheckboxable() {
    return this.column.checkboxable && this.column.headerCheckboxable && this.selectionType === SelectionType.checkbox;
  }
  onContextmenu($event) {
    this.columnContextmenu.emit({
      event: $event,
      column: this.column
    });
  }
  ngOnInit() {
    this.sortClass = this.calcSortClass(this.sortDir);
  }
  calcSortDir(sorts) {
    if (sorts && this.column) {
      const sort = sorts.find((s) => {
        return s.prop === this.column.prop;
      });
      if (sort) return sort.dir;
    }
  }
  onSort() {
    if (!this.column.sortable) return;
    const newValue = nextSortDir(this.sortType, this.sortDir);
    this.sort.emit({
      column: this.column,
      prevValue: this.sortDir,
      newValue
    });
  }
  calcSortClass(sortDir) {
    if (!this.cellContext.column.sortable) return;
    if (sortDir === SortDirection.asc) {
      return `sort-btn sort-asc ${this.sortAscendingIcon}`;
    } else if (sortDir === SortDirection.desc) {
      return `sort-btn sort-desc ${this.sortDescendingIcon}`;
    } else {
      return `sort-btn ${this.sortUnsetIcon}`;
    }
  }
};
DataTableHeaderCellComponent.\u0275fac = function DataTableHeaderCellComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableHeaderCellComponent)(\u0275\u0275directiveInject(ChangeDetectorRef));
};
DataTableHeaderCellComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: DataTableHeaderCellComponent,
  selectors: [["datatable-header-cell"]],
  hostAttrs: [1, "datatable-header-cell"],
  hostVars: 11,
  hostBindings: function DataTableHeaderCellComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("contextmenu", function DataTableHeaderCellComponent_contextmenu_HostBindingHandler($event) {
        return ctx.onContextmenu($event);
      });
    }
    if (rf & 2) {
      \u0275\u0275attribute("title", ctx.name);
      \u0275\u0275classMap(ctx.columnCssClasses);
      \u0275\u0275styleProp("height", ctx.headerHeight, "px")("min-width", ctx.minWidth, "px")("max-width", ctx.maxWidth, "px")("width", ctx.width, "px");
    }
  },
  inputs: {
    sortType: "sortType",
    sortAscendingIcon: "sortAscendingIcon",
    sortDescendingIcon: "sortDescendingIcon",
    sortUnsetIcon: "sortUnsetIcon",
    isTarget: "isTarget",
    targetMarkerTemplate: "targetMarkerTemplate",
    targetMarkerContext: "targetMarkerContext",
    allRowsSelected: "allRowsSelected",
    selectionType: "selectionType",
    column: "column",
    headerHeight: "headerHeight",
    sorts: "sorts"
  },
  outputs: {
    sort: "sort",
    select: "select",
    columnContextmenu: "columnContextmenu"
  },
  decls: 6,
  vars: 6,
  consts: [[1, "datatable-header-cell-template-wrap"], [4, "ngIf"], ["class", "datatable-checkbox", 4, "ngIf"], ["class", "datatable-header-cell-wrapper", 4, "ngIf"], [3, "click"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "datatable-checkbox"], ["type", "checkbox", 3, "change", "checked"], [1, "datatable-header-cell-wrapper"], [1, "datatable-header-cell-label", "draggable", 3, "click", "innerHTML"]],
  template: function DataTableHeaderCellComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275template(1, DataTableHeaderCellComponent_1_Template, 1, 2, null, 1)(2, DataTableHeaderCellComponent_label_2_Template, 2, 1, "label", 2)(3, DataTableHeaderCellComponent_span_3_Template, 2, 1, "span", 3)(4, DataTableHeaderCellComponent_4_Template, 1, 2, null, 1);
      \u0275\u0275elementStart(5, "span", 4);
      \u0275\u0275listener("click", function DataTableHeaderCellComponent_Template_span_click_5_listener() {
        return ctx.onSort();
      });
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isTarget);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isCheckboxable);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.column.headerTemplate);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.column.headerTemplate);
      \u0275\u0275advance();
      \u0275\u0275classMap(ctx.sortClass);
    }
  },
  dependencies: [NgIf, NgTemplateOutlet],
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableHeaderCellComponent, [{
    type: Component,
    args: [{
      selector: "datatable-header-cell",
      template: `
    <div class="datatable-header-cell-template-wrap">
      <ng-template
        *ngIf="isTarget"
        [ngTemplateOutlet]="targetMarkerTemplate"
        [ngTemplateOutletContext]="targetMarkerContext"
      >
      </ng-template>
      <label *ngIf="isCheckboxable" class="datatable-checkbox">
        <input type="checkbox" [checked]="allRowsSelected" (change)="select.emit(!allRowsSelected)" />
      </label>
      <span *ngIf="!column.headerTemplate" class="datatable-header-cell-wrapper">
        <span class="datatable-header-cell-label draggable" (click)="onSort()" [innerHTML]="name"> </span>
      </span>
      <ng-template
        *ngIf="column.headerTemplate"
        [ngTemplateOutlet]="column.headerTemplate"
        [ngTemplateOutletContext]="cellContext"
      >
      </ng-template>
      <span (click)="onSort()" [class]="sortClass"> </span>
    </div>
  `,
      host: {
        class: "datatable-header-cell"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], function() {
    return [{
      type: ChangeDetectorRef
    }];
  }, {
    sortType: [{
      type: Input
    }],
    sortAscendingIcon: [{
      type: Input
    }],
    sortDescendingIcon: [{
      type: Input
    }],
    sortUnsetIcon: [{
      type: Input
    }],
    isTarget: [{
      type: Input
    }],
    targetMarkerTemplate: [{
      type: Input
    }],
    targetMarkerContext: [{
      type: Input
    }],
    allRowsSelected: [{
      type: Input
    }],
    selectionType: [{
      type: Input
    }],
    column: [{
      type: Input
    }],
    headerHeight: [{
      type: HostBinding,
      args: ["style.height.px"]
    }, {
      type: Input
    }],
    sorts: [{
      type: Input
    }],
    sort: [{
      type: Output
    }],
    select: [{
      type: Output
    }],
    columnContextmenu: [{
      type: Output
    }],
    columnCssClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    name: [{
      type: HostBinding,
      args: ["attr.title"]
    }],
    minWidth: [{
      type: HostBinding,
      args: ["style.minWidth.px"]
    }],
    maxWidth: [{
      type: HostBinding,
      args: ["style.maxWidth.px"]
    }],
    width: [{
      type: HostBinding,
      args: ["style.width.px"]
    }],
    onContextmenu: [{
      type: HostListener,
      args: ["contextmenu", ["$event"]]
    }]
  });
})();
var DataTableHeaderComponent = class {
  constructor(cd) {
    this.cd = cd;
    this.sort = new EventEmitter();
    this.reorder = new EventEmitter();
    this.resize = new EventEmitter();
    this.select = new EventEmitter();
    this.columnContextmenu = new EventEmitter(false);
    this._columnGroupWidths = {
      total: 100
    };
    this._styleByGroup = {
      left: {},
      center: {},
      right: {}
    };
    this.destroyed = false;
  }
  set innerWidth(val) {
    this._innerWidth = val;
    setTimeout(() => {
      if (this._columns) {
        const colByPin = columnsByPin(this._columns);
        this._columnGroupWidths = columnGroupWidths(colByPin, this._columns);
        this.setStylesByGroup();
      }
    });
  }
  get innerWidth() {
    return this._innerWidth;
  }
  set headerHeight(val) {
    if (val !== "auto") {
      this._headerHeight = `${val}px`;
    } else {
      this._headerHeight = val;
    }
  }
  get headerHeight() {
    return this._headerHeight;
  }
  set columns(val) {
    this._columns = val;
    const colsByPin = columnsByPin(val);
    this._columnsByPin = columnsByPinArr(val);
    setTimeout(() => {
      this._columnGroupWidths = columnGroupWidths(colsByPin, val);
      this.setStylesByGroup();
    });
  }
  get columns() {
    return this._columns;
  }
  set offsetX(val) {
    this._offsetX = val;
    this.setStylesByGroup();
  }
  get offsetX() {
    return this._offsetX;
  }
  ngOnDestroy() {
    this.destroyed = true;
  }
  onLongPressStart({
    event,
    model
  }) {
    model.dragging = true;
    this.dragEventTarget = event;
  }
  onLongPressEnd({
    event,
    model
  }) {
    this.dragEventTarget = event;
    setTimeout(() => {
      const column = this._columns.find((c) => c.$$id === model.$$id);
      if (column) {
        column.dragging = false;
      }
    }, 5);
  }
  get headerWidth() {
    if (this.scrollbarH) {
      return this.innerWidth + "px";
    }
    return "100%";
  }
  trackByGroups(index, colGroup) {
    return colGroup.type;
  }
  columnTrackingFn(index, column) {
    return column.$$id;
  }
  onColumnResized(width, column) {
    if (width <= column.minWidth) {
      width = column.minWidth;
    } else if (width >= column.maxWidth) {
      width = column.maxWidth;
    }
    this.resize.emit({
      column,
      prevValue: column.width,
      newValue: width
    });
  }
  onColumnReordered({
    prevIndex,
    newIndex,
    model
  }) {
    const column = this.getColumn(newIndex);
    column.isTarget = false;
    column.targetMarkerContext = void 0;
    this.reorder.emit({
      column: model,
      prevValue: prevIndex,
      newValue: newIndex
    });
  }
  onTargetChanged({
    prevIndex,
    newIndex,
    initialIndex
  }) {
    if (prevIndex || prevIndex === 0) {
      const oldColumn = this.getColumn(prevIndex);
      oldColumn.isTarget = false;
      oldColumn.targetMarkerContext = void 0;
    }
    if (newIndex || newIndex === 0) {
      const newColumn = this.getColumn(newIndex);
      newColumn.isTarget = true;
      if (initialIndex !== newIndex) {
        newColumn.targetMarkerContext = {
          class: "targetMarker ".concat(initialIndex > newIndex ? "dragFromRight" : "dragFromLeft")
        };
      }
    }
  }
  getColumn(index) {
    const leftColumnCount = this._columnsByPin[0].columns.length;
    if (index < leftColumnCount) {
      return this._columnsByPin[0].columns[index];
    }
    const centerColumnCount = this._columnsByPin[1].columns.length;
    if (index < leftColumnCount + centerColumnCount) {
      return this._columnsByPin[1].columns[index - leftColumnCount];
    }
    return this._columnsByPin[2].columns[index - leftColumnCount - centerColumnCount];
  }
  onSort({
    column,
    prevValue,
    newValue
  }) {
    if (column.dragging) {
      return;
    }
    const sorts = this.calcNewSorts(column, prevValue, newValue);
    this.sort.emit({
      sorts,
      column,
      prevValue,
      newValue
    });
  }
  calcNewSorts(column, prevValue, newValue) {
    let idx = 0;
    if (!this.sorts) {
      this.sorts = [];
    }
    const sorts = this.sorts.map((s, i) => {
      s = __spreadValues({}, s);
      if (s.prop === column.prop) {
        idx = i;
      }
      return s;
    });
    if (newValue === void 0) {
      sorts.splice(idx, 1);
    } else if (prevValue) {
      sorts[idx].dir = newValue;
    } else {
      if (this.sortType === SortType.single) {
        sorts.splice(0, this.sorts.length);
      }
      sorts.push({
        dir: newValue,
        prop: column.prop
      });
    }
    return sorts;
  }
  setStylesByGroup() {
    this._styleByGroup.left = this.calcStylesByGroup("left");
    this._styleByGroup.center = this.calcStylesByGroup("center");
    this._styleByGroup.right = this.calcStylesByGroup("right");
    if (!this.destroyed) {
      this.cd.detectChanges();
    }
  }
  calcStylesByGroup(group) {
    const widths = this._columnGroupWidths;
    const offsetX = this.offsetX;
    const styles = {
      width: `${widths[group]}px`
    };
    if (group === "center") {
      translateXY(styles, offsetX * -1, 0);
    } else if (group === "right") {
      const totalDiff = widths.total - this.innerWidth;
      const offset = totalDiff * -1;
      translateXY(styles, offset, 0);
    }
    return styles;
  }
};
DataTableHeaderComponent.\u0275fac = function DataTableHeaderComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableHeaderComponent)(\u0275\u0275directiveInject(ChangeDetectorRef));
};
DataTableHeaderComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: DataTableHeaderComponent,
  selectors: [["datatable-header"]],
  hostAttrs: [1, "datatable-header"],
  hostVars: 4,
  hostBindings: function DataTableHeaderComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275styleProp("height", ctx.headerHeight)("width", ctx.headerWidth);
    }
  },
  inputs: {
    sortAscendingIcon: "sortAscendingIcon",
    sortDescendingIcon: "sortDescendingIcon",
    sortUnsetIcon: "sortUnsetIcon",
    scrollbarH: "scrollbarH",
    dealsWithGroup: "dealsWithGroup",
    targetMarkerTemplate: "targetMarkerTemplate",
    innerWidth: "innerWidth",
    sorts: "sorts",
    sortType: "sortType",
    allRowsSelected: "allRowsSelected",
    selectionType: "selectionType",
    reorderable: "reorderable",
    headerHeight: "headerHeight",
    columns: "columns",
    offsetX: "offsetX"
  },
  outputs: {
    sort: "sort",
    reorder: "reorder",
    resize: "resize",
    select: "select",
    columnContextmenu: "columnContextmenu"
  },
  decls: 2,
  vars: 4,
  consts: [["role", "row", "orderable", "", 1, "datatable-header-inner", 3, "reorder", "targetChanged"], [3, "class", "ngStyle", 4, "ngFor", "ngForOf", "ngForTrackBy"], [3, "ngStyle"], ["role", "columnheader", "resizeable", "", "long-press", "", "draggable", "", 3, "resizeEnabled", "pressModel", "pressEnabled", "dragX", "dragY", "dragModel", "dragEventTarget", "headerHeight", "isTarget", "targetMarkerTemplate", "targetMarkerContext", "column", "sortType", "sorts", "selectionType", "sortAscendingIcon", "sortDescendingIcon", "sortUnsetIcon", "allRowsSelected", "resize", "longPressStart", "longPressEnd", "sort", "select", "columnContextmenu", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["role", "columnheader", "resizeable", "", "long-press", "", "draggable", "", 3, "resize", "longPressStart", "longPressEnd", "sort", "select", "columnContextmenu", "resizeEnabled", "pressModel", "pressEnabled", "dragX", "dragY", "dragModel", "dragEventTarget", "headerHeight", "isTarget", "targetMarkerTemplate", "targetMarkerContext", "column", "sortType", "sorts", "selectionType", "sortAscendingIcon", "sortDescendingIcon", "sortUnsetIcon", "allRowsSelected"]],
  template: function DataTableHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275listener("reorder", function DataTableHeaderComponent_Template_div_reorder_0_listener($event) {
        return ctx.onColumnReordered($event);
      })("targetChanged", function DataTableHeaderComponent_Template_div_targetChanged_0_listener($event) {
        return ctx.onTargetChanged($event);
      });
      \u0275\u0275template(1, DataTableHeaderComponent_div_1_Template, 2, 5, "div", 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275styleProp("width", ctx._columnGroupWidths.total, "px");
      \u0275\u0275advance();
      \u0275\u0275property("ngForOf", ctx._columnsByPin)("ngForTrackBy", ctx.trackByGroups);
    }
  },
  dependencies: [DataTableHeaderCellComponent, OrderableDirective, NgForOf, NgStyle, ResizeableDirective, LongPressDirective, DraggableDirective],
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableHeaderComponent, [{
    type: Component,
    args: [{
      selector: "datatable-header",
      template: `
    <div
      role="row"
      orderable
      (reorder)="onColumnReordered($event)"
      (targetChanged)="onTargetChanged($event)"
      [style.width.px]="_columnGroupWidths.total"
      class="datatable-header-inner"
    >
      <div
        *ngFor="let colGroup of _columnsByPin; trackBy: trackByGroups"
        [class]="'datatable-row-' + colGroup.type"
        [ngStyle]="_styleByGroup[colGroup.type]"
      >
        <datatable-header-cell
          role="columnheader"
          *ngFor="let column of colGroup.columns; trackBy: columnTrackingFn"
          resizeable
          [resizeEnabled]="column.resizeable"
          (resize)="onColumnResized($event, column)"
          long-press
          [pressModel]="column"
          [pressEnabled]="reorderable && column.draggable"
          (longPressStart)="onLongPressStart($event)"
          (longPressEnd)="onLongPressEnd($event)"
          draggable
          [dragX]="reorderable && column.draggable && column.dragging"
          [dragY]="false"
          [dragModel]="column"
          [dragEventTarget]="dragEventTarget"
          [headerHeight]="headerHeight"
          [isTarget]="column.isTarget"
          [targetMarkerTemplate]="targetMarkerTemplate"
          [targetMarkerContext]="column.targetMarkerContext"
          [column]="column"
          [sortType]="sortType"
          [sorts]="sorts"
          [selectionType]="selectionType"
          [sortAscendingIcon]="sortAscendingIcon"
          [sortDescendingIcon]="sortDescendingIcon"
          [sortUnsetIcon]="sortUnsetIcon"
          [allRowsSelected]="allRowsSelected"
          (sort)="onSort($event)"
          (select)="select.emit($event)"
          (columnContextmenu)="columnContextmenu.emit($event)"
        >
        </datatable-header-cell>
      </div>
    </div>
  `,
      host: {
        class: "datatable-header"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], function() {
    return [{
      type: ChangeDetectorRef
    }];
  }, {
    sortAscendingIcon: [{
      type: Input
    }],
    sortDescendingIcon: [{
      type: Input
    }],
    sortUnsetIcon: [{
      type: Input
    }],
    scrollbarH: [{
      type: Input
    }],
    dealsWithGroup: [{
      type: Input
    }],
    targetMarkerTemplate: [{
      type: Input
    }],
    innerWidth: [{
      type: Input
    }],
    sorts: [{
      type: Input
    }],
    sortType: [{
      type: Input
    }],
    allRowsSelected: [{
      type: Input
    }],
    selectionType: [{
      type: Input
    }],
    reorderable: [{
      type: Input
    }],
    headerHeight: [{
      type: HostBinding,
      args: ["style.height"]
    }, {
      type: Input
    }],
    columns: [{
      type: Input
    }],
    offsetX: [{
      type: Input
    }],
    sort: [{
      type: Output
    }],
    reorder: [{
      type: Output
    }],
    resize: [{
      type: Output
    }],
    select: [{
      type: Output
    }],
    columnContextmenu: [{
      type: Output
    }],
    headerWidth: [{
      type: HostBinding,
      args: ["style.width"]
    }]
  });
})();
function throttle(func, wait, options) {
  options = options || {};
  let context;
  let args;
  let result;
  let timeout = null;
  let previous = 0;
  function later() {
    previous = options.leading === false ? 0 : +/* @__PURE__ */ new Date();
    timeout = null;
    result = func.apply(context, args);
  }
  return function() {
    const now = +/* @__PURE__ */ new Date();
    if (!previous && options.leading === false) {
      previous = now;
    }
    const remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}
function throttleable(duration, options) {
  return function innerDecorator(target, key, descriptor) {
    return {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: function getter() {
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: descriptor.enumerable,
          value: throttle(descriptor.value, duration, options)
        });
        return this[key];
      }
    };
  };
}
function getTotalFlexGrow(columns) {
  let totalFlexGrow = 0;
  for (const c of columns) {
    totalFlexGrow += c.flexGrow || 0;
  }
  return totalFlexGrow;
}
function adjustColumnWidths(allColumns, expectedWidth) {
  const columnsWidth = columnsTotalWidth(allColumns);
  const totalFlexGrow = getTotalFlexGrow(allColumns);
  const colsByGroup = columnsByPin(allColumns);
  if (columnsWidth !== expectedWidth) {
    scaleColumns(colsByGroup, expectedWidth, totalFlexGrow);
  }
}
function scaleColumns(colsByGroup, maxWidth, totalFlexGrow) {
  for (const attr in colsByGroup) {
    for (const column of colsByGroup[attr]) {
      if (!column.canAutoResize) {
        maxWidth -= column.width;
        totalFlexGrow -= column.flexGrow ? column.flexGrow : 0;
      } else {
        column.width = 0;
      }
    }
  }
  const hasMinWidth = {};
  let remainingWidth = maxWidth;
  do {
    const widthPerFlexPoint = remainingWidth / totalFlexGrow;
    remainingWidth = 0;
    for (const attr in colsByGroup) {
      for (const column of colsByGroup[attr]) {
        if (column.canAutoResize && !hasMinWidth[column.prop]) {
          const newWidth = column.width + column.flexGrow * widthPerFlexPoint;
          if (column.minWidth !== void 0 && newWidth < column.minWidth) {
            remainingWidth += newWidth - column.minWidth;
            column.width = column.minWidth;
            hasMinWidth[column.prop] = true;
          } else {
            column.width = newWidth;
          }
        }
      }
    }
  } while (remainingWidth !== 0);
}
function forceFillColumnWidths(allColumns, expectedWidth, startIdx, allowBleed, defaultColWidth = 300) {
  const columnsToResize = allColumns.slice(startIdx + 1, allColumns.length).filter((c) => {
    return c.canAutoResize !== false;
  });
  for (const column of columnsToResize) {
    if (!column.$$oldWidth) {
      column.$$oldWidth = column.width;
    }
  }
  let additionWidthPerColumn = 0;
  let exceedsWindow = false;
  let contentWidth = getContentWidth(allColumns, defaultColWidth);
  let remainingWidth = expectedWidth - contentWidth;
  const columnsProcessed = [];
  const remainingWidthLimit = 1;
  do {
    additionWidthPerColumn = remainingWidth / columnsToResize.length;
    exceedsWindow = contentWidth >= expectedWidth;
    for (const column of columnsToResize) {
      if (exceedsWindow && allowBleed) {
        column.width = column.$$oldWidth || column.width || defaultColWidth;
      } else {
        const newSize = (column.width || defaultColWidth) + additionWidthPerColumn;
        if (column.minWidth && newSize < column.minWidth) {
          column.width = column.minWidth;
          columnsProcessed.push(column);
        } else if (column.maxWidth && newSize > column.maxWidth) {
          column.width = column.maxWidth;
          columnsProcessed.push(column);
        } else {
          column.width = newSize;
        }
      }
      column.width = Math.max(0, column.width);
    }
    contentWidth = getContentWidth(allColumns);
    remainingWidth = expectedWidth - contentWidth;
    removeProcessedColumns(columnsToResize, columnsProcessed);
  } while (remainingWidth > remainingWidthLimit && columnsToResize.length !== 0);
}
function removeProcessedColumns(columnsToResize, columnsProcessed) {
  for (const column of columnsProcessed) {
    const index = columnsToResize.indexOf(column);
    columnsToResize.splice(index, 1);
  }
}
function getContentWidth(allColumns, defaultColWidth = 300) {
  let contentWidth = 0;
  for (const column of allColumns) {
    contentWidth += column.width || defaultColWidth;
  }
  return contentWidth;
}
var DataTablePagerComponent = class {
  constructor() {
    this.change = new EventEmitter();
    this._count = 0;
    this._page = 1;
    this._size = 0;
  }
  set size(val) {
    this._size = val;
    this.pages = this.calcPages();
  }
  get size() {
    return this._size;
  }
  set count(val) {
    this._count = val;
    this.pages = this.calcPages();
  }
  get count() {
    return this._count;
  }
  set page(val) {
    this._page = val;
    this.pages = this.calcPages();
  }
  get page() {
    return this._page;
  }
  get totalPages() {
    const count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
    return Math.max(count || 0, 1);
  }
  canPrevious() {
    return this.page > 1;
  }
  canNext() {
    return this.page < this.totalPages;
  }
  prevPage() {
    this.selectPage(this.page - 1);
  }
  nextPage() {
    this.selectPage(this.page + 1);
  }
  selectPage(page) {
    if (page > 0 && page <= this.totalPages && page !== this.page) {
      this.page = page;
      this.change.emit({
        page
      });
    }
  }
  calcPages(page) {
    const pages = [];
    let startPage = 1;
    let endPage = this.totalPages;
    const maxSize = 5;
    const isMaxSized = maxSize < this.totalPages;
    page = page || this.page;
    if (isMaxSized) {
      startPage = page - Math.floor(maxSize / 2);
      endPage = page + Math.floor(maxSize / 2);
      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + maxSize - 1, this.totalPages);
      } else if (endPage > this.totalPages) {
        startPage = Math.max(this.totalPages - maxSize + 1, 1);
        endPage = this.totalPages;
      }
    }
    for (let num = startPage; num <= endPage; num++) {
      pages.push({
        number: num,
        text: num
      });
    }
    return pages;
  }
};
DataTablePagerComponent.\u0275fac = function DataTablePagerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTablePagerComponent)();
};
DataTablePagerComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: DataTablePagerComponent,
  selectors: [["datatable-pager"]],
  hostAttrs: [1, "datatable-pager"],
  inputs: {
    pagerLeftArrowIcon: "pagerLeftArrowIcon",
    pagerRightArrowIcon: "pagerRightArrowIcon",
    pagerPreviousIcon: "pagerPreviousIcon",
    pagerNextIcon: "pagerNextIcon",
    size: "size",
    count: "count",
    page: "page"
  },
  outputs: {
    change: "change"
  },
  decls: 14,
  vars: 21,
  consts: [[1, "pager"], ["role", "button", "aria-label", "go to first page", "href", "javascript:void(0)", 3, "click"], ["role", "button", "aria-label", "go to previous page", "href", "javascript:void(0)", 3, "click"], ["role", "button", "class", "pages", 3, "active", 4, "ngFor", "ngForOf"], ["role", "button", "aria-label", "go to next page", "href", "javascript:void(0)", 3, "click"], ["role", "button", "aria-label", "go to last page", "href", "javascript:void(0)", 3, "click"], ["role", "button", 1, "pages"], ["href", "javascript:void(0)", 3, "click"]],
  template: function DataTablePagerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ul", 0)(1, "li")(2, "a", 1);
      \u0275\u0275listener("click", function DataTablePagerComponent_Template_a_click_2_listener() {
        return ctx.selectPage(1);
      });
      \u0275\u0275element(3, "i");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "li")(5, "a", 2);
      \u0275\u0275listener("click", function DataTablePagerComponent_Template_a_click_5_listener() {
        return ctx.prevPage();
      });
      \u0275\u0275element(6, "i");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(7, DataTablePagerComponent_li_7_Template, 3, 4, "li", 3);
      \u0275\u0275elementStart(8, "li")(9, "a", 4);
      \u0275\u0275listener("click", function DataTablePagerComponent_Template_a_click_9_listener() {
        return ctx.nextPage();
      });
      \u0275\u0275element(10, "i");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "li")(12, "a", 5);
      \u0275\u0275listener("click", function DataTablePagerComponent_Template_a_click_12_listener() {
        return ctx.selectPage(ctx.totalPages);
      });
      \u0275\u0275element(13, "i");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275classProp("disabled", !ctx.canPrevious());
      \u0275\u0275advance(2);
      \u0275\u0275classMap(ctx.pagerPreviousIcon);
      \u0275\u0275advance();
      \u0275\u0275classProp("disabled", !ctx.canPrevious());
      \u0275\u0275advance(2);
      \u0275\u0275classMap(ctx.pagerLeftArrowIcon);
      \u0275\u0275advance();
      \u0275\u0275property("ngForOf", ctx.pages);
      \u0275\u0275advance();
      \u0275\u0275classProp("disabled", !ctx.canNext());
      \u0275\u0275advance(2);
      \u0275\u0275classMap(ctx.pagerRightArrowIcon);
      \u0275\u0275advance();
      \u0275\u0275classProp("disabled", !ctx.canNext());
      \u0275\u0275advance(2);
      \u0275\u0275classMap(ctx.pagerNextIcon);
    }
  },
  dependencies: [NgForOf],
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTablePagerComponent, [{
    type: Component,
    args: [{
      selector: "datatable-pager",
      template: `
    <ul class="pager">
      <li [class.disabled]="!canPrevious()">
        <a role="button" aria-label="go to first page" href="javascript:void(0)" (click)="selectPage(1)">
          <i class="{{ pagerPreviousIcon }}"></i>
        </a>
      </li>
      <li [class.disabled]="!canPrevious()">
        <a role="button" aria-label="go to previous page" href="javascript:void(0)" (click)="prevPage()">
          <i class="{{ pagerLeftArrowIcon }}"></i>
        </a>
      </li>
      <li
        role="button"
        [attr.aria-label]="'page ' + pg.number"
        class="pages"
        *ngFor="let pg of pages"
        [class.active]="pg.number === page"
      >
        <a href="javascript:void(0)" (click)="selectPage(pg.number)">
          {{ pg.text }}
        </a>
      </li>
      <li [class.disabled]="!canNext()">
        <a role="button" aria-label="go to next page" href="javascript:void(0)" (click)="nextPage()">
          <i class="{{ pagerRightArrowIcon }}"></i>
        </a>
      </li>
      <li [class.disabled]="!canNext()">
        <a role="button" aria-label="go to last page" href="javascript:void(0)" (click)="selectPage(totalPages)">
          <i class="{{ pagerNextIcon }}"></i>
        </a>
      </li>
    </ul>
  `,
      host: {
        class: "datatable-pager"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, {
    pagerLeftArrowIcon: [{
      type: Input
    }],
    pagerRightArrowIcon: [{
      type: Input
    }],
    pagerPreviousIcon: [{
      type: Input
    }],
    pagerNextIcon: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    count: [{
      type: Input
    }],
    page: [{
      type: Input
    }],
    change: [{
      type: Output
    }]
  });
})();
var DataTableFooterComponent = class {
  constructor() {
    this.selectedCount = 0;
    this.page = new EventEmitter();
  }
  get isVisible() {
    return this.rowCount / this.pageSize > 1;
  }
  get curPage() {
    return this.offset + 1;
  }
};
DataTableFooterComponent.\u0275fac = function DataTableFooterComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DataTableFooterComponent)();
};
DataTableFooterComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: DataTableFooterComponent,
  selectors: [["datatable-footer"]],
  hostAttrs: [1, "datatable-footer"],
  inputs: {
    footerHeight: "footerHeight",
    rowCount: "rowCount",
    pageSize: "pageSize",
    offset: "offset",
    pagerLeftArrowIcon: "pagerLeftArrowIcon",
    pagerRightArrowIcon: "pagerRightArrowIcon",
    pagerPreviousIcon: "pagerPreviousIcon",
    pagerNextIcon: "pagerNextIcon",
    totalMessage: "totalMessage",
    footerTemplate: "footerTemplate",
    selectedCount: "selectedCount",
    selectedMessage: "selectedMessage"
  },
  outputs: {
    page: "page"
  },
  decls: 4,
  vars: 8,
  consts: [[1, "datatable-footer-inner", 3, "ngClass"], [4, "ngIf"], ["class", "page-count", 4, "ngIf"], [3, "pagerLeftArrowIcon", "pagerRightArrowIcon", "pagerPreviousIcon", "pagerNextIcon", "page", "size", "count", "hidden", "change", 4, "ngIf"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "page-count"], [3, "change", "pagerLeftArrowIcon", "pagerRightArrowIcon", "pagerPreviousIcon", "pagerNextIcon", "page", "size", "count", "hidden"]],
  template: function DataTableFooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275template(1, DataTableFooterComponent_1_Template, 1, 8, null, 1)(2, DataTableFooterComponent_div_2_Template, 3, 3, "div", 2)(3, DataTableFooterComponent_datatable_pager_3_Template, 1, 8, "datatable-pager", 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275styleProp("height", ctx.footerHeight, "px");
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(6, _c3, ctx.selectedMessage));
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.footerTemplate);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.footerTemplate);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.footerTemplate);
    }
  },
  dependencies: [DataTablePagerComponent, NgClass, NgIf, NgTemplateOutlet],
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataTableFooterComponent, [{
    type: Component,
    args: [{
      selector: "datatable-footer",
      template: `
    <div
      class="datatable-footer-inner"
      [ngClass]="{ 'selected-count': selectedMessage }"
      [style.height.px]="footerHeight"
    >
      <ng-template
        *ngIf="footerTemplate"
        [ngTemplateOutlet]="footerTemplate.template"
        [ngTemplateOutletContext]="{
          rowCount: rowCount,
          pageSize: pageSize,
          selectedCount: selectedCount,
          curPage: curPage,
          offset: offset
        }"
      >
      </ng-template>
      <div class="page-count" *ngIf="!footerTemplate">
        <span *ngIf="selectedMessage"> {{ selectedCount?.toLocaleString() }} {{ selectedMessage }} / </span>
        {{ rowCount?.toLocaleString() }} {{ totalMessage }}
      </div>
      <datatable-pager
        *ngIf="!footerTemplate"
        [pagerLeftArrowIcon]="pagerLeftArrowIcon"
        [pagerRightArrowIcon]="pagerRightArrowIcon"
        [pagerPreviousIcon]="pagerPreviousIcon"
        [pagerNextIcon]="pagerNextIcon"
        [page]="curPage"
        [size]="pageSize"
        [count]="rowCount"
        [hidden]="!isVisible"
        (change)="page.emit($event)"
      >
      </datatable-pager>
    </div>
  `,
      host: {
        class: "datatable-footer"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, {
    footerHeight: [{
      type: Input
    }],
    rowCount: [{
      type: Input
    }],
    pageSize: [{
      type: Input
    }],
    offset: [{
      type: Input
    }],
    pagerLeftArrowIcon: [{
      type: Input
    }],
    pagerRightArrowIcon: [{
      type: Input
    }],
    pagerPreviousIcon: [{
      type: Input
    }],
    pagerNextIcon: [{
      type: Input
    }],
    totalMessage: [{
      type: Input
    }],
    footerTemplate: [{
      type: Input
    }],
    selectedCount: [{
      type: Input
    }],
    selectedMessage: [{
      type: Input
    }],
    page: [{
      type: Output
    }]
  });
})();
var DatatableComponent = class {
  constructor(scrollbarHelper, dimensionsHelper, cd, element, differs, columnChangesService, configuration) {
    this.scrollbarHelper = scrollbarHelper;
    this.dimensionsHelper = dimensionsHelper;
    this.cd = cd;
    this.columnChangesService = columnChangesService;
    this.configuration = configuration;
    this.selected = [];
    this.scrollbarV = false;
    this.scrollbarH = false;
    this.rowHeight = 30;
    this.columnMode = ColumnMode.standard;
    this.headerHeight = 30;
    this.footerHeight = 0;
    this.externalPaging = false;
    this.externalSorting = false;
    this.loadingIndicator = false;
    this.reorderable = true;
    this.swapColumns = true;
    this.sortType = SortType.single;
    this.sorts = [];
    this.cssClasses = {
      sortAscending: "datatable-icon-up",
      sortDescending: "datatable-icon-down",
      sortUnset: "datatable-icon-sort-unset",
      pagerLeftArrow: "datatable-icon-left",
      pagerRightArrow: "datatable-icon-right",
      pagerPrevious: "datatable-icon-prev",
      pagerNext: "datatable-icon-skip"
    };
    this.messages = {
      // Message to show when array is presented
      // but contains no values
      emptyMessage: "No data to display",
      // Footer total message
      totalMessage: "total",
      // Footer selected message
      selectedMessage: "selected"
    };
    this.groupExpansionDefault = false;
    this.selectAllRowsOnPage = false;
    this.virtualization = true;
    this.summaryRow = false;
    this.summaryHeight = 30;
    this.summaryPosition = "top";
    this.scroll = new EventEmitter();
    this.activate = new EventEmitter();
    this.select = new EventEmitter();
    this.sort = new EventEmitter();
    this.page = new EventEmitter();
    this.reorder = new EventEmitter();
    this.resize = new EventEmitter();
    this.tableContextmenu = new EventEmitter(false);
    this.treeAction = new EventEmitter();
    this.rowCount = 0;
    this._offsetX = new BehaviorSubject(0);
    this._count = 0;
    this._offset = 0;
    this._subscriptions = [];
    this.rowIdentity = (x) => {
      if (this._groupRowsBy) {
        return x.key;
      } else {
        return x;
      }
    };
    this.element = element.nativeElement;
    this.rowDiffer = differs.find({}).create();
    if (this.configuration && this.configuration.messages) {
      this.messages = __spreadValues({}, this.configuration.messages);
    }
  }
  /**
   * Rows that are displayed in the table.
   */
  set rows(val) {
    this._rows = val;
    if (val) {
      this._internalRows = [...val];
    }
    if (!this.externalSorting) {
      this.sortInternalRows();
    }
    this._internalRows = groupRowsByParents(this._internalRows, optionalGetterForProp(this.treeFromRelation), optionalGetterForProp(this.treeToRelation));
    this.recalculate();
    if (this._rows && this._groupRowsBy) {
      this.groupedRows = this.groupArrayBy(this._rows, this._groupRowsBy);
    }
    this.cd.markForCheck();
  }
  /**
   * Gets the rows.
   */
  get rows() {
    return this._rows;
  }
  /**
   * This attribute allows the user to set the name of the column to group the data with
   */
  set groupRowsBy(val) {
    if (val) {
      this._groupRowsBy = val;
      if (this._rows && this._groupRowsBy) {
        this.groupedRows = this.groupArrayBy(this._rows, this._groupRowsBy);
      }
    }
  }
  get groupRowsBy() {
    return this._groupRowsBy;
  }
  /**
   * Columns to be displayed.
   */
  set columns(val) {
    if (val) {
      this._internalColumns = [...val];
      setColumnDefaults(this._internalColumns);
      this.recalculateColumns();
    }
    this._columns = val;
  }
  /**
   * Get the columns.
   */
  get columns() {
    return this._columns;
  }
  /**
   * The page size to be shown.
   * Default value: `undefined`
   */
  set limit(val) {
    this._limit = val;
    this.recalculate();
  }
  /**
   * Gets the limit.
   */
  get limit() {
    return this._limit;
  }
  /**
   * The total count of all rows.
   * Default value: `0`
   */
  set count(val) {
    this._count = val;
    this.recalculate();
  }
  /**
   * Gets the count.
   */
  get count() {
    return this._count;
  }
  /**
   * The current offset ( page - 1 ) shown.
   * Default value: `0`
   */
  set offset(val) {
    this._offset = val;
  }
  get offset() {
    return Math.max(Math.min(this._offset, Math.ceil(this.rowCount / this.pageSize) - 1), 0);
  }
  /**
   * CSS class applied if the header height if fixed height.
   */
  get isFixedHeader() {
    const headerHeight = this.headerHeight;
    return typeof headerHeight === "string" ? headerHeight !== "auto" : true;
  }
  /**
   * CSS class applied to the root element if
   * the row heights are fixed heights.
   */
  get isFixedRow() {
    return this.rowHeight !== "auto";
  }
  /**
   * CSS class applied to root element if
   * vertical scrolling is enabled.
   */
  get isVertScroll() {
    return this.scrollbarV;
  }
  /**
   * CSS class applied to root element if
   * virtualization is enabled.
   */
  get isVirtualized() {
    return this.virtualization;
  }
  /**
   * CSS class applied to the root element
   * if the horziontal scrolling is enabled.
   */
  get isHorScroll() {
    return this.scrollbarH;
  }
  /**
   * CSS class applied to root element is selectable.
   */
  get isSelectable() {
    return this.selectionType !== void 0;
  }
  /**
   * CSS class applied to root is checkbox selection.
   */
  get isCheckboxSelection() {
    return this.selectionType === SelectionType.checkbox;
  }
  /**
   * CSS class applied to root if cell selection.
   */
  get isCellSelection() {
    return this.selectionType === SelectionType.cell;
  }
  /**
   * CSS class applied to root if single select.
   */
  get isSingleSelection() {
    return this.selectionType === SelectionType.single;
  }
  /**
   * CSS class added to root element if mulit select
   */
  get isMultiSelection() {
    return this.selectionType === SelectionType.multi;
  }
  /**
   * CSS class added to root element if mulit click select
   */
  get isMultiClickSelection() {
    return this.selectionType === SelectionType.multiClick;
  }
  /**
   * Column templates gathered from `ContentChildren`
   * if described in your markup.
   */
  set columnTemplates(val) {
    this._columnTemplates = val;
    this.translateColumns(val);
  }
  /**
   * Returns the column templates.
   */
  get columnTemplates() {
    return this._columnTemplates;
  }
  /**
   * Returns if all rows are selected.
   */
  get allRowsSelected() {
    let allRowsSelected = this.rows && this.selected && this.selected.length === this.rows.length;
    if (this.bodyComponent && this.selectAllRowsOnPage) {
      const indexes = this.bodyComponent.indexes;
      const rowsOnPage = indexes.last - indexes.first;
      allRowsSelected = this.selected.length === rowsOnPage;
    }
    return this.selected && this.rows && this.rows.length !== 0 && allRowsSelected;
  }
  /**
   * Lifecycle hook that is called after data-bound
   * properties of a directive are initialized.
   */
  ngOnInit() {
    this.recalculate();
  }
  /**
   * Lifecycle hook that is called after a component's
   * view has been fully initialized.
   */
  ngAfterViewInit() {
    if (!this.externalSorting) {
      this.sortInternalRows();
    }
    if (typeof requestAnimationFrame === "undefined") {
      return;
    }
    requestAnimationFrame(() => {
      this.recalculate();
      if (this.externalPaging && this.scrollbarV) {
        this.page.emit({
          count: this.count,
          pageSize: this.pageSize,
          limit: this.limit,
          offset: 0
        });
      }
    });
  }
  /**
   * Lifecycle hook that is called after a component's
   * content has been fully initialized.
   */
  ngAfterContentInit() {
    this.columnTemplates.changes.subscribe((v) => this.translateColumns(v));
    this.listenForColumnInputChanges();
  }
  /**
   * Translates the templates to the column objects
   */
  translateColumns(val) {
    if (val) {
      const arr = val.toArray();
      if (arr.length) {
        this._internalColumns = translateTemplates(arr);
        setColumnDefaults(this._internalColumns);
        this.recalculateColumns();
        this.sortInternalRows();
        this.cd.markForCheck();
      }
    }
  }
  /**
   * Creates a map with the data grouped by the user choice of grouping index
   *
   * @param originalArray the original array passed via parameter
   * @param groupByIndex  the index of the column to group the data by
   */
  groupArrayBy(originalArray, groupBy) {
    const map = /* @__PURE__ */ new Map();
    let i = 0;
    originalArray.forEach((item) => {
      const key = item[groupBy];
      if (!map.has(key)) {
        map.set(key, [item]);
      } else {
        map.get(key).push(item);
      }
      i++;
    });
    const addGroup = (key, value) => {
      return {
        key,
        value
      };
    };
    return Array.from(map, (x) => addGroup(x[0], x[1]));
  }
  /*
   * Lifecycle hook that is called when Angular dirty checks a directive.
   */
  ngDoCheck() {
    if (this.rowDiffer.diff(this.rows)) {
      if (!this.externalSorting) {
        this.sortInternalRows();
      } else {
        this._internalRows = [...this.rows];
      }
      this._internalRows = groupRowsByParents(this._internalRows, optionalGetterForProp(this.treeFromRelation), optionalGetterForProp(this.treeToRelation));
      this.recalculatePages();
      this.cd.markForCheck();
    }
  }
  /**
   * Recalc's the sizes of the grid.
   *
   * Updated automatically on changes to:
   *
   *  - Columns
   *  - Rows
   *  - Paging related
   *
   * Also can be manually invoked or upon window resize.
   */
  recalculate() {
    this.recalculateDims();
    this.recalculateColumns();
    this.cd.markForCheck();
  }
  /**
   * Window resize handler to update sizes.
   */
  onWindowResize() {
    this.recalculate();
  }
  /**
   * Recalulcates the column widths based on column width
   * distribution mode and scrollbar offsets.
   */
  recalculateColumns(columns = this._internalColumns, forceIdx = -1, allowBleed = this.scrollbarH) {
    if (!columns) return void 0;
    let width = this._innerWidth;
    if (this.scrollbarV) {
      width = width - this.scrollbarHelper.width;
    }
    if (this.columnMode === ColumnMode.force) {
      forceFillColumnWidths(columns, width, forceIdx, allowBleed);
    } else if (this.columnMode === ColumnMode.flex) {
      adjustColumnWidths(columns, width);
    }
    return columns;
  }
  /**
   * Recalculates the dimensions of the table size.
   * Internally calls the page size and row count calcs too.
   *
   */
  recalculateDims() {
    const dims = this.dimensionsHelper.getDimensions(this.element);
    this._innerWidth = Math.floor(dims.width);
    if (this.scrollbarV) {
      let height = dims.height;
      if (this.headerHeight) height = height - this.headerHeight;
      if (this.footerHeight) height = height - this.footerHeight;
      this.bodyHeight = height;
    }
    this.recalculatePages();
  }
  /**
   * Recalculates the pages after a update.
   */
  recalculatePages() {
    this.pageSize = this.calcPageSize();
    this.rowCount = this.calcRowCount();
  }
  /**
   * Body triggered a page event.
   */
  onBodyPage({
    offset
  }) {
    if (this.externalPaging && !this.virtualization) {
      return;
    }
    this.offset = offset;
    this.page.emit({
      count: this.count,
      pageSize: this.pageSize,
      limit: this.limit,
      offset: this.offset
    });
  }
  /**
   * The body triggered a scroll event.
   */
  onBodyScroll(event) {
    this._offsetX.next(event.offsetX);
    this.scroll.emit(event);
    this.cd.detectChanges();
  }
  /**
   * The footer triggered a page event.
   */
  onFooterPage(event) {
    this.offset = event.page - 1;
    this.bodyComponent.updateOffsetY(this.offset);
    this.page.emit({
      count: this.count,
      pageSize: this.pageSize,
      limit: this.limit,
      offset: this.offset
    });
    if (this.selectAllRowsOnPage) {
      this.selected = [];
      this.select.emit({
        selected: this.selected
      });
    }
  }
  /**
   * Recalculates the sizes of the page
   */
  calcPageSize(val = this.rows) {
    if (this.scrollbarV && this.virtualization) {
      const size = Math.ceil(this.bodyHeight / this.rowHeight);
      return Math.max(size, 0);
    }
    if (this.limit !== void 0) {
      return this.limit;
    }
    if (val) {
      return val.length;
    }
    return 0;
  }
  /**
   * Calculates the row count.
   */
  calcRowCount(val = this.rows) {
    if (!this.externalPaging) {
      if (!val) return 0;
      if (this.groupedRows) {
        return this.groupedRows.length;
      } else if (this.treeFromRelation != null && this.treeToRelation != null) {
        return this._internalRows.length;
      } else {
        return val.length;
      }
    }
    return this.count;
  }
  /**
   * The header triggered a contextmenu event.
   */
  onColumnContextmenu({
    event,
    column
  }) {
    this.tableContextmenu.emit({
      event,
      type: ContextmenuType.header,
      content: column
    });
  }
  /**
   * The body triggered a contextmenu event.
   */
  onRowContextmenu({
    event,
    row
  }) {
    this.tableContextmenu.emit({
      event,
      type: ContextmenuType.body,
      content: row
    });
  }
  /**
   * The header triggered a column resize event.
   */
  onColumnResize({
    column,
    newValue
  }) {
    if (column === void 0) {
      return;
    }
    let idx;
    const cols = this._internalColumns.map((c, i) => {
      c = __spreadValues({}, c);
      if (c.$$id === column.$$id) {
        idx = i;
        c.width = newValue;
        c.$$oldWidth = newValue;
      }
      return c;
    });
    this.recalculateColumns(cols, idx);
    this._internalColumns = cols;
    this.resize.emit({
      column,
      newValue
    });
  }
  /**
   * The header triggered a column re-order event.
   */
  onColumnReorder({
    column,
    newValue,
    prevValue
  }) {
    const cols = this._internalColumns.map((c) => {
      return __spreadValues({}, c);
    });
    if (this.swapColumns) {
      const prevCol = cols[newValue];
      cols[newValue] = column;
      cols[prevValue] = prevCol;
    } else {
      if (newValue > prevValue) {
        const movedCol = cols[prevValue];
        for (let i = prevValue; i < newValue; i++) {
          cols[i] = cols[i + 1];
        }
        cols[newValue] = movedCol;
      } else {
        const movedCol = cols[prevValue];
        for (let i = prevValue; i > newValue; i--) {
          cols[i] = cols[i - 1];
        }
        cols[newValue] = movedCol;
      }
    }
    this._internalColumns = cols;
    this.reorder.emit({
      column,
      newValue,
      prevValue
    });
  }
  /**
   * The header triggered a column sort event.
   */
  onColumnSort(event) {
    if (this.selectAllRowsOnPage) {
      this.selected = [];
      this.select.emit({
        selected: this.selected
      });
    }
    this.sorts = event.sorts;
    if (this.externalSorting === false) {
      this.sortInternalRows();
    }
    this._internalRows = groupRowsByParents(this._internalRows, optionalGetterForProp(this.treeFromRelation), optionalGetterForProp(this.treeToRelation));
    this.offset = 0;
    this.bodyComponent.updateOffsetY(this.offset);
    this.sort.emit(event);
  }
  /**
   * Toggle all row selection
   */
  onHeaderSelect(event) {
    if (this.bodyComponent && this.selectAllRowsOnPage) {
      const first = this.bodyComponent.indexes.first;
      const last = this.bodyComponent.indexes.last;
      const allSelected = this.selected.length === last - first;
      this.selected = [];
      if (!allSelected) {
        this.selected.push(...this._internalRows.slice(first, last));
      }
    } else {
      const allSelected = this.selected.length === this.rows.length;
      this.selected = [];
      if (!allSelected) {
        this.selected.push(...this.rows);
      }
    }
    this.select.emit({
      selected: this.selected
    });
  }
  /**
   * A row was selected from body
   */
  onBodySelect(event) {
    this.select.emit(event);
  }
  /**
   * A row was expanded or collapsed for tree
   */
  onTreeAction(event) {
    const row = event.row;
    const rowIndex = this._rows.findIndex((r) => r[this.treeToRelation] === event.row[this.treeToRelation]);
    this.treeAction.emit({
      row,
      rowIndex
    });
  }
  ngOnDestroy() {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  /**
   * listen for changes to input bindings of all DataTableColumnDirective and
   * trigger the columnTemplates.changes observable to emit
   */
  listenForColumnInputChanges() {
    this._subscriptions.push(this.columnChangesService.columnInputChanges$.subscribe(() => {
      if (this.columnTemplates) {
        this.columnTemplates.notifyOnChanges();
      }
    }));
  }
  sortInternalRows() {
    this._internalRows = sortRows(this._internalRows, this._internalColumns, this.sorts);
  }
};
DatatableComponent.\u0275fac = function DatatableComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || DatatableComponent)(\u0275\u0275directiveInject(ScrollbarHelper, 4), \u0275\u0275directiveInject(DimensionsHelper, 4), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(KeyValueDiffers), \u0275\u0275directiveInject(ColumnChangesService), \u0275\u0275directiveInject("configuration", 8));
};
DatatableComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: DatatableComponent,
  selectors: [["ngx-datatable"]],
  contentQueries: function DatatableComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      \u0275\u0275contentQuery(dirIndex, DatatableRowDetailDirective, 5);
      \u0275\u0275contentQuery(dirIndex, DatatableGroupHeaderDirective, 5);
      \u0275\u0275contentQuery(dirIndex, DatatableFooterDirective, 5);
      \u0275\u0275contentQuery(dirIndex, DataTableColumnDirective, 4);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.rowDetail = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.groupHeader = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.footer = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.columnTemplates = _t);
    }
  },
  viewQuery: function DatatableComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(DataTableBodyComponent, 5);
      \u0275\u0275viewQuery(DataTableHeaderComponent, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.bodyComponent = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.headerComponent = _t.first);
    }
  },
  hostAttrs: [1, "ngx-datatable"],
  hostVars: 22,
  hostBindings: function DatatableComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("resize", function DatatableComponent_resize_HostBindingHandler() {
        return ctx.onWindowResize();
      }, false, \u0275\u0275resolveWindow);
    }
    if (rf & 2) {
      \u0275\u0275classProp("fixed-header", ctx.isFixedHeader)("fixed-row", ctx.isFixedRow)("scroll-vertical", ctx.isVertScroll)("virtualized", ctx.isVirtualized)("scroll-horz", ctx.isHorScroll)("selectable", ctx.isSelectable)("checkbox-selection", ctx.isCheckboxSelection)("cell-selection", ctx.isCellSelection)("single-selection", ctx.isSingleSelection)("multi-selection", ctx.isMultiSelection)("multi-click-selection", ctx.isMultiClickSelection);
    }
  },
  inputs: {
    targetMarkerTemplate: "targetMarkerTemplate",
    rows: "rows",
    groupRowsBy: "groupRowsBy",
    groupedRows: "groupedRows",
    columns: "columns",
    selected: "selected",
    scrollbarV: "scrollbarV",
    scrollbarH: "scrollbarH",
    rowHeight: "rowHeight",
    columnMode: "columnMode",
    headerHeight: "headerHeight",
    footerHeight: "footerHeight",
    externalPaging: "externalPaging",
    externalSorting: "externalSorting",
    limit: "limit",
    count: "count",
    offset: "offset",
    loadingIndicator: "loadingIndicator",
    selectionType: "selectionType",
    reorderable: "reorderable",
    swapColumns: "swapColumns",
    sortType: "sortType",
    sorts: "sorts",
    cssClasses: "cssClasses",
    messages: "messages",
    rowClass: "rowClass",
    selectCheck: "selectCheck",
    displayCheck: "displayCheck",
    groupExpansionDefault: "groupExpansionDefault",
    trackByProp: "trackByProp",
    selectAllRowsOnPage: "selectAllRowsOnPage",
    virtualization: "virtualization",
    treeFromRelation: "treeFromRelation",
    treeToRelation: "treeToRelation",
    summaryRow: "summaryRow",
    summaryHeight: "summaryHeight",
    summaryPosition: "summaryPosition",
    rowIdentity: "rowIdentity"
  },
  outputs: {
    scroll: "scroll",
    activate: "activate",
    select: "select",
    sort: "sort",
    page: "page",
    reorder: "reorder",
    resize: "resize",
    tableContextmenu: "tableContextmenu",
    treeAction: "treeAction"
  },
  decls: 5,
  vars: 34,
  consts: [["role", "table", "visibilityObserver", "", 3, "visible"], ["role", "rowgroup", 3, "sorts", "sortType", "scrollbarH", "innerWidth", "offsetX", "dealsWithGroup", "columns", "headerHeight", "reorderable", "targetMarkerTemplate", "sortAscendingIcon", "sortDescendingIcon", "sortUnsetIcon", "allRowsSelected", "selectionType", "sort", "resize", "reorder", "select", "columnContextmenu", 4, "ngIf"], ["role", "rowgroup", 3, "page", "activate", "rowContextmenu", "select", "scroll", "treeAction", "groupRowsBy", "groupedRows", "rows", "groupExpansionDefault", "scrollbarV", "scrollbarH", "virtualization", "loadingIndicator", "externalPaging", "rowHeight", "rowCount", "offset", "trackByProp", "columns", "pageSize", "offsetX", "rowDetail", "groupHeader", "selected", "innerWidth", "bodyHeight", "selectionType", "emptyMessage", "rowIdentity", "rowClass", "selectCheck", "displayCheck", "summaryRow", "summaryHeight", "summaryPosition"], [3, "rowCount", "pageSize", "offset", "footerHeight", "footerTemplate", "totalMessage", "pagerLeftArrowIcon", "pagerRightArrowIcon", "pagerPreviousIcon", "selectedCount", "selectedMessage", "pagerNextIcon", "page", 4, "ngIf"], ["role", "rowgroup", 3, "sort", "resize", "reorder", "select", "columnContextmenu", "sorts", "sortType", "scrollbarH", "innerWidth", "offsetX", "dealsWithGroup", "columns", "headerHeight", "reorderable", "targetMarkerTemplate", "sortAscendingIcon", "sortDescendingIcon", "sortUnsetIcon", "allRowsSelected", "selectionType"], [3, "page", "rowCount", "pageSize", "offset", "footerHeight", "footerTemplate", "totalMessage", "pagerLeftArrowIcon", "pagerRightArrowIcon", "pagerPreviousIcon", "selectedCount", "selectedMessage", "pagerNextIcon"]],
  template: function DatatableComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275listener("visible", function DatatableComponent_Template_div_visible_0_listener() {
        return ctx.recalculate();
      });
      \u0275\u0275template(1, DatatableComponent_datatable_header_1_Template, 2, 17, "datatable-header", 1);
      \u0275\u0275elementStart(2, "datatable-body", 2);
      \u0275\u0275pipe(3, "async");
      \u0275\u0275listener("page", function DatatableComponent_Template_datatable_body_page_2_listener($event) {
        return ctx.onBodyPage($event);
      })("activate", function DatatableComponent_Template_datatable_body_activate_2_listener($event) {
        return ctx.activate.emit($event);
      })("rowContextmenu", function DatatableComponent_Template_datatable_body_rowContextmenu_2_listener($event) {
        return ctx.onRowContextmenu($event);
      })("select", function DatatableComponent_Template_datatable_body_select_2_listener($event) {
        return ctx.onBodySelect($event);
      })("scroll", function DatatableComponent_Template_datatable_body_scroll_2_listener($event) {
        return ctx.onBodyScroll($event);
      })("treeAction", function DatatableComponent_Template_datatable_body_treeAction_2_listener($event) {
        return ctx.onTreeAction($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275template(4, DatatableComponent_datatable_footer_4_Template, 1, 12, "datatable-footer", 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.headerHeight);
      \u0275\u0275advance();
      \u0275\u0275property("groupRowsBy", ctx.groupRowsBy)("groupedRows", ctx.groupedRows)("rows", ctx._internalRows)("groupExpansionDefault", ctx.groupExpansionDefault)("scrollbarV", ctx.scrollbarV)("scrollbarH", ctx.scrollbarH)("virtualization", ctx.virtualization)("loadingIndicator", ctx.loadingIndicator)("externalPaging", ctx.externalPaging)("rowHeight", ctx.rowHeight)("rowCount", ctx.rowCount)("offset", ctx.offset)("trackByProp", ctx.trackByProp)("columns", ctx._internalColumns)("pageSize", ctx.pageSize)("offsetX", \u0275\u0275pipeBind1(3, 32, ctx._offsetX))("rowDetail", ctx.rowDetail)("groupHeader", ctx.groupHeader)("selected", ctx.selected)("innerWidth", ctx._innerWidth)("bodyHeight", ctx.bodyHeight)("selectionType", ctx.selectionType)("emptyMessage", ctx.messages.emptyMessage)("rowIdentity", ctx.rowIdentity)("rowClass", ctx.rowClass)("selectCheck", ctx.selectCheck)("displayCheck", ctx.displayCheck)("summaryRow", ctx.summaryRow)("summaryHeight", ctx.summaryHeight)("summaryPosition", ctx.summaryPosition);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.footerHeight);
    }
  },
  dependencies: [DataTableHeaderComponent, DataTableBodyComponent, DataTableFooterComponent, VisibilityDirective, NgIf, AsyncPipe],
  styles: [".ngx-datatable{display:block;overflow:hidden;justify-content:center;position:relative;transform:translate(0)}.ngx-datatable [hidden]{display:none!important}.ngx-datatable *,.ngx-datatable *:before,.ngx-datatable *:after{box-sizing:border-box}.ngx-datatable.scroll-vertical .datatable-body{overflow-y:auto}.ngx-datatable.scroll-vertical.virtualized .datatable-body .datatable-row-wrapper{position:absolute}.ngx-datatable.scroll-horz .datatable-body{overflow-x:auto;-webkit-overflow-scrolling:touch}.ngx-datatable.fixed-header .datatable-header .datatable-header-inner{white-space:nowrap}.ngx-datatable.fixed-header .datatable-header .datatable-header-inner .datatable-header-cell{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ngx-datatable.fixed-row .datatable-scroll,.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row{white-space:nowrap}.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row .datatable-body-cell,.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row .datatable-body-group-cell{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ngx-datatable .datatable-body-row,.ngx-datatable .datatable-row-center,.ngx-datatable .datatable-header-inner{display:flex;flex-direction:row;-o-flex-flow:row;flex-flow:row}.ngx-datatable .datatable-body-cell,.ngx-datatable .datatable-header-cell{overflow-x:hidden;vertical-align:top;display:inline-block;line-height:1.625}.ngx-datatable .datatable-body-cell:focus,.ngx-datatable .datatable-header-cell:focus{outline:none}.ngx-datatable .datatable-row-left,.ngx-datatable .datatable-row-right{z-index:9}.ngx-datatable .datatable-row-left,.ngx-datatable .datatable-row-center,.ngx-datatable .datatable-row-group,.ngx-datatable .datatable-row-right{position:relative}.ngx-datatable .datatable-header{display:block;overflow:hidden}.ngx-datatable .datatable-header .datatable-header-inner{align-items:stretch;-webkit-align-items:stretch}.ngx-datatable .datatable-header .datatable-header-cell{position:relative;display:inline-block}.ngx-datatable .datatable-header .datatable-header-cell.sortable .datatable-header-cell-wrapper{cursor:pointer}.ngx-datatable .datatable-header .datatable-header-cell.longpress .datatable-header-cell-wrapper{cursor:move}.ngx-datatable .datatable-header .datatable-header-cell .sort-btn{line-height:100%;vertical-align:middle;display:inline-block;cursor:pointer}.ngx-datatable .datatable-header .datatable-header-cell .resize-handle,.ngx-datatable .datatable-header .datatable-header-cell .resize-handle--not-resizable{display:inline-block;position:absolute;right:0;top:0;bottom:0;width:5px;padding:0 4px;visibility:hidden}.ngx-datatable .datatable-header .datatable-header-cell .resize-handle{cursor:ew-resize}.ngx-datatable .datatable-header .datatable-header-cell.resizeable:hover .resize-handle,.ngx-datatable .datatable-header .datatable-header-cell:hover .resize-handle--not-resizable{visibility:visible}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker{position:absolute;top:0;bottom:0}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker.dragFromLeft{right:0}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker.dragFromRight{left:0}.ngx-datatable .datatable-header .datatable-header-cell .datatable-header-cell-template-wrap{height:inherit}.ngx-datatable .datatable-body{position:relative;z-index:10;display:block}.ngx-datatable .datatable-body .datatable-scroll{display:inline-block}.ngx-datatable .datatable-body .datatable-row-detail{overflow-y:hidden}.ngx-datatable .datatable-body .datatable-row-wrapper{display:flex;flex-direction:column}.ngx-datatable .datatable-body .datatable-body-row{outline:none}.ngx-datatable .datatable-body .datatable-body-row>div{display:flex}.ngx-datatable .datatable-footer{display:block;width:100%;overflow:auto}.ngx-datatable .datatable-footer .datatable-footer-inner{display:flex;align-items:center;width:100%}.ngx-datatable .datatable-footer .selected-count .page-count{flex:1 1 40%}.ngx-datatable .datatable-footer .selected-count .datatable-pager{flex:1 1 60%}.ngx-datatable .datatable-footer .page-count{flex:1 1 20%}.ngx-datatable .datatable-footer .datatable-pager{flex:1 1 80%;text-align:right}.ngx-datatable .datatable-footer .datatable-pager .pager,.ngx-datatable .datatable-footer .datatable-pager .pager li{padding:0;margin:0;display:inline-block;list-style:none}.ngx-datatable .datatable-footer .datatable-pager .pager li,.ngx-datatable .datatable-footer .datatable-pager .pager li a{outline:none}.ngx-datatable .datatable-footer .datatable-pager .pager li a{cursor:pointer;display:inline-block}.ngx-datatable .datatable-footer .datatable-pager .pager li.disabled a{cursor:not-allowed}\n"],
  encapsulation: 2,
  changeDetection: 0
});
__decorate([throttleable(5)], DatatableComponent.prototype, "onWindowResize", null);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DatatableComponent, [{
    type: Component,
    args: [{
      selector: "ngx-datatable",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      host: {
        class: "ngx-datatable"
      },
      template: '<div role="table" visibilityObserver (visible)="recalculate()">\n  <datatable-header\n    role="rowgroup"\n    *ngIf="headerHeight"\n    [sorts]="sorts"\n    [sortType]="sortType"\n    [scrollbarH]="scrollbarH"\n    [innerWidth]="_innerWidth"\n    [offsetX]="_offsetX | async"\n    [dealsWithGroup]="groupedRows !== undefined"\n    [columns]="_internalColumns"\n    [headerHeight]="headerHeight"\n    [reorderable]="reorderable"\n    [targetMarkerTemplate]="targetMarkerTemplate"\n    [sortAscendingIcon]="cssClasses.sortAscending"\n    [sortDescendingIcon]="cssClasses.sortDescending"\n    [sortUnsetIcon]="cssClasses.sortUnset"\n    [allRowsSelected]="allRowsSelected"\n    [selectionType]="selectionType"\n    (sort)="onColumnSort($event)"\n    (resize)="onColumnResize($event)"\n    (reorder)="onColumnReorder($event)"\n    (select)="onHeaderSelect($event)"\n    (columnContextmenu)="onColumnContextmenu($event)"\n  >\n  </datatable-header>\n  <datatable-body\n    role="rowgroup"\n    [groupRowsBy]="groupRowsBy"\n    [groupedRows]="groupedRows"\n    [rows]="_internalRows"\n    [groupExpansionDefault]="groupExpansionDefault"\n    [scrollbarV]="scrollbarV"\n    [scrollbarH]="scrollbarH"\n    [virtualization]="virtualization"\n    [loadingIndicator]="loadingIndicator"\n    [externalPaging]="externalPaging"\n    [rowHeight]="rowHeight"\n    [rowCount]="rowCount"\n    [offset]="offset"\n    [trackByProp]="trackByProp"\n    [columns]="_internalColumns"\n    [pageSize]="pageSize"\n    [offsetX]="_offsetX | async"\n    [rowDetail]="rowDetail"\n    [groupHeader]="groupHeader"\n    [selected]="selected"\n    [innerWidth]="_innerWidth"\n    [bodyHeight]="bodyHeight"\n    [selectionType]="selectionType"\n    [emptyMessage]="messages.emptyMessage"\n    [rowIdentity]="rowIdentity"\n    [rowClass]="rowClass"\n    [selectCheck]="selectCheck"\n    [displayCheck]="displayCheck"\n    [summaryRow]="summaryRow"\n    [summaryHeight]="summaryHeight"\n    [summaryPosition]="summaryPosition"\n    (page)="onBodyPage($event)"\n    (activate)="activate.emit($event)"\n    (rowContextmenu)="onRowContextmenu($event)"\n    (select)="onBodySelect($event)"\n    (scroll)="onBodyScroll($event)"\n    (treeAction)="onTreeAction($event)"\n  >\n  </datatable-body>\n  <datatable-footer\n    *ngIf="footerHeight"\n    [rowCount]="rowCount"\n    [pageSize]="pageSize"\n    [offset]="offset"\n    [footerHeight]="footerHeight"\n    [footerTemplate]="footer"\n    [totalMessage]="messages.totalMessage"\n    [pagerLeftArrowIcon]="cssClasses.pagerLeftArrow"\n    [pagerRightArrowIcon]="cssClasses.pagerRightArrow"\n    [pagerPreviousIcon]="cssClasses.pagerPrevious"\n    [selectedCount]="selected.length"\n    [selectedMessage]="!!selectionType && messages.selectedMessage"\n    [pagerNextIcon]="cssClasses.pagerNext"\n    (page)="onFooterPage($event)"\n  >\n  </datatable-footer>\n</div>\n',
      styles: [".ngx-datatable{display:block;overflow:hidden;justify-content:center;position:relative;transform:translate(0)}.ngx-datatable [hidden]{display:none!important}.ngx-datatable *,.ngx-datatable *:before,.ngx-datatable *:after{box-sizing:border-box}.ngx-datatable.scroll-vertical .datatable-body{overflow-y:auto}.ngx-datatable.scroll-vertical.virtualized .datatable-body .datatable-row-wrapper{position:absolute}.ngx-datatable.scroll-horz .datatable-body{overflow-x:auto;-webkit-overflow-scrolling:touch}.ngx-datatable.fixed-header .datatable-header .datatable-header-inner{white-space:nowrap}.ngx-datatable.fixed-header .datatable-header .datatable-header-inner .datatable-header-cell{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ngx-datatable.fixed-row .datatable-scroll,.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row{white-space:nowrap}.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row .datatable-body-cell,.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row .datatable-body-group-cell{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ngx-datatable .datatable-body-row,.ngx-datatable .datatable-row-center,.ngx-datatable .datatable-header-inner{display:flex;flex-direction:row;-o-flex-flow:row;flex-flow:row}.ngx-datatable .datatable-body-cell,.ngx-datatable .datatable-header-cell{overflow-x:hidden;vertical-align:top;display:inline-block;line-height:1.625}.ngx-datatable .datatable-body-cell:focus,.ngx-datatable .datatable-header-cell:focus{outline:none}.ngx-datatable .datatable-row-left,.ngx-datatable .datatable-row-right{z-index:9}.ngx-datatable .datatable-row-left,.ngx-datatable .datatable-row-center,.ngx-datatable .datatable-row-group,.ngx-datatable .datatable-row-right{position:relative}.ngx-datatable .datatable-header{display:block;overflow:hidden}.ngx-datatable .datatable-header .datatable-header-inner{align-items:stretch;-webkit-align-items:stretch}.ngx-datatable .datatable-header .datatable-header-cell{position:relative;display:inline-block}.ngx-datatable .datatable-header .datatable-header-cell.sortable .datatable-header-cell-wrapper{cursor:pointer}.ngx-datatable .datatable-header .datatable-header-cell.longpress .datatable-header-cell-wrapper{cursor:move}.ngx-datatable .datatable-header .datatable-header-cell .sort-btn{line-height:100%;vertical-align:middle;display:inline-block;cursor:pointer}.ngx-datatable .datatable-header .datatable-header-cell .resize-handle,.ngx-datatable .datatable-header .datatable-header-cell .resize-handle--not-resizable{display:inline-block;position:absolute;right:0;top:0;bottom:0;width:5px;padding:0 4px;visibility:hidden}.ngx-datatable .datatable-header .datatable-header-cell .resize-handle{cursor:ew-resize}.ngx-datatable .datatable-header .datatable-header-cell.resizeable:hover .resize-handle,.ngx-datatable .datatable-header .datatable-header-cell:hover .resize-handle--not-resizable{visibility:visible}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker{position:absolute;top:0;bottom:0}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker.dragFromLeft{right:0}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker.dragFromRight{left:0}.ngx-datatable .datatable-header .datatable-header-cell .datatable-header-cell-template-wrap{height:inherit}.ngx-datatable .datatable-body{position:relative;z-index:10;display:block}.ngx-datatable .datatable-body .datatable-scroll{display:inline-block}.ngx-datatable .datatable-body .datatable-row-detail{overflow-y:hidden}.ngx-datatable .datatable-body .datatable-row-wrapper{display:flex;flex-direction:column}.ngx-datatable .datatable-body .datatable-body-row{outline:none}.ngx-datatable .datatable-body .datatable-body-row>div{display:flex}.ngx-datatable .datatable-footer{display:block;width:100%;overflow:auto}.ngx-datatable .datatable-footer .datatable-footer-inner{display:flex;align-items:center;width:100%}.ngx-datatable .datatable-footer .selected-count .page-count{flex:1 1 40%}.ngx-datatable .datatable-footer .selected-count .datatable-pager{flex:1 1 60%}.ngx-datatable .datatable-footer .page-count{flex:1 1 20%}.ngx-datatable .datatable-footer .datatable-pager{flex:1 1 80%;text-align:right}.ngx-datatable .datatable-footer .datatable-pager .pager,.ngx-datatable .datatable-footer .datatable-pager .pager li{padding:0;margin:0;display:inline-block;list-style:none}.ngx-datatable .datatable-footer .datatable-pager .pager li,.ngx-datatable .datatable-footer .datatable-pager .pager li a{outline:none}.ngx-datatable .datatable-footer .datatable-pager .pager li a{cursor:pointer;display:inline-block}.ngx-datatable .datatable-footer .datatable-pager .pager li.disabled a{cursor:not-allowed}\n"]
    }]
  }], function() {
    return [{
      type: ScrollbarHelper,
      decorators: [{
        type: SkipSelf
      }]
    }, {
      type: DimensionsHelper,
      decorators: [{
        type: SkipSelf
      }]
    }, {
      type: ChangeDetectorRef
    }, {
      type: ElementRef
    }, {
      type: KeyValueDiffers
    }, {
      type: ColumnChangesService
    }, {
      type: void 0,
      decorators: [{
        type: Optional
      }, {
        type: Inject,
        args: ["configuration"]
      }]
    }];
  }, {
    targetMarkerTemplate: [{
      type: Input
    }],
    rows: [{
      type: Input
    }],
    groupRowsBy: [{
      type: Input
    }],
    groupedRows: [{
      type: Input
    }],
    columns: [{
      type: Input
    }],
    selected: [{
      type: Input
    }],
    scrollbarV: [{
      type: Input
    }],
    scrollbarH: [{
      type: Input
    }],
    rowHeight: [{
      type: Input
    }],
    columnMode: [{
      type: Input
    }],
    headerHeight: [{
      type: Input
    }],
    footerHeight: [{
      type: Input
    }],
    externalPaging: [{
      type: Input
    }],
    externalSorting: [{
      type: Input
    }],
    limit: [{
      type: Input
    }],
    count: [{
      type: Input
    }],
    offset: [{
      type: Input
    }],
    loadingIndicator: [{
      type: Input
    }],
    selectionType: [{
      type: Input
    }],
    reorderable: [{
      type: Input
    }],
    swapColumns: [{
      type: Input
    }],
    sortType: [{
      type: Input
    }],
    sorts: [{
      type: Input
    }],
    cssClasses: [{
      type: Input
    }],
    messages: [{
      type: Input
    }],
    rowClass: [{
      type: Input
    }],
    selectCheck: [{
      type: Input
    }],
    displayCheck: [{
      type: Input
    }],
    groupExpansionDefault: [{
      type: Input
    }],
    trackByProp: [{
      type: Input
    }],
    selectAllRowsOnPage: [{
      type: Input
    }],
    virtualization: [{
      type: Input
    }],
    treeFromRelation: [{
      type: Input
    }],
    treeToRelation: [{
      type: Input
    }],
    summaryRow: [{
      type: Input
    }],
    summaryHeight: [{
      type: Input
    }],
    summaryPosition: [{
      type: Input
    }],
    scroll: [{
      type: Output
    }],
    activate: [{
      type: Output
    }],
    select: [{
      type: Output
    }],
    sort: [{
      type: Output
    }],
    page: [{
      type: Output
    }],
    reorder: [{
      type: Output
    }],
    resize: [{
      type: Output
    }],
    tableContextmenu: [{
      type: Output
    }],
    treeAction: [{
      type: Output
    }],
    isFixedHeader: [{
      type: HostBinding,
      args: ["class.fixed-header"]
    }],
    isFixedRow: [{
      type: HostBinding,
      args: ["class.fixed-row"]
    }],
    isVertScroll: [{
      type: HostBinding,
      args: ["class.scroll-vertical"]
    }],
    isVirtualized: [{
      type: HostBinding,
      args: ["class.virtualized"]
    }],
    isHorScroll: [{
      type: HostBinding,
      args: ["class.scroll-horz"]
    }],
    isSelectable: [{
      type: HostBinding,
      args: ["class.selectable"]
    }],
    isCheckboxSelection: [{
      type: HostBinding,
      args: ["class.checkbox-selection"]
    }],
    isCellSelection: [{
      type: HostBinding,
      args: ["class.cell-selection"]
    }],
    isSingleSelection: [{
      type: HostBinding,
      args: ["class.single-selection"]
    }],
    isMultiSelection: [{
      type: HostBinding,
      args: ["class.multi-selection"]
    }],
    isMultiClickSelection: [{
      type: HostBinding,
      args: ["class.multi-click-selection"]
    }],
    columnTemplates: [{
      type: ContentChildren,
      args: [DataTableColumnDirective]
    }],
    rowDetail: [{
      type: ContentChild,
      args: [DatatableRowDetailDirective]
    }],
    groupHeader: [{
      type: ContentChild,
      args: [DatatableGroupHeaderDirective]
    }],
    footer: [{
      type: ContentChild,
      args: [DatatableFooterDirective]
    }],
    bodyComponent: [{
      type: ViewChild,
      args: [DataTableBodyComponent]
    }],
    headerComponent: [{
      type: ViewChild,
      args: [DataTableHeaderComponent]
    }],
    rowIdentity: [{
      type: Input
    }],
    onWindowResize: [{
      type: HostListener,
      args: ["window:resize"]
    }]
  });
})();
var NgxDatatableModule = class _NgxDatatableModule {
  /**
   * Configure global configuration via INgxDatatableConfig
   * @param configuration
   */
  static forRoot(configuration) {
    return {
      ngModule: _NgxDatatableModule,
      providers: [{
        provide: "configuration",
        useValue: configuration
      }]
    };
  }
};
NgxDatatableModule.\u0275fac = function NgxDatatableModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || NgxDatatableModule)();
};
NgxDatatableModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: NgxDatatableModule
});
NgxDatatableModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  providers: [ScrollbarHelper, DimensionsHelper, ColumnChangesService],
  imports: [[CommonModule]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxDatatableModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule],
      providers: [ScrollbarHelper, DimensionsHelper, ColumnChangesService],
      declarations: [DataTableFooterTemplateDirective, VisibilityDirective, DraggableDirective, ResizeableDirective, OrderableDirective, LongPressDirective, ScrollerComponent, DatatableComponent, DataTableColumnDirective, DataTableHeaderComponent, DataTableHeaderCellComponent, DataTableBodyComponent, DataTableFooterComponent, DataTablePagerComponent, ProgressBarComponent, DataTableBodyRowComponent, DataTableRowWrapperComponent, DatatableRowDetailDirective, DatatableGroupHeaderDirective, DatatableRowDetailTemplateDirective, DataTableBodyCellComponent, DataTableSelectionComponent, DataTableColumnHeaderDirective, DataTableColumnCellDirective, DataTableColumnCellTreeToggle, DatatableFooterDirective, DatatableGroupHeaderTemplateDirective, DataTableSummaryRowComponent],
      exports: [DatatableComponent, DatatableRowDetailDirective, DatatableGroupHeaderDirective, DatatableRowDetailTemplateDirective, DataTableColumnDirective, DataTableColumnHeaderDirective, DataTableColumnCellDirective, DataTableColumnCellTreeToggle, DataTableFooterTemplateDirective, DatatableFooterDirective, DataTablePagerComponent, DatatableGroupHeaderTemplateDirective]
    }]
  }], null, null);
})();
var ClickType;
(function(ClickType2) {
  ClickType2["single"] = "single";
  ClickType2["double"] = "double";
})(ClickType || (ClickType = {}));
if (typeof document !== "undefined" && !document.elementsFromPoint) {
  document.elementsFromPoint = elementsFromPoint;
}
function elementsFromPoint(x, y) {
  const elements = [];
  const previousPointerEvents = [];
  let current;
  let i;
  let d;
  while ((current = document.elementFromPoint(x, y)) && elements.indexOf(current) === -1 && current != null) {
    elements.push(current);
    previousPointerEvents.push({
      value: current.style.getPropertyValue("pointer-events"),
      priority: current.style.getPropertyPriority("pointer-events")
    });
    current.style.setProperty("pointer-events", "none", "important");
  }
  for (i = previousPointerEvents.length; d = previousPointerEvents[--i]; ) {
    elements[i].style.setProperty("pointer-events", d.value ? d.value : "", d.priority);
  }
  return elements;
}

export {
  SelectionType,
  DataTableColumnHeaderDirective,
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent,
  NgxDatatableModule
};
//# sourceMappingURL=chunk-OFWBTEIP.js.map
