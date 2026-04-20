import {
  environment
} from "./chunk-YLFWSDV3.js";
import {
  HttpClient,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZG2BHLTP.js";

// src/app/service/TeamService.ts
var TeamService = class _TeamService {
  constructor(http) {
    this.http = http;
    this.loginUrl = environment.backendUrl;
  }
  create(team) {
    return this.http.post(this.loginUrl + "/api/v1/team/create", team, { withCredentials: true });
  }
  get() {
    return this.http.get(this.loginUrl + "/api/v1/team", { withCredentials: true });
  }
  getTeam(id) {
    return this.http.get(this.loginUrl + "/api/v1/team/" + id, { withCredentials: true });
  }
  update(change) {
    return this.http.post(this.loginUrl + "/api/v1/team", change, { withCredentials: true });
  }
  delete(id) {
    return this.http.delete(`/api/v1/team/${id}`);
  }
  static {
    this.\u0275fac = function TeamService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TeamService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TeamService, factory: _TeamService.\u0275fac, providedIn: "root" });
  }
};

export {
  TeamService
};
//# sourceMappingURL=chunk-DKK4C6S4.js.map
