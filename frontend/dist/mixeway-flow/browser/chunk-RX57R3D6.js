import {
  environment
} from "./chunk-YLFWSDV3.js";
import {
  HttpClient,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZG2BHLTP.js";

// src/app/service/UserService.ts
var UserService = class _UserService {
  constructor(http) {
    this.http = http;
    this.loginUrl = environment.backendUrl;
  }
  get() {
    return this.http.get(this.loginUrl + "/api/v1/users", { withCredentials: true });
  }
  create(user) {
    return this.http.post(this.loginUrl + "/api/v1/user/create", user, { withCredentials: true });
  }
  changeRole(role, id) {
    return this.http.post(this.loginUrl + "/api/v1/user/" + id + "/change/role", role, { withCredentials: true });
  }
  changeTeam(teams, id) {
    return this.http.post(this.loginUrl + "/api/v1/user/" + id + "/change/team", teams, { withCredentials: true });
  }
  changePassword(password, id) {
    return this.http.post(this.loginUrl + "/api/v1/user/" + id + "/change/password", password, { withCredentials: true });
  }
  deactivate(id) {
    return this.http.get(this.loginUrl + "/api/v1/user/" + id + "/deactivate", { withCredentials: true });
  }
  activate(id) {
    return this.http.get(this.loginUrl + "/api/v1/user/" + id + "/activate", { withCredentials: true });
  }
  generateApiKey() {
    return this.http.post(this.loginUrl + "/api/v1/user/apikey", {}, { withCredentials: true });
  }
  static {
    this.\u0275fac = function UserService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _UserService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserService, factory: _UserService.\u0275fac, providedIn: "root" });
  }
};

export {
  UserService
};
//# sourceMappingURL=chunk-RX57R3D6.js.map
