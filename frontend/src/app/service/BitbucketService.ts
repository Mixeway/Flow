import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, takeWhile} from 'rxjs';
import {catchError, expand, map, reduce} from 'rxjs/operators';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class BitbucketService {
    private bitbucketBaseUrl = '';
    private backendUrl = environment.backendUrl;

    constructor(private http: HttpClient) {}

    setApiUrl(repoUrl: string) {
        const urlObject = new URL(repoUrl);
        this.bitbucketBaseUrl = `${urlObject.protocol}//${urlObject.host}`;
    }

    private readonly pagelen = 100;

    getAllRepositories(token: string): Observable<any[]> {
        return this.getRepositories(token, 1, this.pagelen).pipe(
            expand((response: any[], index: number) => {
                return response.length >= this.pagelen && index < 9
                    ? this.getRepositories(token, index + 2, this.pagelen)
                    : of([]);
            }),
            takeWhile((response: any[], index: number) => response.length > 0 && index < 10),
            reduce((acc: any[], curr: any) => acc.concat(curr), []),
            map((repos) => {
                return repos.map((repo: any) => ({
                    id: this.computeRemoteId(repo.uuid),
                    name: repo.name,
                    path_with_namespace: repo.full_name,
                    web_url: repo.links?.html?.href || ''
                }));
            })
        );
    }

    getRepositories(token: string, page: number = 1, pagelen: number = 100): Observable<any[]> {
        const headers = new HttpHeaders({
            'X-Bitbucket-Token': token
        });

        const apiUrl = this.isCloud()
            ? 'https://api.bitbucket.org'
            : this.bitbucketBaseUrl;

        const url = `${this.backendUrl}/api/v1/bitbucket/proxy/repos?bitbucketUrl=${encodeURIComponent(apiUrl)}&page=${page}&pagelen=${pagelen}`;

        return this.http.get<any[]>(url, { headers, withCredentials: true }).pipe(
            catchError(this.handleError<any[]>('getRepositories', []))
        );
    }

    getRepositoryDetailsFromUrl(repoUrl: string, token: string): Observable<{ id: number; name: string; full_name: string } | null> {
        const repoPath = this.extractRepositoryPath(repoUrl);
        const pathParts = repoPath.split('/');
        if (pathParts.length < 2) {
            return of(null);
        }
        const workspace = pathParts[0];
        const repo = pathParts[1];

        const headers = new HttpHeaders({
            'X-Bitbucket-Token': token
        });

        const apiUrl = this.isCloud()
            ? 'https://api.bitbucket.org'
            : this.bitbucketBaseUrl;

        const url = `${this.backendUrl}/api/v1/bitbucket/proxy/repo?bitbucketUrl=${encodeURIComponent(apiUrl)}&workspace=${encodeURIComponent(workspace)}&repo=${encodeURIComponent(repo)}`;

        return this.http.get<any>(url, { headers, withCredentials: true }).pipe(
            map(response => ({
                id: this.computeRemoteId(response.uuid),
                name: response.name,
                full_name: response.full_name
            })),
            catchError(this.handleError<{ id: number; name: string; full_name: string } | null>('getRepositoryDetailsFromUrl', null))
        );
    }

    private isCloud(): boolean {
        return this.bitbucketBaseUrl.includes('bitbucket.org');
    }

    private extractRepositoryPath(repoUrl: string): string {
        return repoUrl.replace(/https?:\/\/[^\/]+\//, '').replace(/\.git$/, '');
    }

    private computeRemoteId(uuid: string): number {
        if (!uuid) return 0;
        let hash = 0;
        for (let i = 0; i < uuid.length; i++) {
            const char = uuid.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return Math.abs(hash);
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
