import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, takeWhile} from 'rxjs';
import {catchError, expand, map, reduce} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GiteaService {
    private giteaApiUrl = ''; // Set the base URL dynamically from form

    constructor(private http: HttpClient) {}

    setApiUrl(repoUrl: string) {
        const urlObject = new URL(repoUrl);
        const host = `${urlObject.protocol}//${urlObject.host}`;
        this.giteaApiUrl = `${host}/api/v1/user/repos`;
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
            'Authorization': `token ${token}`
        });

        const url = `${this.giteaApiUrl}?page=${page}&limit=${limit}`;

        return this.http.get<any[]>(url, { headers }).pipe(
            catchError(this.handleError<any[]>('getRepositories', []))
        );
    }

    getRepositoryDetailsFromUrl(repoUrl: string, token: string): Observable<{ id: number; name: string; full_name: string } | null> {
        const repoPath = this.extractRepositoryPath(repoUrl);
        // Gitea API requires encoding each segment separately, not the entire path
        // Split by / and encode each part, then join with /
        const pathParts = repoPath.split('/');
        const encodedPath = pathParts.map(part => encodeURIComponent(part)).join('/');
        const url = `${this.giteaApiUrl.replace('/user/repos', '')}/repos/${encodedPath}`;

        const headers = new HttpHeaders({
            'Authorization': `token ${token}`
        });

        return this.http.get<any>(url, { headers }).pipe(
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

