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

    getProjects(token: string, page: number = 1, perPage: number = 100): Observable<any[]> {
        const headers = new HttpHeaders({
            'PRIVATE-TOKEN': token
        });
        const url = `${this.gitLabApiUrl}?page=${page}&per_page=${perPage}`;

        return this.http.get<any[]>(url, { headers }).pipe(
            catchError(this.handleError<any[]>('getProjects', []))
        );
    }

    getAllProjects(token: string): Observable<any[]> {
        const headers = new HttpHeaders({
            'PRIVATE-TOKEN': token
        });

        return this.getProjects(token).pipe(
            expand((response: any[], index: number) => {
                return response.length ? this.getProjects(token, index + 2) : of([]);
            }),
            takeWhile((response: any[]) => response.length > 0),
            reduce((acc: any[], curr: any) => acc.concat(curr), []),
            map((projects) => {
                console.log('All projects fetched:', projects);
                return projects.map((proj: any) => ({
                    id: proj.id,
                    name: proj.name,
                    path_with_namespace: proj.path_with_namespace,
                    web_url: proj.web_url
                }));
            })
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
