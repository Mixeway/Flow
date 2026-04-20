import {
  environment
} from "./chunk-YLFWSDV3.js";
import {
  HttpClient,
  HttpParams,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZG2BHLTP.js";

// src/app/service/StatsService.ts
var StatsService = class _StatsService {
  constructor(http) {
    this.http = http;
    this.apiBaseUrl = environment.backendUrl + "/api/v1/stats";
  }
  /**
   * Get vulnerability trend data
   * @param teamId Optional team ID to filter data by team
   * @param days Number of days to include in the trend data
   */
  getVulnerabilityTrend(teamId, days) {
    let params = new HttpParams();
    if (teamId !== null) {
      params = params.append("teamId", teamId.toString());
    }
    params = params.append("days", days.toString());
    return this.http.get(`${this.apiBaseUrl}/trend`, { params });
  }
  /**
   * Get summary statistics
   * @param teamId Optional team ID to filter data by team
   */
  getVulnerabilitySummary(teamId) {
    let params = new HttpParams();
    if (teamId !== null) {
      params = params.append("teamId", teamId.toString());
    }
    return this.http.get(`${this.apiBaseUrl}/summary`, { params });
  }
  /**
   * Get repositories with the most vulnerabilities
   * @param teamId Optional team ID to filter by team
   * @param limit Maximum number of results to return
   */
  getTopVulnerableRepos(teamId, limit) {
    let params = new HttpParams();
    if (teamId !== null) {
      params = params.append("teamId", teamId.toString());
    }
    params = params.append("limit", limit.toString());
    return this.http.get(`${this.apiBaseUrl}/top-repos`, { params });
  }
  /**
   * Get vulnerability statistics grouped by team
   */
  getTeamsSummary() {
    return this.http.get(`${this.apiBaseUrl}/teams-summary`);
  }
  /**
   * Get dashboard metrics including team count, scan counts, etc.
   */
  getDashboardMetrics() {
    return this.http.get(`${this.apiBaseUrl}/dashboard-metrics`, { withCredentials: true });
  }
  getTopReposDetailed(teamId, limit) {
    let params = new HttpParams();
    if (teamId !== null) {
      params = params.append("teamId", teamId.toString());
    }
    params = params.append("limit", limit.toString());
    return this.http.get(`${this.apiBaseUrl}/top-repos-detailed`, { params });
  }
  getTopVulnerabilities(teamId, source, limit) {
    let params = new HttpParams().append("source", source);
    if (teamId !== null) {
      params = params.append("teamId", teamId.toString());
    }
    params = params.append("limit", limit.toString());
    return this.http.get(`${this.apiBaseUrl}/top-vulnerabilities`, { params });
  }
  static {
    this.\u0275fac = function StatsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _StatsService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _StatsService, factory: _StatsService.\u0275fac, providedIn: "root" });
  }
};

export {
  StatsService
};
//# sourceMappingURL=chunk-UPCBRWXR.js.map
