import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, expand, map, reduce, takeWhile } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GitHubService {
    public gitHubApiUrl = ''; // Set the base URL dynamically from form

    constructor(private http: HttpClient) {}

    setApiUrl(repoUrl: string) {
        repoUrl = repoUrl.replace("github.com","api.github.com")
        const urlObject = new URL(repoUrl);
        const host = `${urlObject.protocol}//${urlObject.host}`;
        this.gitHubApiUrl = `${host}`;
    }

    // Get repositories from GitHub with pagination
    getRepositories(token: string, page: number = 1, perPage: number = 100): Observable<any[]> {
        const headers = new HttpHeaders({
            'Authorization': `token ${token}`
        });

        const url = `${this.gitHubApiUrl}/user/repos?visibility=all&affiliation=owner,collaborator,organization_member&page=${page}&per_page=${perPage}`;

        return this.http.get<any[]>(url, { headers }).pipe(
            catchError(this.handleError<any[]>('getRepositories', []))
        );
    }

    // Get all repositories with pagination support
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

    // Get repository details by URL
    getRepositoryDetailsFromUrl(repoUrl: string, token: string): Observable<{
        id: number; name: string; full_name: string } | null> {
        const repoPath = this.extractRepositoryPath(repoUrl);
        //const encodedRepoPath = encodeURIComponent(repoPath);
        const url = `${this.gitHubApiUrl}/repos/${repoPath}`;

        const headers = new HttpHeaders({
            'Authorization': `token ${token}`
        });

        return this.http.get<any>(url, { headers }).pipe(
            map(response => ({
                id: response.id,
                name: response.name,
                full_name: response.full_name
            })),
            catchError(this.handleError<{ id: number; name: string; full_name:string } | null>('getRepositoryDetailsFromUrl', null))
        );
    }

    // Extract repository path from the URL
    private extractRepositoryPath(repoUrl: string): string {
        return repoUrl.replace(/https?:\/\/[^\/]+\//, '');
    }

    // Handle any errors that occur during HTTP requests
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
