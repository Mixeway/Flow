import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class RepoService {
    private loginUrl = environment.backendUrl;

    constructor(private http: HttpClient) {}

    getRepo(id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/coderepo/' + id,{ withCredentials: true });
    }
    getSourceStats(id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/coderepo/' + id + '/source_stats',{ withCredentials: true });
    }
    getFindingStats(id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/coderepo/' + id + '/finding_stats',{ withCredentials: true });
    }
    getFindingsDefBranch(id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/coderepo/' + id + '/findings',{ withCredentials: true });
    }
    getFinding(id: number, finding: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/coderepo/' + id + '/finding/' + finding,{ withCredentials: true });
    }
    supressFinding(id: number, finding: number, reason: string): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/coderepo/' + id + '/supress/' + finding
            + '/reason/' + reason,{ withCredentials: true });
    }
    reActivateFinding(id: number, finding: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/coderepo/' + id + '/reactivate/' + finding
            ,{ withCredentials: true });
    }
    getFindingsBranch(id: number, branch: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/coderepo/' + id + '/findings/branch/' + branch,{ withCredentials: true });
    }
}
