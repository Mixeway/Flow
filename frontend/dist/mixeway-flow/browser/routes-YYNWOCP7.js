import {
  UserService
} from "./chunk-RX57R3D6.js";
import {
  SettingsService
} from "./chunk-T5O4OQUQ.js";
import {
  JiraService
} from "./chunk-45TX6GGP.js";
import {
  CloudSubscriptionService
} from "./chunk-WQBYKFMD.js";
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
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
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
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  IconDirective,
  IconSetService,
  InputGroupComponent,
  InputGroupTextDirective,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZG2BHLTP.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/views/manage-teams/manage-teams.component.ts
function ManageTeamsComponent_div_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 109);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 110);
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_div_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 111);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 112);
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_button_67_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 113);
    \u0275\u0275listener("click", function ManageTeamsComponent_button_67_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearSearch());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 114);
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_div_69_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 115);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 116);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "h4", 117);
    \u0275\u0275text(3, "No teams found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 86);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 118);
    \u0275\u0275listener("click", function ManageTeamsComponent_div_69_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openAddTeamModal());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(7, "svg", 7);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "Create Team");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.searchTerm ? "Try adjusting your search term or" : "Get started by", " creating a new team ");
  }
}
function ManageTeamsComponent_div_70_ng_template_3_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 131);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r4 = \u0275\u0275nextContext().row;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("ID: ", row_r4.remoteIdentifier, "");
  }
}
function ManageTeamsComponent_div_70_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 127)(2, "span", 128);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 16)(5, "div", 129);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, ManageTeamsComponent_div_70_ng_template_3_div_7_Template, 2, 1, "div", 130);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r4 = ctx.row;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.getTeamInitials(row_r4.name));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(row_r4.name);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r4.remoteIdentifier);
  }
}
function ManageTeamsComponent_div_70_ng_template_5_div_6_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 138);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 133);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r7 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", user_r7.username, " ");
  }
}
function ManageTeamsComponent_div_70_ng_template_5_div_6_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 86);
    \u0275\u0275text(1, " No members in this team ");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_div_70_ng_template_5_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 136);
    \u0275\u0275template(1, ManageTeamsComponent_div_70_ng_template_5_div_6_div_1_Template, 3, 1, "div", 137)(2, ManageTeamsComponent_div_70_ng_template_5_div_6_div_2_Template, 2, 0, "div", 81);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r6 = \u0275\u0275nextContext().row;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", row_r6.users);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r6.users.length === 0);
  }
}
function ManageTeamsComponent_div_70_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 132);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 133);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "button", 134);
    \u0275\u0275listener("click", function ManageTeamsComponent_div_70_ng_template_5_Template_button_click_4_listener() {
      const row_r6 = \u0275\u0275restoreView(_r5).row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleMembersView(row_r6));
    });
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, ManageTeamsComponent_div_70_ng_template_5_div_6_Template, 3, 2, "div", 135);
  }
  if (rf & 2) {
    const row_r6 = ctx.row;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", row_r6.users.length, " ", row_r6.users.length === 1 ? "Member" : "Members", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r6.showMembers ? "Hide" : "View", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", row_r6.showMembers);
  }
}
function ManageTeamsComponent_div_70_ngx_datatable_column_6_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 140);
    \u0275\u0275listener("click", function ManageTeamsComponent_div_70_ngx_datatable_column_6_ng_template_1_Template_button_click_0_listener() {
      const row_r9 = \u0275\u0275restoreView(_r8).row;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openCloudSubscriptionsModal(row_r9));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 141);
    \u0275\u0275text(2, " Manage Subscriptions ");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_div_70_ngx_datatable_column_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ngx-datatable-column", 139);
    \u0275\u0275template(1, ManageTeamsComponent_div_70_ngx_datatable_column_6_ng_template_1_Template, 3, 0, "ng-template", 122);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("width", 180);
  }
}
function ManageTeamsComponent_div_70_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 142);
    \u0275\u0275listener("click", function ManageTeamsComponent_div_70_ng_template_8_Template_button_click_0_listener() {
      const row_r11 = \u0275\u0275restoreView(_r10).row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openJiraConfigModal(row_r11));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 143);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r11 = ctx.row;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("color", ctx_r1.getJiraConfigStatus(row_r11.id) ? "success" : "info");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.getJiraConfigStatus(row_r11.id) ? "JIRA Configured" : "Configure JIRA", " ");
  }
}
function ManageTeamsComponent_div_70_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 144)(1, "button", 145);
    \u0275\u0275listener("click", function ManageTeamsComponent_div_70_ng_template_10_Template_button_click_1_listener() {
      const row_r13 = \u0275\u0275restoreView(_r12).row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editTeam(row_r13));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 146);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "button", 147);
    \u0275\u0275listener("click", function ManageTeamsComponent_div_70_ng_template_10_Template_button_click_3_listener() {
      const row_r13 = \u0275\u0275restoreView(_r12).row;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteTeam(row_r13));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(4, "svg", 148);
    \u0275\u0275elementEnd()();
  }
}
function ManageTeamsComponent_div_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119)(1, "ngx-datatable", 120)(2, "ngx-datatable-column", 121);
    \u0275\u0275template(3, ManageTeamsComponent_div_70_ng_template_3_Template, 8, 3, "ng-template", 122);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ngx-datatable-column", 123);
    \u0275\u0275template(5, ManageTeamsComponent_div_70_ng_template_5_Template, 7, 4, "ng-template", 122);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, ManageTeamsComponent_div_70_ngx_datatable_column_6_Template, 2, 1, "ngx-datatable-column", 124);
    \u0275\u0275elementStart(7, "ngx-datatable-column", 125);
    \u0275\u0275template(8, ManageTeamsComponent_div_70_ng_template_8_Template, 3, 2, "ng-template", 122);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "ngx-datatable-column", 126);
    \u0275\u0275template(10, ManageTeamsComponent_div_70_ng_template_10_Template, 5, 0, "ng-template", 122);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("rows", ctx_r1.filteredTeams)("columnMode", "force")("footerHeight", 50)("headerHeight", 60)("rowHeight", "auto")("limit", 10);
    \u0275\u0275advance();
    \u0275\u0275property("width", 250);
    \u0275\u0275advance(2);
    \u0275\u0275property("width", 180);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.wizEnabled);
    \u0275\u0275advance();
    \u0275\u0275property("width", 160);
    \u0275\u0275advance(2);
    \u0275\u0275property("width", 150);
  }
}
function ManageTeamsComponent_div_84_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 149);
    \u0275\u0275text(1, " Team name is required ");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_div_96_li_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 154);
    \u0275\u0275listener("click", function ManageTeamsComponent_div_96_li_2_Template_li_click_0_listener() {
      const user_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addUserToForm(user_r15, "addTeamForm"));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 133);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r15 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", user_r15.username, " ");
  }
}
function ManageTeamsComponent_div_96_li_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 155);
    \u0275\u0275text(1, " No matching users found ");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_div_96_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 150)(1, "ul", 151);
    \u0275\u0275template(2, ManageTeamsComponent_div_96_li_2_Template, 3, 1, "li", 152)(3, ManageTeamsComponent_div_96_li_3_Template, 2, 0, "li", 153);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const users_r16 = ctx.ngIf;
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", users_r16);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", users_r16.length === 0);
  }
}
function ManageTeamsComponent_div_101_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156);
    \u0275\u0275text(1, " No users selected ");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_div_103_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 157)(1, "span", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 159);
    \u0275\u0275listener("click", function ManageTeamsComponent_div_103_Template_button_click_3_listener() {
      const userId_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.removeUserFromForm(userId_r18, "addTeamForm"));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const userId_r18 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getUserNameById(userId_r18));
  }
}
function ManageTeamsComponent_option_124_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 160);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const team_r19 = ctx.$implicit;
    \u0275\u0275property("value", team_r19.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(team_r19.name);
  }
}
function ManageTeamsComponent_div_125_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 149);
    \u0275\u0275text(1, " Please select a team ");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_div_133_li_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 154);
    \u0275\u0275listener("click", function ManageTeamsComponent_div_133_li_2_Template_li_click_0_listener() {
      const user_r21 = \u0275\u0275restoreView(_r20).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addUserToForm(user_r21, "addUsersToTeamForm"));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 133);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r21 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", user_r21.username, " ");
  }
}
function ManageTeamsComponent_div_133_li_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 155);
    \u0275\u0275text(1, " No matching users found ");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_div_133_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 150)(1, "ul", 151);
    \u0275\u0275template(2, ManageTeamsComponent_div_133_li_2_Template, 3, 1, "li", 152)(3, ManageTeamsComponent_div_133_li_3_Template, 2, 0, "li", 153);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const users_r22 = ctx.ngIf;
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", users_r22);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", users_r22.length === 0);
  }
}
function ManageTeamsComponent_div_138_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156);
    \u0275\u0275text(1, " No users selected ");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_div_140_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 157)(1, "span", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 159);
    \u0275\u0275listener("click", function ManageTeamsComponent_div_140_Template_button_click_3_listener() {
      const userId_r24 = \u0275\u0275restoreView(_r23).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.removeUserFromForm(userId_r24, "addUsersToTeamForm"));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const userId_r24 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getUserNameById(userId_r24));
  }
}
function ManageTeamsComponent_div_167_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 161);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(1, "svg", 162);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(2, "p", 163);
    \u0275\u0275text(3, "No cloud subscriptions found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "small", 86);
    \u0275\u0275text(5, "Add a new subscription to get started");
    \u0275\u0275elementEnd()();
  }
}
function ManageTeamsComponent_div_168_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 166)(1, "div", 3)(2, "div", 13);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(3, "svg", 167);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "span", 168);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 147);
    \u0275\u0275listener("click", function ManageTeamsComponent_div_168_div_1_Template_button_click_6_listener() {
      const subscription_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteCloudSubscription(subscription_r26.id));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(7, "svg", 148);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const subscription_r26 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(subscription_r26.external_project_name);
  }
}
function ManageTeamsComponent_div_168_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 164);
    \u0275\u0275template(1, ManageTeamsComponent_div_168_div_1_Template, 8, 1, "div", 165);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.cloudSubscriptions);
  }
}
function ManageTeamsComponent_div_186_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 149);
    \u0275\u0275text(1, "JIRA URL is required");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_small_198_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 86);
    \u0275\u0275text(1, " Use for Atlassian Cloud (email + API token) or on-prem with username + password. ");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_small_199_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 86);
    \u0275\u0275text(1, " Use for Jira Server / Data Center with a Personal Access Token (no username required). ");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_c_input_group_200_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-input-group", 40)(1, "span", 41);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(2, "svg", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275element(3, "input", 169);
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_div_205_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 149);
    \u0275\u0275text(1, "Token is required");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_select_215_option_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 160);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const proj_r28 = ctx.$implicit;
    \u0275\u0275property("value", proj_r28.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", proj_r28.key, " - ", proj_r28.name, "");
  }
}
function ManageTeamsComponent_select_215_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 170);
    \u0275\u0275listener("change", function ManageTeamsComponent_select_215_Template_select_change_0_listener() {
      \u0275\u0275restoreView(_r27);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fetchJiraIssueTypes());
    });
    \u0275\u0275template(1, ManageTeamsComponent_select_215_option_1_Template, 2, 3, "option", 61);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.jiraProjects);
  }
}
function ManageTeamsComponent_input_216_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 171);
  }
}
function ManageTeamsComponent_span_218_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 172);
  }
}
function ManageTeamsComponent_div_220_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 149);
    \u0275\u0275text(1, "Project key is required");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_select_224_option_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 160);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const type_r29 = ctx.$implicit;
    \u0275\u0275property("value", type_r29);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(type_r29);
  }
}
function ManageTeamsComponent_select_224_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 173);
    \u0275\u0275template(1, ManageTeamsComponent_select_224_option_1_Template, 2, 2, "option", 61);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.jiraIssueTypes);
  }
}
function ManageTeamsComponent_input_225_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 174);
  }
}
function ManageTeamsComponent_div_234_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "label", 76);
    \u0275\u0275text(2, "Minimum severity for auto-creation:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "c-input-group", 40)(4, "span", 41);
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(5, "svg", 175);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(6, "select", 176)(7, "option", 177);
    \u0275\u0275text(8, "Critical only");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "option", 178);
    \u0275\u0275text(10, "High and above");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "option", 179);
    \u0275\u0275text(12, "Medium and above");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "option", 180);
    \u0275\u0275text(14, "Low and above");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "small", 86);
    \u0275\u0275text(16, " Tickets will be automatically created (with intelligent grouping) for findings at or above the selected severity. ");
    \u0275\u0275elementEnd()();
  }
}
function ManageTeamsComponent_button_238_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 181);
    \u0275\u0275listener("click", function ManageTeamsComponent_button_238_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r30);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deleteJiraConfig());
    });
    \u0275\u0275text(1, " Delete Configuration ");
    \u0275\u0275elementEnd();
  }
}
function ManageTeamsComponent_button_240_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 182);
    \u0275\u0275listener("click", function ManageTeamsComponent_button_240_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r31);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.testJiraConnection());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r1.jiraConfigForm.invalid || ctx_r1.jiraTestingConnection);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.jiraTestingConnection ? "Testing..." : "Test Connection", " ");
  }
}
function ManageTeamsComponent__svg_svg_248_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 183);
  }
}
function ManageTeamsComponent__svg_svg_249_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 184);
  }
}
function ManageTeamsComponent__svg_svg_250_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 185);
  }
}
var ManageTeamsComponent = class _ManageTeamsComponent {
  constructor(iconSet, fb, router, authService, teamService, userService, settingsService, cloudSubscriptionService, jiraService) {
    this.iconSet = iconSet;
    this.fb = fb;
    this.router = router;
    this.authService = authService;
    this.teamService = teamService;
    this.userService = userService;
    this.settingsService = settingsService;
    this.cloudSubscriptionService = cloudSubscriptionService;
    this.jiraService = jiraService;
    this.teams = [];
    this.users = [];
    this.searchTerm = "";
    this.filteredTeams = [];
    this.visibleAddTeam = false;
    this.visibleAddUsersToTeam = false;
    this.addTeamForm = this.fb.group({
      name: ["", Validators.required],
      remoteIdentifier: [""],
      users: [[]],
      userInput: new FormControl()
    });
    this.addUsersToTeamForm = this.fb.group({
      team: ["", Validators.required],
      users: [[]],
      userInput: new FormControl()
    });
    this.wizEnabled = false;
    this.visibleCloudSubscriptions = false;
    this.selectedTeam = null;
    this.cloudSubscriptions = [];
    this.newSubscriptionName = "";
    this.visibleJiraConfig = false;
    this.jiraConfigEditMode = false;
    this.jiraTestingConnection = false;
    this.jiraConfigs = /* @__PURE__ */ new Map();
    this.jiraIssueTypes = [];
    this.jiraLoadingIssueTypes = false;
    this.jiraProjects = [];
    this.jiraLoadingProjects = false;
    this.jiraConfigForm = this.fb.group({
      jiraUrl: ["", Validators.required],
      jiraToken: ["", Validators.required],
      jiraProjectKey: ["", Validators.required],
      jiraIssueType: ["Bug"],
      jiraUsername: [""],
      authType: ["BASIC"],
      autoCreateEnabled: [false],
      autoSeverityThreshold: ["HIGH"]
    });
    this.position = "top-end";
    this.visible = false;
    this.percentage = 0;
    this.toastMessage = "";
    this.toastStatus = "";
    iconSet.icons = __spreadValues(__spreadValues({}, free_exports), iconSet);
  }
  loadTeams() {
    this.teamService.get().subscribe({
      next: (response) => {
        this.teams = response.map((team) => __spreadProps(__spreadValues({}, team), {
          showMembers: false
        }));
        this.filteredTeams = [...this.teams];
        this.loadJiraConfigs();
      },
      error: (error) => {
        this.showToast("danger", "Error loading teams. Please try again.");
      }
    });
  }
  loadUsers() {
    this.userService.get().subscribe({
      next: (response) => {
        this.users = response;
        this.refreshFilteredUsers();
      },
      error: (error) => {
        this.showToast("danger", "Error loading users. Please try again.");
      }
    });
  }
  refreshFilteredUsers() {
    const userInputValue = this.addTeamForm.controls.userInput.value || "";
    const userInputValueForAdd = this.addUsersToTeamForm.controls.userInput.value || "";
    this.addTeamForm.controls.userInput.setValue(userInputValue, { emitEvent: true });
    this.addUsersToTeamForm.controls.userInput.setValue(userInputValueForAdd, { emitEvent: true });
  }
  ngOnInit() {
    this.authService.hcTeamManager().subscribe({
      next: () => {
        this.loadTeams();
        this.loadUsers();
        this.loadScannerConfig();
      },
      error: () => {
        this.router.navigate(["/login"]);
      }
    });
    this.addTeamForm.controls.userInput.valueChanges.pipe(startWith(""), map((value) => this._filterUsers(value))).subscribe((filteredUsers) => {
      this.filteredUsers = of(filteredUsers);
    });
    this.addUsersToTeamForm.controls.userInput.valueChanges.pipe(startWith(""), map((value) => this._filterUsers(value))).subscribe((filteredUsers) => {
      this.filteredUsersForAdd = of(filteredUsers);
    });
  }
  loadScannerConfig() {
    this.settingsService.getAdditionalScannerConfig().subscribe({
      next: (response) => {
        this.wizEnabled = response.wizEnabled;
      },
      error: (error) => {
        console.error("Error loading scanner config:", error);
      }
    });
  }
  _filterUsers(value) {
    const filterValue = value?.toLowerCase() || "";
    return this.users.filter((user) => user.username.toLowerCase().includes(filterValue));
  }
  // Helper for team initials
  getTeamInitials(name) {
    if (!name)
      return "";
    const words = name.split(" ");
    if (words.length === 1) {
      return name.length > 1 ? name.substring(0, 2).toUpperCase() : name.toUpperCase();
    } else {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
  }
  // Toggle team members visibility
  toggleMembersView(team) {
    team.showMembers = !team.showMembers;
  }
  // Get statistics for dashboard
  getSecuredProjectsCount() {
    return this.teams.length * 2;
  }
  // Edit team - placeholder for future implementation
  editTeam(team) {
    this.selectedTeam = team;
    this.addUsersToTeamForm.patchValue({
      team: team.id.toString(),
      users: team.users.map((user) => user.id)
    });
    this.visibleAddUsersToTeam = true;
  }
  openAddTeamModal() {
    this.addTeamForm.reset({
      name: "",
      remoteIdentifier: "",
      users: [],
      userInput: ""
    });
    this.visibleAddTeam = true;
  }
  openAddUsersToTeamModal() {
    this.addUsersToTeamForm.reset({
      team: "",
      users: [],
      userInput: ""
    });
    this.visibleAddUsersToTeam = true;
  }
  closeModal() {
    this.visibleAddTeam = false;
    this.visibleAddUsersToTeam = false;
  }
  onSubmitAddTeam() {
    if (this.addTeamForm.valid) {
      const team = {
        users: this.addTeamForm.value.users || [],
        name: this.addTeamForm.value.name || "",
        remoteIdentifier: this.addTeamForm.value.remoteIdentifier || ""
      };
      this.teamService.create(team).subscribe({
        next: (response) => {
          this.showToast("success", "Team created successfully");
          this.loadTeams();
          this.closeModal();
        },
        error: (error) => {
          this.showToast("danger", "Error creating team: Team name may already exist or is empty.");
        }
      });
    }
  }
  onTeamChange() {
    const teamId = Number(this.addUsersToTeamForm.value.team);
    const team = this.teams.find((team2) => team2.id === teamId);
    if (team) {
      this.addUsersToTeamForm.patchValue({
        users: team.users.map((user) => user.id)
      });
    }
  }
  onSubmitAddUsersToTeam() {
    if (this.addUsersToTeamForm.valid) {
      const change = {
        id: Number(this.addUsersToTeamForm.value.team),
        users: this.addUsersToTeamForm.value.users || []
      };
      this.teamService.update(change).subscribe({
        next: (response) => {
          this.showToast("success", "Team members updated successfully");
          this.loadTeams();
          this.closeModal();
        },
        error: (error) => {
          this.showToast("danger", "Error updating team members. Please try again.");
        }
      });
    }
  }
  addUserToForm(user, form) {
    const currentUsers = this[form].value.users || [];
    if (!currentUsers.includes(user.id)) {
      this[form].patchValue({
        users: [...currentUsers, user.id]
      });
    }
  }
  removeUserFromForm(userId, form) {
    const currentUsers = this[form].value.users || [];
    this[form].patchValue({
      users: currentUsers.filter((id) => id !== userId)
    });
  }
  /**
   * Confirm and delete a team
   * @param team The team to delete
   */
  deleteTeam(team) {
    if (this.wizEnabled) {
      this.cloudSubscriptionService.getCloudSubscriptionsByTeam(team.id).subscribe({
        next: (subscriptions) => {
          if (subscriptions.length > 0) {
            this.showToast("danger", "Cannot delete team with active cloud subscriptions. Please remove all subscriptions first.");
            return;
          } else {
            this.confirmAndDeleteTeam(team);
          }
        },
        error: (error) => {
          this.showToast("danger", "Error checking team subscriptions. Please try again.");
        }
      });
    } else {
      this.confirmAndDeleteTeam(team);
    }
  }
  confirmAndDeleteTeam(team) {
    if (confirm(`Are you sure you want to delete team "${team.name}"? This action cannot be undone.`)) {
      this.teamService.delete(team.id).subscribe({
        next: () => {
          this.showToast("success", "Team deleted successfully");
          this.loadTeams();
        },
        error: (error) => {
          let errorMessage = "Error deleting team";
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 409) {
            errorMessage = "Cannot delete team with cloud subscriptions or code repositories";
          }
          this.showToast("danger", errorMessage);
        }
      });
    }
  }
  getUserNameById(userId) {
    const user = this.users.find((u) => u.id === userId);
    return user ? user.username : "";
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
  // Add this new method for filtering
  onSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm = searchTerm;
    if (!searchTerm) {
      this.filteredTeams = [...this.teams];
      return;
    }
    this.filteredTeams = this.teams.filter((team) => {
      return team.name.toLowerCase().includes(searchTerm) || team.remoteIdentifier && team.remoteIdentifier.toLowerCase().includes(searchTerm) || team.users.some((user) => user.username.toLowerCase().includes(searchTerm));
    });
  }
  clearSearch() {
    this.searchTerm = "";
    this.filteredTeams = [...this.teams];
  }
  openCloudSubscriptionsModal(team) {
    this.selectedTeam = team;
    this.loadCloudSubscriptions(team.id);
    this.newSubscriptionName = "";
    this.visibleCloudSubscriptions = true;
  }
  loadCloudSubscriptions(teamId) {
    this.cloudSubscriptionService.getCloudSubscriptionsByTeam(teamId).subscribe({
      next: (response) => {
        this.cloudSubscriptions = response;
      },
      error: (error) => {
        this.showToast("danger", "Error loading cloud subscriptions");
      }
    });
  }
  createCloudSubscription() {
    if (!this.selectedTeam || !this.newSubscriptionName.trim()) {
      return;
    }
    this.cloudSubscriptionService.create(this.selectedTeam.id, this.newSubscriptionName).subscribe({
      next: () => {
        this.showToast("success", "Cloud subscription created successfully");
        this.loadCloudSubscriptions(this.selectedTeam.id);
        this.newSubscriptionName = "";
      },
      error: (error) => {
        this.showToast("danger", "Error creating cloud subscription");
      }
    });
  }
  deleteCloudSubscription(subscriptionId) {
    if (!this.selectedTeam) {
      return;
    }
    if (confirm("Are you sure you want to delete this cloud subscription? This action cannot be undone.")) {
      this.cloudSubscriptionService.delete(subscriptionId, this.selectedTeam.id).subscribe({
        next: () => {
          this.showToast("success", "Cloud subscription deleted successfully");
          this.loadCloudSubscriptions(this.selectedTeam.id);
        },
        error: (error) => {
          this.showToast("danger", "Error deleting cloud subscription");
        }
      });
    }
  }
  // ============ JIRA Integration ============
  loadJiraConfigs() {
    this.teams.forEach((team) => {
      this.jiraService.getConfiguration(team.id).subscribe({
        next: (config) => {
          if (config && config.configured) {
            this.jiraConfigs.set(team.id, config);
          }
        },
        error: () => {
        }
      });
    });
  }
  getJiraConfigStatus(teamId) {
    return this.jiraConfigs.has(teamId);
  }
  openJiraConfigModal(team) {
    this.selectedTeam = team;
    this.jiraConfigEditMode = false;
    this.jiraProjects = [];
    this.jiraIssueTypes = [];
    const existing = this.jiraConfigs.get(team.id);
    if (existing) {
      this.jiraConfigEditMode = true;
      this.jiraConfigForm.patchValue({
        jiraUrl: existing.jiraUrl,
        jiraToken: "",
        jiraProjectKey: existing.jiraProjectKey,
        jiraIssueType: existing.jiraIssueType || "Bug",
        jiraUsername: existing.jiraUsername || "",
        authType: existing.authType || "BASIC",
        autoCreateEnabled: existing.autoCreateEnabled,
        autoSeverityThreshold: existing.autoSeverityThreshold || "HIGH"
      });
      this.jiraConfigForm.get("jiraToken")?.clearValidators();
      this.jiraConfigForm.get("jiraToken")?.updateValueAndValidity();
    } else {
      this.jiraConfigForm.reset({
        jiraUrl: "",
        jiraToken: "",
        jiraProjectKey: "",
        jiraIssueType: "Bug",
        jiraUsername: "",
        authType: "BASIC",
        autoCreateEnabled: false,
        autoSeverityThreshold: "HIGH"
      });
      this.jiraConfigForm.get("jiraToken")?.setValidators(Validators.required);
      this.jiraConfigForm.get("jiraToken")?.updateValueAndValidity();
    }
    this.visibleJiraConfig = true;
  }
  saveJiraConfig() {
    if (!this.selectedTeam || this.jiraConfigForm.invalid)
      return;
    const config = {
      jiraUrl: this.jiraConfigForm.value.jiraUrl || "",
      jiraToken: this.jiraConfigForm.value.jiraToken || "",
      jiraProjectKey: this.jiraConfigForm.value.jiraProjectKey || "",
      jiraIssueType: this.jiraConfigForm.value.jiraIssueType || "Bug",
      jiraUsername: this.jiraConfigForm.value.jiraUsername || "",
      authType: this.jiraConfigForm.value.authType || "BASIC",
      autoCreateEnabled: this.jiraConfigForm.value.autoCreateEnabled || false,
      autoSeverityThreshold: this.jiraConfigForm.value.autoSeverityThreshold || "HIGH"
    };
    const teamId = this.selectedTeam.id;
    const operation = this.jiraConfigEditMode ? this.jiraService.updateConfiguration(teamId, config) : this.jiraService.createConfiguration(teamId, config);
    operation.subscribe({
      next: (response) => {
        this.jiraConfigs.set(teamId, response);
        this.showToast("success", `JIRA configuration ${this.jiraConfigEditMode ? "updated" : "created"} successfully`);
        this.visibleJiraConfig = false;
      },
      error: (error) => {
        this.showToast("danger", "Error saving JIRA configuration. Please check your settings.");
      }
    });
  }
  deleteJiraConfig() {
    if (!this.selectedTeam)
      return;
    if (!confirm("Are you sure you want to delete the JIRA configuration? This will not affect existing tickets."))
      return;
    const teamId = this.selectedTeam.id;
    this.jiraService.deleteConfiguration(teamId).subscribe({
      next: () => {
        this.jiraConfigs.delete(teamId);
        this.showToast("success", "JIRA configuration deleted successfully");
        this.visibleJiraConfig = false;
      },
      error: () => {
        this.showToast("danger", "Error deleting JIRA configuration");
      }
    });
  }
  testJiraConnection() {
    if (!this.selectedTeam)
      return;
    this.jiraTestingConnection = true;
    this.jiraService.testConnection(this.selectedTeam.id).subscribe({
      next: () => {
        this.jiraTestingConnection = false;
        this.showToast("success", "JIRA connection test successful!");
      },
      error: () => {
        this.jiraTestingConnection = false;
        this.showToast("danger", "JIRA connection test failed. Please verify your settings.");
      }
    });
  }
  getJiraRequestPayload() {
    const form = this.jiraConfigForm.value;
    const token = form.jiraToken;
    if (!form.jiraUrl) {
      this.showToast("warning", "Please fill in JIRA URL first");
      return null;
    }
    if (!token && !this.jiraConfigEditMode) {
      this.showToast("warning", "Please fill in API Token first");
      return null;
    }
    if (!token && this.jiraConfigEditMode) {
      this.showToast("warning", "In edit mode, please re-enter the API Token to fetch data from JIRA");
      return null;
    }
    return {
      jiraUrl: form.jiraUrl || "",
      jiraToken: token || "",
      jiraProjectKey: form.jiraProjectKey || "",
      jiraUsername: form.jiraUsername || "",
      authType: form.authType || "BASIC"
    };
  }
  fetchJiraProjects() {
    const payload = this.getJiraRequestPayload();
    if (!payload)
      return;
    this.jiraLoadingProjects = true;
    this.jiraProjects = [];
    this.jiraIssueTypes = [];
    this.jiraService.fetchProjects(payload).subscribe({
      next: (projects) => {
        this.jiraLoadingProjects = false;
        this.jiraProjects = projects;
        if (projects.length > 0) {
          const currentKey = this.jiraConfigForm.get("jiraProjectKey")?.value;
          if (!currentKey || !projects.some((p) => p.key === currentKey)) {
            this.jiraConfigForm.patchValue({ jiraProjectKey: projects[0].key });
          }
          this.showToast("success", `Found ${projects.length} project(s)`);
          this.fetchJiraIssueTypes();
        } else {
          this.showToast("warning", "No projects found. Check your credentials.");
        }
      },
      error: () => {
        this.jiraLoadingProjects = false;
        this.showToast("danger", "Failed to fetch projects. Check connection settings.");
      }
    });
  }
  fetchJiraIssueTypes() {
    const payload = this.getJiraRequestPayload();
    if (!payload)
      return;
    if (!this.jiraConfigForm.value.jiraProjectKey) {
      this.showToast("warning", "Please select a project first");
      return;
    }
    payload.jiraProjectKey = this.jiraConfigForm.value.jiraProjectKey || "";
    this.jiraLoadingIssueTypes = true;
    this.jiraIssueTypes = [];
    this.jiraService.fetchIssueTypes(payload).subscribe({
      next: (types) => {
        this.jiraLoadingIssueTypes = false;
        this.jiraIssueTypes = types;
        if (types.length > 0) {
          const currentValue = this.jiraConfigForm.get("jiraIssueType")?.value;
          if (!currentValue || !types.includes(currentValue)) {
            this.jiraConfigForm.patchValue({ jiraIssueType: types[0] });
          }
        } else {
          this.showToast("warning", "No issue types found for this project.");
        }
      },
      error: () => {
        this.jiraLoadingIssueTypes = false;
        this.showToast("danger", "Failed to fetch issue types.");
      }
    });
  }
  static {
    this.\u0275fac = function ManageTeamsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ManageTeamsComponent)(\u0275\u0275directiveInject(IconSetService), \u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(TeamService), \u0275\u0275directiveInject(UserService), \u0275\u0275directiveInject(SettingsService), \u0275\u0275directiveInject(CloudSubscriptionService), \u0275\u0275directiveInject(JiraService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ManageTeamsComponent, selectors: [["app-manage-teams"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 258, vars: 65, consts: [[1, "dashboard-container"], ["xs", "12"], [1, "header-container", "mb-4"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, "page-title"], [1, "d-flex", "gap-2"], ["color", "primary", "cButton", "", 1, "btn-with-icon", 3, "click"], ["cIcon", "", "name", "cil-plus"], ["color", "primary", "variant", "outline", "cButton", "", 1, "btn-with-icon", 3, "click"], ["cIcon", "", "name", "cil-user-plus"], [1, "mb-4"], ["sm", "6", "lg", "3"], [1, "stat-card", "mb-4"], [1, "d-flex", "align-items-center"], [1, "stat-icon-container"], ["cIcon", "", "name", "cil-group", 1, "stat-icon"], [1, "ms-3"], [1, "stat-label"], [1, "stat-value"], [1, "stat-icon-container", "accent-blue"], ["cIcon", "", "name", "cil-user", 1, "stat-icon"], [1, "stat-icon-container", "accent-green"], ["cIcon", "", "name", "cil-shield-alt", 1, "stat-icon"], ["class", "stat-icon-container accent-purple", 4, "ngIf"], ["class", "stat-icon-container accent-red", 4, "ngIf"], ["xs", ""], [1, "main-card"], [1, "mb-0"], [1, "search-container"], ["cInputGroupText", "", 1, "search-icon-container"], ["cIcon", "", "name", "cil-search"], ["type", "text", "cFormControl", "", "placeholder", "Search teams, identifiers, or users...", 1, "form-control", "search-input", 3, "input", "value"], ["cButton", "", "color", "secondary", "variant", "ghost", "class", "search-clear-btn", 3, "click", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "table-responsive", 4, "ngIf"], ["size", "lg", "id", "addTeamModal", "alignment", "center", 3, "visibleChange", "visible"], ["cModalTitle", ""], [1, "modal-form", 3, "formGroup"], [1, "form-section"], [1, "section-title"], [1, "mb-3"], ["cInputGroupText", "", 1, "input-icon"], ["cIcon", "", "name", "cil-group"], ["type", "text", "id", "name", "formControlName", "name", "placeholder", "Team Name", 1, "form-control"], ["class", "invalid-feedback d-block", 4, "ngIf"], ["cIcon", "", "name", "cil-blur"], ["aria-label", "Remote Identifier", "cFormControl", "", "type", "text", "id", "remoteIdentifier", "formControlName", "remoteIdentifier", "placeholder", "Remote Identifier (optional)", 1, "form-control"], [1, "form-section", "mt-4"], ["cIcon", "", "name", "cil-user"], ["type", "text", "id", "userInput", "formControlName", "userInput", "placeholder", "Search users by name...", 1, "form-control"], ["class", "users-dropdown", 4, "ngIf"], [1, "selected-users"], [1, "selected-title"], ["class", "text-muted no-users-message", 4, "ngIf"], [1, "users-badges"], ["class", "user-badge", 4, "ngFor", "ngForOf"], ["cButton", "", "color", "secondary", "variant", "ghost", 3, "click"], ["cButton", "", "color", "primary", 3, "click", "disabled"], ["size", "lg", "id", "addUsersToTeamModal", "alignment", "center", 3, "visibleChange", "visible"], ["id", "team", "formControlName", "team", 1, "form-select", "custom-select", 3, "change"], ["value", "", "disabled", ""], [3, "value", 4, "ngFor", "ngForOf"], ["size", "lg", "id", "cloudSubscriptionsModal", "alignment", "center", 3, "visibleChange", "visible"], ["cIcon", "", "name", "cil-cloud", 1, "me-2"], [1, "subscription-add-section"], [1, "flex-grow-1"], ["cIcon", "", "name", "cil-cloud"], ["type", "text", "cFormControl", "", "placeholder", "Subscription name...", 3, "ngModelChange", "ngModel"], ["cButton", "", "color", "primary", 1, "btn-with-icon", 3, "click", "disabled"], [1, "subscription-list-section"], ["class", "empty-state smaller", 4, "ngIf"], ["class", "active-subscriptions", 4, "ngIf"], ["size", "lg", "id", "jiraConfigModal", "alignment", "center", 3, "visibleChange", "visible"], ["cIcon", "", "name", "cil-task", 1, "me-2"], ["cIcon", "", "name", "cil-link"], ["type", "text", "cFormControl", "", "formControlName", "jiraUrl", "placeholder", "JIRA URL (e.g., https://yourcompany.atlassian.net)"], [1, "form-label"], ["cIcon", "", "name", "cil-shield-alt"], ["cFormControl", "", "formControlName", "authType", 1, "form-select"], ["value", "BASIC"], ["value", "PAT"], ["class", "text-muted", 4, "ngIf"], ["class", "mb-3", 4, "ngIf"], ["cIcon", "", "name", "cil-lock-locked"], ["type", "password", "cFormControl", "", "formControlName", "jiraToken", 3, "placeholder"], [1, "d-flex", "align-items-center", "mb-2"], [1, "text-muted"], ["cIcon", "", "name", "cil-folder"], ["cFormControl", "", "formControlName", "jiraProjectKey", "class", "form-select", 3, "change", 4, "ngIf"], ["type", "text", "cFormControl", "", "formControlName", "jiraProjectKey", "placeholder", "Project Key (click Load Projects or type manually)", 4, "ngIf"], ["cButton", "", "color", "info", "variant", "outline", "type", "button", 3, "click", "disabled"], ["class", "spinner-border spinner-border-sm me-1", 4, "ngIf"], ["cIcon", "", "name", "cil-list-rich"], ["cFormControl", "", "formControlName", "jiraIssueType", "class", "form-select", 4, "ngIf"], ["type", "text", "cFormControl", "", "formControlName", "jiraIssueType", "placeholder", "Issue Type (loaded automatically with project)", 4, "ngIf"], [1, "d-flex", "align-items-center", "mb-3"], ["switch", ""], ["cFormCheckInput", "", "type", "checkbox", "id", "autoCreateEnabled", "formControlName", "autoCreateEnabled"], ["cFormCheckLabel", "", "for", "autoCreateEnabled"], [4, "ngIf"], [1, "d-flex", "justify-content-between", "w-100"], ["cButton", "", "color", "danger", "variant", "ghost", 3, "click", 4, "ngIf"], ["cButton", "", "color", "info", "variant", "outline", 3, "disabled", "click", 4, "ngIf"], ["position", "fixed", 1, "p-3", 3, "placement"], [1, "toast-notification", 3, "visibleChange", "color", "visible", "autohide", "delay"], ["cIcon", "", "name", "cil-check", "class", "me-2 toast-icon success", 4, "ngIf"], ["cIcon", "", "name", "cil-warning", "class", "me-2 toast-icon danger", 4, "ngIf"], ["cIcon", "", "name", "cil-info", "class", "me-2 toast-icon info", 4, "ngIf"], [1, "me-auto"], [1, "stat-icon-container", "accent-purple"], ["cIcon", "", "name", "cil-cloud", 1, "stat-icon"], [1, "stat-icon-container", "accent-red"], ["cIcon", "", "name", "cil-cloud-download", 1, "stat-icon"], ["cButton", "", "color", "secondary", "variant", "ghost", 1, "search-clear-btn", 3, "click"], ["cIcon", "", "name", "cil-x"], [1, "empty-state"], ["cIcon", "", "name", "cil-group", 1, "empty-icon"], [1, "mt-3"], ["color", "primary", "cButton", "", 1, "btn-with-icon", "mt-2", 3, "click"], [1, "table-responsive"], [1, "bootstrap", "teams-table", 3, "rows", "columnMode", "footerHeight", "headerHeight", "rowHeight", "limit"], ["name", "Team", 3, "width"], ["ngx-datatable-cell-template", ""], ["name", "Members", 3, "width"], ["name", "Cloud Subscriptions", 3, "width", 4, "ngIf"], ["name", "JIRA", 3, "width"], ["name", "Actions", 3, "width"], [1, "team-icon-container"], [1, "team-icon"], [1, "team-name"], ["class", "team-id", 4, "ngIf"], [1, "team-id"], [1, "team-members-count"], ["cIcon", "", "name", "cil-user", 1, "me-2", "small-icon"], ["cButton", "", "color", "primary", "variant", "ghost", "size", "sm", 1, "ms-2", "view-members-btn", 3, "click"], ["class", "mt-3 members-list", 4, "ngIf"], [1, "mt-3", "members-list"], ["class", "member-item", 4, "ngFor", "ngForOf"], [1, "member-item"], ["name", "Cloud Subscriptions", 3, "width"], ["cButton", "", "color", "info", "variant", "ghost", "size", "sm", 1, "cloud-subs-btn", 3, "click"], ["cIcon", "", "name", "cil-cloud", 1, "me-2", "small-icon"], ["cButton", "", "variant", "ghost", "size", "sm", 1, "cloud-subs-btn", 3, "click", "color"], ["cIcon", "", "name", "cil-task", 1, "me-2", "small-icon"], [1, "d-flex", "gap-2", "action-buttons"], ["cButton", "", "color", "primary", "variant", "ghost", "size", "sm", 1, "action-btn", 3, "click"], ["cIcon", "", "name", "cil-pencil"], ["cButton", "", "color", "danger", "variant", "ghost", "size", "sm", 1, "action-btn", 3, "click"], ["cIcon", "", "name", "cil-trash"], [1, "invalid-feedback", "d-block"], [1, "users-dropdown"], [1, "users-list"], ["class", "user-item", 3, "click", 4, "ngFor", "ngForOf"], ["class", "no-results", 4, "ngIf"], [1, "user-item", 3, "click"], [1, "no-results"], [1, "text-muted", "no-users-message"], [1, "user-badge"], [1, "user-name"], ["type", "button", "aria-label", "Remove user", 1, "btn-close", "btn-close-white", 3, "click"], [3, "value"], [1, "empty-state", "smaller"], ["cIcon", "", "name", "cil-cloud-download", 1, "empty-icon"], [1, "mt-2", "mb-0"], [1, "active-subscriptions"], ["class", "subscription-item", 4, "ngFor", "ngForOf"], [1, "subscription-item"], ["cIcon", "", "name", "cil-cloud", 1, "me-2", "subscription-icon"], [1, "subscription-name"], ["type", "text", "cFormControl", "", "formControlName", "jiraUsername", "placeholder", "Username / Email (e.g. user@company.com)"], ["cFormControl", "", "formControlName", "jiraProjectKey", 1, "form-select", 3, "change"], ["type", "text", "cFormControl", "", "formControlName", "jiraProjectKey", "placeholder", "Project Key (click Load Projects or type manually)"], [1, "spinner-border", "spinner-border-sm", "me-1"], ["cFormControl", "", "formControlName", "jiraIssueType", 1, "form-select"], ["type", "text", "cFormControl", "", "formControlName", "jiraIssueType", "placeholder", "Issue Type (loaded automatically with project)"], ["cIcon", "", "name", "cil-warning"], ["cFormControl", "", "formControlName", "autoSeverityThreshold", 1, "form-select"], ["value", "CRITICAL"], ["value", "HIGH"], ["value", "MEDIUM"], ["value", "LOW"], ["cButton", "", "color", "danger", "variant", "ghost", 3, "click"], ["cButton", "", "color", "info", "variant", "outline", 3, "click", "disabled"], ["cIcon", "", "name", "cil-check", 1, "me-2", "toast-icon", "success"], ["cIcon", "", "name", "cil-warning", 1, "me-2", "toast-icon", "danger"], ["cIcon", "", "name", "cil-info", 1, "me-2", "toast-icon", "info"]], template: function ManageTeamsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "c-row")(2, "c-col", 1)(3, "div", 2)(4, "div", 3)(5, "h1", 4);
        \u0275\u0275text(6, "Team Management");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "div", 5)(8, "button", 6);
        \u0275\u0275listener("click", function ManageTeamsComponent_Template_button_click_8_listener() {
          return ctx.openAddTeamModal();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(9, "svg", 7);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(10, "span");
        \u0275\u0275text(11, "Create Team");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "button", 8);
        \u0275\u0275listener("click", function ManageTeamsComponent_Template_button_click_12_listener() {
          return ctx.openAddUsersToTeamModal();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(13, "svg", 9);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(14, "span");
        \u0275\u0275text(15, "Add Users to Team");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(16, "c-row", 10)(17, "c-col", 11)(18, "c-card", 12)(19, "c-card-body", 13)(20, "div", 14);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(21, "svg", 15);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(22, "div", 16)(23, "div", 17);
        \u0275\u0275text(24, "Total Teams");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(25, "div", 18);
        \u0275\u0275text(26);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(27, "c-col", 11)(28, "c-card", 12)(29, "c-card-body", 13)(30, "div", 19);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(31, "svg", 20);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(32, "div", 16)(33, "div", 17);
        \u0275\u0275text(34, "Total Users");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(35, "div", 18);
        \u0275\u0275text(36);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(37, "c-col", 11)(38, "c-card", 12)(39, "c-card-body", 13)(40, "div", 21);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(41, "svg", 22);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(42, "div", 16)(43, "div", 17);
        \u0275\u0275text(44, "Secured Projects");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(45, "div", 18);
        \u0275\u0275text(46);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(47, "c-col", 11)(48, "c-card", 12)(49, "c-card-body", 13);
        \u0275\u0275template(50, ManageTeamsComponent_div_50_Template, 2, 0, "div", 23)(51, ManageTeamsComponent_div_51_Template, 2, 0, "div", 24);
        \u0275\u0275elementStart(52, "div", 16)(53, "div", 17);
        \u0275\u0275text(54, "Cloud Integration");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(55, "div", 18);
        \u0275\u0275text(56);
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(57, "c-row")(58, "c-col", 25)(59, "c-card", 26)(60, "c-card-header", 3)(61, "h5", 27);
        \u0275\u0275text(62, "Teams Overview");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(63, "c-input-group", 28)(64, "span", 29);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(65, "svg", 30);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(66, "input", 31);
        \u0275\u0275listener("input", function ManageTeamsComponent_Template_input_input_66_listener($event) {
          return ctx.onSearch($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275template(67, ManageTeamsComponent_button_67_Template, 2, 0, "button", 32);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(68, "c-card-body");
        \u0275\u0275template(69, ManageTeamsComponent_div_69_Template, 10, 1, "div", 33)(70, ManageTeamsComponent_div_70_Template, 11, 11, "div", 34);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(71, "c-modal", 35);
        \u0275\u0275listener("visibleChange", function ManageTeamsComponent_Template_c_modal_visibleChange_71_listener($event) {
          return ctx.visibleAddTeam = $event;
        });
        \u0275\u0275elementStart(72, "c-modal-header")(73, "h5", 36);
        \u0275\u0275text(74, "Create New Team");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(75, "c-modal-body")(76, "form", 37)(77, "div", 38)(78, "h6", 39);
        \u0275\u0275text(79, "Team Information");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(80, "c-input-group", 40)(81, "span", 41);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(82, "svg", 42);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(83, "input", 43);
        \u0275\u0275elementEnd();
        \u0275\u0275template(84, ManageTeamsComponent_div_84_Template, 2, 0, "div", 44);
        \u0275\u0275elementStart(85, "c-input-group", 40)(86, "span", 41);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(87, "svg", 45);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(88, "input", 46);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(89, "div", 47)(90, "h6", 39);
        \u0275\u0275text(91, "Team Members");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(92, "c-input-group", 40)(93, "span", 41);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(94, "svg", 48);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(95, "input", 49);
        \u0275\u0275elementEnd();
        \u0275\u0275template(96, ManageTeamsComponent_div_96_Template, 4, 2, "div", 50);
        \u0275\u0275pipe(97, "async");
        \u0275\u0275elementStart(98, "div", 51)(99, "h6", 52);
        \u0275\u0275text(100, "Selected Members");
        \u0275\u0275elementEnd();
        \u0275\u0275template(101, ManageTeamsComponent_div_101_Template, 2, 0, "div", 53);
        \u0275\u0275elementStart(102, "div", 54);
        \u0275\u0275template(103, ManageTeamsComponent_div_103_Template, 4, 1, "div", 55);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(104, "c-modal-footer")(105, "button", 56);
        \u0275\u0275listener("click", function ManageTeamsComponent_Template_button_click_105_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(106, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(107, "button", 57);
        \u0275\u0275listener("click", function ManageTeamsComponent_Template_button_click_107_listener() {
          return ctx.onSubmitAddTeam();
        });
        \u0275\u0275text(108, " Create Team ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(109, "c-modal", 58);
        \u0275\u0275listener("visibleChange", function ManageTeamsComponent_Template_c_modal_visibleChange_109_listener($event) {
          return ctx.visibleAddUsersToTeam = $event;
        });
        \u0275\u0275elementStart(110, "c-modal-header")(111, "h5", 36);
        \u0275\u0275text(112, "Add Users to Team");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(113, "c-modal-body")(114, "form", 37)(115, "div", 38)(116, "h6", 39);
        \u0275\u0275text(117, "Select Team");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(118, "c-input-group", 40)(119, "span", 41);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(120, "svg", 42);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(121, "select", 59);
        \u0275\u0275listener("change", function ManageTeamsComponent_Template_select_change_121_listener() {
          return ctx.onTeamChange();
        });
        \u0275\u0275elementStart(122, "option", 60);
        \u0275\u0275text(123, "Select a team");
        \u0275\u0275elementEnd();
        \u0275\u0275template(124, ManageTeamsComponent_option_124_Template, 2, 2, "option", 61);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(125, ManageTeamsComponent_div_125_Template, 2, 0, "div", 44);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(126, "div", 47)(127, "h6", 39);
        \u0275\u0275text(128, "Add Team Members");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(129, "c-input-group", 40)(130, "span", 41);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(131, "svg", 48);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(132, "input", 49);
        \u0275\u0275elementEnd();
        \u0275\u0275template(133, ManageTeamsComponent_div_133_Template, 4, 2, "div", 50);
        \u0275\u0275pipe(134, "async");
        \u0275\u0275elementStart(135, "div", 51)(136, "h6", 52);
        \u0275\u0275text(137, "Selected Members");
        \u0275\u0275elementEnd();
        \u0275\u0275template(138, ManageTeamsComponent_div_138_Template, 2, 0, "div", 53);
        \u0275\u0275elementStart(139, "div", 54);
        \u0275\u0275template(140, ManageTeamsComponent_div_140_Template, 4, 1, "div", 55);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(141, "c-modal-footer")(142, "button", 56);
        \u0275\u0275listener("click", function ManageTeamsComponent_Template_button_click_142_listener() {
          return ctx.closeModal();
        });
        \u0275\u0275text(143, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(144, "button", 57);
        \u0275\u0275listener("click", function ManageTeamsComponent_Template_button_click_144_listener() {
          return ctx.onSubmitAddUsersToTeam();
        });
        \u0275\u0275text(145, " Update Team Members ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(146, "c-modal", 62);
        \u0275\u0275listener("visibleChange", function ManageTeamsComponent_Template_c_modal_visibleChange_146_listener($event) {
          return ctx.visibleCloudSubscriptions = $event;
        });
        \u0275\u0275elementStart(147, "c-modal-header")(148, "h5", 36);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(149, "svg", 63);
        \u0275\u0275text(150);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(151, "c-modal-body")(152, "div", 64)(153, "h6", 39);
        \u0275\u0275text(154, "Add New Subscription");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(155, "div", 5)(156, "c-input-group", 65)(157, "span", 41);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(158, "svg", 66);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(159, "input", 67);
        \u0275\u0275twoWayListener("ngModelChange", function ManageTeamsComponent_Template_input_ngModelChange_159_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.newSubscriptionName, $event) || (ctx.newSubscriptionName = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(160, "button", 68);
        \u0275\u0275listener("click", function ManageTeamsComponent_Template_button_click_160_listener() {
          return ctx.createCloudSubscription();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(161, "svg", 7);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(162, "span");
        \u0275\u0275text(163, "Add");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(164, "div", 69)(165, "h6", 39);
        \u0275\u0275text(166, "Active Subscriptions");
        \u0275\u0275elementEnd();
        \u0275\u0275template(167, ManageTeamsComponent_div_167_Template, 6, 0, "div", 70)(168, ManageTeamsComponent_div_168_Template, 2, 1, "div", 71);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(169, "c-modal-footer")(170, "button", 56);
        \u0275\u0275listener("click", function ManageTeamsComponent_Template_button_click_170_listener() {
          return ctx.visibleCloudSubscriptions = false;
        });
        \u0275\u0275text(171, " Close ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(172, "c-modal", 72);
        \u0275\u0275listener("visibleChange", function ManageTeamsComponent_Template_c_modal_visibleChange_172_listener($event) {
          return ctx.visibleJiraConfig = $event;
        });
        \u0275\u0275elementStart(173, "c-modal-header")(174, "h5", 36);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(175, "svg", 73);
        \u0275\u0275text(176);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(177, "c-modal-body")(178, "form", 37)(179, "div", 38)(180, "h6", 39);
        \u0275\u0275text(181, "Connection Settings");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(182, "c-input-group", 40)(183, "span", 41);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(184, "svg", 74);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(185, "input", 75);
        \u0275\u0275elementEnd();
        \u0275\u0275template(186, ManageTeamsComponent_div_186_Template, 2, 0, "div", 44);
        \u0275\u0275elementStart(187, "div", 40)(188, "label", 76);
        \u0275\u0275text(189, "Authentication Method");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(190, "c-input-group")(191, "span", 41);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(192, "svg", 77);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(193, "select", 78)(194, "option", 79);
        \u0275\u0275text(195, "Basic Auth (Username + API Token / Password)");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(196, "option", 80);
        \u0275\u0275text(197, "Personal Access Token (on-prem / Data Center)");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(198, ManageTeamsComponent_small_198_Template, 2, 0, "small", 81)(199, ManageTeamsComponent_small_199_Template, 2, 0, "small", 81);
        \u0275\u0275elementEnd();
        \u0275\u0275template(200, ManageTeamsComponent_c_input_group_200_Template, 4, 0, "c-input-group", 82);
        \u0275\u0275elementStart(201, "c-input-group", 40)(202, "span", 41);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(203, "svg", 83);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(204, "input", 84);
        \u0275\u0275elementEnd();
        \u0275\u0275template(205, ManageTeamsComponent_div_205_Template, 2, 0, "div", 44);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(206, "div", 47)(207, "h6", 39);
        \u0275\u0275text(208, "Project Settings");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(209, "div", 85)(210, "small", 86);
        \u0275\u0275text(211, 'Fill in connection settings above, then click "Load Projects" to fetch available projects and issue types from JIRA.');
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(212, "c-input-group", 40)(213, "span", 41);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(214, "svg", 87);
        \u0275\u0275elementEnd();
        \u0275\u0275template(215, ManageTeamsComponent_select_215_Template, 2, 1, "select", 88)(216, ManageTeamsComponent_input_216_Template, 1, 0, "input", 89);
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(217, "button", 90);
        \u0275\u0275listener("click", function ManageTeamsComponent_Template_button_click_217_listener() {
          return ctx.fetchJiraProjects();
        });
        \u0275\u0275template(218, ManageTeamsComponent_span_218_Template, 1, 0, "span", 91);
        \u0275\u0275text(219, " Load Projects ");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(220, ManageTeamsComponent_div_220_Template, 2, 0, "div", 44);
        \u0275\u0275elementStart(221, "c-input-group", 40)(222, "span", 41);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(223, "svg", 92);
        \u0275\u0275elementEnd();
        \u0275\u0275template(224, ManageTeamsComponent_select_224_Template, 2, 1, "select", 93)(225, ManageTeamsComponent_input_225_Template, 1, 0, "input", 94);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(226, "div", 47)(227, "h6", 39);
        \u0275\u0275text(228, "Automatic Ticket Creation");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(229, "div", 95)(230, "c-form-check", 96);
        \u0275\u0275element(231, "input", 97);
        \u0275\u0275elementStart(232, "label", 98);
        \u0275\u0275text(233, " Enable automatic ticket creation for new findings ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(234, ManageTeamsComponent_div_234_Template, 17, 0, "div", 99);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(235, "c-modal-footer")(236, "div", 100)(237, "div");
        \u0275\u0275template(238, ManageTeamsComponent_button_238_Template, 2, 0, "button", 101);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(239, "div", 5);
        \u0275\u0275template(240, ManageTeamsComponent_button_240_Template, 2, 2, "button", 102);
        \u0275\u0275elementStart(241, "button", 56);
        \u0275\u0275listener("click", function ManageTeamsComponent_Template_button_click_241_listener() {
          return ctx.visibleJiraConfig = false;
        });
        \u0275\u0275text(242, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(243, "button", 57);
        \u0275\u0275listener("click", function ManageTeamsComponent_Template_button_click_243_listener() {
          return ctx.saveJiraConfig();
        });
        \u0275\u0275text(244);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(245, "c-toaster", 103)(246, "c-toast", 104);
        \u0275\u0275listener("visibleChange", function ManageTeamsComponent_Template_c_toast_visibleChange_246_listener($event) {
          return ctx.onVisibleChange($event);
        });
        \u0275\u0275elementStart(247, "c-toast-header");
        \u0275\u0275template(248, ManageTeamsComponent__svg_svg_248_Template, 1, 0, "svg", 105)(249, ManageTeamsComponent__svg_svg_249_Template, 1, 0, "svg", 106)(250, ManageTeamsComponent__svg_svg_250_Template, 1, 0, "svg", 107);
        \u0275\u0275elementStart(251, "strong", 108);
        \u0275\u0275text(252, "Team Management");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(253, "small");
        \u0275\u0275text(254, "just now");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(255, "c-toast-body")(256, "p", 27);
        \u0275\u0275text(257);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        let tmp_12_0;
        let tmp_20_0;
        let tmp_34_0;
        let tmp_35_0;
        let tmp_36_0;
        let tmp_37_0;
        let tmp_38_0;
        let tmp_39_0;
        let tmp_44_0;
        let tmp_47_0;
        \u0275\u0275advance(26);
        \u0275\u0275textInterpolate(ctx.teams.length);
        \u0275\u0275advance(10);
        \u0275\u0275textInterpolate(ctx.users.length);
        \u0275\u0275advance(10);
        \u0275\u0275textInterpolate(ctx.getSecuredProjectsCount());
        \u0275\u0275advance(4);
        \u0275\u0275property("ngIf", ctx.wizEnabled);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.wizEnabled);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.wizEnabled ? "Enabled" : "Disabled");
        \u0275\u0275advance(10);
        \u0275\u0275property("value", ctx.searchTerm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.searchTerm);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.filteredTeams.length === 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.filteredTeams.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("visible", ctx.visibleAddTeam);
        \u0275\u0275advance(5);
        \u0275\u0275property("formGroup", ctx.addTeamForm);
        \u0275\u0275advance(8);
        \u0275\u0275property("ngIf", ((tmp_12_0 = ctx.addTeamForm.get("name")) == null ? null : tmp_12_0.invalid) && ((tmp_12_0 = ctx.addTeamForm.get("name")) == null ? null : tmp_12_0.touched));
        \u0275\u0275advance(12);
        \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(97, 61, ctx.filteredUsers));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", (ctx.addTeamForm.value.users == null ? null : ctx.addTeamForm.value.users.length) === 0);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.addTeamForm.value.users);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.addTeamForm.invalid);
        \u0275\u0275advance(2);
        \u0275\u0275property("visible", ctx.visibleAddUsersToTeam);
        \u0275\u0275advance(5);
        \u0275\u0275property("formGroup", ctx.addUsersToTeamForm);
        \u0275\u0275advance(10);
        \u0275\u0275property("ngForOf", ctx.teams);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ((tmp_20_0 = ctx.addUsersToTeamForm.get("team")) == null ? null : tmp_20_0.invalid) && ((tmp_20_0 = ctx.addUsersToTeamForm.get("team")) == null ? null : tmp_20_0.touched));
        \u0275\u0275advance(8);
        \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(134, 63, ctx.filteredUsersForAdd));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", (ctx.addUsersToTeamForm.value.users == null ? null : ctx.addUsersToTeamForm.value.users.length) === 0);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.addUsersToTeamForm.value.users);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.addUsersToTeamForm.invalid);
        \u0275\u0275advance(2);
        \u0275\u0275property("visible", ctx.visibleCloudSubscriptions);
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1(" Cloud Subscriptions - ", ctx.selectedTeam == null ? null : ctx.selectedTeam.name, " ");
        \u0275\u0275advance(9);
        \u0275\u0275twoWayProperty("ngModel", ctx.newSubscriptionName);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", !ctx.newSubscriptionName.trim());
        \u0275\u0275advance(7);
        \u0275\u0275property("ngIf", ctx.cloudSubscriptions.length === 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.cloudSubscriptions.length > 0);
        \u0275\u0275advance(4);
        \u0275\u0275property("visible", ctx.visibleJiraConfig);
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1(" JIRA Integration - ", ctx.selectedTeam == null ? null : ctx.selectedTeam.name, " ");
        \u0275\u0275advance(2);
        \u0275\u0275property("formGroup", ctx.jiraConfigForm);
        \u0275\u0275advance(8);
        \u0275\u0275property("ngIf", ((tmp_34_0 = ctx.jiraConfigForm.get("jiraUrl")) == null ? null : tmp_34_0.invalid) && ((tmp_34_0 = ctx.jiraConfigForm.get("jiraUrl")) == null ? null : tmp_34_0.touched));
        \u0275\u0275advance(12);
        \u0275\u0275property("ngIf", ((tmp_35_0 = ctx.jiraConfigForm.get("authType")) == null ? null : tmp_35_0.value) === "BASIC");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ((tmp_36_0 = ctx.jiraConfigForm.get("authType")) == null ? null : tmp_36_0.value) === "PAT");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ((tmp_37_0 = ctx.jiraConfigForm.get("authType")) == null ? null : tmp_37_0.value) === "BASIC");
        \u0275\u0275advance(4);
        \u0275\u0275property("placeholder", ctx.jiraConfigEditMode ? "Leave empty to keep current token" : ((tmp_38_0 = ctx.jiraConfigForm.get("authType")) == null ? null : tmp_38_0.value) === "PAT" ? "Personal Access Token" : "API Token / Password");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.jiraConfigEditMode && ((tmp_39_0 = ctx.jiraConfigForm.get("jiraToken")) == null ? null : tmp_39_0.invalid) && ((tmp_39_0 = ctx.jiraConfigForm.get("jiraToken")) == null ? null : tmp_39_0.touched));
        \u0275\u0275advance(10);
        \u0275\u0275property("ngIf", ctx.jiraProjects.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.jiraProjects.length === 0);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.jiraLoadingProjects);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.jiraLoadingProjects);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ((tmp_44_0 = ctx.jiraConfigForm.get("jiraProjectKey")) == null ? null : tmp_44_0.invalid) && ((tmp_44_0 = ctx.jiraConfigForm.get("jiraProjectKey")) == null ? null : tmp_44_0.touched));
        \u0275\u0275advance(4);
        \u0275\u0275property("ngIf", ctx.jiraIssueTypes.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.jiraIssueTypes.length === 0);
        \u0275\u0275advance(9);
        \u0275\u0275property("ngIf", (tmp_47_0 = ctx.jiraConfigForm.get("autoCreateEnabled")) == null ? null : tmp_47_0.value);
        \u0275\u0275advance(4);
        \u0275\u0275property("ngIf", ctx.jiraConfigEditMode);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.jiraConfigEditMode);
        \u0275\u0275advance(3);
        \u0275\u0275property("disabled", ctx.jiraConfigForm.invalid);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.jiraConfigEditMode ? "Update" : "Save", " Configuration ");
        \u0275\u0275advance();
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
      CheckboxControlValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      NgModel,
      ReactiveFormsModule,
      FormGroupDirective,
      FormControlName,
      CommonModule,
      NgIf,
      AsyncPipe,
      InputGroupTextDirective,
      ToasterComponent,
      ToastComponent,
      ToastBodyComponent,
      ToastHeaderComponent,
      FormControlDirective,
      FormCheckComponent,
      FormCheckInputDirective,
      FormCheckLabelDirective
    ], styles: ['\n\n[_ngcontent-%COMP%]:root {\n  --transition-speed: 0.3s;\n  --border-radius: 8px;\n  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  --hover-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);\n}\n.dashboard-container[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n@media (min-width: 768px) {\n  .dashboard-container[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n  }\n}\n.header-container[_ngcontent-%COMP%] {\n  padding-bottom: 1rem;\n}\n.page-title[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 600;\n  margin: 0;\n  color: var(--cui-body-color);\n}\n.btn-with-icon[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  font-weight: 500;\n  transition: all var(--transition-speed) ease;\n}\n.btn-with-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n.stat-card[_ngcontent-%COMP%] {\n  border-radius: var(--border-radius);\n  border: 1px solid var(--cui-card-border-color);\n  overflow: hidden;\n  transition: transform var(--transition-speed), box-shadow var(--transition-speed);\n  box-shadow: var(--card-shadow);\n}\n.stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: var(--hover-shadow);\n}\n.stat-icon-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  background-color: var(--cui-primary);\n  color: white;\n}\n.stat-icon-container.accent-blue[_ngcontent-%COMP%] {\n  background-color: var(--cui-info);\n}\n.stat-icon-container.accent-green[_ngcontent-%COMP%] {\n  background-color: var(--cui-success);\n}\n.stat-icon-container.accent-purple[_ngcontent-%COMP%] {\n  background-color: var(--cui-purple);\n}\n.stat-icon-container.accent-red[_ngcontent-%COMP%] {\n  background-color: var(--cui-danger);\n}\n.stat-icon[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n}\n.stat-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--cui-secondary-color);\n  margin-bottom: 0.25rem;\n}\n.stat-value[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 600;\n  color: var(--cui-body-color);\n}\n.main-card[_ngcontent-%COMP%] {\n  border-radius: var(--border-radius);\n  border: 1px solid var(--cui-card-border-color);\n  box-shadow: var(--card-shadow);\n  margin-bottom: 2rem;\n}\n.search-container[_ngcontent-%COMP%] {\n  max-width: 400px;\n  width: 100%;\n  margin-left: auto;\n}\n.search-icon-container[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--cui-secondary-color);\n  border-right: none;\n  padding-right: 0;\n}\n.search-input[_ngcontent-%COMP%] {\n  border-left: none;\n  padding-left: 0.5rem;\n  background-color: var(--cui-input-bg);\n  transition: all var(--transition-speed) ease;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  box-shadow: none;\n  border-color: var(--cui-input-border-color);\n}\n.search-clear-btn[_ngcontent-%COMP%] {\n  border: none;\n  background: transparent;\n  color: var(--cui-secondary-color);\n  transition: color var(--transition-speed) ease;\n}\n.search-clear-btn[_ngcontent-%COMP%]:hover {\n  color: var(--cui-danger);\n}\n.empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem 1rem;\n  text-align: center;\n}\n.empty-state.smaller[_ngcontent-%COMP%] {\n  padding: 2rem 1rem;\n}\n.empty-icon[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  color: var(--cui-secondary-color);\n  opacity: 0.5;\n}\n.smaller[_ngcontent-%COMP%]   .empty-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n}\n.teams-table[_ngcontent-%COMP%] {\n  width: 100%;\n  background-color: var(--cui-card-bg);\n}\n.c-dark-theme[_nghost-%COMP%]   .teams-table[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .teams-table[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n}\n.team-icon-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 40px;\n  height: 40px;\n  border-radius: 8px;\n  background-color: var(--cui-primary);\n}\n.team-icon[_ngcontent-%COMP%] {\n  color: white;\n  font-weight: 600;\n  font-size: 1rem;\n}\n.team-name[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--cui-body-color);\n}\n.team-id[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--cui-secondary-color);\n  margin-top: 0.25rem;\n}\n.small-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n}\n.team-members-count[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--cui-secondary-color);\n  display: flex;\n  align-items: center;\n}\n.view-members-btn[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  padding: 0.25rem 0.5rem;\n}\n.members-list[_ngcontent-%COMP%] {\n  background-color: var(--cui-tertiary-bg);\n  border-radius: var(--border-radius);\n  padding: 0.75rem;\n  max-height: 150px;\n  overflow-y: auto;\n}\n.member-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0.375rem 0;\n  font-size: 0.875rem;\n  color: var(--cui-body-color);\n}\n.member-item[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid var(--cui-border-color);\n}\n.cloud-subs-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0.375rem 0.75rem;\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n}\n.action-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border-radius: 6px;\n  transition: all var(--transition-speed) ease;\n}\n.action-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n.modal-form[_ngcontent-%COMP%] {\n  padding: 0.5rem;\n}\n.form-section[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.section-title[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n  font-weight: 600;\n  color: var(--cui-body-color);\n  position: relative;\n  display: inline-block;\n}\n.section-title[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: -5px;\n  left: 0;\n  width: 40px;\n  height: 3px;\n  background-color: var(--cui-primary);\n  border-radius: 2px;\n}\n.input-icon[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--cui-secondary-color);\n}\n.input-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n.custom-select[_ngcontent-%COMP%] {\n  appearance: auto;\n  background-color: var(--cui-input-bg);\n  color: var(--cui-body-color);\n  border-color: var(--cui-input-border-color);\n}\n.custom-select[_ngcontent-%COMP%]:focus {\n  border-color: var(--cui-primary);\n  box-shadow: 0 0 0 0.25rem rgba(var(--cui-primary-rgb), 0.25);\n}\n.invalid-feedback[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  margin-top: -0.5rem;\n  margin-bottom: 0.75rem;\n}\n.users-dropdown[_ngcontent-%COMP%] {\n  max-height: 200px;\n  overflow-y: auto;\n  margin-bottom: 1.5rem;\n  border: 1px solid var(--cui-border-color);\n  border-radius: var(--border-radius);\n  background-color: var(--cui-card-bg);\n}\n.users-list[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.user-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 0.75rem 1rem;\n  cursor: pointer;\n  transition: background-color var(--transition-speed) ease;\n}\n.user-item[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid var(--cui-border-color);\n}\n.user-item[_ngcontent-%COMP%]:hover {\n  background-color: var(--cui-tertiary-bg);\n}\n.no-results[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  text-align: center;\n  color: var(--cui-secondary-color);\n}\n.selected-users[_ngcontent-%COMP%] {\n  padding: 1rem;\n  background-color: var(--cui-tertiary-bg);\n  border-radius: var(--border-radius);\n}\n.selected-title[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 600;\n  margin-bottom: 0.75rem;\n  color: var(--cui-body-color);\n}\n.no-users-message[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  padding: 0.5rem 0;\n}\n.users-badges[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.user-badge[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  background-color: var(--cui-primary);\n  color: white;\n  border-radius: 20px;\n  padding: 0.25rem 0.75rem;\n  font-size: 0.875rem;\n}\n.user-badge[_ngcontent-%COMP%]   .user-name[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n.user-badge[_ngcontent-%COMP%]   .btn-close[_ngcontent-%COMP%] {\n  width: 0.75rem;\n  height: 0.75rem;\n  margin-left: 0.25rem;\n}\n.user-badge[_ngcontent-%COMP%]   .btn-close[_ngcontent-%COMP%]:focus {\n  box-shadow: none;\n}\n.subscription-add-section[_ngcontent-%COMP%], \n.subscription-list-section[_ngcontent-%COMP%] {\n  padding: 1.25rem;\n  background-color: var(--cui-tertiary-bg);\n  border-radius: var(--border-radius);\n  margin-bottom: 1.5rem;\n}\n.active-subscriptions[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.subscription-item[_ngcontent-%COMP%] {\n  padding: 0.875rem;\n  background-color: var(--cui-card-bg);\n  border-radius: var(--border-radius);\n  margin-bottom: 0.75rem;\n  transition: transform var(--transition-speed), box-shadow var(--transition-speed);\n  border: 1px solid var(--cui-border-color);\n}\n.subscription-item[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: var(--card-shadow);\n}\n.subscription-icon[_ngcontent-%COMP%] {\n  color: var(--cui-primary);\n}\n.subscription-name[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--cui-body-color);\n}\n.toast-notification[_ngcontent-%COMP%] {\n  min-width: 300px;\n  border-radius: var(--border-radius);\n}\n.toast-notification[_ngcontent-%COMP%]   .toast-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n}\n.toast-notification[_ngcontent-%COMP%]   .toast-icon.success[_ngcontent-%COMP%] {\n  color: var(--cui-success);\n}\n.toast-notification[_ngcontent-%COMP%]   .toast-icon.danger[_ngcontent-%COMP%] {\n  color: var(--cui-danger);\n}\n.toast-notification[_ngcontent-%COMP%]   .toast-icon.info[_ngcontent-%COMP%] {\n  color: var(--cui-info);\n}\n.c-dark-theme[_nghost-%COMP%]   .stat-card[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .stat-card[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .main-card[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .main-card[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .subscription-item[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .subscription-item[_ngcontent-%COMP%] {\n  background-color: var(--cui-card-bg);\n  border-color: var(--cui-card-border-color);\n}\n.c-dark-theme[_nghost-%COMP%]   .empty-icon[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .empty-icon[_ngcontent-%COMP%] {\n  color: var(--cui-secondary-color);\n}\n.c-dark-theme[_nghost-%COMP%]   .team-name[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .team-name[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .stat-value[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .stat-value[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .page-title[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .page-title[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .section-title[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  color: var(--cui-body-color);\n}\n.c-dark-theme[_nghost-%COMP%]   .team-id[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .team-id[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .stat-label[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .stat-label[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .team-members-count[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .team-members-count[_ngcontent-%COMP%] {\n  color: var(--cui-secondary-color);\n}\n.c-dark-theme[_nghost-%COMP%]   .search-input[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .search-input[_ngcontent-%COMP%], \n.c-dark-theme[_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%], .c-dark-theme   [_nghost-%COMP%]   .custom-select[_ngcontent-%COMP%] {\n  background-color: var(--cui-input-bg);\n  color: var(--cui-input-color);\n}\n/*# sourceMappingURL=manage-teams.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ManageTeamsComponent, { className: "ManageTeamsComponent" });
})();

// src/app/views/manage-teams/routes.ts
var routes = [
  {
    path: "",
    component: ManageTeamsComponent,
    data: {
      title: "Manage Teams"
    }
  }
];
export {
  routes
};
//# sourceMappingURL=routes-YYNWOCP7.js.map
