import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

interface CodeRepo {
    id: number;
    target: string;
    repo_url: string;
    team: string;
    sast: string;
    iac: string;
    secrets: string;
    sca: string;
    dast: string;
    gitlab: string;
}

interface CreateRepo {
    name: string;
    repoUrl: string;
    accessToken: string;
    remoteId: number;
    team: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private loginUrl = environment.backendUrl;



    constructor(private http: HttpClient) {}

    getRepos(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/coderepo',{ withCredentials: true });
    }

    createRepo(createRepo: CreateRepo, repoType: string): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/coderepo/create/'+repoType, createRepo,{ withCredentials: true });
    }
    getAggregatedStats(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/widget_stats',{ withCredentials: true });
    }

    connectProvider(repo: any): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/repository-provider/connect',repo,{ withCredentials: true });
    }


    getRepositoryProviders() {
        return this.http.get<any>(this.loginUrl + '/api/v1/repository-provider',{ withCredentials: true });

    }

    changeTeamForRepos(repoIds: any[], newTeamId: number) {
        return this.http.put<any>(this.loginUrl + '/api/v1/coderepo/bulk/change-team', {"repositoryIds":repoIds,"newTeamId":newTeamId},{ withCredentials: true });

    }
}
