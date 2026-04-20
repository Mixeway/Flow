import {
  UserService
} from "./chunk-RX57R3D6.js";
import {
  SettingsService
} from "./chunk-T5O4OQUQ.js";
import {
  AppConfigService
} from "./chunk-AG7WUCT3.js";
import {
  NgxDatatableModule
} from "./chunk-OFWBTEIP.js";
import {
  AuthService
} from "./chunk-YFWDZ3VL.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  RequiredValidator,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-MENGJYBG.js";
import "./chunk-YLFWSDV3.js";
import {
  BadgeComponent,
  ButtonCloseDirective,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  DatePipe,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormFeedbackComponent,
  FormLabelDirective,
  FormSelectDirective,
  GutterDirective,
  HttpClient,
  IconDirective,
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
  RowDirective,
  TabDirective,
  TabPanelComponent,
  TableDirective,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
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
  ɵɵpipe,
  ɵɵpipeBind2,
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
import "./chunk-4MWRP73S.js";

// src/app/service/OrganizationService.ts
var OrganizationService = class _OrganizationService {
  constructor(http) {
    this.http = http;
    this.baseUrl = "/api/v1/admin/organizations";
  }
  getAllOrganizations() {
    return this.http.get(`${this.baseUrl}`);
  }
  getOrganization(id) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  createOrganization(organization) {
    return this.http.post(`${this.baseUrl}`, organization);
  }
  updateOrganization(organization) {
    return this.http.put(`${this.baseUrl}/${organization.id}`, organization);
  }
  deleteOrganization(id) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  getOrganizationTeams(id) {
    return this.http.get(`${this.baseUrl}/${id}/teams`);
  }
  getOrganizationUsers(id) {
    return this.http.get(`${this.baseUrl}/${id}/users`);
  }
  getOrganizationAdmin(id) {
    return this.http.get(`${this.baseUrl}/${id}/admin`);
  }
  static {
    this.\u0275fac = function OrganizationService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _OrganizationService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OrganizationService, factory: _OrganizationService.\u0275fac, providedIn: "root" });
  }
};

// src/app/views/admin-settings/admin-settings.component.ts
function AdminSettingsComponent_div_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 140)(1, "div", 119)(2, "label", 141);
    \u0275\u0275text(3, "Dependency Track URL");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 142);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 119)(6, "label", 143);
    \u0275\u0275text(7, "API Key");
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "input", 144);
    \u0275\u0275elementEnd()();
  }
}
function AdminSettingsComponent_div_100_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 145)(1, "div", 119)(2, "label", 146);
    \u0275\u0275text(3, "Client ID");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 147);
    \u0275\u0275elementStart(5, "c-form-feedback", 69);
    \u0275\u0275text(6, "Please provide a valid Client ID.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 119)(8, "label", 148);
    \u0275\u0275text(9, "Secret");
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "input", 149);
    \u0275\u0275elementStart(11, "c-form-feedback", 69);
    \u0275\u0275text(12, "Please provide a valid Secret.");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(5);
    \u0275\u0275property("valid", false);
    \u0275\u0275advance(6);
    \u0275\u0275property("valid", false);
  }
}
function AdminSettingsComponent_div_127_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 150)(1, "div", 151)(2, "div", 152)(3, "label", 153);
    \u0275\u0275text(4, "SMTP Host");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 154);
    \u0275\u0275elementStart(6, "c-form-feedback", 69);
    \u0275\u0275text(7, "Please provide a valid SMTP host.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 152)(9, "label", 155);
    \u0275\u0275text(10, "SMTP Port");
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "input", 156);
    \u0275\u0275elementStart(12, "c-form-feedback", 69);
    \u0275\u0275text(13, "Please provide a valid SMTP port.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 151)(15, "div", 152)(16, "label", 157);
    \u0275\u0275text(17, "SMTP Username");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "input", 158);
    \u0275\u0275elementStart(19, "c-form-feedback", 69);
    \u0275\u0275text(20, "Please provide a valid username.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 152)(22, "label", 159);
    \u0275\u0275text(23, "SMTP Password");
    \u0275\u0275elementEnd();
    \u0275\u0275element(24, "input", 160);
    \u0275\u0275elementStart(25, "c-form-feedback", 69);
    \u0275\u0275text(26, "Please provide a valid password.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div", 161)(28, "div", 63)(29, "c-form-check", 18);
    \u0275\u0275element(30, "input", 162);
    \u0275\u0275elementStart(31, "label", 163);
    \u0275\u0275text(32, "TLS");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "div", 63)(34, "c-form-check", 31);
    \u0275\u0275element(35, "input", 164);
    \u0275\u0275elementStart(36, "label", 165);
    \u0275\u0275text(37, "STARTTLS");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275property("valid", false);
    \u0275\u0275advance(6);
    \u0275\u0275property("valid", false);
    \u0275\u0275advance(7);
    \u0275\u0275property("valid", false);
    \u0275\u0275advance(6);
    \u0275\u0275property("valid", false);
    \u0275\u0275advance(4);
    \u0275\u0275property("switch", true);
    \u0275\u0275advance(5);
    \u0275\u0275property("switch", true);
  }
}
function AdminSettingsComponent_tr_191_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "c-badge", 80);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td")(16, "c-badge", 80);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td")(19, "div", 166)(20, "button", 167);
    \u0275\u0275listener("click", function AdminSettingsComponent_tr_191_Template_button_click_20_listener() {
      const org_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.editOrganization(org_r2));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(21, "svg", 168);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(22, "button", 169);
    \u0275\u0275listener("click", function AdminSettingsComponent_tr_191_Template_button_click_22_listener() {
      const org_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.confirmDeleteOrganization(org_r2));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(23, "svg", 170);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(24, "button", 171);
    \u0275\u0275listener("click", function AdminSettingsComponent_tr_191_Template_button_click_24_listener() {
      const org_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.viewOrganizationDetails(org_r2));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(25, "svg", 172);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const org_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(org_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275property("color", ctx_r2.getPlanBadgeColor(org_r2.planType));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", org_r2.planType, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(8, 10, org_r2.createdDate, "medium"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", org_r2.teamCount, " / ", ctx_r2.getPlanTeamLimit(org_r2.planType), "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(org_r2.repoCount);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(org_r2.userCount);
    \u0275\u0275advance(2);
    \u0275\u0275property("color", org_r2.active ? "success" : "danger");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", org_r2.active ? "Active" : "Inactive", " ");
  }
}
function AdminSettingsComponent_tr_192_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 173);
    \u0275\u0275text(2, "No organizations found");
    \u0275\u0275elementEnd()();
  }
}
function AdminSettingsComponent_div_288_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 137);
    \u0275\u0275text(1, " Organization name is required ");
    \u0275\u0275elementEnd();
  }
}
function AdminSettingsComponent_option_305_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 174);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r4 = ctx.$implicit;
    \u0275\u0275property("value", user_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(user_r4.username);
  }
}
function AdminSettingsComponent_div_306_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 137);
    \u0275\u0275text(1, " Admin user is required ");
    \u0275\u0275elementEnd();
  }
}
function AdminSettingsComponent_c_modal_body_339_tr_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const team_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(team_r5.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", team_r5.repoCount, " / ", ctx_r2.getPlanRepoLimit(ctx_r2.selectedOrg.planType), "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(team_r5.userCount);
  }
}
function AdminSettingsComponent_c_modal_body_339_tr_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 179);
    \u0275\u0275text(2, "No teams found");
    \u0275\u0275elementEnd()();
  }
}
function AdminSettingsComponent_c_modal_body_339_tr_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const user_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r6.username);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r6.highestRole);
  }
}
function AdminSettingsComponent_c_modal_body_339_tr_79_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 180);
    \u0275\u0275text(2, "No users found");
    \u0275\u0275elementEnd()();
  }
}
function AdminSettingsComponent_c_modal_body_339_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "c-modal-body")(1, "div", 151)(2, "div", 63)(3, "h6", 175);
    \u0275\u0275text(4, "General Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 176)(6, "table", 177)(7, "tbody")(8, "tr")(9, "th");
    \u0275\u0275text(10, "Organization ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "tr")(14, "th");
    \u0275\u0275text(15, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "tr")(19, "th");
    \u0275\u0275text(20, "Created");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td");
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "tr")(25, "th");
    \u0275\u0275text(26, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "td")(28, "c-badge", 80);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()()()()()()();
    \u0275\u0275elementStart(30, "div", 63)(31, "h6", 175);
    \u0275\u0275text(32, "Subscription Details");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 176)(34, "table", 177)(35, "tbody")(36, "tr")(37, "th");
    \u0275\u0275text(38, "Plan");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "td")(40, "c-badge", 80);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(42, "tr")(43, "th");
    \u0275\u0275text(44, "Team Limit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "td");
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "tr")(48, "th");
    \u0275\u0275text(49, "Repository Limit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "td");
    \u0275\u0275text(51);
    \u0275\u0275elementEnd()()()()()()();
    \u0275\u0275elementStart(52, "h6", 178);
    \u0275\u0275text(53, "Teams");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "div", 176)(55, "table", 177)(56, "thead", 76)(57, "tr")(58, "th");
    \u0275\u0275text(59, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "th");
    \u0275\u0275text(61, "Repositories");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "th");
    \u0275\u0275text(63, "Users");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(64, "tbody");
    \u0275\u0275template(65, AdminSettingsComponent_c_modal_body_339_tr_65_Template, 7, 4, "tr", 77)(66, AdminSettingsComponent_c_modal_body_339_tr_66_Template, 3, 0, "tr", 78);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(67, "h6", 178);
    \u0275\u0275text(68, "Users");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "div", 176)(70, "table", 177)(71, "thead", 76)(72, "tr")(73, "th");
    \u0275\u0275text(74, "Username");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(75, "th");
    \u0275\u0275text(76, "Role");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(77, "tbody");
    \u0275\u0275template(78, AdminSettingsComponent_c_modal_body_339_tr_78_Template, 5, 2, "tr", 77)(79, AdminSettingsComponent_c_modal_body_339_tr_79_Template, 3, 0, "tr", 78);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(ctx_r2.selectedOrg.id);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.selectedOrg.name);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(23, 15, ctx_r2.selectedOrg.createdDate, "medium"));
    \u0275\u0275advance(6);
    \u0275\u0275property("color", ctx_r2.selectedOrg.active ? "success" : "danger");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.selectedOrg.active ? "Active" : "Inactive", " ");
    \u0275\u0275advance(11);
    \u0275\u0275property("color", ctx_r2.getPlanBadgeColor(ctx_r2.selectedOrg.planType));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.selectedOrg.planType, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", ctx_r2.selectedOrg.teamCount, " / ", ctx_r2.getPlanTeamLimit(ctx_r2.selectedOrg.planType), "");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", ctx_r2.selectedOrg.repoCount, " / ", ctx_r2.getPlanRepoLimit(ctx_r2.selectedOrg.planType) * ctx_r2.getPlanTeamLimit(ctx_r2.selectedOrg.planType), "");
    \u0275\u0275advance(14);
    \u0275\u0275property("ngForOf", ctx_r2.selectedOrgTeams);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.selectedOrgTeams || ctx_r2.selectedOrgTeams.length === 0);
    \u0275\u0275advance(12);
    \u0275\u0275property("ngForOf", ctx_r2.selectedOrgUsers);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.selectedOrgUsers || ctx_r2.selectedOrgUsers.length === 0);
  }
}
var AdminSettingsComponent = class _AdminSettingsComponent {
  constructor(fb, authService, settingsService, router, organizationService, appConfigService, userService) {
    this.fb = fb;
    this.authService = authService;
    this.settingsService = settingsService;
    this.router = router;
    this.organizationService = organizationService;
    this.appConfigService = appConfigService;
    this.userService = userService;
    this.softwareComponent = "embedded";
    this.isEmbededDTChecked = true;
    this.isExternalDTChecked = false;
    this.isOtherSCAChecked = false;
    this.dependencyTrackUrl = "";
    this.apiKey = "";
    this.sast = "bearer";
    this.iac = "kics";
    this.secretsLeakage = "gitleaks";
    this.dast = "dast";
    this.smtpEnabled = false;
    this.smtpHost = "";
    this.smtpPort = null;
    this.smtpUsername = "";
    this.smtpPassword = "";
    this.smtpTls = false;
    this.smtpStartTls = false;
    this.customStylesValidated = false;
    this.isWizEnabled = false;
    this.organizations = [];
    this.availableUsers = [];
    this.selectedOrg = null;
    this.selectedOrgTeams = [];
    this.selectedOrgUsers = [];
    this.orgModalVisible = false;
    this.deleteModalVisible = false;
    this.detailsModalVisible = false;
    this.editMode = false;
    this.appRunMode = "SAAS";
    this.authType = "userPass";
    this.geminiApiKey = "API Key";
    this.ollamaEnabled = false;
    this.ollamaBaseUrl = "http://localhost:11434";
    this.ollamaModel = "";
    this.ollamaTimeoutSeconds = 120;
    this.ollamaFpAnalysisEnabled = false;
    this.ollamaFpBatchSize = 5;
    this.ollamaConnectionOk = null;
    this.position = "top-end";
    this.visible = false;
    this.percentage = 0;
    this.toastMessage = "";
    this.toastStatus = "";
    this.scaConfigForm = this.fb.group({
      scaTypeEmbedded: [true],
      scaTypeExternal: [false],
      scaApiUrl: [""],
      scaApiKey: [""]
    });
    this.smtpConfigForm = this.fb.group({
      enabled: [false],
      hostname: [""],
      port: [587],
      username: [""],
      password: [""],
      tls: [false],
      startls: [false]
    });
    this.wizConfigForm = this.fb.group({
      enabled: [false],
      clientId: [""],
      secret: [""]
    });
    this.organizationForm = this.fb.group({
      id: [null],
      name: ["", Validators.required],
      planType: ["FREE"],
      adminUserId: ["", Validators.required],
      active: [true]
    });
  }
  ngOnInit() {
    this.authService.hcAdmin().subscribe({
      next: () => {
      },
      error: () => {
        this.router.navigate(["/login"]);
      }
    });
    this.loadSettings();
    this.loadOrganizations();
    this.loadAvailableUsers();
    this.loadAppRunMode();
  }
  onWizToggleChange() {
    this.isWizEnabled = !this.isWizEnabled;
    this.wizConfigForm.patchValue({ enabled: this.isWizEnabled });
  }
  configWiz() {
    if (this.wizConfigForm.valid) {
      this.settingsService.changeWiz(this.wizConfigForm.value).subscribe({
        next: (response) => {
          this.toastStatus = "success";
          this.toastMessage = "Successfully changed Wiz Scanner Settings";
          this.toggleToast();
        },
        error: (error) => {
          this.toastStatus = "danger";
          this.toastMessage = "Problem changing configuration for Wiz Scanner. Please check your inputs.";
          this.toggleToast();
        }
      });
    }
  }
  changeEmbededDT() {
    this.isEmbededDTChecked = true;
    this.scaConfigForm.patchValue({ scaTypeEmbedded: true });
    this.scaConfigForm.patchValue({ scaTypeExternal: false });
    this.isExternalDTChecked = false;
    this.dependencyTrackUrl = "";
    this.apiKey = "";
  }
  changeExternalDT() {
    this.isExternalDTChecked = true;
    this.isEmbededDTChecked = false;
    this.scaConfigForm.patchValue({ scaTypeEmbedded: false });
    this.scaConfigForm.patchValue({ scaTypeExternal: true });
  }
  onSastChange(component) {
    this.sast = component;
  }
  onDastChange(component) {
    this.dast = component;
  }
  onIacChange(component) {
    this.iac = component;
  }
  onSecretsLeakageChange(component) {
    this.secretsLeakage = component;
  }
  onSmtpToggleChange() {
    this.smtpEnabled = !this.smtpEnabled;
    this.smtpConfigForm.patchValue({ enabled: this.smtpEnabled });
  }
  configSca() {
    if (this.scaConfigForm.valid) {
      this.settingsService.changeSca(this.scaConfigForm.value).subscribe({
        next: (response) => {
          this.toastStatus = "success";
          this.toastMessage = "Successfully changed SCA Settings";
          this.toggleToast();
        },
        error: (error) => {
          this.toastStatus = "danger";
          this.toastMessage = "Problem changing configuration for SCA. One of the options should be set.";
          this.toggleToast();
        }
      });
    }
  }
  sonfigSMTP() {
    if (this.smtpConfigForm.valid) {
      this.settingsService.changeSmtp(this.smtpConfigForm.value).subscribe({
        next: (response) => {
          this.toastStatus = "success";
          this.toastMessage = "Successfully changed SMTP Settings";
          this.toggleToast();
        },
        error: (error) => {
          this.toastStatus = "danger";
          this.toastMessage = "Problem changing configuration for SMTP. One of the options should be set.";
          this.toggleToast();
        }
      });
    }
  }
  loadSettings() {
    this.settingsService.get().subscribe({
      next: (response) => {
        this.settings = response;
        this.scaConfigForm.patchValue({ scaTypeEmbedded: this.settings.scaModeEmbeded });
        this.scaConfigForm.patchValue({ scaTypeExternal: this.settings.scaModeExternal });
        this.scaConfigForm.patchValue({ scaApiUrl: this.settings.scaApiUrl });
        this.scaConfigForm.patchValue({ scaApiKey: "************" });
        this.smtpConfigForm.patchValue({ enabled: this.settings.enableSmtp });
        this.smtpConfigForm.patchValue({ hostname: this.settings.smtpHostname });
        this.smtpConfigForm.patchValue({ port: this.settings.smtpPort });
        this.smtpConfigForm.patchValue({ username: this.settings.smtpUsername });
        this.smtpConfigForm.patchValue({ password: "************" });
        this.smtpConfigForm.patchValue({ tls: this.settings.smtpTls });
        this.smtpConfigForm.patchValue({ startls: this.settings.smtpStarttls });
        this.smtpEnabled = this.settings.enableSmtp;
        this.isExternalDTChecked = this.settings.scaModeExternal;
        this.wizConfigForm.patchValue({ enabled: this.settings.enableWiz });
        this.wizConfigForm.patchValue({ clientId: this.settings.wizClientId });
        this.wizConfigForm.patchValue({ secret: "************" });
        this.isWizEnabled = this.settings.enableWiz;
        this.geminiApiKey = this.settings.geminiApiKey;
        this.ollamaEnabled = !!this.settings.ollamaEnabled;
        this.ollamaBaseUrl = this.settings.ollamaBaseUrl || "http://localhost:11434";
        this.ollamaModel = this.settings.ollamaModel ?? "";
        this.ollamaTimeoutSeconds = this.settings.ollamaTimeoutSeconds ?? 120;
        this.ollamaFpAnalysisEnabled = !!this.settings.ollamaFpAnalysisEnabled;
        this.ollamaFpBatchSize = this.settings.ollamaFpBatchSize ?? 5;
        this.probeOllamaOnLoad();
      }
    });
  }
  probeOllamaOnLoad() {
    this.settingsService.testOllamaConnection({}).subscribe({
      next: (r) => {
        this.ollamaConnectionOk = !!r?.ok;
      },
      error: () => {
        this.ollamaConnectionOk = false;
      }
    });
  }
  testOllamaConnection() {
    this.settingsService.testOllamaConnection({ baseUrl: this.ollamaBaseUrl }).subscribe({
      next: (r) => {
        this.ollamaConnectionOk = !!r?.ok;
        this.toastStatus = r?.ok ? "success" : "warning";
        this.toastMessage = r?.ok ? "Ollama OK. Models: " + (r.models?.length ?? 0) : r?.message || "Could not reach Ollama";
        this.toggleToast();
      },
      error: () => {
        this.ollamaConnectionOk = false;
        this.toastStatus = "danger";
        this.toastMessage = "Ollama connection test failed";
        this.toggleToast();
      }
    });
  }
  saveOllamaSettings() {
    this.settingsService.changeOllama({
      ollamaEnabled: this.ollamaEnabled,
      ollamaBaseUrl: this.ollamaBaseUrl,
      ollamaModel: this.ollamaModel,
      ollamaTimeoutSeconds: this.ollamaTimeoutSeconds,
      ollamaFpAnalysisEnabled: this.ollamaFpAnalysisEnabled,
      ollamaFpBatchSize: this.ollamaFpBatchSize
    }).subscribe({
      next: () => {
        this.toastStatus = "success";
        this.toastMessage = "Ollama settings saved";
        this.toggleToast();
        this.probeOllamaOnLoad();
      },
      error: () => {
        this.toastStatus = "danger";
        this.toastMessage = "Failed to save Ollama settings";
        this.toggleToast();
      }
    });
  }
  toggleToast() {
    this.visible = !this.visible;
  }
  onVisibleChange($event) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }
  // Organizations Management Methods
  loadOrganizations() {
    this.organizationService.getAllOrganizations().subscribe({
      next: (data) => {
        this.organizations = data;
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = "Failed to load organizations";
        this.toggleToast();
      }
    });
  }
  loadAvailableUsers() {
    this.userService.get().subscribe({
      next: (data) => {
        this.availableUsers = data;
      },
      error: (error) => {
        console.error("Failed to load users:", error);
      }
    });
  }
  loadAppRunMode() {
    this.appConfigService.getRunMode().subscribe({
      next: (data) => {
        this.appRunMode = data;
      },
      error: (error) => {
        console.error("Failed to load run mode:", error);
      }
    });
  }
  openNewOrgModal() {
    this.editMode = false;
    this.organizationForm.reset({
      planType: "FREE",
      active: true
    });
    this.orgModalVisible = true;
  }
  editOrganization(org) {
    this.editMode = true;
    this.selectedOrg = org;
    this.organizationService.getOrganizationAdmin(org.id).subscribe({
      next: (user) => {
        this.organizationForm.patchValue({
          id: org.id,
          name: org.name,
          planType: org.planType,
          adminUserId: user ? user.id : "",
          active: org.active
        });
        this.orgModalVisible = true;
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = "Failed to load organization admin";
        this.toggleToast();
      }
    });
  }
  saveOrganization() {
    if (this.organizationForm.valid) {
      const orgData = this.organizationForm.value;
      if (this.editMode) {
        this.organizationService.updateOrganization(orgData).subscribe({
          next: () => {
            this.orgModalVisible = false;
            this.loadOrganizations();
            this.toastStatus = "success";
            this.toastMessage = "Organization updated successfully";
            this.toggleToast();
          },
          error: (error) => {
            this.toastStatus = "danger";
            this.toastMessage = "Failed to update organization";
            this.toggleToast();
          }
        });
      } else {
        this.organizationService.createOrganization(orgData).subscribe({
          next: () => {
            this.orgModalVisible = false;
            this.loadOrganizations();
            this.toastStatus = "success";
            this.toastMessage = "Organization created successfully";
            this.toggleToast();
          },
          error: (error) => {
            this.toastStatus = "danger";
            this.toastMessage = "Failed to create organization";
            this.toggleToast();
          }
        });
      }
    }
  }
  confirmDeleteOrganization(org) {
    this.selectedOrg = org;
    this.deleteModalVisible = true;
  }
  deleteOrganization() {
    if (this.selectedOrg) {
      this.organizationService.deleteOrganization(this.selectedOrg.id).subscribe({
        next: () => {
          this.deleteModalVisible = false;
          this.loadOrganizations();
          this.toastStatus = "success";
          this.toastMessage = "Organization deleted successfully";
          this.toggleToast();
        },
        error: (error) => {
          this.toastStatus = "danger";
          this.toastMessage = "Failed to delete organization";
          this.toggleToast();
        }
      });
    }
  }
  viewOrganizationDetails(org) {
    this.selectedOrg = org;
    this.organizationService.getOrganizationTeams(org.id).subscribe({
      next: (teams) => {
        this.selectedOrgTeams = teams;
      },
      error: (error) => {
        console.error("Failed to load teams:", error);
      }
    });
    this.organizationService.getOrganizationUsers(org.id).subscribe({
      next: (users) => {
        this.selectedOrgUsers = users;
      },
      error: (error) => {
        console.error("Failed to load users:", error);
      }
    });
    this.detailsModalVisible = true;
  }
  // Helper methods for organization display
  getPlanBadgeColor(planType) {
    switch (planType) {
      case "FREE":
        return "secondary";
      case "SMALL_COMPANY":
        return "primary";
      case "ENTERPRISE":
        return "success";
      default:
        return "info";
    }
  }
  getPlanTeamLimit(planType) {
    switch (planType) {
      case "FREE":
        return 1;
      case "SMALL_COMPANY":
        return 5;
      case "ENTERPRISE":
        return 999999;
      default:
        return 0;
    }
  }
  getPlanRepoLimit(planType) {
    switch (planType) {
      case "FREE":
        return 5;
      case "SMALL_COMPANY":
        return 10;
      case "ENTERPRISE":
        return 999999;
      default:
        return 0;
    }
  }
  // Run Mode management
  changeRunMode(mode) {
    this.appRunMode = mode;
  }
  saveRunMode() {
    this.appConfigService.setRunMode(this.appRunMode).subscribe({
      next: () => {
        this.toastStatus = "success";
        this.toastMessage = "Application run mode updated successfully";
        this.toggleToast();
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = "Failed to update run mode";
        this.toggleToast();
      }
    });
  }
  saveOtherConfigurationSettings() {
    this.settingsService.changeOtherConfig({
      geminiApiKey: this.geminiApiKey
    }).subscribe({
      next: () => {
        this.toastStatus = "success";
        this.toastMessage = "Application configuration updated successfully";
        this.toggleToast();
      },
      error: (error) => {
        this.toastStatus = "danger";
        this.toastMessage = "Failed to update";
        this.toggleToast();
      }
    });
  }
  static {
    this.\u0275fac = function AdminSettingsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AdminSettingsComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(SettingsService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(OrganizationService), \u0275\u0275directiveInject(AppConfigService), \u0275\u0275directiveInject(UserService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminSettingsComponent, selectors: [["app-admin-settings"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 343, vars: 83, consts: [["xmlns", "http://www.w3.org/1999/html"], [1, "xs-12"], [1, "admin-card"], [3, "activeItemKey"], ["variant", "underline-border", 1, "border-bottom"], ["cTab", "", 1, "d-flex", "align-items-center", 3, "itemKey"], ["cIcon", "", "name", "cil-bug", 1, "me-2"], ["cIcon", "", "name", "cil-envelope-closed", 1, "me-2"], ["cIcon", "", "name", "cil-contact", 1, "me-2"], ["cIcon", "", "name", "cil-building", 1, "me-2"], ["cIcon", "", "name", "cil-settings", 1, "me-2"], ["cIcon", "", "name", "cil-code", 1, "me-2"], [1, "p-4", 3, "itemKey"], [1, "scanner-sections"], [1, "config-section", "p-4", "mb-4", "rounded", "shadow-sm"], [1, "mb-3", "section-title"], ["novalidate", "", "cForm", "", "cRow", "", 1, "needs-validation", 3, "gutter", "formGroup"], [1, "sca-options", "mb-4"], [1, "mb-3", 3, "switch"], ["cFormCheckInput", "", "id", "embedded", "formControlName", "scaTypeEmbedded", "type", "checkbox", 3, "change", "checked"], ["cFormCheckLabel", "", "for", "embedded", 1, "ms-2"], ["cFormCheckInput", "", "id", "external", "formControlName", "scaTypeExternal", "type", "checkbox", 3, "change", "checked"], ["cFormCheckLabel", "", "for", "external", 1, "ms-2"], ["class", "external-dt-config p-3 border rounded config-input-section", 4, "ngIf"], ["cFormCheckInput", "", "id", "otherTool", "type", "checkbox", "disabled", ""], ["cFormCheckLabel", "", "for", "otherTool", 1, "ms-2", "text-muted"], [1, "badge", "bg-secondary", "ms-2"], ["cButton", "", "color", "primary", "type", "submit", 1, "mt-3", 3, "click"], [1, "sast-options"], ["cFormCheckInput", "", "id", "bearer", "name", "sast", "type", "checkbox", "disabled", "", 3, "ngModelChange", "change", "ngModel", "checked"], ["cFormCheckLabel", "", "for", "bearer", 1, "ms-2"], [3, "switch"], ["cFormCheckInput", "", "id", "sastOtherTool", "name", "sast", "type", "checkbox", "disabled", ""], ["cFormCheckLabel", "", "for", "sastOtherTool", 1, "ms-2", "text-muted"], [1, "iac-options"], ["cFormCheckInput", "", "id", "kics", "name", "iac", "type", "checkbox", "disabled", "", 3, "ngModelChange", "change", "ngModel", "checked"], ["cFormCheckLabel", "", "for", "kics", 1, "ms-2"], ["cFormCheckInput", "", "id", "iacOtherTool", "name", "iac", "type", "checkbox", "disabled", ""], ["cFormCheckLabel", "", "for", "iacOtherTool", 1, "ms-2", "text-muted"], [1, "secrets-options"], ["cFormCheckInput", "", "id", "gitleaks", "name", "secretsLeakage", "type", "checkbox", "disabled", "", 3, "ngModelChange", "change", "ngModel", "checked"], ["cFormCheckLabel", "", "for", "gitleaks", 1, "ms-2"], ["cFormCheckInput", "", "id", "secretsOtherTool", "name", "secretsLeakage", "type", "checkbox", "disabled", ""], ["cFormCheckLabel", "", "for", "secretsOtherTool", 1, "ms-2", "text-muted"], [1, "wiz-options", "mb-4"], ["cFormCheckInput", "", "id", "wizEnabled", "formControlName", "enabled", "type", "checkbox", 3, "change", "checked"], ["cFormCheckLabel", "", "for", "wizEnabled", 1, "ms-2"], ["class", "wiz-config p-3 border rounded config-input-section", 4, "ngIf"], [1, "dast-options"], ["cFormCheckInput", "", "id", "dast", "name", "dast", "type", "checkbox", "disabled", "", 3, "ngModelChange", "change", "ngModel", "checked"], ["cFormCheckLabel", "", "for", "dast", 1, "ms-2"], ["cFormCheckInput", "", "id", "dastOtherTool", "name", "dast", "type", "checkbox", "disabled", ""], ["cFormCheckLabel", "", "for", "dastOtherTool", 1, "ms-2", "text-muted"], [1, "notification-sections"], [1, "mb-4", 3, "switch"], ["formControlName", "enabled", "cFormCheckInput", "", "id", "smtpToggle", "type", "checkbox", 3, "change"], ["cFormCheckLabel", "", "for", "smtpToggle", 1, "ms-2"], ["class", "smtp-config p-3 border rounded config-input-section", 4, "ngIf"], ["cButton", "", "color", "primary", "type", "submit", 1, "mt-4", 3, "click"], [1, "config-section", "p-4", "rounded", "shadow-sm"], [1, "notification-options"], ["cFormCheckInput", "", "disabled", "", "type", "checkbox"], ["cFormCheckLabel", "", 1, "ms-2", "text-muted"], [1, "col-md-6"], ["cLabel", "", "for", "authType", 1, "mb-2"], ["cSelect", "", "id", "authType", "required", "", 1, "form-select", 3, "ngModelChange", "ngModel"], ["value", "userPass", "selected", ""], ["value", "sso", "disabled", ""], [1, "text-muted"], [3, "valid"], [1, "d-flex", "justify-content-between", "mb-4", "flex-wrap"], [1, "mb-3", "mb-sm-0", "section-title"], ["cButton", "", "color", "primary", 3, "click"], ["cIcon", "", "name", "cil-plus", 1, "me-2"], [1, "table-responsive", "table-container"], ["cTable", "", 1, "align-middle", "table-striped"], [1, "table-header"], [4, "ngFor", "ngForOf"], [4, "ngIf"], [1, "mb-4"], [3, "color"], [1, "d-flex", "flex-column", "flex-md-row"], [1, "me-0", "me-md-4", "mb-3", "mb-md-0"], ["cFormCheckInput", "", "id", "standaloneMode", "type", "radio", "name", "runMode", 3, "change", "checked"], ["cFormCheckLabel", "", "for", "standaloneMode"], [1, "text-muted", "small"], ["cFormCheckInput", "", "id", "saasMode", "type", "radio", "name", "runMode", 3, "change", "checked"], ["cFormCheckLabel", "", "for", "saasMode"], ["cButton", "", "color", "primary", 1, "mt-3", 3, "click"], ["cLabel", "", "for", "geminiApiKey", 1, "mb-2"], ["id", "geminiApiKey", "required", "", "type", "text", "placeholder", "Enter Gemini API key", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "d-flex", "align-items-center", "gap-3", "mb-3", "flex-wrap"], ["switch", ""], ["cFormCheckInput", "", "id", "ollamaEnabled", "type", "checkbox", 3, "ngModelChange", "ngModel"], ["cFormCheckLabel", "", "for", "ollamaEnabled"], ["cFormCheckInput", "", "id", "ollamaFpEnabled", "type", "checkbox", 3, "ngModelChange", "ngModel", "disabled"], ["cFormCheckLabel", "", "for", "ollamaFpEnabled"], [1, "badge", "rounded-pill", 3, "ngClass"], [1, "row", "g-3"], [1, "col-md-8"], ["cLabel", "", "for", "ollamaBaseUrl", 1, "mb-1"], ["id", "ollamaBaseUrl", "placeholder", "http://localhost:11434", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "col-md-4"], ["cLabel", "", "for", "ollamaTimeout", 1, "mb-1"], ["id", "ollamaTimeout", "type", "number", "min", "5", "max", "3600", 1, "form-control", 3, "ngModelChange", "ngModel"], ["cLabel", "", "for", "ollamaModel", 1, "mb-1"], ["id", "ollamaModel", "placeholder", "e.g. codellama:13b or llama3", 1, "form-control", 3, "ngModelChange", "ngModel"], ["cLabel", "", "for", "ollamaBatch", 1, "mb-1"], ["id", "ollamaBatch", "type", "number", "min", "1", "max", "50", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "mt-3", "d-flex", "gap-2", "flex-wrap"], ["cButton", "", "color", "secondary", "variant", "outline", "type", "button", 3, "click"], ["cButton", "", "color", "primary", "type", "button", 3, "click"], ["position", "fixed", 1, "p-3", 3, "placement"], [3, "visibleChange", "color", "visible"], [1, "me-auto"], [3, "visibleChange", "visible"], ["cModalTitle", ""], ["cButtonClose", "", 3, "click"], ["cForm", "", 3, "formGroup"], [1, "mb-3"], ["cLabel", "", "for", "orgName"], ["cFormControl", "", "id", "orgName", "formControlName", "name", "type", "text", "placeholder", "Enter organization name"], ["class", "text-danger", 4, "ngIf"], ["cLabel", "", "for", "planType"], ["cSelect", "", "id", "planType", "formControlName", "planType"], ["value", "FREE"], ["value", "SMALL_COMPANY"], ["value", "ENTERPRISE"], ["cLabel", "", "for", "adminUser"], ["cSelect", "", "id", "adminUser", "formControlName", "adminUserId"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [1, "mb-3", "form-check"], ["cFormCheckInput", "", "id", "activeStatus", "formControlName", "active", "type", "checkbox"], ["cFormCheckLabel", "", "for", "activeStatus"], ["cButton", "", "color", "secondary", 3, "click"], ["cButton", "", "color", "primary", 3, "click", "disabled"], [1, "text-danger"], ["cButton", "", "color", "danger", 3, "click"], ["size", "lg", 3, "visibleChange", "visible"], [1, "external-dt-config", "p-3", "border", "rounded", "config-input-section"], ["cLabel", "", "for", "inputExternalDTUrl"], ["formControlName", "scaApiUrl", "cFormControl", "", "id", "inputExternalDTUrl", "type", "url", 1, "form-control"], ["cLabel", "", "for", "inputExternalDTApiKey"], ["formControlName", "scaApiKey", "cFormControl", "", "id", "inputExternalDTApiKey", "type", "text", 1, "form-control"], [1, "wiz-config", "p-3", "border", "rounded", "config-input-section"], ["cLabel", "", "for", "wizClientId"], ["formControlName", "clientId", "cFormControl", "", "id", "wizClientId", "type", "text", 1, "form-control"], ["cLabel", "", "for", "wizSecret"], ["formControlName", "secret", "cFormControl", "", "id", "wizSecret", "type", "password", 1, "form-control"], [1, "smtp-config", "p-3", "border", "rounded", "config-input-section"], [1, "row"], [1, "col-md-6", "mb-3"], ["cLabel", "", "for", "smtpHost"], ["formControlName", "hostname", "cFormControl", "", "id", "smtpHost", "required", "", "type", "text", 1, "form-control"], ["cLabel", "", "for", "smtpPort"], ["formControlName", "port", "cFormControl", "", "id", "smtpPort", "required", "", "type", "number", 1, "form-control"], ["cLabel", "", "for", "smtpUsername"], ["formControlName", "username", "cFormControl", "", "id", "smtpUsername", "required", "", "type", "text", 1, "form-control"], ["cLabel", "", "for", "smtpPassword"], ["formControlName", "password", "cFormControl", "", "id", "smtpPassword", "required", "", "type", "password", 1, "form-control"], [1, "row", "mt-3"], ["formControlName", "tls", "cFormCheckInput", "", "id", "tls", "type", "checkbox"], ["cFormCheckLabel", "", "for", "tls", 1, "ms-2"], ["formControlName", "startls", "cFormCheckInput", "", "id", "startls", "type", "checkbox"], ["cFormCheckLabel", "", "for", "startls", 1, "ms-2"], [1, "btn-group"], ["cButton", "", "color", "primary", "size", "sm", "title", "Edit", 1, "action-btn", 3, "click"], ["cIcon", "", "name", "cil-pencil"], ["cButton", "", "color", "danger", "size", "sm", "title", "Delete", 1, "action-btn", 3, "click"], ["cIcon", "", "name", "cil-trash"], ["cButton", "", "color", "info", "size", "sm", "title", "View Details", 1, "action-btn", 3, "click"], ["cIcon", "", "name", "cil-list"], ["colspan", "8", 1, "text-center", "py-4"], [3, "value"], [1, "details-section-title"], [1, "table-responsive"], ["cTable", "", "small", "", "striped", ""], [1, "mt-4", "details-section-title"], ["colspan", "3", 1, "text-center"], ["colspan", "2", 1, "text-center"]], template: function AdminSettingsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-row", 0)(1, "c-col", 1)(2, "c-card", 2)(3, "c-card-body")(4, "c-tabs", 3)(5, "c-tabs-list", 4)(6, "button", 5);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(7, "svg", 6);
        \u0275\u0275text(8, " Scanner Configurations ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(9, "button", 5);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(10, "svg", 7);
        \u0275\u0275text(11, " SMTP and Notifications ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(12, "button", 5);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(13, "svg", 8);
        \u0275\u0275text(14, " Authentication ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(15, "button", 5);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(16, "svg", 9);
        \u0275\u0275text(17, " Organizations ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(18, "button", 5);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(19, "svg", 10);
        \u0275\u0275text(20, " Other ");
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(21, "button", 5);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(22, "svg", 11);
        \u0275\u0275text(23, " AI / Ollama ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(24, "c-tabs-content")(25, "c-tab-panel", 12)(26, "div", 13)(27, "div", 14)(28, "h4", 15);
        \u0275\u0275text(29, "Software Component Analysis");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(30, "form", 16)(31, "div", 17)(32, "c-form-check", 18)(33, "input", 19);
        \u0275\u0275listener("change", function AdminSettingsComponent_Template_input_change_33_listener() {
          return ctx.changeEmbededDT();
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(34, "label", 20);
        \u0275\u0275text(35, "Embedded Dependency Track");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(36, "c-form-check", 18)(37, "input", 21);
        \u0275\u0275listener("change", function AdminSettingsComponent_Template_input_change_37_listener() {
          return ctx.changeExternalDT();
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(38, "label", 22);
        \u0275\u0275text(39, "External Dependency Track");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(40, AdminSettingsComponent_div_40_Template, 9, 0, "div", 23);
        \u0275\u0275elementStart(41, "c-form-check", 18);
        \u0275\u0275element(42, "input", 24);
        \u0275\u0275elementStart(43, "label", 25);
        \u0275\u0275text(44, " Other External Tool ");
        \u0275\u0275elementStart(45, "span", 26);
        \u0275\u0275text(46, "Coming Soon");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(47, "button", 27);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_47_listener() {
          return ctx.configSca();
        });
        \u0275\u0275text(48, " Save SCA Configuration ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(49, "div", 14)(50, "h4", 15);
        \u0275\u0275text(51, "Static Application Security Testing (SAST)");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(52, "div", 28)(53, "c-form-check", 18)(54, "input", 29);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_input_ngModelChange_54_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.sast, $event) || (ctx.sast = $event);
          return $event;
        });
        \u0275\u0275listener("change", function AdminSettingsComponent_Template_input_change_54_listener() {
          return ctx.onSastChange("bearer");
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(55, "label", 30);
        \u0275\u0275text(56, "Bearer");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(57, "c-form-check", 31);
        \u0275\u0275element(58, "input", 32);
        \u0275\u0275elementStart(59, "label", 33);
        \u0275\u0275text(60, " Other External Tool ");
        \u0275\u0275elementStart(61, "span", 26);
        \u0275\u0275text(62, "Coming Soon");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(63, "div", 14)(64, "h4", 15);
        \u0275\u0275text(65, "Infrastructure as Code (IAC)");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(66, "div", 34)(67, "c-form-check", 18)(68, "input", 35);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_input_ngModelChange_68_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.iac, $event) || (ctx.iac = $event);
          return $event;
        });
        \u0275\u0275listener("change", function AdminSettingsComponent_Template_input_change_68_listener() {
          return ctx.onIacChange("kics");
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(69, "label", 36);
        \u0275\u0275text(70, "KICS");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(71, "c-form-check", 31);
        \u0275\u0275element(72, "input", 37);
        \u0275\u0275elementStart(73, "label", 38);
        \u0275\u0275text(74, " Other External Tool ");
        \u0275\u0275elementStart(75, "span", 26);
        \u0275\u0275text(76, "Coming Soon");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(77, "div", 14)(78, "h4", 15);
        \u0275\u0275text(79, "Secrets Leakage Detection");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(80, "div", 39)(81, "c-form-check", 18)(82, "input", 40);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_input_ngModelChange_82_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.secretsLeakage, $event) || (ctx.secretsLeakage = $event);
          return $event;
        });
        \u0275\u0275listener("change", function AdminSettingsComponent_Template_input_change_82_listener() {
          return ctx.onSecretsLeakageChange("gitleaks");
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(83, "label", 41);
        \u0275\u0275text(84, "Gitleaks");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(85, "c-form-check", 31);
        \u0275\u0275element(86, "input", 42);
        \u0275\u0275elementStart(87, "label", 43);
        \u0275\u0275text(88, " Other External Tool ");
        \u0275\u0275elementStart(89, "span", 26);
        \u0275\u0275text(90, "Coming Soon");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(91, "div", 14)(92, "h4", 15);
        \u0275\u0275text(93, "Wiz Scanner Configuration");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(94, "form", 16)(95, "div", 44)(96, "c-form-check", 18)(97, "input", 45);
        \u0275\u0275listener("change", function AdminSettingsComponent_Template_input_change_97_listener() {
          return ctx.onWizToggleChange();
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(98, "label", 46);
        \u0275\u0275text(99, "Enable Wiz Scanner");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(100, AdminSettingsComponent_div_100_Template, 13, 2, "div", 47);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(101, "button", 27);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_101_listener() {
          return ctx.configWiz();
        });
        \u0275\u0275text(102, " Save Wiz Configuration ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(103, "div", 14)(104, "h4", 15);
        \u0275\u0275text(105, "Dynamic Application Security Testing (DAST)");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(106, "div", 48)(107, "c-form-check", 18)(108, "input", 49);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_input_ngModelChange_108_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.dast, $event) || (ctx.dast = $event);
          return $event;
        });
        \u0275\u0275listener("change", function AdminSettingsComponent_Template_input_change_108_listener() {
          return ctx.onDastChange("bearer");
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(109, "label", 50);
        \u0275\u0275text(110, "Dast");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(111, "c-form-check", 31);
        \u0275\u0275element(112, "input", 51);
        \u0275\u0275elementStart(113, "label", 52);
        \u0275\u0275text(114, " Other External Tool ");
        \u0275\u0275elementStart(115, "span", 26);
        \u0275\u0275text(116, "Coming Soon");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(117, "c-tab-panel", 12)(118, "div", 53)(119, "div", 14)(120, "h4", 15);
        \u0275\u0275text(121, "SMTP Configuration");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(122, "form", 16)(123, "c-form-check", 54)(124, "input", 55);
        \u0275\u0275listener("change", function AdminSettingsComponent_Template_input_change_124_listener() {
          return ctx.onSmtpToggleChange();
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(125, "label", 56);
        \u0275\u0275text(126, "Enable SMTP");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(127, AdminSettingsComponent_div_127_Template, 38, 6, "div", 57);
        \u0275\u0275elementStart(128, "button", 58);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_128_listener() {
          return ctx.sonfigSMTP();
        });
        \u0275\u0275text(129, " Save SMTP Configuration ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(130, "div", 59)(131, "h4", 15);
        \u0275\u0275text(132, "Additional Notification Services");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(133, "div", 60)(134, "c-form-check", 18);
        \u0275\u0275element(135, "input", 61);
        \u0275\u0275elementStart(136, "label", 62);
        \u0275\u0275text(137, " Mattermost ");
        \u0275\u0275elementStart(138, "span", 26);
        \u0275\u0275text(139, "Coming Soon");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(140, "c-form-check", 31);
        \u0275\u0275element(141, "input", 61);
        \u0275\u0275elementStart(142, "label", 62);
        \u0275\u0275text(143, " Slack ");
        \u0275\u0275elementStart(144, "span", 26);
        \u0275\u0275text(145, "Coming Soon");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(146, "c-tab-panel", 12)(147, "div", 59)(148, "h4", 15);
        \u0275\u0275text(149, "Authentication Settings");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(150, "div", 63)(151, "label", 64);
        \u0275\u0275text(152, "Authentication Type");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(153, "select", 65);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_select_ngModelChange_153_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.authType, $event) || (ctx.authType = $event);
          return $event;
        });
        \u0275\u0275elementStart(154, "option", 66);
        \u0275\u0275text(155, "Username + Password Authentication");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(156, "option", 67);
        \u0275\u0275text(157, "Single Sign-On (SSO) ");
        \u0275\u0275elementStart(158, "span", 68);
        \u0275\u0275text(159, "- Coming Soon");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(160, "c-form-feedback", 69);
        \u0275\u0275text(161, "Please select an authentication type.");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(162, "c-tab-panel", 12)(163, "div", 14)(164, "div", 70)(165, "h4", 71);
        \u0275\u0275text(166, "Organizations Management");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(167, "button", 72);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_167_listener() {
          return ctx.openNewOrgModal();
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(168, "svg", 73);
        \u0275\u0275text(169, "Add Organization ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(170, "div", 74)(171, "table", 75)(172, "thead", 76)(173, "tr")(174, "th");
        \u0275\u0275text(175, "Name");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(176, "th");
        \u0275\u0275text(177, "Plan");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(178, "th");
        \u0275\u0275text(179, "Created");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(180, "th");
        \u0275\u0275text(181, "Teams");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(182, "th");
        \u0275\u0275text(183, "Repositories");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(184, "th");
        \u0275\u0275text(185, "Users");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(186, "th");
        \u0275\u0275text(187, "Status");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(188, "th");
        \u0275\u0275text(189, "Actions");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(190, "tbody");
        \u0275\u0275template(191, AdminSettingsComponent_tr_191_Template, 26, 13, "tr", 77)(192, AdminSettingsComponent_tr_192_Template, 3, 0, "tr", 78);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(193, "div", 14)(194, "h4", 15);
        \u0275\u0275text(195, "Application Run Mode");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(196, "div", 79)(197, "p");
        \u0275\u0275text(198, "Current Mode: ");
        \u0275\u0275elementStart(199, "c-badge", 80);
        \u0275\u0275text(200);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(201, "p", 68);
        \u0275\u0275text(202, "Select how the application should operate:");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(203, "div", 81)(204, "c-form-check", 82)(205, "input", 83);
        \u0275\u0275listener("change", function AdminSettingsComponent_Template_input_change_205_listener() {
          return ctx.changeRunMode("STANDALONE");
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(206, "label", 84)(207, "strong");
        \u0275\u0275text(208, "Standalone Mode");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(209, "div", 85);
        \u0275\u0275text(210, "Single instance deployment with no subscription limits");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(211, "c-form-check")(212, "input", 86);
        \u0275\u0275listener("change", function AdminSettingsComponent_Template_input_change_212_listener() {
          return ctx.changeRunMode("SAAS");
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(213, "label", 87)(214, "strong");
        \u0275\u0275text(215, "SaaS Mode");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(216, "div", 85);
        \u0275\u0275text(217, "Multi-tenant deployment with subscription plans");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(218, "button", 88);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_218_listener() {
          return ctx.saveRunMode();
        });
        \u0275\u0275text(219, "Save Run Mode");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(220, "c-tab-panel", 12)(221, "div", 59)(222, "h4", 15);
        \u0275\u0275text(223, "Other Settings");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(224, "div", 63)(225, "label", 89);
        \u0275\u0275text(226, "Gemini API Key");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(227, "input", 90);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_input_ngModelChange_227_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.geminiApiKey, $event) || (ctx.geminiApiKey = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(228, "button", 88);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_228_listener() {
          return ctx.saveOtherConfigurationSettings();
        });
        \u0275\u0275text(229, "Save Configuration");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(230, "c-tab-panel", 12)(231, "div", 59)(232, "h4", 15);
        \u0275\u0275text(233, "AI / Ollama Configuration");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(234, "p", 85);
        \u0275\u0275text(235, "When Ollama or FP analysis is disabled, the scan pipeline behaves as before (no LLM calls).");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(236, "div", 91)(237, "c-form-check", 92)(238, "input", 93);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_input_ngModelChange_238_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.ollamaEnabled, $event) || (ctx.ollamaEnabled = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(239, "label", 94);
        \u0275\u0275text(240, "Enable Ollama");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(241, "c-form-check", 92)(242, "input", 95);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_input_ngModelChange_242_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.ollamaFpAnalysisEnabled, $event) || (ctx.ollamaFpAnalysisEnabled = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(243, "label", 96);
        \u0275\u0275text(244, "Enable false-positive (FP) analysis");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(245, "span", 97);
        \u0275\u0275text(246);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(247, "div", 98)(248, "div", 99)(249, "label", 100);
        \u0275\u0275text(250, "Base URL");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(251, "input", 101);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_input_ngModelChange_251_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.ollamaBaseUrl, $event) || (ctx.ollamaBaseUrl = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(252, "div", 102)(253, "label", 103);
        \u0275\u0275text(254, "Timeout (seconds)");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(255, "input", 104);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_input_ngModelChange_255_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.ollamaTimeoutSeconds, $event) || (ctx.ollamaTimeoutSeconds = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(256, "div", 99)(257, "label", 105);
        \u0275\u0275text(258, "Model name");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(259, "input", 106);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_input_ngModelChange_259_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.ollamaModel, $event) || (ctx.ollamaModel = $event);
          return $event;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(260, "div", 102)(261, "label", 107);
        \u0275\u0275text(262, "FP batch size");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(263, "input", 108);
        \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Template_input_ngModelChange_263_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.ollamaFpBatchSize, $event) || (ctx.ollamaFpBatchSize = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(264, "div", 109)(265, "button", 110);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_265_listener() {
          return ctx.testOllamaConnection();
        });
        \u0275\u0275text(266, "Test connection");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(267, "button", 111);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_267_listener() {
          return ctx.saveOllamaSettings();
        });
        \u0275\u0275text(268, "Save settings");
        \u0275\u0275elementEnd()()()()()()()()()();
        \u0275\u0275elementStart(269, "c-toaster", 112)(270, "c-toast", 113);
        \u0275\u0275listener("visibleChange", function AdminSettingsComponent_Template_c_toast_visibleChange_270_listener($event) {
          return ctx.onVisibleChange($event);
        });
        \u0275\u0275elementStart(271, "c-toast-header")(272, "strong", 114);
        \u0275\u0275text(273, "Configuration Status");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(274, "c-toast-body")(275, "p");
        \u0275\u0275text(276);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(277, "c-modal", 115);
        \u0275\u0275listener("visibleChange", function AdminSettingsComponent_Template_c_modal_visibleChange_277_listener($event) {
          return ctx.orgModalVisible = $event;
        });
        \u0275\u0275elementStart(278, "c-modal-header")(279, "h5", 116);
        \u0275\u0275text(280);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(281, "button", 117);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_281_listener() {
          return ctx.orgModalVisible = false;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(282, "c-modal-body")(283, "form", 118)(284, "div", 119)(285, "label", 120);
        \u0275\u0275text(286, "Organization Name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(287, "input", 121);
        \u0275\u0275template(288, AdminSettingsComponent_div_288_Template, 2, 0, "div", 122);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(289, "div", 119)(290, "label", 123);
        \u0275\u0275text(291, "Subscription Plan");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(292, "select", 124)(293, "option", 125);
        \u0275\u0275text(294, "Free Plan");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(295, "option", 126);
        \u0275\u0275text(296, "Small Company");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(297, "option", 127);
        \u0275\u0275text(298, "Enterprise");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(299, "div", 119)(300, "label", 128);
        \u0275\u0275text(301, "Assign Admin User");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(302, "select", 129)(303, "option", 130);
        \u0275\u0275text(304, "Select a user");
        \u0275\u0275elementEnd();
        \u0275\u0275template(305, AdminSettingsComponent_option_305_Template, 2, 2, "option", 131);
        \u0275\u0275elementEnd();
        \u0275\u0275template(306, AdminSettingsComponent_div_306_Template, 2, 0, "div", 122);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(307, "div", 132);
        \u0275\u0275element(308, "input", 133);
        \u0275\u0275elementStart(309, "label", 134);
        \u0275\u0275text(310, "Active");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(311, "c-modal-footer")(312, "button", 135);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_312_listener() {
          return ctx.orgModalVisible = false;
        });
        \u0275\u0275text(313, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(314, "button", 136);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_314_listener() {
          return ctx.saveOrganization();
        });
        \u0275\u0275text(315);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(316, "c-modal", 115);
        \u0275\u0275listener("visibleChange", function AdminSettingsComponent_Template_c_modal_visibleChange_316_listener($event) {
          return ctx.deleteModalVisible = $event;
        });
        \u0275\u0275elementStart(317, "c-modal-header")(318, "h5", 116);
        \u0275\u0275text(319, "Confirm Delete");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(320, "button", 117);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_320_listener() {
          return ctx.deleteModalVisible = false;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(321, "c-modal-body")(322, "p");
        \u0275\u0275text(323, "Are you sure you want to delete organization ");
        \u0275\u0275elementStart(324, "strong");
        \u0275\u0275text(325);
        \u0275\u0275elementEnd();
        \u0275\u0275text(326, "?");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(327, "p", 137);
        \u0275\u0275text(328, "This action cannot be undone and will remove all associated data.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(329, "c-modal-footer")(330, "button", 135);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_330_listener() {
          return ctx.deleteModalVisible = false;
        });
        \u0275\u0275text(331, " Cancel ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(332, "button", 138);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_332_listener() {
          return ctx.deleteOrganization();
        });
        \u0275\u0275text(333, " Delete ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(334, "c-modal", 139);
        \u0275\u0275listener("visibleChange", function AdminSettingsComponent_Template_c_modal_visibleChange_334_listener($event) {
          return ctx.detailsModalVisible = $event;
        });
        \u0275\u0275elementStart(335, "c-modal-header")(336, "h5", 116);
        \u0275\u0275text(337);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(338, "button", 117);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_338_listener() {
          return ctx.detailsModalVisible = false;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275template(339, AdminSettingsComponent_c_modal_body_339_Template, 80, 18, "c-modal-body", 78);
        \u0275\u0275elementStart(340, "c-modal-footer")(341, "button", 135);
        \u0275\u0275listener("click", function AdminSettingsComponent_Template_button_click_341_listener() {
          return ctx.detailsModalVisible = false;
        });
        \u0275\u0275text(342, " Close ");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        let tmp_73_0;
        let tmp_75_0;
        \u0275\u0275advance(4);
        \u0275\u0275property("activeItemKey", 0);
        \u0275\u0275advance(2);
        \u0275\u0275property("itemKey", 0);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 1);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 2);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 3);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 4);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 5);
        \u0275\u0275advance(4);
        \u0275\u0275property("itemKey", 0);
        \u0275\u0275advance(5);
        \u0275\u0275property("gutter", 3)("formGroup", ctx.scaConfigForm);
        \u0275\u0275advance(2);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance();
        \u0275\u0275property("checked", ctx.isEmbededDTChecked);
        \u0275\u0275advance(3);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance();
        \u0275\u0275property("checked", ctx.isExternalDTChecked);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.isExternalDTChecked);
        \u0275\u0275advance();
        \u0275\u0275property("switch", true);
        \u0275\u0275advance(12);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.sast);
        \u0275\u0275property("checked", ctx.sast === "bearer");
        \u0275\u0275advance(3);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance(10);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.iac);
        \u0275\u0275property("checked", ctx.iac === "kics");
        \u0275\u0275advance(3);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance(10);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.secretsLeakage);
        \u0275\u0275property("checked", ctx.secretsLeakage === "gitleaks");
        \u0275\u0275advance(3);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance(9);
        \u0275\u0275property("gutter", 3)("formGroup", ctx.wizConfigForm);
        \u0275\u0275advance(2);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance();
        \u0275\u0275property("checked", ctx.isWizEnabled);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.isWizEnabled);
        \u0275\u0275advance(7);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.dast);
        \u0275\u0275property("checked", ctx.dast === "bearer");
        \u0275\u0275advance(3);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance(6);
        \u0275\u0275property("itemKey", 1);
        \u0275\u0275advance(5);
        \u0275\u0275property("gutter", 3)("formGroup", ctx.smtpConfigForm);
        \u0275\u0275advance();
        \u0275\u0275property("switch", true);
        \u0275\u0275advance(4);
        \u0275\u0275property("ngIf", ctx.smtpEnabled);
        \u0275\u0275advance(7);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance(6);
        \u0275\u0275property("switch", true);
        \u0275\u0275advance(6);
        \u0275\u0275property("itemKey", 2);
        \u0275\u0275advance(7);
        \u0275\u0275twoWayProperty("ngModel", ctx.authType);
        \u0275\u0275advance(7);
        \u0275\u0275property("valid", false);
        \u0275\u0275advance(2);
        \u0275\u0275property("itemKey", 3);
        \u0275\u0275advance(29);
        \u0275\u0275property("ngForOf", ctx.organizations);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.organizations || ctx.organizations.length === 0);
        \u0275\u0275advance(7);
        \u0275\u0275property("color", ctx.appRunMode === "SAAS" ? "success" : "info");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.appRunMode, " ");
        \u0275\u0275advance(5);
        \u0275\u0275property("checked", ctx.appRunMode === "STANDALONE");
        \u0275\u0275advance(7);
        \u0275\u0275property("checked", ctx.appRunMode === "SAAS");
        \u0275\u0275advance(8);
        \u0275\u0275property("itemKey", 4);
        \u0275\u0275advance(7);
        \u0275\u0275twoWayProperty("ngModel", ctx.geminiApiKey);
        \u0275\u0275advance(3);
        \u0275\u0275property("itemKey", 5);
        \u0275\u0275advance(8);
        \u0275\u0275twoWayProperty("ngModel", ctx.ollamaEnabled);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.ollamaFpAnalysisEnabled);
        \u0275\u0275property("disabled", !ctx.ollamaEnabled);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngClass", ctx.ollamaConnectionOk === true ? "bg-success" : ctx.ollamaConnectionOk === false ? "bg-danger" : "bg-secondary");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" Ollama: ", ctx.ollamaConnectionOk === true ? "reachable" : ctx.ollamaConnectionOk === false ? "unreachable" : "not tested", " ");
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.ollamaBaseUrl);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.ollamaTimeoutSeconds);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.ollamaModel);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.ollamaFpBatchSize);
        \u0275\u0275advance(6);
        \u0275\u0275property("placement", ctx.position);
        \u0275\u0275advance();
        \u0275\u0275property("color", ctx.toastStatus)("visible", ctx.visible);
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.toastMessage);
        \u0275\u0275advance();
        \u0275\u0275property("visible", ctx.orgModalVisible);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.editMode ? "Edit Organization" : "Create Organization");
        \u0275\u0275advance(3);
        \u0275\u0275property("formGroup", ctx.organizationForm);
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ((tmp_73_0 = ctx.organizationForm.get("name")) == null ? null : tmp_73_0.invalid) && ((tmp_73_0 = ctx.organizationForm.get("name")) == null ? null : tmp_73_0.touched));
        \u0275\u0275advance(17);
        \u0275\u0275property("ngForOf", ctx.availableUsers);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ((tmp_75_0 = ctx.organizationForm.get("adminUserId")) == null ? null : tmp_75_0.invalid) && ((tmp_75_0 = ctx.organizationForm.get("adminUserId")) == null ? null : tmp_75_0.touched));
        \u0275\u0275advance(8);
        \u0275\u0275property("disabled", ctx.organizationForm.invalid);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.editMode ? "Update" : "Create", " ");
        \u0275\u0275advance();
        \u0275\u0275property("visible", ctx.deleteModalVisible);
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate(ctx.selectedOrg == null ? null : ctx.selectedOrg.name);
        \u0275\u0275advance(9);
        \u0275\u0275property("visible", ctx.detailsModalVisible);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1("", ctx.selectedOrg == null ? null : ctx.selectedOrg.name, " Details");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.selectedOrg);
      }
    }, dependencies: [
      BadgeComponent,
      CardBodyComponent,
      CardComponent,
      ColComponent,
      DatePipe,
      NgClass,
      FormCheckComponent,
      FormCheckInputDirective,
      FormCheckLabelDirective,
      FormLabelDirective,
      FormSelectDirective,
      IconDirective,
      NgForOf,
      NgIf,
      NgxDatatableModule,
      ReactiveFormsModule,
      \u0275NgNoValidate,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      NumberValueAccessor,
      CheckboxControlValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      RequiredValidator,
      MinValidator,
      MaxValidator,
      FormGroupDirective,
      FormControlName,
      RowComponent,
      TabDirective,
      TabPanelComponent,
      TabsComponent,
      TabsContentComponent,
      TabsListComponent,
      FormFeedbackComponent,
      FormControlDirective,
      GutterDirective,
      FormDirective,
      RowDirective,
      FormsModule,
      NgModel,
      ButtonDirective,
      ToastBodyComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToasterComponent,
      ModalComponent,
      ModalHeaderComponent,
      ModalBodyComponent,
      ModalFooterComponent,
      ModalTitleDirective,
      ButtonCloseDirective,
      TableDirective
    ], styles: ["\n\n[_ngcontent-%COMP%]:root {\n  --card-bg: var(--cui-card-bg, #fff);\n  --card-text: var(--cui-card-color, #4f5d73);\n  --card-border: var(--cui-card-border-color, rgba(0,0,21,.125));\n  --config-section-bg: var(--cui-card-cap-bg, rgba(0,0,21,.03));\n  --config-section-hover: rgba(0,0,21,.05);\n  --config-section-shadow: 0 0.125rem 0.25rem rgba(0,0,21,.075);\n  --config-section-shadow-hover: 0 0.5rem 1rem rgba(0,0,21,.15);\n  --input-section-bg: var(--cui-input-bg, #fff);\n  --input-section-border: var(--cui-input-border-color, #b1b7c1);\n  --table-header-bg: var(--cui-table-active-bg, rgba(0,0,21,.1));\n  --table-header-color: var(--cui-table-active-color, #4f5d73);\n  --table-border-color: var(--cui-table-border-color, #d8dbe0);\n  --table-striped-bg: var(--cui-table-striped-bg, rgba(0,0,0,.02));\n  --primary-color: #321fdb;\n}\n.admin-card[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.config-section[_ngcontent-%COMP%] {\n  background-color: var(--config-section-bg);\n  border: 1px solid var(--card-border);\n  transition: all 0.3s ease;\n  box-shadow: var(--config-section-shadow);\n}\n.config-section[_ngcontent-%COMP%]:hover {\n  box-shadow: var(--config-section-shadow-hover);\n}\n.section-title[_ngcontent-%COMP%], \n.details-section-title[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  font-weight: 600;\n}\n.config-input-section[_ngcontent-%COMP%] {\n  background-color: var(--input-section-bg);\n  border-color: var(--input-section-border);\n}\n.table-container[_ngcontent-%COMP%] {\n  border: 1px solid var(--table-border-color);\n  border-radius: 0.25rem;\n  overflow: hidden;\n  margin-bottom: 1rem;\n}\ntable[_ngcontent-%COMP%] {\n  margin-bottom: 0 !important;\n}\ntable.table-striped[_ngcontent-%COMP%]    > tbody[_ngcontent-%COMP%]    > tr[_ngcontent-%COMP%]:nth-of-type(odd) {\n  background-color: var(--table-striped-bg);\n}\ntable.align-middle[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], \ntable.align-middle[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  vertical-align: middle;\n}\n.table-header[_ngcontent-%COMP%] {\n  background-color: var(--table-header-bg);\n  color: var(--table-header-color);\n  font-weight: 600;\n}\nlabel[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 600;\n  margin-bottom: 0.5rem;\n}\n.form-control[_ngcontent-%COMP%]:focus {\n  border-color: rgba(50, 31, 219, 0.5);\n  box-shadow: 0 0 0 0.2rem rgba(50, 31, 219, 0.25);\n}\n.action-btn[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.5rem;\n  line-height: 1;\n}\n.action-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 1rem;\n  height: 1rem;\n}\n.modal-body[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n}\n.badge[_ngcontent-%COMP%] {\n  font-size: 0.75em;\n  font-weight: 500;\n  padding: 0.35em 0.65em;\n}\n@media (max-width: 768px) {\n  .config-section[_ngcontent-%COMP%] {\n    padding: 1rem !important;\n  }\n  .table-responsive[_ngcontent-%COMP%] {\n    border: 0;\n  }\n}\n/*# sourceMappingURL=admin-settings.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminSettingsComponent, { className: "AdminSettingsComponent" });
})();

// src/app/views/admin-settings/routes.ts
var routes = [
  {
    path: "",
    component: AdminSettingsComponent,
    data: {
      title: "Admin Settings"
    }
  },
  {
    path: "",
    component: AdminSettingsComponent,
    data: {
      title: "Admin Settings"
    }
  }
];
export {
  routes
};
//# sourceMappingURL=routes-CPHDXHXG.js.map
