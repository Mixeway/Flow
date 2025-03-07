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

    getTeamFindingSourceStats(id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/teamfindings/' + id + '/source_stats',{ withCredentials: true });
    }

    suppressMultipleTeamFindings(number: number, selectedFindings: number[]) {
        return this.http.post<any>(this.loginUrl + '/api/v1/teamfindings/' + number+ '/supress', selectedFindings,{ withCredentials: true });

    }
    supressFinding(id: number, finding: number, reason: string): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/teamfindings/' + id + '/supress/' + finding
            + '/reason/' + reason,{ withCredentials: true });
    }
    reActivateFinding(id: number, finding: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/teamfindings/' + id + '/reactivate/' + finding
            ,{ withCredentials: true });
    }
}
