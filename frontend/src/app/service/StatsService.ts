import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    private apiBaseUrl = environment.backendUrl+"/api/v1/stats";

    constructor(private http: HttpClient) { }

    /**
     * Get vulnerability trend data
     * @param teamId Optional team ID to filter data by team
     * @param days Number of days to include in the trend data
     */
    getVulnerabilityTrend(teamId: number | null, days: number): Observable<any[]> {
        let params = new HttpParams();

        if (teamId !== null) {
            params = params.append('teamId', teamId.toString());
        }

        params = params.append('days', days.toString());

        return this.http.get<any[]>(`${this.apiBaseUrl}/trend`, { params });
    }

    /**
     * Get summary statistics
     * @param teamId Optional team ID to filter data by team
     */
    getVulnerabilitySummary(teamId: number | null): Observable<any> {
        let params = new HttpParams();

        if (teamId !== null) {
            params = params.append('teamId', teamId.toString());
        }

        return this.http.get<any>(`${this.apiBaseUrl}/summary`, { params });
    }

    /**
     * Get repositories with the most vulnerabilities
     * @param teamId Optional team ID to filter by team
     * @param limit Maximum number of results to return
     */
    getTopVulnerableRepos(teamId: number | null, limit: number): Observable<any[]> {
        let params = new HttpParams();

        if (teamId !== null) {
            params = params.append('teamId', teamId.toString());
        }

        params = params.append('limit', limit.toString());

        return this.http.get<any[]>(`${this.apiBaseUrl}/top-repos`, { params });
    }

    /**
     * Get vulnerability statistics grouped by team
     */
    getTeamsSummary(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiBaseUrl}/teams-summary`);
    }
}