import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CloudSubscriptionService {
    private loginUrl = environment.backendUrl;

    constructor(private http: HttpClient) {}

    getCloudSubscription(id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/cloudsubscription/' + id, { withCredentials: true });
    }

    getCloudSubscriptionsByTeam(teamId: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/cloudsubscription/team/' + teamId, { withCredentials: true });
    }

    getFindings(id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/cloudsubscription/' + id + '/findings', { withCredentials: true });
    }

    getFinding(id: number, finding: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/cloudsubscription/' + id + '/finding/' + finding,{ withCredentials: true });
    }

    getCloudFindingStats(id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/cloudsubscription/' + id + '/finding_stats',{ withCredentials: true });
    }

    runScan(id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/cloudsubscription/' + id + '/run',{ withCredentials: true });
    }

    changeTeam(id: number, newTeamId: number): Observable<any> {
        return this.http.put<any>(
            `${this.loginUrl}/api/v1/cloudsubscription/${id}/team`,
            { newTeamId },
            { withCredentials: true }
        );
    }

    addComment(id: number, findingId: number, message: string): Observable<any> {
        return this.http.post(`${this.loginUrl}/api/v1/cloudsubscription/${id}/finding/${findingId}/comment`,
            { message: message },
            { withCredentials: true }
        );
    }

    create(teamId: number, name: string): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/cloudsubscription/team/' + teamId, { name }, { withCredentials: true });
    }

    delete(subscriptionId: number, teamId: number): Observable<any> {
        return this.http.delete<any>(this.loginUrl + '/api/v1/cloudsubscription/' + subscriptionId + '/team/' + teamId, { withCredentials: true });
    }
}
