import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, takeWhile} from 'rxjs';
import {catchError, expand, map, reduce} from 'rxjs/operators';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class GiteaService {
    private giteaBaseUrl = ''; // Set the base URL dynamically from form
    private backendUrl = environment.backendUrl;

    constructor(private http: HttpClient) {}

    setApiUrl(repoUrl: string) {
        const urlObject = new URL(repoUrl);
        this.giteaBaseUrl = `${urlObject.protocol}//${urlObject.host}`;
    }

    getAllRepositories(token: string): Observable<any[]> {
        return this.getRepositories(token).pipe(
            expand((response: any[], index: number) => {
                return response.length && index < 9 ? this.getRepositories(token, index + 2) : of([]);
            }),
            takeWhile((response: any[], index: number) => response.length > 0 && index < 10),
            reduce((acc: any[], curr: any) => acc.concat(curr), []),
            map((repos) => {
                return repos.map((repo: any) => ({
                    id: repo.id,
                    name: repo.name,
                    path_with_namespace: repo.full_name,
                    web_url: repo.html_url
                }));
            })
        );
    }

    getRepositories(token: string, page: number = 1, limit: number = 50): Observable<any[]> {
        const headers = new HttpHeaders({
            'X-Gitea-Token': token
        });

        // Use backend proxy to avoid CORS issues
        // JWT token for backend auth is automatically sent via withCredentials: true
        const url = `${this.backendUrl}/api/v1/gitea/proxy/repos?giteaUrl=${encodeURIComponent(this.giteaBaseUrl)}&page=${page}&limit=${limit}`;

        return this.http.get<any[]>(url, { headers, withCredentials: true }).pipe(
            catchError(this.handleError<any[]>('getRepositories', []))
        );
    }

    getRepositoryDetailsFromUrl(repoUrl: string, token: string): Observable<{ id: number; name: string; full_name: string } | null> {
        const repoPath = this.extractRepositoryPath(repoUrl);
        // Split by / to get owner and repo
        const pathParts = repoPath.split('/');
        if (pathParts.length < 2) {
            return of(null);
        }
        const owner = pathParts[0];
        const repo = pathParts[1];

        const headers = new HttpHeaders({
            'X-Gitea-Token': token
        });

        // Use backend proxy to avoid CORS issues
        // JWT token for backend auth is automatically sent via withCredentials: true
        const url = `${this.backendUrl}/api/v1/gitea/proxy/repo?giteaUrl=${encodeURIComponent(this.giteaBaseUrl)}&owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`;

        return this.http.get<any>(url, { headers, withCredentials: true }).pipe(
            map(response => ({
                id: response.id,
                name: response.name,
                full_name: response.full_name
            })),
            catchError(this.handleError<{ id: number; name: string; full_name: string } | null>('getRepositoryDetailsFromUrl', null))
        );
    }

    private extractRepositoryPath(repoUrl: string): string {
        return repoUrl.replace(/https?:\/\/[^\/]+\//, '').replace(/\.git$/, '');
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}

