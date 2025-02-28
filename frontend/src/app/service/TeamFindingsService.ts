import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class TeamFindingsService {
    private loginUrl = environment.backendUrl;

    constructor(private http: HttpClient) {
    }

    getFindingByTeam(id: number, findingId: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/teamfindings/' + id + '/finding/' + findingId, {withCredentials: true});
    }

    getFindingsByTeam(id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/teamfindings/' + id + '/findings' , {withCredentials: true});
    }

    getTeamFindingStats(id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/teamfindings/' + id + '/finding_stats',{ withCredentials: true });
    }
}
