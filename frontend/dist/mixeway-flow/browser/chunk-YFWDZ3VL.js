import {
  environment
} from "./chunk-YLFWSDV3.js";
import {
  HttpClient,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZG2BHLTP.js";

// src/app/service/AuthService.ts
var AuthService = class _AuthService {
  constructor(http) {
    this.http = http;
    this.loginUrl = environment.backendUrl;
  }
  login(credentials) {
    return this.http.post(this.loginUrl + "/api/v1/login", credentials, { withCredentials: true });
  }
  hc() {
    return this.http.get(this.loginUrl + "/api/v1/hc", { withCredentials: true });
  }
  status() {
    return this.http.get(this.loginUrl + "/api/v1/status");
  }
  hcAdmin() {
    return this.http.get(this.loginUrl + "/api/v1/hc/admin", { withCredentials: true });
  }
  hcTeamManager() {
    return this.http.get(this.loginUrl + "/api/v1/hc/tm", { withCredentials: true });
  }
  changePassword(passwordData) {
    return this.http.post(this.loginUrl + "/api/v1/change-password", passwordData, { withCredentials: true });
  }
  static {
    this.\u0275fac = function AuthService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AuthService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
  }
};

export {
  AuthService
};
//# sourceMappingURL=chunk-YFWDZ3VL.js.map
