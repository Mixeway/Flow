import {
  getNavItems,
  navItems
} from "./chunk-FGAEICY3.js";
import {
  AuthService
} from "./chunk-YFWDZ3VL.js";
import {
  brand_exports,
  free_exports
} from "./chunk-YOS6CCYB.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-MENGJYBG.js";
import "./chunk-YLFWSDV3.js";
import {
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  CommonModule,
  FormControlDirective,
  IconDirective,
  IconSetService,
  NgClass,
  NgIf,
  Router,
  finalize,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-ZG2BHLTP.js";
import {
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/views/pages/login/login.component.ts
var _c0 = (a0) => ({ "dark-mode": a0 });
var _c1 = (a0, a1) => ({ "dark-mode": a0, "is-invalid": a1 });
var _c2 = (a0, a1) => ({ "text-primary": a0, "text-info": a1 });
function LoginComponent__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 8);
    \u0275\u0275element(1, "path", 9);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 8);
    \u0275\u0275element(1, "circle", 10)(2, "path", 11)(3, "path", 12)(4, "path", 13)(5, "path", 14)(6, "path", 15)(7, "path", 16)(8, "path", 17)(9, "path", 18);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_c_card_5_span_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1, "Username is required");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_c_card_5__svg_svg_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 40);
    \u0275\u0275element(1, "path", 41)(2, "circle", 42);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_c_card_5__svg_svg_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 40);
    \u0275\u0275element(1, "path", 43)(2, "path", 44)(3, "path", 45)(4, "line", 46);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_c_card_5_span_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1, "Password is required");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_c_card_5_div_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.loginError, " ");
  }
}
function LoginComponent_c_card_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-card", 19)(1, "c-card-body")(2, "h1", 20);
    \u0275\u0275text(3, "Welcome back");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 21);
    \u0275\u0275text(5, "Sign in to your account");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "form", 22);
    \u0275\u0275listener("ngSubmit", function LoginComponent_c_card_5_Template_form_ngSubmit_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSubmit());
    });
    \u0275\u0275elementStart(7, "div", 23)(8, "div", 24);
    \u0275\u0275element(9, "input", 25);
    \u0275\u0275elementStart(10, "label", 26);
    \u0275\u0275text(11, "Username");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(12, LoginComponent_c_card_5_span_12_Template, 2, 0, "span", 27);
    \u0275\u0275elementStart(13, "div", 23)(14, "div", 24);
    \u0275\u0275element(15, "input", 28);
    \u0275\u0275elementStart(16, "label", 29);
    \u0275\u0275text(17, "Password");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "span", 30);
    \u0275\u0275listener("click", function LoginComponent_c_card_5_Template_span_click_18_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.togglePasswordVisibility());
    });
    \u0275\u0275template(19, LoginComponent_c_card_5__svg_svg_19_Template, 3, 0, "svg", 31)(20, LoginComponent_c_card_5__svg_svg_20_Template, 5, 0, "svg", 31);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(21, LoginComponent_c_card_5_span_21_Template, 2, 0, "span", 27);
    \u0275\u0275elementStart(22, "div", 32)(23, "div", 33);
    \u0275\u0275element(24, "input", 34);
    \u0275\u0275elementStart(25, "label", 35);
    \u0275\u0275text(26, " Remember me ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "a", 36);
    \u0275\u0275text(28, "Forgot password?");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "button", 37);
    \u0275\u0275text(30, " Sign in ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(31, LoginComponent_c_card_5_div_31_Template, 2, 1, "div", 38);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(20, _c0, ctx_r1.darkMode));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(22, _c0, ctx_r1.darkMode));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(24, _c0, ctx_r1.darkMode));
    \u0275\u0275advance(2);
    \u0275\u0275property("formGroup", ctx_r1.loginForm);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(26, _c1, ctx_r1.darkMode, ctx_r1.isFieldInvalid("username")));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(29, _c0, ctx_r1.darkMode));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.isFieldInvalid("username"));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(31, _c1, ctx_r1.darkMode, ctx_r1.isFieldInvalid("password")))("type", ctx_r1.showPassword ? "text" : "password");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(34, _c0, ctx_r1.darkMode));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(36, _c0, ctx_r1.darkMode));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.showPassword);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.showPassword);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isFieldInvalid("password"));
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(38, _c0, ctx_r1.darkMode));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(40, _c2, !ctx_r1.darkMode, ctx_r1.darkMode));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("loading", ctx_r1.isLoading);
    \u0275\u0275property("disabled", ctx_r1.loginForm.invalid || ctx_r1.isLoading);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.loginError);
  }
}
function LoginComponent_c_card_6__svg_svg_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "svg", 53);
  }
}
function LoginComponent_c_card_6__svg_svg_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 40);
    \u0275\u0275element(1, "path", 54)(2, "path", 55)(3, "path", 56)(4, "path", 57);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_c_card_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "c-card", 19)(1, "c-card-body", 48)(2, "h1", 49);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 50);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 51);
    \u0275\u0275listener("click", function LoginComponent_c_card_6_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.redirectToSSO());
    });
    \u0275\u0275template(7, LoginComponent_c_card_6__svg_svg_7_Template, 1, 0, "svg", 52)(8, LoginComponent_c_card_6__svg_svg_8_Template, 5, 0, "svg", 31);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(11, _c0, ctx_r1.darkMode));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(13, _c0, ctx_r1.darkMode));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.mode === "SAAS" ? "Login to Mixeway FLow" : "Single Sign-On", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(15, _c0, ctx_r1.darkMode));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.mode === "SAAS" ? "Select Your SSO provider" : "Sign in with your organization credentials", " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("loading", ctx_r1.isLoading);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(17, _c0, ctx_r1.darkMode));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.mode === "SAAS");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.mode !== "SAAS");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.mode === "SAAS" ? "Login with GitHub" : "Continue with SSO", " ");
  }
}
var LoginComponent = class _LoginComponent {
  constructor(fb, authService, router, iconSet) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.iconSet = iconSet;
    this.password = true;
    this.sso = false;
    this.mode = "STANDALONE";
    this.isLoading = false;
    this.loginError = null;
    this.showPassword = false;
    this.darkMode = false;
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      rememberMe: [false]
    });
    iconSet.icons = __spreadValues(__spreadValues(__spreadValues({}, free_exports), iconSet), brand_exports);
    this.darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      this.darkMode = savedDarkMode === "true";
    }
  }
  ngOnInit() {
    this.getStatus();
    this.performHealthCheck();
  }
  performHealthCheck() {
    this.authService.hc().subscribe({
      next: () => {
        this.router.navigate(["/dashboard"]);
      },
      error: () => {
      }
    });
  }
  getStatus() {
    this.authService.status().subscribe({
      next: (response) => {
        this.mode = response.mode;
        if (response.status === "prodsso" || response.status === "devsso") {
          this.password = false;
          this.sso = true;
        } else {
          this.password = true;
          this.sso = false;
        }
      },
      error: () => {
        this.password = true;
        this.sso = false;
      }
    });
  }
  onSubmit() {
    this.loginError = null;
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password, rememberMe } = this.loginForm.value;
      this.authService.login({ username, password, rememberMe }).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: (response) => {
          this.handleLoginSuccess(response);
        },
        error: (error) => {
          this.handleLoginError(error);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  handleLoginSuccess(response) {
    try {
      const payloadBase64 = response.accessToken.split(".")[1];
      const decodedPayload = atob(payloadBase64);
      const payloadObject = JSON.parse(decodedPayload);
      const userRole = payloadObject.roles;
      localStorage.setItem("userRole", userRole);
      navItems.length = 0;
      navItems.push(...getNavItems());
      if (response.resetPassword === true) {
        this.router.navigate(["/change"]);
      } else {
        this.router.navigate(["/dashboard"]);
      }
    } catch (error) {
      console.error("Error processing login response:", error);
      this.loginError = "An unexpected error occurred. Please try again.";
    }
  }
  handleLoginError(error) {
    if (error.status === 401) {
      this.loginError = "Invalid username or password. Please try again.";
    } else if (error.status === 429) {
      this.loginError = "Too many login attempts. Please try again later.";
    } else {
      this.loginError = "An error occurred. Please try again later.";
    }
    console.error("Login error:", error);
  }
  redirectToSSO() {
    this.isLoading = true;
    setTimeout(() => {
      window.location.href = "/oauth2/authorization/sso";
    }, 300);
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem("darkMode", this.darkMode.toString());
  }
  isFieldInvalid(fieldName) {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  static {
    this.\u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LoginComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(IconSetService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 11, vars: 10, consts: [[1, "login-container", 3, "ngClass"], ["type", "button", 1, "theme-toggle", 3, "click", "ngClass"], ["xmlns", "http://www.w3.org/2000/svg", "width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", 4, "ngIf"], [1, "login-card-group", "fade-in-up"], ["class", "auth-card", 3, "ngClass", 4, "ngIf"], [1, "brand-card"], [1, "image-container"], ["src", "assets/images/logo_fill_text.png", "alt", "Company Logo"], ["xmlns", "http://www.w3.org/2000/svg", "width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"], ["cx", "12", "cy", "12", "r", "4"], ["d", "M12 2v2"], ["d", "M12 20v2"], ["d", "m4.93 4.93 1.41 1.41"], ["d", "m17.66 17.66 1.41 1.41"], ["d", "M2 12h2"], ["d", "M20 12h2"], ["d", "m6.34 17.66-1.41 1.41"], ["d", "m19.07 4.93-1.41 1.41"], [1, "auth-card", 3, "ngClass"], [1, "card-title", 3, "ngClass"], [1, "card-subtitle", 3, "ngClass"], [3, "ngSubmit", "formGroup"], [1, "input-group"], [1, "form-floating"], ["id", "username", "formControlName", "username", "autoComplete", "username", "cFormControl", "", "placeholder", "Username", 1, "form-control", 3, "ngClass"], ["for", "username", 3, "ngClass"], ["class", "form-error", 4, "ngIf"], ["id", "password", "formControlName", "password", "autoComplete", "current-password", "cFormControl", "", "placeholder", "Password", 1, "form-control", 3, "ngClass", "type"], ["for", "password", 3, "ngClass"], [1, "input-group-text", 3, "click", "ngClass"], ["xmlns", "http://www.w3.org/2000/svg", "width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", 4, "ngIf"], [1, "d-flex", "justify-content-between", "align-items-center", "mt-4", "mb-2"], [1, "form-check"], ["type", "checkbox", "id", "rememberMe", "formControlName", "rememberMe", 1, "form-check-input"], ["for", "rememberMe", 1, "form-check-label", 3, "ngClass"], ["href", "#", 1, "text-decoration-none", 3, "ngClass"], ["type", "submit", 1, "btn", "btn-primary", "mt-3", 3, "disabled"], ["class", "alert alert-danger mt-3", "role", "alert", 4, "ngIf"], [1, "form-error"], ["xmlns", "http://www.w3.org/2000/svg", "width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"], ["cx", "12", "cy", "12", "r", "3"], ["d", "M9.88 9.88a3 3 0 1 0 4.24 4.24"], ["d", "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"], ["d", "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"], ["x1", "2", "x2", "22", "y1", "2", "y2", "22"], ["role", "alert", 1, "alert", "alert-danger", "mt-3"], [1, "d-flex", "flex-column", "align-items-center", "justify-content-center"], [1, "card-title", "text-center", "mb-2", 3, "ngClass"], [1, "card-subtitle", "text-center", 3, "ngClass"], [1, "btn-sso", "mt-4", 3, "click", "ngClass"], ["cIcon", "", "name", "cib-github", "size", "3xl", 4, "ngIf"], ["cIcon", "", "name", "cib-github", "size", "3xl"], ["d", "M11 12H3"], ["d", "m15 16 4-4-4-4"], ["d", "M4 4v16"], ["d", "M19 12h2"]], template: function LoginComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "button", 1);
        \u0275\u0275listener("click", function LoginComponent_Template_button_click_1_listener() {
          return ctx.toggleDarkMode();
        });
        \u0275\u0275template(2, LoginComponent__svg_svg_2_Template, 2, 0, "svg", 2)(3, LoginComponent__svg_svg_3_Template, 10, 0, "svg", 2);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "c-card-group", 3);
        \u0275\u0275template(5, LoginComponent_c_card_5_Template, 32, 43, "c-card", 4)(6, LoginComponent_c_card_6_Template, 10, 19, "c-card", 4);
        \u0275\u0275elementStart(7, "c-card", 5)(8, "c-card-body")(9, "div", 6);
        \u0275\u0275element(10, "img", 7);
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(6, _c0, ctx.darkMode));
        \u0275\u0275advance();
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(8, _c0, ctx.darkMode));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.darkMode);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.darkMode);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.password && ctx.mode !== "SAAS");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.sso || ctx.mode === "SAAS");
      }
    }, dependencies: [
      CommonModule,
      NgClass,
      NgIf,
      ReactiveFormsModule,
      \u0275NgNoValidate,
      DefaultValueAccessor,
      CheckboxControlValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      FormGroupDirective,
      FormControlName,
      CardGroupComponent,
      CardComponent,
      CardBodyComponent,
      FormControlDirective,
      IconDirective
    ], styles: ['\n\n.login-container[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background:\n    linear-gradient(\n      135deg,\n      #f5f7fa 0%,\n      #e4e9f2 100%);\n  padding: 1.5rem;\n}\n.login-container.dark-mode[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #20232a 0%,\n      #161b22 100%);\n}\n.login-card-group[_ngcontent-%COMP%] {\n  overflow: hidden;\n  border-radius: 12px;\n  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);\n  width: 100%;\n  max-width: 960px;\n}\n@media (max-width: 768px) {\n  .login-card-group[_ngcontent-%COMP%] {\n    flex-direction: column-reverse;\n  }\n}\n.auth-card[_ngcontent-%COMP%] {\n  background-color: white;\n  border: none;\n  padding: 2.5rem !important;\n}\n.auth-card.dark-mode[_ngcontent-%COMP%] {\n  background-color: #1a1d24;\n  color: #e4e9f2;\n}\n.auth-card[_ngcontent-%COMP%]   .card-title[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 700;\n  margin-bottom: 0.5rem;\n}\n@media (max-width: 768px) {\n  .auth-card[_ngcontent-%COMP%]   .card-title[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n.auth-card[_ngcontent-%COMP%]   .card-subtitle[_ngcontent-%COMP%] {\n  color: #6c757d;\n  font-size: 1rem;\n  margin-bottom: 2rem;\n}\n.auth-card[_ngcontent-%COMP%]   .card-subtitle.dark-mode[_ngcontent-%COMP%] {\n  color: #9ca3af;\n}\n.brand-card[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      #4361ee 0%,\n      #3f51b5 100%);\n  border: none;\n}\n@media (max-width: 768px) {\n  .brand-card[_ngcontent-%COMP%] {\n    min-height: 150px;\n  }\n}\n.image-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  padding: 1rem;\n}\n.image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 100%;\n  max-height: 100%;\n  object-fit: contain;\n  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));\n}\n.input-group[_ngcontent-%COMP%] {\n  margin-bottom: 1.25rem;\n  position: relative;\n}\n.input-group[_ngcontent-%COMP%]   .form-floating[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.input-group[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%] {\n  height: 3.25rem;\n  padding: 1rem 1rem 0.5rem;\n  font-size: 1rem;\n  border-radius: 8px;\n  border: 1.5px solid #e2e8f0;\n  background-color: #f8fafc;\n  transition: all 0.2s ease;\n}\n.input-group[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]:focus {\n  border-color: #4361ee;\n  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.25);\n  background-color: white;\n}\n.input-group[_ngcontent-%COMP%]   .form-control.dark-mode[_ngcontent-%COMP%] {\n  background-color: #2d3748;\n  border-color: #4a5568;\n  color: white;\n}\n.input-group[_ngcontent-%COMP%]   .form-control.dark-mode[_ngcontent-%COMP%]:focus {\n  background-color: #1a202c;\n}\n.input-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  color: #64748b;\n}\n.input-group[_ngcontent-%COMP%]   label.dark-mode[_ngcontent-%COMP%] {\n  color: #a0aec0;\n}\n.input-group[_ngcontent-%COMP%]   .input-group-text[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  position: absolute;\n  right: 0;\n  top: 0;\n  height: 100%;\n  z-index: 4;\n  color: #64748b;\n}\n.input-group[_ngcontent-%COMP%]   .input-group-text.dark-mode[_ngcontent-%COMP%] {\n  color: #a0aec0;\n}\n.form-error[_ngcontent-%COMP%] {\n  color: #e53e3e;\n  font-size: 0.875rem;\n  margin-top: -0.75rem;\n  margin-bottom: 1rem;\n  display: block;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background-color: #4361ee;\n  border: none;\n  padding: 0.75rem 1.5rem;\n  font-size: 1rem;\n  font-weight: 600;\n  border-radius: 8px;\n  color: white;\n  transition: all 0.2s ease;\n  min-width: 140px;\n}\n.btn-primary[_ngcontent-%COMP%]:hover, \n.btn-primary[_ngcontent-%COMP%]:focus {\n  background-color: #3a56d4;\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.35);\n}\n.btn-primary[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n.btn-primary.loading[_ngcontent-%COMP%] {\n  position: relative;\n  color: transparent;\n  pointer-events: none;\n}\n.btn-primary.loading[_ngcontent-%COMP%]:after {\n  content: "";\n  position: absolute;\n  width: 1.25rem;\n  height: 1.25rem;\n  top: calc(50% - 0.625rem);\n  left: calc(50% - 0.625rem);\n  border: 2px solid rgba(255, 255, 255, 0.5);\n  border-top-color: white;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spinner 0.8s linear infinite;\n}\n.btn-sso[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.75rem;\n  width: 100%;\n  max-width: 300px;\n  margin: 0 auto;\n  background-color: white;\n  border: 1.5px solid #e2e8f0;\n  color: #4a5568;\n  padding: 0.875rem 1.5rem;\n  font-size: 1rem;\n  font-weight: 500;\n  border-radius: 8px;\n  transition: all 0.2s ease;\n}\n.btn-sso[_ngcontent-%COMP%]:hover {\n  background-color: #f8fafc;\n  border-color: #cbd5e1;\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\n}\n.btn-sso.dark-mode[_ngcontent-%COMP%] {\n  background-color: #2d3748;\n  border-color: #4a5568;\n  color: #e2e8f0;\n}\n.btn-sso.dark-mode[_ngcontent-%COMP%]:hover {\n  background-color: #1a202c;\n}\n.btn-sso[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n}\n.theme-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 1rem;\n  right: 1rem;\n  background: transparent;\n  border: none;\n  color: #64748b;\n  padding: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.theme-toggle[_ngcontent-%COMP%]:hover {\n  color: #4a5568;\n}\n.theme-toggle.dark-mode[_ngcontent-%COMP%] {\n  color: #a0aec0;\n}\n.theme-toggle.dark-mode[_ngcontent-%COMP%]:hover {\n  color: #e2e8f0;\n}\n@keyframes _ngcontent-%COMP%_spinner {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.fade-in-up[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeInUp 0.5s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=login.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent" });
})();
export {
  LoginComponent
};
//# sourceMappingURL=login.component-JP4T7VPW.js.map
