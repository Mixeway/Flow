import {
  environment
} from "./chunk-YLFWSDV3.js";
import {
  HttpClient,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZG2BHLTP.js";

// src/app/service/JiraService.ts
var JiraService = class _JiraService {
  constructor(http) {
    this.http = http;
    this.baseUrl = environment.backendUrl;
  }
  getConfiguration(teamId) {
    return this.http.get(`${this.baseUrl}/api/v1/jira/team/${teamId}/config`, { withCredentials: true });
  }
  createConfiguration(teamId, config) {
    return this.http.post(`${this.baseUrl}/api/v1/jira/team/${teamId}/config`, config, { withCredentials: true });
  }
  updateConfiguration(teamId, config) {
    return this.http.put(`${this.baseUrl}/api/v1/jira/team/${teamId}/config`, config, { withCredentials: true });
  }
  deleteConfiguration(teamId) {
    return this.http.delete(`${this.baseUrl}/api/v1/jira/team/${teamId}/config`, { withCredentials: true });
  }
  fetchProjects(config) {
    return this.http.post(`${this.baseUrl}/api/v1/jira/projects`, config, { withCredentials: true });
  }
  fetchIssueTypes(config) {
    return this.http.post(`${this.baseUrl}/api/v1/jira/issue-types`, config, { withCredentials: true });
  }
  testConnection(teamId) {
    return this.http.post(`${this.baseUrl}/api/v1/jira/team/${teamId}/config/test`, {}, { withCredentials: true });
  }
  createTicket(teamId, findingId) {
    return this.http.post(`${this.baseUrl}/api/v1/jira/team/${teamId}/finding/${findingId}/ticket`, {}, { withCredentials: true });
  }
  createTicketsBulk(teamId, findingIds) {
    return this.http.post(`${this.baseUrl}/api/v1/jira/team/${teamId}/tickets`, { findingIds }, { withCredentials: true });
  }
  static {
    this.\u0275fac = function JiraService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _JiraService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _JiraService, factory: _JiraService.\u0275fac, providedIn: "root" });
  }
};

export {
  JiraService
};
//# sourceMappingURL=chunk-45TX6GGP.js.map
