import {
  UserService
} from "./chunk-RX57R3D6.js";
import {
  AuthService
} from "./chunk-YFWDZ3VL.js";
import "./chunk-YLFWSDV3.js";
import {
  AlertComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  IconDirective,
  NgIf,
  Router,
  RowComponent,
  TabDirective,
  TabPanelComponent,
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
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
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
  ɵɵtextInterpolate1
} from "./chunk-ZG2BHLTP.js";
import "./chunk-4MWRP73S.js";

// src/app/views/profile/profile.component.ts
function ProfileComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "c-alert", 17)(2, "strong");
    \u0275\u0275text(3, "Save your API key now!");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " It will not be shown again after you leave this page. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 18)(6, "code", 19);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 20);
    \u0275\u0275listener("click", function ProfileComponent_div_19_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.copyToClipboard());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(9, "svg", 21);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.apiKey);
  }
}
function ProfileComponent_span_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 22);
  }
}
function ProfileComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "small", 24);
    \u0275\u0275text(2, " Generating a new key will invalidate the previous one. ");
    \u0275\u0275elementEnd()();
  }
}
var ProfileComponent = class _ProfileComponent {
  constructor(authService, router, userService) {
    this.authService = authService;
    this.router = router;
    this.userService = userService;
    this.apiKey = null;
    this.apiKeyGenerated = false;
    this.generating = false;
    this.position = "top-end";
    this.visible = false;
    this.toastMessage = "";
    this.toastStatus = "";
  }
  ngOnInit() {
    this.authService.hc().subscribe({
      error: () => {
        this.router.navigate(["/login"]);
      }
    });
  }
  generateApiKey() {
    this.generating = true;
    this.userService.generateApiKey().subscribe({
      next: (response) => {
        this.apiKey = response.status;
        this.apiKeyGenerated = true;
        this.generating = false;
        this.toastStatus = "success";
        this.toastMessage = "API key generated successfully";
        this.toggleToast();
      },
      error: () => {
        this.generating = false;
        this.toastStatus = "danger";
        this.toastMessage = "Failed to generate API key";
        this.toggleToast();
      }
    });
  }
  copyToClipboard() {
    if (this.apiKey) {
      navigator.clipboard.writeText(this.apiKey).then(() => {
        this.toastStatus = "success";
        this.toastMessage = "API key copied to clipboard";
        this.toggleToast();
      });
    }
  }
  toggleToast() {
    this.visible = !this.visible;
  }
  onVisibleChange($event) {
    this.visible = $event;
  }
  static {
    this.\u0275fac = function ProfileComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProfileComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(UserService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileComponent, selectors: [["app-profile"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 32, vars: 12, consts: [[1, "xs-12"], [3, "activeItemKey"], ["variant", "underline-border", 1, "border-bottom"], ["cTab", "", 1, "d-flex", "align-items-center", 3, "itemKey"], ["cIcon", "", "name", "cilCode", 1, "me-2"], [1, "p-4", 3, "itemKey"], [1, "config-section", "p-4", "rounded", "shadow-sm"], [1, "mb-3", "section-title"], [1, "text-muted", "mb-4"], ["class", "mb-4", 4, "ngIf"], ["cButton", "", "color", "primary", 3, "click", "disabled"], ["class", "spinner-border spinner-border-sm me-2", "role", "status", 4, "ngIf"], ["class", "mt-3", 4, "ngIf"], ["position", "fixed", 1, "p-3", 3, "placement"], [3, "visibleChange", "color", "visible"], [1, "me-auto"], [1, "mb-4"], ["color", "warning", 1, "mb-3"], [1, "d-flex", "align-items-center", "gap-2"], [1, "p-2", "border", "rounded", "bg-body-secondary", "flex-grow-1", "d-block", "text-break"], ["cButton", "", "color", "secondary", "size", "sm", "title", "Copy to clipboard", 3, "click"], ["cIcon", "", "name", "cilCopy"], ["role", "status", 1, "spinner-border", "spinner-border-sm", "me-2"], [1, "mt-3"], [1, "text-muted"]], template: function ProfileComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "c-row")(1, "c-col", 0)(2, "c-card")(3, "c-card-body")(4, "c-tabs", 1)(5, "c-tabs-list", 2)(6, "button", 3);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(7, "svg", 4);
        \u0275\u0275text(8, " Developer Settings ");
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(9, "c-tabs-content")(10, "c-tab-panel", 5)(11, "div", 6)(12, "h4", 7);
        \u0275\u0275text(13, "API Key");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "p", 8);
        \u0275\u0275text(15, " Generate an API key to authenticate with the Flow API. Use the ");
        \u0275\u0275elementStart(16, "code");
        \u0275\u0275text(17, "X-API-KEY");
        \u0275\u0275elementEnd();
        \u0275\u0275text(18, " header in your requests. ");
        \u0275\u0275elementEnd();
        \u0275\u0275template(19, ProfileComponent_div_19_Template, 10, 1, "div", 9);
        \u0275\u0275elementStart(20, "button", 10);
        \u0275\u0275listener("click", function ProfileComponent_Template_button_click_20_listener() {
          return ctx.generateApiKey();
        });
        \u0275\u0275template(21, ProfileComponent_span_21_Template, 1, 0, "span", 11);
        \u0275\u0275text(22);
        \u0275\u0275elementEnd();
        \u0275\u0275template(23, ProfileComponent_div_23_Template, 3, 0, "div", 12);
        \u0275\u0275elementEnd()()()()()()()();
        \u0275\u0275elementStart(24, "c-toaster", 13)(25, "c-toast", 14);
        \u0275\u0275listener("visibleChange", function ProfileComponent_Template_c_toast_visibleChange_25_listener($event) {
          return ctx.onVisibleChange($event);
        });
        \u0275\u0275elementStart(26, "c-toast-header")(27, "strong", 15);
        \u0275\u0275text(28, "Profile");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(29, "c-toast-body")(30, "p");
        \u0275\u0275text(31);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(4);
        \u0275\u0275property("activeItemKey", 0);
        \u0275\u0275advance(2);
        \u0275\u0275property("itemKey", 0);
        \u0275\u0275advance(4);
        \u0275\u0275property("itemKey", 0);
        \u0275\u0275advance(9);
        \u0275\u0275property("ngIf", ctx.apiKeyGenerated && ctx.apiKey);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.generating);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.generating);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.apiKeyGenerated ? "Regenerate API Key" : "Generate API Key", " ");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.apiKeyGenerated);
        \u0275\u0275advance();
        \u0275\u0275property("placement", ctx.position);
        \u0275\u0275advance();
        \u0275\u0275property("color", ctx.toastStatus)("visible", ctx.visible);
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.toastMessage);
      }
    }, dependencies: [
      CardBodyComponent,
      CardComponent,
      ColComponent,
      IconDirective,
      NgIf,
      RowComponent,
      TabDirective,
      TabPanelComponent,
      TabsComponent,
      TabsContentComponent,
      TabsListComponent,
      ButtonDirective,
      ToastBodyComponent,
      ToastComponent,
      ToastHeaderComponent,
      ToasterComponent,
      AlertComponent
    ], styles: ["\n\n.section-title[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.config-section[_ngcontent-%COMP%] {\n  background: var(--cui-card-bg);\n}\ncode[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n}\n/*# sourceMappingURL=profile.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileComponent, { className: "ProfileComponent" });
})();

// src/app/views/profile/routes.ts
var routes = [
  {
    path: "",
    component: ProfileComponent,
    data: {
      title: "Profile"
    }
  }
];
export {
  routes
};
//# sourceMappingURL=routes-Y2SK5UZ5.js.map
