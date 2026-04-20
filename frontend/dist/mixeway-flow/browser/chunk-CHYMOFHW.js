import {
  environment
} from "./chunk-YLFWSDV3.js";
import {
  HttpClient,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZG2BHLTP.js";

// src/app/service/DashboardService.ts
var DashboardService = class _DashboardService {
  constructor(http) {
    this.http = http;
    this.loginUrl = environment.backendUrl;
  }
  getRepos() {
    return this.http.get(this.loginUrl + "/api/v1/coderepo", { withCredentials: true });
  }
  createRepo(createRepo, repoType) {
    return this.http.post(this.loginUrl + "/api/v1/coderepo/create/" + repoType, createRepo, { withCredentials: true });
  }
  getAggregatedStats() {
    return this.http.get(this.loginUrl + "/api/v1/widget_stats", { withCredentials: true });
  }
  connectProvider(repo) {
    return this.http.post(this.loginUrl + "/api/v1/repository-provider/connect", repo, { withCredentials: true });
  }
  getRepositoryProviders() {
    return this.http.get(this.loginUrl + "/api/v1/repository-provider", { withCredentials: true });
  }
  changeTeamForRepos(repoIds, newTeamId) {
    return this.http.put(this.loginUrl + "/api/v1/coderepo/bulk/change-team", { "repositoryIds": repoIds, "newTeamId": newTeamId }, { withCredentials: true });
  }
  static {
    this.\u0275fac = function DashboardService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DashboardService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DashboardService, factory: _DashboardService.\u0275fac, providedIn: "root" });
  }
};

export {
  DashboardService
};
//# sourceMappingURL=chunk-CHYMOFHW.js.map
