import {
  AuthService
} from "./chunk-YFWDZ3VL.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MinLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-MENGJYBG.js";
import "./chunk-YLFWSDV3.js";
import {
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  CommonModule,
  FormControlDirective,
  FormDirective,
  NgClass,
  NgForOf,
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
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵpureFunction4,
  ɵɵpureFunction6,
  ɵɵpureFunction7,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZG2BHLTP.js";
import "./chunk-4MWRP73S.js";

// src/app/views/pages/change-password/change-password.component.ts
var _c0 = (a0) => ({ "dark-mode": a0 });
var _c1 = (a0) => ({ "was-validated": a0 });
var _c2 = (a0, a1) => ({ "dark-mode": a0, "is-invalid": a1 });
var _c3 = (a0, a1, a2, a3) => ({ "show": a0, "success": a1, "error": a2, "dark-mode": a3 });
var _c4 = (a0, a1) => ({ "success": a0, "error": a1 });
var _c5 = (a0, a1, a2, a3, a4, a5) => ({ "dark-mode": a0, "weak": a1, "fair": a2, "good": a3, "strong": a4, "very-strong": a5 });
var _c6 = () => [1, 2, 3, 4, 5];
var _c7 = (a0, a1, a2, a3, a4, a5, a6) => ({ "dark-mode": a0, "active": a1, "weak": a2, "fair": a3, "good": a4, "strong": a5, "very-strong": a6 });
var _c8 = (a0, a1) => ({ "valid": a0, "invalid": a1 });
function ChangePasswordComponent__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 33);
    \u0275\u0275element(1, "path", 34);
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 33);
    \u0275\u0275element(1, "circle", 35)(2, "path", 36)(3, "path", 37)(4, "path", 38)(5, "path", 39)(6, "path", 40)(7, "path", 41)(8, "path", 42)(9, "path", 43);
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent__svg_svg_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 44);
    \u0275\u0275element(1, "path", 45)(2, "circle", 46);
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent__svg_svg_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 44);
    \u0275\u0275element(1, "path", 47)(2, "path", 48)(3, "path", 49)(4, "line", 50);
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent_span_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 51);
    \u0275\u0275text(1, " New Password is required. ");
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent_span_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 51);
    \u0275\u0275text(1, " New Password must be at least 8 characters long. ");
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent_div_24_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 57);
  }
  if (rf & 2) {
    const segment_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction7(1, _c7, ctx_r3.darkMode, segment_r3 <= ctx_r3.passwordStrength, ctx_r3.passwordStrength === 1, ctx_r3.passwordStrength === 2, ctx_r3.passwordStrength === 3, ctx_r3.passwordStrength === 4, ctx_r3.passwordStrength === 5));
  }
}
function ChangePasswordComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52)(1, "div", 53)(2, "span");
    \u0275\u0275text(3, "Password Strength");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 54);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 55);
    \u0275\u0275template(7, ChangePasswordComponent_div_24_div_7_Template, 1, 9, "div", 56);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction6(4, _c5, ctx_r3.darkMode, ctx_r3.passwordStrength === 1, ctx_r3.passwordStrength === 2, ctx_r3.passwordStrength === 3, ctx_r3.passwordStrength === 4, ctx_r3.passwordStrength === 5));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.passwordStrengthText, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(11, _c0, ctx_r3.darkMode));
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", \u0275\u0275pureFunction0(13, _c6));
  }
}
function ChangePasswordComponent_div_25__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 62);
    \u0275\u0275element(1, "path", 63);
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent_div_25__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 62);
    \u0275\u0275element(1, "path", 64)(2, "path", 65);
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "div", 59);
    \u0275\u0275text(2, "Password Requirements");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 60);
    \u0275\u0275template(4, ChangePasswordComponent_div_25__svg_svg_4_Template, 2, 0, "svg", 61)(5, ChangePasswordComponent_div_25__svg_svg_5_Template, 3, 0, "svg", 61);
    \u0275\u0275text(6, " At least 8 characters ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(5, _c0, ctx_r3.darkMode));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(7, _c0, ctx_r3.darkMode));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(9, _c8, ctx_r3.hasMinLength, !ctx_r3.hasMinLength && ctx_r3.submitted));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.hasMinLength);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r3.hasMinLength);
  }
}
function ChangePasswordComponent__svg_svg_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 44);
    \u0275\u0275element(1, "path", 45)(2, "circle", 46);
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent__svg_svg_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 44);
    \u0275\u0275element(1, "path", 47)(2, "path", 48)(3, "path", 49)(4, "line", 50);
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent_span_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 51);
    \u0275\u0275text(1, " Confirm Password is required. ");
    \u0275\u0275elementEnd();
  }
}
function ChangePasswordComponent_span_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 51);
    \u0275\u0275text(1, " Passwords do not match. ");
    \u0275\u0275elementEnd();
  }
}
var ChangePasswordComponent = class _ChangePasswordComponent {
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
    this.newPassword = "";
    this.confirmPassword = "";
    this.submitted = false;
    this.passwordMismatch = false;
    this.isLoading = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.visible = false;
    this.toastMessage = "";
    this.toastStatus = "";
    this.toastProgress = 0;
    this.passwordStrength = 0;
    this.passwordStrengthText = "";
    this.hasMinLength = false;
    this.darkMode = false;
  }
  ngOnInit() {
    this.darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      this.darkMode = savedDarkMode === "true";
    }
  }
  ngOnDestroy() {
    if (this.toastTimer) {
      clearInterval(this.toastTimer);
    }
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
  }
  // Toggle visibility of password fields
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  // Toggle dark mode
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem("darkMode", this.darkMode.toString());
  }
  // Check password strength and requirements
  checkPasswordStrength() {
    const password = this.newPassword;
    this.hasMinLength = password.length >= 8;
    let strengthScore = 0;
    if (password.length > 0) {
      if (password.length >= 1)
        strengthScore = 1;
      if (password.length >= 4)
        strengthScore = 2;
      if (password.length >= 6)
        strengthScore = 3;
      if (password.length >= 8)
        strengthScore = 4;
      if (password.length >= 12)
        strengthScore = 5;
    }
    this.passwordStrength = strengthScore;
    switch (strengthScore) {
      case 0:
        this.passwordStrengthText = "";
        break;
      case 1:
        this.passwordStrengthText = "Weak";
        break;
      case 2:
        this.passwordStrengthText = "Fair";
        break;
      case 3:
        this.passwordStrengthText = "Good";
        break;
      case 4:
        this.passwordStrengthText = "Strong";
        break;
      case 5:
        this.passwordStrengthText = "Very Strong";
        break;
    }
  }
  // Form submission handler
  onChangePassword(form) {
    this.submitted = true;
    this.passwordMismatch = this.newPassword !== this.confirmPassword;
    this.checkPasswordStrength();
    if (form.valid && !this.passwordMismatch) {
      this.isLoading = true;
      const changePasswordData = {
        password: this.newPassword,
        passwordRepeat: this.confirmPassword
      };
      this.authService.changePassword(changePasswordData).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: (response) => {
          this.showToast("success", "Password changed successfully. Redirecting to dashboard...");
          setTimeout(() => {
            this.router.navigate(["/dashboard"]);
          }, 2e3);
        },
        error: (error) => {
          if (error.status === 400) {
            this.showToast("danger", "Password does not meet the requirements. Please check and try again.");
          } else {
            this.showToast("danger", "An error occurred. Please try again later.");
          }
        }
      });
    } else {
      if (this.passwordMismatch) {
        this.showToast("danger", "Passwords do not match. Please check and try again.");
      } else {
        this.showToast("danger", "Please fix the errors in the form and try again.");
      }
    }
  }
  // Toast notification handlers
  showToast(status, message) {
    this.toastStatus = status;
    this.toastMessage = message;
    this.visible = true;
    this.toastProgress = 0;
    if (this.toastTimer) {
      clearInterval(this.toastTimer);
    }
    const duration = 5e3;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;
    this.toastTimer = setInterval(() => {
      step++;
      this.toastProgress = step / steps * 100;
      if (step >= steps) {
        this.visible = false;
        clearInterval(this.toastTimer);
      }
    }, interval);
  }
  toggleToast() {
    this.visible = !this.visible;
    if (!this.visible && this.toastTimer) {
      clearInterval(this.toastTimer);
    }
  }
  onVisibleChange(isVisible) {
    this.visible = isVisible;
    if (!isVisible && this.toastTimer) {
      clearInterval(this.toastTimer);
    }
  }
  // Validation helper
  isFieldInvalid(field) {
    return !!(field.invalid && (field.dirty || field.touched || this.submitted));
  }
  static {
    this.\u0275fac = function ChangePasswordComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChangePasswordComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChangePasswordComponent, selectors: [["app-change-password"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 55, vars: 70, consts: [["changePasswordForm", "ngForm"], ["newPasswordCtrl", "ngModel"], ["confirmPasswordCtrl", "ngModel"], [1, "change-password-container", 3, "ngClass"], ["type", "button", 1, "theme-toggle", 3, "click", "ngClass"], ["xmlns", "http://www.w3.org/2000/svg", "width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", 4, "ngIf"], [1, "password-card-group", "fade-in-up"], [1, "password-card", 3, "ngClass"], [1, "card-title", 3, "ngClass"], [1, "card-subtitle", 3, "ngClass"], ["cForm", "", 3, "ngSubmit", "ngClass"], [1, "input-group"], [1, "form-floating"], ["id", "newPassword", "cFormControl", "", "placeholder", "New Password", "name", "newPassword", "required", "", "minlength", "8", 1, "form-control", 3, "ngModelChange", "input", "ngClass", "type", "ngModel"], ["for", "newPassword", 3, "ngClass"], [1, "input-group-text", 3, "click", "ngClass"], ["xmlns", "http://www.w3.org/2000/svg", "width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", 4, "ngIf"], ["class", "form-error", 4, "ngIf"], ["class", "password-strength", 4, "ngIf"], ["class", "requirements", 3, "ngClass", 4, "ngIf"], ["id", "confirmPassword", "cFormControl", "", "placeholder", "Confirm New Password", "name", "confirmPassword", "required", "", "minlength", "8", 1, "form-control", 3, "ngModelChange", "ngClass", "type", "ngModel"], ["for", "confirmPassword", 3, "ngClass"], [1, "d-flex", "justify-content-center", "mt-4"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [1, "brand-card"], [1, "image-container"], ["src", "assets/images/logo_fill_text.png", "alt", "Company Logo"], [1, "custom-toast", 3, "ngClass"], [1, "toast-header"], [1, "close-button", 3, "click"], [1, "toast-body"], [1, "progress-bar"], [1, "progress", 3, "ngClass"], ["xmlns", "http://www.w3.org/2000/svg", "width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"], ["cx", "12", "cy", "12", "r", "4"], ["d", "M12 2v2"], ["d", "M12 20v2"], ["d", "m4.93 4.93 1.41 1.41"], ["d", "m17.66 17.66 1.41 1.41"], ["d", "M2 12h2"], ["d", "M20 12h2"], ["d", "m6.34 17.66-1.41 1.41"], ["d", "m19.07 4.93-1.41 1.41"], ["xmlns", "http://www.w3.org/2000/svg", "width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"], ["cx", "12", "cy", "12", "r", "3"], ["d", "M9.88 9.88a3 3 0 1 0 4.24 4.24"], ["d", "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"], ["d", "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"], ["x1", "2", "x2", "22", "y1", "2", "y2", "22"], [1, "form-error"], [1, "password-strength"], [1, "strength-title"], [1, "strength-text", 3, "ngClass"], [1, "strength-meter", 3, "ngClass"], ["class", "meter-segment", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "meter-segment", 3, "ngClass"], [1, "requirements", 3, "ngClass"], [1, "requirements-title", 3, "ngClass"], [1, "requirement-item", 3, "ngClass"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", 4, "ngIf"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M20 6 9 17l-5-5"], ["d", "M18 6 6 18"], ["d", "m6 6 12 12"]], template: function ChangePasswordComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "div", 3)(1, "button", 4);
        \u0275\u0275listener("click", function ChangePasswordComponent_Template_button_click_1_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.toggleDarkMode());
        });
        \u0275\u0275template(2, ChangePasswordComponent__svg_svg_2_Template, 2, 0, "svg", 5)(3, ChangePasswordComponent__svg_svg_3_Template, 10, 0, "svg", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "c-card-group", 6)(5, "c-card", 7)(6, "c-card-body")(7, "h1", 8);
        \u0275\u0275text(8, "Change Password");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "p", 9);
        \u0275\u0275text(10, "Set your new secure password");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "form", 10, 0);
        \u0275\u0275listener("ngSubmit", function ChangePasswordComponent_Template_form_ngSubmit_11_listener() {
          \u0275\u0275restoreView(_r1);
          const changePasswordForm_r2 = \u0275\u0275reference(12);
          return \u0275\u0275resetView(ctx.onChangePassword(changePasswordForm_r2));
        });
        \u0275\u0275elementStart(13, "div", 11)(14, "div", 12)(15, "input", 13, 1);
        \u0275\u0275twoWayListener("ngModelChange", function ChangePasswordComponent_Template_input_ngModelChange_15_listener($event) {
          \u0275\u0275restoreView(_r1);
          \u0275\u0275twoWayBindingSet(ctx.newPassword, $event) || (ctx.newPassword = $event);
          return \u0275\u0275resetView($event);
        });
        \u0275\u0275listener("input", function ChangePasswordComponent_Template_input_input_15_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.checkPasswordStrength());
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "label", 14);
        \u0275\u0275text(18, "New Password");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(19, "span", 15);
        \u0275\u0275listener("click", function ChangePasswordComponent_Template_span_click_19_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.toggleNewPasswordVisibility());
        });
        \u0275\u0275template(20, ChangePasswordComponent__svg_svg_20_Template, 3, 0, "svg", 16)(21, ChangePasswordComponent__svg_svg_21_Template, 5, 0, "svg", 16);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(22, ChangePasswordComponent_span_22_Template, 2, 0, "span", 17)(23, ChangePasswordComponent_span_23_Template, 2, 0, "span", 17)(24, ChangePasswordComponent_div_24_Template, 8, 14, "div", 18)(25, ChangePasswordComponent_div_25_Template, 7, 12, "div", 19);
        \u0275\u0275elementStart(26, "div", 11)(27, "div", 12)(28, "input", 20, 2);
        \u0275\u0275twoWayListener("ngModelChange", function ChangePasswordComponent_Template_input_ngModelChange_28_listener($event) {
          \u0275\u0275restoreView(_r1);
          \u0275\u0275twoWayBindingSet(ctx.confirmPassword, $event) || (ctx.confirmPassword = $event);
          return \u0275\u0275resetView($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(30, "label", 21);
        \u0275\u0275text(31, "Confirm New Password");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(32, "span", 15);
        \u0275\u0275listener("click", function ChangePasswordComponent_Template_span_click_32_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.toggleConfirmPasswordVisibility());
        });
        \u0275\u0275template(33, ChangePasswordComponent__svg_svg_33_Template, 3, 0, "svg", 16)(34, ChangePasswordComponent__svg_svg_34_Template, 5, 0, "svg", 16);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(35, ChangePasswordComponent_span_35_Template, 2, 0, "span", 17)(36, ChangePasswordComponent_span_36_Template, 2, 0, "span", 17);
        \u0275\u0275elementStart(37, "div", 22)(38, "button", 23);
        \u0275\u0275text(39, " Change Password ");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(40, "c-card", 24)(41, "c-card-body")(42, "div", 25);
        \u0275\u0275element(43, "img", 26);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(44, "div", 27)(45, "div", 28)(46, "span");
        \u0275\u0275text(47, "Change Password");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(48, "button", 29);
        \u0275\u0275listener("click", function ChangePasswordComponent_Template_button_click_48_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.toggleToast());
        });
        \u0275\u0275text(49, "\xD7");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(50, "div", 30)(51, "p");
        \u0275\u0275text(52);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(53, "div", 31);
        \u0275\u0275element(54, "div", 32);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        const newPasswordCtrl_r5 = \u0275\u0275reference(16);
        const confirmPasswordCtrl_r6 = \u0275\u0275reference(29);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(36, _c0, ctx.darkMode));
        \u0275\u0275advance();
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(38, _c0, ctx.darkMode));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.darkMode);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.darkMode);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(40, _c0, ctx.darkMode));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(42, _c0, ctx.darkMode));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(44, _c0, ctx.darkMode));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(46, _c1, ctx.submitted));
        \u0275\u0275advance(4);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(48, _c2, ctx.darkMode, ctx.isFieldInvalid(newPasswordCtrl_r5)))("type", ctx.showNewPassword ? "text" : "password");
        \u0275\u0275twoWayProperty("ngModel", ctx.newPassword);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(51, _c0, ctx.darkMode));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(53, _c0, ctx.darkMode));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.showNewPassword);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showNewPassword);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.isFieldInvalid(newPasswordCtrl_r5) && (newPasswordCtrl_r5.errors == null ? null : newPasswordCtrl_r5.errors["required"]));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.isFieldInvalid(newPasswordCtrl_r5) && (newPasswordCtrl_r5.errors == null ? null : newPasswordCtrl_r5.errors["minlength"]));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.newPassword);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.newPassword);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(55, _c2, ctx.darkMode, ctx.isFieldInvalid(confirmPasswordCtrl_r6) || ctx.passwordMismatch))("type", ctx.showConfirmPassword ? "text" : "password");
        \u0275\u0275twoWayProperty("ngModel", ctx.confirmPassword);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(58, _c0, ctx.darkMode));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(60, _c0, ctx.darkMode));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.showConfirmPassword);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showConfirmPassword);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.isFieldInvalid(confirmPasswordCtrl_r6) && (confirmPasswordCtrl_r6.errors == null ? null : confirmPasswordCtrl_r6.errors["required"]));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.submitted && ctx.passwordMismatch);
        \u0275\u0275advance(2);
        \u0275\u0275classProp("loading", ctx.isLoading);
        \u0275\u0275property("disabled", ctx.isLoading);
        \u0275\u0275advance(6);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(62, _c3, ctx.visible, ctx.toastStatus === "success", ctx.toastStatus === "danger", ctx.darkMode));
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.toastMessage);
        \u0275\u0275advance(2);
        \u0275\u0275styleProp("width", ctx.toastProgress, "%");
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(67, _c4, ctx.toastStatus === "success", ctx.toastStatus === "danger"));
      }
    }, dependencies: [
      CardComponent,
      CardBodyComponent,
      FormControlDirective,
      CardGroupComponent,
      FormDirective,
      FormsModule,
      \u0275NgNoValidate,
      DefaultValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      RequiredValidator,
      MinLengthValidator,
      NgModel,
      NgForm,
      CommonModule,
      NgClass,
      NgForOf,
      NgIf
    ], styles: ['\n\n.change-password-container[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background:\n    linear-gradient(\n      135deg,\n      #f5f7fa 0%,\n      #e4e9f2 100%);\n  padding: 1.5rem;\n}\n.change-password-container.dark-mode[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #20232a 0%,\n      #161b22 100%);\n}\n.password-card-group[_ngcontent-%COMP%] {\n  overflow: hidden;\n  border-radius: 12px;\n  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);\n  width: 100%;\n  max-width: 960px;\n}\n@media (max-width: 768px) {\n  .password-card-group[_ngcontent-%COMP%] {\n    flex-direction: column-reverse;\n  }\n}\n.password-card[_ngcontent-%COMP%] {\n  background-color: white;\n  border: none;\n  padding: 2.5rem !important;\n}\n.password-card.dark-mode[_ngcontent-%COMP%] {\n  background-color: #1a1d24;\n  color: #e4e9f2;\n}\n.password-card[_ngcontent-%COMP%]   .card-title[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 700;\n  margin-bottom: 0.5rem;\n}\n@media (max-width: 768px) {\n  .password-card[_ngcontent-%COMP%]   .card-title[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n.password-card[_ngcontent-%COMP%]   .card-subtitle[_ngcontent-%COMP%] {\n  color: #6c757d;\n  font-size: 1rem;\n  margin-bottom: 2rem;\n}\n.password-card[_ngcontent-%COMP%]   .card-subtitle.dark-mode[_ngcontent-%COMP%] {\n  color: #9ca3af;\n}\n.brand-card[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      #4361ee 0%,\n      #3f51b5 100%);\n  border: none;\n}\n@media (max-width: 768px) {\n  .brand-card[_ngcontent-%COMP%] {\n    min-height: 150px;\n  }\n}\n.image-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  padding: 1rem;\n}\n.image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 100%;\n  max-height: 100%;\n  object-fit: contain;\n  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));\n}\n.input-group[_ngcontent-%COMP%] {\n  margin-bottom: 1.25rem;\n  position: relative;\n}\n.input-group[_ngcontent-%COMP%]   .form-floating[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.input-group[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%] {\n  height: 3.25rem;\n  padding: 1rem 1rem 0.5rem;\n  font-size: 1rem;\n  border-radius: 8px;\n  border: 1.5px solid #e2e8f0;\n  background-color: #f8fafc;\n  transition: all 0.2s ease;\n}\n.input-group[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]:focus {\n  border-color: #4361ee;\n  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.25);\n  background-color: white;\n}\n.input-group[_ngcontent-%COMP%]   .form-control.dark-mode[_ngcontent-%COMP%] {\n  background-color: #2d3748;\n  border-color: #4a5568;\n  color: white;\n}\n.input-group[_ngcontent-%COMP%]   .form-control.dark-mode[_ngcontent-%COMP%]:focus {\n  background-color: #1a202c;\n}\n.input-group[_ngcontent-%COMP%]   .form-control.is-invalid[_ngcontent-%COMP%] {\n  border-color: #e53e3e;\n}\n.input-group[_ngcontent-%COMP%]   .form-control.is-invalid[_ngcontent-%COMP%]:focus {\n  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.25);\n}\n.input-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  color: #64748b;\n}\n.input-group[_ngcontent-%COMP%]   label.dark-mode[_ngcontent-%COMP%] {\n  color: #a0aec0;\n}\n.input-group[_ngcontent-%COMP%]   .input-group-text[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  position: absolute;\n  right: 0;\n  top: 0;\n  height: 100%;\n  z-index: 4;\n  color: #64748b;\n  cursor: pointer;\n}\n.input-group[_ngcontent-%COMP%]   .input-group-text.dark-mode[_ngcontent-%COMP%] {\n  color: #a0aec0;\n}\n.form-error[_ngcontent-%COMP%] {\n  color: #e53e3e;\n  font-size: 0.875rem;\n  margin-top: -0.75rem;\n  margin-bottom: 1rem;\n  display: block;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background-color: #4361ee;\n  border: none;\n  padding: 0.75rem 1.5rem;\n  font-size: 1rem;\n  font-weight: 600;\n  border-radius: 8px;\n  color: white;\n  transition: all 0.2s ease;\n  min-width: 200px;\n}\n.btn-primary[_ngcontent-%COMP%]:hover, \n.btn-primary[_ngcontent-%COMP%]:focus {\n  background-color: #3a56d4;\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.35);\n}\n.btn-primary[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n.btn-primary.loading[_ngcontent-%COMP%] {\n  position: relative;\n  color: transparent;\n  pointer-events: none;\n}\n.btn-primary.loading[_ngcontent-%COMP%]:after {\n  content: "";\n  position: absolute;\n  width: 1.25rem;\n  height: 1.25rem;\n  top: calc(50% - 0.625rem);\n  left: calc(50% - 0.625rem);\n  border: 2px solid rgba(255, 255, 255, 0.5);\n  border-top-color: white;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spinner 0.8s linear infinite;\n}\n.theme-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 1rem;\n  right: 1rem;\n  background: transparent;\n  border: none;\n  color: #64748b;\n  padding: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.theme-toggle[_ngcontent-%COMP%]:hover {\n  color: #4a5568;\n}\n.theme-toggle.dark-mode[_ngcontent-%COMP%] {\n  color: #a0aec0;\n}\n.theme-toggle.dark-mode[_ngcontent-%COMP%]:hover {\n  color: #e2e8f0;\n}\n.password-strength[_ngcontent-%COMP%] {\n  margin-bottom: 1.25rem;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  font-size: 0.875rem;\n  margin-bottom: 0.5rem;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%]   .strength-text[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%]   .strength-text.weak[_ngcontent-%COMP%] {\n  color: #e53e3e;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%]   .strength-text.fair[_ngcontent-%COMP%] {\n  color: #ed8936;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%]   .strength-text.good[_ngcontent-%COMP%] {\n  color: #ecc94b;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%]   .strength-text.strong[_ngcontent-%COMP%] {\n  color: #48bb78;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%]   .strength-text.very-strong[_ngcontent-%COMP%] {\n  color: #38a169;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%]   .strength-text.dark-mode.weak[_ngcontent-%COMP%] {\n  color: #ee8181;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%]   .strength-text.dark-mode.fair[_ngcontent-%COMP%] {\n  color: #f3b27c;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%]   .strength-text.dark-mode.good[_ngcontent-%COMP%] {\n  color: #f3de90;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%]   .strength-text.dark-mode.strong[_ngcontent-%COMP%] {\n  color: #80d0a1;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-title[_ngcontent-%COMP%]   .strength-text.dark-mode.very-strong[_ngcontent-%COMP%] {\n  color: #5ec78f;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-meter[_ngcontent-%COMP%] {\n  height: 6px;\n  border-radius: 3px;\n  background-color: #e2e8f0;\n  display: flex;\n  overflow: hidden;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-meter.dark-mode[_ngcontent-%COMP%] {\n  background-color: #4a5568;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-meter[_ngcontent-%COMP%]   .meter-segment[_ngcontent-%COMP%] {\n  height: 100%;\n  width: 20%;\n  margin-right: 2px;\n  border-radius: 3px;\n  background-color: #e2e8f0;\n  transition: background-color 0.2s;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-meter[_ngcontent-%COMP%]   .meter-segment.dark-mode[_ngcontent-%COMP%] {\n  background-color: #4a5568;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-meter[_ngcontent-%COMP%]   .meter-segment.active.weak[_ngcontent-%COMP%] {\n  background-color: #e53e3e;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-meter[_ngcontent-%COMP%]   .meter-segment.active.fair[_ngcontent-%COMP%] {\n  background-color: #ed8936;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-meter[_ngcontent-%COMP%]   .meter-segment.active.good[_ngcontent-%COMP%] {\n  background-color: #ecc94b;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-meter[_ngcontent-%COMP%]   .meter-segment.active.strong[_ngcontent-%COMP%] {\n  background-color: #48bb78;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-meter[_ngcontent-%COMP%]   .meter-segment.active.very-strong[_ngcontent-%COMP%] {\n  background-color: #38a169;\n}\n.password-strength[_ngcontent-%COMP%]   .strength-meter[_ngcontent-%COMP%]   .meter-segment[_ngcontent-%COMP%]:last-child {\n  margin-right: 0;\n}\n.requirements[_ngcontent-%COMP%] {\n  margin-bottom: 1.25rem;\n  padding: 1rem;\n  background-color: #f8fafc;\n  border-radius: 8px;\n  font-size: 0.875rem;\n}\n.requirements.dark-mode[_ngcontent-%COMP%] {\n  background-color: #2d3748;\n}\n.requirements.dark-mode[_ngcontent-%COMP%]   .requirement-item[_ngcontent-%COMP%] {\n  color: #a0aec0;\n}\n.requirements[_ngcontent-%COMP%]   .requirements-title[_ngcontent-%COMP%] {\n  font-weight: 600;\n  margin-bottom: 0.5rem;\n  color: #4a5568;\n}\n.requirements[_ngcontent-%COMP%]   .requirements-title.dark-mode[_ngcontent-%COMP%] {\n  color: #e2e8f0;\n}\n.requirements[_ngcontent-%COMP%]   .requirement-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-bottom: 0.25rem;\n  color: #64748b;\n}\n.requirements[_ngcontent-%COMP%]   .requirement-item[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n  flex-shrink: 0;\n}\n.requirements[_ngcontent-%COMP%]   .requirement-item.valid[_ngcontent-%COMP%] {\n  color: #48bb78;\n}\n.requirements[_ngcontent-%COMP%]   .requirement-item.invalid[_ngcontent-%COMP%] {\n  color: #e53e3e;\n}\n.custom-toast[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 1rem;\n  right: 1rem;\n  max-width: 350px;\n  border-radius: 8px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  overflow: hidden;\n  opacity: 0;\n  transform: translateY(-20px);\n  transition: all 0.3s ease;\n  z-index: 9999;\n}\n.custom-toast.show[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: translateY(0);\n}\n.custom-toast.success[_ngcontent-%COMP%] {\n  background-color: #d4edda;\n  border-left: 4px solid #38a169;\n  color: #155724;\n}\n.custom-toast.success[_ngcontent-%COMP%]   .toast-header[_ngcontent-%COMP%] {\n  border-bottom-color: rgba(56, 161, 105, 0.2);\n  color: #155724;\n}\n.custom-toast.error[_ngcontent-%COMP%] {\n  background-color: #f8d7da;\n  border-left: 4px solid #e53e3e;\n  color: #721c24;\n}\n.custom-toast.error[_ngcontent-%COMP%]   .toast-header[_ngcontent-%COMP%] {\n  border-bottom-color: rgba(229, 62, 62, 0.2);\n  color: #721c24;\n}\n.custom-toast[_ngcontent-%COMP%]   .toast-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0.75rem 1rem;\n  background-color: rgba(255, 255, 255, 0.5);\n  font-weight: 600;\n}\n.custom-toast[_ngcontent-%COMP%]   .toast-header[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  padding: 0;\n  font-size: 1.25rem;\n  line-height: 1;\n  opacity: 0.5;\n  transition: opacity 0.15s;\n}\n.custom-toast[_ngcontent-%COMP%]   .toast-header[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%]:hover {\n  opacity: 0.75;\n}\n.custom-toast[_ngcontent-%COMP%]   .toast-body[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n}\n.custom-toast[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  height: 4px;\n  background-color: rgba(0, 0, 0, 0.1);\n  width: 100%;\n}\n.custom-toast[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%]   .progress[_ngcontent-%COMP%] {\n  height: 100%;\n  width: 0;\n  transition: width linear;\n}\n.custom-toast[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%]   .progress.success[_ngcontent-%COMP%] {\n  background-color: #38a169;\n}\n.custom-toast[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%]   .progress.error[_ngcontent-%COMP%] {\n  background-color: #e53e3e;\n}\n.custom-toast.dark-mode.success[_ngcontent-%COMP%] {\n  background-color: #1a2e22;\n  color: #9ae6b4;\n}\n.custom-toast.dark-mode.success[_ngcontent-%COMP%]   .toast-header[_ngcontent-%COMP%] {\n  background-color: rgba(0, 0, 0, 0.2);\n  color: #9ae6b4;\n  border-bottom-color: rgba(56, 161, 105, 0.2);\n}\n.custom-toast.dark-mode.error[_ngcontent-%COMP%] {\n  background-color: #2d1a1a;\n  color: #feb2b2;\n}\n.custom-toast.dark-mode.error[_ngcontent-%COMP%]   .toast-header[_ngcontent-%COMP%] {\n  background-color: rgba(0, 0, 0, 0.2);\n  color: #feb2b2;\n  border-bottom-color: rgba(229, 62, 62, 0.2);\n}\n.fade-in-up[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeInUp 0.5s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_spinner {\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=change-password.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChangePasswordComponent, { className: "ChangePasswordComponent" });
})();
export {
  ChangePasswordComponent
};
//# sourceMappingURL=change-password.component-DQIAHTQ7.js.map
