import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface JiraConfigRequest {
    jiraUrl: string;
    jiraToken: string;
    jiraProjectKey: string;
    jiraIssueType: string;
    jiraUsername: string;
    autoCreateEnabled: boolean;
    autoSeverityThreshold: string;
}

export interface JiraConfigResponse {
    id: number;
    teamId: number;
    jiraUrl: string;
    jiraProjectKey: string;
    jiraIssueType: string;
    jiraUsername: string;
    autoCreateEnabled: boolean;
    autoSeverityThreshold: string;
    configured: boolean;
}

export interface CreateTicketsResponse {
    ticketsCreated: number;
    findingsProcessed: number;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class JiraService {
    private baseUrl = environment.backendUrl;

    constructor(private http: HttpClient) {}

    getConfiguration(teamId: number): Observable<JiraConfigResponse> {
        return this.http.get<JiraConfigResponse>(
            `${this.baseUrl}/api/v1/jira/team/${teamId}/config`,
            { withCredentials: true }
        );
    }

    createConfiguration(teamId: number, config: JiraConfigRequest): Observable<JiraConfigResponse> {
        return this.http.post<JiraConfigResponse>(
            `${this.baseUrl}/api/v1/jira/team/${teamId}/config`,
            config,
            { withCredentials: true }
        );
    }

    updateConfiguration(teamId: number, config: JiraConfigRequest): Observable<JiraConfigResponse> {
        return this.http.put<JiraConfigResponse>(
            `${this.baseUrl}/api/v1/jira/team/${teamId}/config`,
            config,
            { withCredentials: true }
        );
    }

    deleteConfiguration(teamId: number): Observable<any> {
        return this.http.delete(
            `${this.baseUrl}/api/v1/jira/team/${teamId}/config`,
            { withCredentials: true }
        );
    }

    fetchProjects(config: Partial<JiraConfigRequest>): Observable<{key: string, name: string}[]> {
        return this.http.post<{key: string, name: string}[]>(
            `${this.baseUrl}/api/v1/jira/projects`,
            config,
            { withCredentials: true }
        );
    }

    fetchIssueTypes(config: Partial<JiraConfigRequest>): Observable<string[]> {
        return this.http.post<string[]>(
            `${this.baseUrl}/api/v1/jira/issue-types`,
            config,
            { withCredentials: true }
        );
    }

    testConnection(teamId: number): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/api/v1/jira/team/${teamId}/config/test`,
            {},
            { withCredentials: true }
        );
    }

    createTicket(teamId: number, findingId: number): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/api/v1/jira/team/${teamId}/finding/${findingId}/ticket`,
            {},
            { withCredentials: true }
        );
    }

    createTicketsBulk(teamId: number, findingIds: number[]): Observable<CreateTicketsResponse> {
        return this.http.post<CreateTicketsResponse>(
            `${this.baseUrl}/api/v1/jira/team/${teamId}/tickets`,
            { findingIds },
            { withCredentials: true }
        );
    }
}
