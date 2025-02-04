// cloud-subscription.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CloudSubscriptionService {
    private apiUrl = environment.backendUrl;

    constructor(private http: HttpClient) {}

    getByTeam(teamId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/v1/cloudsubscription/team/${teamId}`, { withCredentials: true });
    }

    create(teamId: number, name: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/api/v1/cloudsubscription/team/${teamId}`, { name }, { withCredentials: true });
    }

    delete(subscriptionId: number, teamId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/api/v1/cloudsubscription/${subscriptionId}/team/${teamId}`, { withCredentials: true });
    }
}