import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, takeWhile} from 'rxjs';
import {catchError, expand, map, reduce} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GitLabService {
    private gitLabApiUrl = ''; // Set the base URL dynamically from form

    constructor(private http: HttpClient) {}

    setApiUrl(repoUrl: string) {
        const urlObject = new URL(repoUrl);
        const host = `${urlObject.protocol}//${urlObject.host}`;
        this.gitLabApiUrl = `${host}/api/v4/projects`;
    }

    getAllProjects(token: string): Observable<any[]> {
        return this.getProjects(token).pipe(
            expand((response: any[], index: number) => {
                return response.length && index < 9 ? this.getProjects(token, index + 2) : of([]);
            }),
            takeWhile((response: any[], index: number) => response.length > 0 && index < 10),
            reduce((acc: any[], curr: any) => acc.concat(curr), []),
            map((projects) => {
                return projects.map((proj: any) => ({
                    id: proj.id,
                    name: proj.name,
                    path_with_namespace: proj.path_with_namespace,
                    web_url: proj.web_url
                }));
            })
        );
    }

    getProjects(token: string, page: number = 1, perPage: number = 100): Observable<any[]> {
        const headers = new HttpHeaders({
            'PRIVATE-TOKEN': token
        });

        const url = `${this.gitLabApiUrl}?membership=true&page=${page}&per_page=${perPage}`;

        return this.http.get<any[]>(url, { headers }).pipe(
            catchError(this.handleError<any[]>('getProjects', []))
        );
    }


    getProjectDetailsFromUrl(repoUrl: string, token: string): Observable<{ id: number; name: string } | null> {
        const projectPath = this.extractProjectPath(repoUrl);
        const encodedProjectPath = encodeURIComponent(projectPath);
        const url = `${this.gitLabApiUrl}/${encodedProjectPath}`;

        const headers = new HttpHeaders({
            'PRIVATE-TOKEN': token
        });

        return this.http.get<any>(url, { headers }).pipe(
            map(response => ({
                id: response.id,
                name: response.name
            })),
            catchError(this.handleError<{ id: number; name: string } | null>('getProjectDetailsFromUrl', null))
        );
    }
    private extractProjectPath(repoUrl: string): string {
        return repoUrl.replace(/https?:\/\/[^\/]+\//, '').replace(/\.git$/, '');
    }


    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
