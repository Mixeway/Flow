// app-config.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private baseUrl = '/api/v1/admin/config';

    constructor(private http: HttpClient) { }

    getRunMode(): Observable<string> {
        return this.http.get<string>(`${this.baseUrl}/runmode`);
    }

    setRunMode(mode: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/runmode`, { mode });
    }

    getAppModeInfo(): Observable<any> {
        return this.http.get<any>('/api/v1/user/app-info');
    }
}