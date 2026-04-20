import {
  environment
} from "./chunk-YLFWSDV3.js";
import {
  HttpClient,
  map,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZG2BHLTP.js";

// src/app/service/SettingsService.ts
var SettingsService = class _SettingsService {
  constructor(http) {
    this.http = http;
    this.loginUrl = environment.backendUrl;
  }
  changeSca(scaConfig) {
    return this.http.post(this.loginUrl + "/api/v1/admin/settings/scaconfig", scaConfig, { withCredentials: true });
  }
  changeSmtp(smtpConfig) {
    return this.http.post(this.loginUrl + "/api/v1/admin/settings/smtpconfig", smtpConfig, { withCredentials: true });
  }
  get() {
    return this.http.get(this.loginUrl + "/api/v1/admin/settings", { withCredentials: true });
  }
  changeWiz(wizConfig) {
    return this.http.post(`${this.loginUrl}/api/v1/admin/settings/wizconfig`, wizConfig, { withCredentials: true });
  }
  changeOtherConfig(changeOtherConfigRequest) {
    return this.http.post(`${this.loginUrl}/api/v1/admin/settings/other`, changeOtherConfigRequest, { withCredentials: true });
  }
  isWizEnabled() {
    return this.http.get(`${this.loginUrl}/api/v1/admin/settings`, { withCredentials: true }).pipe(map((settings) => settings.wizConfig?.enabled ?? false));
  }
  getAdditionalScannerConfig() {
    return this.http.get(`${this.loginUrl}/api/v1/admin/settings/additionalscannerconfig`, { withCredentials: true });
  }
  changeOllama(ollamaConfig) {
    return this.http.post(`${this.loginUrl}/api/v1/admin/settings/ollamaconfig`, ollamaConfig, { withCredentials: true });
  }
  testOllamaConnection(body) {
    return this.http.post(`${this.loginUrl}/api/v1/admin/settings/ollama/test`, body ?? {}, { withCredentials: true });
  }
  static {
    this.\u0275fac = function SettingsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SettingsService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SettingsService, factory: _SettingsService.\u0275fac, providedIn: "root" });
  }
};

export {
  SettingsService
};
//# sourceMappingURL=chunk-T5O4OQUQ.js.map
