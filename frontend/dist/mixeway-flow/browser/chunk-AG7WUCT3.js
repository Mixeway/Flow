import {
  HttpClient,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZG2BHLTP.js";

// src/app/service/AppConfigService.ts
var AppConfigService = class _AppConfigService {
  constructor(http) {
    this.http = http;
    this.baseUrl = "/api/v1/admin/config";
  }
  getRunMode() {
    return this.http.get(`${this.baseUrl}/runmode`);
  }
  setRunMode(mode) {
    return this.http.post(`${this.baseUrl}/runmode`, { mode });
  }
  getAppModeInfo() {
    return this.http.get("/api/v1/user/app-info");
  }
  static {
    this.\u0275fac = function AppConfigService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AppConfigService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AppConfigService, factory: _AppConfigService.\u0275fac, providedIn: "root" });
  }
};

export {
  AppConfigService
};
//# sourceMappingURL=chunk-AG7WUCT3.js.map
