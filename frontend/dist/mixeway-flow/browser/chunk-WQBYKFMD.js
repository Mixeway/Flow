import {
  environment
} from "./chunk-YLFWSDV3.js";
import {
  HttpClient,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZG2BHLTP.js";

// src/app/service/CloudSubscriptionService.ts
var CloudSubscriptionService = class _CloudSubscriptionService {
  constructor(http) {
    this.http = http;
    this.loginUrl = environment.backendUrl;
  }
  getCloudSubscription(id) {
    return this.http.get(this.loginUrl + "/api/v1/cloudsubscription/" + id, { withCredentials: true });
  }
  getCloudSubscriptionsByTeam(teamId) {
    return this.http.get(this.loginUrl + "/api/v1/cloudsubscription/team/" + teamId, { withCredentials: true });
  }
  getFindings(id) {
    return this.http.get(this.loginUrl + "/api/v1/cloudsubscription/" + id + "/findings", { withCredentials: true });
  }
  getFinding(id, finding) {
    return this.http.get(this.loginUrl + "/api/v1/cloudsubscription/" + id + "/finding/" + finding, { withCredentials: true });
  }
  getIssues(id) {
    return this.http.get(this.loginUrl + "/api/v1/cloudsubscription/" + id + "/issues", { withCredentials: true });
  }
  getIssue(id, issue) {
    return this.http.get(this.loginUrl + "/api/v1/cloudsubscription/" + id + "/issue/" + issue, { withCredentials: true });
  }
  getCloudFindingStats(id) {
    return this.http.get(this.loginUrl + "/api/v1/cloudsubscription/" + id + "/finding_stats", { withCredentials: true });
  }
  runScan(id) {
    return this.http.get(this.loginUrl + "/api/v1/cloudsubscription/" + id + "/run", { withCredentials: true });
  }
  changeTeam(id, newTeamId) {
    return this.http.put(`${this.loginUrl}/api/v1/cloudsubscription/${id}/team`, { newTeamId }, { withCredentials: true });
  }
  addComment(id, findingId, message) {
    return this.http.post(`${this.loginUrl}/api/v1/cloudsubscription/${id}/finding/${findingId}/comment`, { message }, { withCredentials: true });
  }
  create(teamId, name) {
    return this.http.post(this.loginUrl + "/api/v1/cloudsubscription/team/" + teamId, { name }, { withCredentials: true });
  }
  delete(subscriptionId, teamId) {
    return this.http.delete(this.loginUrl + "/api/v1/cloudsubscription/" + subscriptionId + "/team/" + teamId, { withCredentials: true });
  }
  static {
    this.\u0275fac = function CloudSubscriptionService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CloudSubscriptionService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CloudSubscriptionService, factory: _CloudSubscriptionService.\u0275fac, providedIn: "root" });
  }
};

export {
  CloudSubscriptionService
};
//# sourceMappingURL=chunk-WQBYKFMD.js.map
