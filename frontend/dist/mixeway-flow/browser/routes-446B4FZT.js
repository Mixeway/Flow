import {
  UserService
} from "./chunk-RX57R3D6.js";
import {
  TeamService
} from "./chunk-DKK4C6S4.js";
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent,
  NgxDatatableModule
} from "./chunk-OFWBTEIP.js";
import {
  AuthService
} from "./chunk-YFWDZ3VL.js";
import {
  free_exports
} from "./chunk-YOS6CCYB.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-MENGJYBG.js";
import "./chunk-YLFWSDV3.js";
import {
  AsyncPipe,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  CommonModule,
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
  Router,
  RowComponent,
  ToastBodyComponent,
  ToastComponent,
  ToastHeaderComponent,
  ToasterComponent,
  map,
  of,
  startWith,
  ɵsetClassDebugInfo,
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
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-ZG2BHLTP.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/views/admin-users/admin-users.component.ts
var _c0 = (a0, a1) => ({ "active": a0, "inactive": a1 });
function AdminUsersComponent_button_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 82);
    \u0275\u0275listener("click", function AdminUsersComponent_button_62_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearSearch());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 83);
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent_div_64_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 84);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 85);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "h4", 86);
    \u0275\u0275text(3, "No users found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 87);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 88);
    \u0275\u0275listener("click", function AdminUsersComponent_div_64_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openAddNewUserModal());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(7, "svg", 6);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "Add New User");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.searchTerm ? "Try adjusting your search term or" : "Get started by", " adding a new user ");
  }
}
function AdminUsersComponent_div_65_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 96)(2, "span", 97);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 13)(5, "div", 98);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 99)(8, "span", 100);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const row_r4 = ctx.row;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.getUserInitials(row_r4.username));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(row_r4.username);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getRoleBadgeClass(row_r4.role));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatRoleDisplay(row_r4.role), " ");
  }
}
function AdminUsersComponent_div_65_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 101);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 102);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r5 = ctx.row;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(3, _c0, row_r5.active, !row_r5.active));
    \u0275\u0275advance();
    \u0275\u0275property("name", row_r5.active ? "cil-check-circle" : "cil-x-circle");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r5.active ? "Active" : "Inactive", " ");
  }
}
function AdminUsersComponent_div_65_ng_template_7_div_6_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 110);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 104);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r8 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", team_r8.name, " ");
  }
}
function AdminUsersComponent_div_65_ng_template_7_div_6_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 87);
    \u0275\u0275text(1, " No teams assigned ");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent_div_65_ng_template_7_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 107);
    \u0275\u0275template(1, AdminUsersComponent_div_65_ng_template_7_div_6_div_1_Template, 3, 1, "div", 108)(2, AdminUsersComponent_div_65_ng_template_7_div_6_div_2_Template, 2, 0, "div", 109);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r7 = \u0275\u0275nextContext().row;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", row_r7.teams);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r7.teams.length === 0);
  }
}
function AdminUsersComponent_div_65_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 103);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 104);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "button", 105);
    \u0275\u0275listener("click", function AdminUsersComponent_div_65_ng_template_7_Template_button_click_4_listener() {
      const row_r7 = \u0275\u0275restoreView(_r6).row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleTeamsView(row_r7));
    });
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, AdminUsersComponent_div_65_ng_template_7_div_6_Template, 3, 2, "div", 106);
  }
  if (rf & 2) {
    const row_r7 = ctx.row;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", row_r7.teams.length, " ", row_r7.teams.length === 1 ? "Team" : "Teams", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r7.showTeams ? "Hide" : "View", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r7.showTeams);
  }
}
function AdminUsersComponent_div_65_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 111)(1, "button", 112);
    \u0275\u0275listener("click", function AdminUsersComponent_div_65_ng_template_9_Template_button_click_1_listener() {
      const row_r10 = \u0275\u0275restoreView(_r9).row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openRoleModal(row_r10));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 113);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "button", 114);
    \u0275\u0275listener("click", function AdminUsersComponent_div_65_ng_template_9_Template_button_click_3_listener() {
      const row_r10 = \u0275\u0275restoreView(_r9).row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openTeamModal(row_r10));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(4, "svg", 115);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "button", 116);
    \u0275\u0275listener("click", function AdminUsersComponent_div_65_ng_template_9_Template_button_click_5_listener() {
      const row_r10 = \u0275\u0275restoreView(_r9).row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openChangePasswordModal(row_r10));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(6, "svg", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(7, "button", 117);
    \u0275\u0275listener("click", function AdminUsersComponent_div_65_ng_template_9_Template_button_click_7_listener() {
      const row_r10 = \u0275\u0275restoreView(_r9).row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(row_r10.active ? ctx_r1.deactivateUser(row_r10) : ctx_r1.activate(row_r10));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(8, "svg", 118);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r10 = ctx.row;
    \u0275\u0275advance(7);
    \u0275\u0275property("color", row_r10.active ? "warning" : "success")("title", row_r10.active ? "Deactivate User" : "Activate User");
    \u0275\u0275advance();
    \u0275\u0275property("name", row_r10.active ? "cil-trash" : "cil-loop-circular");
  }
}
function AdminUsersComponent_div_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 89)(1, "ngx-datatable", 90)(2, "ngx-datatable-column", 91);
    \u0275\u0275template(3, AdminUsersComponent_div_65_ng_template_3_Template, 10, 4, "ng-template", 92);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ngx-datatable-column", 93);
    \u0275\u0275template(5, AdminUsersComponent_div_65_ng_template_5_Template, 3, 6, "ng-template", 92);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "ngx-datatable-column", 94);
    \u0275\u0275template(7, AdminUsersComponent_div_65_ng_template_7_Template, 7, 4, "ng-template", 92);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "ngx-datatable-column", 95);
    \u0275\u0275template(9, AdminUsersComponent_div_65_ng_template_9_Template, 9, 3, "ng-template", 92);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("rows", ctx_r1.filteredUsers)("columnMode", "force")("footerHeight", 50)("headerHeight", 60)("rowHeight", "auto")("limit", 10);
    \u0275\u0275advance();
    \u0275\u0275property("width", 250);
    \u0275\u0275advance(2);
    \u0275\u0275property("width", 100);
    \u0275\u0275advance(2);
    \u0275\u0275property("width", 180);
    \u0275\u0275advance(2);
    \u0275\u0275property("width", 180);
  }
}
function AdminUsersComponent_div_80_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119);
    \u0275\u0275text(1, " Username is required ");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent_div_85_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119);
    \u0275\u0275text(1, " Password is required ");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent_div_101_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119);
    \u0275\u0275text(1, " Please select a role ");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent_div_109_li_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 124);
    \u0275\u0275listener("click", function AdminUsersComponent_div_109_li_2_Template_li_click_0_listener() {
      const team_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addTeamToAddUserForm(team_r12));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 104);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r12 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", team_r12.name, " ");
  }
}
function AdminUsersComponent_div_109_li_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 125);
    \u0275\u0275text(1, " No matching teams found ");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent_div_109_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 120)(1, "ul", 121);
    \u0275\u0275template(2, AdminUsersComponent_div_109_li_2_Template, 3, 1, "li", 122)(3, AdminUsersComponent_div_109_li_3_Template, 2, 0, "li", 123);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const teams_r13 = ctx.ngIf;
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", teams_r13);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", teams_r13.length === 0);
  }
}
function AdminUsersComponent_div_114_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 126);
    \u0275\u0275text(1, " No teams selected ");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent_div_116_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 127)(1, "span", 128);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 129);
    \u0275\u0275listener("click", function AdminUsersComponent_div_116_Template_button_click_3_listener() {
      const teamId_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.removeTeamFromAddUserForm(teamId_r15));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const teamId_r15 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getTeamNameById(teamId_r15));
  }
}
function AdminUsersComponent_div_128_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 130)(1, "div", 10)(2, "div", 131)(3, "span", 97);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 13)(6, "div", 98);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 132);
    \u0275\u0275text(9, "Current Role: ");
    \u0275\u0275elementStart(10, "span", 100);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.getUserInitials(ctx_r1.selectedUser.username));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.selectedUser.username);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", ctx_r1.getRoleBadgeClass(ctx_r1.selectedUser.role));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatRoleDisplay(ctx_r1.selectedUser.role), " ");
  }
}
function AdminUsersComponent_div_145_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119);
    \u0275\u0275text(1, " Please select a role ");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent_div_157_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 130)(1, "div", 10)(2, "div", 131)(3, "span", 97);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 13)(6, "div", 98);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 133);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(9, "svg", 134);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.getUserInitials(ctx_r1.selectedUser.username));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.selectedUser.username);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", ctx_r1.selectedUser.teams.length, " ", ctx_r1.selectedUser.teams.length === 1 ? "Team" : "Teams", " assigned ");
  }
}
function AdminUsersComponent_div_166_li_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 124);
    \u0275\u0275listener("click", function AdminUsersComponent_div_166_li_2_Template_li_click_0_listener() {
      const team_r17 = \u0275\u0275restoreView(_r16).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addTeamToForm(team_r17));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 104);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r17 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", team_r17.name, " ");
  }
}
function AdminUsersComponent_div_166_li_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 125);
    \u0275\u0275text(1, " No matching teams found ");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent_div_166_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 120)(1, "ul", 121);
    \u0275\u0275template(2, AdminUsersComponent_div_166_li_2_Template, 3, 1, "li", 122)(3, AdminUsersComponent_div_166_li_3_Template, 2, 0, "li", 123);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const teams_r18 = ctx.ngIf;
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", teams_r18);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", teams_r18.length === 0);
  }
}
function AdminUsersComponent_div_171_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 126);
    \u0275\u0275text(1, " No teams selected ");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent_div_173_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 127)(1, "span", 128);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 129);
    \u0275\u0275listener("click", function AdminUsersComponent_div_173_Template_button_click_3_listener() {
      const teamId_r20 = \u0275\u0275restoreView(_r19).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.removeTeamFromForm(teamId_r20));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const teamId_r20 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getTeamNameById(teamId_r20));
  }
}
function AdminUsersComponent_div_185_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 130)(1, "div", 10)(2, "div", 131)(3, "span", 97);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 13)(6, "div", 98);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.getUserInitials(ctx_r1.selectedUser.username));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.selectedUser.username);
  }
}
function AdminUsersComponent_div_194_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119);
    \u0275\u0275text(1, " Password is required ");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent_div_199_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119);
    \u0275\u0275text(1, " Passwords do not match ");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersComponent__svg_svg_208_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 135);
  }
}
function AdminUsersComponent__svg_svg_209_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 136);
  }
}
function AdminUsersComponent__svg_svg_210_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 137);
  }
}
var AdminUsersComponent = class _AdminUsersComponent {
  constructor(iconSet, fb, router, authService, userService, teamService) {
    this.iconSet = iconSet;
    this.fb = fb;
    this.router = router;
    this.authService = authService;
    this.userService = userService;
    this.teamService = teamService;
    this.users = [];
    this.teams = [];
    this.searchTerm = "";
    this.filteredUsers = [];
    this.visibleAddNewUser = false;
    this.visibleRoleModal = false;
    this.visibleTeamModal = false;
    this.visibleChangePassword = false;
    this.selectedUserId = null;
    this.selectedUser = null;
    this.passwordMismatch = false;
    this.addNewUserForm = this.fb.group({
      username: ["", Validators.required],
      role: ["", Validators.required],
      password: ["", Validators.required],
      teams: [[]],
      teamInput: new FormControl()
    });
    this.changeRoleForm = this.fb.group({
      role: ["", Validators.required]
    });
    this.changeTeamForm = this.fb.group({
      teams: [[]],
      teamInput: new FormControl()
    });
    this.changePasswordForm = this.fb.group({
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required]
    });
    this.position = "top-end";
    this.visible = false;
    this.percentage = 0;
    this.toastMessage = "";
    this.toastStatus = "";
    iconSet.icons = __spreadValues(__spreadValues({}, free_exports), iconSet);
  }
  ngOnInit() {
    this.authService.hcAdmin().subscribe({
      next: () => {
        this.loadUsers();
        this.loadTeams();
      },
      error: () => {
        this.router.navigate(["/login"]);
      }
    });
    this.addNewUserForm.controls.teamInput.valueChanges.pipe(startWith(""), map((value) => this._filterTeams(value))).subscribe((filteredTeams) => {
      this.filteredTeams = of(filteredTeams);
    });
    this.changeTeamForm.controls.teamInput.valueChanges.pipe(startWith(""), map((value) => this._filterTeams(value))).subscribe((filteredTeams) => {
      this.filteredTeams = of(filteredTeams);
    });
    this.changePasswordForm.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
  }
  loadTeams() {
    this.teamService.get().subscribe({
      next: (response) => {
        this.teams = response;
        this.refreshFilteredTeams();
      },
      error: (error) => {
        this.showToast("danger", "Error loading teams. Please try again.");
      }
    });
  }
  loadUsers() {
    this.userService.get().subscribe({
      next: (response) => {
        this.users = response.map((user) => __spreadProps(__spreadValues({}, user), {
          showTeams: false
        }));
        this.filteredUsers = [...this.users];
      },
      error: (error) => {
        this.showToast("danger", "Error loading users. Please try again.");
      }
    });
  }
  refreshFilteredTeams() {
    const teamInputValue = this.addNewUserForm.controls.teamInput.value || "";
    const teamInputValueForChange = this.changeTeamForm.controls.teamInput.value || "";
    this.addNewUserForm.controls.teamInput.setValue(teamInputValue, { emitEvent: true });
    this.changeTeamForm.controls.teamInput.setValue(teamInputValueForChange, { emitEvent: true });
  }
  _filterTeams(value) {
    const filterValue = value?.toLowerCase() || "";
    return this.teams.filter((team) => team.name.toLowerCase().includes(filterValue));
  }
  // Helper method to get user initials for avatar
  getUserInitials(username) {
    if (!username)
      return "";
    const words = username.split(" ");
    if (words.length === 1) {
      return username.length > 1 ? username.substring(0, 2).toUpperCase() : username.toUpperCase();
    } else {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
  }
  // Helper to get appropriate badge class for role
  getRoleBadgeClass(role) {
    switch (role) {
      case "ADMIN":
        return "badge-admin";
      case "TEAM_MANAGER":
        return "badge-team-manager";
      default:
        return "badge-user";
    }
  }
  // Format role display
  formatRoleDisplay(role) {
    switch (role) {
      case "ADMIN":
        return "Admin";
      case "TEAM_MANAGER":
        return "Team Manager";
      default:
        return "User";
    }
  }
  // Toggle user teams visibility
  toggleTeamsView(user) {
    user.showTeams = !user.showTeams;
  }
  // We no longer need the toggle action menu function with the new icon-based approach
  // Get counts for dashboard cards
  getCountByRole(role) {
    return this.users.filter((user) => user.role === role).length;
  }
  getActiveUsersCount() {
    return this.users.filter((user) => user.active).length;
  }
  openAddNewUserModal() {
    this.addNewUserForm.reset({
      username: "",
      role: "",
      password: "",
      teams: [],
      teamInput: ""
    });
    this.visibleAddNewUser = true;
  }
  openRoleModal(row) {
    this.selectedUserId = row.id;
    this.selectedUser = row;
    this.changeRoleForm.patchValue({
      role: row.role
    });
    this.visibleRoleModal = true;
  }
  openTeamModal(row) {
    this.selectedUserId = row.id;
    this.selectedUser = row;
    this.changeTeamForm.patchValue({
      teams: row.teams.map((team) => team.id)
    });
    this.visibleTeamModal = true;
  }
  openChangePasswordModal(row) {
    this.selectedUserId = row.id;
    this.selectedUser = row;
    this.changePasswordForm.reset();
    this.passwordMismatch = false;
    this.visibleChangePassword = true;
  }
  closeModal() {
    this.visibleAddNewUser = false;
    this.visibleRoleModal = false;
    this.visibleTeamModal = false;
    this.visibleChangePassword = false;
    this.selectedUserId = null;
    this.selectedUser = null;
    this.passwordMismatch = false;
  }
  onSubmitAddNewUser() {
    if (this.addNewUserForm.valid) {
      const user = {
        username: this.addNewUserForm.value.username || "",
        password: this.addNewUserForm.value.password || "",
        role: this.addNewUserForm.value.role || "",
        teams: this.addNewUserForm.value.teams || []
      };
      this.userService.create(user).subscribe({
        next: (response) => {
          this.showToast("success", "User created successfully");
          this.loadUsers();
          this.closeModal();
        },
        error: (error) => {
          this.showToast("danger", "Error creating user: Username must be unique. Please try a different username.");
        }
      });
    }
  }
  onSubmitChangeRole() {
    if (this.changeRoleForm.valid && this.selectedUserId !== null) {
      const user = this.users.find((user2) => user2.id === this.selectedUserId);
      if (user) {
        this.userService.changeRole({ role: this.changeRoleForm.value.role || "" }, this.selectedUserId).subscribe({
          next: (response) => {
            this.showToast("success", `User role changed to ${this.formatRoleDisplay(this.changeRoleForm.value.role || "")}`);
            this.loadUsers();
            this.closeModal();
          },
          error: (error) => {
            this.showToast("danger", "Error changing user role. Please try again.");
          }
        });
      }
    }
  }
  onSubmitTeamChange() {
    if (this.selectedUserId !== null) {
      const user = this.users.find((user2) => user2.id === this.selectedUserId);
      if (user) {
        this.userService.changeTeam({ teams: this.changeTeamForm.value.teams || [] }, this.selectedUserId).subscribe({
          next: (response) => {
            this.showToast("success", "User teams updated successfully");
            this.loadUsers();
            this.closeModal();
          },
          error: (error) => {
            this.showToast("danger", "Error updating user teams. Please try again.");
          }
        });
      }
    }
  }
  // Check if passwords match
  checkPasswordMatch() {
    const password = this.changePasswordForm.get("password")?.value;
    const confirmPassword = this.changePasswordForm.get("confirmPassword")?.value;
    if (password && confirmPassword) {
      this.passwordMismatch = password !== confirmPassword;
    } else {
      this.passwordMismatch = false;
    }
  }
  onSubmitChangePassword() {
    if (this.changePasswordForm.valid && this.selectedUserId !== null && !this.passwordMismatch) {
      this.userService.changePassword({ password: this.changePasswordForm.value.password || "" }, this.selectedUserId).subscribe({
        next: (response) => {
          this.showToast("success", "User password changed successfully");
          this.closeModal();
        },
        error: (error) => {
          this.showToast("danger", "Error changing user password. Please try again.");
        }
      });
    }
  }
  addTeamToForm(team) {
    const currentTeams = this.changeTeamForm.value.teams || [];
    if (!currentTeams.includes(team.id)) {
      this.changeTeamForm.patchValue({
        teams: [...currentTeams, team.id]
      });
    }
  }
  addTeamToAddUserForm(team) {
    const currentTeams = this.addNewUserForm.value.teams || [];
    if (!currentTeams.includes(team.id)) {
      this.addNewUserForm.patchValue({
        teams: [...currentTeams, team.id]
      });
    }
  }
  removeTeamFromForm(teamId) {
    const currentTeams = this.changeTeamForm.value.teams || [];
    this.changeTeamForm.patchValue({
      teams: currentTeams.filter((id) => id !== teamId)
    });
  }
  removeTeamFromAddUserForm(teamId) {
    const currentTeams = this.addNewUserForm.value.teams || [];
    this.addNewUserForm.patchValue({
      teams: currentTeams.filter((id) => id !== teamId)
    });
  }
  deactivateUser(row) {
    if (confirm(`Are you sure you want to deactivate user "${row.username}"?`)) {
      this.userService.deactivate(row.id).subscribe({
        next: (response) => {
          this.showToast("success", "User deactivated successfully");
          this.loadUsers();
        },
        error: (error) => {
          this.showToast("danger", "Error deactivating user. Please try again.");
        }
      });
    }
  }
  activate(row) {
    this.userService.activate(row.id).subscribe({
      next: (response) => {
        this.showToast("success", "User activated successfully");
        this.loadUsers();
      },
      error: (error) => {
        this.showToast("danger", "Error activating user. Please try again.");
      }
    });
  }
  getTeamNameById(teamId) {
    const team = this.teams.find((t) => t.id === teamId);
    return team ? team.name : "";
  }
  showToast(status, message) {
    this.toastStatus = status;
    this.toastMessage = message;
    this.visible = true;
  }
  toggleToast() {
    this.visible = !this.visible;
  }
  onVisibleChange($event) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }
  // Search functionality
  onSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm = searchTerm;
    if (!searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }
    this.filteredUsers = this.users.filter((user) => {
      return user.username.toLowerCase().includes(searchTerm) || this.formatRoleDisplay(user.role).toLowerCase().includes(searchTerm) || user.teams.some((team) => team.name.toLowerCase().includes(searchTerm)) || searchTerm === "active" && user.active || searchTerm === "inactive" && !user.active;
    });
  }
  clearSearch() {
    this.searchTerm = "";
    this.filteredUsers = [...this.users];
  }
  static {
    this.\u0275fac = function AdminUsersComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AdminUsersComponent)(\u0275\u0275directiveInject(IconSetService), \u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(UserService), \u0275\u0275directiveInject(TeamService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminUsersComponent, selectors: [["app-admin-users"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 218, vars: 47, consts: [[1, "dashboard-container"], ["xs", "12"], [1, "header-container", "mb-4"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "page-title"], ["color", "primary", "cButton", "", 1, "btn-with-icon", 3, "click"], ["cIcon", "", "name", "cil-user-plus"], [1, "mb-4"], ["sm", "6", "lg", "3"], [1, "stat-card", "mb-4"], [1, "d-flex", "align-items-center"], [1, "stat-icon-container"], ["cIcon", "", "name", "cil-user", 1, "stat-icon"], [1, "ms-3"], [1, "stat-label"], [1, "stat-value"], [1, "stat-icon-container", "accent-blue"], ["cIcon", "", "name", "cil-shield-alt", 1, "stat-icon"], [1, "stat-icon-container", "accent-green"], ["cIcon", "", "name", "cil-people", 1, "stat-icon"], [1, "stat-icon-container", "accent-purple"], ["cIcon", "", "name", "cil-check-circle", 1, "stat-icon"], ["xs", ""], [1, "main-card"], [1, "mb-0"], [1, "search-container"], ["cInputGroupText", "", 1, "search-icon-container"], ["cIcon", "", "name", "cil-search"], ["type", "text", "cFormControl", "", "placeholder", "Search by name, role, team...", 1, "form-control", "search-input", 3, "input", "value"], ["cButton", "", "color", "secondary", "variant", "ghost", "class", "search-clear-btn", 3, "click", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "table-responsive", 4, "ngIf"], ["size", "lg", "id", "addNewUserModal", "alignment", "center", 3, "visibleChange", "visible"], ["cModalTitle", ""], ["cIcon", "", "name", "cil-user-plus", 1, "me-2"], [1, "modal-form", 3, "formGroup"], [1, "form-section"], [1, "section-title"], [1, "mb-3"], ["cInputGroupText", "", 1, "input-icon"], ["cIcon", "", "name", "cil-user"], ["type", "text", "id", "username", "formControlName", "username", "placeholder", "Username", 1, "form-control"], ["class", "invalid-feedback d-block", 4, "ngIf"], ["cIcon", "", "name", "cil-lock-locked"], ["type", "password", "id", "passwordAdded", "formControlName", "password", "placeholder", "Password", 1, "form-control"], [1, "form-section", "mt-4"], ["cIcon", "", "name", "cil-people"], ["id", "roleAdded", "formControlName", "role", 1, "form-select", "custom-select"], ["value", "", "disabled", ""], ["value", "USER"], ["value", "ADMIN"], ["value", "TEAM_MANAGER"], ["cIcon", "", "name", "cil-group"], ["type", "text", "id", "teamInputAdded", "formControlName", "teamInput", "placeholder", "Search teams by name...", 1, "form-control"], ["class", "teams-dropdown", 4, "ngIf"], [1, "selected-teams"], [1, "selected-title"], ["class", "text-muted no-teams-message", 4, "ngIf"], [1, "teams-badges"], ["class", "team-badge", 4, "ngFor", "ngForOf"], ["cButton", "", "color", "secondary", "variant", "ghost", 3, "click"], ["cButton", "", "color", "primary", 3, "click", "disabled"], ["size", "sm", "id", "changeRoleModal", "alignment", "center", 3, "visibleChange", "visible"], ["cIcon", "", "name", "cil-transfer", 1, "me-2"], ["class", "selected-user-info mb-4", 4, "ngIf"], [3, "formGroup"], ["id", "role", "formControlName", "role", 1, "form-select", "custom-select"], ["size", "lg", "id", "changeTeamModal", "alignment", "center", 3, "visibleChange", "visible"], ["cIcon", "", "name", "cil-vector", 1, "me-2"], ["type", "text", "id", "teamInput", "formControlName", "teamInput", "placeholder", "Search teams by name...", 1, "form-control"], ["cButton", "", "color", "primary", 3, "click"], ["size", "sm", "id", "changePasswordModal", "alignment", "center", 3, "visibleChange", "visible"], ["cIcon", "", "name", "cil-lock-locked", 1, "me-2"], ["type", "password", "id", "password", "formControlName", "password", "placeholder", "New Password", 1, "form-control"], ["cIcon", "", "name", "cil-check-circle"], ["type", "password", "id", "confirmPassword", "formControlName", "confirmPassword", "placeholder", "Confirm New Password", 1, "form-control"], ["position", "fixed", 1, "p-3", 3, "placement"], [1, "toast-notification", 3, "visibleChange", "color", "visible", "autohide", "delay"], ["cIcon", "", "name", "cil-check", "class", "me-2 toast-icon success", 4, "ngIf"], ["cIcon", "", "name", "cil-warning", "class", "me-2 toast-icon danger", 4, "ngIf"], ["cIcon", "", "name", "cil-info", "class", "me-2 toast-icon info", 4, "ngIf"], [1, "me-auto"], ["cButton", "", "color", "secondary", "variant", "ghost", 1, "search-clear-btn", 3, "click"], ["cIcon", "", "name", "cil-x"], [1, "empty-state"], ["cIcon", "", "name", "cil-user", 1, "empty-icon"], [1, "mt-3"], [1, "text-muted"], ["color", "primary", "cButton", "", 1, "btn-with-icon", "mt-2", 3, "click"], [1, "table-responsive"], [1, "bootstrap", "users-table", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit"], ["name", "User", 3, "width"], ["ngx-datatable-cell-template", ""], ["name", "Status", 3, "width"], ["name", "Teams", 3, "width"], ["name", "Actions", 3, "width"], [1, "user-avatar"], [1, "avatar-text"], [1, "user-name"], [1, "user-role"], [1, "badge", 3, "ngClass"], [1, "status-badge", 3, "ngClass"], ["cIcon", "", 1, "status-icon", 3, "name"], [1, "teams-count"], ["cIcon", "", "name", "cil-group", 1, "me-2", "small-icon"], ["cButton", "", "color", "primary", "variant", "ghost", "size", "sm", 1, "ms-2", "view-teams-btn", 3, "click"], ["class", "mt-3 teams-list", 4, "ngIf"], [1, "mt-3", "teams-list"], ["class", "team-item", 4, "ngFor", "ngForOf"], ["class", "text-muted", 4, "ngIf"], [1, "team-item"], [1, "d-flex", "gap-2", "action-buttons"], ["type", "button", "cButton", "", "color", "primary", "variant", "ghost", "size", "sm", "title", "Change Role", 1, "action-btn", 3, "click"], ["cIcon", "", "name", "cil-transfer"], ["type", "button", "cButton", "", "color", "primary", "variant", "ghost", "size", "sm", "title", "Manage Teams", 1, "action-btn", 3, "click"], ["cIcon", "", "name", "cil-vector"], ["type", "button", "cButton", "", "color", "primary", "variant", "ghost", "size", "sm", "title", "Change Password", 1, "action-btn", 3, "click"], ["type", "button", "cButton", "", "variant", "ghost", "size", "sm", 1, "action-btn", 3, "click", "color", "title"], ["cIcon", "", 3, "name"], [1, "invalid-feedback", "d-block"], [1, "teams-dropdown"], [1, "teams-list"], ["class", "team-item dropdown-item", 3, "click", 4, "ngFor", "ngForOf"], ["class", "no-results", 4, "ngIf"], [1, "team-item", "dropdown-item", 3, "click"], [1, "no-results"], [1, "text-muted", "no-teams-message"], [1, "team-badge"], [1, "team-name"], ["type", "button", "aria-label", "Remove team", 1, "btn-close", "btn-close-white", 3, "click"], [1, "selected-user-info", "mb-4"], [1, "user-avatar", "smaller"], [1, "user-current-role"], [1, "user-teams-count"], ["cIcon", "", "name", "cil-group", 1, "me-1", "small-icon"], ["cIcon", "", "name", "cil-check", 1, "me-2", "toast-icon", "success"], ["cIcon", "", "name", "cil-warning", 1, "me-2", "toast-icon", "danger"], ["cIcon", "", "name", "cil-info", 1, "me-2", "toast-icon", "info"]], template: function AdminUsersComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "c-row")(2, "c-col", 1)(3, "div", 2)(4, "div", 3)(5, "h1", 4);
        \u0275\u0275text(6, "User Management");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "button", 5);
        \u0275\u0275listener("click", function AdminUsersComponent_Template_button_click_7_listener() {
          return ctx.openAddNewUserModal();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(8, "svg", 6);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(9, "span");
        \u0275\u0275text(10, "Add New User");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(11, "c-row", 7)(12, "c-col", 8)(13, "c-card", 9)(14, "c-card-body", 10)(15, "div", 11);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(16, "svg", 12);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(17, "div", 13)(18, "div", 14);
        \u0275\u0275text(19, "Total Users");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "div", 15);
        \u0275\u0275text(21);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(22, "c-col", 8)(23, "c-card", 9)(24, "c-card-body", 10)(25, "div", 16);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(26, "svg", 17);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(27, "div", 13)(28, "div", 14);
        \u0275\u0275text(29, "Admins");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(30, "div", 15);
        \u0275\u0275text(31);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(32, "c-col", 8)(33, "c-card", 9)(34, "c-card-body", 10)(35, "div", 18);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(36, "svg", 19);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(37, "div", 13)(38, "div", 14);
        \u0275\u0275text(39, "Team Managers");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "div", 15);
        \u0275\u0275text(41);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(42, "c-col", 8)(43, "c-card", 9)(44, "c-card-body", 10)(45, "div", 20);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(46, "svg", 21);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(47, "div", 13)(48, "div", 14);
        \u0275\u0275text(49, "Active Users");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(50, "div", 15);
        \u0275\u0275text(51);
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(52, "c-row")(53, "c-col", 22)(54, "c-card", 23)(55, "c-card-header", 3)(56, "h5", 24);
        \u0275\u0275text(57, "Users Overview");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(58, "c-input-group", 25)(59, "span", 26);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(60, "svg", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(61, "input", 28);
        \u0275\u0275listener("input", function AdminUsersComponent_Template_input_input_61_listener($event) {
          return ctx.onSearch($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275template(62, AdminUsersComponent_button_62_Template, 2, 0, "button", 29);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(63, "c-card-body");
        \u0275\u0275template(64, AdminUsersComponent_div_64_Template, 10, 1, "div", 30)(65, AdminUsersComponent_div_65_Template, 10, 10, "div", 31);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(66, "c-modal", 32);
        \u0275\u0275listener("visibleChange", function AdminUsersComponent_Template_c_modal_visibleChange_66_listener($event) {
          return ctx.visibleAddNewUser = $event;
        });
        \u0275\u0275elementStart(67, "c-modal-header")(68, "h5", 33);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(69, "svg", 34);
        \u0275\u0275text(70, " Add New User ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(71, "c-modal-body")(72, "form", 35)(73, "div", 36)(74, "h6", 37);
        \u0275\u0275text(75, "User Information");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(76, "c-input-group", 38)(77, "span", 39);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(78, "svg", 40);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(79, "input", 41);
        \u0275\u0275elementEnd();
        \u0275\u0275template(80, AdminUsersComponent_div_80_Template, 2, 0, "div", 42);
        \u0275\u0275elementStart(81, "c-input-group", 38)(82, "span", 39);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(83, "svg", 43);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(84, "input", 44);
        \u0275\u0275elementEnd();
        \u0275\u0275template(85, AdminUsersComponent_div_85_Template, 2, 0, "div", 42);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(86, "div", 45)(87, "h6", 37);
        \u0275\u0275text(88, "Role Assignment");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(89, "c-input-group", 38)(90, "span", 39);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(91, "svg", 46);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(92, "select", 47)(93, "option", 48);
        \u0275\u0275text(94, "Select Role");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(95, "option", 49);
        \u0275\u0275text(96, "User");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(97, "option", 50);
        \u0275\u0275text(98, "Admin");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(99, "option", 51);
        \u0275\u0275text(100, "Team Manager");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(101, AdminUsersComponent_div_101_Template, 2, 0, "div", 42);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(102, "div", 45)(103, "h6", 37);
        \u0275\u0275text(104, "Team Assignment");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(105, "c-input-group", 38)(106, "span", 39);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(107, "svg", 52);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(108, "input", 53);
        \u0275\u0275elementEnd();
        \u0275\u0275template(109, AdminUsersComponent_div_109_Template, 4, 2, "div", 54);
        \u0275\u0275pipe(110, "async");
        \u0275\u0275elementStart(111, "div", 55)(112, "h6", 56);
        \u0275\u0275text(113, "Selected Teams");
        \u0275\u0275elementEnd();
        \u0275\u0275template(114, AdminUsersComponent_div_114_Template, 2, 0, "div", 57);
        \u0275\u0275elementStart(115, "div", 58);
        \u0275\u0275template(116, AdminUsersComponent_div_116_Template, 4, 1, "div", 59);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(117, "c-modal-footer")(118, "button", 60);
        \u0275\u0275listener("click", function AdminUsersComponent_Template_button_click_118_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(119, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(120, "button", 61);
        \u0275\u0275listener("click", function AdminUsersComponent_Template_button_click_120_listener() {
          return ctx.onSubmitAddNewUser();
        });
        \u0275\u0275text(121, " Create User ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(122, "c-modal", 62);
        \u0275\u0275listener("visibleChange", function AdminUsersComponent_Template_c_modal_visibleChange_122_listener($event) {
          return ctx.visibleRoleModal = $event;
        });
        \u0275\u0275elementStart(123, "c-modal-header")(124, "h5", 33);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(125, "svg", 63);
        \u0275\u0275text(126, " Change User Role ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(127, "c-modal-body");
        \u0275\u0275template(128, AdminUsersComponent_div_128_Template, 12, 4, "div", 64);
        \u0275\u0275elementStart(129, "form", 65)(130, "div", 36)(131, "h6", 37);
        \u0275\u0275text(132, "Select New Role");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(133, "c-input-group")(134, "span", 39);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(135, "svg", 46);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(136, "select", 66)(137, "option", 48);
        \u0275\u0275text(138, "Select Role");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(139, "option", 49);
        \u0275\u0275text(140, "User");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(141, "option", 50);
        \u0275\u0275text(142, "Admin");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(143, "option", 51);
        \u0275\u0275text(144, "Team Manager");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(145, AdminUsersComponent_div_145_Template, 2, 0, "div", 42);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(146, "c-modal-footer")(147, "button", 60);
        \u0275\u0275listener("click", function AdminUsersComponent_Template_button_click_147_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(148, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(149, "button", 61);
        \u0275\u0275listener("click", function AdminUsersComponent_Template_button_click_149_listener() {
          return ctx.onSubmitChangeRole();
        });
        \u0275\u0275text(150, " Update Role ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(151, "c-modal", 67);
        \u0275\u0275listener("visibleChange", function AdminUsersComponent_Template_c_modal_visibleChange_151_listener($event) {
          return ctx.visibleTeamModal = $event;
        });
        \u0275\u0275elementStart(152, "c-modal-header")(153, "h5", 33);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(154, "svg", 68);
        \u0275\u0275text(155, " Manage User Teams ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(156, "c-modal-body");
        \u0275\u0275template(157, AdminUsersComponent_div_157_Template, 11, 4, "div", 64);
        \u0275\u0275elementStart(158, "form", 65)(159, "div", 36)(160, "h6", 37);
        \u0275\u0275text(161, "Assign Teams");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(162, "c-input-group", 38)(163, "span", 39);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(164, "svg", 52);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(165, "input", 69);
        \u0275\u0275elementEnd();
        \u0275\u0275template(166, AdminUsersComponent_div_166_Template, 4, 2, "div", 54);
        \u0275\u0275pipe(167, "async");
        \u0275\u0275elementStart(168, "div", 55)(169, "h6", 56);
        \u0275\u0275text(170, "Selected Teams");
        \u0275\u0275elementEnd();
        \u0275\u0275template(171, AdminUsersComponent_div_171_Template, 2, 0, "div", 57);
        \u0275\u0275elementStart(172, "div", 58);
        \u0275\u0275template(173, AdminUsersComponent_div_173_Template, 4, 1, "div", 59);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(174, "c-modal-footer")(175, "button", 60);
        \u0275\u0275listener("click", function AdminUsersComponent_Template_button_click_175_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(176, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(177, "button", 70);
        \u0275\u0275listener("click", function AdminUsersComponent_Template_button_click_177_listener() {
          return ctx.onSubmitTeamChange();
        });
        \u0275\u0275text(178, " Update Teams ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(179, "c-modal", 71);
        \u0275\u0275listener("visibleChange", function AdminUsersComponent_Template_c_modal_visibleChange_179_listener($event) {
          return ctx.visibleChangePassword = $event;
        });
        \u0275\u0275elementStart(180, "c-modal-header")(181, "h5", 33);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(182, "svg", 72);
        \u0275\u0275text(183, " Change User Password ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(184, "c-modal-body");
        \u0275\u0275template(185, AdminUsersComponent_div_185_Template, 8, 2, "div", 64);
        \u0275\u0275elementStart(186, "form", 65)(187, "div", 36)(188, "h6", 37);
        \u0275\u0275text(189, "Set New Password");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(190, "c-input-group", 38)(191, "span", 39);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(192, "svg", 43);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(193, "input", 73);
        \u0275\u0275elementEnd();
        \u0275\u0275template(194, AdminUsersComponent_div_194_Template, 2, 0, "div", 42);
        \u0275\u0275elementStart(195, "c-input-group")(196, "span", 39);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(197, "svg", 74);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(198, "input", 75);
        \u0275\u0275elementEnd();
        \u0275\u0275template(199, AdminUsersComponent_div_199_Template, 2, 0, "div", 42);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(200, "c-modal-footer")(201, "button", 60);
        \u0275\u0275listener("click", function AdminUsersComponent_Template_button_click_201_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(202, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(203, "button", 61);
        \u0275\u0275listener("click", function AdminUsersComponent_Template_button_click_203_listener() {
          return ctx.onSubmitChangePassword();
        });
        \u0275\u0275text(204, " Update Password ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(205, "c-toaster", 76)(206, "c-toast", 77);
        \u0275\u0275listener("visibleChange", function AdminUsersComponent_Template_c_toast_visibleChange_206_listener($event) {
          return ctx.onVisibleChange($event);
        });
        \u0275\u0275elementStart(207, "c-toast-header");
        \u0275\u0275template(208, AdminUsersComponent__svg_svg_208_Template, 1, 0, "svg", 78)(209, AdminUsersComponent__svg_svg_209_Template, 1, 0, "svg", 79)(210, AdminUsersComponent__svg_svg_210_Template, 1, 0, "svg", 80);
        \u0275\u0275elementStart(211, "strong", 81);
        \u0275\u0275text(212, "User Management");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(213, "small");
        \u0275\u0275text(214, "just now");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(215, "c-toast-body")(216, "p", 24);
        \u0275\u0275text(217);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        let tmp_10_0;
        let tmp_11_0;
        let tmp_12_0;
        let tmp_20_0;
        let tmp_31_0;
        \u0275\u0275advance(21);
        \u0275\u0275textInterpolate(ctx.users.length);
        \u0275\u0275advance(10);
        \u0275\u0275textInterpolate(ctx.getCountByRole("ADMIN"));
        \u0275\u0275advance(10);
        \u0275\u0275textInterpolate(ctx.getCountByRole("TEAM_MANAGER"));
        \u0275\u0275advance(10);
        \u0275\u0275textInterpolate(ctx.getActiveUsersCount());
        \u0275\u0275advance(10);
        \u0275\u0275property("value", ctx.searchTerm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.searchTerm);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.filteredUsers.length === 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.filteredUsers.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("visible", ctx.visibleAddNewUser);
        \u0275\u0275advance(6);
        \u0275\u0275property("formGroup", ctx.addNewUserForm);
        \u0275\u0275advance(8);
        \u0275\u0275property("ngIf", ((tmp_10_0 = ctx.addNewUserForm.get("username")) == null ? null : tmp_10_0.invalid) && ((tmp_10_0 = ctx.addNewUserForm.get("username")) == null ? null : tmp_10_0.touched));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ((tmp_11_0 = ctx.addNewUserForm.get("password")) == null ? null : tmp_11_0.invalid) && ((tmp_11_0 = ctx.addNewUserForm.get("password")) == null ? null : tmp_11_0.touched));
        \u0275\u0275advance(16);
        \u0275\u0275property("ngIf", ((tmp_12_0 = ctx.addNewUserForm.get("role")) == null ? null : tmp_12_0.invalid) && ((tmp_12_0 = ctx.addNewUserForm.get("role")) == null ? null : tmp_12_0.touched));
        \u0275\u0275advance(8);
        \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(110, 43, ctx.filteredTeams));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", (ctx.addNewUserForm.value.teams == null ? null : ctx.addNewUserForm.value.teams.length) === 0);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.addNewUserForm.value.teams);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.addNewUserForm.invalid);
        \u0275\u0275advance(2);
        \u0275\u0275property("visible", ctx.visibleRoleModal);
        \u0275\u0275advance(6);
        \u0275\u0275property("ngIf", ctx.selectedUser);
        \u0275\u0275advance();
        \u0275\u0275property("formGroup", ctx.changeRoleForm);
        \u0275\u0275advance(16);
        \u0275\u0275property("ngIf", ((tmp_20_0 = ctx.changeRoleForm.get("role")) == null ? null : tmp_20_0.invalid) && ((tmp_20_0 = ctx.changeRoleForm.get("role")) == null ? null : tmp_20_0.touched));
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.changeRoleForm.invalid);
        \u0275\u0275advance(2);
        \u0275\u0275property("visible", ctx.visibleTeamModal);
        \u0275\u0275advance(6);
        \u0275\u0275property("ngIf", ctx.selectedUser);
        \u0275\u0275advance();
        \u0275\u0275property("formGroup", ctx.changeTeamForm);
        \u0275\u0275advance(8);
        \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(167, 45, ctx.filteredTeams));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", (ctx.changeTeamForm.value.teams == null ? null : ctx.changeTeamForm.value.teams.length) === 0);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.changeTeamForm.value.teams);
        \u0275\u0275advance(6);
        \u0275\u0275property("visible", ctx.visibleChangePassword);
        \u0275\u0275advance(6);
        \u0275\u0275property("ngIf", ctx.selectedUser);
        \u0275\u0275advance();
        \u0275\u0275property("formGroup", ctx.changePasswordForm);
        \u0275\u0275advance(8);
        \u0275\u0275property("ngIf", ((tmp_31_0 = ctx.changePasswordForm.get("password")) == null ? null : tmp_31_0.invalid) && ((tmp_31_0 = ctx.changePasswordForm.get("password")) == null ? null : tmp_31_0.touched));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ctx.passwordMismatch);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.changePasswordForm.invalid || ctx.passwordMismatch);
        \u0275\u0275advance(2);
        \u0275\u0275property("placement", ctx.position);
        \u0275\u0275advance();
        \u0275\u0275property("color", ctx.toastStatus)("visible", ctx.visible)("autohide", true)("delay", 5e3);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.toastStatus === "success");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.toastStatus === "danger");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.toastStatus === "info");
        \u0275\u0275advance(7);
        \u0275\u0275textInterpolate(ctx.toastMessage);
      }
    }, dependencies: [
      RowComponent,
      ColComponent,
      CardComponent,
      CardBodyComponent,
      CardHeaderComponent,
      NgxDatatableModule,
      DatatableComponent,
      DataTableColumnDirective,
      DataTableColumnCellDirective,
      IconDirective,
      NgForOf,
      ModalComponent,
      ModalHeaderComponent,
      ModalTitleDirective,
      ModalBodyComponent,
      ModalFooterComponent,
      ButtonDirective,
      InputGroupComponent,
      FormsModule,
      \u0275NgNoValidate,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      ReactiveFormsModule,
      FormGroupDirective,
      FormControlName,
      CommonModule,
      NgClass,
      NgIf,
      AsyncPipe,
      InputGroupTextDirective,
      ToasterComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToastBodyComponent
    ], styles: ['\n\n[_ngcontent-%COMP%]:root {\n  --transition-speed: 0.3s;\n  --border-radius: 8px;\n  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  --hover-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);\n}\n.dashboard-container[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n@media (min-width: 768px) {\n  .dashboard-container[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n  }\n}\n.header-container[_ngcontent-%COMP%] {\n  padding-bottom: 1rem;\n}\n.page-title[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 600;\n  margin: 0;\n  color: var(--cui-body-color);\n}\n.btn-with-icon[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  font-weight: 500;\n  transition: all var(--transition-speed) ease;\n}\n.btn-with-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n.stat-card[_ngcontent-%COMP%] {\n  border-radius: var(--border-radius);\n  border: 1px solid var(--cui-card-border-color);\n  overflow: hidden;\n  transition: transform var(--transition-speed), box-shadow var(--transition-speed);\n  box-shadow: var(--card-shadow);\n}\n.stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: var(--hover-shadow);\n}\n.stat-icon-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  background-color: var(--cui-primary);\n  color: white;\n}\n.stat-icon-container.accent-blue[_ngcontent-%COMP%] {\n  background-color: var(--cui-info);\n}\n.stat-icon-container.accent-green[_ngcontent-%COMP%] {\n  background-color: var(--cui-success);\n}\n.stat-icon-container.accent-purple[_ngcontent-%COMP%] {\n  background-color: var(--cui-purple);\n}\n.stat-icon-container.accent-red[_ngcontent-%COMP%] {\n  background-color: var(--cui-danger);\n}\n.stat-icon[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n}\n.stat-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--cui-secondary-color);\n  margin-bottom: 0.25rem;\n}\n.stat-value[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 600;\n  color: var(--cui-body-color);\n}\n.main-card[_ngcontent-%COMP%] {\n  border-radius: var(--border-radius);\n  border: 1px solid var(--cui-card-border-color);\n  box-shadow: var(--card-shadow);\n  margin-bottom: 2rem;\n}\n.search-container[_ngcontent-%COMP%] {\n  max-width: 400px;\n  width: 100%;\n  margin-left: auto;\n}\n.search-icon-container[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--cui-secondary-color);\n  border-right: none;\n  padding-right: 0;\n}\n.search-input[_ngcontent-%COMP%] {\n  border-left: none;\n  padding-left: 0.5rem;\n  background-color: var(--cui-input-bg);\n  transition: all var(--transition-speed) ease;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  box-shadow: none;\n  border-color: var(--cui-input-border-color);\n}\n.search-clear-btn[_ngcontent-%COMP%] {\n  border: none;\n  background: transparent;\n  color: var(--cui-secondary-color);\n  transition: color var(--transition-speed) ease;\n}\n.search-clear-btn[_ngcontent-%COMP%]:hover {\n  color: var(--cui-danger);\n}\n.empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem 1rem;\n  text-align: center;\n}\n.empty-icon[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  color: var(--cui-secondary-color);\n  opacity: 0.5;\n}\n.users-table[_ngcontent-%COMP%] {\n  width: 100%;\n  background-color: var(--cui-card-bg);\n}\n.c-dark-theme[_nghost-%COMP%]   .users-table[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .users-table[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n}\n.user-avatar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background-color: var(--cui-primary);\n}\n.user-avatar.smaller[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n}\n.avatar-text[_ngcontent-%COMP%] {\n  color: white;\n  font-weight: 600;\n  font-size: 0.875rem;\n  text-transform: uppercase;\n}\n.smaller[_ngcontent-%COMP%]   .avatar-text[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n}\n.user-name[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--cui-body-color);\n}\n.user-role[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  margin-top: 0.25rem;\n}\n.small-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n}\n.badge[_ngcontent-%COMP%] {\n  padding: 0.35em 0.65em;\n  font-size: 0.75em;\n  font-weight: 500;\n  border-radius: 0.25rem;\n}\n.badge.badge-admin[_ngcontent-%COMP%] {\n  background-color: var(--cui-danger-subtle);\n  color: var(--cui-danger);\n}\n.badge.badge-team-manager[_ngcontent-%COMP%] {\n  background-color: var(--cui-info-subtle);\n  color: var(--cui-info);\n}\n.badge.badge-user[_ngcontent-%COMP%] {\n  background-color: var(--cui-primary-subtle);\n  color: var(--cui-primary);\n}\n.status-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  padding: 0.375rem 0.75rem;\n  border-radius: 1rem;\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n.status-badge.active[_ngcontent-%COMP%] {\n  background-color: var(--cui-success-subtle);\n  color: var(--cui-success);\n}\n.status-badge.inactive[_ngcontent-%COMP%] {\n  background-color: var(--cui-danger-subtle);\n  color: var(--cui-danger);\n}\n.status-badge[_ngcontent-%COMP%]   .status-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  margin-right: 0.375rem;\n}\n.teams-count[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--cui-secondary-color);\n  display: flex;\n  align-items: center;\n}\n.view-teams-btn[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  padding: 0.25rem 0.5rem;\n}\n.teams-list[_ngcontent-%COMP%] {\n  background-color: var(--cui-tertiary-bg);\n  border-radius: var(--border-radius);\n  padding: 0.75rem;\n  max-height: 150px;\n  overflow-y: auto;\n}\n.team-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0.375rem 0;\n  font-size: 0.875rem;\n  color: var(--cui-body-color);\n}\n.team-item[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid var(--cui-border-color);\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-start;\n  flex-wrap: nowrap;\n}\n.action-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border-radius: 6px;\n  transition: all var(--transition-speed) ease;\n  position: relative;\n}\n.action-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n.action-btn[_ngcontent-%COMP%]:hover {\n  background-color: var(--cui-tertiary-bg);\n  transform: translateY(-2px);\n  box-shadow: var(--card-shadow);\n}\n.action-btn[_ngcontent-%COMP%]:hover::after {\n  content: attr(title);\n  position: absolute;\n  bottom: -28px;\n  left: 50%;\n  transform: translateX(-50%);\n  background-color: var(--cui-dark);\n  color: white;\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.675rem;\n  white-space: nowrap;\n  z-index: 10;\n  box-shadow: var(--card-shadow);\n}\n.action-btn[color=success][_ngcontent-%COMP%] {\n  color: var(--cui-success);\n}\n.action-btn[color=success][_ngcontent-%COMP%]:hover {\n  background-color: var(--cui-success-subtle);\n}\n.action-btn[color=warning][_ngcontent-%COMP%] {\n  color: var(--cui-warning);\n}\n.action-btn[color=warning][_ngcontent-%COMP%]:hover {\n  background-color: var(--cui-warning-subtle);\n}\n.modal-form[_ngcontent-%COMP%] {\n  padding: 0.5rem;\n}\n.form-section[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.section-title[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n  font-weight: 600;\n  color: var(--cui-body-color);\n  position: relative;\n  display: inline-block;\n}\n.section-title[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: -5px;\n  left: 0;\n  width: 40px;\n  height: 3px;\n  background-color: var(--cui-primary);\n  border-radius: 2px;\n}\n.input-icon[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--cui-secondary-color);\n}\n.input-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n.custom-select[_ngcontent-%COMP%] {\n  appearance: auto;\n  background-color: var(--cui-input-bg);\n  color: var(--cui-body-color);\n  border-color: var(--cui-input-border-color);\n}\n.custom-select[_ngcontent-%COMP%]:focus {\n  border-color: var(--cui-primary);\n  box-shadow: 0 0 0 0.25rem rgba(var(--cui-primary-rgb), 0.25);\n}\n.invalid-feedback[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  margin-top: -0.5rem;\n  margin-bottom: 0.75rem;\n}\n.selected-user-info[_ngcontent-%COMP%] {\n  padding: 1rem;\n  background-color: var(--cui-tertiary-bg);\n  border-radius: var(--border-radius);\n  margin-bottom: 1.5rem;\n}\n.user-current-role[_ngcontent-%COMP%], \n.user-teams-count[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--cui-secondary-color);\n  margin-top: 0.25rem;\n  display: flex;\n  align-items: center;\n}\n.teams-dropdown[_ngcontent-%COMP%] {\n  max-height: 200px;\n  overflow-y: auto;\n  margin-bottom: 1.5rem;\n  border: 1px solid var(--cui-border-color);\n  border-radius: var(--border-radius);\n  background-color: var(--cui-card-bg);\n}\n.teams-list[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.team-item.dropdown-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0.75rem 1rem;\n  cursor: pointer;\n  transition: background-color var(--transition-speed) ease;\n}\n.team-item.dropdown-item[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid var(--cui-border-color);\n}\n.team-item.dropdown-item[_ngcontent-%COMP%]:hover {\n  background-color: var(--cui-tertiary-bg);\n}\n.no-results[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  text-align: center;\n  color: var(--cui-secondary-color);\n}\n.selected-teams[_ngcontent-%COMP%] {\n  padding: 1rem;\n  background-color: var(--cui-tertiary-bg);\n  border-radius: var(--border-radius);\n}\n.selected-title[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 600;\n  margin-bottom: 0.75rem;\n  color: var(--cui-body-color);\n}\n.no-teams-message[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  padding: 0.5rem 0;\n}\n.teams-badges[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.team-badge[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  background-color: var(--cui-primary);\n  color: white;\n  border-radius: 20px;\n  padding: 0.25rem 0.75rem;\n  font-size: 0.875rem;\n}\n.team-badge[_ngcontent-%COMP%]   .team-name[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n.team-badge[_ngcontent-%COMP%]   .btn-close[_ngcontent-%COMP%] {\n  width: 0.75rem;\n  height: 0.75rem;\n  margin-left: 0.25rem;\n}\n.team-badge[_ngcontent-%COMP%]   .btn-close[_ngcontent-%COMP%]:focus {\n  box-shadow: none;\n}\n.toast-notification[_ngcontent-%COMP%] {\n  min-width: 300px;\n  border-radius: var(--border-radius);\n}\n.toast-notification[_ngcontent-%COMP%]   .toast-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n}\n.toast-notification[_ngcontent-%COMP%]   .toast-icon.success[_ngcontent-%COMP%] {\n  color: var(--cui-success);\n}\n.toast-notification[_ngcontent-%COMP%]   .toast-icon.danger[_ngcontent-%COMP%] {\n  color: var(--cui-danger);\n}\n.toast-notification[_ngcontent-%COMP%]   .toast-icon.info[_ngcontent-%COMP%] {\n  color: var(--cui-info);\n}\n.c-dark-theme[_nghost-%COMP%]   .stat-card[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .stat-card[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .main-card[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .main-card[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .action-menu[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .action-menu[_ngcontent-%COMP%] {\n  background-color: var(--cui-card-bg);\n  border-color: var(--cui-card-border-color);\n}\n.c-dark-theme[_nghost-%COMP%]   .empty-icon[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .empty-icon[_ngcontent-%COMP%] {\n  color: var(--cui-secondary-color);\n}\n.c-dark-theme[_nghost-%COMP%]   .user-name[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .user-name[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .stat-value[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .stat-value[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .page-title[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .page-title[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .section-title[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n}\n.c-dark-theme[_nghost-%COMP%]   .teams-count[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .teams-count[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .stat-label[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  color: var(--cui-secondary-color);\n}\n.c-dark-theme[_nghost-%COMP%]   .search-input[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .search-input[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%] {\n  background-color: var(--cui-input-bg);\n  color: var(--cui-input-color);\n}\n.c-dark-theme[_nghost-%COMP%]   .selected-user-info[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .selected-user-info[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .selected-teams[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .selected-teams[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .teams-list[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .teams-list[_ngcontent-%COMP%] {\n  background-color: var(--cui-tertiary-bg);\n}\n.c-dark-theme[_nghost-%COMP%]   .users-table[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .users-table[_ngcontent-%COMP%] {\n  border-color: var(--cui-border-color);\n}\n.c-dark-theme[_nghost-%COMP%]   .users-table[_ngcontent-%COMP%]   .datatable-header[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .users-table[_ngcontent-%COMP%]   .datatable-header[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .users-table[_ngcontent-%COMP%]   .datatable-body-row[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .users-table[_ngcontent-%COMP%]   .datatable-body-row[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .users-table[_ngcontent-%COMP%]   .datatable-row-center[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .users-table[_ngcontent-%COMP%]   .datatable-row-center[_ngcontent-%COMP%] {\n  border-color: var(--cui-border-color);\n}\n/*# sourceMappingURL=admin-users.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminUsersComponent, { className: "AdminUsersComponent" });
})();

// src/app/views/admin-users/routes.ts
var routes = [
  {
    path: "",
    component: AdminUsersComponent,
    data: {
      title: "Admin User Management"
    }
  }
];
export {
  routes
};
//# sourceMappingURL=routes-446B4FZT.js.map
