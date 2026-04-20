import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  IconDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵtext
} from "./chunk-ZG2BHLTP.js";
import "./chunk-4MWRP73S.js";

// src/app/views/pages/register/register.component.ts
var RegisterComponent = class _RegisterComponent {
  constructor() {
  }
  static {
    this.\u0275fac = function RegisterComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RegisterComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RegisterComponent, selectors: [["app-register"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 30, vars: 0, consts: [[1, "bg-light", "dark:bg-transparent", "min-vh-100", "d-flex", "flex-row", "align-items-center"], [1, "justify-content-center"], ["lg", "7", "md", "9", "xl", "6"], [1, "mx-4"], [1, "p-4"], ["cForm", ""], [1, "text-body-secondary"], [1, "mb-3"], ["cInputGroupText", ""], ["cIcon", "", "name", "cilUser"], ["autoComplete", "name", "cFormControl", "", "placeholder", "Username"], ["autoComplete", "email", "cFormControl", "", "placeholder", "Email"], ["cIcon", "", "name", "cilLockLocked"], ["autoComplete", "new-password", "cFormControl", "", "placeholder", "Password", "type", "password"], [1, "mb-4"], ["autoComplete", "new-password", "cFormControl", "", "placeholder", "Repeat password", "type", "password"], [1, "d-grid"], ["cButton", "", "color", "success"]], template: function RegisterComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "c-container")(2, "c-row", 1)(3, "c-col", 2)(4, "c-card", 3)(5, "c-card-body", 4)(6, "form", 5)(7, "h1");
        \u0275\u0275text(8, "Register");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "p", 6);
        \u0275\u0275text(10, "Create your account");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "c-input-group", 7)(12, "span", 8);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(13, "svg", 9);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(14, "input", 10);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "c-input-group", 7)(16, "span", 8);
        \u0275\u0275text(17, "@");
        \u0275\u0275elementEnd();
        \u0275\u0275element(18, "input", 11);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "c-input-group", 7)(20, "span", 8);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(21, "svg", 12);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(22, "input", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "c-input-group", 14)(24, "span", 8);
        \u0275\u0275namespaceSVG();
        \u0275\u0275element(25, "svg", 12);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(26, "input", 15);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "div", 16)(28, "button", 17);
        \u0275\u0275text(29, "Create Account");
        \u0275\u0275elementEnd()()()()()()()()();
      }
    }, dependencies: [ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RegisterComponent, { className: "RegisterComponent" });
})();
export {
  RegisterComponent
};
//# sourceMappingURL=register.component-PXPIMKPG.js.map
